import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { HrmManagementTabBar } from "@/components/erp/HrmManagementTabBar";
import { StrategyScoreBanner } from "@/components/erp/StrategyScoreBanner";
import {
  Users,
  Target,
  Award,
  Star,
  CheckCircle2,
  Clock,
  Save,
  Plus,
  Send,
  Sparkles,
  BarChart3,
  Calendar,
  Building2,
  Check,
  X,
  TrendingUp,
  FileText,
  ThumbsUp,
  ChevronRight,
  Briefcase,
  AlertCircle,
  ShieldCheck,
  Activity,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/hrm-management/performance-management")({
  head: () => ({
    meta: [
      { title: "Performance Review · HRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Manage employee performance lifecycle: Goals, KRAs, KPIs, Competencies, Self Review, Manager Review, 360° Feedback, Calibration, Development, and Rewards.",
      },
    ],
  }),
  component: PerformanceManagementPage,
});

// 9 Lifecycle Stages
const PERFORMANCE_STAGES = [
  { id: 1, name: "Goal Setting" },
  { id: 2, name: "In Progress" },
  { id: 3, name: "Self Review" },
  { id: 4, name: "Manager Review" },
  { id: 5, name: "360° Feedback" },
  { id: 6, name: "Calibration" },
  { id: 7, name: "Final Rating" },
  { id: 8, name: "Acknowledgement" },
  { id: 9, name: "Completed" },
];

// 360 Feedback Summary Data
const FEEDBACK_360_DATA = [
  { group: "Manager", rating: 4.3 },
  { group: "Peers", rating: 4.0 },
  { group: "Direct Reports", rating: 3.9 },
  { group: "Cross Functional", rating: 4.1 },
  { group: "Customer", rating: 3.8 },
];

// Quarterly Trend Line Data
const PERFORMANCE_TREND_DATA = [
  { quarter: "Q1 (Apr-Jun)", goal: 3.8, kpi: 3.6, competency: 3.9, overall: 3.8 },
  { quarter: "Q2 (Jul-Sep)", goal: 4.0, kpi: 3.8, competency: 4.0, overall: 4.0 },
  { quarter: "Q3 (Oct-Dec)", goal: 4.2, kpi: 3.9, competency: 4.1, overall: 4.1 },
  { quarter: "Q4 (Jan-Mar)", goal: 4.4, kpi: 4.0, competency: 4.2, overall: 4.2 },
];

export function PerformanceManagementPage() {
  const [currentStage, setCurrentStage] = useState(4); // Manager Review
  const [fiscalYear, setFiscalYear] = useState("FY 2026-27");
  const [reviewType, setReviewType] = useState("Annual Review");
  const [reviewStatus, setReviewStatus] = useState("Manager Review");

  // Goals Live Table
  const [goals, setGoals] = useState([
    { id: 1, name: "Product Development", weight: 30, target: "100%", ach: "94%", progress: 94, rating: 4.5, status: "On Track" },
    { id: 2, name: "Project Delivery", weight: 25, target: "95%", ach: "92%", progress: 92, rating: 4.2, status: "On Track" },
    { id: 3, name: "Innovation & IP", weight: 20, target: "3 Patents", ach: "2 Patents", progress: 67, rating: 3.8, status: "In Progress" },
    { id: 4, name: "Team Development", weight: 25, target: "2 Members", ach: "2 Members", progress: 100, rating: 4.5, status: "Completed" },
  ]);

  // Actions Live Table
  const [actions, setActions] = useState([
    { id: 1, name: "Complete product testing", owner: "Ravi Kumar", dueDate: "30 Nov 2026", status: "In Progress" },
    { id: 2, name: "Publish technical paper", owner: "Ravi Kumar", dueDate: "15 Dec 2026", status: "Not Started" },
    { id: 3, name: "Mentor junior engineer", owner: "Ravi Kumar", dueDate: "31 Dec 2026", status: "On Track" },
    { id: 4, name: "Submit patent draft", owner: "Ravi Kumar", dueDate: "15 Jan 2027", status: "On Track" },
  ]);

  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalWeight, setNewGoalWeight] = useState(25);
  const [newGoalTarget, setNewGoalTarget] = useState("100%");

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [newActionName, setNewActionName] = useState("");
  const [newActionDate, setNewActionDate] = useState("31 Dec 2026");

  const handleSaveDraft = () => {
    toast.success("Performance Review Draft Saved", {
      description: "Employee EMP-000125 performance review evaluation saved.",
    });
  };

  const handleSubmitForReview = () => {
    setReviewStatus("Calibration");
    setCurrentStage(6);
    toast.success("Submitted for 360° Calibration", {
      description: "Appraisal moved to HR Calibration & Committee Review queue.",
    });
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim()) return;
    const newG = {
      id: goals.length + 1,
      name: newGoalName,
      weight: Number(newGoalWeight),
      target: newGoalTarget,
      ach: "0%",
      progress: 0,
      rating: 4.0,
      status: "On Track",
    };
    setGoals([...goals, newG]);
    setNewGoalName("");
    setIsGoalModalOpen(false);
    toast.success("Goal Added to Appraisal", {
      description: `"${newG.name}" assigned to Employee EMP-000125.`,
    });
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionName.trim()) return;
    const newAct = {
      id: actions.length + 1,
      name: newActionName,
      owner: "Ravi Kumar",
      dueDate: newActionDate,
      status: "On Track",
    };
    setActions([...actions, newAct]);
    setNewActionName("");
    setIsActionModalOpen(false);
    toast.success("Action Item Added", {
      description: `"${newAct.name}" assigned to Ravi Kumar.`,
    });
  };

  return (
    <AppShell
      title="Performance Review"
      breadcrumb="Management > HRM Management > Performance Management > Performance Review"
      description="Evaluate. Develop. Grow. Build High Performing Teams."
      tabs={<HrmManagementTabBar />}
    >
      <div className="space-y-5 pb-16">
        {/* Header Action Bar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-xl bg-card p-4 border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Performance Review</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  EMP-000125
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Evaluate. Develop. Grow. Build High Performing Teams.</p>
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
            </select>

            <select
              value={reviewType}
              onChange={(e) => setReviewType(e.target.value)}
              className="h-9 px-3 text-xs font-medium rounded-lg border bg-background text-foreground shadow-2xs cursor-pointer"
            >
              <option value="Annual Review">Annual Review</option>
              <option value="Half-Yearly Review">Half-Yearly Review</option>
              <option value="Quarterly Review">Quarterly Review</option>
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
              onClick={handleSubmitForReview}
              className="h-9 px-4 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Submit for Review</span>
            </button>
          </div>
        </div>
        {/* 9 Stages Stepper */}
        <div className="bg-card border rounded-xl p-3 shadow-2xs overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[800px] px-2">
            {PERFORMANCE_STAGES.map((st, idx) => {
              const isActive = currentStage === st.id;
              const isPast = currentStage > st.id;
              return (
                <div key={st.id} className="flex items-center flex-1 last:flex-none">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStage(st.id);
                      toast.info(`Review step: ${st.name}`);
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
                  {idx < PERFORMANCE_STAGES.length - 1 && (
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

        {/* Employee Banner Card */}
        <div className="bg-card border rounded-xl p-4 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Employee details */}
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                RK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground font-semibold">EMP-000125</span>
                  <h2 className="text-base font-bold text-foreground">Ravi Kumar S</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    High Performer
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Senior Mechanical Engineer • R&D | Coimbatore
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5 flex gap-3">
                  <span>Manager: <strong className="text-foreground">M. Prakash</strong></span>
                  <span>Join Date: <strong className="text-foreground">12 Jan 2023</strong></span>
                </div>
              </div>
            </div>



            {/* Middle: Cycle details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-y lg:border-y-0 lg:border-x py-3 lg:py-0 px-0 lg:px-4">
              <div>
                <span className="text-[10px] text-muted-foreground font-medium block">Performance Cycle</span>
                <span className="font-semibold text-foreground">FY 2026-27 (Annual)</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-medium block">Department</span>
                <span className="font-semibold text-foreground">R&D - Engineering</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-medium block">Business Unit</span>
                <span className="font-semibold text-foreground">EV Charging Infra</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-medium block">Current Stage</span>
                <span className="font-semibold text-blue-600">Manager Review (Due 30 Nov)</span>
              </div>
            </div>

            {/* Right: Overall Rating Score */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground font-medium block">Overall Rating (Current)</span>
                <div className="flex items-center gap-1 mt-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-3.5 w-3.5",
                        star <= 4 ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                  <span className="text-sm font-bold text-foreground ml-1">4.2 / 5</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">
                  Exceeds Expectations
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Score Banner (Image 2) */}
        <StrategyScoreBanner moduleName="Performance" />

        <div className="space-y-5">
            {/* Middle Row: Goals & KRAs Table + KPI Achievement Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Goals & KRAs (7 cols) */}
              <div className="lg:col-span-7 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="font-bold text-sm text-foreground">Goals & KRAs ({goals.length})</h4>
                  <button
                    type="button"
                    onClick={() => setIsGoalModalOpen(true)}
                    className="text-xs px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Goal
                  </button>
                </div>
                <div className="space-y-2">
                  {goals.map((g, idx) => (
                    <div key={g.id} className="p-2.5 rounded-lg border bg-muted/20 flex items-center justify-between text-xs">
                      <div className="space-y-0.5 flex-1 pr-3">
                        <div className="font-semibold text-foreground">{idx + 1}. {g.name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          Weight: {g.weight}% • Target: {g.target} • Ach: {g.ach}
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${g.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground text-xs">★ {g.rating}</div>
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5",
                            g.status === "Completed" || g.status === "On Track"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          )}
                        >
                          {g.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI Achievement (5 cols) */}
              <div className="lg:col-span-5 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="font-bold text-sm text-foreground">KPI Achievement (8)</h4>
                  <span className="text-xs text-blue-600 hover:underline cursor-pointer">View All</span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { name: "Prototype Development", target: 4, actual: 4, ach: 100, status: "On Track" },
                    { name: "Test Validation", target: 10, actual: 9, ach: 90, status: "On Track" },
                    { name: "Design Release", target: 3, actual: 3, ach: 100, status: "Completed" },
                    { name: "Cost Reduction (%)", target: 15, actual: 12, ach: 80, status: "On Track" },
                    { name: "Quality Compliance", target: 98, actual: 96, ach: 98, status: "On Track" },
                  ].map((k) => (
                    <div key={k.name} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground">{k.name}</div>
                        <div className="text-[10px] text-muted-foreground">Target: {k.target} • Actual: {k.actual}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600 text-[11px] block">{k.ach}%</span>
                        <span className="text-[9px] font-medium text-muted-foreground">{k.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Row: Competencies + 360 Feedback + Performance Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Competency Assessment (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="font-bold text-sm text-foreground">Competency Assessment</h4>
                  <span className="text-xs text-blue-600 hover:underline cursor-pointer">View All</span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { name: "Technical Expertise", exp: 5, act: 4, rating: 4.0 },
                    { name: "Problem Solving", exp: 4, act: 4, rating: 4.0 },
                    { name: "Collaboration", exp: 4, act: 5, rating: 4.5 },
                    { name: "Communication", exp: 4, act: 4, rating: 4.0 },
                    { name: "Leadership", exp: 4, act: 4, rating: 4.0 },
                  ].map((c) => (
                    <div key={c.name} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground">{c.name}</div>
                        <div className="text-[10px] text-muted-foreground">Expected: {c.exp} • Actual: {c.act}</div>
                      </div>
                      <div className="font-bold text-amber-500 text-xs">★ {c.rating}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 360 Feedback Summary (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <h4 className="font-bold text-sm text-foreground">360° Feedback Summary</h4>
                  <span className="text-xs text-muted-foreground font-semibold">4.0 / 5 Overall</span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={FEEDBACK_360_DATA}>
                      <XAxis dataKey="group" tick={{ fontSize: 9 }} />
                      <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                      <RechartsTooltip />
                      <Bar dataKey="rating" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance Trend (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <h4 className="font-bold text-sm text-foreground">Performance Trend</h4>
                  <span className="text-xs text-muted-foreground font-semibold">FY 2026-27</span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={PERFORMANCE_TREND_DATA}>
                      <XAxis dataKey="quarter" tick={{ fontSize: 8 }} />
                      <YAxis domain={[2, 5]} tick={{ fontSize: 9 }} />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="overall" name="Overall" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="goal" name="Goal" stroke="#3b82f6" strokeWidth={1.5} />
                      <Line type="monotone" dataKey="kpi" name="KPI" stroke="#10b981" strokeWidth={1.5} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bottom Row: Development Plan + Recognition + Key Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Development Plan (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="font-bold text-sm text-foreground">Development Plan (3)</h4>
                  <span className="text-xs text-blue-600 hover:underline cursor-pointer">View All</span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { area: "Leadership", action: "Leadership training program", due: "30 Jun 2027", progress: 60, status: "On Track" },
                    { area: "Strategic Thinking", action: "Strategy workshop", due: "30 Sep 2027", progress: 40, status: "In Progress" },
                    { area: "Technical (EV)", action: "Advanced WPT certification", due: "31 Dec 2026", progress: 80, status: "On Track" },
                  ].map((d) => (
                    <div key={d.area} className="p-2 rounded-lg border bg-muted/20 space-y-1">
                      <div className="flex justify-between font-semibold text-foreground">
                        <span>{d.area}</span>
                        <span className="text-[10px] text-blue-600">{d.status}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{d.action} • Due: {d.due}</div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${d.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recognition & Rewards (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="font-bold text-sm text-foreground">Recognition & Rewards</h4>
                  <button
                    type="button"
                    onClick={() => toast.success("Opening Recognition Nomination Form")}
                    className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { name: "Innovation Award", type: "Award", date: "15 Aug 2026", status: "Approved" },
                    { name: "Spot Recognition", type: "Recognition", date: "12 Apr 2026", status: "Approved" },
                  ].map((r) => (
                    <div key={r.name} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground">{r.name}</div>
                        <div className="text-[10px] text-muted-foreground">{r.type} • {r.date}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Actions (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="font-bold text-sm text-foreground">Key Actions ({actions.length})</h4>
                  <button
                    type="button"
                    onClick={() => setIsActionModalOpen(true)}
                    className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  {actions.map((act) => (
                    <div key={act.id} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">{act.name}</div>
                        <div className="text-[10px] text-muted-foreground">Due: {act.dueDate}</div>
                      </div>
                      <span
                        className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded",
                          act.status === "On Track"
                            ? "bg-emerald-100 text-emerald-700"
                            : act.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {act.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Modal: Add Goal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-foreground">Add Appraisal Goal / KRA</h3>
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-muted-foreground block mb-1">Goal / KRA Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Wireless Charging Coil"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Weightage (%)</label>
                  <input
                    type="number"
                    value={newGoalWeight}
                    onChange={(e) => setNewGoalWeight(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Target</label>
                  <input
                    type="text"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Action */}
      {isActionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-foreground">Assign Action Item</h3>
              <button
                type="button"
                onClick={() => setIsActionModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddAction} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-muted-foreground block mb-1">Action Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete ISO 9001 quality audit"
                  value={newActionName}
                  onChange={(e) => setNewActionName(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-muted-foreground block mb-1">Due Date</label>
                <input
                  type="text"
                  value={newActionDate}
                  onChange={(e) => setNewActionDate(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Save Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
