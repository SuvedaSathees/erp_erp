import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  Briefcase,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  Handshake,
  BarChart3,
  Filter,
  RefreshCw,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { BusinessDevelopmentTabBar } from "@/components/erp/BusinessDevelopmentTabBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/development/business-development/overview")({
  head: () => ({ meta: [{ title: "Business Development Overview · Magnertia ERP" }] }),
  component: BusinessDevelopmentOverview,
});

async function loadBdOverview() {
  return {
    pipelineValue: "$48.5M",
    activeDeals: 42,
    closedYtd: "$18.2M",
    winRate: "64.8%",
    partnerEcosystem: 128,
  };
}

function BusinessDevelopmentOverview() {
  const q = useQuery({ queryKey: ["business-development", "overview"], queryFn: loadBdOverview });

  const funnel = useMemo(
    () => [
      { label: "Lead Generation & Scouting", count: 85, icon: Users, val: "$120M" },
      { label: "Qualification & Pitching", count: 54, icon: Target, val: "$85M" },
      { label: "Proposal & RFP Submission", count: 32, icon: Briefcase, val: "$58M" },
      { label: "Commercial Negotiation", count: 18, icon: Handshake, val: "$34M" },
      { label: "Contracting & Closing", count: 12, icon: ShieldCheck, val: "$22M" },
      { label: "Active Partnership & Account", count: 8, icon: Building2, val: "$18M" },
    ],
    []
  );

  const trend = useMemo(
    () => [
      { label: "Q1 2025", val: 12.4, target: 10 },
      { label: "Q2 2025", val: 14.8, target: 12 },
      { label: "Q3 2025", val: 16.2, target: 15 },
      { label: "Q4 2025", val: 19.5, target: 18 },
      { label: "Q1 2026", val: 22.1, target: 20 },
      { label: "Q2 2026 (Est)", val: 25.4, target: 24 },
    ],
    []
  );

  const keyDeals = useMemo(
    () => [
      { id: "BD-2026-089", name: "Global Automotive OEM Joint Venture", stage: "Commercial Negotiation", value: "$14.5M", partner: "Apex Dynamics Corp", probability: "85%", status: "High Priority" },
      { id: "BD-2026-074", name: "Next-Gen Energy Grid Licensing Deal", stage: "Contracting & Closing", value: "$8.2M", partner: "Voltaic Power Solutions", probability: "90%", status: "Closing" },
      { id: "BD-2026-061", name: "Smart Mobility Strategic Alliance", stage: "Proposal & RFP Submission", value: "$6.8M", partner: "Urban Tech Innovations", probability: "70%", status: "In Review" },
      { id: "BD-2026-052", name: "APAC Channel Partner Network Expansion", stage: "Qualification & Pitching", value: "$4.5M", partner: "PacRim Holdings Ltd", probability: "60%", status: "Scouting" },
      { id: "BD-2026-048", name: "IIoT Sensor Suite Technology Transfer", stage: "Active Partnership", value: "$5.2M", partner: "CyberFab Robotics", probability: "95%", status: "Active" },
    ],
    []
  );

  return (
    <AppShell
      title="Business Development"
      breadcrumb="Development > Business Development"
      description="Executive pipeline intelligence — market research, strategic partnerships, deal velocity, RFPs, revenue modeling, and regional expansion."
      tabs={<BusinessDevelopmentTabBar />}
    >
      <div className="space-y-6">
        {/* Header Filter & Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-foreground">Business Development Executive Dashboard</h2>
            <p className="text-xs text-muted-foreground">Consolidated growth metrics across global deals, strategic partnerships, M&A opportunities, and key account portfolios.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <span>FY 2026 · Global Markets</span>
            </div>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <RefreshCw className="h-3 w-3" /> Updated live
            </span>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Pipeline Value</span>
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">{q.data?.pipelineValue ?? "$48.5M"}</div>
            <div className="mt-1 flex items-center text-xs text-emerald-600 font-medium">
              <ArrowUpRight className="mr-0.5 h-3 w-3" /> +14.2% vs last quarter
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Active Deals</span>
              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">{q.data?.activeDeals ?? 42}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">18 in negotiation</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Closed YTD Revenue</span>
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">{q.data?.closedYtd ?? "$18.2M"}</div>
            <div className="mt-1 flex items-center text-xs text-emerald-600 font-medium">108% of Q2 target</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Win Rate</span>
              <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-600">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">{q.data?.winRate ?? "64.8%"}</div>
            <div className="mt-1 flex items-center text-xs text-indigo-600 font-medium">+3.4% win conversion</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Partner Ecosystem</span>
              <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
                <Handshake className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">{q.data?.partnerEcosystem ?? 128}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">Global VARs & OEMs</div>
          </div>
        </div>

        {/* Funnel & Growth Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Deal Pipeline Funnel */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" /> Commercial Deal Pipeline Stages
                </h3>
                <p className="text-xs text-muted-foreground">Volume and estimated pipeline value across active stages.</p>
              </div>
              <span className="rounded-md bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary">6 Active Stages</span>
            </div>

            <div className="mt-4 space-y-3">
              {funnel.map((item, idx) => (
                <div key={item.label} className="group flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-semibold text-foreground">
                      <span>{item.label}</span>
                      <span className="text-muted-foreground">{item.count} deals ({item.val})</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          idx === 0
                            ? "bg-slate-400"
                            : idx === 1
                            ? "bg-blue-400"
                            : idx === 2
                            ? "bg-indigo-500"
                            : idx === 3
                            ? "bg-amber-500"
                            : idx === 4
                            ? "bg-emerald-500"
                            : "bg-primary"
                        )}
                        style={{ width: `${Math.max(15, (item.count / 85) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Projection & Quarterly Trend */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" /> Revenue Trajectory ($ Millions)
                </h3>
                <p className="text-xs text-muted-foreground">Quarterly revenue achievements vs forecast targets.</p>
              </div>
              <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-600">On Track</span>
            </div>

            <div className="mt-6 space-y-4">
              {trend.map((t) => (
                <div key={t.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground">{t.label}</span>
                    <span className="text-muted-foreground font-mono">${t.val}M / ${t.target}M Target</span>
                  </div>
                  <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all"
                      style={{ width: `${Math.min(100, (t.val / 30) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Strategic Deals Table */}
        <div className="rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" /> Key Business Development Opportunities
              </h3>
              <p className="text-xs text-muted-foreground">High-impact commercial accounts, joint ventures, and strategic licensing deals.</p>
            </div>
            <button type="button" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 transition-colors">
              + New BD Opportunity
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="px-4 py-3">Opportunity ID</th>
                  <th className="px-4 py-3">Deal Name</th>
                  <th className="px-4 py-3">Partner / Client</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Estimated Value</th>
                  <th className="px-4 py-3">Win Probability</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {keyDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-muted-foreground">{deal.id}</td>
                    <td className="px-4 py-3 font-bold text-foreground">{deal.name}</td>
                    <td className="px-4 py-3 font-medium text-foreground/80">{deal.partner}</td>
                    <td className="px-4 py-3 text-muted-foreground">{deal.stage}</td>
                    <td className="px-4 py-3 font-bold text-foreground font-mono">{deal.value}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">{deal.probability}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold",
                          deal.status === "High Priority"
                            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            : deal.status === "Closing"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : deal.status === "In Review"
                            ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {deal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
