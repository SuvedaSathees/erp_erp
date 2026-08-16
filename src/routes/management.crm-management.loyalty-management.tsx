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
  ShoppingCart,
  UserPlus,
  Gift,
  Ticket,
  Sparkles,
  Crown,
  Trophy,
  Tag,
  CreditCard,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/management/crm-management/loyalty-management")({
  head: () => ({
    meta: [
      { title: "Loyalty Management Form ⭐ · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Loyalty Management Form - Central record for customer loyalty lifecycle, points balance (12,450 pts), GOLD tier progression (78%), reward redemptions, active campaigns, referral summary, and loyalty analytics.",
      },
    ],
  }),
  component: LoyaltyManagementPage,
});

// --- Types & Data Interfaces ---

export type MembershipStatus =
  | "Active"
  | "Prospect"
  | "Enrolled"
  | "Tier Upgrade"
  | "VIP"
  | "Inactive"
  | "Expired";

export interface LoyaltyRecord {
  id: string;
  loyaltyNumber: string;
  customerName: string;
  loyaltyProgram: string;
  membershipNumber: string;
  status: MembershipStatus;
  customerTier: "BASIC" | "SILVER" | "GOLD" | "PLATINUM";
  enrollmentDate: string;
  expiryDate: string;
  loyaltyManager: { name: string; avatar: string };
  branch: string;
  businessUnit: string;
  pointsBalance: number; // 12,450
  lifetimePoints: number; // 78,250
  redeemedPoints: number; // 65,800
  loyaltyValueRupees: number; // 48,600

  // Tier Progress
  nextTier: string; // "PLATINUM"
  pointsToNextTier: number; // 21,750
  tierProgressPct: number; // 78

  // Engagement
  engagementScore: number; // 86
  transactionsCountThisYear: number; // 18
  lastInteractionDate: string; // "15 Apr 2024"
  engagementStreakMonths: number; // 6

  // Referrals
  totalReferrals: number; // 24
  successfulReferrals: number; // 12
  referralPointsEarned: number; // 36,000
  referralRevenueRupees: number; // 875,000
}

const INITIAL_LOYALTY: LoyaltyRecord = {
  id: "LOY-001",
  loyaltyNumber: "LOY-2024-000125",
  customerName: "Acme Automation Pvt. Ltd.",
  loyaltyProgram: "Magnertia Rewards",
  membershipNumber: "MR-ACME-000125",
  status: "Active",
  customerTier: "GOLD",
  enrollmentDate: "01 Jan 2024",
  expiryDate: "31 Dec 2025",
  loyaltyManager: { name: "Vikram Singh", avatar: "VS" },
  branch: "Mumbai Branch",
  businessUnit: "Industrial Solutions",
  pointsBalance: 12450,
  lifetimePoints: 78250,
  redeemedPoints: 65800,
  loyaltyValueRupees: 48600,

  nextTier: "PLATINUM",
  pointsToNextTier: 21750,
  tierProgressPct: 78,

  engagementScore: 86,
  transactionsCountThisYear: 18,
  lastInteractionDate: "15 Apr 2024",
  engagementStreakMonths: 6,

  totalReferrals: 24,
  successfulReferrals: 12,
  referralPointsEarned: 36000,
  referralRevenueRupees: 875000,
};

const POINTS_DONUT_DATA = [
  { name: "Available", value: 12450, color: "#16a34a" },
  { name: "Redeemed", value: 65800, color: "#3b82f6" },
  { name: "Expired", value: 120, color: "#ef4444" },
  { name: "Adjusted", value: 1580, color: "#f59e0b" },
];

const RECENT_ACTIVITY_FEED = [
  { icon: ShoppingCart, title: "Purchase - INV-2024-01785", date: "15 Apr 2024", points: "+1,250 pts", isPositive: true },
  { icon: Star, title: "AMC Renewal - AMC-2024-0087", date: "10 Apr 2024", points: "+2,000 pts", isPositive: true },
  { icon: Sparkles, title: "Product Review", date: "05 Apr 2024", points: "+500 pts", isPositive: true },
  { icon: Users, title: "Referral - New Customer", date: "01 Apr 2024", points: "+3,000 pts", isPositive: true },
  { icon: Gift, title: "Reward Redemption - Voucher", date: "28 Mar 2024", points: "-2,000 pts", isPositive: false },
];

const REWARD_RECOMMENDATIONS = [
  { title: "₹500 Discount Voucher", pts: "2,000 pts", detail: "Valid for all services" },
  { title: "Free Preventive Maintenance", pts: "5,000 pts", detail: "Get one free PM service" },
  { title: "Product Upgrade Coupon", pts: "10,000 pts", detail: "Discount on product upgrade" },
];

const GOLD_TIER_BENEFITS = [
  "5% Discount on Services",
  "Priority Support",
  "Free Annual Health Check",
  "Exclusive Member Offers",
  "Early Access to New Products",
];

const TRANSACTIONS_LEDGER = [
  { date: "16 Apr 2024", type: "Earn", ref: "INV-2024-01785", desc: "Product Purchase", earned: "1,250", redeemed: "-", balance: "12,450" },
  { date: "10 Apr 2024", type: "Earn", ref: "AMC-2024-0087", desc: "AMC Renewal", earned: "2,000", redeemed: "-", balance: "11,200" },
  { date: "05 Apr 2024", type: "Earn", ref: "REV-2024-0045", desc: "Product Review", earned: "500", redeemed: "-", balance: "9,200" },
  { date: "01 Apr 2024", type: "Earn", ref: "REF-2024-0033", desc: "Referral Bonus", earned: "3,000", redeemed: "-", balance: "8,700" },
  { date: "28 Mar 2024", type: "Redeem", ref: "RD-2024-0012", desc: "Voucher Redemption", earned: "-", redeemed: "2,000", balance: "5,700" },
];

const REDEMPTION_HISTORY = [
  { date: "28 Mar 2024", reward: "₹500 Discount Voucher", pts: "2,000", ref: "RD-2024-0012", status: "Completed" },
  { date: "12 Feb 2024", reward: "AMC Discount", pts: "3,000", ref: "RD-2024-0009", status: "Completed" },
  { date: "05 Jan 2024", reward: "Free PM Service", pts: "5,000", ref: "RD-2024-0003", status: "Completed" },
];

const ACTIVE_CAMPAIGNS = [
  { title: "Double Points Weekend", desc: "Earn 2X points on all purchases", date: "12 Apr 2024 - 20 Apr 2024", status: "Active" },
  { title: "Referral Bonanza", desc: "Refer & earn 3,000 bonus points", date: "01 Apr 2024 - 30 Apr 2024", status: "Active" },
  { title: "Service Loyalty Week", desc: "Extra 10% points on services", date: "10 Apr 2024 - 17 Apr 2024", status: "Active" },
];

const TREND_LINE_DATA = [
  { month: "Jan", pts: 4200 },
  { month: "Feb", pts: 6800 },
  { month: "Mar", pts: 11200 },
  { month: "Apr", pts: 16400 },
];

const TIER_DISTRIBUTION = [
  { name: "Platinum", value: 8, color: "#3b82f6" },
  { name: "Gold", value: 32, color: "#eab308" },
  { name: "Silver", value: 56, color: "#94a3b8" },
  { name: "Basic", value: 32, color: "#cbd5e1" },
];

export function LoyaltyManagementPage() {
  const [loyalty, setLoyalty] = useState<LoyaltyRecord>(INITIAL_LOYALTY);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Modals
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [isAddPointsOpen, setIsAddPointsOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);

  const handleInputChange = (field: keyof LoyaltyRecord, value: any) => {
    setLoyalty((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveLoyalty = () => {
    alert(`Loyalty Record ${loyalty.loyaltyNumber} saved successfully!`);
  };

  return (
    <AppShell
      title="Loyalty Management Form ⭐"
      breadcrumb="Management > CRM Management > Loyalty Management > Loyalty Management Form"
      description="The Loyalty Management Form manages the complete customer loyalty lifecycle from customer enrollment → program assignment → earning → points balance → rewards → redemption → tier progression → engagement → retention → advocacy → analytics."
      tabs={<CrmManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen text-slate-800 space-y-6">
        {/* Loyalty Master Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>Loyalty Management Form</span>
                <span className="text-amber-500 text-sm">⭐</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {loyalty.loyaltyNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
                ● {loyalty.status}
              </span>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => setIsNewRecordOpen(true)}
                className="h-8 px-3 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Loyalty Record</span>
              </button>

              <button
                onClick={() => window.print()}
                className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-slate-600" />
                <span>Print</span>
              </button>

              <button
                onClick={() => alert("Opening Email Composer for Loyalty Update...")}
                className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5 text-blue-600" />
                <span>Send Email</span>
              </button>

              <button
                onClick={handleSaveLoyalty}
                className="h-8 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>

              <button
                onClick={() => alert("More options...")}
                className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>More</span>
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1">
                <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs shadow-2xs">
                  RS
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 leading-none">Rahul Sharma</div>
                  <div className="text-[10px] text-slate-500">CRM Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Loyalty Master (Matching Mockup Image) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">1. Loyalty Master</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">Customer Loyalty Account Master</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Loyalty Number *</label>
              <input
                type="text"
                value={loyalty.loyaltyNumber}
                onChange={(e) => handleInputChange("loyaltyNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer *</label>
              <input
                type="text"
                value={loyalty.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Loyalty Program *</label>
              <input
                type="text"
                value={loyalty.loyaltyProgram}
                onChange={(e) => handleInputChange("loyaltyProgram", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Membership Number *</label>
              <input
                type="text"
                value={loyalty.membershipNumber}
                onChange={(e) => handleInputChange("membershipNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-300 rounded font-mono font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Membership Status *</label>
              <select
                value={loyalty.status}
                onChange={(e) => handleInputChange("status", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-emerald-50 border border-emerald-300 rounded font-bold text-emerald-800 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Enrolled">Enrolled</option>
                <option value="Tier Upgrade">Tier Upgrade</option>
                <option value="VIP">VIP</option>
                <option value="Inactive">Inactive</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer Tier</label>
              <div className="h-8 px-2.5 bg-amber-50 border border-amber-300 rounded font-bold text-amber-900 flex items-center justify-between">
                <span>GOLD</span>
                <Crown className="h-4 w-4 text-amber-600 fill-amber-500" />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Enrollment Date *</label>
              <input
                type="text"
                value={loyalty.enrollmentDate}
                onChange={(e) => handleInputChange("enrollmentDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Expiry Date</label>
              <input
                type="text"
                value={loyalty.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Loyalty Manager *</label>
              <div className="flex items-center gap-2 h-8 px-2 bg-white border border-slate-300 rounded">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">
                  VS
                </div>
                <span className="font-semibold text-slate-800 truncate">{loyalty.loyaltyManager.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Branch</label>
              <input
                type="text"
                value={loyalty.branch}
                onChange={(e) => handleInputChange("branch", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Business Unit</label>
              <input
                type="text"
                value={loyalty.businessUnit}
                onChange={(e) => handleInputChange("businessUnit", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Points Balance</label>
              <input
                type="text"
                value={loyalty.pointsBalance.toLocaleString("en-IN")}
                readOnly
                className="w-full h-8 px-2.5 bg-emerald-50 border border-emerald-300 rounded font-mono font-extrabold text-emerald-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Lifetime Points</label>
              <input
                type="text"
                value={loyalty.lifetimePoints.toLocaleString("en-IN")}
                readOnly
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Redeemed Points</label>
              <input
                type="text"
                value={loyalty.redeemedPoints.toLocaleString("en-IN")}
                readOnly
                className="w-full h-8 px-2.5 bg-rose-50 border border-rose-200 rounded font-mono font-bold text-rose-700"
              />
            </div>

            <div className="col-span-1 lg:col-span-2">
              <label className="block text-slate-500 font-semibold mb-1">Loyalty Value (₹)</label>
              <input
                type="text"
                value={`₹ ${(loyalty.loyaltyValueRupees).toLocaleString("en-IN")}`}
                readOnly
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-extrabold text-blue-900"
              />
            </div>
          </div>
        </div>

        {/* Inner Sub-Tabs Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/70 p-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: "overview", label: "Overview", icon: Layers },
              { id: "transactions", label: "Transactions", icon: CreditCard },
              { id: "rewards", label: "Rewards", icon: Gift },
              { id: "tiers", label: "Tiers", icon: Trophy },
              { id: "engagement", label: "Engagement", icon: Activity },
              { id: "campaigns", label: "Campaigns", icon: Sparkles },
              { id: "referrals", label: "Referrals", icon: Users },
              { id: "documents", label: "Documents", icon: Paperclip },
              { id: "history", label: "History", icon: Clock },
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
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left & Center Columns (Sections 2 to 12) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Grid Row 1: Points Summary, Tier Progress, Recent Activity */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 2: Points Summary */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        2. Points Summary
                      </h3>

                      <div className="flex flex-col items-center justify-center relative">
                        <div className="w-28 h-28 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={POINTS_DONUT_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={28}
                                outerRadius={44}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {POINTS_DONUT_DATA.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip formatter={(val: number) => val.toLocaleString("en-IN")} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                            <span className="text-sm font-extrabold text-emerald-800">12,450</span>
                            <span className="text-[8px] font-bold text-slate-400">Available</span>
                          </div>
                        </div>

                        <div className="w-full space-y-1 text-[11px] pt-2 border-t border-slate-200 mt-2">
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Earned</span>
                            <span className="font-bold text-slate-800">78,250</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Redeemed</span>
                            <span className="font-bold text-slate-800">65,800</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Expired</span>
                            <span className="font-bold text-slate-800">120</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Adjusted</span>
                            <span className="font-bold text-slate-800">1,580</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 p-2 rounded text-[10px] text-emerald-800 font-semibold flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Points will expire on 31 Dec 2025: 4,250 points (33.7%)</span>
                      </div>
                    </div>

                    {/* Card 3: Tier Progress */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-center">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2 text-left">
                        3. Tier Progress
                      </h3>

                      <div className="flex flex-col items-center justify-center space-y-2 py-2">
                        <div className="h-14 w-14 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center shadow-xs">
                          <Trophy className="h-8 w-8 text-amber-600 fill-amber-500" />
                        </div>
                        <div>
                          <div className="text-lg font-extrabold text-slate-900">GOLD</div>
                          <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-bold text-[10px]">
                            Current Tier
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-left pt-2 border-t border-slate-200">
                        <div className="text-[11px] text-slate-600 font-medium">
                          You are <span className="font-bold text-slate-900">21,750 points</span> away from <span className="font-bold text-blue-700">PLATINUM Tier</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: "78%" }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                          <span>78,250 / 100,000 pts</span>
                          <span className="font-bold text-emerald-700">78%</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Recent Activity */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          4. Recent Activity
                        </h3>
                        <button onClick={() => alert("Viewing All Activity...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View All
                        </button>
                      </div>

                      <div className="space-y-2 text-[11px] pt-1">
                        {RECENT_ACTIVITY_FEED.map((row, idx) => {
                          const Icon = row.icon;
                          return (
                            <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                              <div className="flex items-center gap-2">
                                <Icon className="h-3.5 w-3.5 text-slate-500" />
                                <div>
                                  <div className="font-bold text-slate-800 text-[11px]">{row.title}</div>
                                  <div className="text-[9px] text-slate-400">{row.date}</div>
                                </div>
                              </div>
                              <span className={cn("font-bold text-xs", row.isPositive ? "text-emerald-700" : "text-rose-600")}>
                                {row.points}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 2: Upcoming Reward Recommendations, Engagement Overview, Loyalty Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 5: Upcoming Reward Recommendations */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          5. Upcoming Rewards
                        </h3>
                        <button onClick={() => setIsRedeemModalOpen(true)} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View All Rewards
                        </button>
                      </div>

                      <div className="space-y-2 text-xs">
                        {REWARD_RECOMMENDATIONS.map((r, idx) => (
                          <div key={idx} className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between gap-2">
                            <div>
                              <div className="font-bold text-slate-900 text-[11px]">{r.title}</div>
                              <div className="text-[10px] font-mono text-emerald-700 font-semibold">{r.pts}</div>
                            </div>
                            <button
                              onClick={() => setIsRedeemModalOpen(true)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 rounded cursor-pointer"
                            >
                              Redeem
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card 6: Engagement Overview */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        6. Engagement Overview
                      </h3>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-white rounded border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-semibold">Engagement Score</div>
                          <div className="text-base font-extrabold text-emerald-700">86 / 100</div>
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[9px] rounded">High</span>
                        </div>
                        <div className="p-2 bg-white rounded border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-semibold">Transactions (Year)</div>
                          <div className="text-base font-extrabold text-slate-900">18</div>
                        </div>
                        <div className="p-2 bg-white rounded border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-semibold">Last Interaction</div>
                          <div className="text-xs font-bold text-slate-800">15 Apr 2024</div>
                        </div>
                        <div className="p-2 bg-white rounded border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-semibold">Engagement Streak</div>
                          <div className="text-base font-extrabold text-emerald-700">6 Months</div>
                        </div>
                      </div>
                    </div>

                    {/* Card 7: Loyalty Benefits (GOLD Tier) */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        7. Loyalty Benefits (GOLD Tier)
                      </h3>

                      <div className="space-y-1.5 text-[11px] text-slate-800 pt-1">
                        {GOLD_TIER_BENEFITS.map((b, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span className="font-semibold">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 3: Transactions Ledger & Redemption History */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 8: Transactions Ledger */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          8. Transactions Ledger
                        </h3>
                        <button onClick={() => alert("Viewing Full Ledger...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View Full Ledger
                        </button>
                      </div>

                      <div className="overflow-x-auto text-[11px]">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                              <th className="py-1.5 px-2">Date</th>
                              <th className="py-1.5 px-2">Type</th>
                              <th className="py-1.5 px-2">Reference</th>
                              <th className="py-1.5 px-2">Earned</th>
                              <th className="py-1.5 px-2">Redeemed</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {TRANSACTIONS_LEDGER.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/80">
                                <td className="py-1.5 px-2 text-slate-500 whitespace-nowrap">{row.date}</td>
                                <td className="py-1.5 px-2 font-bold text-slate-800">{row.type}</td>
                                <td className="py-1.5 px-2 font-mono text-slate-600">{row.ref}</td>
                                <td className="py-1.5 px-2 font-bold text-emerald-700">{row.earned}</td>
                                <td className="py-1.5 px-2 font-bold text-rose-600">{row.redeemed}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Card 9: Redemption History */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          9. Redemption History
                        </h3>
                        <button onClick={() => alert("Viewing All Redemptions...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View All Redemptions
                        </button>
                      </div>

                      <div className="overflow-x-auto text-[11px]">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                              <th className="py-1.5 px-2">Date</th>
                              <th className="py-1.5 px-2">Reward</th>
                              <th className="py-1.5 px-2">Points</th>
                              <th className="py-1.5 px-2 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {REDEMPTION_HISTORY.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/80">
                                <td className="py-1.5 px-2 text-slate-500 whitespace-nowrap">{row.date}</td>
                                <td className="py-1.5 px-2 font-bold text-slate-800">{row.reward}</td>
                                <td className="py-1.5 px-2 font-mono font-bold text-rose-600">{row.pts}</td>
                                <td className="py-1.5 px-2 text-center">
                                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800">
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

                  {/* Grid Row 4: Active Campaigns, Referral Summary, Loyalty Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 10: Active Campaigns */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          10. Active Campaigns
                        </h3>
                        <button onClick={() => alert("Viewing All Campaigns...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View All
                        </button>
                      </div>

                      <div className="space-y-2 text-xs">
                        {ACTIVE_CAMPAIGNS.map((c, idx) => (
                          <div key={idx} className="p-2 bg-white rounded border border-slate-200 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-900 text-[11px]">{c.title}</span>
                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[9px] rounded">
                                {c.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500">{c.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card 11: Referral Summary */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          11. Referral Summary
                        </h3>
                        <button onClick={() => alert("Viewing Referral Details...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View Details
                        </button>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Total Referrals</span>
                          <span className="font-bold text-slate-800">24</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Successful Referrals</span>
                          <span className="font-bold text-emerald-700">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Referral Points Earned</span>
                          <span className="font-bold text-slate-900">36,000</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-1">
                          <span className="text-slate-500 font-medium">Referral Revenue (₹)</span>
                          <span className="font-mono font-extrabold text-blue-900">₹ 8,75,000</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 12: Loyalty Insights */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          12. Loyalty Insights
                        </h3>
                        <button onClick={() => alert("Viewing Loyalty Dashboard...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View Dashboard
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="w-24 h-24 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={TIER_DISTRIBUTION}
                                cx="50%"
                                cy="50%"
                                innerRadius={20}
                                outerRadius={36}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {TIER_DISTRIBUTION.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                            <span className="text-xs font-extrabold text-slate-800">128</span>
                            <span className="text-[8px] text-slate-400 font-bold">Members</span>
                          </div>
                        </div>

                        <div className="space-y-1 text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                            <span>Platinum: 8 (6%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            <span>Gold: 32 (25%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-slate-400" />
                            <span>Silver: 56 (44%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-slate-300" />
                            <span>Basic: 32 (25%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Sidebar Panels (Matching Mockup Image) */}
                <div className="space-y-6">
                  {/* Loyalty Summary Widget (8 Stat Tiles) */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Loyalty Summary
                    </h3>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200 flex justify-between items-center">
                        <div>
                          <div className="text-[10px] text-emerald-700 font-semibold">Points Balance</div>
                          <div className="text-lg font-extrabold text-emerald-900">12,450</div>
                        </div>
                        <Gift className="h-5 w-5 text-emerald-600" />
                      </div>

                      <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200 flex justify-between items-center">
                        <div>
                          <div className="text-[10px] text-blue-700 font-semibold">Lifetime Points</div>
                          <div className="text-base font-extrabold text-blue-900">78,250</div>
                        </div>
                        <Trophy className="h-5 w-5 text-blue-600" />
                      </div>

                      <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-200 flex justify-between items-center">
                        <div>
                          <div className="text-[10px] text-rose-700 font-semibold">Redeemed Points</div>
                          <div className="text-base font-extrabold text-rose-900">65,800</div>
                        </div>
                        <CreditCard className="h-5 w-5 text-rose-600" />
                      </div>

                      <div className="p-2.5 bg-purple-50/60 rounded-lg border border-purple-200 flex justify-between items-center">
                        <div>
                          <div className="text-[10px] text-purple-700 font-semibold">Available Value (₹)</div>
                          <div className="text-base font-extrabold text-purple-900">₹ 48,600.00</div>
                        </div>
                        <DollarSign className="h-5 w-5 text-purple-600" />
                      </div>

                      <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 flex justify-between items-center">
                        <span className="text-[10px] font-semibold text-amber-800">Current Tier</span>
                        <span className="font-extrabold text-amber-900 text-xs">GOLD</span>
                      </div>

                      <div className="p-2 bg-blue-50 rounded-lg border border-blue-200 flex justify-between items-center">
                        <span className="text-[10px] font-semibold text-blue-800">Next Tier</span>
                        <span className="font-bold text-blue-900 text-[10px]">PLATINUM (21,750 pts to go)</span>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-semibold">Member Since</span>
                        <span className="font-bold text-slate-800 text-xs">01 Jan 2024</span>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-semibold">Membership Expiry</span>
                        <span className="font-bold text-slate-800 text-xs">31 Dec 2025</span>
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
                        onClick={() => setIsAddPointsOpen(true)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Plus className="h-4 w-4 text-emerald-600" />
                        <span>Add Points</span>
                      </button>

                      <button
                        onClick={() => setIsRedeemModalOpen(true)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Gift className="h-4 w-4 text-purple-600" />
                        <span>Redeem Reward</span>
                      </button>

                      <button
                        onClick={() => alert("Upgrading Tier...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Trophy className="h-4 w-4 text-amber-600" />
                        <span>Upgrade Tier</span>
                      </button>

                      <button
                        onClick={() => alert("Creating Campaign...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <span>Create Campaign</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODAL 1: NEW LOYALTY RECORD */}
        {isNewRecordOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900">Create New Loyalty Membership</h3>
                <button onClick={() => setIsNewRecordOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Account *</label>
                  <input id="new-loyalty-cust" type="text" placeholder="e.g. Acme Automation Pvt. Ltd." className="w-full h-8 px-2 border rounded text-xs" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loyalty Program</label>
                  <input type="text" defaultValue="Magnertia Rewards" className="w-full h-8 px-2 border rounded text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsNewRecordOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const cust = (document.getElementById("new-loyalty-cust") as HTMLInputElement)?.value || "Customer";
                    setLoyalty((prev) => ({
                      ...prev,
                      loyaltyNumber: `LOY-2024-000${Math.floor(Math.random() * 900 + 100)}`,
                      customerName: cust,
                    }));
                    setIsNewRecordOpen(false);
                    alert("Loyalty Record created!");
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
