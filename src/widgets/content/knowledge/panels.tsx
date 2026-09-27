import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  Info,
  Layers,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import type { WidgetContentProps, WidgetDefinition } from "../../types";
import {
  knowledgeOverviewOptions,
  type KnowledgeOverviewData,
} from "../../data/knowledgeQueries";

/* ===========================================================================
   1. Knowledge Base Growth & Utilization Trend
   =========================================================================== */
export const KnowledgeGrowthTrendWidget = memo(function KnowledgeGrowthTrendWidget() {
  const { data, isLoading } = useQuery(knowledgeOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  return (
    <div className="card-soft p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground">
            Knowledge Base Growth & Utilization Trend
          </h3>
          <span title="Monthly publishing volume vs queries and verification rate">
            <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
          </span>
        </div>

        {/* Legend matching Screenshot */}
        <div className="flex items-center gap-4 text-xs font-semibold flex-wrap">
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1e3a8a] inline-block" />
            Published Documents
          </span>
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444] inline-block" />
            Views / Queries
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="h-2.5 w-4 rounded-full bg-emerald-500 inline-block" />
            Verification Rate (%)
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.6)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              fontSize={12}
              stroke="#64748b"
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="#64748b"
              tickFormatter={(v) => `${v}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="#10b981"
              domain={[70, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card, #ffffff)",
                borderRadius: "12px",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                fontSize: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="published"
              name="Published Documents"
              fill="#1e3a8a"
              radius={[4, 4, 0, 0]}
              barSize={18}
            />
            <Bar
              yAxisId="left"
              dataKey="views"
              name="Views & Queries"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              barSize={18}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rate"
              name="Verification Rate (%)"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

/* ===========================================================================
   2. Knowledge Health Summary (YTD)
   =========================================================================== */
export const KnowledgeHealthSummaryWidget = memo(function KnowledgeHealthSummaryWidget() {
  const { data, isLoading } = useQuery(knowledgeOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  const hs = data.healthSummary;

  return (
    <div className="card-soft flex flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">
              Knowledge Health Summary (YTD)
            </h3>
            <span title="Year-to-date compliance and repository integrity summary">
              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
            </span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">YTD Ledger</span>
        </div>

        <div className="mt-2 divide-y divide-border/60 text-xs font-medium">
          <div className="flex items-center justify-between py-2.5">
            <span className="text-muted-foreground">Verified Controlled SOPs</span>
            <span className="text-sm font-bold text-emerald-600">{hs.verifiedSops}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-muted-foreground">Pending Review Audits</span>
            <span className="text-sm font-bold text-red-600">{hs.pendingAudits}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-muted-foreground">Archived / Deprecated Docs</span>
            <span className="text-sm font-bold text-red-600">{hs.archivedDocs}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-muted-foreground">Active Knowledge Contributors</span>
            <span className="text-sm font-bold text-blue-600">{hs.activeAuthors}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-muted-foreground">Employee Training Completion</span>
            <span className="text-sm font-bold text-emerald-600">{hs.trainingCompletion}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-muted-foreground">ISO 9001 Conformance Score</span>
            <span className="text-sm font-bold text-emerald-600">{hs.iso9001Score}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5">
        <div>
          <span className="block text-[11px] text-muted-foreground">Search Retrieval Latency</span>
          <span className="font-display text-xl font-bold text-foreground tabular">
            {hs.avgAccessLatency} avg
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-600">
          <ArrowUpRight className="h-3 w-3" /> Audit Ready
        </span>
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Operations Ledger — Recent Controlled Document Revisions
   =========================================================================== */
export const KnowledgeOperationsLedgerWidget = memo(function KnowledgeOperationsLedgerWidget() {
  const { data, isLoading } = useQuery(knowledgeOverviewOptions);
  const [filter, setFilter] = useState("");

  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  const filtered = data.operationsLedger.filter(
    (item) =>
      item.title.toLowerCase().includes(filter.toLowerCase()) ||
      item.documentNumber.toLowerCase().includes(filter.toLowerCase()) ||
      item.department.toLowerCase().includes(filter.toLowerCase()) ||
      item.author.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="card-soft p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <h3 className="font-display text-[15px] font-semibold text-foreground flex items-center gap-1.5">
            <span>Knowledge Operations & Repository Ledger</span>
            <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time audit log of active SOPs, technical specifications, and controlled template revisions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ledger..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-8 rounded-lg border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <Link
            to="/management/knowledge-management/document-repository"
            className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span>View All</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/60 text-muted-foreground font-semibold">
              <th className="py-2.5 pr-3">Doc #</th>
              <th className="py-2.5 pr-3">Document Title</th>
              <th className="py-2.5 pr-3">Version</th>
              <th className="py-2.5 pr-3">Department</th>
              <th className="py-2.5 pr-3">Author</th>
              <th className="py-2.5 pr-3">Status</th>
              <th className="py-2.5">Effective</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filtered.map((doc) => (
              <tr key={doc.id} className="hover:bg-muted/40 transition-colors">
                <td className="py-2.5 pr-3 font-mono font-bold text-primary">
                  {doc.documentNumber}
                </td>
                <td className="py-2.5 pr-3 font-medium text-foreground max-w-[220px] truncate" title={doc.title}>
                  {doc.title}
                </td>
                <td className="py-2.5 pr-3 font-mono text-muted-foreground">
                  {doc.version}
                </td>
                <td className="py-2.5 pr-3 text-muted-foreground">
                  {doc.department}
                </td>
                <td className="py-2.5 pr-3 text-foreground font-medium">
                  {doc.author}
                </td>
                <td className="py-2.5 pr-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      doc.status === "Published"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : doc.status === "Approved"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {doc.status}
                  </span>
                </td>
                <td className="py-2.5 text-muted-foreground font-mono">
                  {doc.effectiveDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. System Alerts — Knowledge & SOP Compliance Alerts
   =========================================================================== */
export const KnowledgeAlertsWidget = memo(function KnowledgeAlertsWidget() {
  const { data, isLoading } = useQuery(knowledgeOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  return (
    <div className="card-soft flex flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-1.5">
            <h3 className="font-display text-[15px] font-semibold text-foreground">
              Knowledge & SOP Alerts
            </h3>
            <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
          </div>
          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-bold text-red-600">
            {data.alerts.length} Active
          </span>
        </div>

        <div className="mt-3 space-y-3">
          {data.alerts.map((alt) => (
            <div
              key={alt.id}
              className={`rounded-xl border p-3 text-xs transition-all ${
                alt.severity === "Critical"
                  ? "border-red-500/30 bg-red-500/5"
                  : alt.severity === "Warning"
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-blue-500/30 bg-blue-500/5"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-foreground leading-snug">
                  {alt.title}
                </span>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    alt.severity === "Critical"
                      ? "bg-red-500/20 text-red-600"
                      : alt.severity === "Warning"
                        ? "bg-amber-500/20 text-amber-600"
                        : "bg-blue-500/20 text-blue-600"
                  }`}
                >
                  {alt.severity}
                </span>
              </div>
              <p className="mt-1 text-[11.5px] text-muted-foreground leading-relaxed">
                {alt.description}
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{alt.timestamp}</span>
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline cursor-pointer"
                >
                  {alt.actionLabel} &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex justify-end">
        <Link
          to="/management/knowledge-management/reports"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>View Audit Compliance Reports</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   5. AI Knowledge Intelligence Center
   =========================================================================== */
export const KnowledgeAiIntelligenceWidget = memo(function KnowledgeAiIntelligenceWidget() {
  const { data, isLoading } = useQuery(knowledgeOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[220px] rounded-xl" />;

  return (
    <div className="card-soft relative overflow-hidden p-5">
      <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <BrainCircuit className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <span>Enterprise Knowledge Intelligence & Copilot</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                Live Insights
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Automated deduplication, ISO 9001 documentation gap analysis, and cross-department semantic search graph.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Run Deep Audit Scan</span>
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {data.aiInsights.map((insight) => (
          <div
            key={insight.id}
            className="rounded-xl border border-border/70 bg-card/60 p-3.5 flex flex-col justify-between hover:border-primary/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-bold text-primary">{insight.tag}</span>
                <span className="font-semibold text-emerald-600">{insight.impact}</span>
              </div>
              <h4 className="text-xs font-bold text-foreground leading-snug">
                {insight.title}
              </h4>
              <p className="mt-1 text-[11.5px] text-muted-foreground leading-relaxed">
                {insight.detail}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between">
              <span className="text-[10.5px] text-muted-foreground">Automated Recommendation</span>
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Apply &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ===========================================================================
   Widget Definition Exports
   =========================================================================== */
export const KNOWLEDGE_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.knowledge.growth-trend",
    title: "Knowledge Growth & Utilization Trend",
    description: "Composed monthly publishing volume vs query consumption and verification rate.",
    category: "chart",
    tags: ["chart", "compliance"],
    icon: FileText,
    defaultSize: "xl",
    keywords: ["knowledge", "growth", "trend", "documents", "queries", "views"],
    roles: "all",
    component: KnowledgeGrowthTrendWidget,
  },
  {
    id: "list.knowledge.health-summary",
    title: "Knowledge Health Summary (YTD)",
    description: "Year-to-date compliance ledger, active authors, verified SOP ratio, and ISO 9001 score.",
    category: "list",
    tags: ["list", "compliance"],
    icon: CheckCircle2,
    defaultSize: "md",
    keywords: ["health", "summary", "ytd", "ledger", "sop", "iso9001"],
    roles: "all",
    component: KnowledgeHealthSummaryWidget,
  },
  {
    id: "table.knowledge.operations-ledger",
    title: "Knowledge Operations Ledger",
    description: "Real-time audit ledger of controlled documents, SOP approvals, and revision history.",
    category: "table",
    tags: ["table", "compliance"],
    icon: BookOpen,
    defaultSize: "xl",
    keywords: ["operations", "ledger", "documents", "revisions", "approvals"],
    roles: "all",
    component: KnowledgeOperationsLedgerWidget,
  },
  {
    id: "insight.knowledge.audit-alerts",
    title: "Knowledge & Compliance Alerts",
    description: "Urgent SOP review deadlines, certification alerts, and pending QA signoffs.",
    category: "insight",
    tags: ["insight", "compliance"],
    icon: ShieldAlert,
    defaultSize: "md",
    keywords: ["alerts", "sop", "compliance", "audits", "deadlines"],
    roles: "all",
    component: KnowledgeAlertsWidget,
  },
  {
    id: "ai.knowledge.intelligence",
    title: "Knowledge Intelligence Center",
    description: "AI-powered document deduplication, semantic search graph, and ISO 9001 gap insights.",
    category: "ai",
    tags: ["ai", "compliance"],
    icon: BrainCircuit,
    defaultSize: "full",
    keywords: ["ai", "intelligence", "copilot", "semantic", "deduplication"],
    roles: "all",
    component: KnowledgeAiIntelligenceWidget,
  },
];
