import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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
  Plus,
  Printer,
  Download,
  Search,
  ExternalLink,
  Sparkles,
  Layers,
  Award,
  Globe,
  Share2,
  FileSpreadsheet,
  Coins,
  Scale,
  Compass,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { BusinessDevelopmentTabBar } from "@/components/erp/BusinessDevelopmentTabBar";
import { StatCard } from "@/components/erp/StatCard";
import { WidgetBand } from "@/widgets/components/WidgetBand";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/development/business-development/overview")({
  head: () => ({ meta: [{ title: "Business Development Overview · Magnertia ERP" }] }),
  component: BusinessDevelopmentOverview,
});

async function loadBdOverview() {
  return {
    pipelineValue: "₹ 48.5 Cr",
    activeDeals: 42,
    closedYtd: "₹ 18.2 Cr",
    winRate: "64.8%",
    partnerEcosystem: 128,
  };
}

/* 22 Submodules Directory with Comprehensive Executive Metadata */
export interface BDSubmoduleInfo {
  id: string;
  title: string;
  desc: string;
  path: string;
  icon: any;
  color: string;
  bg: string;
  tag: string;
  category: "strategy-validation" | "gtm-commercial" | "distribution-partners" | "expansion-scaling";
  categoryLabel: string;
  score: number;
  stage: string;
  metric: string;
}

const bdSubmodules: BDSubmoduleInfo[] = [
  // 1. Strategy & Market Validation (6 Modules)
  {
    id: "BMD",
    title: "Business Model Development",
    desc: "9-box BMC, value architecture & cost structures",
    path: "/development/business-development/business-model-development",
    icon: Layers,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Architecture",
    category: "strategy-validation",
    categoryLabel: "Strategy & Validation",
    score: 86,
    stage: "In Progress",
    metric: "₹ 48.5 Cr TAM",
  },
  {
    id: "VPD",
    title: "Value Proposition Development",
    desc: "Customer jobs, pain relievers & gain creators",
    path: "/development/business-development/value-proposition-development",
    icon: Sparkles,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
    tag: "Fit Matrix",
    category: "strategy-validation",
    categoryLabel: "Strategy & Validation",
    score: 88,
    stage: "Approved",
    metric: "4.6/5 Fit Score",
  },
  {
    id: "CD",
    title: "Customer Discovery",
    desc: "Persona hypotheses & user problem discovery interviews",
    path: "/development/business-development/customer-discovery",
    icon: Users,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "Interviews",
    category: "strategy-validation",
    categoryLabel: "Strategy & Validation",
    score: 86,
    stage: "In Progress",
    metric: "45 Interviews",
  },
  {
    id: "CV",
    title: "Customer Validation",
    desc: "Early adopter traction, pilot LOIs & POC conversion",
    path: "/development/business-development/customer-validation",
    icon: Target,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-500/10",
    tag: "Traction",
    category: "strategy-validation",
    categoryLabel: "Strategy & Validation",
    score: 88,
    stage: "Pilot Validation",
    metric: "12 Pilots Active",
  },
  {
    id: "MR",
    title: "Market Research",
    desc: "TAM / SAM / SOM modeling & demographic sizing",
    path: "/development/business-development/market-research",
    icon: BarChart3,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
    tag: "Market Sizing",
    category: "strategy-validation",
    categoryLabel: "Strategy & Validation",
    score: 84,
    stage: "Validated",
    metric: "₹ 1,200 Cr TAM",
  },
  {
    id: "CA",
    title: "Competitive Analysis",
    desc: "Competitor battlecards, feature parity & SWOT matrix",
    path: "/development/business-development/competitive-analysis",
    icon: Scale,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    tag: "Positioning",
    category: "strategy-validation",
    categoryLabel: "Strategy & Validation",
    score: 85,
    stage: "Active",
    metric: "8 Competitors",
  },

  // 2. Go-To-Market & Revenue Engineering (4 Modules)
  {
    id: "GTM",
    title: "Go-To-Market (GTM)",
    desc: "Launch execution plan, ICP campaigns & readiness checklist",
    path: "/development/business-development/go-to-market-development",
    icon: Zap,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "Launch Plan",
    category: "gtm-commercial",
    categoryLabel: "GTM & Commercial",
    score: 87,
    stage: "Pre-Launch",
    metric: "Q3 Ready",
  },
  {
    id: "PSD",
    title: "Pricing Strategy",
    desc: "Willingness-to-pay tiers, elasticity & margin optimization",
    path: "/development/business-development/pricing-strategy-development",
    icon: DollarSign,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "Yield Opt",
    category: "gtm-commercial",
    categoryLabel: "GTM & Commercial",
    score: 86,
    stage: "Optimized",
    metric: "32% Margin",
  },
  {
    id: "RMD",
    title: "Revenue Model",
    desc: "ARR/MRR recurring forecasts & expansion multipliers",
    path: "/development/business-development/revenue-model-development",
    icon: Coins,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    tag: "ARR Stream",
    category: "gtm-commercial",
    categoryLabel: "GTM & Commercial",
    score: 89,
    stage: "Projected",
    metric: "₹ 18.5 Cr ARR",
  },
  {
    id: "SCD",
    title: "Sales Channel",
    desc: "Direct vs indirect routing, channel quotas & incentives",
    path: "/development/business-development/sales-channel-development",
    icon: Briefcase,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Channels",
    category: "gtm-commercial",
    categoryLabel: "GTM & Commercial",
    score: 84,
    stage: "Active Channels",
    metric: "4 Channels Active",
  },

  // 3. Distribution & Ecosystem Channels (5 Modules)
  {
    id: "FD",
    title: "Franchise Development",
    desc: "Franchisee expansion, territory mapping & royalty models",
    path: "/development/business-development/franchise-development",
    icon: Building2,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
    tag: "Territories",
    category: "distribution-partners",
    categoryLabel: "Distribution & Partners",
    score: 82,
    stage: "Expansion Ready",
    metric: "24 Territories",
  },
  {
    id: "PD",
    title: "Partnership Development",
    desc: "Strategic alliances, tech co-development & joint ventures",
    path: "/development/business-development/partnership-development",
    icon: Handshake,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
    tag: "Alliances",
    category: "distribution-partners",
    categoryLabel: "Distribution & Partners",
    score: 86,
    stage: "Strategic JV",
    metric: "₹ 120 Cr JV Value",
  },
  {
    id: "DND",
    title: "Dealer Network",
    desc: "Dealership appointments, stock quotas & dealer margins",
    path: "/development/business-development/dealer-network-development",
    icon: Compass,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10",
    tag: "Dealerships",
    category: "distribution-partners",
    categoryLabel: "Distribution & Partners",
    score: 85,
    stage: "Authorized",
    metric: "68.5% Coverage",
  },
  {
    id: "DD",
    title: "Distributor Development",
    desc: "Master logistics distribution, warehousing & credit lines",
    path: "/development/business-development/distributor-development",
    icon: Share2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "Supply Line",
    category: "distribution-partners",
    categoryLabel: "Distribution & Partners",
    score: 87,
    stage: "Tier-1 Master",
    metric: "95% Fulfillment",
  },
  {
    id: "VED",
    title: "Vendor Ecosystem",
    desc: "Strategic component suppliers & procurement API network",
    path: "/development/business-development/vendor-ecosystem-development",
    icon: ShieldCheck,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
    tag: "Ecosystem",
    category: "distribution-partners",
    categoryLabel: "Distribution & Partners",
    score: 86,
    stage: "Audited Tier-1",
    metric: "96% On-Time",
  },

  // 4. Corporate Scaling, Global Exim & Capital (7 Modules)
  {
    id: "IR",
    title: "Investor Relations",
    desc: "Cap table dynamics & quarterly stakeholder briefings",
    path: "/development/business-development/investor-relations-development",
    icon: Award,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    tag: "Cap Table",
    category: "expansion-scaling",
    categoryLabel: "Expansion & Scaling",
    score: 85,
    stage: "Series B Ready",
    metric: "₹ 150 Cr Ask",
  },
  {
    id: "FR",
    title: "Fundraising Development",
    desc: "Series equity rounds, term sheets & venture pipeline",
    path: "/development/business-development/fundraising-development",
    icon: TrendingUp,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
    tag: "Venture Equity",
    category: "expansion-scaling",
    categoryLabel: "Expansion & Scaling",
    score: 88,
    stage: "Round Active",
    metric: "₹ 60 Cr Closed",
  },
  {
    id: "IED",
    title: "International Expansion",
    desc: "Cross-border market entry, regulatory & entity setup",
    path: "/development/business-development/international-expansion-development",
    icon: Globe,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Global Entry",
    category: "expansion-scaling",
    categoryLabel: "Expansion & Scaling",
    score: 84,
    stage: "APAC & MENA",
    metric: "88/100 Reg Score",
  },
  {
    id: "ED",
    title: "Export Development",
    desc: "Customs tariffs, Letter of Credit (LC) & HS codes",
    path: "/development/business-development/export-development",
    icon: FileSpreadsheet,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    tag: "Exim Policy",
    category: "expansion-scaling",
    categoryLabel: "Expansion & Scaling",
    score: 86,
    stage: "Customs Ready",
    metric: "24 Active Orders",
  },
  {
    id: "BSD",
    title: "Business Scaling",
    desc: "Unit economics, capacity multiplication & flywheel",
    path: "/development/business-development/business-scaling-development",
    icon: TrendingUp,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "Flywheel",
    category: "expansion-scaling",
    categoryLabel: "Expansion & Scaling",
    score: 87,
    stage: "Multi-City Scale",
    metric: "2.3X Growth Plan",
  },
  {
    id: "CSD",
    title: "Corporate Strategy",
    desc: "3-5 Year Horizon planning, M&A pipeline & OKR cascade",
    path: "/development/business-development/corporate-strategy-development",
    icon: Target,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
    tag: "M&A Horizon",
    category: "expansion-scaling",
    categoryLabel: "Expansion & Scaling",
    score: 88,
    stage: "5-Yr Vision Done",
    metric: "₹ 5,000 Cr Plan",
  },
  {
    id: "BTD",
    title: "Business Transformation",
    desc: "Digital modernization, process re-engineering & change",
    path: "/development/business-development/business-transformation-development",
    icon: Zap,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    tag: "Digital Shift",
    category: "expansion-scaling",
    categoryLabel: "Expansion & Scaling",
    score: 85,
    stage: "Phase 2 Rollout",
    metric: "₹ 25 Cr Cost Save",
  },
];

function BusinessDevelopmentOverview() {
  const q = useQuery({ queryKey: ["business-development", "overview"], queryFn: loadBdOverview });

  const [selectedTimeframe, setSelectedTimeframe] = useState("FY 2026-27");
  const [searchFilter, setSearchFilter] = useState("");
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [selectedSubmoduleCategory, setSelectedSubmoduleCategory] = useState<string>("all");
  const [submoduleSearchQuery, setSubmoduleSearchQuery] = useState<string>("");

  const [deals, setDeals] = useState([
    { id: "BD-2026-089", name: "Global Automotive OEM Joint Venture", stage: "Commercial Negotiation", value: "₹ 14.5 Cr", partner: "Apex Dynamics Corp", probability: "85%", status: "High Priority" },
    { id: "BD-2026-074", name: "Next-Gen Energy Grid Licensing Deal", stage: "Contracting & Closing", value: "₹ 8.2 Cr", partner: "Voltaic Power Solutions", probability: "90%", status: "Closing" },
    { id: "BD-2026-061", name: "Smart Mobility Strategic Alliance", stage: "Proposal & RFP Submission", value: "₹ 6.8 Cr", partner: "Urban Tech Innovations", probability: "70%", status: "In Review" },
    { id: "BD-2026-052", name: "APAC Channel Partner Network Expansion", stage: "Qualification & Pitching", value: "₹ 4.5 Cr", partner: "PacRim Holdings Ltd", probability: "60%", status: "Scouting" },
    { id: "BD-2026-048", name: "IIoT Sensor Suite Technology Transfer", stage: "Active Partnership", value: "₹ 5.2 Cr", partner: "CyberFab Robotics", probability: "95%", status: "Active" },
  ]);

  const [newDeal, setNewDeal] = useState({
    name: "",
    partner: "",
    stage: "Qualification & Pitching",
    value: "",
    probability: "75%",
    status: "In Review",
  });

  const funnel = useMemo(
    () => [
      { label: "Lead Generation & Scouting", count: 85, icon: Users, val: "₹ 120 Cr" },
      { label: "Qualification & Pitching", count: 54, icon: Target, val: "₹ 85 Cr" },
      { label: "Proposal & RFP Submission", count: 32, icon: Briefcase, val: "₹ 58 Cr" },
      { label: "Commercial Negotiation", count: 18, icon: Handshake, val: "₹ 34 Cr" },
      { label: "Contracting & Closing", count: 12, icon: ShieldCheck, val: "₹ 22 Cr" },
      { label: "Active Partnership & Account", count: 8, icon: Building2, val: "₹ 18 Cr" },
    ],
    []
  );

  const filteredDeals = useMemo(() => {
    return deals.filter(
      (d) =>
        !searchFilter.trim() ||
        d.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
        d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        d.partner.toLowerCase().includes(searchFilter.toLowerCase()) ||
        d.stage.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [deals, searchFilter]);

  const filteredSubmodules = useMemo(() => {
    return bdSubmodules.filter((m) => {
      const matchCat = selectedSubmoduleCategory === "all" || m.category === selectedSubmoduleCategory;
      const matchSearch =
        !submoduleSearchQuery.trim() ||
        m.title.toLowerCase().includes(submoduleSearchQuery.toLowerCase()) ||
        m.desc.toLowerCase().includes(submoduleSearchQuery.toLowerCase()) ||
        m.tag.toLowerCase().includes(submoduleSearchQuery.toLowerCase()) ||
        m.stage.toLowerCase().includes(submoduleSearchQuery.toLowerCase()) ||
        m.metric.toLowerCase().includes(submoduleSearchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(submoduleSearchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedSubmoduleCategory, submoduleSearchQuery]);

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.name || !newDeal.value) {
      toast.error("Please provide opportunity title and value.");
      return;
    }

    const createdDeal = {
      id: `BD-2026-0${Math.floor(90 + Math.random() * 20)}`,
      name: newDeal.name,
      partner: newDeal.partner || "Strategic Partner",
      stage: newDeal.stage,
      value: newDeal.value.startsWith("₹") ? newDeal.value : `₹ ${newDeal.value}`,
      probability: newDeal.probability,
      status: newDeal.status,
    };

    setDeals([createdDeal, ...deals]);
    setShowNewDealModal(false);
    setNewDeal({
      name: "",
      partner: "",
      stage: "Qualification & Pitching",
      value: "",
      probability: "75%",
      status: "In Review",
    });
    toast.success(`Strategic Opportunity ${createdDeal.id} logged into Business Development pipeline!`);
  };

  const handleExport = (type: "excel" | "pdf") => {
    toast.success(`Business Development Executive Dashboard exported as ${type.toUpperCase()}`);
  };

  return (
    <AppShell
      title="Business Development"
      breadcrumb="Development > Business Development"
      description="Executive pipeline intelligence — market research, strategic partnerships, deal velocity, RFPs, revenue modeling, and regional expansion."
      tabs={<BusinessDevelopmentTabBar />}
    >
      <div className="space-y-6">
        {/* Header Filter & Banner (Single Row Layout) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-border/80 bg-card px-5 py-3.5 shadow-2xs">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base font-bold text-foreground tracking-tight whitespace-nowrap">
                Business Development Executive Dashboard
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Pipeline
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              Consolidated enterprise growth metrics across global deals, strategic partnerships, M&A opportunities, and key account portfolios.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2 shrink-0">
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground shadow-2xs">
              <Filter className="h-3.5 w-3.5 text-primary" />
              <select
                value={selectedTimeframe}
                onChange={(e) => {
                  setSelectedTimeframe(e.target.value);
                  toast.info(`Period filtered: ${e.target.value}`);
                }}
                className="bg-transparent font-semibold text-foreground outline-none cursor-pointer"
              >
                <option value="FY 2026-27">FY 2026-27 (Current)</option>
                <option value="Q1 2026">Q1 2026</option>
                <option value="Global Markets">Global Markets</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition shadow-2xs cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" /> Print
            </button>

            <button
              type="button"
              onClick={() => handleExport("excel")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition shadow-2xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>

            <button
              type="button"
              onClick={() => setShowNewDealModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              New BD Opportunity
            </button>
          </div>
        </div>

        {/* Top 5 Dynamic Customizable Metric Widget Band */}
        <WidgetBand pageId="bd-overview" />

        {/* Funnel & Growth Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
          {/* Deal Pipeline Funnel */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs h-full flex flex-col justify-between">
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

          {/* Strategic Initiatives & AI Opportunity Matrix */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> AI Deal & Expansion Intelligence
                  </h3>
                  <p className="text-xs text-muted-foreground">Autonomous account scoring & joint venture recommendations</p>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Active Insights</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <Coins className="h-3.5 w-3.5 text-emerald-500" /> High-Yield Licensing Expansion
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Voltaic Power Grid proposal has a <strong>92% win predictability</strong> with a recurring revenue upside of ₹ 2.4 Cr/yr.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-blue-500" /> APAC Channel Readiness
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    3 distributor agreements in Singapore and Malaysia pending final signing for Q3 expansion.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toast.success("AI Strategic Growth recommendations refreshed!")}
              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5" /> Execute Autonomous Growth Multipliers
            </button>
          </div>
        </div>

        {/* Top Strategic Deals Table */}
        <div className="rounded-xl border border-border bg-card shadow-xs">
          <div className="flex flex-wrap items-center justify-between p-4 border-b border-border gap-3">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" /> Key Business Development Opportunities Ledger
              </h3>
              <p className="text-xs text-muted-foreground">High-impact commercial accounts, joint ventures, and strategic licensing deals.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search deal or partner..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="h-8 rounded-lg border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary w-48"
                />
              </div>
            </div>
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
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-primary font-bold">{deal.id}</td>
                    <td className="px-4 py-3 font-bold text-foreground">{deal.name}</td>
                    <td className="px-4 py-3 font-medium text-foreground/80">{deal.partner}</td>
                    <td className="px-4 py-3 text-muted-foreground">{deal.stage}</td>
                    <td className="px-4 py-3 font-black text-foreground font-mono">{deal.value}</td>
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
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => toast.info(`Viewing details for ${deal.id}: ${deal.name}`)}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition cursor-pointer"
                      >
                        Open <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 22 Business Development Submodules Workflow Hub */}
        <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary shadow-inner">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-base font-bold text-foreground truncate">
                      Business Development 22 Submodules Overview Hub
                    </h2>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                      22 Enterprise Modules
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    End-to-end strategy, discovery, revenue engineering, partner channels, global expansion, and scaling
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="flex items-center gap-2 text-xs shrink-0 flex-wrap">
              <div className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 flex items-center gap-2 shadow-2xs">
                <span className="text-muted-foreground font-semibold">Active:</span>
                <strong className="text-foreground font-mono font-bold">22 Modules</strong>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 flex items-center gap-2 shadow-2xs">
                <span className="text-muted-foreground font-semibold">Avg Readiness:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">86.2 / 100</strong>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 flex items-center gap-2 shadow-2xs">
                <span className="text-muted-foreground font-semibold">Architecture:</span>
                <strong className="text-primary font-bold">100% Complete</strong>
              </div>
            </div>
          </div>

          {/* Category Filter Tabs & Instant Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
              {[
                { id: "all", label: "All 22 Modules", count: 22 },
                { id: "strategy-validation", label: "Strategy & Validation", count: 6 },
                { id: "gtm-commercial", label: "GTM & Commercial", count: 4 },
                { id: "distribution-partners", label: "Distribution & Partners", count: 5 },
                { id: "expansion-scaling", label: "Expansion & Scaling", count: 7 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedSubmoduleCategory(tab.id)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border",
                    selectedSubmoduleCategory === tab.id
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/30 text-muted-foreground border-border/70 hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] font-mono",
                      selectedSubmoduleCategory === tab.id
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative shrink-0 w-full lg:w-72">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search 22 submodules, metrics, stages..."
                value={submoduleSearchQuery}
                onChange={(e) => setSubmoduleSearchQuery(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* 22 Submodules Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-2">
            {filteredSubmodules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.title}
                  to={mod.path}
                  className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-2xs hover:border-primary/50 hover:shadow-md transition-all duration-200 h-full"
                >
                  <div className="space-y-3">
                    {/* Top Row: Icon + Code + Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-inner", mod.bg, mod.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-mono font-bold text-foreground block">{mod.id}</span>
                          <span className="rounded bg-muted/80 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground inline-block">
                            {mod.tag}
                          </span>
                        </div>
                      </div>

                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-bold border shrink-0",
                          mod.stage === "Approved" || mod.stage === "Validated" || mod.stage === "Customs Ready"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : mod.stage === "In Progress" || mod.stage === "Pre-Launch" || mod.stage === "Pilot Validation"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : mod.stage === "Active" || mod.stage === "Active Channels" || mod.stage === "Tier-1 Master" || mod.stage === "Strategic JV"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-purple-500/10 text-purple-600 border-purple-500/20"
                        )}
                      >
                        {mod.stage}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <div>
                      <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {mod.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed min-h-[32px]">
                        {mod.desc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Metric & Readiness Meter */}
                  <div className="mt-4 pt-3 border-t border-border/60 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-muted-foreground">Key Metric</span>
                      <span className="font-bold text-foreground font-mono">{mod.metric}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">Readiness Score</span>
                        <span className="font-bold font-mono text-emerald-600">{mod.score}/100</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${mod.score}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-primary group-hover:underline">
                      <span>Open Workspace</span>
                      <ArrowRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredSubmodules.length === 0 && (
            <div className="text-center py-10 rounded-xl border border-dashed border-border bg-muted/10 space-y-2">
              <Layers className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-xs font-bold text-foreground">No submodules matched your filter</p>
              <p className="text-[11px] text-muted-foreground">Try clearing your search query or selecting "All 22 Modules".</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedSubmoduleCategory("all");
                  setSubmoduleSearchQuery("");
                }}
                className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>


        {/* MODAL: NEW BD OPPORTUNITY */}
        {showNewDealModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Log New Business Development Opportunity</h3>
                    <p className="text-xs text-muted-foreground">Register a commercial venture into the strategic pipeline</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewDealModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Opportunity Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next-Gen EV Inverter Supply Agreement"
                    value={newDeal.name}
                    onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Client / Partner Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Tata Motors EV Division"
                      value={newDeal.partner}
                      onChange={(e) => setNewDeal({ ...newDeal, partner: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Estimated Value (₹) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹ 8.5 Cr"
                      value={newDeal.value}
                      onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Pipeline Stage</label>
                    <select
                      value={newDeal.stage}
                      onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Qualification & Pitching</option>
                      <option>Proposal & RFP Submission</option>
                      <option>Commercial Negotiation</option>
                      <option>Contracting & Closing</option>
                      <option>Active Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Win Probability</label>
                    <select
                      value={newDeal.probability}
                      onChange={(e) => setNewDeal({ ...newDeal, probability: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>90% (Closing)</option>
                      <option>75% (Strong)</option>
                      <option>50% (Evaluating)</option>
                      <option>30% (Initial)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowNewDealModal(false)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Save Opportunity
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
