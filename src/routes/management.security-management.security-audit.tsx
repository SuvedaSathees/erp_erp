// Magnertia ERP - Security Audit
// Management → Security Management → Security Audit
// Aligned with Screenshot 1 & MAICW Specification

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  FileCheck2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
  RefreshCw,
  Printer,
  Edit2,
  X,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Search,
  ExternalLink,
  Users,
  CheckSquare,
  AlertCircle,
  Save,
  Send,
  Building2,
  Layers,
  FileQuestion,
  HelpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { SecurityManagementTabBar } from "@/components/erp/SecurityManagementTabBar";
import { SecuritySubmoduleHeader } from "@/components/erp/SecuritySubmoduleHeader";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import { cn } from "@/lib/utils";
import {
  mockUpcomingAudits,
  mockOpenFindingsList,
  type SecurityAuditItem,
  type AuditFindingItem,
} from "@/services/securityManagementService";
import { toast } from "sonner";

import { useModuleDataset } from "@/services/moduleDatasetService";
import { usePersistentState } from "@/services/moduleDatasetService";
import { SubmissionsPanel, makeSubmission, type Submission } from "@/components/erp/SubmissionsPanel";
import { exportRecords, recordToRows } from "@/lib/recordExport";
export const Route = createFileRoute(
  "/management/security-management/security-audit"
)({
  head: () => ({
    meta: [
      { title: "Security Audit · Magnertia ERP" },
      {
        name: "description",
        content:
          "Controlled security audit programs, scope definition, control checklists, non-conformance management, root-cause analysis, CAPA verification, and ISO 27001/IEC 62443 compliance.",
      },
    ],
  }),
  component: SecurityAuditPage,
});

const AUDIT_TYPE_COLORS = [
  "#2563eb",
  "#06b6d4",
  "#ef4444",
  "#f59e0b",
  "#8b5cf6",
  "#10b981",
  "#ec4899",
  "#64748b",
];

const AUDIT_STATUS_BY_TYPE = [
  { name: "Physical Security", count: 6 },
  { name: "Information Security", count: 5 },
  { name: "Cybersecurity", count: 4 },
  { name: "Surveillance", count: 3 },
  { name: "Access Control", count: 2 },
  { name: "Visitor Management", count: 2 },
  { name: "Incident Management", count: 1 },
  { name: "Others", count: 1 },
];

const FINDINGS_SEVERITY_DATA = [
  { severity: "Critical", count: 1, fill: "#ef4444" },
  { severity: "Major", count: 3, fill: "#f97316" },
  { severity: "Minor", count: 8, fill: "#f59e0b" },
  { severity: "Observation", count: 6, fill: "#3b82f6" },
];

const COMPLIANCE_TREND_DATA = [
  { month: "Apr", completion: 74, evidence: 65 },
  { month: "May", completion: 78, evidence: 69 },
  { month: "Jun", completion: 82, evidence: 74 },
  { month: "Jul", completion: 85, evidence: 79 },
  { month: "Aug", completion: 88, evidence: 83 },
  { month: "Sep", completion: 91, evidence: 86 },
];

const PAGE_DATASET = { AUDIT_STATUS_BY_TYPE, FINDINGS_SEVERITY_DATA, COMPLIANCE_TREND_DATA };

function SecurityAuditPage() {
  const { AUDIT_STATUS_BY_TYPE, FINDINGS_SEVERITY_DATA, COMPLIANCE_TREND_DATA } = useModuleDataset("security-management.security-audit", "Security Audit", PAGE_DATASET);
  const [facilityFilter, setFacilityFilter] = useState("All Facilities");
  const [searchQuery, setSearchQuery] = useState("");

  // Workspace State
  const [workspaceStep, setWorkspaceStep] = usePersistentState("security-management.security-audit", "Security Audit", "workspaceStep", 4); // 4 = Audit Execution (In Progress)
  const [workspaceSection, setWorkspaceSection] = useState("Basic Details");
  const [scopeTab, setScopeTab] = useState<"Facilities" | "Departments" | "Systems" | "Processes">("Facilities");
  const [aiTab, setAiTab] = useState<"Insights" | "Recommendations">("Insights");
  const [aiQuestion, setAiQuestion] = useState("");

  // Audit Form State
  const [auditRef, setAuditRef] = usePersistentState("security-management.security-audit", "Security Audit", "auditRef", "SA-INF-2026-001");
  const [auditType, setAuditType] = usePersistentState("security-management.security-audit", "Security Audit", "auditType", "Internal Audit");
  const [auditArea, setAuditArea] = usePersistentState("security-management.security-audit", "Security Audit", "auditArea", "Information Security");
  const [facility, setFacility] = usePersistentState("security-management.security-audit", "Security Audit", "facility", "HQ - Namakkal");
  const [leadAuditor, setLeadAuditor] = usePersistentState("security-management.security-audit", "Security Audit", "leadAuditor", "Ramesh S");
  const [classification, setClassification] = usePersistentState("security-management.security-audit", "Security Audit", "classification", "Confidential");
  const [riskLevel, setRiskLevel] = usePersistentState("security-management.security-audit", "Security Audit", "riskLevel", "Medium");
  const [status, setStatus] = usePersistentState("security-management.security-audit", "Security Audit", "status", "In Progress");
  const [auditDesc, setAuditDesc] = usePersistentState("security-management.security-audit", "Security Audit", "auditDesc", 
    "Internal audit to assess information security controls, data protection, access management and compliance with ISO 27001."
  );

  // New Audit Modal
  const [showNewAuditModal, setShowNewAuditModal] = useState(false);
  const [newAuditTitle, setNewAuditTitle] = useState("");
  const [newAuditArea, setNewAuditArea] = useState("Access Control");
  const [scheduledAudits, setScheduledAudits] = usePersistentState<Submission[]>("security-management.security-audit", "Security Audit", "scheduledAudits", []);


  const handleSaveDraft = () => {
    toast.success(`Audit workspace ${auditRef} saved.`);
  };

  const handleSubmitForReview = () => {
    setStatus("Under Review");
    toast.success(`Audit ${auditRef} submitted for Lead Auditor & CISO review.`);
  };

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    toast.info(`AI Security Audit Assistant analyzing: "${aiQuestion}"...`);
    setAiQuestion("");
  };

  const handleGenerateFinding = () => {
    toast.success("AI Draft Finding generated: Access Review Overdue (ISO 27001 A.9.2.5). Added to Findings ledger.");
  };

  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuditTitle.trim()) {
      toast.error("Please enter an audit title.");
      return;
    }
    const sub = makeSubmission(scheduledAudits, "AUD", { Title: newAuditTitle.trim(), Area: newAuditArea }, "Title");
    setScheduledAudits((prev) => [{ ...sub, status: "Scheduled" }, ...prev]);
    toast.success(`Audit ${sub.code} "${newAuditTitle.trim()}" (${newAuditArea}) scheduled in the Master Program.`);
    setShowNewAuditModal(false);
    setNewAuditTitle("");
  };

  return (
    <AppShell
      title="Security Audit"
      breadcrumb="Management > Security Management > Security Audit"
      description="Internal and external security audits, ISO 27001 control verification, non-conformance tracking, corrective action plans (CAPA), and compliance reporting."
      tabs={<SecurityManagementTabBar />}
    >
      <div className="space-y-4 pb-16">
        {/* Executive Submodule Header */}
        <SecuritySubmoduleHeader
          icon={ShieldCheck}
          title="Security Audit"
          code="AUD-2026-021"
          status="In Progress"
          subtitle="Evidence-backed compliance audits, vulnerability validation, CISO sign-off workflows, and closed-loop corrective action implementation."
          slogan="Plan. Assess. Verify. Improve Security."
          bannerQuote="Rigorous compliance, evidence-backed control assessments, and closed-loop corrective actions across all physical, digital, and cloud assets."
          primaryActionLabel="+ New Audit Program"
          onPrimaryAction={() => setShowNewAuditModal(true)}
          onGenerateReport={() => exportRecords("Security Audit Dossier", [...recordToRows({ auditRef, auditType, auditArea, facility, leadAuditor, classification, riskLevel, status, description: auditDesc }), ...scheduledAudits.map((a) => ({ field: `Scheduled audit ${a.code}`, value: `${a.title} · ${a.details.Area ?? ""}` }))], "pdf")}
          onMoreActions={(act) => toast.info(`Action: ${act}`)}
        />

        <SubmissionsPanel title="Scheduled Audits" items={scheduledAudits} />

        {/* Executive 7-Gauge Circular Score Banner matching Screenshot */}
        <ProductScoreBanner submoduleKey="security-audit" />


        {/* 10 KPI Stat Cards Matching Screenshot 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-medium text-slate-500">Audits Planned</span>
            <div className="text-xl font-bold text-slate-900 mt-1">24</div>
            <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">↑ 20% vs prev qtr</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-medium text-slate-500">Completed</span>
            <div className="text-xl font-bold text-emerald-600 mt-1">19</div>
            <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">↑ 12%</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-medium text-slate-500">In Progress</span>
            <div className="text-xl font-bold text-blue-600 mt-1">3</div>
            <span className="text-[9px] text-blue-600 font-semibold mt-0.5">Active field</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-medium text-slate-500">Open Findings</span>
            <div className="text-xl font-bold text-rose-600 mt-1">17</div>
            <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">↓ 18%</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-medium text-slate-500">Major Findings</span>
            <div className="text-xl font-bold text-rose-700 mt-1">3</div>
            <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">↓ 40%</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-medium text-slate-500">Minor Findings</span>
            <div className="text-xl font-bold text-amber-600 mt-1">8</div>
            <span className="text-[9px] text-amber-600 font-semibold mt-0.5">↑ 14%</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-medium text-slate-500">Observations</span>
            <div className="text-xl font-bold text-slate-700 mt-1">6</div>
            <span className="text-[9px] text-slate-500 font-semibold mt-0.5">Improvement</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-medium text-slate-500">Open CAPA</span>
            <div className="text-xl font-bold text-purple-600 mt-1">11</div>
            <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">↓ 15%</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-medium text-slate-500">Overdue CAPA</span>
            <div className="text-xl font-bold text-rose-600 mt-1">2</div>
            <span className="text-[9px] text-rose-600 font-semibold mt-0.5">↑ 100% (Urgent)</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-medium text-slate-500">Completion Rate</span>
            <div className="text-xl font-bold text-emerald-600 mt-1">91.7%</div>
            <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">On Schedule</span>
          </div>
        </div>

        {/* Charts Row: Audit Status by Type + Findings by Severity + Compliance Trend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status by Type Donut */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900">Audit Status by Type</h3>
              <span className="text-[11px] text-blue-600 font-semibold cursor-pointer">View All</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-32 w-32 shrink-0 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={AUDIT_STATUS_BY_TYPE}
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {AUDIT_STATUS_BY_TYPE.map((_, idx) => (
                        <Cell key={`cell-${idx}`} fill={AUDIT_TYPE_COLORS[idx % AUDIT_TYPE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <div className="text-xs font-bold text-slate-900">24</div>
                  <div className="text-[8px] text-slate-500">Total Audits</div>
                </div>
              </div>
              <div className="space-y-1 text-[10px] flex-1">
                {AUDIT_STATUS_BY_TYPE.slice(0, 5).map((t, i) => (
                  <div key={t.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600 truncate">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: AUDIT_TYPE_COLORS[i] }}
                      />
                      {t.name}
                    </span>
                    <span className="font-bold text-slate-900">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Findings by Severity Bar Chart */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900">Findings by Severity</h3>
              <span className="text-[11px] text-blue-600 font-semibold cursor-pointer">View All</span>
            </div>
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FINDINGS_SEVERITY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="severity" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {FINDINGS_SEVERITY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Audit Compliance Trend Line Chart */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900">Audit Compliance Trend</h3>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-blue-600 font-semibold">● Completion %</span>
                <span className="text-emerald-600 font-semibold">● Evidence %</span>
              </div>
            </div>
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={COMPLIANCE_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                  />
                  <Line type="monotone" dataKey="completion" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="evidence" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Operational Tables Row: Upcoming Audits + Open Findings + Audit Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Upcoming Audits */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900">Upcoming Audits</h3>
              <span className="text-[11px] text-blue-600 font-semibold cursor-pointer">View All</span>
            </div>
            <div className="space-y-2 mt-2">
              {mockUpcomingAudits.map((aud) => (
                <div
                  key={aud.id}
                  className="p-2 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{aud.auditId}</div>
                    <div className="text-[10px] text-slate-500">
                      {aud.auditArea} • {aud.facility}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                      {aud.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{aud.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Findings */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900">Open Findings</h3>
              <span className="text-[11px] text-blue-600 font-semibold cursor-pointer">View All</span>
            </div>
            <div className="space-y-2 mt-2">
              {mockOpenFindingsList.map((fnd) => (
                <div
                  key={fnd.id}
                  className="p-2 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{fnd.findingCode}</div>
                    <div className="text-[10px] text-slate-500">{fnd.area}</div>
                  </div>
                  <div className="text-right flex items-center gap-1.5">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded",
                        fnd.severity === "Critical"
                          ? "bg-rose-50 text-rose-700"
                          : fnd.severity === "Major"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-amber-50 text-amber-700"
                      )}
                    >
                      {fnd.severity}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded",
                        fnd.status === "Open" ? "bg-rose-100 text-rose-800" : "bg-purple-100 text-purple-800"
                      )}
                    >
                      {fnd.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Calendar Widget */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900">Audit Calendar - Sep 2026</h3>
              <span className="text-[11px] text-blue-600 font-semibold cursor-pointer">View All</span>
            </div>

            {/* Simple Grid Calendar */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="font-bold text-slate-400 py-0.5">
                  {d}
                </div>
              ))}
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const isAuditDay = [5, 12, 18, 22, 28, 30].includes(day);
                const isCurrent = day === 28;
                return (
                  <div
                    key={day}
                    onClick={() => toast.info(`Calendar day ${day} Sep: 2 scheduled audit milestones.`)}
                    className={cn(
                      "py-1.5 rounded cursor-pointer transition-colors relative",
                      isCurrent
                        ? "bg-blue-600 text-white font-bold"
                        : isAuditDay
                        ? "bg-blue-50 text-blue-900 font-semibold"
                        : "hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    {day}
                    {isAuditDay && !isCurrent && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-blue-600" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500">
              <span className="text-blue-600">● Planned</span>
              <span className="text-amber-600">● In Progress</span>
              <span className="text-emerald-600">● Completed</span>
              <span className="text-rose-600">● Overdue</span>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Security Audit - Audit Workspace AUD-2026-001 (Matching Screenshot 1) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Workspace Title & Actions Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Security Audit - Audit Workspace
                  </h2>
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    AUD-2026-021
                  </span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    In Progress
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Information Security Controls & ISO 27001 Verification
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
              >
                Save Draft
              </button>
              <button
                onClick={handleSubmitForReview}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
              >
                Submit for Review
              </button>
              <button
                onClick={() => toast.info("Audit Actions: Export Dossier, Transfer Lead, Request Extension")}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white"
              >
                More Actions ▾
              </button>
            </div>
          </div>

          {/* 8-Step Lifecycle Stepper */}
          <div className="px-6 py-3.5 border-b border-slate-200 bg-white overflow-x-auto">
            <div className="flex items-center justify-between min-w-[700px] text-xs">
              {[
                { num: 1, label: "Plan", status: "Completed" },
                { num: 2, label: "Notification", status: "Completed" },
                { num: 3, label: "Opening Meeting", status: "Completed" },
                { num: 4, label: "Audit Execution", status: "In Progress" },
                { num: 5, label: "Findings", status: "Pending" },
                { num: 6, label: "CAPA", status: "Pending" },
                { num: 7, label: "Report", status: "Pending" },
                { num: 8, label: "Closure", status: "Pending" },
              ].map((s) => (
                <div
                  key={s.num}
                  onClick={() => {
                    setWorkspaceStep(s.num);
                    toast.info(`Switched active workspace step to ${s.num}. ${s.label}`);
                  }}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <span
                    className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center font-bold text-[11px] transition-colors",
                      s.status === "Completed"
                        ? "bg-emerald-600 text-white"
                        : s.status === "In Progress"
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    )}
                  >
                    {s.status === "Completed" ? "✓" : s.num}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 text-[11px]">
                      {s.label}
                    </div>
                    <div
                      className={cn(
                        "text-[9px]",
                        s.status === "Completed"
                          ? "text-emerald-600"
                          : s.status === "In Progress"
                          ? "text-blue-600 font-semibold"
                          : "text-slate-400"
                      )}
                    >
                      ({s.status})
                    </div>
                  </div>
                  {s.num < 8 && <ChevronRight className="h-4 w-4 text-slate-300 ml-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* Workspace Body: Left Sub-Nav + Center Form/Scope + Right AI Assistant */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* Left Sub-Nav (Col 2) */}
            <div className="lg:col-span-2 p-3 space-y-1 bg-slate-50/50">
              {[
                "Basic Details",
                "Scope & Criteria",
                "Audit Team",
                "Schedule",
                "Checklist & Execution",
                "Evidence",
                "Findings",
                "CAPA",
                "Report",
                "Attachments",
                "Audit Trail",
              ].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setWorkspaceSection(sec);
                    toast.info(`Switched section to ${sec}`);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between",
                    workspaceSection === sec
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <span>{sec}</span>
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5",
                      workspaceSection === sec ? "text-white" : "text-slate-400"
                    )}
                  />
                </button>
              ))}
            </div>

            {/* Center Area: Audit Information + Scope + Team (Col 7) */}
            <div className="lg:col-span-7 p-6 space-y-6">
              {/* Audit Information Form */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Audit Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Audit ID
                    </label>
                    <input
                      type="text"
                      disabled
                      value="AUD-2026-021"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-mono text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Audit Reference *
                    </label>
                    <input
                      type="text"
                      value={auditRef}
                      onChange={(e) => setAuditRef(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Audit Type *
                    </label>
                    <select
                      value={auditType}
                      onChange={(e) => setAuditType(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Internal Audit">Internal Audit</option>
                      <option value="External Audit">External Audit</option>
                      <option value="Compliance Audit">Compliance Audit</option>
                      <option value="Special Security Audit">Special Security Audit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Audit Area *
                    </label>
                    <select
                      value={auditArea}
                      onChange={(e) => setAuditArea(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Information Security">Information Security</option>
                      <option value="Physical Security">Physical Security</option>
                      <option value="Surveillance">Surveillance</option>
                      <option value="Access Control">Access Control</option>
                      <option value="Visitor Management">Visitor Management</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Facility *
                    </label>
                    <select
                      value={facility}
                      onChange={(e) => setFacility(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="HQ - Namakkal">HQ - Namakkal</option>
                      <option value="Plant 2 - Coimbatore">Plant 2 - Coimbatore</option>
                      <option value="Plant 1 - Coimbatore">Plant 1 - Coimbatore</option>
                      <option value="R&D Centre">R&D Centre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Lead Auditor *
                    </label>
                    <select
                      value={leadAuditor}
                      onChange={(e) => setLeadAuditor(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Ramesh S">Ramesh S</option>
                      <option value="Priya Sharma">Priya Sharma</option>
                      <option value="Karthik P">Karthik P</option>
                      <option value="Divya R">Divya R</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Description & Objectives
                  </label>
                  <textarea
                    rows={2}
                    value={auditDesc}
                    onChange={(e) => setAuditDesc(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Audit Scope Box */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">Audit Scope</h3>
                    <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-slate-200 text-[10px]">
                      {(["Facilities", "Departments", "Systems", "Processes"] as const).map(
                        (t) => (
                          <button
                            key={t}
                            onClick={() => setScopeTab(t)}
                            className={cn(
                              "px-2 py-0.5 rounded font-semibold transition-colors",
                              scopeTab === t
                                ? "bg-blue-600 text-white"
                                : "text-slate-600 hover:bg-slate-100"
                            )}
                          >
                            {t} ({t === "Facilities" ? 3 : t === "Departments" ? 4 : t === "Systems" ? 5 : 6})
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toast.info("Opening Add Scope Item dialog...")}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    + Add Scope Item
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                      <tr>
                        <th className="px-3 py-2">Facility</th>
                        <th className="px-3 py-2">Area / Department</th>
                        <th className="px-3 py-2">Boundary Scope</th>
                        <th className="px-3 py-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                      <tr>
                        <td className="px-3 py-2 font-medium">HQ - Namakkal</td>
                        <td className="px-3 py-2">IT Department</td>
                        <td className="px-3 py-2">Access Control, Data Protection</td>
                        <td className="px-3 py-2 text-right text-emerald-700 font-semibold">In Scope</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium">HQ - Namakkal</td>
                        <td className="px-3 py-2">HR Department</td>
                        <td className="px-3 py-2">Employee Data Security</td>
                        <td className="px-3 py-2 text-right text-emerald-700 font-semibold">In Scope</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium">HQ - Namakkal</td>
                        <td className="px-3 py-2">Admin</td>
                        <td className="px-3 py-2">Physical & Document Security</td>
                        <td className="px-3 py-2 text-right text-emerald-700 font-semibold">In Scope</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit Team Box */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">Audit Team Assignments</h3>
                  <button
                    onClick={() => toast.info("Assigning team auditor...")}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    + Add Team Member
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900">Ramesh S</div>
                    <div className="text-[11px] text-blue-700 font-medium">Lead Auditor</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Security • Active</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900">Priya Sharma</div>
                    <div className="text-[11px] text-blue-700 font-medium">Auditor</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Compliance • Active</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900">Karthik P</div>
                    <div className="text-[11px] text-blue-700 font-medium">Technical Auditor</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">IT • Active</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Area: AI Audit Assistant (Col 3) */}
            <div className="lg:col-span-3 p-5 bg-gradient-to-b from-purple-50/40 via-white to-slate-50/60 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-purple-100">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">AI Audit Assistant</h3>
                    <p className="text-[10px] text-purple-700">Predictive Gap & Evidence Analytics</p>
                  </div>
                </div>

                {/* Sub-tabs */}
                <div className="flex items-center gap-1 my-3 bg-purple-100/50 p-1 rounded-lg text-xs">
                  {(["Insights", "Recommendations"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setAiTab(t)}
                      className={cn(
                        "flex-1 py-1 rounded font-bold text-[10px] transition-colors",
                        aiTab === t
                          ? "bg-purple-600 text-white shadow-xs"
                          : "text-purple-900 hover:bg-purple-100"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Insights Cards List */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                    <div className="flex items-center gap-1.5 font-bold text-rose-900 text-[11px]">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                      Higher risk area detected
                    </div>
                    <p className="text-[10px] text-rose-700 mt-1 leading-relaxed">
                      3 high-risk controls in Access Management lack verified Q3 reviews.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px]">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                      Evidence gap
                    </div>
                    <p className="text-[10px] text-amber-700 mt-1 leading-relaxed">
                      5 checklist items without uploaded evidence files or digital hashes.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center gap-1.5 font-bold text-blue-900 text-[11px]">
                      <FileText className="h-3.5 w-3.5 text-blue-600" />
                      Repeat finding trend
                    </div>
                    <p className="text-[10px] text-blue-700 mt-1 leading-relaxed">
                      2 recurring findings from previous audit on PAM session recordings.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="flex items-center gap-1.5 font-bold text-purple-900 text-[11px]">
                      <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                      Compliance suggestion
                    </div>
                    <p className="text-[10px] text-purple-700 mt-1 leading-relaxed">
                      Review ISO 27001 A.9.1 access control policy formulation.
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={handleGenerateFinding}
                    className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Generate Draft Finding
                  </button>
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAskAI} className="pt-3 border-t border-purple-100 flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Ask AI about this audit..."
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-purple-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="h-8 w-8 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* New Audit Modal */}
        {showNewAuditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Initiate Security Audit</h3>
                    <p className="text-xs text-slate-500">Plan a new internal or external audit exercise</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewAuditModal(false)}
                  className="h-7 w-7 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateAudit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Audit Program Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q4 Autonomous EVSE Firmware & Cloud Security Audit"
                    value={newAuditTitle}
                    onChange={(e) => setNewAuditTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Audit Area *
                    </label>
                    <select
                      value={newAuditArea}
                      onChange={(e) => setNewAuditArea(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Access Control">Access Control</option>
                      <option value="Identity Management">Identity Management</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Information Security">Information Security</option>
                      <option value="Physical Security">Physical Security</option>
                      <option value="Visitor Management">Visitor Management</option>
                      <option value="Surveillance">Surveillance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Lead Auditor *
                    </label>
                    <select className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white">
                      <option>Ramesh S (Lead Auditor)</option>
                      <option>Priya Sharma (CISO)</option>
                      <option>Arun Kumar (Security Lead)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAuditModal(false)}
                    className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs"
                  >
                    Create & Schedule
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
