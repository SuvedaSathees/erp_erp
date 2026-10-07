import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Percent,
  Printer,
  Save,
  Send,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Users,
  Target,
  FileCheck,
  Check,
  X,
  PieChart as PieIcon,
  BarChart3,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { SalesManagementTabBar } from "@/components/erp/SalesManagementTabBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/sales-management/discounts"
)({
  head: () => ({
    meta: [
      { title: "Discount Management · Sales Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Define. Control. Optimize. Drive Sales. — Tiered Rebates, Quantity Ladders, Channel Allowances & Margin Leakage Safeguards",
      },
    ],
  }),
  component: DiscountsComponent,
});

const initialStepperStages = [
  { id: 1, title: "Policy Formulation", status: "completed" },
  { id: 2, title: "Slab & Matrix", status: "completed" },
  { id: 3, title: "Margin Simulation", status: "completed" },
  { id: 4, title: "Executive Approval", status: "current" },
  { id: 5, title: "Active Policy", status: "pending" },
  { id: 6, title: "Rebate Audit", status: "pending" },
];

const discountHistoricalTrend = [
  { year: "FY22-23", revenue: 18.5, avgDiscount: 4.2 },
  { year: "FY23-24", revenue: 26.2, avgDiscount: 4.8 },
  { year: "FY24-25", revenue: 34.0, avgDiscount: 5.5 },
  { year: "FY25-26", revenue: 42.5, avgDiscount: 5.9 },
  { year: "FY26-27 (P)", revenue: 50.0, avgDiscount: 6.2 },
];

const channelDiscountShare = [
  { name: "Authorized Dealers", value: 1.26, share: "45%", color: "#0A3C75" },
  { name: "Master Distributors", value: 0.7, share: "25%", color: "#22C55E" },
  { name: "Enterprise Strategic", value: 0.42, share: "15%", color: "#0284C7" },
  { name: "Govt / GeM Tenders", value: 0.28, share: "10%", color: "#F59E0B" },
  { name: "Export Partners", value: 0.14, share: "5%", color: "#3B82F6" },
];

const initialVolumeTiers = [
  { id: 1, tier: "Tier 1", range: "10 - 24 Units", discount: "3.0%", bonus: "—", floorMargin: "27.0%", status: "Active" },
  { id: 2, tier: "Tier 2", range: "25 - 49 Units", discount: "5.0%", bonus: "+0.5% Cash Disc", floorMargin: "25.0%", status: "Active" },
  { id: 3, tier: "Tier 3", range: "50 - 99 Units", discount: "8.0%", bonus: "+1.0% Marketing Rebate", floorMargin: "22.0%", status: "Active" },
  { id: 4, tier: "Tier 4", range: "100+ Units", discount: "10.0%", bonus: "+2.0% Annual Target Incentive", floorMargin: "20.0%", status: "Active" },
];

const initialChannelRules = [
  { id: 1, channel: "Master Distributor", baseDiscount: "18.0%", maxCap: "22.0%", creditDays: "45 Days", settlement: "Quarterly Credit Note", status: "Active" },
  { id: 2, channel: "Authorized Dealer", baseDiscount: "12.0%", maxCap: "15.0%", creditDays: "30 Days", settlement: "Instant Invoice Deduction", status: "Active" },
  { id: 3, channel: "Enterprise Key Account", baseDiscount: "10.0%", maxCap: "14.0%", creditDays: "60 Days", settlement: "Volume Milestone Rebate", status: "Active" },
  { id: 4, channel: "Government / GeM Tender", baseDiscount: "8.0%", maxCap: "10.0%", creditDays: "90 Days", settlement: "Rate Contract Fixed", status: "Active" },
];

const initialPromoCampaigns = [
  { id: 1, campaign: "FY27 Q1 EV Ramp-up Rebate", code: "EV-Q1-RAMP", discount: "2.5% Flat", validity: "01-Apr to 30-Jun-2026", budget: "₹25.0 L", status: "Active" },
  { id: 2, campaign: "Early Booking Cash Incentive", code: "EB-CASH-05", discount: "1.0% Extra", validity: "Valid for 7-day payment", budget: "₹15.0 L", status: "Active" },
  { id: 3, campaign: "Fleet Partner Stocking Scheme", code: "FLEET-STOCK", discount: "4.0% Stocking", validity: "Pre-orders >50 chargers", budget: "₹30.0 L", status: "Active" },
];

export default function DiscountsComponent() {
  const [ruleSubTab, setRuleSubTab] = useState<"volume" | "channel" | "promo">("volume");
  const [approvalStatus, setApprovalStatus] = useState("Under Review");
  const [stepperStages, setStepperStages] = useState(initialStepperStages);
  const [version, setVersion] = useState("v1.5");
  const [volumeTiers, setVolumeTiers] = useState(initialVolumeTiers);
  const [channelRules, setChannelRules] = useState(initialChannelRules);
  const [promoCampaigns, setPromoCampaigns] = useState(initialPromoCampaigns);

  // Modals
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [isSubmitApprovalOpen, setIsSubmitApprovalOpen] = useState(false);

  // Form states
  const [newTier, setNewTier] = useState({
    tier: "",
    range: "",
    discount: "",
    bonus: "None",
    floorMargin: "21.0%",
  });

  const handleSaveDraft = () => {
    const nextVer = version === "v1.5" ? "v1.6" : "v1.7";
    setVersion(nextVer);
    toast.success(`Discount Program DISC-2026-001 draft saved as ${nextVer}!`);
  };

  const handleSubmitForApproval = () => {
    setIsSubmitApprovalOpen(true);
  };

  const handleConfirmApproval = () => {
    setApprovalStatus("Approved");
    setStepperStages((prev) =>
      prev.map((s) =>
        s.id === 4 ? { ...s, status: "completed" } : s.id === 5 ? { ...s, status: "current" } : s
      )
    );
    setIsSubmitApprovalOpen(false);
    toast.success("Discount policy DISC-2026-001 approved and moved to Active Policy!");
  };

  const handleApproveFromCard = () => {
    setApprovalStatus("Approved");
    setStepperStages((prev) =>
      prev.map((s) =>
        s.id === 4 ? { ...s, status: "completed" } : s.id === 5 ? { ...s, status: "current" } : s
      )
    );
    toast.success("Commercial Finance Controller sign-off verified!");
  };

  const handleRejectFromCard = () => {
    setApprovalStatus("Revision Requested");
    toast.warning("Revision requested from policy owner.");
  };

  const handleAddTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTier.tier || !newTier.discount) {
      toast.error("Please fill in Slab Name and Discount %");
      return;
    }
    const item = {
      id: Date.now(),
      ...newTier,
      status: "Active",
    };
    setVolumeTiers((prev) => [...prev, item]);
    setIsAddRuleOpen(false);
    setNewTier({ tier: "", range: "", discount: "", bonus: "None", floorMargin: "21.0%" });
    toast.success(`Added ${item.tier} to discount volume ladder!`);
  };

  const handleDeleteVolumeTier = (id: number) => {
    setVolumeTiers((prev) => prev.filter((t) => t.id !== id));
    toast.info("Volume tier removed.");
  };

  const handleDeleteChannelRule = (id: number) => {
    setChannelRules((prev) => prev.filter((c) => c.id !== id));
    toast.info("Channel discount rule removed.");
  };

  const handleDeletePromo = (id: number) => {
    setPromoCampaigns((prev) => prev.filter((p) => p.id !== id));
    toast.info("Promotional rebate campaign removed.");
  };

  return (
    <AppShell
      title="Discount Management"
      breadcrumb="Management > Sales Management > Discounts"
      description="Define. Control. Optimize. Drive Sales. — Tiered Rebates, Quantity Ladders, Channel Allowances & Margin Leakage Safeguards"
      tabs={<SalesManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen space-y-4 pb-12">
        {/* Top Header Card with Integrated Stepper */}
        <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#0A3C75]/10 flex items-center justify-center text-[#0A3C75] shrink-0">
                <Percent className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">Discount Management</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 shrink-0">
                    {approvalStatus === "Approved" ? "Active" : approvalStatus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
                    DISC-2026-001
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    {version}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  Define. Control. Optimize. Drive Sales. — Tiered Rebates, Quantity Ladders, Channel Allowances & Margin Leakage Safeguards
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0 flex-nowrap">
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" /> Save Draft
              </button>
              <button
                onClick={handleSubmitForApproval}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] cursor-pointer shadow-xs transition"
              >
                <Send className="w-3.5 h-3.5" /> Submit for Approval
              </button>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-5 pt-4 border-t border-border/50 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[760px] px-2">
              {stepperStages.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors",
                        step.status === "completed"
                          ? "bg-emerald-600 text-white"
                          : step.status === "current"
                          ? "bg-[#0A3C75] text-white shadow-xs"
                          : "bg-slate-100 text-slate-500 border border-border"
                      )}
                    >
                      {step.status === "completed" ? "✓" : step.id}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-800 leading-tight">{step.title}</p>
                      <p
                        className={cn(
                          "text-[10px] font-medium leading-tight",
                          step.status === "completed"
                            ? "text-emerald-700"
                            : step.status === "current"
                            ? "text-[#0A3C75] font-semibold"
                            : "text-slate-400"
                        )}
                      >
                        {step.status === "completed" ? "Complete" : step.status === "current" ? "In Progress" : "Pending"}
                      </p>
                    </div>
                  </div>
                  {idx < stepperStages.length - 1 && (
                    <div className="h-[2px] w-8 sm:w-12 bg-slate-200 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* General / Main Discount View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Discount Header, Strategic Objectives, Ladder Rules, Historical Trends */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Discount Header */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Percent className="w-4 h-4 text-[#0A3C75]" />
                    Discount Program Header & Parameters
                  </h3>
                  <span className="text-[11px] font-semibold text-[#0A3C75] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    Linked to PL-2026-001
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Program Name</span>
                    <span className="font-bold text-slate-800">Dealer Volume Ladder FY26</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Discount Code</span>
                    <span className="font-bold text-slate-800 font-mono">DISC-2026-001</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Discount Category</span>
                    <span className="font-bold text-[#0A3C75]">Quantity & Channel Scale</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Calculation Basis</span>
                    <span className="font-bold text-slate-800">Tiered % on Invoice Value</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Validity From</span>
                    <span className="font-bold text-slate-800">01-Apr-2026</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Validity To</span>
                    <span className="font-bold text-slate-800">31-Mar-2027</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Maximum Discount Cap</span>
                    <span className="font-bold text-rose-600">12.0% Absolute Cap</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Protected Margin Floor</span>
                    <span className="font-bold text-emerald-600">20.0% Minimum Protected</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Commercial Objectives */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-500" />
                  Program Performance Targets
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Target Volume</span>
                    <span className="text-base font-bold text-slate-900 tabular-nums">1,000 Units</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Dealer Orders</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Target Revenue</span>
                    <span className="text-base font-bold text-slate-900 tabular-nums">₹12.50 Cr</span>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">+28% YoY</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Discount Budget</span>
                    <span className="text-base font-bold text-slate-900 tabular-nums">₹75.00 L</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">6.0% Planned Avg</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Net Margin Gain</span>
                    <span className="text-base font-bold text-emerald-600 tabular-nums">+₹1.20 Cr</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Scale Absorption</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Tiered Quantity Ladder Table & Rules */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#0A3C75]" />
                      Discount Matrix & Allowance Rules
                    </h3>
                    <p className="text-xs text-slate-500">Live volume slabs, channel partner rebates and tactical promotional campaigns</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
                      <button
                        onClick={() => setRuleSubTab("volume")}
                        className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition ${
                          ruleSubTab === "volume" ? "bg-white text-[#0A3C75] shadow-xs" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Volume Tiers ({volumeTiers.length})
                      </button>
                      <button
                        onClick={() => setRuleSubTab("channel")}
                        className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition ${
                          ruleSubTab === "channel" ? "bg-white text-[#0A3C75] shadow-xs" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Channel Rules ({channelRules.length})
                      </button>
                      <button
                        onClick={() => setRuleSubTab("promo")}
                        className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition ${
                          ruleSubTab === "promo" ? "bg-white text-[#0A3C75] shadow-xs" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Promotional ({promoCampaigns.length})
                      </button>
                    </div>

                    <button
                      onClick={() => setIsAddRuleOpen(true)}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] cursor-pointer shadow-xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Tier
                    </button>
                  </div>
                </div>

                {/* Tab 1: Volume Tiers */}
                {ruleSubTab === "volume" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                          <th className="p-2.5">Slab Name</th>
                          <th className="p-2.5">Quantity Order Threshold</th>
                          <th className="p-2.5 text-right">Standard Discount</th>
                          <th className="p-2.5">Commercial Bonus / Incentive</th>
                          <th className="p-2.5 text-right">Floor Margin Safe</th>
                          <th className="p-2.5 text-center">Status</th>
                          <th className="p-2.5 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {volumeTiers.map((vt) => (
                          <tr key={vt.id} className="hover:bg-slate-50/60 transition">
                            <td className="p-2.5 font-bold text-slate-900">{vt.tier}</td>
                            <td className="p-2.5 font-semibold text-slate-700">{vt.range}</td>
                            <td className="p-2.5 text-right font-bold text-[#0A3C75] tabular-nums">{vt.discount}</td>
                            <td className="p-2.5 text-slate-600">{vt.bonus}</td>
                            <td className="p-2.5 text-right font-semibold text-emerald-700">{vt.floorMargin}</td>
                            <td className="p-2.5 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {vt.status}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => handleDeleteVolumeTier(vt.id)}
                                className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition"
                                title="Remove tier"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tab 2: Channel Rules */}
                {ruleSubTab === "channel" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                          <th className="p-2.5">Partner Classification</th>
                          <th className="p-2.5 text-right">Base Discount</th>
                          <th className="p-2.5 text-right">Max Cap</th>
                          <th className="p-2.5">Payment Credit Days</th>
                          <th className="p-2.5">Settlement Mechanism</th>
                          <th className="p-2.5 text-center">Status</th>
                          <th className="p-2.5 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {channelRules.map((cr) => (
                          <tr key={cr.id} className="hover:bg-slate-50/60 transition">
                            <td className="p-2.5 font-bold text-slate-900">{cr.channel}</td>
                            <td className="p-2.5 text-right font-bold text-[#0A3C75] tabular-nums">{cr.baseDiscount}</td>
                            <td className="p-2.5 text-right font-bold text-rose-700 tabular-nums">{cr.maxCap}</td>
                            <td className="p-2.5 text-slate-700">{cr.creditDays}</td>
                            <td className="p-2.5 text-slate-600">{cr.settlement}</td>
                            <td className="p-2.5 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {cr.status}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => handleDeleteChannelRule(cr.id)}
                                className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition"
                                title="Remove channel rule"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tab 3: Promotional Campaigns */}
                {ruleSubTab === "promo" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                          <th className="p-2.5">Campaign Name</th>
                          <th className="p-2.5">Promo Code</th>
                          <th className="p-2.5 text-right">Incentive / Rebate</th>
                          <th className="p-2.5">Campaign Window</th>
                          <th className="p-2.5 text-right">Earmarked Budget</th>
                          <th className="p-2.5 text-center">Status</th>
                          <th className="p-2.5 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {promoCampaigns.map((pc) => (
                          <tr key={pc.id} className="hover:bg-slate-50/60 transition">
                            <td className="p-2.5 font-bold text-slate-900">{pc.campaign}</td>
                            <td className="p-2.5 font-mono font-bold text-[#0A3C75]">{pc.code}</td>
                            <td className="p-2.5 text-right font-bold text-emerald-700 tabular-nums">{pc.discount}</td>
                            <td className="p-2.5 text-slate-600">{pc.validity}</td>
                            <td className="p-2.5 text-right font-bold text-slate-900 tabular-nums">{pc.budget}</td>
                            <td className="p-2.5 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {pc.status}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => handleDeletePromo(pc.id)}
                                className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition"
                                title="Remove promotion"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Card 4: Historical Revenue vs Discount Impact Chart */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#0A3C75]" />
                      5-Year Billed Revenue vs Average Discount Rate (%)
                    </h3>
                    <p className="text-xs text-slate-500">Monitoring top-line growth and discount elasticity</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="w-3 h-3 bg-[#0A3C75] rounded-sm"></span> Revenue (₹ Cr)
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="w-3 h-0.5 bg-emerald-500 border border-emerald-500"></span> Avg Discount (%)
                    </span>
                  </div>
                </div>

                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={discountHistoricalTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748B" }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748B" }} domain={[0, 60]} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#64748B" }} domain={[0, 10]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#06101E",
                          color: "#fff",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar yAxisId="left" dataKey="revenue" fill="#0A3C75" radius={[4, 4, 0, 0]} maxBarSize={32} />
                      <Line yAxisId="right" type="monotone" dataKey="avgDiscount" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Channel Donut, Order Simulation, Approval Card, AI Copilot */}
            <div className="lg:col-span-4 space-y-6">
              {/* Channel Discount Share Donut */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <PieIcon className="w-3.5 h-3.5 text-[#0A3C75]" />
                    Discount Budget Allocation
                  </h4>
                  <span className="text-xs font-bold text-slate-800">₹2.80 Cr Pool</span>
                </div>

                <div className="h-[180px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelDiscountShare}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {channelDiscountShare.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#06101E",
                          color: "#fff",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-base font-black text-slate-900">₹2.80 Cr</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Pool</span>
                  </div>
                </div>

                <div className="space-y-1.5 mt-2">
                  {channelDiscountShare.map((ch, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }}></span>
                        <span className="text-slate-700">{ch.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums">{ch.share}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Realization Simulation Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Tier 3 Order Simulation (80 Units)
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Safe Margin
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Base MSRP per Unit</span>
                    <span className="tabular-nums font-semibold">₹1,50,000</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Applied Slab Discount (8%)</span>
                    <span className="tabular-nums">-₹12,000 / unit</span>
                  </div>
                  <div className="flex justify-between text-slate-800 font-bold pt-1 border-t border-slate-100">
                    <span>Net Selling Price</span>
                    <span className="tabular-nums text-[#0A3C75]">₹1,38,000</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Order Value (80 Units)</span>
                    <span className="tabular-nums font-bold text-slate-900">₹1,10,40,000</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Realized Gross Margin</span>
                    <span className="tabular-nums font-bold text-emerald-700">24.5% (&gt; 20% Floor)</span>
                  </div>
                </div>
              </div>

              {/* Approval Review Card with Actions */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Sign-off & Governance
                  </h4>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {approvalStatus}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase">Assigned Approver</div>
                  <div className="font-bold text-slate-900">Gaurav Nair</div>
                  <div className="text-slate-500 text-[11px]">Commercial Finance Controller</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleApproveFromCard}
                    className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold shadow-xs cursor-pointer transition"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={handleRejectFromCard}
                    className="flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 py-2 rounded-lg text-xs font-bold shadow-xs cursor-pointer transition"
                  >
                    <X className="w-3.5 h-3.5" /> Request Changes
                  </button>
                </div>
              </div>

              {/* AI Copilot Insights */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    AI Margin Guard
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700">Audit Alert</span>
                </div>
                <p className="bg-white p-2.5 rounded-lg border border-emerald-100 text-[11px] text-slate-700 leading-relaxed">
                  Dealers qualifying for Tier 3 (50-99 units) show a 3.4x faster inventory turn and 0 payment default risk.
                  Warning: stacking promotional 5% scheme on Tier 4 would breach the 20% margin floor; automated clamp rule active.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Add Volume Tier / Discount Rule */}
        {isAddRuleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-[#0A3C75]" />
                  <h3 className="text-sm font-bold text-slate-900">Add Discount Volume Tier</h3>
                </div>
                <button
                  onClick={() => setIsAddRuleOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddTier} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Tier / Slab Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tier 5 (Mega Order)"
                      value={newTier.tier}
                      onChange={(e) => setNewTier({ ...newTier, tier: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Quantity Range</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 200+ Units"
                      value={newTier.range}
                      onChange={(e) => setNewTier({ ...newTier, range: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Standard Discount (%)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 12.0%"
                      value={newTier.discount}
                      onChange={(e) => setNewTier({ ...newTier, discount: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Bonus Incentive</label>
                    <input
                      type="text"
                      placeholder="e.g. +1.5% Early Bird"
                      value={newTier.bonus}
                      onChange={(e) => setNewTier({ ...newTier, bonus: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Floor Margin Safe</label>
                    <input
                      type="text"
                      value={newTier.floorMargin}
                      onChange={(e) => setNewTier({ ...newTier, floorMargin: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Discounts exceeding 12.0% require CFO co-authorization under corporate policy.</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddRuleOpen(false)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Slab
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Submit for Approval */}
        {isSubmitApprovalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#0A3C75]" />
                  <h3 className="text-sm font-bold text-slate-900">Submit Policy for Board Approval</h3>
                </div>
                <button
                  onClick={() => setIsSubmitApprovalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  You are submitting Discount Policy <span className="font-bold text-slate-900">DISC-2026-001 ({version})</span> with{" "}
                  <span className="font-bold text-slate-900">{volumeTiers.length} volume slabs</span> and{" "}
                  <span className="font-bold text-slate-900">{channelRules.length} channel rules</span> to Commercial Governance.
                </p>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex justify-between text-slate-700">
                    <span>Discount Pool Budget:</span>
                    <span className="font-bold text-slate-900">₹75.00 Lakhs</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Protected Margin Floor:</span>
                    <span className="font-bold text-emerald-700">20.0% Minimum</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Discount Governance Sign-off:</span>
                    <span className="font-semibold text-slate-900 text-right">Sanjay Hegde (VP Channels) &amp; Gaurav Nair (Finance Controller)</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsSubmitApprovalOpen(false)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmApproval}
                    className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 font-semibold flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve & Sign Off
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AppShell>
    );
  }
