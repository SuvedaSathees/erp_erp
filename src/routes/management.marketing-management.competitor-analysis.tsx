import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Users,
  Layers,
  IndianRupee,
  BarChart3,
  Save,
  Plus,
  Share2,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Award,
  Zap,
  Sliders,
  Info,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/marketing-management/competitor-analysis"
)({
  head: () => ({
    meta: [
      { title: "Competitor Analysis · Marketing Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise Competitor Analysis Workspace for feature benchmarks, pricing intelligence, TCO models, and SWOT battlecards.",
      },
    ],
  }),
  component: CompetitorAnalysisPage,
});

type MAICW = "M" | "A" | "I" | "C" | "W";

function MAICWBadge({ type }: { type: MAICW }) {
  const meta: Record<MAICW, { label: string; desc: string; bg: string; text: string }> = {
    M: { label: "M", desc: "Mandatory Field - Required for governance & validation", bg: "bg-red-500/10 border-red-500/30", text: "text-red-600 dark:text-red-400" },
    A: { label: "A", desc: "Auto-generated / System Controlled Identifier", bg: "bg-slate-500/10 border-slate-500/30", text: "text-slate-600 dark:text-slate-400" },
    I: { label: "I", desc: "Information / Lookup Master Link", bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-600 dark:text-blue-400" },
    C: { label: "C", desc: "Calculated Formula / Derived Dynamic Metric", bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-600 dark:text-purple-400" },
    W: { label: "W", desc: "Workflow Stage Gate Controlled", bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
  };

  const item = meta[type];
  return (
    <span
      title={item.desc}
      className={cn(
        "inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[8.5px] font-bold cursor-help shrink-0 select-none ml-1",
        item.bg,
        item.text
      )}
    >
      {item.label}
    </span>
  );
}

const TABS = [
  { id: "benchmarks", label: "Feature & Tech Benchmarks" },
  { id: "pricing", label: "Pricing Intelligence" },
  { id: "swot", label: "SWOT & Battlecards" },
];

export function CompetitorAnalysisPage() {
  const [activeTab, setActiveTab] = useState("benchmarks");
  const [showMaicwLegend, setShowMaicwLegend] = useState(false);

  const handleSave = () => {
    toast.success("Competitor Analysis CA-2026-001 Saved", {
      description: "Benchmarks and pricing models updated with latest market intelligence.",
    });
  };

  return (
    <AppShell
      title="Competitor Analysis"
      breadcrumb="Management > Marketing Management > Competitor Analysis > Market Intelligence"
      description="Know the Market. Stay Ahead."
      tabs={<MarketingManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Header Card */}
        <div className="card-soft p-4 sm:p-5 border-border/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  Competitor Analysis
                </h1>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold rounded-full">
                  Active
                </Badge>
                <span className="text-sm font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20 font-mono">
                  CA-2026-001
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400">
                  v1.0
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMaicwLegend(!showMaicwLegend)}
                  className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Info className="h-3.5 w-3.5 mr-1 text-primary" /> MAICW Standards
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Know the Market. Stay Ahead · Head-to-Head Benchmarks against Tata Power, Ather Grid & ABB
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="gap-1.5 text-xs font-semibold shadow-xs"
              >
                <Save className="h-3.5 w-3.5" /> Save Analysis
              </Button>
              <Button
                size="sm"
                onClick={() => toast.info("Battlecard dossier shared with Enterprise Sales Squad.")}
                className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Share2 className="h-3.5 w-3.5" /> Share Battlecard
              </Button>
            </div>
          </div>

          {/* Sub Navigation Tabs Bar (3 Focused Operational Tabs) */}
          <div className="mt-4 flex items-center gap-1 overflow-x-auto border-t border-border/80 pt-1 scrollbar-none">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all select-none cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: FEATURE & TECH BENCHMARKS (Default Operational View) */}
        {activeTab === "benchmarks" && (
          <div className="space-y-4">
            <div className="card-soft p-5 border-border/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Core Technology Architecture & Head-to-Head Benchmarks
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Technical evaluation across power electronics, coupling mechanism, alignment tolerances, and cooling.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">Patent Verified</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-border/70 bg-background/60 space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-foreground">Power Electronics: SiC MOSFET vs Legacy IGBT</span>
                    <span className="text-emerald-600 font-mono">96.5% vs 92.0%</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Tata Power uses conventional IGBT power modules (92% efficiency). Magnertia utilizes 3rd Gen Silicon Carbide (SiC) MOSFETs delivering 96.5% peak conversion with 40% reduced heatsink volume and zero cable heating loss.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border/70 bg-background/60 space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-foreground">Coupling: Automated Inductive Resonance</span>
                    <span className="text-emerald-600 font-mono">Zero Wear</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Legacy competitors rely on manual CCS2 cable dispensers with mechanical pins prone to fatigue and contact erosion. Magnertia delivers hands-free resonant magnetic coupling with ±150mm tolerance.
                  </p>
                </div>
              </div>

              {/* Patent & Regulatory Compliance Comparison */}
              <div className="mt-5">
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-2.5">
                  Certification & Standards Compliance Matrix
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-border/70 bg-background/60">
                    <div className="font-bold text-foreground">BIS IS 17017</div>
                    <div className="text-emerald-600 font-semibold text-[11px] mt-0.5">Tata Power: Verified</div>
                    <div className="text-emerald-600 font-semibold text-[11px]">Magnertia: Certified</div>
                  </div>
                  <div className="p-3 rounded-lg border border-border/70 bg-background/60">
                    <div className="font-bold text-foreground">SAE J2954 Wireless</div>
                    <div className="text-muted-foreground text-[11px] mt-0.5">Tata Power: Not Supported</div>
                    <div className="text-emerald-600 font-bold text-[11px]">Magnertia: Level 3 Ready</div>
                  </div>
                  <div className="p-3 rounded-lg border border-border/70 bg-background/60">
                    <div className="font-bold text-foreground">IEC 61851-1 / 23</div>
                    <div className="text-emerald-600 font-semibold text-[11px] mt-0.5">Tata Power: Verified</div>
                    <div className="text-emerald-600 font-semibold text-[11px]">Magnertia: Certified</div>
                  </div>
                  <div className="p-3 rounded-lg border border-border/70 bg-background/60">
                    <div className="font-bold text-foreground">OCPP 2.0.1 Cloud</div>
                    <div className="text-emerald-600 font-semibold text-[11px] mt-0.5">Tata Power: Native</div>
                    <div className="text-emerald-600 font-semibold text-[11px]">Magnertia: Native + AI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRICING INTELLIGENCE */}
        {activeTab === "pricing" && (
          <div className="space-y-4">
            <div className="card-soft p-5 border-border/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-emerald-600" />
                    Pricing Intelligence & 5-Year TCO Comparison
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Granular breakdown of Hardware, Turnkey Installation, Annual Maintenance Contracts, and Software Platform fees.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">Magnertia ~38% Lower TCO</Badge>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                      <th className="pb-2.5">Line Item</th>
                      <th className="pb-2.5 font-bold text-primary">Magnertia W-EVSE (60kW)</th>
                      <th className="pb-2.5 text-foreground">Tata Power (60kW Dual)</th>
                      <th className="pb-2.5 text-foreground">Ather Grid (60kW Pod)</th>
                      <th className="pb-2.5 text-foreground">Source & Recency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-medium text-foreground">Hardware List Price</td>
                      <td className="py-3 font-bold text-primary">₹14,50,000</td>
                      <td className="py-3 text-muted-foreground">₹25,00,000</td>
                      <td className="py-3 text-muted-foreground">₹26,00,000</td>
                      <td className="py-3 font-sans text-muted-foreground">Quotation (Sep 2026)</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-medium text-foreground">Civil & Electrical Installation</td>
                      <td className="py-3 font-bold text-primary">₹1,50,000 (Modular pad)</td>
                      <td className="py-3 text-muted-foreground">₹2,00,000</td>
                      <td className="py-3 text-muted-foreground">₹2,50,000</td>
                      <td className="py-3 font-sans text-muted-foreground">CPO Site Tender</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-medium text-foreground">Annual Maintenance (Yearly)</td>
                      <td className="py-3 font-bold text-primary">₹85,000 (Optional)</td>
                      <td className="py-3 text-muted-foreground">₹1,20,000</td>
                      <td className="py-3 text-muted-foreground">₹1,50,000</td>
                      <td className="py-3 font-sans text-muted-foreground">AMC Contract rate</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-medium text-foreground">Cloud CMS / OCPP Subscription</td>
                      <td className="py-3 font-bold text-primary">₹36,000 / yr</td>
                      <td className="py-3 text-muted-foreground">₹60,000 / yr</td>
                      <td className="py-3 text-muted-foreground">₹75,000 / yr</td>
                      <td className="py-3 font-sans text-muted-foreground">SaaS Schedule</td>
                    </tr>
                    <tr className="bg-primary/5 font-bold border-t border-primary/20">
                      <td className="py-3 font-sans text-foreground">5-Year Total Cost of Ownership</td>
                      <td className="py-3 text-primary text-sm">₹22,05,000</td>
                      <td className="py-3 text-foreground text-sm">₹36,00,000</td>
                      <td className="py-3 text-foreground text-sm">₹39,75,000</td>
                      <td className="py-3 font-sans text-emerald-600 dark:text-emerald-400 font-semibold">Magnertia ~38% Lower</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SWOT & BATTLECARDS */}
        {activeTab === "swot" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Documented Strengths & Limitations */}
              <div className="card-soft p-5 border-border/80">
                <h3 className="font-bold text-sm text-foreground mb-3 pb-2 border-b border-border/60">
                  Tata Power: Documented Strengths & Weaknesses
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="font-bold text-emerald-600 mb-1">Key Strengths</div>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-[11px] leading-relaxed">
                      <li>Massive distribution network backed by Tata Group synergy (Tata Motors, Croma, Taj).</li>
                      <li>High capital reserves enabling aggressive long-term municipal concession bidding.</li>
                      <li>Reliable standard OCPP backend with high customer brand recall.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <div className="font-bold text-rose-600 mb-1">Documented Limitations</div>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-[11px] leading-relaxed">
                      <li>Heavy, traditional dispenser designs with slower installation cycle times (3-4 weeks).</li>
                      <li>Rigid pricing with zero willingness to customize modular software/hardware.</li>
                      <li>Zero autonomous/robotic docking capabilities for commercial vehicle fleets.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sales Battlecards & Objection Handling */}
              <div className="card-soft p-5 border-border/80">
                <h3 className="font-bold text-sm text-foreground mb-3 pb-2 border-b border-border/60">
                  Sales Battlecards & Counter-Arguments
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg border border-border/70 bg-background/60 space-y-1">
                    <span className="font-bold text-foreground">Objection: "Tata Power is an established national giant."</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      <strong>Counter:</strong> Magnertia specializes exclusively in commercial fleet automated turnaround, eliminating cable damage costs that account for 28% of legacy charger OPEX.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-border/70 bg-background/60 space-y-1">
                    <span className="font-bold text-foreground">Objection: "Is inductive wireless charging efficient?"</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      <strong>Counter:</strong> Magnertia's 3rd Gen SiC resonant coils deliver 96.5% grid-to-battery efficiency, certified on the SAE J2954 test bench with thermal runaway protection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default CompetitorAnalysisPage;
