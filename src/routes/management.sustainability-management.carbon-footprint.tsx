// Magnertia ERP - Carbon Footprint
// Management -> Sustainability Management -> Carbon Footprint
// Aligned with Light Enterprise Theme (Image 2 Reference)

import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSustainabilityManagementRecordFn } from "@/lib/sustainabilityManagementFns.server";
import {
  Cloud,
  TrendingDown,
  TrendingUp,
  FileText,
  Save,
  Send,
  Download,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Calendar,
  Building2,
  Users,
  ShieldCheck,
  Zap,
  Truck,
  Flame,
  Plane,
  Trash2,
  Package,
  Layers,
  Award,
  Factory,
  X,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { SustainabilityManagementTabBar } from "@/components/erp/SustainabilityManagementTabBar";
import { SustainabilitySubmoduleHeader } from "@/components/erp/SustainabilitySubmoduleHeader";
import { WidgetBand } from "@/widgets/components/WidgetBand";
import { cn } from "@/lib/utils";
import { mockCarbonFootprint } from "@/services/sustainabilityManagementService";

function CarbonFootprintPage() {
  const { data: dbRecord } = useQuery({
    queryKey: ["sustainability-management", "record"],
    queryFn: () => getSustainabilityManagementRecordFn({ data: {} }),
  });

  const [selectedPlant, setSelectedPlant] = useState("Gigafactory 1 - Chennai");
  const [reportingYear, setReportingYear] = useState("FY 2026");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [data, setData] = useState(mockCarbonFootprint);
  useEffect(() => { if (dbRecord?.data) setData(dbRecord.data); }, [dbRecord]);
  const [showAddEmissionModal, setShowAddEmissionModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="Carbon Footprint"
      breadcrumb="Management > Sustainability Management > Carbon Footprint"
      description="Measure Today. A Cleaner Tomorrow. • Scopes 1, 2, 3 GHG Accounting Aligned with GHG Protocol"
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
          icon={Cloud}
          title="Carbon Footprint"
          code="CF-2026-001"
          programName="Corporate GHG Accounting"
          version="v1.0"
          status="Active"
          subtitle="Measure Today. A Cleaner Tomorrow. • Scopes 1, 2, 3 GHG Accounting Aligned with GHG Protocol"
          primaryActionLabel="+ Log Activity Data"
          onPrimaryAction={() => setShowAddEmissionModal(true)}
          onGenerateReport={() => showToast("Exporting GHG Protocol Scope 1-3 report...")}
          moreActions={[
            {
              label: "Net Zero Target Dossier",
              onClick: () => setShowTargetModal(true),
            },
          ]}
        />

        {/* Main Content Area */}
        <div className="space-y-6">
        {/* 6 Top KPI Cards matching Image 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* Card 1: Total Emissions */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Emissions</span>
              <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Cloud className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">1,248 <span className="text-xs font-normal text-slate-500">tCO₂e</span></div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-12% vs FY25</span>
            </div>
          </div>

          {/* Card 2: Scope 1 Direct */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Scope 1 (Direct)</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">286 <span className="text-xs font-normal text-slate-500">tCO₂e</span></div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-8% vs FY25</span>
            </div>
          </div>

          {/* Card 3: Scope 2 Energy */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Scope 2 (Energy)</span>
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">412 <span className="text-xs font-normal text-slate-500">tCO₂e</span></div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-18% vs FY25</span>
            </div>
          </div>

          {/* Card 4: Scope 3 Value Chain */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Scope 3 (Supply)</span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Truck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">550 <span className="text-xs font-normal text-slate-500">tCO₂e</span></div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-10% vs FY25</span>
            </div>
          </div>

          {/* Card 5: Decarbonization */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Decarbonization</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">18%</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">Target: -40% by 2030</div>
          </div>

          {/* Card 6: Renewable Share */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Clean Energy Share</span>
              <div className="h-8 w-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">42%</div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-1">Zero Peak Violation</div>
          </div>
        </div>

        {/* Customizable widget band */}
        <WidgetBand pageId="sustainability-carbon-footprint" />

        {/* Row 1: Form & Key Metrics & Target Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Left (4 cols): Carbon Footprint Details */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">1. Carbon Footprint Details</h3>
              <span className="text-[11px] text-teal-700 font-mono font-semibold">CF-2026-001</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 text-[11px]">Carbon Footprint ID</label>
                  <input readOnly value="CF-2026-001" className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 font-mono" />
                </div>
                <div>
                  <label className="text-slate-500 text-[11px]">Reference No.</label>
                  <input readOnly value="CF-2026-001" className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 font-mono" />
                </div>
              </div>

              <div>
                <label className="text-slate-500 text-[11px]">Program Name</label>
                <input readOnly value="Magnertia Corporate Carbon Footprint" className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 font-medium" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 text-[11px]">Assessment Type</label>
                  <input readOnly value="Organizational Carbon Footprint" className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 truncate" />
                </div>
                <div>
                  <label className="text-slate-500 text-[11px]">Reporting Framework</label>
                  <input readOnly value="GHG Protocol" className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 text-[11px]">Reporting Period</label>
                  <input readOnly value="FY 2026" className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800" />
                </div>
                <div>
                  <label className="text-slate-500 text-[11px]">Boundary Type</label>
                  <input readOnly value="Operational Control" className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 text-[11px]">Carbon Owner</label>
                  <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 border border-slate-200 rounded">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-[9px] flex items-center justify-center text-white">AK</span>
                    <span className="text-slate-800 font-medium">Arun Kumar</span>
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 text-[11px]">Carbon Coordinator</label>
                  <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 border border-slate-200 rounded">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-[9px] flex items-center justify-center text-white">RS</span>
                    <span className="text-slate-800 font-medium">Ramesh S</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-500 text-[11px]">Description</label>
                <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                  Corporate carbon footprint for all operations including manufacturing, offices, logistics and business travel aligned with GHG Protocol and our Net Zero 2030 commitment.
                </p>
              </div>
            </div>
          </div>

          {/* Center (4 cols): Emissions by Source Donut & Breakdown */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Emissions by Source (tCO₂e)</h4>
              <span className="text-[11px] font-mono font-semibold text-emerald-700">1,248 t Total</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                <span className="text-slate-700">Electricity: <strong>33%</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-teal-50/60 border border-teal-100">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0" />
                <span className="text-slate-700">Fuel Comb.: <strong>23%</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-50/60 border border-indigo-100">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                <span className="text-slate-700">Supply Chain: <strong>18%</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-700">Logistics: <strong>10%</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50/60 border border-rose-100">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-slate-700">Business Travel: <strong>6%</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50/60 border border-purple-100">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                <span className="text-slate-700">Waste & Other: <strong>10%</strong></span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Emission Intensity</span>
                <span className="font-bold text-slate-900">0.42 tCO₂e / unit produced</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full rounded-full" style={{ width: "42%" }} />
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block">&darr; -14% vs FY23 baseline intensity</span>
            </div>
          </div>

          {/* Right (4 cols): Target Progress Ring & Top Reduction Initiatives */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Target Progress (2023 &rarr; 2030)</h4>
              <button onClick={() => setShowTargetModal(true)} className="text-[11px] text-teal-600 font-semibold hover:underline">
                View Details
              </button>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-24 w-24 rounded-full border-6 border-emerald-500 border-t-teal-400 border-r-slate-200 flex flex-col items-center justify-center shrink-0">
                <span className="text-xl font-extrabold text-slate-900">18%</span>
                <span className="text-[9px] text-emerald-700 font-bold uppercase">Reduced</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between gap-4 text-slate-600">
                  <span>Baseline (2023):</span>
                  <strong className="text-slate-900">1,520 tCO₂e</strong>
                </div>
                <div className="flex justify-between gap-4 text-slate-600">
                  <span>Current (2026):</span>
                  <strong className="text-emerald-700 font-bold">1,248 tCO₂e</strong>
                </div>
                <div className="flex justify-between gap-4 text-slate-600">
                  <span>Target (2030):</span>
                  <strong className="text-teal-700 font-bold">912 tCO₂e (-40%)</strong>
                </div>
              </div>
            </div>

            {/* Top Reduction Initiatives */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h5 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Top Decarbonization Initiatives</h5>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div>
                    <div className="font-semibold text-slate-900">Solar Rooftop Installation</div>
                    <span className="text-[10px] text-amber-700 font-medium">In Progress</span>
                  </div>
                  <span className="font-bold text-emerald-700">-120 tCO₂e</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div>
                    <div className="font-semibold text-slate-900">Energy Efficient Equipment</div>
                    <span className="text-[10px] text-amber-700 font-medium">In Progress</span>
                  </div>
                  <span className="font-bold text-emerald-700">-85 tCO₂e</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div>
                    <div className="font-semibold text-slate-900">EV Fleet Transition</div>
                    <span className="text-[10px] text-blue-700 font-medium">Planned</span>
                  </div>
                  <span className="font-bold text-emerald-700">-60 tCO₂e</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Emission Trend & Summary Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Emission Trend (6 cols) */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Emission Trend (tCO₂e)</h3>
              <div className="flex gap-2 text-[10px]">
                <span className="text-blue-600 font-semibold">&bull; Scope 1</span>
                <span className="text-purple-600 font-semibold">&bull; Scope 2</span>
                <span className="text-amber-600 font-semibold">&bull; Scope 3</span>
                <span className="text-emerald-700 font-bold">&bull; Total</span>
              </div>
            </div>

            <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
              {[
                { year: "2021", s1: 340, s2: 520, s3: 680, tot: 1540 },
                { year: "2022", s1: 320, s2: 505, s3: 675, tot: 1500 },
                { year: "2023", s1: 310, s2: 490, s3: 720, tot: 1520 },
                { year: "2024", s1: 295, s2: 450, s3: 620, tot: 1365 },
                { year: "2025", s1: 300, s2: 460, s3: 600, tot: 1360 },
                { year: "2026", s1: 286, s2: 412, s3: 550, tot: 1248 },
              ].map((p) => (
                <div key={p.year} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex items-end justify-center gap-1 h-32">
                    <div style={{ height: `${(p.s1 / 1600) * 100}%` }} className="w-1.5 bg-blue-500 rounded-t" title={`Scope 1: ${p.s1}`} />
                    <div style={{ height: `${(p.s2 / 1600) * 100}%` }} className="w-1.5 bg-purple-500 rounded-t" title={`Scope 2: ${p.s2}`} />
                    <div style={{ height: `${(p.s3 / 1600) * 100}%` }} className="w-1.5 bg-amber-500 rounded-t" title={`Scope 3: ${p.s3}`} />
                    <div style={{ height: `${(p.tot / 1600) * 100}%` }} className="w-2.5 bg-emerald-600 rounded-t" title={`Total: ${p.tot}`} />
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{p.year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emissions Summary FY 2026 (6 cols) */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Emissions Summary (FY 2026)</h3>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2">Scope</th>
                  <th className="py-2">Emissions (tCO₂e)</th>
                  <th className="py-2">% of Total</th>
                  <th className="py-2">vs. FY 2025</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2 font-semibold text-slate-900">Scope 1</td>
                  <td className="py-2">286</td>
                  <td className="py-2">23%</td>
                  <td className="py-2 font-semibold text-emerald-600">&darr; 8%</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-slate-900">Scope 2</td>
                  <td className="py-2">412</td>
                  <td className="py-2">33%</td>
                  <td className="py-2 font-semibold text-emerald-600">&darr; 18%</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-slate-900">Scope 3</td>
                  <td className="py-2">550</td>
                  <td className="py-2">44%</td>
                  <td className="py-2 font-semibold text-emerald-600">&darr; 10%</td>
                </tr>
                <tr className="font-bold text-slate-900 border-t border-slate-200 bg-slate-50/50">
                  <td className="py-2">Gross Emissions</td>
                  <td className="py-2">1,248</td>
                  <td className="py-2">100%</td>
                  <td className="py-2 text-emerald-600">&darr; 12%</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">Removals / Offsets</td>
                  <td className="py-2">0</td>
                  <td className="py-2">0%</td>
                  <td className="py-2 text-slate-400">-</td>
                </tr>
                <tr className="font-bold text-emerald-700 border-t border-slate-200 bg-emerald-50/30">
                  <td className="py-2">Net Emissions</td>
                  <td className="py-2">1,248</td>
                  <td className="py-2">100%</td>
                  <td className="py-2">&darr; 12%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 3: Documents, Stakeholders, Compliance & Assurance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Related Documents */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Related Documents</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-900">Carbon_Footprint_Methodology_v2.0.pdf</div>
                  <div className="text-[10px] text-slate-500">2.4 MB &bull; 10 Sep 2026</div>
                </div>
                <button onClick={() => showToast("Downloading Carbon Methodology PDF.")} className="p-1 text-slate-500 hover:text-emerald-600">
                  <Download className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-900">Emission_Factor_Master.xlsx</div>
                  <div className="text-[10px] text-slate-500">1.1 MB &bull; 05 Sep 2026</div>
                </div>
                <button onClick={() => showToast("Downloading Emission Factor dataset.")} className="p-1 text-slate-500 hover:text-emerald-600">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Stakeholders */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Stakeholders</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-800 font-medium">Investors</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-800 border border-red-200 font-semibold">Quarterly Review</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-800 font-medium">Customers</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 border border-amber-200 font-semibold">Annual Report</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-800 font-medium">Suppliers</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 border border-blue-200 font-semibold">Scope 3 Portal</span>
              </div>
            </div>
          </div>

          {/* Compliance & Assurance */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Compliance & Assurance</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-800 font-medium">GHG Protocol</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">Compliant</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-800 font-medium">ISO 14064 Verification</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 border border-blue-200 font-bold">In Progress</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-800 font-medium">SEBI BRSR (India)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal: Add Activity Data */}
      {showAddEmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Log Carbon Activity Data</h3>
              <button onClick={() => setShowAddEmissionModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Emission Source</label>
                <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500">
                  <option>Grid Electricity (Scope 2)</option>
                  <option>Diesel Generator (Scope 1)</option>
                  <option>Company Vehicles (Scope 1)</option>
                  <option>Natural Gas Combustion (Scope 1)</option>
                  <option>Business Air Travel (Scope 3)</option>
                  <option>Employee Commuting (Scope 3)</option>
                  <option>Purchased Raw Materials (Scope 3)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Activity Quantity</label>
                  <input type="number" placeholder="e.g. 5000" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit</label>
                  <input type="text" defaultValue="kWh / Litres / km" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowAddEmissionModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddEmissionModal(false);
                  showToast("Activity data logged and emission converted to CO2e.");
                }}
                className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
              >
                Calculate & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal: Target Progress Details */}
      {showTargetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Corporate Decarbonization Targets</h3>
                <p className="text-xs text-slate-500">Net Zero 2030 Science-Based Target (SBTi 1.5°C Pathway)</p>
              </div>
              <button onClick={() => setShowTargetModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span>Base Year (2023):</span>
                  <span className="font-bold text-slate-900">1,520 tCO₂e</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Current Actual (FY 2026):</span>
                  <span className="font-bold text-emerald-700">1,248 tCO₂e (-17.9%)</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>2027 Interim Milestone:</span>
                  <span className="font-bold text-teal-700">1,100 tCO₂e (-27.6%)</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>2030 Net Zero Milestone:</span>
                  <span className="font-bold text-cyan-700">912 tCO₂e (-40.0%)</span>
                </div>
              </div>

              <div>
                <span className="text-slate-800 font-semibold block mb-1">Approved Decarbonization Levers:</span>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Solar rooftop & off-site wind PPA to reach 85% RE by 2028</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Electrification of company logistics fleet & supplier green routing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Recycled secondary aluminum & battery cell scrap reintroduction</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowTargetModal(false)}
                className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
              >
                Close Target Dossier
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
}

export const Route = createFileRoute("/management/sustainability-management/carbon-footprint")({
  component: CarbonFootprintPage,
});
