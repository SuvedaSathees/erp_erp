// Magnertia ERP - Environmental Compliance
// Management -> Sustainability Management -> Environmental Compliance
// Replicated from Screenshot: 6 KPI cards, Compliance Master Form, Status Trend Bar, Domain Mix Donut, Permits Summary, Monitoring Results (Stack/ETP/Noise), NCR Ledger & Regulatory Deadlines

import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Plus,
  RefreshCw,
  Download,
  Filter,
  FileText,
  Activity,
  Award,
  AlertCircle,
  Clock,
  Layers,
  Check,
  X,
  TrendingUp,
  Shield,
  FileCheck,
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

interface MonitoringResult {
  id: string;
  parameter: string;
  domain: "Air Quality" | "Effluent / Water" | "Noise Level" | "Hazardous Waste";
  samplingPoint: string;
  observedValue: string;
  prescribedLimit: string;
  unit: string;
  status: "Compliant" | "Attention" | "Exceeded";
  lastTested: string;
  testedBy: string;
}

const INITIAL_MONITORING: MonitoringResult[] = [
  {
    id: "mon-1",
    parameter: "Stack Particulate Matter (PM10)",
    domain: "Air Quality",
    samplingPoint: "Boiler Stack 01",
    observedValue: "28.4",
    prescribedLimit: "< 50.0",
    unit: "mg/Nm3",
    status: "Compliant",
    lastTested: "2026-09-24",
    testedBy: "SGS India Lab",
  },
  {
    id: "mon-2",
    parameter: "ETP Outlet Biochemical Oxygen Demand (BOD)",
    domain: "Effluent / Water",
    samplingPoint: "ZLD Effluent Treatment Plant",
    observedValue: "18.2",
    prescribedLimit: "< 30.0",
    unit: "mg/L",
    status: "Compliant",
    lastTested: "2026-09-25",
    testedBy: "TNPCB Board Lab",
  },
  {
    id: "mon-3",
    parameter: "ETP Chemical Oxygen Demand (COD)",
    domain: "Effluent / Water",
    samplingPoint: "ZLD Final Discharge Sump",
    observedValue: "142.0",
    prescribedLimit: "< 250.0",
    unit: "mg/L",
    status: "Compliant",
    lastTested: "2026-09-25",
    testedBy: "TNPCB Board Lab",
  },
  {
    id: "mon-4",
    parameter: "Effluent Potential of Hydrogen (pH)",
    domain: "Effluent / Water",
    samplingPoint: "Neutralization Pit",
    observedValue: "7.4",
    prescribedLimit: "6.5 - 8.5",
    unit: "pH",
    status: "Compliant",
    lastTested: "2026-09-26",
    testedBy: "Internal Quality Lab",
  },
  {
    id: "mon-5",
    parameter: "Ambient Daytime Noise Level",
    domain: "Noise Level",
    samplingPoint: "Boundary Wall North (Near Substation)",
    observedValue: "68.2",
    prescribedLimit: "< 75.0",
    unit: "dB(A)",
    status: "Compliant",
    lastTested: "2026-09-22",
    testedBy: "Bureau Veritas",
  },
  {
    id: "mon-6",
    parameter: "Volatile Organic Compounds (VOC)",
    domain: "Air Quality",
    samplingPoint: "Battery Anode Slurry Mix Booth",
    observedValue: "4.8",
    prescribedLimit: "< 10.0",
    unit: "ppm",
    status: "Compliant",
    lastTested: "2026-09-20",
    testedBy: "TUV Rheinland",
  },
];

const COMPLIANCE_TREND = [
  { month: "Apr", compliant: 168, nonCompliant: 4 },
  { month: "May", compliant: 172, nonCompliant: 3 },
  { month: "Jun", compliant: 174, nonCompliant: 4 },
  { month: "Jul", compliant: 176, nonCompliant: 2 },
  { month: "Aug", compliant: 179, nonCompliant: 3 },
  { month: "Sep", compliant: 182, nonCompliant: 2 },
  { month: "Oct", compliant: 180, nonCompliant: 2 },
  { month: "Nov", compliant: 184, nonCompliant: 1 },
  { month: "Dec", compliant: 183, nonCompliant: 2 },
  { month: "Jan", compliant: 185, nonCompliant: 1 },
  { month: "Feb", compliant: 185, nonCompliant: 1 },
  { month: "Mar", compliant: 186, nonCompliant: 0 },
];

const DOMAIN_MIX = [
  { name: "Air Quality & Stacks", value: 58, color: "#2563eb" },
  { name: "Water & Effluent (ZLD)", value: 52, color: "#10b981" },
  { name: "Hazardous Materials", value: 38, color: "#f59e0b" },
  { name: "Noise & Vibration", value: 22, color: "#8b5cf6" },
  { name: "E-Waste / Battery EPR", value: 16, color: "#ec4899" },
];

function EnvironmentalCompliancePage() {
  const [selectedPlant, setSelectedPlant] = useState("Gigafactory 1 - Chennai");
  const [reportingYear, setReportingYear] = useState("FY 2024-25");
  const [monitoringList, setMonitoringList] = useState<MonitoringResult[]>(INITIAL_MONITORING);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [newLog, setNewLog] = useState({
    parameter: "",
    domain: "Air Quality" as MonitoringResult["domain"],
    samplingPoint: "",
    observedValue: "",
    prescribedLimit: "",
    unit: "",
    testedBy: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.parameter || !newLog.observedValue) {
      showToast("Please provide parameter and test result.");
      return;
    }

    const created: MonitoringResult = {
      id: `mon-${Date.now()}`,
      parameter: newLog.parameter,
      domain: newLog.domain,
      samplingPoint: newLog.samplingPoint || "Main Processing Outlet",
      observedValue: newLog.observedValue,
      prescribedLimit: newLog.prescribedLimit || "Statutory Norm",
      unit: newLog.unit || "mg/L",
      status: "Compliant",
      lastTested: new Date().toISOString().split("T")[0],
      testedBy: newLog.testedBy || "Accredited Lab",
    };

    setMonitoringList([created, ...monitoringList]);
    setShowAddModal(false);
    setNewLog({
      parameter: "",
      domain: "Air Quality",
      samplingPoint: "",
      observedValue: "",
      prescribedLimit: "",
      unit: "",
      testedBy: "",
    });
    showToast(`Monitoring parameter ${created.parameter} logged successfully.`);
  };

  return (
    <AppShell
      title="Environmental Compliance"
      breadcrumb="Management > Sustainability Management > Environmental Compliance"
      description="Statutory permits, CTO/CTE consent conditions, stack & effluent monitoring, SPCB/CPCB compliance registers & corrective action logs."
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
          icon={ShieldCheck}
          title="Environmental Compliance"
          code="ENV-2026-001"
          programName="Statutory Consents & Emissions Register"
          version="v1.0"
          status="Active"
          subtitle="Statutory permits, CTO/CTE consent conditions, stack & effluent monitoring, SPCB/CPCB compliance registers & corrective action logs."
          primaryActionLabel="+ Log Monitoring Record"
          onPrimaryAction={() => setShowAddModal(true)}
          onGenerateReport={() => showToast("Exporting Annual Statutory Environmental Statement (Form V)...")}
          moreActions={[
            {
              label: "Sync SPCB Real-Time CEMS",
              onClick: () => showToast("CPCB / TNPCB continuous emission servers online & validated."),
            },
            {
              label: "Consent to Operate (CTO) Renewals",
              onClick: () => showToast("CTO Renewal pipeline opened."),
            },
          ]}
        />

        {/* Main Content Area */}
        <div className="space-y-6">
        {/* 6 KPI Cards matching Screenshot 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Total Requirements */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Obligations</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">186</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">100% Tracked</div>
          </div>

          {/* Card 2: Compliance Rate */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Compliance Rate</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">95.8%</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+1.2% vs. Target</span>
            </div>
          </div>

          {/* Card 3: Active Permits */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Active Permits</span>
              <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">18 / 18</div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-1">100% Up to Date</div>
          </div>

          {/* Card 4: Monitoring Records */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Monitoring Logs</span>
              <div className="h-8 w-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">142</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">Stack & Effluent tests</div>
          </div>

          {/* Card 5: Open NCRs */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Open Audit NCRs</span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">7</div>
            <div className="text-[11px] font-semibold text-amber-700 mt-1">4 CAPA in progress</div>
          </div>

          {/* Card 6: Zero Major Incidents */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Reportable Spills</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Shield className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">0</div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-1">412 Safe Days</div>
          </div>
        </div>

        {/* Customizable widget band */}
        <WidgetBand pageId="sustainability-environmental-compliance" />

        {/* Middle Section matching Screenshot 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Master Details Form (3 cols) */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Compliance Master</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                ENV-2024-001
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Program Name</span>
                <span className="font-semibold text-slate-800">Statutory Environmental Compliance</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Statutory Body</span>
                <span className="font-semibold text-slate-800">CPCB & Tamil Nadu SPCB</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Primary Plant</span>
                <span className="font-semibold text-slate-800">{selectedPlant}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Compliance Scope</span>
                <span className="font-semibold text-slate-800">Air, Water, Noise, HW & EPR</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Chief Compliance Officer</span>
                <span className="font-semibold text-slate-800">Dr. Vikram Patel (EHS Head)</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Consent to Operate (CTO)</span>
                <span className="font-semibold text-emerald-700">Valid till March 2027</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Audit Frequency</span>
                <span className="font-semibold text-slate-800">Bi-annual External Audit</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1">Consent Conditions</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Real-time telemetry link with CPCB continuous effluent monitoring system (CEMS) and online stack monitoring with zero tolerance for threshold violations.
                </p>
              </div>
            </div>

            <button
              onClick={() => showToast("Statutory register details opened.")}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors mt-2"
            >
              View Legal Register
            </button>
          </div>

          {/* Center: Compliance Status Trend + Permits Summary (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Status Trend Bar */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Compliance Status Trend
                  </h3>
                  <span className="text-xs text-slate-400">Monthly audit requirements checked</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Compliant
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" /> Action Required
                  </span>
                </div>
              </div>

              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={COMPLIANCE_TREND} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={11} stroke="#64748b" />
                    <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                    <Bar dataKey="compliant" name="Compliant" stackId="a" fill="#10b981" />
                    <Bar dataKey="nonCompliant" name="Action Req." stackId="a" fill="#f87171" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Permits & Consents Status Cards matching Screenshot 2 */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Permits & Consents Status</h3>
                <span className="text-xs font-semibold text-emerald-600">18 Valid Licences</span>
              </div>

              <div className="grid grid-cols-4 gap-2.5 pt-1 text-center">
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div className="text-[11px] text-emerald-800 font-bold">CTO Air & Water</div>
                  <div className="text-xs font-bold text-emerald-900 mt-0.5">TNPCB-2024</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">Valid till 2027</div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div className="text-[11px] text-emerald-800 font-bold">HW Authorization</div>
                  <div className="text-xs font-bold text-emerald-900 mt-0.5">Form 2 Valid</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">5-Yr Schedule</div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div className="text-[11px] text-emerald-800 font-bold">CGWA Extraction</div>
                  <div className="text-xs font-bold text-emerald-900 mt-0.5">NOC-2023-91</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">Valid till 2026</div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                  <div className="text-[11px] text-blue-800 font-bold">Battery EPR Portal</div>
                  <div className="text-xs font-bold text-blue-900 mt-0.5">CPCB-EPR-924</div>
                  <div className="text-[10px] text-blue-600 mt-0.5 font-medium">100% Target Met</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Obligations by Domain Donut & Deadlines (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Domain Mix Donut */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Obligations by Domain</h3>
                <span className="text-xs text-slate-400">186 Total</span>
              </div>

              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DOMAIN_MIX}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {DOMAIN_MIX.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-bold text-slate-900">95.8%</span>
                  <span className="text-[10px] text-slate-400 font-medium">Compliant</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                {DOMAIN_MIX.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-bold text-slate-800 text-[11px]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Upcoming Filings</h3>
                <span className="text-xs font-semibold text-amber-600">3 Due Soon</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/80">
                  <div className="font-semibold text-amber-900">SPCB Annual Environmental Statement</div>
                  <div className="text-[11px] text-amber-700">Form V submission due in 18 days</div>
                </div>

                <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-200/80">
                  <div className="font-semibold text-blue-900">EPR Quarterly Battery Returns</div>
                  <div className="text-[11px] text-blue-700">CPCB Portal filing due Oct 15</div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-semibold text-slate-800">Stack Emission Calibration Audit</div>
                  <div className="text-[11px] text-slate-500">Third-party check due in 35 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Row: Environmental Monitoring Results Table */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Environmental Monitoring Results</h3>
              <p className="text-xs text-slate-400">
                Continuous laboratory test records for stack emissions, effluent discharge & ambient sound levels vs. statutory SPCB limits
              </p>
            </div>
            <button
              onClick={() => showToast("Exporting environmental compliance audit dossier...")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <Download className="h-3.5 w-3.5" /> Export Monitoring Dossier
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Parameter Measured</th>
                  <th className="py-2.5 px-3">Domain</th>
                  <th className="py-2.5 px-3">Sampling Point</th>
                  <th className="py-2.5 px-3">Observed Value</th>
                  <th className="py-2.5 px-3">Prescribed Limit</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Last Tested</th>
                  <th className="py-2.5 px-3">Testing Lab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monitoringList.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{m.parameter}</td>
                    <td className="py-2.5 px-3 text-slate-600">{m.domain}</td>
                    <td className="py-2.5 px-3 text-slate-500">{m.samplingPoint}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{m.observedValue}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-500">{m.prescribedLimit}</td>
                    <td className="py-2.5 px-3 text-slate-500">{m.unit}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {m.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{m.lastTested}</td>
                    <td className="py-2.5 px-3 text-slate-600">{m.testedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Monitoring Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Record Environmental Monitoring Test</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parameter Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ambient PM2.5 at Gate 2"
                  value={newLog.parameter}
                  onChange={(e) => setNewLog({ ...newLog, parameter: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Domain</label>
                  <select
                    value={newLog.domain}
                    onChange={(e) => setNewLog({ ...newLog, domain: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  >
                    <option value="Air Quality">Air Quality</option>
                    <option value="Effluent / Water">Effluent / Water</option>
                    <option value="Noise Level">Noise Level</option>
                    <option value="Hazardous Waste">Hazardous Waste</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sampling Point</label>
                  <input
                    type="text"
                    placeholder="e.g. Stack 02 Outlet"
                    value={newLog.samplingPoint}
                    onChange={(e) => setNewLog({ ...newLog, samplingPoint: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Observed Value</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24.1"
                    value={newLog.observedValue}
                    onChange={(e) => setNewLog({ ...newLog, observedValue: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prescribed Limit</label>
                  <input
                    type="text"
                    placeholder="e.g. < 50.0"
                    value={newLog.prescribedLimit}
                    onChange={(e) => setNewLog({ ...newLog, prescribedLimit: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. mg/Nm3"
                    value={newLog.unit}
                    onChange={(e) => setNewLog({ ...newLog, unit: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Testing Authority / Lab</label>
                <input
                  type="text"
                  placeholder="e.g. SGS India Pvt Ltd"
                  value={newLog.testedBy}
                  onChange={(e) => setNewLog({ ...newLog, testedBy: e.target.value })}
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
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs"
                >
                  Save Test Record
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

export const Route = createFileRoute("/management/sustainability-management/environmental-compliance")({
  component: EnvironmentalCompliancePage,
});
