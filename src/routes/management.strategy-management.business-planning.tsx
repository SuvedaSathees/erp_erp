import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { StrategyManagementTabBar } from "@/components/erp/StrategyManagementTabBar";
import { StrategyScoreBanner } from "@/components/erp/StrategyScoreBanner";
import {
  Briefcase,
  CheckCircle2,
  Save,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  DollarSign,
  Target,
  Layers,
  ShieldAlert,
  Calendar,
  Building2,
  User,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Filter,
  Download,
  Share2,
  FileText,
  PieChart as PieIcon,
  BarChart3,
  Award,
  Zap,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Compass,
  AlertCircle,
  X,
  Sliders,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  Line,
  ComposedChart,
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/strategy-management/business-planning")({
  head: () => ({
    meta: [
      { title: "Business Planning · Strategy Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Convert Vision, Mission, Strategy and Business Goals into an integrated business plan covering market, products, operations, finance, risks and execution.",
      },
    ],
  }),
  component: BusinessPlanningPage,
});

// Lifecycle Stages
const PLANNING_STAGES = [
  { id: 1, name: "Draft", status: "completed" },
  { id: 2, name: "Analysis", status: "active" },
  { id: 3, name: "Planning", status: "pending" },
  { id: 4, name: "Review", status: "pending" },
  { id: 5, name: "Approval", status: "pending" },
  { id: 6, name: "Execution", status: "pending" },
  { id: 7, name: "Monitoring", status: "pending" },
  { id: 8, name: "Closed", status: "pending" },
];

const FORECAST_DATA = [
  { year: "FY25", revenue: 85, ebitda: 22, netProfit: 14 },
  { year: "FY26", revenue: 115, ebitda: 31, netProfit: 21 },
  { year: "FY27", revenue: 155, ebitda: 44, netProfit: 30 },
  { year: "FY28", revenue: 205, ebitda: 60, netProfit: 42 },
  { year: "FY29", revenue: 270, ebitda: 82, netProfit: 58 },
];

const BUDGET_VS_ACTUAL_DATA = [
  { category: "Capex", planned: 45, actual: 40 },
  { category: "Opex", planned: 28, actual: 26 },
  { category: "R&D", planned: 18, actual: 15 },
  { category: "Marketing", planned: 12, actual: 11 },
  { category: "Operations", planned: 22, actual: 20 },
];

function BusinessPlanningPage() {
  const [currentStage, setCurrentStage] = useState(1);
  const [fiscalYear, setFiscalYear] = useState("FY 2026-27");
  const [businessUnit, setBusinessUnit] = useState("EV Charging Infrastructure");
  const [planStatus, setPlanStatus] = useState("Draft");

  // Form Fields State
  const [formData, setFormData] = useState({
    code: "BP-2026-01",
    name: "BharatMandeer - FY 2026-27 Business Plan",
    planType: "Annual Business Plan",
    org: "BharatMandeer Private Limited",
    unit: "EV Charging Infrastructure",
    period: "01 Apr 2026 - 31 Mar 2027",
    horizon: "1 Year",
    owner: "Arun Kumar",
    sponsor: "R. Meenakshi (Chairperson)",
    priority: "High",
    version: "1.0",
    description:
      "Expand autonomous wireless EV charging infrastructure across India through franchise model, with focus on highways and urban hubs. Build scalable manufacturing, strengthen supply chain, and achieve profitable growth.",
  });

  // Business Objectives
  const [objectives, setObjectives] = useState([
    { id: 1, name: "Achieve ₹120 Cr Revenue", category: "Financial", target: "120 Cr", progress: 65, status: "On Track" },
    { id: 2, name: "Achieve 15% EBITDA Margin", category: "Financial", target: "15%", progress: 60, status: "On Track" },
    { id: 3, name: "Deploy 5,000 Charging Stations", category: "Customer", target: "5,000", progress: 40, status: "At Risk" },
    { id: 4, name: "Launch 3 New Products", category: "Innovation", target: "3", progress: 33, status: "At Risk" },
    { id: 5, name: "Achieve 90% Customer Satisfaction", category: "Customer", target: "90%", progress: 75, status: "On Track" },
  ]);

  // Strategic Initiatives
  const [initiatives] = useState([
    { id: 1, name: "Highway Charging Network", owner: "S. Ravi", budget: 35.0, progress: 70, status: "On Track" },
    { id: 2, name: "Manufacturing Scale-up", owner: "M. Prakash", budget: 18.0, progress: 50, status: "At Risk" },
    { id: 3, name: "Franchise Expansion", owner: "K. Meena", budget: 12.0, progress: 45, status: "At Risk" },
    { id: 4, name: "Product R&D (Gen 2)", owner: "A. Khan", budget: 10.0, progress: 30, status: "At Risk" },
    { id: 5, name: "Digital Platform & IoT", owner: "P. Nithya", budget: 8.0, progress: 60, status: "On Track" },
  ]);

  // Plan Milestones
  const [milestones] = useState([
    { id: 1, name: "Finalize Business Plan", dueDate: "15 Jan 2026", progress: 100, status: "Completed" },
    { id: 2, name: "Secure Funding", dueDate: "28 Feb 2026", progress: 80, status: "On Track" },
    { id: 3, name: "Start Manufacturing", dueDate: "30 Apr 2026", progress: 50, status: "At Risk" },
    { id: 4, name: "Launch Pilot Stations", dueDate: "30 Jun 2026", progress: 40, status: "At Risk" },
    { id: 5, name: "Commercial Launch", dueDate: "30 Sep 2026", progress: 20, status: "Planned" },
  ]);

  // Risks
  const [risks] = useState([
    { id: 1, name: "Regulatory approval delay", impact: "High", prob: "60%", status: "Open" },
    { id: 2, name: "Supply chain constraints", impact: "High", prob: "50%", status: "Open" },
    { id: 3, name: "High capital requirement", impact: "Medium", prob: "50%", status: "Mitigation" },
    { id: 4, name: "Market demand lower than forecast", impact: "Medium", prob: "30%", status: "Monitoring" },
    { id: 5, name: "Technology integration risk", impact: "Medium", prob: "40%", status: "Open" },
  ]);

  // Modal State
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  const [newObjName, setNewObjName] = useState("");
  const [newObjCategory, setNewObjCategory] = useState("Financial");
  const [newObjTarget, setNewObjTarget] = useState("");

  // AI Assistant Chat State
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hi! I can help you with business planning. Ask about revenue models, risk mitigation, or strategic alignment." },
  ]);
  const [aiQuery, setAiQuery] = useState("");

  const handleSaveDraft = () => {
    toast.success("Business Plan Draft Saved", {
      description: `Plan ${formData.code} version ${formData.version} saved successfully.`,
    });
  };

  const handleApprovePlan = () => {
    setPlanStatus("Approved");
    setCurrentStage(5);
    toast.success("Business Plan Approved", {
      description: "Business plan approved and forwarded for Operational Execution.",
    });
  };

  const handleAddObjective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjName.trim()) return;
    const newObj = {
      id: objectives.length + 1,
      name: newObjName,
      category: newObjCategory,
      target: newObjTarget || "100%",
      progress: 0,
      status: "On Track",
    };
    setObjectives([...objectives, newObj]);
    setNewObjName("");
    setNewObjTarget("");
    setIsObjectiveModalOpen(false);
    toast.success("Objective Added", {
      description: `"${newObj.name}" added to business plan objectives.`,
    });
  };

  const handleAiAsk = (promptText?: string) => {
    const q = promptText || aiQuery;
    if (!q.trim()) return;
    const userMsg = { sender: "user" as const, text: q };
    setAiChatMessages((prev) => [...prev, userMsg]);
    setAiQuery("");

    setTimeout(() => {
      let reply = `Based on the FY 2026-27 Business Plan, your revenue target of ₹120 Cr represents a 150% growth. Current CAPEX allocation of ₹35 Cr is on track with 5,000 charging station targets.`;
      if (q.toLowerCase().includes("risk")) {
        reply = `Top critical risks identified: 1. Regulatory approval delay (60% prob), 2. Supply chain constraints (50% prob). Recommend prioritizing pre-approvals for highway corridors.`;
      } else if (q.toLowerCase().includes("growth") || q.toLowerCase().includes("strategy")) {
        reply = `Growth trajectory hinges on Franchise Expansion (₹12 Cr budget) and High-Speed Highway Networks. Unit economics show positive gross margin within 14 months of deployment.`;
      }
      setAiChatMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 600);
  };

  return (
    <AppShell
      title="Business Planning"
      breadcrumb="Management"
      description="Plan. Align. Allocate. Execute. Achieve Growth."
      tabs={<StrategyManagementTabBar />}
    >
      <div className="space-y-5 pb-16">
        {/* Top Header Card */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-xl bg-card p-4 border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Business Planning</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  {formData.code}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Plan. Align. Allocate. Execute. Achieve Growth.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="h-9 px-3 text-xs font-medium rounded-lg border bg-background text-foreground shadow-2xs hover:bg-muted/50 cursor-pointer"
            >
              <option value="FY 2026-27">FY 2026-27</option>
              <option value="FY 2025-26">FY 2025-26</option>
              <option value="FY 2027-28">FY 2027-28</option>
            </select>

            <select
              value={businessUnit}
              onChange={(e) => setBusinessUnit(e.target.value)}
              className="h-9 px-3 text-xs font-medium rounded-lg border bg-background text-foreground shadow-2xs hover:bg-muted/50 cursor-pointer"
            >
              <option value="EV Charging Infrastructure">Business Unit: EV Charging</option>
              <option value="Manufacturing">Business Unit: Manufacturing</option>
              <option value="Clean Energy">Business Unit: Clean Energy</option>
              <option value="All Business Units">All Business Units</option>
            </select>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="h-9 px-3.5 text-xs font-semibold rounded-lg border bg-background hover:bg-muted text-foreground flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Save className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={handleApprovePlan}
              className="h-9 px-4 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Approve Plan</span>
            </button>
          </div>
        </div>

        {/* Lifecycle Stepper */}
        <div className="bg-card border rounded-xl p-3 shadow-2xs overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[700px] px-2">
            {PLANNING_STAGES.map((st, idx) => {
              const isActive = currentStage === st.id;
              const isPast = currentStage > st.id;
              return (
                <div key={st.id} className="flex items-center flex-1 last:flex-none">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStage(st.id);
                      toast.info(`Switched stage view to: ${st.name}`);
                    }}
                    className="flex items-center gap-2 cursor-pointer group focus:outline-none"
                  >
                    <div
                      className={cn(
                        "h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center transition-all",
                        isActive
                          ? "bg-blue-600 text-white ring-4 ring-blue-600/20"
                          : isPast
                          ? "bg-emerald-500 text-white"
                          : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                      )}
                    >
                      {isPast ? <Check className="h-3.5 w-3.5" /> : st.id}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-semibold transition-colors",
                        isActive ? "text-blue-600" : isPast ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {st.name}
                    </span>
                  </button>
                  {idx < PLANNING_STAGES.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-3 rounded transition-all",
                        isPast ? "bg-emerald-500" : "bg-border"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 7 Metric Score Banner (Executive Standard) */}
        <StrategyScoreBanner moduleName="Business Planning" />

        {/* Plan Details & Primary View */}
        <div className="space-y-5">
            {/* Top Row: Plan Details Form + Plan Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Form Card (5 cols) */}
              <div className="lg:col-span-5 bg-card border rounded-xl p-4 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b pb-2.5">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    <span>Plan Details</span>
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    Status: {planStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Business Plan Code <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground font-mono text-xs focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Plan Type <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={formData.planType}
                      onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                      className="w-full h-8 px-2 rounded-lg border bg-background text-foreground text-xs"
                    >
                      <option>Annual Business Plan</option>
                      <option>Corporate Business Plan</option>
                      <option>Strategic Business Plan</option>
                      <option>Growth Plan</option>
                      <option>Transformation Plan</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Business Plan Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Organization</label>
                    <input
                      type="text"
                      value={formData.org}
                      disabled
                      className="w-full h-8 px-2.5 rounded-lg border bg-muted/40 text-muted-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Business Unit</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Planning Period</label>
                    <input
                      type="text"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Planning Horizon</label>
                    <select
                      value={formData.horizon}
                      onChange={(e) => setFormData({ ...formData, horizon: e.target.value })}
                      className="w-full h-8 px-2 rounded-lg border bg-background text-foreground text-xs"
                    >
                      <option>1 Year</option>
                      <option>3 Years</option>
                      <option>5 Years</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Plan Owner</label>
                    <input
                      type="text"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Executive Sponsor</label>
                    <input
                      type="text"
                      value={formData.sponsor}
                      onChange={(e) => setFormData({ ...formData, sponsor: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full h-8 px-2 rounded-lg border bg-background text-foreground text-xs"
                    >
                      <option>High</option>
                      <option>Strategic</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Version</label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs font-mono"
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Plan Description</label>
                      <span className="text-[10px] text-muted-foreground">224/1000</span>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-2.5 rounded-lg border bg-background text-foreground text-xs leading-relaxed focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Right Side: KPI Cards + Revenue Chart + AI Assistant (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* 6 Metric KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-card border rounded-xl p-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-muted-foreground">Revenue Target</span>
                      <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <DollarSign className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-xl font-bold text-foreground mt-1">₹ 120 Cr</div>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                      <ArrowUpRight className="h-3 w-3" /> +150% vs FY25
                    </span>
                  </div>

                  <div className="bg-card border rounded-xl p-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-muted-foreground">EBITDA Target</span>
                      <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-xl font-bold text-foreground mt-1">₹ 24 Cr</div>
                    <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 mt-0.5">
                      <ArrowUpRight className="h-3 w-3" /> +180% vs FY25
                    </span>
                  </div>

                  <div className="bg-card border rounded-xl p-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-muted-foreground">Investment (CAPEX)</span>
                      <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                        <Layers className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-xl font-bold text-foreground mt-1">₹ 35 Cr</div>
                    <span className="text-[10px] text-purple-600 font-semibold flex items-center gap-0.5 mt-0.5">
                      <ArrowUpRight className="h-3 w-3" /> +75% vs FY25
                    </span>
                  </div>

                  <div className="bg-card border rounded-xl p-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-muted-foreground">Charging Stations</span>
                      <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                        <Zap className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-xl font-bold text-foreground mt-1">5,000</div>
                    <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5 mt-0.5">
                      <ArrowUpRight className="h-3 w-3" /> +300% vs FY25
                    </span>
                  </div>

                  <div className="bg-card border rounded-xl p-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-muted-foreground">Strategic Initiatives</span>
                      <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                        <Target className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-xl font-bold text-foreground mt-1">12</div>
                    <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-0.5 mt-0.5">
                      <ArrowUpRight className="h-3 w-3" /> 9 New
                    </span>
                  </div>

                  <div className="bg-card border rounded-xl p-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-muted-foreground">Total KPIs</span>
                      <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-xl font-bold text-foreground mt-1">78</div>
                    <span className="text-[10px] text-cyan-600 font-semibold flex items-center gap-0.5 mt-0.5">
                      <ArrowUpRight className="h-3 w-3" /> 25 New
                    </span>
                  </div>
                </div>

                {/* Revenue & Profitability Forecast Chart */}
                <div className="bg-card border rounded-xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Revenue & Profitability Forecast</h4>
                      <p className="text-[11px] text-muted-foreground">5-Year Growth Projections</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                      ₹ Crore
                    </span>
                  </div>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={FORECAST_DATA}>
                        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <RechartsTooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="ebitda" name="EBITDA" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Line type="monotone" dataKey="netProfit" name="Net Profit" stroke="#f59e0b" strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Row: Strategic Alignment + Business Objectives + Initiatives */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Strategic Alignment Card (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-blue-600" />
                    <span>Strategic Alignment</span>
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    95% Aligned
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-muted/40 border">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Vision</span>
                    <p className="font-medium text-foreground mt-0.5">Leader in autonomous wireless EV charging infrastructure</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/40 border">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Mission</span>
                    <p className="font-medium text-foreground mt-0.5">Design, manufacture and deploy next-generation charging solutions</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/40 border">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Strategic Theme</span>
                    <p className="font-medium text-foreground mt-0.5">Growth | Innovation | Customer | Sustainability</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                      <span className="text-[10px] text-muted-foreground">Strategic Objectives</span>
                      <div className="font-bold text-sm text-foreground">6 Mapped</div>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                      <span className="text-[10px] text-muted-foreground">OKRs Linked</span>
                      <div className="font-bold text-sm text-foreground">12 Linked</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Objectives Table (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-2 mb-3">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-emerald-600" />
                      <span>Business Objectives ({objectives.length})</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsObjectiveModalOpen(true)}
                      className="text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar pr-1">
                    {objectives.map((obj) => (
                      <div key={obj.id} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between text-xs">
                        <div className="space-y-0.5 flex-1 pr-2">
                          <div className="font-medium text-foreground">{obj.name}</div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{obj.category}</span>
                            <span>•</span>
                            <span className="font-semibold text-foreground">Target: {obj.target}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0.5 rounded",
                              obj.status === "On Track"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            )}
                          >
                            {obj.progress}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Initiatives Table (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span>Initiatives ({initiatives.length})</span>
                  </h4>
                  <Link
                    to="/management/strategy-management/strategic-initiatives"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                  {initiatives.map((init) => (
                    <div key={init.id} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="font-medium text-foreground">{init.name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          Owner: {init.owner} • Budget: ₹ {init.budget} Cr
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                            init.status === "On Track"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          )}
                        >
                          {init.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lower Row: Budget vs Actual + Milestones + Top Risks + AI Assistant */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Budget vs Actual (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-3 border-b pb-2">
                  <h4 className="font-bold text-sm text-foreground">Budget vs Actual</h4>
                  <span className="text-[11px] text-muted-foreground">₹ Crore</span>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={BUDGET_VS_ACTUAL_DATA}>
                      <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <RechartsTooltip />
                      <Bar dataKey="planned" name="Planned" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Milestones (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-3 border-b pb-2">
                  <h4 className="font-bold text-sm text-foreground">Plan Milestones</h4>
                  <span className="text-xs text-muted-foreground">{milestones.length} Key Milestones</span>
                </div>
                <div className="space-y-2 text-xs">
                  {milestones.map((m) => (
                    <div key={m.id} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">{m.name}</div>
                        <div className="text-[10px] text-muted-foreground">Due: {m.dueDate}</div>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          m.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : m.status === "On Track"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        )}
                      >
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Planning Assistant (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span>AI Planning Assistant</span>
                    </h4>
                    <span className="text-[10px] font-semibold text-blue-600 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950">
                      GPT-4o
                    </span>
                  </div>

                  {/* Quick Prompts */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {[
                      "Summarize this business plan",
                      "Show key risks and mitigation",
                      "Suggest revenue growth strategies",
                    ].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleAiAsk(p)}
                        className="text-[10px] px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-foreground border transition-colors cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {/* Chat Stream */}
                  <div className="space-y-2 h-36 overflow-y-auto no-scrollbar p-1 rounded-lg bg-muted/20 border mb-2 text-xs">
                    {aiChatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={cn(
                          "p-2 rounded-lg text-xs leading-relaxed",
                          msg.sender === "user"
                            ? "bg-blue-600 text-white ml-6"
                            : "bg-background border text-foreground mr-6 shadow-2xs"
                        )}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input box */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAiAsk();
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    placeholder="Ask about this plan..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="flex-1 h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="submit"
                    className="h-8 w-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

      {/* Modal: Add Objective */}
      {isObjectiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-foreground">Add Business Objective</h3>
              <button
                type="button"
                onClick={() => setIsObjectiveModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddObjective} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-muted-foreground block mb-1">Objective Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Achieve 20% Net Margin"
                  value={newObjName}
                  onChange={(e) => setNewObjName(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-muted-foreground block mb-1">Category</label>
                <select
                  value={newObjCategory}
                  onChange={(e) => setNewObjCategory(e.target.value)}
                  className="w-full h-8 px-2 rounded-lg border bg-background text-foreground text-xs"
                >
                  <option>Financial</option>
                  <option>Customer</option>
                  <option>Operational</option>
                  <option>Innovation</option>
                  <option>People</option>
                  <option>Sustainability</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-muted-foreground block mb-1">Target Value</label>
                <input
                  type="text"
                  placeholder="e.g. ₹50 Cr or 95%"
                  value={newObjTarget}
                  onChange={(e) => setNewObjTarget(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsObjectiveModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Save Objective
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
