import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { CrmManagementTabBar } from "@/components/erp/CrmManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Award,
  Printer,
  Mail,
  FileText,
  Save,
  Plus,
  MoreHorizontal,
  ChevronRight,
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  Layers,
  ShieldCheck,
  Paperclip,
  Activity,
  RefreshCw,
  Copy,
  Share2,
  Trash2,
  Edit,
  Download,
  Send,
  UserCheck,
  Building2,
  Percent,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Heart,
  Users,
  Target,
  FileCheck,
  ShieldAlert,
  Zap,
  Globe,
  Star,
  UserPlus,
  Plane,
  Quote,
  Briefcase,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";

export const Route = createFileRoute("/management/crm-management/customer-success")({
  head: () => ({
    meta: [
      { title: "Customer Success Form · Customer Support · Magnertia ERP" },
      {
        name: "description",
        content:
          "Customer Success Form - Central record for post-sale customer relationship, adoption monitoring, health score (82/100), key objectives, renewal pipeline, value realization YTD, risk recovery, and customer advocacy.",
      },
    ],
  }),
  component: CustomerSuccessPage,
});

// --- Types & Data Interfaces ---

export type SuccessStatus =
  | "Value Realization"
  | "New Customer"
  | "Onboarding"
  | "Adoption"
  | "Healthy"
  | "Renewal"
  | "Expansion"
  | "Advocacy"
  | "At Risk"
  | "Recovery Plan";

export interface CustomerSuccessRecord {
  id: string;
  successNumber: string;
  customerName: string;
  customerSegment: string;
  customerTier: "Strategic" | "Enterprise" | "Standard";
  status: SuccessStatus;
  successManager: { name: string; avatar: string; email: string };
  startDate: string;
  reviewDate: string;
  branch: string;
  businessUnit: string;
  successTeam: string;
  accountOwner: { name: string; avatar: string };
  customerObjective: string;
  keyOutcomes: string;
  annualBusinessValue: number;
  customerLifetimeValue: number;
  lastInteraction: string;
  nextReviewDate: string;

  // Health Score (0-100)
  overallHealthScore: number; // 82
  healthStatus: "Healthy" | "Monitor" | "At Risk" | "Critical";
  healthTrendText: string; // "+6 pts vs last review"

  // Health Breakdown
  productUsageScore: number; // 85
  adoptionScore: number; // 80
  supportExperienceScore: number; // 78
  csatScore: number; // 84
  engagementScore: number; // 80
  renewalLikelihoodScore: number; // 88
  paymentHealthScore: number; // 90

  // Adoption Summary
  adoptionRatePct: number; // 78
  activeUsersCount: number; // 156
  totalUsersCount: number; // 200
  featureUtilizationPct: number; // 78
  usageFrequency: string; // "High"
  lastActiveDate: string; // "15 Apr 2024"
  onboardingRating: number; // 4.2

  // Key Objectives
  overallObjectivesProgressPct: number; // 74

  // Renewal
  renewalDate: string; // "31 Oct 2024"
  daysToRenewal: number; // 199
  renewalLikelihoodPct: number; // 88
  renewalValue: number; // 4800000

  // YTD Value Realization
  uptimePct: number; // 96
  uptimeTargetPct: number; // 98
  energySavingsLakhs: number; // 8.4
  energySavingsTargetLakhs: number; // 12
  opexReductionPct: number; // 11
  opexTargetPct: number; // 15
  csatAvg: number; // 4.2
  csatTargetAvg: number; // 4.5

  // Advocacy
  npsScore: number; // +60
  referencesCount: number; // 3
  testimonialsCount: number; // 2
  caseStudiesCount: number; // 1
}

const INITIAL_SUCCESS: CustomerSuccessRecord = {
  id: "CS-001",
  successNumber: "CS-2024-000125",
  customerName: "Acme Automation Pvt. Ltd.",
  customerSegment: "Enterprise",
  customerTier: "Strategic",
  status: "Value Realization",
  successManager: { name: "Rahul Sharma", avatar: "RS", email: "rahul.sharma@magnertia.com" },
  startDate: "01 Jan 2024",
  reviewDate: "15 Jun 2024",
  branch: "Mumbai Branch",
  businessUnit: "Industrial Solutions",
  successTeam: "Customer Success Team",
  accountOwner: { name: "Neha Kapoor", avatar: "NK" },
  customerObjective: "Reduce downtime, optimize energy usage and improve charging station uptime across locations.",
  keyOutcomes: "Increase uptime to 98%, lower OPEX by 15%, improve user satisfaction.",
  annualBusinessValue: 48000000,
  customerLifetimeValue: 240000000,
  lastInteraction: "15 Apr 2024",
  nextReviewDate: "15 Jun 2024",

  overallHealthScore: 82,
  healthStatus: "Healthy",
  healthTrendText: "↑ 6 pts vs last review",

  productUsageScore: 85,
  adoptionScore: 80,
  supportExperienceScore: 78,
  csatScore: 84,
  engagementScore: 80,
  renewalLikelihoodScore: 88,
  paymentHealthScore: 90,

  adoptionRatePct: 78,
  activeUsersCount: 156,
  totalUsersCount: 200,
  featureUtilizationPct: 78,
  usageFrequency: "High",
  lastActiveDate: "15 Apr 2024",
  onboardingRating: 4.2,

  overallObjectivesProgressPct: 74,

  renewalDate: "31 Oct 2024",
  daysToRenewal: 199,
  renewalLikelihoodPct: 88,
  renewalValue: 48000000,

  uptimePct: 96,
  uptimeTargetPct: 98,
  energySavingsLakhs: 8.4,
  energySavingsTargetLakhs: 12,
  opexReductionPct: 11,
  opexTargetPct: 15,
  csatAvg: 4.2,
  csatTargetAvg: 4.5,

  npsScore: 60,
  referencesCount: 3,
  testimonialsCount: 2,
  caseStudiesCount: 1,
};

const OBJECTIVES_DATA = [
  { obj: "Increase Uptime to 98%", target: "98%", progress: "96%", status: "On Track", color: "bg-emerald-100 text-emerald-800" },
  { obj: "Reduce OPEX by 15%", target: "15%", progress: "11%", status: "At Risk", color: "bg-amber-100 text-amber-800" },
  { obj: "Improve User Satisfaction", target: "4.5/5", progress: "4.2/5", status: "On Track", color: "bg-emerald-100 text-emerald-800" },
  { obj: "Expand to 20 Locations", target: "20", progress: "12", status: "On Track", color: "bg-emerald-100 text-emerald-800" },
];

const RECENT_ENGAGEMENTS = [
  { date: "15 Apr 2024", type: "QBR Meeting", topic: "Quarterly Business Review", by: "Rahul Sharma", outcome: "Positive", next: "Share uptime report" },
  { date: "05 Apr 2024", type: "On-site Review", topic: "Site visit - Mumbai & Pune", by: "Rahul Sharma", outcome: "Positive", next: "Implementation check" },
  { date: "28 Mar 2024", type: "Training", topic: "Ops team advanced training", by: "Neha Kapoor", outcome: "Positive", next: "Schedule follow up" },
  { date: "18 Mar 2024", type: "Support Call", topic: "Charging issue troubleshooting", by: "Vikram Singh", outcome: "Resolved", next: "Monitor for a week" },
  { date: "05 Mar 2024", type: "Product Demo", topic: "New feature walkthrough", by: "Rahul Sharma", outcome: "Positive", next: "Share trial environment" },
];

const OPEN_SUCCESS_ACTIONS = [
  { action: "Sharing detailed uptime analysis", owner: "Rahul Sharma", due: "20 Apr 2024", priority: "High", status: "In Progress", color: "bg-blue-100 text-blue-800" },
  { action: "User training - Phase 2", owner: "Neha Kapoor", due: "25 Apr 2024", priority: "Medium", status: "In Progress", color: "bg-blue-100 text-blue-800" },
  { action: "Review energy optimization report", owner: "Rahul Sharma", due: "30 Apr 2024", priority: "High", status: "Not Started", color: "bg-slate-100 text-slate-700" },
  { action: "Collect feedback from site teams", owner: "Neha Kapoor", due: "05 May 2024", priority: "Medium", status: "Not Started", color: "bg-slate-100 text-slate-700" },
  { action: "Prepare renewal proposal", owner: "Rahul Sharma", due: "15 May 2024", priority: "High", status: "Not Started", color: "bg-slate-100 text-slate-700" },
];

const RISKS_DATA = [
  { risk: "Low user adoption in new sites", impact: "High", prob: "Medium", score: 12, status: "Mitigation", color: "bg-amber-100 text-amber-800" },
  { risk: "Upcoming contract renewal delay", impact: "High", prob: "Low", score: 6, status: "Monitor", color: "bg-blue-100 text-blue-800" },
  { risk: "Competitor pricing pressure", impact: "Medium", prob: "Medium", score: 9, status: "Mitigation", color: "bg-amber-100 text-amber-800" },
];

const ADOPTION_DONUT = [
  { name: "Adopted", value: 78, color: "#0284c7" },
  { name: "Unused", value: 22, color: "#cbd5e1" },
];

export function CustomerSuccessPage() {
  const [success, setSuccess] = useState<CustomerSuccessRecord>(INITIAL_SUCCESS);
  const [activeTab, setActiveTab] = useState<string>("health");

  // Modals
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [isAddEngagementOpen, setIsAddEngagementOpen] = useState(false);
  const [isAddRiskOpen, setIsAddRiskOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleInputChange = (field: keyof CustomerSuccessRecord, value: any) => {
    setSuccess((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSuccess = () => {
    showNotification(`Customer Success Record ${success.successNumber} saved successfully!`);
  };

  return (
    <AppShell
      title="Customer Success Form"
      breadcrumb="Management > CRM Management > Customer Success > Customer Success Form"
      description="The Customer Success Form manages the complete post-sale relationship lifecycle focused on customer adoption, value realization, retention, expansion, health monitoring, renewals, risks, and advocacy."
      tabs={<CrmManagementTabBar />}
    >
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col min-h-screen text-slate-800 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-3 flex-nowrap overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap">
                Customer Success Form
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap font-mono">
                {success.successNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 whitespace-nowrap flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block" />
                <span>{success.status}</span>
              </span>
            </div>

            {/* Quick Actions Header */}
            <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
              <button
                onClick={() => setIsNewRecordOpen(true)}
                className="h-8 px-3 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Success Record</span>
              </button>

              <button
                onClick={handleSaveSuccess}
                className="h-8 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>

              <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1 shrink-0 whitespace-nowrap">
                <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold text-xs shadow-2xs shrink-0">
                  NK
                </div>
                <div className="text-left hidden sm:block whitespace-nowrap">
                  <div className="text-xs font-semibold text-slate-800 leading-none">Neha Kapoor</div>
                  <div className="text-[10px] text-slate-500">CS Lead</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Customer Success Master (Matching Mockup Image) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">1. Customer Success Master</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">Post-Sale Relationship Master Record</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Success Number *</label>
              <input
                type="text"
                value={success.successNumber}
                onChange={(e) => handleInputChange("successNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer *</label>
              <input
                type="text"
                value={success.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer Segment *</label>
              <input
                type="text"
                value={success.customerSegment}
                onChange={(e) => handleInputChange("customerSegment", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer Tier *</label>
              <select
                value={success.customerTier}
                onChange={(e) => handleInputChange("customerTier", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-emerald-50 border border-emerald-300 rounded font-bold text-emerald-800 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Strategic">Strategic</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Success Status *</label>
              <select
                value={success.status}
                onChange={(e) => handleInputChange("status", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-emerald-700 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Value Realization">Value Realization</option>
                <option value="Onboarding">Onboarding</option>
                <option value="Adoption">Adoption</option>
                <option value="Healthy">Healthy</option>
                <option value="Renewal">Renewal</option>
                <option value="Expansion">Expansion</option>
                <option value="Advocacy">Advocacy</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Success Manager *</label>
              <div className="flex items-center gap-2 h-8 px-2 bg-white border border-slate-300 rounded">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">
                  RS
                </div>
                <span className="font-semibold text-slate-800 truncate">{success.successManager.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Start Date *</label>
              <input
                type="text"
                value={success.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Review Date *</label>
              <input
                type="text"
                value={success.reviewDate}
                onChange={(e) => handleInputChange("reviewDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-blue-700"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Branch</label>
              <input
                type="text"
                value={success.branch}
                onChange={(e) => handleInputChange("branch", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Business Unit</label>
              <input
                type="text"
                value={success.businessUnit}
                onChange={(e) => handleInputChange("businessUnit", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Success Team</label>
              <input
                type="text"
                value={success.successTeam}
                onChange={(e) => handleInputChange("successTeam", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Account Owner *</label>
              <div className="flex items-center gap-2 h-8 px-2 bg-white border border-slate-300 rounded">
                <div className="h-5 w-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                  NK
                </div>
                <span className="font-semibold text-slate-800 truncate">{success.accountOwner.name}</span>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-2">
              <label className="block text-slate-500 font-semibold mb-1">Customer Objective *</label>
              <input
                type="text"
                value={success.customerObjective}
                onChange={(e) => handleInputChange("customerObjective", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-medium"
              />
            </div>

            <div className="col-span-1 lg:col-span-2">
              <label className="block text-slate-500 font-semibold mb-1">Key Outcomes</label>
              <input
                type="text"
                value={success.keyOutcomes}
                onChange={(e) => handleInputChange("keyOutcomes", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Annual Business Value</label>
              <input
                type="text"
                value={`₹ ${(success.annualBusinessValue).toLocaleString("en-IN")}`}
                readOnly
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer Lifetime Value</label>
              <input
                type="text"
                value={`₹ ${(success.customerLifetimeValue).toLocaleString("en-IN")}`}
                readOnly
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-emerald-700"
              />
            </div>
          </div>
        </div>

        {/* Inner Sub-Tabs Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/70 p-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: "health", label: "Onboarding & Health", icon: UserCheck },
              { id: "objectives", label: "Success Objectives & QBR", icon: Target },
              { id: "risks", label: "Churn Risks & Mitigation", icon: ShieldAlert },
              { id: "renewal", label: "Renewal & Expansion", icon: RefreshCw },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                    active
                      ? "bg-white text-primary shadow-2xs border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", active ? "text-primary" : "text-slate-400")} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT AREA */}
          <div className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left & Center Columns */}
              <div className="lg:col-span-2 space-y-6">
                {activeTab === "health" && (
                  <div className="space-y-6">
                    {/* Grid Row 1: Customer Health Score & Adoption Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Card 2: Customer Health Score */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                          2. Customer Health Score
                        </h3>

                        <div className="flex items-center justify-between gap-4">
                          <div className="text-center shrink-0 flex flex-col items-center">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                {/* Track Background */}
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  className="text-slate-100"
                                  strokeWidth="8"
                                  stroke="currentColor"
                                  fill="transparent"
                                />
                                {/* Health Score Arc */}
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  stroke="#10b981"
                                  strokeWidth="8"
                                  strokeDasharray={2 * Math.PI * 40}
                                  strokeDashoffset={2 * Math.PI * 40 * (1 - (success.overallHealthScore || 82) / 100)}
                                  strokeLinecap="round"
                                  fill="transparent"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center select-none text-center">
                                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight leading-none">
                                  {success.overallHealthScore}%
                                </span>
                                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                                  Score
                                </span>
                              </div>
                            </div>
                            <span className="mt-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] rounded-full inline-block">
                              Healthy
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px] w-full">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Product Usage</span>
                              <span className="font-bold text-slate-800">{success.productUsageScore}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Adoption</span>
                              <span className="font-bold text-slate-800">{success.adoptionScore}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Support Experience</span>
                              <span className="font-bold text-slate-800">{success.supportExperienceScore}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Satisfaction (CSAT)</span>
                              <span className="font-bold text-slate-800">{success.csatScore}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Engagement</span>
                              <span className="font-bold text-slate-800">{success.engagementScore}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Renewal Likelihood</span>
                              <span className="font-bold text-slate-800">{success.renewalLikelihoodScore}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Payment Health</span>
                              <span className="font-bold text-slate-800">{success.paymentHealthScore}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] text-emerald-700 font-bold text-center border-t border-slate-200 pt-2">
                          {success.healthTrendText}
                        </div>
                      </div>

                      {/* Card 3: Adoption Summary */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                          3. Adoption Summary
                        </h3>

                        <div className="flex items-center justify-between gap-2">
                          <div className="w-24 h-24 relative shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={ADOPTION_DONUT}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={24}
                                  outerRadius={38}
                                  paddingAngle={3}
                                  dataKey="value"
                                >
                                  {ADOPTION_DONUT.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <RechartsTooltip formatter={(val: number) => `${val}%`} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                              <span className="text-sm font-extrabold text-blue-700">78%</span>
                              <span className="text-[8px] font-bold text-slate-400">Adoption</span>
                            </div>
                          </div>

                          <div className="space-y-1 text-xs w-full">
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">Active Users</span>
                              <span className="font-bold text-slate-800">156 / 200</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">Feature Utilization</span>
                              <span className="font-bold text-slate-800">78%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">Usage Frequency</span>
                              <span className="font-bold text-slate-800">High</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">Last Active</span>
                              <span className="font-semibold text-slate-800">15 Apr 2024</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-200 pt-1">
                              <span className="text-slate-500 font-medium">Onboarding Score</span>
                              <span className="text-emerald-700 font-bold text-xs">4.2 / 5.0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 8: Value Realization (YTD) */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        Value Realization (YTD)
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-semibold">Uptime</div>
                          <div className="text-base font-extrabold text-emerald-700">96%</div>
                          <div className="text-[9px] text-slate-400">Target: 98%</div>
                        </div>
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-semibold">Energy Savings</div>
                          <div className="text-base font-extrabold text-emerald-700">₹ 8.4 Lakhs</div>
                          <div className="text-[9px] text-slate-400">Target: ₹ 12 L</div>
                        </div>
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-semibold">OPEX Reduction</div>
                          <div className="text-base font-extrabold text-amber-700">11%</div>
                          <div className="text-[9px] text-slate-400">Target: 15%</div>
                        </div>
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-semibold">User CSAT</div>
                          <div className="text-base font-extrabold text-emerald-700">4.2 / 5.0</div>
                          <div className="text-[9px] text-slate-400">Target: 4.5 / 5.0</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "objectives" && (
                  <div className="space-y-6">
                    {/* Card 4: Key Objectives Progress */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Key Objectives & Milestones
                        </h3>
                        <span className="font-extrabold text-primary text-sm">74% Complete</span>
                      </div>

                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "74%" }} />
                      </div>

                      <div className="w-full pt-1">
                        <table className="w-full text-left text-[11px] table-fixed">
                          <thead>
                            <tr className="text-slate-500 font-semibold border-b border-slate-200">
                              <th className="py-1.5 px-2 w-[45%]">Objective</th>
                              <th className="py-1.5 px-2 w-[20%] text-center">Target</th>
                              <th className="py-1.5 px-2 w-[15%] text-center">Progress</th>
                              <th className="py-1.5 px-2 w-[20%] text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {OBJECTIVES_DATA.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/80">
                                <td className="py-1.5 px-2 font-medium text-slate-800 truncate">{row.obj}</td>
                                <td className="py-1.5 px-2 text-center text-slate-600">{row.target}</td>
                                <td className="py-1.5 px-2 text-center font-bold text-slate-900">{row.progress}</td>
                                <td className="py-1.5 px-2 text-center">
                                  <span className={cn("px-1.5 py-0.5 text-[9px] font-bold rounded", row.color)}>
                                    {row.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Engagements & Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Recent Engagements */}
                      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Recent Engagements
                          </h3>
                          <button onClick={() => showNotification("Viewing All Engagements...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                            View All
                          </button>
                        </div>

                        <div className="w-full">
                          <table className="w-full text-left text-[11px] table-fixed">
                            <thead>
                              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                <th className="py-1.5 px-2 w-[25%] whitespace-nowrap">Date</th>
                                <th className="py-1.5 px-1.5 w-[25%] whitespace-nowrap">Type</th>
                                <th className="py-1.5 px-1.5 w-[50%] whitespace-nowrap">Outcome</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {RECENT_ENGAGEMENTS.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/80">
                                  <td className="py-1.5 px-2 text-slate-500 whitespace-nowrap text-[10px]">{row.date}</td>
                                  <td className="py-1.5 px-1.5 font-bold text-slate-800 text-[10px] truncate">{row.type}</td>
                                  <td className="py-1.5 px-1.5 font-semibold text-emerald-700 text-[10px] truncate">{row.outcome}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Open Success Actions */}
                      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Open Success Actions
                          </h3>
                          <button onClick={() => showNotification("Viewing All Actions...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                            View All
                          </button>
                        </div>

                        <div className="w-full">
                          <table className="w-full text-left text-[11px] table-fixed">
                            <thead>
                              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                <th className="py-1.5 px-2 w-[45%] whitespace-nowrap">Action</th>
                                <th className="py-1.5 px-1.5 w-[30%] whitespace-nowrap">Due</th>
                                <th className="py-1.5 px-1.5 w-[25%] text-center whitespace-nowrap">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {OPEN_SUCCESS_ACTIONS.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/80">
                                  <td className="py-1.5 px-2 font-bold text-slate-800 text-[10px] truncate">{row.action}</td>
                                  <td className="py-1.5 px-1.5 text-slate-500 whitespace-nowrap text-[10px]">{row.due}</td>
                                  <td className="py-1.5 px-1.5 text-center">
                                    <span className={cn("px-1.5 py-0.5 text-[9px] font-bold rounded", row.color)}>
                                      {row.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "risks" && (
                  <div className="space-y-6">
                    {/* Card 9: Risks & Recovery */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Active Churn Risks & Mitigations
                        </h3>
                        <button onClick={() => setIsAddRiskOpen(true)} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          + Log Risk
                        </button>
                      </div>

                      <div className="w-full">
                        <table className="w-full text-left text-[11px] table-fixed">
                          <thead>
                            <tr className="text-slate-500 font-semibold border-b border-slate-200">
                              <th className="py-1.5 px-2 w-[55%]">Risk Factor</th>
                              <th className="py-1.5 px-2 w-[20%] text-center">Severity Score</th>
                              <th className="py-1.5 px-2 w-[25%] text-center">Mitigation Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {RISKS_DATA.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/80">
                                <td className="py-1.5 px-2 font-medium text-slate-800 truncate">{row.risk}</td>
                                <td className="py-1.5 px-2 text-center font-bold text-slate-900">{row.score}</td>
                                <td className="py-1.5 px-2 text-center">
                                  <span className={cn("px-1.5 py-0.5 text-[9px] font-bold rounded", row.color)}>
                                    {row.status}
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

                {activeTab === "renewal" && (
                  <div className="space-y-6">
                    {/* Upcoming Renewal & Expansion */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Card 5: Upcoming Renewal */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Upcoming Renewal
                          </h3>
                          <button onClick={() => showNotification("Viewing Renewal Pipeline...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                            View Pipeline
                          </button>
                        </div>

                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
                          <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500 font-semibold">Renewal Date</div>
                            <div className="text-sm font-extrabold text-slate-900">{success.renewalDate}</div>
                          </div>
                          <div className="ml-auto text-right">
                            <div className="text-[10px] text-slate-500 font-semibold">Days to Renewal</div>
                            <div className="text-base font-extrabold text-blue-700">199 Days</div>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Renewal Likelihood</span>
                            <span className="font-extrabold text-emerald-700">88%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Renewal Value</span>
                            <span className="font-mono font-bold text-slate-900">₹ 48,00,000.00</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 10: Customer Advocacy */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Customer Advocacy & Referrals
                          </h3>
                          <button onClick={() => showNotification("Managing Customer Advocacy...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                            Manage
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="p-2 bg-white rounded border border-slate-200">
                            <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-center gap-1">
                              <Heart className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" /> NPS Score
                            </div>
                            <div className="text-lg font-extrabold text-emerald-700">+{success.npsScore}</div>
                          </div>
                          <div className="p-2 bg-white rounded border border-slate-200">
                            <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-center gap-1">
                              <Plane className="h-3.5 w-3.5 text-blue-600" /> References
                            </div>
                            <div className="text-lg font-extrabold text-slate-900">{success.referencesCount}</div>
                          </div>
                          <div className="p-2 bg-white rounded border border-slate-200">
                            <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-center gap-1">
                              <Quote className="h-3.5 w-3.5 text-purple-600" /> Testimonials
                            </div>
                            <div className="text-lg font-extrabold text-slate-900">{success.testimonialsCount}</div>
                          </div>
                          <div className="p-2 bg-white rounded border border-slate-200">
                            <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-center gap-1">
                              <Briefcase className="h-3.5 w-3.5 text-amber-600" /> Case Studies
                            </div>
                            <div className="text-lg font-extrabold text-slate-900">{success.caseStudiesCount}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar Panels */}
              <div className="space-y-6">
                {/* Success Summary Widget (8 Stat Tiles) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Success Summary
                    </h3>
                    <button onClick={() => showNotification("Opening Customer Success Dashboard...")} className="text-[10px] font-semibold text-primary hover:underline cursor-pointer">
                      View Dashboard
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200">
                      <div className="text-[10px] text-blue-700 font-semibold">Total Customers</div>
                      <div className="text-lg font-extrabold text-blue-900">128</div>
                    </div>
                    <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200">
                      <div className="text-[10px] text-emerald-700 font-semibold">Healthy Customers</div>
                      <div className="text-lg font-extrabold text-emerald-900">86 (67%)</div>
                    </div>
                    <div className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200">
                      <div className="text-[10px] text-amber-700 font-semibold">At Risk Customers</div>
                      <div className="text-lg font-extrabold text-amber-900">22 (17%)</div>
                    </div>
                    <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-200">
                      <div className="text-[10px] text-rose-700 font-semibold">Critical Customers</div>
                      <div className="text-lg font-extrabold text-rose-900">6 (5%)</div>
                    </div>
                    <div className="p-2.5 bg-purple-50/60 rounded-lg border border-purple-200">
                      <div className="text-[10px] text-purple-700 font-semibold">Renewals Due (90d)</div>
                      <div className="text-lg font-extrabold text-purple-900">14</div>
                    </div>
                    <div className="p-2.5 bg-teal-50/60 rounded-lg border border-teal-200">
                      <div className="text-[10px] text-teal-700 font-semibold">Expansion Opps</div>
                      <div className="text-lg font-extrabold text-teal-900">9</div>
                    </div>
                    <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-200 flex justify-between items-center">
                      <div>
                        <div className="text-[10px] text-indigo-700 font-semibold">Avg. Health Score</div>
                        <div className="text-sm font-extrabold text-indigo-900 font-mono">82 / 100</div>
                      </div>
                      <div className="relative inline-flex items-center justify-center shrink-0">
                        <svg width="34" height="34" className="transform -rotate-90">
                          <circle cx="17" cy="17" r="12" stroke="currentColor" strokeWidth="2.5" className="text-indigo-200" fill="transparent" />
                          <circle
                            cx="17"
                            cy="17"
                            r="12"
                            stroke="#4f46e5"
                            strokeWidth="2.5"
                            strokeDasharray={2 * Math.PI * 12}
                            strokeDashoffset={2 * Math.PI * 12 * (1 - 0.82)}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <span className="absolute text-[8px] font-bold font-mono text-indigo-700">82%</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-300">
                      <div className="text-[10px] text-slate-600 font-semibold">NRR (Retention)</div>
                      <div className="text-sm font-extrabold text-slate-900">112%</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Quick Actions
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsAddEngagementOpen(true)}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1.5 text-xs font-medium text-slate-700 transition-all cursor-pointer hover:border-blue-300"
                    >
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-slate-800">Add Engagement</span>
                    </button>
                    <button
                      onClick={() => setIsAddRiskOpen(true)}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1.5 text-xs font-medium text-slate-700 transition-all cursor-pointer hover:border-rose-300"
                    >
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                      <span className="font-semibold text-slate-800">Log Risk</span>
                    </button>
                    <button
                      onClick={() => showNotification("Follow-up action item added to client success plan.")}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1.5 text-xs font-medium text-slate-700 transition-all cursor-pointer hover:border-emerald-300"
                    >
                      <CheckSquare className="h-4 w-4 text-emerald-600" />
                      <span className="font-semibold text-slate-800">Add Action</span>
                    </button>
                    <button
                      onClick={() => showNotification("QBR document attachment window ready.")}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1.5 text-xs font-medium text-slate-700 transition-all cursor-pointer hover:border-indigo-300"
                    >
                      <Paperclip className="h-4 w-4 text-indigo-600" />
                      <span className="font-semibold text-slate-800">Add Document</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL 1: NEW SUCCESS RECORD */}
        {isNewRecordOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900">Create New Customer Success Record</h3>
                <button onClick={() => setIsNewRecordOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Account *</label>
                  <input id="new-cs-cust" type="text" placeholder="e.g. Acme Automation Pvt. Ltd." className="w-full h-8 px-2 border rounded text-xs" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Tier</label>
                  <select className="w-full h-8 px-2 border rounded text-xs font-bold text-emerald-800">
                    <option value="Strategic">Strategic</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsNewRecordOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const cust = (document.getElementById("new-cs-cust") as HTMLInputElement)?.value || "Customer";
                    setSuccess((prev) => ({
                      ...prev,
                      successNumber: `CS-2024-000${Math.floor(Math.random() * 900 + 100)}`,
                      customerName: cust,
                    }));
                    setIsNewRecordOpen(false);
                    showNotification("Customer Success Record created!");
                  }}
                  className="px-4 py-1.5 text-xs bg-primary text-white font-bold rounded shadow-xs"
                >
                  Create Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
