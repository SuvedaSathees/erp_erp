import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ExecutiveManagementTabBar } from "@/components/erp/ExecutiveManagementTabBar";
import { StrategyScoreBanner } from "@/components/erp/StrategyScoreBanner";
import {
  Activity,
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
  ShieldCheck,
  Users,
  AlertTriangle,
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

export const Route = createFileRoute("/management/executive-management/executive-review")({
  head: () => ({
    meta: [
      { title: "Executive Review · Strategy · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise decision intelligence and executive review framework connecting strategic performance, financial overview, operational metrics, decisions, and accountable action tracking.",
      },
    ],
  }),
  component: ExecutiveReviewPage,
});

// Process Stages
const REVIEW_PROCESS_STAGES = [
  { id: 1, name: "Prepare" },
  { id: 2, name: "Data Collection" },
  { id: 3, name: "Analysis" },
  { id: 4, name: "Executive Review" },
  { id: 5, name: "Decisions" },
  { id: 6, name: "Action Plan" },
  { id: 7, name: "Closure" },
];

// Financial Performance Quarterly Bar Chart Data
const FINANCIAL_QUARTERLY_DATA = [
  { quarter: "Q3 FY25", revenue: 8.5, ebitda: 1.8, netProfit: 0.9 },
  { quarter: "Q4 FY25", revenue: 9.2, ebitda: 1.9, netProfit: 1.0 },
  { quarter: "Q1 FY26", revenue: 10.8, ebitda: 2.3, netProfit: 1.4 },
  { quarter: "Q2 FY26", revenue: 10.9, ebitda: 2.4, netProfit: 1.4 },
  { quarter: "Q3 FY26", revenue: 12.8, ebitda: 2.9, netProfit: 1.8 },
];

// Revenue by Segment Donut
const REVENUE_SEGMENT_DATA = [
  { name: "Public Charging", value: 42, color: "#3b82f6" },
  { name: "Fleet Solutions", value: 22, color: "#10b981" },
  { name: "Residential", value: 15, color: "#f59e0b" },
  { name: "Commercial", value: 12, color: "#8b5cf6" },
  { name: "AMC & Services", value: 6, color: "#06b6d4" },
  { name: "Others", value: 3, color: "#64748b" },
];

// KPI Category Breakdown
const KPI_CATEGORY_DATA = [
  { category: "Financial", target: 85, actual: 92 },
  { category: "Customer", target: 80, actual: 88 },
  { category: "Operations", target: 80, actual: 82 },
  { category: "People", target: 75, actual: 78 },
  { category: "Projects", target: 80, actual: 76 },
  { category: "Quality", target: 90, actual: 96 },
  { category: "Compliance", target: 95, actual: 96 },
  { category: "Sustainability", target: 70, actual: 68 },
];

function ExecutiveReviewPage() {
  const [currentStage, setCurrentStage] = useState(4); // Executive Review
  const [period, setPeriod] = useState("Q3 FY 2026-27");
  const [businessUnit, setBusinessUnit] = useState("All Business Units");
  const [reviewStatus, setReviewStatus] = useState("Executive Review");

  // Review Master State
  const [reviewData, setReviewData] = useState({
    reviewNumber: "ER-2026-03",
    reviewType: "Quarterly Business Review",
    periodLabel: "01 Oct 2026 - 31 Dec 2026",
    organization: "BharatMandeer Private Limited",
    businessUnit: "EV Charging Infrastructure",
    reviewOwner: "R. Meenakshi (Chairperson)",
  });

  // Decisions Live Table
  const [decisions, setDecisions] = useState([
    { id: 1, text: "Approve 3 new product launches", owner: "CTO", dueDate: "31 Jan 2027", status: "Approved" },
    { id: 2, text: "Increase manufacturing capacity", owner: "COO", dueDate: "28 Feb 2027", status: "In Review" },
    { id: 3, text: "Explore external funding (Series A)", owner: "CEO", dueDate: "15 Feb 2027", status: "Open" },
    { id: 4, text: "Strengthen supply chain partners", owner: "COO", dueDate: "28 Feb 2027", status: "Open" },
    { id: 5, text: "Implement cybersecurity upgrade", owner: "CIO", dueDate: "31 Mar 2027", status: "Planned" },
  ]);

  // Actions Live Table
  const [actions, setActions] = useState([
    { id: 1, text: "Finalize product launch plan", owner: "A. Khan", dueDate: "15 Jan 2027", progress: 80, status: "On Track" },
    { id: 2, text: "Resolve supply chain delays", owner: "S. Ravi", dueDate: "31 Jan 2027", progress: 40, status: "At Risk" },
    { id: 3, text: "Improve fleet customer onboarding", owner: "P. Nithya", dueDate: "20 Jan 2027", progress: 60, status: "On Track" },
    { id: 4, text: "Close audit findings", owner: "R. Mani", dueDate: "31 Jan 2027", progress: 30, status: "Delayed" },
    { id: 5, text: "Update sustainability roadmap", owner: "M. Priya", dueDate: "28 Feb 2027", progress: 20, status: "Open" },
  ]);

  // Modals
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [newDecisionText, setNewDecisionText] = useState("");
  const [newDecisionOwner, setNewDecisionOwner] = useState("CEO");
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);

  // AI Assistant Chat State
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hi! I can help you analyze this executive review. Ask about revenue variances, strategic targets, or pending decisions." },
  ]);
  const [aiQuery, setAiQuery] = useState("");

  const handleSaveDraft = () => {
    toast.success("Executive Review Draft Saved", {
      description: `Review ${reviewData.reviewNumber} state recorded.`,
    });
  };

  const handleCompleteReview = () => {
    setReviewStatus("Completed");
    setCurrentStage(7); // Closure
    toast.success("Executive Review Completed", {
      description: "Decisions finalized and action items assigned to executive owners.",
    });
  };

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecisionText.trim()) return;
    const newDec = {
      id: decisions.length + 1,
      text: newDecisionText,
      owner: newDecisionOwner,
      dueDate: "28 Feb 2027",
      status: "Approved",
    };
    setDecisions([...decisions, newDec]);
    setNewDecisionText("");
    setIsDecisionModalOpen(false);
    toast.success("Executive Decision Registered", {
      description: `Decision assigned to ${newDec.owner}.`,
    });
  };

  const handleAiAsk = (promptText?: string) => {
    const q = promptText || aiQuery;
    if (!q.trim()) return;
    setAiChatMessages((prev) => [...prev, { sender: "user", text: q }]);
    setAiQuery("");

    setTimeout(() => {
      let reply = `Executive Review Highlights: Q3 Revenue reached ₹12.8 Cr (+18% vs Q2), EBITDA reached ₹2.9 Cr (+25%). Active projects count is 28 with 2 flagged as delayed.`;
      if (q.toLowerCase().includes("risk")) {
        reply = `Risk Review: 3 high risks detected (Supply chain bottlenecks, regulatory certification for high-voltage hubs). Risk exposure has decreased by 25% since last quarter.`;
      } else if (q.toLowerCase().includes("decision")) {
        reply = `Recommended decisions: 1. Authorize procurement buffer for battery management ICs, 2. Fast-track franchise expansion in Western corridor.`;
      }
      setAiChatMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 600);
  };

  return (
    <AppShell
      title="Executive Review"
      breadcrumb="Management > Strategy > Executive Review"
      description="Review. Decide. Drive Performance."
      tabs={<ExecutiveManagementTabBar />}
    >
      <div className="space-y-5 pb-16">
        {/* Top Header Card */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-xl bg-card p-4 border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Executive Review</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  {reviewData.reviewNumber}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Review. Decide. Drive Performance.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="h-9 px-3 text-xs font-medium rounded-lg border bg-background text-foreground shadow-2xs cursor-pointer"
            >
              <option value="Q3 FY 2026-27">Q3 FY 2026-27 (01 Oct 2026 - 31 Dec 2026)</option>
              <option value="Q2 FY 2026-27">Q2 FY 2026-27 (01 Jul 2026 - 30 Sep 2026)</option>
              <option value="Q1 FY 2026-27">Q1 FY 2026-27 (01 Apr 2026 - 30 Jun 2026)</option>
            </select>

            <select
              value={businessUnit}
              onChange={(e) => setBusinessUnit(e.target.value)}
              className="h-9 px-3 text-xs font-medium rounded-lg border bg-background text-foreground shadow-2xs cursor-pointer"
            >
              <option value="All Business Units">All Business Units</option>
              <option value="EV Charging Infrastructure">EV Charging Infrastructure</option>
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
              onClick={handleCompleteReview}
              className="h-9 px-4 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Complete Review</span>
            </button>
          </div>
        </div>

        {/* Stage Process Stepper (7 stages) */}
        <div className="bg-card border rounded-xl p-3 shadow-2xs overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[700px] px-2">
            {REVIEW_PROCESS_STAGES.map((st, idx) => {
              const isActive = currentStage === st.id;
              const isPast = currentStage > st.id;
              return (
                <div key={st.id} className="flex items-center flex-1 last:flex-none">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStage(st.id);
                      toast.info(`Switched executive review stage to: ${st.name}`);
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
                  {idx < REVIEW_PROCESS_STAGES.length - 1 && (
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

        {/* Strategy Score Banner (Image 2) */}
        <StrategyScoreBanner moduleName="Executive Review" />

        <div className="space-y-5">
            {/* Top Row: Review Details + Strategic Objectives + AI Assistant */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Review Details (5 cols) */}
              <div className="lg:col-span-5 bg-card border rounded-xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span>Review Details</span>
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    Status: {reviewStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground">Review Number</span>
                    <input
                      type="text"
                      value={reviewData.reviewNumber}
                      onChange={(e) => setReviewData({ ...reviewData, reviewNumber: e.target.value })}
                      className="w-full h-8 px-2 rounded-lg border bg-background font-mono mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Review Type</span>
                    <select
                      value={reviewData.reviewType}
                      onChange={(e) => setReviewData({ ...reviewData, reviewType: e.target.value })}
                      className="w-full h-8 px-2 rounded-lg border bg-background mt-0.5"
                    >
                      <option>Quarterly Business Review</option>
                      <option>Monthly Executive Review</option>
                      <option>Annual Business Review</option>
                      <option>Strategic Review</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Review Period</span>
                    <input
                      type="text"
                      value={reviewData.periodLabel}
                      onChange={(e) => setReviewData({ ...reviewData, periodLabel: e.target.value })}
                      className="w-full h-8 px-2 rounded-lg border bg-background mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Organization</span>
                    <input
                      type="text"
                      value={reviewData.organization}
                      disabled
                      className="w-full h-8 px-2 rounded-lg border bg-muted/40 text-muted-foreground mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Business Unit</span>
                    <input
                      type="text"
                      value={reviewData.businessUnit}
                      onChange={(e) => setReviewData({ ...reviewData, businessUnit: e.target.value })}
                      className="w-full h-8 px-2 rounded-lg border bg-background mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Review Owner</span>
                    <input
                      type="text"
                      value={reviewData.reviewOwner}
                      onChange={(e) => setReviewData({ ...reviewData, reviewOwner: e.target.value })}
                      className="w-full h-8 px-2 rounded-lg border bg-background mt-0.5"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-foreground">Agenda Summary</span>
                    <button
                      type="button"
                      onClick={() => setIsAgendaModalOpen(true)}
                      className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      View Agenda
                    </button>
                  </div>
                  <ol className="text-[11px] space-y-0.5 text-muted-foreground list-decimal list-inside">
                    <li>Previous Review Actions</li>
                    <li>Strategic Performance & Financials</li>
                    <li>Revenue, Sales & Operations</li>
                    <li>Risk, Compliance & Action Tracking</li>
                  </ol>
                </div>
              </div>

              {/* Strategic Objective Progress (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-emerald-600" />
                    <span>Strategic Objective Progress</span>
                  </h4>
                  <span className="text-xs text-blue-600 hover:underline cursor-pointer">View All</span>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  {[
                    { num: 1, title: "Increase Market Share to 15%", pct: 92, color: "bg-emerald-500" },
                    { num: 2, title: "Launch 3 New Products", pct: 76, color: "bg-blue-500" },
                    { num: 3, title: "Achieve ₹120 Cr Revenue", pct: 84, color: "bg-indigo-500" },
                    { num: 4, title: "Establish 3 Manufacturing Hubs", pct: 60, color: "bg-amber-500" },
                    { num: 5, title: "ESG & Sustainability Targets", pct: 70, color: "bg-cyan-500" },
                  ].map((obj) => (
                    <div key={obj.num} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-medium text-foreground">{obj.num}. {obj.title}</span>
                        <span className="font-bold text-foreground">{obj.pct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", obj.color)}
                          style={{ width: `${obj.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Assistant (3 cols) */}
              <div className="lg:col-span-3 bg-card border rounded-xl p-4 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span>Executive Review AI</span>
                    </h4>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {[
                      "Summarize key highlights",
                      "Show KPI variances",
                      "Suggest executive decisions",
                    ].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleAiAsk(p)}
                        className="text-[10px] px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-foreground border transition-colors cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5 h-28 overflow-y-auto no-scrollbar p-1 rounded-lg bg-muted/20 border text-xs">
                    {aiChatMessages.map((m, i) => (
                      <div
                        key={i}
                        className={cn(
                          "p-2 rounded-lg text-xs leading-relaxed",
                          m.sender === "user"
                            ? "bg-blue-600 text-white ml-3"
                            : "bg-background border text-foreground mr-3 shadow-2xs"
                        )}
                      >
                        {m.text}
                      </div>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAiAsk();
                  }}
                  className="flex items-center gap-1.5 pt-2"
                >
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="flex-1 h-8 px-2 rounded-lg border bg-background text-foreground text-xs"
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

            {/* Middle Row: Financial Performance + KPI Breakdown + Revenue by Segment + Risk Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Financial Quarterly Bar Chart (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <h4 className="font-bold text-sm text-foreground">Financial Performance</h4>
                  <span className="text-[11px] text-muted-foreground">₹ Crore</span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={FINANCIAL_QUARTERLY_DATA}>
                      <XAxis dataKey="quarter" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <RechartsTooltip />
                      <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="ebitda" name="EBITDA" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="netProfit" name="Net Profit" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* KPI Performance by Category (3 cols) */}
              <div className="lg:col-span-3 bg-card border rounded-xl p-4 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-sm text-foreground">KPIs by Category</h4>
                  <span className="text-[11px] text-muted-foreground">Actual %</span>
                </div>
                <div className="space-y-1.5 pt-1 text-xs">
                  {KPI_CATEGORY_DATA.slice(0, 5).map((kpi) => (
                    <div key={kpi.category} className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-foreground">{kpi.category}</span>
                        <span className="font-bold text-emerald-600">{kpi.actual}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${kpi.actual}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue by Segment (3 cols) */}
              <div className="lg:col-span-3 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <h4 className="font-bold text-sm text-foreground">Revenue by Segment</h4>
                  <span className="text-[11px] text-muted-foreground">₹ 12.8 Cr</span>
                </div>
                <div className="h-40 w-full flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={REVENUE_SEGMENT_DATA}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={38}
                        outerRadius={55}
                      >
                        {REVENUE_SEGMENT_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  {REVENUE_SEGMENT_DATA.slice(0, 4).map((s) => (
                    <div key={s.name} className="truncate text-muted-foreground">
                      ● {s.name} ({s.value}%)
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Heatmap (2 cols) */}
              <div className="lg:col-span-2 bg-card border rounded-xl p-4 shadow-2xs space-y-2">
                <div className="border-b pb-1.5">
                  <h4 className="font-bold text-sm text-foreground">Risk Heatmap</h4>
                  <span className="text-[10px] text-muted-foreground">Exposure</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-center text-xs pt-1">
                  <div className="p-2 rounded bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold">
                    <div>Critical</div>
                    <div className="text-lg">2</div>
                  </div>
                  <div className="p-2 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold">
                    <div>High</div>
                    <div className="text-lg">3</div>
                  </div>
                  <div className="p-2 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold">
                    <div>Medium</div>
                    <div className="text-lg">4</div>
                  </div>
                  <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold">
                    <div>Low</div>
                    <div className="text-lg">2</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Executive Decisions + Action Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Executive Decisions (6 cols) */}
              <div className="lg:col-span-6 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="font-bold text-sm text-foreground">Executive Decisions ({decisions.length})</h4>
                  <button
                    type="button"
                    onClick={() => setIsDecisionModalOpen(true)}
                    className="text-xs px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Decision
                  </button>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                  {decisions.map((dec) => (
                    <div key={dec.id} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-foreground">{dec.text}</div>
                        <div className="text-[10px] text-muted-foreground">Owner: {dec.owner} • Due: {dec.dueDate}</div>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded",
                          dec.status === "Approved"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : dec.status === "In Review"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        )}
                      >
                        {dec.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Tracker (6 cols) */}
              <div className="lg:col-span-6 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="font-bold text-sm text-foreground">Action Tracker ({actions.length})</h4>
                  <span className="text-xs text-muted-foreground font-semibold">Assigned & Monitored</span>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                  {actions.map((act) => (
                    <div key={act.id} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between text-xs">
                      <div className="space-y-0.5 flex-1 pr-3">
                        <div className="font-semibold text-foreground">{act.text}</div>
                        <div className="text-[10px] text-muted-foreground">Owner: {act.owner} • Due: {act.dueDate}</div>
                      </div>
                      <div className="text-right">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded",
                            act.status === "On Track"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : act.status === "At Risk"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          )}
                        >
                          {act.status} ({act.progress}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Decision */}
      {isDecisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-foreground">Record Executive Decision</h3>
              <button
                type="button"
                onClick={() => setIsDecisionModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddDecision} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-muted-foreground block mb-1">Decision Statement</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Approve CAPEX release for Phase 2 Factory expansion"
                  value={newDecisionText}
                  onChange={(e) => setNewDecisionText(e.target.value)}
                  className="w-full p-2 rounded-lg border bg-background text-foreground text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-muted-foreground block mb-1">Accountable Decision Owner</label>
                <select
                  value={newDecisionOwner}
                  onChange={(e) => setNewDecisionOwner(e.target.value)}
                  className="w-full h-8 px-2 rounded-lg border bg-background text-foreground text-xs"
                >
                  <option>CEO</option>
                  <option>COO</option>
                  <option>CFO</option>
                  <option>CTO</option>
                  <option>CIO</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsDecisionModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Save Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Agenda */}
      {isAgendaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-foreground">Executive Review Agenda</h3>
              <button
                type="button"
                onClick={() => setIsAgendaModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ol className="text-xs space-y-2 text-foreground list-decimal list-inside">
              <li className="font-medium">Previous Review Action Items Audit</li>
              <li className="font-medium">Strategic Objective Progress & Market Performance</li>
              <li className="font-medium">P&L and Cash Flow Variance Analysis</li>
              <li className="font-medium">Sales Pipeline & Customer Churn Report</li>
              <li className="font-medium">Manufacturing OEE & Plant Utilization</li>
              <li className="font-medium">Critical Risk Escalations & Security Audit</li>
              <li className="font-medium">Executive Decisions & Action Allocations</li>
            </ol>
            <div className="flex justify-end pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsAgendaModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
