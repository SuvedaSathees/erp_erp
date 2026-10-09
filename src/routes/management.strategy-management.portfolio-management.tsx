import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { StrategyManagementTabBar } from "@/components/erp/StrategyManagementTabBar";
import { StrategyScoreBanner } from "@/components/erp/StrategyScoreBanner";
import {
  FolderKanban,
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
  ArrowDownRight,
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
  Activity,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useModuleDataset, usePersistentState } from "@/services/moduleDatasetService";
import { openPageViewer } from "@/lib/pageActions";
export const Route = createFileRoute("/management/strategy-management/portfolio-management")({
  head: () => ({
    meta: [
      { title: "Portfolio Management · Strategy Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Manage investments across projects, products, and strategic initiatives. Prioritize capital, optimize resources, and deliver strategic return.",
      },
    ],
  }),
  component: PortfolioManagementPage,
});

// 11 Lifecycle Stages
const LIFECYCLE_STAGES = [
  { id: 1, name: "Define" },
  { id: 2, name: "Evaluate" },
  { id: 3, name: "Prioritize" },
  { id: 4, name: "Invest" },
  { id: 5, name: "Allocate" },
  { id: 6, name: "Execute" },
  { id: 7, name: "Monitor" },
  { id: 8, name: "Rebalance" },
  { id: 9, name: "Realize Value" },
  { id: 10, name: "Review" },
  { id: 11, name: "Improve" },
];

const COMPOSITION_DATA = [
  { name: "Initiatives", value: 12, color: "#3b82f6" },
  { name: "Projects", value: 8, color: "#10b981" },
  { name: "Products", value: 5, color: "#8b5cf6" },
  { name: "Programs", value: 3, color: "#f59e0b" },
];

const CATEGORY_INVESTMENTS = [
  { category: "Infrastructure & Charging", amount: 45, pct: 38 },
  { category: "Manufacturing & Robotics", amount: 35, pct: 29 },
  { category: "Digital & IoT Cloud", amount: 22, pct: 18 },
  { category: "Market Expansion", amount: 18, pct: 15 },
];

const BUDGET_VS_ACTUAL = [
  { name: "Q1", planned: 28, actual: 26 },
  { name: "Q2", planned: 32, actual: 30 },
  { name: "Q3", planned: 35, actual: 31 },
  { name: "Q4", planned: 25, actual: 20 },
];

const PORTFOLIO_INVESTMENTS = [
    { id: 1, name: "Autonomous Charging Stations", type: "Initiative", amount: 45, benefit: 80, roi: 28, status: "In Progress" },
    { id: 2, name: "Manufacturing Scale-up", type: "Project", amount: 25, benefit: 40, roi: 20, status: "In Progress" },
    { id: 3, name: "Digital Platform & IoT", type: "Project", amount: 12, benefit: 25, roi: 32, status: "On Track" },
    { id: 4, name: "Market Expansion (South India)", type: "Initiative", amount: 10, benefit: 18, roi: 25, status: "At Risk" },
    { id: 5, name: "Product R&D (Gen 2)", type: "Project", amount: 8, benefit: 15, roi: 25, status: "On Track" },
  ];

const PAGE_DATASET = { LIFECYCLE_STAGES, COMPOSITION_DATA, CATEGORY_INVESTMENTS, BUDGET_VS_ACTUAL, investments: PORTFOLIO_INVESTMENTS };

function PortfolioManagementPage() {
  const { LIFECYCLE_STAGES, COMPOSITION_DATA, CATEGORY_INVESTMENTS, BUDGET_VS_ACTUAL } = useModuleDataset("strategy-management.portfolio-management", "Portfolio Management", PAGE_DATASET);
  const [currentLifecycle, setCurrentLifecycle] = usePersistentState("strategy-management.portfolio-management", "Portfolio Management", "currentLifecycle", 5); // Allocate
  const [fiscalYear, setFiscalYear] = useState("FY 2026-27");
  const [businessUnit, setBusinessUnit] = useState("All Business Units");
  const [portfolioStatus, setPortfolioStatus] = usePersistentState("strategy-management.portfolio-management", "Portfolio Management", "portfolioStatus", "In Progress");

  // Form Fields State
  const [formData, setFormData] = usePersistentState("strategy-management.portfolio-management", "Portfolio Management", "formData", {
    code: "PORT-2026-01",
    name: "EV Charging Infrastructure Portfolio",
    type: "Growth Portfolio",
    org: "BharatMandeer Private Limited",
    units: ["EV Charging", "Manufacturing"],
    period: "01 Apr 2026 - 31 Mar 2029",
    horizon: "3 Years",
    owner: "Arun Kumar",
    sponsor: "R. Meenakshi (Chairperson)",
    priority: "High",
    risk: "Medium",
    strategyRef: "EV Charging Infrastructure Expansion",
    primaryObjective: "Increase Market Share to 15% by FY29",
    roi: 22,
    allocation: 120,
    healthScore: 78,
    description:
      "Invest in autonomous wireless EV charging infrastructure, manufacturing scale-up, market expansion, digital platform and partnerships to achieve market leadership in India.",
  });

  // Investments Live Table
  const [investments, setInvestments] = usePersistentState("strategy-management.portfolio-management", "Portfolio Management", "investments", PORTFOLIO_INVESTMENTS);

  // Risks Live Table
  const [risks] = useState([
    { id: 1, risk: "Supply chain constraints", impact: "High", prob: "50%", status: "Open" },
    { id: 2, risk: "Regulatory approval delay", impact: "High", prob: "40%", status: "Mitigation" },
    { id: 3, risk: "High capital requirement", impact: "Medium", prob: "50%", status: "Open" },
    { id: 4, risk: "Market demand lower than forecast", impact: "Medium", prob: "30%", status: "Monitoring" },
    { id: 5, risk: "Technology integration risk", impact: "Medium", prob: "40%", status: "Mitigation" },
  ]);

  // Modal State
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [newInvestName, setNewInvestName] = useState("");
  const [newInvestType, setNewInvestType] = useState("Initiative");
  const [newInvestAmount, setNewInvestAmount] = useState<number>(10);
  const [newInvestBenefit, setNewInvestBenefit] = useState<number>(20);

  // AI Assistant Chat State
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hi! I can help you with portfolio management. Ask about investment ROI, resource allocation, or portfolio rebalancing options." },
  ]);
  const [aiQuery, setAiQuery] = useState("");

  const handleSaveDraft = () => {
    toast.success("Portfolio Draft Saved", {
      description: `Portfolio ${formData.code} saved successfully.`,
    });
  };

  const handleApprovePortfolio = () => {
    setPortfolioStatus("Approved");
    setCurrentLifecycle(6); // Execute
    toast.success("Portfolio Approved", {
      description: "Portfolio approved and transitioned into Execution phase.",
    });
  };

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvestName.trim()) return;
    const calcRoi = Math.round(((newInvestBenefit - newInvestAmount) / newInvestAmount) * 100);
    const newInv = {
      id: investments.length + 1,
      name: newInvestName,
      type: newInvestType,
      amount: Number(newInvestAmount),
      benefit: Number(newInvestBenefit),
      roi: calcRoi > 0 ? calcRoi : 15,
      status: "In Progress",
    };
    setInvestments([...investments, newInv]);
    setNewInvestName("");
    setIsInvestModalOpen(false);
    toast.success("Investment Added", {
      description: `"${newInv.name}" added to portfolio investment register.`,
    });
  };

  const handleAiAsk = (promptText?: string) => {
    const q = promptText || aiQuery;
    if (!q.trim()) return;
    setAiChatMessages((prev) => [...prev, { sender: "user", text: q }]);
    setAiQuery("");

    setTimeout(() => {
      let reply = `Portfolio ${formData.code} has 28 total investments with ₹120 Cr allocated and ₹185 Cr expected benefits. Portfolio Health score is 78 (Healthy).`;
      if (q.toLowerCase().includes("risk")) {
        reply = `Identified 6 at-risk investments. Highest priority risk is 'Supply chain constraints' (High Impact, 50% Prob). Recommend buffering supplier contracts.`;
      } else if (q.toLowerCase().includes("rebalance")) {
        reply = `Rebalancing signal: Capital concentration in Infrastructure (38%) is high. Suggest reallocating 5% to Digital Platform & IoT to increase ROI to 25%.`;
      } else if (q.toLowerCase().includes("roi")) {
        reply = `Expected overall Portfolio ROI is 22%, driven by Digital Platform (32% ROI) and Autonomous Charging Stations (28% ROI).`;
      }
      setAiChatMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 600);
  };

  return (
    <AppShell
      title="Portfolio Management"
      breadcrumb="Management"
      description="Manage Investments. Align with Strategy. Deliver Value."
      tabs={<StrategyManagementTabBar />}
    >
      <div className="space-y-5 pb-16">
        {/* Top Header Card */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-xl bg-card p-4 border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
              <FolderKanban className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Portfolio Management</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  {formData.code}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Manage Investments. Align with Strategy. Deliver Value.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="h-9 px-3 text-xs font-medium rounded-lg border bg-background text-foreground shadow-2xs cursor-pointer"
            >
              <option value="FY 2026-27">FY 2026-27</option>
              <option value="FY 2025-26">FY 2025-26</option>
              <option value="FY 2027-28">FY 2027-28</option>
            </select>

            <select
              value={businessUnit}
              onChange={(e) => setBusinessUnit(e.target.value)}
              className="h-9 px-3 text-xs font-medium rounded-lg border bg-background text-foreground shadow-2xs cursor-pointer"
            >
              <option value="All Business Units">All Business Units</option>
              <option value="EV Charging">EV Charging</option>
              <option value="Manufacturing">Manufacturing</option>
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
              onClick={handleApprovePortfolio}
              className="h-9 px-4 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Approve Portfolio</span>
            </button>
          </div>
        </div>

        {/* 7 Metric Score Banner (Executive Standard) */}
        <StrategyScoreBanner moduleName="Portfolio" />

        {/* Portfolio Lifecycle Stepper (11 Stages) */}
        <div className="bg-card border rounded-xl p-3 shadow-2xs overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Portfolio Lifecycle
            </span>
            <button
              type="button"
              onClick={(e) => openPageViewer("Opening full lifecycle governance workflow", e.currentTarget)}
              className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              View Workflow
            </button>
          </div>
          <div className="flex items-center justify-between min-w-[850px] px-2">
            {LIFECYCLE_STAGES.map((st, idx) => {
              const isActive = currentLifecycle === st.id;
              const isPast = currentLifecycle > st.id;
              return (
                <div key={st.id} className="flex items-center flex-1 last:flex-none">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLifecycle(st.id);
                      toast.info(`Portfolio stage shifted to: ${st.name}`);
                    }}
                    className="flex items-center gap-1.5 cursor-pointer group focus:outline-none"
                  >
                    <div
                      className={cn(
                        "h-6 w-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-all",
                        isActive
                          ? "bg-blue-600 text-white ring-4 ring-blue-600/20"
                          : isPast
                          ? "bg-emerald-500 text-white"
                          : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                      )}
                    >
                      {isPast ? <Check className="h-3 w-3" /> : st.id}
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-semibold transition-colors",
                        isActive ? "text-blue-600" : isPast ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {st.name}
                    </span>
                  </button>
                  {idx < LIFECYCLE_STAGES.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-2 rounded transition-all",
                        isPast ? "bg-emerald-500" : "bg-border"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Overview Form & Analytics */}
        <div className="space-y-5">
            {/* Top Grid: Form (8 cols) + Strategy & AI (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Portfolio Master Form (8 cols) */}
              <div className="lg:col-span-8 bg-card border rounded-xl p-4 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b pb-2.5">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <FolderKanban className="h-4 w-4 text-blue-600" />
                    <span>Portfolio Form - Overview</span>
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    Status: {portfolioStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Portfolio Code <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background font-mono text-xs focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Portfolio Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background text-xs font-semibold focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Portfolio Type <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full h-8 px-2 rounded-lg border bg-background text-xs"
                    >
                      <option>Growth Portfolio</option>
                      <option>Strategic Portfolio</option>
                      <option>Innovation Portfolio</option>
                      <option>Technology Portfolio</option>
                      <option>Operational Excellence Portfolio</option>
                    </select>
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
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Business Units</label>
                    <div className="flex items-center gap-1 h-8 px-2 rounded-lg border bg-background">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-medium">EV Charging ×</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-medium">Manufacturing ×</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Planning Period</label>
                    <input
                      type="text"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Portfolio Owner</label>
                    <input
                      type="text"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Executive Sponsor</label>
                    <input
                      type="text"
                      value={formData.sponsor}
                      onChange={(e) => setFormData({ ...formData, sponsor: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Investment Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full h-8 px-2 rounded-lg border bg-background text-xs"
                    >
                      <option>High</option>
                      <option>Strategic</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Strategy Reference</label>
                    <input
                      type="text"
                      value={formData.strategyRef}
                      onChange={(e) => setFormData({ ...formData, strategyRef: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Primary Objective</label>
                    <input
                      type="text"
                      value={formData.primaryObjective}
                      onChange={(e) => setFormData({ ...formData, primaryObjective: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Resource Allocation (₹ Cr)</label>
                    <input
                      type="number"
                      value={formData.allocation}
                      onChange={(e) => setFormData({ ...formData, allocation: Number(e.target.value) })}
                      className="w-full h-8 px-2.5 rounded-lg border bg-background font-bold text-xs"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-2.5 rounded-lg border bg-background text-xs leading-relaxed focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Strategy Alignment & AI (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                {/* Strategic Alignment Card */}
                <div className="bg-card border rounded-xl p-4 shadow-2xs space-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Compass className="h-4 w-4 text-blue-600" />
                      <span>Strategy Alignment</span>
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      95% Score
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-muted/30 border">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground block">Vision</span>
                    <p className="font-medium text-foreground">Global leader in autonomous EV charging infrastructure</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30 border">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground block">Mission</span>
                    <p className="font-medium text-foreground">Design, manufacture and deploy next-gen solutions</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-muted/20 border">
                      <span className="text-[10px] text-muted-foreground">Aligned OKRs</span>
                      <div className="font-bold text-foreground">3 OKRs linked</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/20 border">
                      <span className="text-[10px] text-muted-foreground">Balanced Scorecard</span>
                      <div className="font-bold text-foreground">5 Perspectives</div>
                    </div>
                  </div>
                </div>

                {/* AI Portfolio Assistant Card */}
                <div className="bg-card border rounded-xl p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span>AI Portfolio Assistant</span>
                    </h4>
                    <span className="text-[10px] font-semibold text-blue-600 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950">
                      AI Active
                    </span>
                  </div>

                  {/* Quick chips */}
                  <div className="flex flex-wrap gap-1">
                    {[
                      "Summarize this portfolio",
                      "Suggest portfolio rebalancing options",
                      "Which projects are at risk?",
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

                  {/* Messages */}
                  <div className="space-y-1.5 h-28 overflow-y-auto no-scrollbar p-1 rounded-lg bg-muted/20 border text-xs">
                    {aiChatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={cn(
                          "p-2 rounded-lg text-xs leading-relaxed",
                          msg.sender === "user"
                            ? "bg-blue-600 text-white ml-4"
                            : "bg-background border text-foreground mr-4 shadow-2xs"
                        )}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  {/* Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAiAsk();
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <input
                      type="text"
                      placeholder="Ask a question about this portfolio..."
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

            {/* Middle Analytics: Composition Donut + Category Bar + Health Score */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Portfolio Composition Donut (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <h4 className="font-bold text-sm text-foreground">Portfolio Composition</h4>
                  <span className="text-xs text-muted-foreground font-semibold">28 Investments</span>
                </div>
                <div className="h-44 w-full flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={COMPOSITION_DATA}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={2}
                      >
                        {COMPOSITION_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                  {COMPOSITION_DATA.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-muted-foreground">
                      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment by Category (5 cols) */}
              <div className="lg:col-span-5 bg-card border rounded-xl p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-sm text-foreground">Investment by Category (₹ Cr)</h4>
                  <span className="text-xs text-muted-foreground font-semibold">Total ₹120 Cr</span>
                </div>
                <div className="space-y-2 pt-1">
                  {CATEGORY_INVESTMENTS.map((cat) => (
                    <div key={cat.category} className="space-y-0.5 text-xs">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-medium text-foreground">{cat.category}</span>
                        <span className="font-bold text-muted-foreground">₹{cat.amount} Cr ({cat.pct}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${cat.pct * 2.2}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Health Gauge Card (3 cols) */}
              <div className="lg:col-span-3 bg-card border rounded-xl p-4 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <h4 className="font-bold text-sm text-foreground">Portfolio Health</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                      Healthy
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-3">
                    <div className="relative h-28 w-28 rounded-full border-8 border-emerald-500/20 border-t-emerald-500 border-r-emerald-500 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-foreground">{formData.healthScore}</span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase">Score</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] space-y-1 text-muted-foreground pt-1 border-t">
                  <div className="flex justify-between"><span>90-100: Excellent</span><span className="text-emerald-600 font-bold">●</span></div>
                  <div className="flex justify-between"><span>70-89: Healthy</span><span className="text-blue-600 font-bold">●</span></div>
                  <div className="flex justify-between"><span>50-69: Watch</span><span className="text-amber-500 font-bold">●</span></div>
                  <div className="flex justify-between"><span>30-49: At Risk</span><span className="text-rose-500 font-bold">●</span></div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Key Investments Table + Budget vs Actual + Top Risks */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Key Investments (5 cols) */}
              <div className="lg:col-span-5 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="font-bold text-sm text-foreground">Key Investments / Initiatives</h4>
                  <button
                    type="button"
                    onClick={() => setIsInvestModalOpen(true)}
                    className="text-xs px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Investment
                  </button>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                  {investments.map((inv) => (
                    <div key={inv.id} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-foreground">{inv.name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {inv.type} • ₹{inv.amount} Cr Invest • Expected Benefit: ₹{inv.benefit} Cr
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600 text-[11px]">{inv.roi}% ROI</div>
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full inline-block mt-0.5",
                            inv.status === "On Track"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : inv.status === "In Progress"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          )}
                        >
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget vs Actual (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="font-bold text-sm text-foreground">Budget vs Actual (₹ Cr)</h4>
                  <span className="text-[11px] text-muted-foreground">Planned vs Actual</span>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={BUDGET_VS_ACTUAL}>
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <RechartsTooltip />
                      <Bar dataKey="planned" name="Planned" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Risks (3 cols) */}
              <div className="lg:col-span-3 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="font-bold text-sm text-foreground">Top Risks</h4>
                  <span className="text-xs text-muted-foreground">{risks.length} Tracked</span>
                </div>
                <div className="space-y-2 text-xs">
                  {risks.map((r) => (
                    <div key={r.id} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium text-foreground truncate max-w-[130px]">{r.risk}</div>
                        <div className="text-[10px] text-muted-foreground">Impact: {r.impact} • {r.prob}</div>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded",
                          r.status === "Open"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        )}
                      >
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Modal: Add Investment */}
      {isInvestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-foreground">Add Portfolio Investment</h3>
              <button
                type="button"
                onClick={() => setIsInvestModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddInvestment} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-muted-foreground block mb-1">Investment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultra-Fast Highway Hubs"
                  value={newInvestName}
                  onChange={(e) => setNewInvestName(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-muted-foreground block mb-1">Classification Type</label>
                <select
                  value={newInvestType}
                  onChange={(e) => setNewInvestType(e.target.value)}
                  className="w-full h-8 px-2 rounded-lg border bg-background text-foreground text-xs"
                >
                  <option>Initiative</option>
                  <option>Project</option>
                  <option>Product</option>
                  <option>Program</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Investment (₹ Cr)</label>
                  <input
                    type="number"
                    required
                    value={newInvestAmount}
                    onChange={(e) => setNewInvestAmount(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Expected Benefit (₹ Cr)</label>
                  <input
                    type="number"
                    required
                    value={newInvestBenefit}
                    onChange={(e) => setNewInvestBenefit(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsInvestModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Save Investment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
