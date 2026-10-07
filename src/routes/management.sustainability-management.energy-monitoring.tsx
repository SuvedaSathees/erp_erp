// Magnertia ERP - Energy Monitoring
// Management -> Sustainability Management -> Energy Monitoring
// Aligned with Light Enterprise Theme (Image 2 Reference)

import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSustainabilityManagementRecordFn } from "@/lib/sustainabilityManagementFns.server";
import {
  Zap,
  Leaf,
  DollarSign,
  Activity,
  Gauge,
  Cloud,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  FileText,
  Plus,
  RefreshCw,
  FolderTree,
  AlertTriangle,
  Clock,
  Radio,
  Download,
  Building2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { SustainabilityManagementTabBar } from "@/components/erp/SustainabilityManagementTabBar";
import { SustainabilitySubmoduleHeader } from "@/components/erp/SustainabilitySubmoduleHeader";
import { WidgetBand } from "@/widgets/components/WidgetBand";
import { cn } from "@/lib/utils";
import { mockEnergyMonitoring } from "@/services/sustainabilityManagementService";

function EnergyMonitoringPage() {
  const { data: dbRecord } = useQuery({
    queryKey: ["sustainability-management", "record"],
    queryFn: () => getSustainabilityManagementRecordFn({ data: {} }),
  });

  const [selectedPlant, setSelectedPlant] = useState("Gigafactory 1 - Chennai");
  const [reportingMonth, setReportingMonth] = useState("Sep 2026");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [data, setData] = useState(mockEnergyMonitoring);
  useEffect(() => { if (dbRecord?.data) setData(dbRecord.data); }, [dbRecord]);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState("EM-PE-001");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="Energy Monitoring"
      breadcrumb="Management > Sustainability Management > Energy Monitoring"
      description="Monitor Today. Conserve Tomorrow. • Cleaner Energy Greener Future - A Sustainable Magnertia"
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
          icon={Zap}
          title="Energy Monitoring"
          code="EM-2026-001"
          programName="Smart Grid & Renewable Integration"
          version="v1.0"
          status="Active"
          subtitle="Monitor Today. Conserve Tomorrow. • Cleaner Energy Greener Future - A Sustainable Magnertia"
          primaryActionLabel="+ Add Energy Record"
          onPrimaryAction={() => setShowAddRecordModal(true)}
          onGenerateReport={() => showToast("Exporting Energy Audit Report (ISO 50001)...")}
          moreActions={[
            {
              label: "Sync IoT Smart Meters",
              onClick: () => showToast("IoT Smart Meters synced across all production blocks."),
            },
            {
              label: "Energy Efficiency Audit",
              onClick: () => showToast("Energy Efficiency Audit Dossier initiated."),
            },
          ]}
        />

        {/* Main Content Area */}
        <div className="space-y-6">
        {/* 6 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* Card 1: Total Consumption */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Consumption</span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">1.82 <span className="text-xs font-normal text-slate-500">GWh</span></div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-12% vs prev period</span>
            </div>
          </div>

          {/* Card 2: Renewable Energy */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Renewable Energy</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Leaf className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">42%</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+8% vs prev period</span>
            </div>
          </div>

          {/* Card 3: Energy Cost */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Energy Cost</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">₹ 18.6 <span className="text-xs font-normal text-slate-500">L</span></div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-6% vs prev period</span>
            </div>
          </div>

          {/* Card 4: Energy Intensity */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Energy Intensity</span>
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">14.2 <span className="text-xs font-normal text-slate-500">kWh/u</span></div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-14% vs prev period</span>
            </div>
          </div>

          {/* Card 5: Peak Demand */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Peak Demand</span>
              <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Gauge className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">186 <span className="text-xs font-normal text-slate-500">kW</span></div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-4% vs prev period</span>
            </div>
          </div>

          {/* Card 6: Carbon Emissions */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Carbon Emissions</span>
              <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Cloud className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">412 <span className="text-xs font-normal text-slate-500">tCO₂e</span></div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-18% vs prev period</span>
            </div>
          </div>
        </div>

        {/* Customizable widget band */}
        <WidgetBand pageId="sustainability-energy-monitoring" />

        {/* Row 1: Details, Consumption Trend & Mix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Energy Monitoring Details (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Energy Monitoring Details</h3>
              <span className="text-amber-700 font-mono font-semibold">ENM-2026-001</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Monitoring Type:</span>
                <span className="text-slate-800 font-medium">Facility Energy Monitoring</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Organization:</span>
                <span className="text-slate-800">Magnertia Private Limited</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Site / Plant:</span>
                <span className="text-slate-800">Coimbatore Development Centre</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Reporting Period:</span>
                <span className="text-slate-800">{reportingMonth}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Base Year:</span>
                <span className="text-slate-800">2023</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Energy Owner:</span>
                <span className="text-slate-900 font-semibold">Arun Kumar</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Coordinator:</span>
                <span className="text-slate-900 font-semibold">Ramesh S</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">Active</span>
              </div>
              <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed mt-2">
                Monitor and optimize energy consumption across the plant to improve energy efficiency and eliminate peak threshold penalties.
              </p>
            </div>
          </div>

          {/* Energy Consumption Trend (5 cols) */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Energy Consumption Trend</h3>
              <span className="text-xs text-slate-500">Last 12 Months</span>
            </div>

            <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
              {[
                { m: "Jan", grid: 120, ren: 40 },
                { m: "Feb", grid: 125, ren: 45 },
                { m: "Mar", grid: 130, ren: 50 },
                { m: "Apr", grid: 135, ren: 55 },
                { m: "May", grid: 140, ren: 65 },
                { m: "Jun", grid: 150, ren: 70 },
                { m: "Jul", grid: 145, ren: 72 },
                { m: "Aug", grid: 142, ren: 75 },
                { m: "Sep", grid: 138, ren: 78 },
              ].map((p) => (
                <div key={p.m} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end h-32 gap-0.5">
                    <div style={{ height: `${(p.ren / 220) * 100}%` }} className="w-full bg-emerald-500 rounded-t" title={`Renewable: ${p.ren} MWh`} />
                    <div style={{ height: `${(p.grid / 220) * 100}%` }} className="w-full bg-blue-500" title={`Grid: ${p.grid} MWh`} />
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{p.m}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> Grid Electricity</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Renewable Energy</span>
            </div>
          </div>

          {/* Consumption by Energy Source (3 cols) */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Consumption by Source</h3>
            <div className="py-2 flex flex-col items-center justify-center">
              <div className="h-24 w-24 rounded-full border-6 border-blue-500 border-t-amber-400 border-r-emerald-500 border-b-slate-200 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-slate-900">1.82</span>
                <span className="text-[9px] text-slate-500">GWh</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-700 p-1 rounded bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Grid Electricity</span>
                <strong className="text-slate-900">58%</strong>
              </div>
              <div className="flex justify-between text-slate-700 p-1 rounded bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Solar</span>
                <strong className="text-slate-900">28%</strong>
              </div>
              <div className="flex justify-between text-slate-700 p-1 rounded bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Natural Gas</span>
                <strong className="text-slate-900">8%</strong>
              </div>
              <div className="flex justify-between text-slate-700 p-1 rounded bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /> Diesel</span>
                <strong className="text-slate-900">4%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Meter Hierarchy, Real-Time Monitoring & Initiatives */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Meter Hierarchy (3 cols) */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FolderTree className="h-4 w-4 text-emerald-600" />
                Meter Hierarchy
              </h3>
              <button onClick={() => showToast("Expanded full meter tree.")} className="text-[10px] text-emerald-600 font-semibold hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-1 font-mono text-[11px] text-slate-600 pt-1">
              <div className="text-slate-900 font-semibold">&bull; Magnertia Private Limited</div>
              <div className="pl-3 text-slate-500">&lfloor; Coimbatore Development Centre</div>
              <div className="pl-6 text-slate-500">&lfloor; Engineering Block</div>
              <div className="pl-9 text-slate-500">&lfloor; Power Electronics Lab</div>
              <div className="pl-12 text-slate-500">&lfloor; R&D Department</div>
              <div className="pl-15 text-slate-600">&lfloor; WPT Testing Process</div>
              <div className="pl-18 text-amber-700 font-bold">&lfloor; EM-PE-001 (Smart Meter)</div>
            </div>
          </div>

          {/* Real-Time Energy Monitoring (6 cols) */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Real-Time Energy Monitoring</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <Radio className="h-3 w-3 text-emerald-600 animate-pulse" /> Live
                </span>
              </div>
              <button onClick={() => showToast("Opened detailed SCADA telemetry.")} className="text-xs text-emerald-600 font-semibold hover:underline">
                View Dashboard
              </button>
            </div>

            {/* 4 Real-Time Metrics */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-lg font-bold text-teal-700">122.4 <span className="text-[10px]">kW</span></div>
                <div className="text-[10px] text-slate-500">Active Power</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-lg font-bold text-emerald-700">0.92</div>
                <div className="text-[10px] text-slate-500">Power Factor</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-lg font-bold text-purple-700">415 <span className="text-[10px]">V</span></div>
                <div className="text-[10px] text-slate-500">Voltage</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-lg font-bold text-amber-700">176 <span className="text-[10px]">A</span></div>
                <div className="text-[10px] text-slate-500">Current</div>
              </div>
            </div>

            {/* Live Meter Table */}
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2">Meter</th>
                  <th className="py-2">Location</th>
                  <th className="py-2">Active Power</th>
                  <th className="py-2">Today (kWh)</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedMeter("EM-PE-001")}>
                  <td className="py-2 font-mono font-semibold text-amber-700">EM-PE-001</td>
                  <td className="py-2">WPT Test Bench</td>
                  <td className="py-2 font-medium">122.4 kW</td>
                  <td className="py-2">842.5</td>
                  <td className="py-2 text-emerald-700 font-semibold">Online</td>
                </tr>
                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedMeter("EM-B1-001")}>
                  <td className="py-2 font-mono text-slate-700">EM-B1-001</td>
                  <td className="py-2">Engineering Block</td>
                  <td className="py-2 font-medium">85.6 kW</td>
                  <td className="py-2">612.3</td>
                  <td className="py-2 text-emerald-700 font-semibold">Online</td>
                </tr>
                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedMeter("EM-SOLAR-01")}>
                  <td className="py-2 font-mono text-slate-700">EM-SOLAR-01</td>
                  <td className="py-2">Solar Plant</td>
                  <td className="py-2 font-medium">320.5 kW</td>
                  <td className="py-2">2,186.7</td>
                  <td className="py-2 text-emerald-700 font-semibold">Online</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Initiatives & Targets (3 cols) */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Top Energy Initiatives</h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-900">LED Lighting Upgrade</div>
                  <div className="text-[10px] text-emerald-700 font-medium">In Progress</div>
                </div>
                <span className="font-bold text-slate-900">120 MWh/Y</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-900">Solar Rooftop Installation</div>
                  <div className="text-[10px] text-blue-700 font-medium">Completed</div>
                </div>
                <span className="font-bold text-slate-900">320 MWh/Y</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-900">HVAC Optimization</div>
                  <div className="text-[10px] text-amber-700 font-medium">In Progress</div>
                </div>
                <span className="font-bold text-slate-900">85 MWh/Y</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal: Add Energy Record */}
      {showAddRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Log Energy Meter Reading</h3>
              <button onClick={() => setShowAddRecordModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Energy Meter</label>
                <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500">
                  <option>EM-PE-001 - WPT Test Bench</option>
                  <option>EM-B1-001 - Engineering Block</option>
                  <option>EM-P1-001 - Production Line 1</option>
                  <option>EM-SOLAR-01 - Solar Generation</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Active Power (kW)</label>
                  <input type="number" placeholder="122.4" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Total Consumption (kWh)</label>
                  <input type="number" placeholder="842.5" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowAddRecordModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddRecordModal(false);
                  showToast("Energy meter reading recorded into database.");
                }}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
              >
                Save Reading
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
}

export const Route = createFileRoute("/management/sustainability-management/energy-monitoring")({
  component: EnergyMonitoringPage,
});
