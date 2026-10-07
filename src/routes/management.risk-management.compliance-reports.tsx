import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  Download,
  Printer,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Search,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  Share2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Eye,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/erp/AppShell";
import { ComplianceTabBar } from "@/components/erp/ComplianceTabBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export interface ComplianceReportDefinition {
  id: string;
  name: string;
  category: "Statutory & Regulatory" | "ISO Standards" | "Licenses & Permits" | "Internal Policies" | "Audit & CAPA";
  frequency: "Monthly" | "Quarterly" | "Bi-Annual" | "Annual" | "On-Demand";
  owner: string;
  complianceRate: number;
  status: "Compliant" | "In Review" | "Action Required";
  description: string;
  recordsCount: number;
  lastGenerated: string;
}

const COMPLIANCE_REPORTS_CATALOG: ComplianceReportDefinition[] = [
  {
    id: "REP-CMP-01",
    name: "Master Regulatory Compliance Register Audit",
    category: "Statutory & Regulatory",
    frequency: "Quarterly",
    owner: "Legal & Regulatory Counsel",
    complianceRate: 98.4,
    status: "Compliant",
    description: "Consolidated evaluation of all 56 statutory acts, central regulations, and state factory compliance.",
    recordsCount: 56,
    lastGenerated: "Today",
  },
  {
    id: "REP-CMP-02",
    name: "State Pollution Control Board (PCB) Consent Audit",
    category: "Statutory & Regulatory",
    frequency: "Annual",
    owner: "EHS Manager",
    complianceRate: 100,
    status: "Compliant",
    description: "Emissions stack monitoring, effluent treatment standards, and zero liquid discharge validation.",
    recordsCount: 14,
    lastGenerated: "Yesterday",
  },
  {
    id: "REP-CMP-03",
    name: "Factories Act Statutory Health & Safety Register",
    category: "Statutory & Regulatory",
    frequency: "Monthly",
    owner: "Plant Safety Director",
    complianceRate: 96.2,
    status: "Compliant",
    description: "Form 22 adherence, occupational health surveillance, machinery fencing, and accident log books.",
    recordsCount: 32,
    lastGenerated: "3 days ago",
  },
  {
    id: "REP-CMP-04",
    name: "ISO 9001:2015 Quality Management System Audit",
    category: "ISO Standards",
    frequency: "Bi-Annual",
    owner: "QA Lead",
    complianceRate: 98.0,
    status: "Compliant",
    description: "Clause 4-10 compliance matrix, internal quality audit observations, and calibration control records.",
    recordsCount: 48,
    lastGenerated: "Last week",
  },
  {
    id: "REP-CMP-05",
    name: "ISO 14001:2015 Environmental Aspects & Impacts Report",
    category: "ISO Standards",
    frequency: "Annual",
    owner: "EHS Engineer",
    complianceRate: 94.5,
    status: "In Review",
    description: "Environmental aspect registers, solar captive generation offset metrics, and waste recycling rates.",
    recordsCount: 22,
    lastGenerated: "5 days ago",
  },
  {
    id: "REP-CMP-06",
    name: "ISO 45001:2018 Occupational Health & Safety Report",
    category: "ISO Standards",
    frequency: "Quarterly",
    owner: "Safety Marshal",
    complianceRate: 95.8,
    status: "Compliant",
    description: "Hazard identification, risk assessment (HIRA), PPE compliance audits, and emergency drill records.",
    recordsCount: 38,
    lastGenerated: "Yesterday",
  },
  {
    id: "REP-CMP-07",
    name: "ISO 27001:2022 Information Security & DPDPA Review",
    category: "ISO Standards",
    frequency: "Quarterly",
    owner: "CISO",
    complianceRate: 91.2,
    status: "Action Required",
    description: "Access management audits, data fiduciary safeguards, encryption keys, and penetration test findings.",
    recordsCount: 26,
    lastGenerated: "4 days ago",
  },
  {
    id: "REP-CMP-08",
    name: "Corporate Operating Licenses & Permits Renewal Forecast",
    category: "Licenses & Permits",
    frequency: "Monthly",
    owner: "Legal Operations",
    complianceRate: 100,
    status: "Compliant",
    description: "Active license roster, expiration dates within 90 days, renewal fee schedules, and pending inspections.",
    recordsCount: 28,
    lastGenerated: "Today",
  },
  {
    id: "REP-CMP-09",
    name: "Hazardous Materials & Fire Safety NOC Compliance",
    category: "Licenses & Permits",
    frequency: "Bi-Annual",
    owner: "Facility Manager",
    complianceRate: 97.4,
    status: "Compliant",
    description: "Fire hydrant pressure logs, sprinkler inspections, explosive substance storage, and state NOCs.",
    recordsCount: 18,
    lastGenerated: "2 weeks ago",
  },
  {
    id: "REP-CMP-10",
    name: "Internal Policy Adherence & Employee Code of Conduct",
    category: "Internal Policies",
    frequency: "Quarterly",
    owner: "Chief Compliance Officer",
    complianceRate: 93.6,
    status: "In Review",
    description: "Anti-bribery (ABAC), POSH committee reviews, whistleblower submissions, and conflict of interest filings.",
    recordsCount: 64,
    lastGenerated: "1 week ago",
  },
  {
    id: "REP-CMP-11",
    name: "Vendor & Supplier ESG & Statutory Due Diligence",
    category: "Internal Policies",
    frequency: "Bi-Annual",
    owner: "Procurement Compliance",
    complianceRate: 89.5,
    status: "Action Required",
    description: "Tier-1 supplier statutory labor compliance, minimum wage declarations, and green procurement audits.",
    recordsCount: 42,
    lastGenerated: "6 days ago",
  },
  {
    id: "REP-CMP-12",
    name: "Comprehensive Audit Finding & CAPA Resolution Tracker",
    category: "Audit & CAPA",
    frequency: "Monthly",
    owner: "Audit Committee",
    complianceRate: 96.0,
    status: "Compliant",
    description: "Root cause analyses, containment effectiveness, verification sign-offs, and overdue action alerts.",
    recordsCount: 35,
    lastGenerated: "Today",
  },
];

export const Route = createFileRoute("/management/risk-management/compliance-reports")({
  head: () => ({
    meta: [
      { title: "Compliance Reports · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive statutory compliance reports, ISO standards audits, license tracker, and controlled regulatory documentation.",
      },
    ],
  }),
  component: ComplianceReportsPage,
});

function ComplianceReportsPage() {
  const [selectedReportId, setSelectedReportId] = useState<string>("REP-CMP-01");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [scheduleFreq, setScheduleFreq] = useState("Weekly");

  const selectedReport =
    COMPLIANCE_REPORTS_CATALOG.find((r) => r.id === selectedReportId) ??
    COMPLIANCE_REPORTS_CATALOG[0];

  const filteredReports = COMPLIANCE_REPORTS_CATALOG.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "All" || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categories = [
    "All",
    "Statutory & Regulatory",
    "ISO Standards",
    "Licenses & Permits",
    "Internal Policies",
    "Audit & CAPA",
  ];

  const handleExportCSV = () => {
    const headers = ["Report ID", "Name", "Category", "Frequency", "Owner", "Compliance (%)", "Status", "Records"];
    const rows = filteredReports.map((r) => [
      `"${r.id}"`,
      `"${r.name}"`,
      `"${r.category}"`,
      `"${r.frequency}"`,
      `"${r.owner}"`,
      r.complianceRate,
      `"${r.status}"`,
      r.recordsCount,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Compliance_Reports_Export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Compliance Reports catalog exported successfully as CSV");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!shareEmail) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsShareModalOpen(false);
    toast.success(`Report package shared successfully with ${shareEmail}`);
    setShareEmail("");
  };

  const handleSchedule = () => {
    setIsScheduleModalOpen(false);
    toast.success(`Recurring report delivery scheduled: ${scheduleFreq}`);
  };

  return (
    <AppShell
      title="Compliance Reports"
      breadcrumb="Management > Compliance > Reports"
      description="Executive regulatory audit documentation, ISO standard certifications, and statutory filings register."
      tabs={<ComplianceTabBar />}
      hideScoreBanner={true}
    >
      <div className="space-y-6">
        {/* KPI Highlights Band */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Compliance Index</p>
                <h3 className="text-2xl font-bold text-foreground mt-0.5">95.4%</h3>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="h-3 w-3" /> Fully audit-compliant
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Statutory Filings</p>
                <h3 className="text-2xl font-bold text-foreground mt-0.5">100%</h3>
                <span className="text-[11px] font-semibold text-primary flex items-center gap-1 mt-0.5">
                  Zero overdue returns
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Calendar className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Active Licenses</p>
                <h3 className="text-2xl font-bold text-foreground mt-0.5">28 / 28</h3>
                <span className="text-[11px] font-semibold text-muted-foreground mt-0.5 block">
                  2 renewals due in 60d
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                <FileText className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">CAPA Resolution</p>
                <h3 className="text-2xl font-bold text-foreground mt-0.5">85.7%</h3>
                <span className="text-[11px] font-semibold text-teal-600 mt-0.5 block">
                  12 of 14 closed
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dual Mode View Tabs */}
        <Tabs defaultValue="report-catalog" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/60 pb-3">
            <TabsList className="bg-muted/60 p-1">
              <TabsTrigger value="report-catalog" className="text-xs font-semibold gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Compliance Reports Catalog (12 Reports)
              </TabsTrigger>
              <TabsTrigger value="executive-brief" className="text-xs font-semibold gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" />
                Executive Summary Brief
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="h-8 text-xs font-medium gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="h-8 text-xs font-medium gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </Button>
              <Button
                size="sm"
                onClick={() => setIsShareModalOpen(true)}
                className="h-8 text-xs font-medium gap-1.5"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Button>
            </div>
          </div>

          {/* TAB 1: Report Catalog */}
          <TabsContent value="report-catalog" className="space-y-4 pt-2">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search compliance reports by act, ISO clause, owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs h-9"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={categoryFilter === cat ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs px-2.5 rounded-full"
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((report) => (
                <Card
                  key={report.id}
                  className={`border transition-all cursor-pointer hover:border-primary/50 ${
                    selectedReportId === report.id
                      ? "border-primary bg-primary/[0.02] shadow-sm"
                      : "border-border/60 hover:shadow-sm"
                  }`}
                  onClick={() => setSelectedReportId(report.id)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold text-primary">
                        {report.id}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          report.status === "Compliant"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : report.status === "In Review"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-red-500/10 text-red-600 border-red-500/20"
                        }`}
                      >
                        {report.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-bold text-foreground mt-1 line-clamp-1">
                      {report.name}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2 mt-1">
                      {report.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-3">
                    <div className="flex items-center justify-between text-xs pt-2 border-t">
                      <span className="text-muted-foreground">Owner: {report.owner}</span>
                      <span className="font-semibold text-foreground">
                        {report.complianceRate}% Score
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Frequency: {report.frequency}</span>
                      <span>Records: {report.recordsCount}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs flex-1 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReportId(report.id);
                          setIsPreviewModalOpen(true);
                        }}
                      >
                        <Eye className="h-3 w-3" /> Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 text-xs flex-1 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success(`Generating fresh PDF for ${report.id}`);
                        }}
                      >
                        <Download className="h-3 w-3" /> Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 2: Executive Summary Brief */}
          <TabsContent value="executive-brief" className="space-y-6 pt-2">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Statutory Timeliness & Compliance Trend
                  </CardTitle>
                  <CardDescription className="text-xs">
                    6-month performance against statutory benchmarks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { month: "Apr", score: 89.2 },
                          { month: "May", score: 91.0 },
                          { month: "Jun", score: 92.8 },
                          { month: "Jul", score: 93.5 },
                          { month: "Aug", score: 94.6 },
                          { month: "Sep", score: 95.4 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
                        <RechartsTooltip />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#10B981"
                          strokeWidth={2}
                          fill="#10B981"
                          fillOpacity={0.15}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Obligations Status Distribution
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Compliance state across active mandates
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Fully Compliant", value: 48, color: "#10B981" },
                            { name: "Under Review", value: 5, color: "#3B82F6" },
                            { name: "Action Required", value: 3, color: "#EF4444" },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          dataKey="value"
                        >
                          <Cell fill="#10B981" />
                          <Cell fill="#3B82F6" />
                          <Cell fill="#EF4444" />
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center gap-4 text-xs mt-2">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Fully Compliant (86%)
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-blue-500" /> In Review (9%)
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-red-500" /> Action (5%)
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submodule Audit Status Table */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Compliance Module Audit Status Matrix
                </CardTitle>
                <CardDescription className="text-xs">
                  Readiness and verification state across all 9 compliance submodules
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto pb-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="pb-2 font-medium">Submodule</th>
                      <th className="pb-2 font-medium">Primary Focus</th>
                      <th className="pb-2 font-medium">Records</th>
                      <th className="pb-2 font-medium">Audit Readiness</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {[
                      { name: "Regulatory Compliance", focus: "Central & State Acts, MAICW Controls", count: 56, score: 98.4, status: "Compliant", link: "/management/risk-management/regulatory-compliance" },
                      { name: "Internal Compliance", focus: "Company Policies, Code of Conduct, SOPs", count: 42, score: 95.0, status: "Compliant", link: "/management/risk-management/internal-compliance" },
                      { name: "Licenses & Permits", focus: "Factory License, PCB, Fire NOC, Weights", count: 28, score: 100, status: "Compliant", link: "/management/risk-management/licenses" },
                      { name: "Certifications", focus: "Product Certifications (CE, UL, BIS, RoHS)", count: 24, score: 96.5, status: "Compliant", link: "/management/risk-management/certifications" },
                      { name: "ISO Compliance", focus: "ISO 9001, 14001, 45001, 27001 Clauses", count: 68, score: 97.2, status: "Compliant", link: "/management/risk-management/iso-compliance" },
                      { name: "Legal Register", focus: "Statutory Gazette Updates, Penalty Matrix", count: 34, score: 94.0, status: "In Review", link: "/management/risk-management/legal-register" },
                      { name: "Audit Compliance", focus: "Internal Audits, NCRs, CAPA Verification", count: 35, score: 96.0, status: "Compliant", link: "/management/risk-management/audit-compliance" },
                      { name: "Statutory Filings", focus: "Form 22, PCB Form IV, ROC Returns", count: 42, score: 97.5, status: "Compliant", link: "/management/risk-management/compliance-reporting" },
                    ].map((row) => (
                      <tr key={row.name} className="hover:bg-muted/30">
                        <td className="py-2.5 font-semibold text-foreground">{row.name}</td>
                        <td className="py-2.5 text-muted-foreground">{row.focus}</td>
                        <td className="py-2.5 text-muted-foreground">{row.count}</td>
                        <td className="py-2.5 font-semibold text-foreground">{row.score}%</td>
                        <td className="py-2.5">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              row.status === "Compliant"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            }`}
                          >
                            {row.status}
                          </Badge>
                        </td>
                        <td className="py-2.5 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-primary hover:underline"
                            onClick={() => toast.success(`Viewing live records for ${row.name}`)}
                          >
                            Inspect
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Report Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-xs font-mono text-primary">
              <span>{selectedReport.id}</span>
              <span>•</span>
              <span>{selectedReport.category}</span>
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              {selectedReport.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {selectedReport.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/40 border">
              <div>
                <span className="text-muted-foreground block text-[11px]">Compliance Rating</span>
                <span className="font-bold text-emerald-600 text-sm">{selectedReport.complianceRate}%</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Frequency</span>
                <span className="font-semibold text-foreground text-sm">{selectedReport.frequency}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Owner</span>
                <span className="font-semibold text-foreground text-sm">{selectedReport.owner}</span>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/60 px-3 py-2 font-semibold text-foreground border-b text-xs flex justify-between items-center">
                <span>Sample Audit Observations Sample</span>
                <Badge variant="outline" className="text-[10px]">Verified Clean</Badge>
              </div>
              <div className="p-3 space-y-2 text-muted-foreground">
                <div className="flex items-center justify-between border-b pb-1">
                  <span>1. Statutory Register Entry Verification</span>
                  <span className="text-emerald-600 font-semibold">Compliant ✓</span>
                </div>
                <div className="flex items-center justify-between border-b pb-1">
                  <span>2. Competent Authority Document Storage</span>
                  <span className="text-emerald-600 font-semibold">Verified ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>3. Periodicity of Inspection Records</span>
                  <span className="text-emerald-600 font-semibold">On Track ✓</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsPreviewModalOpen(false)}>
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsPreviewModalOpen(false);
                toast.success(`PDF generated for ${selectedReport.id}`);
              }}
            >
              <Download className="h-3.5 w-3.5 mr-1" /> Download Controlled PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Report Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Share Compliance Reports</DialogTitle>
            <DialogDescription className="text-xs">
              Distribute controlled compliance reports to auditors or board members.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">Recipient Email</label>
              <Input
                placeholder="e.g. auditor@tuv-sud.com, board@magnertia.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <label className="font-medium text-foreground block mb-1">Access Expiry</label>
              <Select defaultValue="7d">
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 Hours (Secure Link)</SelectItem>
                  <SelectItem value="7d">7 Days (Audit Window)</SelectItem>
                  <SelectItem value="30d">30 Days (Board Review)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsShareModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleShare}>
              Send Access Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

