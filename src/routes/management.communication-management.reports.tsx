// Magnertia ERP - Communication Management Reports
// Management -> Communication Management -> Reports
// Executive Finance-Style Widgets, Controlled Reports Register, Run & Export

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCommunicationManagementRecordFn } from "@/lib/communicationManagementFns.server";
import {
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  Play,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Shield,
  Eye,
  Plus,
  RefreshCw,
  Mail,
  MessageSquare,
  Video,
  Bell,
  Megaphone,
  X,
  FileCheck,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { CommunicationTabBar } from "@/components/erp/CommunicationManagementTabBar";
import { CommunicationSubmoduleHeader } from "@/components/erp/CommunicationSubmoduleHeader";
import {
  MOCK_COMMUNICATION_REPORTS,
  CommunicationReportDef,
} from "@/services/communicationManagementService";

export const Route = createFileRoute("/management/communication-management/reports")({
  head: () => ({
    meta: [
      { title: "Reports · Communication Management · Magnertia ERP" },
      {
        name: "description",
        content: "Controlled communication inventory, delivery performance, SLA adherence, and executive audit reports.",
      },
    ],
  }),
  component: CommunicationReportsPage,
});

function CommunicationReportsPage() {
  const { data: dbRecord } = useQuery({
    queryKey: ["communication-management", "record"],
    queryFn: () => getCommunicationManagementRecordFn({ data: {} }),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [reportsList, setReportsList] = useState<CommunicationReportDef[]>(MOCK_COMMUNICATION_REPORTS);
  const [previewReport, setPreviewReport] = useState<CommunicationReportDef | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRunReport = (report: CommunicationReportDef) => {
    showToast(`Generating "${report.name}" in real-time...`);
    setTimeout(() => {
      setReportsList((prev) =>
        prev.map((r) =>
          r.id === report.id
            ? { ...r, lastGenerated: "Just now", status: "Ready" }
            : r
        )
      );
      showToast(`"${report.name}" generated successfully.`);
    }, 1200);
  };

  const filteredReports = reportsList.filter((r) => {
    const matchesCategory =
      selectedCategory === "all" ||
      r.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppShell
      title="Reports"
      breadcrumb="Management > Communication Management > Reports"
      description="Controlled communication analytics, SLA performance, delivery tracking and audit registers."
      tabs={<CommunicationTabBar />}
    >
      <div className="flex flex-col min-h-screen bg-slate-50/50">
        <CommunicationSubmoduleHeader
          icon={FileSpreadsheet}
          title="Communication Reports"
          code="REP-2026-001"
          version="v1.0"
          status="Active"
          onSave={() => showToast("Communication Reports configuration saved")}
          onSubmit={() => showToast("Report run scheduled and queued")}
          onGenerateReport={() => showToast("Master Communication Ledger exported")}
        />

        {/* Floating Toast */}
        {toastMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {toastMessage}
            </span>
            <button onClick={() => setToastMessage(null)}>
              <X className="h-3.5 w-3.5 text-emerald-600" />
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Executive StatCards (Finance-Style Widgets) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* 1. Controlled Reports */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Controlled Reports</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FileSpreadsheet className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {reportsList.length}
                </span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  Active
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">All modules covered</p>
            </div>

            {/* 2. Delivery SLA */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Delivery SLA Rate</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-slate-900">97.8%</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  +1.4%
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Target &gt; 95% met</p>
            </div>

            {/* 3. Average Response Speed */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Avg. Response Time</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <Clock className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-slate-900">4.2 hrs</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  -30%
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Faster response SLA</p>
            </div>

            {/* 4. Action Item Resolution */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Action Closure Rate</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <FileCheck className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-slate-900">87.5%</span>
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                  38 Open
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">3 overdue actions</p>
            </div>

            {/* 5. Audit Traceability */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Audit Compliance</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Shield className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-slate-900">100%</span>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                  Verified
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Immutable audit logs</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search reports by code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="email">Email</option>
                <option value="chat">Chat</option>
                <option value="meeting">Video Meetings</option>
                <option value="notification">Notifications</option>
                <option value="announcement">Announcements</option>
                <option value="audit">Audit & SLA</option>
              </select>

              <button
                type="button"
                onClick={() => showToast("Exporting Master Communication Ledger to Excel")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                Excel
              </button>
              <button
                type="button"
                onClick={() => showToast("Exporting Communication Audit Report (PDF)")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5 text-slate-500" />
                PDF
              </button>
              <button
                type="button"
                onClick={() => showToast("Running All Scheduled Communication Reports...")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
              >
                <Play className="h-3.5 w-3.5" />
                Run All
              </button>
            </div>
          </div>

          {/* Controlled Reports Register Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b">
                  <tr>
                    <th className="py-3 px-4">Report Code</th>
                    <th className="py-3 px-4">Report Name & Purpose</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Frequency</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Last Generated</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                        {report.code}
                      </td>
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-bold text-slate-900 text-xs">{report.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{report.description}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {report.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{report.frequency}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] text-slate-500">{report.format}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{report.lastGenerated}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {report.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleRunReport(report)}
                            title="Run Report"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-[11px] cursor-pointer"
                          >
                            <Play className="h-3 w-3" /> Run
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewReport(report)}
                            title="Preview Data"
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => showToast(`Exporting ${report.name}`)}
                            title="Download Export"
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Report Preview Modal */}
        {previewReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl border border-slate-200 overflow-hidden text-xs">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <span className="font-mono text-[11px] text-blue-600 font-bold">{previewReport.code}</span>
                  <h3 className="font-bold text-sm text-slate-900">{previewReport.name}</h3>
                </div>
                <button
                  onClick={() => setPreviewReport(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-1">Report Description</h4>
                  <p className="text-slate-600 leading-relaxed text-xs">{previewReport.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Category</span>
                    <span className="font-semibold text-slate-800">{previewReport.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Frequency</span>
                    <span className="font-semibold text-slate-800">{previewReport.frequency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Formats Supported</span>
                    <span className="font-semibold text-slate-800">{previewReport.format}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-2">Simulated Ledger Rows</h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 text-slate-600 font-bold">
                        <tr>
                          <th className="p-2">Record ID</th>
                          <th className="p-2">Entity</th>
                          <th className="p-2">Channel</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-2 font-mono text-blue-600">EML-2026-0891</td>
                          <td className="p-2">GreenFleet Solutions</td>
                          <td className="p-2">Email</td>
                          <td className="p-2 text-emerald-600 font-semibold">Delivered</td>
                          <td className="p-2 text-slate-400">19-Sep-2026 10:24</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-mono text-blue-600">CHT-2026-0015</td>
                          <td className="p-2">EV Charging Team</td>
                          <td className="p-2">Chat</td>
                          <td className="p-2 text-blue-600 font-semibold">Active</td>
                          <td className="p-2 text-slate-400">19-Sep-2026 10:24</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-mono text-blue-600">MTG-2026-0145</td>
                          <td className="p-2">Design Review</td>
                          <td className="p-2">Video Meeting</td>
                          <td className="p-2 text-emerald-600 font-semibold">Completed</td>
                          <td className="p-2 text-slate-400">18-Sep-2026 11:30</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewReport(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Exported ${previewReport.name} to CSV`);
                    setPreviewReport(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Download Export
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
