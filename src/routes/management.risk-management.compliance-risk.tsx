// Magnertia ERP - Compliance Risk Module
// Management -> Risk Management -> Compliance Risk
// Compliance Risk Form - MAICW Classification & Regulatory Assurance Engine

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getComplianceRiskRecordFn, listComplianceRiskRecordsFn } from "@/lib/complianceRiskFns.server";
import {
  FileText,
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
  CheckCircle,
  Gavel,
  Award,
  Plus,
  Upload,
  Download,
  Calendar,
  Pencil,
  Quote,
  Shield,
  Coins,
  Settings,
  Scale,
  Sparkles,
  Search,
  Filter,
  Eye,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Building2,
  Clock,
  Layers,
  Check,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Bookmark,
  FileCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { AppShell } from "@/components/erp/AppShell";
import { RiskManagementTabBar } from "@/components/erp/RiskManagementTabBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import {
  complianceRiskService,
  PRIMARY_COMPLIANCE_RISK,
  ComplianceRiskRecord,
  ComplianceDomain,
  ComplianceRequirementItem,
  ComplianceObligationItem,
  ComplianceGapItem,
} from "@/services/complianceRiskService";

export const Route = createFileRoute(
  "/management/risk-management/compliance-risk",
)({
  component: ComplianceRiskPage,
  head: () => ({
    meta: [
      { title: "Compliance Risk · Risk Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Compliance Risk Form — MAICW Classification, Statutory Regulations, BIS/ISO Certifications, Obligations, Gaps, and Regulatory Intelligence.",
      },
    ],
  }),
});

function ComplianceRiskPage() {
  const { toast } = useToast();

  // --- Prisma-backed queries with inline fallback ---
  const { data: dbRecord } = useQuery({
    queryKey: ["compliance-risk", "record"],
    queryFn: () => getComplianceRiskRecordFn({ data: {} }),
  });
  const { data: dbList } = useQuery({
    queryKey: ["compliance-risk", "list"],
    queryFn: () => listComplianceRiskRecordsFn({ data: {} }),
  });

  // Active risk record (defaults to PRIMARY_COMPLIANCE_RISK matching screenshot)
  const [activeRisk, setActiveRisk] = useState<ComplianceRiskRecord>(
    complianceRiskService.getPrimaryRisk(),
  );

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [matrixView, setMatrixView] = useState<"inherent" | "residual">("inherent");

  // Registers & Lists
  const [allRisks, setAllRisks] = useState<ComplianceRiskRecord[]>(
    complianceRiskService.getFullRisks(),
  );

  useEffect(() => {
    if (dbRecord?.data) setActiveRisk(dbRecord.data);
  }, [dbRecord]);
  useEffect(() => {
    if (dbList?.data) setAllRisks(dbList.data);
  }, [dbList]);
  const [requirements, setRequirements] = useState<ComplianceRequirementItem[]>(
    complianceRiskService.getRequirements(),
  );
  const [obligations, setObligations] = useState<ComplianceObligationItem[]>(
    complianceRiskService.getObligations(),
  );
  const [gaps, setGaps] = useState<ComplianceGapItem[]>(
    complianceRiskService.getGaps(),
  );

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("All");

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewRiskModalOpen, setIsNewRiskModalOpen] = useState(false);
  const [selectedRiskForView, setSelectedRiskForView] = useState<ComplianceRiskRecord | null>(null);
  const [isRegulatoryWatchModalOpen, setIsRegulatoryWatchModalOpen] = useState(false);
  const [isComplianceCheckModalOpen, setIsComplianceCheckModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  // Form State for Editing/New
  const [formData, setFormData] = useState<ComplianceRiskRecord>({
    ...PRIMARY_COMPLIANCE_RISK,
  });

  const kris = complianceRiskService.getKRIs();
  const actionPlan = complianceRiskService.getActionPlan();
  const topRisks = complianceRiskService.getTopRisks();
  const trendData = complianceRiskService.getRiskTrend();
  const domainData = complianceRiskService.getDomainDistribution();
  const aiInsights = complianceRiskService.getAIInsights();
  const controls = complianceRiskService.getControls();
  const evidenceList = complianceRiskService.getEvidence();
  const maicwFields = complianceRiskService.getMAICWFields();
  const reportsList = complianceRiskService.getReports();

  // CSV Export for Compliance Risk Register
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Risk Code",
      "Title",
      "Domain",
      "Requirement",
      "Jurisdiction",
      "Status",
      "Priority",
      "Inherent Score",
      "Residual Score",
      "Regulatory Impact",
      "Financial Impact",
    ];
    const rows = allRisks.map((r) => [
      r.id,
      r.riskCode,
      `"${r.title.replace(/"/g, '""')}"`,
      r.complianceDomain,
      `"${r.requirementName}"`,
      r.jurisdiction,
      r.status,
      r.priority,
      r.inherentScore,
      r.residualScore,
      r.impacts.regulatoryImpact,
      r.impacts.financialImpact,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Compliance_Risk_Register_${activeRisk.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Completed",
      description: `Downloaded ${allRisks.length} compliance risk records.`,
    });
  };

  const handleSaveRisk = (updated: ComplianceRiskRecord) => {
    setActiveRisk(updated);
    setAllRisks((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setIsEditModalOpen(false);
    toast({
      title: "Compliance Risk Updated",
      description: `Changes to ${updated.id} have been saved successfully.`,
    });
  };

  const handleCreateRisk = () => {
    const newId = `CR-2026-0${allRisks.length + 1}`;
    const newRisk: ComplianceRiskRecord = {
      ...formData,
      id: newId,
      riskCode: `RK-CMP-${formData.complianceDomain.slice(0, 3).toUpperCase()}-0${allRisks.length + 1}`,
      inherentScore: formData.likelihood * formData.impact,
      residualScore: formData.residualLikelihood * formData.residualImpact,
    };
    setAllRisks([newRisk, ...allRisks]);
    setActiveRisk(newRisk);
    setIsNewRiskModalOpen(false);
    toast({
      title: "Risk Registered",
      description: `New compliance risk ${newId} created under ${newRisk.complianceDomain}.`,
    });
  };

  // Filtered Risks for Register Tab
  const filteredRisks = allRisks.filter((risk) => {
    const matchesSearch =
      risk.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.requirementName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.complianceDomain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain =
      selectedDomainFilter === "All" || risk.complianceDomain === selectedDomainFilter;
    const matchesStatus =
      selectedStatusFilter === "All" || risk.status === selectedStatusFilter;
    return matchesSearch && matchesDomain && matchesStatus;
  });

  return (
    <AppShell
      title="Compliance Risk"
      breadcrumb="Management > Risk Management > Compliance Risk"
      description="Statutory non-compliance exposures, penalty forecasting, regulatory changes, and legal risk controls."
      tabs={<RiskManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* =========================================================================
            1. HEADER BANNER - EXACT MATCH TO SCREENSHOT
            ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-card p-4 rounded-xl border border-border/80 shadow-2xs">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground whitespace-nowrap">
                Compliance Risk
              </h1>
              <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-300 font-bold px-2 py-0.5 text-xs">
                Active
              </Badge>
              <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                {activeRisk.id}
              </span>
              <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                v{activeRisk.version}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Compliant Today. A Safer Tomorrow.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-primary text-primary-foreground text-xs font-semibold shadow-xs shrink-0"
              onClick={() => {
                setFormData({
                  ...PRIMARY_COMPLIANCE_RISK,
                  title: "",
                  statement: "",
                });
                setIsNewRiskModalOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              New Risk
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium shrink-0"
              onClick={() => {
                toast({
                  title: "Import Statutory Feed",
                  description: "Connecting to MCA / BIS / GSTN regulatory schemas...",
                });
              }}
            >
              <Upload className="h-3.5 w-3.5" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium shrink-0 hidden sm:inline-flex"
              onClick={handleExportCSV}
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs shrink-0 hidden sm:inline-flex"
              onClick={() => setActiveTab("reports")}
            >
              <FileText className="h-3.5 w-3.5" />
              Generate Report
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-medium shrink-0"
                >
                  More Actions
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuItem className="sm:hidden" onClick={() => setActiveTab("reports")}>
                  <FileText className="h-3.5 w-3.5 mr-2" /> Generate Report
                </DropdownMenuItem>
                <DropdownMenuItem className="sm:hidden" onClick={handleExportCSV}>
                  <Download className="h-3.5 w-3.5 mr-2" /> Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsComplianceCheckModalOpen(true)}>
                  <CheckCircle className="h-3.5 w-3.5 mr-2 text-emerald-600" /> Quick Compliance Check
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV}>
                  <Download className="h-3.5 w-3.5 mr-2" /> Export Audit Register (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <FileText className="h-3.5 w-3.5 mr-2" /> Print Compliance Dossier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    toast({
                      title: "Statutory Portal Sync",
                      description: "Active sync with Ministry of Corporate Affairs (MCA) and BIS portals initiated.",
                    });
                  }}
                >
                  <Upload className="h-3.5 w-3.5 mr-2 text-blue-600" /> Sync Statutory Portals
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const escalated: ComplianceRiskRecord = {
                      ...activeRisk,
                      priority: "Critical",
                      status: "Under Review",
                    };
                    setActiveRisk(escalated);
                    setAllRisks((prev) =>
                      prev.map((r) => (r.id === escalated.id ? escalated : r)),
                    );
                    toast({
                      title: "Compliance Gap Escalated",
                      description: `${escalated.id} escalated to Audit Committee & Board of Directors.`,
                    });
                  }}
                >
                  <AlertTriangle className="h-3.5 w-3.5 mr-2 text-red-600" /> Escalate Gap to Board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* When drilled down into a specific subview, provide an easy back button */}
        {activeTab !== "overview" && (
          <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border/80 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span>Current View:</span>
              <Badge variant="secondary" className="font-bold text-foreground">
                {activeTab.toUpperCase()}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs font-semibold gap-1.5"
              onClick={() => setActiveTab("overview")}
            >
              ← Back to Compliance Risk Overview
            </Button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: OVERVIEW - 1:1 REPLICATION OF SCREENSHOT
            ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* ROW 1: 7 EXECUTIVE METRIC CARDS (EXACT SCREENSHOT LAYOUT) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {/* Card 1: Total Compliance Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↑ 12%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-blue-300 rounded-t h-1.5" />
                      <span className="w-1 bg-blue-400 rounded-t h-2" />
                      <span className="w-1 bg-blue-500 rounded-t h-2.5" />
                      <span className="w-1 bg-blue-600 rounded-t h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">36</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Total Compliance Risks
                  </div>
                </div>
              </Card>

              {/* Card 2: Critical Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-red-600 block">
                      ↑ 60%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-red-300 rounded-t h-1" />
                      <span className="w-1 bg-red-400 rounded-t h-2" />
                      <span className="w-1 bg-red-500 rounded-t h-2.5" />
                      <span className="w-1 bg-red-600 rounded-t h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">8</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Critical Risks
                  </div>
                </div>
              </Card>

              {/* Card 3: High Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                    <AlertOctagon className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↑ 20%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-orange-300 rounded-t h-1.5" />
                      <span className="w-1 bg-orange-400 rounded-t h-2" />
                      <span className="w-1 bg-orange-500 rounded-t h-2.5" />
                      <span className="w-1 bg-orange-600 rounded-t h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">12</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    High Risks
                  </div>
                </div>
              </Card>

              {/* Card 4: Medium Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↑ 17%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-amber-300 rounded-t h-1" />
                      <span className="w-1 bg-amber-400 rounded-t h-1.5" />
                      <span className="w-1 bg-amber-500 rounded-t h-2" />
                      <span className="w-1 bg-amber-600 rounded-t h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">10</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Medium Risks
                  </div>
                </div>
              </Card>

              {/* Card 5: Low Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↓ 25%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-emerald-300 rounded-t h-3" />
                      <span className="w-1 bg-emerald-400 rounded-t h-2.5" />
                      <span className="w-1 bg-emerald-500 rounded-t h-2" />
                      <span className="w-1 bg-emerald-600 rounded-t h-1" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">6</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Low Risks
                  </div>
                </div>
              </Card>

              {/* Card 6: Open Compliance Gaps */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Gavel className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-red-600 block">
                      ↑ 29%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-purple-300 rounded-t h-1" />
                      <span className="w-1 bg-purple-400 rounded-t h-2" />
                      <span className="w-1 bg-purple-500 rounded-t h-2.5" />
                      <span className="w-1 bg-purple-600 rounded-t h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">18</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Open Compliance Gaps
                  </div>
                </div>
              </Card>

              {/* Card 7: Expiring Certificates */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↓ 13%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-teal-300 rounded-t h-3" />
                      <span className="w-1 bg-teal-400 rounded-t h-2" />
                      <span className="w-1 bg-teal-500 rounded-t h-1.5" />
                      <span className="w-1 bg-teal-600 rounded-t h-1" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">7</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Expiring Certificates
                  </div>
                </div>
              </Card>
            </div>

            {/* ROW 2: 3-PANEL CORE GRID (COMPLIANCE DETAILS | RISK STATEMENT & IMPACT | HEAT MAP) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* PANEL 1: COMPLIANCE RISK DETAILS (5 cols on xl, full width on lg) */}
              <Card className="lg:col-span-12 xl:col-span-5 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                    <h2 className="text-sm font-bold text-foreground">
                      Compliance Risk Details
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => {
                        setFormData({ ...activeRisk });
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {/* Row 1: Title, Domain, Requirement */}
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Risk Title *
                        </span>
                        <div
                          className="font-semibold text-foreground truncate border border-border/60 rounded px-2 py-1 bg-muted/20"
                          title={activeRisk.title}
                        >
                          {activeRisk.title}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Compliance Domain *
                        </span>
                        <div className="font-semibold text-foreground truncate border border-border/60 rounded px-2 py-1 bg-muted/20">
                          {activeRisk.complianceDomain}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Requirement *
                        </span>
                        <div className="font-semibold text-foreground truncate border border-border/60 rounded px-2 py-1 bg-muted/20">
                          {activeRisk.requirementName}
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Type, Jurisdiction, Business Function */}
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Requirement Type
                        </span>
                        <div className="font-medium text-foreground truncate border border-border/60 rounded px-2 py-1 bg-muted/20">
                          {activeRisk.requirementType}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Jurisdiction
                        </span>
                        <div className="font-medium text-foreground truncate border border-border/60 rounded px-2 py-1 bg-muted/20">
                          {activeRisk.jurisdiction}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Business Function
                        </span>
                        <div className="font-medium text-foreground truncate border border-border/60 rounded px-2 py-1 bg-muted/20">
                          {activeRisk.businessFunction}
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Project, Department, Product/Service */}
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Project
                        </span>
                        <div className="font-medium text-foreground truncate border border-border/60 rounded px-2 py-1 bg-muted/20">
                          {activeRisk.project || "Product Development"}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Department
                        </span>
                        <div className="font-medium text-foreground truncate border border-border/60 rounded px-2 py-1 bg-muted/20">
                          {activeRisk.department}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Product / Service
                        </span>
                        <div className="font-medium text-foreground truncate border border-border/60 rounded px-2 py-1 bg-muted/20">
                          {activeRisk.productService || "W-EVSE Charging Station"}
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Compliance Owner, Risk Owner, Priority, Status */}
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Compliance Owner
                        </span>
                        <div className="flex items-center gap-1.5 border border-border/60 rounded px-2 py-1 bg-muted/20">
                          <span className="h-4 w-4 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                            {activeRisk.complianceOwnerAvatar || "RS"}
                          </span>
                          <span className="font-semibold text-foreground truncate text-[11px]">
                            {activeRisk.complianceOwner}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Risk Owner
                        </span>
                        <div className="flex items-center gap-1.5 border border-border/60 rounded px-2 py-1 bg-muted/20">
                          <span className="h-4 w-4 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                            {activeRisk.riskOwnerAvatar || "PS"}
                          </span>
                          <span className="font-semibold text-foreground truncate text-[11px]">
                            {activeRisk.riskOwner}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Priority
                        </span>
                        <div className="flex items-center gap-1 border border-border/60 rounded px-2 py-1 bg-muted/20 text-orange-600 font-bold">
                          <TrendingUp className="h-3 w-3" />
                          <span>{activeRisk.priority}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Status
                        </span>
                        <div className="flex items-center gap-1 border border-border/60 rounded px-2 py-1 bg-muted/20 text-emerald-600 font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{activeRisk.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Row 5: Identification Date, Review Date, Compliance Due Date */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/40">
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Identification Date
                        </span>
                        <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px] mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{activeRisk.identificationDate}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Review Date
                        </span>
                        <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px] mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{activeRisk.reviewDate}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium block">
                          Compliance Due Date
                        </span>
                        <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px] mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{activeRisk.complianceDueDate || "31-Dec-2026"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* PANEL 2: RISK STATEMENT & IMPACT ASSESSMENT (3 cols on xl, 6 cols on lg) */}
              <Card className="lg:col-span-6 xl:col-span-3 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-3">
                    Risk Statement
                  </h2>

                  {/* Quote Block Matching Screenshot */}
                  <div className="flex gap-2.5 p-3 rounded-lg bg-muted/30 border border-border/60 text-xs leading-relaxed text-muted-foreground">
                    <Quote className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground/90 italic">
                        "{activeRisk.statement}"
                      </p>
                    </div>
                  </div>

                  {/* Impact Assessment 2x2 Grid */}
                  <div className="mt-4">
                    <h3 className="text-xs font-bold text-foreground mb-2">
                      Impact Assessment
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Regulatory Impact */}
                      <div className="p-2.5 rounded-lg border border-border/60 bg-red-500/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded bg-red-500/10 text-red-600 flex items-center justify-center">
                            <Scale className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground font-medium">
                              Regulatory Impact
                            </div>
                            <div className="text-xs font-bold text-red-600">
                              {activeRisk.impacts.regulatoryImpact}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Financial Impact */}
                      <div className="p-2.5 rounded-lg border border-border/60 bg-amber-500/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded bg-amber-500/10 text-amber-600 flex items-center justify-center">
                            <Coins className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground font-medium">
                              Financial Impact
                            </div>
                            <div className="text-xs font-bold text-amber-600">
                              {activeRisk.impacts.financialImpact}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Operational Impact */}
                      <div className="p-2.5 rounded-lg border border-border/60 bg-blue-500/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <Settings className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground font-medium">
                              Operational Impact
                            </div>
                            <div className="text-xs font-bold text-blue-600">
                              {activeRisk.impacts.operationalImpact}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reputation Impact */}
                      <div className="p-2.5 rounded-lg border border-border/60 bg-purple-500/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded bg-purple-500/10 text-purple-600 flex items-center justify-center">
                            <Shield className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground font-medium">
                              Reputation Impact
                            </div>
                            <div className="text-xs font-bold text-purple-600">
                              {activeRisk.impacts.reputationImpact}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* PANEL 3: 5x5 COMPLIANCE RISK HEAT MAP (4 cols on xl, 6 cols on lg) */}
              <Card className="lg:col-span-6 xl:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                    <h2 className="text-sm font-bold text-foreground">
                      Compliance Risk Heat Map
                    </h2>
                    <Select
                      value={matrixView}
                      onValueChange={(val: "inherent" | "residual") => setMatrixView(val)}
                    >
                      <SelectTrigger className="h-6 w-28 text-[11px] font-semibold bg-muted/30">
                        <SelectValue placeholder="Matrix View" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inherent">Inherent Risk</SelectItem>
                        <SelectItem value="residual">Residual Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 5x5 Grid */}
                  <div className="relative pt-1">
                    <div className="flex">
                      {/* Y-Axis Label */}
                      <div className="w-5 flex items-center justify-center -rotate-90 text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                        Likelihood
                      </div>

                      {/* Matrix Grid */}
                      <div className="flex-1 space-y-1">
                        {[5, 4, 3, 2, 1].map((lVal) => (
                          <div key={lVal} className="flex items-center gap-1">
                            <span className="w-2.5 text-[10px] font-bold text-muted-foreground text-center">
                              {lVal}
                            </span>
                            <div className="grid grid-cols-5 gap-1 flex-1">
                              {[1, 2, 3, 4, 5].map((iVal) => {
                                const score = lVal * iVal;
                                let bgColor = "bg-emerald-500/80 hover:bg-emerald-500";
                                if (score >= 17) {
                                  bgColor = "bg-red-500/80 hover:bg-red-500";
                                } else if (score >= 10) {
                                  bgColor = "bg-orange-500/80 hover:bg-orange-500";
                                } else if (score >= 5) {
                                  bgColor = "bg-amber-400/80 hover:bg-amber-400";
                                }

                                // Match screenshot dots: Dot 1 at (5,5), Dot 2 at (4,4), Dot 3 at (3,3), Dot 4 at (2,2)
                                const hasDot1 = matrixView === "inherent" && lVal === 5 && iVal === 5;
                                const hasDot2 = matrixView === "inherent" && lVal === 4 && iVal === 4;
                                const hasDot3 = matrixView === "inherent" && lVal === 3 && iVal === 3;
                                const hasDot4 = matrixView === "inherent" && lVal === 2 && iVal === 2;

                                return (
                                  <div
                                    key={iVal}
                                    className={cn(
                                      "h-6 rounded flex items-center justify-center text-[10px] font-bold text-white transition-all cursor-pointer relative shadow-2xs",
                                      bgColor,
                                    )}
                                    title={`Likelihood ${lVal} × Impact ${iVal} = Score ${score}`}
                                  >
                                    {hasDot1 && (
                                      <span className="h-4 w-4 rounded-full bg-white text-red-600 text-[10px] font-black flex items-center justify-center border border-red-600 shadow-sm animate-pulse">
                                        1
                                      </span>
                                    )}
                                    {hasDot2 && (
                                      <span className="h-4 w-4 rounded-full bg-white text-orange-600 text-[10px] font-black flex items-center justify-center border border-orange-600 shadow-sm">
                                        2
                                      </span>
                                    )}
                                    {hasDot3 && (
                                      <span className="h-4 w-4 rounded-full bg-white text-amber-700 text-[10px] font-black flex items-center justify-center border border-amber-600 shadow-sm">
                                        3
                                      </span>
                                    )}
                                    {hasDot4 && (
                                      <span className="h-4 w-4 rounded-full bg-white text-emerald-700 text-[10px] font-black flex items-center justify-center border border-emerald-600 shadow-sm">
                                        4
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                        {/* X-Axis Numbers */}
                        <div className="flex items-center gap-1 pt-0.5">
                          <span className="w-2.5" />
                          <div className="grid grid-cols-5 gap-1 flex-1 text-center text-[10px] font-bold text-muted-foreground">
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5</span>
                          </div>
                        </div>

                        {/* X-Axis Label */}
                        <div className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider pt-0.5">
                          Impact
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legend matching screenshot */}
                  <div className="grid grid-cols-4 gap-1 pt-2 border-t border-border/40 text-[9px] font-semibold text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-1">
                      <span className="h-2 w-2 rounded-xs bg-emerald-500" />
                      <span>Low (1-4)</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="h-2 w-2 rounded-xs bg-amber-400" />
                      <span>Moderate (5-9)</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="h-2 w-2 rounded-xs bg-orange-500" />
                      <span>High (10-16)</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="h-2 w-2 rounded-xs bg-red-500" />
                      <span>Critical (17-25)</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* ROW 3: CHARTS ROW (TREND | RISK BY DOMAIN DONUT | KRI TABLE) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Compliance Risk Trend (Col-span-4) */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                  <h2 className="text-sm font-bold text-foreground">
                    Compliance Risk Trend
                  </h2>
                  <div className="flex items-center gap-3 text-[10px] font-semibold">
                    <div className="flex items-center gap-1 text-red-600">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      <span>Inherent Risk</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      <span>Residual Risk</span>
                    </div>
                  </div>
                </div>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <XAxis
                        dataKey="month"
                        stroke="#888888"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 30]}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#06101E",
                          border: "1px solid #1e293b",
                          borderRadius: "6px",
                          fontSize: "11px",
                          color: "#fff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="inherent"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#ef4444" }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="residual"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#3b82f6" }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Risk by Compliance Domain Donut (Col-span-4) */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                  <h2 className="text-sm font-bold text-foreground">
                    Risk by Compliance Domain
                  </h2>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 h-52">
                  <div className="h-44 w-44 relative shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={domainData}
                          innerRadius={48}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="count"
                        >
                          {domainData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value, name) => [`${value} Risks`, name]}
                          contentStyle={{
                            backgroundColor: "#06101E",
                            border: "1px solid #1e293b",
                            borderRadius: "6px",
                            fontSize: "11px",
                            color: "#fff",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-lg font-black text-foreground">36</span>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        Total Risks
                      </span>
                    </div>
                  </div>

                  {/* Legend matching screenshot */}
                  <div className="space-y-1 text-[11px] flex-1 overflow-y-auto max-h-48 pr-1">
                    {domainData.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>
                        <span className="font-semibold text-foreground shrink-0 text-right">
                          {item.percentage}% ({item.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Key Risk Indicators (KRI) (Col-span-4) */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                  <h2 className="text-sm font-bold text-foreground">
                    Key Risk Indicators (KRI)
                  </h2>
                  <button
                    onClick={() => setActiveTab("kri")}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/40 text-muted-foreground text-left text-[11px]">
                        <th className="py-1.5 font-semibold">KRI Name</th>
                        <th className="py-1.5 font-semibold">Current</th>
                        <th className="py-1.5 font-semibold">Threshold</th>
                        <th className="py-1.5 font-semibold">Status</th>
                        <th className="py-1.5 font-semibold text-center">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {kris.map((kri) => (
                        <tr key={kri.id} className="hover:bg-muted/20">
                          <td className="py-1.5 font-medium text-foreground truncate max-w-[130px]">
                            {kri.name}
                          </td>
                          <td className="py-1.5 font-bold text-foreground">
                            {kri.current}
                          </td>
                          <td className="py-1.5 text-muted-foreground font-mono">
                            {kri.threshold}
                          </td>
                          <td className="py-1.5">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                kri.status === "Red"
                                  ? "bg-red-500/10 text-red-600 border border-red-200"
                                  : kri.status === "Amber"
                                    ? "bg-amber-500/10 text-amber-600 border border-amber-200"
                                    : "bg-emerald-500/10 text-emerald-600 border border-emerald-200",
                              )}
                            >
                              {kri.status}
                            </span>
                          </td>
                          <td className="py-1.5 text-center">
                            {kri.trend === "up" && (
                              <TrendingUp className="h-3.5 w-3.5 text-red-500 inline" />
                            )}
                            {kri.trend === "down" && (
                              <TrendingDown className="h-3.5 w-3.5 text-amber-500 inline" />
                            )}
                            {kri.trend === "neutral" && (
                              <ArrowRight className="h-3.5 w-3.5 text-emerald-500 inline" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* ROW 4: BOTTOM THREE PANELS (TOP COMPLIANCE RISKS | COMPLIANCE ACTION PLAN | AI INSIGHTS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Top Compliance Risks (Col-span-4) */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                  <h2 className="text-sm font-bold text-foreground">
                    Top Compliance Risks
                  </h2>
                  <button
                    onClick={() => setActiveTab("register")}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/40 text-muted-foreground text-left text-[11px]">
                        <th className="py-1.5 font-semibold">ID</th>
                        <th className="py-1.5 font-semibold">Risk Title</th>
                        <th className="py-1.5 font-semibold">Domain</th>
                        <th className="py-1.5 font-semibold text-center">Inherent</th>
                        <th className="py-1.5 font-semibold text-center">Residual</th>
                        <th className="py-1.5 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {topRisks.map((risk) => (
                        <tr
                          key={risk.id}
                          className="hover:bg-muted/30 cursor-pointer transition-colors"
                          onClick={() => {
                            const found = allRisks.find(
                              (r) => r.id === risk.id || r.riskCode.includes(risk.id),
                            );
                            if (found) setActiveRisk(found);
                          }}
                        >
                          <td className="py-1.5 font-mono text-primary font-bold">
                            {risk.id}
                          </td>
                          <td className="py-1.5 font-medium text-foreground truncate max-w-[110px]">
                            {risk.title}
                          </td>
                          <td className="py-1.5 text-muted-foreground">
                            {risk.domain}
                          </td>
                          <td className="py-1.5 text-center">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-bold text-white",
                                risk.inherent >= 17 ? "bg-red-500" : "bg-orange-500",
                              )}
                            >
                              {risk.inherent}
                            </span>
                          </td>
                          <td className="py-1.5 text-center">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-bold text-white",
                                risk.residual >= 10 ? "bg-orange-400" : "bg-amber-400",
                              )}
                            >
                              {risk.residual}
                            </span>
                          </td>
                          <td className="py-1.5 text-right">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                risk.status === "Monitoring"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : risk.status === "Open"
                                    ? "bg-amber-500/10 text-amber-600"
                                    : "bg-red-500/10 text-red-600",
                              )}
                            >
                              {risk.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Compliance Action Plan (Col-span-4) */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                  <h2 className="text-sm font-bold text-foreground">
                    Compliance Action Plan
                  </h2>
                  <button
                    onClick={() => setActiveTab("treatment")}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/40 text-muted-foreground text-left text-[11px]">
                        <th className="py-1.5 font-semibold">Action</th>
                        <th className="py-1.5 font-semibold">Owner</th>
                        <th className="py-1.5 font-semibold">Due Date</th>
                        <th className="py-1.5 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {actionPlan.map((act) => (
                        <tr key={act.id} className="hover:bg-muted/20">
                          <td className="py-1.5 font-medium text-foreground truncate max-w-[130px]">
                            {act.action}
                          </td>
                          <td className="py-1.5 text-muted-foreground truncate max-w-[80px]">
                            {act.owner}
                          </td>
                          <td className="py-1.5 font-mono text-muted-foreground text-[11px]">
                            {act.dueDate}
                          </td>
                          <td className="py-1.5 text-right">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                act.status === "In Progress"
                                  ? "bg-blue-500/10 text-blue-600"
                                  : act.status === "Open"
                                    ? "bg-red-500/10 text-red-600"
                                    : act.status === "Completed"
                                      ? "bg-emerald-500/10 text-emerald-600"
                                      : "bg-muted text-muted-foreground",
                              )}
                            >
                              {act.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* AI Compliance Insights (Col-span-4) */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <h2 className="text-sm font-bold text-foreground">
                        AI Compliance Insights
                      </h2>
                    </div>
                    <Badge className="bg-purple-600 text-white font-bold text-[10px] px-2 py-0.5">
                      AI Powered
                    </Badge>
                  </div>

                  {/* 6 Numbered Insights matching screenshot */}
                  <div className="space-y-2 text-xs">
                    {aiInsights.map((insight) => (
                      <div key={insight.num} className="flex items-start gap-2">
                        <span
                          className={cn(
                            "h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5",
                            insight.color,
                          )}
                        >
                          {insight.num}
                        </span>
                        <p className="text-muted-foreground text-[11px] leading-tight font-medium">
                          {insight.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4 Bottom Action Buttons matching screenshot */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-3 mt-2 border-t border-border/40">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-1 font-semibold"
                    onClick={() => setIsRegulatoryWatchModalOpen(true)}
                  >
                    Regulatory Watch
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-1 font-semibold"
                    onClick={() => setIsComplianceCheckModalOpen(true)}
                  >
                    Run Compliance Check
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-1 font-semibold"
                    onClick={() => setActiveTab("evidence")}
                  >
                    View Evidence
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-1 font-semibold"
                    onClick={() => setActiveTab("reports")}
                  >
                    Download Report
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: COMPLIANCE RISK REGISTER
            ========================================================================= */}
        {activeTab === "register" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Compliance Risk Register
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Master list of statutory, regulatory, product, and contractual obligations.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search risk, regulation, requirement..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-8 text-xs bg-muted/20"
                    />
                  </div>

                  <Select
                    value={selectedDomainFilter}
                    onValueChange={setSelectedDomainFilter}
                  >
                    <SelectTrigger className="h-8 w-40 text-xs">
                      <SelectValue placeholder="All Domains" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Domains</SelectItem>
                      <SelectItem value="Legal & Regulatory">Legal & Regulatory</SelectItem>
                      <SelectItem value="Product Compliance">Product Compliance</SelectItem>
                      <SelectItem value="Financial Compliance">Financial Compliance</SelectItem>
                      <SelectItem value="Cybersecurity & Privacy">Cybersecurity & Privacy</SelectItem>
                      <SelectItem value="Quality Compliance">Quality Compliance</SelectItem>
                      <SelectItem value="Employment & HR">Employment & HR</SelectItem>
                      <SelectItem value="ESG Compliance">ESG Compliance</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedStatusFilter}
                    onValueChange={setSelectedStatusFilter}
                  >
                    <SelectTrigger className="h-8 w-36 text-xs">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Monitoring">Monitoring</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Escalated">Escalated</SelectItem>
                      <SelectItem value="Treatment Required">Treatment Required</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border/60">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border/60 text-muted-foreground text-left">
                      <th className="py-2.5 px-3 font-semibold">ID</th>
                      <th className="py-2.5 px-3 font-semibold">Risk Code</th>
                      <th className="py-2.5 px-3 font-semibold">Risk Title</th>
                      <th className="py-2.5 px-3 font-semibold">Domain</th>
                      <th className="py-2.5 px-3 font-semibold">Requirement</th>
                      <th className="py-2.5 px-3 font-semibold">Jurisdiction</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Inherent</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Residual</th>
                      <th className="py-2.5 px-3 font-semibold">Owner</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredRisks.map((risk) => (
                      <tr
                        key={risk.id}
                        className={cn(
                          "hover:bg-muted/30 transition-colors",
                          activeRisk.id === risk.id && "bg-primary/5",
                        )}
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">
                          {risk.id}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">
                          {risk.riskCode}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-foreground max-w-xs truncate">
                          {risk.title}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {risk.complianceDomain}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-foreground truncate max-w-[140px]">
                          {risk.requirementName}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {risk.jurisdiction}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[11px] font-bold text-white",
                              risk.inherentScore >= 17
                                ? "bg-red-500"
                                : risk.inherentScore >= 10
                                  ? "bg-orange-500"
                                  : "bg-amber-400",
                            )}
                          >
                            {risk.inherentScore}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[11px] font-bold text-white",
                              risk.residualScore >= 10
                                ? "bg-orange-400"
                                : "bg-emerald-500",
                            )}
                          >
                            {risk.residualScore}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-foreground">
                          {risk.riskOwner}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              risk.status === "Monitoring"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : risk.status === "Open"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : risk.status === "Escalated"
                                    ? "bg-red-500/10 text-red-600"
                                    : "bg-blue-500/10 text-blue-600",
                            )}
                          >
                            {risk.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                setActiveRisk(risk);
                                setActiveTab("overview");
                              }}
                              title="Set as Active Form"
                            >
                              <Check className="h-3.5 w-3.5 text-primary" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setSelectedRiskForView(risk)}
                              title="Quick View"
                            >
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 3: REQUIREMENTS MASTER
            ========================================================================= */}
        {activeTab === "requirements" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Requirement Classification & Applicability Master
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Controlled inventory of statutory acts, regulations, standards, permits, and corporate governance rules.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold"
                  onClick={() => {
                    toast({
                      title: "Add Requirement",
                      description: "Opening regulatory mapping dialogue...",
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Link New Requirement
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {requirements.map((req) => (
                  <Card key={req.id} className="p-3.5 border-border/60 bg-muted/10">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {req.id}
                          </span>
                          <Badge variant="outline" className="text-[10px] font-semibold">
                            {req.requirementType}
                          </Badge>
                          <Badge
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0.2",
                              req.mandatoryStatus === "Mandatory"
                                ? "bg-red-500/10 text-red-600"
                                : "bg-blue-500/10 text-blue-600",
                            )}
                          >
                            {req.mandatoryStatus}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-sm text-foreground mt-1.5">
                          {req.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Issuing Authority: <span className="text-foreground font-medium">{req.issuingAuthority}</span>
                        </p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                        {req.applicability}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-border/40 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Jurisdiction & Ref:
                        </span>
                        <span className="font-medium text-foreground">
                          {req.jurisdiction} • {req.referenceNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Related Function:
                        </span>
                        <span className="font-medium text-foreground">
                          {req.relatedFunction}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 bg-muted/40 p-2 rounded text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground">Evidence Mandate: </span>
                      {req.evidenceRequirement}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 4: COMPLIANCE OBLIGATIONS REGISTER
            ========================================================================= */}
        {activeTab === "obligations" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Compliance Obligation Register
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Recurring filing schedules, statutory audits, renewals, and periodic submissions.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold"
                  onClick={() => {
                    toast({
                      title: "Compliance Calendar Sync",
                      description: "Synchronized 7 pending statutory milestones with Outlook/Google Calendar.",
                    });
                  }}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Sync Compliance Calendar
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border/60">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border/60 text-muted-foreground text-left">
                      <th className="py-2.5 px-3 font-semibold">Obligation ID</th>
                      <th className="py-2.5 px-3 font-semibold">Obligation Title</th>
                      <th className="py-2.5 px-3 font-semibold">Requirement</th>
                      <th className="py-2.5 px-3 font-semibold">Accountable Owner</th>
                      <th className="py-2.5 px-3 font-semibold">Cadence</th>
                      <th className="py-2.5 px-3 font-semibold">Due Date</th>
                      <th className="py-2.5 px-3 font-semibold">Evidence Expected</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {obligations.map((obl) => (
                      <tr key={obl.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">
                          {obl.id}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">
                          {obl.obligation}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {obl.requirement}
                        </td>
                        <td className="py-2.5 px-3 text-foreground">
                          {obl.owner}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant="outline" className="text-[10px]">
                            {obl.frequency}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-foreground font-medium">
                          {obl.dueDate}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground text-[11px] truncate max-w-xs">
                          {obl.evidence}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              obl.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : obl.status === "In Progress"
                                  ? "bg-blue-500/10 text-blue-600"
                                  : "bg-amber-500/10 text-amber-600",
                            )}
                          >
                            {obl.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 5: RISK ASSESSMENT (INHERENT VS RESIDUAL MATRIX)
            ========================================================================= */}
        {activeTab === "assessment" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="border-b border-border/60 pb-3 mb-4">
                <h2 className="text-base font-bold text-foreground">
                  Inherent vs Residual Compliance Risk Assessment
                </h2>
                <p className="text-xs text-muted-foreground">
                  Statutory scoring methodology: Risk Score = Likelihood (1-5) × Impact (1-5).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Inherent Risk Card */}
                <div className="p-4 rounded-xl border border-red-200 bg-red-500/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      Inherent Compliance Risk (Pre-Controls)
                    </span>
                    <Badge className="bg-red-500 text-white font-bold">
                      Score: {activeRisk.inherentScore} / 25
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                    <div className="p-2.5 rounded bg-background border border-border/60">
                      <span className="text-muted-foreground block text-[11px]">Likelihood</span>
                      <span className="text-sm font-bold text-foreground">
                        {activeRisk.likelihood} - Almost Certain
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-background border border-border/60">
                      <span className="text-muted-foreground block text-[11px]">Impact</span>
                      <span className="text-sm font-bold text-foreground">
                        {activeRisk.impact} - Severe
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Evaluates statutory consequences before deployment of preventative gate controls, legal audits, and technical safeguards.
                  </p>
                </div>

                {/* Residual Risk Card */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-500/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Residual Compliance Risk (Post-Controls & Remediation)
                    </span>
                    <Badge className="bg-blue-600 text-white font-bold">
                      Score: {activeRisk.residualScore} / 25
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                    <div className="p-2.5 rounded bg-background border border-border/60">
                      <span className="text-muted-foreground block text-[11px]">Residual Likelihood</span>
                      <span className="text-sm font-bold text-foreground">
                        {activeRisk.residualLikelihood} - Possible
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-background border border-border/60">
                      <span className="text-muted-foreground block text-[11px]">Residual Impact</span>
                      <span className="text-sm font-bold text-foreground">
                        {activeRisk.residualImpact} - Major
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Calculated net exposure following control testing, technical remediations, and legal risk mitigation treatments.
                  </p>
                </div>
              </div>

              {/* MAICW Controlled Field Taxonomy */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-foreground mb-2">
                  Section 1: MAICW Controlled Form Field Governance
                </h3>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40">
                      <tr className="border-b border-border/60 text-muted-foreground text-left">
                        <th className="py-2 px-3 font-semibold">Field</th>
                        <th className="py-2 px-3 font-semibold">Type</th>
                        <th className="py-2 px-3 font-semibold text-center">MAICW</th>
                        <th className="py-2 px-3 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {maicwFields.map((f) => (
                        <tr key={f.field} className="hover:bg-muted/20">
                          <td className="py-1.5 px-3 font-semibold text-foreground">
                            {f.field}
                          </td>
                          <td className="py-1.5 px-3 text-muted-foreground">
                            {f.type}
                          </td>
                          <td className="py-1.5 px-3 text-center">
                            <span
                              className={cn(
                                "h-5 w-5 rounded-full text-[10px] font-bold inline-flex items-center justify-center text-white",
                                f.maicw === "M"
                                  ? "bg-red-500"
                                  : f.maicw === "A"
                                    ? "bg-blue-500"
                                    : f.maicw === "I"
                                      ? "bg-purple-500"
                                      : f.maicw === "C"
                                        ? "bg-amber-500"
                                        : "bg-emerald-500",
                              )}
                            >
                              {f.maicw}
                            </span>
                          </td>
                          <td className="py-1.5 px-3 text-muted-foreground text-[11px]">
                            {f.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 6: CONTROLS & GAPS
            ========================================================================= */}
        {activeTab === "controls" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Compliance Gap Assessment & Internal Controls
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Audit discrepancies, documentation voids, testing deficiencies, and preventative controls.
                  </p>
                </div>
              </div>

              {/* Open Compliance Gaps */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-foreground mb-2.5 flex items-center gap-2">
                  <Gavel className="h-4 w-4 text-purple-600" />
                  Active Compliance Gaps (18 Open)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {gaps.map((gap) => (
                    <Card key={gap.id} className="p-3.5 border-border/60 bg-muted/10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded">
                            {gap.id}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {gap.gapType}
                          </Badge>
                        </div>
                        <Badge
                          className={cn(
                            "text-[10px] font-bold",
                            gap.severity === "Critical"
                              ? "bg-red-500/10 text-red-600"
                              : "bg-orange-500/10 text-orange-600",
                          )}
                        >
                          {gap.severity}
                        </Badge>
                      </div>

                      <div className="mt-2 text-xs space-y-1">
                        <div>
                          <span className="text-muted-foreground text-[11px] block">Current State:</span>
                          <span className="font-medium text-foreground">{gap.currentState}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-[11px] block">Required Mandate:</span>
                          <span className="font-semibold text-emerald-600">{gap.requiredState}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Owner: <strong className="text-foreground">{gap.owner}</strong></span>
                        <span>Target: <strong className="font-mono text-foreground">{gap.targetClosureDate}</strong></span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Controls Master */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  Preventive & Detective Compliance Controls
                </h3>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40">
                      <tr className="border-b border-border/60 text-muted-foreground text-left">
                        <th className="py-2.5 px-3 font-semibold">Control ID</th>
                        <th className="py-2.5 px-3 font-semibold">Control Title</th>
                        <th className="py-2.5 px-3 font-semibold">Type</th>
                        <th className="py-2.5 px-3 font-semibold">Objective</th>
                        <th className="py-2.5 px-3 font-semibold">Design</th>
                        <th className="py-2.5 px-3 font-semibold">Operating</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {controls.map((ctl) => (
                        <tr key={ctl.id} className="hover:bg-muted/20">
                          <td className="py-2.5 px-3 font-mono font-bold text-primary">
                            {ctl.id}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-foreground">
                            {ctl.controlName}
                          </td>
                          <td className="py-2.5 px-3">
                            <Badge variant="outline" className="text-[10px]">
                              {ctl.controlType}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground max-w-xs truncate">
                            {ctl.objective}
                          </td>
                          <td className="py-2.5 px-3 text-emerald-600 font-semibold">
                            {ctl.designEffectiveness}
                          </td>
                          <td className="py-2.5 px-3 text-emerald-600 font-semibold">
                            {ctl.operatingEffectiveness}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">
                              {ctl.result}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 7: TREATMENT & ACTIONS
            ========================================================================= */}
        {activeTab === "treatment" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Compliance Risk Treatment & Action Plan
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Remediation workflows, CAPA closures, policy updates, and certification execution.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold"
                  onClick={() => {
                    toast({
                      title: "Add Treatment Action",
                      description: "Opening CAPA action modal...",
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Action Item
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border/60">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border/60 text-muted-foreground text-left">
                      <th className="py-2.5 px-3 font-semibold">Action ID</th>
                      <th className="py-2.5 px-3 font-semibold">Action Title</th>
                      <th className="py-2.5 px-3 font-semibold">Owner</th>
                      <th className="py-2.5 px-3 font-semibold">Due Date</th>
                      <th className="py-2.5 px-3 font-semibold">Allocated Budget</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-3 font-semibold">Evidence / Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {actionPlan.map((act) => (
                      <tr key={act.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">
                          {act.id}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">
                          {act.action}
                        </td>
                        <td className="py-2.5 px-3 text-foreground">
                          {act.owner}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">
                          {act.dueDate}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">
                          {act.budget || "₹ 1.5 L"}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              act.status === "In Progress"
                                ? "bg-blue-500/10 text-blue-600"
                                : act.status === "Open"
                                  ? "bg-red-500/10 text-red-600"
                                  : act.status === "Completed"
                                    ? "bg-emerald-500/10 text-emerald-600"
                                    : "bg-muted text-muted-foreground",
                            )}
                          >
                            {act.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground text-[11px] max-w-xs truncate">
                          {act.evidence}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 8: KRI MONITORING
            ========================================================================= */}
        {activeTab === "kri" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="border-b border-border/60 pb-3 mb-4">
                <h2 className="text-base font-bold text-foreground">
                  Key Risk Indicators (KRI) & Early Warning Signals
                </h2>
                <p className="text-xs text-muted-foreground">
                  Quantitative threshold tracking for filing delinquency, audit findings, and training completion.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {kris.map((kri) => (
                  <Card key={kri.id} className="p-3.5 border-border/60 bg-muted/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[11px] text-muted-foreground font-bold">
                          {kri.id}
                        </span>
                        <h3 className="font-bold text-sm text-foreground mt-0.5">
                          {kri.name}
                        </h3>
                      </div>
                      <Badge
                        className={cn(
                          "text-[10px] font-bold",
                          kri.status === "Red"
                            ? "bg-red-500/10 text-red-600"
                            : kri.status === "Amber"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-emerald-500/10 text-emerald-600",
                        )}
                      >
                        {kri.status}
                      </Badge>
                    </div>

                    <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-border/40">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">
                          Current Metric
                        </span>
                        <span className="text-xl font-extrabold text-foreground">
                          {kri.current}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-muted-foreground block">
                          Tolerance Threshold
                        </span>
                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                          {kri.threshold}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Owner: <strong className="text-foreground">{kri.owner}</strong></span>
                      <span className="flex items-center gap-1">
                        Trend:{" "}
                        {kri.trend === "up" ? (
                          <span className="text-red-500 font-bold flex items-center">
                            ↑ Escalating
                          </span>
                        ) : kri.trend === "down" ? (
                          <span className="text-amber-500 font-bold flex items-center">
                            ↓ Declining
                          </span>
                        ) : (
                          <span className="text-emerald-500 font-bold flex items-center">
                            → Stable
                          </span>
                        )}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 9: AUDIT & EVIDENCE MANAGEMENT
            ========================================================================= */}
        {activeTab === "evidence" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Compliance Evidence Repository & Certificate Vault
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Traceable certificates, test reports, statutory filing receipts, and license expiry countdowns.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold"
                  onClick={() => setIsEvidenceModalOpen(true)}
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Evidence Artifact
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border/60">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border/60 text-muted-foreground text-left">
                      <th className="py-2.5 px-3 font-semibold">Evidence ID</th>
                      <th className="py-2.5 px-3 font-semibold">Document Title</th>
                      <th className="py-2.5 px-3 font-semibold">Requirement</th>
                      <th className="py-2.5 px-3 font-semibold">Issuing Body</th>
                      <th className="py-2.5 px-3 font-semibold">Issue Date</th>
                      <th className="py-2.5 px-3 font-semibold">Expiry Date</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Days Left</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Validity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {evidenceList.map((ev) => (
                      <tr key={ev.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">
                          {ev.id}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">
                          {ev.documentTitle}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {ev.requirement}
                        </td>
                        <td className="py-2.5 px-3 text-foreground">
                          {ev.issuingBody}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">
                          {ev.issuedDate}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">
                          {ev.expiryDate}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded font-mono font-bold text-[11px]",
                              ev.daysRemaining < 60
                                ? "bg-red-500/10 text-red-600"
                                : "bg-emerald-500/10 text-emerald-600",
                            )}
                          >
                            {ev.daysRemaining > 900 ? "N/A" : `${ev.daysRemaining} d`}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Badge
                            className={cn(
                              "text-[10px] font-bold",
                              ev.validityStatus === "Valid"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-amber-500/10 text-amber-600",
                            )}
                          >
                            {ev.validityStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 10: REPORTS
            ========================================================================= */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Compliance Risk Reports Suite (Section 43)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Automated board decks, statutory dossiers, audit non-conformance logs, and gazette digests.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold"
                  onClick={handleExportCSV}
                >
                  <Download className="h-3.5 w-3.5" />
                  Export All Registers (CSV)
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {reportsList.map((rep) => (
                  <Card
                    key={rep.id}
                    className="p-3.5 border-border/60 bg-muted/10 hover:border-primary/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-primary">
                          {rep.id}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {rep.category}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-sm text-foreground mt-2">
                        {rep.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {rep.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4 pt-2.5 border-t border-border/40">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          toast({
                            title: `Generating ${rep.name}`,
                            description: "Compiling statutory audit dossier...",
                          });
                        }}
                      >
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => {
                          toast({
                            title: "Report Exported",
                            description: `Saved ${rep.name}.pdf to downloads.`,
                          });
                        }}
                      >
                        Export PDF
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* =========================================================================
          DIALOG: EDIT COMPLIANCE RISK
          ========================================================================= */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Edit Compliance Risk — {activeRisk.id}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-2 text-xs">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs font-bold">Risk Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Compliance Domain</Label>
              <Select
                value={formData.complianceDomain}
                onValueChange={(val: ComplianceDomain) =>
                  setFormData({ ...formData, complianceDomain: val })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Legal & Regulatory">Legal & Regulatory</SelectItem>
                  <SelectItem value="Product Compliance">Product Compliance</SelectItem>
                  <SelectItem value="Financial Compliance">Financial Compliance</SelectItem>
                  <SelectItem value="Cybersecurity & Privacy">Cybersecurity & Privacy</SelectItem>
                  <SelectItem value="Quality Compliance">Quality Compliance</SelectItem>
                  <SelectItem value="Employment & HR">Employment & HR</SelectItem>
                  <SelectItem value="ESG Compliance">ESG Compliance</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Requirement Name *</Label>
              <Input
                value={formData.requirementName}
                onChange={(e) =>
                  setFormData({ ...formData, requirementName: e.target.value })
                }
              />
            </div>

            <div className="col-span-2 space-y-1">
              <Label className="text-xs font-bold">Risk Statement</Label>
              <Textarea
                rows={2}
                value={formData.statement}
                onChange={(e) =>
                  setFormData({ ...formData, statement: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Compliance Owner</Label>
              <Input
                value={formData.complianceOwner}
                onChange={(e) =>
                  setFormData({ ...formData, complianceOwner: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Risk Owner</Label>
              <Input
                value={formData.riskOwner}
                onChange={(e) =>
                  setFormData({ ...formData, riskOwner: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(val: any) =>
                  setFormData({ ...formData, priority: val })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val: any) =>
                  setFormData({ ...formData, status: val })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monitoring">Monitoring</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Escalated">Escalated</SelectItem>
                  <SelectItem value="Treatment Required">Treatment Required</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground"
              onClick={() => handleSaveRisk(formData)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG: CREATE NEW COMPLIANCE RISK
          ========================================================================= */}
      <Dialog open={isNewRiskModalOpen} onOpenChange={setIsNewRiskModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Register New Compliance Risk
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-2 text-xs">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs font-bold">Risk Title *</Label>
              <Input
                placeholder="e.g. Non-compliance with Battery Waste Management Rules"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Compliance Domain *</Label>
              <Select
                value={formData.complianceDomain}
                onValueChange={(val: ComplianceDomain) =>
                  setFormData({ ...formData, complianceDomain: val })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Legal & Regulatory">Legal & Regulatory</SelectItem>
                  <SelectItem value="Product Compliance">Product Compliance</SelectItem>
                  <SelectItem value="Financial Compliance">Financial Compliance</SelectItem>
                  <SelectItem value="Cybersecurity & Privacy">Cybersecurity & Privacy</SelectItem>
                  <SelectItem value="Quality Compliance">Quality Compliance</SelectItem>
                  <SelectItem value="Employment & HR">Employment & HR</SelectItem>
                  <SelectItem value="ESG Compliance">ESG Compliance</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Requirement / Standard</Label>
              <Input
                placeholder="e.g. BWMR 2022"
                value={formData.requirementName}
                onChange={(e) =>
                  setFormData({ ...formData, requirementName: e.target.value })
                }
              />
            </div>

            <div className="col-span-2 space-y-1">
              <Label className="text-xs font-bold">Risk Statement</Label>
              <Textarea
                rows={2}
                placeholder="Failure to meet [REQUIREMENT] may result in [EVENT], causing [IMPACT]..."
                value={formData.statement}
                onChange={(e) =>
                  setFormData({ ...formData, statement: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Compliance Owner</Label>
              <Input
                value={formData.complianceOwner}
                onChange={(e) =>
                  setFormData({ ...formData, complianceOwner: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Risk Owner</Label>
              <Input
                value={formData.riskOwner}
                onChange={(e) =>
                  setFormData({ ...formData, riskOwner: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Likelihood (1-5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={formData.likelihood}
                onChange={(e) =>
                  setFormData({ ...formData, likelihood: Number(e.target.value) })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Impact (1-5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={formData.impact}
                onChange={(e) =>
                  setFormData({ ...formData, impact: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewRiskModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground font-semibold"
              onClick={handleCreateRisk}
            >
              Create Compliance Risk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG: REGULATORY WATCH / GAZETTE FEED
          ========================================================================= */}
      <Dialog
        open={isRegulatoryWatchModalOpen}
        onOpenChange={setIsRegulatoryWatchModalOpen}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              Automated Regulatory Watch & Gazette Feeds
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">
                  Draft Wireless Power Transfer Charging Standards (IS 17017-21 Amd 1)
                </span>
                <Badge className="bg-blue-500/10 text-blue-600 text-[10px]">
                  Gazette Alert
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                Bureau of Indian Standards opened 60-day public comment window for high-frequency magnetic field safety guidelines for EV chargers.
              </p>
              <span className="text-[10px] text-muted-foreground block mt-2 font-mono">
                Published: 12-Sep-2026 • Effective Date: 01-Jan-2027
              </span>
            </div>

            <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">
                  DPDP Act Rules & Consent Management Implementation Guidelines
                </span>
                <Badge className="bg-purple-500/10 text-purple-600 text-[10px]">
                  Statutory Rule
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                MeitY released draft procedural guidelines for registration of significant data fiduciaries and cross-border telemetry data flow.
              </p>
              <span className="text-[10px] text-muted-foreground block mt-2 font-mono">
                Published: 05-Sep-2026 • Mandate Phase: Q4 FY26
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              size="sm"
              onClick={() => setIsRegulatoryWatchModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG: RUN COMPLIANCE CHECK
          ========================================================================= */}
      <Dialog
        open={isComplianceCheckModalOpen}
        onOpenChange={setIsComplianceCheckModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              Automated AI Compliance Health Check
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-muted/30 border border-border/60">
              <span>Statutory Filings Scanned (GST/TDS/MCA)</span>
              <span className="font-bold text-emerald-600">✓ 100% Passed</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-muted/30 border border-border/60">
              <span>Licenses & Factory Permits Expiring in 60d</span>
              <span className="font-bold text-amber-600">2 Alerts Flagged</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-muted/30 border border-border/60">
              <span>Open Audit Findings Verification</span>
              <span className="font-bold text-red-600">8 Findings Pending</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-muted/30 border border-border/60">
              <span>Employee Compliance Training Rate</span>
              <span className="font-bold text-foreground">88% (Target: 95%)</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground"
              onClick={() => {
                setIsComplianceCheckModalOpen(false);
                toast({
                  title: "Compliance Health Index",
                  description: "Current enterprise compliance posture is 94.2% compliant.",
                });
              }}
            >
              Acknowledge & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}


