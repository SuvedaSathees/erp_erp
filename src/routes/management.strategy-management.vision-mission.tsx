import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Compass,
  Star,
  Layers,
  Target,
  Users,
  BarChart3,
  Award,
  Trophy,
  Leaf,
  Zap,
  Cpu,
  Calendar,
  Building,
  Plus,
  Edit3,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileText,
  Search,
  Filter,
  Eye,
  Sliders,
  ShieldCheck,
  Globe,
  Share2,
  Printer,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import { StrategyManagementTabBar } from "@/components/erp/StrategyManagementTabBar";
import { StrategyScoreBanner } from "@/components/erp/StrategyScoreBanner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/strategy-management/vision-mission")({
  head: () => ({
    meta: [
      { title: "Vision & Mission · Magnertia ERP" },
      {
        name: "description",
        content:
          "Define and govern corporate purpose, long-term vision, mission statement, core values, strategic themes, stakeholder alignment, and MAICW strategic classification.",
      },
    ],
  }),
  component: VisionMissionPage,
});

function VisionMissionPage() {
  const [selectedBu, setSelectedBu] = useState("All Business Units");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");

  // Alignment Donut Data
  const alignmentData = [
    { name: "Vision Alignment", value: 85, color: "#3b82f6" },
    { name: "Mission Alignment", value: 78, color: "#10b981" },
    { name: "Values Alignment", value: 70, color: "#f59e0b" },
    { name: "Theme Alignment", value: 68, color: "#ef4444" },
    { name: "Objective Alignment", value: 62, color: "#8b5cf6" },
    { name: "Stakeholder Alignment", value: 75, color: "#06b6d4" },
  ];

  // Strategic Objectives Bar Data
  const objectivesProgressData = [
    { theme: "Growth", target: 80, actual: 65 },
    { theme: "Innovation", target: 75, actual: 70 },
    { theme: "Customer", target: 70, actual: 60 },
    { theme: "Operations", target: 68, actual: 55 },
    { theme: "Sustainability", target: 70, actual: 60 },
    { theme: "Digital", target: 75, actual: 70 },
    { theme: "People", target: 65, actual: 50 },
  ];

  // Stakeholders data
  const stakeholdersData = [
    { group: "Customers", rate: 88, color: "bg-blue-500" },
    { group: "Employees", rate: 82, color: "bg-indigo-500" },
    { group: "Investors", rate: 76, color: "bg-emerald-500" },
    { group: "Suppliers", rate: 70, color: "bg-amber-500" },
    { group: "Government", rate: 65, color: "bg-cyan-500" },
    { group: "Communities", rate: 72, color: "bg-teal-500" },
    { group: "Environment", rate: 68, color: "bg-green-600" },
    { group: "Industry", rate: 60, color: "bg-purple-500" },
  ];

  return (
    <AppShell
      title="Vision & Mission"
      breadcrumb="Management"
      description="Our Purpose. Our Direction. Our Impact. Strategic foundation connecting purpose, vision, mission, core values, and executive governance."
      tabs={<StrategyManagementTabBar />}
    >
      <div className="space-y-6 pb-12">
        {/* Top Header Card */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b pb-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Vision & Mission</h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
                  Active v1.0
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our Purpose. Our Direction. Our Impact.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-card border rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground shadow-sm">
              <Calendar className="h-3.5 w-3.5 mr-2 text-primary" />
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent text-foreground font-medium text-xs focus:outline-none w-[170px]"
              />
            </div>

            <div className="flex items-center bg-card border rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground shadow-sm">
              <Building className="h-3.5 w-3.5 mr-2 text-primary" />
              <select
                value={selectedBu}
                onChange={(e) => setSelectedBu(e.target.value)}
                className="bg-transparent text-foreground font-medium text-xs focus:outline-none cursor-pointer"
              >
                <option value="All Business Units">All Business Units</option>
                <option value="EV Charging Infra">EV Charging Infra</option>
                <option value="Power Electronics">Power Electronics</option>
                <option value="Software & IoT">Software & IoT</option>
              </select>
            </div>

            <button
              onClick={() => toast.success("Opening new Vision & Mission draft modal")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              New Version
            </button>
          </div>
        </div>

        {/* 7 Metric Score Banner (Executive Standard) */}
        <StrategyScoreBanner moduleName="Vision & Mission" />

        {/* 3 Large Visual Purpose/Vision/Mission Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Purpose */}
          <div className="relative rounded-2xl overflow-hidden border border-border/80 p-6 flex flex-col justify-between shadow-md min-h-[220px] bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-300 border border-blue-400/30">
                OUR PURPOSE
              </div>
              <h2 className="text-lg sm:text-xl font-bold leading-tight text-white drop-shadow-sm">
                Powering a Sustainable Mobility Future for a Better India
              </h2>
            </div>
            <div className="relative z-10 pt-4 flex items-start gap-2.5 text-xs text-slate-300">
              <Leaf className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                To create clean, accessible, and intelligent charging infrastructure that accelerates the adoption of electric mobility and contributes to a greener, healthier, and more prosperous society.
              </p>
            </div>
          </div>

          {/* Card 2: Vision */}
          <div className="relative rounded-2xl overflow-hidden border border-border/80 p-6 flex flex-col justify-between shadow-md min-h-[220px] bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-700/20 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                OUR VISION
              </div>
              <h2 className="text-lg sm:text-xl font-bold leading-tight text-white drop-shadow-sm">
                To Become a Global Leader in Autonomous Wireless EV Charging Infrastructure
              </h2>
            </div>
            <div className="relative z-10 pt-4 flex items-start gap-2.5 text-xs text-slate-300">
              <Zap className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Deploy intelligent charging stations every 3 kilometers across highways and urban spaces, enabling seamless, sustainable and autonomous electric mobility.
              </p>
            </div>
          </div>

          {/* Card 3: Mission */}
          <div className="relative rounded-2xl overflow-hidden border border-border/80 p-6 flex flex-col justify-between shadow-md min-h-[220px] bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700/20 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/30 text-amber-300 border border-amber-400/30">
                OUR MISSION
              </div>
              <h2 className="text-lg sm:text-xl font-bold leading-tight text-white drop-shadow-sm">
                Design, Manufacture and Deploy Next-Generation Autonomous EV Charging Solutions
              </h2>
            </div>
            <div className="relative z-10 pt-4 flex items-start gap-2.5 text-xs text-slate-300">
              <Cpu className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Deliver innovative, reliable and customer-centric wireless charging infrastructure through advanced technology, strategic partnerships and scalable franchise models.
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section: Donut + Bar Chart + Stakeholders + Details Card */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Strategic Alignment Donut (1 col) */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-foreground">Strategic Alignment</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                Last 12 Months
              </span>
            </div>

            <div className="relative h-[180px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alignmentData}
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {alignmentData.map((entry, index) => (
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
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-foreground">72%</span>
                <span className="text-[10px] text-muted-foreground font-semibold">Alignment Score</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t text-[11px]">
              {alignmentData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-semibold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Objectives Progress Bar Chart (1 col) */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-foreground">Strategic Objectives Progress</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">This Year</span>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={objectivesProgressData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="theme" fontSize={9} />
                  <YAxis fontSize={9} unit="%" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="target" fill="#93c5fd" radius={[3, 3, 0, 0]} name="Target" />
                  <Bar dataKey="actual" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] pt-2 border-t text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-blue-300" /> Target
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-blue-600" /> Actual
              </span>
            </div>
          </div>

          {/* Stakeholder Alignment Horizontal Bars (1 col) */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-foreground">Stakeholder Alignment</h3>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">10 Groups</span>
            </div>

            <div className="space-y-2 pt-1">
              {stakeholdersData.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">{item.group}</span>
                    <span className="font-bold text-foreground">{item.rate}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-300`}
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Average Alignment</span>
              <span className="font-bold text-foreground">72.6%</span>
            </div>
          </div>

          {/* Vision & Mission Details Card (1 col) */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-foreground">Vision & Mission Details</h3>
              <button
                onClick={() => toast.info("Edit Details")}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Edit3 className="h-3 w-3" /> Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-muted-foreground block text-[10px]">Form Code</span>
                <span className="font-mono font-bold text-foreground">VM-2026-001</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Version</span>
                <span className="font-bold text-foreground">1.0</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Organization</span>
                <span className="font-semibold text-foreground">BharatMandeer</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Business Unit</span>
                <span className="font-semibold text-foreground truncate block">EV Charging Infra</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Planning Horizon</span>
                <span className="font-semibold text-foreground">10 Years</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Effective Date</span>
                <span className="font-semibold text-foreground">31 Aug 2027</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block text-[10px]">Owner</span>
                <span className="font-semibold text-foreground">Sankaranarayanan R</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between">
              <span>Status: Active</span>
              <CheckCircle2 className="h-4 w-4" />
            </div>

            {/* Vision & Mission Mini Statements */}
            <div className="space-y-2 pt-1 border-t">
              <div className="p-2 rounded bg-muted/40 border text-[10px] space-y-1">
                <span className="font-bold text-foreground block">Vision Statement:</span>
                <p className="text-muted-foreground leading-snug">
                  Deploy intelligent charging stations every 3 km across highways & urban spaces.
                </p>
              </div>
              <div className="p-2 rounded bg-muted/40 border text-[10px] space-y-1">
                <span className="font-bold text-foreground block">Mission Statement:</span>
                <p className="text-muted-foreground leading-snug">
                  Deliver innovative wireless charging through technology and franchise partnerships.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Versions Table + Recent Decisions + Key Initiatives + Themes + AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Versions Table & Recent Decisions */}
          <div className="space-y-5">
            {/* Versions Table */}
            <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground">Vision & Mission Versions</h3>
                <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-semibold border-b">
                    <tr>
                      <th className="py-2 px-2.5">#</th>
                      <th className="py-2 px-2.5">Version</th>
                      <th className="py-2 px-2.5">Effective Date</th>
                      <th className="py-2 px-2.5">Status</th>
                      <th className="py-2 px-2.5">Approved By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr>
                      <td className="py-2 px-2.5 text-muted-foreground">1</td>
                      <td className="py-2 px-2.5 font-bold text-foreground">1.0</td>
                      <td className="py-2 px-2.5 text-muted-foreground">01 Sep 2026</td>
                      <td className="py-2 px-2.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          Active
                        </span>
                      </td>
                      <td className="py-2 px-2.5 text-foreground font-medium">Board of Directors</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 text-muted-foreground">2</td>
                      <td className="py-2 px-2.5 font-bold text-foreground">0.9</td>
                      <td className="py-2 px-2.5 text-muted-foreground">01 Sep 2025</td>
                      <td className="py-2 px-2.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
                          Archived
                        </span>
                      </td>
                      <td className="py-2 px-2.5 text-foreground font-medium">Board of Directors</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 text-muted-foreground">3</td>
                      <td className="py-2 px-2.5 font-bold text-foreground">0.8</td>
                      <td className="py-2 px-2.5 text-muted-foreground">01 Sep 2024</td>
                      <td className="py-2 px-2.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
                          Archived
                        </span>
                      </td>
                      <td className="py-2 px-2.5 text-foreground font-medium">Executive Team</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Decisions Table */}
            <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground">Recent Decisions</h3>
                <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-semibold border-b">
                    <tr>
                      <th className="py-2 px-2">Decision Topic</th>
                      <th className="py-2 px-2">Area</th>
                      <th className="py-2 px-2">Priority</th>
                      <th className="py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr>
                      <td className="py-2 px-2 font-semibold text-foreground">Invest in 100 Stations (Ph 1)</td>
                      <td className="py-2 px-2 text-muted-foreground">Growth</td>
                      <td className="py-2 px-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-600">High</span>
                      </td>
                      <td className="py-2 px-2 text-emerald-600 font-semibold">Approved</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-semibold text-foreground">In-house Coil Manufacturing</td>
                      <td className="py-2 px-2 text-muted-foreground">Manufacturing</td>
                      <td className="py-2 px-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-600">High</span>
                      </td>
                      <td className="py-2 px-2 text-blue-600 font-semibold">In Review</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-semibold text-foreground">Strategic Partnership (OEM)</td>
                      <td className="py-2 px-2 text-muted-foreground">Partnerships</td>
                      <td className="py-2 px-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600">Medium</span>
                      </td>
                      <td className="py-2 px-2 text-amber-600 font-semibold">Analysis</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-semibold text-foreground">Expand to 3 New States</td>
                      <td className="py-2 px-2 text-muted-foreground">Expansion</td>
                      <td className="py-2 px-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-600">High</span>
                      </td>
                      <td className="py-2 px-2 text-emerald-600 font-semibold">Approved</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Center: Key Initiatives from Vision & Mission + AI Strategic Insights */}
          <div className="space-y-5">
            {/* Key Initiatives */}
            <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground">Key Initiatives from Vision & Mission</h3>
                <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-semibold border-b">
                    <tr>
                      <th className="py-2 px-2">#</th>
                      <th className="py-2 px-2">Initiative</th>
                      <th className="py-2 px-2">Strategic Theme</th>
                      <th className="py-2 px-2">Progress</th>
                      <th className="py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr>
                      <td className="py-2 px-2 text-muted-foreground">1</td>
                      <td className="py-2 px-2 font-semibold text-foreground">Highway Charging Network</td>
                      <td className="py-2 px-2 text-muted-foreground">Market Expansion</td>
                      <td className="py-2 px-2 font-bold text-blue-600">75%</td>
                      <td className="py-2 px-2 text-emerald-600 font-semibold">In Progress</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-muted-foreground">2</td>
                      <td className="py-2 px-2 font-semibold text-foreground">Autonomous W-EVSE R&D</td>
                      <td className="py-2 px-2 text-muted-foreground">Innovation</td>
                      <td className="py-2 px-2 font-bold text-blue-600">60%</td>
                      <td className="py-2 px-2 text-emerald-600 font-semibold">In Progress</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-muted-foreground">3</td>
                      <td className="py-2 px-2 font-semibold text-foreground">Franchise Partner Network</td>
                      <td className="py-2 px-2 text-muted-foreground">Growth</td>
                      <td className="py-2 px-2 font-bold text-amber-600">45%</td>
                      <td className="py-2 px-2 text-amber-600 font-semibold">Planning</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-muted-foreground">4</td>
                      <td className="py-2 px-2 font-semibold text-foreground">Manufacturing Scale-up</td>
                      <td className="py-2 px-2 text-muted-foreground">Operations</td>
                      <td className="py-2 px-2 font-bold text-blue-600">65%</td>
                      <td className="py-2 px-2 text-emerald-600 font-semibold">In Progress</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-muted-foreground">5</td>
                      <td className="py-2 px-2 font-semibold text-foreground">Green Energy Integration</td>
                      <td className="py-2 px-2 text-muted-foreground">Sustainability</td>
                      <td className="py-2 px-2 font-bold text-amber-600">40%</td>
                      <td className="py-2 px-2 text-amber-600 font-semibold">Planning</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Strategic Insights */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card to-card p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">AI Strategic Insights</h3>
                </div>
                <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5 p-2 rounded bg-card/80 border">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <p className="text-foreground/90">
                    EV charging demand is expected to grow <strong>3.5x by 2030</strong>, supporting 3 km deployment target.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded bg-card/80 border">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <p className="text-foreground/90">
                    Franchise model in Tier-2 cities can achieve <strong>28% higher ROI</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded bg-card/80 border">
                  <span className="h-2 w-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <p className="text-foreground/90">
                    Strategic partnership with OEMs can accelerate market entry by <strong>18 months</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded bg-card/80 border">
                  <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <p className="text-foreground/90">
                    Renewable energy integration can reduce operational cost by <strong>22%</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Strategic Themes List */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Strategic Themes</h3>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { id: 1, name: "Growth & Market Expansion", color: "bg-rose-500 text-white" },
                { id: 2, name: "Innovation & Technology Leadership", color: "bg-emerald-500 text-white" },
                { id: 3, name: "Customer Excellence", color: "bg-blue-500 text-white" },
                { id: 4, name: "Operational Excellence", color: "bg-teal-500 text-white" },
                { id: 5, name: "Sustainability & Impact", color: "bg-cyan-500 text-white" },
                { id: 6, name: "Strategic Partnerships", color: "bg-rose-600 text-white" },
                { id: 7, name: "Digital Transformation", color: "bg-purple-500 text-white" },
                { id: 8, name: "People & Capability", color: "bg-indigo-500 text-white" },
              ].map((theme) => (
                <div
                  key={theme.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[11px] ${theme.color}`}>
                      {theme.id}
                    </span>
                    <span className="font-semibold text-foreground">{theme.name}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
