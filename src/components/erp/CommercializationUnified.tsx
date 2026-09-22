import React, { useState, useEffect, useMemo, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Briefcase,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  DollarSign,
  Plus,
  Save,
  Send,
  MoreHorizontal,
  Calendar,
  User,
  Building2,
  FileText,
  Download,
  Printer,
  FileCode,
  Sparkles,
  Zap,
  Target,
  Clock,
  Layers,
  Edit,
  Search,
  RefreshCw,
  Award,
  ShieldCheck,
  AlertTriangle,
  X,
  ExternalLink,
} from "lucide-react";

import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import {
  CommercializationPageTabBar,
  COMMERCIALIZATION_STATUS_LABEL,
  type CommercializationTabId,
} from "@/components/erp/CommercializationTabBar";
import { StatCard } from "@/components/erp/StatCard";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { ErpButton } from "@/components/erp/Button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { commercializationService } from "@/services/commercializationService";
import type {
  CommercializationApprovalDecision,
  CommercializationFormInput,
  CommercializationRecord,
  CommercializationStatus,
} from "@/services/types";

function formatCurrency(val: number): string {
  if (!val || isNaN(val)) return "₹ 0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

function fmtDate(iso: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TagInput({
  tags,
  onChange,
  placeholder = "Add item and press Enter...",
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onChange([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemove = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background p-1.5 min-h-[38px]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-foreground border border-border"
        >
          {tag}
          <button
            type="button"
            onClick={() => handleRemove(tag)}
            className="text-muted-foreground hover:text-destructive cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
          }
        }}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] bg-transparent text-xs outline-none px-1"
      />
    </div>
  );
}

const FILTERS: { key: CommercializationStatus | "all"; label: string }[] = [
  { key: "all", label: "All Statuses" },
  { key: "draft", label: "Draft" },
  { key: "product_readiness", label: "Product Readiness" },
  { key: "manufacturing_supply_chain", label: "Mfg & Supply" },
  { key: "sales_marketing_planning", label: "Sales & Marketing" },
  { key: "executive_review", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "approved_with_conditions", label: "Conditional" },
  { key: "revision_required", label: "Revision" },
  { key: "rejected", label: "Rejected" },
];

export function CommercializationUnifiedPage({
  initialTab = "register",
  breadcrumb,
  tabs,
}: {
  initialTab?: CommercializationTabId;
  breadcrumb?: string;
  tabs?: ReactNode;
}) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<CommercializationTabId>(initialTab);
  const [filter, setFilter] = useState<CommercializationStatus | "all">("all");
  const [selectedRecordId, setSelectedRecordId] = useState<string>("cmp-record-0021");

  // Modals
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [reviewDecisionChoice, setReviewDecisionChoice] = useState<CommercializationApprovalDecision>("Approved");
  const [reviewCommentsInput, setReviewCommentsInput] = useState("");

  // List Query
  const listQuery = useQuery({
    queryKey: ["commercialization-planning", "list"],
    queryFn: () => commercializationService.fetchList(),
  });

  // Record Query
  const recordQuery = useQuery({
    queryKey: ["commercialization-planning", "record", selectedRecordId],
    queryFn: () => commercializationService.fetchRecord(selectedRecordId),
  });

  const record = recordQuery.data;

  // Form State
  const [form, setForm] = useState<CommercializationFormInput>({
    commercializationProject: "Autonomous Docking System Commercial Rollout",
    businessUnit: "Automotive & Fleet Mobility",
    commercializationManager: "Rahul Verma",
    launchTargetDate: "2024-11-15",
    linkedProductId: "PRD-2024-0012",
    linkedTechnologyId: "TECH-2024-0089",
    linkedPatentId: "PAT-2024-0045",
    linkedBusinessCaseId: "BC-2024-0023",
    productOverview: {
      tagline: "Sub-centimeter precision autonomous EV charging interface.",
      executiveSummary: "High-power automated docking connection system for autonomous commercial fleet operations.",
      primaryTargetMarket: "Commercial EV Fleets & Autonomous Depot Operations",
      keyDifferentiators: ["Sub-15ms optical handshake", "All-weather IP68 rating", "Over-the-air firmware updates"],
    },
    marketAnalysis: {
      marketSizeTotalTam: 4500000000,
      serviceableSam: 1200000000,
      obtainableSom: 280000000,
      targetCustomerSegments: ["Fleet Operators", "Autonomous Logistics Hubs", "Transit Agencies"],
      marketGrowthRateCagr: 34.5,
      competitiveLandscapeSummary: "Leading market share in Tier-1 commercial autonomous hubs with 3 active patents.",
    },
    productReadiness: {
      inheritedTrl: "TRL 6 – Technology Demonstrated in Relevant Environment",
      inheritedMrl: "MRL 4 – Laboratory Capability Demonstrated",
      certificationStatus: "Fully Certified",
      regulatoryCompliance: "ISO 26262 & CE Compliant",
      productValidationStatus: "Field Validated",
      productionReadiness: "Pilot Line Ready",
      launchReadinessScore: 82,
    },
    manufacturingSupplyChain: {
      manufacturingStrategy: "Contract Manufacturing (CM)",
      productionCapacityAnnual: "2,500 Units / Year",
      contractManufacturer: "Flextronics Mobility Division",
      keySuppliers: ["Texas Instruments", "Sony Semiconductor", "Bosch Auto"],
      procurementStatus: "Component Sourced",
      inventoryReadiness: "Safety Stock Established",
      distributionNetwork: "Regional logistics hubs in Delhi NCR, Bengaluru, and Stuttgart.",
    },
    financialPlanning: {
      initialInvestment: 45000000,
      manufacturingCostPerUnit: 180000,
      sellingPricePerUnit: 350000,
      revenueProjection5Yr: 245000000,
      breakEvenPeriodMonths: 18,
      grossMarginPct: 48.57,
      roiPct: 185,
    },
    salesMarketing: {
      salesModel: "B2B Enterprise Direct",
      pricingStrategy: "Value-Based Pricing",
      marketingChannels: ["Industry Expos", "Digital ABM", "Executive Summits"],
      distributionChannels: ["Direct Sales Force", "OEM System Integrators"],
      brandingStrategy: "Position as premier ultra-reliable autonomous charging interface.",
      launchCampaign: "Global unveiling at EV Tech Expo followed by 3 pilot deployment showcases.",
      customerSupportStrategy: "24/7 SLA-backed telemetry monitoring and field maintenance within 4 hours.",
    },
    partnerships: {
      strategicPartners: ["Tata Motors", "ABB E-Mobility"],
      technologyPartners: ["NVIDIA Automotive", "Qualcomm"],
      manufacturingPartners: ["Foxconn Industrial", "Flex"],
      channelPartners: ["Siemens Energy", "Schneider Electric"],
      governmentSupport: ["FAME II Grant", "MeitY R&D Scheme"],
      investors: ["Sequoia Climate Tech", "CleanEnergy Ventures"],
      partnershipStatus: "MoU Executed",
    },
    riskAssessment: {
      technicalRisk: 2,
      marketRisk: 2,
      financialRisk: 3,
      operationalRisk: 2,
      regulatoryRisk: 2,
      overallRiskScore: 32,
      riskMitigationPlan: "Mitigating supply chain risks via multi-sourcing and pre-certified modular subassemblies.",
    },
    attachments: [],
    reviewComments: "",
  });

  useEffect(() => {
    if (record) {
      setForm({
        commercializationProject: record.commercializationProject,
        businessUnit: record.businessUnit,
        commercializationManager: record.commercializationManager,
        launchTargetDate: record.launchTargetDate,
        linkedProductId: record.linkedProductId,
        linkedTechnologyId: record.linkedTechnologyId,
        linkedPatentId: record.linkedPatentId,
        linkedBusinessCaseId: record.linkedBusinessCaseId,
        productOverview: record.productOverview,
        marketAnalysis: record.marketAnalysis,
        productReadiness: record.productReadiness,
        manufacturingSupplyChain: record.manufacturingSupplyChain,
        financialPlanning: record.financialPlanning,
        salesMarketing: record.salesMarketing,
        partnerships: record.partnerships,
        riskAssessment: record.riskAssessment,
        attachments: record.attachments,
        approvalDecision: record.approvalDecision,
        reviewComments: record.reviewComments || "",
        approvalDate: record.approvalDate || "",
      });
    }
  }, [record]);

  // Derived Financial Calculations
  const derivedFinancials = useMemo(() => {
    const cost = form.financialPlanning.manufacturingCostPerUnit || 1;
    const price = form.financialPlanning.sellingPricePerUnit || 1;
    const inv = form.financialPlanning.initialInvestment || 1;
    const rev = form.financialPlanning.revenueProjection5Yr || 0;
    const margin = price > 0 ? Number((((price - cost) / price) * 100).toFixed(2)) : 0;
    const roi = inv > 0 ? Math.round(((rev - inv) / inv) * 100) : 0;
    return { grossMarginPct: margin, roiPct: roi };
  }, [form.financialPlanning]);

  const rows = useMemo(() => listQuery.data ?? [], [listQuery.data]);
  
  // Deduplicate and filter rows cleanly
  const uniqueRows = useMemo(() => {
    const seen = new Set<string>();
    return rows.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  }, [rows]);

  const filteredRows = useMemo(() => {
    return filter === "all" ? uniqueRows : uniqueRows.filter((r) => r.status === filter);
  }, [uniqueRows, filter]);

  // KPIs
  const kpis = useMemo(() => {
    return {
      total: uniqueRows.length || 2,
      active: uniqueRows.filter((r) => !["approved", "rejected", "archived"].includes(r.status)).length || 2,
      approved: uniqueRows.filter((r) => r.status === "approved" || r.status === "approved_with_conditions").length,
      avgReadiness: uniqueRows.length > 0 ? Math.round(uniqueRows.reduce((a, b) => a + b.overallLaunchReadiness, 0) / uniqueRows.length) : 81,
    };
  }, [uniqueRows]);

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: CommercializationFormInput) =>
      commercializationService.saveDraft(input, selectedRecordId),
    onSuccess: (updated) => {
      queryClient.setQueryData(["commercialization-planning", "record", selectedRecordId], updated);
      queryClient.invalidateQueries({ queryKey: ["commercialization-planning", "list"] });
      toast.success("Commercialization Plan draft saved!", {
        description: "All market criteria, manufacturing plans, and ROI metrics updated.",
      });
    },
    onError: (err: any) => {
      toast.error("Failed to save draft", { description: err?.message });
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => commercializationService.submitForReview(selectedRecordId),
    onSuccess: (updated) => {
      queryClient.setQueryData(["commercialization-planning", "record", selectedRecordId], updated);
      queryClient.invalidateQueries({ queryKey: ["commercialization-planning", "list"] });
      toast.success("Submitted for Executive Commercialization Review!", {
        description: "Notifications dispatched to commercial launch stakeholders.",
      });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: (args: { decision: CommercializationApprovalDecision; comments?: string }) =>
      commercializationService.review({ id: selectedRecordId, ...args }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["commercialization-planning", "record", selectedRecordId], updated);
      queryClient.invalidateQueries({ queryKey: ["commercialization-planning", "list"] });
      setShowReviewModal(false);
      toast.success(`Decision submitted: ${reviewDecisionChoice}`, {
        description: "Commercialization status updated successfully.",
      });
    },
  });

  const handleExportPDF = () => {
    const content = `=====================================================
COMMERCIALIZATION PLANNING SPECIFICATION & LAUNCH BRIEF
=====================================================
Project: ${form.commercializationProject}
Record ID: ${record?.commercializationId || "CMP-2024-0021"}
Business Unit: ${form.businessUnit}
Manager: ${form.commercializationManager}
Target Launch: ${form.launchTargetDate}
Workflow Status: ${record?.status || "executive_review"}

PRODUCT & MARKET OVERVIEW:
-----------------------------------------------------
Tagline: ${form.productOverview.tagline}
Summary: ${form.productOverview.executiveSummary}
Target Market: ${form.productOverview.primaryTargetMarket}
TAM: ${formatCurrency(form.marketAnalysis.marketSizeTotalTam)}
SAM: ${formatCurrency(form.marketAnalysis.serviceableSam)}
SOM: ${formatCurrency(form.marketAnalysis.obtainableSom)}

PRODUCT & MFG READINESS:
-----------------------------------------------------
TRL: ${form.productReadiness.inheritedTrl}
MRL: ${form.productReadiness.inheritedMrl}
Certification: ${form.productReadiness.certificationStatus}
Manufacturing: ${form.manufacturingSupplyChain.manufacturingStrategy}
CM Partner: ${form.manufacturingSupplyChain.contractManufacturer}
Capacity: ${form.manufacturingSupplyChain.productionCapacityAnnual}

FINANCIAL MODEL & ROI:
-----------------------------------------------------
Initial Investment: ${formatCurrency(form.financialPlanning.initialInvestment)}
Cost / Unit: ${formatCurrency(form.financialPlanning.manufacturingCostPerUnit)}
Price / Unit: ${formatCurrency(form.financialPlanning.sellingPricePerUnit)}
Gross Margin: ${derivedFinancials.grossMarginPct}%
Expected ROI: ${derivedFinancials.roiPct}%
5Y Revenue: ${formatCurrency(form.financialPlanning.revenueProjection5Yr)}
Breakeven: ${form.financialPlanning.breakEvenPeriodMonths} Months

APPROVAL DECISION:
-----------------------------------------------------
Decision: ${form.approvalDecision || "Under Review"}
Review Notes: ${form.reviewComments || "Executive committee launch review."}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record?.commercializationId || "CMP-2024-0021"}_Launch_Brief.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Commercialization Brief exported successfully!");
  };

  const handleOpenRecordInForm = (recId: string) => {
    setSelectedRecordId(recId);
    setActiveTab("form");
    toast.success(`Loaded plan ${recId} in editor`);
  };

  return (
    <AppShell
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Commercialization Planning"}
      title="Commercialization Planning"
      description="Plan go-to-market, financials, and launch readiness."
      tabs={tabs ?? <InnovationAreaTabs sub={<CommercializationPageTabBar activeTab={activeTab} onTabChange={setActiveTab} />} />}
      topbarActions={
        <div className="flex items-center gap-2">
          {activeTab === "form" ? (
            <>
              <ErpButton
                variant="outline"
                size="sm"
                onClick={() => saveDraftMutation.mutate(form)}
                disabled={saveDraftMutation.isPending}
                className="gap-1.5 text-xs cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Draft</span>
              </ErpButton>
              <ErpButton
                variant="primary"
                size="sm"
                onClick={() => (record?.status === "executive_review" ? setShowReviewModal(true) : submitMutation.mutate())}
                disabled={submitMutation.isPending}
                className="gap-1.5 text-xs bg-primary text-white cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{record?.status === "executive_review" ? "Committee Review" : "Submit for Review"}</span>
              </ErpButton>
            </>
          ) : (
            <ErpButton
              variant="primary"
              size="sm"
              onClick={() => setActiveTab("form")}
              className="gap-1.5 text-xs bg-primary text-white cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Commercialization Plan
            </ErpButton>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 text-xs">
              <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
                <Printer className="mr-2 h-4 w-4 text-primary" /> Export Dossier (PDF)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowScheduleModal(true)} className="cursor-pointer">
                <Calendar className="mr-2 h-4 w-4 text-blue-600" /> Schedule Launch Review
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(JSON.stringify(form, null, 2)); toast.success("Form JSON copied!"); }} className="cursor-pointer">
                <FileCode className="mr-2 h-4 w-4 text-emerald-600" /> Copy Plan JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    >
      <div className="space-y-6 pb-12">
        {/* ========================================================================= */}
        {/* TAB 1: COMMERCIALIZATION REGISTER                                         */}
        {/* ========================================================================= */}
        {activeTab === "register" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Direct Clean Stat Cards (NO Templates / Edit Dashboard header) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Plans"
                value={String(kpis.total)}
                neutralText="All Commercialization Initiatives"
                icon={<Briefcase className="h-5 w-5" />}
                iconBg="bg-primary/10"
                iconColor="text-primary"
              />
              <StatCard
                label="Under Planning"
                value={String(kpis.active)}
                neutralText="Active Pipeline Stages"
                icon={<TrendingUp className="h-5 w-5" />}
                iconBg="bg-amber-500/10"
                iconColor="text-amber-600 dark:text-amber-400"
              />
              <StatCard
                label="Approved Plans"
                value={String(kpis.approved)}
                neutralText="Ready for Commercial Deployment"
                icon={<CheckCircle2 className="h-5 w-5" />}
                iconBg="bg-emerald-500/10"
                iconColor="text-emerald-600 dark:text-emerald-400"
              />
              <StatCard
                label="Avg Launch Readiness"
                value={`${kpis.avgReadiness}/100`}
                neutralText="Composite Readiness Index"
                icon={<DollarSign className="h-5 w-5" />}
                iconBg="bg-blue-500/10"
                iconColor="text-blue-600 dark:text-blue-400"
              />
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer select-none",
                      filter === f.key
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="text-xs font-medium text-muted-foreground">
                Showing {filteredRows.length} of {uniqueRows.length} records
              </div>
            </div>

            {/* Register Data Table */}
            <div className="card-soft bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border text-muted-foreground font-medium">
                      <th className="p-3">Plan ID</th>
                      <th className="p-3">Project & Product</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Launch Readiness</th>
                      <th className="p-3">Expected ROI</th>
                      <th className="p-3">Target Launch</th>
                      <th className="p-3">Updated</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredRows.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-semibold text-primary font-mono cursor-pointer" onClick={() => handleOpenRecordInForm(r.id)}>
                          {r.commercializationId}
                        </td>
                        <td className="p-3">
                          <span
                            onClick={() => handleOpenRecordInForm(r.id)}
                            className="font-semibold text-foreground hover:text-primary cursor-pointer block"
                          >
                            {r.commercializationProject}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{r.linkedProductName}</span>
                        </td>
                        <td className="p-3"><StatusBadge status={r.status} /></td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${r.overallLaunchReadiness}%` }}
                              />
                            </div>
                            <span className="font-bold text-foreground">{r.overallLaunchReadiness}/100</span>
                          </div>
                        </td>
                        <td className="p-3 font-bold text-emerald-600">{r.roiPct}%</td>
                        <td className="p-3 font-mono">{fmtDate(r.launchTargetDate)}</td>
                        <td className="p-3 text-muted-foreground font-mono">{fmtDate(r.updatedAt)}</td>
                        <td className="p-3 text-right">
                          <ErpButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenRecordInForm(r.id)}
                            className="text-xs h-7 px-2.5 cursor-pointer"
                          >
                            <Edit className="h-3 w-3 mr-1" /> Open Form
                          </ErpButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: COMMERCIALIZATION PLANNING FORM                                     */}
        {/* ========================================================================= */}
        {activeTab === "form" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Metadata Ribbon */}
            <Card className="border border-border/80 shadow-xs bg-card overflow-hidden rounded-xl">
              <div className="p-4 sm:p-5 pb-4 bg-slate-50/70 dark:bg-slate-900/90 border-b border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 border border-blue-200/50 dark:border-blue-800/50 shadow-2xs">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-border/60">
                        {record?.commercializationId || "CMP-2024-0021"}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <Badge variant="outline" className="font-mono text-[11px] font-semibold">
                        {form.businessUnit}
                      </Badge>
                      <StatusBadge status={record?.status || "executive_review"} />
                    </div>
                    <input
                      type="text"
                      value={form.commercializationProject}
                      onChange={(e) => setForm((prev) => ({ ...prev, commercializationProject: e.target.value }))}
                      className="text-base sm:text-lg font-bold text-foreground bg-transparent hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary px-2 py-0.5 transition-all rounded-md max-w-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <ErpButton
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("register")}
                    className="text-xs cursor-pointer"
                  >
                    View Register
                  </ErpButton>
                  <ErpButton
                    variant="outline"
                    size="sm"
                    onClick={() => saveDraftMutation.mutate(form)}
                    disabled={saveDraftMutation.isPending}
                    className="gap-1 text-xs cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Draft</span>
                  </ErpButton>
                  <ErpButton
                    variant="primary"
                    size="sm"
                    onClick={() => (record?.status === "executive_review" ? setShowReviewModal(true) : submitMutation.mutate())}
                    disabled={submitMutation.isPending}
                    className="gap-1 text-xs bg-primary text-white cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{record?.status === "executive_review" ? "Committee Review" : "Submit for Review"}</span>
                  </ErpButton>
                </div>
              </div>

              {/* Ribbon Grid */}
              <div className="px-4 py-2.5 bg-white dark:bg-slate-900 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs divide-y sm:divide-y-0 sm:divide-x divide-border/60">
                <div className="flex flex-col gap-0.5 sm:pr-2">
                  <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                    <User className="h-3 w-3 text-slate-400" /> Commercialization Manager
                  </span>
                  <span className="font-semibold text-foreground truncate">{form.commercializationManager}</span>
                </div>

                <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                  <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" /> Target Launch Date
                  </span>
                  <span className="font-semibold text-foreground truncate">{form.launchTargetDate}</span>
                </div>

                <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                  <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                    <Zap className="h-3 w-3 text-blue-500" /> Linked Product ID
                  </span>
                  <span className="font-semibold text-primary truncate">{form.linkedProductId}</span>
                </div>

                <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                  <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-emerald-500" /> 5Y Revenue Forecast
                  </span>
                  <span className="font-bold text-emerald-600 truncate">{formatCurrency(form.financialPlanning.revenueProjection5Yr)}</span>
                </div>

                <div className="flex flex-col gap-0.5 sm:pl-2 pt-2 sm:pt-0">
                  <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                    <Award className="h-3 w-3 text-primary" /> Overall Readiness
                  </span>
                  <span className="font-bold text-primary truncate">{record?.overallLaunchReadiness || 81}/100</span>
                </div>
              </div>
            </Card>

            {/* Form Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 space-y-6">
                {/* Product Readiness Section */}
                <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      1. Product Readiness & Certification
                    </h3>
                    <Badge variant="outline" className="text-xs font-semibold">{form.productReadiness.certificationStatus}</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Technology Readiness Level (TRL)</label>
                      <Input
                        value={form.productReadiness.inheritedTrl}
                        onChange={(e) => setForm((prev) => ({ ...prev, productReadiness: { ...prev.productReadiness, inheritedTrl: e.target.value } }))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Manufacturing Readiness Level (MRL)</label>
                      <Input
                        value={form.productReadiness.inheritedMrl}
                        onChange={(e) => setForm((prev) => ({ ...prev, productReadiness: { ...prev.productReadiness, inheritedMrl: e.target.value } }))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Regulatory Standards & Compliance</label>
                      <Input
                        value={form.productReadiness.regulatoryCompliance}
                        onChange={(e) => setForm((prev) => ({ ...prev, productReadiness: { ...prev.productReadiness, regulatoryCompliance: e.target.value } }))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Production Readiness Status</label>
                      <Input
                        value={form.productReadiness.productionReadiness}
                        onChange={(e) => setForm((prev) => ({ ...prev, productReadiness: { ...prev.productReadiness, productionReadiness: e.target.value } }))}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Manufacturing & Supply Chain */}
                <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-600" />
                      2. Manufacturing & Supply Chain Planning
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Manufacturing Strategy</label>
                      <Input
                        value={form.manufacturingSupplyChain.manufacturingStrategy}
                        onChange={(e) => setForm((prev) => ({ ...prev, manufacturingSupplyChain: { ...prev.manufacturingSupplyChain, manufacturingStrategy: e.target.value } }))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Contract Manufacturer (CM)</label>
                      <Input
                        value={form.manufacturingSupplyChain.contractManufacturer}
                        onChange={(e) => setForm((prev) => ({ ...prev, manufacturingSupplyChain: { ...prev.manufacturingSupplyChain, contractManufacturer: e.target.value } }))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Annual Capacity</label>
                      <Input
                        value={form.manufacturingSupplyChain.productionCapacityAnnual}
                        onChange={(e) => setForm((prev) => ({ ...prev, manufacturingSupplyChain: { ...prev.manufacturingSupplyChain, productionCapacityAnnual: e.target.value } }))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Procurement Status</label>
                      <Input
                        value={form.manufacturingSupplyChain.procurementStatus}
                        onChange={(e) => setForm((prev) => ({ ...prev, manufacturingSupplyChain: { ...prev.manufacturingSupplyChain, procurementStatus: e.target.value } }))}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Financial ROI & Economics */}
                <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      3. Financial Model & Pricing
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Initial Investment (₹)</label>
                      <Input
                        type="number"
                        value={form.financialPlanning.initialInvestment}
                        onChange={(e) => setForm((prev) => ({ ...prev, financialPlanning: { ...prev.financialPlanning, initialInvestment: Number(e.target.value) } }))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Mfg Cost / Unit (₹)</label>
                      <Input
                        type="number"
                        value={form.financialPlanning.manufacturingCostPerUnit}
                        onChange={(e) => setForm((prev) => ({ ...prev, financialPlanning: { ...prev.financialPlanning, manufacturingCostPerUnit: Number(e.target.value) } }))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Selling Price / Unit (₹)</label>
                      <Input
                        type="number"
                        value={form.financialPlanning.sellingPricePerUnit}
                        onChange={(e) => setForm((prev) => ({ ...prev, financialPlanning: { ...prev.financialPlanning, sellingPricePerUnit: Number(e.target.value) } }))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">5Y Revenue Projection (₹)</label>
                      <Input
                        type="number"
                        value={form.financialPlanning.revenueProjection5Yr}
                        onChange={(e) => setForm((prev) => ({ ...prev, financialPlanning: { ...prev.financialPlanning, revenueProjection5Yr: Number(e.target.value) } }))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Gross Margin (%)</label>
                      <div className="p-2 rounded border border-border bg-muted/40 font-bold text-foreground text-xs">
                        {derivedFinancials.grossMarginPct}%
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Expected ROI (%)</label>
                      <div className="p-2 rounded border border-border bg-muted/40 font-bold text-emerald-600 text-xs">
                        {derivedFinancials.roiPct}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales & Marketing GTM Plan */}
                <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      4. Go-To-Market (GTM) & Distribution
                    </h3>
                  </div>
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-muted-foreground mb-1">Sales Model</label>
                        <Input
                          value={form.salesMarketing.salesModel}
                          onChange={(e) => setForm((prev) => ({ ...prev, salesMarketing: { ...prev.salesMarketing, salesModel: e.target.value } }))}
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-muted-foreground mb-1">Pricing Strategy</label>
                        <Input
                          value={form.salesMarketing.pricingStrategy}
                          onChange={(e) => setForm((prev) => ({ ...prev, salesMarketing: { ...prev.salesMarketing, pricingStrategy: e.target.value } }))}
                          className="text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Marketing Channels</label>
                      <TagInput
                        tags={form.salesMarketing.marketingChannels || []}
                        onChange={(tags) => setForm((prev) => ({ ...prev, salesMarketing: { ...prev.salesMarketing, marketingChannels: tags } }))}
                        placeholder="Add marketing channel & press Enter..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Score Matrix */}
              <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-6 space-y-4">
                  <Card className="border border-border/80 shadow-xs bg-card">
                    <CardHeader className="p-4 pb-2 border-b">
                      <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        <span>Launch Readiness Index</span>
                        <Award className="h-4 w-4 text-primary" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 text-center space-y-4">
                      <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 border-4 border-primary/20 p-2">
                        <div>
                          <span className="text-3xl font-black text-primary">{record?.overallLaunchReadiness || 81}%</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-left text-xs border-t pt-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Product Readiness</span>
                          <span className="font-bold text-foreground">{form.productReadiness.launchReadinessScore || 82}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Market Readiness</span>
                          <span className="font-bold text-emerald-600">88/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Financial Feasibility</span>
                          <span className="font-bold text-blue-600">{Math.min(98, Math.round(derivedFinancials.grossMarginPct * 1.2 + derivedFinancials.roiPct / 10))}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gross Margin</span>
                          <span className="font-bold text-foreground">{derivedFinancials.grossMarginPct}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Projected ROI</span>
                          <span className="font-bold text-emerald-600">{derivedFinancials.roiPct}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decision Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              Executive Launch Committee Decision
            </DialogTitle>
            <DialogDescription className="text-xs">
              Submit formal commercialization review sign-off.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <label className="font-semibold block mb-1">Decision:</label>
              <select
                value={reviewDecisionChoice}
                onChange={(e) => setReviewDecisionChoice(e.target.value as CommercializationApprovalDecision)}
                className="w-full p-2 text-xs rounded-lg border border-border bg-background"
              >
                <option value="Approved">Approved (Authorize Commercial Deployment)</option>
                <option value="Approved with Conditions">Approved with Conditions</option>
                <option value="Revision Required">Revision Required</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Committee Comments:</label>
              <textarea
                rows={3}
                value={reviewCommentsInput}
                onChange={(e) => setReviewCommentsInput(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-border bg-background"
                placeholder="Enter executive committee sign-off notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowReviewModal(false)}>Cancel</Button>
            <Button
              size="sm"
              onClick={() => reviewMutation.mutate({ decision: reviewDecisionChoice, comments: reviewCommentsInput })}
              className="bg-primary text-white"
            >
              Submit Decision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Schedule Commercial Launch Gate
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <label className="font-semibold block mb-1">Select Date:</label>
              <Input type="date" defaultValue="2024-11-01" className="text-xs" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Participants:</label>
              <Input defaultValue="Rahul Verma (Manager), Ananya Iyer (VP), GTM Lead" className="text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
            <Button
              size="sm"
              onClick={() => {
                setShowScheduleModal(false);
                toast.success("Commercialization Launch review scheduled!");
              }}
              className="bg-primary text-white"
            >
              Confirm Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default CommercializationUnifiedPage;
