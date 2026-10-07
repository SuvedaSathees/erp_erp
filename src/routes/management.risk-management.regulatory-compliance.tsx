// Magnertia ERP - Regulatory Compliance Module
// Management -> Risk Management -> Regulatory Compliance
// Regulatory Compliance Form — MAICW Classification, Overview, Widgets, and Controlled Audit Reports

import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getRegulatoryComplianceRecordFn } from "@/lib/regulatoryComplianceFns.server";
import {
  FileText,
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  Upload,
  Download,
  Printer,
  Search,
  Filter,
  Eye,
  ExternalLink,
  ChevronRight,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Save,
  Send,
  MoreVertical,
  Check,
  X,
  FileCheck,
  Building,
  UserCheck,
  Lock,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Sliders,
  Scale,
  Paperclip,
  History,
  FileSpreadsheet,
  BarChart3,
  Award,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import { AppShell } from "@/components/erp/AppShell";
import { ComplianceTabBar } from "@/components/erp/ComplianceTabBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  DialogDescription,
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import {
  regulatoryComplianceService,
  PRIMARY_REGULATORY_RECORD,
  FULL_COMPLIANCE_RECORDS,
  EXECUTIVE_KPIS,
  REGULATORY_REPORT_DEFINITIONS,
  REGULATORY_KPI_MASTER,
  MANAGEMENT_REVIEW_AGENDA,
  type RegulatoryComplianceRecord,
  type ReportDefinition,
  type ComplianceControlItem,
  type ComplianceEvidenceItem,
} from "@/services/regulatoryComplianceService";

export const Route = createFileRoute(
  "/management/risk-management/regulatory-compliance"
)({
  component: RegulatoryCompliancePage,
  head: () => ({
    meta: [
      { title: "Regulatory Compliance · Risk Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Regulatory Compliance Form — MAICW Classification, Statutory Obligations, Controls, Evidence, Filings, 24 Audit Reports, and Compliance Intelligence.",
      },
    ],
  }),
});

// All 13 Submodules planned in the rollout
const SUBMODULE_TABS = [
  { id: "overview", label: "General" },
  { id: "regulatory-details", label: "Regulatory Details" },
  { id: "obligations", label: "Obligations" },
  { id: "controls-evidence", label: "Controls & Evidence" },
  { id: "filings", label: "Filings & Submissions" },
  { id: "inspections-audits", label: "Inspections & Audits" },
  { id: "risk-gaps", label: "Risk & Gaps" },
  { id: "actions", label: "Actions" },
  { id: "related-records", label: "Related Records" },
  { id: "attachments", label: "Attachments" },
  { id: "history", label: "History" },
  { id: "reports", label: "Reports" },
];

function RegulatoryCompliancePage() {
  const { toast } = useToast();

  // Prisma-backed query with inline fallback
  const { data: dbRecord } = useQuery({
    queryKey: ["regulatory-compliance", "record"],
    queryFn: () => getRegulatoryComplianceRecordFn({ data: {} }),
  });

  // Active record state (matches screenshot by default)
  const [activeRecord, setActiveRecord] = useState<RegulatoryComplianceRecord>(
    regulatoryComplianceService.getPrimaryRecord()
  );
  useEffect(() => { if (dbRecord?.data) setActiveRecord(dbRecord.data as RegulatoryComplianceRecord); }, [dbRecord]);

  // Tab state: "overview" (General) or "reports" (Reports)
  const [activeSubmodule, setActiveSubmodule] = useState<string>("overview");

  // Search in top header
  const [globalSearch, setGlobalSearch] = useState<string>("");

  // Report state
  const [selectedReportId, setSelectedReportId] = useState<string>("REP-01");
  const [reportCategoryFilter, setReportCategoryFilter] = useState<string>("All");
  const [reportSearchQuery, setReportSearchQuery] = useState<string>("");
  const [reportDateRange, setReportDateRange] = useState<string>("Q1 2026");

  // Modals state
  const [isAddControlOpen, setIsAddControlOpen] = useState(false);
  const [isUploadEvidenceOpen, setIsUploadEvidenceOpen] = useState(false);
  const [isRecordFilingOpen, setIsRecordFilingOpen] = useState(false);
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);
  const [isQuickCheckModalOpen, setIsQuickCheckModalOpen] = useState(false);
  const [isCreateActionOpen, setIsCreateActionOpen] = useState(false);
  const [isScheduleInspectionOpen, setIsScheduleInspectionOpen] = useState(false);
  const [isUploadAttachmentOpen, setIsUploadAttachmentOpen] = useState(false);

  // Form states for modals
  const [newControl, setNewControl] = useState({
    id: `C-00${activeRecord.controls.length + 1}`,
    name: "",
    type: "Preventive" as ComplianceControlItem["type"],
    frequency: "Monthly" as ComplianceControlItem["frequency"],
    owner: activeRecord.complianceOwner,
    status: "Effective" as ComplianceControlItem["status"],
  });

  const [newEvidence, setNewEvidence] = useState({
    name: "",
    type: "Filing Acknowledgement",
    date: new Date().toISOString().split("T")[0],
    expiryDate: "-",
    issuer: "Regulatory Authority",
    status: "Verified" as ComplianceEvidenceItem["status"],
    storageLocation: "ERP Document Vault / Regulatory",
  });

  const [newFiling, setNewFiling] = useState({
    period: "Mar 2026",
    type: "GSTR-3B Filing",
    ackNo: "AA270326098199X",
    remarks: "Timely monthly filing with reconciled input tax credit",
  });

  const [actionsList, setActionsList] = useState([
    { id: "CAPA-2026-01", description: "Reconcile vendor ITC mis-matches on GSTR-2B", owner: "K. Ramanathan", dueDate: "2026-03-31", status: "In Progress", priority: "High" },
    { id: "CAPA-2026-02", description: "Implement automated HSN validation on outward sales invoice", owner: "S. Priya", dueDate: "2026-04-10", status: "Open", priority: "Medium" },
    { id: "CAPA-2026-03", description: "Audit trail archival verification for FY 2024-25 records", owner: "D. Mehra", dueDate: "2026-04-25", status: "Verified", priority: "Low" },
  ]);

  const [inspectionsList, setInspectionsList] = useState([
    { id: "INS-2026-01", agency: "Central GST Commissionerate", date: "2026-01-15", auditor: "Superintendent Range-IV", scope: "Input Tax Credit Audit", result: "Conform", findings: 0 },
    { id: "INS-2026-02", agency: "State Labour Inspectorate", date: "2026-02-10", auditor: "Labour Welfare Officer", scope: "Factories Act Statutory Registers", result: "Minor OFI", findings: 1 },
    { id: "INS-2026-03", agency: "Pollution Control Board", date: "2026-03-05", auditor: "Regional Environmental Officer", scope: "Hazardous Waste Manifest & CTE/CTO", result: "Conform", findings: 0 },
  ]);

  const [filingsList, setFilingsList] = useState([
    { id: "FIL-01", period: "Feb 2026", type: "GSTR-3B Monthly Return", date: "20-Mar-2026", ackNo: "AA270326098199X", status: "Filed On-Time", owner: "K. Ramanathan" },
    { id: "FIL-02", period: "Feb 2026", type: "GSTR-1 Outward Supplies", date: "11-Mar-2026", ackNo: "AA270326077312Z", status: "Filed On-Time", owner: "K. Ramanathan" },
    { id: "FIL-03", period: "Jan 2026", type: "GSTR-3B Monthly Return", date: "20-Feb-2026", ackNo: "AA270226084120Y", status: "Filed On-Time", owner: "K. Ramanathan" },
    { id: "FIL-04", period: "Q3 2025-26", type: "Advance Tax Q3 Payment", date: "15-Dec-2025", ackNo: "IT-CHALLAN-99210", status: "Paid", owner: "S. Priya" },
  ]);

  const [attachmentsList, setAttachmentsList] = useState([
    { id: "ATT-01", name: "GST_Registration_Certificate_REG06.pdf", type: "Certificate", size: "2.4 MB", uploadDate: "2026-01-10", uploadedBy: "K. Ramanathan", status: "Verified" },
    { id: "ATT-02", name: "GSTR3B_Acknowledged_Challan_Feb2026.pdf", type: "Challan / Filing Ack", size: "1.1 MB", uploadDate: "2026-03-20", uploadedBy: "K. Ramanathan", status: "Verified" },
    { id: "ATT-03", name: "Tax_Audit_Report_Form_3CA_3CD.pdf", type: "Audit Report", size: "5.8 MB", uploadDate: "2025-09-28", uploadedBy: "Statutory Auditor", status: "Signed" },
  ]);

  const [newActionForm, setNewActionForm] = useState({
    description: "",
    owner: activeRecord.complianceOwner,
    dueDate: "2026-04-30",
    priority: "High",
  });

  const [newInspectionForm, setNewInspectionForm] = useState({
    agency: "State Pollution Control Board",
    date: "2026-04-15",
    auditor: "Regional Inspector",
    scope: "Environmental & Consent to Operate Verification",
  });

  const [newAttachmentForm, setNewAttachmentForm] = useState({
    name: "",
    type: "Certificate",
  });

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionForm.description) return;
    const newAct = {
      id: `CAPA-2026-0${actionsList.length + 1}`,
      description: newActionForm.description,
      owner: newActionForm.owner,
      dueDate: newActionForm.dueDate,
      status: "Open",
      priority: newActionForm.priority,
    };
    setActionsList([newAct, ...actionsList]);
    setIsCreateActionOpen(false);
    setNewActionForm({ description: "", owner: activeRecord.complianceOwner, dueDate: "2026-04-30", priority: "High" });
    toast({
      title: "Action Item Created",
      description: `${newAct.id} assigned to ${newAct.owner}.`,
    });
  };

  const handleScheduleInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInspectionForm.agency) return;
    const newInsp = {
      id: `INS-2026-0${inspectionsList.length + 1}`,
      agency: newInspectionForm.agency,
      date: newInspectionForm.date,
      auditor: newInspectionForm.auditor,
      scope: newInspectionForm.scope,
      result: "Scheduled",
      findings: 0,
    };
    setInspectionsList([newInsp, ...inspectionsList]);
    setIsScheduleInspectionOpen(false);
    toast({
      title: "Inspection Scheduled",
      description: `${newInsp.agency} visit recorded for ${newInsp.date}.`,
    });
  };

  const handleRecordFilingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFiling.type) return;
    const autoAck = `ARN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newF = {
      id: `FIL-0${filingsList.length + 1}`,
      period: newFiling.period,
      type: newFiling.type,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      ackNo: autoAck,
      status: "Filed On-Time",
      owner: activeRecord.complianceOwner,
    };
    setFilingsList([newF, ...filingsList]);
    setIsRecordFilingOpen(false);
    toast({
      title: "Statutory Filing Recorded",
      description: `${newF.type} acknowledged with ARN: ${autoAck}.`,
    });
  };

  const handleUploadAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttachmentForm.name) return;
    const newAtt = {
      id: `ATT-0${attachmentsList.length + 1}`,
      name: newAttachmentForm.name,
      type: newAttachmentForm.type,
      size: "1.8 MB",
      uploadDate: new Date().toISOString().split("T")[0],
      uploadedBy: activeRecord.complianceOwner,
      status: "Verified",
    };
    setAttachmentsList([newAtt, ...attachmentsList]);
    setIsUploadAttachmentOpen(false);
    setNewAttachmentForm({ name: "", type: "Certificate" });
    toast({
      title: "Document Uploaded",
      description: `${newAtt.name} stored in Document Vault.`,
    });
  };

  // Selected report object
  const currentReport = useMemo(() => {
    return (
      REGULATORY_REPORT_DEFINITIONS.find((r) => r.id === selectedReportId) ||
      REGULATORY_REPORT_DEFINITIONS[0]
    );
  }, [selectedReportId]);

  // Filtered reports
  const filteredReportsList = useMemo(() => {
    return REGULATORY_REPORT_DEFINITIONS.filter((r) => {
      const matchesCat =
        reportCategoryFilter === "All" || r.category === reportCategoryFilter;
      const matchesSearch =
        r.title.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
        r.purpose.toLowerCase().includes(reportSearchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [reportCategoryFilter, reportSearchQuery]);

  // Save handler
  const handleSave = () => {
    regulatoryComplianceService.saveRecord(activeRecord);
    toast({
      title: "Regulatory Compliance Saved",
      description: `Record ${activeRecord.id} (${activeRecord.complianceName}) updated successfully.`,
    });
  };

  // Submit workflow handler
  const handleSubmit = () => {
    toast({
      title: "Compliance Submission Dispatched",
      description: `Dispatched ${activeRecord.id} to Regulatory Review Board & Compliance Officer.`,
    });
  };

  // Add Control Handler
  const handleAddControl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newControl.name) return;

    const updatedControls = [...activeRecord.controls, { ...newControl }];
    const updated = { ...activeRecord, controls: updatedControls };
    setActiveRecord(updated);
    regulatoryComplianceService.saveRecord(updated);
    setIsAddControlOpen(false);
    setNewControl({
      id: `C-00${updatedControls.length + 1}`,
      name: "",
      type: "Preventive",
      frequency: "Monthly",
      owner: activeRecord.complianceOwner,
      status: "Effective",
    });

    toast({
      title: "Compliance Control Added",
      description: `Control ${newControl.id} successfully attached to ${activeRecord.id}.`,
    });
  };

  // Add Evidence Handler
  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidence.name) return;

    const updatedEvidence: ComplianceEvidenceItem = {
      id: newEvidence.name,
      name: newEvidence.name,
      type: newEvidence.type,
      date: newEvidence.date,
      expiryDate: newEvidence.expiryDate || "-",
      issuer: newEvidence.issuer,
      version: "v1.0",
      status: newEvidence.status,
      storageLocation: newEvidence.storageLocation,
    };

    const updated = {
      ...activeRecord,
      evidence: [updatedEvidence, ...activeRecord.evidence],
    };
    setActiveRecord(updated);
    regulatoryComplianceService.saveRecord(updated);
    setIsUploadEvidenceOpen(false);

    toast({
      title: "Compliance Evidence Stored",
      description: `Document '${newEvidence.name}' verified and cataloged with audit checksum.`,
    });
  };

  // Export CSV Handler for current report
  const handleExportCSV = (report: ReportDefinition) => {
    const headers = report.columns.join(",");
    const rows = report.sampleData.map((row) =>
      report.columns
        .map((col) => {
          const val = row[col] ?? "";
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Magnertia_${report.code}_${report.title.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report Exported",
      description: `Downloaded ${report.sampleData.length} records as CSV.`,
    });
  };

  // 5x5 Heatmap data generator
  const heatmapData = [
    { likelihood: 5, scores: [5, 10, 15, 20, 25], counts: [1, 2, 4, 1, 0] },
    { likelihood: 4, scores: [4, 8, 12, 16, 20], counts: [2, 5, 6, 2, 1] },
    { likelihood: 3, scores: [3, 6, 9, 12, 15], counts: [4, 7, 3, 1, 0] },
    { likelihood: 2, scores: [2, 4, 6, 8, 10], counts: [6, 4, 2, 0, 0] },
    { likelihood: 1, scores: [1, 2, 3, 4, 5], counts: [8, 3, 1, 0, 0] },
  ];

  // Domain Distribution for Report Analytics
  const domainChartData = [
    { name: "Taxation", count: 8, fill: "#0A3C75" },
    { name: "Labour", count: 6, fill: "#336B9F" },
    { name: "Product Safety", count: 7, fill: "#729FC9" },
    { name: "Environment", count: 5, fill: "#10B981" },
    { name: "Data Privacy", count: 4, fill: "#8B5CF6" },
    { name: "Cybersecurity", count: 3, fill: "#F59E0B" },
  ];

  return (
    <AppShell
      title="Regulatory Compliance"
      breadcrumb="Management > Compliance > Regulatory Compliance"
      description="Statutory returns, central and state regulatory mandates, authority inspections, and audit filings."
      tabs={<ComplianceTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* =========================================================================
            1. TOP HEADER BANNER (EXACT 1:1 TO USER SCREENSHOT)
            ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-card p-4 sm:p-5 rounded-2xl border border-border/80 shadow-xs">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground whitespace-nowrap">
                  Regulatory Compliance
                </h1>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-300 font-bold px-2.5 py-0.5 text-xs flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </Badge>
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                  {activeRecord.id}
                </span>
                <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                  v{activeRecord.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Comply Today. Build a Safer Tomorrow.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
            {/* Search Input matching screenshot top right */}
            <div className="relative w-48 sm:w-64 hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search regulations, filings, licenses..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="h-8 pl-8 text-xs bg-background/80 border-border/80"
              />
            </div>

            {/* Save Button */}
            <Button
              size="sm"
              className="h-8 text-xs font-bold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-2xs shrink-0"
              onClick={handleSave}
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </Button>

            {/* Submit Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold gap-1.5 border-border shrink-0"
              onClick={handleSubmit}
            >
              <Send className="h-3.5 w-3.5 text-muted-foreground" />
              Submit
            </Button>

            {/* Generate Report Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold gap-1.5 bg-primary/5 text-primary border-primary/25 hover:bg-primary/15 shrink-0"
              onClick={() => {
                setActiveSubmodule("reports");
                setIsGenerateReportModalOpen(true);
              }}
            >
              <FileText className="h-3.5 w-3.5" />
              Generate Report
            </Button>

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-medium border-border gap-1 shrink-0"
                >
                  More Actions
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs w-56">
                <DropdownMenuItem onClick={() => setActiveSubmodule("reports")}>
                  <FileSpreadsheet className="h-3.5 w-3.5 mr-2 text-primary" /> View 24 Audit Reports
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsQuickCheckModalOpen(true)}>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-600" /> Run Quick Compliance Check
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportCSV(currentReport)}>
                  <Download className="h-3.5 w-3.5 mr-2 text-muted-foreground" /> Export Regulatory CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="h-3.5 w-3.5 mr-2 text-muted-foreground" /> Print Compliance Dossier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    toast({
                      title: "CBIC / MCA Statutory Sync",
                      description: "Real-time sync completed. No new statutory notices found.",
                    });
                  }}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-2 text-blue-600" /> Sync Statutory Portals
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const escalated: RegulatoryComplianceRecord = {
                      ...activeRecord,
                      priority: "Critical",
                      status: "Under Review",
                    };
                    setActiveRecord(escalated);
                    toast({
                      title: "Compliance Escalated",
                      description: `Record ${escalated.id} flagged for Board Compliance Committee attention.`,
                    });
                  }}
                >
                  <AlertTriangle className="h-3.5 w-3.5 mr-2 text-red-600" /> Escalate to Risk Committee
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* =========================================================================
            EXECUTIVE 6 KPI METRIC WIDGETS (EXACT SCREENSHOT LAYOUT)
            ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Widget 1: Compliance Obligations */}
          <Card className="p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> 20%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-extrabold text-foreground tabular">24</div>
              <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                Compliance Obligations
              </div>
            </div>
          </Card>

          {/* Widget 2: Overdue Items */}
          <Card className="p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between hover:border-red-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-red-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> 200%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-extrabold text-foreground tabular">3</div>
              <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                Overdue Items
              </div>
            </div>
          </Card>

          {/* Widget 3: Due in 30 Days */}
          <Card className="p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between hover:border-amber-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> 67%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-extrabold text-foreground tabular">5</div>
              <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                Due in 30 Days
              </div>
            </div>
          </Card>

          {/* Widget 4: Compliant */}
          <Card className="p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> 12%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-extrabold text-foreground tabular">18</div>
              <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                Compliant
              </div>
            </div>
          </Card>

          {/* Widget 5: Open Actions */}
          <Card className="p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <FileCheck className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingDown className="h-3 w-3" /> 33%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-extrabold text-foreground tabular">4</div>
              <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                Open Actions
              </div>
            </div>
          </Card>

          {/* Widget 6: Compliance Readiness */}
          <Card className="p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> 8%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-extrabold text-foreground tabular">92%</div>
              <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                Compliance Readiness
              </div>
            </div>
          </Card>
        </div>

        {/* =========================================================================
            TOP ENTERPRISE CONTEXT (DEDUPLICATED SCOPE - NO REPETITIVE INPUT CLUTTER)
            ========================================================================= */}
        <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-card border border-border/80 shadow-2xs text-xs flex-wrap">
          <div className="flex items-center gap-2 text-foreground font-semibold flex-wrap">
            <Building className="h-4 w-4 text-blue-600 shrink-0" />
            <span>Magnertia Enterprise</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground font-normal">Plant: <strong className="text-foreground">Sanand Mega-Plant 01</strong></span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground font-normal">Dept: <strong className="text-foreground">Risk & Statutory Affairs</strong></span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground font-normal">Cost Center: <strong className="font-mono text-primary">CC-REG-901</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300 font-bold bg-emerald-50/50">
              Deduplicated Scope
            </Badge>
            <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-300 font-bold bg-blue-50/50">
              Active Form: {SUBMODULE_TABS.find(t => t.id === activeSubmodule)?.label || "General"}
            </Badge>
            {activeSubmodule !== "overview" && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[11px] px-2 font-semibold text-primary hover:bg-primary/10 gap-1 cursor-pointer"
                onClick={() => setActiveSubmodule("overview")}
              >
                ← Back to General
              </Button>
            )}
          </div>
        </div>

        {/* =========================================================================
            SUBMODULE: OVERVIEW (EXECUTIVE DASHBOARD + LAUNCHER HUB)
            ========================================================================= */}
        {activeSubmodule === "overview" && (
          <div className="space-y-4">
            {/* ROW 1: 1. COMPLIANCE INFORMATION & TIMELINE SUMMARY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7">
                <Card className="border-border/80 shadow-2xs bg-card h-full">
                  <CardHeader className="py-3 px-4 border-b border-border/60">
                    <CardTitle className="text-sm font-bold flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>1. Compliance Information Summary</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                          MAICW Classification
                        </span>
                      </span>
                      <span className="text-xs font-normal text-muted-foreground">
                        Record ID: <strong className="text-foreground">{activeRecord.id}</strong>
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground">Compliance Code</Label>
                        <div className="text-xs font-mono font-bold text-foreground mt-1 bg-muted/30 px-2.5 py-1.5 rounded border border-border/60">
                          {activeRecord.complianceCode}
                        </div>
                      </div>
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground">Compliance Name</Label>
                        <div className="text-xs font-bold text-foreground mt-1 truncate bg-muted/30 px-2.5 py-1.5 rounded border border-border/60">
                          {activeRecord.complianceName}
                        </div>
                      </div>
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground">Domain</Label>
                        <div className="text-xs font-medium text-foreground mt-1 bg-muted/30 px-2.5 py-1.5 rounded border border-border/60">
                          {activeRecord.regulatoryDomain}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground">Governing Authority</Label>
                        <div className="text-xs font-medium text-foreground mt-1 truncate bg-muted/30 px-2.5 py-1.5 rounded border border-border/60">
                          {activeRecord.regulatoryAuthority}
                        </div>
                      </div>
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground">Lead Owner</Label>
                        <div className="text-xs font-semibold text-foreground mt-1 bg-muted/30 px-2.5 py-1.5 rounded border border-border/60 flex items-center gap-1.5">
                          <span className="h-4 w-4 rounded-full bg-blue-600 text-[9px] font-bold text-white flex items-center justify-center">
                            {activeRecord.complianceOwnerAvatar}
                          </span>
                          <span>{activeRecord.complianceOwner}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground">Status & Priority</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-xs font-bold">
                            {activeRecord.status}
                          </Badge>
                          <Badge className="bg-red-500/10 text-red-600 border-red-300 text-xs font-bold">
                            {activeRecord.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10 gap-1.5"
                        onClick={() => setActiveSubmodule("regulatory-details")}
                      >
                        Edit Regulatory Details <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT COLUMN: 2. Timeline + Stepper + Key Dates */}
              <div className="lg:col-span-5 space-y-3">
                <Card className="border-border/80 shadow-2xs bg-card p-3.5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-foreground">Compliance Timeline Stepper</span>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300 font-semibold bg-emerald-50/5">
                      Stage: Monitor
                    </Badge>
                  </div>
                  <div className="relative flex items-center justify-between px-2 pt-2 pb-4">
                    <div className="absolute left-6 right-6 top-4.5 h-0.5 bg-muted -translate-y-1/2 z-0" />
                    <div className="absolute left-6 top-4.5 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all" style={{ width: "60%" }} />
                    {["Identify", "Assess", "Implement", "Monitor", "File", "Close"].map((step, idx) => {
                      const isDone = idx < 3;
                      const isCurrent = idx === 3;
                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                          <div className={cn(
                            "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                            isDone ? "bg-emerald-500 text-white" : isCurrent ? "bg-emerald-600 text-white ring-4 ring-emerald-500/20" : "bg-muted text-muted-foreground"
                          )}>
                            {isDone ? <Check className="h-3 w-3" /> : idx + 1}
                          </div>
                          <span className={cn("text-[10px] font-semibold mt-1", isCurrent ? "text-emerald-600 font-bold" : "text-muted-foreground")}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-300/40 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <strong className="font-bold mr-1">On Track</strong>
                      <span>Next filing due in {activeRecord.nextFilingCountdownDays} days ({activeRecord.nextFilingDate})</span>
                    </div>
                  </div>
                </Card>

                {/* Key Dates & Quick Actions side-by-side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Card className="border-border/80 shadow-2xs bg-card p-3 space-y-1.5">
                    <div className="text-xs font-bold text-foreground flex items-center gap-1.5 pb-1 border-b border-border/60">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> Key Dates
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Effective</span>
                        <span className="font-medium text-foreground">{activeRecord.effectiveDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date</span>
                        <span className="font-semibold text-red-600">{activeRecord.dueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next Filing</span>
                        <span className="font-semibold text-primary">{activeRecord.nextFilingDate}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-border/80 shadow-2xs bg-card p-3 space-y-1">
                    <div className="text-xs font-bold text-foreground flex items-center gap-1.5 pb-1 border-b border-border/60">
                      <Sparkles className="h-3.5 w-3.5 text-primary" /> Actions
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="sm" className="h-6.5 justify-start text-[11px] font-medium px-1.5 hover:bg-primary/10 gap-1.5" onClick={() => setIsRecordFilingOpen(true)}>
                        <Send className="h-3 w-3 text-blue-600" /> Record Filing
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6.5 justify-start text-[11px] font-medium px-1.5 hover:bg-primary/10 gap-1.5" onClick={() => setIsUploadEvidenceOpen(true)}>
                        <Upload className="h-3 w-3 text-emerald-600" /> Upload Evidence
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6.5 justify-start text-[11px] font-medium px-1.5 hover:bg-primary/10 gap-1.5" onClick={() => setIsCreateActionOpen(true)}>
                        <Plus className="h-3 w-3 text-purple-600" /> Create CAPA
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* SUBMODULE LAUNCHER HUB: Direct Access to All 10 Specialised Workspaces */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  Regulatory Management Submodules & Functional Workspaces
                </span>
                <span className="text-[11px] text-muted-foreground">Click any card to open dedicated workspace</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { id: "regulatory-details", title: "Regulatory Details", count: "19 Fields", icon: FileText, color: "text-blue-600 bg-blue-500/10", desc: "MAICW classified legal attributes" },
                  { id: "obligations", title: "Obligations", count: "Monthly Due", icon: Clock, color: "text-amber-600 bg-amber-500/10", desc: "Statutory deadlines & frequencies" },
                  { id: "controls-evidence", title: "Controls & Evidence", count: `${activeRecord.controls.length} Ctl / ${activeRecord.evidence.length} Evd`, icon: ShieldCheck, color: "text-emerald-600 bg-emerald-500/10", desc: "Internal controls & hashed proofs" },
                  { id: "filings", title: "Filings & Submissions", count: `${filingsList.length} Filings`, icon: Send, color: "text-purple-600 bg-purple-500/10", desc: "Statutory returns & ARN tracker" },
                  { id: "inspections-audits", title: "Inspections & Audits", count: `${inspectionsList.length} Visits`, icon: Shield, color: "text-teal-600 bg-teal-500/10", desc: "Agency audits & findings log" },
                  { id: "risk-gaps", title: "Risk & Gaps", count: `Score: ${activeRecord.riskScore}/25`, icon: AlertTriangle, color: "text-red-600 bg-red-500/10", desc: "Likelihood x Impact assessment" },
                  { id: "actions", title: "Corrective Actions", count: `${actionsList.length} CAPAs`, icon: FileCheck, color: "text-indigo-600 bg-indigo-500/10", desc: "Remediation & verification tasks" },
                  { id: "related-records", title: "Related Records", count: "6 Linked Sets", icon: Building, color: "text-cyan-600 bg-cyan-500/10", desc: "Enterprise ERP cross-references" },
                  { id: "attachments", title: "Attachments Vault", count: `${attachmentsList.length} Files`, icon: Paperclip, color: "text-slate-600 bg-slate-500/10", desc: "Controlled certificates & licenses" },
                  { id: "reports", title: "Audit Reports", count: "24 Registers", icon: BarChart3, color: "text-blue-600 bg-blue-500/10", desc: "Executive heatmaps & CSV exports" },
                ].map((hub) => {
                  const Icon = hub.icon;
                  return (
                    <Card
                      key={hub.id}
                      onClick={() => setActiveSubmodule(hub.id)}
                      className="p-3 border-border/80 shadow-2xs bg-card hover:border-primary/50 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between">
                        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", hub.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <Badge variant="outline" className="text-[9px] font-semibold">
                          {hub.count}
                        </Badge>
                      </div>
                      <div className="mt-2.5">
                        <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                          <span>{hub.title}</span>
                          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                          {hub.desc}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* ROW 4: RECENT REGULATORY CHANGES & UPCOMING CALENDAR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7">
                <Card className="border-border/80 shadow-2xs bg-card h-full">
                  <CardHeader className="py-2.5 px-3.5 border-b border-border/60 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold">Recent Statutory & Regulatory Changes</CardTitle>
                    <Badge variant="outline" className="text-[10px]">Real-time Feed</Badge>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase font-semibold">
                        <tr>
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-2">Regulation</th>
                          <th className="py-2 px-2">Change Scope</th>
                          <th className="py-2 px-2">Impact</th>
                          <th className="py-2 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {activeRecord.recentChanges.map((chg) => (
                          <tr key={chg.id} className="hover:bg-muted/30">
                            <td className="py-2.5 px-3 text-muted-foreground font-mono text-[10px]">{chg.date}</td>
                            <td className="py-2.5 px-2 font-semibold text-foreground">{chg.regulation}</td>
                            <td className="py-2.5 px-2 text-muted-foreground truncate max-w-[130px]">{chg.change}</td>
                            <td className="py-2.5 px-2">
                              <Badge className={cn("text-[9px] px-1.5 py-0 font-bold", chg.impact === "High" ? "bg-red-500/10 text-red-600 border-red-200" : "bg-amber-500/10 text-amber-600 border-amber-200")}>
                                {chg.impact}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0">{chg.status}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-5">
                <Card className="border-border/80 shadow-2xs bg-card h-full">
                  <CardHeader className="py-2.5 px-3.5 border-b border-border/60 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold">Upcoming Compliance Deadlines</CardTitle>
                    <Badge variant="outline" className="text-[10px]">Next 30 Days</Badge>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    {activeRecord.calendarItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <div>
                            <div className="text-[11px] font-semibold text-foreground">{item.title}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">{item.date} • {item.category}</div>
                          </div>
                        </div>
                        <Badge className={cn("text-[10px] font-bold px-2 py-0.5", item.dueDays <= 15 ? "bg-red-500/10 text-red-600 border-red-300" : "bg-amber-500/10 text-amber-600 border-amber-300")}>
                          {item.dueBadge}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE: REGULATORY DETAILS (FULL MAICW FORM)
            ========================================================================= */}
        {activeSubmodule === "regulatory-details" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs bg-card">
              <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Regulatory Details & Statutory Master
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Comprehensive legal and regulatory parameters classified under MAICW enterprise rules.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setActiveSubmodule("overview")}>
                    ← Back to Overview
                  </Button>
                  <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1" onClick={handleSave}>
                    <Save className="h-3.5 w-3.5" /> Save Changes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-[11px] font-semibold text-muted-foreground">Compliance ID (A)</Label>
                    <Input readOnly value={activeRecord.id} className="h-8 text-xs font-mono font-bold bg-muted/40 mt-1" />
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold text-muted-foreground">Compliance Code * (A)</Label>
                    <Input value={activeRecord.complianceCode} onChange={(e) => setActiveRecord({ ...activeRecord, complianceCode: e.target.value })} className="h-8 text-xs font-medium mt-1" />
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold text-muted-foreground">Compliance Name * (M)</Label>
                    <Input value={activeRecord.complianceName} onChange={(e) => setActiveRecord({ ...activeRecord, complianceName: e.target.value })} className="h-8 text-xs font-medium mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-[11px] font-semibold text-muted-foreground">Compliance Type (M)</Label>
                    <Select value={activeRecord.complianceType} onValueChange={(val: any) => setActiveRecord({ ...activeRecord, complianceType: val })}>
                      <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regulatory">Regulatory</SelectItem>
                        <SelectItem value="Statutory">Statutory</SelectItem>
                        <SelectItem value="License">License</SelectItem>
                        <SelectItem value="Permit">Permit</SelectItem>
                        <SelectItem value="Certification">Certification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold text-muted-foreground">Regulatory Domain (M)</Label>
                    <Input value={activeRecord.regulatoryDomain} onChange={(e) => setActiveRecord({ ...activeRecord, regulatoryDomain: e.target.value })} className="h-8 text-xs mt-1" />
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold text-muted-foreground">Governing Authority (M)</Label>
                    <Input value={activeRecord.regulatoryAuthority} onChange={(e) => setActiveRecord({ ...activeRecord, regulatoryAuthority: e.target.value })} className="h-8 text-xs mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-[11px] font-semibold text-muted-foreground">Lead Owner (M)</Label>
                    <Input value={activeRecord.complianceOwner} onChange={(e) => setActiveRecord({ ...activeRecord, complianceOwner: e.target.value })} className="h-8 text-xs mt-1" />
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold text-muted-foreground">Compliance Coordinator (M)</Label>
                    <Input value={activeRecord.complianceCoordinator} onChange={(e) => setActiveRecord({ ...activeRecord, complianceCoordinator: e.target.value })} className="h-8 text-xs mt-1" />
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold text-muted-foreground">Regulation Reference (M)</Label>
                    <Input value={activeRecord.regulation} onChange={(e) => setActiveRecord({ ...activeRecord, regulation: e.target.value })} className="h-8 text-xs mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-[11px] font-semibold text-muted-foreground">Status (W)</Label>
                    <Select value={activeRecord.status} onValueChange={(val: any) => setActiveRecord({ ...activeRecord, status: val })}>
                      <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Due">Due</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold text-muted-foreground">Priority (M)</Label>
                    <Select value={activeRecord.priority} onValueChange={(val: any) => setActiveRecord({ ...activeRecord, priority: val })}>
                      <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold text-muted-foreground">Effective Date (M)</Label>
                    <Input value={activeRecord.effectiveDate} onChange={(e) => setActiveRecord({ ...activeRecord, effectiveDate: e.target.value })} className="h-8 text-xs mt-1" />
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold text-muted-foreground">Due Date (M)</Label>
                    <Input value={activeRecord.dueDate} onChange={(e) => setActiveRecord({ ...activeRecord, dueDate: e.target.value })} className="h-8 text-xs mt-1 font-semibold text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE: OBLIGATIONS (STATUTORY DEADLINES & RENEWALS)
            ========================================================================= */}
        {activeSubmodule === "obligations" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs bg-card p-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    3. Compliance Obligation & Frequency Control
                  </h3>
                  <p className="text-xs text-muted-foreground">Controlled obligation parameters, recurrence schedule, and renewal tracker.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setActiveSubmodule("overview")}>
                    ← Back to Overview
                  </Button>
                  <Button size="sm" className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold" onClick={handleSave}>
                    <Save className="h-3.5 w-3.5" /> Save Obligation
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                <div>
                  <Label className="text-[11px] font-semibold text-muted-foreground">Obligation Type</Label>
                  <Select value={activeRecord.obligationType} onValueChange={(val) => setActiveRecord({ ...activeRecord, obligationType: val })}>
                    <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Filing">Filing</SelectItem>
                      <SelectItem value="License">License</SelectItem>
                      <SelectItem value="Permit">Permit</SelectItem>
                      <SelectItem value="Certification">Certification</SelectItem>
                      <SelectItem value="Return">Return</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-muted-foreground">Frequency</Label>
                  <Select value={activeRecord.obligationFrequency} onValueChange={(val: any) => setActiveRecord({ ...activeRecord, obligationFrequency: val })}>
                    <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Annual">Annual</SelectItem>
                      <SelectItem value="One-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-muted-foreground">Next Due Date</Label>
                  <Input value={activeRecord.nextDueDate} onChange={(e) => setActiveRecord({ ...activeRecord, nextDueDate: e.target.value })} className="h-8 text-xs mt-1 font-semibold text-primary" />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-muted-foreground">Last Completed</Label>
                  <Input value={activeRecord.lastCompletedDate} onChange={(e) => setActiveRecord({ ...activeRecord, lastCompletedDate: e.target.value })} className="h-8 text-xs mt-1" />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-muted-foreground">Renewal Date</Label>
                  <Input value={activeRecord.renewalDate} onChange={(e) => setActiveRecord({ ...activeRecord, renewalDate: e.target.value })} className="h-8 text-xs mt-1" />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-muted-foreground">Obligation Status</Label>
                  <div className="h-8 mt-1 px-3 rounded-md border border-border bg-card flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {activeRecord.obligationStatus}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-lg bg-amber-500/10 border border-amber-300/40 text-xs space-y-1">
                <div className="font-bold text-amber-800 dark:text-amber-400">Statutory Penalties & Sanction Risk</div>
                <div className="text-muted-foreground text-[11px]">
                  Late filing incurs interest under Section 50 of CGST Act @ 18% p.a. + Rs. 50/day late fee capped at Rs. 10,000 per return.
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE: CONTROLS & EVIDENCE
            ========================================================================= */}
        {activeSubmodule === "controls-evidence" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  4. Controls & Evidence Management
                </h3>
                <p className="text-xs text-muted-foreground">Internal verification controls linked with cryptographic audit checksum evidence.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setActiveSubmodule("overview")}>
                  ← Back to Overview
                </Button>
                <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1" onClick={() => setIsAddControlOpen(true)}>
                  <Plus className="h-3.5 w-3.5" /> Add Control
                </Button>
                <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1" onClick={() => setIsUploadEvidenceOpen(true)}>
                  <Upload className="h-3.5 w-3.5" /> Upload Evidence
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-border/80 shadow-2xs bg-card">
                <CardHeader className="py-2.5 px-3.5 border-b border-border/60">
                  <CardTitle className="text-xs font-bold">Active Internal Controls ({activeRecord.controls.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase font-semibold">
                      <tr>
                        <th className="py-2 px-3">ID / Name</th>
                        <th className="py-2 px-2">Type</th>
                        <th className="py-2 px-2">Frequency</th>
                        <th className="py-2 px-2">Owner</th>
                        <th className="py-2 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {activeRecord.controls.map((c) => (
                        <tr key={c.id} className="hover:bg-muted/30">
                          <td className="py-2.5 px-3 font-semibold">
                            <span className="font-mono text-primary mr-1.5">{c.id}</span>
                            <span>{c.name}</span>
                          </td>
                          <td className="py-2.5 px-2 text-muted-foreground">{c.type}</td>
                          <td className="py-2.5 px-2 text-muted-foreground">{c.frequency}</td>
                          <td className="py-2.5 px-2 font-medium">{c.owner}</td>
                          <td className="py-2.5 px-3 text-right">
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-[10px]">{c.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-2xs bg-card">
                <CardHeader className="py-2.5 px-3.5 border-b border-border/60">
                  <CardTitle className="text-xs font-bold">Evidence Vault ({activeRecord.evidence.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase font-semibold">
                      <tr>
                        <th className="py-2 px-3">Evidence Item</th>
                        <th className="py-2 px-2">Type</th>
                        <th className="py-2 px-2">Date</th>
                        <th className="py-2 px-2">Issuer</th>
                        <th className="py-2 px-3 text-right">Checksum Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {activeRecord.evidence.map((e) => (
                        <tr key={e.id} className="hover:bg-muted/30">
                          <td className="py-2.5 px-3 font-medium text-foreground">{e.name}</td>
                          <td className="py-2.5 px-2 text-muted-foreground">{e.type}</td>
                          <td className="py-2.5 px-2 text-muted-foreground">{e.date}</td>
                          <td className="py-2.5 px-2 text-muted-foreground">{e.issuer || "Statutory"}</td>
                          <td className="py-2.5 px-3 text-right">
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-[10px]">{e.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE: FILINGS & SUBMISSIONS
            ========================================================================= */}
        {activeSubmodule === "filings" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Send className="h-4 w-4 text-purple-600" />
                  Statutory Filings & Authority Submissions
                </h3>
                <p className="text-xs text-muted-foreground">Historical and upcoming filing returns with government acknowledgment numbers (ARN).</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setActiveSubmodule("overview")}>
                  ← Back to Overview
                </Button>
                <Button size="sm" className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold gap-1" onClick={() => setIsRecordFilingOpen(true)}>
                  <Plus className="h-3.5 w-3.5" /> Record New Filing
                </Button>
              </div>
            </div>

            <Card className="border-border/80 shadow-2xs bg-card">
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Return Period</th>
                      <th className="py-2.5 px-3">Filing Form / Type</th>
                      <th className="py-2.5 px-3">Filing Date</th>
                      <th className="py-2.5 px-3">Acknowledgment (ARN)</th>
                      <th className="py-2.5 px-3">Signatory Owner</th>
                      <th className="py-2.5 px-3 text-right">Filing Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filingsList.map((f) => (
                      <tr key={f.id} className="hover:bg-muted/30">
                        <td className="py-2.5 px-3 font-mono font-semibold text-primary">{f.id}</td>
                        <td className="py-2.5 px-3 font-medium text-foreground">{f.period}</td>
                        <td className="py-2.5 px-3 text-foreground font-semibold">{f.type}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{f.date}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-foreground">{f.ackNo}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{f.owner}</td>
                        <td className="py-2.5 px-3 text-right">
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-xs font-semibold">{f.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE: INSPECTIONS & AUDITS
            ========================================================================= */}
        {activeSubmodule === "inspections-audits" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-teal-600" />
                  Inspections & Statutory Audits
                </h3>
                <p className="text-xs text-muted-foreground">Official government regulator visits, factory inspections, and third-party audit findings.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setActiveSubmodule("overview")}>
                  ← Back to Overview
                </Button>
                <Button size="sm" className="h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold gap-1" onClick={() => setIsScheduleInspectionOpen(true)}>
                  <Plus className="h-3.5 w-3.5" /> Schedule Inspection
                </Button>
              </div>
            </div>

            <Card className="border-border/80 shadow-2xs bg-card">
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Inspection ID</th>
                      <th className="py-2.5 px-3">Agency / Authority</th>
                      <th className="py-2.5 px-3">Visit Date</th>
                      <th className="py-2.5 px-3">Lead Inspector</th>
                      <th className="py-2.5 px-3">Scope of Inspection</th>
                      <th className="py-2.5 px-3">Findings</th>
                      <th className="py-2.5 px-3 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {inspectionsList.map((ins) => (
                      <tr key={ins.id} className="hover:bg-muted/30">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">{ins.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">{ins.agency}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{ins.date}</td>
                        <td className="py-2.5 px-3 text-foreground">{ins.auditor}</td>
                        <td className="py-2.5 px-3 text-muted-foreground truncate max-w-[200px]">{ins.scope}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-foreground">{ins.findings}</span> NCs
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Badge className={cn("text-xs font-semibold", ins.result === "Conform" ? "bg-emerald-500/10 text-emerald-600 border-emerald-300" : "bg-amber-500/10 text-amber-600 border-amber-300")}>
                            {ins.result}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE: RISK & GAPS
            ========================================================================= */}
        {activeSubmodule === "risk-gaps" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  6. Compliance Risk & Gap Matrix
                </h3>
                <p className="text-xs text-muted-foreground">Likelihood x Impact dynamic scoring matrix with mitigation controls.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setActiveSubmodule("overview")}>
                  ← Back to Overview
                </Button>
                <Button size="sm" className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white font-bold" onClick={handleSave}>
                  <Save className="h-3.5 w-3.5" /> Save Risk Assessment
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4">
                <Card className="border-border/80 shadow-2xs bg-card p-4 space-y-4">
                  <div className="text-xs font-bold text-foreground border-b border-border/60 pb-2">Dynamic Risk Calculation</div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-200">
                      <div className="text-[11px] font-semibold text-muted-foreground">Score (L x I)</div>
                      <div className="text-2xl font-black text-red-600 mt-1">{activeRecord.riskScore}/25</div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-200">
                      <div className="text-[11px] font-semibold text-muted-foreground">Rating</div>
                      <div className="text-lg font-black text-amber-600 mt-1.5">{activeRecord.riskRating}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-[11px] font-semibold">Likelihood (1–5): {activeRecord.likelihood}</Label>
                      <div className="flex gap-1.5 mt-1.5">
                        {[1, 2, 3, 4, 5].map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => {
                              const newScore = l * activeRecord.impact;
                              setActiveRecord({
                                ...activeRecord,
                                likelihood: l,
                                riskScore: newScore,
                                riskRating: newScore >= 16 ? "Critical" : newScore >= 10 ? "High" : newScore >= 5 ? "Medium" : "Low",
                              });
                            }}
                            className={cn(
                              "flex-1 h-8 rounded-md font-bold text-xs transition-all cursor-pointer",
                              activeRecord.likelihood === l ? "bg-red-600 text-white shadow-xs" : "bg-muted hover:bg-muted/70 text-foreground"
                            )}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-[11px] font-semibold">Impact (1–5): {activeRecord.impact}</Label>
                      <div className="flex gap-1.5 mt-1.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              const newScore = activeRecord.likelihood * i;
                              setActiveRecord({
                                ...activeRecord,
                                impact: i,
                                riskScore: newScore,
                                riskRating: newScore >= 16 ? "Critical" : newScore >= 10 ? "High" : newScore >= 5 ? "Medium" : "Low",
                              });
                            }}
                            className={cn(
                              "flex-1 h-8 rounded-md font-bold text-xs transition-all cursor-pointer",
                              activeRecord.impact === i ? "bg-red-600 text-white shadow-xs" : "bg-muted hover:bg-muted/70 text-foreground"
                            )}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-8">
                <Card className="border-border/80 shadow-2xs bg-card p-4 space-y-3">
                  <div className="text-xs font-bold text-foreground border-b border-border/60 pb-2">Identified Statutory Gap & Mitigation Strategy</div>
                  <div>
                    <Label className="text-[11px] font-semibold">Key Regulatory Risk</Label>
                    <Textarea
                      rows={2}
                      value={activeRecord.keyRisk}
                      onChange={(e) => setActiveRecord({ ...activeRecord, keyRisk: e.target.value })}
                      className="text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold">Mitigation Strategy & Preventive Controls</Label>
                    <Textarea
                      rows={3}
                      value={activeRecord.mitigation}
                      onChange={(e) => setActiveRecord({ ...activeRecord, mitigation: e.target.value })}
                      className="text-xs mt-1"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE: CORRECTIVE ACTIONS (CAPA)
            ========================================================================= */}
        {activeSubmodule === "actions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-purple-600" />
                  Corrective & Preventive Actions (CAPA) Register
                </h3>
                <p className="text-xs text-muted-foreground">Tracking statutory action items, remediation plans, and closure sign-offs.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setActiveSubmodule("overview")}>
                  ← Back to Overview
                </Button>
                <Button size="sm" className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold gap-1" onClick={() => setIsCreateActionOpen(true)}>
                  <Plus className="h-3.5 w-3.5" /> Create Action Item
                </Button>
              </div>
            </div>

            <Card className="border-border/80 shadow-2xs bg-card">
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Action ID</th>
                      <th className="py-2.5 px-3">Remediation Description</th>
                      <th className="py-2.5 px-3">Owner</th>
                      <th className="py-2.5 px-3">Due Date</th>
                      <th className="py-2.5 px-3">Priority</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {actionsList.map((act) => (
                      <tr key={act.id} className="hover:bg-muted/30">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">{act.id}</td>
                        <td className="py-2.5 px-3 font-medium text-foreground">{act.description}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{act.owner}</td>
                        <td className="py-2.5 px-3 text-muted-foreground font-mono">{act.dueDate}</td>
                        <td className="py-2.5 px-3">
                          <Badge className={cn("text-[10px]", act.priority === "High" ? "bg-red-500/10 text-red-600 border-red-300" : "bg-blue-500/10 text-blue-600 border-blue-300")}>
                            {act.priority}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge className={cn("text-[10px]", act.status === "Verified" ? "bg-emerald-500/10 text-emerald-600 border-emerald-300" : "bg-amber-500/10 text-amber-600 border-amber-300")}>
                            {act.status}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[10px] font-semibold text-emerald-600 hover:bg-emerald-50"
                            onClick={() => {
                              const updated = actionsList.map(a => a.id === act.id ? { ...a, status: a.status === "Verified" ? "In Progress" : "Verified" } : a);
                              setActionsList(updated);
                              toast({
                                title: "Status Updated",
                                description: `Action ${act.id} marked as ${act.status === "Verified" ? "In Progress" : "Verified"}.`,
                              });
                            }}
                          >
                            Toggle Closure
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE: RELATED RECORDS
            ========================================================================= */}
        {activeSubmodule === "related-records" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building className="h-4 w-4 text-cyan-600" />
                  Cross-ERP Related Records Matrix
                </h3>
                <p className="text-xs text-muted-foreground">Connected transactions across Enterprise Risk, Legal Register, and Audit modules.</p>
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setActiveSubmodule("overview")}>
                ← Back to Overview
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Enterprise Risk Records", count: "3 Risks Linked", code: "RSK-ENT-041", status: "Active", route: "/management/risk-management/enterprise-risk" },
                { title: "Statutory Licenses", count: "2 Licenses Linked", code: "LIC-CORP-09", status: "Renewed", route: "/management/risk-management/licenses" },
                { title: "Legal Register Obligations", count: "4 Sections", code: "LEG-2026-GST", status: "Compliant", route: "/management/risk-management/legal-register" },
                { title: "Audit Compliance Inspections", count: "2 Audits Logged", code: "AUD-COM-2026", status: "Scheduled", route: "/management/risk-management/audit-compliance" },
                { title: "Compliance Reporting Returns", count: "4 Filings", code: "REP-GST-Q1", status: "Submitted", route: "/management/risk-management/compliance-reporting" },
                { title: "ISO 9001:2015 Clause Matrix", count: "Clause 9.1.2", code: "ISO-QMS-091", status: "Verified", route: "/management/risk-management/iso-compliance" },
              ].map((rec, i) => (
                <Card key={i} className="p-4 border-border/80 shadow-2xs bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{rec.code}</span>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">{rec.status}</Badge>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{rec.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{rec.count}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-7 text-[11px] font-semibold mt-2"
                    onClick={() => {
                      toast({
                        title: `Opening: ${rec.title}`,
                        description: `Cross-linking to record ${rec.code}.`,
                      });
                    }}
                  >
                    View Linked Master →
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE: ATTACHMENTS VAULT
            ========================================================================= */}
        {activeSubmodule === "attachments" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-slate-600" />
                  Statutory Document Attachments Vault
                </h3>
                <p className="text-xs text-muted-foreground">Certified electronic copies of registration certificates, challans, and inspection reports.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setActiveSubmodule("overview")}>
                  ← Back to Overview
                </Button>
                <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1" onClick={() => setIsUploadAttachmentOpen(true)}>
                  <Upload className="h-3.5 w-3.5" /> Upload Document
                </Button>
              </div>
            </div>

            <Card className="border-border/80 shadow-2xs bg-card">
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">File ID</th>
                      <th className="py-2.5 px-3">Document Name</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">File Size</th>
                      <th className="py-2.5 px-3">Upload Date</th>
                      <th className="py-2.5 px-3">Uploaded By</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {attachmentsList.map((att) => (
                      <tr key={att.id} className="hover:bg-muted/30">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">{att.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-foreground flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{att.name}</span>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">{att.type}</td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">{att.size}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{att.uploadDate}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{att.uploadedBy}</td>
                        <td className="py-2.5 px-3 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[10px] text-primary hover:bg-primary/10 gap-1"
                            onClick={() => {
                              toast({
                                title: "Document Downloaded",
                                description: `Downloaded ${att.name} from ERP Secure Vault.`,
                              });
                            }}
                          >
                            <Download className="h-3 w-3" /> Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE: REVISION HISTORY & AUDIT TRAIL
            ========================================================================= */}
        {activeSubmodule === "history" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <History className="h-4 w-4 text-indigo-600" />
                  Controlled Revision History & Audit Trail
                </h3>
                <p className="text-xs text-muted-foreground">Immutable blockchain-ready change log satisfying 21 CFR Part 11 / ISO requirements.</p>
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setActiveSubmodule("overview")}>
                ← Back to Overview
              </Button>
            </div>

            <Card className="border-border/80 shadow-2xs bg-card p-4">
              <div className="space-y-3">
                {[
                  { version: "v1.2", date: "20-Mar-2026 14:32 IST", user: "K. Ramanathan", role: "Compliance Officer", change: "GSTR-3B monthly return filed and ARN-2026-90212 logged with challan proof." },
                  { version: "v1.1", date: "15-Feb-2026 10:15 IST", user: "S. Priya", role: "Tax Lead", change: "Updated statutory threshold in response to MCA Notification No. 12/2026." },
                  { version: "v1.0", date: "01-Jan-2026 09:00 IST", user: "D. Mehra", role: "Chief Risk Officer", change: "Initial controlled master record created and approved under MAICW framework." },
                ].map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/60">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{h.version}</span>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{h.user} <span className="text-muted-foreground font-normal">({h.role})</span></span>
                        <span className="font-mono text-[10px] text-muted-foreground">{h.date}</span>
                      </div>
                      <p className="text-muted-foreground text-[11px] mt-1">{h.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 2: REPORTS (COMPLETE 24 CONTROLLED AUDIT REPORTS & KPI MASTER)
            ========================================================================= */}
        {activeSubmodule === "reports" && (
          <div className="space-y-4">
            {/* Top Bar for Reports View */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border/80 shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileSpreadsheet className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Regulatory Compliance Audit Reports
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Section 43: 24 Controlled Registers, Executive Heatmaps & KPI Masters
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1.5"
                  onClick={() => handleExportCSV(currentReport)}
                >
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1.5"
                  onClick={() => window.print()}
                >
                  <Printer className="h-3.5 w-3.5 text-muted-foreground" />
                  Print Dossier
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs font-bold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsGenerateReportModalOpen(true)}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate Custom Dossier
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1.5 text-muted-foreground"
                  onClick={() => setActiveSubmodule("overview")}
                >
                  ← Back to Overview
                </Button>
              </div>
            </div>

            {/* Filter and Report Catalog Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* LEFT: 24 Reports Navigator (4 cols) */}
              <div className="lg:col-span-4 space-y-3">
                <Card className="border-border/80 shadow-2xs bg-card p-3">
                  <div className="space-y-2.5">
                    {/* Search reports */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search 24 compliance reports..."
                        value={reportSearchQuery}
                        onChange={(e) => setReportSearchQuery(e.target.value)}
                        className="h-8 pl-8 text-xs"
                      />
                    </div>

                    {/* Filter categories */}
                    <div className="flex flex-wrap gap-1">
                      {[
                        "All",
                        "Regulatory & Registers",
                        "Licenses & Permits",
                        "Filings & Submissions",
                        "Inspections & CAPA",
                        "Risk & Governance",
                        "Domain Specific",
                      ].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setReportCategoryFilter(cat)}
                          className={cn(
                            "px-2 py-0.5 text-[10px] rounded-md font-semibold transition-colors cursor-pointer",
                            reportCategoryFilter === cat
                              ? "bg-primary text-primary-foreground font-bold"
                              : "bg-muted/60 text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* List of 24 Reports */}
                  <div className="mt-3 space-y-1 max-h-[500px] overflow-y-auto pr-1">
                    {filteredReportsList.map((rep) => {
                      const isSelected = rep.id === selectedReportId;
                      return (
                        <button
                          key={rep.id}
                          onClick={() => setSelectedReportId(rep.id)}
                          className={cn(
                            "w-full text-left p-2 rounded-lg transition-all border flex items-start justify-between cursor-pointer",
                            isSelected
                              ? "bg-primary/10 border-primary/30 text-foreground font-semibold"
                              : "bg-background border-border/50 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                          )}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] font-bold text-primary px-1 rounded bg-primary/10">
                                {rep.code}
                              </span>
                              <span className="text-xs font-bold text-foreground">
                                {rep.title}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                              {rep.purpose}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-[9px] shrink-0 font-mono">
                            {rep.recordsCount} rows
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* RIGHT: Selected Report Detail & Interactive Table (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <Card className="border-border/80 shadow-2xs bg-card">
                  <CardHeader className="py-3 px-4 border-b border-border/60">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                            {currentReport.code}
                          </span>
                          <CardTitle className="text-base font-bold text-foreground">
                            {currentReport.title}
                          </CardTitle>
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-[10px]">
                            {currentReport.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {currentReport.purpose}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          Freq: {currentReport.frequency}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          Last Run: {currentReport.lastGenerated}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                        <tr>
                          {currentReport.columns.map((col, idx) => (
                            <th key={idx} className="py-2.5 px-3 whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {currentReport.sampleData.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-muted/30 transition-colors">
                            {currentReport.columns.map((col, colIdx) => {
                              const val = row[col];
                              const isStatusCol =
                                col.toLowerCase().includes("status") ||
                                col.toLowerCase().includes("state") ||
                                col.toLowerCase().includes("verification") ||
                                col.toLowerCase().includes("outcome");
                              const isCritical =
                                String(val).toLowerCase().includes("critical") ||
                                String(val).toLowerCase().includes("overdue") ||
                                String(val).toLowerCase().includes("high");
                              const isOk =
                                String(val).toLowerCase().includes("active") ||
                                String(val).toLowerCase().includes("compliant") ||
                                String(val).toLowerCase().includes("verified") ||
                                String(val).toLowerCase().includes("optimal");

                              return (
                                <td
                                  key={colIdx}
                                  className="py-2.5 px-3 whitespace-nowrap text-foreground"
                                >
                                  {isStatusCol ? (
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-[10px] font-semibold px-2 py-0.5",
                                        isCritical
                                          ? "bg-red-500/10 text-red-600 border-red-300"
                                          : isOk
                                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-300"
                                          : "bg-blue-500/10 text-blue-600 border-blue-300"
                                      )}
                                    >
                                      {val}
                                    </Badge>
                                  ) : (
                                    <span className={cn(colIdx === 0 && "font-mono font-bold")}>
                                      {val}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                {/* Visual Analytics Row: Heatmap & Regulatory Domain Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 5x5 Compliance Risk Heatmap (Section 16 in Spec) */}
                  <Card className="border-border/80 shadow-2xs bg-card p-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-2">
                      <span className="text-xs font-bold text-foreground">
                        Section 16: Compliance Risk Matrix (5×5)
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Likelihood × Impact
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex text-[9px] font-bold text-muted-foreground justify-between px-1">
                        <span>LIKELIHOOD</span>
                        <span>IMPACT (1 → 5)</span>
                      </div>
                      {heatmapData.map((row) => (
                        <div key={row.likelihood} className="flex items-center gap-1.5">
                          <span className="w-3 text-[10px] font-bold text-muted-foreground text-center">
                            {row.likelihood}
                          </span>
                          <div className="grid grid-cols-5 gap-1 flex-1">
                            {row.scores.map((score, cellIdx) => {
                              const count = row.counts[cellIdx];
                              const isRed = score >= 16;
                              const isOrange = score >= 10 && score < 16;
                              const isYellow = score >= 5 && score < 10;
                              const isGreen = score < 5;

                              return (
                                <div
                                  key={cellIdx}
                                  title={`Score: ${score} (Items: ${count})`}
                                  className={cn(
                                    "h-7 rounded flex flex-col items-center justify-center font-mono text-[9px] font-bold transition-transform hover:scale-105 cursor-pointer",
                                    isRed && "bg-red-500 text-white",
                                    isOrange && "bg-amber-500 text-white",
                                    isYellow && "bg-yellow-400 text-slate-900",
                                    isGreen && "bg-emerald-500 text-white"
                                  )}
                                >
                                  <span>{score}</span>
                                  {count > 0 && (
                                    <span className="text-[8px] opacity-90">({count})</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Domain Distribution Chart */}
                  <Card className="border-border/80 shadow-2xs bg-card p-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-2">
                      <span className="text-xs font-bold text-foreground">
                        Regulatory Domain Distribution
                      </span>
                      <span className="text-[10px] text-muted-foreground">Active Obligations</span>
                    </div>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={domainChartData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 9 }}
                            interval={0}
                            angle={-15}
                            textAnchor="end"
                          />
                          <YAxis tick={{ fontSize: 9 }} />
                          <RechartsTooltip />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {domainChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>

                {/* Section 44: Regulatory Compliance KPI Master */}
                <Card className="border-border/80 shadow-2xs bg-card p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-3">
                    <div>
                      <h3 className="text-xs font-bold text-foreground">
                        Section 44: Regulatory Compliance KPI Master
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        Enterprise multi-dimensional statutory performance indices
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Real-time Computed
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {REGULATORY_KPI_MASTER.map((cat, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-2"
                      >
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          {cat.category}
                        </span>
                        <div className="space-y-1.5 text-[11px]">
                          {cat.metrics.map((m, mIdx) => (
                            <div key={mIdx} className="flex justify-between items-center">
                              <span className="text-muted-foreground">{m.label}</span>
                              <div className="text-right">
                                <span className="font-bold text-foreground tabular">{m.value}</span>
                                {m.sublabel && (
                                  <div className="text-[9px] text-muted-foreground">{m.sublabel}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Section 45: Management Review Agenda */}
                <Card className="border-border/80 shadow-2xs bg-card p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-3">
                    <div>
                      <h3 className="text-xs font-bold text-foreground">
                        Section 45: Management Review Agenda & Compliance Sign-offs
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        Controlled agenda items for quarterly Executive Board review
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs font-semibold"
                      onClick={() => {
                        toast({
                          title: "Management Review Dossier",
                          description: "Board review package packaged with 14 verified agenda sign-offs.",
                        });
                      }}
                    >
                      Export Board Deck
                    </Button>
                  </div>

                  <div className="divide-y divide-border/60 text-xs">
                    {MANAGEMENT_REVIEW_AGENDA.slice(0, 6).map((item) => (
                      <div key={item.id} className="py-2 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <span className="font-mono text-[10px] font-bold text-muted-foreground mt-0.5">
                            #{item.id}
                          </span>
                          <div>
                            <div className="font-semibold text-foreground">{item.agendaTopic}</div>
                            <div className="text-[11px] text-muted-foreground">{item.notes}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px]",
                              item.status === "Completed"
                                ? "text-emerald-600 border-emerald-300 bg-emerald-500/10 font-bold"
                                : "text-amber-600 border-amber-300 bg-amber-500/10 font-bold"
                            )}
                          >
                            {item.status}
                          </Badge>
                          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                            {item.responsibleFunction}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL 1: ADD COMPLIANCE CONTROL
            ========================================================================= */}
        <Dialog open={isAddControlOpen} onOpenChange={setIsAddControlOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Add Compliance Control
              </DialogTitle>
              <DialogDescription className="text-xs">
                Attach a preventive, detective, or automated internal control to {activeRecord.id}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddControl} className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-semibold">Control ID</Label>
                  <Input
                    value={newControl.id}
                    onChange={(e) => setNewControl({ ...newControl, id: e.target.value })}
                    className="h-8 text-xs font-mono mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold">Control Type</Label>
                  <Select
                    value={newControl.type}
                    onValueChange={(val: any) => setNewControl({ ...newControl, type: val })}
                  >
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Preventive">Preventive</SelectItem>
                      <SelectItem value="Detective">Detective</SelectItem>
                      <SelectItem value="Automated">Automated</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Corrective">Corrective</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-semibold">Control Name / Mechanism</Label>
                <Input
                  required
                  placeholder="e.g. Automated reconciliation of invoice tax headers"
                  value={newControl.name}
                  onChange={(e) => setNewControl({ ...newControl, name: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-semibold">Frequency</Label>
                  <Select
                    value={newControl.frequency}
                    onValueChange={(val: any) => setNewControl({ ...newControl, frequency: val })}
                  >
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Continuous">Continuous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[11px] font-semibold">Accountable Owner</Label>
                  <Input
                    value={newControl.owner}
                    onChange={(e) => setNewControl({ ...newControl, owner: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setIsAddControlOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="h-8 text-xs bg-primary text-primary-foreground font-bold">
                  Attach Control
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* =========================================================================
            MODAL 2: UPLOAD COMPLIANCE EVIDENCE
            ========================================================================= */}
        <Dialog open={isUploadEvidenceOpen} onOpenChange={setIsUploadEvidenceOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Upload className="h-4 w-4 text-emerald-600" />
                Upload Compliance Evidence
              </DialogTitle>
              <DialogDescription className="text-xs">
                Upload verified proof, challans, or test reports for statutory audit integrity.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEvidence} className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-[11px] font-semibold">Document Title / Reference *</Label>
                <Input
                  required
                  placeholder="e.g. GSTR-3B Signed Filing Acknowledgement Mar 2026"
                  value={newEvidence.name}
                  onChange={(e) => setNewEvidence({ ...newEvidence, name: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-semibold">Evidence Type</Label>
                  <Select
                    value={newEvidence.type}
                    onValueChange={(val) => setNewEvidence({ ...newEvidence, type: val })}
                  >
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Filing Acknowledgement">Filing Acknowledgement</SelectItem>
                      <SelectItem value="Payment Proof">Payment Proof</SelectItem>
                      <SelectItem value="Internal Report">Internal Report</SelectItem>
                      <SelectItem value="Test Certificate">Test Certificate</SelectItem>
                      <SelectItem value="Audit Sign-off">Audit Sign-off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[11px] font-semibold">Issue Date</Label>
                  <Input
                    type="date"
                    value={newEvidence.date}
                    onChange={(e) => setNewEvidence({ ...newEvidence, date: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-semibold">Storage Location / Hash</Label>
                <Input
                  value={newEvidence.storageLocation}
                  onChange={(e) => setNewEvidence({ ...newEvidence, storageLocation: e.target.value })}
                  className="h-8 text-xs font-mono mt-1"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setIsUploadEvidenceOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Verify & Store Evidence
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* =========================================================================
            MODAL 3: RECORD FILING
            ========================================================================= */}
        <Dialog open={isRecordFilingOpen} onOpenChange={setIsRecordFilingOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-primary" />
                Record Statutory Filing Submission
              </DialogTitle>
              <DialogDescription className="text-xs">
                Log external statutory portal filing and acknowledgement details for {activeRecord.id}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-semibold">Filing Period</Label>
                  <Input
                    value={newFiling.period}
                    onChange={(e) => setNewFiling({ ...newFiling, period: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold">Filing Form</Label>
                  <Input
                    value={newFiling.type}
                    onChange={(e) => setNewFiling({ ...newFiling, type: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-semibold">Acknowledgement Number / ARN</Label>
                <Input
                  value={newFiling.ackNo}
                  onChange={(e) => setNewFiling({ ...newFiling, ackNo: e.target.value })}
                  className="h-8 text-xs font-mono font-bold mt-1"
                />
              </div>

              <div>
                <Label className="text-[11px] font-semibold">Filing Remarks & Compliance Note</Label>
                <Textarea
                  rows={2}
                  value={newFiling.remarks}
                  onChange={(e) => setNewFiling({ ...newFiling, remarks: e.target.value })}
                  className="text-xs mt-1 resize-none"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setIsRecordFilingOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  onClick={handleRecordFilingSubmit}
                >
                  Confirm & Update Status
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal for Create Action */}
        <Dialog open={isCreateActionOpen} onOpenChange={setIsCreateActionOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-purple-600" />
                Create Corrective Action (CAPA)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Log regulatory remediation plan with due date and compliance assignee.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAction} className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-[11px] font-semibold">Action Description *</Label>
                <Textarea
                  required
                  rows={2}
                  placeholder="e.g. Conduct reconciliation of supplier credit with MCA portal"
                  value={newActionForm.description}
                  onChange={(e) => setNewActionForm({ ...newActionForm, description: e.target.value })}
                  className="text-xs mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-semibold">Assignee Owner</Label>
                  <Input
                    value={newActionForm.owner}
                    onChange={(e) => setNewActionForm({ ...newActionForm, owner: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold">Target Due Date</Label>
                  <Input
                    type="date"
                    value={newActionForm.dueDate}
                    onChange={(e) => setNewActionForm({ ...newActionForm, dueDate: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>
              <div>
                <Label className="text-[11px] font-semibold">Priority</Label>
                <Select
                  value={newActionForm.priority}
                  onValueChange={(val) => setNewActionForm({ ...newActionForm, priority: val })}
                >
                  <SelectTrigger className="h-8 text-xs mt-1">
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
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => setIsCreateActionOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold">
                  Save Action
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal for Schedule Inspection */}
        <Dialog open={isScheduleInspectionOpen} onOpenChange={setIsScheduleInspectionOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-600" />
                Schedule Regulatory Inspection / Audit
              </DialogTitle>
              <DialogDescription className="text-xs">
                Record planned regulatory authority inspection visit and scope.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleScheduleInspection} className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-[11px] font-semibold">Inspecting Authority / Agency *</Label>
                <Input
                  required
                  placeholder="e.g. State Pollution Control Board, Factory Inspectorate"
                  value={newInspectionForm.agency}
                  onChange={(e) => setNewInspectionForm({ ...newInspectionForm, agency: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-semibold">Inspection Date</Label>
                  <Input
                    type="date"
                    value={newInspectionForm.date}
                    onChange={(e) => setNewInspectionForm({ ...newInspectionForm, date: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold">Lead Inspector</Label>
                  <Input
                    value={newInspectionForm.auditor}
                    onChange={(e) => setNewInspectionForm({ ...newInspectionForm, auditor: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>
              <div>
                <Label className="text-[11px] font-semibold">Audit Scope</Label>
                <Input
                  value={newInspectionForm.scope}
                  onChange={(e) => setNewInspectionForm({ ...newInspectionForm, scope: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => setIsScheduleInspectionOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold">
                  Schedule Visit
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal for Upload Attachment */}
        <Dialog open={isUploadAttachmentOpen} onOpenChange={setIsUploadAttachmentOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-blue-600" />
                Upload Document Attachment
              </DialogTitle>
              <DialogDescription className="text-xs">
                Upload controlled statutory license, permit, or certificate to document vault.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadAttachment} className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-[11px] font-semibold">Document Title / File Name *</Label>
                <Input
                  required
                  placeholder="e.g. PCB_Consent_To_Operate_Renewal_2026.pdf"
                  value={newAttachmentForm.name}
                  onChange={(e) => setNewAttachmentForm({ ...newAttachmentForm, name: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-[11px] font-semibold">Document Type</Label>
                <Select
                  value={newAttachmentForm.type}
                  onValueChange={(val) => setNewAttachmentForm({ ...newAttachmentForm, type: val })}
                >
                  <SelectTrigger className="h-8 text-xs mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="License">License</SelectItem>
                    <SelectItem value="Permit">Permit</SelectItem>
                    <SelectItem value="Audit Report">Audit Report</SelectItem>
                    <SelectItem value="Challan / Filing Ack">Challan / Filing Ack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => setIsUploadAttachmentOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Store Attachment
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* =========================================================================
            MODAL 4: GENERATE REPORT DOSSIER MODAL
            ========================================================================= */}
        <Dialog open={isGenerateReportModalOpen} onOpenChange={setIsGenerateReportModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                Generate Regulatory Compliance Dossier
              </DialogTitle>
              <DialogDescription className="text-xs">
                Select parameters to bundle controlled compliance reports, KPI masters, and evidence appendices.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-semibold">Report Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Compliance Dossier</SelectItem>
                      <SelectItem value="excel">Excel Multi-tab Register (.xlsx)</SelectItem>
                      <SelectItem value="board">Executive Board Slide Deck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[11px] font-semibold">Reporting Window</Label>
                  <Select
                    value={reportDateRange}
                    onValueChange={(val) => setReportDateRange(val)}
                  >
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Q1 2026">Q1 2026 (Jan - Mar 2026)</SelectItem>
                      <SelectItem value="FY 2025-26">Full Year FY 2025-26</SelectItem>
                      <SelectItem value="Trailing 30 Days">Trailing 30 Days</SelectItem>
                      <SelectItem value="All-time">Complete Historical Archive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-semibold">Target Regulatory Domain</Label>
                <Select defaultValue="All">
                  <SelectTrigger className="h-8 text-xs mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All 18 Regulatory Domains (Consolidated)</SelectItem>
                    <SelectItem value="Taxation">Taxation & GST</SelectItem>
                    <SelectItem value="Labour & Employment">Labour & Employment</SelectItem>
                    <SelectItem value="Product Safety">Product Safety & EVSE Standards</SelectItem>
                    <SelectItem value="Environmental Compliance">Environmental & E-Waste</SelectItem>
                    <SelectItem value="Data Protection & Privacy">Data Protection & DPDP Act</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1.5 text-[11px]">
                <div className="font-semibold text-foreground">Included Sections:</div>
                <div className="grid grid-cols-2 gap-1 text-muted-foreground text-[10px]">
                  <span>✓ 1. Form MAICW Master</span>
                  <span>✓ 2. 5×5 Risk Matrix Heatmap</span>
                  <span>✓ 3. 24 Controlled Registers</span>
                  <span>✓ 4. Section 44 KPI Master</span>
                  <span>✓ 5. Evidence Checksum Audit Trail</span>
                  <span>✓ 6. Management Review Minutes</span>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setIsGenerateReportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  onClick={() => {
                    setIsGenerateReportModalOpen(false);
                    toast({
                      title: "Compliance Dossier Generated",
                      description: `Package Magnertia_Regulatory_Dossier_${reportDateRange.replace(/\s+/g, "_")}.pdf ready for download.`,
                    });
                  }}
                >
                  Generate & Download Package
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* =========================================================================
            MODAL 5: QUICK COMPLIANCE CHECK
            ========================================================================= */}
        <Dialog open={isQuickCheckModalOpen} onOpenChange={setIsQuickCheckModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Real-time Statutory Compliance Verification
              </DialogTitle>
              <DialogDescription className="text-xs">
                Automated multi-point inspection of {activeRecord.id} against active laws.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2.5 py-2 text-xs">
              {[
                { title: "Statutory Law Identification", status: "Passed", detail: "Goods and Services Tax Act, 2017 recognized" },
                { title: "Authority Filing Gate", status: "Passed", detail: "CBIC / GSTN active gateway authenticated" },
                { title: "Controls Verification", status: "Passed", detail: "4 of 4 controls verified effective" },
                { title: "Evidence Checksum Audit", status: "Passed", detail: "GSTR-3B and challans hashed & verified" },
                { title: "Expiry & Penalty Exposure", status: "Passed", detail: "Next filing due in 12 days; zero overdue penalty" },
              ].map((chk, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/60">
                  <div>
                    <div className="font-semibold text-foreground text-[11px]">{chk.title}</div>
                    <div className="text-[10px] text-muted-foreground">{chk.detail}</div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-[10px]">
                    {chk.status}
                  </Badge>
                </div>
              ))}
            </div>
            <DialogFooter className="pt-2">
              <Button
                size="sm"
                className="h-8 text-xs bg-primary text-primary-foreground font-bold w-full"
                onClick={() => setIsQuickCheckModalOpen(false)}
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
