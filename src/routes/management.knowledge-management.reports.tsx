// Magnertia ERP - Knowledge Reports Module
// Management -> Knowledge -> Reports
// Controlled Master Reports, Finance-Style StatCards, Automated Schedules & Audit Analytics

import React, { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  Download,
  Printer,
  Search,
  Filter,
  Eye,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileCheck,
  Building,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Sliders,
  History,
  Shield,
  ShieldCheck,
  ChevronRight,
  X,
  Play,
  Share2,
  Plus,
  BookOpen,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { KnowledgeTabBar } from "@/components/erp/KnowledgeManagementTabBar";
import { KnowledgeSubmoduleHeader } from "@/components/erp/KnowledgeSubmoduleHeader";
import {
  CONTROLLED_KNOWLEDGE_REPORTS,
  type ControlledKnowledgeReport,
} from "@/services/knowledgeManagementReportsService";

export const Route = createFileRoute("/management/knowledge-management/reports")({
  head: () => ({
    meta: [
      { title: "Knowledge Reports · Magnertia ERP" },
      {
        name: "description",
        content:
          "Generate, analyze, schedule, and audit controlled knowledge master registers and compliance reports.",
      },
    ],
  }),
  component: KnowledgeReportsPage,
});

function KnowledgeReportsPage() {
  const [reports, setReports] = useState<ControlledKnowledgeReport[]>(CONTROLLED_KNOWLEDGE_REPORTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Reports");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");

  // Dialog States
  const [previewReport, setPreviewReport] = useState<ControlledKnowledgeReport | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [createReportOpen, setCreateReportOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // New report form state
  const [newReportTitle, setNewReportTitle] = useState("");
  const [newReportCat, setNewReportCat] = useState<ControlledKnowledgeReport["category"]>("SOP Library");
  const [newReportFreq, setNewReportFreq] = useState<ControlledKnowledgeReport["frequency"]>("Monthly");

  // Filtering & Sorting
  const filteredReports = useMemo(() => {
    const list = reports.filter((rep) => {
      const matchCat = selectedCategory === "All Reports" || rep.category === selectedCategory;
      const matchFormat = selectedFormat === "All" || rep.format === selectedFormat;
      const matchSearch =
        rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.purpose.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchFormat && matchSearch;
    });

    return list.sort((a, b) => {
      if (sortBy === "name-asc") return a.title.localeCompare(b.title);
      if (sortBy === "name-desc") return b.title.localeCompare(a.title);
      if (sortBy === "records-desc") return b.recordCount - a.recordCount;
      return 0;
    });
  }, [reports, selectedCategory, selectedFormat, searchQuery, sortBy]);

  const handleExport = (report: ControlledKnowledgeReport, format: "PDF" | "XLSX") => {
    setExportNotice(`Generated and downloaded ${report.title} (${report.code}) as ${format}.`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleRunNow = (report: ControlledKnowledgeReport) => {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setReports((prev) =>
      prev.map((r) =>
        r.id === report.id ? { ...r, lastGenerated: today } : r
      )
    );
    setExportNotice(`Refreshed live data for ${report.title}. Status: Synchronized.`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleCreateReport = () => {
    if (!newReportTitle.trim()) return;
    const newCode = `KM-REP-0${reports.length + 1}`;
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const newReport: ControlledKnowledgeReport = {
      id: `KMR-${reports.length + 1}`,
      code: newCode,
      title: newReportTitle,
      category: newReportCat,
      purpose: "Custom organization-level knowledge audit and ledger extraction.",
      frequency: newReportFreq,
      lastGenerated: today,
      recordCount: 150,
      format: "PDF",
      status: "Active",
    };

    setReports((prev) => [newReport, ...prev]);
    setCreateReportOpen(false);
    setNewReportTitle("");
    setExportNotice(`Custom Report "${newReportTitle}" successfully registered.`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <AppShell
      breadcrumb="Management > Knowledge > Reports"
      title="Reports"
      description="Audit compliance matrices, SOP lifecycle analytics, author contribution velocity, and ISO 9001 governance reports."
      tabs={<KnowledgeTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Notification Banner */}
        {exportNotice && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between shadow-md rounded-md animate-fade-in text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-200" />
              <span>{exportNotice}</span>
            </div>
            <button onClick={() => setExportNotice(null)} className="text-emerald-200 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* TOP EXECUTIVE COMMAND HEADER */}
        <KnowledgeSubmoduleHeader
          icon={FileSpreadsheet}
          title="Knowledge Reports"
          code="REP-2026-001"
          version="v1.0"
          status="Active"
          subtitle="Audit Analytics. Document Freshness. Conformance Ledgers."
          onSave={() => {
            setExportNotice("Knowledge Reports configuration saved.");
            setTimeout(() => setExportNotice(null), 3000);
          }}
          onSubmit={() => {
            setExportNotice("Report run scheduled and queued for executive distribution.");
            setTimeout(() => setExportNotice(null), 3000);
          }}
          onGenerateReport={() => {
            if (reports[0]) handleExport(reports[0], "PDF");
          }}
        />

        {/* Finance-Style 5 StatCard KPI Header Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Controlled Reports</span>
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <FileText className="h-4 w-4" />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">{reports.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Standardized Masters</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Active Schedules</span>
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Clock className="h-4 w-4" />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">10 Automated</div>
            <div className="text-[11px] text-slate-500 mt-1">Daily / Weekly / Monthly</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Monitored Records</span>
              <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
                <Layers className="h-4 w-4" />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">3,420</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">100% Traced & Governed</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Audit Compliance</span>
              <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100">
                <ShieldCheck className="h-4 w-4" />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">98.4%</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">ISO 9001:2015 SLA</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Generation Velocity</span>
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                <TrendingUp className="h-4 w-4" />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">&lt; 1.2s</div>
            <div className="text-[11px] text-slate-500 mt-1">Real-Time Extraction</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search reports by title, code, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Format:</span>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-white text-slate-700"
                >
                  <option value="All">All Formats</option>
                  <option value="PDF">PDF</option>
                  <option value="XLSX">Excel (XLSX)</option>
                  <option value="CSV">CSV</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-white text-slate-700"
                >
                  <option value="name-asc">Title (A-Z)</option>
                  <option value="name-desc">Title (Z-A)</option>
                  <option value="records-desc">Most Records</option>
                </select>
              </div>

              <button
                onClick={() => setScheduleModalOpen(true)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Schedule</span>
              </button>
            </div>
          </div>
        </div>

        {/* Master Reports Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Report Code</th>
                  <th className="py-2.5 px-3">Report Title & Purpose</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-3">Last Generated</th>
                  <th className="py-2.5 px-3">Records</th>
                  <th className="py-2.5 px-3">Format</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-blue-600">
                      {report.code}
                    </td>
                    <td className="py-2.5 px-3 max-w-md">
                      <div className="font-semibold text-slate-900">{report.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {report.purpose}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {report.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">
                      {report.frequency}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                      {report.lastGenerated}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 font-medium">
                      {report.recordCount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          report.format === "PDF"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {report.format}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewReport(report)}
                          title="Preview Report"
                          className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleRunNow(report)}
                          title="Run Dataset Live"
                          className="p-1 text-slate-500 hover:text-emerald-600 rounded hover:bg-slate-100 cursor-pointer"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleExport(report, "PDF")}
                          title="Download PDF"
                          className="px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-medium cursor-pointer"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => handleExport(report, "XLSX")}
                          title="Download Excel"
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-medium cursor-pointer"
                        >
                          Excel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PREVIEW MODAL */}
        {previewReport && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full p-5 space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{previewReport.title}</h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Ref: {previewReport.code} · Category: {previewReport.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewReport(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                  <div>
                    <span className="font-bold text-slate-900">Magnertia Private Limited</span>
                    <p className="text-[11px] text-slate-500">Knowledge Governance & Document Control System</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-slate-600">Generated: {previewReport.lastGenerated}</span>
                    <p className="text-[11px] text-emerald-600 font-semibold">Status: Controlled Copy</p>
                  </div>
                </div>

                <div className="text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">Executive Summary: </span>
                  <span>{previewReport.purpose}</span>
                </div>

                <div className="bg-white border border-slate-200 rounded p-2 text-xs">
                  <div className="font-semibold text-slate-800 mb-1.5">Sample Extracted Records (Top 3)</div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="py-1">Record ID</th>
                        <th className="py-1">Title / Item</th>
                        <th className="py-1">Department</th>
                        <th className="py-1">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <tr>
                        <td className="py-1 font-mono text-blue-600">KM-2026-001</td>
                        <td className="py-1 font-medium text-slate-800">Final Inspection Procedure</td>
                        <td className="py-1 text-slate-600">Manufacturing</td>
                        <td className="py-1 text-emerald-600 font-semibold">Published</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-mono text-blue-600">KM-2026-002</td>
                        <td className="py-1 font-medium text-slate-800">Wireless Docking Calibration</td>
                        <td className="py-1 text-slate-600">R&D</td>
                        <td className="py-1 text-emerald-600 font-semibold">Approved</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-mono text-blue-600">KM-2026-003</td>
                        <td className="py-1 font-medium text-slate-800">High-Voltage Torque Standard</td>
                        <td className="py-1 text-slate-600">Quality</td>
                        <td className="py-1 text-blue-600 font-semibold">Active</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-slate-600 border-t border-slate-200">
                  <div>
                    <span className="font-semibold">Prepared By:</span>
                    <div>Arun Kumar (Knowledge Manager)</div>
                  </div>
                  <div>
                    <span className="font-semibold">Validated By:</span>
                    <div>Document Control & Quality Board</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setPreviewReport(null)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    handleExport(previewReport, "PDF");
                    setPreviewReport(null);
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => {
                    handleExport(previewReport, "XLSX");
                    setPreviewReport(null);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span>Download Excel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Create Report */}
        {createReportOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>Create Custom Knowledge Report</span>
                </h3>
                <button onClick={() => setCreateReportOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Report Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Cross-Plant SOP Compliance SLA Ledger"
                    value={newReportTitle}
                    onChange={(e) => setNewReportTitle(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">Category</label>
                    <select
                      value={newReportCat}
                      onChange={(e) => setNewReportCat(e.target.value as any)}
                      className="mt-1 w-full border border-slate-200 rounded-md p-1.5 text-xs"
                    >
                      <option value="SOP Library">SOP Library</option>
                      <option value="Document Repository">Document Repository</option>
                      <option value="Templates">Templates</option>
                      <option value="Lessons Learned">Lessons Learned</option>
                      <option value="Best Practices">Best Practices</option>
                      <option value="Technical Library">Technical Library</option>
                      <option value="Wiki">Wiki</option>
                      <option value="Training Materials">Training Materials</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Frequency</label>
                    <select
                      value={newReportFreq}
                      onChange={(e) => setNewReportFreq(e.target.value as any)}
                      className="mt-1 w-full border border-slate-200 rounded-md p-1.5 text-xs"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annual">Annual</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setCreateReportOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateReport}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs cursor-pointer"
                >
                  Register Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Schedule Delivery */}
        {scheduleModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-4 space-y-3 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                  <span>Configure Report Delivery Schedule</span>
                </h4>
                <button onClick={() => setScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Recipient Email Distribution</label>
                  <input
                    type="email"
                    placeholder="leadership@magnertia.com, qa-lead@magnertia.com"
                    className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700">Delivery Frequency</label>
                    <select className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs">
                      <option>Monthly (1st)</option>
                      <option>Weekly (Monday)</option>
                      <option>Daily</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Format</label>
                    <select className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs">
                      <option>PDF</option>
                      <option>Excel (XLSX)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setScheduleModalOpen(false);
                    setExportNotice("Automated schedule configured for monthly delivery.");
                    setTimeout(() => setExportNotice(null), 3500);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  Save Schedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
