import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Filter,
  FileText,
  Building,
  Check,
  RefreshCw,
  Plus,
  Scale,
} from "lucide-react";
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
  Legend,
} from "recharts";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { WidgetDefinition } from "../../types";
import {
  complianceOverviewOptions,
  type ComplianceOverviewData,
  type ComplianceObligationSummary,
  type ComplianceRemediationItem,
} from "../../data/complianceQueries";
import { openPageViewer } from "@/lib/pageActions";

/* ===========================================================================
   Panel 1: Compliance Health & Filing Trend Chart
   =========================================================================== */
export const ComplianceTrendPanel = memo(function ComplianceTrendPanel() {
  const { data, isLoading } = useQuery(complianceOverviewOptions);

  if (isLoading || !data) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[220px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Compliance Health & Timeliness Trend
          </CardTitle>
          <CardDescription className="text-xs">
            Monthly compliance index rating (%) vs 95% target baseline
          </CardDescription>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-semibold">
          95.4% Current
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="complianceScoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis domain={[80, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="complianceScore" name="Compliance Index (%)" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#complianceScoreGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t mt-1">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Compliance Index
          </span>
          <span>Target: 95.0% by Q4 FY26</span>
        </div>
      </CardContent>
    </Card>
  );
});

/* ===========================================================================
   Panel 2: Domain Distribution Donut
   =========================================================================== */
export const ComplianceDomainPanel = memo(function ComplianceDomainPanel() {
  const { data, isLoading } = useQuery(complianceOverviewOptions);

  if (isLoading || !data) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[220px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Compliance Domain Distribution
          </CardTitle>
          <CardDescription className="text-xs">
            Breakdown across statutory, ISO, safety, and licenses
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4 flex flex-col justify-between">
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.domainDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="count"
              >
                {data.domainDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(val: any, name: any, item: any) => [`${val} items (${item.payload.percentage}%)`, name]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs pt-2 border-t">
          {data.domainDistribution.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 truncate">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
              </span>
              <span className="font-semibold text-muted-foreground ml-1">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

/* ===========================================================================
   Panel 3: Key Obligations Register Table
   =========================================================================== */
export const ComplianceObligationsPanel = memo(function ComplianceObligationsPanel() {
  const { data, isLoading } = useQuery(complianceOverviewOptions);
  const [filter, setFilter] = useState<string>("All");

  if (isLoading || !data) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[260px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const items = data.keyObligations.filter(
    (item) => filter === "All" || item.category === filter
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Scale className="h-4 w-4 text-blue-500" />
            Key Statutory & Legal Obligations
          </CardTitle>
          <CardDescription className="text-xs">
            Priority compliance mandates under Factories, Companies, and Environmental Acts
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs border rounded-md px-2 py-1 bg-background text-foreground"
          >
            <option value="All">All Categories</option>
            <option value="Statutory">Statutory</option>
            <option value="Regulatory">Regulatory</option>
            <option value="EHS">EHS</option>
            <option value="ISO">ISO</option>
          </select>
          <Link
            to="/management/risk-management/regulatory-compliance"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-x-auto pb-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="pb-2 font-medium">Act & Provision</th>
              <th className="pb-2 font-medium">Frequency</th>
              <th className="pb-2 font-medium">Risk Level</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Next Due</th>
              <th className="pb-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                <td className="py-2.5 pr-2">
                  <div className="font-semibold text-foreground truncate max-w-[200px]">
                    {item.actTitle}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                    {item.section}
                  </div>
                </td>
                <td className="py-2.5 pr-2 text-muted-foreground">{item.frequency}</td>
                <td className="py-2.5 pr-2">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold ${
                      item.riskLevel === "Critical"
                        ? "bg-red-500/10 text-red-600 border-red-500/20"
                        : item.riskLevel === "High"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    }`}
                  >
                    {item.riskLevel}
                  </Badge>
                </td>
                <td className="py-2.5 pr-2">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold ${
                      item.status === "Compliant"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : item.status === "In Review"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </td>
                <td className="py-2.5 pr-2 text-muted-foreground text-[11px]">
                  {item.nextDueDate}
                </td>
                <td className="py-2.5 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary"
                    onClick={(e) => openPageViewer(`Viewing documentation for ${item.id} - ${item.actTitle}`, e.currentTarget)}
                  >
                    Verify
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
});

/* ===========================================================================
   Panel 4: Upcoming Statutory Filings & Deadlines
   =========================================================================== */
export const ComplianceFilingsPanel = memo(function ComplianceFilingsPanel() {
  const { data, isLoading } = useQuery(complianceOverviewOptions);

  if (isLoading || !data) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[240px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-500" />
            Statutory Filings Calendar
          </CardTitle>
          <CardDescription className="text-xs">
            Upcoming regulatory returns, PCB filings, and inspection deadlines
          </CardDescription>
        </div>
        <Link
          to="/management/risk-management/compliance-reporting"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          All Filings <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5 pb-4">
        {data.upcomingFilings.map((filing) => {
          const badgeStyles =
            filing.status === "Submitted"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : filing.status === "In Preparation"
              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
              : filing.status === "Pending Review"
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";

          return (
            <div
              key={filing.id}
              className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <div
                  className="font-semibold text-xs text-foreground truncate"
                  title={filing.filingName}
                >
                  {filing.filingName}
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 min-w-0">
                  <span className="truncate max-w-[150px] sm:max-w-[200px]" title={filing.authority}>
                    {filing.authority}
                  </span>
                  <span className="shrink-0 text-muted-foreground/50">•</span>
                  <span className="shrink-0 whitespace-nowrap font-medium text-foreground/80">
                    Due: {filing.dueDate}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-semibold shrink-0 justify-center text-center px-2 py-0.5 w-[96px]",
                    badgeStyles
                  )}
                >
                  {filing.status}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-2.5 shrink-0 font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  onClick={(e) => openPageViewer(`Opening filing docket for ${filing.id}`, e.currentTarget)}
                >
                  Manage
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
});

/* ===========================================================================
   Panel 5: Remediation Actions Tracker
   =========================================================================== */
export const ComplianceRemediationPanel = memo(function ComplianceRemediationPanel() {
  const { data, isLoading } = useQuery(complianceOverviewOptions);
  const [actions, setActions] = useState<ComplianceRemediationItem[]>([]);

  // Initialize or synchronize local state
  if (data && actions.length === 0) {
    setActions(data.remediationActions);
  }

  const toggleStatus = (id: string) => {
    setActions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === "Resolved" ? "In Progress" : "Resolved";
          toast.success(`Action ${item.id} status updated to: ${nextStatus}`);
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  if (isLoading || !data) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[240px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-500" />
            Compliance Gap Remediation
          </CardTitle>
          <CardDescription className="text-xs">
            Corrective actions assigned to mitigate audit findings and gap assessments
          </CardDescription>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1"
          onClick={() => {
            const newId = `ACT-CMP-0${actions.length + 1}`;
            setActions((prev) => [
              {
                id: newId,
                title: "New EHS ventilation audit corrective action",
                source: "EHS Internal Audit",
                priority: "Medium",
                owner: "Plant Lead",
                dueDate: "15-Nov-2026",
                status: "Open",
              },
              ...prev,
            ]);
            toast.success("New corrective action created");
          }}
        >
          <Plus className="h-3.5 w-3.5" /> Add Action
        </Button>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 pb-4">
        {actions.map((act) => (
          <div
            key={act.id}
            className="flex items-center justify-between gap-3 p-2 rounded-lg border border-border/50 bg-background hover:bg-muted/20 transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <button
                onClick={() => toggleStatus(act.id)}
                className={cn(
                  "h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors cursor-pointer",
                  act.status === "Resolved"
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-muted-foreground/40 hover:border-emerald-500"
                )}
                title="Toggle resolution status"
              >
                {act.status === "Resolved" && <Check className="h-3 w-3" />}
              </button>
              <div className="min-w-0 flex-1 space-y-0.5">
                <div
                  className={cn(
                    "text-xs font-semibold truncate",
                    act.status === "Resolved" ? "line-through text-muted-foreground" : "text-foreground"
                  )}
                  title={act.title}
                >
                  {act.title}
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 min-w-0">
                  <span className="truncate max-w-[130px]">{act.owner}</span>
                  <span className="shrink-0 text-muted-foreground/50">•</span>
                  <span className="shrink-0 whitespace-nowrap">Due: {act.dueDate}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-semibold shrink-0 justify-center text-center px-2 py-0.5 w-[75px]",
                  act.priority === "Critical"
                    ? "bg-red-500/10 text-red-600 border-red-500/20"
                    : act.priority === "High"
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                )}
              >
                {act.priority}
              </Badge>
              <span
                className={cn(
                  "text-[11px] font-semibold shrink-0 w-[70px] text-right",
                  act.status === "Resolved"
                    ? "text-emerald-600"
                    : act.status === "In Progress"
                    ? "text-blue-600"
                    : "text-amber-600"
                )}
              >
                {act.status}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
});

/* ===========================================================================
   Panel 6: AI Regulatory Intelligence & Advisory Feed
   =========================================================================== */
export const ComplianceAiInsightsPanel = memo(function ComplianceAiInsightsPanel() {
  const { data, isLoading } = useQuery(complianceOverviewOptions);

  if (isLoading || !data) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[240px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col border-primary/20 bg-gradient-to-b from-primary/[0.02] to-transparent">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Regulatory Intelligence & Updates
          </CardTitle>
          <CardDescription className="text-xs">
            Autonomous statutory gazette monitoring and compliance impact alerts
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
          Continuous Feed
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pb-4">
        {data.aiInsights.map((insight) => (
          <div
            key={insight.id}
            className="p-3 rounded-lg border border-border/60 bg-card hover:border-primary/40 transition-colors space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {insight.title}
              </div>
              <Badge
                variant="outline"
                className={`text-[9px] font-semibold ${
                  insight.impact === "High"
                    ? "bg-red-500/10 text-red-600 border-red-500/20"
                    : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                }`}
              >
                {insight.impact} Impact
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {insight.text}
            </p>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
              <span>Category: {insight.category}</span>
              <button
                className="text-primary hover:underline font-semibold flex items-center gap-0.5"
                onClick={(e) => openPageViewer(`Analyzing full statutory circular for "${insight.title}"`, e.currentTarget)}
              >
                View Circular <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
});

/* ===========================================================================
   Export Widget Definitions
   =========================================================================== */
export const COMPLIANCE_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "panel.compliance.health-trend",
    title: "Compliance Health & Filing Trend",
    description: "Monthly compliance score rating, statutory return timeliness, and target tracking.",
    category: "chart",
    tags: ["chart", "compliance", "trend"],
    roles: "all",
    sourceRoute: "/management/risk-management/compliance-overview",
    defaultSize: "lg",
    component: ComplianceTrendPanel,
  },
  {
    id: "panel.compliance.domain-distribution",
    title: "Compliance Domain Distribution",
    description: "Donut chart breakdown across statutory laws, ISO standards, safety, and licenses.",
    category: "chart",
    tags: ["chart", "compliance", "distribution"],
    roles: "all",
    sourceRoute: "/management/risk-management/compliance-overview",
    defaultSize: "md",
    component: ComplianceDomainPanel,
  },
  {
    id: "panel.compliance.obligations-matrix",
    title: "Statutory & Legal Obligations Register",
    description: "Active legal obligations, frequency, risk ratings, compliance status, and verification actions.",
    category: "table",
    tags: ["table", "compliance", "obligations"],
    roles: "all",
    sourceRoute: "/management/risk-management/regulatory-compliance",
    defaultSize: "lg",
    component: ComplianceObligationsPanel,
  },
  {
    id: "panel.compliance.filings-deadlines",
    title: "Statutory Filings Calendar",
    description: "Upcoming returns, state board submissions, and license renewal timeline.",
    category: "table",
    tags: ["table", "compliance", "filings"],
    roles: "all",
    sourceRoute: "/management/risk-management/compliance-reporting",
    defaultSize: "md",
    component: ComplianceFilingsPanel,
  },
  {
    id: "panel.compliance.remediation-actions",
    title: "Compliance Gap Remediation Tracker",
    description: "Actionable corrective actions and non-conformance mitigations with status toggles.",
    category: "table",
    tags: ["table", "compliance", "remediation"],
    roles: "all",
    sourceRoute: "/management/risk-management/internal-compliance",
    defaultSize: "md",
    component: ComplianceRemediationPanel,
  },
  {
    id: "panel.compliance.ai-intelligence",
    title: "AI Regulatory Intelligence & Updates",
    description: "Autonomous gazette circular scanning and statutory impact analysis feed.",
    category: "ai",
    tags: ["ai", "compliance", "insights"],
    roles: "all",
    sourceRoute: "/management/risk-management/compliance-overview",
    defaultSize: "md",
    component: ComplianceAiInsightsPanel,
  },
];
