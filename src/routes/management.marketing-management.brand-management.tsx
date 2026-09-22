import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  ShieldCheck,
  Save,
  Download,
  Upload,
  Plus,
  Info,
  CheckCircle2,
  Layers,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/marketing-management/brand-management"
)({
  head: () => ({
    meta: [
      { title: "Branding · Marketing Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise Brand Management Workspace for visual identity, color systems, digital asset library, brand guidelines, and trademark IP protection.",
      },
    ],
  }),
  component: BrandingManagementPage,
});

export const TABS = [
  { id: "identity", label: "Brand Identity & Colors" },
  { id: "assets", label: "Digital Asset Library" },
  { id: "guidelines", label: "Brand Guidelines" },
  { id: "trademarks", label: "Trademarks & IP" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function BrandingManagementPage() {
  const [activeTab, setActiveTab] = useState<TabId>("identity");
  const [showMaicwLegend, setShowMaicwLegend] = useState(false);

  const handleSave = () => {
    toast.success("Brand Record Saved", {
      description: "BR-2026-001 synchronized across all marketing channels and asset stores.",
    });
  };

  const handleSubmitApproval = () => {
    toast.success("Submitted for Brand Governance Approval", {
      description: "Dossier dispatched to Chief Marketing Officer and Brand Governance Board.",
    });
  };

  return (
    <AppShell
      title="Branding"
      breadcrumb="Management > Marketing Management > Branding > Brand Identity & Assets"
      description="Build a Stronger Tomorrow."
      tabs={<MarketingManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Header Card */}
        <div className="card-soft p-4 sm:p-5 border-border/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  Branding
                </h1>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold rounded-full">
                  Active
                </Badge>
                <span className="text-sm font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20 font-mono">
                  BR-2026-001
                </span>
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded border border-border">
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
                Build a Stronger Tomorrow · Magnertia Brand Design System & IP Governance
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
                <Save className="h-3.5 w-3.5" /> Save
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitApproval}
                className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Submit for Approval
              </Button>
            </div>
          </div>

          {/* Sub Navigation Tabs Bar (4 Focused Operational Tabs) */}
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

        {/* TAB 1: BRAND IDENTITY & COLORS (Default Operational View) */}
        {activeTab === "identity" && (
          <div className="space-y-4">
            {/* Logo Lockups & Variants */}
            <div className="card-soft p-5 border-border/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Logo Lockup System & Formats
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Controlled specifications for corporate logomarks, monograms, and background color pairings.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">Vector Masters</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border border-border/70 bg-card text-center space-y-2">
                  <div className="h-16 flex items-center justify-center font-black text-xl text-primary font-display">
                    ⚡ MAGNERTIA
                  </div>
                  <div className="text-xs font-bold text-foreground">Primary Horizontal</div>
                  <div className="text-[10px] text-muted-foreground">Default Corporate Use</div>
                </div>

                <div className="p-4 rounded-xl border border-border/70 bg-slate-950 text-white text-center space-y-2">
                  <div className="h-16 flex items-center justify-center font-black text-xl text-cyan-400 font-display">
                    ⚡ MAGNERTIA
                  </div>
                  <div className="text-xs font-bold text-white">Reverse Dark Mode</div>
                  <div className="text-[10px] text-slate-400">Dark Backgrounds Only</div>
                </div>

                <div className="p-4 rounded-xl border border-border/70 bg-card text-center space-y-2">
                  <div className="h-16 flex items-center justify-center">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-black text-lg flex items-center justify-center shadow-sm">
                      M
                    </div>
                  </div>
                  <div className="text-xs font-bold text-foreground">Monogram Symbol</div>
                  <div className="text-[10px] text-muted-foreground">App Icon & Favicon</div>
                </div>

                <div className="p-4 rounded-xl border border-border/70 bg-card text-center space-y-2">
                  <div className="h-16 flex items-center justify-center font-black text-xl text-slate-900 dark:text-slate-100 font-mono tracking-widest">
                    MAGNERTIA
                  </div>
                  <div className="text-xs font-bold text-foreground">Wordmark Only</div>
                  <div className="text-[10px] text-muted-foreground">Legal & Print Filings</div>
                </div>
              </div>
            </div>

            {/* Brand Color Palette */}
            <div className="card-soft p-5 border-border/80">
              <h3 className="font-display text-base font-bold text-foreground mb-1">
                Official Brand Color System (HEX / RGB / CMYK)
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Strict color harmony tokens for web, digital interfaces, vehicle livery, and print materials.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="rounded-xl border border-border/70 overflow-hidden bg-card">
                  <div className="h-16 bg-blue-600 flex items-center justify-center text-white font-mono text-xs font-bold">
                    #2563EB
                  </div>
                  <div className="p-2.5 text-xs">
                    <div className="font-bold text-foreground">Brand Primary</div>
                    <div className="text-[10px] text-muted-foreground">RGB: 37, 99, 235</div>
                    <div className="text-[10px] text-muted-foreground">CMYK: 84, 58, 0, 8</div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/70 overflow-hidden bg-card">
                  <div className="h-16 bg-cyan-500 flex items-center justify-center text-white font-mono text-xs font-bold">
                    #06B6D4
                  </div>
                  <div className="p-2.5 text-xs">
                    <div className="font-bold text-foreground">Cyan Energy</div>
                    <div className="text-[10px] text-muted-foreground">RGB: 6, 182, 212</div>
                    <div className="text-[10px] text-muted-foreground">CMYK: 97, 14, 0, 17</div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/70 overflow-hidden bg-card">
                  <div className="h-16 bg-emerald-500 flex items-center justify-center text-white font-mono text-xs font-bold">
                    #10B981
                  </div>
                  <div className="p-2.5 text-xs">
                    <div className="font-bold text-foreground">Clean Mobility</div>
                    <div className="text-[10px] text-muted-foreground">RGB: 16, 185, 129</div>
                    <div className="text-[10px] text-muted-foreground">CMYK: 91, 0, 30, 27</div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/70 overflow-hidden bg-card">
                  <div className="h-16 bg-slate-900 flex items-center justify-center text-white font-mono text-xs font-bold">
                    #0F172A
                  </div>
                  <div className="p-2.5 text-xs">
                    <div className="font-bold text-foreground">Slate Dark</div>
                    <div className="text-[10px] text-muted-foreground">RGB: 15, 23, 42</div>
                    <div className="text-[10px] text-muted-foreground">CMYK: 64, 45, 0, 84</div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/70 overflow-hidden bg-card">
                  <div className="h-16 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-foreground font-mono text-xs font-bold border-b border-border/50">
                    #F1F5F9
                  </div>
                  <div className="p-2.5 text-xs">
                    <div className="font-bold text-foreground">Surface Light</div>
                    <div className="text-[10px] text-muted-foreground">RGB: 241, 245, 249</div>
                    <div className="text-[10px] text-muted-foreground">CMYK: 3, 2, 0, 2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIGITAL ASSET LIBRARY */}
        {activeTab === "assets" && (
          <div className="space-y-4">
            <div className="card-soft p-5 border-border/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Centralized Digital Brand Asset Repository
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Pre-approved vector logomarks, typography packages, 3D hardware renders, and brochure print templates.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                    <Upload className="h-3.5 w-3.5" /> Upload Asset
                  </Button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                      <th className="pb-2.5">Asset ID</th>
                      <th className="pb-2.5">Asset Name</th>
                      <th className="pb-2.5">Format</th>
                      <th className="pb-2.5">Category</th>
                      <th className="pb-2.5">Version</th>
                      <th className="pb-2.5">File Size</th>
                      <th className="pb-2.5 text-center">Status</th>
                      <th className="pb-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-mono font-bold text-primary">AST-001</td>
                      <td className="py-3 font-semibold text-foreground">Magnertia Master Vector Logo Suite</td>
                      <td className="py-3 font-mono text-muted-foreground">SVG, AI, EPS</td>
                      <td className="py-3 text-muted-foreground">Visual Identity</td>
                      <td className="py-3 font-mono">v2.1</td>
                      <td className="py-3 font-mono text-muted-foreground">14.2 MB</td>
                      <td className="py-3 text-center">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Approved
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 text-primary gap-1">
                          <Download className="h-3 w-3" /> Download
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-mono font-bold text-primary">AST-002</td>
                      <td className="py-3 font-semibold text-foreground">Autonomous W-EVSE 3D Ground Pad Render</td>
                      <td className="py-3 font-mono text-muted-foreground">PNG (Alpha, 4K)</td>
                      <td className="py-3 text-muted-foreground">Product Renders</td>
                      <td className="py-3 font-mono">v1.4</td>
                      <td className="py-3 font-mono text-muted-foreground">28.5 MB</td>
                      <td className="py-3 text-center">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Approved
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 text-primary gap-1">
                          <Download className="h-3 w-3" /> Download
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-mono font-bold text-primary">AST-003</td>
                      <td className="py-3 font-semibold text-foreground">Corporate Presentation Template Master</td>
                      <td className="py-3 font-mono text-muted-foreground">PPTX, Keynote</td>
                      <td className="py-3 text-muted-foreground">Marketing Templates</td>
                      <td className="py-3 font-mono">v3.0</td>
                      <td className="py-3 font-mono text-muted-foreground">42.1 MB</td>
                      <td className="py-3 text-center">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Approved
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 text-primary gap-1">
                          <Download className="h-3 w-3" /> Download
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BRAND GUIDELINES */}
        {activeTab === "guidelines" && (
          <div className="space-y-4">
            <div className="card-soft p-5 border-border/80">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Brand Usage Rules & Governance Standards
                  </h3>
                  <p className="text-xs text-muted-foreground">Clear space requirements, minimum print sizes, and partner co-branding rules.</p>
                </div>
                <Badge variant="outline" className="text-xs">Version 2.4 Active</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-border/70 bg-background/60 space-y-2">
                  <span className="font-bold text-foreground text-sm block">1. Clear Space Protection</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Always maintain an exclusion zone around the logo equal to the height of the letter "M". No text, borders, or graphics may enter this boundary.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border/70 bg-background/60 space-y-2">
                  <span className="font-bold text-foreground text-sm block">2. Minimum Sizing</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Digital displays: Minimum width of 120 pixels. Print media: Minimum width of 25mm. Below these dimensions, only use the isolated monogram "M".
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border/70 bg-background/60 space-y-2">
                  <span className="font-bold text-foreground text-sm block">3. Partner Co-Branding</span>
                  <p className="text-muted-foreground leading-relaxed">
                    When pairing with CPO or fleet partner logos, separate marks with a 1px vertical divider line (#94A3B8) with equal optical visual weight.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TRADEMARKS & IP */}
        {activeTab === "trademarks" && (
          <div className="space-y-4">
            <div className="card-soft p-5 border-border/80">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-emerald-600" />
                    Trademark Registrations & Intellectual Property Protection
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Registered trademarks, pending patent filings, and legal class jurisdictions.
                  </p>
                </div>
                <Button size="sm" className="gap-1 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Register Trademark
                </Button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                      <th className="pb-2.5">Mark / Wordmark</th>
                      <th className="pb-2.5">Registration No.</th>
                      <th className="pb-2.5">Nice Class</th>
                      <th className="pb-2.5">Jurisdiction</th>
                      <th className="pb-2.5">Filing Date</th>
                      <th className="pb-2.5">Renewal Due</th>
                      <th className="pb-2.5 text-center">Legal Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">MAGNERTIA ®</td>
                      <td className="py-3 text-muted-foreground">TM-IN-589201</td>
                      <td className="py-3 font-sans">Class 9 & 37 (EV Chargers & Install)</td>
                      <td className="py-3 font-sans">India (Controller General of Patents)</td>
                      <td className="py-3 text-muted-foreground">12-Jan-2024</td>
                      <td className="py-3 text-muted-foreground">12-Jan-2034</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Registered
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">Autonomous W-EVSE ™</td>
                      <td className="py-3 text-muted-foreground">TM-IN-610442</td>
                      <td className="py-3 font-sans">Class 9 (Inductive Power Equipment)</td>
                      <td className="py-3 font-sans">India & WIPO Madrid Protocol</td>
                      <td className="py-3 text-muted-foreground">18-Aug-2025</td>
                      <td className="py-3 text-muted-foreground">18-Aug-2035</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-blue-500/15 text-blue-600 px-2 py-0.5 text-[10px] font-semibold border border-blue-500/30">
                          Examination Passed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default BrandingManagementPage;
