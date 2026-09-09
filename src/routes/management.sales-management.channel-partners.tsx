import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Users,
  Printer,
  Save,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  Award,
  DollarSign,
  TrendingUp,
  MapPin,
  FileText,
  Phone,
  Mail,
  UserCheck,
  Package,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { SalesManagementTabBar } from "@/components/erp/SalesManagementTabBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/sales-management/channel-partners"
)({
  head: () => ({
    meta: [
      { title: "Channel Partners · Sales Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Build Together. Charge the Future. — Partner Recruitment, Authorization, Target Quotas, Performance & Incentive Settlement",
      },
    ],
  }),
  component: ChannelPartnersComponent,
});

const partnerTrend = [
  { quarter: "Q1 FY26", actual: 0.92, target: 1.0 },
  { quarter: "Q2 FY26", actual: 1.14, target: 1.1 },
  { quarter: "Q3 FY26", actual: 1.05, target: 1.15 },
  { quarter: "Q4 FY26 (P)", actual: 1.28, target: 1.25 },
];

const partnerNetworkDonut = [
  { name: "Active Gold/Silver", value: 28, share: "58%", color: "#0A3C75" },
  { name: "Onboarding Stage", value: 6, share: "13%", color: "#22C55E" },
  { name: "Under Review", value: 5, share: "10%", color: "#0284C7" },
  { name: "Compliance Hold", value: 4, share: "8%", color: "#F59E0B" },
  { name: "Prospective", value: 5, share: "11%", color: "#6366F1" },
];

const initialPartnerProducts = [
  {
    id: 1,
    code: "EV-W-7KW",
    line: "W-EVSE 7kW AC Smart Charger",
    discount: "18.0%",
    margin: "30.0%",
    quota: 180,
    billed: 142,
    ach: "78.9%",
    status: "Optimal",
  },
  {
    id: 2,
    code: "EV-W-11KW",
    line: "W-EVSE 11kW AC Dual Port",
    discount: "20.0%",
    margin: "30.8%",
    quota: 80,
    billed: 68,
    ach: "85.0%",
    status: "Optimal",
  },
  {
    id: 3,
    code: "DC-FAST-30KW",
    line: "30kW Commercial DC Fast Charger",
    discount: "15.0%",
    margin: "32.5%",
    quota: 35,
    billed: 22,
    ach: "62.8%",
    status: "Healthy",
  },
  {
    id: 4,
    code: "SRV-AMC-01",
    line: "Annual Maintenance & Field SLA",
    discount: "22.0%",
    margin: "45.0%",
    quota: 150,
    billed: 110,
    ach: "73.3%",
    status: "Optimal",
  },
];

const initialStepperStages = [
  { id: 1, title: "Prospect", status: "completed" },
  { id: 2, title: "Due Diligence", status: "completed" },
  { id: 3, title: "Approval", status: "completed" },
  { id: 4, title: "Onboarding", status: "completed" },
  { id: 5, title: "Training & Cert.", status: "completed" },
  { id: 6, title: "Commercial Launch", status: "completed" },
  { id: 7, title: "Active Operations", status: "current" },
];

export default function ChannelPartnersComponent() {
  const [products, setProducts] = useState(initialPartnerProducts);
  const [stepperStages, setStepperStages] = useState(initialStepperStages);
  const [version, setVersion] = useState("v1.0");
  const [partnerStatus, setPartnerStatus] = useState("Active Partner");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [newProd, setNewProd] = useState({
    code: "EV-DC-60KW",
    line: "Commercial Ultra-Fast 60kW DC Dual Gun",
    discount: "14.0%",
    margin: "28.0%",
    quota: 25,
    billed: 0,
  });

  const handlePrint = () => {
    toast.success("Printing Channel Partner Profile & Compliance Dossier...");
    window.print();
  };

  const handleSave = () => {
    const nextVer = version === "v1.0" ? "v1.1" : "v1.2";
    setVersion(nextVer);
    toast.success(`Partner Record PART-2026-001 updated and saved as ${nextVer}!`);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: Date.now(),
      code: newProd.code,
      line: newProd.line,
      discount: newProd.discount,
      margin: newProd.margin,
      quota: newProd.quota,
      billed: newProd.billed,
      ach: "0.0%",
      status: "Onboarding",
    };
    setProducts((prev) => [...prev, item]);
    setIsAddProductOpen(false);
    toast.success(`Authorized SKU ${item.code} added to partner catalog!`);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.info("Product de-authorized for this partner.");
  };

  const handleAllocateStock = (e: React.FormEvent) => {
    e.preventDefault();
    setIsStockModalOpen(false);
    toast.success("Buffer stock allocation request sent to Bangalore Central Warehouse!");
  };

  const filteredProducts = products.filter(
    (p) =>
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.line.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell
      title="Channel Partner Management"
      breadcrumb="Management > Sales Management > Channel Partners"
      description="Build Together. Charge the Future. — Partner Recruitment, Authorization, Target Quotas, Performance & Incentive Settlement"
      tabs={<SalesManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen space-y-4 pb-12">
        {/* Top Header Card with Integrated Stepper */}
        <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#0A3C75]/10 flex items-center justify-center text-[#0A3C75] shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">Channel Partner Management</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 shrink-0">
                    {partnerStatus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
                    PART-2026-001
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    {version}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  Build Together. Charge the Future. — Partner Recruitment, Authorization, Target Quotas, Performance & Incentive Settlement
                </p>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2 shrink-0 flex-nowrap">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Dossier
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" /> Save Record
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
            {/* Left 8 Cols: Identity, Territory Operations, Authorized Products, Performance Trend */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Partner Identity */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0A3C75]" />
                    Authorized Partner Profile
                  </h3>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    Gold Tier Partner
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Partner Legal Name</span>
                    <span className="font-bold text-slate-800">VoltPlus Technologies Pvt. Ltd.</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Partner Code</span>
                    <span className="font-bold text-slate-800 font-mono">PART-2026-001</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Partner Model</span>
                    <span className="font-bold text-[#0A3C75]">Master Value-Added Distributor</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Agreement Reference</span>
                    <span className="font-bold text-[#0A3C75] hover:underline cursor-pointer">
                      CON-2026-001
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Authorized Territory</span>
                    <span className="font-bold text-slate-800">Tamil Nadu (South Region)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Credit Limit Approved</span>
                    <span className="font-bold text-slate-800 tabular-nums">₹75.00 Lakhs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Credit Utilization</span>
                    <span className="font-bold text-emerald-600 tabular-nums">₹32.40 L (43.2%)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Payment Terms</span>
                    <span className="font-bold text-slate-800">30 Days Open Account</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Coverage & Operations */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Territory Operations & Infrastructure Capacity
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Geographic Scope</span>
                    <span className="text-sm font-bold text-slate-900">12 Districts</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">28 Major Cities</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Central Depot</span>
                    <span className="text-sm font-bold text-slate-900">Ambattur Hub</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">15,000 sq.ft buffer</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Certified Engineers</span>
                    <span className="text-sm font-bold text-slate-900">18 Field Techs</span>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Magnertia Level-2</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Experience Hubs</span>
                    <span className="text-sm font-bold text-slate-900">3 Showrooms</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Chennai, Cbe, Madurai</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Authorized Products Table */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#0A3C75]" />
                      Authorized Products & Annual Quota Realization
                    </h3>
                    <p className="text-xs text-slate-500">Authorized SKUs, commercial discounts, distributor quotas and YTD pacing</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 font-semibold bg-slate-100 px-2.5 py-1 rounded-md">
                      {filteredProducts.length} SKUs Authorized
                    </span>
                    <button
                      onClick={() => setIsAddProductOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] cursor-pointer shadow-xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Authorize SKU
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative pt-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search authorized SKU code or product line..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-80 pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                        <th className="p-2.5">Code</th>
                        <th className="p-2.5">Product Line Description</th>
                        <th className="p-2.5 text-right">Partner Disc</th>
                        <th className="p-2.5 text-center">Annual Quota</th>
                        <th className="p-2.5 text-center">Billed YTD</th>
                        <th className="p-2.5 text-right">Ach.%</th>
                        <th className="p-2.5 text-center">Status</th>
                        <th className="p-2.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-slate-400">
                            No authorized products match your search.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/60 transition">
                            <td className="p-2.5 font-mono text-[11px] font-bold text-slate-600">{p.code}</td>
                            <td className="p-2.5 font-bold text-slate-900">{p.line}</td>
                            <td className="p-2.5 text-right font-semibold text-[#0A3C75]">{p.discount}</td>
                            <td className="p-2.5 text-center font-bold text-slate-700">{p.quota}</td>
                            <td className="p-2.5 text-center font-bold text-slate-900">{p.billed}</td>
                            <td className="p-2.5 text-right font-bold text-emerald-700">{p.ach}</td>
                            <td className="p-2.5 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {p.status}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition"
                                title="Remove SKU authorization"
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

              {/* Card 4: Quarterly Performance Chart */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#0A3C75]" />
                      Quarterly Revenue Realization vs Quota Target (₹ Cr)
                    </h3>
                    <p className="text-xs text-slate-500">Evaluating distributor run-rate and commercial pacing</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="w-3 h-3 bg-[#0A3C75] rounded-sm"></span> Billed Revenue
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="w-3 h-0.5 bg-emerald-500 border border-emerald-500"></span> Quota Target
                    </span>
                  </div>
                </div>

                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={partnerTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: "#64748B" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#64748B" }} domain={[0, 1.6]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#06101E",
                          color: "#fff",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="actual" fill="#0A3C75" radius={[4, 4, 0, 0]} maxBarSize={36} />
                      <Line type="monotone" dataKey="target" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Executive Scorecard, Status Donut, AI Insights, Actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Executive Scorecard */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Partner Scorecard (YTD)
                  </h4>
                  <span className="text-[10px] font-bold text-[#0A3C75] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Tier 1 VAD
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-slate-600">YTD Revenue Achieved</span>
                    <span className="text-sm font-bold text-[#0A3C75] tabular-nums">₹3.80 Cr / ₹4.50 Cr</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-slate-600">Total Chargers Installed</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">232 Units</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-slate-600">Sub-dealer Network</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">28 Dealers Active</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/60 border border-emerald-200">
                    <span className="text-emerald-800 font-medium">Customer CSAT Rating</span>
                    <span className="text-sm font-black text-emerald-700 tabular-nums">4.8 / 5.0</span>
                  </div>
                </div>
              </div>

              {/* Partner Network Donut */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Magnertia Channel Network
                  </h4>
                  <span className="text-xs font-bold text-slate-800">48 Partners</span>
                </div>

                <div className="h-[180px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={partnerNetworkDonut}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {partnerNetworkDonut.map((entry, index) => (
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
                    <span className="text-base font-black text-slate-900">48</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Partners</span>
                  </div>
                </div>

                <div className="space-y-1.5 mt-2">
                  {partnerNetworkDonut.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
                        <span className="text-slate-700">{p.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums">{p.share}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Partner Insights */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    AI Partner Intelligence
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700">High Performer</span>
                </div>
                <p className="bg-white p-2.5 rounded-lg border border-emerald-100 text-[11px] text-slate-700 leading-relaxed">
                  VoltPlus achieved 105% quota in Coimbatore industrial cluster. Recommend releasing Gold Tier 2% bonus rebate.
                  Action: Technician recertification due next month for 4 engineers.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Partner Actions</h4>
                <button
                  onClick={() => setIsStockModalOpen(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-[#0A3C75] hover:bg-slate-50 transition text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-[#0A3C75]" />
                    Allocate Consignment Stock Buffer
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => toast.success("Incentive Statement #INS-2026-Q1 issued to VoltPlus Mobility. Transferred ₹3,40,000 via RTGS.")}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-slate-50 transition text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    Issue Incentive Payout Statement
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
      </div>

      {/* Authorize SKU Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-[#0A3C75] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Authorize SKU for Partner</h3>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">SKU Code</label>
                <input
                  type="text"
                  required
                  value={newProd.code}
                  onChange={(e) => setNewProd({ ...newProd, code: e.target.value })}
                  placeholder="e.g. EV-DC-120KW"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product Description / Line</label>
                <input
                  type="text"
                  required
                  value={newProd.line}
                  onChange={(e) => setNewProd({ ...newProd, line: e.target.value })}
                  placeholder="e.g. High-Power Dual Gun HyperCharger"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Partner Discount %</label>
                  <input
                    type="text"
                    required
                    value={newProd.discount}
                    onChange={(e) => setNewProd({ ...newProd, discount: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Margin %</label>
                  <input
                    type="text"
                    required
                    value={newProd.margin}
                    onChange={(e) => setNewProd({ ...newProd, margin: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Annual Quota (Units)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProd.quota}
                    onChange={(e) => setNewProd({ ...newProd, quota: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Initial Billed Units</label>
                  <input
                    type="number"
                    min="0"
                    value={newProd.billed}
                    onChange={(e) => setNewProd({ ...newProd, billed: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#0A3C75] text-white rounded-lg hover:bg-[#0A3C75]/90 transition shadow-sm"
                >
                  Authorize SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocate Stock Modal */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-[#0A3C75] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Allocate Consignment Stock Buffer</h3>
              </div>
              <button
                onClick={() => setIsStockModalOpen(false)}
                className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAllocateStock} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Channel Partner</label>
                <input
                  type="text"
                  readOnly
                  value="VoltPlus Mobility Solutions Pvt Ltd (PART-2026-001)"
                  className="w-full text-xs px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fulfillment Warehouse Depot</label>
                <select className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]">
                  <option>Bangalore Central Distribution Hub (Karnataka)</option>
                  <option>Chennai Regional Logistics Depot (Tamil Nadu)</option>
                  <option>Coimbatore Rapid Transit Depot (Tamil Nadu)</option>
                  <option>Hyderabad Hub (Telangana)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Line</label>
                  <select className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]">
                    <option>AC Chargers (7.4kW / 11kW / 22kW)</option>
                    <option>DC Fast Chargers (30kW / 60kW)</option>
                    <option>RFID & Smart Meter Kits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Buffer Units to Dispatch</label>
                  <input
                    type="number"
                    defaultValue={15}
                    min={1}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
                Stock will be reserved under consignment terms with 45-day credit period and auto-replenishment threshold at 20% quota remaining.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#0A3C75] text-white rounded-lg hover:bg-[#0A3C75]/90 transition shadow-sm"
                >
                  Dispatch Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
