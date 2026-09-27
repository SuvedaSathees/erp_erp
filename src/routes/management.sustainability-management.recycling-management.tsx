// Magnertia ERP - Recycling Management
// Management -> Sustainability Management -> Recycling Management
// Replicated from Screenshot: 6 KPI Cards, Recycling Master Details, Monthly Recycled Material Trend, Recycling Process Flow (Collection -> Segregation -> Sorting -> Processing -> Output), Material Mix Donut, Batches Table, Vendor Scorecard & Circular Economy Impact

import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Recycle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  Plus,
  RefreshCw,
  Download,
  Filter,
  DollarSign,
  Layers,
  ArrowRight,
  ShieldCheck,
  Scale,
  Award,
  Factory,
  Flame,
  Truck,
  Leaf,
  X,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { SustainabilityManagementTabBar } from "@/components/erp/SustainabilityManagementTabBar";
import { SustainabilitySubmoduleHeader } from "@/components/erp/SustainabilitySubmoduleHeader";
import { WidgetBand } from "@/widgets/components/WidgetBand";
import { cn } from "@/lib/utils";

interface RecyclingBatch {
  id: string;
  batchNo: string;
  date: string;
  materialStream: string;
  grossWeightTons: number;
  yieldPct: number;
  processedOutputTons: number;
  outputProduct: string;
  recycledVendor: string;
  economicValue: string;
  status: "Completed" | "In Process" | "Dispatched";
}

const INITIAL_BATCHES: RecyclingBatch[] = [
  {
    id: "b-1",
    batchNo: "RCY-2024-041",
    date: "2026-09-25",
    materialStream: "Aluminum Stamping Scrap",
    grossWeightTons: 18.5,
    yieldPct: 94.2,
    processedOutputTons: 17.4,
    outputProduct: "Secondary Extrusion Billets",
    recycledVendor: "Hindalco Recycling Division",
    economicValue: "₹4,12,000",
    status: "Completed",
  },
  {
    id: "b-2",
    batchNo: "RCY-2024-040",
    date: "2026-09-22",
    materialStream: "High-Density Polyethylene (HDPE)",
    grossWeightTons: 12.0,
    yieldPct: 88.5,
    processedOutputTons: 10.6,
    outputProduct: "Reprocessed Resin Pellets",
    recycledVendor: "Supreme Petrochem Recyclers",
    economicValue: "₹1,85,000",
    status: "Completed",
  },
  {
    id: "b-3",
    batchNo: "RCY-2024-039",
    date: "2026-09-20",
    materialStream: "Copper Bushings & Turnings",
    grossWeightTons: 6.8,
    yieldPct: 96.0,
    processedOutputTons: 6.5,
    outputProduct: "High-Conductivity Wire Rods",
    recycledVendor: "Sterlite Secondary Copper",
    economicValue: "₹4,88,000",
    status: "In Process",
  },
  {
    id: "b-4",
    batchNo: "RCY-2024-038",
    date: "2026-09-17",
    materialStream: "Corrugated Flute Board",
    grossWeightTons: 14.2,
    yieldPct: 91.0,
    processedOutputTons: 12.9,
    outputProduct: "Recycled Kraft Linerboard",
    recycledVendor: "ITC Paper & Packaging",
    economicValue: "₹1,42,000",
    status: "Completed",
  },
  {
    id: "b-5",
    batchNo: "RCY-2024-037",
    date: "2026-09-14",
    materialStream: "Lithium Black Mass Scrap",
    grossWeightTons: 4.5,
    yieldPct: 76.5,
    processedOutputTons: 3.4,
    outputProduct: "Cobalt & Nickel Carbonate Salts",
    recycledVendor: "Attero Advanced Hydromet",
    economicValue: "₹1,95,000",
    status: "Completed",
  },
];

const MONTHLY_RECYCLING_TREND = [
  { month: "Apr", metal: 5.2, plastic: 2.8, paper: 1.8, ewaste: 0.8 },
  { month: "May", metal: 5.6, plastic: 3.0, paper: 1.9, ewaste: 0.9 },
  { month: "Jun", metal: 6.1, plastic: 3.2, paper: 2.1, ewaste: 1.0 },
  { month: "Jul", metal: 5.8, plastic: 3.1, paper: 2.0, ewaste: 0.9 },
  { month: "Aug", metal: 6.4, plastic: 3.4, paper: 2.2, ewaste: 1.1 },
  { month: "Sep", metal: 7.2, plastic: 3.8, paper: 2.4, ewaste: 1.2 },
  { month: "Oct", metal: 6.9, plastic: 3.6, paper: 2.3, ewaste: 1.1 },
  { month: "Nov", metal: 7.6, plastic: 4.0, paper: 2.6, ewaste: 1.3 },
  { month: "Dec", metal: 7.1, plastic: 3.9, paper: 2.5, ewaste: 1.2 },
  { month: "Jan", metal: 7.9, plastic: 4.2, paper: 2.7, ewaste: 1.4 },
  { month: "Feb", metal: 8.2, plastic: 4.4, paper: 2.8, ewaste: 1.4 },
  { month: "Mar", metal: 8.8, plastic: 4.8, paper: 3.0, ewaste: 1.6 },
];

const MATERIAL_MIX = [
  { name: "Metal Scrap", value: 54.2, color: "#2563eb" },
  { name: "Plastic Polymers", value: 36.8, color: "#10b981" },
  { name: "Paper & Cardboard", value: 21.4, color: "#f59e0b" },
  { name: "E-Waste / Battery Mass", value: 13.8, color: "#8b5cf6" },
];

function RecyclingManagementPage() {
  const [selectedPlant, setSelectedPlant] = useState("Gigafactory 1 - Chennai");
  const [reportingYear, setReportingYear] = useState("FY 2024-25");
  const [batches, setBatches] = useState<RecyclingBatch[]>(INITIAL_BATCHES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New batch state
  const [newBatch, setNewBatch] = useState({
    materialStream: "",
    grossWeightTons: "",
    outputProduct: "",
    recycledVendor: "",
    economicValue: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.materialStream || !newBatch.grossWeightTons) {
      showToast("Please provide material stream and weight.");
      return;
    }

    const gross = parseFloat(newBatch.grossWeightTons);
    const created: RecyclingBatch = {
      id: `b-${Date.now()}`,
      batchNo: `RCY-2024-04${batches.length + 1}`,
      date: new Date().toISOString().split("T")[0],
      materialStream: newBatch.materialStream,
      grossWeightTons: gross,
      yieldPct: 88.0,
      processedOutputTons: parseFloat((gross * 0.88).toFixed(1)),
      outputProduct: newBatch.outputProduct || "Secondary Recycled Pellets",
      recycledVendor: newBatch.recycledVendor || "Authorized Circular Partner",
      economicValue: newBatch.economicValue || `₹${Math.round(gross * 25000).toLocaleString()}`,
      status: "In Process",
    };

    setBatches([created, ...batches]);
    setShowAddModal(false);
    setNewBatch({
      materialStream: "",
      grossWeightTons: "",
      outputProduct: "",
      recycledVendor: "",
      economicValue: "",
    });
    showToast(`Batch ${created.batchNo} logged successfully.`);
  };

  return (
    <AppShell
      title="Recycling Management"
      breadcrumb="Management > Sustainability Management > Recycling Management"
      description="Circular economy framework for material segregation, sorting, reprocessing, recovered value economics & certified recycler chain-of-custody."
      tabs={<SustainabilityManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="flex items-center justify-between rounded-xl bg-slate-900 text-white px-4 py-3 text-xs font-semibold shadow-2xl border border-slate-700 animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              {toastMessage}
            </span>
            <button onClick={() => setToastMessage(null)}>
              <X className="h-3.5 w-3.5 text-slate-400 hover:text-white" />
            </button>
          </div>
        )}

        {/* Executive Submodule Header */}
        <SustainabilitySubmoduleHeader
          icon={Recycle}
          title="Recycling Management"
          code="REC-2026-001"
          programName="Circular Materials & Recovery Loop"
          version="v1.0"
          status="Active"
          subtitle="Circular economy framework for material segregation, sorting, reprocessing, recovered value economics & certified recycler chain-of-custody."
          primaryActionLabel="+ Log Recycling Batch"
          onPrimaryAction={() => setShowAddModal(true)}
          onGenerateReport={() => showToast("Exporting Circular Economy Recovery & Yield Audit Report...")}
          moreActions={[
            {
              label: "Sync Certified Recyclers",
              onClick: () => showToast("Recycler authorization certificates verified."),
            },
            {
              label: "Secondary Material Economics",
              onClick: () => showToast("Scrap commodity pricing ledger updated."),
            },
          ]}
        />

        {/* Main Content Area */}
        <div className="space-y-6">
        {/* 6 KPI Cards matching Screenshot 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Recyclable Collected */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Recyclable Collected</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Recycle className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">126.2 t</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+4.2% vs. PY</span>
            </div>
          </div>

          {/* Card 2: Recycling Rate */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Recycling Rate</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">68.3%</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+3.8% vs. PY</span>
            </div>
          </div>

          {/* Card 3: Energy Recovery */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Energy Recovery</span>
              <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">14.8%</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+1.1% vs. PY</span>
            </div>
          </div>

          {/* Card 4: Material Economic Value */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Recovered Value</span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">₹14.2 L</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+12.4% vs. PY</span>
            </div>
          </div>

          {/* Card 5: Recycled Output */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Recycled Output</span>
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Scale className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">79.4 t</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+8.6% vs. PY</span>
            </div>
          </div>

          {/* Card 6: Diversion Rate */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Landfill Diversion</span>
              <div className="h-8 w-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">83.1%</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+4.5% vs. PY</span>
            </div>
          </div>
        </div>

        {/* Customizable widget band */}
        <WidgetBand pageId="sustainability-recycling-management" />

        {/* Middle Section matching Screenshot 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Recycling Master Form (3 cols) */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Recycling Master</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                RCY-2024-001
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Program Name</span>
                <span className="font-semibold text-slate-800">Circular Economy Recycling</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Organization</span>
                <span className="font-semibold text-slate-800">Magnertia EV Energy</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Site / Plant</span>
                <span className="font-semibold text-slate-800">{selectedPlant}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Material Scope</span>
                <span className="font-semibold text-slate-800">Metals, Polymers & Black Mass</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Program Owner</span>
                <span className="font-semibold text-slate-800">Dr. Vikram Patel (EHS Head)</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Coordinator</span>
                <span className="font-semibold text-slate-800">Priya Sharma (Circular Economy Lead)</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Sorting Efficiency</span>
                <span className="font-semibold text-emerald-700">92.4% Recovery Yield</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1">Closed-Loop Integration</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Direct reintegration of secondary aluminum into die-casting operations, closed-loop plastic pallet shredding, and hydrometallurgical recovery of cell minerals.
                </p>
              </div>
            </div>

            <button
              onClick={() => showToast("Recycling Master parameters opened.")}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors mt-2"
            >
              Configure Master Rules
            </button>
          </div>

          {/* Center: Monthly Recycled Material Trend + Process Flow (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Monthly Trend Stacked Bar */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Monthly Recycled Material Trend
                  </h3>
                  <span className="text-xs text-slate-400">Metric tons by material stream</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-blue-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Metal
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Plastic
                  </span>
                  <span className="flex items-center gap-1 text-amber-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Paper
                  </span>
                  <span className="flex items-center gap-1 text-purple-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-500" /> E-Waste
                  </span>
                </div>
              </div>

              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MONTHLY_RECYCLING_TREND} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={11} stroke="#64748b" />
                    <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                    <Bar dataKey="metal" name="Metal" stackId="a" fill="#2563eb" />
                    <Bar dataKey="plastic" name="Plastic" stackId="a" fill="#10b981" />
                    <Bar dataKey="paper" name="Paper" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="ewaste" name="E-Waste" stackId="a" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recycling Process Flow (5 stages with connectors matching Screenshot 3) */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Recycling Process Flow</h3>
                <span className="text-xs font-semibold text-blue-600">Continuous Circular Stream</span>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-1 items-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 font-semibold">1. Collection</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">126.2 t</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Shopfloor & bins</div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
                  <div className="text-[10px] text-blue-700 font-semibold">2. Segregation</div>
                  <div className="text-sm font-bold text-blue-900 mt-0.5">122.4 t</div>
                  <div className="text-[9px] text-blue-600 mt-0.5">97% clean rate</div>
                </div>

                <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200 text-center">
                  <div className="text-[10px] text-teal-700 font-semibold">3. Sorting</div>
                  <div className="text-sm font-bold text-teal-900 mt-0.5">108.6 t</div>
                  <div className="text-[9px] text-teal-600 mt-0.5">Optical & magnet</div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-center">
                  <div className="text-[10px] text-amber-700 font-semibold">4. Processing</div>
                  <div className="text-sm font-bold text-amber-900 mt-0.5">94.2 t</div>
                  <div className="text-[9px] text-amber-600 mt-0.5">Shred & melt</div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <div className="text-[10px] text-emerald-700 font-semibold">5. Output</div>
                  <div className="text-sm font-bold text-emerald-900 mt-0.5">79.4 t</div>
                  <div className="text-[9px] text-emerald-600 mt-0.5">Certified product</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Material Mix Donut & Output Streams (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Material Mix by Category */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Material Mix by Category</h3>
                <span className="text-xs text-slate-400">YTD</span>
              </div>

              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MATERIAL_MIX}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {MATERIAL_MIX.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-bold text-slate-900">126.2 t</span>
                  <span className="text-[10px] text-slate-400 font-medium">Total Recycled</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                {MATERIAL_MIX.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-bold text-slate-800 text-[11px]">{item.value} t</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recycled Output Streams */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Recycled Output Streams</h3>
                <span className="text-xs text-slate-400">Products</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium">Aluminum Billets</span>
                  <span className="font-bold text-blue-600">38.4 t</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium">Reprocessed Polymer Pellets</span>
                  <span className="font-bold text-emerald-600">24.2 t</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium">Recycled Fluteboard</span>
                  <span className="font-bold text-amber-600">12.9 t</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium">Refined Copper Wire</span>
                  <span className="font-bold text-purple-600">3.9 t</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Row: Batches Table + Vendor Performance + Circular Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Batches Table (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Recycling Batches & Manifests</h3>
                <span className="text-xs text-slate-400">Controlled recovery lots and yield accounting</span>
              </div>
              <button
                onClick={() => showToast("Exporting recycling batch manifests...")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
              >
                <Download className="h-3.5 w-3.5" /> Export Batches
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Batch No</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Material Stream</th>
                    <th className="py-2.5 px-3">Input (t)</th>
                    <th className="py-2.5 px-3">Yield (%)</th>
                    <th className="py-2.5 px-3">Output (t)</th>
                    <th className="py-2.5 px-3">Economic Value</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {batches.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{b.batchNo}</td>
                      <td className="py-2.5 px-3 text-slate-500">{b.date}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{b.materialStream}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{b.grossWeightTons}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-600">{b.yieldPct}%</td>
                      <td className="py-2.5 px-3 font-bold text-blue-700">{b.processedOutputTons}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{b.economicValue}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold",
                            b.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          )}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Vendor Performance & Circular Economy Impact (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Vendor Scorecard */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Certified Recycling Vendors</h3>
                <span className="text-xs text-slate-400">Audited</span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: "Hindalco Secondary Smelters", score: "98.5%", rating: "Tier 1" },
                  { name: "Supreme Petrochem Recyclers", score: "96.2%", rating: "Tier 1" },
                  { name: "Sterlite Copper Refining", score: "94.8%", rating: "Tier 2" },
                  { name: "Attero Advanced Hydromet", score: "99.1%", rating: "Tier 1" },
                ].map((v) => (
                  <div key={v.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <div className="font-semibold text-slate-800">{v.name}</div>
                      <div className="text-[10px] text-slate-400">{v.rating} Authorized SPCB/CPCB</div>
                    </div>
                    <span className="font-bold text-emerald-600">{v.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Circular Economy Impact Cards */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Circular Impact Avoided</h3>
                <span className="text-xs font-semibold text-emerald-600">YTD Savings</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                  <div className="text-[10px] text-emerald-800 font-semibold">CO2e Avoided</div>
                  <div className="text-base font-bold text-emerald-900 mt-0.5">412 t</div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-center">
                  <div className="text-[10px] text-blue-800 font-semibold">Water Conserved</div>
                  <div className="text-base font-bold text-blue-900 mt-0.5">1.8 ML</div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
                  <div className="text-[10px] text-amber-800 font-semibold">Energy Saved</div>
                  <div className="text-base font-bold text-amber-900 mt-0.5">340 MWh</div>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-center">
                  <div className="text-[10px] text-purple-800 font-semibold">Virgin Ore Saved</div>
                  <div className="text-base font-bold text-purple-900 mt-0.5">110 t</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Batch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Log New Recycling Batch</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddBatch} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Material Stream</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Copper Turnings"
                  value={newBatch.materialStream}
                  onChange={(e) => setNewBatch({ ...newBatch, materialStream: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gross Weight (Tons)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 14.5"
                    value={newBatch.grossWeightTons}
                    onChange={(e) => setNewBatch({ ...newBatch, grossWeightTons: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Output Product</label>
                  <input
                    type="text"
                    placeholder="e.g. Wire Rods"
                    value={newBatch.outputProduct}
                    onChange={(e) => setNewBatch({ ...newBatch, outputProduct: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recycled Vendor Partner</label>
                  <input
                    type="text"
                    placeholder="e.g. Hindalco"
                    value={newBatch.recycledVendor}
                    onChange={(e) => setNewBatch({ ...newBatch, recycledVendor: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Economic Value (₹)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹3,50,000"
                    value={newBatch.economicValue}
                    onChange={(e) => setNewBatch({ ...newBatch, economicValue: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Save & Log Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
}

export const Route = createFileRoute("/management/sustainability-management/recycling-management")({
  component: RecyclingManagementPage,
});
