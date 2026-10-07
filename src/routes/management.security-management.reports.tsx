// Magnertia ERP - Security Management Reports Suite
// Management → Security Management → Reports
// Controlled Security Audits, Compliance Registers, Incident Ledgers, PAM Logs, and ISO/IEC Dossiers

import React, { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  Download,
  Search,
  Eye,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileCheck,
  Sparkles,
  RefreshCw,
  Shield,
  ShieldCheck,
  ChevronRight,
  X,
  Plus,
  Lock,
  UserCheck,
  KeyRound,
  Fingerprint,
  Camera,
  Layers,
  Database,
  Sliders,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { SecurityManagementTabBar } from "@/components/erp/SecurityManagementTabBar";
import { SecuritySubmoduleHeader } from "@/components/erp/SecuritySubmoduleHeader";
import {
  CONTROLLED_SECURITY_REPORTS,
  ControlledSecurityReport,
} from "@/services/securityManagementService";
import { cn } from "@/lib/utils";

import { useModuleDataset } from "@/services/moduleDatasetService";
export const Route = createFileRoute("/management/security-management/reports")({
  component: SecurityReportsPage,
});

const SUBMODULE_CATEGORIES = [
  "All Security Reports",
  "Access Control",
  "Identity Management",
  "Cybersecurity",
  "Information Security",
  "Physical Security",
] as const;

const PAGE_DATASET = { CONTROLLED_SECURITY_REPORTS, SUBMODULE_CATEGORIES };

function SecurityReportsPage() {
  const { CONTROLLED_SECURITY_REPORTS, SUBMODULE_CATEGORIES } = useModuleDataset("security-management.reports", "Security Reports", PAGE_DATASET);
  const [reports, setReports] = useState<ControlledSecurityReport[]>(
    CONTROLLED_SECURITY_REPORTS
  );
  const [selectedSubmodule, setSelectedSubmodule] = useState<string>("All Security Reports");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [selectedFrequency, setSelectedFrequency] = useState("All");
  const [previewReport, setPreviewReport] = useState<ControlledSecurityReport | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New report creation state
  const [newTitle, setNewTitle] = useState("");
  const [newSubmodule, setNewSubmodule] = useState<ControlledSecurityReport["submodule"]>("Access Control");
  const [newPurpose, setNewPurpose] = useState("");
  const [newFrequency, setNewFrequency] = useState<ControlledSecurityReport["frequency"]>("Monthly");
  const [newFormat, setNewFormat] = useState<ControlledSecurityReport["format"]>("PDF");
  const [newConfidentiality, setNewConfidentiality] = useState<ControlledSecurityReport["confidentiality"]>("Confidential");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      const matchSub =
        selectedSubmodule === "All Security Reports" || rep.submodule === selectedSubmodule;
      const matchFormat = selectedFormat === "All" || rep.format === selectedFormat;
      const matchFreq = selectedFrequency === "All" || rep.frequency === selectedFrequency;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        rep.title.toLowerCase().includes(q) ||
        rep.code.toLowerCase().includes(q) ||
        rep.purpose.toLowerCase().includes(q) ||
        rep.category.toLowerCase().includes(q) ||
        rep.generatedBy.toLowerCase().includes(q);

      return matchSub && matchFormat && matchFreq && matchSearch;
    });
  }, [reports, selectedSubmodule, selectedFormat, selectedFrequency, searchQuery]);

  const handleExport = (report: ControlledSecurityReport, fmt: "PDF" | "XLSX" | "CSV") => {
    showToast(`Generating ${report.title} (${report.code}) in ${fmt} format... Download started.`);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast("Please provide a valid report title.");
      return;
    }

    const created: ControlledSecurityReport = {
      id: `rep-custom-${Date.now()}`,
      code: `REP-SEC-0${reports.length + 1}`,
      title: newTitle,
      submodule: newSubmodule,
      purpose: newPurpose || "Custom executive security audit and governance disclosure report.",
      frequency: newFrequency,
      lastGenerated: new Date().toISOString().split("T")[0],
      generatedBy: "Arun Kumar (Security Lead)",
      format: newFormat,
      recordCount: 24,
      confidentiality: newConfidentiality,
      status: "Active",
      category: `${newSubmodule} Audit`,
    };

    setReports([created, ...reports]);
    setShowCreateModal(false);
    setNewTitle("");
    setNewPurpose("");
    showToast(`Security report template [${created.code}] successfully registered in audit ledger.`);
  };

  const getSubmoduleIcon = (submodule: string) => {
    switch (submodule) {
      case "Access Control":
        return Lock;
      case "Identity Management":
        return UserCheck;
      case "Cybersecurity":
        return Shield;
      case "Information Security":
        return Database;
      case "Physical Security":
        return Camera;
      default:
        return FileText;
    }
  };

  return (
    <AppShell
      title="Security Reports"
      breadcrumb="Management > Security Management > Reports"
      description="Controlled master security reports repository, compliance audit ledgers, PAM telemetry, SoD registers, and ISO/IEC certified dossiers."
      tabs={<SecurityManagementTabBar />}
    >
      <div className="space-y-4 pb-16">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="flex items-center justify-between rounded-xl bg-slate-900 text-white px-4 py-3 text-xs font-semibold shadow-2xl border border-slate-700 animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              {toastMessage}
            </span>
            <button onClick={() => setToastMessage(null)} aria-label="Dismiss toast">
              <X className="h-3.5 w-3.5 text-slate-400 hover:text-white" />
            </button>
          </div>
        )}

        {/* Executive Submodule Header */}
        <SecuritySubmoduleHeader
          icon={FileText}
          title="Security Reports & Audits"
          code="REP-SEC-2026"
          status="Active"
          slogan="Auditable Evidence. Compliant Controls. Continuous Verification."
          bannerQuote="Every access, identity, threat and physical event is continuously verified, recorded, and certified across the Magnertia ecosystem."
          primaryActionLabel="+ Register Report Template"
          onPrimaryAction={() => setShowCreateModal(true)}
          onGenerateReport={() => showToast("Exporting Master Security Governance Dossier (PDF)...")}
          onMoreActions={(action) => showToast(`Executing action: ${action}`)}
        />

        {/* Executive KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Controlled Security Reports</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">{reports.length} Reports</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 inline" /> 100% Audit Ready
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Compliance Assurance</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">ISO 27001 / 21434</div>
              <div className="text-[11px] text-blue-600 font-semibold">IEC 62443 Certified</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Periodic Access Review</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">Q3 Review Cycle</div>
              <div className="text-[11px] text-amber-700 font-semibold">94.6% Completed (27 Due)</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">AI Intelligence Audits</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">Automated Feeds</div>
              <div className="text-[11px] text-purple-600 font-semibold">Anomalies & JML Triggers</div>
            </div>
          </div>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search reports, codes, owners, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Submodule Filter Dropdown */}
            <select
              value={selectedSubmodule}
              onChange={(e) => setSelectedSubmodule(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs focus:outline-none"
            >
              {SUBMODULE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Format Filter */}
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs focus:outline-none"
            >
              <option value="All">All Formats</option>
              <option value="PDF">PDF Dossiers</option>
              <option value="XLSX">Excel Ledgers</option>
              <option value="CSV">CSV Data Dumps</option>
            </select>

            {/* Frequency Filter */}
            <select
              value={selectedFrequency}
              onChange={(e) => setSelectedFrequency(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs focus:outline-none"
            >
              <option value="All">All Frequencies</option>
              <option value="Daily">Daily Reports</option>
              <option value="Weekly">Weekly Ledgers</option>
              <option value="Monthly">Monthly Audits</option>
              <option value="Quarterly">Quarterly Filings</option>
              <option value="Annual">Annual Reports</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredReports.length}</span> of {reports.length} controlled reports
          </div>
        </div>

        {/* Submodule Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SUBMODULE_CATEGORIES.map((cat) => {
            const isSelected = selectedSubmodule === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedSubmodule(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border shrink-0",
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((rep) => {
            const SubIcon = getSubmoduleIcon(rep.submodule);
            return (
              <div
                key={rep.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                      {rep.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {rep.frequency}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded",
                          rep.confidentiality === "Restricted"
                            ? "bg-rose-50 text-rose-700"
                            : rep.confidentiality === "Confidential"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                        )}
                      >
                        {rep.confidentiality}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 mt-1">
                    <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <SubIcon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{rep.title}</h3>
                      <div className="text-[11px] text-blue-600 font-semibold mt-0.5">
                        {rep.submodule} • {rep.category}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                    {rep.purpose}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Owner / Issuer:</span>
                      <span className="font-medium text-slate-800">{rep.generatedBy}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Last Generated:</span>
                      <span className="font-medium text-slate-800">{rep.lastGenerated}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Total Records:</span>
                      <span className="font-semibold text-slate-900">{rep.recordCount.toLocaleString()} items</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewReport(rep)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-500" />
                    Preview Data
                  </button>

                  <button
                    onClick={() => handleExport(rep, rep.format)}
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {rep.format}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Preview Modal */}
        {previewReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {previewReport.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {previewReport.submodule}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mt-0.5">
                      {previewReport.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewReport(null)}
                  className="h-8 w-8 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Meta details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
                  <div>
                    <div className="text-slate-500">Frequency</div>
                    <div className="font-bold text-slate-900 mt-0.5">{previewReport.frequency}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Last Generated</div>
                    <div className="font-bold text-slate-900 mt-0.5">{previewReport.lastGenerated}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Classification</div>
                    <div className="font-bold text-slate-900 mt-0.5">{previewReport.confidentiality}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Report Owner</div>
                    <div className="font-bold text-slate-900 mt-0.5">{previewReport.generatedBy}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Executive Purpose & Scope
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-200 p-3 rounded-xl">
                    {previewReport.purpose}
                  </p>
                </div>

                {/* Mock Report Sample Data Table */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Sample Audit Records ({previewReport.recordCount} Total In Scope)
                    </h4>
                    <span className="text-[11px] text-slate-400">Live query simulated</span>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <tr>
                          <th className="px-3 py-2">Record Ref</th>
                          <th className="px-3 py-2">Subject / Asset / User</th>
                          <th className="px-3 py-2">Type / Role</th>
                          <th className="px-3 py-2">Status / Decision</th>
                          <th className="px-3 py-2">Timestamp</th>
                          <th className="px-3 py-2">Compliance Check</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 font-mono text-slate-600">SEC-REC-001</td>
                          <td className="px-3 py-2 font-medium">John Mathew (EMP-1024)</td>
                          <td className="px-3 py-2">Production Manager</td>
                          <td className="px-3 py-2 text-emerald-600 font-semibold">Verified Active</td>
                          <td className="px-3 py-2 text-slate-500">2026-09-28 10:24</td>
                          <td className="px-3 py-2 text-emerald-700">MFA + JML Compliant</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 font-mono text-slate-600">SEC-REC-002</td>
                          <td className="px-3 py-2 font-medium">EVSE Controller Firmware (PCS-02)</td>
                          <td className="px-3 py-2">IoT / EVSE Asset</td>
                          <td className="px-3 py-2 text-blue-600 font-semibold">Signed & Monitored</td>
                          <td className="px-3 py-2 text-slate-500">2026-09-28 09:15</td>
                          <td className="px-3 py-2 text-emerald-700">OCPP TLS 1.3 OK</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 font-mono text-slate-600">SEC-REC-003</td>
                          <td className="px-3 py-2 font-medium">Admin01 (Root Session)</td>
                          <td className="px-3 py-2">PAM System Admin</td>
                          <td className="px-3 py-2 text-purple-600 font-semibold">JIT Elevation Active</td>
                          <td className="px-3 py-2 text-slate-500">2026-09-28 08:12</td>
                          <td className="px-3 py-2 text-amber-700">Expires in 118 min</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 font-mono text-slate-600">SEC-REC-004</td>
                          <td className="px-3 py-2 font-medium">Ramesh S / Anil Verma</td>
                          <td className="px-3 py-2">SoD Rule: SOD-001</td>
                          <td className="px-3 py-2 text-emerald-600 font-semibold">Mitigated Control</td>
                          <td className="px-3 py-2 text-slate-500">2026-09-27 16:30</td>
                          <td className="px-3 py-2 text-emerald-700">Dual Authorization Active</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Classification: <span className="font-semibold text-slate-800">{previewReport.confidentiality}</span> • ISO 27001 Certified
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewReport(null)}
                    className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleExport(previewReport, "XLSX")}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                    Excel
                  </button>
                  <button
                    onClick={() => handleExport(previewReport, "PDF")}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export Official PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Template Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Register Report Template</h3>
                    <p className="text-xs text-slate-500">Add a controlled security audit definition</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="h-7 w-7 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateReport} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Report Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Break-Glass Emergency Access & Session Telemetry Log"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Security Submodule *
                    </label>
                    <select
                      value={newSubmodule}
                      onChange={(e) =>
                        setNewSubmodule(
                          e.target.value as ControlledSecurityReport["submodule"]
                        )
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                    >
                      <option value="Access Control">Access Control</option>
                      <option value="Identity Management">Identity Management</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Information Security">Information Security</option>
                      <option value="Physical Security">Physical Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Frequency *
                    </label>
                    <select
                      value={newFrequency}
                      onChange={(e) =>
                        setNewFrequency(
                          e.target.value as ControlledSecurityReport["frequency"]
                        )
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annual">Annual</option>
                      <option value="On-Demand">On-Demand</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Default Format *
                    </label>
                    <select
                      value={newFormat}
                      onChange={(e) =>
                        setNewFormat(
                          e.target.value as ControlledSecurityReport["format"]
                        )
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                    >
                      <option value="PDF">PDF Dossier</option>
                      <option value="XLSX">Excel Spreadsheet</option>
                      <option value="CSV">CSV Data File</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confidentiality *
                    </label>
                    <select
                      value={newConfidentiality}
                      onChange={(e) =>
                        setNewConfidentiality(
                          e.target.value as ControlledSecurityReport["confidentiality"]
                        )
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                    >
                      <option value="Internal">Internal</option>
                      <option value="Confidential">Confidential</option>
                      <option value="Restricted">Restricted</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Audit Purpose & Scope
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe audit objectives, statutory standards, criteria, and target audience..."
                    value={newPurpose}
                    onChange={(e) => setNewPurpose(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs"
                  >
                    Register in Master Ledger
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
