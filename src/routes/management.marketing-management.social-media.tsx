import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Share2,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Layers,
  Plus,
  FileText,
  AlertTriangle,
  Upload,
  Headphones,
  Info,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/marketing-management/social-media"
)({
  head: () => ({
    meta: [
      { title: "Social Media · Marketing Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise Social Media Workspace for publishing schedule, creative assets, channel accounts, and social listening across LinkedIn, YouTube, Instagram, Facebook, X, and WhatsApp.",
      },
    ],
  }),
  component: SocialMediaManagementPage,
});

type MAICW = "M" | "A" | "I" | "C" | "W";

function MAICWBadge({ type }: { type: MAICW }) {
  const meta: Record<MAICW, { label: string; desc: string; bg: string; text: string }> = {
    M: { label: "M", desc: "Mandatory Field - Required for governance & launch", bg: "bg-red-500/10 border-red-500/30", text: "text-red-600 dark:text-red-400" },
    A: { label: "A", desc: "Auto-generated / System Controlled Identifier", bg: "bg-slate-500/10 border-slate-500/30", text: "text-slate-600 dark:text-slate-400" },
    I: { label: "I", desc: "Information / Lookup Master Link", bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-600 dark:text-blue-400" },
    C: { label: "C", desc: "Calculated Formula / Derived Dynamic Metric", bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-600 dark:text-purple-400" },
    W: { label: "W", desc: "Workflow State / Human Action Trigger", bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
  };

  const item = meta[type];
  return (
    <span
      title={item.desc}
      className={cn(
        "inline-flex items-center justify-center font-mono text-[10px] font-black h-4 w-4 rounded-xs border select-none cursor-help",
        item.bg,
        item.text
      )}
    >
      {item.label}
    </span>
  );
}

const SOCIAL_TABS = [
  { id: "calendar", label: "Publishing Calendar" },
  { id: "creatives", label: "Content & Creatives" },
  { id: "accounts", label: "Channel Accounts" },
  { id: "listening", label: "Social Listening & Sentiment" },
];

export function SocialMediaManagementPage() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [showMaicwLegend, setShowMaicwLegend] = useState(false);
  const [fiscalYear, setFiscalYear] = useState("FY 2026-27");
  const [dateRange] = useState("01 Sep 2026 - 30 Sep 2026");

  const handleNewPost = () => {
    toast.success("Post Composer Opened", {
      description: "Drafting multi-platform post across LinkedIn, X, Instagram, and YouTube.",
    });
  };

  const handleSchedulePost = () => {
    toast.info("Scheduler Activated", {
      description: "Auto-optimal posting time set to 11:30 AM IST.",
    });
  };

  const handleGenerateAI = () => {
    toast.success("AI Social Intelligence Engine Generated 5 Creatives", {
      description: "Optimized hooks and hashtags for autonomous EV charging fleets.",
    });
  };

  return (
    <AppShell
      title="Social Media"
      breadcrumb="Management > Marketing Management > Social Media > Publishing & Channel Operations"
      description="Engage People. Build Community. Drive Growth."
      tabs={<MarketingManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Header Card Matching Screenshot Exactly */}
        <div className="card-soft p-4 sm:p-5 border-border/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  Social Media
                </h1>
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
                <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-mono font-bold text-foreground/80 border border-border">
                  SM-2026-001
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400">
                  v1.0
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMaicwLegend(!showMaicwLegend)}
                  className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground"
                >
                  <Info className="h-3.5 w-3.5 mr-1 text-primary" /> MAICW Standards
                </Button>
              </div>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Engage People. Build Community. Drive Growth.
              </p>
            </div>

            {/* Top Controls & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                className="h-9 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none"
              >
                <option value="FY 2026-27">FY 2026-27</option>
                <option value="FY 2025-26">FY 2025-26</option>
              </select>

              <div className="h-9 flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-mono text-foreground">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{dateRange}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNewPost}
                className="gap-1.5 text-xs font-semibold shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" /> New Post
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSchedulePost}
                className="gap-1.5 text-xs font-semibold shadow-xs"
              >
                <Clock className="h-3.5 w-3.5 text-primary" /> Schedule Post
              </Button>
            </div>
          </div>

          {/* Collapsible MAICW Legend */}
          {showMaicwLegend && (
            <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3.5 text-xs text-muted-foreground">
              <div className="font-bold text-foreground mb-2 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-primary" /> Master Form Field Classification (MAICW)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                <div className="flex items-center gap-2">
                  <MAICWBadge type="M" />
                  <span><strong>Mandatory</strong> (Governance)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MAICWBadge type="A" />
                  <span><strong>Auto-generated</strong> (System ID)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MAICWBadge type="I" />
                  <span><strong>Information</strong> (Lookup master)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MAICWBadge type="C" />
                  <span><strong>Calculated</strong> (Dynamic KPI)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MAICWBadge type="W" />
                  <span><strong>Workflow</strong> (Action state)</span>
                </div>
              </div>
            </div>
          )}

          {/* 4 Focused Sub-Tabs Strip (No repeating inner Overview) */}
          <div className="mt-4 border-t border-border/80 pt-1">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 select-none">
              {SOCIAL_TABS.map((t) => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={cn(
                      "shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TAB 1: PUBLISHING CALENDAR (Default Operational Workspace) */}
        {activeTab === "calendar" && (
          <div className="space-y-4">
            {/* Quick Action & Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="card-soft p-3.5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Scheduled Posts</div>
                  <div className="text-lg font-bold text-foreground">14 Posts</div>
                </div>
              </div>
              <div className="card-soft p-3.5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Published This Month</div>
                  <div className="text-lg font-bold text-foreground">48 Live</div>
                </div>
              </div>
              <div className="card-soft p-3.5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">AI Suggestions Queued</div>
                  <div className="text-lg font-bold text-foreground">6 Drafts</div>
                </div>
              </div>
              <div className="card-soft p-3.5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Pending SLA Review</div>
                  <div className="text-lg font-bold text-foreground">3 Awaiting</div>
                </div>
              </div>
            </div>

            {/* Publishing Schedule & Dispatch Engine Table */}
            <div className="card-soft p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/70">
                <div>
                  <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Publishing Schedule & Dispatch Engine
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Active multi-platform dispatch timetable with auto-timing algorithms.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleGenerateAI} className="h-8 gap-1.5 text-xs">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" /> Auto-Fill Schedule
                  </Button>
                  <Button size="sm" onClick={handleSchedulePost} className="h-8 gap-1.5 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Schedule New Broadcast
                  </Button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                      <th className="pb-2.5">Date & Time</th>
                      <th className="pb-2.5">Platform</th>
                      <th className="pb-2.5">Content Title</th>
                      <th className="pb-2.5">Creative Asset</th>
                      <th className="pb-2.5">Target Audience</th>
                      <th className="pb-2.5">Publisher</th>
                      <th className="pb-2.5 text-center">Status</th>
                      <th className="pb-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-mono text-muted-foreground">18-Sep-26 11:30 AM</td>
                      <td className="py-3 font-semibold text-[#0077b5] flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#0077b5]" /> LinkedIn
                      </td>
                      <td className="py-3 font-semibold text-foreground">EV Charging Future: Hands-free Power</td>
                      <td className="py-3 font-mono text-[11px] text-muted-foreground">SMC-01 (Carousel)</td>
                      <td className="py-3 text-muted-foreground">Fleet Operators & CPO</td>
                      <td className="py-3">Arun Kumar</td>
                      <td className="py-3 text-center">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Published
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 text-primary">View Analytics</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-mono text-muted-foreground">20-Sep-26 04:00 PM</td>
                      <td className="py-3 font-semibold text-red-600 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-600" /> YouTube
                      </td>
                      <td className="py-3 font-semibold text-foreground">Technical Breakdown of Inductive Resonance</td>
                      <td className="py-3 font-mono text-[11px] text-muted-foreground">SMC-02 (4K Video)</td>
                      <td className="py-3 text-muted-foreground">Automotive Engineers & OEMs</td>
                      <td className="py-3">Priya S</td>
                      <td className="py-3 text-center">
                        <span className="rounded-full bg-blue-500/15 text-blue-600 px-2 py-0.5 text-[10px] font-semibold border border-blue-500/30">
                          Scheduled
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 text-foreground">Edit Dispatch</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-mono text-muted-foreground">22-Sep-26 06:30 PM</td>
                      <td className="py-3 font-semibold text-pink-600 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-pink-600" /> Instagram
                      </td>
                      <td className="py-3 font-semibold text-foreground">Behind the Scenes at Hosur Gigafactory</td>
                      <td className="py-3 font-mono text-[11px] text-muted-foreground">SMC-03 (Reels / 9:16)</td>
                      <td className="py-3 text-muted-foreground">EV Enthusiasts & Tech Talent</td>
                      <td className="py-3">Divya R</td>
                      <td className="py-3 text-center">
                        <span className="rounded-full bg-amber-500/15 text-amber-600 px-2 py-0.5 text-[10px] font-semibold border border-amber-500/30">
                          In Review
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 text-foreground">Approve</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-mono text-muted-foreground">25-Sep-26 10:00 AM</td>
                      <td className="py-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-slate-800 dark:bg-slate-200" /> 𝕏
                      </td>
                      <td className="py-3 font-semibold text-foreground">Wireless Fast-Charging Standard Announcement</td>
                      <td className="py-3 font-mono text-[11px] text-muted-foreground">SMC-04 (Infographic)</td>
                      <td className="py-3 text-muted-foreground">Energy Analysts & Press</td>
                      <td className="py-3">Arun Kumar</td>
                      <td className="py-3 text-center">
                        <span className="rounded-full bg-blue-500/15 text-blue-600 px-2 py-0.5 text-[10px] font-semibold border border-blue-500/30">
                          Scheduled
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 text-foreground">Edit Dispatch</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTENT & CREATIVES */}
        {activeTab === "creatives" && (
          <div className="space-y-4">
            <div className="card-soft p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/70">
                <div>
                  <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Social Content Master & Creative Asset Repository
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Pre-cleared media assets, visual copy kits, and aspect-ratio versions across all channels.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                    <Upload className="h-3.5 w-3.5" /> Bulk Upload
                  </Button>
                  <Button size="sm" className="h-8 gap-1 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Add Creative Asset
                  </Button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                      <th className="pb-2">Content ID</th>
                      <th className="pb-2">Title</th>
                      <th className="pb-2">Format</th>
                      <th className="pb-2">Platforms</th>
                      <th className="pb-2">Call to Action</th>
                      <th className="pb-2">Version</th>
                      <th className="pb-2 text-center">Status</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 font-mono font-bold text-primary">SMC-01</td>
                      <td className="py-2.5 font-semibold text-foreground">Why Cable EV Chargers Cause Fleet Bottlenecks</td>
                      <td className="py-2.5">
                        <span className="rounded bg-muted px-2 py-0.5 font-medium">Carousel (10 slides)</span>
                      </td>
                      <td className="py-2.5">LinkedIn, Instagram</td>
                      <td className="py-2.5"><span className="rounded bg-primary/10 text-primary px-1.5 py-0.5 font-semibold">Request Demo</span></td>
                      <td className="py-2.5 font-mono text-muted-foreground">v1.2</td>
                      <td className="py-2.5 text-center">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Approved
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 text-primary">Preview & Push</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 font-mono font-bold text-primary">SMC-02</td>
                      <td className="py-2.5 font-semibold text-foreground">Autonomous Wireless EVSE in Action: 150 kW Pad</td>
                      <td className="py-2.5">
                        <span className="rounded bg-muted px-2 py-0.5 font-medium">4K Video (90s)</span>
                      </td>
                      <td className="py-2.5">YouTube, LinkedIn</td>
                      <td className="py-2.5"><span className="rounded bg-primary/10 text-primary px-1.5 py-0.5 font-semibold">Watch Full Demo</span></td>
                      <td className="py-2.5 font-mono text-muted-foreground">v2.0</td>
                      <td className="py-2.5 text-center">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Published
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 text-foreground">Asset Kit</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 font-mono font-bold text-primary">SMC-03</td>
                      <td className="py-2.5 font-semibold text-foreground">Behind the Scenes at Hosur Gigafactory</td>
                      <td className="py-2.5">
                        <span className="rounded bg-muted px-2 py-0.5 font-medium">Vertical Reel (30s)</span>
                      </td>
                      <td className="py-2.5">Instagram, YouTube Shorts</td>
                      <td className="py-2.5"><span className="rounded bg-primary/10 text-primary px-1.5 py-0.5 font-semibold">Explore Careers</span></td>
                      <td className="py-2.5 font-mono text-muted-foreground">v1.0</td>
                      <td className="py-2.5 text-center">
                        <span className="rounded-full bg-amber-500/15 text-amber-600 px-2 py-0.5 text-[10px] font-semibold border border-amber-500/30">
                          In Review
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 text-foreground">Review</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CHANNEL ACCOUNTS */}
        {activeTab === "accounts" && (
          <div className="space-y-4">
            <div className="card-soft p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/70">
                <div>
                  <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    Social Media Account Master Register
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Connected corporate and product brand handles with OAuth 2.0 status and token validity.
                  </p>
                </div>
                <Button size="sm" className="h-8 gap-1 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Connect Platform Account
                </Button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                      <th className="pb-2.5">Platform</th>
                      <th className="pb-2.5">Account Name</th>
                      <th className="pb-2.5">Handle</th>
                      <th className="pb-2.5">Followers</th>
                      <th className="pb-2.5">Business Unit</th>
                      <th className="pb-2.5">Administrator</th>
                      <th className="pb-2.5">API Status</th>
                      <th className="pb-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-semibold text-[#0077b5]">LinkedIn</td>
                      <td className="py-3 font-medium text-foreground">Magnertia Wireless Power</td>
                      <td className="py-3 font-mono text-muted-foreground">@magnertia-ev</td>
                      <td className="py-3 font-bold text-foreground">42,500</td>
                      <td className="py-3 text-muted-foreground">Charging Solutions</td>
                      <td className="py-3">Arun Kumar</td>
                      <td className="py-3 text-emerald-600 font-mono text-[11px]">Connected (OAuth 2.0)</td>
                      <td className="py-3 text-center">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-semibold text-red-600">YouTube</td>
                      <td className="py-3 font-medium text-foreground">Magnertia Official</td>
                      <td className="py-3 font-mono text-muted-foreground">@MagnertiaEV</td>
                      <td className="py-3 font-bold text-foreground">68,400</td>
                      <td className="py-3 text-muted-foreground">Corporate Branding</td>
                      <td className="py-3">Priya S</td>
                      <td className="py-3 text-emerald-600 font-mono text-[11px]">Connected (v3 API)</td>
                      <td className="py-3 text-center">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-semibold text-pink-600">Instagram</td>
                      <td className="py-3 font-medium text-foreground">Magnertia Innovation</td>
                      <td className="py-3 font-mono text-muted-foreground">@magnertia_ev</td>
                      <td className="py-3 font-bold text-foreground">54,100</td>
                      <td className="py-3 text-muted-foreground">Charging Solutions</td>
                      <td className="py-3">Divya R</td>
                      <td className="py-3 text-emerald-600 font-mono text-[11px]">Connected (Graph API)</td>
                      <td className="py-3 text-center">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-semibold text-blue-600">Facebook</td>
                      <td className="py-3 font-medium text-foreground">Magnertia Global</td>
                      <td className="py-3 font-mono text-muted-foreground">@MagnertiaGlobal</td>
                      <td className="py-3 font-bold text-foreground">38,200</td>
                      <td className="py-3 text-muted-foreground">Corporate Branding</td>
                      <td className="py-3">Kiran V</td>
                      <td className="py-3 text-emerald-600 font-mono text-[11px]">Connected (Page API)</td>
                      <td className="py-3 text-center">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">𝕏</td>
                      <td className="py-3 font-medium text-foreground">Magnertia Energy</td>
                      <td className="py-3 font-mono text-muted-foreground">@MagnertiaEnergy</td>
                      <td className="py-3 font-bold text-foreground">25,300</td>
                      <td className="py-3 text-muted-foreground">PR & IR</td>
                      <td className="py-3">Arun Kumar</td>
                      <td className="py-3 text-emerald-600 font-mono text-[11px]">Connected (v2 API)</td>
                      <td className="py-3 text-center">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SOCIAL LISTENING & SENTIMENT */}
        {activeTab === "listening" && (
          <div className="space-y-4">
            <div className="card-soft p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/70">
                <div>
                  <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-purple-600" />
                    Social Listening Monitor & AI Sentiment Analytics
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Real-time monitoring of brand mentions, sentiment distributions, and competitor mentions across the web.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Updated 4 mins ago
                </Badge>
              </div>

              {/* Sentiment Summary Cards */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-600 text-sm">Positive Sentiment (78%)</span>
                    <span className="text-xs font-mono text-emerald-600 font-bold">↑ 4.2%</span>
                  </div>
                  <p className="mt-1.5 text-muted-foreground leading-relaxed">
                    High praise for wireless convenience, safety, and no cable wear in wet logistics yards and fleet depots.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg border border-blue-500/30 bg-blue-500/5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-600 text-sm">Neutral / Technical (18%)</span>
                    <span className="text-xs font-mono text-muted-foreground">→ Stable</span>
                  </div>
                  <p className="mt-1.5 text-muted-foreground leading-relaxed">
                    Engineering queries regarding transmission efficiency (96.4%) and alignment tolerances on unpaved surfaces.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg border border-red-500/30 bg-red-500/5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-600 text-sm">Negative / Objections (4%)</span>
                    <span className="text-xs font-mono text-emerald-600">↓ 1.8%</span>
                  </div>
                  <p className="mt-1.5 text-muted-foreground leading-relaxed">
                    CAPEX inquiry comparisons versus legacy plug-in chargers from budget-conscious sub-contractors.
                  </p>
                </div>
              </div>

              {/* Live Mentions Feed */}
              <div className="mt-5">
                <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-wider mb-2.5">
                  Live Social Mentions Feed
                </h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-border/70 bg-background/60 flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">@LogisticsDailyIndia on LinkedIn</span>
                        <span className="text-muted-foreground text-[11px] font-mono">15m ago</span>
                      </div>
                      <p className="mt-0.5 text-muted-foreground">
                        "Seeing @Magnertia wireless charging pads in action at Chennai port depot. Turnaround time cut by 22% with zero cord tangles."
                      </p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-border/70 bg-background/60 flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">@AutoTechReview on 𝕏</span>
                        <span className="text-muted-foreground text-[11px] font-mono">1h ago</span>
                      </div>
                      <p className="mt-0.5 text-muted-foreground">
                        "Comparing 150kW inductive power transfer vs DC fast-cables. The air gap efficiency curve published by Magnertia looks solid."
                      </p>
                    </div>
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

export default SocialMediaManagementPage;
