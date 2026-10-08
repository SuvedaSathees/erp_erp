// Magnertia ERP - Decision Support
// Management → Business Intelligence Management → Decision Support
// Decision Support Form — MAICW Classification & Executive Decision Studio

import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckSquare,
  CheckCircle,
  TrendingUp,
  Calendar,
  Sparkles,
  Search,
  Plus,
  Edit,
  Download,
  Filter,
  Layers,
  ChevronRight,
  ExternalLink,
  Bot,
  Send,
  Sliders,
  DollarSign,
  Activity,
  ArrowRight,
  ShieldCheck,
  Building,
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
  AreaChart,
  Area,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { BusinessIntelligenceTabBar } from "@/components/erp/BusinessIntelligenceTabBar";
import { BiSubmoduleHeader } from "@/components/erp/BiSubmoduleHeader";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import {
  DSS_KPIS,
  DSS_RECENT_DECISIONS,
  DSS_OPTIONS,
  DSS_RISKS,
  DSS_ACTIONS,
  DecisionRecord,
} from "@/services/decisionSupportService";
import { cn } from "@/lib/utils";

import { useModuleDataset, usePersistentState } from "@/services/moduleDatasetService";
import { exportRecords } from "@/lib/recordExport";
export const Route = createFileRoute(
  "/management/business-intelligence/decision-support"
)({
  head: () => ({
    meta: [
      { title: "Decision Support · Magnertia ERP" },
      {
        name: "description",
        content:
          "Convert business analytics, forecasts, risk assessments, and scenarios into structured, traceable, accountable executive decisions.",
      },
    ],
  }),
  component: DecisionSupportPage,
});

const DECISION_TABS = [
  "Overview",
  "Analysis",
  "Options",
  "Risks",
  "Approval",
  "Actions",
  "Outcome",
] as const;

const impactData = [
  { metric: "Revenue (₹ Cr)", current: 15, optionA: 32, optionB: 28.5, optionC: 20 },
  { metric: "Cost (₹ Cr)", current: 10, optionA: 18, optionB: 12, optionC: 6 },
  { metric: "Payback (Yrs)", current: 4, optionA: 3.5, optionB: 2.5, optionC: 3.0 },
  { metric: "ROI (%)", current: 18, optionA: 28, optionB: 35, optionC: 30 },
];

const forecastDemandData = [
  { month: "Jan", historical: 20000, forecast: null, upper: null, lower: null },
  { month: "Feb", historical: 24000, forecast: null, upper: null, lower: null },
  { month: "Mar", historical: 26000, forecast: null, upper: null, lower: null },
  { month: "Apr", historical: 31000, forecast: null, upper: null, lower: null },
  { month: "May", historical: 35000, forecast: null, upper: null, lower: null },
  { month: "Jun", historical: 39000, forecast: null, upper: null, lower: null },
  { month: "Jul", historical: 41000, forecast: 41000, upper: 44000, lower: 38000 },
  { month: "Aug", historical: null, forecast: 46000, upper: 51000, lower: 42000 },
  { month: "Sep", historical: null, forecast: 52000, upper: 58000, lower: 47000 },
  { month: "Oct", historical: null, forecast: 59000, upper: 66000, lower: 53000 },
  { month: "Nov", historical: null, forecast: 65000, upper: 73000, lower: 58000 },
  { month: "Dec", historical: null, forecast: 71000, upper: 80000, lower: 63000 },
];

const PAGE_DATASET = { DSS_KPIS, DSS_RECENT_DECISIONS, DSS_OPTIONS, DSS_RISKS, DSS_ACTIONS, impactData, forecastDemandData };

function DecisionSupportPage() {
  const { DSS_KPIS, DSS_RECENT_DECISIONS, DSS_OPTIONS, DSS_RISKS, DSS_ACTIONS, impactData, forecastDemandData } = useModuleDataset("business-intelligence.decision-support", "Decision Support", PAGE_DATASET);
  const [selectedBu, setSelectedBu] = useState("All Business Units");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [activeDecisionTab, setActiveDecisionTab] = useState<string>("Overview");
  const [selectedDecision, setSelectedDecision] = useState<DecisionRecord>(DSS_RECENT_DECISIONS[0]);
  const [dssList, setDssList] = usePersistentState<DecisionRecord[]>("business-intelligence.decision-support", "Decision Support", "DSS_RECENT_DECISIONS", DSS_RECENT_DECISIONS);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newArea, setNewArea] = useState("Operations");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("High");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // AI Assistant prompt state
  const [aiQuestion, setAiQuestion] = useState(
    "What is the best option to expand EV charging network?"
  );
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAnalyzeDecision = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiResponse(
        "AI Evaluation: Option B (Hybrid Model) delivers the optimal risk-to-reward ratio with 2.4x ROI in 3 years. It cuts capital expenditure by 33% via local franchise co-investment while retaining 67% recurring high-margin telemetry software margins."
      );
    }, 450);
  };

  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    const item: DecisionRecord = {
      id: `DS-2026-00${dssList.length + 1}`,
      topic: newTopic,
      businessArea: newArea,
      priority: newPriority,
      status: "In Progress",
      dueDate: "30 Oct 2026",
      owner: "Executive Lead",
      investment: "₹5.0 Cr",
      expectedBenefit: "₹12.0 Cr",
    };
    setDssList([item, ...dssList]);
    setSelectedDecision(item);
    setShowNewModal(false);
    setNewTopic("");
    showToast(`Decision record "${item.topic}" created successfully.`);
  };

  // Decision Impact Analysis (Bar Chart)

  // 12-Month EV Demand Forecast (Jan-Dec)

  return (
    <AppShell
      title="Decision Support"
      breadcrumb="Management > Business Intelligence Management > Decision Support"
      description="Data Driven Decisions. From Insight to Action."
      tabs={<BusinessIntelligenceTabBar />}
    >
      <div className="space-y-5 p-1 pb-16">
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-900 px-4 py-2.5 text-xs text-white shadow-xl flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Submodule Standard Header Card matching Image 1 */}
        <BiSubmoduleHeader
          icon={Sparkles}
          title="Decision Support"
          code="BI-DSS-2026-001"
          badge="Strategic Sign-Off"
          subtitle="Prescriptive decision engineering, scenario optimization, multi-criteria risk mitigation, and board governance."
          primaryActionLabel="+ New Decision"
          onPrimaryAction={() => setShowNewModal(true)}
          dateRange={dateRange}
          onDateRangeChange={(r) => {
            setDateRange(r);
            showToast(`Decision date window updated: ${r}`);
          }}
          onExportCsv={() => exportRecords("Decision Register", dssList, "csv")}
          onExportExcel={() => exportRecords("Decision Register", dssList, "xlsx")}
          onExportPdf={() => exportRecords("Decision Register", dssList, "pdf")}
        />

        {/* 7-Gauge Circular Score Banner matching Image 3 */}
        <ProductScoreBanner submoduleKey="decision-support" />


        {/* 6 Decision KPI Cards Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {DSS_KPIS.map((kpi) => (
            <div key={kpi.id} className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground truncate">{kpi.label}</span>
                <div className="rounded-md bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <FileText className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-2 text-xl font-bold text-foreground">{kpi.value}</div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{kpi.change}</span>
            </div>
          ))}
        </div>

        {/* Decision Support Workflow (11 Steps) */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-xs font-bold text-foreground">Decision Support Workflow</h3>
            <button
              onClick={() => showToast("Displaying complete decision governance lifecycle.")}
              className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
            >
              View Workflow &rarr;
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-11 text-center text-xs">
            {[
              { step: "1", title: "Request", status: "Completed", icon: "✓" },
              { step: "2", title: "Context", status: "Completed", icon: "✓" },
              { step: "3", title: "Data & Analysis", status: "Completed", icon: "✓" },
              { step: "4", title: "Options", status: "In Progress", icon: "4" },
              { step: "5", title: "Evaluation", status: "Pending", icon: "5" },
              { step: "6", title: "Recommendation", status: "Pending", icon: "6" },
              { step: "7", title: "Approval", status: "Pending", icon: "7" },
              { step: "8", title: "Decision", status: "Pending", icon: "8" },
              { step: "9", title: "Action", status: "Pending", icon: "9" },
              { step: "10", title: "Outcome", status: "Pending", icon: "10" },
              { step: "11", title: "Review", status: "Pending", icon: "11" },
            ].map((s, idx) => (
              <div key={idx} className="space-y-1 rounded-lg border border-border/70 bg-muted/20 p-2">
                <div
                  className={cn(
                    "mx-auto flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white",
                    s.status === "Completed" ? "bg-emerald-600" : s.status === "In Progress" ? "bg-blue-600" : "bg-muted text-muted-foreground"
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

        {/* Row 1: Recent Decisions (3.5 cols), Decision Details (4.5 cols), AI Decision Assistant (4 cols) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Recent Decisions Table (3.5 cols) */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs lg:col-span-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Recent Decisions</h3>
              <button
                onClick={() => showToast("Opening full decision registry.")}
                className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <table className="w-full text-left text-xs mt-2">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px]">
                  <th className="pb-1"># Topic</th>
                  <th className="pb-1">Area</th>
                  <th className="pb-1">Priority</th>
                  <th className="pb-1">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {dssList.map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => {
                      setSelectedDecision(d);
                      showToast(`Loaded decision "${d.topic}" into inspector.`);
                    }}
                    className={cn(
                      "hover:bg-muted/40 cursor-pointer transition-all",
                      selectedDecision.id === d.id && "bg-muted/50 font-semibold"
                    )}
                  >
                    <td className="py-2 text-[11px] font-medium text-foreground truncate max-w-[110px]">{d.topic}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{d.businessArea}</td>
                    <td className="py-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-semibold",
                          d.priority === "High" ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400" : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                        )}
                      >
                        {d.priority}
                      </span>
                    </td>
                    <td className="py-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-semibold",
                          d.status === "In Progress" && "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
                          d.status === "Pending Approval" && "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
                          d.status === "Analysis" && "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
                          d.status === "Draft" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        )}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Decision Details Inspector (4.5 cols) */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h3 className="text-xs font-bold text-foreground">Decision Details</h3>
                <h4 className="text-sm font-bold text-foreground mt-0.5 truncate max-w-[220px]">
                  {selectedDecision.topic}
                </h4>
              </div>
              <button
                onClick={() => showToast(`Editing decision ${selectedDecision.id}...`)}
                className="rounded border border-border bg-background px-2.5 py-1 text-xs font-semibold hover:bg-muted cursor-pointer"
              >
                Edit
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-1 overflow-x-auto border-b border-border pb-1 scrollbar-none text-[10px] font-medium text-muted-foreground">
              {DECISION_TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveDecisionTab(t)}
                  className={cn(
                    "rounded px-2 py-0.5 transition-all cursor-pointer",
                    activeDecisionTab === t ? "bg-muted font-bold text-foreground shadow-2xs" : "hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground">Decision ID</span>
                <div className="font-semibold text-foreground font-mono mt-0.5">{selectedDecision.id}</div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Business Area</span>
                <div className="font-semibold text-foreground mt-0.5">{selectedDecision.businessArea}</div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Priority</span>
                <div className="font-bold text-rose-600 mt-0.5">{selectedDecision.priority}</div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Status</span>
                <div className="font-semibold text-blue-600 mt-0.5">{selectedDecision.status}</div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Decision Owner</span>
                <div className="font-semibold text-foreground mt-0.5">{selectedDecision.owner}</div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Required Date</span>
                <div className="font-semibold text-foreground mt-0.5">{selectedDecision.dueDate}</div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Estimated Investment</span>
                <div className="font-bold text-foreground mt-0.5">{selectedDecision.investment}</div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Expected Benefit</span>
                <div className="font-bold text-emerald-600 mt-0.5">{selectedDecision.expectedBenefit}</div>
              </div>
            </div>

            {/* Actions button */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                onClick={() => showToast(`Approved decision ${selectedDecision.id}. Action pipeline unlocked.`)}
                className="flex-1 rounded bg-emerald-600 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer"
              >
                Approve Decision
              </button>
              <button
                onClick={() => showToast(`Decision ${selectedDecision.id} returned for further risk analysis.`)}
                className="flex-1 rounded border border-border bg-background py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
              >
                Request Analysis
              </button>
            </div>
          </div>

          {/* AI Decision Assistant (4 cols) */}
          <div className="rounded-xl border border-border bg-gradient-to-br from-card to-blue-50/20 p-4 shadow-xs dark:to-blue-950/20 lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-border">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-bold text-foreground">AI Decision Assistant</h3>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                High Confidence 92%
              </span>
            </div>

            {/* Prompt input */}
            <div className="flex gap-1.5">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-hidden"
              />
              <button
                onClick={handleAnalyzeDecision}
                disabled={isAnalyzing}
                className="rounded bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer disabled:opacity-50"
              >
                {isAnalyzing ? "..." : "Analyze"}
              </button>
            </div>

            {/* AI Recommendation Summary Box */}
            <div className="rounded-lg border border-blue-500/30 bg-blue-50/30 p-3 text-xs leading-relaxed text-foreground dark:bg-blue-950/30 space-y-2">
              <p className="font-semibold text-blue-700 dark:text-blue-300">
                Option B (Hybrid Model - Owned + Franchise) is recommended.
              </p>
              <div className="space-y-1 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>Expected ROI: 2.4x in 3 years</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>Peak demand corridor: Chennai, Coimbatore, Madurai</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>Lower CAPEX with co-investment franchise structure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>Risk Level: Medium</span>
                </div>
              </div>
              {aiResponse && (
                <div className="mt-2 pt-2 border-t border-border/60 text-[11px] text-foreground">
                  {aiResponse}
                </div>
              )}
            </div>

            <button
              onClick={() => showToast("Opening full multi-scenario decision dossier.")}
              className="w-full rounded border border-border bg-background py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
            >
              View Full Analysis
            </button>
          </div>
        </div>

        {/* Row 2: Decision Impact Analysis, EV Charging Demand Forecast, Option Comparison */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Decision Impact Analysis */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <h3 className="text-xs font-bold text-foreground pb-2">Decision Impact Analysis</h3>
            <div className="h-[180px] w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="metric" className="text-[9px]" tickLine={false} />
                  <YAxis className="text-[9px]" tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="current" fill="#94A3B8" name="Current" />
                  <Bar dataKey="optionA" fill="#3B82F6" name="Option A" />
                  <Bar dataKey="optionB" fill="#10B981" name="Option B (Rec)" />
                  <Bar dataKey="optionC" fill="#F59E0B" name="Option C" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* EV Demand Forecast Area Chart */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-xs font-bold text-foreground">EV Charging Demand Forecast</h3>
              <span className="text-[9px] text-muted-foreground">Historical vs Forecast</span>
            </div>
            <div className="h-[180px] w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastDemandData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="month" className="text-[9px]" tickLine={false} />
                  <YAxis className="text-[9px]" tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="upper" stroke="transparent" fill="#10B981" fillOpacity={0.15} />
                  <Line type="monotone" dataKey="historical" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Option Comparison Table */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Option Comparison</h3>
              <button
                onClick={() => showToast("Recalculating option matrix scores...")}
                className="text-[10px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                Refresh Scores
              </button>
            </div>
            <table className="w-full text-left text-xs mt-2">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px]">
                  <th className="pb-1">Option</th>
                  <th className="pb-1">Investment</th>
                  <th className="pb-1">Benefit</th>
                  <th className="pb-1">ROI</th>
                  <th className="pb-1">Risk</th>
                  <th className="pb-1 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {DSS_OPTIONS.map((opt, idx) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="py-2 text-[11px] font-semibold text-foreground">{opt.name}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{opt.investment}</td>
                    <td className="py-2 text-[10px] font-bold text-foreground">{opt.expectedBenefit}</td>
                    <td className="py-2 text-[10px] font-bold text-emerald-600">{opt.roi}</td>
                    <td className="py-2">
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.2 text-[9px] font-semibold",
                          opt.risk === "High" ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400" : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        )}
                      >
                        {opt.risk}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-bold",
                          opt.score > 85 ? "bg-emerald-600 text-white" : "bg-muted text-foreground"
                        )}
                      >
                        {opt.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 3: Key Risks, Recommended Actions, Expected vs Actual Outcome */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Key Risks */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Key Risks</h3>
              <button
                onClick={() => showToast("Opening complete risk matrix.")}
                className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <table className="w-full text-left text-xs mt-2">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px]">
                  <th className="pb-1"># Risk</th>
                  <th className="pb-1">Prob.</th>
                  <th className="pb-1">Impact</th>
                  <th className="pb-1 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {DSS_RISKS.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="py-2 text-[11px] font-medium text-foreground truncate max-w-[130px]">{r.risk}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{r.probability}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{r.impact}</td>
                    <td className="py-2 text-right">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-bold text-white",
                          r.score > 70 ? "bg-rose-600" : r.score > 55 ? "bg-amber-600" : "bg-blue-600"
                        )}
                      >
                        {r.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recommended Actions */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Recommended Actions</h3>
              <button
                onClick={() => showToast("Navigating to executive action ledger.")}
                className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <table className="w-full text-left text-xs mt-2">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px]">
                  <th className="pb-1"># Action</th>
                  <th className="pb-1">Owner</th>
                  <th className="pb-1">Due Date</th>
                  <th className="pb-1">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {DSS_ACTIONS.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30">
                    <td className="py-2 text-[11px] font-medium text-foreground truncate max-w-[120px]">{a.action}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{a.owner}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{a.dueDate}</td>
                    <td className="py-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-semibold",
                          a.status === "In Progress" && "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
                          a.status === "Not Started" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        )}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expected vs Actual Outcome */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Expected vs Actual Outcome</h3>
              <button
                onClick={() => showToast("Showing post-decision benefit realization details.")}
                className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View Details
              </button>
            </div>
            <table className="w-full text-left text-xs mt-2">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px]">
                  <th className="pb-1">Metric</th>
                  <th className="pb-1">Expected</th>
                  <th className="pb-1">Actual</th>
                  <th className="pb-1">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  { metric: "Charging Stations", exp: "50", act: "38", var: "-12" },
                  { metric: "Monthly Sessions", exp: "45,000", act: "48,200", var: "+7.1%" },
                  { metric: "Annual Revenue", exp: "₹28.5 Cr", act: "₹29.1 Cr", var: "+2.1%" },
                  { metric: "Payback Period", exp: "3 Years", act: "2.6 Years", var: "+13%" },
                  { metric: "ROI", exp: "2.4x", act: "2.5x", var: "+4.1%" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="py-2 text-[11px] font-semibold text-foreground">{row.metric}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{row.exp}</td>
                    <td className="py-2 text-[10px] font-bold text-foreground">{row.act}</td>
                    <td className="py-2 text-[10px] font-bold text-emerald-600">{row.var}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Create New Decision */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">New Decision Record</h3>
                <button onClick={() => setShowNewModal(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleCreateDecision} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground">Decision Topic *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Battery pack supplier selection Phase 2"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Business Area</label>
                    <select
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                    >
                      <option>Operations</option>
                      <option>Investment</option>
                      <option>Manufacturing</option>
                      <option>Product</option>
                      <option>Strategic</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="mt-1 w-full rounded border border-border bg-background p-2 focus:outline-hidden"
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
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
                    Register Decision
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
