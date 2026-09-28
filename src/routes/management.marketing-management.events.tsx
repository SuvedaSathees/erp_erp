import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Save,
  Send,
  Users,
  BarChart3,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plus,
  Info,
  Check,
  Building2,
  Monitor,
  Rocket,
  UserCheck,
  Filter,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/marketing-management/events"
)({
  head: () => ({
    meta: [
      { title: "Events Management · Marketing Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise Events Workspace for agenda schedule, speaker master, delegate registrations, venue logistics, and attendee feedback.",
      },
    ],
  }),
  component: EventsManagementPage,
});

type MAICW = "M" | "A" | "I" | "C" | "W";

function MAICWBadge({ type }: { type: MAICW }) {
  const meta: Record<MAICW, { label: string; desc: string; bg: string; text: string }> = {
    M: { label: "M", desc: "Mandatory Field - Required for event compliance & governance", bg: "bg-red-500/10 border-red-500/30", text: "text-red-600 dark:text-red-400" },
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

const EVENT_TABS = [
  { id: "agenda", label: "Schedule & Agenda" },
  { id: "registrations", label: "Delegate Registrations" },
  { id: "logistics", label: "Logistics & Venues" },
  { id: "feedback", label: "Attendee Feedback" },
];

export function EventsManagementPage() {
  const [activeTab, setActiveTab] = useState("agenda");
  const [showMaicwLegend, setShowMaicwLegend] = useState(false);

  const handleSave = () => {
    toast.success("Event Master Saved", {
      description: "EVT-2026-009 (Autonomous EV Charging Summit 2026) updated successfully.",
    });
  };

  const handleSendInvitation = () => {
    toast.info("Invitation Dispatch Triggered", {
      description: "Dispatched VIP & Delegate invitations to 800 pre-registered contacts.",
    });
  };

  const handlePublishEvent = () => {
    toast.success("Event Published & Live!", {
      description: "Public registration portal, CRM sync, and ticketing gates activated.",
    });
  };

  return (
    <AppShell
      title="Events"
      breadcrumb="Management > Marketing Management > Events > Event Operations"
      description="Connect. Showcase. Create Opportunities."
      tabs={<MarketingManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Header Card Matching Screenshot Exactly */}
        <div className="card-soft p-4 sm:p-5 border-border/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  Events
                </h1>
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
                <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-mono font-bold text-foreground/80 border border-border">
                  EVT-2026-009
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
                Autonomous EV Charging & Infrastructure Summit 2026 · Codissia Trade Fair Complex, Coimbatore
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="gap-1.5 text-xs font-semibold shadow-xs"
              >
                <Save className="h-3.5 w-3.5" /> Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendInvitation}
                className="gap-1.5 text-xs font-semibold shadow-xs"
              >
                <Send className="h-3.5 w-3.5 text-primary" /> Send Invitation
              </Button>
              <Button
                size="sm"
                onClick={handlePublishEvent}
                className="gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <Rocket className="h-3.5 w-3.5" /> Publish Event
              </Button>
            </div>
          </div>

          {/* MAICW Legend Dropdown */}
          {showMaicwLegend && (
            <div className="mt-4 rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs transition-all">
              <div className="font-semibold text-foreground flex items-center gap-1.5 mb-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Enterprise MAICW Governance Classification
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="flex items-center gap-2">
                  <MAICWBadge type="M" />
                  <span className="text-muted-foreground"><strong>M</strong>: Mandatory</span>
                </div>
                <div className="flex items-center gap-2">
                  <MAICWBadge type="A" />
                  <span className="text-muted-foreground"><strong>A</strong>: Auto / System</span>
                </div>
                <div className="flex items-center gap-2">
                  <MAICWBadge type="I" />
                  <span className="text-muted-foreground"><strong>I</strong>: Master Lookup</span>
                </div>
                <div className="flex items-center gap-2">
                  <MAICWBadge type="C" />
                  <span className="text-muted-foreground"><strong>C</strong>: Calculated</span>
                </div>
                <div className="flex items-center gap-2">
                  <MAICWBadge type="W" />
                  <span className="text-muted-foreground"><strong>W</strong>: Workflow Gate</span>
                </div>
              </div>
            </div>
          )}

          {/* Sub Navigation Tabs Bar (4 Focused Operational Tabs) */}
          <div className="mt-4 flex items-center gap-1 overflow-x-auto border-t border-border/80 pt-1 scrollbar-none">
            {EVENT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all select-none cursor-pointer",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: SCHEDULE & AGENDA (Default Operational View) */}
        {activeTab === "agenda" && (
          <div className="space-y-4">
            {/* Event Program Schedule */}
            <div className="card-soft p-5 border-border/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Event Program Schedule & Stage Allocations
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Controlled session sequence, speakers, stage allocations, and durations.
                  </p>
                </div>
                <Button size="sm" className="gap-1 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Add Session
                </Button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                      <th className="pb-2.5">Time</th>
                      <th className="pb-2.5">Session Title</th>
                      <th className="pb-2.5">Key Speaker</th>
                      <th className="pb-2.5">Type</th>
                      <th className="pb-2.5">Duration</th>
                      <th className="pb-2.5">Room / Stage</th>
                      <th className="pb-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {[
                      { time: "09:30 AM", session: "Registration & Networking Breakfast", speaker: "Event Hospitality Team", type: "Reception", duration: "30 min", room: "Grand Foyer", status: "Ready" },
                      { time: "10:00 AM", session: "Welcome Address & State of Indian EV Tech", speaker: "CEO / Executive Committee", type: "Opening", duration: "15 min", room: "Main Auditorium", status: "Confirmed" },
                      { time: "10:15 AM", session: "Keynote: Megawatt Charging & Fleet Grid Demands", speaker: "Dr. R. Narayan (Keynote)", type: "Keynote", duration: "30 min", room: "Main Auditorium", status: "Confirmed" },
                      { time: "10:45 AM", session: "Magnertia Showcase: Autonomous Inductive EVSE", speaker: "Product & R&D Leads", type: "Presentation", duration: "30 min", room: "Main Auditorium", status: "Approved" },
                      { time: "11:15 AM", session: "Live Pad Demonstration: 150 kW Wireless Power", speaker: "Engineering Demo Crew", type: "Live Demo", duration: "30 min", room: "Demo Hall & Outdoor Bay", status: "Rehearsed" },
                      { time: "11:45 AM", session: "Fleet Case Study: 40 Commercial EV Turnarounds", speaker: "Vikram Menon (CTO, EV Transit)", type: "Case Study", duration: "20 min", room: "Main Auditorium", status: "Confirmed" },
                      { time: "12:05 PM", session: "Interactive CPO Panel & Audience Q&A", speaker: "Panel of 4 Industry Leaders", type: "Panel", duration: "25 min", room: "Main Auditorium", status: "Scheduled" },
                      { time: "12:30 PM", session: "Executive Networking Lunch & B2B Matchmaking", speaker: "Delegates & Sponsors", type: "Networking", duration: "60 min", room: "Banquet Hall & Booths", status: "Catered" },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-mono font-bold text-foreground">{row.time}</td>
                        <td className="py-3 font-semibold text-foreground">{row.session}</td>
                        <td className="py-3 text-muted-foreground">{row.speaker}</td>
                        <td className="py-3">
                          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                            {row.type}
                          </span>
                        </td>
                        <td className="py-3 text-muted-foreground font-mono">{row.duration}</td>
                        <td className="py-3 text-muted-foreground">{row.room}</td>
                        <td className="py-3 text-right">
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Speaker Management Master */}
            <div className="card-soft p-5 border-border/80">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="text-base font-bold text-foreground">Speaker Management Master</h3>
                  <p className="text-xs text-muted-foreground">Internal & external keynote speakers, honorariums, and presentation approvals.</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Register Speaker
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { name: "Dr. R. Narayan", org: "National EV Council", role: "Keynote Speaker", topic: "Megawatt Inductive Charging", status: "Confirmed", deck: "Deck v2 Approved" },
                  { name: "Vikram Menon", org: "EV Transit Corp", role: "Industry Speaker", topic: "Commercial Depot Automation", status: "Confirmed", deck: "Deck v1 Submitted" },
                  { name: "Arun Kumar", org: "Magnertia Power", role: "Product Host", topic: "Autonomous W-EVSE Live Demo", status: "Ready", deck: "Deck Finalized" },
                ].map((s, idx) => (
                  <div key={idx} className="rounded-xl border border-border/80 bg-card p-4 space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-foreground text-sm">{s.name}</div>
                        <div className="text-[11px] text-muted-foreground">{s.org} · {s.role}</div>
                      </div>
                      <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                        {s.status}
                      </span>
                    </div>
                    <div className="text-muted-foreground"><strong className="text-foreground">Topic:</strong> {s.topic}</div>
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{s.deck}</span>
                      <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 text-primary">View Bio</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DELEGATE REGISTRATIONS */}
        {activeTab === "registrations" && (
          <div className="space-y-4">
            {/* Registration Workflow Pipeline */}
            <div className="card-soft p-5 border-border/80">
              <h3 className="text-base font-bold text-foreground mb-1">Registration Workflow Engine</h3>
              <p className="text-xs text-muted-foreground mb-4">Controlled end-to-end participant lifecycle from invitation through check-in and CRM nurture.</p>

              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                {[
                  { step: "1", title: "Event Created", status: "Complete", color: "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400" },
                  { step: "2", title: "Portal Open", status: "Active", color: "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400" },
                  { step: "3", title: "Promotion", status: "Active", color: "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400" },
                  { step: "4", title: "Registered", status: "500 Regs", color: "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
                  { step: "5", title: "Confirmed", status: "420 Confirmed", color: "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
                  { step: "6", title: "Reminder (T-2)", status: "Scheduled", color: "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
                  { step: "7", title: "Check-In (QR)", status: "Ready", color: "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400" },
                  { step: "8", title: "Attended", status: "380 Attended", color: "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400" },
                  { step: "9", title: "Post-Event SLA", status: "CRM Ready", color: "border-slate-500 bg-muted text-muted-foreground" },
                ].map((s, idx) => (
                  <div key={idx} className={cn("rounded-lg border p-2.5 text-center transition-all", s.color)}>
                    <div className="text-[10px] font-mono font-bold uppercase opacity-80">Stage {s.step}</div>
                    <div className="text-xs font-bold my-1 text-foreground">{s.title}</div>
                    <div className="text-[10px] font-semibold">{s.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Management Tiers */}
            <div className="card-soft p-5 border-border/80">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="text-base font-bold text-foreground">Ticket Inventory & Validation Tiers</h3>
                  <p className="text-xs text-muted-foreground">Controlled ticket allocations, pricing tiers, and QR check-in tallies.</p>
                </div>
                <Button size="sm" className="gap-1 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Add Ticket Tier
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { tier: "Standard Delegate", price: "₹2,500", total: 350, sold: 310, checkin: "280 Checked in", color: "border-blue-500/40" },
                  { tier: "VIP & Enterprise Pass", price: "₹7,500", total: 100, sold: 90, checkin: "85 Checked in", color: "border-purple-500/40" },
                  { tier: "Exhibitor Booth Staff", price: "Complimentary", total: 50, sold: 50, checkin: "45 Checked in", color: "border-emerald-500/40" },
                  { tier: "Student / Researcher", price: "₹500", total: 50, sold: 50, checkin: "40 Checked in", color: "border-amber-500/40" },
                ].map((t, idx) => (
                  <div key={idx} className={cn("rounded-xl border bg-card p-4 space-y-2", t.color)}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-foreground">{t.tier}</span>
                      <span className="font-mono font-bold text-primary text-xs">{t.price}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Sold: <strong className="text-foreground">{t.sold}</strong> / {t.total}</div>
                    <div className="pt-2 border-t border-border/50 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {t.checkin}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LOGISTICS & VENUES */}
        {activeTab === "logistics" && (
          <div className="space-y-4">
            {/* Physical Venue & Virtual Hybrid Platform */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card-soft p-5 border-border/80">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <h3 className="font-bold text-sm text-foreground">Physical Venue Configuration</h3>
                  <Building2 className="h-4 w-4 text-primary" />
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Venue Name:</span>
                    <span className="font-semibold text-foreground">Codissia Trade Fair Complex</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">City & State:</span>
                    <span className="font-semibold text-foreground">Coimbatore, Tamil Nadu, India</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Allocated Halls:</span>
                    <span className="font-semibold text-foreground">Hall A (Exhibition) + Hall B (Auditorium)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Seating Capacity:</span>
                    <span className="font-bold text-foreground font-mono">500 Plenary + 150 VIP Lounge</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Power Backup:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">250 kVA Dual Synchronized DG</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Wi-Fi Network:</span>
                    <span className="font-bold text-foreground">1 Gbps Dedicated Fiber + Mesh APs</span>
                  </div>
                </div>
              </div>

              <div className="card-soft p-5 border-border/80">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <h3 className="font-bold text-sm text-foreground">Virtual Hybrid Platform</h3>
                  <Monitor className="h-4 w-4 text-blue-500" />
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Platform Provider:</span>
                    <span className="font-semibold text-foreground">Zoom Events Enterprise + YouTube Live</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Meeting Stream ID:</span>
                    <span className="font-mono font-bold text-primary">892-441-9920-EVT</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Max Virtual Seats:</span>
                    <span className="font-mono font-bold text-foreground">1,000 Remote Delegates</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">4K Cloud Recording:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Enabled (Auto-Archive)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Public Stream Link:</span>
                    <span className="font-mono text-primary truncate max-w-[200px]">https://live.magnertia.com/summit26</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Resource Staffing Roster */}
            <div className="card-soft p-5 border-border/80">
              <h3 className="text-base font-bold text-foreground mb-1">Event Resource Staffing Deployment</h3>
              <p className="text-xs text-muted-foreground mb-4">On-ground crew allocation, shift assignments, and readiness status.</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                      <th className="pb-2">Role / Department</th>
                      <th className="pb-2">Planned Headcount</th>
                      <th className="pb-2">Actual Deployed</th>
                      <th className="pb-2">Shift Schedule</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {[
                      { role: "Event Management & Coordinators", planned: 10, actual: 10, shift: "08:00 - 18:00 Full Event", status: "Ready" },
                      { role: "Front Desk & QR Registration Staff", planned: 3, actual: 3, shift: "08:00 - 13:00 Peak Reg", status: "Trained" },
                      { role: "Technical AV, Audio & Streaming Crew", planned: 4, actual: 4, shift: "07:30 - 18:00 Full Event", status: "Rehearsed" },
                      { role: "Enterprise Sales & B2B Matchmakers", planned: 6, actual: 6, shift: "09:30 - 17:30 Client Room", status: "Assigned" },
                      { role: "Product Specialists & Demo Bay Techs", planned: 4, actual: 4, shift: "10:00 - 16:00 Outdoor Bay", status: "Hardware Ready" },
                    ].map((r, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 font-semibold text-foreground">{r.role}</td>
                        <td className="py-2.5 font-mono font-bold text-foreground">{r.planned}</td>
                        <td className="py-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">{r.actual}</td>
                        <td className="py-2.5 text-muted-foreground">{r.shift}</td>
                        <td className="py-2.5 text-right">
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ATTENDEE FEEDBACK */}
        {activeTab === "feedback" && (
          <div className="space-y-4">
            {/* Feedback Summary Cards */}
            <div className="card-soft p-5 border-border/80">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="text-base font-bold text-foreground">Attendee Feedback & Experience Register</h3>
                  <p className="text-xs text-muted-foreground">Post-session exit surveys, ratings, and immediate commercial follow-up requests.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Average Score: 4.8 / 5.0 ⭐
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { name: "Rajesh Kumar", org: "GreenFleet Logistics", rating: "5.0 / 5.0", content: "Outstanding live hardware demonstration of the 150kW wireless pad. Solves our exact bus turnaround bottleneck.", follow: "Site Survey Required" },
                  { name: "Vikram Menon", org: "EV Transit Corp", rating: "5.0 / 5.0", content: "Keynote presentation was insightful. Looking forward to integrating wireless pads in our next 40 municipal transit buses.", follow: "Commercial Proposal Requested" },
                  { name: "Anitha R", org: "Coimbatore Municipal Corp", rating: "4.5 / 5.0", content: "Very well organized venue at Codissia. Requesting technical datasheet on GeM portal compliance for municipal tenders.", follow: "GeM Catalog Link Sent" },
                ].map((fb, idx) => (
                  <div key={idx} className="rounded-xl border border-border/80 bg-card p-4 space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-foreground text-sm">{fb.name}</div>
                        <div className="text-[11px] text-muted-foreground">{fb.org}</div>
                      </div>
                      <span className="font-bold text-amber-500 font-mono text-xs">{fb.rating}</span>
                    </div>
                    <p className="text-muted-foreground italic">"{fb.content}"</p>
                    <div className="pt-2 border-t border-border/40 text-[11px]">
                      <span className="text-primary font-bold">{fb.follow}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controlled Post-Event Survey Questions */}
            <div className="card-soft p-5 border-border/80">
              <h4 className="font-bold text-sm text-foreground mb-2">Controlled Post-Event Survey Outcomes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/40">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>1. Was the event useful and relevant to your operations? (<strong>98% Yes</strong>)</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/40">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>2. Was the live W-EVSE product demonstration informative? (<strong>96% Yes</strong>)</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/40">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>3. Were the technical speakers and panels authoritative? (<strong>99% Yes</strong>)</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/40">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>4. Would you attend future Magnertia regional tech summits? (<strong>92% Yes</strong>)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default EventsManagementPage;
