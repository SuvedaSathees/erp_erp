import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Search,
  Sparkles,
  Layers,
  Activity,
  Calendar,
  Share2,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { MODULE_REPORT_CONFIGS } from "./moduleReportConfigs";
import { cn } from "@/lib/utils";

interface ModuleSummaryReportProps {
  moduleId: string;
}

export function ModuleSummaryReport({ moduleId }: ModuleSummaryReportProps) {
  const config = MODULE_REPORT_CONFIGS[moduleId];
  const [selectedRange, setSelectedRange] = useState("Q3 FY26 (Current)");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  if (!config) {
    return (
      <div className="p-8 text-center bg-card border rounded-xl">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold">Report Configuration Not Found</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          No executive report configuration exists for module id: <code>{moduleId}</code>
        </p>
      </div>
    );
  }

  const filteredSubmodules = useMemo(() => {
    return config.submodules.filter((sub) => {
      const matchesSearch =
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.keyMetric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        sub.status.toLowerCase().replace(/\s+/g, "-") === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [config.submodules, searchQuery, statusFilter]);

  const handleExportCsv = () => {
    const headers = ["Submodule", "Path", "Records", "Completion (%)", "Status", "Key Metric", "Owner", "Last Updated"];
    const rows = config.submodules.map((s) => [
      `"${s.name}"`,
      `"${s.path}"`,
      s.recordsCount,
      s.completionRate,
      `"${s.status}"`,
      `"${s.keyMetric}"`,
      `"${s.owner}"`,
      `"${s.lastUpdated}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${config.id}-executive-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Report exported successfully");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Report link copied to clipboard");
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      {/* Top Header Strip */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Layers className="h-3 w-3" />
              {config.areaGroup} Executive Suite
            </span>
            <span className="text-xs text-muted-foreground">• End-of-Module Summary</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <FileText className="h-7 w-7 text-primary" />
            {config.moduleName} Report
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Consolidated operational health, submodule progress, key performance indicators, and audit status.
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          <div className="flex items-center bg-card border rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground shadow-sm">
            <Calendar className="h-3.5 w-3.5 mr-2 text-primary" />
            <select
              value={selectedRange}
              onChange={(e) => {
                setSelectedRange(e.target.value);
                toast.info(`Updated report window to: ${e.target.value}`);
              }}
              className="bg-transparent text-foreground font-medium text-xs focus:outline-none cursor-pointer"
            >
              <option value="Q3 FY26 (Current)">Q3 FY26 (Current)</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Year-to-Date (YTD)">Year-to-Date (YTD)</option>
              <option value="Full Year FY25">Full Year FY25</option>
            </select>
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-card border hover:bg-muted text-foreground transition-colors shadow-sm cursor-pointer"
            title="Export CSV data"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            CSV
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-card border hover:bg-muted text-foreground transition-colors shadow-sm cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            Print / PDF
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
            title="Copy Report Link"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>
      </div>

      {/* Executive Brief Card */}
      <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/[0.07] via-card to-card p-4 sm:p-5 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="h-9 w-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Executive Synthesis & Narrative
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                Updated Live
              </span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed font-normal">
              {config.executiveBrief}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Executive KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {config.kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-xl border bg-card p-4 sm:p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/40 group"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-medium">
              <span>{kpi.label}</span>
              <div className="h-7 w-7 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <Activity className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {kpi.value}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs">
              {kpi.change && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded text-[11px]",
                    kpi.isPositive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                  )}
                >
                  {kpi.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {kpi.change}
                </span>
              )}
              {kpi.subtext && (
                <span className="text-muted-foreground text-[11px] truncate ml-1">{kpi.subtext}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Row: Trend Area Chart & Status Donut Chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend Area Chart (2 cols) */}
        <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">{config.trendTitle}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monthly actual delivery vs plan baseline trajectory
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-muted font-medium text-muted-foreground">
              6-Month Cadence
            </span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={config.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-${config.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name={config.trendMetricLabel}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#grad-${config.id})`}
                />
                {config.trendData[0]?.target && (
                  <Area
                    type="monotone"
                    dataKey="target"
                    name="Target Baseline"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    fill="transparent"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut (1 col) */}
        <div className="rounded-xl border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Operational Status Distribution</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Portfolio distribution across lifecycle stages
            </p>
          </div>
          <div className="h-[210px] w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={config.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {config.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
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
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/60">
            {config.statusDistribution.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground truncate">{item.name}:</span>
                <span className="font-bold text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submodule Breakdown Matrix */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-muted/20">
          <div>
            <h3 className="text-base font-bold text-foreground">Submodule Performance Matrix</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Detailed audit summary of every submodule under {config.moduleName}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search submodules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-card border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary w-44 sm:w-56"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-card border rounded-lg px-2.5 py-1.5 focus:outline-none text-muted-foreground cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="on-track">On Track</option>
              <option value="needs-attention">Needs Attention</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground font-semibold">
                <th className="py-3 px-4">Submodule Name</th>
                <th className="py-3 px-3">Records / Items</th>
                <th className="py-3 px-4 w-40">Progress / Health</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Key Output</th>
                <th className="py-3 px-3">Lead Owner</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSubmodules.map((sub, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors group">
                  <td className="py-3 px-4 font-semibold text-foreground">
                    <Link
                      to={sub.path}
                      className="hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <span>{sub.name}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground font-medium">
                    {sub.recordsCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-foreground">{sub.completionRate}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            sub.completionRate >= 90
                              ? "bg-emerald-500"
                              : sub.completionRate >= 75
                                ? "bg-primary"
                                : "bg-amber-500",
                          )}
                          style={{ width: `${sub.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                        sub.status === "Completed" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                        sub.status === "On Track" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                        sub.status === "In Progress" && "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
                        sub.status === "Needs Attention" && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                        sub.status === "Planned" && "bg-slate-500/10 text-slate-600 dark:text-slate-400",
                      )}
                    >
                      {sub.status === "Completed" && <CheckCircle2 className="h-2.5 w-2.5" />}
                      {sub.status === "Needs Attention" && <AlertTriangle className="h-2.5 w-2.5" />}
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-foreground">{sub.keyMetric}</td>
                  <td className="py-3 px-3 text-muted-foreground">{sub.owner}</td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={sub.path}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-muted hover:bg-primary hover:text-white transition-colors text-[11px] font-semibold text-foreground"
                    >
                      Open
                      <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Items & Critical Issues */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="text-base font-bold text-foreground">Critical Action Items & Next Steps</h3>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {config.actionItems.length} Identified
          </span>
        </div>

        <div className="divide-y divide-border">
          {config.actionItems.map((act) => (
            <div key={act.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-muted-foreground">{act.id}</span>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                      act.priority === "High" && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                      act.priority === "Medium" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                      act.priority === "Low" && "bg-slate-500/10 text-slate-600 dark:text-slate-400",
                    )}
                  >
                    {act.priority} Priority
                  </span>
                  <h4 className="text-xs font-semibold text-foreground">{act.title}</h4>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-3">
                  <span>Owner: <strong className="text-foreground font-medium">{act.owner}</strong></span>
                  <span>•</span>
                  <span>Due: <strong className="text-foreground font-medium">{act.dueDate}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[11px] font-bold px-2 py-0.5 rounded",
                    act.status === "Resolved" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                    act.status === "In Progress" && "bg-blue-500/15 text-blue-600 dark:text-blue-400",
                    act.status === "Open" && "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                  )}
                >
                  {act.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
