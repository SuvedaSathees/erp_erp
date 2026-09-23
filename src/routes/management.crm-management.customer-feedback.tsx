import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { CrmManagementTabBar } from "@/components/erp/CrmManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Save,
  Printer,
  Mail,
  Users,
  ShieldCheck,
  Award,
  Activity,
  Smile,
  Frown,
  Meh,
} from "lucide-react";

export const Route = createFileRoute("/management/crm-management/customer-feedback")({
  head: () => ({
    meta: [
      { title: "Customer Feedback · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Capture and analyze customer feedback, CSAT scores, Net Promoter Score (NPS), Customer Effort Score (CES), and sentiment metrics.",
      },
    ],
  }),
  component: CustomerFeedbackPage,
});

interface FeedbackRecord {
  id: string;
  feedbackNumber: string;
  customerName: string;
  contactPerson: string;
  email: string;
  phone: string;
  productService: string;
  orderNumber: string;
  channel: "Email Survey" | "In-App Prompt" | "Executive QBR" | "SMS Portal";
  csatRating: number; // 1-5
  npsScore: number; // 0-10
  cesScore: number; // 1-5
  sentiment: "Positive" | "Neutral" | "Negative";
  feedbackText: string;
  submittedDate: string;
  followUpStatus: "Follow-up Required" | "Resolved / Acknowledged" | "Advocacy Referral";
  assignedOwner: string;
}

const INITIAL_FEEDBACKS: FeedbackRecord[] = [
  {
    id: "FDB-001",
    feedbackNumber: "FDB-2024-0042",
    customerName: "Larsen & Toubro Ltd.",
    contactPerson: "Vikram Sengupta",
    email: "v.sengupta@larsentoubro.com",
    phone: "+91 98222 11445",
    productService: "Turnkey Substation Automation",
    orderNumber: "ORD-2024-0062",
    channel: "Executive QBR",
    csatRating: 5,
    npsScore: 10,
    cesScore: 5,
    sentiment: "Positive",
    feedbackText: "Outstanding project delivery! Commissioning was finished 2 weeks ahead of schedule. Post-launch support responsiveness has been best in class.",
    submittedDate: "10 May 2024",
    followUpStatus: "Advocacy Referral",
    assignedOwner: "Rahul Sharma",
  },
  {
    id: "FDB-002",
    feedbackNumber: "FDB-2024-0043",
    customerName: "Mahindra Heavy Ind.",
    contactPerson: "Kavita Rao",
    email: "kavita.r@mahindra.com",
    phone: "+91 98333 77889",
    productService: "SCADA Industrial Telemetry",
    orderNumber: "ORD-2024-0071",
    channel: "Email Survey",
    csatRating: 4,
    npsScore: 8,
    cesScore: 4,
    sentiment: "Positive",
    feedbackText: "Good software reliability. Would appreciate faster documentation download times on the client portal.",
    submittedDate: "12 May 2024",
    followUpStatus: "Resolved / Acknowledged",
    assignedOwner: "Neha Kapoor",
  },
];

function CustomerFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>(INITIAL_FEEDBACKS);
  const [selectedId, setSelectedId] = useState<string>("FDB-001");
  const [activeTab, setActiveTab] = useState<"ratings" | "sentiment" | "actions" | "analytics">("ratings");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const current = feedbacks.find((f) => f.id === selectedId) || feedbacks[0];
  const [formState, setFormState] = useState<FeedbackRecord>(current);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const item = feedbacks.find((f) => f.id === id);
    if (item) setFormState(item);
  };

  return (
    <AppShell
      title="Customer Feedback"
      breadcrumb="Management > CRM Management > Customer Feedback"
      description="Capture and analyze customer feedback, CSAT scores, Net Promoter Score (NPS), Customer Effort Score (CES), and sentiment metrics."
      tabs={<CrmManagementTabBar />}
    >
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Top Header Action Bar */}
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs flex-wrap">
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/10 text-blue-600 shrink-0">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900 whitespace-nowrap font-mono">{formState.feedbackNumber}</h2>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-300 whitespace-nowrap">
                  CSAT: {formState.csatRating} / 5.0
                </span>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200 whitespace-nowrap">
                  NPS: {formState.npsScore} (Promoter)
                </span>
              </div>
              <p className="text-xs text-slate-500 whitespace-nowrap">
                Customer: <span className="font-semibold text-slate-800">{formState.customerName}</span> | Channel: <span className="font-medium text-slate-700">{formState.channel}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <select
              value={selectedId}
              onChange={(e) => handleSelect(e.target.value)}
              className="h-8 rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs"
            >
              {feedbacks.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.feedbackNumber} - {f.customerName}
                </option>
              ))}
            </select>

            <button
              onClick={() => window.print()}
              className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Printer className="h-3.5 w-3.5 text-slate-600" />
              <span>Print</span>
            </button>

            <button
              onClick={() => showNotification("Feedback summary sent via email to " + formState.customerName)}
              className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Mail className="h-3.5 w-3.5 text-blue-600" />
              <span>Send Email</span>
            </button>

            <button
              onClick={() => {
                setFeedbacks((prev) => prev.map((f) => (f.id === formState.id ? formState : f)));
                showNotification(`Feedback ${formState.feedbackNumber} saved successfully.`);
              }}
              className="h-8 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Record</span>
            </button>
          </div>
        </div>

        {/* 1. Feedback Master Parameters & Snapshot */}
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-9 rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> Feedback Submission Parameters
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div>
                <label className="text-muted-foreground block font-medium">Customer Account *</label>
                <input
                  type="text"
                  value={formState.customerName}
                  onChange={(e) => setFormState({ ...formState, customerName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground block font-medium">Respondent *</label>
                <input
                  type="text"
                  value={formState.contactPerson}
                  onChange={(e) => setFormState({ ...formState, contactPerson: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground block font-medium">Product / Service</label>
                <input
                  type="text"
                  value={formState.productService}
                  onChange={(e) => setFormState({ ...formState, productService: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground block font-medium">Survey Channel</label>
                <select
                  value={formState.channel}
                  onChange={(e) => setFormState({ ...formState, channel: e.target.value as any })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                >
                  <option value="Executive QBR">Executive QBR</option>
                  <option value="Email Survey">Email Survey</option>
                  <option value="In-App Prompt">In-App Prompt</option>
                  <option value="SMS Portal">SMS Portal</option>
                </select>
              </div>

              <div>
                <label className="text-muted-foreground block font-medium">CSAT Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formState.csatRating}
                  onChange={(e) => setFormState({ ...formState, csatRating: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground font-bold font-mono"
                />
              </div>

              <div>
                <label className="text-muted-foreground block font-medium">NPS Score (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formState.npsScore}
                  onChange={(e) => setFormState({ ...formState, npsScore: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground font-bold font-mono"
                />
              </div>

              <div>
                <label className="text-muted-foreground block font-medium">Sentiment Classification</label>
                <select
                  value={formState.sentiment}
                  onChange={(e) => setFormState({ ...formState, sentiment: e.target.value as any })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground font-medium"
                >
                  <option value="Positive">Positive</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>

              <div>
                <label className="text-muted-foreground block font-medium">Follow-Up Workflow</label>
                <select
                  value={formState.followUpStatus}
                  onChange={(e) => setFormState({ ...formState, followUpStatus: e.target.value as any })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                >
                  <option value="Advocacy Referral">Advocacy Referral</option>
                  <option value="Resolved / Acknowledged">Resolved / Acknowledged</option>
                  <option value="Follow-up Required">Follow-up Required</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right 3 columns: NPS & Sentiment Side Card */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Satisfaction Index</h4>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {formState.sentiment}
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">CSAT Grade</span>
                  <span className="font-bold text-emerald-600 font-mono">
                    {formState.csatRating >= 4 ? "Excellent (4.8/5)" : "Good"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Effort Score (CES)</span>
                  <span className="font-bold text-foreground font-mono">4.8 / 5.0 (Low Effort)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Promoter Probability</span>
                  <span className="font-bold text-primary font-mono">92%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Customer Loyalty Score</span>
                <span className="text-[10px] text-emerald-600 font-semibold">High Loyalty</span>
              </div>
              <div className="relative inline-flex items-center justify-center">
                <svg width="48" height="48" className="transform -rotate-90">
                  <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="3.5" className="text-muted/30" fill="transparent" />
                  <circle
                    cx="24"
                    cy="24"
                    r="19"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 19}
                    strokeDashoffset={2 * Math.PI * 19 * (1 - 0.94)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold font-mono text-emerald-600">94%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs (No Overview) */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "ratings", label: "CSAT & Detailed Metrics", icon: Star },
              { key: "sentiment", label: "Verbatim Feedback & Sentiment", icon: MessageSquare },
              { key: "actions", label: "Follow-Up & Advocacy Workflow", icon: CheckCircle2 },
              { key: "analytics", label: "Quarterly Trend Analytics", icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: RATINGS */}
          {activeTab === "ratings" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs text-xs">
              <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                Detailed Dimension Scores & Benchmarks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 bg-muted/15 rounded-lg border border-border space-y-1">
                  <span className="text-muted-foreground block text-[11px]">Product Reliability & Quality</span>
                  <div className="text-lg font-bold font-mono text-foreground">4.9 / 5.0 ★</div>
                  <span className="text-[10px] text-emerald-600">+0.3 vs industry median</span>
                </div>
                <div className="p-3.5 bg-muted/15 rounded-lg border border-border space-y-1">
                  <span className="text-muted-foreground block text-[11px]">Technical Support Responsiveness</span>
                  <div className="text-lg font-bold font-mono text-foreground">4.7 / 5.0 ★</div>
                  <span className="text-[10px] text-blue-600">Avg 12 min first reply</span>
                </div>
                <div className="p-3.5 bg-muted/15 rounded-lg border border-border space-y-1">
                  <span className="text-muted-foreground block text-[11px]">Value for Investment (ROI)</span>
                  <div className="text-lg font-bold font-mono text-foreground">4.8 / 5.0 ★</div>
                  <span className="text-[10px] text-primary">High perceived value</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SENTIMENT */}
          {activeTab === "sentiment" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs text-xs">
              <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                Customer Verbatim Feedback & AI Sentiment Insights
              </h4>
              <div className="p-4 bg-muted/20 rounded-lg border border-border space-y-2">
                <div className="flex items-center gap-2">
                  <Smile className="h-4 w-4 text-emerald-500" />
                  <span className="font-bold text-foreground">Customer Voice Quote</span>
                </div>
                <p className="text-foreground leading-relaxed italic bg-card p-3 rounded-lg border border-border/60">
                  "{formState.feedbackText}"
                </p>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                  <span>AI Sentiment Confidence: <strong className="text-foreground font-mono">98.2%</strong></span>
                  <span>Tone: <strong className="text-emerald-600">Enthusiastic Promoter</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACTIONS */}
          {activeTab === "actions" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs text-xs">
              <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                Action Items & Customer Advocacy Pipeline
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg border border-border bg-muted/15 space-y-2">
                  <span className="font-bold text-foreground block">Customer Case Study Nomination</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Client confirmed readiness to participate in Q3 annual case study feature on turnkey automation excellence.
                  </p>
                  <span className="inline-block rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                    Marketing Approved
                  </span>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/15 space-y-2">
                  <span className="font-bold text-foreground block">Executive Relationship Sponsor</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Scheduled CEO-level check-in for November 2024 annual contract review.
                  </p>
                  <span className="inline-block rounded bg-blue-500/10 text-blue-600 px-2 py-0.5 text-[10px] font-bold">
                    Calendar Booked
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs text-xs">
              <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                Quarterly Satisfaction Distribution (All Enterprise Accounts)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-1">
                  <span className="text-[11px] text-emerald-700 font-semibold block">Promoters (NPS 9-10)</span>
                  <span className="text-xl font-bold font-mono text-emerald-700">76%</span>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg space-y-1">
                  <span className="text-[11px] text-blue-700 font-semibold block">Passives (NPS 7-8)</span>
                  <span className="text-xl font-bold font-mono text-blue-700">19%</span>
                </div>
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg space-y-1">
                  <span className="text-[11px] text-rose-700 font-semibold block">Detractors (NPS 0-6)</span>
                  <span className="text-xl font-bold font-mono text-rose-700">5%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Classification Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-[11px] text-muted-foreground font-mono">
          <div>
            MAICW: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
            <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
            <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
            <span className="text-blue-600 font-bold">C</span> (Calculated) |{" "}
            <span className="text-rose-500 font-bold">W</span> (Workflow)
          </div>
          <div>
            Feedback Analytics v3.1 · Magnertia Customer Intelligence Core
          </div>
        </div>
      </div>
    </AppShell>
  );
}
