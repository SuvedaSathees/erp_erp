// Magnertia ERP - ESG Management
// Management -> Sustainability Management -> ESG
// Aligned with Light Enterprise Theme (Image 2 Reference)

import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Leaf,
  Users,
  Shield,
  Cloud,
  Recycle,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  FileText,
  Plus,
  Download,
  MoreVertical,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  Info,
  Edit2,
  Share2,
  Lock,
  RefreshCw,
  Building2,
  Award,
  X,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { SustainabilityManagementTabBar } from "@/components/erp/SustainabilityManagementTabBar";
import { SustainabilitySubmoduleHeader } from "@/components/erp/SustainabilitySubmoduleHeader";
import { WidgetBand } from "@/widgets/components/WidgetBand";
import { cn } from "@/lib/utils";
import { mockESGProgram } from "@/services/sustainabilityManagementService";

function ESGManagementPage() {
  const [selectedPlant, setSelectedPlant] = useState("Gigafactory 1 - Chennai");
  const [selectedYear, setSelectedYear] = useState("FY 2026");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showAddKPIModal, setShowAddKPIModal] = useState(false);
  const [showCreateInitiativeModal, setShowCreateInitiativeModal] = useState(false);
  const [showRecordMeetingModal, setShowRecordMeetingModal] = useState(false);
  const [showUploadEvidenceModal, setShowUploadEvidenceModal] = useState(false);
  const [showLogRiskModal, setShowLogRiskModal] = useState(false);
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [editProgramDetails, setEditProgramDetails] = useState(false);

  // Form states
  const [programData, setProgramData] = useState(mockESGProgram);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="ESG"
      breadcrumb="Management > Sustainability Management > ESG"
      description="Building a Sustainable Tomorrow • Measure. Target. Implement. Monitor. Verify. Report. Disclose. Improve."
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

        {/* Executive Submodule Header Matching User Screenshot */}
        <SustainabilitySubmoduleHeader
          icon={Leaf}
          title="ESG"
          code="ESG-2026-001"
          programName="Sustainable Growth 2030"
          version="v1.0"
          status="Active"
          subtitle="Building a Sustainable Tomorrow • Measure. Target. Implement. Monitor. Verify. Report. Disclose. Improve."
          primaryActionLabel="+ New ESG Program"
          onPrimaryAction={() => setShowProgramModal(true)}
          onGenerateReport={() => setShowGenerateReportModal(true)}
          moreActions={[
            {
              label: "Add KPI Data",
              onClick: () => setShowAddKPIModal(true),
            },
            {
              label: "Upload Evidence",
              onClick: () => setShowUploadEvidenceModal(true),
            },
            {
              label: "Log Risk",
              onClick: () => setShowLogRiskModal(true),
            },
          ]}
        />

        {/* Main Content Area */}
        <div className="space-y-6">
        {/* 6 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* Card 1: Total Initiatives */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Initiatives</span>
              <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Leaf className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">42</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+20% vs FY25</span>
            </div>
          </div>

          {/* Card 2: Environmental Target */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Environmental Target</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Leaf className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">87%</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">Achievement: On Track</div>
          </div>

          {/* Card 3: Social Target */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Social Target</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">94%</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">Achievement: On Track</div>
          </div>

          {/* Card 4: Governance Compliance */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Governance Compliance</span>
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Shield className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">98%</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">100% Policy Closure</div>
          </div>

          {/* Card 5: GHG Emission Reduction */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">GHG Reduction</span>
              <div className="h-8 w-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Cloud className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">18%</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>Ahead of Target</span>
            </div>
          </div>

          {/* Card 6: Waste Recycling Rate */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Waste Recycling Rate</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Recycle className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">76%</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">83.1% Diversion</div>
          </div>
        </div>

        {/* Customizable widget band */}
        <WidgetBand pageId="sustainability-esg" />

        {/* Main Content Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (4 cols): ESG Program Details */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">ESG Program Details</h3>
              <button
                onClick={() => setEditProgramDetails(!editProgramDetails)}
                className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                <Edit2 className="h-3 w-3" />
                {editProgramDetails ? "Save" : "Edit"}
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">ESG ID:</span>
                <span className="font-mono font-semibold text-slate-900">{programData.esgId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Program Name:</span>
                <span className="font-medium text-slate-900">{programData.programName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Framework:</span>
                <span className="text-slate-700 font-medium">{programData.frameworks.join(", ")}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pillars:</span>
                <div className="flex gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">E</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">S</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">G</span>
                </div>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Category:</span>
                <span className="text-slate-700">{programData.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Organization:</span>
                <span className="text-slate-700">{programData.organization}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Owner:</span>
                <span className="flex items-center gap-1.5 text-slate-900 font-medium">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                    {programData.owner.avatar}
                  </span>
                  {programData.owner.name}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Reporting Period:</span>
                <span className="text-slate-700">{programData.reportingPeriod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Priority:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  {programData.priority}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {programData.status}
                </span>
              </div>
              <div className="py-1">
                <span className="text-slate-500 block mb-1">Description:</span>
                <p className="text-slate-600 text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {programData.description}
                </p>
              </div>
            </div>
          </div>

          {/* Center Column (5 cols): ESG Performance Overview */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">ESG Performance Overview</h3>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded px-2.5 py-1 shadow-2xs focus:outline-none"
              >
                <option value="FY 2026">FY 2026</option>
                <option value="FY 2025">FY 2025</option>
              </select>
            </div>

            {/* 3 Circular Displays */}
            <div className="grid grid-cols-3 gap-3 text-center py-2">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <div className="relative inline-flex items-center justify-center">
                  <div className="text-3xl font-extrabold text-emerald-700">87%</div>
                </div>
                <div className="text-xs font-semibold text-emerald-900 mt-2 flex items-center justify-center gap-1">
                  <Leaf className="h-3 w-3 text-emerald-600" /> Environmental
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
                <div className="relative inline-flex items-center justify-center">
                  <div className="text-3xl font-extrabold text-blue-700">94%</div>
                </div>
                <div className="text-xs font-semibold text-blue-900 mt-2 flex items-center justify-center gap-1">
                  <Users className="h-3 w-3 text-blue-600" /> Social
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200">
                <div className="relative inline-flex items-center justify-center">
                  <div className="text-3xl font-extrabold text-purple-700">98%</div>
                </div>
                <div className="text-xs font-semibold text-purple-900 mt-2 flex items-center justify-center gap-1">
                  <Shield className="h-3 w-3 text-purple-600" /> Governance
                </div>
              </div>
            </div>

            {/* Granular Pillar Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[11px] font-bold text-emerald-700 mb-1">Environmental</div>
                <div className="flex justify-between text-slate-600">
                  <span>Energy Consumption</span>
                  <span className="font-semibold text-emerald-600">&darr; 12%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GHG Emissions</span>
                  <span className="font-semibold text-emerald-600">&darr; 18%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Water Usage</span>
                  <span className="font-semibold text-emerald-600">&darr; 10%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Waste Recycling</span>
                  <span className="font-semibold text-emerald-600">&uarr; 76%</span>
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[11px] font-bold text-blue-700 mb-1">Social & Governance</div>
                <div className="flex justify-between text-slate-600">
                  <span>Employee Safety</span>
                  <span className="font-semibold text-emerald-600">&uarr; 96%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Training Hours</span>
                  <span className="font-semibold text-emerald-600">&uarr; 42%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Compliance Rate</span>
                  <span className="font-semibold text-purple-700">98%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Audit Findings Closed</span>
                  <span className="font-semibold text-purple-700">100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (3 cols): Quick Actions & Upcoming Activities */}
          <div className="lg:col-span-3 space-y-4">
            {/* Quick Actions */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setShowAddKPIModal(true)}
                  className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-center font-medium transition-colors"
                >
                  Add KPI Data
                </button>
                <button
                  onClick={() => setShowCreateInitiativeModal(true)}
                  className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-center font-medium transition-colors"
                >
                  Create Initiative
                </button>
                <button
                  onClick={() => setShowRecordMeetingModal(true)}
                  className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-center font-medium transition-colors"
                >
                  Record Meeting
                </button>
                <button
                  onClick={() => setShowUploadEvidenceModal(true)}
                  className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-center font-medium transition-colors"
                >
                  Upload Evidence
                </button>
                <button
                  onClick={() => setShowLogRiskModal(true)}
                  className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-center font-medium transition-colors"
                >
                  Log Risk
                </button>
                <button
                  onClick={() => setShowGenerateReportModal(true)}
                  className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-center font-semibold shadow-xs transition-colors"
                >
                  Generate Report
                </button>
              </div>
            </div>

            {/* Upcoming ESG Activities */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Upcoming ESG Activities</h4>
                <button onClick={() => showToast("Full calendar opened.")} className="text-[10px] text-emerald-600 font-semibold hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="text-center px-1.5 py-0.5 rounded bg-emerald-100 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      SEP<br />22
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Quarterly ESG Review</div>
                      <div className="text-[10px] text-slate-500">10:00 AM - 11:30 AM</div>
                    </div>
                  </div>
                  <button onClick={() => showToast("Joined Quarterly ESG Review")} className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold">
                    Join
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="text-center px-1.5 py-0.5 rounded bg-blue-100 text-[10px] font-bold text-blue-800 border border-blue-200">
                      SEP<br />28
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Supplier ESG Assessment</div>
                      <div className="text-[10px] text-slate-500">09:00 AM - 05:00 PM</div>
                    </div>
                  </div>
                  <button onClick={() => showToast("Supplier ESG audit details displayed.")} className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-medium">
                    View
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="text-center px-1.5 py-0.5 rounded bg-cyan-100 text-[10px] font-bold text-cyan-800 border border-cyan-200">
                      OCT<br />05
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">GHG Data Submission</div>
                      <div className="text-[10px] text-slate-500">All Sites</div>
                    </div>
                  </div>
                  <button onClick={() => showToast("GHG Data Submission portal opened.")} className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Row 2: Charts and Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Key ESG Metrics Trend (6 cols) */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Key ESG Metrics Trend</h3>
                <p className="text-xs text-slate-500">Energy, GHG, Water & Waste progress</p>
              </div>
              <span className="text-xs text-slate-500 font-medium">Last 12 Months</span>
            </div>

            {/* Visual Multi-Line Chart Representation */}
            <div className="h-44 flex items-end gap-3 pt-4 px-2">
              {[
                { m: "Jan", val1: 40, val2: 50, val3: 30, val4: 65 },
                { m: "Feb", val1: 42, val2: 48, val3: 32, val4: 68 },
                { m: "Mar", val1: 45, val2: 45, val3: 35, val4: 70 },
                { m: "Apr", val1: 48, val2: 42, val3: 38, val4: 71 },
                { m: "May", val1: 52, val2: 40, val3: 40, val4: 73 },
                { m: "Jun", val1: 55, val2: 38, val3: 42, val4: 74 },
                { m: "Jul", val1: 58, val2: 35, val3: 45, val4: 75 },
                { m: "Aug", val1: 60, val2: 32, val3: 48, val4: 76 },
                { m: "Sep", val1: 62, val2: 30, val3: 50, val4: 76 },
              ].map((point) => (
                <div key={point.m} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="w-full flex items-end justify-center gap-1 h-32">
                    <div style={{ height: `${point.val1}%` }} className="w-1.5 bg-emerald-500 rounded-t" title={`Energy: ${point.val1}`} />
                    <div style={{ height: `${point.val2}%` }} className="w-1.5 bg-teal-500 rounded-t" title={`GHG: ${point.val2}`} />
                    <div style={{ height: `${point.val3}%` }} className="w-1.5 bg-blue-500 rounded-t" title={`Water: ${point.val3}`} />
                    <div style={{ height: `${point.val4}%` }} className="w-1.5 bg-purple-500 rounded-t" title={`Recycling: ${point.val4}%`} />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{point.m}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Energy</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500" /> GHG Emissions</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Water Usage</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Waste Recycling</span>
            </div>
          </div>

          {/* Initiatives Status (3 cols) */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Initiatives Status</h3>
              <span className="text-xs font-bold text-emerald-600">42 Total</span>
            </div>

            <div className="py-2 flex flex-col items-center justify-center">
              <div className="relative h-28 w-28 rounded-full border-8 border-emerald-500 border-t-blue-500 border-r-amber-400 border-b-slate-200 flex items-center justify-center">
                <span className="text-xl font-extrabold text-slate-900">42</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
                </span>
                <span className="font-bold text-slate-900">14 (33%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> In Progress
                </span>
                <span className="font-bold text-slate-900">20 (48%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Not Started
                </span>
                <span className="font-bold text-slate-900">6 (14%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> On Hold
                </span>
                <span className="font-bold text-slate-900">2 (5%)</span>
              </div>
            </div>
          </div>

          {/* ESG Risks (3 cols) */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">ESG Risks</h3>
              <button onClick={() => showToast("Opened Enterprise ESG Risk Register.")} className="text-xs text-emerald-600 font-semibold hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Climate Regulation Changes</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">E</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span className="text-red-600 font-semibold">Priority: High</span>
                  <span className="text-amber-700 font-medium">Status: Open</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Supply Chain ESG Risk</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">S</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span className="text-amber-600 font-semibold">Priority: Medium</span>
                  <span className="text-emerald-700 font-medium">Status: Mitigating</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Data Privacy Breach</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">G</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span className="text-red-600 font-semibold">Priority: High</span>
                  <span className="text-amber-700 font-medium">Status: Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Row 3: Recent Activities & SDGs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Activities (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Recent Activities</h3>
              <button onClick={() => showToast("Displaying all 140 activity logs.")} className="text-xs text-emerald-600 font-semibold hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px] shrink-0">PS</div>
                <div>
                  <p className="text-slate-700"><strong>Priya Sharma</strong> uploaded document <span className="text-emerald-700 font-medium">Sustainability_Policy_v2.0.pdf</span></p>
                  <span className="text-[10px] text-slate-400">2 hours ago</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">RS</div>
                <div>
                  <p className="text-slate-700"><strong>Ramesh S</strong> updated KPI data for <span className="text-slate-900 font-medium">Energy Consumption - Sep 2026</span></p>
                  <span className="text-[10px] text-slate-400">4 hours ago</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px] shrink-0">VK</div>
                <div>
                  <p className="text-slate-700"><strong>Vijay K</strong> created new initiative <span className="text-slate-900 font-medium">Solar Canopy Expansion</span></p>
                  <span className="text-[10px] text-slate-400">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* ESG Reports (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">ESG Reports</h3>
              <button onClick={() => showToast("Opening ESG Reports Repository.")} className="text-xs text-emerald-600 font-semibold hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-900">ESG Annual Report</div>
                  <div className="text-[10px] text-slate-500">FY 2026 &bull; In Progress</div>
                </div>
                <button onClick={() => showToast("Downloading ESG Annual Report preview.")} className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-medium">
                  View
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-900">BRSR Report (India)</div>
                  <div className="text-[10px] text-slate-500">FY 2026 &bull; Draft</div>
                </div>
                <button onClick={() => showToast("Opening SEBI BRSR disclosure form.")} className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-medium">
                  View
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-900">GHG Emissions Report</div>
                  <div className="text-[10px] text-slate-500">Q2 2026 &bull; Completed</div>
                </div>
                <button onClick={() => showToast("Downloading GHG Emissions Report.")} className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-medium">
                  View
                </button>
              </div>
            </div>
          </div>

          {/* SDGs Banner (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Sustainable Development Goals (SDGs)</h3>
            <p className="text-xs text-slate-500">Contributing to a Sustainable and Inclusive Future</p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-bold flex items-center gap-2">
                <span className="text-base text-amber-700">7</span> Affordable & Clean Energy
              </div>
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-900 font-bold flex items-center gap-2">
                <span className="text-base text-red-700">8</span> Decent Work & Growth
              </div>
              <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-900 font-bold flex items-center gap-2">
                <span className="text-base text-orange-700">12</span> Responsible Consumption
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center gap-2">
                <span className="text-base text-emerald-700">13</span> Climate Action
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal: New ESG Program */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create New ESG Program</h3>
              <button onClick={() => setShowProgramModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Program Name</label>
                <input
                  type="text"
                  placeholder="e.g. Net-Zero Value Chain 2035"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Reporting Period</label>
                  <input
                    type="text"
                    defaultValue="FY 2026-27"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option>High</option>
                    <option>Critical</option>
                    <option>Medium</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowProgramModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowProgramModal(false);
                  showToast("New ESG program registered successfully.");
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Create Program
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal: Add KPI Data */}
      {showAddKPIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add ESG KPI Metric Reading</h3>
              <button onClick={() => setShowAddKPIModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">KPI Metric</label>
                <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <option>Energy Consumption (kWh)</option>
                  <option>Scope 1 GHG Direct Emissions (tCO2e)</option>
                  <option>Water Consumption (kL)</option>
                  <option>Waste Recycled (%)</option>
                  <option>Employee Training Hours</option>
                  <option>Safety Incident Rate</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Actual Value</label>
                  <input type="number" placeholder="e.g. 1250" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Reporting Month</label>
                  <input type="month" defaultValue="2026-09" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowAddKPIModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddKPIModal(false);
                  showToast("ESG KPI metric reading recorded and verified.");
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Submit Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal: Generate Report */}
      {showGenerateReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Generate ESG Disclosure Report</h3>
              <button onClick={() => setShowGenerateReportModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Report Standard</label>
                <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <option>GRI Standards 2021 (Integrated Disclosure)</option>
                  <option>SEBI BRSR (Business Responsibility & Sustainability)</option>
                  <option>UN Global Compact Communication on Progress</option>
                  <option>Executive ESG Dashboard Summary</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Export Format</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-slate-700">
                    <input type="radio" name="fmt" defaultChecked /> PDF Report
                  </label>
                  <label className="flex items-center gap-1.5 text-slate-700">
                    <input type="radio" name="fmt" /> Excel Data Book
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowGenerateReportModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowGenerateReportModal(false);
                  showToast("ESG Disclosure Report generated and ready for download.");
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Generate & Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal: Create Initiative */}
      {showCreateInitiativeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create Sustainability Initiative</h3>
              <button onClick={() => setShowCreateInitiativeModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Initiative Title</label>
                <input type="text" placeholder="e.g. Solar Wheeling & Virtual PPA Expansion" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ESG Pillar</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option>Environmental (E)</option>
                    <option>Social (S)</option>
                    <option>Governance (G)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Responsible Owner</label>
                  <input type="text" defaultValue="Arun Kumar (Chief Sustainability Officer)" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Reduction / Goal</label>
                  <input type="text" placeholder="e.g. -240 tCO2e / yr" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Completion Date</label>
                  <input type="date" defaultValue="2027-03-31" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowCreateInitiativeModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateInitiativeModal(false);
                  showToast("New ESG Initiative logged and assigned to task pipeline.");
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Create Initiative
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal: Record Meeting */}
      {showRecordMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Record Committee Meeting</h3>
              <button onClick={() => setShowRecordMeetingModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Committee</label>
                <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <option>Board ESG & Sustainability Committee</option>
                  <option>EHS & Decarbonization Taskforce</option>
                  <option>Diversity, Equity & Inclusion Council</option>
                  <option>Risk & Statutory Compliance Steering</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Meeting Date</label>
                  <input type="date" defaultValue="2026-09-27" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Quorum Status</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option>Quorum Met (100%)</option>
                    <option>Quorum Met (75%)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Key Resolutions & Decisions</label>
                <textarea rows={3} placeholder="Approved CAPEX allocation for EV battery recycling facility..." className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowRecordMeetingModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRecordMeetingModal(false);
                  showToast("Committee minutes and resolutions recorded into governance archive.");
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Record Minutes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal: Upload Evidence */}
      {showUploadEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Upload ESG Evidence Dossier</h3>
              <button onClick={() => setShowUploadEvidenceModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Evidence Title</label>
                <input type="text" placeholder="e.g. FY26 Q2 Rooftop Solar Meter Test Certificate" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pillar & Metric</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option>Environmental - Renewable Energy</option>
                    <option>Environmental - Scope 1 & 2 GHG</option>
                    <option>Social - Occupational Health & Safety</option>
                    <option>Governance - Anti-Bribery Signoff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assurance Scope</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option>Limited Assurance (ISAE 3000)</option>
                    <option>Reasonable Assurance</option>
                    <option>Internal Audit Verification</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Upload File (PDF, DOCX, XLSX)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-slate-400 bg-slate-50 cursor-pointer">
                  <span className="text-xs text-slate-500">Click to choose verification certificate or drag file here</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowUploadEvidenceModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUploadEvidenceModal(false);
                  showToast("Evidence dossier uploaded and linked to ISAE 3000 audit trail.");
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Upload & Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal: Log Risk */}
      {showLogRiskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Log ESG Risk Assessment</h3>
              <button onClick={() => setShowLogRiskModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Risk Description</label>
                <input type="text" placeholder="e.g. EU CBAM Tariff Exposure on Secondary Aluminum Exports" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ESG Dimension</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option>Environmental (Climate & Carbon Risk)</option>
                    <option>Social (Supply Chain Human Rights)</option>
                    <option>Governance (Regulatory Disclosures)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Severity Rating</label>
                  <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option>High (Score 16-25)</option>
                    <option>Medium (Score 8-15)</option>
                    <option>Low (Score 1-7)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mitigation Controls</label>
                <textarea rows={3} placeholder="Implement LCA product passports and increase renewable energy sourcing..." className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowLogRiskModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogRiskModal(false);
                  showToast("ESG risk registered and added to corporate risk heat map.");
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Log Risk
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
}

export const Route = createFileRoute("/management/sustainability-management/esg")({
  component: ESGManagementPage,
});
