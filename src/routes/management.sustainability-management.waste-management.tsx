// Magnertia ERP - Waste Management
// Management -> Sustainability Management -> Waste Management
// Replicated from Screenshot: 6 KPI cards, Waste Master Form, Generation Trend Stacked Bar, Category Mix Donut, Disposal Flow, Manifests Table & Action Modals

import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Trash2,
  Recycle,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Building2,
  Plus,
  RefreshCw,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Layers,
  Factory,
  Truck,
  Leaf,
  X,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Scale,
  Award,
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

interface WasteRecord {
  id: string;
  manifestNo: string;
  date: string;
  wasteType: string;
  category: "Hazardous" | "Non-Hazardous" | "E-Waste" | "Bio-Medical";
  quantityTons: number;
  treatmentMethod: "Recycled" | "Energy Recovery" | "Co-processing" | "Landfill" | "Incinerated";
  authorizedVendor: string;
  destination: string;
  manifestStatus: "Completed" | "In Transit" | "Dispatched" | "Pending SPCB Signoff";
}

const INITIAL_WASTE_RECORDS: WasteRecord[] = [
  {
    id: "rec-1",
    manifestNo: "MAN-2024-089",
    date: "2026-09-24",
    wasteType: "Lithium-ion Battery Anode Trim",
    category: "Hazardous",
    quantityTons: 4.8,
    treatmentMethod: "Recycled",
    authorizedVendor: "Attero Recycling Ltd",
    destination: "Roorkee Recovery Facility",
    manifestStatus: "Completed",
  },
  {
    id: "rec-2",
    manifestNo: "MAN-2024-088",
    date: "2026-09-22",
    wasteType: "Alloy Sheet Offcuts",
    category: "Non-Hazardous",
    quantityTons: 12.4,
    treatmentMethod: "Recycled",
    authorizedVendor: "Hindalco Secondary Metals",
    destination: "Belagavi Smelter",
    manifestStatus: "Completed",
  },
  {
    id: "rec-3",
    manifestNo: "MAN-2024-087",
    date: "2026-09-20",
    wasteType: "ETP Dewatered Sludge",
    category: "Hazardous",
    quantityTons: 8.6,
    treatmentMethod: "Co-processing",
    authorizedVendor: "UltraTech Cement Works",
    destination: "Arakkonam Kiln",
    manifestStatus: "In Transit",
  },
  {
    id: "rec-4",
    manifestNo: "MAN-2024-086",
    date: "2026-09-18",
    wasteType: "Corrugated Cardboard & Paper",
    category: "Non-Hazardous",
    quantityTons: 6.2,
    treatmentMethod: "Recycled",
    authorizedVendor: "ITC Paperboards Ltd",
    destination: "Bhadrachalam Mill",
    manifestStatus: "Completed",
  },
  {
    id: "rec-5",
    manifestNo: "MAN-2024-085",
    date: "2026-09-15",
    wasteType: "Used Hydraulic & Coolant Oil",
    category: "Hazardous",
    quantityTons: 3.5,
    treatmentMethod: "Energy Recovery",
    authorizedVendor: "Bharat Petroleum Re-refiners",
    destination: "Manali Plant",
    manifestStatus: "Completed",
  },
  {
    id: "rec-6",
    manifestNo: "MAN-2024-084",
    date: "2026-09-12",
    wasteType: "Mixed Canteen & Municipal Solid",
    category: "Non-Hazardous",
    quantityTons: 2.1,
    treatmentMethod: "Landfill",
    authorizedVendor: "Greater Chennai Corp",
    destination: "Kodungaiyur Landfill Site",
    manifestStatus: "Completed",
  },
];

// Monthly generation stacked chart data
const GENERATION_TREND = [
  { month: "Apr", recycled: 9.8, recovered: 2.1, landfill: 1.8 },
  { month: "May", recycled: 10.4, recovered: 2.3, landfill: 1.6 },
  { month: "Jun", recycled: 11.2, recovered: 2.4, landfill: 1.5 },
  { month: "Jul", recycled: 10.8, recovered: 2.2, landfill: 1.4 },
  { month: "Aug", recycled: 11.6, recovered: 2.5, landfill: 1.3 },
  { month: "Sep", recycled: 12.4, recovered: 2.8, landfill: 1.1 },
  { month: "Oct", recycled: 11.9, recovered: 2.6, landfill: 1.2 },
  { month: "Nov", recycled: 12.8, recovered: 2.9, landfill: 1.0 },
  { month: "Dec", recycled: 12.2, recovered: 2.7, landfill: 1.1 },
  { month: "Jan", recycled: 13.1, recovered: 3.0, landfill: 0.9 },
  { month: "Feb", recycled: 13.5, recovered: 3.2, landfill: 0.8 },
  { month: "Mar", recycled: 14.2, recovered: 3.4, landfill: 0.7 },
];

const CATEGORY_MIX = [
  { name: "Metal Scrap", value: 59.1, color: "#2563eb" },
  { name: "Plastic Scrap", value: 44.3, color: "#10b981" },
  { name: "Chemical & Sludge", value: 33.2, color: "#f59e0b" },
  { name: "Paper & Cardboard", value: 25.8, color: "#8b5cf6" },
  { name: "E-Waste & Cells", value: 14.8, color: "#ec4899" },
  { name: "General / Organic", value: 7.4, color: "#64748b" },
];

function WasteManagementPage() {
  const [selectedPlant, setSelectedPlant] = useState("Gigafactory 1 - Chennai");
  const [reportingYear, setReportingYear] = useState("FY 2024-25");
  const [records, setRecords] = useState<WasteRecord[]>(INITIAL_WASTE_RECORDS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [newManifest, setNewManifest] = useState({
    wasteType: "",
    category: "Non-Hazardous" as WasteRecord["category"],
    quantityTons: "",
    treatmentMethod: "Recycled" as WasteRecord["treatmentMethod"],
    authorizedVendor: "",
    destination: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManifest.wasteType || !newManifest.quantityTons) {
      showToast("Please fill in waste type and quantity.");
      return;
    }

    const created: WasteRecord = {
      id: `rec-${Date.now()}`,
      manifestNo: `MAN-2024-09${records.length + 1}`,
      date: new Date().toISOString().split("T")[0],
      wasteType: newManifest.wasteType,
      category: newManifest.category,
      quantityTons: parseFloat(newManifest.quantityTons),
      treatmentMethod: newManifest.treatmentMethod,
      authorizedVendor: newManifest.authorizedVendor || "EcoCycle Authorized Partners",
      destination: newManifest.destination || "Regional Processing Hub",
      manifestStatus: "In Transit",
    };

    setRecords([created, ...records]);
    setShowAddModal(false);
    setNewManifest({
      wasteType: "",
      category: "Non-Hazardous",
      quantityTons: "",
      treatmentMethod: "Recycled",
      authorizedVendor: "",
      destination: "",
    });
    showToast(`Manifest ${created.manifestNo} created and logged successfully.`);
  };

  return (
    <AppShell
      title="Waste Management"
      breadcrumb="Management > Sustainability Management > Waste Management"
      description="Controlled ERP framework for waste generation, segregation, manifests, tracking, regulatory compliance & Zero Waste to Landfill."
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
          icon={Trash2}
          title="Waste Management"
          code="WM-2026-001"
          programName="Zero Waste to Landfill (ZWTL)"
          version="v1.0"
          status="Active"
          subtitle="Controlled ERP framework for waste generation, segregation, manifests, tracking, regulatory compliance & Zero Waste to Landfill."
          primaryActionLabel="+ Add Waste Record"
          onPrimaryAction={() => setShowAddModal(true)}
          onGenerateReport={() => showToast("Exporting CPCB Form-X & Form-IV Waste Manifests report...")}
          moreActions={[
            {
              label: "Sync Manifest Chain of Custody",
              onClick: () => showToast("All 12 manifests synced with SPCB portal."),
            },
            {
              label: "Hazardous Storage Audit",
              onClick: () => showToast("Storage inspection audit dossier generated."),
            },
          ]}
        />

        {/* Main Container */}
        <div className="space-y-6">
        {/* 6 KPI Cards matching Screenshot 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Total Waste Generated */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Waste Generated</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Trash2 className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">184.6 t</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-5.2% vs. PY</span>
            </div>
          </div>

          {/* Card 2: Recycling Rate */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Recycling Rate</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Recycle className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">68.3%</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+4.1% vs. PY</span>
            </div>
          </div>

          {/* Card 3: Recovery Rate */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Energy Recovery</span>
              <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Leaf className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">14.8%</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+1.2% vs. PY</span>
            </div>
          </div>

          {/* Card 4: Landfill Rate */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Landfill Rate</span>
              <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">16.9%</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-3.4% vs. PY</span>
            </div>
          </div>

          {/* Card 5: Waste Intensity */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Waste Intensity</span>
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Scale className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">4.2 kg/unit</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-6.8% vs. PY</span>
            </div>
          </div>

          {/* Card 6: Disposal Cost */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Disposal Cost</span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">₹12.4 L</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-8.1% vs. PY</span>
            </div>
          </div>
        </div>

        {/* Customizable widget band */}
        <WidgetBand pageId="sustainability-waste-management" />

        {/* Middle 3-Column Section matching Screenshot 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Waste Master Details Form (3 cols) */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Waste Master Details</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                WST-2024-001
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Program Name</span>
                <span className="font-semibold text-slate-800">Enterprise Waste Management</span>
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
                <span className="text-slate-400 block text-[11px]">Classification</span>
                <span className="font-semibold text-slate-800">Hazardous & Non-Hazardous</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Program Owner</span>
                <span className="font-semibold text-slate-800">Dr. Vikram Patel (EHS Head)</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">SPCB Authorization</span>
                <span className="font-semibold text-emerald-700">TNPCB/HW/2023-28 (Valid)</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Mandatory Manifest Standard</span>
                <span className="font-semibold text-slate-800">Form 10 (Yellow Manifest)</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1">Operational Scope</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Active zero-waste circular protocols covering battery cell assembly, stamping scrap segregation, and automated manifest filing with state pollution boards.
                </p>
              </div>
            </div>

            <button
              onClick={() => showToast("Waste Master configuration opened.")}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors mt-2"
            >
              Edit Master Properties
            </button>
          </div>

          {/* Column 2: Waste Generation & Treatment Trend + Flow (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Generation & Treatment Trend Stacked Bar */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Waste Generation & Treatment Trend
                  </h3>
                  <span className="text-xs text-slate-400">Monthly breakdown in metric tons</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-blue-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Recycled
                  </span>
                  <span className="flex items-center gap-1 text-teal-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-teal-500" /> Recovered
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" /> Landfill
                  </span>
                </div>
              </div>

              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={GENERATION_TREND} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={11} stroke="#64748b" />
                    <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#64748b" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                    />
                    <Bar dataKey="recycled" name="Recycled (t)" stackId="a" fill="#2563eb" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="recovered" name="Recovered (t)" stackId="a" fill="#14b8a6" />
                    <Bar dataKey="landfill" name="Landfill (t)" stackId="a" fill="#f87171" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Disposal & Recovery Flow Cards matching Screenshot */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Disposal & Recovery Flow</h3>
                <span className="text-xs font-semibold text-emerald-600">83.1% Total Diversion</span>
              </div>

              <div className="grid grid-cols-4 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
                  <div className="text-[11px] text-blue-700 font-semibold">Recycled</div>
                  <div className="text-lg font-bold text-blue-900 mt-0.5">126.1 t</div>
                  <div className="text-[10px] text-blue-600 mt-0.5 font-medium">68.3% of total</div>
                </div>

                <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-100 text-center">
                  <div className="text-[11px] text-teal-700 font-semibold">Recovered</div>
                  <div className="text-lg font-bold text-teal-900 mt-0.5">27.3 t</div>
                  <div className="text-[10px] text-teal-600 mt-0.5 font-medium">14.8% of total</div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-center">
                  <div className="text-[11px] text-amber-700 font-semibold">Co-processed</div>
                  <div className="text-lg font-bold text-amber-900 mt-0.5">18.4 t</div>
                  <div className="text-[10px] text-amber-600 mt-0.5 font-medium">10.0% of total</div>
                </div>

                <div className="p-3 rounded-xl bg-red-50/70 border border-red-100 text-center">
                  <div className="text-[11px] text-red-700 font-semibold">Landfill</div>
                  <div className="text-lg font-bold text-red-900 mt-0.5">12.8 t</div>
                  <div className="text-[10px] text-red-600 mt-0.5 font-medium">6.9% residual</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Category Mix Donut & Target Progress (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Waste by Category Mix */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Waste by Category Mix</h3>
                <span className="text-xs text-slate-400">YTD</span>
              </div>

              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_MIX}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {CATEGORY_MIX.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-bold text-slate-900">184.6 t</span>
                  <span className="text-[10px] text-slate-400 font-medium">Total Generated</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                {CATEGORY_MIX.map((item) => (
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

            {/* Target Progress */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Target Progress</h3>
                <span className="text-xs text-slate-400">2026 ESG Goals</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700">Zero Waste to Landfill (95%)</span>
                    <span className="text-emerald-600">83.1%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "83.1%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700">Hazardous Waste Reduction (30%)</span>
                    <span className="text-blue-600">24.5%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: "81%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700">Packaging Circularity (100%)</span>
                    <span className="text-teal-600">88.0%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: "88%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Row: Recent Records Table + Top Sources + Active Initiatives */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Waste Manifest Records Table (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Waste Manifest Records</h3>
                <span className="text-xs text-slate-400">Controlled hazardous & non-hazardous consignments</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast("Exporting waste manifest register...")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
                >
                  <Download className="h-3.5 w-3.5" /> Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Manifest No</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Waste Stream</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Qty (t)</th>
                    <th className="py-2.5 px-3">Treatment</th>
                    <th className="py-2.5 px-3">Authorized Vendor</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{rec.manifestNo}</td>
                      <td className="py-2.5 px-3 text-slate-500">{rec.date}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{rec.wasteType}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold",
                            rec.category === "Hazardous"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          )}
                        >
                          {rec.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{rec.quantityTons}</td>
                      <td className="py-2.5 px-3 text-slate-600">{rec.treatmentMethod}</td>
                      <td className="py-2.5 px-3 text-slate-600 truncate max-w-[130px]">{rec.authorizedVendor}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold",
                            rec.manifestStatus === "Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          )}
                        >
                          {rec.manifestStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Waste Sources & Active Initiatives (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Top Waste Sources */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Top Waste Sources</h3>
                <span className="text-xs text-slate-400">Plant Areas</span>
              </div>

              <div className="space-y-2.5 pt-1 text-xs">
                {[
                  { source: "Battery Module Assembly", tons: "42.8 t", pct: "32%" },
                  { source: "SMT & Electronics Line", tons: "34.2 t", pct: "26%" },
                  { source: "Metal Stamping & Press", tons: "28.6 t", pct: "21%" },
                  { source: "Packaging & Logistics", tons: "18.4 t", pct: "14%" },
                  { source: "Facilities & Maintenance", tons: "9.2 t", pct: "7%" },
                ].map((s) => (
                  <div key={s.source} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-medium text-slate-700">{s.source}</span>
                    <span className="font-bold text-slate-900">{s.tons} ({s.pct})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Reduction Initiatives */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Active Waste Initiatives</h3>
                <span className="text-xs font-bold text-emerald-600">5 Live</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/70">
                  <div className="font-bold text-emerald-900">Solvent Closed-Loop Recovery</div>
                  <div className="text-[11px] text-emerald-700">92% solvent reuse in cathode coating wash</div>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200/70">
                  <div className="font-bold text-blue-900">Returnable Pallet Supplier Agreement</div>
                  <div className="text-[11px] text-blue-700">Replaced 12,000 single-use wooden pallets</div>
                </div>

                <div className="p-2.5 rounded-lg bg-purple-50/60 border border-purple-200/70">
                  <div className="font-bold text-purple-900">On-site Solder Dross Re-smelting</div>
                  <div className="text-[11px] text-purple-700">Recovers 1.4 t of tin-silver alloy per quarter</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Log New Waste Manifest</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Waste Stream / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Copper Wire Trimming Scrap"
                  value={newManifest.wasteType}
                  onChange={(e) => setNewManifest({ ...newManifest, wasteType: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newManifest.category}
                    onChange={(e) => setNewManifest({ ...newManifest, category: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  >
                    <option value="Non-Hazardous">Non-Hazardous</option>
                    <option value="Hazardous">Hazardous</option>
                    <option value="E-Waste">E-Waste</option>
                    <option value="Bio-Medical">Bio-Medical</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity (Tons)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 5.4"
                    value={newManifest.quantityTons}
                    onChange={(e) => setNewManifest({ ...newManifest, quantityTons: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Treatment Method</label>
                  <select
                    value={newManifest.treatmentMethod}
                    onChange={(e) => setNewManifest({ ...newManifest, treatmentMethod: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  >
                    <option value="Recycled">Recycled</option>
                    <option value="Energy Recovery">Energy Recovery</option>
                    <option value="Co-processing">Co-processing</option>
                    <option value="Landfill">Landfill</option>
                    <option value="Incinerated">Incinerated</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Authorized Recycler / Vendor</label>
                  <input
                    type="text"
                    placeholder="e.g. Attero Recycling"
                    value={newManifest.authorizedVendor}
                    onChange={(e) => setNewManifest({ ...newManifest, authorizedVendor: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination Facility</label>
                <input
                  type="text"
                  placeholder="e.g. Roorkee Recycling Hub"
                  value={newManifest.destination}
                  onChange={(e) => setNewManifest({ ...newManifest, destination: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                />
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
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Save & Log Manifest
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

export const Route = createFileRoute("/management/sustainability-management/waste-management")({
  component: WasteManagementPage,
});
