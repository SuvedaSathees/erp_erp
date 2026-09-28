// Magnertia ERP - Sustainability Reports Suite
// Management -> Sustainability Management -> Reports
// Controlled Master Reports, Framework Filters (BRSR, GRI, TCFD, ISO), PDF/Excel Export & Audit Preview

import React, { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
  Leaf,
  Recycle,
  Droplets,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { SustainabilityManagementTabBar } from "@/components/erp/SustainabilityManagementTabBar";
import { SustainabilitySubmoduleHeader } from "@/components/erp/SustainabilitySubmoduleHeader";
import { cn } from "@/lib/utils";

export interface ControlledSustainabilityReport {
  id: string;
  code: string;
  title: string;
  category: "ESG" | "Carbon & GHG" | "Energy" | "Water & ZLD" | "Waste & Recycling" | "Compliance & Legal";
  purpose: string;
  frequency: "Monthly" | "Quarterly" | "Annual" | "On-Demand";
  lastGenerated: string;
  generatedBy: string;
  format: "PDF" | "XLSX" | "CSV";
  recordCount: number;
  confidentiality: "Public / SEBI" | "Internal" | "Restricted";
  framework: string;
}

const CONTROLLED_SUSTAINABILITY_REPORTS: ControlledSustainabilityReport[] = [
  {
    id: "rep-1",
    code: "REP-SUS-001",
    title: "SEBI BRSR Core Comprehensive Disclosures",
    category: "ESG",
    purpose: "Mandatory Business Responsibility and Sustainability Report for top listed entities with assurance parameters.",
    frequency: "Annual",
    lastGenerated: "2026-09-26",
    generatedBy: "Dr. Vikram Patel",
    format: "PDF",
    recordCount: 186,
    confidentiality: "Public / SEBI",
    framework: "BRSR Core (SEBI Circular 2023)",
  },
  {
    id: "rep-2",
    code: "REP-SUS-002",
    title: "Corporate GHG Inventory & Scopes 1, 2 & 3 Ledger",
    category: "Carbon & GHG",
    purpose: "Comprehensive emissions breakdown by scope, emission factors, stationary combustion, grid and value chain.",
    frequency: "Quarterly",
    lastGenerated: "2026-09-25",
    generatedBy: "Priya Sharma",
    format: "XLSX",
    recordCount: 64,
    confidentiality: "Internal",
    framework: "GHG Protocol / ISO 14064",
  },
  {
    id: "rep-3",
    code: "REP-SUS-003",
    title: "ISO 50001 Energy Performance & Specific Consumption",
    category: "Energy",
    purpose: "Machine-level energy intensity, peak load distribution, solar-wheel transition and EnPI baseline variances.",
    frequency: "Monthly",
    lastGenerated: "2026-09-24",
    generatedBy: "Rajesh Kannan",
    format: "PDF",
    recordCount: 128,
    confidentiality: "Internal",
    framework: "ISO 50001:2018",
  },
  {
    id: "rep-4",
    code: "REP-SUS-004",
    title: "Water Balance & Zero Liquid Discharge (ZLD) Audit",
    category: "Water & ZLD",
    purpose: "Campus water balance flow, borehole withdrawal, RO recovery yields, and ETP effluent recirculation ledger.",
    frequency: "Monthly",
    lastGenerated: "2026-09-23",
    generatedBy: "Dr. Vikram Patel",
    format: "PDF",
    recordCount: 38,
    confidentiality: "Internal",
    framework: "GRI 303 / CGWA Guidelines",
  },
  {
    id: "rep-5",
    code: "REP-SUS-005",
    title: "Hazardous & Non-Hazardous Waste Manifest Register",
    category: "Waste & Recycling",
    purpose: "Controlled Form 10 yellow manifests, authorized recycler certificates, weighbridge tickets and co-processing manifests.",
    frequency: "Monthly",
    lastGenerated: "2026-09-22",
    generatedBy: "Suresh Menon",
    format: "XLSX",
    recordCount: 92,
    confidentiality: "Internal",
    framework: "Hazardous Waste Rules 2016",
  },
  {
    id: "rep-6",
    code: "REP-SUS-006",
    title: "Circular Economy & Material Reprocessing Yield",
    category: "Waste & Recycling",
    purpose: "Recovered aluminum, copper, polymer and battery black mass economics, landfill diversion rates and vendor passes.",
    frequency: "Quarterly",
    lastGenerated: "2026-09-20",
    generatedBy: "Priya Sharma",
    format: "PDF",
    recordCount: 48,
    confidentiality: "Internal",
    framework: "Circular Economy KPI Index",
  },
  {
    id: "rep-7",
    code: "REP-SUS-007",
    title: "Statutory CTO / CTE Environmental Conditions Dossier",
    category: "Compliance & Legal",
    purpose: "Pollution Control Board Consent to Operate tracking, stack emission testing, ambient noise and legal compliance status.",
    frequency: "Quarterly",
    lastGenerated: "2026-09-18",
    generatedBy: "Dr. Vikram Patel",
    format: "PDF",
    recordCount: 186,
    confidentiality: "Restricted",
    framework: "Air & Water Acts (SPCB/CPCB)",
  },
  {
    id: "rep-8",
    code: "REP-SUS-008",
    title: "GRI Standards 2021 Multi-Framework Cross-Reference",
    category: "ESG",
    purpose: "GRI content index mapping disclosure numbers, management approaches, boundaries and verified page numbers.",
    frequency: "Annual",
    lastGenerated: "2026-09-15",
    generatedBy: "Priya Sharma",
    format: "PDF",
    recordCount: 84,
    confidentiality: "Public / SEBI",
    framework: "GRI Universal Standards 2021",
  },
];

const CATEGORIES = [
  "All Reports",
  "ESG",
  "Carbon & GHG",
  "Energy",
  "Water & ZLD",
  "Waste & Recycling",
  "Compliance & Legal",
];

function SustainabilityReportsPage() {
  const [reports, setReports] = useState<ControlledSustainabilityReport[]>(
    CONTROLLED_SUSTAINABILITY_REPORTS
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All Reports");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [previewReport, setPreviewReport] = useState<ControlledSustainabilityReport | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New report state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ControlledSustainabilityReport["category"]>("ESG");
  const [newFramework, setNewFramework] = useState("BRSR Core / GRI");
  const [newFreq, setNewFreq] = useState<ControlledSustainabilityReport["frequency"]>("Quarterly");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      const matchCat = selectedCategory === "All Reports" || rep.category === selectedCategory;
      const matchFormat = selectedFormat === "All" || rep.format === selectedFormat;
      const matchSearch =
        rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.framework.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchFormat && matchSearch;
    });
  }, [reports, selectedCategory, selectedFormat, searchQuery]);

  const handleExport = (report: ControlledSustainabilityReport, format: "PDF" | "XLSX") => {
    showToast(`Generated & downloaded ${report.title} (${report.code}) as ${format}.`);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) {
      showToast("Please enter a report title.");
      return;
    }

    const created: ControlledSustainabilityReport = {
      id: `rep-${Date.now()}`,
      code: `REP-SUS-00${reports.length + 1}`,
      title: newTitle,
      category: newCategory,
      purpose: "Controlled ad-hoc executive sustainability audit & disclosure register.",
      frequency: newFreq,
      lastGenerated: new Date().toISOString().split("T")[0],
      generatedBy: "System Administrator",
      format: "PDF",
      recordCount: 42,
      confidentiality: "Internal",
      framework: newFramework,
    };

    setReports([created, ...reports]);
    setShowCreateModal(false);
    setNewTitle("");
    showToast(`Report template ${created.code} registered successfully.`);
  };

  return (
    <AppShell
      title="Sustainability Reports"
      breadcrumb="Management > Sustainability Management > Reports"
      description="Controlled master reports repository, SEBI BRSR Core filings, GHG inventories, water & energy audits & ISO compliance registers."
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
          title="Sustainability Reports"
          code="REP-SUS-001"
          programName="Executive Compliance Suite"
          version="v1.0"
          status="Active"
          subtitle="Controlled master reports repository, SEBI BRSR Core filings, GHG inventories, water & energy audits & ISO compliance registers."
          primaryActionLabel="+ New Report Definition"
          onPrimaryAction={() => setShowCreateModal(true)}
          onGenerateReport={() => showToast("Exporting Master Sustainability Ledger...")}
        />

        {/* Main Content */}
        <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Active Controlled Reports</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">{reports.length} Reports</div>
              <div className="text-[11px] text-emerald-600 font-semibold">100% Audit Ready</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Statutory Assurance</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">ISAE 3000 Verified</div>
              <div className="text-[11px] text-blue-600 font-semibold">DNV GL Partner</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Upcoming Mandatory Filing</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">SEBI BRSR Core</div>
              <div className="text-[11px] text-amber-700 font-semibold">Due in 38 Days</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Framework Compliance</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">5 Global Standards</div>
              <div className="text-[11px] text-purple-600 font-semibold">BRSR, GRI, TCFD, ISO, CDP</div>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search reports, frameworks, codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs focus:outline-none"
            >
              <option value="All">All Formats</option>
              <option value="PDF">PDF Reports</option>
              <option value="XLSX">Excel Sheets</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredReports.length}</span> of {reports.length} reports
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((rep) => (
            <div
              key={rep.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {rep.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {rep.frequency}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{rep.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {rep.purpose}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Framework:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[180px]">{rep.framework}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Data Records:</span>
                    <span className="font-bold text-slate-900">{rep.recordCount} rows</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Generated:</span>
                    <span className="text-slate-600">{rep.lastGenerated}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewReport(rep)}
                  className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1 shadow-2xs"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </button>

                <button
                  onClick={() => handleExport(rep, "PDF")}
                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                  title="Download PDF"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => handleExport(rep, "XLSX")}
                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
                  title="Export Excel"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-700">{previewReport.code}</span>
                <h3 className="text-base font-bold text-slate-900">{previewReport.title}</h3>
              </div>
              <button onClick={() => setPreviewReport(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{previewReport.purpose}</p>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Framework Standard:</span>
                <span className="font-semibold text-slate-900">{previewReport.framework}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Frequency & Cycle:</span>
                <span className="font-semibold text-slate-900">{previewReport.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Signoff Lead:</span>
                <span className="font-semibold text-slate-900">{previewReport.generatedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Validated Data Points:</span>
                <span className="font-bold text-emerald-600">{previewReport.recordCount} metric rows</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Classification:</span>
                <span className="font-semibold text-slate-900">{previewReport.confidentiality}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPreviewReport(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleExport(previewReport, "PDF");
                  setPreviewReport(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download Full Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Sustainability Report</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scope 3 Supply Chain Logistics Carbon Audit"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  >
                    <option value="ESG">ESG</option>
                    <option value="Carbon & GHG">Carbon & GHG</option>
                    <option value="Energy">Energy</option>
                    <option value="Water & ZLD">Water & ZLD</option>
                    <option value="Waste & Recycling">Waste & Recycling</option>
                    <option value="Compliance & Legal">Compliance & Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Frequency</label>
                  <select
                    value={newFreq}
                    onChange={(e) => setNewFreq(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                    <option value="On-Demand">On-Demand</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Framework / Standard</label>
                <input
                  type="text"
                  placeholder="e.g. ISO 14064-1:2018"
                  value={newFramework}
                  onChange={(e) => setNewFramework(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Register Report
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

export const Route = createFileRoute("/management/sustainability-management/reports")({
  component: SustainabilityReportsPage,
});
