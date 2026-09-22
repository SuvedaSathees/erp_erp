import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Mail,
  Save,
  Send,
  Calendar,
  Edit3,
  Users,
  MousePointerClick,
  Filter,
  BarChart3,
  IndianRupee,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Check,
  ShieldCheck,
  Plus,
  RefreshCw,
  FileText,
  Copy,
  AlertTriangle,
  Eye,
  Sliders,
  Workflow,
  Smartphone,
  Monitor,
  Zap,
  Tag,
  Building2,
  DollarSign,
  Download,
  Search,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/marketing-management/email-marketing"
)({
  head: () => ({
    meta: [
      { title: "Email Marketing · Marketing Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise Email Marketing Master Form (MAICW) for campaign orchestration, dynamic personalization, nurturing sequences, analytics, and CRM integration.",
      },
    ],
  }),
  component: EmailMarketingManagementPage,
});

type MAICW = "M" | "A" | "I" | "C" | "W";

function MAICWBadge({ type }: { type: MAICW }) {
  const meta: Record<MAICW, { label: string; desc: string; bg: string; text: string }> = {
    M: { label: "M", desc: "Mandatory Field - Required for governance & launch", bg: "bg-red-500/10 border-red-500/30", text: "text-red-600 dark:text-red-400" },
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
        "inline-flex h-4 w-4 items-center justify-center rounded-full border text-[9px] font-bold cursor-help transition-transform hover:scale-110 shrink-0 select-none",
        item.bg,
        item.text
      )}
    >
      {item.label}
    </span>
  );
}

const EMAIL_TABS = [
  { id: "broadcasts", label: "Email Broadcasts" },
  { id: "templates", label: "Template Builder" },
  { id: "lists", label: "Subscriber Lists & Segments" },
  { id: "drips", label: "Drip Automations" },
];

export function EmailMarketingManagementPage() {
  const [activeTab, setActiveTab] = useState("broadcasts");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [showComposerModal, setShowComposerModal] = useState(false);

  // Form State
  const [campaignName, setCampaignName] = useState("Future Ready EV Charging - Sept 2026");
  const [subjectLine, setSubjectLine] = useState("⚡ Introducing Wireless Fleet Charging: 35% Faster Turnaround");
  const [targetSegment, setTargetSegment] = useState("Enterprise EV Fleet Operators");
  const [campaignType, setCampaignType] = useState("Lead Generation");
  const [productService, setProductService] = useState("Autonomous W-EVSE 150kW");

  const handleSave = () => {
    toast.success("Email Campaign Saved", {
      description: "EM-2026-001 updated in master marketing records with full MAICW classification.",
    });
  };

  const handleSendTest = () => {
    toast.info("Test Email Dispatched", {
      description: "Preview version sent to admin@magnertia.com with DKIM signature.",
    });
  };

  const handleScheduleSend = () => {
    toast.success("Email Campaign Scheduled & Broadcasting", {
      description: "Delivery queue activated for 12,500 recipients across validated segments.",
    });
  };

  return (
    <AppShell
      title="Email Marketing"
      breadcrumb="Management > Marketing Management > Email Marketing > Email Campaign Details"
      description="Connect. Communicate. Convert."
      tabs={<MarketingManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Header Card Matching Screenshot Exactly */}
        <div className="card-soft p-4 sm:p-5 border-border/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Email Marketing
                </h1>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold rounded-full">
                  Active
                </Badge>
                <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary border border-primary/20">
                  EM-2026-001
                </span>
                <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground border border-border">
                  v1.0
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground font-medium">
                Connect. Communicate. Convert.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="h-8 gap-1.5 text-xs border-border/80 shadow-xs"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendTest}
                className="h-8 gap-1.5 text-xs border-border/80 shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
                Send Test
              </Button>
              <Button
                size="sm"
                onClick={handleScheduleSend}
                className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs"
              >
                <Calendar className="h-3.5 w-3.5" />
                Schedule & Send
              </Button>
            </div>
          </div>

          {/* 4 Focused Tabs Strip */}
          <div className="mt-4 border-t border-border/80 pt-1">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 select-none">
              {EMAIL_TABS.map((t) => {
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

        {/* TAB 1: EMAIL BROADCASTS & COMPOSER */}
        {activeTab === "broadcasts" && (
          <div className="space-y-4">
            {/* Operational Broadcasts Master Table */}
            <div className="card-soft p-5 border-border/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">Scheduled & Dispatched Broadcasts</h3>
                  <Badge variant="outline" className="text-xs font-mono ml-2">4 Active Campaigns</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setShowComposerModal(true)}
                    className="h-8 gap-1.5 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Broadcast
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                      <th className="pb-2.5">Broadcast ID</th>
                      <th className="pb-2.5">Campaign Name & Subject</th>
                      <th className="pb-2.5">Audience Segment</th>
                      <th className="pb-2.5 text-right">Recipients</th>
                      <th className="pb-2.5 text-right">Open Rate</th>
                      <th className="pb-2.5 text-right">CTR</th>
                      <th className="pb-2.5 text-center">Status</th>
                      <th className="pb-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {[
                      { id: "EMC-2026-001", name: "Future Ready EV Charging", subj: "⚡ Wireless Fleet Charging: 35% Faster Turnaround", seg: "Enterprise EV Fleet Operators", rec: "12,500", open: "34.0%", ctr: "8.2%", status: "Active", statusColor: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
                      { id: "EMC-2026-002", name: "Smart City Commercial Infra", subj: "Subterranean Inductive Charging for Municipalities", seg: "Smart City & GeM Buyers", rec: "3,500", open: "41.5%", ctr: "11.2%", status: "Scheduled", statusColor: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
                      { id: "EMC-2026-003", name: "Commercial Mall Parking ROI", subj: "Zero Cable Hazards: Turn Charging into Mall Footfall", seg: "Commercial Mall Developers", rec: "3,800", open: "28.4%", ctr: "6.5%", status: "Sent", statusColor: "bg-purple-500/15 text-purple-600 border-purple-500/30" },
                      { id: "EMC-2026-004", name: "Q4 OEM Partner Newsletter", subj: "SAE J2954 Receiver Coil Interoperability Benchmark", seg: "OEMs & System Integrators", rec: "2,400", open: "48.2%", ctr: "14.0%", status: "Draft", statusColor: "bg-slate-500/15 text-slate-600 border-slate-500/30" },
                    ].map((row) => (
                      <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-mono font-bold text-primary">{row.id}</td>
                        <td className="py-3">
                          <div className="font-semibold text-foreground">{row.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate max-w-xs">{row.subj}</div>
                        </td>
                        <td className="py-3 text-muted-foreground">{row.seg}</td>
                        <td className="py-3 text-right font-mono font-bold text-foreground">{row.rec}</td>
                        <td className="py-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">{row.open}</td>
                        <td className="py-3 text-right font-mono text-primary font-bold">{row.ctr}</td>
                        <td className="py-3 text-center">
                          <Badge className={cn("text-[10px] font-semibold border", row.statusColor)}>
                            {row.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleSendTest}
                              className="h-7 px-2 text-[11px] border-border/70"
                            >
                              Test
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.info(`Broadcast ${row.id} cloned into new draft.`)}
                              className="h-7 px-2 text-[11px]"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Composer & Live Device Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="card-soft p-5 lg:col-span-6 space-y-4 border-border/80">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Edit3 className="h-4 w-4 text-primary" />
                    Live Broadcast Composer (EM-2026-001)
                  </h3>
                  <Badge variant="outline" className="text-[10px]">HTML & AMP Ready</Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-muted-foreground font-medium flex items-center justify-between">
                      <span>Campaign Title</span>
                      <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="mt-1 w-full rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium flex items-center justify-between">
                      <span>Email Subject Line</span>
                      <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={subjectLine}
                      onChange={(e) => setSubjectLine(e.target.value)}
                      className="mt-1 w-full rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-muted-foreground font-medium">Target Segment</label>
                      <select
                        value={targetSegment}
                        onChange={(e) => setTargetSegment(e.target.value)}
                        className="mt-1 w-full rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
                      >
                        <option>Enterprise EV Fleet Operators</option>
                        <option>Commercial Mall Developers</option>
                        <option>Smart City & GeM Buyers</option>
                        <option>OEMs & System Integrators</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-muted-foreground font-medium">Product / Technology</label>
                      <select
                        value={productService}
                        onChange={(e) => setProductService(e.target.value)}
                        className="mt-1 w-full rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
                      >
                        <option>Autonomous W-EVSE 150kW</option>
                        <option>Fleet Hub DC Fast Charger</option>
                        <option>Power Matrix 350kW</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Client Preview (Desktop / Mobile toggle) */}
              <div className="card-soft p-5 lg:col-span-6 space-y-3 border-border/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" />
                      Email Client Rendering Preview
                    </h3>
                    <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
                      <button
                        type="button"
                        onClick={() => setPreviewDevice("desktop")}
                        className={cn("px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1", previewDevice === "desktop" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground")}
                      >
                        <Monitor className="h-3 w-3" /> Desktop
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice("mobile")}
                        className={cn("px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1", previewDevice === "mobile" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground")}
                      >
                        <Smartphone className="h-3 w-3" /> Mobile
                      </button>
                    </div>
                  </div>

                  <div className={cn("mt-3 mx-auto rounded-xl border border-border/80 bg-background p-4 text-xs shadow-inner space-y-3 transition-all", previewDevice === "mobile" ? "max-w-xs" : "w-full")}>
                    <div className="border-b border-border/60 pb-2 text-[11px] text-muted-foreground">
                      <div><strong>From:</strong> Arun Kumar &lt;arun.kumar@magnertia.com&gt;</div>
                      <div><strong>To:</strong> {"{{prospect_first_name}}"} &lt;{"{{prospect_email}}"}&gt;</div>
                      <div><strong>Subject:</strong> {subjectLine}</div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-foreground">Dear {"{{prospect_first_name}}"},</p>
                      <p className="text-muted-foreground leading-relaxed">
                        Fleet turnaround times shouldn't be held back by heavy plug-in cables. Magnertia's <strong>Autonomous W-EVSE 150 kW</strong> enables rapid wireless energy transfer with zero surface footprint.
                      </p>
                      <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-center">
                        <Button size="sm" className="h-7 text-xs font-semibold">
                          Download Fleet Case Study (PDF)
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground text-center pt-2">
                        Magnertia Industrial Technologies · Bangalore, India · <a href="#optout" className="underline">Unsubscribe</a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                  <span>DKIM / SPF: <strong>100% Passed</strong></span>
                  <span>Spam Score: <strong>0.1 / 10 (Clean)</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEMPLATE BUILDER */}
        {activeTab === "templates" && (
          <div className="space-y-4">
            <div className="card-soft p-5 border-border/80">
              <div className="flex items-center justify-between pb-3 border-b border-border/70">
                <div>
                  <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Email Template Library & Version Control
                  </h2>
                  <p className="text-xs text-muted-foreground">Standardized brand-approved templates with modular drag-and-drop components.</p>
                </div>
                <Button size="sm" onClick={() => toast.success("Template Editor Initialized")} className="h-8 gap-1 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Design New Template
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {[
                  { name: "Product Launch Invite", type: "Promotional", ver: "v2.1", open: "34.0%", ctr: "8.2%" },
                  { name: "Monthly Fleet Newsletter", type: "Newsletter", ver: "v1.4", open: "28.4%", ctr: "6.1%" },
                  { name: "Executive Webinar Invitation", type: "Event", ver: "v3.0", open: "42.1%", ctr: "10.5%" },
                  { name: "Technical Case Study Share", type: "Educational", ver: "v1.0", open: "31.0%", ctr: "7.8%" },
                  { name: "Re-engagement Nudge", type: "Re-engagement", ver: "v2.0", open: "18.0%", ctr: "4.0%" },
                  { name: "Transactional Order Receipt", type: "Transactional", ver: "v1.2", open: "68.5%", ctr: "14.2%" },
                ].map((tpl, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border/80 bg-card/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-sm">{tpl.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{tpl.ver}</span>
                      </div>
                      <div className="text-[11px] text-primary font-medium mt-1">{tpl.type}</div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between font-mono text-[11px]">
                      <span>Open: <strong>{tpl.open}</strong></span>
                      <span className="text-emerald-600">CTR: <strong>{tpl.ctr}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Personalization & CTA Matrix */}
            <div className="card-soft p-5 border-border/80">
              <h3 className="font-bold text-sm text-foreground mb-2">Subject Line, Personalization & CTA Tracking</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                      <th className="pb-2">CTA Label</th>
                      <th className="pb-2">Destination URL</th>
                      <th className="pb-2">UTM Campaign</th>
                      <th className="pb-2 text-right">Clicks</th>
                      <th className="pb-2 text-right">Conversions</th>
                      <th className="pb-2 text-right">Conv. Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {[
                      { label: "Request a Demo", url: "https://magnertia.com/demo", utm: "email / broadcast / emc-2026-001", clicks: 520, conv: 140, cr: "26.9%" },
                      { label: "Download Datasheet", url: "https://magnertia.com/w-evse-pdf", utm: "email / asset / w-evse", clicks: 240, conv: 95, cr: "39.5%" },
                      { label: "Calculate Fleet ROI", url: "https://magnertia.com/roi-tool", utm: "email / interactive / calculator", clicks: 160, conv: 85, cr: "53.1%" },
                    ].map((cta, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 font-sans font-bold text-primary">{cta.label}</td>
                        <td className="py-2.5 text-muted-foreground font-mono">{cta.url}</td>
                        <td className="py-2.5 text-muted-foreground font-sans text-[11px]">{cta.utm}</td>
                        <td className="py-2.5 text-right font-bold text-foreground">{cta.clicks}</td>
                        <td className="py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">{cta.conv}</td>
                        <td className="py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">{cta.cr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUBSCRIBER LISTS & SEGMENTS */}
        {activeTab === "lists" && (
          <div className="space-y-4">
            <div className="card-soft p-5 border-border/80">
              <div className="flex items-center justify-between pb-3 border-b border-border/70">
                <div>
                  <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Email List & Contact Segmentation Directory
                  </h2>
                  <p className="text-xs text-muted-foreground">Targeted subscriber cohorts, deliverability hygiene, and unsubscribe suppression.</p>
                </div>
                <Badge variant="outline" className="text-xs">Total Contacts: 12,500</Badge>
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                      <th className="pb-2">Segment Name</th>
                      <th className="pb-2">Customer Type</th>
                      <th className="pb-2 text-right">Total Contacts</th>
                      <th className="pb-2 text-right">Active / Deliverable</th>
                      <th className="pb-2 text-right">Suppressed</th>
                      <th className="pb-2 text-right">Unsubscribed</th>
                      <th className="pb-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {[
                      { name: "Enterprise EV Fleet Operators", type: "Commercial B2B", total: "5,200", active: "5,080", sup: "90", unsub: "30", status: "Active" },
                      { name: "Commercial Mall & Hub Developers", type: "Real Estate Owners", total: "3,800", active: "3,710", sup: "65", unsub: "25", status: "Active" },
                      { name: "Smart City & GeM Buyers", type: "Government / Municipal", total: "3,500", active: "3,330", sup: "140", unsub: "30", status: "Active" },
                      { name: "OEMs & System Integrators", type: "Tier-1 Auto Integrators", total: "2,400", active: "2,350", sup: "35", unsub: "15", status: "Active" },
                      { name: "Certified Dealers & Distributors", type: "Channel Partners", total: "1,800", active: "1,770", sup: "20", unsub: "10", status: "Active" },
                    ].map((seg, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 font-sans font-semibold text-foreground">{seg.name}</td>
                        <td className="py-2.5 font-sans text-muted-foreground">{seg.type}</td>
                        <td className="py-2.5 text-right">{seg.total}</td>
                        <td className="py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">{seg.active}</td>
                        <td className="py-2.5 text-right text-orange-600">{seg.sup}</td>
                        <td className="py-2.5 text-right text-rose-600">{seg.unsub}</td>
                        <td className="py-2.5 text-center font-sans">
                          <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                            {seg.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* List Hygiene & Reputation Monitor */}
            <div className="card-soft p-5 border-border/80">
              <h3 className="font-bold text-sm text-foreground mb-3 pb-2 border-b border-border/60">
                Sender Reputation & Deliverability Health
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-border/80 bg-background/50 space-y-1">
                  <div className="font-bold text-emerald-600 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> Domain Authentications
                  </div>
                  <div className="text-muted-foreground">SPF, DKIM 2048-bit, and DMARC strict alignment verified across all outbound mail servers.</div>
                  <div className="text-[10px] font-mono text-foreground font-bold mt-1">Status: Fully Compliant</div>
                </div>

                <div className="p-3 rounded-lg border border-border/80 bg-background/50 space-y-1">
                  <div className="font-bold text-blue-600 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Spam Trap Shield
                  </div>
                  <div className="text-muted-foreground">Automated MX record verification and honeypot detection on all uploaded lead lists.</div>
                  <div className="text-[10px] font-mono text-foreground font-bold mt-1">Spam Traps: 0 Detected</div>
                </div>

                <div className="p-3 rounded-lg border border-border/80 bg-background/50 space-y-1">
                  <div className="font-bold text-purple-600 flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> Sender Score
                  </div>
                  <div className="text-muted-foreground">Global IP reputation rating monitored daily via Return Path and Google Postmaster Tools.</div>
                  <div className="text-[10px] font-mono text-emerald-600 font-bold mt-1">Score: 98 / 100</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DRIP AUTOMATIONS */}
        {activeTab === "drips" && (
          <div className="space-y-4">
            <div className="card-soft p-5 border-border/80">
              <div className="flex items-center justify-between pb-3 border-b border-border/70">
                <div>
                  <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-primary" />
                    7-Step Email Nurturing Sequence & Automation Flow
                  </h2>
                  <p className="text-xs text-muted-foreground">Lifecycle drip workflow based on inbound intent, engagement triggers, and SLA handover.</p>
                </div>
                <Badge variant="outline" className="text-xs">Active Lead Journey</Badge>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                {[
                  { step: "Step 1", trigger: "Inbound Form Submission", email: "Welcome & Wireless EV Overview", delay: "Immediate" },
                  { step: "Step 2", trigger: "+2 Days", email: "Educational: High-Power Inductive Technology", delay: "48 Hours" },
                  { step: "Step 3", trigger: "+4 Days", email: "Product Datasheet: Autonomous W-EVSE 150 kW", delay: "48 Hours" },
                  { step: "Step 4", trigger: "+7 Days", email: "Case Study: 35% Fleet Turnaround Reduction", delay: "72 Hours" },
                  { step: "Step 5", trigger: "+10 Days", email: "Technical Whitepaper & Site Survey Guide", delay: "72 Hours" },
                  { step: "Step 6", trigger: "+14 Days", email: "Demo CTA: Schedule Virtual Live Pad Demo", delay: "96 Hours" },
                  { step: "Step 7", trigger: "High Engagement (Clicks CTA)", email: "Sales Handover: Route Lead to Regional CRM Head", delay: "Instant Alert" },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border/70 bg-background/50">
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-14 rounded bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center font-mono">
                        {s.step}
                      </span>
                      <div>
                        <div className="font-semibold text-foreground">{s.email}</div>
                        <div className="text-[10px] text-muted-foreground">Trigger: {s.trigger}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground">{s.delay}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inactive Contact Re-Engagement Engine */}
            <div className="card-soft p-5 border-border/80">
              <h3 className="font-bold text-sm text-foreground mb-2">Inactive Contact Re-Engagement Engine</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-border/80 bg-card space-y-1.5">
                  <div className="font-bold text-amber-600">30-Day Inactivity Trigger</div>
                  <div className="text-muted-foreground">No open for 30 days triggers "We miss you" educational digest with top 3 innovations.</div>
                  <div className="text-[10px] font-mono text-emerald-600 font-bold">Reactivation Rate: 14.2%</div>
                </div>
                <div className="p-3 rounded-lg border border-border/80 bg-card space-y-1.5">
                  <div className="font-bold text-orange-600">60-Day Dormant Trigger</div>
                  <div className="text-muted-foreground">No click for 60 days sends customized site survey offer with free fleet audit incentive.</div>
                  <div className="text-[10px] font-mono text-emerald-600 font-bold">Reactivation Rate: 8.5%</div>
                </div>
                <div className="p-3 rounded-lg border border-border/80 bg-card space-y-1.5">
                  <div className="font-bold text-red-600">90-Day Suppression Gate</div>
                  <div className="text-muted-foreground">Automatic transition to suppressed status to preserve sender domain reputation.</div>
                  <div className="text-[10px] font-mono text-primary font-bold">Compliance: 100% Protected</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: New Broadcast Creator */}
        {showComposerModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl shadow-lg max-w-md w-full p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground">Create Email Broadcast</h3>
                <button
                  type="button"
                  onClick={() => setShowComposerModal(false)}
                  className="text-muted-foreground hover:text-foreground text-sm font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium">Broadcast Name</label>
                  <input type="text" placeholder="e.g. Q4 EV Corridor Summit Announcement" className="mt-1 w-full rounded border border-border bg-background px-3 py-1.5" />
                </div>
                <div>
                  <label className="text-muted-foreground font-medium">Target Audience</label>
                  <select className="mt-1 w-full rounded border border-border bg-background px-3 py-1.5">
                    <option>Enterprise EV Fleet Operators</option>
                    <option>Commercial Mall Developers</option>
                    <option>Smart City & GeM Buyers</option>
                    <option>OEMs & System Integrators</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted-foreground font-medium">Template</label>
                  <select className="mt-1 w-full rounded border border-border bg-background px-3 py-1.5">
                    <option>Product Launch Invite (v2.1)</option>
                    <option>Monthly Fleet Newsletter (v1.4)</option>
                    <option>Executive Webinar Invitation (v3.0)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                <Button variant="outline" size="sm" onClick={() => setShowComposerModal(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowComposerModal(false);
                    toast.success("Broadcast draft created successfully!");
                  }}
                >
                  Create Broadcast
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default EmailMarketingManagementPage;
