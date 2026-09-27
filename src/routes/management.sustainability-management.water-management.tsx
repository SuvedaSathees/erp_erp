// Magnertia ERP - Water Management
// Management -> Sustainability Management -> Water Management
// Aligned with Light Enterprise Theme (Image 2 Reference)

import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Droplet,
  Recycle,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  FileText,
  Save,
  Send,
  Download,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Plus,
  RefreshCw,
  Building2,
  Activity,
  Layers,
  MapPin,
  Clock,
  Sparkles,
  DollarSign,
  ChevronRight,
  Radio,
  X,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { SustainabilityManagementTabBar } from "@/components/erp/SustainabilityManagementTabBar";
import { SustainabilitySubmoduleHeader } from "@/components/erp/SustainabilitySubmoduleHeader";
import { WidgetBand } from "@/widgets/components/WidgetBand";
import { cn } from "@/lib/utils";
import { mockWaterManagement } from "@/services/sustainabilityManagementService";

function WaterManagementPage() {
  const [selectedPlant, setSelectedPlant] = useState("Gigafactory 1 - Chennai");
  const [reportingPeriod, setReportingPeriod] = useState("FY 2026");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [data, setData] = useState(mockWaterManagement);
  const [showAddWaterModal, setShowAddWaterModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedMeterPin, setSelectedMeterPin] = useState<string | null>("WM-PL-001");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="Water Management"
      breadcrumb="Management > Sustainability Management > Water Management"
      description="Every Drop Builds a Better Tomorrow • Conserve Water. Sustain Tomorrow • Zero Liquid Discharge (ZLD)"
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
          icon={Droplet}
          title="Water Management"
          code="WM-2026-001"
          programName="Zero Liquid Discharge & Circular Water"
          version="v1.0"
          status="Active"
          subtitle="Every Drop Builds a Better Tomorrow • Conserve Water. Sustain Tomorrow • Zero Liquid Discharge (ZLD)"
          primaryActionLabel="+ Add Water Reading"
          onPrimaryAction={() => setShowAddWaterModal(true)}
          onGenerateReport={() => setShowReportModal(true)}
          moreActions={[
            {
              label: "Sync Smart Flow Meters",
              onClick: () => showToast("Smart IoT Flow Meters synchronized."),
            },
            {
              label: "Recycling & STP Audit",
              onClick: () => showToast("Recycling and Sewage Treatment Plant audit log opened."),
            },
          ]}
        />

        {/* Main Content Area */}
        <div className="space-y-6">
        {/* 6 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* Card 1: Total Water Intake */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Water Intake</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Droplet className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">2.48 <span className="text-xs font-normal text-slate-500">ML</span></div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-8% vs prev period</span>
            </div>
          </div>

          {/* Card 2: Water Consumption */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Water Consumption</span>
              <div className="h-8 w-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Droplet className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">2.16 <span className="text-xs font-normal text-slate-500">ML</span></div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-10% vs prev period</span>
            </div>
          </div>

          {/* Card 3: Recycled Water */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Recycled Water</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Recycle className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">38%</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+12% vs prev period</span>
            </div>
          </div>

          {/* Card 4: Water Intensity */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Water Intensity</span>
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">16.8 <span className="text-xs font-normal text-slate-500">L/u</span></div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-14% vs prev period</span>
            </div>
          </div>

          {/* Card 5: Water Cost */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Water Cost</span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">₹ 12.4 <span className="text-xs font-normal text-slate-500">L</span></div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-6% vs prev period</span>
            </div>
          </div>

          {/* Card 6: Compliance */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">ZLD Compliance</span>
              <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">100%</div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-1">0 Open Issues</div>
          </div>
        </div>

        {/* Customizable widget band */}
        <WidgetBand pageId="sustainability-water-management" />

        {/* Row 1: Details & Trend & Source Mix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Water Management Details (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">1. Water Management Details</h3>
              <span className="text-blue-700 font-mono font-semibold">WM-2026-001</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Monitoring Type:</span>
                <span className="text-slate-800 font-medium">Facility Water Monitoring</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Water Framework:</span>
                <span className="text-slate-800 font-medium">ISO 14046 / ZLD</span>
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
                <span className="text-slate-500">Building / Area:</span>
                <span className="text-slate-800">Main Plant</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Water Owner:</span>
                <span className="text-slate-900 font-semibold">Arun Kumar</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Coordinator:</span>
                <span className="text-slate-900 font-semibold">Ramesh S</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Water Stress:</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 border border-amber-200 font-bold">Medium</span>
              </div>
              <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed mt-1">
                Monitor, manage and reduce water consumption across plant operations with a focus on recycling, reuse and Zero Liquid Discharge (ZLD).
              </p>
            </div>
          </div>

          {/* Water Consumption Trend & Mini KPIs (5 cols) */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Water Consumption Trend</h3>
              <span className="text-xs text-slate-500">Monthly (Last 12 Months)</span>
            </div>

            <div className="h-36 flex items-end justify-between gap-2 pt-2 px-1">
              {[
                { m: "Jan", fresh: 130, rec: 50 },
                { m: "Feb", fresh: 125, rec: 55 },
                { m: "Mar", fresh: 120, rec: 60 },
                { m: "Apr", fresh: 135, rec: 62 },
                { m: "May", fresh: 145, rec: 70 },
                { m: "Jun", fresh: 150, rec: 75 },
                { m: "Jul", fresh: 140, rec: 78 },
                { m: "Aug", fresh: 138, rec: 80 },
                { m: "Sep", fresh: 134, rec: 82 },
              ].map((p) => (
                <div key={p.m} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end h-28 gap-0.5">
                    <div style={{ height: `${(p.rec / 240) * 100}%` }} className="w-full bg-emerald-500 rounded-t" title={`Recycled: ${p.rec} kL`} />
                    <div style={{ height: `${(p.fresh / 240) * 100}%` }} className="w-full bg-blue-500" title={`Freshwater: ${p.fresh} kL`} />
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{p.m}</span>
                </div>
              ))}
            </div>

            {/* Below chart: 4 Mini Cards matching Screenshot 2 */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="font-bold text-blue-700">1.54 ML</div>
                <div className="text-[9px] text-slate-500">Freshwater Intake</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="font-bold text-emerald-700">0.94 ML</div>
                <div className="text-[9px] text-slate-500">Recycled / Reused</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="font-bold text-cyan-700">0.62 ML</div>
                <div className="text-[9px] text-slate-500">Total Discharge</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="font-bold text-emerald-700">100%</div>
                <div className="text-[9px] text-slate-500">Quality Limits</div>
              </div>
            </div>
          </div>

          {/* Right: Water Source Mix & Targets (3 cols) */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Water Source Mix (FY 2026)</h3>
            <div className="py-2 flex flex-col items-center justify-center">
              <div className="h-24 w-24 rounded-full border-6 border-blue-500 border-t-teal-400 border-r-emerald-500 border-b-purple-500 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-900">2.48</span>
                <span className="text-[9px] text-slate-500">ML Intake</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-700 p-1 rounded bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Municipal</span>
                <strong className="text-slate-900">42%</strong>
              </div>
              <div className="flex justify-between text-slate-700 p-1 rounded bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-500" /> Borewell</span>
                <strong className="text-slate-900">24%</strong>
              </div>
              <div className="flex justify-between text-slate-700 p-1 rounded bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Recycled</span>
                <strong className="text-slate-900">18%</strong>
              </div>
              <div className="flex justify-between text-slate-700 p-1 rounded bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Rainwater</span>
                <strong className="text-slate-900">8%</strong>
              </div>
              <div className="flex justify-between text-slate-700 p-1 rounded bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Treated WW</span>
                <strong className="text-slate-900">6%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Recent Data, Efficiency Initiatives & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Water Data Table (5 cols) */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Recent Water Data</h3>
              <button onClick={() => showToast("Opened full water logs ledger.")} className="text-xs text-blue-600 font-semibold hover:underline">
                View All
              </button>
            </div>

            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2">Date & Time</th>
                  <th className="py-2">Meter</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Volume</th>
                  <th className="py-2">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2">28 Sep, 10:00</td>
                  <td className="py-2 font-mono font-semibold text-blue-700">WM-PL-001</td>
                  <td className="py-2">Intake</td>
                  <td className="py-2 font-bold text-slate-900">125.4 m³</td>
                  <td className="py-2 text-slate-500">IoT</td>
                </tr>
                <tr>
                  <td className="py-2">28 Sep, 10:00</td>
                  <td className="py-2 font-mono font-semibold text-cyan-700">WM-PL-002</td>
                  <td className="py-2">Consumption</td>
                  <td className="py-2 font-bold text-slate-900">98.2 m³</td>
                  <td className="py-2 text-slate-500">SCADA</td>
                </tr>
                <tr>
                  <td className="py-2">28 Sep, 09:00</td>
                  <td className="py-2 font-mono font-semibold text-emerald-700">WM-RO-001</td>
                  <td className="py-2">Recycled</td>
                  <td className="py-2 font-bold text-slate-900">52.1 m³</td>
                  <td className="py-2 text-slate-500">IoT</td>
                </tr>
                <tr>
                  <td className="py-2">28 Sep, 08:00</td>
                  <td className="py-2 font-mono font-semibold text-purple-700">WM-ETP-001</td>
                  <td className="py-2">Discharge</td>
                  <td className="py-2 font-bold text-slate-900">31.6 m³</td>
                  <td className="py-2 text-slate-500">EMS</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Top Water Efficiency Initiatives (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Top Water Initiatives</h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-900">Cooling Tower Optimization</div>
                  <span className="text-[10px] text-amber-700 font-medium">In Progress</span>
                </div>
                <span className="font-bold text-emerald-700">0.25 ML/Y</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-900">RO Reject Recovery</div>
                  <span className="text-[10px] text-emerald-700 font-medium">In Progress</span>
                </div>
                <span className="font-bold text-emerald-700">0.18 ML/Y</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-900">Rainwater Harvesting Expansion</div>
                  <span className="text-[10px] text-blue-700 font-medium">Planned</span>
                </div>
                <span className="font-bold text-emerald-700">0.40 ML/Y</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-900">Process Water Recirculation</div>
                  <span className="text-[10px] text-emerald-700 font-medium">Active</span>
                </div>
                <span className="font-bold text-emerald-700">0.22 ML/Y</span>
              </div>
            </div>
          </div>

          {/* Alerts & Notifications (3 cols) */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Alerts & Notifications</h3>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                <div className="font-semibold">High water consumption detected</div>
                <div className="text-[10px] text-rose-600">WM-PL-002 &bull; 2 hours ago</div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                <div className="font-semibold">Tank level below minimum (TK-01)</div>
                <div className="text-[10px] text-amber-600">Main Tank &bull; 4 hours ago</div>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                <div className="font-semibold">Water quality parameter normal (TDS)</div>
                <div className="text-[10px] text-blue-600">Lab &bull; 6 hours ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Water Meter Location Map & Water Balance Flow Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Water Meter Location Map (5 cols) */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-blue-600" />
                Water Meter Location Map
              </h3>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Active</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Warning</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Offline</span>
              </div>
            </div>

            {/* Campus Map Graphic Container */}
            <div className="relative h-44 w-full rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-4">
              <div className="grid grid-cols-3 gap-3 w-full text-center text-xs">
                <div
                  onClick={() => { setSelectedMeterPin("WM-PL-001"); showToast("Main Plant Water Meter: 125.4 m3 (Normal)"); }}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 cursor-pointer transition-all"
                >
                  <div className="text-emerald-700 font-bold">Main Plant</div>
                  <div className="text-[10px] text-slate-500 font-mono">WM-PL-001</div>
                </div>
                <div
                  onClick={() => { setSelectedMeterPin("WM-ETP-001"); showToast("ETP Recycling Unit: 52.1 m3 (Active Recirculation)"); }}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-500 cursor-pointer transition-all"
                >
                  <div className="text-blue-700 font-bold">ETP Plant</div>
                  <div className="text-[10px] text-slate-500 font-mono">WM-ETP-001</div>
                </div>
                <div
                  onClick={() => { setSelectedMeterPin("WM-RD-001"); showToast("R&D Block Cooling Loop: 24.8 m3 (Normal)"); }}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-cyan-500 cursor-pointer transition-all"
                >
                  <div className="text-cyan-700 font-bold">R&D Block</div>
                  <div className="text-[10px] text-slate-500 font-mono">WM-RD-001</div>
                </div>
              </div>
            </div>
          </div>

          {/* Water Balance Flow Diagram (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Water Balance (FY 2026)</h3>
            <div className="flex items-center justify-between gap-2 py-4">
              <div className="space-y-3 text-xs text-center">
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-bold">Freshwater<br />1.54 ML</div>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">Recycled<br />0.94 ML</div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[12px] text-slate-400 font-bold">&rarr;</span>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs shadow-xs">
                  <div className="font-extrabold text-slate-900">Total Intake</div>
                  <div className="text-blue-700 font-bold">2.48 ML</div>
                </div>
                <span className="text-[12px] text-slate-400 font-bold">&rarr;</span>
              </div>
              <div className="space-y-2 text-xs text-center">
                <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900 font-semibold">Consumed: 2.16 ML</div>
                <div className="p-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 font-semibold">Discharge: 0.62 ML</div>
                <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-semibold">Losses: 0.10 ML</div>
              </div>
            </div>
          </div>

          {/* Documents & Reports (3 cols) */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Documents & Reports</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-900">Water_Management_Report_FY2026.pdf</div>
                  <div className="text-[10px] text-slate-500">2.4 MB &bull; 28 Sep 2026</div>
                </div>
                <button onClick={() => showToast("Downloading Water Report PDF.")} className="p-1 text-slate-500 hover:text-blue-600">
                  <Download className="h-4 w-4" />
                </button>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-900">Water_Quality_Test_Report.pdf</div>
                  <div className="text-[10px] text-slate-500">1.8 MB &bull; 26 Sep 2026</div>
                </div>
                <button onClick={() => showToast("Downloading Quality Report.")} className="p-1 text-slate-500 hover:text-blue-600">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Water Reading */}
      {showAddWaterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Log Water Meter Reading</h3>
              <button onClick={() => setShowAddWaterModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Water Meter</label>
                <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>WM-PL-001 - Main Plant Intake</option>
                  <option>WM-PL-002 - Production Consumption</option>
                  <option>WM-RO-001 - RO Recycled Flow</option>
                  <option>WM-ETP-001 - ETP Treated Discharge</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Reading (m³)</label>
                  <input type="number" placeholder="125.4" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Source</label>
                  <input type="text" defaultValue="Smart IoT Flow Meter" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowAddWaterModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddWaterModal(false);
                  showToast("Water reading logged and balance updated.");
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Save Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Generate Water Report */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Generate Water Management Report</h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Report Type</label>
                <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Zero Liquid Discharge (ZLD) Compliance Audit</option>
                  <option>Water Consumption & Recycling Performance Dossier</option>
                  <option>Water Risk Assessment (Aqueduct / Water Stress)</option>
                  <option>ETP Effluent Lab Quality Compliance Certificate</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Reporting Period</label>
                  <input type="month" defaultValue="2026-09" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Output Format</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>PDF Report (Executive Summary)</option>
                    <option>Excel Raw SCADA Flow Dataset</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowReportModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  showToast("Water Management Report generated and downloaded.");
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Generate & Download
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
}

export const Route = createFileRoute("/management/sustainability-management/water-management")({
  component: WaterManagementPage,
});
