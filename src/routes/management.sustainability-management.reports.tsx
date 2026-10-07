// Magnertia ERP - Sustainability Reports Suite
// Management → Sustainability Management → Reports
// Executive Controlled Report Generator, Library, Scheduled Disclosures & Audit Viewer
// Designed to match the high-level Financial Reporting Architecture

import React, { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  Plus,
  TrendingUp,
  Download,
  Search,
  CheckCircle2,
  Share2,
  Calendar,
  Eye,
  Star,
  FileSpreadsheet,
  Clock,
  ShieldCheck,
  Sparkles,
  FileCheck,
  ChevronDown,
  Printer,
  X,
  Layers,
  Leaf,
  Droplets,
  Recycle,
  Zap,
  Building,
  RotateCw,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import { SustainabilityManagementTabBar } from "@/components/erp/SustainabilityManagementTabBar";
import { ErpButton } from "@/components/erp/Button";
import { StatCard } from "@/components/erp/StatCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/sustainability-management/reports"
)({
  head: () => ({
    meta: [
      { title: "Sustainability Reporting · Magnertia ERP" },
      {
        name: "description",
        content:
          "Generate, schedule, analyze, and share statutory ESG filings, corporate GHG inventories, energy performance audits, and compliance dossiers.",
      },
    ],
  }),
  component: SustainabilityReportsPage,
});

export interface SustainabilityReportRecord {
  id: string;
  code: string;
  name: string;
  category:
    | "ESG"
    | "Carbon & GHG"
    | "Energy"
    | "Water & ZLD"
    | "Waste & Recycling"
    | "Compliance & Legal";
  purpose: string;
  frequency: "Monthly" | "Quarterly" | "Annual" | "On-Demand";
  lastGenerated: string;
  generatedBy: string;
  format: "PDF" | "XLSX" | "CSV";
  recordCount: number;
  confidentiality: "Public / SEBI" | "Internal" | "Restricted";
  framework: string;
  isFavorite?: boolean;
}

const INITIAL_REPORTS: SustainabilityReportRecord[] = [
  {
    id: "rep-1",
    code: "REP-SUS-001",
    name: "SEBI BRSR Core Comprehensive Disclosures",
    category: "ESG",
    purpose:
      "Mandatory Business Responsibility and Sustainability Report for top listed entities with assurance parameters.",
    frequency: "Annual",
    lastGenerated: "2026-09-26",
    generatedBy: "Dr. Vikram Patel",
    format: "PDF",
    recordCount: 186,
    confidentiality: "Public / SEBI",
    framework: "BRSR Core (SEBI Circular 2023)",
    isFavorite: true,
  },
  {
    id: "rep-2",
    code: "REP-SUS-002",
    name: "Corporate GHG Inventory & Scopes 1, 2 & 3 Ledger",
    category: "Carbon & GHG",
    purpose:
      "Comprehensive emissions breakdown by scope, emission factors, stationary combustion, grid and value chain.",
    frequency: "Quarterly",
    lastGenerated: "2026-09-25",
    generatedBy: "Priya Sharma",
    format: "XLSX",
    recordCount: 64,
    confidentiality: "Internal",
    framework: "GHG Protocol / ISO 14064",
    isFavorite: true,
  },
  {
    id: "rep-3",
    code: "REP-SUS-003",
    name: "ISO 50001 Energy Performance & Specific Consumption",
    category: "Energy",
    purpose:
      "Machine-level energy intensity, peak load distribution, solar-wheel transition and EnPI baseline variances.",
    frequency: "Monthly",
    lastGenerated: "2026-09-24",
    generatedBy: "Rajesh Kannan",
    format: "PDF",
    recordCount: 128,
    confidentiality: "Internal",
    framework: "ISO 50001:2018",
    isFavorite: false,
  },
  {
    id: "rep-4",
    code: "REP-SUS-004",
    name: "Water Balance & Zero Liquid Discharge (ZLD) Audit",
    category: "Water & ZLD",
    purpose:
      "Campus water balance flow, borehole withdrawal, RO recovery yields, and ETP effluent recirculation ledger.",
    frequency: "Monthly",
    lastGenerated: "2026-09-23",
    generatedBy: "Dr. Vikram Patel",
    format: "PDF",
    recordCount: 38,
    confidentiality: "Internal",
    framework: "GRI 303 / CGWA Guidelines",
    isFavorite: false,
  },
  {
    id: "rep-5",
    code: "REP-SUS-005",
    name: "Hazardous & Non-Hazardous Waste Manifest Register",
    category: "Waste & Recycling",
    purpose:
      "Controlled Form 10 yellow manifests, authorized recycler certificates, weighbridge tickets and co-processing manifests.",
    frequency: "Monthly",
    lastGenerated: "2026-09-22",
    generatedBy: "Suresh Menon",
    format: "XLSX",
    recordCount: 92,
    confidentiality: "Internal",
    framework: "Hazardous Waste Rules 2016",
    isFavorite: false,
  },
  {
    id: "rep-6",
    code: "REP-SUS-006",
    name: "Circular Economy & Material Reprocessing Yield",
    category: "Waste & Recycling",
    purpose:
      "Recovered aluminum, copper, polymer and battery black mass economics, landfill diversion rates and vendor passes.",
    frequency: "Quarterly",
    lastGenerated: "2026-09-20",
    generatedBy: "Priya Sharma",
    format: "PDF",
    recordCount: 48,
    confidentiality: "Internal",
    framework: "Circular Economy KPI Index",
    isFavorite: true,
  },
  {
    id: "rep-7",
    code: "REP-SUS-007",
    name: "Statutory CTO / CTE Environmental Conditions Dossier",
    category: "Compliance & Legal",
    purpose:
      "Pollution Control Board Consent to Operate tracking, stack emission testing, ambient noise and legal compliance status.",
    frequency: "Quarterly",
    lastGenerated: "2026-09-18",
    generatedBy: "Dr. Vikram Patel",
    format: "PDF",
    recordCount: 186,
    confidentiality: "Restricted",
    framework: "Air & Water Acts (SPCB/CPCB)",
    isFavorite: false,
  },
  {
    id: "rep-8",
    code: "REP-SUS-008",
    name: "GRI Standards 2021 Multi-Framework Cross-Reference",
    category: "ESG",
    purpose:
      "GRI content index mapping disclosure numbers, management approaches, boundaries and verified page numbers.",
    frequency: "Annual",
    lastGenerated: "2026-09-15",
    generatedBy: "Priya Sharma",
    format: "PDF",
    recordCount: 84,
    confidentiality: "Public / SEBI",
    framework: "GRI Universal Standards 2021",
    isFavorite: false,
  },
];

const CATEGORIES = [
  "All Reports",
  "ESG",
  "Carbon & GHG",
  "Energy",
  "Water & ZLD",
  "Waste & Recycling",
  "Compliance & Legal",
] as const;

// Trend data matching Finance Reports right sidebar
const GENERATED_TREND_DATA = [
  { month: "Jan", count: 24 },
  { month: "Feb", count: 28 },
  { month: "Mar", count: 32 },
  { month: "Apr", count: 36 },
  { month: "May", count: 42 },
  { month: "Jun", count: 45 },
  { month: "Jul", count: 48 },
  { month: "Aug", count: 52 },
  { month: "Sep", count: 58 },
];

// Distribution data matching Finance Reports donut chart
const CATEGORY_DISTRIBUTION = [
  { name: "ESG Disclosures", value: 32, color: "#10B981" },
  { name: "Carbon & GHG", value: 24, color: "#3B82F6" },
  { name: "Energy & Power", value: 18, color: "#F59E0B" },
  { name: "Water & ZLD", value: 12, color: "#06B6D4" },
  { name: "Waste & Circular", value: 14, color: "#8B5CF6" },
];

const RECENT_ACTIVITIES = [
  {
    user: "Dr. Vikram Patel",
    action: "Generated & published SEBI BRSR Core Disclosures (.pdf)",
    time: "14m ago",
    avatar: "VP",
  },
  {
    user: "Priya Sharma",
    action: "Shared Corporate GHG Inventory with Deloitte Assurance Team",
    time: "2h ago",
    avatar: "PS",
  },
  {
    user: "Automated Job",
    action: "Compiled weekly ISO 50001 Energy Performance ledger",
    time: "1d ago",
    avatar: "AJ",
  },
  {
    user: "Suresh Menon",
    action: "Exported Hazardous Waste Manifest yellow forms (.xlsx)",
    time: "2d ago",
    avatar: "SM",
  },
];

const SCHEDULED_REPORTS_DATA = [
  {
    id: "sch-1",
    name: "Monthly Corporate GHG Inventory",
    reportName: "Corporate GHG Inventory & Scopes 1, 2 & 3 Ledger",
    frequency: "Monthly (1st at 08:00 AM)",
    format: "XLSX",
    recipients: "esg-auditors@magnertia.com, priya.sharma@magnertia.com",
    nextRun: "01 Nov 2026",
    active: true,
  },
  {
    id: "sch-2",
    name: "ISO 50001 Energy Review",
    reportName: "ISO 50001 Energy Performance & Specific Consumption",
    frequency: "Monthly (Last Friday)",
    format: "PDF",
    recipients: "plant-heads@magnertia.com, rajesh.kannan@magnertia.com",
    nextRun: "31 Oct 2026",
    active: true,
  },
  {
    id: "sch-3",
    name: "Quarterly SEBI BRSR Audit Pack",
    reportName: "SEBI BRSR Core Comprehensive Disclosures",
    frequency: "Quarterly (Q-End)",
    format: "PDF",
    recipients: "board-secretariat@magnertia.com, legal@magnertia.com",
    nextRun: "31 Dec 2026",
    active: true,
  },
];

const RECENT_RUNS_DATA = [
  {
    runId: "RUN-2026-904",
    name: "SEBI BRSR Core Comprehensive Disclosures",
    format: "PDF",
    date: "2026-09-26 14:32",
    duration: "1.4s",
    user: "Dr. Vikram Patel",
    status: "Completed",
  },
  {
    runId: "RUN-2026-903",
    name: "Corporate GHG Inventory & Scopes 1, 2 & 3 Ledger",
    format: "XLSX",
    date: "2026-09-25 11:15",
    duration: "2.1s",
    user: "Priya Sharma",
    status: "Completed",
  },
  {
    runId: "RUN-2026-902",
    name: "ISO 50001 Energy Performance & Specific Consumption",
    format: "PDF",
    date: "2026-09-24 16:48",
    duration: "1.1s",
    user: "Rajesh Kannan",
    status: "Completed",
  },
  {
    runId: "RUN-2026-901",
    name: "Water Balance & Zero Liquid Discharge (ZLD) Audit",
    format: "PDF",
    date: "2026-09-23 09:20",
    duration: "0.9s",
    user: "Dr. Vikram Patel",
    status: "Completed",
  },
];

const SHARED_LOGS_DATA = [
  {
    id: "shr-1",
    reportName: "SEBI BRSR Core Comprehensive Disclosures",
    sharedWith: "KPMG Statutory ESG Assurance Team",
    access: "View & Export",
    sharedDate: "2026-09-26",
    status: "Active",
  },
  {
    id: "shr-2",
    reportName: "Corporate GHG Inventory & Scopes 1, 2 & 3 Ledger",
    sharedWith: "Chief Operating Officer & Board Audit Comm.",
    access: "View Only",
    sharedDate: "2026-09-25",
    status: "Active",
  },
  {
    id: "shr-3",
    reportName: "Statutory CTO / CTE Environmental Conditions Dossier",
    sharedWith: "Tamil Nadu Pollution Control Board Inspector",
    access: "View & Export",
    sharedDate: "2026-09-18",
    status: "Active",
  },
];

function SustainabilityReportsPage() {
  const [activeTab, setActiveTab] = useState<
    "reports" | "favorites" | "recent" | "shared" | "scheduled"
  >("reports");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Reports");
  const [search, setSearch] = useState("");
  const [reportTypeFilter, setReportTypeFilter] = useState<"All" | "Statutory" | "Internal">("All");
  const [formatFilter, setFormatFilter] = useState<"All" | "PDF" | "XLSX" | "CSV">("All");
  const [frequencyFilter, setFrequencyFilter] = useState<"All" | "Monthly" | "Quarterly" | "Annual">("All");
  const [sortBy, setSortBy] = useState("name-asc");

  // State lists
  const [reportsList, setReportsList] = useState<SustainabilityReportRecord[]>(INITIAL_REPORTS);
  const [scheduledList, setScheduledList] = useState(SCHEDULED_REPORTS_DATA);

  // Dialog States
  const [createOpen, setCreateOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState<SustainabilityReportRecord | null>(null);

  // Form Inputs
  const [newReportInput, setNewReportInput] = useState({
    name: "",
    code: "",
    category: "ESG" as SustainabilityReportRecord["category"],
    purpose: "",
    frequency: "Quarterly" as SustainabilityReportRecord["frequency"],
    format: "PDF" as SustainabilityReportRecord["format"],
    framework: "BRSR Core / GRI",
  });

  const [newScheduleInput, setNewScheduleInput] = useState({
    reportId: INITIAL_REPORTS[0].id,
    frequency: "Monthly",
    format: "PDF",
    recipients: "",
  });

  const [newShareInput, setNewShareInput] = useState({
    reportId: INITIAL_REPORTS[0].id,
    sharedWith: "",
    accessLevel: "View & Export",
    message: "",
  });

  // Generator preset states
  const [builderScope, setBuilderScope] = useState("All Facilities");
  const [builderPeriod, setBuilderPeriod] = useState("FY 2026-27 YTD");
  const [builderFormat, setBuilderFormat] = useState("PDF Dossier");
  const [isGenerating, setIsGenerating] = useState(false);

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setReportsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  // Create report submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportInput.name.trim()) {
      toast.error("Please enter a report title.");
      return;
    }
    const created: SustainabilityReportRecord = {
      id: `rep-${Date.now()}`,
      code: newReportInput.code || `REP-SUS-00${reportsList.length + 1}`,
      name: newReportInput.name,
      category: newReportInput.category,
      purpose: newReportInput.purpose || "Executive controlled sustainability disclosure file.",
      frequency: newReportInput.frequency,
      lastGenerated: new Date().toISOString().split("T")[0],
      generatedBy: "System Administrator",
      format: newReportInput.format,
      recordCount: 54,
      confidentiality: "Internal",
      framework: newReportInput.framework,
      isFavorite: false,
    };
    setReportsList([created, ...reportsList]);
    setCreateOpen(false);
    setNewReportInput({
      name: "",
      code: "",
      category: "ESG",
      purpose: "",
      frequency: "Quarterly",
      format: "PDF",
      framework: "BRSR Core / GRI",
    });
    toast.success(`Report template "${created.name}" created successfully.`);
  };

  // Schedule submit
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleInput.recipients.trim()) {
      toast.error("Please enter recipient emails.");
      return;
    }
    const matched = reportsList.find((r) => r.id === newScheduleInput.reportId) || reportsList[0];
    const newSch = {
      id: `sch-${Date.now()}`,
      name: `${matched.name} (${newScheduleInput.frequency})`,
      reportName: matched.name,
      frequency: `${newScheduleInput.frequency} (Automated)`,
      format: newScheduleInput.format,
      recipients: newScheduleInput.recipients,
      nextRun: "01 Nov 2026",
      active: true,
    };
    setScheduledList([newSch, ...scheduledList]);
    setScheduleOpen(false);
    toast.success(`Automated delivery scheduled for ${matched.name}.`);
  };

  // Share submit
  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShareInput.sharedWith.trim()) {
      toast.error("Please enter auditor or stakeholder email.");
      return;
    }
    setShareOpen(false);
    toast.success(`Report dossier shared with ${newShareInput.sharedWith}.`);
  };

  // Ad-hoc generation
  const handleRunAdhocGenerator = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(
        `Generated ${builderScope} report for ${builderPeriod} as ${builderFormat}. Download ready.`
      );
    }, 600);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("All Reports");
    setReportTypeFilter("All");
    setFormatFilter("All");
    setFrequencyFilter("All");
    toast.info("Report filters reset to default.");
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reportsList.filter((r) => {
      const matchCat =
        selectedCategory === "All Reports" || r.category === selectedCategory;
      const matchFormat = formatFilter === "All" || r.format === formatFilter;
      const matchFreq =
        frequencyFilter === "All" || r.frequency === frequencyFilter;
      const matchType =
        reportTypeFilter === "All" ||
        (reportTypeFilter === "Statutory"
          ? r.confidentiality === "Public / SEBI" || r.framework.includes("BRSR") || r.framework.includes("SPCB")
          : r.confidentiality !== "Public / SEBI");
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.code.toLowerCase().includes(search.toLowerCase()) ||
        r.framework.toLowerCase().includes(search.toLowerCase()) ||
        r.purpose.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchFormat && matchFreq && matchType && matchSearch;
    });
  }, [reportsList, selectedCategory, formatFilter, frequencyFilter, reportTypeFilter, search]);

  // Sorted reports
  const sortedReports = useMemo(() => {
    const list = [...filteredReports];
    if (sortBy === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === "records-desc") list.sort((a, b) => b.recordCount - a.recordCount);
    return list;
  }, [filteredReports, sortBy]);

  const favoritesList = useMemo(() => {
    return reportsList.filter((r) => r.isFavorite);
  }, [reportsList]);

  return (
    <AppShell
      title="Sustainability Reports"
      breadcrumb="Management > Sustainability Management > Reports"
      description="Controlled master reports repository, SEBI BRSR Core filings, GHG inventories, water & energy audits & ISO compliance registers."
      tabs={<SustainabilityManagementTabBar />}
      topbarActions={
        <ErpButton onClick={() => setCreateOpen(true)} size="md">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Report</span>
        </ErpButton>
      }
    >
      <div className="space-y-5">
        {/* Ad-hoc Quick Generator Banner (matching Finance's ReportBuilder band) */}
        <div className="rounded-xl border border-border bg-gradient-to-r from-card via-card to-emerald-500/5 p-4 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Leaf className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  Ad-Hoc Sustainability Report Generator
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Generate instant verified audit reports, BRSR disclosure packs, and carbon balances across operating facilities.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={builderScope}
                onChange={(e) => setBuilderScope(e.target.value)}
                className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-hidden"
              >
                <option>All Facilities</option>
                <option>Sriperumbudur Gigafactory</option>
                <option>Hosur Battery Plant</option>
                <option>Pune Electronics Lab</option>
              </select>

              <select
                value={builderPeriod}
                onChange={(e) => setBuilderPeriod(e.target.value)}
                className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-hidden"
              >
                <option>FY 2026-27 YTD</option>
                <option>Q3 FY26 (Current)</option>
                <option>Last 30 Days</option>
                <option>Calendar Year 2026</option>
              </select>

              <select
                value={builderFormat}
                onChange={(e) => setBuilderFormat(e.target.value)}
                className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-hidden"
              >
                <option>PDF Dossier</option>
                <option>Excel Workbook (.xlsx)</option>
                <option>Audit XML / CSV</option>
              </select>

              <ErpButton
                onClick={handleRunAdhocGenerator}
                loading={isGenerating}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Generate Dossier</span>
              </ErpButton>
            </div>
          </div>
        </div>

        {/* 5 KPI StatCards Row (Matching Finance Reports Header Grid) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            label="Total Controlled Reports"
            value={`${reportsList.length} Reports`}
            neutralText="100% Audit Ready"
            icon={<FileCheck className="h-5 w-5" />}
            iconBg="bg-primary/10"
            iconColor="text-primary"
          />
          <StatCard
            label="Statutory Assurance"
            value="ISAE 3000 Verified"
            neutralText="DNV GL & KPMG Audited"
            icon={<ShieldCheck className="h-5 w-5" />}
            iconBg="bg-[#3B82F6]/10"
            iconColor="text-[#3B82F6]"
          />
          <StatCard
            label="Upcoming Mandatory Filing"
            value="SEBI BRSR Core"
            neutralText="Due in 38 Days"
            icon={<Calendar className="h-5 w-5" />}
            iconBg="bg-[#F59E0B]/10"
            iconColor="text-[#F59E0B]"
          />
          <StatCard
            label="Framework Coverage"
            value="5 Global Standards"
            neutralText="BRSR, GRI, TCFD, ISO, CDP"
            icon={<Sparkles className="h-5 w-5" />}
            iconBg="bg-[#22C55E]/10"
            iconColor="text-[#22C55E]"
          />
          <StatCard
            label="Total Generations (YTD)"
            value="348 Runs"
            neutralText="↑ 24% vs Last Quarter"
            icon={<FileSpreadsheet className="h-5 w-5" />}
            iconBg="bg-purple-500/10"
            iconColor="text-purple-500"
          />
        </div>

        {/* Main 2-Column Split Layout (Matching Finance Reports) */}
        <div className="grid gap-5 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px]">
          {/* Left Column (Main Reports & Tab Views) */}
          <div className="min-w-0 space-y-5">
            {/* Tab Navigation Strip & Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-1">
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    { label: "Reports", value: "reports" },
                    { label: "Favorites", value: "favorites" },
                    { label: "Recent", value: "recent" },
                    { label: "Shared Reports", value: "shared" },
                    { label: "Scheduled Reports", value: "scheduled" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setActiveTab(t.value)}
                    className={`px-4 py-2 text-[14px] font-semibold border-b-2 transition-colors -mb-[2px] cursor-pointer ${
                      activeTab === t.value
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <ErpButton
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Exporting controlled sustainability reports ledger (.csv)...")}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export</span>
                </ErpButton>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-foreground shadow-xs hover:bg-muted/50 cursor-pointer">
                      <span>More Actions</span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setScheduleOpen(true)}>
                      Configure Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShareOpen(true)}>
                      Share Report
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={resetFilters}>
                      Reset Filters
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* TAB 1: REPORTS */}
            {activeTab === "reports" && (
              <div className="grid gap-5 md:grid-cols-[200px_1fr]">
                {/* Left Category Menu & Filters Sidebar */}
                <div className="space-y-4">
                  <div className="card-soft p-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Report Categories
                      </h4>
                      <ul className="space-y-1">
                        {CATEGORIES.map((cat) => {
                          const count =
                            cat === "All Reports"
                              ? reportsList.length
                              : reportsList.filter((r) => r.category === cat).length;
                          return (
                            <li key={cat}>
                              <button
                                onClick={() => setSelectedCategory(cat)}
                                className={`w-full flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer ${
                                  selectedCategory === cat
                                    ? "bg-primary/10 text-primary font-bold"
                                    : "text-muted-foreground hover:bg-muted"
                                }`}
                              >
                                <span className="truncate">{cat}</span>
                                <span className="font-semibold text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-foreground">
                                  {count}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="border-t border-border pt-3 space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Format
                        </label>
                        <select
                          value={formatFilter}
                          onChange={(e) => setFormatFilter(e.target.value as any)}
                          className="mt-1 w-full rounded border border-border bg-background p-1.5 text-xs focus:outline-hidden"
                        >
                          <option value="All">All Formats</option>
                          <option value="PDF">PDF</option>
                          <option value="XLSX">Excel (.xlsx)</option>
                          <option value="CSV">CSV</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Frequency
                        </label>
                        <select
                          value={frequencyFilter}
                          onChange={(e) => setFrequencyFilter(e.target.value as any)}
                          className="mt-1 w-full rounded border border-border bg-background p-1.5 text-xs focus:outline-hidden"
                        >
                          <option value="All">All Frequencies</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Annual">Annual</option>
                        </select>
                      </div>

                      <button
                        onClick={resetFilters}
                        className="text-[11px] font-semibold text-primary hover:underline cursor-pointer block pt-1"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Table / Main Report Records */}
                <div className="space-y-3">
                  {/* Filter Toolbar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 rounded-xl border border-border bg-card p-2.5 shadow-2xs">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search report name, code, framework, purpose..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded border border-border bg-background pl-8 pr-3 py-1.5 text-xs focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5 text-[11px]">
                        {(["All", "Statutory", "Internal"] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => setReportTypeFilter(type)}
                            className={cn(
                              "px-2.5 py-1 rounded font-medium transition-colors cursor-pointer",
                              reportTypeFilter === type
                                ? "bg-card text-foreground font-bold shadow-2xs"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="rounded border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-hidden"
                      >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="records-desc">Record Count</option>
                      </select>
                    </div>
                  </div>

                  {/* Reports Data Table */}
                  <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 text-muted-foreground text-[11px]">
                          <th className="py-2.5 pl-3 pr-1 w-8"></th>
                          <th className="py-2.5 px-3">Report Name & Framework</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Frequency</th>
                          <th className="py-2.5 px-3">Format</th>
                          <th className="py-2.5 px-3">Last Generated</th>
                          <th className="py-2.5 pr-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {sortedReports.map((report) => (
                          <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3 pl-3 pr-1">
                              <button
                                onClick={() => handleToggleFavorite(report.id)}
                                className="cursor-pointer text-muted-foreground hover:text-amber-500"
                              >
                                <Star
                                  className={cn(
                                    "h-3.5 w-3.5",
                                    report.isFavorite && "fill-amber-400 text-amber-500"
                                  )}
                                />
                              </button>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-foreground text-[12px]">
                                {report.name}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                                <span className="font-mono">{report.code}</span>
                                <span>•</span>
                                <span className="rounded bg-muted px-1.5 py-0.2 text-[9px] font-medium text-foreground">
                                  {report.framework}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                {report.category}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[11px] text-muted-foreground">
                              {report.frequency}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={cn(
                                  "rounded px-1.5 py-0.5 text-[10px] font-mono font-bold",
                                  report.format === "PDF"
                                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                )}
                              >
                                {report.format}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="text-[11px] font-medium text-foreground">
                                {report.lastGenerated}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {report.generatedBy}
                              </div>
                            </td>
                            <td className="py-3 pr-3 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer">
                                    <ChevronDown className="h-3.5 w-3.5" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setPreviewReport(report)}>
                                    <Eye className="mr-2 h-3.5 w-3.5" /> Preview Report
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      toast.success(`Generated run for ${report.name} (${report.code}).`)
                                    }
                                  >
                                    <Sparkles className="mr-2 h-3.5 w-3.5 text-emerald-600" /> Run / Generate Now
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setNewScheduleInput({ ...newScheduleInput, reportId: report.id });
                                      setScheduleOpen(true);
                                    }}
                                  >
                                    <Calendar className="mr-2 h-3.5 w-3.5" /> Configure Schedule
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setNewShareInput({ ...newShareInput, reportId: report.id });
                                      setShareOpen(true);
                                    }}
                                  >
                                    <Share2 className="mr-2 h-3.5 w-3.5" /> Share Report
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      toast.success(`Downloaded ${report.name} as ${report.format}.`)
                                    }
                                  >
                                    <Download className="mr-2 h-3.5 w-3.5" /> Download File
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FAVORITES */}
            {activeTab === "favorites" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                  <h3 className="text-sm font-bold text-foreground">Starred Reports</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Fast access to bookmarked statutory compliance and executive sustainability dossiers.
                  </p>
                  <div className="divide-y divide-border/60">
                    {favoritesList.map((rep) => (
                      <div
                        key={rep.id}
                        className="py-3 flex items-center justify-between gap-3 hover:bg-muted/20 px-2 rounded-lg"
                      >
                        <div>
                          <div className="font-semibold text-foreground text-xs">{rep.name}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {rep.code} • {rep.category} • {rep.framework}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ErpButton
                            size="xs"
                            variant="outline"
                            onClick={() => setPreviewReport(rep)}
                          >
                            Preview
                          </ErpButton>
                          <ErpButton
                            size="xs"
                            onClick={() => toast.success(`Generated ${rep.name}.`)}
                          >
                            Run Now
                          </ErpButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: RECENT RUNS */}
            {activeTab === "recent" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Recent Report Executions</h3>
                      <p className="text-xs text-muted-foreground">
                        Audit trail of recent report generation jobs and compiled records.
                      </p>
                    </div>
                    <ErpButton
                      size="xs"
                      variant="outline"
                      onClick={() => toast.info("Refreshed execution audit logs.")}
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                      <span>Refresh</span>
                    </ErpButton>
                  </div>

                  <table className="w-full text-left text-xs mt-2">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground text-[10px]">
                        <th className="py-2">Run ID</th>
                        <th className="py-2">Report Name</th>
                        <th className="py-2">Execution Date</th>
                        <th className="py-2">Duration</th>
                        <th className="py-2">Generated By</th>
                        <th className="py-2">Status</th>
                        <th className="py-2 text-right">Download</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {RECENT_RUNS_DATA.map((r) => (
                        <tr key={r.runId} className="hover:bg-muted/30">
                          <td className="py-2.5 font-mono text-[11px] font-bold text-foreground">
                            {r.runId}
                          </td>
                          <td className="py-2.5 font-medium text-foreground">{r.name}</td>
                          <td className="py-2.5 text-muted-foreground">{r.date}</td>
                          <td className="py-2.5 text-muted-foreground">{r.duration}</td>
                          <td className="py-2.5 text-muted-foreground">{r.user}</td>
                          <td className="py-2.5">
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                              {r.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => toast.success(`Downloaded ${r.name} artifact.`)}
                              className="text-primary hover:underline text-xs font-semibold cursor-pointer"
                            >
                              Get {r.format}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: SHARED REPORTS */}
            {activeTab === "shared" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Shared Compliance Reports</h3>
                      <p className="text-xs text-muted-foreground">
                        Controlled dossiers shared with statutory external auditors, regulators, and executive leadership.
                      </p>
                    </div>
                    <ErpButton size="sm" onClick={() => setShareOpen(true)}>
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share New Report</span>
                    </ErpButton>
                  </div>

                  <table className="w-full text-left text-xs mt-2">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground text-[10px]">
                        <th className="py-2">Report Name</th>
                        <th className="py-2">Shared Stakeholder / Auditor</th>
                        <th className="py-2">Access Level</th>
                        <th className="py-2">Date Shared</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {SHARED_LOGS_DATA.map((s) => (
                        <tr key={s.id} className="hover:bg-muted/30">
                          <td className="py-2.5 font-semibold text-foreground">{s.reportName}</td>
                          <td className="py-2.5 text-muted-foreground">{s.sharedWith}</td>
                          <td className="py-2.5">
                            <span className="rounded bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                              {s.access}
                            </span>
                          </td>
                          <td className="py-2.5 text-muted-foreground">{s.sharedDate}</td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => toast.info("Revoked stakeholder access.")}
                              className="text-rose-600 hover:underline text-[11px] font-medium cursor-pointer"
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: SCHEDULED REPORTS */}
            {activeTab === "scheduled" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Automated Scheduled Disclosures</h3>
                      <p className="text-xs text-muted-foreground">
                        Cron-based recurring report compiling and delivery directly to auditor mailboxes.
                      </p>
                    </div>
                    <ErpButton size="sm" onClick={() => setScheduleOpen(true)}>
                      <Calendar className="h-3.5 w-3.5" />
                      <span>New Schedule</span>
                    </ErpButton>
                  </div>

                  <table className="w-full text-left text-xs mt-2">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground text-[10px]">
                        <th className="py-2">Schedule Name</th>
                        <th className="py-2">Report</th>
                        <th className="py-2">Cadence</th>
                        <th className="py-2">Next Run</th>
                        <th className="py-2">Recipients</th>
                        <th className="py-2 text-right">Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {scheduledList.map((sch) => (
                        <tr key={sch.id} className="hover:bg-muted/30">
                          <td className="py-2.5 font-semibold text-foreground">{sch.name}</td>
                          <td className="py-2.5 text-muted-foreground">{sch.reportName}</td>
                          <td className="py-2.5 text-muted-foreground">{sch.frequency}</td>
                          <td className="py-2.5 font-bold text-primary">{sch.nextRun}</td>
                          <td className="py-2.5 text-muted-foreground truncate max-w-[150px]">
                            {sch.recipients}
                          </td>
                          <td className="py-2.5 text-right">
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Sidebar Charts & Feed, matching Finance Reports) */}
          <div className="space-y-5">
            {/* Chart 1: Generated Reports Trend */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Generated Reports Trend</h4>
                  <p className="text-[10px] text-muted-foreground">Monthly compilation volume</p>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Jan – Sep 2026
                </span>
              </div>
              <div className="h-[180px] w-full pt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={GENERATED_TREND_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis dataKey="month" tickLine={false} className="text-[9px]" />
                    <YAxis tickLine={false} className="text-[9px]" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Reports by Framework & Category (Donut Chart) */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <h4 className="text-xs font-bold text-foreground">Framework Distribution</h4>
              <p className="text-[10px] text-muted-foreground mb-2">Statutory ESG & Environmental Categories</p>
              <div className="relative mx-auto h-[140px] w-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_DISTRIBUTION}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={62}
                    >
                      {CATEGORY_DISTRIBUTION.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-foreground">100%</span>
                  <span className="text-[9px] text-muted-foreground">Assurance</span>
                </div>
              </div>
              <div className="mt-2 space-y-1 text-[10px]">
                {CATEGORY_DISTRIBUTION.map((d, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feed 3: Recent Activity Feed */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <h4 className="text-xs font-bold text-foreground mb-3 pb-2 border-b border-border">
                Recent Report Activity
              </h4>
              <div className="space-y-3">
                {RECENT_ACTIVITIES.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {act.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground text-[11px] truncate">
                        {act.user}
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-snug">
                        {act.action}
                      </p>
                      <span className="text-[9px] text-muted-foreground/80 font-medium">
                        {act.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL 1: Create New Report Definition */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Define New Sustainability Report</DialogTitle>
              <DialogDescription>
                Register a new controlled reporting disclosure template into the statutory compliance catalogue.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground">Report Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Extended Producer Responsibility (EPR) Battery Manifest"
                  value={newReportInput.name}
                  onChange={(e) => setNewReportInput({ ...newReportInput, name: e.target.value })}
                  className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground">Category</label>
                  <select
                    value={newReportInput.category}
                    onChange={(e) =>
                      setNewReportInput({
                        ...newReportInput,
                        category: e.target.value as any,
                      })
                    }
                    className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                  >
                    <option value="ESG">ESG</option>
                    <option value="Carbon & GHG">Carbon & GHG</option>
                    <option value="Energy">Energy</option>
                    <option value="Water & ZLD">Water & ZLD</option>
                    <option value="Waste & Recycling">Waste & Recycling</option>
                    <option value="Compliance & Legal">Compliance & Legal</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-foreground">Frequency</label>
                  <select
                    value={newReportInput.frequency}
                    onChange={(e) =>
                      setNewReportInput({
                        ...newReportInput,
                        frequency: e.target.value as any,
                      })
                    }
                    className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                    <option value="On-Demand">On-Demand</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground">Primary Format</label>
                  <select
                    value={newReportInput.format}
                    onChange={(e) =>
                      setNewReportInput({
                        ...newReportInput,
                        format: e.target.value as any,
                      })
                    }
                    className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                  >
                    <option value="PDF">PDF</option>
                    <option value="XLSX">Excel (.xlsx)</option>
                    <option value="CSV">CSV</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-foreground">Statutory Framework</label>
                  <input
                    type="text"
                    placeholder="e.g., BRSR Core / CPCB Rules"
                    value={newReportInput.framework}
                    onChange={(e) =>
                      setNewReportInput({ ...newReportInput, framework: e.target.value })
                    }
                    className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground">Purpose & Description</label>
                <textarea
                  rows={2}
                  placeholder="Outline the disclosure boundary, legal mandate, and verified audit indicators..."
                  value={newReportInput.purpose}
                  onChange={(e) =>
                    setNewReportInput({ ...newReportInput, purpose: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                />
              </div>

              <DialogFooter className="pt-2">
                <ErpButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateOpen(false)}
                >
                  Cancel
                </ErpButton>
                <ErpButton type="submit" size="sm">
                  Register Template
                </ErpButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* MODAL 2: Configure Schedule */}
        <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Configure Report Delivery Schedule</DialogTitle>
              <DialogDescription>
                Automate periodic compilation and dispatch of verified sustainability disclosures.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground">Target Report</label>
                <select
                  value={newScheduleInput.reportId}
                  onChange={(e) =>
                    setNewScheduleInput({ ...newScheduleInput, reportId: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                >
                  {reportsList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground">Delivery Frequency</label>
                  <select
                    value={newScheduleInput.frequency}
                    onChange={(e) =>
                      setNewScheduleInput({ ...newScheduleInput, frequency: e.target.value })
                    }
                    className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                  >
                    <option>Daily Digest</option>
                    <option>Weekly (Monday 8 AM)</option>
                    <option>Monthly (1st Day)</option>
                    <option>Quarterly (Q-End)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-foreground">Attached Format</label>
                  <select
                    value={newScheduleInput.format}
                    onChange={(e) =>
                      setNewScheduleInput({ ...newScheduleInput, format: e.target.value })
                    }
                    className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                  >
                    <option>PDF</option>
                    <option>XLSX</option>
                    <option>CSV</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground">Recipient Emails *</label>
                <input
                  type="text"
                  required
                  placeholder="auditors@deloitte.com, board@magnertia.com"
                  value={newScheduleInput.recipients}
                  onChange={(e) =>
                    setNewScheduleInput({ ...newScheduleInput, recipients: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                />
              </div>

              <DialogFooter className="pt-2">
                <ErpButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setScheduleOpen(false)}
                >
                  Cancel
                </ErpButton>
                <ErpButton type="submit" size="sm">
                  Activate Schedule
                </ErpButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* MODAL 3: Share Report */}
        <Dialog open={shareOpen} onOpenChange={setShareOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Share Controlled Sustainability Dossier</DialogTitle>
              <DialogDescription>
                Grant secure, audit-logged access to external certifying auditors or regulatory authorities.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleShareSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground">Report to Share</label>
                <select
                  value={newShareInput.reportId}
                  onChange={(e) =>
                    setNewShareInput({ ...newShareInput, reportId: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                >
                  {reportsList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground">Share With (Email / Team) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., dnv-gl-assurance@partner.com"
                  value={newShareInput.sharedWith}
                  onChange={(e) =>
                    setNewShareInput({ ...newShareInput, sharedWith: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground">Access Permissions</label>
                <select
                  value={newShareInput.accessLevel}
                  onChange={(e) =>
                    setNewShareInput({ ...newShareInput, accessLevel: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                >
                  <option>View & Export Only</option>
                  <option>View Only (Watermarked)</option>
                  <option>Full Audit Working Papers Access</option>
                </select>
              </div>

              <DialogFooter className="pt-2">
                <ErpButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShareOpen(false)}
                >
                  Cancel
                </ErpButton>
                <ErpButton type="submit" size="sm">
                  Grant Access & Share
                </ErpButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* MODAL 4: Live Report Preview */}
        {previewReport && (
          <Dialog open={!!previewReport} onOpenChange={() => setPreviewReport(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-base font-bold text-foreground">
                    {previewReport.name}
                  </DialogTitle>
                  <span className="font-mono text-xs text-muted-foreground">
                    {previewReport.code}
                  </span>
                </div>
                <DialogDescription>
                  Verified audit preview of compiled disclosure tables and corporate governance records.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-xs py-2">
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/40 p-3 text-center">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">
                      Framework
                    </span>
                    <div className="font-bold text-foreground mt-0.5">
                      {previewReport.framework}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">
                      Classification
                    </span>
                    <div className="font-bold text-emerald-600 mt-0.5">
                      {previewReport.confidentiality}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">
                      Compiled Records
                    </span>
                    <div className="font-bold text-foreground mt-0.5">
                      {previewReport.recordCount} Parameters
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-3.5 space-y-2">
                  <h5 className="font-bold text-foreground text-xs">Executive Audit Summary</h5>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    {previewReport.purpose}
                  </p>
                  <div className="flex items-center gap-3 pt-2 text-[10px] text-muted-foreground border-t border-border/60">
                    <span>Generated by: <strong>{previewReport.generatedBy}</strong></span>
                    <span>•</span>
                    <span>Date: <strong>{previewReport.lastGenerated}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">ISAE 3000 Assurance Ready</span>
                  </div>
                </div>

                <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-foreground mb-2">
                    <span>Sample Disclosed Indicators (Live Query)</span>
                    <span className="text-emerald-600">Status: Verified</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[10px] text-muted-foreground">
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span>Scope 1 Stationary Combustion (Natural Gas / Diesel)</span>
                      <span className="font-bold text-foreground">342.8 tCO2e</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span>Scope 2 Grid Electricity Consumption (Location-Based)</span>
                      <span className="font-bold text-foreground">905.2 tCO2e</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span>Solar On-Site Wheeled Power Generation</span>
                      <span className="font-bold text-emerald-600">842 MWh (48.2%)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Total Campus Water Withdrawn vs. Recycled</span>
                      <span className="font-bold text-foreground">2.16 ML (38% Reused)</span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between sm:justify-between pt-2">
                <ErpButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Printing report preview...")}
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Document</span>
                </ErpButton>

                <div className="flex items-center gap-2">
                  <ErpButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewReport(null)}
                  >
                    Close
                  </ErpButton>
                  <ErpButton
                    size="sm"
                    onClick={() => {
                      toast.success(`Exported ${previewReport.name} as ${previewReport.format}.`);
                      setPreviewReport(null);
                    }}
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download {previewReport.format}</span>
                  </ErpButton>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppShell>
  );
}
