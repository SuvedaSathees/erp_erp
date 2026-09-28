// Magnertia ERP - Sustainability Reporting
// Management -> Sustainability Management -> Sustainability Reporting
// Replicated from Screenshot: 6 KPI cards, Report Details Form, 5-Year ESG Trend Line Chart, 7-Step Report Development Workflow, Material Topics Priority Ranking, Data Completeness Donut, Material Topics Progress Ledger & Statutory Filing Deadlines

import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Plus,
  RefreshCw,
  Download,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  TrendingUp,
  FileCheck,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Send,
  Eye,
  BookOpen,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { SustainabilityManagementTabBar } from "@/components/erp/SustainabilityManagementTabBar";
import { SustainabilitySubmoduleHeader } from "@/components/erp/SustainabilitySubmoduleHeader";
import { WidgetBand } from "@/widgets/components/WidgetBand";
import { cn } from "@/lib/utils";

interface MaterialTopic {
  id: string;
  topic: string;
  frameworkRef: string;
  category: "Environmental" | "Social" | "Governance";
  baseline: string;
  actualFY25: string;
  target2030: string;
  status: "On Track" | "Achieved" | "Needs Attention";
}

const MATERIAL_TOPICS: MaterialTopic[] = [
  {
    id: "mt-1",
    topic: "Scope 1 & 2 GHG Decarbonization",
    frameworkRef: "GRI 305-1/2 | BRSR P6",
    category: "Environmental",
    baseline: "14,200 tCO2e",
    actualFY25: "8,940 tCO2e",
    target2030: "Net Zero",
    status: "On Track",
  },
  {
    id: "mt-2",
    topic: "Renewable Energy Transition",
    frameworkRef: "GRI 302-1 | BRSR P6",
    category: "Environmental",
    baseline: "22.4%",
    actualFY25: "58.4%",
    target2030: "100% RE",
    status: "On Track",
  },
  {
    id: "mt-3",
    topic: "Zero Liquid Discharge & Water Recirculation",
    frameworkRef: "GRI 303-3 | BRSR P6",
    category: "Environmental",
    baseline: "45.0%",
    actualFY25: "62.5%",
    target2030: "85.0%",
    status: "On Track",
  },
  {
    id: "mt-4",
    topic: "Zero Waste to Landfill (ZWTL)",
    frameworkRef: "GRI 306-4 | BRSR P6",
    category: "Environmental",
    baseline: "64.0%",
    actualFY25: "83.1%",
    target2030: "95.0%",
    status: "On Track",
  },
  {
    id: "mt-5",
    topic: "Battery Cell Life Cycle Safety & Recyclability",
    frameworkRef: "GRI 416-1 | BRSR P9",
    category: "Social",
    baseline: "72.0%",
    actualFY25: "94.2%",
    target2030: "99.0%",
    status: "Achieved",
  },
  {
    id: "mt-6",
    topic: "Diversity, Equity & Shopfloor Inclusion",
    frameworkRef: "GRI 405-1 | BRSR P3",
    category: "Social",
    baseline: "18.5%",
    actualFY25: "34.2%",
    target2030: "45.0%",
    status: "Needs Attention",
  },
  {
    id: "mt-7",
    topic: "Anti-Bribery & Whistleblower Conformance",
    frameworkRef: "GRI 205-2 | BRSR P1",
    category: "Governance",
    baseline: "100%",
    actualFY25: "100%",
    target2030: "100%",
    status: "Achieved",
  },
];

const FIVE_YEAR_TREND = [
  { year: "2021", environmental: 64, social: 72, governance: 85, composite: 73 },
  { year: "2022", environmental: 71, social: 78, governance: 88, composite: 79 },
  { year: "2023", environmental: 78, social: 84, governance: 92, composite: 84 },
  { year: "2024", environmental: 84, social: 89, governance: 96, composite: 89 },
  { year: "2025", environmental: 89, social: 94, governance: 98, composite: 93 },
];

const MATERIALITY_RANKING = [
  { name: "GHG & Climate Action", score: 98, color: "#2563eb" },
  { name: "Renewable Energy Mix", score: 94, color: "#10b981" },
  { name: "Circular Scrap & Recycling", score: 91, color: "#f59e0b" },
  { name: "Water Stewardship (ZLD)", score: 88, color: "#14b8a6" },
  { name: "Battery Safety & EHS", score: 85, color: "#8b5cf6" },
  { name: "Supply Chain Auditing", score: 82, color: "#ec4899" },
  { name: "Workforce Upskilling", score: 79, color: "#06b6d4" },
  { name: "Board Ethics & Governance", score: 76, color: "#64748b" },
];

function SustainabilityReportingPage() {
  const [selectedPlant, setSelectedPlant] = useState("Gigafactory 1 - Chennai");
  const [reportingCycle, setReportingCycle] = useState("FY 2024-25 (Annual)");
  const [topics, setTopics] = useState<MaterialTopic[]>(MATERIAL_TOPICS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeStage, setActiveStage] = useState("5. Assurance");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New report form
  const [newReport, setNewReport] = useState({
    title: "",
    framework: "BRSR Core & GRI Standards",
    boundary: "All Facilities (Operational Control)",
    assurancePartner: "DNV Business Assurance",
    targetPublishDate: "2026-11-30",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.title) {
      showToast("Please enter a report title.");
      return;
    }

    setShowAddModal(false);
    showToast(`Draft report '${newReport.title}' initialized in 7-Step Workflow.`);
  };

  return (
    <AppShell
      title="Sustainability Reporting"
      breadcrumb="Management > Sustainability Management > Sustainability Reporting"
      description="Controlled ERP engine for multi-framework ESG disclosure publication, BRSR Core, GRI Standards, TCFD, materiality prioritization & third-party assurance."
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
          icon={FileText}
          title="Sustainability Reporting"
          code="REP-SUS-001"
          programName="BRSR Core & GRI Comprehensive Disclosure"
          version="v1.0"
          status="Active"
          subtitle="Controlled ERP engine for multi-framework ESG disclosure publication, BRSR Core, GRI Standards, TCFD, materiality prioritization & third-party assurance."
          primaryActionLabel="+ Initialize Report"
          onPrimaryAction={() => setShowAddModal(true)}
          onGenerateReport={() => showToast("Exporting Consolidated BRSR Core & GRI XBRL XBRL Package...")}
          moreActions={[
            {
              label: "Assurance Agency Dossier",
              onClick: () => showToast("Assurance working paper folder opened."),
            },
            {
              label: "TCFD Scenario Analysis",
              onClick: () => showToast("Climate financial disclosures (TCFD) updated."),
            },
          ]}
        />

        {/* Main Content Area */}
        <div className="space-y-6">
        {/* 6 KPI Cards matching Screenshot 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Active Reports */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Active Reports</span>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">8</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">BRSR, GRI, TCFD, CSRD</div>
          </div>

          {/* Card 2: Validated KPI Data Points */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">KPI Data Points</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">486</div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-1">100% Signoff Complete</div>
          </div>

          {/* Card 3: Data Completeness */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Data Completeness</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">95.8%</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+2.4% vs. PY</span>
            </div>
          </div>

          {/* Card 4: Targets On Track */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Targets On Track</span>
              <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">27 / 34</div>
            <div className="text-[11px] font-semibold text-teal-600 mt-1">79.4% On Schedule</div>
          </div>

          {/* Card 5: Reduction Initiatives */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Active Initiatives</span>
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">12</div>
            <div className="text-[11px] font-semibold text-purple-600 mt-1">Across E, S & G</div>
          </div>

          {/* Card 6: Third-Party Assurance Coverage */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Assurance Coverage</span>
              <div className="h-8 w-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">92.0%</div>
            <div className="text-[11px] font-semibold text-cyan-700 mt-1">DNV Limited Assurance</div>
          </div>
        </div>

        {/* Customizable widget band */}
        <WidgetBand pageId="sustainability-reporting" />

        {/* Middle Section matching Screenshot 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Report Details Form (3 cols) */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Report Master</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                REP-2024-001
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Report Title</span>
                <span className="font-semibold text-slate-800">Annual Sustainability & BRSR Report</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Primary Frameworks</span>
                <span className="font-semibold text-slate-800">BRSR Core, GRI 2021, TCFD</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Reporting Boundary</span>
                <span className="font-semibold text-slate-800">Operational Control (All Units)</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Assurance Standard</span>
                <span className="font-semibold text-slate-800">ISAE 3000 / AA1000AS</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Lead Author / CSO</span>
                <span className="font-semibold text-slate-800">Dr. Vikram Patel (Chief Sustainability Officer)</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Assurance Provider</span>
                <span className="font-semibold text-emerald-700">DNV GL Business Assurance</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Scheduled Release</span>
                <span className="font-semibold text-slate-800">November 30, 2026</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1">Assurance Scope</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Independent third-party verification of Scope 1, 2 & 3 carbon accounting, freshwater withdrawal, safety LTIFR metrics, and executive pay ratio governance.
                </p>
              </div>
            </div>

            <Link
              to="/management/sustainability-management/reports"
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              Open Reports Repository <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Center: 5-Year ESG Performance Trend + 7-Step Workflow (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* 5-Year ESG Line Chart */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    5-Year ESG Performance Trend
                  </h3>
                  <span className="text-xs text-slate-400">Scorecard trajectory across ESG pillars</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Env (89%)
                  </span>
                  <span className="flex items-center gap-1 text-blue-600">
                    <span className="h-2 w-2 rounded-full bg-blue-600" /> Soc (94%)
                  </span>
                  <span className="flex items-center gap-1 text-purple-600">
                    <span className="h-2 w-2 rounded-full bg-purple-600" /> Gov (98%)
                  </span>
                </div>
              </div>

              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={FIVE_YEAR_TREND} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={11} stroke="#64748b" />
                    <YAxis domain={[50, 100]} tickLine={false} axisLine={false} fontSize={11} stroke="#64748b" tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                    <Line type="monotone" dataKey="environmental" name="Environmental" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="social" name="Social" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="governance" name="Governance" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 7-Step Report Development Workflow matching Screenshot 1 */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">7-Step Report Development Workflow</h3>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Current Stage: {activeStage}
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 pt-1 text-center">
                {[
                  { step: "1. Collect", pct: "100%", done: true },
                  { step: "2. Validate", pct: "100%", done: true },
                  { step: "3. Consolidate", pct: "100%", done: true },
                  { step: "4. Review", pct: "100%", done: true },
                  { step: "5. Assurance", pct: "92%", active: true },
                  { step: "6. Approval", pct: "Pending", done: false },
                  { step: "7. Publish", pct: "Nov 30", done: false },
                ].map((s) => {
                  const isCurrent = activeStage === s.step;
                  return (
                    <div
                      key={s.step}
                      onClick={() => {
                        setActiveStage(s.step);
                        showToast(`Switched view to Workflow Stage: ${s.step} (${s.pct})`);
                      }}
                      className={cn(
                        "p-2 rounded-xl text-center border transition-all cursor-pointer hover:shadow-xs",
                        isCurrent
                          ? "bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs"
                          : s.done
                          ? "bg-emerald-50/70 border-emerald-200 hover:border-emerald-300"
                          : "bg-slate-50 border-slate-200 opacity-70 hover:opacity-100"
                      )}
                    >
                      <div className="text-[10px] font-bold truncate text-slate-700">{s.step}</div>
                      <div
                        className={cn(
                          "text-[11px] font-extrabold mt-0.5",
                          isCurrent ? "text-indigo-700" : s.done ? "text-emerald-700" : "text-slate-500"
                        )}
                      >
                        {s.pct}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Material Topics Priority Ranking (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Priority Ranking Bar */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Materiality Priority Ranking</h3>
                <span className="text-xs text-slate-400">Top 8</span>
              </div>

              <div className="space-y-2 text-xs">
                {MATERIALITY_RANKING.map((m) => (
                  <div key={m.name}>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                      <span className="truncate pr-2">{m.name}</span>
                      <span className="text-slate-900">{m.score}/100</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.score}%`, backgroundColor: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Statutory Filing Deadlines */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Upcoming Filings</h3>
                <span className="text-xs font-semibold text-indigo-600">SEBI / GRI</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-200/80">
                  <div className="font-semibold text-indigo-900">SEBI BRSR Core Filing</div>
                  <div className="text-[11px] text-indigo-700">Top 250 Listed Companies Mandate</div>
                </div>

                <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
                  <div className="font-semibold text-emerald-900">GRI Standards 2024 Disclosure</div>
                  <div className="text-[11px] text-emerald-700">Digital XBRL Submission</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Row: Material Topics Progress Ledger Table */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Material Topics Progress Ledger</h3>
              <p className="text-xs text-slate-400">
                Disclosures tracked against GRI, BRSR Core and institutional investor ESG requirements
              </p>
            </div>
            <button
              onClick={() => showToast("Exporting BRSR disclosure matrix...")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <Download className="h-3.5 w-3.5" /> Export BRSR Matrix
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Material Topic</th>
                  <th className="py-2.5 px-3">Framework Ref</th>
                  <th className="py-2.5 px-3">Pillar</th>
                  <th className="py-2.5 px-3">Baseline</th>
                  <th className="py-2.5 px-3">FY25 Actual</th>
                  <th className="py-2.5 px-3">Target 2030</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topics.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{t.topic}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{t.frameworkRef}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold",
                          t.category === "Environmental"
                            ? "bg-emerald-100 text-emerald-800"
                            : t.category === "Social"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        )}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{t.baseline}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{t.actualFY25}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{t.target2030}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold",
                          t.status === "Achieved"
                            ? "bg-emerald-100 text-emerald-800"
                            : t.status === "On Track"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        )}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Initialize Report Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Initialize New Sustainability Report</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FY 2025-26 Integrated Sustainability & ESG Report"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Frameworks</label>
                  <select
                    value={newReport.framework}
                    onChange={(e) => setNewReport({ ...newReport, framework: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  >
                    <option value="BRSR Core & GRI Standards">BRSR Core & GRI Standards</option>
                    <option value="TCFD Climate Disclosure">TCFD Climate Disclosure</option>
                    <option value="CSRD / ESRS European Standards">CSRD / ESRS European Standards</option>
                    <option value="CDP Climate Response">CDP Climate Response</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assurance Partner</label>
                  <input
                    type="text"
                    value={newReport.assurancePartner}
                    onChange={(e) => setNewReport({ ...newReport, assurancePartner: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reporting Boundary</label>
                <input
                  type="text"
                  value={newReport.boundary}
                  onChange={(e) => setNewReport({ ...newReport, boundary: e.target.value })}
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
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Create & Launch Workflow
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

export const Route = createFileRoute("/management/sustainability-management/sustainability-reporting")({
  component: SustainabilityReportingPage,
});
