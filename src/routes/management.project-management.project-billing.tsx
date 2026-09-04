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
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  Receipt,
  Hourglass,
  FileSpreadsheet,
  Share2,
  Edit2,
  Eye,
  MoreVertical,
  Check,
  Building2,
  FileCheck,
  Briefcase,
  HelpCircle,
  ArrowRight,
  X,
  Printer,
  Trash2,
  ExternalLink,
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

export interface BillingItem {
  id: string;
  code: string;
  milestoneDesc: string;
  type: "Milestone" | "Progress" | "Advance" | "Retention" | "T&M";
  billingDate: string;
  grossAmount: number;
  tax: number;
  retention: number;
  netAmount: number;
  invoiceNo: string;
  status: "Paid" | "Partially Paid" | "Pending Approval" | "Draft" | "Invoiced" | "Overdue";
  receivedAmount: number;
}

export const INITIAL_BILLINGS: BillingItem[] = [
  {
    id: "PB-2026-0001",
    code: "PB-001",
    milestoneDesc: "M-001 Project Kickoff",
    type: "Milestone",
    billingDate: "15 Apr 2026",
    grossAmount: 2500000,
    tax: 450000,
    retention: 125000,
    netAmount: 2825000,
    invoiceNo: "INV-2026-0001",
    status: "Paid",
    receivedAmount: 2825000,
  },
  {
    id: "PB-2026-0002",
    code: "PB-002",
    milestoneDesc: "M-002 Design Complete",
    type: "Milestone",
    billingDate: "15 May 2026",
    grossAmount: 3000000,
    tax: 540000,
    retention: 150000,
    netAmount: 3390000,
    invoiceNo: "INV-2026-0002",
    status: "Paid",
    receivedAmount: 3390000,
  },
  {
    id: "PB-2026-0003",
    code: "PB-003",
    milestoneDesc: "M-003 Procurement Complete",
    type: "Milestone",
    billingDate: "15 Jul 2026",
    grossAmount: 4500000,
    tax: 810000,
    retention: 225000,
    netAmount: 5085000,
    invoiceNo: "INV-2026-0003",
    status: "Partially Paid",
    receivedAmount: 810000,
  },
  {
    id: "PB-2026-0004",
    code: "PB-004",
    milestoneDesc: "Progress Billing - Production",
    type: "Progress",
    billingDate: "30 Sep 2026",
    grossAmount: 2450000,
    tax: 441000,
    retention: 122500,
    netAmount: 2768500,
    invoiceNo: "-",
    status: "Pending Approval",
    receivedAmount: 0,
  },
  {
    id: "PB-2026-0005",
    code: "PB-005",
    milestoneDesc: "Progress Billing - Installation",
    type: "Progress",
    billingDate: "15 Oct 2026",
    grossAmount: 1800000,
    tax: 324000,
    retention: 90000,
    netAmount: 2034000,
    invoiceNo: "-",
    status: "Draft",
    receivedAmount: 0,
  },
  {
    id: "PB-2026-0006",
    code: "PB-006",
    milestoneDesc: "Mobilization Advance Received",
    type: "Advance",
    billingDate: "01 Mar 2026",
    grossAmount: 2000000,
    tax: 360000,
    retention: 0,
    netAmount: 2360000,
    invoiceNo: "INV-2026-ADV-1",
    status: "Paid",
    receivedAmount: 2360000,
  },
  {
    id: "PB-2026-0007",
    code: "PB-007",
    milestoneDesc: "Retention Invoice - M-003",
    type: "Retention",
    billingDate: "15 Aug 2026",
    grossAmount: 225000,
    tax: 40500,
    retention: 0,
    netAmount: 265500,
    invoiceNo: "-",
    status: "Draft",
    receivedAmount: 0,
  },
  {
    id: "PB-2026-0008",
    code: "PB-008",
    milestoneDesc: "Engineering Change Order ECO-01",
    type: "T&M",
    billingDate: "20 Jun 2026",
    grossAmount: 320000,
    tax: 57600,
    retention: 0,
    netAmount: 377600,
    invoiceNo: "INV-2026-0008",
    status: "Overdue",
    receivedAmount: 0,
  },
  {
    id: "PB-2026-0009",
    code: "PB-009",
    milestoneDesc: "Site Pre-commissioning Survey",
    type: "T&M",
    billingDate: "10 Aug 2026",
    grossAmount: 250000,
    tax: 45000,
    retention: 0,
    netAmount: 295000,
    invoiceNo: "INV-2026-0009",
    status: "Overdue",
    receivedAmount: 0,
  },
  {
    id: "PB-2026-010",
    code: "PB-010",
    milestoneDesc: "M-004 Hardware FAT Complete",
    type: "Milestone",
    billingDate: "28 Aug 2026",
    grossAmount: 1500000,
    tax: 270000,
    retention: 75000,
    netAmount: 1695000,
    invoiceNo: "INV-2026-0010",
    status: "Invoiced",
    receivedAmount: 0,
  },
  {
    id: "PB-2026-011",
    code: "PB-011",
    milestoneDesc: "Civil Foundation & Conduits",
    type: "Progress",
    billingDate: "12 Jul 2026",
    grossAmount: 1200000,
    tax: 216000,
    retention: 60000,
    netAmount: 1356000,
    invoiceNo: "INV-2026-0011",
    status: "Paid",
    receivedAmount: 1356000,
  },
  {
    id: "PB-2026-012",
    code: "PB-012",
    milestoneDesc: "High Voltage Cable Laying",
    type: "Progress",
    billingDate: "25 Aug 2026",
    grossAmount: 950000,
    tax: 171000,
    retention: 47500,
    netAmount: 1073500,
    invoiceNo: "INV-2026-0012",
    status: "Invoiced",
    receivedAmount: 0,
  },
  {
    id: "PB-2026-013",
    code: "PB-013",
    milestoneDesc: "Substation Transformer Hookup",
    type: "Progress",
    billingDate: "05 Sep 2026",
    grossAmount: 1400000,
    tax: 252000,
    retention: 70000,
    netAmount: 1582000,
    invoiceNo: "-",
    status: "Pending Approval",
    receivedAmount: 0,
  },
  {
    id: "PB-2026-014",
    code: "PB-014",
    milestoneDesc: "SCADA Integration Software License",
    type: "Milestone",
    billingDate: "18 Jun 2026",
    grossAmount: 800000,
    tax: 144000,
    retention: 0,
    netAmount: 944000,
    invoiceNo: "INV-2026-0014",
    status: "Paid",
    receivedAmount: 944000,
  },
  {
    id: "PB-2026-015",
    code: "PB-015",
    milestoneDesc: "Specialized Field Technician Support",
    type: "T&M",
    billingDate: "28 Jul 2026",
    grossAmount: 420000,
    tax: 75600,
    retention: 0,
    netAmount: 495600,
    invoiceNo: "INV-2026-0015",
    status: "Paid",
    receivedAmount: 495600,
  },
  {
    id: "PB-2026-016",
    code: "PB-016",
    milestoneDesc: "Retention Release - M-001 Kickoff",
    type: "Retention",
    billingDate: "15 Jun 2026",
    grossAmount: 125000,
    tax: 22500,
    retention: 0,
    netAmount: 147500,
    invoiceNo: "INV-2026-RET-1",
    status: "Paid",
    receivedAmount: 147500,
  },
  {
    id: "PB-2026-017",
    code: "PB-017",
    milestoneDesc: "Charger Dispenser Unit Batch A",
    type: "Progress",
    billingDate: "02 Sep 2026",
    grossAmount: 1650000,
    tax: 297000,
    retention: 82500,
    netAmount: 1864500,
    invoiceNo: "-",
    status: "Draft",
    receivedAmount: 0,
  },
  {
    id: "PB-2026-018",
    code: "PB-018",
    milestoneDesc: "Site Safety & Earthing Audit",
    type: "T&M",
    billingDate: "14 Sep 2026",
    grossAmount: 180000,
    tax: 32400,
    retention: 0,
    netAmount: 212400,
    invoiceNo: "-",
    status: "Draft",
    receivedAmount: 0,
  },
];

export const Route = createFileRoute("/management/project-management/project-billing")({
  head: () => ({
    meta: [
      { title: "Project Billing Form · Project Management · Magnertia ERP" },
      {
        name: "description",
        content: "Create, manage, and track project billings and invoices with accurate revenue and receivables.",
      },
    ],
  }),
  component: ProjectBillingFormPage,
});

export function ProjectBillingFormPage() {
  const [billings, setBillings] = useState<BillingItem[]>(INITIAL_BILLINGS);
  const [selectedBilling, setSelectedBilling] = useState<BillingItem>(INITIAL_BILLINGS[3]);
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
  const [filterCustomer, setFilterCustomer] = useState("ABC Energy Solutions Pvt Ltd");
  const [filterContract, setFilterContract] = useState("CTR-2026-041");
  const [filterMilestone, setFilterMilestone] = useState("All Milestones");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterDueDate, setFilterDueDate] = useState("All");
  const [filterTerms, setFilterTerms] = useState("All");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAiBillingOpen, setIsAiBillingOpen] = useState(false);
  const [isAgingModalOpen, setIsAgingModalOpen] = useState(false);
  const [isRetentionModalOpen, setIsRetentionModalOpen] = useState(false);
  const [isOverdueModalOpen, setIsOverdueModalOpen] = useState(false);

  // New Billing Form State
  const [newDesc, setNewDesc] = useState("Progress Billing - Commissioning");
  const [newType, setNewType] = useState<BillingItem["type"]>("Progress");
  const [newGross, setNewGross] = useState(1500000);
  const [newTaxRate, setNewTaxRate] = useState(18);
  const [newRetentionRate, setNewRetentionRate] = useState(5);

  const handleClearFilters = () => {
    setFilterWbs("All WBS");
    setFilterMilestone("All Milestones");
    setFilterType("All");
    setFilterStatus("All Status");
    setFilterDueDate("All");
    setFilterTerms("All");
    setSearchQuery("");
    setActiveKpiFilter(null);
    setCurrentPage(1);
    toast.info("Billing filters reset to default.");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setBillings(INITIAL_BILLINGS);
      setSelectedBilling(INITIAL_BILLINGS[3]);
      handleClearFilters();
      toast.success("Billing register and accounts receivable synchronized from ERP.");
    }, 450);
  };

  const handleCreateBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taxAmt = Math.round((newGross * newTaxRate) / 100);
    const retAmt = Math.round((newGross * newRetentionRate) / 100);
    const netAmt = newGross + taxAmt;

    const newItem: BillingItem = {
      id: `PB-2026-00${billings.length + 1}`,
      code: `PB-0${billings.length + 1}`,
      milestoneDesc: newDesc,
      type: newType,
      billingDate: "30 Sep 2026",
      grossAmount: newGross,
      tax: taxAmt,
      retention: retAmt,
      netAmount: netAmt,
      invoiceNo: "-",
      status: "Draft",
      receivedAmount: 0,
    };

    setBillings((prev) => [newItem, ...prev]);
    setSelectedBilling(newItem);
    setIsCreateOpen(false);
    toast.success(`Billing record ${newItem.code} created for ₹ ${(netAmt / 100000).toFixed(2)} L (Draft)`);
  };

  const handleSaveEditBilling = (e: React.FormEvent) => {
    e.preventDefault();
    setBillings((prev) =>
      prev.map((item) => (item.id === selectedBilling.id ? selectedBilling : item)),
    );
    setIsEditOpen(false);
    toast.success(`Billing ${selectedBilling.code} updated successfully.`);
  };

  const handleDeleteBilling = (id: string) => {
    setBillings((prev) => prev.filter((b) => b.id !== id));
    if (selectedBilling.id === id) {
      setSelectedBilling(billings[1] || billings[0]);
    }
    toast.success(`Removed billing record ${id}.`);
  };

  const handleExportCsv = () => {
    const header = "Billing ID,Billing Code,Milestone / Description,Billing Type,Billing Date,Gross Amount,Tax,Retention,Net Amount,Invoice No,Status,Amount Received\n";
    const rows = billings
      .map(
        (b) =>
          `"${b.id}","${b.code}","${b.milestoneDesc}","${b.type}","${b.billingDate}",${b.grossAmount},${b.tax},${b.retention},${b.netAmount},"${b.invoiceNo}","${b.status}",${b.receivedAmount}`,
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PRJ-2026-0195_Billing_Register.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Billing register exported to CSV.");
  };

  const handleExportDossier = () => {
    const text = `=====================================================
PROJECT BILLING & REVENUE SCHEDULE
Project: Smart EV Charging Infrastructure (PRJ-2026-0195)
Customer: ABC Energy Solutions Pvt Ltd
Contract: CTR-2026-041 (Value: ₹ 250.00 Lakhs)
Generated: ${new Date().toLocaleString()}
=====================================================

FINANCIAL SUMMARY:
• Contract Value:       ₹ 250.00 Lakhs
• Total Billed:         ₹ 142.50 Lakhs (57.0%)
• Cash Received:        ₹ 118.00 Lakhs (82.8% of billed)
• Current Outstanding:  ₹ 24.50 Lakhs
• Retention Held:       ₹ 7.10 Lakhs (5.0%)
• Invoicing Efficiency: 94.2%

BILLING ENTRIES:
-----------------------------------------------------
${billings
  .map(
    (b) =>
      `[${b.id} | ${b.code}] ${b.milestoneDesc}
  Type: ${b.type} | Date: ${b.billingDate} | Status: ${b.status}
  Gross: ₹ ${b.grossAmount.toLocaleString("en-IN")} | Tax: ₹ ${b.tax.toLocaleString("en-IN")} | Retention: ₹ ${b.retention.toLocaleString("en-IN")}
  Net Value: ₹ ${b.netAmount.toLocaleString("en-IN")} | Invoice: ${b.invoiceNo}
  Received: ₹ ${b.receivedAmount.toLocaleString("en-IN")} | Balance: ₹ ${(b.netAmount - b.receivedAmount).toLocaleString("en-IN")}`,
  )
  .join("\n\n")}
=====================================================`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PRJ-2026-0195_Billing_Dossier.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Billing Dossier (.TXT) downloaded.");
  };

  // Filtered billings
  const filteredBillings = useMemo(() => {
    return billings.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.milestoneDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === "All Status" || item.status === filterStatus;
      const matchesType = filterType === "All" || item.type === filterType;

      const matchesKpi =
        !activeKpiFilter
          ? true
          : activeKpiFilter === "billed"
          ? item.status === "Paid" || item.status === "Partially Paid" || item.status === "Invoiced"
          : activeKpiFilter === "received"
          ? item.receivedAmount > 0
          : activeKpiFilter === "outstanding"
          ? item.netAmount - item.receivedAmount > 0 && item.status !== "Draft"
          : activeKpiFilter === "retention"
          ? item.retention > 0 || item.type === "Retention"
          : true;

      return matchesSearch && matchesStatus && matchesType && matchesKpi;
    });
  }, [billings, searchQuery, filterStatus, filterType, activeKpiFilter]);

  // Paginated billings
  const totalPages = Math.ceil(filteredBillings.length / itemsPerPage) || 1;
  const paginatedBillings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBillings.slice(start, start + itemsPerPage);
  }, [filteredBillings, currentPage, itemsPerPage]);

  return (
    <AppShell
      title="Project Billing Form"
      breadcrumb="Management > Project Management > Project Billing"
      description="Create, manage, and track project billings and invoices with accurate revenue and receivables."
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
                  Project Billing Form
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
                  New Billing
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
                    toast.success("Billing statement emailed to client finance.");
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
                      <FileText className="mr-2 h-4 w-4 text-blue-600" /> Export Billing Dossier (.TXT)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsInvoiceOpen(true)} className="cursor-pointer">
                      <Receipt className="mr-2 h-4 w-4 text-primary" /> Generate Project Invoice
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Billing milestones saved successfully!");
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
             2. CONTEXT FILTER BAR (3 Rows with Clear Filters)
             ==================================================================== */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
            {/* Row 1: Project, Project Code, WBS, Billing Period, Currency */}
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
                  Billing Period
                </span>
                <div className="h-8 px-2 flex items-center justify-between font-medium text-xs bg-slate-50 dark:bg-slate-800 rounded-md border border-input mt-0.5">
                  <span className="truncate">01 Sep 2026 - 30 Sep 2026</span>
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Currency
                </span>
                <select className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5">
                  <option>INR - ₹</option>
                  <option>USD - $</option>
                </select>
              </div>
            </div>

            {/* Row 2: Customer, Contract, Milestone, Due Date, Clear Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs pt-1">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Customer <span className="text-rose-500">*</span>
                </span>
                <select
                  value={filterCustomer}
                  onChange={(e) => setFilterCustomer(e.target.value)}
                  className="h-8 w-full text-xs font-semibold rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>ABC Energy Solutions Pvt Ltd</option>
                  <option>State Power Distribution Corp</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Contract <span className="text-rose-500">*</span>
                </span>
                <div className="h-8 px-2.5 flex items-center font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 rounded-md border border-input mt-0.5">
                  CTR-2026-041
                </div>
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
                  <option>All Milestones</option>
                  <option>M-001 Project Kickoff</option>
                  <option>M-002 Design Complete</option>
                  <option>M-003 Procurement Complete</option>
                  <option>M-004 Hardware FAT Complete</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Due Date
                </span>
                <select
                  value={filterDueDate}
                  onChange={(e) => setFilterDueDate(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All</option>
                  <option>Due in 7 Days</option>
                  <option>Due in 30 Days</option>
                  <option>Overdue</option>
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

            {/* Row 3: Billing Type, Billing Status, Payment Terms */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Billing Type
                </span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All</option>
                  <option>Milestone</option>
                  <option>Progress</option>
                  <option>Advance</option>
                  <option>Retention</option>
                  <option>T&M</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Billing Status
                </span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All Status</option>
                  <option>Paid</option>
                  <option>Partially Paid</option>
                  <option>Pending Approval</option>
                  <option>Draft</option>
                  <option>Invoiced</option>
                  <option>Overdue</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Payment Terms
                </span>
                <select
                  value={filterTerms}
                  onChange={(e) => setFilterTerms(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All</option>
                  <option>Net 30</option>
                  <option>Net 45</option>
                  <option>Immediate</option>
                </select>
              </div>
            </div>
          </div>

          {/* ====================================================================
             3. SIX METRIC KPI STATUS CARDS (Interactive Click-to-Filter)
             ==================================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Contract Value */}
            <div
              onClick={() => {
                setActiveKpiFilter(null);
                handleClearFilters();
                toast.info("Showing all contract billing lines.");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-blue-500/60 hover:shadow-xs",
                activeKpiFilter === null && "ring-2 ring-primary/60",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Contract Value
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  ₹ 250.00 L
                </span>
                <span className="text-[10px] text-primary font-semibold block mt-1">
                  100% of Contract
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
            </div>

            {/* 2. Billed Value */}
            <div
              onClick={() => {
                setActiveKpiFilter("billed");
                toast.info("Filtered for invoiced & billed lines.");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-emerald-500/60 hover:shadow-xs",
                activeKpiFilter === "billed" && "ring-2 ring-emerald-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Billed Value
                </span>
                <span className="text-xl font-bold font-mono text-emerald-600 mt-0.5 block">
                  ₹ 142.50 L
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  57.00% of Contract
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Receipt className="h-5 w-5" />
              </div>
            </div>

            {/* 3. Amount Received */}
            <div
              onClick={() => {
                setActiveKpiFilter("received");
                toast.info("Filtered for billings with received payments.");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-purple-500/60 hover:shadow-xs",
                activeKpiFilter === "received" && "ring-2 ring-purple-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Amount Received
                </span>
                <span className="text-xl font-bold font-mono text-purple-600 mt-0.5 block">
                  ₹ 118.00 L
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block mt-1">
                  82.80% of Billed
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Wallet className="h-5 w-5" />
              </div>
            </div>

            {/* 4. Outstanding */}
            <div
              onClick={() => {
                setActiveKpiFilter("outstanding");
                toast.info("Filtered for outstanding receivables.");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-amber-500/60 hover:shadow-xs",
                activeKpiFilter === "outstanding" && "ring-2 ring-amber-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Outstanding
                </span>
                <span className="text-xl font-bold font-mono text-amber-600 mt-0.5 block">
                  ₹ 24.50 L
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block mt-1">
                  17.20% of Billed
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Hourglass className="h-5 w-5" />
              </div>
            </div>

            {/* 5. Retention */}
            <div
              onClick={() => {
                setActiveKpiFilter("retention");
                toast.info("Filtered for retention deductions.");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-rose-500/60 hover:shadow-xs",
                activeKpiFilter === "retention" && "ring-2 ring-rose-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Retention
                </span>
                <span className="text-xl font-bold font-mono text-rose-600 mt-0.5 block">
                  ₹ 7.10 L
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block mt-1">
                  2.84% of Contract
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            {/* 6. Billing Efficiency */}
            <div
              onClick={() => {
                setIsAiBillingOpen(true);
              }}
              className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-cyan-500/60 hover:shadow-xs"
              title="Open Billing Efficiency Diagnostics"
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Billing Efficiency
                </span>
                <span className="text-xl font-bold font-mono text-cyan-600 mt-0.5 block">
                  94.2%
                </span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold block mt-1">
                  On-Time Invoicing
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* ====================================================================
             4. BILLING ANALYTICS ROW (4 Balanced Cards: 3 cols each = 12 cols)
             ==================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {/* Card 1: Billing vs Collection Trend */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Billing vs Collection Trend (6M)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-center gap-4 text-[10px] font-semibold">
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-blue-600" /> Billed (₹ L)</span>
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Received (₹ L)</span>
                </div>

                <div className="h-36 w-full">
                  <svg className="h-full w-full" viewBox="0 0 280 130">
                    <line x1="25" y1="20" x2="270" y2="20" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="25" y1="50" x2="270" y2="50" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="25" y1="80" x2="270" y2="80" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="25" y1="110" x2="270" y2="110" stroke="#e2e8f0" strokeDasharray="2 2" />

                    <text x="5" y="24" fontSize="7" fill="#94a3b8">40</text>
                    <text x="5" y="54" fontSize="7" fill="#94a3b8">30</text>
                    <text x="5" y="84" fontSize="7" fill="#94a3b8">20</text>
                    <text x="10" y="114" fontSize="7" fill="#94a3b8">10</text>

                    {/* Billed line (Blue) */}
                    <polyline fill="none" stroke="#2563eb" strokeWidth="1.5" points="35,80 75,72 115,64 155,50 195,35 245,58" />
                    {/* Received line (Green) */}
                    <polyline fill="none" stroke="#10b981" strokeWidth="1.5" points="35,96 75,88 115,78 155,62 195,44 245,45" />

                    <circle cx="245" cy="58" r="2.5" fill="#2563eb" />
                    <circle cx="245" cy="45" r="2.5" fill="#10b981" />

                    <text x="248" y="56" fontSize="7" fill="#2563eb" fontWeight="bold">24.5</text>
                    <text x="248" y="43" fontSize="7" fill="#10b981" fontWeight="bold">30.0</text>

                    <text x="28" y="125" fontSize="7.5" fill="#64748b">Apr 26</text>
                    <text x="68" y="125" fontSize="7.5" fill="#64748b">May 26</text>
                    <text x="108" y="125" fontSize="7.5" fill="#64748b">Jun 26</text>
                    <text x="148" y="125" fontSize="7.5" fill="#64748b">Jul 26</text>
                    <text x="188" y="125" fontSize="7.5" fill="#64748b">Aug 26</text>
                    <text x="238" y="125" fontSize="7.5" fill="#64748b">Sep 26</text>
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Billing by Type */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Billing by Type
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="96" />
                    <circle cx="50" cy="50" r="38" stroke="#06b6d4" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="183" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="212" />
                    <circle cx="50" cy="50" r="38" stroke="#eab308" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="225" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[11px] font-bold font-mono text-slate-900 dark:text-white">₹ 142.50 L</span>
                    <span className="text-[7.5px] text-muted-foreground uppercase font-semibold">Total</span>
                  </div>
                </div>

                <div className="space-y-1 text-[10px]">
                  {[
                    { name: "Milestone", pct: "40.5%", color: "bg-blue-500", type: "Milestone" },
                    { name: "Progress", pct: "36.6%", color: "bg-emerald-500", type: "Progress" },
                    { name: "T&M", pct: "12.2%", color: "bg-cyan-500", type: "T&M" },
                    { name: "Advance", pct: "5.4%", color: "bg-amber-500", type: "Advance" },
                    { name: "Retention", pct: "5.3%", color: "bg-yellow-500", type: "Retention" },
                  ].map((t) => (
                    <div
                      key={t.name}
                      onClick={() => {
                        setFilterType(t.type);
                        toast.info(`Filtered for ${t.name} billing type.`);
                      }}
                      className="flex justify-between items-center p-0.5 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                      title={`Filter by ${t.name}`}
                    >
                      <span className="flex items-center gap-1">
                        <div className={cn("h-2 w-2 rounded-full", t.color)} /> {t.name}
                      </span>
                      <span className="font-mono text-muted-foreground font-semibold">{t.pct}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Invoice Status */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Invoice Status Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#f97316" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="40" />
                    <circle cx="50" cy="50" r="38" stroke="#06b6d4" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="65" />
                    <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="156" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="192" />
                    <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="220" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">47</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Total</span>
                  </div>
                </div>

                <div className="space-y-1 text-[10px]">
                  {[
                    { name: "Draft", count: "8 (17.0%)", color: "bg-blue-500", status: "Draft" },
                    { name: "Pending", count: "5 (10.6%)", color: "bg-orange-500", status: "Pending Approval" },
                    { name: "Invoiced", count: "18 (38.3%)", color: "bg-cyan-500", status: "Invoiced" },
                    { name: "Partially Paid", count: "7 (14.9%)", color: "bg-purple-500", status: "Partially Paid" },
                    { name: "Paid", count: "21 (44.7%)", color: "bg-emerald-500", status: "Paid" },
                    { name: "Overdue", count: "4 (8.5%)", color: "bg-rose-500", status: "Overdue" },
                  ].map((s) => (
                    <div
                      key={s.name}
                      onClick={() => {
                        setFilterStatus(s.status);
                        toast.info(`Filtered for ${s.name} status.`);
                      }}
                      className="flex justify-between items-center p-0.5 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                      title={`Filter by ${s.name}`}
                    >
                      <span className="flex items-center gap-1">
                        <div className={cn("h-2 w-2 rounded-full", s.color)} /> {s.name}
                      </span>
                      <span className={cn("font-mono font-semibold", s.name === "Overdue" ? "text-rose-600 font-bold" : "text-muted-foreground")}>
                        {s.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Receivables Aging */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Receivables Aging
                </CardTitle>
                <span className="text-[9px] text-muted-foreground font-semibold">Amount (₹ L)</span>
              </CardHeader>
              <CardContent className="p-3 space-y-2.5">
                {[
                  { label: "Current", val: "72.00", pct: 90, color: "bg-emerald-500" },
                  { label: "1-30 Days", val: "24.00", pct: 40, color: "bg-amber-400" },
                  { label: "31-60 Days", val: "12.00", pct: 25, color: "bg-orange-500" },
                  { label: "61-90 Days", val: "6.00", pct: 15, color: "bg-rose-500" },
                  { label: ">90 Days", val: "3.00", pct: 8, color: "bg-rose-700" },
                ].map((row) => (
                  <div
                    key={row.label}
                    onClick={() => {
                      setIsAgingModalOpen(true);
                    }}
                    className="space-y-0.5 text-[10px] p-0.5 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                    title={`View ${row.label} aging`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{row.label}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{row.val}</span>
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
             5. MASTER BILLING REGISTER TABLE (12 Columns, Full Width)
             ==================================================================== */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
            <CardHeader className="p-4 pb-2 border-b border-border/40">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-primary" />
                  Billing Register Table
                  <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                    {filteredBillings.length} Records
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search billing ID, milestone, invoice..."
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
                    title="Clear filters"
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
                    Add Billing
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full table-fixed text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/40 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      <th className="p-2.5 pl-4 w-24">Billing ID</th>
                      <th className="p-2.5 w-24 font-mono">Code</th>
                      <th className="p-2.5 w-56">Milestone / Description</th>
                      <th className="p-2.5 w-24">Billing Type</th>
                      <th className="p-2.5 w-24 font-mono">Date</th>
                      <th className="p-2.5 font-mono text-right w-28">Gross (₹)</th>
                      <th className="p-2.5 font-mono text-right w-24">Tax (₹)</th>
                      <th className="p-2.5 font-mono text-right w-24">Retention (₹)</th>
                      <th className="p-2.5 font-mono text-right w-28">Net (₹)</th>
                      <th className="p-2.5 w-28 font-mono">Invoice No.</th>
                      <th className="p-2.5 w-24">Status</th>
                      <th className="p-2.5 font-mono text-right w-28">Received (₹)</th>
                      <th className="p-2.5 pr-4 text-center w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {paginatedBillings.map((item) => (
                      <tr
                        key={item.id}
                        className={cn(
                          "hover:bg-muted/20 transition-colors cursor-pointer",
                          selectedBilling.id === item.id ? "bg-primary/5 font-medium" : "",
                        )}
                        onClick={() => setSelectedBilling(item)}
                      >
                        <td className="p-2.5 pl-3 font-mono font-bold text-primary text-[11px] whitespace-nowrap">
                          {item.id}
                        </td>
                        <td className="p-2.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {item.code}
                        </td>
                        <td className="p-2.5 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                          {item.milestoneDesc}
                        </td>
                        <td className="p-2.5">{item.type}</td>
                        <td className="p-2.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                          {item.billingDate}
                        </td>
                        <td className="p-2.5 font-mono text-right">{item.grossAmount.toLocaleString("en-IN")}</td>
                        <td className="p-2.5 font-mono text-right">{item.tax.toLocaleString("en-IN")}</td>
                        <td className="p-2.5 font-mono text-right">{item.retention.toLocaleString("en-IN")}</td>
                        <td className="p-2.5 font-mono font-bold text-right text-slate-900 dark:text-white">
                          {item.netAmount.toLocaleString("en-IN")}
                        </td>
                        <td className="p-2.5 font-mono font-semibold text-slate-600 dark:text-slate-400">
                          {item.invoiceNo}
                        </td>
                        <td className="p-2.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] px-1.5 py-0.2",
                              item.status === "Paid"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                : item.status === "Partially Paid"
                                ? "bg-amber-50 text-amber-700 border-amber-300"
                                : item.status === "Pending Approval"
                                ? "bg-blue-50 text-blue-700 border-blue-300"
                                : item.status === "Overdue"
                                ? "bg-rose-50 text-rose-700 border-rose-300 font-bold"
                                : item.status === "Invoiced"
                                ? "bg-cyan-50 text-cyan-700 border-cyan-300"
                                : "bg-slate-50 text-slate-700 border-slate-300",
                            )}
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-2.5 font-mono font-bold text-right text-emerald-600">
                          {item.receivedAmount.toLocaleString("en-IN")}
                        </td>
                        <td className="p-2.5 pr-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBilling(item);
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
                                setSelectedBilling(item);
                                setIsEditOpen(true);
                              }}
                              className="p-1 hover:text-primary cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBilling(item.id);
                              }}
                              className="p-1 hover:text-rose-600 cursor-pointer"
                              title="Delete"
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
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredBillings.length)} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredBillings.length)} of {filteredBillings.length} entries
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
             5B. SELECTED BILLING FINANCIAL WORKSPACE (Full 12 Columns)
             ==================================================================== */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
            <CardHeader className="p-4 pb-2 border-b border-border/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 font-mono font-bold text-xs px-2 py-0.5">
                    {selectedBilling.id}
                  </Badge>
                  <span className="font-mono text-xs font-semibold text-muted-foreground">
                    {selectedBilling.code}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedBilling.milestoneDesc}
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-semibold",
                      selectedBilling.status === "Paid"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : selectedBilling.status === "Partially Paid"
                        ? "bg-amber-50 text-amber-700 border-amber-300"
                        : selectedBilling.status === "Pending Approval"
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : selectedBilling.status === "Overdue"
                        ? "bg-rose-50 text-rose-700 border-rose-300 font-bold"
                        : "bg-cyan-50 text-cyan-700 border-cyan-300",
                    )}
                  >
                    {selectedBilling.status}
                  </Badge>
                  <Badge className="bg-slate-800 text-white text-[10px]">
                    {selectedBilling.type}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditOpen(true)}
                    className="h-7 text-xs border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-primary/10"
                  >
                    <Edit2 className="h-3 w-3 mr-1" /> Edit Billing
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`Billing: ${selectedBilling.id} (${selectedBilling.code}) - Net: ₹ ${selectedBilling.netAmount}`);
                      toast.success("Billing details copied to clipboard");
                    }}
                    className="h-7 text-xs border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-primary/10"
                  >
                    <Share2 className="h-3 w-3 mr-1" /> Copy Summary
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setBillings((prev) =>
                        prev.map((b) =>
                          b.id === selectedBilling.id ? { ...b, status: "Pending Approval" } : b,
                        ),
                      );
                      setSelectedBilling({ ...selectedBilling, status: "Pending Approval" });
                      toast.success(`Billing ${selectedBilling.code} submitted for financial approval.`);
                    }}
                    className="h-7 text-xs bg-primary text-white font-semibold cursor-pointer shadow-xs"
                  >
                    Submit for Approval
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: Customer & Contract Overview */}
                <div className="p-3.5 rounded-xl border bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5">
                  <span className="font-bold uppercase text-[10px] tracking-wider text-muted-foreground block">
                    Customer & Contract Details
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Client / Customer</span>
                      <span className="font-semibold text-slate-900 dark:text-white">ABC Energy Solutions</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Contract No.</span>
                      <span className="font-mono text-slate-900 dark:text-white">CTR-2026-041</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Billing Period</span>
                      <span className="font-mono text-slate-900 dark:text-white">01 Sep - 30 Sep</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Payment Due Date</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">30 Oct 2026</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-border/40 flex justify-between">
                      <span className="text-muted-foreground text-[10px]">Official Tax Invoice:</span>
                      <span className="font-mono font-bold text-primary">{selectedBilling.invoiceNo}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Financial Valuation & Tax Breakdown */}
                <div className="p-3.5 rounded-xl border bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5">
                  <span className="font-bold uppercase text-[10px] tracking-wider text-muted-foreground block">
                    Financial Valuation & Taxes
                  </span>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Amount:</span>
                      <span className="font-mono font-semibold">₹ {selectedBilling.grossAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax Amount (18% GST):</span>
                      <span className="font-mono font-semibold">₹ {selectedBilling.tax.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Retention Held (5%):</span>
                      <span className="font-mono font-semibold">₹ {selectedBilling.retention.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t border-border/40 text-sm">
                      <span className="text-slate-900 dark:text-white">Net Billed Amount:</span>
                      <span className="font-mono text-primary">₹ {selectedBilling.netAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-emerald-600 font-medium">Amount Received:</span>
                      <span className="font-mono font-bold text-emerald-600">₹ {selectedBilling.receivedAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-rose-600 font-bold pt-0.5">
                      <span>Outstanding Balance:</span>
                      <span className="font-mono">₹ {(selectedBilling.netAmount - selectedBilling.receivedAmount).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Linked Certifications & Collection Status */}
                <div className="p-3.5 rounded-xl border bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase text-[10px] tracking-wider text-muted-foreground block">
                      Verification & Collection
                    </span>
                    <span className="font-mono font-bold text-emerald-600 text-xs">
                      {Math.round((selectedBilling.receivedAmount / (selectedBilling.netAmount || 1)) * 100)}% Collected
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((selectedBilling.receivedAmount / (selectedBilling.netAmount || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="space-y-1.5 text-xs pt-1">
                    <div className="flex justify-between items-center p-1.5 rounded bg-white dark:bg-slate-900 border">
                      <span className="text-muted-foreground text-[10px]">Work Progress Report</span>
                      <span className="font-mono font-semibold text-primary">WPR-2026-004</span>
                    </div>
                    <div className="flex justify-between items-center p-1.5 rounded bg-white dark:bg-slate-900 border">
                      <span className="text-muted-foreground text-[10px]">Milestone Certificate</span>
                      <span className="font-mono font-semibold text-primary">MC-2026-003</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ====================================================================
             6. BOTTOM 5-CARD ANALYTICS ROW
             ==================================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
            {/* Card 1: Collection Performance */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Collection Performance</span>
                <span className="text-[9px] font-mono text-muted-foreground">This Month</span>
              </div>
              <div className="space-y-1 my-2">
                <div className="flex justify-between text-xs">
                  <div>
                    <span className="text-[9.5px] text-muted-foreground block">Collected</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">₹ 30.00 L</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-muted-foreground block">Target</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">₹ 40.00 L</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-muted-foreground block">Achievement</span>
                    <span className="font-mono font-bold text-emerald-600">75.0%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "75%" }} />
                </div>
              </div>
            </Card>

            {/* Card 2: DSO (Days Sales Outstanding) */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">DSO (Days Sales)</span>
                <span className="text-[9px] font-mono text-muted-foreground">This Month</span>
              </div>
              <div className="flex items-baseline justify-between my-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">28 Days</span>
                <div className="text-right">
                  <span className="text-[9px] text-muted-foreground block">vs Last Month 32 Days</span>
                  <span className="text-[10px] font-bold text-emerald-600">-4 Days</span>
                </div>
              </div>
            </Card>

            {/* Card 3: Retention Summary */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Retention Summary</span>
                <button
                  type="button"
                  onClick={() => setIsRetentionModalOpen(true)}
                  className="text-[9px] text-primary font-bold hover:underline"
                >
                  Manage →
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1 my-2 text-center text-xs">
                <div>
                  <span className="text-[9px] text-muted-foreground block">Total</span>
                  <span className="font-mono font-bold">₹ 7.10 L</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Released</span>
                  <span className="font-mono font-bold text-muted-foreground">₹ 0</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Outstanding</span>
                  <span className="font-mono font-bold text-rose-600">₹ 7.10 L</span>
                </div>
              </div>
            </Card>

            {/* Card 4: Top Overdue Invoices */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Top Overdue Invoices</span>
                <button
                  type="button"
                  onClick={() => setIsOverdueModalOpen(true)}
                  className="text-[9px] text-primary font-bold hover:underline"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-1 my-1 text-[10.5px]">
                <div
                  onClick={() => {
                    const b = billings.find((item) => item.invoiceNo === "INV-2026-0003");
                    if (b) setSelectedBilling(b);
                    toast.info("Selected INV-2026-0003 in billing register");
                  }}
                  className="flex justify-between hover:bg-muted/30 p-0.5 rounded cursor-pointer transition-colors"
                >
                  <span className="font-mono font-medium">INV-2026-0003</span>
                  <span className="font-mono font-bold text-rose-600">₹ 8.10 L <span className="text-[9px] font-normal text-muted-foreground">(15 Days)</span></span>
                </div>
                <div
                  onClick={() => {
                    const b = billings.find((item) => item.invoiceNo === "INV-2026-0008");
                    if (b) setSelectedBilling(b);
                    toast.info("Selected INV-2026-0008 in billing register");
                  }}
                  className="flex justify-between hover:bg-muted/30 p-0.5 rounded cursor-pointer transition-colors"
                >
                  <span className="font-mono font-medium">INV-2026-0008</span>
                  <span className="font-mono font-bold text-rose-600">₹ 3.20 L <span className="text-[9px] font-normal text-muted-foreground">(12 Days)</span></span>
                </div>
                <div
                  onClick={() => {
                    const b = billings.find((item) => item.invoiceNo === "INV-2026-0009");
                    if (b) setSelectedBilling(b);
                    toast.info("Selected INV-2026-0009 in billing register");
                  }}
                  className="flex justify-between hover:bg-muted/30 p-0.5 rounded cursor-pointer transition-colors"
                >
                  <span className="font-mono font-medium">INV-2026-0009</span>
                  <span className="font-mono font-bold text-rose-600">₹ 2.50 L <span className="text-[9px] font-normal text-muted-foreground">(8 Days)</span></span>
                </div>
              </div>
            </Card>

            {/* Card 5: AI Billing Insights */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" /> AI Billing Insights
                </span>
                <button
                  type="button"
                  onClick={() => setIsAiBillingOpen(true)}
                  className="text-[9px] text-primary font-bold hover:underline"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-1 text-[10px]">
                <p className="text-rose-600 font-semibold truncate">⚠️ ₹23.50 L completed work eligible for billing.</p>
                <p className="text-emerald-600 font-semibold truncate">✓ 2 milestones completed but not yet billed.</p>
                <p className="text-amber-600 font-semibold truncate">● INV-2026-0003 is 15 days overdue.</p>
              </div>
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
                  toast.info("Showing complete billing register");
                }}
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                B Billing
              </button>
              <button
                onClick={() => setIsInvoiceOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                I Invoices
              </button>
              <button
                onClick={() => setIsAgingModalOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                R Receivables
              </button>
              <button
                onClick={() => setIsPaymentOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                C Collections
              </button>
              <button
                onClick={() => setIsAiBillingOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                A Analytics
              </button>
            </div>
          </div>

        {/* ====================================================================
           MODALS
           ==================================================================== */}

        {/* 1. Create Project Billing Modal */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Create Project Billing (● DRAFT)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Calculate project billing based on contract milestone, progress, or approved timesheet.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateBillingSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Project:</label>
                  <Input value="PRJ-2026-0195" readOnly className="h-8 text-xs font-mono bg-muted" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Contract:</label>
                  <Input value="CTR-2026-041 (₹ 250.00 L)" readOnly className="h-8 text-xs font-mono bg-muted" />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Milestone / Work Description:</label>
                <Input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold block mb-1">Billing Type:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Progress">Progress</option>
                    <option value="Milestone">Milestone</option>
                    <option value="Advance">Advance</option>
                    <option value="Retention">Retention</option>
                    <option value="T&M">T&M</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Gross Value (₹):</label>
                  <Input
                    type="number"
                    value={newGross}
                    onChange={(e) => setNewGross(Number(e.target.value))}
                    className="h-8 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Retention %:</label>
                  <Input
                    type="number"
                    value={newRetentionRate}
                    onChange={(e) => setNewRetentionRate(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Amount:</span>
                  <span className="font-mono font-semibold">₹ {newGross.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax GST (18%):</span>
                  <span className="font-mono font-semibold">₹ {Math.round((newGross * 18) / 100).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Retention Deducted (5%):</span>
                  <span className="font-mono font-semibold">₹ {Math.round((newGross * newRetentionRate) / 100).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-bold text-primary pt-1 border-t text-xs">
                  <span>Net Invoice Value:</span>
                  <span className="font-mono">₹ {(newGross + Math.round((newGross * 18) / 100)).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Save Draft Billing
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 2. Edit Project Billing Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-primary" />
                Edit Billing: {selectedBilling.code}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update billing amounts, tax deductions, and milestone descriptions.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveEditBilling} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Milestone / Description:</label>
                <Input
                  value={selectedBilling.milestoneDesc}
                  onChange={(e) => setSelectedBilling({ ...selectedBilling, milestoneDesc: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Status:</label>
                  <select
                    value={selectedBilling.status}
                    onChange={(e) => setSelectedBilling({ ...selectedBilling, status: e.target.value as any })}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Invoiced">Invoiced</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Invoice No.:</label>
                  <Input
                    value={selectedBilling.invoiceNo}
                    onChange={(e) => setSelectedBilling({ ...selectedBilling, invoiceNo: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Gross Amount (₹):</label>
                  <Input
                    type="number"
                    value={selectedBilling.grossAmount}
                    onChange={(e) => {
                      const gross = Number(e.target.value);
                      const tax = Math.round(gross * 0.18);
                      const ret = Math.round(gross * 0.05);
                      setSelectedBilling({
                        ...selectedBilling,
                        grossAmount: gross,
                        tax,
                        retention: ret,
                        netAmount: gross + tax,
                      });
                    }}
                    className="h-8 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Received Amount (₹):</label>
                  <Input
                    type="number"
                    value={selectedBilling.receivedAmount}
                    onChange={(e) => setSelectedBilling({ ...selectedBilling, receivedAmount: Number(e.target.value) })}
                    className="h-8 text-xs font-mono font-bold text-emerald-600"
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
          </DialogContent>
        </Dialog>

        {/* 3. Generate Project Invoice Modal */}
        <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                Generate Project Invoice — INV-2026-0087
              </DialogTitle>
              <DialogDescription className="text-xs">
                Convert approved billing record {selectedBilling.code} into an official GST tax invoice for customer dispatch.
              </DialogDescription>
            </DialogHeader>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border text-xs space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Customer:</span>
                <span>ABC Energy Solutions Pvt Ltd</span>
              </div>
              <div className="flex justify-between">
                <span>Contract Reference:</span>
                <span className="font-mono">CTR-2026-041</span>
              </div>
              <div className="flex justify-between">
                <span>Gross Billing:</span>
                <span className="font-mono font-bold">₹ {selectedBilling.grossAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (18%):</span>
                <span className="font-mono">₹ {selectedBilling.tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Retention Deducted:</span>
                <span className="font-mono">₹ {selectedBilling.retention.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-primary pt-1 border-t">
                <span>Total Invoice Receivable:</span>
                <span className="font-mono">₹ {selectedBilling.netAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsInvoiceOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setBillings((prev) =>
                    prev.map((b) =>
                      b.id === selectedBilling.id
                        ? { ...b, invoiceNo: "INV-2026-0087", status: "Invoiced" }
                        : b,
                    ),
                  );
                  setSelectedBilling({
                    ...selectedBilling,
                    invoiceNo: "INV-2026-0087",
                    status: "Invoiced",
                  });
                  setIsInvoiceOpen(false);
                  toast.success("Invoice INV-2026-0087 generated and posted to Accounts Receivable.");
                }}
                className="bg-primary text-white font-semibold"
              >
                Generate & Dispatch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 4. Record Customer Payment Modal */}
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-emerald-600">
                <Wallet className="h-4 w-4" />
                Record Customer Payment
              </DialogTitle>
              <DialogDescription className="text-xs">
                Post customer wire transfer / RTGS against outstanding invoice {selectedBilling.invoiceNo !== "-" ? selectedBilling.invoiceNo : "INV-2026-0003"}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Invoice:</label>
                <Input
                  value={`${selectedBilling.invoiceNo !== "-" ? selectedBilling.invoiceNo : "INV-2026-0003"} (Balance: ₹ ${(selectedBilling.netAmount - selectedBilling.receivedAmount).toLocaleString("en-IN")})`}
                  readOnly
                  className="h-8 text-xs font-mono bg-muted"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Received Amount (₹):</label>
                  <Input defaultValue={selectedBilling.netAmount - selectedBilling.receivedAmount} className="h-8 text-xs font-mono font-bold" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Payment Date:</label>
                  <Input defaultValue="03-Sep-2026" className="h-8 text-xs font-mono" />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Bank Reference / UTR No.:</label>
                <Input defaultValue="HDFC992817263518" className="h-8 text-xs font-mono" />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsPaymentOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setBillings((prev) =>
                    prev.map((b) =>
                      b.id === selectedBilling.id
                        ? { ...b, receivedAmount: b.netAmount, status: "Paid" }
                        : b,
                    ),
                  );
                  setSelectedBilling({
                    ...selectedBilling,
                    receivedAmount: selectedBilling.netAmount,
                    status: "Paid",
                  });
                  setIsPaymentOpen(false);
                  toast.success(`Payment of ₹ ${selectedBilling.netAmount.toLocaleString("en-IN")} reconciled. Marked as Paid.`);
                }}
                className="bg-emerald-600 text-white font-semibold"
              >
                Post Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 5. AI Billing Intelligence Modal */}
        <Dialog open={isAiBillingOpen} onOpenChange={setIsAiBillingOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                AI Billing Intelligence & Unbilled Work Detection
              </DialogTitle>
              <DialogDescription className="text-xs">
                Algorithmic reconciliation between project execution progress and invoiced contract value.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200">
                <span className="font-bold text-rose-700 block mb-1">🔴 Unbilled Completed Work Detected:</span>
                <p className="text-[11px] text-slate-800 dark:text-slate-200">
                  ₹ 23.50 L of physical progress on Production (WBS 4.0) and Installation (WBS 5.0) is complete and certified but has not yet generated a billing draft.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200">
                <span className="font-bold text-emerald-700 block mb-1">🟢 Cash Conversion Opportunity:</span>
                <p className="text-[11px] text-slate-800 dark:text-slate-200">
                  Drafting and submitting these 2 eligible milestone invoices before Sep 15 will increase project cash inflow by ₹ 27.68 L and reduce DSO from 28 to 22 days.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsAiBillingOpen(false)}>Close Intelligence</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 6. Receivables Aging Schedule Modal */}
        <Dialog open={isAgingModalOpen} onOpenChange={setIsAgingModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-emerald-600">
                <Clock className="h-4 w-4" />
                Receivables Aging Schedule
              </DialogTitle>
              <DialogDescription className="text-xs">
                Detailed aging breakdown of all pending customer invoices by days outstanding.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-4 gap-2 text-center p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Current</span>
                  <span className="font-mono font-bold text-emerald-600 text-sm">₹ 72.00 L</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">1-30 Days</span>
                  <span className="font-mono font-bold text-amber-600 text-sm">₹ 24.00 L</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">31-60 Days</span>
                  <span className="font-mono font-bold text-orange-600 text-sm">₹ 12.00 L</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">&gt;60 Days</span>
                  <span className="font-mono font-bold text-rose-600 text-sm">₹ 9.00 L</span>
                </div>
              </div>
              <div className="divide-y border rounded-lg p-2">
                {billings.filter((b) => b.netAmount - b.receivedAmount > 0).map((b) => (
                  <div key={b.id} className="py-2 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-mono font-bold text-primary mr-2">{b.invoiceNo !== "-" ? b.invoiceNo : b.code}</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{b.milestoneDesc}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-rose-600 block">₹ {(b.netAmount - b.receivedAmount).toLocaleString("en-IN")}</span>
                      <span className="text-[9px] text-muted-foreground">{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsAgingModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 7. Contract Retention Report Modal */}
        <Dialog open={isRetentionModalOpen} onOpenChange={setIsRetentionModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-amber-600">
                <ShieldCheck className="h-4 w-4" />
                Contract Retention Management
              </DialogTitle>
              <DialogDescription className="text-xs">
                5% security retention withheld against project milestones until warranty period expiry.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Total Held</span>
                  <span className="font-mono font-bold text-sm">₹ 7.10 L</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Released</span>
                  <span className="font-mono font-bold text-emerald-600 text-sm">₹ 1.25 L</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Pending</span>
                  <span className="font-mono font-bold text-rose-600 text-sm">₹ 5.85 L</span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Retention release tranche 1 (₹ 1.25 L) successfully released following M-001 defect liability period completion. Tranche 2 is due upon Final Project Handover in Dec 2026.
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsRetentionModalOpen(false)}>Close</Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsRetentionModalOpen(false);
                  toast.success("Retention release certificate generated for PMO signoff.");
                }}
                className="bg-amber-600 text-white font-semibold"
              >
                Request Release
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 8. Overdue Invoices Modal */}
        <Dialog open={isOverdueModalOpen} onOpenChange={setIsOverdueModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-rose-600">
                <AlertTriangle className="h-4 w-4" />
                Overdue Customer Invoices
              </DialogTitle>
              <DialogDescription className="text-xs">
                Invoices exceeding 30-day payment terms requiring follow-up or escalation.
              </DialogDescription>
            </DialogHeader>
            <div className="divide-y border rounded-lg p-2 text-xs space-y-1">
              {[
                { inv: "INV-2026-0003", title: "M-003 Procurement Complete", amt: "₹ 8,10,000", days: "15 Days" },
                { inv: "INV-2026-0008", title: "Engineering Change Order ECO-01", amt: "₹ 3,20,000", days: "12 Days" },
                { inv: "INV-2026-0009", title: "Site Pre-commissioning Survey", amt: "₹ 2,50,000", days: "8 Days" },
              ].map((item) => (
                <div key={item.inv} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-primary mr-2">{item.inv}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 block">{item.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-rose-600 block">{item.amt}</span>
                    <span className="text-[10px] text-muted-foreground">{item.days} overdue</span>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsOverdueModalOpen(false)}>Close</Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsOverdueModalOpen(false);
                  toast.success("Automated payment reminder dunning notice sent to customer.");
                }}
                className="bg-rose-600 text-white font-semibold"
              >
                Send Dunning Reminder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default ProjectBillingFormPage;
