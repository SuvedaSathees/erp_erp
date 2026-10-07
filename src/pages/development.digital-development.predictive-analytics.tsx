// Magnertia ERP - Predictive Analytics
// Development → Digital Development → Data Platform Development → Analytics Platform Development → Predictive Analytics
// Predictive Analytics Form — MAICW Classification & Intelligence Engine

import React, { useState, useEffect } from "react";

import {
  Target,
  Cpu,
  CheckCircle,
  Database,
  Bell,
  Activity,
  TrendingUp,
  Calendar,
  Sparkles,
  Zap,
  ArrowRight,
  Plus,
  Play,
  RotateCw,
  Search,
  ChevronRight,
  Sliders,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Gauge,
  HelpCircle,
  X,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { DigitalDevelopmentTabBar } from "@/components/erp/DigitalDevelopmentTabBar";
import { BusinessIntelligenceTabBar } from "@/components/erp/BusinessIntelligenceTabBar";
import { BiSubmoduleHeader } from "@/components/erp/BiSubmoduleHeader";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import {
  PREDICTIVE_KPIS,
  PREDICTIVE_USE_CASES,
  PREDICTIVE_RECENT_PREDICTIONS,
  PREDICTIVE_ALERTS,
  PREDICTIVE_FEATURE_IMPORTANCE,
} from "@/services/predictiveAnalyticsService";
import { cn } from "@/lib/utils";

import { useModuleDataset } from "@/services/moduleDatasetService";
const PREDICTIVE_TABS = [
  "Dashboard",
  "Use Cases",
  "Datasets",
  "Data Preparation",
  "Feature Engineering",
  "Model Development",
  "Training & Validation",
  "Predictions",
  "Monitoring",
  "Reports",
] as const;

const forecastData = [
  { day: "Sep 1", historical: 4200, predicted: null, lower: null, upper: null },
  { day: "Sep 5", historical: 4900, predicted: null, lower: null, upper: null },
  { day: "Sep 10", historical: 4600, predicted: null, lower: null, upper: null },
  { day: "Sep 15", historical: 6200, predicted: null, lower: null, upper: null },
  { day: "Sep 20", historical: 5800, predicted: 5800, lower: 5500, upper: 6100 },
  { day: "Sep 22", historical: null, predicted: 6400, lower: 5900, upper: 6900 },
  { day: "Sep 25", historical: null, predicted: 7100, lower: 6400, upper: 7800 },
  { day: "Sep 28", historical: null, predicted: 7500, lower: 6700, upper: 8300 },
  { day: "Sep 30", historical: null, predicted: 7900, lower: 6900, upper: 8800 },
];

const comparisonData = [
  { day: "Sep 1", actual: 4100, predicted: 4200, range: [3900, 4400] },
  { day: "Sep 5", actual: 4850, predicted: 4900, range: [4600, 5100] },
  { day: "Sep 10", actual: 4500, predicted: 4600, range: [4300, 4800] },
  { day: "Sep 15", actual: 6100, predicted: 6200, range: [5800, 6500] },
  { day: "Sep 20", actual: 5750, predicted: 5800, range: [5400, 6100] },
  { day: "Sep 25", actual: 6950, predicted: 7100, range: [6500, 7600] },
  { day: "Sep 30", actual: 7800, predicted: 7900, range: [7100, 8500] },
];

const PAGE_DATASET = { PREDICTIVE_USE_CASES, PREDICTIVE_RECENT_PREDICTIONS, PREDICTIVE_ALERTS, PREDICTIVE_FEATURE_IMPORTANCE, forecastData, comparisonData };

export function PredictiveAnalyticsPage({
  breadcrumb = "Management > Business Intelligence Management > Predictive Analytics",
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const { PREDICTIVE_USE_CASES, PREDICTIVE_RECENT_PREDICTIONS, PREDICTIVE_ALERTS, PREDICTIVE_FEATURE_IMPORTANCE, forecastData, comparisonData } = useModuleDataset("digital-development.predictive-analytics", "Predictive Analytics", PAGE_DATASET);
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [selectedBu, setSelectedBu] = useState("All Business Units");
  const [selectedModel, setSelectedModel] = useState("EV Charging Demand Model");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [useCases, setUseCases] = useState(PREDICTIVE_USE_CASES);
  useEffect(() => { setUseCases(PREDICTIVE_USE_CASES); }, [PREDICTIVE_USE_CASES]);
  const [predictions, setPredictions] = useState(PREDICTIVE_RECENT_PREDICTIONS);
  useEffect(() => { setPredictions(PREDICTIVE_RECENT_PREDICTIONS); }, [PREDICTIVE_RECENT_PREDICTIONS]);
  const [alerts, setAlerts] = useState(PREDICTIVE_ALERTS);
  useEffect(() => { setAlerts(PREDICTIVE_ALERTS); }, [PREDICTIVE_ALERTS]);

  const [showNewUseCaseModal, setShowNewUseCaseModal] = useState(false);
  const [showEditParamsModal, setShowEditParamsModal] = useState(false);
  const [showUseCasesModal, setShowUseCasesModal] = useState(false);
  const [showPredictionsModal, setShowPredictionsModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);

  const [params, setParams] = useState({
    dateFrom: "01 Sep 2026",
    dateTo: "30 Sep 2026",
    bu: "All Business Units",
    model: "EV Demand Model",
    horizon: "30 Days",
    frequency: "Daily",
  });

  const [newUseCase, setNewUseCase] = useState({
    name: "",
    domain: "Operations",
    modelType: "Time-Series",
    target: "EV Charging Demand",
    horizon: "30 Days",
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateUseCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUseCase.name.trim()) return;

    const newId = `UC-2026-${Date.now().toString().slice(-3)}`;
    const created = {
      id: newId,
      name: newUseCase.name,
      domain: newUseCase.domain,
      modelType: newUseCase.modelType,
      status: "Active" as const,
    };

    setUseCases([created, ...useCases]);
    setShowNewUseCaseModal(false);
    setNewUseCase({
      name: "",
      domain: "Operations",
      modelType: "Time-Series",
      target: "EV Charging Demand",
      horizon: "30 Days",
    });
    showToast(`Predictive Use Case '${created.name}' deployed successfully!`);
  };

  const handleSaveParams = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditParamsModal(false);
    showToast("Prediction parameters updated and model re-calibrated.");
  };

  // 30-Day EV Charging Demand Forecast Data (Sep 1 to Sep 30)

  // Actual vs Predicted Demand Comparison

  return (
    <AppShell
      title="Predictive Analytics"
      breadcrumb={breadcrumb}
      description="Turn Data into Predictions. Smarter Decisions. Greater Impact."
      tabs={tabs ?? <BusinessIntelligenceTabBar />}
    >
      <div className="space-y-5 p-1 pb-16">
        {/* Submodule Standard Header Card matching Image 1 */}
        <BiSubmoduleHeader
          icon={Target}
          title="Predictive Analytics"
          code="PA-DEV-2026-001"
          badge="Automated Inference"
          subtitle="Enterprise predictive intelligence engine, machine learning model registry, demand forecasting, and drift telemetry."
          primaryActionLabel="+ New Use Case"
          onPrimaryAction={() => setShowNewUseCaseModal(true)}
          onRefresh={() => showToast("Inference metrics and model drift telemetry refreshed.")}
          onExportCsv={() => showToast("Exported model inferences to CSV (.csv)")}
          onExportExcel={() => showToast("Exported feature store registry to Excel (.xlsx)")}
          onExportPdf={() => showToast("Generated Predictive Intelligence Whitepaper (.pdf)")}
        />

        {/* 7-Gauge Circular Score Banner matching Image 3 */}
        <ProductScoreBanner submoduleKey="predictive-analytics" />

        {/* 7 Top KPI Cards Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
          {/* 1. Active Use Cases */}
          <div
            onClick={() => {
              setActiveTab("Use Cases");
              showToast("Viewing active ML use cases.");
            }}
            className="rounded-xl border border-border bg-card p-4 shadow-xs cursor-pointer hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Active Use Cases</span>
              <div className="rounded-md bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">{useCases.length}</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↑ 25% vs last quarter</span>
          </div>

          {/* 2. Models Deployed */}
          <div
            onClick={() => {
              setActiveTab("Model Development");
              showToast("Switched to Model Development repository.");
            }}
            className="rounded-xl border border-border bg-card p-4 shadow-xs cursor-pointer hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Models Deployed</span>
              <div className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Cpu className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">6</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↑ 50%</span>
          </div>

          {/* 3. Avg Model Accuracy */}
          <div
            onClick={() => {
              setActiveTab("Training & Validation");
              showToast("Validation accuracy across active models is 92.3%.");
            }}
            className="rounded-xl border border-border bg-card p-4 shadow-xs cursor-pointer hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Avg. Model Accuracy</span>
              <div className="rounded-md bg-purple-50 p-1.5 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">92.3%</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↑ 4.8% vs last month</span>
          </div>

          {/* 4. Predictions Generated */}
          <div
            onClick={() => {
              setActiveTab("Predictions");
              showToast("Total inferences served: 1.8M.");
            }}
            className="rounded-xl border border-border bg-card p-4 shadow-xs cursor-pointer hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Predictions Generated</span>
              <div className="rounded-md bg-amber-50 p-1.5 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <Database className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">1.8M</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↑ 32%</span>
          </div>

          {/* 5. Active Alerts */}
          <div
            onClick={() => setShowAlertsModal(true)}
            className="rounded-xl border border-border bg-card p-4 shadow-xs cursor-pointer hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Active Alerts</span>
              <div className="rounded-md bg-rose-50 p-1.5 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                <Bell className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">{alerts.length}</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↓ 20%</span>
          </div>

          {/* 6. Model Drift Detected */}
          <div
            onClick={() => {
              setActiveTab("Monitoring");
              showToast("2 models flagged for potential prediction drift.");
            }}
            className="rounded-xl border border-border bg-card p-4 shadow-xs cursor-pointer hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Model Drift Detected</span>
              <div className="rounded-md bg-sky-50 p-1.5 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">2</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↓ 50%</span>
          </div>

          {/* 7. Estimated Value */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Estimated Value</span>
              <div className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">₹3.6 Cr</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↑ 28% vs last quarter</span>
          </div>
        </div>

        {/* Row 1: EV Charging Demand Forecast (Next 30 Days), Model Performance, Prediction Insights (AI) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* EV Charging Demand Forecast (6 cols) */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-6">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">EV Charging Demand Forecast (Next 30 Days)</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-500" /> Historical
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Predicted
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-teal-500/30" /> Confidence Range
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                Forecast: ↑ 28% expected increase
              </span>
            </div>

            <div className="h-[230px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="day" className="text-[10px]" tickLine={false} />
                  <YAxis className="text-[10px]" tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="upper" stroke="transparent" fill="#10B981" fillOpacity={0.15} />
                  <Line type="monotone" dataKey="historical" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="predicted" stroke="#10B981" strokeDasharray="4 4" strokeWidth={2.5} dot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Performance Scorecard (3 cols) */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-3">
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-sm font-bold text-foreground">Model Performance</h3>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="rounded border border-border bg-background px-2 py-0.5 text-[10px] font-medium"
              >
                <option>EV Charging Demand Model</option>
                <option>Customer Churn Model</option>
                <option>Sales Forecast Model</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg border border-border bg-muted/20 p-2">
                <span className="text-[10px] text-muted-foreground">Accuracy</span>
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">92.3%</div>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-2">
                <span className="text-[10px] text-muted-foreground">Precision</span>
                <div className="text-base font-bold text-foreground mt-0.5">91.6%</div>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-2">
                <span className="text-[10px] text-muted-foreground">Recall</span>
                <div className="text-base font-bold text-foreground mt-0.5">90.8%</div>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-2">
                <span className="text-[10px] text-muted-foreground">MAE (kWh)</span>
                <div className="text-base font-bold text-foreground mt-0.5">0.12</div>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-2">
                <span className="text-[10px] text-muted-foreground">RMSE (kWh)</span>
                <div className="text-base font-bold text-foreground mt-0.5">0.18</div>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-2">
                <span className="text-[10px] text-muted-foreground">R² Score</span>
                <div className="text-base font-bold text-foreground mt-0.5">0.94</div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-lg bg-primary/10 p-2.5 text-xs">
              <span className="font-semibold text-foreground">Prediction Confidence</span>
              <span className="font-bold text-primary">96.1%</span>
            </div>
          </div>

          {/* Prediction Insights (AI) (3 cols) */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-3">
            <div className="flex items-center gap-1.5 pb-3">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <h3 className="text-sm font-bold text-foreground">Prediction Insights (AI)</h3>
            </div>
            <div className="space-y-2.5 text-[11px]">
              <div className="flex items-start gap-2 rounded-lg border border-border/70 bg-muted/20 p-2.5">
                <span className="h-2 w-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                <p className="leading-relaxed text-foreground">
                  Charging demand is forecasted to increase by 28% in the next 4 weeks primarily due to festival season and new fleet onboarding.
                </p>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-border/70 bg-muted/20 p-2.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                <p className="leading-relaxed text-foreground">
                  Peak demand expected on weekends (25–30% higher than weekdays) on NH-44 and NH-48 corridors.
                </p>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-border/70 bg-muted/20 p-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <p className="leading-relaxed text-foreground">
                  Recommend pre-positioning mobile fast chargers in high-traffic highway hubs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Predictive Analytics Workflow (Left) + Model Drift Monitoring (Right) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* 7-Step Analytics Workflow (8 cols) */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-8">
            <h3 className="text-sm font-bold text-foreground mb-3">Predictive Analytics Workflow</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-7 text-center">
              {[
                { step: "1", title: "Data Collection", status: "Completed", icon: "✓" },
                { step: "2", title: "Data Preparation", status: "Completed", icon: "✓" },
                { step: "3", title: "Feature Engineering", status: "Completed", icon: "✓" },
                { step: "4", title: "Model Training", status: "Completed", icon: "✓" },
                { step: "5", title: "Validation", status: "Completed", icon: "✓" },
                { step: "6", title: "Deployment", status: "Active", icon: "6" },
                { step: "7", title: "Monitoring", status: "Active", icon: "7" },
              ].map((s, idx) => (
                <div key={idx} className="space-y-1 rounded-lg border border-border/70 bg-muted/20 p-2">
                  <div
                    className={cn(
                      "mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white",
                      s.status === "Completed" ? "bg-emerald-600" : "bg-blue-600"
                    )}
                  >
                    {s.icon}
                  </div>
                  <div className="text-[11px] font-bold text-foreground mt-1 truncate">{s.title}</div>
                  <span
                    className={cn(
                      "inline-block rounded px-1.5 py-0.2 text-[9px] font-semibold",
                      s.status === "Completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                    )}
                  >
                    ({s.status})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Drift Monitoring Gauges (4 cols) */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-bold text-foreground">Model Drift Monitoring</h3>
              <span className="text-[10px] text-muted-foreground">Last 30 Days</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                <span className="text-[10px] text-muted-foreground">Data Drift</span>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">0.12</div>
                <span className="text-[10px] font-semibold text-emerald-600">Low</span>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                <span className="text-[10px] text-muted-foreground">Feature Drift</span>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">0.28</div>
                <span className="text-[10px] font-semibold text-amber-600">Medium</span>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                <span className="text-[10px] text-muted-foreground">Prediction Drift</span>
                <div className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">0.65</div>
                <span className="text-[10px] font-semibold text-rose-600">High</span>
              </div>
            </div>
            <div className="mt-3 text-right">
              <button className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                View Details &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Feature Importance, Actual vs Predicted Demand, Use Cases */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Feature Importance */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <h3 className="text-sm font-bold text-foreground pb-2">Feature Importance</h3>
            <div className="space-y-1.5 py-1">
              {PREDICTIVE_FEATURE_IMPORTANCE.map((f, idx) => (
                <div key={idx} className="space-y-0.5 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground font-medium">{f.feature}</span>
                    <span className="font-bold text-foreground">{f.weight}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ backgroundColor: f.color, width: `${f.weight * 3.2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actual vs Predicted Demand */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-bold text-foreground">Actual vs Predicted Demand</h3>
              <span className="text-[10px] text-muted-foreground">Last 30 Days</span>
            </div>
            <div className="h-[210px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="day" className="text-[9px]" tickLine={false} />
                  <YAxis className="text-[9px]" tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} name="Actual" />
                  <Line type="monotone" dataKey="predicted" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" name="Predicted" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Use Cases Table */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">Active Use Cases</h3>
              <button
                onClick={() => setShowUseCasesModal(true)}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <table className="w-full text-left text-xs mt-2">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px]">
                  <th className="pb-1"># Use Case Name</th>
                  <th className="pb-1">Domain</th>
                  <th className="pb-1">Model Type</th>
                  <th className="pb-1">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {useCases.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => showToast(`Selected use case: ${u.name} (${u.domain})`)}
                    className="hover:bg-muted/30 cursor-pointer"
                  >
                    <td className="py-2 text-[11px] font-semibold text-foreground truncate max-w-[120px]">{u.name}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{u.domain}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{u.modelType}</td>
                    <td className="py-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-semibold",
                          u.status === "Active" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
                          u.status === "Deployed" && "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
                          u.status === "Testing" && "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
                          u.status === "Development" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        )}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 4: Recent Predictions, Prediction Parameters, Model Monitoring & Alerts */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Recent Predictions */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Recent Predictions</h3>
              <button
                onClick={() => setShowPredictionsModal(true)}
                className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <table className="w-full text-left text-xs mt-2">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px]">
                  <th className="pb-1"># ID</th>
                  <th className="pb-1">Use Case</th>
                  <th className="pb-1">Period</th>
                  <th className="pb-1">Value</th>
                  <th className="pb-1">Conf.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {predictions.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => showToast(`Prediction ${p.id}: ${p.predictedValue} with ${p.confidence} confidence`)}
                    className="hover:bg-muted/30 cursor-pointer"
                  >
                    <td className="py-2 text-[10px] font-mono text-muted-foreground">{p.id}</td>
                    <td className="py-2 text-[11px] font-semibold text-foreground truncate max-w-[90px]">{p.useCase}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{p.period}</td>
                    <td className="py-2 text-[10px] font-bold text-foreground">{p.predictedValue}</td>
                    <td className="py-2 text-[10px] font-bold text-emerald-600">{p.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prediction Parameters */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Prediction Parameters</h3>
              <button
                onClick={() => setShowEditParamsModal(true)}
                className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mt-2.5">
              <div>
                <span className="text-[10px] text-muted-foreground">Date From</span>
                <div className="font-semibold text-foreground">{params.dateFrom}</div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Date To</span>
                <div className="font-semibold text-foreground">{params.dateTo}</div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Business Unit</span>
                <div className="font-semibold text-foreground">{params.bu}</div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Model</span>
                <div className="font-semibold text-foreground truncate">{params.model}</div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Forecast Horizon</span>
                <div className="font-semibold text-foreground">{params.horizon}</div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Frequency</span>
                <div className="font-semibold text-foreground">{params.frequency}</div>
              </div>
            </div>
          </div>

          {/* Model Monitoring & Alerts */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Model Monitoring & Alerts</h3>
              <button
                onClick={() => setShowAlertsModal(true)}
                className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="space-y-2 mt-2">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  onClick={() => showToast(`Alert ${a.id}: ${a.alert}`)}
                  className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/20 p-2 text-xs cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <span className="text-[10px] text-muted-foreground">{a.date} · </span>
                    <span className="font-semibold text-foreground text-[11px]">{a.alert}</span>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[9px] font-semibold shrink-0 ml-2",
                      a.severity === "High" && "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
                      a.severity === "Medium" && "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
                      a.severity === "Low" && "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                    )}
                  >
                    {a.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal: New Use Case */}
        {showNewUseCaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">Deploy New Predictive Use Case</h3>
                </div>
                <button
                  onClick={() => setShowNewUseCaseModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUseCase} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">Use Case Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Battery Degeneration Predictor"
                    value={newUseCase.name}
                    onChange={(e) => setNewUseCase({ ...newUseCase, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Domain</label>
                    <select
                      value={newUseCase.domain}
                      onChange={(e) => setNewUseCase({ ...newUseCase, domain: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden"
                    >
                      <option>Operations</option>
                      <option>Finance</option>
                      <option>Supply Chain</option>
                      <option>Customer / Churn</option>
                      <option>Manufacturing</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Model Architecture</label>
                    <select
                      value={newUseCase.modelType}
                      onChange={(e) => setNewUseCase({ ...newUseCase, modelType: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden"
                    >
                      <option>Time-Series (Prophet / ARIMA)</option>
                      <option>Classification (XGBoost)</option>
                      <option>Regression (Random Forest)</option>
                      <option>Deep Learning (LSTM / Transformer)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Prediction Horizon</label>
                    <select
                      value={newUseCase.horizon}
                      onChange={(e) => setNewUseCase({ ...newUseCase, horizon: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden"
                    >
                      <option>30 Days</option>
                      <option>60 Days</option>
                      <option>90 Days</option>
                      <option>12 Months</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Target Variable</label>
                    <input
                      type="text"
                      value={newUseCase.target}
                      onChange={(e) => setNewUseCase({ ...newUseCase, target: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowNewUseCaseModal(false)}
                    className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer"
                  >
                    Deploy Use Case
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Prediction Parameters */}
        {showEditParamsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-bold text-foreground">Edit Prediction Parameters</h3>
                <button
                  onClick={() => setShowEditParamsModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveParams} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Date From</label>
                    <input
                      type="text"
                      value={params.dateFrom}
                      onChange={(e) => setParams({ ...params, dateFrom: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Date To</label>
                    <input
                      type="text"
                      value={params.dateTo}
                      onChange={(e) => setParams({ ...params, dateTo: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Forecast Horizon</label>
                    <select
                      value={params.horizon}
                      onChange={(e) => setParams({ ...params, horizon: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden"
                    >
                      <option>14 Days</option>
                      <option>30 Days</option>
                      <option>60 Days</option>
                      <option>90 Days</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Frequency</label>
                    <select
                      value={params.frequency}
                      onChange={(e) => setParams({ ...params, frequency: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden"
                    >
                      <option>Hourly</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowEditParamsModal(false)}
                    className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer"
                  >
                    Apply Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: All Use Cases */}
        {showUseCasesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-bold text-foreground">Active ML Use Cases Register</h3>
                <button
                  onClick={() => setShowUseCasesModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="p-2">ID</th>
                      <th className="p-2">Use Case Name</th>
                      <th className="p-2">Domain</th>
                      <th className="p-2">Model Type</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {useCases.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/40">
                        <td className="p-2 font-mono">{u.id}</td>
                        <td className="p-2 font-semibold text-foreground">{u.name}</td>
                        <td className="p-2 text-muted-foreground">{u.domain}</td>
                        <td className="p-2 text-muted-foreground">{u.modelType}</td>
                        <td className="p-2">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal: All Predictions */}
        {showPredictionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-bold text-foreground">Recent Model Predictions Ledger</h3>
                <button
                  onClick={() => setShowPredictionsModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="p-2">ID</th>
                      <th className="p-2">Use Case</th>
                      <th className="p-2">Period</th>
                      <th className="p-2">Predicted Value</th>
                      <th className="p-2">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {predictions.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/40">
                        <td className="p-2 font-mono">{p.id}</td>
                        <td className="p-2 font-semibold text-foreground">{p.useCase}</td>
                        <td className="p-2 text-muted-foreground">{p.period}</td>
                        <td className="p-2 font-bold text-foreground">{p.predictedValue}</td>
                        <td className="p-2 font-bold text-emerald-600">{p.confidence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal: All Alerts */}
        {showAlertsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-bold text-foreground">Model Monitoring & Drift Alerts</h3>
                <button
                  onClick={() => setShowAlertsModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto">
                {alerts.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-xs">
                    <div>
                      <div className="font-semibold text-foreground">{a.alert}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">Recorded: {a.date}</div>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                        a.severity === "High" && "bg-rose-50 text-rose-700",
                        a.severity === "Medium" && "bg-amber-50 text-amber-700",
                        a.severity === "Low" && "bg-blue-50 text-blue-700"
                      )}
                    >
                      {a.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </AppShell>
  );
}
