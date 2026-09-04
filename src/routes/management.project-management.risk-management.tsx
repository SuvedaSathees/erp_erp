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
  ShieldAlert,
  ShieldCheck,
  Shield,
  Clock,
  TrendingUp,
  AlertCircle,
  Edit2,
  MoreVertical,
  Maximize2,
  Minus,
  X,
  FileSpreadsheet,
  Share2,
  FileText,
  DollarSign,
  Briefcase,
  Check,
  ArrowRight,
  Printer,
  ExternalLink,
  History,
  Trash2,
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

export interface RiskItem {
  id: string;
  title: string;
  category:
    | "Procurement"
    | "Technical"
    | "Cost"
    | "Resource"
    | "Quality"
    | "Logistics"
    | "Customer"
    | "Regulatory"
    | "Safety";
  p: number; // Probability 1-5
  i: number; // Impact 1-5
  score: number;
  rating: "Critical" | "High" | "Medium" | "Low";
  owner: string;
  strategy: "Mitigate" | "Transfer" | "Accept" | "Avoid" | "Escalate";
  targetDate: string;
  status: "Open" | "Monitoring" | "Escalated" | "Closed";
  residualScore: number;
  costImpact: string;
  scheduleImpact: string;
  mitigationPlan: string;
  progress: number;
}

export const INITIAL_RISKS: RiskItem[] = [
  {
    id: "R-001",
    title: "Critical controller supplier delay",
    category: "Procurement",
    p: 4,
    i: 5,
    score: 20,
    rating: "Critical",
    owner: "Procurement Manager",
    strategy: "Mitigate",
    targetDate: "10 Sep 2026",
    status: "Open",
    residualScore: 8,
    costImpact: "₹ 4.50 L",
    scheduleImpact: "12 Days",
    mitigationPlan: "Qualify alternate supplier and place partial backup order. Monitor supplier production capacity weekly.",
    progress: 60,
  },
  {
    id: "R-002",
    title: "Design rework due to requirement change",
    category: "Technical",
    p: 4,
    i: 4,
    score: 16,
    rating: "High",
    owner: "Engineering Lead",
    strategy: "Mitigate",
    targetDate: "12 Sep 2026",
    status: "Monitoring",
    residualScore: 6,
    costImpact: "₹ 2.80 L",
    scheduleImpact: "5 Days",
    mitigationPlan: "Freeze scope definitions with client engineering team and implement baseline design sign-off.",
    progress: 40,
  },
  {
    id: "R-003",
    title: "Raw material price increase",
    category: "Cost",
    p: 3,
    i: 4,
    score: 12,
    rating: "High",
    owner: "Purchase Manager",
    strategy: "Transfer",
    targetDate: "20 Sep 2026",
    status: "Open",
    residualScore: 6,
    costImpact: "₹ 3.20 L",
    scheduleImpact: "0 Days",
    mitigationPlan: "Lock in fixed quarterly price contracts with tier-1 raw material fabricators.",
    progress: 50,
  },
  {
    id: "R-004",
    title: "Skilled labour shortage",
    category: "Resource",
    p: 3,
    i: 4,
    score: 12,
    rating: "High",
    owner: "HR Manager",
    strategy: "Mitigate",
    targetDate: "15 Sep 2026",
    status: "Open",
    residualScore: 6,
    costImpact: "₹ 1.40 L",
    scheduleImpact: "7 Days",
    mitigationPlan: "Partner with regional industrial training institutes and onboard pre-screened contract technicians.",
    progress: 30,
  },
  {
    id: "R-005",
    title: "Charger testing failure",
    category: "Quality",
    p: 2,
    i: 5,
    score: 10,
    rating: "High",
    owner: "QA Manager",
    strategy: "Mitigate",
    targetDate: "18 Sep 2026",
    status: "Monitoring",
    residualScore: 4,
    costImpact: "₹ 2.00 L",
    scheduleImpact: "8 Days",
    mitigationPlan: "Perform multi-stage unit bench testing before integrated FAT test runs.",
    progress: 75,
  },
  {
    id: "R-006",
    title: "Transportation / logistics disruption",
    category: "Logistics",
    p: 3,
    i: 3,
    score: 9,
    rating: "Medium",
    owner: "Logistics Manager",
    strategy: "Mitigate",
    targetDate: "25 Sep 2026",
    status: "Open",
    residualScore: 3,
    costImpact: "₹ 0.90 L",
    scheduleImpact: "4 Days",
    mitigationPlan: "Contract multi-modal freight providers with route tracking and redundancy.",
    progress: 45,
  },
  {
    id: "R-007",
    title: "Customer approval delay",
    category: "Customer",
    p: 2,
    i: 4,
    score: 8,
    rating: "Medium",
    owner: "Project Manager",
    strategy: "Mitigate",
    targetDate: "22 Sep 2026",
    status: "Monitoring",
    residualScore: 4,
    costImpact: "₹ 1.10 L",
    scheduleImpact: "6 Days",
    mitigationPlan: "Establish weekly review checkpoints and shared customer collaboration workspace.",
    progress: 80,
  },
  {
    id: "R-008",
    title: "Regulatory approval delay",
    category: "Regulatory",
    p: 2,
    i: 3,
    score: 6,
    rating: "Medium",
    owner: "Compliance Officer",
    strategy: "Mitigate",
    targetDate: "25 Sep 2026",
    status: "Open",
    residualScore: 3,
    costImpact: "₹ 0.60 L",
    scheduleImpact: "3 Days",
    mitigationPlan: "Submit pre-compliance documentation 30 days ahead of statutory deadlines.",
    progress: 50,
  },
  {
    id: "R-009",
    title: "Subcontractor site safety violation",
    category: "Safety",
    p: 1,
    i: 5,
    score: 5,
    rating: "Medium",
    owner: "EHS Officer",
    strategy: "Avoid",
    targetDate: "28 Sep 2026",
    status: "Monitoring",
    residualScore: 2,
    costImpact: "₹ 1.80 L",
    scheduleImpact: "5 Days",
    mitigationPlan: "Enforce zero-tolerance safety protocol with pre-work permit compliance gates.",
    progress: 65,
  },
  {
    id: "R-010",
    title: "High voltage grid interconnect delay",
    category: "Technical",
    p: 4,
    i: 5,
    score: 20,
    rating: "Critical",
    owner: "Site Engineering Lead",
    strategy: "Escalate",
    targetDate: "30 Sep 2026",
    status: "Escalated",
    residualScore: 10,
    costImpact: "₹ 5.20 L",
    scheduleImpact: "15 Days",
    mitigationPlan: "Escalate to state electricity regulatory utility board and expedite transformer testing.",
    progress: 25,
  },
  {
    id: "R-011",
    title: "Firmware CAN bus packet loss under peak load",
    category: "Technical",
    p: 3,
    i: 4,
    score: 12,
    rating: "High",
    owner: "Firmware Architect",
    strategy: "Mitigate",
    targetDate: "14 Sep 2026",
    status: "Open",
    residualScore: 4,
    costImpact: "₹ 1.75 L",
    scheduleImpact: "4 Days",
    mitigationPlan: "Implement hardware DMA buffering and rate-limiting queue logic on controller board.",
    progress: 55,
  },
  {
    id: "R-012",
    title: "Currency exchange rate fluctuation for imported SiC",
    category: "Cost",
    p: 4,
    i: 3,
    score: 12,
    rating: "High",
    owner: "Finance Controller",
    strategy: "Transfer",
    targetDate: "22 Sep 2026",
    status: "Monitoring",
    residualScore: 6,
    costImpact: "₹ 2.10 L",
    scheduleImpact: "0 Days",
    mitigationPlan: "Execute forex forward hedge contracts with Treasury banking partners.",
    progress: 40,
  },
  {
    id: "R-013",
    title: "Severe monsoon causing civil foundation delay",
    category: "Logistics",
    p: 3,
    i: 3,
    score: 9,
    rating: "Medium",
    owner: "Civil Site Engineer",
    strategy: "Accept",
    targetDate: "19 Sep 2026",
    status: "Monitoring",
    residualScore: 4,
    costImpact: "₹ 1.30 L",
    scheduleImpact: "8 Days",
    mitigationPlan: "Deploy rapid-setting quick-dry concrete admixtures and industrial rain canopies.",
    progress: 20,
  },
  {
    id: "R-014",
    title: "Liquid cooling radiator leakage during pressure test",
    category: "Quality",
    p: 2,
    i: 4,
    score: 8,
    rating: "Medium",
    owner: "Quality Inspector",
    strategy: "Mitigate",
    targetDate: "17 Sep 2026",
    status: "Monitoring",
    residualScore: 3,
    costImpact: "₹ 1.15 L",
    scheduleImpact: "4 Days",
    mitigationPlan: "Mandate Helium leak testing at supplier facility prior to shipment dispatch.",
    progress: 70,
  },
  {
    id: "R-015",
    title: "Key embedded systems architect attrition",
    category: "Resource",
    p: 2,
    i: 4,
    score: 8,
    rating: "Medium",
    owner: "Engineering Director",
    strategy: "Mitigate",
    targetDate: "24 Sep 2026",
    status: "Open",
    residualScore: 4,
    costImpact: "₹ 1.50 L",
    scheduleImpact: "10 Days",
    mitigationPlan: "Enforce peer code shadowing and comprehensive firmware architecture documentation.",
    progress: 35,
  },
  {
    id: "R-016",
    title: "Local municipal transformer upgrade permits",
    category: "Regulatory",
    p: 3,
    i: 2,
    score: 6,
    rating: "Medium",
    owner: "Liaison Officer",
    strategy: "Mitigate",
    targetDate: "27 Sep 2026",
    status: "Open",
    residualScore: 2,
    costImpact: "₹ 0.50 L",
    scheduleImpact: "6 Days",
    mitigationPlan: "Engage municipal fast-track single-window agency for EV infrastructure clearance.",
    progress: 60,
  },
  {
    id: "R-017",
    title: "Cloud OCPP endpoint latency spikes",
    category: "Technical",
    p: 2,
    i: 3,
    score: 6,
    rating: "Medium",
    owner: "Cloud Platform Lead",
    strategy: "Mitigate",
    targetDate: "16 Sep 2026",
    status: "Closed",
    residualScore: 1,
    costImpact: "₹ 0.40 L",
    scheduleImpact: "2 Days",
    mitigationPlan: "Deployed geo-distributed edge caching brokers on AWS Mumbai region.",
    progress: 100,
  },
  {
    id: "R-018",
    title: "Enclosure paint thickness below marine grade spec",
    category: "Quality",
    p: 2,
    i: 2,
    score: 4,
    rating: "Low",
    owner: "Production QC",
    strategy: "Mitigate",
    targetDate: "21 Sep 2026",
    status: "Monitoring",
    residualScore: 2,
    costImpact: "₹ 0.30 L",
    scheduleImpact: "2 Days",
    mitigationPlan: "Calibrated electro-static powder coating spray gun pressure and curing oven timer.",
    progress: 90,
  },
  {
    id: "R-019",
    title: "Minor tool calibration expiry on assembly line",
    category: "Safety",
    p: 1,
    i: 3,
    score: 3,
    rating: "Low",
    owner: "Plant Maintenance",
    strategy: "Accept",
    targetDate: "13 Sep 2026",
    status: "Closed",
    residualScore: 1,
    costImpact: "₹ 0.20 L",
    scheduleImpact: "1 Days",
    mitigationPlan: "Recalibrated torque wrenches and digital multimeters with NABL test certificates.",
    progress: 100,
  },
  {
    id: "R-020",
    title: "Minor packaging carton moisture damage",
    category: "Logistics",
    p: 2,
    i: 1,
    score: 2,
    rating: "Low",
    owner: "Warehouse Supervisor",
    strategy: "Accept",
    targetDate: "11 Sep 2026",
    status: "Closed",
    residualScore: 1,
    costImpact: "₹ 0.15 L",
    scheduleImpact: "0 Days",
    mitigationPlan: "Replaced with double-corrugated plastic pallet wraps and silica gel packets.",
    progress: 100,
  },
];

export const Route = createFileRoute("/management/project-management/risk-management")({
  head: () => ({
    meta: [
      { title: "Risk Management Form · Project Management · Magnertia ERP" },
      {
        name: "description",
        content: "Identify, assess, monitor, and control project risks to minimize impact on cost, schedule and quality.",
      },
    ],
  }),
  component: RiskManagementFormPage,
});

export function RiskManagementFormPage() {
  const [risks, setRisks] = useState<RiskItem[]>(INITIAL_RISKS);
  const [selectedRisk, setSelectedRisk] = useState<RiskItem>(INITIAL_RISKS[0]);
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
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterOwner, setFilterOwner] = useState("All");
  const [filterRating, setFilterRating] = useState("All");
  const [filterStrategy, setFilterStrategy] = useState("All");

  // Modals
  const [isCreateRiskOpen, setIsCreateRiskOpen] = useState(false);
  const [isEditRiskOpen, setIsEditRiskOpen] = useState(false);
  const [isMitigationOpen, setIsMitigationOpen] = useState(false);
  const [isConvertToIssueOpen, setIsConvertToIssueOpen] = useState(false);
  const [isAiRiskOpen, setIsAiRiskOpen] = useState(false);
  const [isHeatmapModalOpen, setIsHeatmapModalOpen] = useState(false);
  const [isEscalationLogOpen, setIsEscalationLogOpen] = useState(false);
  const [isEmvOpen, setIsEmvOpen] = useState(false);

  // New Risk Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<RiskItem["category"]>("Procurement");
  const [newP, setNewP] = useState(4);
  const [newI, setNewI] = useState(5);
  const [newOwner, setNewOwner] = useState("Procurement Manager");
  const [newStrategy, setNewStrategy] = useState<RiskItem["strategy"]>("Mitigate");
  const [newTargetDate, setNewTargetDate] = useState("10 Sep 2026");
  const [newMitigation, setNewMitigation] = useState("");

  const handleClearFilters = () => {
    setFilterWbs("All WBS");
    setFilterCategory("All Categories");
    setFilterStatus("All");
    setFilterOwner("All");
    setFilterRating("All");
    setFilterStrategy("All");
    setSearchQuery("");
    setActiveKpiFilter(null);
    setCurrentPage(1);
    toast.info("Risk filters reset to default.");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRisks(INITIAL_RISKS);
      setSelectedRisk(INITIAL_RISKS[0]);
      handleClearFilters();
      toast.success("Risk register, probabilities, and impact scores refreshed from ERP.");
    }, 450);
  };

  const handleCreateRiskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = Number(newP) * Number(newI);
    const rating: RiskItem["rating"] =
      score >= 17 ? "Critical" : score >= 10 ? "High" : score >= 5 ? "Medium" : "Low";

    const newItem: RiskItem = {
      id: `R-0${risks.length + 1}`,
      title: newTitle || "New Project Risk",
      category: newCategory,
      p: Number(newP),
      i: Number(newI),
      score,
      rating,
      owner: newOwner,
      strategy: newStrategy,
      targetDate: newTargetDate,
      status: "Open",
      residualScore: Math.round(score * 0.4),
      costImpact: "₹ 2.50 L",
      scheduleImpact: "5 Days",
      mitigationPlan: newMitigation || "Establish preventive controls and continuous monitoring.",
      progress: 0,
    };

    setRisks((prev) => [newItem, ...prev]);
    setSelectedRisk(newItem);
    setIsCreateRiskOpen(false);
    toast.success(`Risk ${newItem.id} created (${rating} - Score ${score})`);
  };

  const handleSaveEditRisk = (e: React.FormEvent) => {
    e.preventDefault();
    setRisks((prev) =>
      prev.map((r) => (r.id === selectedRisk.id ? selectedRisk : r)),
    );
    setIsEditRiskOpen(false);
    toast.success(`Risk ${selectedRisk.id} updated successfully.`);
  };

  const handleDeleteRisk = (id: string) => {
    setRisks((prev) => prev.filter((r) => r.id !== id));
    if (selectedRisk.id === id) {
      setSelectedRisk(risks[1] || risks[0]);
    }
    toast.success(`Removed risk ${id} from register.`);
  };

  const handleConvertIssue = () => {
    setIsConvertToIssueOpen(false);
    toast.error(`Risk ${selectedRisk.id} materialized into active issue ISS-2026-042!`, {
      description: "Triggered emergency mitigation plan and notified project stakeholders.",
    });
  };

  const handleExportCsv = () => {
    const header = "Risk ID,Title,Category,Probability,Impact,Score,Rating,Owner,Strategy,Target Date,Status,Residual Score,Cost Impact,Schedule Impact\n";
    const rows = risks
      .map(
        (r) =>
          `"${r.id}","${r.title}","${r.category}",${r.p},${r.i},${r.score},"${r.rating}","${r.owner}","${r.strategy}","${r.targetDate}","${r.status}",${r.residualScore},"${r.costImpact}","${r.scheduleImpact}"`,
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PRJ-2026-0195_Risk_Register.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Risk register exported to CSV.");
  };

  const handleExportDossier = () => {
    const text = `=====================================================
PROJECT RISK MANAGEMENT DOSSIER
Project: Smart EV Charging Infrastructure (PRJ-2026-0195)
Generated: ${new Date().toLocaleString()}
=====================================================

RISK PROFILE SUMMARY:
• Total Logged Risks:   ${risks.length}
• Critical Risks:       ${risks.filter((r) => r.rating === "Critical").length}
• High Risks:           ${risks.filter((r) => r.rating === "High").length}
• Medium Risks:         ${risks.filter((r) => r.rating === "Medium").length}
• Low Risks:            ${risks.filter((r) => r.rating === "Low").length}
• Open / In-Flight:     ${risks.filter((r) => r.status === "Open" || r.status === "Monitoring").length}
• Total EMV Exposure:   ₹ 10.20 Lakhs

ACTIVE RISK REGISTER:
-----------------------------------------------------
${risks
  .map(
    (r) =>
      `[${r.id}] ${r.title}
  Category: ${r.category} | Rating: ${r.rating} (Score: ${r.score}/25 | P:${r.p}, I:${r.i})
  Owner: ${r.owner} | Strategy: ${r.strategy} | Status: ${r.status}
  Cost Impact: ${r.costImpact} | Schedule Impact: ${r.scheduleImpact} | Target: ${r.targetDate}
  Mitigation: ${r.mitigationPlan} (Progress: ${r.progress}%)
  Residual Score: ${r.residualScore}/25`,
  )
  .join("\n\n")}
=====================================================`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PRJ-2026-0195_Risk_Dossier.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Risk dossier (.TXT) downloaded.");
  };

  // Filtered Risks
  const filteredRisks = useMemo(() => {
    return risks.filter((r) => {
      const matchesSearch =
        !searchQuery ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.owner.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filterCategory === "All Categories" || r.category === filterCategory;
      const matchesStatus =
        filterStatus === "All"
          ? true
          : filterStatus === "Open, Monitoring"
          ? r.status === "Open" || r.status === "Monitoring"
          : r.status === filterStatus;
      const matchesOwner = filterOwner === "All" || r.owner === filterOwner;
      const matchesRating = filterRating === "All" || r.rating === filterRating;
      const matchesStrategy = filterStrategy === "All" || r.strategy === filterStrategy;

      const matchesKpi =
        !activeKpiFilter
          ? true
          : activeKpiFilter === "critical"
          ? r.rating === "Critical"
          : activeKpiFilter === "high"
          ? r.rating === "High"
          : activeKpiFilter === "medium"
          ? r.rating === "Medium"
          : activeKpiFilter === "low"
          ? r.rating === "Low"
          : activeKpiFilter === "open"
          ? r.status === "Open" || r.status === "Monitoring"
          : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesOwner &&
        matchesRating &&
        matchesStrategy &&
        matchesKpi
      );
    });
  }, [
    risks,
    searchQuery,
    filterCategory,
    filterStatus,
    filterOwner,
    filterRating,
    filterStrategy,
    activeKpiFilter,
  ]);

  // Paginated Risks
  const totalPages = Math.ceil(filteredRisks.length / itemsPerPage) || 1;
  const paginatedRisks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRisks.slice(start, start + itemsPerPage);
  }, [filteredRisks, currentPage, itemsPerPage]);

  return (
    <AppShell
      title="Risk Management Form"
      breadcrumb="Management > Project Management > Risk Management"
      description="Identify, assess, monitor, and control project risks to minimize impact on cost, schedule and quality."
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
                  Risk Management Form
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
                  onClick={() => setIsCreateRiskOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0B3B7B] hover:bg-[#082B5B] text-white transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Risk
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
                    toast.success("Risk register emailed to stakeholders.");
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
                      <FileText className="mr-2 h-4 w-4 text-blue-600" /> Export Risk Dossier (.TXT)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsHeatmapModalOpen(true)} className="cursor-pointer">
                      <Layers className="mr-2 h-4 w-4 text-emerald-600" /> 5x5 Heatmap Matrix
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Risk register saved successfully!");
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
            {/* Row 1: Project, Project Code, WBS, Risk Category, Status */}
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
                  Risk Category
                </span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All Categories</option>
                  <option>Procurement</option>
                  <option>Technical</option>
                  <option>Cost</option>
                  <option>Resource</option>
                  <option>Quality</option>
                  <option>Logistics</option>
                  <option>Customer</option>
                  <option>Regulatory</option>
                  <option>Safety</option>
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
                  <option>Open, Monitoring</option>
                  <option>Open</option>
                  <option>Monitoring</option>
                  <option>Escalated</option>
                  <option>Closed</option>
                </select>
              </div>
            </div>

            {/* Row 2: Risk Owner, Risk Rating, Response Strategy, Identification Date, Clear Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs pt-1">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Risk Owner
                </span>
                <select
                  value={filterOwner}
                  onChange={(e) => setFilterOwner(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All</option>
                  <option>Procurement Manager</option>
                  <option>Engineering Lead</option>
                  <option>Purchase Manager</option>
                  <option>HR Manager</option>
                  <option>QA Manager</option>
                  <option>Logistics Manager</option>
                  <option>Project Manager</option>
                  <option>Compliance Officer</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Risk Rating
                </span>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
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
                  Response Strategy
                </span>
                <select
                  value={filterStrategy}
                  onChange={(e) => setFilterStrategy(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All</option>
                  <option>Mitigate</option>
                  <option>Transfer</option>
                  <option>Accept</option>
                  <option>Avoid</option>
                  <option>Escalate</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Identification Date
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
            {/* 1. Total Risks */}
            <div
              onClick={() => {
                setActiveKpiFilter(null);
                handleClearFilters();
                toast.info("Showing all risks");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-primary/60 hover:shadow-xs",
                activeKpiFilter === null && "ring-2 ring-primary/60",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Total Risks
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  64
                </span>
                <span className="text-[10px] text-primary font-semibold block mt-1">
                  View All Risks →
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            {/* 2. Critical Risks */}
            <div
              onClick={() => {
                setActiveKpiFilter("critical");
                toast.info("Filtered for Critical risks (Score 17-25)");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-rose-500/60 hover:shadow-xs",
                activeKpiFilter === "critical" && "ring-2 ring-rose-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Critical Risks
                </span>
                <span className="text-xl font-bold font-mono text-rose-600 mt-0.5 block">
                  5
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block mt-1">
                  7.8% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>

            {/* 3. High Risks */}
            <div
              onClick={() => {
                setActiveKpiFilter("high");
                toast.info("Filtered for High risks (Score 10-16)");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-amber-500/60 hover:shadow-xs",
                activeKpiFilter === "high" && "ring-2 ring-amber-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  High Risks
                </span>
                <span className="text-xl font-bold font-mono text-amber-600 mt-0.5 block">
                  14
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block mt-1">
                  21.9% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>

            {/* 4. Medium Risks */}
            <div
              onClick={() => {
                setActiveKpiFilter("medium");
                toast.info("Filtered for Medium risks (Score 5-9)");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-yellow-500/60 hover:shadow-xs",
                activeKpiFilter === "medium" && "ring-2 ring-yellow-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Medium Risks
                </span>
                <span className="text-xl font-bold font-mono text-yellow-600 mt-0.5 block">
                  24
                </span>
                <span className="text-[10px] text-yellow-600 dark:text-yellow-400 font-semibold block mt-1">
                  37.5% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>

            {/* 5. Low Risks */}
            <div
              onClick={() => {
                setActiveKpiFilter("low");
                toast.info("Filtered for Low risks (Score 1-4)");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-emerald-500/60 hover:shadow-xs",
                activeKpiFilter === "low" && "ring-2 ring-emerald-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Low Risks
                </span>
                <span className="text-xl font-bold font-mono text-emerald-600 mt-0.5 block">
                  21
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  32.8% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5" />
              </div>
            </div>

            {/* 6. Open Risks */}
            <div
              onClick={() => {
                setActiveKpiFilter("open");
                toast.info("Filtered for Open & Monitoring risks");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-purple-500/60 hover:shadow-xs",
                activeKpiFilter === "open" && "ring-2 ring-purple-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Open Risks
                </span>
                <span className="text-xl font-bold font-mono text-purple-600 mt-0.5 block">
                  31
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block mt-1">
                  48.4% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* ====================================================================
             4. RISK ANALYTICS ROW (3 Balanced Cards: 4 cols + 4 cols + 4 cols)
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Card 1 (4 cols): Risk Heatmap (Probability vs Impact) */}
            <Card className="lg:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Risk Heatmap (Probability vs Impact)
                </CardTitle>
                <button
                  onClick={() => setIsHeatmapModalOpen(true)}
                  className="text-[10px] text-primary font-semibold hover:underline cursor-pointer"
                >
                  Full Matrix →
                </button>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                <div className="flex">
                  {/* Y-axis label */}
                  <div className="w-6 flex items-center justify-center">
                    <span className="-rotate-90 text-[8.5px] uppercase font-bold text-muted-foreground tracking-widest">
                      Probability
                    </span>
                  </div>

                  {/* Matrix */}
                  <div className="flex-1 space-y-1">
                    {[
                      { p: 5, label: "Almost Certain", cells: [{ val: 0, c: "bg-amber-300" }, { val: 0, c: "bg-amber-300" }, { val: 1, c: "bg-orange-400 text-white" }, { val: 2, c: "bg-rose-500 text-white" }, { val: 2, c: "bg-rose-600 text-white" }] },
                      { p: 4, label: "Likely", cells: [{ val: 1, c: "bg-emerald-500 text-white" }, { val: 1, c: "bg-emerald-500 text-white" }, { val: 2, c: "bg-orange-400 text-white" }, { val: 4, c: "bg-orange-400 text-white" }, { val: 3, c: "bg-rose-600 text-white" }] },
                      { p: 3, label: "Possible", cells: [{ val: 2, c: "bg-emerald-500 text-white" }, { val: 2, c: "bg-emerald-500 text-white" }, { val: 5, c: "bg-amber-300" }, { val: 4, c: "bg-orange-400 text-white" }, { val: 3, c: "bg-orange-400 text-white" }] },
                      { p: 2, label: "Unlikely", cells: [{ val: 2, c: "bg-emerald-500 text-white" }, { val: 3, c: "bg-emerald-500 text-white" }, { val: 3, c: "bg-amber-300" }, { val: 2, c: "bg-amber-300" }, { val: 1, c: "bg-orange-400 text-white" }] },
                      { p: 1, label: "Rare", cells: [{ val: 3, c: "bg-emerald-500 text-white" }, { val: 2, c: "bg-emerald-500 text-white" }, { val: 1, c: "bg-emerald-500 text-white" }, { val: 1, c: "bg-emerald-500 text-white" }, { val: 0, c: "bg-emerald-500 text-white" }] },
                    ].map((row) => (
                      <div key={row.p} className="flex items-center gap-1">
                        <span className="w-12 text-[9px] text-muted-foreground text-right font-mono font-medium truncate pr-1">
                          {row.p} <span className="text-[7.5px]">{row.label.slice(0, 3)}</span>
                        </span>
                        <div className="grid grid-cols-5 gap-1 flex-1">
                          {row.cells.map((cell, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "h-6 rounded flex items-center justify-center font-mono font-bold text-[10px] cursor-pointer hover:opacity-80 transition-opacity",
                                cell.c,
                              )}
                              onClick={() => {
                                const matching = risks.filter((r) => r.p === row.p && r.i === idx + 1);
                                if (matching.length > 0) {
                                  setSelectedRisk(matching[0]);
                                }
                                toast.info(`Probability ${row.p} × Impact ${idx + 1}: ${cell.val} risks in this cell.`);
                              }}
                              title={`Probability ${row.p} × Impact ${idx + 1}`}
                            >
                              {cell.val}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* X-axis Impact labels */}
                    <div className="flex items-center gap-1 pt-1">
                      <span className="w-12" />
                      <div className="grid grid-cols-5 gap-1 flex-1 text-center text-[7.5px] text-muted-foreground font-semibold uppercase">
                        <span>1 Insign</span>
                        <span>2 Minor</span>
                        <span>3 Mod</span>
                        <span>4 Major</span>
                        <span>5 Severe</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Heatmap Legend */}
                <div className="flex items-center justify-center gap-3 pt-2 text-[9.5px] border-t border-border/40">
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Low (1-4)</span>
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-300" /> Med (5-9)</span>
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-orange-400" /> High (10-16)</span>
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-rose-600" /> Crit (17-25)</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 (4 cols): Top Risk Exposure (by Expected Monetary Value) */}
            <Card className="lg:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Top Risk Exposure (by EMV)
                </CardTitle>
                <button
                  onClick={() => setIsEmvOpen(true)}
                  className="text-[10px] text-primary font-semibold hover:underline cursor-pointer"
                >
                  View Analysis →
                </button>
              </CardHeader>
              <CardContent className="p-3 text-xs flex flex-col justify-between h-full space-y-2">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b text-[9.5px] text-muted-foreground font-semibold">
                      <th className="pb-1.5">Risk</th>
                      <th className="pb-1.5">Category</th>
                      <th className="pb-1.5 text-center">P</th>
                      <th className="pb-1.5 text-center">I</th>
                      <th className="pb-1.5 pr-1 text-right">EMV (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {[
                      { id: "R-001", name: "Supplier Delay", cat: "Procurement", p: 4, i: 5, emv: "3.60 L" },
                      { id: "R-002", name: "Design Rework", cat: "Technical", p: 4, i: 4, emv: "2.80 L" },
                      { id: "R-003", name: "Material Price", cat: "Cost", p: 3, i: 4, emv: "1.60 L" },
                      { id: "R-004", name: "Labour Shortage", cat: "Resource", p: 3, i: 4, emv: "1.20 L" },
                      { id: "R-005", name: "Testing Failure", cat: "Quality", p: 2, i: 5, emv: "1.00 L" },
                    ].map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-muted/30 cursor-pointer"
                        onClick={() => {
                          const found = risks.find((r) => r.id === row.id);
                          if (found) setSelectedRisk(found);
                          toast.info(`Selected ${row.id} ${row.name}`);
                        }}
                      >
                        <td className="py-2">
                          <span className="font-mono text-primary mr-1 font-bold text-[10px]">{row.id}</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{row.name}</span>
                        </td>
                        <td className="py-2 text-muted-foreground text-[10px]">{row.cat}</td>
                        <td className="py-2 text-center font-mono">{row.p}</td>
                        <td className="py-2 text-center font-mono">{row.i}</td>
                        <td className="py-2 pr-1 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {row.emv}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total Expected Exposure Summary Row */}
                <div className="pt-2 border-t-2 border-border/60 flex items-center justify-between text-xs font-bold mt-2">
                  <span className="text-slate-900 dark:text-white">Total Expected Exposure</span>
                  <span className="font-mono text-rose-600 text-sm">₹ 10.20 L</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 (4 cols): Risk by Response Strategy */}
            <Card className="lg:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Risk by Response Strategy
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {risks.length} Total
                </Badge>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="142" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="183" />
                    <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="213" />
                    <circle cx="50" cy="50" r="38" stroke="#06b6d4" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="228" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{risks.length}</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Total</span>
                  </div>
                </div>

                <div className="space-y-1 text-[10px]">
                  {[
                    { name: "Mitigate", count: "38 (59.4%)", color: "bg-blue-500", strat: "Mitigate" },
                    { name: "Transfer", count: "11 (17.2%)", color: "bg-emerald-500", strat: "Transfer" },
                    { name: "Accept", count: "8 (12.5%)", color: "bg-amber-500", strat: "Accept" },
                    { name: "Avoid", count: "4 (6.3%)", color: "bg-purple-500", strat: "Avoid" },
                    { name: "Escalate", count: "3 (4.7%)", color: "bg-cyan-500", strat: "Escalate" },
                  ].map((s) => (
                    <div
                      key={s.name}
                      onClick={() => {
                        setFilterStrategy(s.strat);
                        toast.info(`Filtered for ${s.strat} response strategy.`);
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
          </div>

          {/* ====================================================================
             5. MASTER RISK REGISTER TABLE (12 Columns, Full Width)
             ==================================================================== */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
            <CardHeader className="p-4 pb-2 border-b border-border/40">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Risk Register Table
                  <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                    {filteredRisks.length} Risks
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search risk by title, ID, owner..."
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
                    onClick={() => setIsCreateRiskOpen(true)}
                    className="h-8 text-xs gap-1 cursor-pointer bg-[#0B3B7B] hover:bg-[#082B5B] text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Risk
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b bg-muted/20 text-[10px] text-muted-foreground font-semibold">
                      <th className="p-2.5 pl-3 font-mono">Risk ID</th>
                      <th className="p-2.5">Risk Title</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5 text-center font-mono">P</th>
                      <th className="p-2.5 text-center font-mono">I</th>
                      <th className="p-2.5 text-center font-mono">Score</th>
                      <th className="p-2.5">Rating</th>
                      <th className="p-2.5">Owner</th>
                      <th className="p-2.5">Response Strategy</th>
                      <th className="p-2.5 font-mono">Target Date</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5 text-center font-mono">Residual Score</th>
                      <th className="p-2.5 pr-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {paginatedRisks.map((item) => (
                      <tr
                        key={item.id}
                        className={cn(
                          "hover:bg-muted/20 transition-colors cursor-pointer",
                          selectedRisk.id === item.id ? "bg-primary/5 font-medium" : "",
                        )}
                        onClick={() => setSelectedRisk(item)}
                      >
                        <td className="p-2.5 pl-3 font-mono font-bold text-primary text-[11px] whitespace-nowrap">
                          {item.id}
                        </td>
                        <td className="p-2.5 font-semibold text-slate-900 dark:text-white max-w-[240px] truncate">
                          {item.title}
                        </td>
                        <td className="p-2.5">{item.category}</td>
                        <td className="p-2.5 text-center font-mono">{item.p}</td>
                        <td className="p-2.5 text-center font-mono">{item.i}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-slate-900 dark:text-white">
                          {item.score}
                        </td>
                        <td className="p-2.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] px-1.5 py-0.2",
                              item.rating === "Critical"
                                ? "bg-rose-50 text-rose-700 border-rose-300"
                                : item.rating === "High"
                                ? "bg-orange-50 text-orange-700 border-orange-300"
                                : item.rating === "Medium"
                                ? "bg-amber-50 text-amber-700 border-amber-300"
                                : "bg-emerald-50 text-emerald-700 border-emerald-300",
                            )}
                          >
                            {item.rating}
                          </Badge>
                        </td>
                        <td className="p-2.5">{item.owner}</td>
                        <td className="p-2.5 font-medium">{item.strategy}</td>
                        <td className="p-2.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                          {item.targetDate}
                        </td>
                        <td className="p-2.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] px-1.5 py-0.2",
                              item.status === "Open"
                                ? "bg-rose-50 text-rose-700 border-rose-300"
                                : item.status === "Monitoring"
                                ? "bg-amber-50 text-amber-700 border-amber-300"
                                : item.status === "Escalated"
                                ? "bg-purple-50 text-purple-700 border-purple-300"
                                : "bg-emerald-50 text-emerald-700 border-emerald-300",
                            )}
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-muted-foreground">
                          {item.residualScore}
                        </td>
                        <td className="p-2.5 pr-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRisk(item);
                                setIsEditRiskOpen(true);
                              }}
                              className="p-1 hover:text-primary cursor-pointer"
                              title="Edit Risk"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRisk(item);
                                setIsConvertToIssueOpen(true);
                              }}
                              className="p-1 hover:text-rose-600 cursor-pointer"
                              title="Convert to Issue"
                            >
                              <AlertTriangle className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRisk(item.id);
                              }}
                              className="p-1 hover:text-rose-600 cursor-pointer"
                              title="Delete Risk"
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
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredRisks.length)} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredRisks.length)} of {filteredRisks.length} entries
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
             5B. SELECTED RISK MITIGATION & WORKSPACE (Full 12 Columns)
             ==================================================================== */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
            <CardHeader className="p-4 pb-2 border-b border-border/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-300 font-mono font-bold text-xs px-2 py-0.5">
                    {selectedRisk.id}
                  </Badge>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedRisk.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-semibold",
                      selectedRisk.status === "Open"
                        ? "bg-rose-50 text-rose-700 border-rose-300"
                        : selectedRisk.status === "Monitoring"
                        ? "bg-amber-50 text-amber-700 border-amber-300"
                        : selectedRisk.status === "Escalated"
                        ? "bg-purple-50 text-purple-700 border-purple-300"
                        : "bg-emerald-50 text-emerald-700 border-emerald-300",
                    )}
                  >
                    {selectedRisk.status}
                  </Badge>
                  <Badge
                    className={cn(
                      "text-[10px] font-bold text-white",
                      selectedRisk.rating === "Critical"
                        ? "bg-rose-600"
                        : selectedRisk.rating === "High"
                        ? "bg-orange-500"
                        : selectedRisk.rating === "Medium"
                        ? "bg-amber-500"
                        : "bg-emerald-600",
                    )}
                  >
                    {selectedRisk.rating} ({selectedRisk.score}/25)
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditRiskOpen(true)}
                    className="h-7 text-xs border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-primary/10"
                  >
                    <Edit2 className="h-3 w-3 mr-1" /> Edit Risk
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsMitigationOpen(true)}
                    className="h-7 text-xs bg-primary text-white font-semibold cursor-pointer shadow-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Mitigation
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
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedRisk.category}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Owner</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedRisk.owner}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Strategy</span>
                      <span className="font-semibold text-primary">{selectedRisk.strategy}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Target Date</span>
                      <span className="font-mono font-medium text-slate-900 dark:text-white">{selectedRisk.targetDate}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Assessment & Impact Analysis */}
                <div className="p-3.5 rounded-xl border bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5">
                  <span className="font-bold uppercase text-[10px] tracking-wider text-muted-foreground block">
                    Assessment & Impact Analysis
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border">
                      <span className="text-[9px] text-muted-foreground block">Cost Impact</span>
                      <span className="font-mono font-bold text-rose-600 text-xs">{selectedRisk.costImpact}</span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border">
                      <span className="text-[9px] text-muted-foreground block">Schedule</span>
                      <span className="font-mono font-bold text-amber-600 text-xs">{selectedRisk.scheduleImpact}</span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border">
                      <span className="text-[9px] text-muted-foreground block">Quality</span>
                      <span className="font-bold text-emerald-600 text-xs">High Spec</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-muted-foreground">Probability × Impact:</span>
                    <span className="font-mono font-bold text-foreground">
                      P:{selectedRisk.p} × I:{selectedRisk.i} = <span className="text-rose-600">{selectedRisk.score}/25</span>
                    </span>
                  </div>
                </div>

                {/* Column 3: Mitigation Plan & Residual Risk */}
                <div className="p-3.5 rounded-xl border bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase text-[10px] tracking-wider text-muted-foreground block">
                      Mitigation Plan & Residual
                    </span>
                    <span className="font-mono font-bold text-emerald-600 text-xs">{selectedRisk.progress}% Complete</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                    {selectedRisk.mitigationPlan}
                  </p>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedRisk.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                    <span className="text-muted-foreground text-[10px]">Residual Score:</span>
                    <span className="font-mono font-bold text-amber-600">{selectedRisk.residualScore}/25 (Medium)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ====================================================================
             6. FOOTER STATUS & SHORTCUTS BAR
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
                  toast.info("Navigated to Register View");
                }}
                className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                R Register
              </button>
              <button
                onClick={() => setIsHeatmapModalOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                M Matrix
              </button>
              <button
                onClick={() => setIsHeatmapModalOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                H Heatmap
              </button>
              <button
                onClick={() => setIsEmvOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                A Analysis
              </button>
            </div>
          </div>

        {/* ====================================================================
           MODALS
           ==================================================================== */}

        {/* 1. Create Project Risk Modal */}
        <Dialog open={isCreateRiskOpen} onOpenChange={setIsCreateRiskOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Create Project Risk (● OPEN)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Log and assess a new project risk with probability, impact, and mitigation plan.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRiskSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Project:</label>
                  <Input value="PRJ-2026-0195" readOnly className="h-8 text-xs font-mono bg-muted" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Risk Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Procurement">Procurement</option>
                    <option value="Technical">Technical</option>
                    <option value="Cost">Cost</option>
                    <option value="Resource">Resource</option>
                    <option value="Quality">Quality</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Customer">Customer</option>
                    <option value="Regulatory">Regulatory</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Risk Title / Statement:</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Critical controller supplier delay"
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Probability (1 to 5):</label>
                  <select
                    value={newP}
                    onChange={(e) => setNewP(Number(e.target.value))}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value={1}>1 — Rare</option>
                    <option value={2}>2 — Unlikely</option>
                    <option value={3}>3 — Possible</option>
                    <option value={4}>4 — Likely</option>
                    <option value={5}>5 — Almost Certain</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Impact (1 to 5):</label>
                  <select
                    value={newI}
                    onChange={(e) => setNewI(Number(e.target.value))}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value={1}>1 — Insignificant</option>
                    <option value={2}>2 — Minor</option>
                    <option value={3}>3 — Moderate</option>
                    <option value={4}>4 — Major</option>
                    <option value={5}>5 — Severe</option>
                  </select>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Calculated Risk Score:</span>
                <span className="font-mono font-bold text-sm text-rose-600">
                  {newP * newI} / 25 ({newP * newI >= 17 ? "🔴 Critical" : newP * newI >= 10 ? "🟠 High" : "🟡 Medium"})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Risk Owner:</label>
                  <Input
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Response Strategy:</label>
                  <select
                    value={newStrategy}
                    onChange={(e) => setNewStrategy(e.target.value as any)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Mitigate">Mitigate</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Accept">Accept</option>
                    <option value="Avoid">Avoid</option>
                    <option value="Escalate">Escalate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Mitigation Plan:</label>
                <textarea
                  value={newMitigation}
                  onChange={(e) => setNewMitigation(e.target.value)}
                  placeholder="Planned mitigation response steps..."
                  className="w-full h-16 p-2 rounded-md border border-input text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsCreateRiskOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Create Risk
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 2. Edit Project Risk Modal */}
        <Dialog open={isEditRiskOpen} onOpenChange={setIsEditRiskOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-primary" />
                Edit Project Risk: {selectedRisk.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update assessment parameters, ownership, status, and mitigation progress.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveEditRisk} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Risk Title:</label>
                <Input
                  value={selectedRisk.title}
                  onChange={(e) => setSelectedRisk({ ...selectedRisk, title: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Owner:</label>
                  <Input
                    value={selectedRisk.owner}
                    onChange={(e) => setSelectedRisk({ ...selectedRisk, owner: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Status:</label>
                  <select
                    value={selectedRisk.status}
                    onChange={(e) => setSelectedRisk({ ...selectedRisk, status: e.target.value as any })}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Open">Open</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Mitigation Progress (%):</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={selectedRisk.progress}
                    onChange={(e) => setSelectedRisk({ ...selectedRisk, progress: Number(e.target.value) })}
                    className="h-8 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Residual Score (1-25):</label>
                  <Input
                    type="number"
                    min={1}
                    max={25}
                    value={selectedRisk.residualScore}
                    onChange={(e) => setSelectedRisk({ ...selectedRisk, residualScore: Number(e.target.value) })}
                    className="h-8 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Mitigation Action Plan:</label>
                <textarea
                  value={selectedRisk.mitigationPlan}
                  onChange={(e) => setSelectedRisk({ ...selectedRisk, mitigationPlan: e.target.value })}
                  className="w-full h-16 p-2 rounded-md border border-input text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsEditRiskOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 3. Add Mitigation Action Modal */}
        <Dialog open={isMitigationOpen} onOpenChange={setIsMitigationOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Add Mitigation Action — {selectedRisk.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Schedule a concrete corrective task to reduce residual risk exposure.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Action Description:</label>
                <Input defaultValue="Qualify Alternate Supplier & reserve capacity" className="h-8 text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Action Owner:</label>
                  <Input defaultValue={selectedRisk.owner} className="h-8 text-xs" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Target Due Date:</label>
                  <Input defaultValue="10-Sep-2026" className="h-8 text-xs font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Estimated Cost:</label>
                  <Input defaultValue="₹ 75,000" className="h-8 text-xs font-mono" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Initial Progress:</label>
                  <Input defaultValue="60%" className="h-8 text-xs font-mono" />
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsMitigationOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsMitigationOpen(false);
                  toast.success(`Mitigation action recorded for ${selectedRisk.id}`);
                }}
                className="bg-primary text-white font-semibold"
              >
                Save Action
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 4. Convert Risk to Issue Modal */}
        <Dialog open={isConvertToIssueOpen} onOpenChange={setIsConvertToIssueOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-rose-600">
                <AlertTriangle className="h-4 w-4" />
                Convert Risk to Active Issue
              </DialogTitle>
              <DialogDescription className="text-xs">
                When a risk event materializes, convert it into an active issue to trigger corrective execution and emergency contingency.
              </DialogDescription>
            </DialogHeader>
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 text-xs space-y-1">
              <span className="font-bold text-rose-700 dark:text-rose-400">Risk Materializing:</span>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {selectedRisk.id}: {selectedRisk.title}
              </p>
              <p className="text-[11px] text-muted-foreground pt-1">
                Will create new Issue ID: <strong>ISS-2026-042</strong> with Critical priority and release contingency budget.
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsConvertToIssueOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleConvertIssue} className="bg-rose-600 text-white font-semibold">
                Convert to Issue Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 5. AI Risk Intelligence Analysis Modal */}
        <Dialog open={isAiRiskOpen} onOpenChange={setIsAiRiskOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Risk Intelligence & Cascading Correlation
              </DialogTitle>
              <DialogDescription className="text-xs">
                Deep neural analysis of risk dependencies across WBS, supplier capacity, and project milestones.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200">
                <span className="font-bold text-rose-700 block mb-1">🔴 Critical Cascading Risk Detected:</span>
                <p className="text-[11px] text-slate-800 dark:text-slate-200">
                  R-001 (Supplier Delay) directly correlates with Milestone M-004 (Procurement Complete). A 12-day delay will cascade into Production and push Site Delivery by 18 days.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200">
                <span className="font-bold text-amber-700 block mb-1">🟠 Recommended Mitigation:</span>
                <p className="text-[11px] text-slate-800 dark:text-slate-200">
                  Qualifying alternate supplier reduces expected monetary loss from ₹3.60 L to ₹0.80 L and preserves critical path integrity.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsAiRiskOpen(false)}>Close Analysis</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 6. Full Heatmap Matrix Modal */}
        <Dialog open={isHeatmapModalOpen} onOpenChange={setIsHeatmapModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600" />
                5x5 Probability vs Impact Risk Matrix
              </DialogTitle>
              <DialogDescription className="text-xs">
                Complete distribution of all 64 project risks across severity tiers.
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border space-y-3">
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 rounded bg-rose-500 text-white font-bold">
                  <span>Critical (17-25)</span>
                  <span className="block text-lg font-mono">5</span>
                </div>
                <div className="p-2.5 rounded bg-orange-400 text-white font-bold">
                  <span>High (10-16)</span>
                  <span className="block text-lg font-mono">14</span>
                </div>
                <div className="p-2.5 rounded bg-amber-300 text-slate-900 font-bold">
                  <span>Medium (5-9)</span>
                  <span className="block text-lg font-mono">24</span>
                </div>
                <div className="p-2.5 rounded bg-emerald-500 text-white font-bold">
                  <span>Low (1-4)</span>
                  <span className="block text-lg font-mono">21</span>
                </div>
                <div className="p-2.5 rounded bg-blue-600 text-white font-bold">
                  <span>Total Risks</span>
                  <span className="block text-lg font-mono">64</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsHeatmapModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 7. Escalation History Log Modal */}
        <Dialog open={isEscalationLogOpen} onOpenChange={setIsEscalationLogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-purple-600">
                <History className="h-4 w-4" />
                Risk Escalation & Steering Log
              </DialogTitle>
              <DialogDescription className="text-xs">
                Audit trail of risks elevated to Steering Committee or Executive PMO.
              </DialogDescription>
            </DialogHeader>
            <div className="divide-y border rounded-lg p-2 text-xs space-y-2">
              <div className="pt-2">
                <span className="font-mono font-bold text-primary block">R-010: High voltage grid interconnect delay</span>
                <span className="text-muted-foreground text-[11px] block">Escalated to State Electricity Board • 02-Sep-2026</span>
                <Badge className="bg-purple-600 text-white text-[8px] mt-1">Escalated to Board</Badge>
              </div>
              <div className="pt-2">
                <span className="font-mono font-bold text-primary block">R-001: Critical controller supplier delay</span>
                <span className="text-muted-foreground text-[11px] block">Reviewed at PMO steering gate • 28-Aug-2026</span>
                <Badge variant="outline" className="text-[8px] mt-1">Under PMO Monitor</Badge>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsEscalationLogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 8. EMV Exposure Modal */}
        <Dialog open={isEmvOpen} onOpenChange={setIsEmvOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-amber-600">
                <DollarSign className="h-4 w-4" />
                Expected Monetary Value (EMV) Exposure
              </DialogTitle>
              <DialogDescription className="text-xs">
                Financial risk exposure calculated as Probability (%) × Cost Impact (₹).
              </DialogDescription>
            </DialogHeader>
            <div className="divide-y border rounded-lg p-2 text-xs">
              {risks.slice(0, 8).map((r) => (
                <div key={r.id} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-primary mr-2">{r.id}</span>
                    <span className="font-medium">{r.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold block">{r.costImpact}</span>
                    <span className="text-[10px] text-muted-foreground">P: {r.p}/5 • Score: {r.score}</span>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsEmvOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default RiskManagementFormPage;
