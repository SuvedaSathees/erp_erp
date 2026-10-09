// Magnertia ERP - AI Insights
// Development → Digital Development → Data Platform Development → Analytics Platform Development → AI Insights
// AI Insights Form — MAICW Classification & Cognitive Intelligence Center

import React, { useState, useMemo } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  Lightbulb,
  Target,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Sliders,
  CheckCircle,
  TrendingUp,
  Calendar,
  Send,
  Search,
  Filter,
  Plus,
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  ChevronRight,
  ExternalLink,
  Bot,
  Play,
  RotateCw,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { DigitalDevelopmentTabBar } from "@/components/erp/DigitalDevelopmentTabBar";
import { BusinessIntelligenceTabBar } from "@/components/erp/BusinessIntelligenceTabBar";
import { BiSubmoduleHeader } from "@/components/erp/BiSubmoduleHeader";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import {
  AI_INSIGHT_KPIS,
  AI_TOP_INSIGHTS,
  AI_ANOMALIES,
  AI_MODELS_MONITORING,
  AI_RECENT_REQUESTS,
  AiTopInsight,
} from "@/services/aiInsightsService";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/digital-development/ai-insights"
)({
  beforeLoad: () => {
    throw redirect({
      to: "/development/business-development/overview",
      replace: true,
    });
  },
});

const AI_TABS = [
  "Dashboard",
  "Use Cases",
  "Insight Requests",
  "AI Analysis",
  "Models",
  "Predictions",
  "Recommendations",
  "Actions",
  "Monitoring",
  "Reports",
  "Configuration",
] as const;

export function AiInsightsPage({
  breadcrumb = "Management > Business Intelligence Management > AI Insights",
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [selectedBu, setSelectedBu] = useState("All Business Units");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [searchQuery, setSearchQuery] = useState("");
  const [nlQuery, setNlQuery] = useState("");
  const [activeAnswer, setActiveAnswer] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Insight Modal Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDomain, setNewDomain] = useState("Operations");
  const [newImpact, setNewImpact] = useState<"High" | "Medium" | "Critical">("High");
  const [insightsList, setInsightsList] = useState<AiTopInsight[]>(AI_TOP_INSIGHTS);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateInsight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const item: AiTopInsight = {
      id: insightsList.length + 1,
      title: newTitle,
      domain: newDomain,
      impact: newImpact,
      confidence: 94,
      status: "New",
      recommendation: "Automated trigger registered for cross-functional review.",
    };
    setInsightsList([item, ...insightsList]);
    setShowNewModal(false);
    setNewTitle("");
    showToast(`New insight "${item.title}" generated successfully.`);
  };

  const handleNlAnalyze = (queryToUse?: string) => {
    const q = queryToUse || nlQuery;
    if (!q.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      if (q.toLowerCase().includes("revenue") || q.toLowerCase().includes("sales")) {
        setActiveAnswer(
          "Analysis: Sales declined primarily by 4.2% in Tier-2 districts due to supply shipment delays from Chennai port. Inventory buffer resolved this week; Q4 recovery forecast is +18.4%."
        );
      } else if (q.toLowerCase().includes("charging") || q.toLowerCase().includes("ev")) {
        setActiveAnswer(
          "Analysis: EV charging demand is forecasted to surge 28% starting Oct 1st along NH-44 highway due to festive transit. Recommended action: Pre-dispatch mobile fast-charging units."
        );
      } else if (q.toLowerCase().includes("risk") || q.toLowerCase().includes("supplier")) {
        setActiveAnswer(
          "Analysis: 2 semiconductor Tier-1 vendors exhibit high supply delay probability. Multi-sourcing allocation recommended to prevent line stoppages."
        );
      } else {
        setActiveAnswer(
          `Analysis for "${q}": Correlation identified across Operations and Supply Chain. Recommended action generated with 92.4% statistical confidence.`
        );
      }
    }, 400);
  };

  // Stacked Bar Data: Insights Trend (Jan-Sep)
  const trendData = [
    { month: "Jan", generated: 38, highImpact: 8, critical: 2 },
    { month: "Feb", generated: 45, highImpact: 11, critical: 3 },
    { month: "Mar", generated: 52, highImpact: 14, critical: 2 },
    { month: "Apr", generated: 60, highImpact: 16, critical: 4 },
    { month: "May", generated: 68, highImpact: 19, critical: 3 },
    { month: "Jun", generated: 74, highImpact: 22, critical: 5 },
    { month: "Jul", generated: 82, highImpact: 26, critical: 4 },
    { month: "Aug", generated: 90, highImpact: 31, critical: 6 },
    { month: "Sep", generated: 98, highImpact: 36, critical: 5 },
  ];

  // Domain Distribution (Donut)
  const domainData = [
    { name: "Operations", value: 24, color: "#3B82F6" },
    { name: "Finance", value: 16, color: "#10B981" },
    { name: "Sales", value: 14, color: "#F59E0B" },
    { name: "Supply Chain", value: 12, color: "#06B6D4" },
    { name: "Customer", value: 10, color: "#EC4899" },
    { name: "Manufacturing", value: 8, color: "#8B5CF6" },
    { name: "Quality", value: 6, color: "#14B8A6" },
    { name: "Product", value: 6, color: "#F97316" },
    { name: "HR", value: 5, color: "#6366F1" },
  ];

  // Impact Distribution (Donut)
  const impactData = [
    { name: "Critical", value: 6, color: "#EF4444" },
    { name: "High", value: 18, color: "#F97316" },
    { name: "Medium", value: 48, color: "#3B82F6" },
    { name: "Low", value: 20, color: "#10B981" },
    { name: "Informational", value: 8, color: "#64748B" },
  ];

  // AI Accuracy & Cognitive Resolution Trend (Jan-Sep)
  const aiAccuracyTrend = [
    { month: "Jan", accuracy: 89.2, resolved: 32 },
    { month: "Feb", accuracy: 91.5, resolved: 41 },
    { month: "Mar", accuracy: 92.8, resolved: 49 },
    { month: "Apr", accuracy: 94.1, resolved: 58 },
    { month: "May", accuracy: 95.4, resolved: 65 },
    { month: "Jun", accuracy: 96.2, resolved: 71 },
    { month: "Jul", accuracy: 96.8, resolved: 79 },
    { month: "Aug", accuracy: 97.4, resolved: 86 },
    { month: "Sep", accuracy: 98.2, resolved: 94 },
  ];

  const filteredInsights = useMemo(() => {
    if (!searchQuery.trim()) return insightsList;
    return insightsList.filter((i) =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [insightsList, searchQuery]);

  return (
    <AppShell
      title="AI Insights"
      breadcrumb={breadcrumb}
      description="Turn Data into Insights. Predict. Recommend. Drive Action."
      tabs={tabs ?? <BusinessIntelligenceTabBar />}
    >
      <div className="space-y-5 p-1 pb-16">
        {/* Toast alert */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-900 px-4 py-2.5 text-xs text-white shadow-xl flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Submodule Standard Header Card matching Image 1 */}
        <BiSubmoduleHeader
          icon={Sparkles}
          title="AI Insights"
          code="AI-INS-2026-001"
          badge="Autonomous AI"
          subtitle="Enterprise cognitive intelligence engine, explainable root-cause discovery, automated anomaly detection, and prescriptive decisions."
          primaryActionLabel="+ New AI Insight"
          onPrimaryAction={() => setShowNewModal(true)}
          onRefresh={() => showToast("AI models, observations, and anomalies refreshed.")}
          onExportCsv={() => showToast("Exported AI insights to CSV (.csv)")}
          onExportExcel={() => showToast("Exported cognitive registry to Excel (.xlsx)")}
          onExportPdf={() => showToast("Generated AI Executive Intelligence Dossier (.pdf)")}
        />

        {/* 7-Gauge Circular Score Banner matching Image 3 */}
        <ProductScoreBanner submoduleKey="ai-insights" />


        {/* 8 Top Telemetry KPI Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {AI_INSIGHT_KPIS.map((kpi) => (
            <div key={kpi.id} className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground truncate">{kpi.label}</span>
                <div className="rounded-md bg-purple-50 p-1.5 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-2 text-xl font-bold text-foreground">{kpi.value}</div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{kpi.change}</span>
            </div>
          ))}
        </div>

        {/* Row 1: Insight Trend, Insights by Domain, Insight Impact Distribution */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Insight Trend (6 cols) */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-6">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Insight Trend</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-500" /> Insights Generated
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> High Impact
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-rose-500" /> Critical
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-medium">Last 9 Months</span>
            </div>
            <div className="h-[210px] w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="month" className="text-[10px]" tickLine={false} />
                  <YAxis className="text-[10px]" tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="generated" fill="#3B82F6" radius={[3, 3, 0, 0]} name="Generated" />
                  <Bar dataKey="highImpact" fill="#10B981" radius={[3, 3, 0, 0]} name="High Impact" />
                  <Line type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2} name="Critical" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights by Business Domain (3 cols) */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-3">
            <h3 className="text-sm font-bold text-foreground">Insights by Business Domain</h3>
            <p className="text-xs text-muted-foreground mb-2">568 Total Insights</p>
            <div className="relative mx-auto h-[140px] w-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={domainData} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={62}>
                    {domainData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-foreground">568</span>
                <span className="text-[9px] text-muted-foreground">Insights</span>
              </div>
            </div>
            <div className="mt-2 space-y-1 text-[10px]">
              {domainData.slice(0, 4).map((d, i) => (
                <div key={i} className="flex justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insight Impact Distribution (3 cols) */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-3">
            <h3 className="text-sm font-bold text-foreground">Insight Impact Distribution</h3>
            <p className="text-xs text-muted-foreground mb-2">Severity & Priority Matrix</p>
            <div className="relative mx-auto h-[140px] w-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={impactData} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={62}>
                    {impactData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-foreground">568</span>
                <span className="text-[9px] text-muted-foreground">Classified</span>
              </div>
            </div>
            <div className="mt-2 space-y-1 text-[10px]">
              {impactData.map((d, i) => (
                <div key={i} className="flex justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Top AI Insights Table (6 cols) & Prediction vs Actual Demand (6 cols) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Top AI Insights Table */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-6">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Top AI Insights</h3>
                <p className="text-xs text-muted-foreground">High-confidence cognitive observations</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter insights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded border border-border bg-background px-2 py-0.5 text-xs focus:outline-hidden"
                />
                <button
                  onClick={() => showToast("Insights refreshed from data warehouse stream.")}
                  className="rounded p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px]">
                  <th className="pb-1"># Title</th>
                  <th className="pb-1">Domain</th>
                  <th className="pb-1">Impact</th>
                  <th className="pb-1">Confidence</th>
                  <th className="pb-1">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredInsights.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30">
                    <td className="py-2 text-[11px] font-semibold text-foreground truncate max-w-[150px]">{item.title}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{item.domain}</td>
                    <td className="py-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-semibold",
                          item.impact === "Critical" && "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
                          item.impact === "High" && "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
                          item.impact === "Medium" && "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                        )}
                      >
                        {item.impact}
                      </span>
                    </td>
                    <td className="py-2 text-[10px] font-bold text-foreground">{item.confidence}%</td>
                    <td className="py-2">
                      <button
                        onClick={() => showToast(`Action initiated for "${item.title}".`)}
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-semibold cursor-pointer",
                          item.status === "New" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
                          item.status === "Reviewed" && "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
                          item.status === "Action" && "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        )}
                      >
                        {item.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Insight Accuracy & Resolution Trend */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-6">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">AI Insight Accuracy & Resolution Trend</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-500" /> Accuracy (%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Resolved Actions
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-medium">Jan – Sep 2026</span>
            </div>
            <div className="h-[210px] w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aiAccuracyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="month" className="text-[10px]" tickLine={false} />
                  <YAxis className="text-[10px]" tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="accuracy" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.12} />
                  <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Row 3: Anomaly Detection, Model Performance Monitoring, Recent Insight Requests */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Anomaly Detection */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Anomaly Detection</h3>
              <button
                onClick={() => showToast("Showing all 14 detected system anomalies.")}
                className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <table className="w-full text-left text-xs mt-2">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px]">
                  <th className="pb-1"># Metric</th>
                  <th className="pb-1">Current</th>
                  <th className="pb-1">Expected</th>
                  <th className="pb-1">Deviation</th>
                  <th className="pb-1">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {AI_ANOMALIES.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30">
                    <td className="py-2 text-[11px] font-semibold text-foreground truncate max-w-[100px]">{a.metric}</td>
                    <td className="py-2 text-[10px] text-foreground">{a.currentValue}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{a.expectedValue}</td>
                    <td className="py-2 text-[10px] font-bold text-rose-600 dark:text-rose-400">{a.deviation}</td>
                    <td className="py-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-semibold",
                          a.severity === "Critical" && "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
                          a.severity === "High" && "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
                          a.severity === "Medium" && "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        )}
                      >
                        {a.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Model Performance Monitoring */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Model Performance Monitoring</h3>
              <button
                onClick={() => showToast("Displaying all 8 machine learning models.")}
                className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <table className="w-full text-left text-xs mt-2">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px]">
                  <th className="pb-1"># Model</th>
                  <th className="pb-1">Accuracy</th>
                  <th className="pb-1">Drift</th>
                  <th className="pb-1">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {AI_MODELS_MONITORING.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/30">
                    <td className="py-2 text-[11px] font-semibold text-foreground truncate max-w-[110px]">{m.model}</td>
                    <td className="py-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{m.accuracy}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{m.drift}</td>
                    <td className="py-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-semibold",
                          m.status === "Active" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
                          m.status === "Retrain" && "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
                          m.status === "Review" && "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                        )}
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Insight Requests */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Recent Insight Requests</h3>
              <button
                onClick={() => showToast("Request queue updated.")}
                className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <table className="w-full text-left text-xs mt-2">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px]">
                  <th className="pb-1"># Question</th>
                  <th className="pb-1">Domain</th>
                  <th className="pb-1">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {AI_RECENT_REQUESTS.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="py-2 text-[11px] font-medium text-foreground truncate max-w-[140px]">{r.question}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{r.domain}</td>
                    <td className="py-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-semibold",
                          r.status === "Completed" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
                          r.status === "In Progress" && "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
                          r.status === "Pending" && "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        )}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 4: AI Insights Workflow (Left) & AI Assistant Natural Language Analytics (Right) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* AI Insights Workflow (6 cols) */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-6">
            <h3 className="text-sm font-bold text-foreground mb-3">AI Insights Workflow</h3>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { step: "1", title: "Data Collection", status: "Completed", icon: "✓" },
                { step: "2", title: "Data Preparation", status: "Completed", icon: "✓" },
                { step: "3", title: "Analysis", status: "Completed", icon: "✓" },
                { step: "4", title: "Insight Gen.", status: "Completed", icon: "✓" },
                { step: "5", title: "Prediction", status: "Active", icon: "5" },
                { step: "6", title: "Recommendation", status: "Pending", icon: "6" },
                { step: "7", title: "Human Review", status: "Pending", icon: "7" },
                { step: "8", title: "Action & Result", status: "Pending", icon: "8" },
              ].map((s, idx) => (
                <div key={idx} className="space-y-1 rounded-lg border border-border/70 bg-muted/20 p-2">
                  <div
                    className={cn(
                      "mx-auto flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white",
                      s.status === "Completed" ? "bg-emerald-600" : s.status === "Active" ? "bg-blue-600" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {s.icon}
                  </div>
                  <div className="text-[10px] font-bold text-foreground truncate">{s.title}</div>
                  <span className="text-[9px] text-muted-foreground">({s.status})</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant (Natural Language Analytics) (6 cols) */}
          <div className="rounded-xl border border-border bg-gradient-to-br from-card to-purple-50/20 p-5 shadow-xs dark:to-purple-950/20 lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-bold text-foreground">AI Assistant (Natural Language Analytics)</h3>
              </div>
              <button
                onClick={() => setNlQuery("Why did revenue decline this month?")}
                className="text-[10px] font-semibold text-purple-600 hover:underline dark:text-purple-400 cursor-pointer"
              >
                View Examples
              </button>
            </div>

            {/* Prompt input box with send button */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-1.5 shadow-2xs">
              <input
                type="text"
                placeholder="Ask a question about your enterprise data..."
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNlAnalyze()}
                className="flex-1 bg-transparent px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden"
              />
              <button
                onClick={() => handleNlAnalyze()}
                disabled={isAnalyzing}
                className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Prompt pill buttons */}
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              {[
                "Why did sales decline this month?",
                "Forecast EV charging demand",
                "Identify top risk suppliers",
                "Show inventory shortage risk",
                "Predict revenue for next quarter",
                "Recommend next best action",
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setNlQuery(p);
                    handleNlAnalyze(p);
                  }}
                  className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-all"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Dynamic AI Answer card */}
            {activeAnswer && (
              <div className="rounded-lg border border-purple-500/30 bg-purple-50/30 p-3 text-xs leading-relaxed text-foreground dark:bg-purple-950/30">
                <div className="flex items-center justify-between pb-1 font-semibold text-purple-700 dark:text-purple-300">
                  <span>AI Insight Generated (Explainable)</span>
                  <span className="text-[10px]">Confidence: 94.2%</span>
                </div>
                <p>{activeAnswer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal: Create New Insight */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">Create AI Insight</h3>
                <button onClick={() => setShowNewModal(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleCreateInsight} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground">Insight Title / Observation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Fleet charging demand surge in Madurai hub"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Business Domain</label>
                    <select
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                    >
                      <option>Operations</option>
                      <option>Finance</option>
                      <option>Supply Chain</option>
                      <option>Manufacturing</option>
                      <option>Quality</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Impact Level</label>
                    <select
                      value={newImpact}
                      onChange={(e) => setNewImpact(e.target.value as any)}
                      className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                    >
                      <option>High</option>
                      <option>Critical</option>
                      <option>Medium</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="rounded border border-border px-3 py-1.5 font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-primary px-4 py-1.5 font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    Generate Insight
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
