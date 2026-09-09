import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Award,
  Printer,
  RefreshCw,
  Send,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  Users,
  Target,
  FileText,
  DollarSign,
  TrendingUp,
  User,
  CreditCard,
  FileSpreadsheet,
  AlertCircle,
  Plus,
  Trash2,
  Search,
  X,
  Check,
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
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { SalesManagementTabBar } from "@/components/erp/SalesManagementTabBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/sales-management/sales-commission"
)({
  head: () => ({
    meta: [
      { title: "Sales Commission · Magnertia ERP" },
      {
        name: "description",
        content:
          "Reward Performance. Drive Growth. — Quota Realization, Tiered Incentives, Collection Recovery & Commission Payroll Settlement",
      },
    ],
  }),
  component: SalesCommissionComponent,
});

const monthlyCommissionTrend = [
  { month: "Apr", payout: 26.5, ach: 95 },
  { month: "May", payout: 29.0, ach: 102 },
  { month: "Jun", payout: 34.2, ach: 114 },
  { month: "Jul", payout: 28.0, ach: 98 },
  { month: "Aug", payout: 35.5, ach: 118 },
  { month: "Sep", payout: 33.0, ach: 110.4 },
];

const initialTransactions = [
  {
    id: 1,
    invNo: "INV-2026-0089",
    customer: "Greentech Mobility Solutions",
    date: "08-Sep-2026",
    netSales: 1698000,
    rate: "1.5%",
    commission: 25470,
    status: "Verified",
  },
  {
    id: 2,
    invNo: "INV-2026-0094",
    customer: "SunPower Infra Mobility",
    date: "14-Sep-2026",
    netSales: 1140000,
    rate: "1.5%",
    commission: 17100,
    status: "Verified",
  },
  {
    id: 3,
    invNo: "INV-2026-0102",
    customer: "Apex EV Charging Hubs",
    date: "22-Sep-2026",
    netSales: 780000,
    rate: "1.5%",
    commission: 11700,
    status: "Verified",
  },
  {
    id: 4,
    invNo: "INV-2026-0115",
    customer: "Metro City Transit Corp",
    date: "28-Sep-2026",
    netSales: 247000,
    rate: "1.5%",
    commission: 3705,
    status: "Verified",
  },
];

const tierStructure = [
  { tier: "Tier 1", quotaRange: "< 80% Quota", rate: "0.75%", bonus: "—", active: false },
  { tier: "Tier 2", quotaRange: "80% - 99.9%", rate: "1.00%", bonus: "—", active: false },
  { tier: "Tier 3", quotaRange: "100% - 119.9%", rate: "1.50%", bonus: "+₹12,500 Bonus", active: true },
  { tier: "Tier 4", quotaRange: "120%+ Quota", rate: "2.00%", bonus: "+₹25,000 Super Bonus", active: false },
];

const initialStepperStages = [
  { id: 1, title: "Data Sync", status: "completed" },
  { id: 2, title: "Commission Calc", status: "completed" },
  { id: 3, title: "Manager Review", status: "current" },
  { id: 4, title: "Finance Review", status: "pending" },
  { id: 5, title: "Approved", status: "pending" },
  { id: 6, title: "Payroll Payout", status: "pending" },
];

export default function SalesCommissionComponent() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [stepperStages, setStepperStages] = useState(initialStepperStages);
  const [version, setVersion] = useState("v1.0");
  const [commissionStatus, setCommissionStatus] = useState("Calculated (Review Pending)");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Modals
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isSubmitReviewOpen, setIsSubmitReviewOpen] = useState(false);

  // New Transaction Form
  const [newTx, setNewTx] = useState({
    invNo: "INV-2026-0128",
    customer: "ChargeZone Fleet Infrastructure",
    date: "30-Sep-2026",
    netSales: 350000,
    rate: "1.5%",
  });

  // Dynamic Calculations
  const totalNetSales = transactions.reduce((sum, t) => sum + t.netSales, 0);
  const totalBaseCommission = transactions.reduce((sum, t) => sum + t.commission, 0);
  const quotaTarget = 3500000;
  const achievementPct = ((totalNetSales / quotaTarget) * 100).toFixed(1);
  const overachievementBonus = totalNetSales >= quotaTarget ? 12500 : 0;
  const newAccountBonus = 8000;
  const grossEarned = totalBaseCommission + overachievementBonus + newAccountBonus;
  const tdsDeduction = grossEarned * 0.10;
  const netPayable = grossEarned - tdsDeduction;

  const handlePrint = () => {
    toast.success("Printing Official Commission Settlement Slip for Priya Sharma (EMP-001)...");
    window.print();
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      toast.success(
        `Commission Recalculated: Base ₹${totalBaseCommission.toLocaleString("en-IN")} + Accelerators ₹${(
          overachievementBonus + newAccountBonus
        ).toLocaleString("en-IN")} | Net Payable ₹${netPayable.toLocaleString("en-IN")}`
      );
    }, 600);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(newTx.rate) / 100 || 0.015;
    const calcComm = Math.round(newTx.netSales * rateNum);
    const item = {
      id: Date.now(),
      invNo: newTx.invNo,
      customer: newTx.customer,
      date: newTx.date,
      netSales: Number(newTx.netSales),
      rate: newTx.rate,
      commission: calcComm,
      status: "Verified",
    };
    setTransactions((prev) => [...prev, item]);
    setIsAddTxOpen(false);
    toast.success(`Eligible Invoice ${item.invNo} added. Net Commission updated!`);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.info("Invoice excluded from September settlement batch.");
  };

  const handleSubmitForReview = () => {
    setStepperStages((prev) =>
      prev.map((s) =>
        s.id <= 4
          ? { ...s, status: "completed" as const }
          : s.id === 5
          ? { ...s, status: "completed" as const }
          : s.id === 6
          ? { ...s, status: "current" as const }
          : s
      )
    );
    setCommissionStatus("Approved for Payroll Payout");
    setIsSubmitReviewOpen(false);
    toast.success("Commission SCM-2026-09-001 approved by VP & Finance Controller! Dispatched to Payroll Direct Credit.");
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.invNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell
      title="Sales Commission"
      breadcrumb="Management > Sales Management > Sales Commission"
      description="Reward Performance. Drive Growth. — Quota Realization, Tiered Incentives, Collection Recovery & Commission Payroll Settlement"
      tabs={<SalesManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen space-y-4 pb-12">
        {/* Top Header Card with Integrated Stepper */}
        <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0A3C75]/10 flex items-center justify-center text-[#0A3C75]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">Sales Commission</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
                    {commissionStatus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                    SCM-2026-09-001
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {version}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Reward Performance. Drive Growth. — Quota Realization, Tiered Incentives, Collection Recovery & Commission Payroll Settlement
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-nowrap">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition"
              >
                <Printer className="h-3.5 w-3.5 text-slate-500" /> Print Slip
              </button>
              <button
                onClick={handleRecalculate}
                disabled={isRecalculating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition disabled:opacity-50"
              >
                <RefreshCw className={cn("h-3.5 w-3.5 text-slate-500", isRecalculating && "animate-spin text-[#0A3C75]")} />
                {isRecalculating ? "Calculating..." : "Recalculate"}
              </button>
              <button
                onClick={() => setIsSubmitReviewOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] cursor-pointer shadow-xs transition"
              >
                <Send className="h-3.5 w-3.5 text-emerald-400" /> Submit for Review
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

        {/* General Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Beneficiary Profile, Achievement Summary, Transactions, Trend Chart */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Beneficiary Profile */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0A3C75]" />
                    Beneficiary & Settlement Information
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Monthly Payout — Sep 2026
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Sales Executive</span>
                    <span className="font-bold text-slate-800">Priya Sharma</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Employee ID</span>
                    <span className="font-bold text-slate-800 font-mono">EMP-001</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Role / Department</span>
                    <span className="font-bold text-slate-800">Regional Sales Lead</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Territory Covered</span>
                    <span className="font-bold text-[#0A3C75]">Tamil Nadu (South Region)</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Commission Scheme</span>
                    <span className="font-bold text-slate-800">PLAN-EXEC-FY26</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Calculation Date</span>
                    <span className="font-bold text-slate-800">05-Oct-2026</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Reporting Manager</span>
                    <span className="font-bold text-slate-800">Ashwin Sundaram (VP Commercial Sales)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Disbursement Mode</span>
                    <span className="font-bold text-emerald-600">Payroll Direct Credit</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Quota & Target Achievement */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-500" />
                  Performance Scorecard (September 2026)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Revenue Quota</span>
                    <span className="text-sm font-bold text-slate-800">₹35.00 L Target</span>
                    <span className="text-base font-black text-[#0A3C75] block mt-1 tabular-nums">
                      ₹{(totalNetSales / 100000).toFixed(2)} L ({achievementPct}%)
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Unit Sales</span>
                    <span className="text-sm font-bold text-slate-800">16 Target</span>
                    <span className="text-base font-black text-emerald-600 block mt-1 tabular-nums">
                      {transactions.length * 4 + 2} Units ({(((transactions.length * 4 + 2) / 16) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">New Accounts</span>
                    <span className="text-sm font-bold text-slate-800">3 Target</span>
                    <span className="text-base font-black text-emerald-600 block mt-1 tabular-nums">
                      {transactions.length} Accounts ({((transactions.length / 3) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Collection Rate</span>
                    <span className="text-sm font-bold text-slate-800">95% Floor</span>
                    <span className="text-base font-black text-emerald-600 block mt-1 tabular-nums">
                      98.4% Settled
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Eligible Settled Transactions */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#0A3C75]" />
                      Eligible Settled Transactions
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {transactions.length} Invoices Billed & 100% Recovered
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search invoice or customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75] w-48 sm:w-56"
                      />
                    </div>
                    <button
                      onClick={() => setIsAddTxOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#0A3C75] text-white rounded-lg hover:bg-[#0A3C75]/90 transition cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Invoice
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                        <th className="p-2.5">Invoice No</th>
                        <th className="p-2.5">Customer Name</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5 text-right">Net Value</th>
                        <th className="p-2.5 text-right">Rate %</th>
                        <th className="p-2.5 text-right">Base Comm.</th>
                        <th className="p-2.5 text-center">Status</th>
                        <th className="p-2.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-4 text-center text-slate-400 italic">
                            No eligible transactions match your search filter.
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50/60 transition group">
                            <td className="p-2.5 font-mono text-[11px] font-bold text-[#0A3C75]">{t.invNo}</td>
                            <td className="p-2.5 font-bold text-slate-900">{t.customer}</td>
                            <td className="p-2.5 text-slate-600">{t.date}</td>
                            <td className="p-2.5 text-right tabular-nums text-slate-700 font-semibold">
                              ₹{t.netSales.toLocaleString("en-IN")}
                            </td>
                            <td className="p-2.5 text-right font-semibold text-slate-800">{t.rate}</td>
                            <td className="p-2.5 text-right tabular-nums font-bold text-slate-900">
                              ₹{t.commission.toLocaleString("en-IN")}
                            </td>
                            <td className="p-2.5 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {t.status}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => handleDeleteTransaction(t.id)}
                                title="Exclude Transaction"
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card 4: Historical Commission Payout Trend Chart */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#0A3C75]" />
                      6-Month Commission Payouts (₹ '000) vs Quota Achievement (%)
                    </h3>
                    <p className="text-xs text-slate-500">Historical performance payout velocity</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="w-3 h-3 bg-[#0A3C75] rounded-sm"></span> Payout (₹k)
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="w-3 h-0.5 bg-emerald-500 border border-emerald-500"></span> Ach.%
                    </span>
                  </div>
                </div>

                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyCommissionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748B" }} domain={[0, 50]} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#64748B" }} domain={[80, 130]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#06101E",
                          color: "#fff",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar yAxisId="left" dataKey="payout" fill="#0A3C75" radius={[4, 4, 0, 0]} maxBarSize={32} />
                      <Line yAxisId="right" type="monotone" dataKey="ach" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Net Payout Breakdown, Tier Matrix, Approval, AI Copilot */}
            <div className="lg:col-span-4 space-y-6">
              {/* Net Commission Payout Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Commission Settlement Summary
                  </h4>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    September 2026
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Commission (1.5% on ₹{(totalNetSales / 100000).toFixed(2)}L)</span>
                    <span className="tabular-nums font-semibold">₹{totalBaseCommission.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Over-achievement Accelerator (&gt;100%)</span>
                    <span className="tabular-nums">+₹{overachievementBonus.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>New Account Bonus ({transactions.length} Wins)</span>
                    <span className="tabular-nums">+₹{newAccountBonus.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-800 font-bold pt-1.5 border-t border-slate-100">
                    <span>Gross Earned Incentive</span>
                    <span className="tabular-nums">₹{grossEarned.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>TDS Deduction (10% u/s 194H)</span>
                    <span className="tabular-nums font-semibold">-₹{tdsDeduction.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-center bg-slate-50 p-2.5 rounded-lg">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Net Payable Incentive</div>
                      <div className="text-lg font-black text-[#0A3C75] tabular-nums">
                        ₹{netPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Direct Credit
                    </span>
                  </div>
                </div>
              </div>

              {/* Tier Accelerator Matrix */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Tier Structure & Accelerator Slabs
                </h4>
                <div className="space-y-2 text-xs">
                  {tierStructure.map((t) => (
                    <div
                      key={t.tier}
                      className={`p-2.5 rounded-lg border flex items-center justify-between ${
                        t.active
                          ? "bg-blue-50/70 border-[#0A3C75] text-[#0A3C75] ring-1 ring-[#0A3C75]/20 font-bold"
                          : "bg-slate-50 border-slate-200/80 text-slate-700"
                      }`}
                    >
                      <div>
                        <div>{t.tier} ({t.quotaRange})</div>
                        <div className="text-[10px] text-slate-400 font-normal">{t.bonus}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{t.rate}</div>
                        {t.active && (
                          <span className="text-[9px] bg-[#0A3C75] text-white px-1.5 py-0.5 rounded">
                            Current Tier
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Sign-off Tracker */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Multi-Level Sign-off
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-bold text-slate-900">VP Commercial Sales</div>
                        <div className="text-[10px] text-slate-500">Ashwin Sundaram • Approved</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">Done</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 border border-amber-200">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="font-bold text-slate-900">Finance Controller</div>
                        <div className="text-[10px] text-slate-500">Audit Verification In Progress</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700">Active</span>
                  </div>
                </div>
              </div>

              {/* AI Copilot Insights */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    AI Incentive Copilot
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700">Tier 3</span>
                </div>
                <p className="bg-white p-2.5 rounded-lg border border-emerald-100 text-[11px] text-slate-700 leading-relaxed">
                  Priya has billed ₹{(totalNetSales / 100000).toFixed(2)}L against the ₹35.00L quota ({achievementPct}% achievement). All {transactions.length} closed transactions passed credit recovery verification with zero bad debt.
                </p>
              </div>

              {/* Actions */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Commission Actions</h4>
                <button
                  onClick={() => toast.success("Exported SCM-2026-09-001 direct credit batch file (CSV) to SAP Payroll disbursement engine.")}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-[#0A3C75] hover:bg-slate-50 transition text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#0A3C75]" />
                    Export to Payroll Disbursement ERP
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
      </div>

      {/* Add Eligible Invoice Modal */}
      {isAddTxOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-[#0A3C75] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Add Eligible Settled Invoice</h3>
              </div>
              <button
                onClick={() => setIsAddTxOpen(false)}
                className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Invoice Number</label>
                <input
                  type="text"
                  required
                  value={newTx.invNo}
                  onChange={(e) => setNewTx({ ...newTx, invNo: e.target.value })}
                  placeholder="e.g. INV-2026-0128"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Customer / Project Name</label>
                <input
                  type="text"
                  required
                  value={newTx.customer}
                  onChange={(e) => setNewTx({ ...newTx, customer: e.target.value })}
                  placeholder="e.g. ChargeZone Fleet Infrastructure"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Settlement Date</label>
                  <input
                    type="text"
                    required
                    value={newTx.date}
                    onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Commission Rate</label>
                  <input
                    type="text"
                    required
                    value={newTx.rate}
                    onChange={(e) => setNewTx({ ...newTx, rate: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Net Billed Value (₹)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newTx.netSales}
                  onChange={(e) => setNewTx({ ...newTx, netSales: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
                Calculated Base Commission: <strong>₹{Math.round(newTx.netSales * (parseFloat(newTx.rate) / 100 || 0.015)).toLocaleString("en-IN")}</strong>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddTxOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#0A3C75] text-white rounded-lg hover:bg-[#0A3C75]/90 transition shadow-sm cursor-pointer"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit for Review Modal */}
      {isSubmitReviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-[#0A3C75] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Submit Commission for Payroll</h3>
              </div>
              <button
                onClick={() => setIsSubmitReviewOpen(false)}
                className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <p className="leading-relaxed">
                You are submitting the September 2026 sales commission dossier for <strong>Priya Sharma (EMP-001)</strong> for final disbursement sign-off.
              </p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span>Gross Sales Realized:</span>
                  <span className="font-bold text-slate-900">₹{(totalNetSales / 100000).toFixed(2)} Lakhs</span>
                </div>
                <div className="flex justify-between">
                  <span>Gross Commission:</span>
                  <span className="font-bold text-[#0A3C75]">₹{grossEarned.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>TDS Deduction (10%):</span>
                  <span className="font-bold text-rose-600">-₹{tdsDeduction.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 text-sm font-bold text-slate-900">
                  <span>Net Payable Amount:</span>
                  <span className="text-emerald-700">₹{netPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] leading-relaxed">
                Approving advances the workflow to Stage 6 (Payroll Payout) and marks this commission batch ready for bank batch direct credit.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitReviewOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitForReview}
                  className="px-4 py-2 text-xs font-bold bg-[#0A3C75] text-white rounded-lg hover:bg-[#0A3C75]/90 transition shadow-sm cursor-pointer"
                >
                  Approve & Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
