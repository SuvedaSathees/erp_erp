// Magnertia ERP - Incident Management Module
// Management -> Risk Management -> Incident Management
// Incident Management Form - MAICW Classification & Incident Response Engine

import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getIncidentManagementRecordFn } from "@/lib/incidentManagementFns.server";
import {
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Check,
  Search,
  Plus,
  FileText,
  ChevronDown,
  Pencil,
  Shield,
  Activity,
  Calendar,
  Building,
  Users,
  Coins,
  Leaf,
  Layers,
  Wrench,
  TrendingUp,
  Download,
  Upload,
  ArrowRight,
  Eye,
  FileCheck,
  MessageSquare,
  Sparkles,
  Target,
  FileCode,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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
  incidentManagementService,
  PRIMARY_INCIDENT_RECORD,
  IncidentRecord,
  IncidentActionItem,
  IncidentTimelineEvent,
  IncidentEvidenceItem,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
} from "@/services/incidentManagementService";

export const Route = createFileRoute(
  "/management/risk-management/incident-management",
)({
  component: IncidentManagementPage,
  head: () => ({
    meta: [
      { title: "Incident Management · Risk Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Incident Management Form — MAICW Classification, S1-S4 Severity, Containment, 5-Why RCA, CAPA Integration, and Timeline Tracking.",
      },
    ],
  }),
});

export function IncidentManagementPage() {
  const { toast } = useToast();

  const { data: dbRecord } = useQuery({
    queryKey: ["incident-management", "record"],
    queryFn: () => getIncidentManagementRecordFn({ data: {} }),
  });

  // Active Incident record (defaults to PRIMARY_INCIDENT_RECORD matching screenshot)
  const [activeIncident, setActiveIncident] = useState<IncidentRecord>(
    incidentManagementService.getPrimaryIncident(),
  );
  useEffect(() => { if (dbRecord?.data) setActiveIncident(dbRecord.data); }, [dbRecord]);

  const [activeTab, setActiveTab] = useState<string>("overview");

  // Registers & Lists
  const [allIncidents, setAllIncidents] = useState<IncidentRecord[]>(
    incidentManagementService.getFullRegister(),
  );
  const [openActions, setOpenActions] = useState<IncidentActionItem[]>(
    incidentManagementService.getOpenActions(),
  );
  const [timeline, setTimeline] = useState<IncidentTimelineEvent[]>(
    incidentManagementService.getTimeline(),
  );
  const [evidenceList, setEvidenceList] = useState<IncidentEvidenceItem[]>(
    incidentManagementService.getEvidence(),
  );

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);
  const [selectedIncidentForView, setSelectedIncidentForView] =
    useState<IncidentRecord | null>(null);

  // Form State for editing or adding
  const [formData, setFormData] = useState<IncidentRecord>({
    ...PRIMARY_INCIDENT_RECORD,
  });

  const recentIncidents = incidentManagementService.getRecentIncidents();
  const typeDistribution = incidentManagementService.getTypeDistribution();
  const severityDistribution = incidentManagementService.getSeverityData();
  const monthlyTrend = incidentManagementService.getMonthlyTrend();
  const alertsList = incidentManagementService.getAlerts();
  const fiveWhyList = incidentManagementService.get5Why();
  const maicwFields = incidentManagementService.getMAICWFields();
  const reportsList = incidentManagementService.getReports();

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Incident Number",
      "Title",
      "Type",
      "Category",
      "Severity",
      "Priority",
      "Department",
      "Location",
      "Incident Date",
      "Owner",
      "Status",
      "Downtime (hrs)",
      "Cost (Lakhs)",
    ];
    const rows = allIncidents.map((inc) => [
      inc.id,
      inc.incidentNumber,
      `"${inc.title.replace(/"/g, '""')}"`,
      inc.type,
      inc.category,
      inc.severity,
      inc.priority,
      inc.department,
      `"${inc.location}"`,
      inc.incidentDate,
      inc.incidentOwner,
      inc.status,
      inc.impactMetrics.productionDowntimeHours,
      inc.impactMetrics.estimatedCostLakhs,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Incident_Register_${activeIncident.incidentNumber}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Completed",
      description: `Downloaded ${allIncidents.length} incident records.`,
    });
  };

  const handleSaveIncident = (updated: IncidentRecord) => {
    setActiveIncident(updated);
    setAllIncidents((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i)),
    );
    setIsEditModalOpen(false);
    toast({
      title: "Incident Updated",
      description: `Changes to ${updated.incidentNumber} saved successfully.`,
    });
  };

  const handleCreateIncident = () => {
    const newId = `INC-2026-0${allIncidents.length + 1}`;
    const newInc: IncidentRecord = {
      ...formData,
      id: newId,
      incidentNumber: `INC-${formData.department.slice(0, 3).toUpperCase()}-2026-0${allIncidents.length + 1}`,
    };
    setAllIncidents([newInc, ...allIncidents]);
    setActiveIncident(newInc);
    setIsNewIncidentModalOpen(false);
    toast({
      title: "Incident Registered",
      description: `${newInc.incidentNumber} logged under ${newInc.type} with priority ${newInc.priority}.`,
    });
  };

  const filteredIncidents = allIncidents.filter((inc) => {
    const matchesSearch =
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.incidentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All" || inc.type === typeFilter;
    const matchesSeverity =
      severityFilter === "All" || inc.severity.startsWith(severityFilter);
    return matchesSearch && matchesType && matchesSeverity;
  });

  return (
    <AppShell
      title="Incident Management"
      breadcrumb="Management > Risk Management > Incident Management"
      description="EHS, operational, and cyber incident logging, root cause analysis, corrective actions, and containment SLAs."
      tabs={<RiskManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* =========================================================================
            1. HEADER BANNER - EXACT MATCH TO SCREENSHOT
            ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-card p-4 rounded-xl border border-border/80 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground whitespace-nowrap">
                  Incident Management
                </h1>
                <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-amber-300 font-bold px-2 py-0.5 text-xs flex items-center gap-1.5 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                  {activeIncident.status}
                </Badge>
              </div>
              <p className="text-xs font-semibold text-foreground/80 mt-1">
                {activeIncident.id} | {activeIncident.title}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Report. Investigate. Resolve. Prevent. A Safer, Stronger Tomorrow.
              </p>
            </div>
          </div>

          {/* Center Graphic Banner Callout matching screenshot */}
          <div className="hidden xl:flex items-center gap-3 bg-muted/40 border border-border/60 rounded-lg px-3 py-1.5 text-xs shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
              <Shield className="h-4 w-4" />
            </div>
            <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
              <span className="text-foreground block font-bold">Prevent Incidents</span>
              Enable Resilience · Drive Continuous Improvement
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs shrink-0"
              onClick={() => {
                setFormData({
                  ...PRIMARY_INCIDENT_RECORD,
                  title: "",
                  description: "",
                  statement: "",
                });
                setIsNewIncidentModalOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              New Incident
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium shrink-0 hidden sm:inline-flex"
              onClick={() => setActiveTab("analytics")}
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
                <DropdownMenuItem className="sm:hidden" onClick={() => setActiveTab("analytics")}>
                  <FileText className="h-3.5 w-3.5 mr-2" /> Generate Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV}>
                  <Download className="h-3.5 w-3.5 mr-2" /> Export Register (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <FileText className="h-3.5 w-3.5 mr-2" /> Print Incident Dossier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const escalated: IncidentRecord = {
                      ...activeIncident,
                      priority: "Critical",
                      severity: "S1 - Critical Outage",
                      status: "Investigating",
                    };
                    setActiveIncident(escalated);
                    setAllIncidents((prev) =>
                      prev.map((i) => (i.id === escalated.id ? escalated : i)),
                    );
                    toast({
                      title: "Incident Escalated",
                      description: `${escalated.incidentNumber} escalated to S1 Critical. Emergency response team notified.`,
                    });
                  }}
                >
                  <AlertOctagon className="h-3.5 w-3.5 mr-2 text-red-600" /> Escalate to S1 Critical
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setActiveTab("related");
                    toast({
                      title: "BCP Linkage",
                      description: `Cross-referenced ${activeIncident.incidentNumber} with Business Continuity & DR plans.`,
                    });
                  }}
                >
                  <Shield className="h-3.5 w-3.5 mr-2 text-blue-600" /> Link to BCP / DR Plan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const closed: IncidentRecord = {
                      ...activeIncident,
                      status: "Closed",
                    };
                    setActiveIncident(closed);
                    setAllIncidents((prev) =>
                      prev.map((i) => (i.id === closed.id ? closed : i)),
                    );
                    toast({
                      title: "Incident Closed",
                      description: `${closed.incidentNumber} marked as resolved and verified.`,
                    });
                  }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-600" /> Mark Incident Closed
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
              ← Back to Incident Command Center
            </Button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: OVERVIEW - 1:1 REPLICATION OF SCREENSHOT
            ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* ROW 1: 6 EXECUTIVE SUMMARY KPI CARDS (EXACT SCREENSHOT LAYOUT) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Card 1: Total Incidents */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">24</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Total Incidents
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    ↑ 20% vs. previous month
                  </span>
                </div>
              </Card>

              {/* Card 2: Open Incidents */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">8</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Open Incidents
                  </div>
                  <span className="text-[10px] font-bold text-red-600">
                    ↑ 33% vs. previous month
                  </span>
                </div>
              </Card>

              {/* Card 3: Resolved Incidents */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 stroke-[3]" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">12</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Resolved Incidents
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    ↑ 50% vs. previous month
                  </span>
                </div>
              </Card>

              {/* Card 4: Critical (S1) */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0">
                  <AlertOctagon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">2</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Critical (S1)
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    ↓ 50% vs. previous month
                  </span>
                </div>
              </Card>

              {/* Card 5: Overdue Actions */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">5</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Overdue Actions
                  </div>
                  <span className="text-[10px] font-bold text-red-600">
                    ↑ 29% vs. previous month
                  </span>
                </div>
              </Card>

              {/* Card 6: Closure Rate */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">98%</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Closure Rate
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    ↑ 5% vs. previous month
                  </span>
                </div>
              </Card>
            </div>

            {/* ROW 2: 3-COLUMN CORE MIDDLE SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* COLUMN 1 (COL-SPAN-4 ON XL, FULL ON LG): INCIDENT DETAILS FORM CARD */}
              <Card className="lg:col-span-12 xl:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                    <h2 className="text-sm font-bold text-foreground">
                      Incident Details
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => {
                        setFormData({ ...activeIncident });
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-muted-foreground">Incident ID</span>
                      <span className="font-mono font-bold text-primary">
                        {activeIncident.id}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-muted-foreground">Incident Number</span>
                      <span className="font-mono font-semibold text-foreground">
                        {activeIncident.incidentNumber}
                      </span>
                    </div>

                    <div className="py-0.5">
                      <span className="text-muted-foreground block">Incident Title</span>
                      <span className="font-bold text-foreground">
                        {activeIncident.title}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-0.5">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Incident Type
                        </span>
                        <div className="font-semibold text-foreground truncate border border-border/60 rounded px-2 py-1 bg-muted/20">
                          {activeIncident.type}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Incident Category
                        </span>
                        <div className="font-semibold text-foreground truncate border border-border/60 rounded px-2 py-1 bg-muted/20">
                          {activeIncident.category}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-0.5">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Incident Source
                        </span>
                        <div className="font-medium text-foreground truncate border border-border/60 rounded px-2 py-1 bg-muted/20">
                          {activeIncident.source}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Business Function
                        </span>
                        <div className="font-medium text-foreground truncate border border-border/60 rounded px-2 py-1 bg-muted/20">
                          {activeIncident.businessFunction}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-0.5">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Department
                        </span>
                        <span className="font-medium text-foreground">
                          {activeIncident.department}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Location
                        </span>
                        <span className="font-medium text-foreground">
                          {activeIncident.location}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 py-1 border-t border-border/40 text-[11px]">
                      <div>
                        <span className="text-muted-foreground block">Incident Date</span>
                        <span className="font-mono text-foreground font-medium">
                          {activeIncident.incidentDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Detection Date</span>
                        <span className="font-mono text-foreground font-medium">
                          {activeIncident.detectionDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Reported Date</span>
                        <span className="font-mono text-foreground font-medium">
                          {activeIncident.reportedDate}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-1 border-t border-border/40">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Reported By
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="h-5 w-5 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                            {activeIncident.reportedByAvatar || "RK"}
                          </span>
                          <span className="font-semibold text-foreground text-xs">
                            {activeIncident.reportedBy}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Incident Owner
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="h-5 w-5 rounded-full bg-teal-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                            {activeIncident.incidentOwnerAvatar || "AK"}
                          </span>
                          <span className="font-semibold text-foreground text-xs">
                            {activeIncident.incidentOwner}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 py-1">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">
                          Priority
                        </span>
                        <span className="font-bold text-orange-600 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                          {activeIncident.priority}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">
                          Severity
                        </span>
                        <span className="font-bold text-orange-600 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                          {activeIncident.severity}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">
                          Status
                        </span>
                        <span className="font-bold text-amber-600 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          {activeIncident.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">
                          Confidentiality
                        </span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 text-blue-600">
                          {activeIncident.confidentiality}
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/40">
                      <span className="text-muted-foreground block text-[11px] font-semibold">
                        Description
                      </span>
                      <p className="text-foreground/90 font-medium text-xs mt-0.5">
                        {activeIncident.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* COLUMN 2 (COL-SPAN-5 ON XL, 7 ON LG): TREND, FLOW & RECENT INCIDENTS */}
              <div className="lg:col-span-7 xl:col-span-5 space-y-4">
                {/* Incident Trend (Stacked Bar Chart) */}
                <Card className="p-4 border-border/80 shadow-2xs bg-card">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                    <h2 className="text-sm font-bold text-foreground">
                      Incident Trend
                    </h2>
                    <div className="flex items-center gap-1.5">
                      <Select defaultValue="monthly">
                        <SelectTrigger className="h-6 w-20 text-[10px] bg-muted/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="12months">
                        <SelectTrigger className="h-6 w-28 text-[10px] bg-muted/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12months">Last 12 Months</SelectItem>
                          <SelectItem value="ytd">Year to Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyTrend}>
                        <XAxis
                          dataKey="month"
                          stroke="#888888"
                          fontSize={9}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={9}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 20]}
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
                        <Bar dataKey="operational" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="quality" stackId="a" fill="#10b981" />
                        <Bar dataKey="safety" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="cyber" stackId="a" fill="#ef4444" />
                        <Bar dataKey="compliance" stackId="a" fill="#8b5cf6" />
                        <Bar dataKey="others" stackId="a" fill="#64748b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend below bar chart matching screenshot */}
                  <div className="flex items-center justify-center gap-3 pt-2 text-[10px] font-semibold text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-xs bg-[#3b82f6]" /> Operational
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-xs bg-[#10b981]" /> Quality
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-xs bg-[#f59e0b]" /> Safety
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-xs bg-[#ef4444]" /> Cyber
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-xs bg-[#8b5cf6]" /> Compliance
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-xs bg-[#64748b]" /> Others
                    </span>
                  </div>
                </Card>

                {/* Incident Management Flow Diagram */}
                <Card className="p-3 border-border/80 shadow-2xs bg-card">
                  <div className="text-xs font-bold text-foreground mb-2">
                    Incident Management Flow
                  </div>
                  <div className="grid grid-cols-6 gap-1 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-bold text-foreground mt-1">Report</span>
                    </div>

                    <div className="flex flex-col items-center relative">
                      <ArrowRight className="absolute -left-2 top-3 h-3 w-3 text-muted-foreground/60 hidden sm:block" />
                      <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-bold text-foreground mt-1">Register</span>
                    </div>

                    <div className="flex flex-col items-center relative">
                      <ArrowRight className="absolute -left-2 top-3 h-3 w-3 text-muted-foreground/60 hidden sm:block" />
                      <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                        <Search className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-bold text-foreground mt-1">Investigate</span>
                    </div>

                    <div className="flex flex-col items-center relative">
                      <ArrowRight className="absolute -left-2 top-3 h-3 w-3 text-muted-foreground/60 hidden sm:block" />
                      <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <Target className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-bold text-foreground mt-1">Root Cause</span>
                    </div>

                    <div className="flex flex-col items-center relative">
                      <ArrowRight className="absolute -left-2 top-3 h-3 w-3 text-muted-foreground/60 hidden sm:block" />
                      <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-bold text-foreground mt-1">Corrective Action</span>
                    </div>

                    <div className="flex flex-col items-center relative">
                      <ArrowRight className="absolute -left-2 top-3 h-3 w-3 text-muted-foreground/60 hidden sm:block" />
                      <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-bold text-foreground mt-1">Close</span>
                    </div>
                  </div>
                </Card>

                {/* Recent Incidents Table */}
                <Card className="p-4 border-border/80 shadow-2xs bg-card">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                    <h2 className="text-sm font-bold text-foreground">
                      Recent Incidents
                    </h2>
                    <button
                      onClick={() => setActiveTab("details")}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/40 text-muted-foreground text-left text-[11px]">
                          <th className="py-1.5 font-semibold">Date</th>
                          <th className="py-1.5 font-semibold">Incident Number</th>
                          <th className="py-1.5 font-semibold">Title</th>
                          <th className="py-1.5 font-semibold">Type</th>
                          <th className="py-1.5 font-semibold text-center">Severity</th>
                          <th className="py-1.5 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {recentIncidents.map((inc) => (
                          <tr
                            key={inc.incidentNumber}
                            className="hover:bg-muted/20 cursor-pointer"
                            onClick={() => {
                              const found = allIncidents.find(
                                (i) => i.incidentNumber === inc.incidentNumber,
                              );
                              if (found) setActiveIncident(found);
                            }}
                          >
                            <td className="py-1.5 text-muted-foreground font-mono text-[11px]">
                              {inc.date}
                            </td>
                            <td className="py-1.5 font-mono text-primary font-bold">
                              {inc.incidentNumber}
                            </td>
                            <td className="py-1.5 font-medium text-foreground truncate max-w-[120px]">
                              {inc.title}
                            </td>
                            <td className="py-1.5 text-muted-foreground">
                              {inc.type}
                            </td>
                            <td className="py-1.5 text-center">
                              <span
                                className={cn(
                                  "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                  inc.severity === "S2"
                                    ? "bg-orange-500/10 text-orange-600"
                                    : inc.severity === "S3"
                                      ? "bg-amber-500/10 text-amber-600"
                                      : "bg-blue-500/10 text-blue-600",
                                )}
                              >
                                {inc.severity}
                              </span>
                            </td>
                            <td className="py-1.5 text-right">
                              <span
                                className={cn(
                                  "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                  inc.status === "Investigating"
                                    ? "bg-amber-500/10 text-amber-600"
                                    : inc.status === "Open"
                                      ? "bg-red-500/10 text-red-600"
                                      : inc.status === "Resolved"
                                        ? "bg-emerald-500/10 text-emerald-600"
                                        : "bg-teal-500/10 text-teal-600",
                                )}
                              >
                                {inc.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* COLUMN 3 (COL-SPAN-3 ON XL, 5 ON LG): DONUT, SEVERITY PROGRESS & OPEN ACTIONS */}
              <div className="lg:col-span-5 xl:col-span-3 space-y-4">
                {/* Incidents by Type (FY 2026) Donut */}
                <Card className="p-4 border-border/80 shadow-2xs bg-card">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                    <h2 className="text-sm font-bold text-foreground">
                      Incidents by Type (FY 2026)
                    </h2>
                    <button
                      onClick={() => setActiveTab("analytics")}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-36 w-36 relative shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={typeDistribution}
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={2}
                            dataKey="count"
                          >
                            {typeDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value, name) => [`${value} Incidents`, name]}
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
                        <span className="text-lg font-black text-foreground">24</span>
                        <span className="text-[9px] font-bold text-muted-foreground">
                          Total Incidents
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5 text-[10px] flex-1 overflow-y-auto max-h-36 pr-1">
                      {typeDistribution.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between text-muted-foreground hover:text-foreground"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="truncate">{item.name}</span>
                          </div>
                          <span className="font-semibold text-foreground shrink-0">
                            {item.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Severity Distribution Progress Bars */}
                <Card className="p-4 border-border/80 shadow-2xs bg-card">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                    <h2 className="text-sm font-bold text-foreground">
                      Severity Distribution
                    </h2>
                    <button
                      onClick={() => setActiveTab("analytics")}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    {severityDistribution.map((sev) => (
                      <div key={sev.level} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-foreground">
                            {sev.level}
                          </span>
                          <span className="font-bold text-foreground">
                            {sev.count}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${(sev.count / sev.totalMax) * 100}%`,
                              backgroundColor: sev.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Open Actions Table */}
                <Card className="p-4 border-border/80 shadow-2xs bg-card">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                    <h2 className="text-sm font-bold text-foreground">
                      Open Actions
                    </h2>
                    <button
                      onClick={() => setActiveTab("corrective")}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/40 text-muted-foreground text-left text-[11px]">
                          <th className="py-1.5 font-semibold">Action ID</th>
                          <th className="py-1.5 font-semibold">Description</th>
                          <th className="py-1.5 font-semibold">Due Date</th>
                          <th className="py-1.5 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {openActions.slice(0, 5).map((act) => (
                          <tr key={act.id} className="hover:bg-muted/20">
                            <td className="py-1.5 font-mono text-primary font-bold text-[10px]">
                              {act.id}
                            </td>
                            <td className="py-1.5 font-medium text-foreground truncate max-w-[90px]">
                              {act.description}
                            </td>
                            <td className="py-1.5 font-mono text-muted-foreground text-[10px]">
                              {act.dueDate}
                            </td>
                            <td className="py-1.5 text-right">
                              <span
                                className={cn(
                                  "px-1.5 py-0.5 rounded text-[9px] font-bold",
                                  act.status === "In Progress"
                                    ? "bg-amber-500/10 text-amber-700"
                                    : act.status === "Open"
                                      ? "bg-red-500/10 text-red-600"
                                      : "bg-rose-500/10 text-rose-700",
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
              </div>
            </div>

            {/* ROW 3: BOTTOM THREE CARDS (INCIDENT IMPACT | COMPLIANCE & RISK LINKAGE | ALERTS & NOTIFICATIONS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Incident Impact Card (Col-span-4) */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card">
                <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-3">
                  Incident Impact
                </h2>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted/20 border border-border/60">
                    <Building className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                    <div className="text-base font-black text-foreground">
                      {activeIncident.impactMetrics.productionDowntimeHours} hrs
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold block leading-tight">
                      Production Downtime
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-muted/20 border border-border/60">
                    <Coins className="h-4 w-4 mx-auto text-emerald-600 mb-1" />
                    <div className="text-base font-black text-foreground">
                      ₹ {activeIncident.impactMetrics.estimatedCostLakhs} L
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold block leading-tight">
                      Estimated Cost
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-muted/20 border border-border/60">
                    <Users className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                    <div className="text-base font-black text-foreground">
                      {activeIncident.impactMetrics.injuriesCount}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold block leading-tight">
                      Injuries
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-muted/20 border border-border/60">
                    <Leaf className="h-4 w-4 mx-auto text-teal-600 mb-1" />
                    <div className="text-base font-black text-foreground">
                      {activeIncident.impactMetrics.environmentalImpact}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold block leading-tight">
                      Environmental Impact
                    </span>
                  </div>
                </div>
              </Card>

              {/* Compliance & Risk Linkage Card (Col-span-4) */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card">
                <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-3">
                  Compliance & Risk Linkage
                </h2>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-200">
                    <FileCheck className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                    <div className="text-base font-black text-foreground">
                      {activeIncident.linkage.complianceRecordsCount}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold block leading-tight">
                      Compliance Records
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-200">
                    <AlertTriangle className="h-4 w-4 mx-auto text-amber-600 mb-1" />
                    <div className="text-base font-black text-foreground">
                      {activeIncident.linkage.riskRegisterCount}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold block leading-tight">
                      Risk Register
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-red-500/5 border border-red-200">
                    <FileText className="h-4 w-4 mx-auto text-red-600 mb-1" />
                    <div className="text-base font-black text-foreground">
                      {activeIncident.linkage.ncrCount}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold block leading-tight">
                      NCR
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-200">
                    <Wrench className="h-4 w-4 mx-auto text-emerald-600 mb-1" />
                    <div className="text-base font-black text-foreground">
                      {activeIncident.linkage.capaActionsCount}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold block leading-tight">
                      CAPA Actions
                    </span>
                  </div>
                </div>
              </Card>

              {/* Alerts & Notifications Card (Col-span-4) */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                  <h2 className="text-sm font-bold text-foreground">
                    Alerts & Notifications
                  </h2>
                  <button
                    onClick={() => setActiveTab("communications")}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-1.5 text-xs">
                  {alertsList.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between py-1 border-b border-border/30 last:border-0"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full shrink-0",
                            alert.severity === "Critical"
                              ? "bg-red-500"
                              : alert.severity === "Warning"
                                ? "bg-amber-500"
                                : "bg-blue-500",
                          )}
                        />
                        <span className="font-medium text-foreground truncate text-[11px]">
                          {alert.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        {alert.timeAgo}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: INCIDENT DETAILS & FULL REGISTER
            ========================================================================= */}
        {activeTab === "details" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Master Incident Register (24 Records)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Controlled log of all operational, safety, quality, and cyber incidents across Magnertia.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search incident, location, number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-8 text-xs bg-muted/20"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-8 w-36 text-xs">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      <SelectItem value="Operational">Operational</SelectItem>
                      <SelectItem value="Quality">Quality</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className="h-8 gap-1.5 text-xs font-semibold"
                    onClick={handleExportCSV}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export CSV
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border/60">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border/60 text-muted-foreground text-left">
                      <th className="py-2.5 px-3 font-semibold">Incident ID</th>
                      <th className="py-2.5 px-3 font-semibold">Number</th>
                      <th className="py-2.5 px-3 font-semibold">Title</th>
                      <th className="py-2.5 px-3 font-semibold">Type</th>
                      <th className="py-2.5 px-3 font-semibold">Department</th>
                      <th className="py-2.5 px-3 font-semibold">Location</th>
                      <th className="py-2.5 px-3 font-semibold">Severity</th>
                      <th className="py-2.5 px-3 font-semibold">Priority</th>
                      <th className="py-2.5 px-3 font-semibold">Owner</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredIncidents.map((inc) => (
                      <tr
                        key={inc.id}
                        className={cn(
                          "hover:bg-muted/30 transition-colors",
                          activeIncident.id === inc.id && "bg-primary/5",
                        )}
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">
                          {inc.id}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">
                          {inc.incidentNumber}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-foreground max-w-xs truncate">
                          {inc.title}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {inc.type}
                        </td>
                        <td className="py-2.5 px-3 text-foreground">
                          {inc.department}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground truncate max-w-[120px]">
                          {inc.location}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              inc.severity.includes("S1")
                                ? "bg-red-500/10 text-red-600"
                                : inc.severity.includes("S2")
                                  ? "bg-orange-500/10 text-orange-600"
                                  : "bg-amber-500/10 text-amber-600",
                            )}
                          >
                            {inc.severity}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-foreground">
                          {inc.priority}
                        </td>
                        <td className="py-2.5 px-3 text-foreground">
                          {inc.incidentOwner}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant="outline" className="text-[10px]">
                            {inc.status}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              setActiveIncident(inc);
                              setActiveTab("overview");
                            }}
                            title="Set as Active Form"
                          >
                            <Check className="h-3.5 w-3.5 text-primary" />
                          </Button>
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
            TAB 3: INVESTIGATION & CONTAINMENT
            ========================================================================= */}
        {activeTab === "investigation" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="border-b border-border/60 pb-3 mb-4">
                <h2 className="text-base font-bold text-foreground">
                  Incident Investigation & Immediate Containment
                </h2>
                <p className="text-xs text-muted-foreground">
                  Section 9 & 12: Lead investigator logs, interview statements, physical quarantine, and forensic findings.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Immediate Containment Card */}
                <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    Immediate Containment Actions (Section 9)
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded bg-background border border-border/60">
                      <span className="font-bold text-foreground block">
                        1. Physical Isolation of Motor M-04
                      </span>
                      <p className="text-muted-foreground mt-0.5">
                        Locked out electrical breakers; diverted line throughput to Line 3 Auxiliary Drive.
                      </p>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                        Completed at 28 Sep 11:00 • Status: Effective
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-background border border-border/60">
                      <span className="font-bold text-foreground block">
                        2. Quarantine of 18 Carrier Chassis Units
                      </span>
                      <p className="text-muted-foreground mt-0.5">
                        Transferred halting units to Quality Buffer zone to inspect for thermal distortion.
                      </p>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                        Completed at 28 Sep 11:20 • Status: Verified Clear
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lead Investigator & Interview Logs */}
                <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Investigation Team & Witness Statements (Section 14)
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded bg-background border border-border/60">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">
                          Ramesh S (Line Lead Operator)
                        </span>
                        <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">
                          Verified Statement
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-1 italic">
                        "Heard high-pitch grinding noise around 10:30; attempted manual speed trim before safety relay tripped."
                      </p>
                    </div>

                    <div className="p-2.5 rounded bg-background border border-border/60">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">
                          Karthik R (Senior Maintenance Tech)
                        </span>
                        <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">
                          Verified Statement
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-1 italic">
                        "Lubrication port was dry. Bearing grease had completely burnt into hard carbon scale."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 4: ROOT CAUSE ANALYSIS (5-WHY & FISHBONE)
            ========================================================================= */}
        {activeTab === "rca" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="border-b border-border/60 pb-3 mb-4">
                <h2 className="text-base font-bold text-foreground">
                  Root Cause Analysis (RCA & 5-Why Methodology)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Section 16 & 17: Systematic causal decomposition from immediate bearing trip to organizational governance failure.
                </p>
              </div>

              <div className="space-y-3">
                {fiveWhyList.map((step, idx) => (
                  <div
                    key={step.step}
                    className="p-3.5 rounded-lg border border-border/60 bg-muted/10 relative"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                        {step.step}
                      </span>
                      <h3 className="font-bold text-sm text-foreground">
                        {step.question}
                      </h3>
                    </div>
                    <div className="mt-2 text-xs space-y-1">
                      <p className="text-foreground font-medium">
                        Answer: <span className="text-muted-foreground">{step.answer}</span>
                      </p>
                      <div className="text-[11px] text-muted-foreground bg-muted/40 p-1.5 rounded inline-block font-mono">
                        Evidence Link: {step.evidence}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RCA Conclusion */}
              <div className="mt-4 p-4 rounded-xl border border-emerald-300 bg-emerald-500/10">
                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  Root Cause Determination
                </h3>
                <p className="text-xs text-foreground mt-1">
                  <strong>Preventive Maintenance Oversight:</strong> Production planning scheduled continuous 24/7 overtime without honoring automated maintenance lockouts, causing critical lubrication intervals to lapse by 6 days.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 5: CORRECTIVE & PREVENTIVE ACTION (CAPA)
            ========================================================================= */}
        {activeTab === "corrective" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Corrective & Preventive Action Plan (Section 18 & 19)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Immediate repairs, SOP updates, automation safeguards, and verification milestones.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold"
                  onClick={() => {
                    toast({
                      title: "Add Action Item",
                      description: "Opening CAPA registration dialog...",
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Link New Action
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border/60">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border/60 text-muted-foreground text-left">
                      <th className="py-2.5 px-3 font-semibold">Action ID</th>
                      <th className="py-2.5 px-3 font-semibold">Action Title</th>
                      <th className="py-2.5 px-3 font-semibold">Type</th>
                      <th className="py-2.5 px-3 font-semibold">Owner</th>
                      <th className="py-2.5 px-3 font-semibold">Due Date</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-3 font-semibold">Evidence / Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {openActions.map((act) => (
                      <tr key={act.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">
                          {act.id}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">
                          {act.description}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant="outline" className="text-[10px]">
                            {act.actionType}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-foreground">
                          {act.owner}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">
                          {act.dueDate}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              act.status === "In Progress"
                                ? "bg-amber-500/10 text-amber-700"
                                : act.status === "Open"
                                  ? "bg-red-500/10 text-red-600"
                                  : "bg-blue-500/10 text-blue-600",
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
            TAB 6: RELATED RECORDS (RISK, NCR, CAPA)
            ========================================================================= */}
        {activeTab === "related" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="border-b border-border/60 pb-3 mb-4">
                <h2 className="text-base font-bold text-foreground">
                  Cross-Module Linkage & Upstream Risk Records (Section 21)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Bi-directional traceability into Enterprise, Operational, and Vendor Risk registers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="p-3.5 border-border/60 bg-muted/10">
                  <span className="font-bold text-xs text-blue-600 uppercase">Operational Risk Link</span>
                  <h3 className="font-bold text-sm text-foreground mt-1">OR-2026-004</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Unplanned conveyor stoppage & thermal bearing failure in battery assembly line.
                  </p>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-2">
                    Inherent: 16 → Residual: 6
                  </span>
                </Card>

                <Card className="p-3.5 border-border/60 bg-muted/10">
                  <span className="font-bold text-xs text-purple-600 uppercase">NCR Record Link</span>
                  <h3 className="font-bold text-sm text-foreground mt-1">NCR-MNT-2026-018</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Defective high-temperature grease batch supplier non-conformance.
                  </p>
                  <span className="text-[10px] text-purple-600 font-bold block mt-2">
                    Supplier: Klüber Lubrication
                  </span>
                </Card>

                <Card className="p-3.5 border-border/60 bg-muted/10">
                  <span className="font-bold text-xs text-amber-600 uppercase">Vendor Risk Link</span>
                  <h3 className="font-bold text-sm text-foreground mt-1">VR-2026-003</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Single source dependency on Siemens conveyor geared motor spares.
                  </p>
                  <span className="text-[10px] text-amber-600 font-bold block mt-2">
                    Status: Monitoring (Score 15)
                  </span>
                </Card>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 7: COMMUNICATIONS & NOTIFICATIONS
            ========================================================================= */}
        {activeTab === "communications" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="border-b border-border/60 pb-3 mb-4">
                <h2 className="text-base font-bold text-foreground">
                  Incident Communications & Escalation Log (Section 10 & 29)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Stakeholder broadcasts, customer advisories, internal escalation chains, and executive bulletins.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {alertsList.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg border border-border/60 bg-muted/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center font-bold text-white shrink-0",
                          alert.severity === "Critical"
                            ? "bg-red-500"
                            : alert.severity === "Warning"
                              ? "bg-amber-500"
                              : "bg-blue-500",
                        )}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-foreground block text-sm">
                          {alert.title}
                        </span>
                        <span className="text-muted-foreground text-[11px]">
                          Category: {alert.type} • Reference: {alert.incidentId}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      {alert.timeAgo}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 8: DOCUMENTS & EVIDENCE
            ========================================================================= */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Evidence Repository & Document Chain of Custody (Section 13)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Photographs, SCADA data dumps, thermal imaging, and metallurgical lab test dockets.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold"
                  onClick={() => {
                    toast({
                      title: "Upload Evidence",
                      description: "Opening secure cryptographic evidence vault...",
                    });
                  }}
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Artifact
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border/60">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border/60 text-muted-foreground text-left">
                      <th className="py-2.5 px-3 font-semibold">Evidence ID</th>
                      <th className="py-2.5 px-3 font-semibold">Document Title</th>
                      <th className="py-2.5 px-3 font-semibold">Evidence Type</th>
                      <th className="py-2.5 px-3 font-semibold">Source</th>
                      <th className="py-2.5 px-3 font-semibold">Captured Date</th>
                      <th className="py-2.5 px-3 font-semibold">File Size</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {evidenceList.map((ev) => (
                      <tr key={ev.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">
                          {ev.id}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">
                          {ev.title}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant="outline" className="text-[10px]">
                            {ev.type}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {ev.source}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">
                          {ev.capturedAt}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-foreground font-medium">
                          {ev.fileSize}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Badge
                            className={cn(
                              "text-[10px] font-bold",
                              ev.status === "Verified"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-amber-500/10 text-amber-600",
                            )}
                          >
                            {ev.status}
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
            TAB 9: TIMELINE
            ========================================================================= */}
        {activeTab === "timeline" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="border-b border-border/60 pb-3 mb-4">
                <h2 className="text-base font-bold text-foreground">
                  Incident Chronological Lifecycle Timeline (Section 8)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Immutable event timestamps from physical occurrence to final management verification.
                </p>
              </div>

              <div className="relative border-l-2 border-primary/30 ml-4 space-y-4 my-2">
                {timeline.map((item, idx) => (
                  <div key={item.id} className="relative pl-6">
                    <span
                      className={cn(
                        "absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background",
                        item.status === "Completed"
                          ? "bg-emerald-500"
                          : item.status === "In Progress"
                            ? "bg-amber-500"
                            : "bg-muted-foreground",
                      )}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs">
                      <div className="font-bold text-foreground text-sm">
                        {item.event}
                      </div>
                      <div className="font-mono text-muted-foreground text-[11px]">
                        {item.dateTime}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Owner: <strong className="text-foreground">{item.owner}</strong> • Remarks: {item.remarks}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 10: ANALYTICS & REPORTS
            ========================================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Incident Management Reports Suite (Section 43)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Automated MTTR dashboards, repeat incident detection, and safety compliance dossiers.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold"
                  onClick={handleExportCSV}
                >
                  <Download className="h-3.5 w-3.5" />
                  Export All Incidents (CSV)
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
                            description: "Compiling executive incident dossier...",
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
          DIALOG: EDIT INCIDENT RECORD
          ========================================================================= */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Edit Incident — {activeIncident.incidentNumber}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-2 text-xs">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs font-bold">Incident Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Incident Type</Label>
              <Select
                value={formData.type}
                onValueChange={(val: IncidentType) =>
                  setFormData({ ...formData, type: val })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operational">Operational</SelectItem>
                  <SelectItem value="Quality">Quality</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Department</Label>
              <Input
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Location</Label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Severity</Label>
              <Select
                value={formData.severity}
                onValueChange={(val: IncidentSeverity) =>
                  setFormData({ ...formData, severity: val })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S1 - Critical">S1 - Critical</SelectItem>
                  <SelectItem value="S2 - Major">S2 - Major</SelectItem>
                  <SelectItem value="S3 - Moderate">S3 - Moderate</SelectItem>
                  <SelectItem value="S4 - Minor">S4 - Minor</SelectItem>
                </SelectContent>
              </Select>
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
                onValueChange={(val: IncidentStatus) =>
                  setFormData({ ...formData, status: val })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reported">Reported</SelectItem>
                  <SelectItem value="Containment">Containment</SelectItem>
                  <SelectItem value="Investigating">Investigating</SelectItem>
                  <SelectItem value="RCA In Progress">RCA In Progress</SelectItem>
                  <SelectItem value="Corrective Action">Corrective Action</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-1">
              <Label className="text-xs font-bold">Description</Label>
              <Textarea
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
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
              className="bg-primary text-primary-foreground font-semibold"
              onClick={() => handleSaveIncident(formData)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG: CREATE NEW INCIDENT
          ========================================================================= */}
      <Dialog open={isNewIncidentModalOpen} onOpenChange={setIsNewIncidentModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Report & Register New Incident
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-2 text-xs">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs font-bold">Incident Title *</Label>
              <Input
                placeholder="e.g. Robot arm weld fault at station 4"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Incident Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(val: IncidentType) =>
                  setFormData({ ...formData, type: val })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operational">Operational</SelectItem>
                  <SelectItem value="Quality">Quality</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Department *</Label>
              <Input
                placeholder="e.g. Production"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Location</Label>
              <Input
                placeholder="e.g. Plant 1 - Line 2"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Severity</Label>
              <Select
                value={formData.severity}
                onValueChange={(val: IncidentSeverity) =>
                  setFormData({ ...formData, severity: val })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S1 - Critical">S1 - Critical</SelectItem>
                  <SelectItem value="S2 - Major">S2 - Major</SelectItem>
                  <SelectItem value="S3 - Moderate">S3 - Moderate</SelectItem>
                  <SelectItem value="S4 - Minor">S4 - Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-1">
              <Label className="text-xs font-bold">Description</Label>
              <Textarea
                rows={2}
                placeholder="Describe what occurred, immediate observations, and preliminary response..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewIncidentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={handleCreateIncident}
            >
              Register Incident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default IncidentManagementPage;

