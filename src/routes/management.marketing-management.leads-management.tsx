import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Users,
  CheckCircle2,
  Filter,
  DollarSign,
  TrendingUp,
  Award,
  IndianRupee,
  Save,
  Copy,
  Rocket,
  ChevronDown,
  Edit3,
  Calendar,
  Layers,
  BarChart3,
  Search,
  Download,
  Plus,
  ArrowUpRight,
  Sparkles,
  Mail,
  Phone,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Zap,
  Target,
  FileText,
  Clock,
  Send,
  Building2,
  Briefcase,
  Globe,
  Sliders,
  Share2,
  Check,
  XCircle,
  Eye,
  RefreshCw,
  UserCheck,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/marketing-management/leads-management"
)({
  head: () => ({
    meta: [
      { title: "Lead Generation · Marketing Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Lead Generation Form (MAICW Classification) for omnichannel prospect capture, MQL scoring, SLA routing, sales handoff, and revenue attribution.",
      },
    ],
  }),
  component: LeadGenerationPage,
});

type MAICW = "M" | "A" | "I" | "C" | "W";

function MAICWBadge({ type }: { type: MAICW }) {
  const meta: Record<MAICW, { label: string; desc: string; bg: string; text: string }> = {
    M: { label: "M", desc: "Mandatory Field - Required for governance & qualification", bg: "bg-red-500/10 border-red-500/30", text: "text-red-600 dark:text-red-400" },
    A: { label: "A", desc: "Auto-generated / System Controlled Identifier", bg: "bg-slate-500/10 border-slate-500/30", text: "text-slate-600 dark:text-slate-400" },
    I: { label: "I", desc: "Information / Lookup Master Link", bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-600 dark:text-blue-400" },
    C: { label: "C", desc: "Calculated Formula / Derived Dynamic Metric", bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-600 dark:text-purple-400" },
    W: { label: "W", desc: "Workflow Stage Gate Controlled", bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
  };

  const item = meta[type];
  return (
    <span
      title={item.desc}
      className={cn(
        "inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[8.5px] font-bold cursor-help shrink-0 select-none ml-1",
        item.bg,
        item.text
      )}
    >
      {item.label}
    </span>
  );
}

const TABS = [
  { id: "pipeline", label: "Leads Pipeline" },
  { id: "lead-capture", label: "Lead Capture Form" },
  { id: "scoring-rules", label: "Scoring & SLA Rules" },
];

// Leads Trend Line Chart Data
const LEADS_TREND_DATA = [
  { month: "Oct 2026", total: 200, valid: 150, mql: 100, sql: 50 },
  { month: "Nov 2026", total: 300, valid: 220, mql: 150, sql: 80 },
  { month: "Dec 2026", total: 420, valid: 330, mql: 210, sql: 110 },
];

// Leads by Source Donut Data
const LEADS_BY_SOURCE_DATA = [
  { name: "Google Ads", value: 28, color: "#2563eb" },
  { name: "Website", value: 22, color: "#0d9488" },
  { name: "LinkedIn", value: 15, color: "#06b6d4" },
  { name: "Events", value: 12, color: "#9333ea" },
  { name: "Email", value: 8, color: "#db2777" },
  { name: "Partner", value: 7, color: "#ea580c" },
  { name: "Referral", value: 5, color: "#f59e0b" },
  { name: "Others", value: 3, color: "#64748b" },
];

export function LeadGenerationPage() {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // Form State
  const [formInfo, setFormInfo] = useState({
    leadGenName: "EV Charging Infra - Q4 2026 Leads",
    campaign: "Highway Charging Campaign",
    objective: "Generate qualified leads for public EV charging infrastructure solutions.",
    leadSource: "Google Ads",
    leadType: "B2B - Enterprise",
    targetLeads: "1,000",
    mqlTarget: "500",
    productService: "Autonomous W-EVSE",
    targetSegment: "Fleet Operators",
    sqlTarget: "100",
    opportunityTarget: "₹5,00,00,000",
    geography: ["India", "South Asia"],
    startDate: "01-Oct-2026",
    endDate: "31-Dec-2026",
    budget: "₹25,00,000",
    priority: "High",
    status: "Active",
  });

  const handleSave = () => {
    toast.success("Lead Generation LG-2026-001 saved successfully!", {
      description: "Omnichannel lead parameters and SLA rules updated.",
    });
  };

  const handleClone = () => {
    toast.info("Cloning LG-2026-001 into new draft record...");
  };

  return (
    <AppShell
      title="Lead Generation"
      breadcrumb="Management > Marketing Management > Lead Generation > Lead Generation Details"
      description="More Leads. Bigger Opportunities. A Cleaner Tomorrow."
      tabs={<MarketingManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Header Card Matching Screenshot Exactly */}
        <div className="card-soft p-4 sm:p-5 border-border/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Lead Generation
                </h1>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold rounded-full">
                  Active
                </Badge>
                <span className="text-sm font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20">
                  LG-2026-001
                </span>
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded border border-border">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                More Leads. Bigger Opportunities. A Cleaner Tomorrow.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="h-9 gap-1.5 text-xs border-border/80 shadow-xs"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClone}
                className="h-9 gap-1.5 text-xs border-border/80 shadow-xs"
              >
                <Copy className="h-3.5 w-3.5" />
                Clone
              </Button>
              <Button
                size="sm"
                onClick={() => setShowLaunchModal(true)}
                className="h-9 gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs"
              >
                <Rocket className="h-4 w-4" />
                Launch Campaign
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1 text-xs border-border/80 shadow-xs"
              >
                More Actions
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Sub-tabs horizontal bar matching screenshot */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none mt-4 pt-1 border-t border-border/50">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer select-none",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: LEADS PIPELINE */}
        {activeTab === "pipeline" && (
          <div className="space-y-4">
            {/* Pipeline Stage Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { stage: "Total Captured", count: "1,280", pct: "+18%", color: "text-foreground", bg: "bg-muted/30" },
                { stage: "Valid Contacts", count: "940", pct: "73.4%", color: "text-blue-600", bg: "bg-blue-500/10" },
                { stage: "MQL (Qualified)", count: "620", pct: "66.0%", color: "text-purple-600", bg: "bg-purple-500/10" },
                { stage: "SQL (Sales Ready)", count: "310", pct: "50.0%", color: "text-amber-600", bg: "bg-amber-500/10" },
                { stage: "Active Deals", count: "95", pct: "30.6%", color: "text-emerald-600", bg: "bg-emerald-500/10" },
                { stage: "Closed Won", count: "48", pct: "₹4.8 Cr", color: "text-primary font-bold", bg: "bg-primary/10" },
              ].map((c) => (
                <div key={c.stage} className="card-soft p-3.5 border-border/80 flex flex-col justify-between">
                  <div className="text-[11px] font-medium text-muted-foreground">{c.stage}</div>
                  <div className="mt-1.5 flex items-baseline justify-between">
                    <span className={cn("text-xl font-black font-mono", c.color)}>{c.count}</span>
                    <span className="text-[10px] font-semibold text-muted-foreground">{c.pct}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pipeline Table with Filter Bar */}
            <div className="card-soft p-5 border-border/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">Active Leads Qualification Pipeline</h3>
                  <Badge variant="outline" className="text-xs font-mono ml-2">1,280 Records</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setActiveTab("lead-capture")}
                    className="h-8 gap-1.5 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Lead Entry
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("scoring-rules")}
                    className="h-8 gap-1.5 text-xs border-border/80"
                  >
                    <Sliders className="h-3.5 w-3.5 text-primary" />
                    Scoring & SLA Rules
                  </Button>
                </div>
              </div>

              {/* Leads Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                      <th className="pb-2.5">Lead ID</th>
                      <th className="pb-2.5">Prospect & Designation</th>
                      <th className="pb-2.5">Company & Location</th>
                      <th className="pb-2.5">Lead Source</th>
                      <th className="pb-2.5 text-center">Intent Score</th>
                      <th className="pb-2.5 text-center">Stage</th>
                      <th className="pb-2.5">Assigned SDR</th>
                      <th className="pb-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {[
                      { id: "LD-2026-1082", name: "Ramesh Kumar", title: "VP Operations & Fleet", comp: "GreenFleet Logistics", loc: "Bangalore", source: "Google Ads", score: 85, scoreTier: "Hot", stage: "SQL", stageColor: "bg-purple-500/15 text-purple-600 border-purple-500/30", sdr: "Arun Kumar" },
                      { id: "LD-2026-1083", name: "Priya Sundaram", title: "Head of Infrastructure", comp: "UrbanInfra Transit", loc: "Chennai", source: "Trade Expo", score: 72, scoreTier: "Warm", stage: "MQL", stageColor: "bg-blue-500/15 text-blue-600 border-blue-500/30", sdr: "Priya S" },
                      { id: "LD-2026-1084", name: "Vikram Malhotra", title: "Fleet Depot Director", comp: "EV Transit Corp", loc: "Delhi NCR", source: "LinkedIn", score: 68, scoreTier: "Warm", stage: "MQL", stageColor: "bg-blue-500/15 text-blue-600 border-blue-500/30", sdr: "Vikram M" },
                      { id: "LD-2026-1085", name: "Anita Rao", title: "Chief Engineering Officer", comp: "Coimbatore Depot", loc: "Coimbatore", source: "GeM Portal", score: 91, scoreTier: "Hot", stage: "SQL", stageColor: "bg-purple-500/15 text-purple-600 border-purple-500/30", sdr: "Arun Kumar" },
                      { id: "LD-2026-1086", name: "Suresh Babu", title: "Procurement Lead", comp: "CleanRide Express", loc: "Mumbai", source: "Direct Inbound", score: 60, scoreTier: "Warm", stage: "Nurturing", stageColor: "bg-amber-500/15 text-amber-600 border-amber-500/30", sdr: "Divya R" },
                      { id: "LD-2026-1087", name: "Deepak Chawla", title: "Managing Director", comp: "Highway Corridor Express", loc: "Hyderabad", source: "Google Ads", score: 94, scoreTier: "Hot", stage: "SQL", stageColor: "bg-purple-500/15 text-purple-600 border-purple-500/30", sdr: "Arun Kumar" },
                      { id: "LD-2026-1088", name: "Meera Krishnan", title: "Asset Manager", comp: "Ascendas IT Park", loc: "Pune", source: "Website", score: 78, scoreTier: "Warm", stage: "MQL", stageColor: "bg-blue-500/15 text-blue-600 border-blue-500/30", sdr: "Vikram M" },
                      { id: "LD-2026-1089", name: "Karthik Raja", title: "Operations Supervisor", comp: "Express Last-Mile", loc: "Kochi", source: "Referral", score: 45, scoreTier: "Cold", stage: "New", stageColor: "bg-slate-500/15 text-slate-600 border-slate-500/30", sdr: "Priya S" },
                    ].map((row) => (
                      <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-mono font-bold text-primary">{row.id}</td>
                        <td className="py-3">
                          <div className="font-semibold text-foreground">{row.name}</div>
                          <div className="text-[11px] text-muted-foreground">{row.title}</div>
                        </td>
                        <td className="py-3">
                          <div className="font-medium text-foreground">{row.comp}</div>
                          <div className="text-[11px] text-muted-foreground">{row.loc}</div>
                        </td>
                        <td className="py-3 text-muted-foreground">{row.source}</td>
                        <td className="py-3 text-center">
                          <span className={cn(
                            "inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-full text-[11px]",
                            row.score >= 80 ? "bg-red-500/10 text-red-600 border border-red-500/30" : row.score >= 60 ? "bg-amber-500/10 text-amber-600 border border-amber-500/30" : "bg-slate-500/10 text-slate-600 border border-slate-500/30"
                          )}>
                            <Zap className="h-3 w-3" />
                            {row.score} · {row.scoreTier}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", row.stageColor)}>
                            {row.stage}
                          </span>
                        </td>
                        <td className="py-3 text-foreground font-medium">{row.sdr}</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                toast.success(`Lead ${row.id} assigned to ${row.sdr} for immediate follow-up!`);
                              }}
                              className="h-7 px-2 text-[11px] text-primary hover:bg-primary/10"
                            >
                              Route SDR
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveTab("lead-capture")}
                              className="h-7 px-2 text-[11px] border-border/70"
                            >
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEAD CAPTURE (Sections 8, 9, 10, 11, 12, 13) */}
        {activeTab === "lead-capture" && (
          <div className="px-6 space-y-5">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-2 border-b border-border/60">
                <div>
                  <h3 className="font-bold text-sm text-foreground">
                    Lead Capture Directory & Validation Engine (Sections 8, 10 & 11)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Omnichannel capture with real-time email verification, duplicate resolution, and enrichment.
                  </p>
                </div>
                <Button size="sm" onClick={() => setShowAddLeadModal(true)} className="h-8 text-xs gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Manual Lead Entry
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                      <th className="p-2.5 font-semibold">Lead ID</th>
                      <th className="p-2.5 font-semibold">Contact Name</th>
                      <th className="p-2.5 font-semibold">Organization</th>
                      <th className="p-2.5 font-semibold">Designation</th>
                      <th className="p-2.5 font-semibold">Source</th>
                      <th className="p-2.5 font-semibold">Score</th>
                      <th className="p-2.5 font-semibold">Validation</th>
                      <th className="p-2.5 font-semibold">Stage</th>
                      <th className="p-2.5 font-semibold">Assigned Owner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr className="hover:bg-muted/20">
                      <td className="p-2.5 font-mono text-primary font-bold">LD-2026-1082</td>
                      <td className="p-2.5 font-semibold text-foreground">Ramesh Krishnamurthy</td>
                      <td className="p-2.5 text-foreground">GreenFleet Logistics Pvt Ltd</td>
                      <td className="p-2.5 text-muted-foreground">VP Fleet Operations</td>
                      <td className="p-2.5">Google Ads</td>
                      <td className="p-2.5 font-bold text-red-600">85 (Hot)</td>
                      <td className="p-2.5"><Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Valid & Enriched</Badge></td>
                      <td className="p-2.5"><span className="font-semibold text-primary">MQL</span></td>
                      <td className="p-2.5 text-muted-foreground">Arun Kumar</td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-2.5 font-mono text-primary font-bold">LD-2026-1083</td>
                      <td className="p-2.5 font-semibold text-foreground">Priya Sundaram</td>
                      <td className="p-2.5 text-foreground">UrbanInfra Real Estate</td>
                      <td className="p-2.5 text-muted-foreground">Facility Director</td>
                      <td className="p-2.5">Website Form</td>
                      <td className="p-2.5 font-bold text-emerald-600">72 (Warm)</td>
                      <td className="p-2.5"><Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Valid & Enriched</Badge></td>
                      <td className="p-2.5"><span className="font-semibold text-amber-600">Nurturing</span></td>
                      <td className="p-2.5 text-muted-foreground">Priya Sharma</td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-2.5 font-mono text-primary font-bold">LD-2026-1084</td>
                      <td className="p-2.5 font-semibold text-foreground">Vikram Menon</td>
                      <td className="p-2.5 text-foreground">EV Transit Hubs Ltd</td>
                      <td className="p-2.5 text-muted-foreground">CTO</td>
                      <td className="p-2.5">LinkedIn Ad</td>
                      <td className="p-2.5 font-bold text-emerald-600">68 (Warm)</td>
                      <td className="p-2.5"><Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Valid</Badge></td>
                      <td className="p-2.5"><span className="font-semibold text-amber-600">Nurturing</span></td>
                      <td className="p-2.5 text-muted-foreground">Karthik Raja</td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-2.5 font-mono text-primary font-bold">LD-2026-1085</td>
                      <td className="p-2.5 font-semibold text-foreground">Anita Radhakrishnan</td>
                      <td className="p-2.5 text-foreground">Coimbatore Smart City Corp</td>
                      <td className="p-2.5 text-muted-foreground">Superintending Engineer</td>
                      <td className="p-2.5">GeM Tender</td>
                      <td className="p-2.5 font-bold text-red-600">91 (High Intent)</td>
                      <td className="p-2.5"><Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Government Verified</Badge></td>
                      <td className="p-2.5"><span className="font-semibold text-blue-600">SQL Handoff</span></td>
                      <td className="p-2.5 text-muted-foreground">Govt Sales Desk</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Landing Page Management (Section 9) */}
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs">
              <h4 className="font-bold text-sm text-foreground mb-3 pb-2 border-b border-border/60">
                Landing Pages & Capture Performance (Section 9)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="font-bold text-foreground">/solutions/highway-charging</div>
                  <div className="text-muted-foreground text-[11px] mt-1">Visitors: 2,450 | Conversion: 24.2%</div>
                  <Badge className="mt-2 bg-emerald-500/10 text-emerald-600">Top Performer</Badge>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="font-bold text-foreground">/fleet/autonomous-depot</div>
                  <div className="text-muted-foreground text-[11px] mt-1">Visitors: 1,820 | Conversion: 21.5%</div>
                  <Badge className="mt-2 bg-blue-500/10 text-blue-600">High Intent</Badge>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="font-bold text-foreground">/commercial-re/charging-roi</div>
                  <div className="text-muted-foreground text-[11px] mt-1">Visitors: 1,150 | Conversion: 18.2%</div>
                  <Badge className="mt-2 bg-amber-500/10 text-amber-600">Active Campaign</Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCORING & SLA RULES */}
        {activeTab === "scoring-rules" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Scoring Dimensions (Section 14) */}
              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs">
                <h3 className="font-bold text-sm text-foreground mb-3 pb-2 border-b border-border/60">
                  Lead Scoring Model (Section 14)
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Score = Profile Fit (30) + Engagement (25) + Behaviour (20) + Intent (15) + Business Potential (10)
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-muted/30 flex justify-between">
                    <span>Target Industry Fit (Logistics / Transit Bus / RE)</span>
                    <span className="font-bold text-primary">+25 pts</span>
                  </div>
                  <div className="p-2 rounded bg-muted/30 flex justify-between">
                    <span>Fleet Size &gt; 50 Commercial Vehicles</span>
                    <span className="font-bold text-primary">+20 pts</span>
                  </div>
                  <div className="p-2 rounded bg-muted/30 flex justify-between">
                    <span>Demo Form Submission & Specification Request</span>
                    <span className="font-bold text-primary">+25 pts</span>
                  </div>
                  <div className="p-2 rounded bg-muted/30 flex justify-between">
                    <span>Budget &gt; ₹50 Lakh Approved for FY26</span>
                    <span className="font-bold text-primary">+20 pts</span>
                  </div>
                </div>
              </div>

              {/* BANT Qualification & Routing (Section 15 & 18) */}
              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs">
                <h3 className="font-bold text-sm text-foreground mb-3 pb-2 border-b border-border/60">
                  BANT Qualification & Routing Rules (Section 15 & 18)
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-foreground">Budget: </span>
                      <span className="text-muted-foreground">Capex allocation verified through quotation request</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-foreground">Authority: </span>
                      <span className="text-muted-foreground">Director / VP Procurement / C-level decision maker identified</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-foreground">Need: </span>
                      <span className="text-muted-foreground">Depot electrification requirement defined</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-foreground">Timeline: </span>
                      <span className="text-muted-foreground">Delivery needed within Q3-Q4 FY26</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Management (Section 20 & 43) */}
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs">
              <h3 className="font-bold text-sm text-foreground mb-3 pb-2 border-b border-border/60">
                Lead Response SLA Tracking & Escalation Rules (Section 20 & 43)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded bg-red-500/10 border border-red-500/20">
                  <div className="font-bold text-red-600">Critical Lead SLA</div>
                  <div className="text-foreground font-semibold mt-1">&lt; 15 Minutes</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Compliance: 98.2%</div>
                </div>
                <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20">
                  <div className="font-bold text-amber-600">High Lead SLA</div>
                  <div className="text-foreground font-semibold mt-1">&lt; 1 Hour</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Compliance: 95.4%</div>
                </div>
                <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
                  <div className="font-bold text-blue-600">Medium Lead SLA</div>
                  <div className="text-foreground font-semibold mt-1">&lt; 4 Hours</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Compliance: 96.1%</div>
                </div>
                <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <div className="font-bold text-emerald-600">Average Response Time</div>
                  <div className="text-foreground font-semibold mt-1">18.4 Minutes</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Across All Inbounds</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Launch Campaign Modal */}
        {showLaunchModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl shadow-lg max-w-md w-full p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground">
                  Launch Lead Generation Campaign
                </h3>
                <button
                  onClick={() => setShowLaunchModal(false)}
                  className="text-muted-foreground hover:text-foreground text-sm font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium">Campaign Name</label>
                  <input
                    type="text"
                    defaultValue="Highway Charging Campaign"
                    className="mt-1 w-full rounded border border-border bg-background px-3 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground font-medium">Channels to Activate</label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> Google Search Ads</label>
                    <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> LinkedIn Sponsored</label>
                    <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> Email Outreach</label>
                    <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> GeM Portal Radar</label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                <Button variant="outline" size="sm" onClick={() => setShowLaunchModal(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowLaunchModal(false);
                    toast.success("Campaign launched successfully!", {
                      description: "Lead capture channels and routing webhooks activated.",
                    });
                  }}
                >
                  Confirm & Launch
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Manual Lead Entry Modal */}
        {showAddLeadModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl shadow-lg max-w-md w-full p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground">
                  New Prospect Lead Entry
                </h3>
                <button
                  onClick={() => setShowAddLeadModal(false)}
                  className="text-muted-foreground hover:text-foreground text-sm font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium">Contact Full Name *</label>
                  <input type="text" placeholder="e.g. Rahul Sharma" className="mt-1 w-full rounded border border-border bg-background px-3 py-1.5" />
                </div>
                <div>
                  <label className="text-muted-foreground font-medium">Company Name *</label>
                  <input type="text" placeholder="e.g. Apex Fleet Mobility" className="mt-1 w-full rounded border border-border bg-background px-3 py-1.5" />
                </div>
                <div>
                  <label className="text-muted-foreground font-medium">Work Email *</label>
                  <input type="email" placeholder="e.g. rahul@apexfleet.in" className="mt-1 w-full rounded border border-border bg-background px-3 py-1.5" />
                </div>
                <div>
                  <label className="text-muted-foreground font-medium">Lead Source</label>
                  <select className="mt-1 w-full rounded border border-border bg-background px-3 py-1.5">
                    <option>Direct Inbound</option>
                    <option>Google Ads</option>
                    <option>LinkedIn</option>
                    <option>Trade Show</option>
                    <option>GeM / Tender</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                <Button variant="outline" size="sm" onClick={() => setShowAddLeadModal(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowAddLeadModal(false);
                    toast.success("Lead created successfully!", {
                      description: "Assigned ID LD-2026-1086 with initial score 65.",
                    });
                  }}
                >
                  Save Lead
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
