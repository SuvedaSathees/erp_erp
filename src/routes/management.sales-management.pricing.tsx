import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Tag,
  Printer,
  Save,
  Send,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Percent,
  DollarSign,
  PieChart as PieIcon,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Award,
  AlertCircle,
  Search,
  Plus,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { SalesManagementTabBar } from "@/components/erp/SalesManagementTabBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/sales-management/pricing"
)({
  head: () => ({
    meta: [
      { title: "Pricing Management · Sales Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Define. Optimize. Grow. — Enterprise Pricing Engine, Cost Build-up, Margin Controls & Dynamic Price Simulation",
      },
    ],
  }),
  component: PricingComponent,
});

const initialStepperStages = [
  { id: 1, title: "Cost Build-up", status: "completed" },
  { id: 2, title: "Margin Rules", status: "completed" },
  { id: 3, title: "Simulation", status: "completed" },
  { id: 4, title: "Commercial Review", status: "current" },
  { id: 5, title: "Approved", status: "pending" },
  { id: 6, title: "Published", status: "pending" },
];

const costBreakdownData = [
  { name: "Raw Materials & Electronics", value: 75000, share: "71.4%", color: "#0A3C75" },
  { name: "Direct Assembly Labor", value: 10000, share: "9.5%", color: "#22C55E" },
  { name: "Manufacturing Overhead", value: 8000, share: "7.6%", color: "#0284C7" },
  { name: "Packaging & Logistics", value: 5000, share: "4.8%", color: "#F59E0B" },
  { name: "Warranty & Reserves", value: 4000, share: "3.8%", color: "#6366F1" },
  { name: "Quality Certification", value: 3000, share: "2.9%", color: "#EC4899" },
];

const initialProductPricings = [
  {
    id: 1,
    code: "EV-W-7KW",
    name: "Autonomous W-EVSE 7kW AC Smart Charger",
    category: "AC Charging",
    baseCost: 105000,
    markup: "42.8%",
    msrp: 150000,
    floorPrice: 131250,
    margin: "30.0%",
  },
  {
    id: 2,
    code: "EV-W-11KW",
    name: "Autonomous W-EVSE 11kW AC Dual Port",
    category: "AC Charging",
    baseCost: 135000,
    markup: "44.4%",
    msrp: 195000,
    floorPrice: 168750,
    margin: "30.8%",
  },
  {
    id: 3,
    code: "SRV-INST-01",
    name: "Turnkey Site Commissioning & Installation",
    category: "Services",
    baseCost: 9000,
    markup: "66.7%",
    msrp: 15000,
    floorPrice: 12000,
    margin: "40.0%",
  },
  {
    id: 4,
    code: "ACC-MOUNT-01",
    name: "Stainless Steel Bollard & RFID Mounting Kit",
    category: "Accessories",
    baseCost: 6500,
    markup: "53.8%",
    msrp: 10000,
    floorPrice: 8000,
    margin: "35.0%",
  },
];

const channelPricingMatrix = [
  { channel: "Direct Enterprise / Fleet", discFromMSRP: "0%", unitPrice: "₹1,50,000", partnerMargin: "—" },
  { channel: "Authorized Dealer", discFromMSRP: "18%", unitPrice: "₹1,23,000", partnerMargin: "18.0%" },
  { channel: "Master Distributor", discFromMSRP: "25%", unitPrice: "₹1,12,500", partnerMargin: "25.0%" },
  { channel: "Government / GeM Portal", discFromMSRP: "15%", unitPrice: "₹1,27,500", partnerMargin: "Rate Contract" },
];

export default function PricingComponent() {
  const [selectedScenario, setSelectedScenario] = useState("base");
  const [stepperStages, setStepperStages] = useState(initialStepperStages);
  const [status, setStatus] = useState("In Commercial Review");
  const [version, setVersion] = useState("v2.4");
  const [products, setProducts] = useState(initialProductPricings);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modals
  const [isAddSkuOpen, setIsAddSkuOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [newSku, setNewSku] = useState({
    code: "",
    name: "",
    category: "AC Charging",
    baseCost: 120000,
    markup: "40.0%",
    msrp: 168000,
    floorPrice: 145000,
  });

  const simulationScenarios: Record<string, { price: string; volume: string; revenue: string; margin: string; profit: string }> = {
    discount5: { price: "₹1,42,500", volume: "110 Units (+10%)", revenue: "₹1.5675 Cr", margin: "26.3%", profit: "₹41.25 L" },
    base: { price: "₹1,50,000", volume: "100 Units (Base)", revenue: "₹1.5000 Cr", margin: "30.0%", profit: "₹45.00 L" },
    premium5: { price: "₹1,57,500", volume: "92 Units (-8%)", revenue: "₹1.4490 Cr", margin: "33.3%", profit: "₹48.30 L" },
  };

  const sim = simulationScenarios[selectedScenario];

  const handlePrint = () => {
    toast.success("Generating formal Price List PDF document for export/printing...");
    window.print();
  };

  const handleSave = () => {
    const nextVer = version === "v2.4" ? "v2.5" : "v2.6";
    setVersion(nextVer);
    toast.success(`Price List PL-2026-001 updated and saved as ${nextVer}!`);
  };

  const handleConfirmApproval = () => {
    setStatus("Approved & Active");
    setStepperStages((prev) =>
      prev.map((s) =>
        s.id === 4 ? { ...s, status: "completed" } : s.id === 5 ? { ...s, status: "completed" } : s.id === 6 ? { ...s, status: "current" } : s
      )
    );
    setIsApprovalOpen(false);
    toast.success("Price List approved by Commercial Board! Ready for publication.");
  };

  const handleAddSku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku.code || !newSku.name) {
      toast.error("Please fill in Code and Product Name");
      return;
    }
    const marginCalc = (((newSku.msrp - newSku.baseCost) / newSku.msrp) * 100).toFixed(1) + "%";
    const item = {
      id: Date.now(),
      ...newSku,
      margin: marginCalc,
    };
    setProducts((prev) => [item, ...prev]);
    setIsAddSkuOpen(false);
    setNewSku({
      code: "",
      name: "",
      category: "AC Charging",
      baseCost: 120000,
      markup: "40.0%",
      msrp: 168000,
      floorPrice: 145000,
    });
    toast.success(`Added SKU ${item.code} - ${item.name} to pricing schedule!`);
  };

  const handleDeleteSku = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.info("Product SKU removed from price list.");
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppShell
      title="Pricing Management"
      breadcrumb="Management > Sales Management > Pricing"
      description="Define. Optimize. Grow. — Enterprise Pricing Engine, Cost Build-up, Margin Controls & Dynamic Price Simulation"
      tabs={<SalesManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen space-y-4 pb-12">
        {/* Top Header Card with Integrated Stepper */}
        <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#0A3C75]/10 flex items-center justify-center text-[#0A3C75] shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">Pricing Management</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 shrink-0">
                    {status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
                    PL-2026-001
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    {version}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  Define. Optimize. Grow. — Enterprise Pricing Engine, Cost Build-up, Margin Controls & Dynamic Price Simulation
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 flex-nowrap">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Price List
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" /> Save Version
              </button>
              <button
                onClick={() => setIsApprovalOpen(true)}
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

        {/* General / Pricing Details Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Header Card, Objectives, Product Table, Simulation */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Header Policy */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#0A3C75]" />
                    Price List Information & Governance
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Version 2.4 (Approved)
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Price List Name</span>
                    <span className="font-bold text-slate-800">Domestic EVSE Price List FY26</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Pricing Code</span>
                    <span className="font-bold text-slate-800 font-mono">PL-2026-001</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Pricing Strategy</span>
                    <span className="font-bold text-[#0A3C75]">Cost-Plus + Value Tiering</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Currency</span>
                    <span className="font-bold text-slate-800">INR (₹)</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Effective From</span>
                    <span className="font-bold text-slate-800">01-Apr-2026</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Valid Until</span>
                    <span className="font-bold text-slate-800">31-Mar-2027</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Floor Margin Protected</span>
                    <span className="font-bold text-rose-600">20.0% Hard Floor</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tax Applicability</span>
                    <span className="font-bold text-slate-800">GST 18% Extra as Applicable</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Commercial Objectives */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Strategic Pricing Objectives (FY 2026-27)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Target Revenue</span>
                    <span className="text-base font-bold text-slate-900 tabular-nums">₹50.00 Cr</span>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Top-line focus</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Target Gross Margin</span>
                    <span className="text-base font-bold text-slate-900 tabular-nums">30.0%</span>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Protected bottom-line</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Volume Target</span>
                    <span className="text-base font-bold text-slate-900 tabular-nums">3,500 Units</span>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">AC & DC Chargers</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Market Share</span>
                    <span className="text-base font-bold text-slate-900 tabular-nums">10.0%</span>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">South & West India</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Base Products & Pricing Table */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#0A3C75]" />
                      Standard Product MSRP & Margin Schedule
                    </h3>
                    <p className="text-xs text-slate-500">Live bill of materials, markups, MSRP and minimum floor price guardrails</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      {filteredProducts.length} Active SKUs
                    </span>
                    <button
                      onClick={() => setIsAddSkuOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] cursor-pointer shadow-xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add SKU
                    </button>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search SKU code or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                    {["All", "AC Charging", "Services", "Accessories"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition whitespace-nowrap",
                          categoryFilter === cat
                            ? "bg-[#0A3C75] text-white font-semibold"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                        <th className="p-2.5">Code</th>
                        <th className="p-2.5">Product Name & Category</th>
                        <th className="p-2.5 text-right">Mfg Base Cost</th>
                        <th className="p-2.5 text-right">Markup %</th>
                        <th className="p-2.5 text-right">MSRP Selling Price</th>
                        <th className="p-2.5 text-right">Floor Price</th>
                        <th className="p-2.5 text-right">Target Margin</th>
                        <th className="p-2.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-slate-400">
                            No products match your search or filter.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((p) => (
                          <tr key={p.code} className="hover:bg-slate-50/60 transition">
                            <td className="p-2.5 font-mono text-[11px] font-bold text-slate-600">{p.code}</td>
                            <td className="p-2.5">
                              <div className="font-bold text-slate-900">{p.name}</div>
                              <span className="text-[10px] text-slate-400">{p.category}</span>
                            </td>
                            <td className="p-2.5 text-right tabular-nums text-slate-600 font-medium">
                              ₹{p.baseCost.toLocaleString("en-IN")}
                            </td>
                            <td className="p-2.5 text-right text-slate-700 font-semibold">{p.markup}</td>
                            <td className="p-2.5 text-right tabular-nums font-bold text-[#0A3C75]">
                              ₹{p.msrp.toLocaleString("en-IN")}
                            </td>
                            <td className="p-2.5 text-right tabular-nums text-rose-700 font-semibold">
                              ₹{p.floorPrice.toLocaleString("en-IN")}
                            </td>
                            <td className="p-2.5 text-right">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {p.margin}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => handleDeleteSku(p.id)}
                                className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition"
                                title="Remove SKU"
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

              {/* Card 4: Interactive Price Simulation Engine */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#0A3C75]" />
                      Interactive Price Elasticity & Profit Simulation
                    </h3>
                    <p className="text-xs text-slate-500">Test price variation impact on volume, revenue and gross margins</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
                    <button
                      onClick={() => setSelectedScenario("discount5")}
                      className={`px-3 py-1 rounded font-semibold transition ${
                        selectedScenario === "discount5"
                          ? "bg-white text-[#0A3C75] shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      -5% Price (High Vol)
                    </button>
                    <button
                      onClick={() => setSelectedScenario("base")}
                      className={`px-3 py-1 rounded font-semibold transition ${
                        selectedScenario === "base"
                          ? "bg-white text-[#0A3C75] shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Base Case (₹1.50L)
                    </button>
                    <button
                      onClick={() => setSelectedScenario("premium5")}
                      className={`px-3 py-1 rounded font-semibold transition ${
                        selectedScenario === "premium5"
                          ? "bg-white text-[#0A3C75] shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      +5% Price (Premium)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Simulated Price</span>
                    <span className="text-base font-black text-slate-900 tabular-nums">{sim.price}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Expected Volume</span>
                    <span className="text-sm font-bold text-slate-800">{sim.volume}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Projected Revenue</span>
                    <span className="text-base font-black text-[#0A3C75] tabular-nums">{sim.revenue}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Realized Margin</span>
                    <span className="text-sm font-bold text-emerald-600">{sim.margin}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Gross Profit</span>
                    <span className="text-base font-black text-slate-900 tabular-nums">{sim.profit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Cost Build-up Donut, Channel Pricing, Approvals, AI */}
            <div className="lg:col-span-4 space-y-6">
              {/* Cost Build-up Donut */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <PieIcon className="w-3.5 h-3.5 text-[#0A3C75]" />
                    Cost Build-up (W-EVSE 7kW)
                  </h4>
                  <span className="text-xs font-bold text-slate-800">₹1,05,000 Total</span>
                </div>

                <div className="h-[180px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {costBreakdownData.map((entry, index) => (
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
                    <span className="text-base font-black text-slate-900">₹1.05 L</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Mfg Cost</span>
                  </div>
                </div>

                <div className="space-y-1.5 mt-2">
                  {costBreakdownData.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                        <span className="text-slate-700">{c.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums">{c.share}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channel Pricing Matrix */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Channel Price Matrix (7kW)
                  </h4>
                  <span className="text-[10px] text-slate-400">Authorized Tiers</span>
                </div>

                <div className="space-y-2 text-xs">
                  {channelPricingMatrix.map((ch, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{ch.channel}</div>
                        <div className="text-[10px] text-slate-500">MSRP Discount: {ch.discFromMSRP}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#0A3C75] tabular-nums">{ch.unitPrice}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">{ch.partnerMargin}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approvals Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Governance & Sign-offs
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-bold text-slate-900">Product Line Manager</div>
                        <div className="text-[10px] text-slate-500">Vikram S. • 15-Mar-2026</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      Approved
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-bold text-slate-900">Head of Commercial Sales</div>
                        <div className="text-[10px] text-slate-500">Ananya Sen • 18-Mar-2026</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      Approved
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-bold text-slate-900">Chief Financial Officer (CFO)</div>
                        <div className="text-[10px] text-slate-500">R. Balasubramanian • 20-Mar-2026</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      Released
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Pricing Copilot */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    AI Pricing Intelligence
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700">Live Signals</span>
                </div>
                <p className="bg-white p-2.5 rounded-lg border border-emerald-100 text-[11px] text-slate-700 leading-relaxed">
                  Power relay component deflation (-4.2%) expands current margin buffer by 1.1%. Recommend maintaining
                  MSRP while introducing tactical 2% rebates for orders &gt;50 units to accelerate market share.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Add SKU */}
        {isAddSkuOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#0A3C75]" />
                  <h3 className="text-sm font-bold text-slate-900">Add Product SKU to Price Schedule</h3>
                </div>
                <button
                  onClick={() => setIsAddSkuOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSku} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">SKU Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EV-DC-30KW"
                      value={newSku.code}
                      onChange={(e) => setNewSku({ ...newSku, code: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Category</label>
                    <select
                      value={newSku.category}
                      onChange={(e) => setNewSku({ ...newSku, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    >
                      <option value="AC Charging">AC Charging</option>
                      <option value="DC Fast">DC Fast</option>
                      <option value="Services">Services</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Product Description / Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Commercial DC Fast Charger 30kW Dual CCS2"
                    value={newSku.name}
                    onChange={(e) => setNewSku({ ...newSku, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Mfg Base Cost (₹)</label>
                    <input
                      type="number"
                      required
                      value={newSku.baseCost}
                      onChange={(e) => setNewSku({ ...newSku, baseCost: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">MSRP Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newSku.msrp}
                      onChange={(e) => setNewSku({ ...newSku, msrp: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Floor Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newSku.floorPrice}
                      onChange={(e) => setNewSku({ ...newSku, floorPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                  <span>Calculated Target Margin:</span>
                  <span className="font-bold text-sm">
                    {(((newSku.msrp - newSku.baseCost) / (newSku.msrp || 1)) * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddSkuOpen(false)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save SKU
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Approval */}
        {isApprovalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#0A3C75]" />
                  <h3 className="text-sm font-bold text-slate-900">Submit Price List for Sign-off</h3>
                </div>
                <button
                  onClick={() => setIsApprovalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  You are submitting Price List <span className="font-bold text-slate-900">PL-2026-001 (v2.4)</span> containing{" "}
                  <span className="font-bold text-slate-900">{products.length} active SKUs</span> to the Commercial Pricing Committee.
                </p>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex justify-between text-slate-700">
                    <span>Target Gross Margin:</span>
                    <span className="font-bold text-emerald-700">30.0% protected</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Hard Floor Threshold:</span>
                    <span className="font-bold text-rose-700">20.0% Hard Floor</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Pricing Committee Reviewers:</span>
                    <span className="font-semibold text-slate-900 text-right">Ananya Roy (CMO) &amp; Kavita Krishnan (VP Pricing)</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsApprovalOpen(false)}
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
