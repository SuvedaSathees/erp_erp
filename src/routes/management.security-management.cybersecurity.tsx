// Magnertia ERP - Cybersecurity
// Management → Security Management → Cybersecurity
// Aligned with Screenshot 5 & Prompt 3 Specifications

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldAlert,
  ShieldCheck,
  Server,
  AlertTriangle,
  FileCheck2,
  Lock,
  Plus,
  RefreshCw,
  Printer,
  Edit2,
  X,
  Sparkles,
  Zap,
  Radio,
  Cpu,
  CheckCircle2,
  Save,
  Globe,
  Database,
  Terminal,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
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
  mockCybersecurityRecord,
  mockCyberVulnerabilities,
  mockCyberIncidents,
  type CybersecurityRecord,
} from "@/services/securityManagementService";
import { toast } from "sonner";

import { useModuleDataset } from "@/services/moduleDatasetService";
import { usePersistentState } from "@/services/moduleDatasetService";
import { SubmissionsPanel, makeSubmission, type Submission } from "@/components/erp/SubmissionsPanel";
import { readFieldsNear } from "@/lib/formCapture";
import { exportRecords, recordToRows } from "@/lib/recordExport";
import { savePageForm } from "@/lib/pageActions";
export const Route = createFileRoute("/management/security-management/cybersecurity")({
  head: () => ({
    meta: [
      { title: "Cybersecurity · Magnertia ERP" },
      {
        name: "description",
        content:
          "Identify, protect, detect, respond, recover and govern cybersecurity across cloud, IoT, EVSE charging, enterprise infrastructure and APIs.",
      },
    ],
  }),
  component: CybersecurityPage,
});


const SECURITY_TREND_DATA = [
  { month: "Jan", assets: 1020, vulnerabilities: 32, incidents: 8, riskScore: 68 },
  { month: "Feb", assets: 1060, vulnerabilities: 35, incidents: 7, riskScore: 66 },
  { month: "Mar", assets: 1100, vulnerabilities: 30, incidents: 9, riskScore: 64 },
  { month: "Apr", assets: 1140, vulnerabilities: 38, incidents: 6, riskScore: 62 },
  { month: "May", assets: 1180, vulnerabilities: 42, incidents: 8, riskScore: 60 },
  { month: "Jun", assets: 1205, vulnerabilities: 40, incidents: 5, riskScore: 58 },
  { month: "Jul", assets: 1220, vulnerabilities: 44, incidents: 7, riskScore: 57 },
  { month: "Aug", assets: 1250, vulnerabilities: 49, incidents: 8, riskScore: 56 },
  { month: "Sep", assets: 1284, vulnerabilities: 47, incidents: 5, riskScore: 54 },
];

const ASSETS_BY_TYPE = [
  { name: "Servers", value: 18, color: "#3B82F6" },
  { name: "Endpoints", value: 16, color: "#10B981" },
  { name: "Network Devices", value: 12, color: "#6366F1" },
  { name: "Applications", value: 14, color: "#8B5CF6" },
  { name: "Cloud Services", value: 10, color: "#06B6D4" },
  { name: "IoT / IIoT", value: 12, color: "#F59E0B" },
  { name: "EV Charging Stations", value: 8, color: "#14B8A6" },
  { name: "Databases", value: 6, color: "#EC4899" },
  { name: "APIs", value: 4, color: "#F97316" },
  { name: "Others", value: 10, color: "#94A3B8" },
];

const VULN_SEVERITY = [
  { name: "Critical", count: 5, pct: "11%", color: "#EF4444" },
  { name: "High", count: 14, pct: "30%", color: "#F97316" },
  { name: "Medium", count: 18, pct: "38%", color: "#FBBF24" },
  { name: "Low", count: 10, pct: "21%", color: "#10B981" },
];

const INCIDENT_STATUS_DATA = [
  { name: "Open", count: 4, color: "#3B82F6" },
  { name: "Investigating", count: 3, color: "#F59E0B" },
  { name: "Contained", count: 2, color: "#10B981" },
  { name: "Resolved", count: 2, color: "#8B5CF6" },
  { name: "Closed", count: 1, color: "#64748B" },
];

const PAGE_DATASET = { SECURITY_TREND_DATA, ASSETS_BY_TYPE, VULN_SEVERITY, INCIDENT_STATUS_DATA };

function CybersecurityPage() {
  const { SECURITY_TREND_DATA, ASSETS_BY_TYPE, VULN_SEVERITY, INCIDENT_STATUS_DATA } = useModuleDataset("security-management.cybersecurity", "Cybersecurity Management", PAGE_DATASET);
  const [record, setRecord] = usePersistentState<CybersecurityRecord>("security-management.cybersecurity", "Cybersecurity Management", "record", mockCybersecurityRecord);
  const [submissions, setSubmissions] = usePersistentState<Submission[]>("security-management.cybersecurity", "Cybersecurity Management", "submissions", []);
  const [recordType, setRecordType] = useState<"Asset" | "Vulnerability" | "Incident" | "Risk">("Asset");
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);

  return (
    <AppShell
      title="Cybersecurity Management"
      breadcrumb="Management > Security Management > Cybersecurity"
      description="Threat intelligence, endpoint protection, continuous vulnerability scanning, incident detection and response (SOC), and cloud perimeter defense."
      tabs={<SecurityManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Executive Header matching screenshot 5 */}
        <SecuritySubmoduleHeader
          icon={ShieldAlert}
          title="Cybersecurity Management"
          code="CYB-2026-001"
          badge="Active"
          subtitle="Proactive threat hunting, real-time perimeter surveillance, automated incident containment, and cyber resilience assurance across all systems."
          bannerQuote="Secure People. Secure Systems. Secure Tomorrow."
          primaryActionLabel="+ New Security Record"
          onPrimaryAction={() => setShowNewRecordModal(true)}
          onGenerateReport={() => exportRecords("Cybersecurity Management Report", recordToRows(record), "pdf")}
        />

        <SubmissionsPanel title="Registered Cybersecurity Records" items={submissions} />

        {/* Executive 7-Gauge Circular Score Banner matching Screenshot */}
        <ProductScoreBanner submoduleKey="cybersecurity" />

        {/* 6 KPI Cards matching screenshot 5 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Total Assets</span>
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Server className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">1,284</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↑ 6%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Open Vulnerabilities</span>
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">47</div>
            <div className="mt-1 flex items-center text-[10px] text-amber-600 font-semibold">
              <span>↑ 18%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Critical Vulnerabilities</span>
              <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">5</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↓ 50%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Security Incidents</span>
              <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Radio className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">12</div>
            <div className="mt-1 flex items-center text-[10px] text-purple-600 font-semibold">
              <span>↑ 25%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Patch Compliance</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <FileCheck2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">94.6%</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↑ 3%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">MFA Coverage</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">98.2%</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↑ 2%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>
        </div>

        {/* Row 1: Cybersecurity Record Form (Left) + Security Trend Multi-Line Chart (Center) + Assets Donut (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Cybersecurity Record Form Card */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Cybersecurity Record</h3>
              <button
                onClick={(e) => savePageForm("Record CYB-2026-001 updated", e.currentTarget)}
                className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                <Save className="h-3 w-3" /> Save
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cybersecurity ID</span>
                <span className="font-mono font-semibold text-foreground">{record.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Reference No.</span>
                <span className="font-mono text-muted-foreground">{record.referenceNo}</span>
              </div>

              {/* Record Type Selector */}
              <div>
                <span className="text-muted-foreground block mb-1">Record Type</span>
                <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-muted text-[10px] font-semibold text-center">
                  {(["Asset", "Vulnerability", "Incident", "Risk"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setRecordType(t)}
                      className={cn(
                        "py-1 rounded-md transition-all cursor-pointer",
                        recordType === t ? "bg-primary text-primary-foreground shadow-2xs" : "text-muted-foreground"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Asset Name</span>
                <span className="font-semibold text-foreground truncate max-w-[140px]">{record.assetName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Asset Type</span>
                <span className="rounded-lg bg-muted px-2 py-0.5 font-semibold text-foreground">{record.assetType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Category</span>
                <span className="text-foreground">{record.assetCategory}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Product/System</span>
                <span className="text-foreground truncate max-w-[130px]">{record.productSystem}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Location</span>
                <span className="text-foreground">{record.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Asset Owner</span>
                <span className="text-foreground font-semibold">{record.assetOwner}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Business Owner</span>
                <span className="text-foreground">{record.businessOwner}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Environment</span>
                <span className="text-foreground">{record.environment}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Classification</span>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                  {record.dataClassification}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Internet Exposure</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  Yes
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Security Status</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {record.securityStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Criticality</span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                  {record.criticality}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Risk Score</span>
                <span className="font-bold text-amber-600">{record.riskScore}</span>
              </div>
              <div className="pt-2 border-t border-border/60">
                <p className="text-[11px] text-muted-foreground">Description</p>
                <p className="text-xs text-foreground mt-0.5 line-clamp-2">{record.description}</p>
              </div>
            </div>
          </div>

          {/* Security Trend (Last 12 Months) Multi-Line Chart */}
          <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">Security Trend (Last 12 Months)</h3>
                <p className="text-xs text-muted-foreground">Multi-series tracking assets, vulnerabilities and incidents</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-lg bg-muted px-2 py-1 font-semibold text-foreground">Monthly</span>
                <span className="text-muted-foreground">Last 12 Months</span>
              </div>
            </div>

            <div className="h-[260px] w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={SECURITY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="assets" stroke="#0A3C75" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="left" type="monotone" dataKey="vulnerabilities" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="left" type="monotone" dataKey="incidents" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="right" type="monotone" dataKey="riskScore" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-5 text-xs pt-2 border-t border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[#0A3C75]" /> Assets
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Vulnerabilities
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Incidents
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Risk Score
              </span>
            </div>
          </div>

          {/* Assets by Type Donut */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Assets by Type</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <div className="h-[170px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ASSETS_BY_TYPE} innerRadius={50} outerRadius={72} paddingAngle={2} dataKey="value">
                      {ASSETS_BY_TYPE.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute top-[65px] text-center">
                <span className="font-display text-lg font-bold text-foreground">1,284</span>
                <p className="text-[10px] text-muted-foreground font-semibold">Total Assets</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-2 border-t border-border">
              {ASSETS_BY_TYPE.slice(0, 8).map((asset) => (
                <div key={asset.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground truncate">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: asset.color }} />
                    {asset.name}
                  </span>
                  <span className="font-semibold text-foreground">{asset.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Vulnerability Severity Donut, Incident Status Donut & Risk Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Vulnerability Severity */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Vulnerability Severity</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <div className="h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={VULN_SEVERITY} innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="count">
                      {VULN_SEVERITY.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute top-[60px] text-center">
                <span className="font-display text-lg font-bold text-foreground">47</span>
                <p className="text-[10px] text-muted-foreground font-semibold">Open</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border">
              {VULN_SEVERITY.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-semibold text-foreground">{item.count} ({item.pct})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Status */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Incident Status</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <div className="h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={INCIDENT_STATUS_DATA} innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="count">
                      {INCIDENT_STATUS_DATA.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute top-[60px] text-center">
                <span className="font-display text-lg font-bold text-foreground">12</span>
                <p className="text-[10px] text-muted-foreground font-semibold">Incidents</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border">
              {INCIDENT_STATUS_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-semibold text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Heatmap (Matrix) */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Risk Heatmap</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View Matrix</span>
            </div>

            <div className="space-y-1.5 py-2">
              <div className="grid grid-cols-5 gap-1.5 items-center text-[10px] text-muted-foreground font-medium">
                <span>Very High</span>
                <div className="h-7 rounded bg-emerald-500/10 flex items-center justify-center font-bold">0</div>
                <div className="h-7 rounded bg-amber-500/15 flex items-center justify-center font-bold">1</div>
                <div className="h-7 rounded bg-rose-500/20 text-rose-700 flex items-center justify-center font-bold">1</div>
                <div className="h-7 rounded bg-rose-500/30 text-rose-800 flex items-center justify-center font-bold">0</div>
              </div>
              <div className="grid grid-cols-5 gap-1.5 items-center text-[10px] text-muted-foreground font-medium">
                <span>High</span>
                <div className="h-7 rounded bg-emerald-500/10 flex items-center justify-center font-bold">0</div>
                <div className="h-7 rounded bg-amber-500/15 flex items-center justify-center font-bold">2</div>
                <div className="h-7 rounded bg-rose-500/20 text-rose-700 flex items-center justify-center font-bold">1</div>
                <div className="h-7 rounded bg-rose-500/30 text-rose-800 flex items-center justify-center font-bold">0</div>
              </div>
              <div className="grid grid-cols-5 gap-1.5 items-center text-[10px] text-muted-foreground font-medium">
                <span>Medium</span>
                <div className="h-7 rounded bg-emerald-500/10 flex items-center justify-center font-bold">1</div>
                <div className="h-7 rounded bg-emerald-500/15 flex items-center justify-center font-bold">1</div>
                <div className="h-7 rounded bg-amber-500/15 flex items-center justify-center font-bold">1</div>
                <div className="h-7 rounded bg-rose-500/20 text-rose-700 flex items-center justify-center font-bold">1</div>
              </div>
              <div className="grid grid-cols-5 gap-1.5 items-center text-[10px] text-muted-foreground font-medium">
                <span>Low</span>
                <div className="h-7 rounded bg-emerald-500/10 flex items-center justify-center font-bold">2</div>
                <div className="h-7 rounded bg-emerald-500/10 flex items-center justify-center font-bold">0</div>
                <div className="h-7 rounded bg-emerald-500/15 flex items-center justify-center font-bold">0</div>
                <div className="h-7 rounded bg-amber-500/15 flex items-center justify-center font-bold">0</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border">
              <span>Very Low</span>
              <span>Low</span>
              <span>Medium</span>
              <span>High Impact</span>
            </div>
          </div>
        </div>

        {/* Row 3: Tables - Recent Vulnerabilities & Recent Security Incidents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Recent Vulnerabilities */}
          <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Recent Vulnerabilities</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Asset</th>
                    <th className="pb-2">Vulnerability</th>
                    <th className="pb-2">CVE</th>
                    <th className="pb-2">Severity</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {mockCyberVulnerabilities.map((v) => (
                    <tr key={v.cve} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 text-muted-foreground">{v.date}</td>
                      <td className="py-2.5 font-medium text-foreground">{v.asset}</td>
                      <td className="py-2.5 text-foreground">{v.vulnerability}</td>
                      <td className="py-2.5 font-mono text-muted-foreground">{v.cve}</td>
                      <td className="py-2.5">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            v.severity === "Critical" && "bg-rose-500/10 text-rose-600",
                            v.severity === "High" && "bg-amber-500/10 text-amber-600",
                            v.severity === "Medium" && "bg-yellow-500/10 text-yellow-600"
                          )}
                        >
                          {v.severity}
                        </span>
                      </td>
                      <td className="py-2.5 font-medium text-foreground">{v.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Security Incidents */}
          <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Recent Security Incidents</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Incident No.</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Severity</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {mockCyberIncidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 text-muted-foreground">{inc.date}</td>
                      <td className="py-2.5 font-mono font-medium text-foreground">{inc.id}</td>
                      <td className="py-2.5 font-medium text-foreground">{inc.type}</td>
                      <td className="py-2.5">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            inc.severity === "Critical" && "bg-rose-500/10 text-rose-600",
                            inc.severity === "High" && "bg-amber-500/10 text-amber-600",
                            inc.severity === "Medium" && "bg-yellow-500/10 text-yellow-600"
                          )}
                        >
                          {inc.severity}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            inc.status === "Investigating" && "bg-amber-500/10 text-amber-600",
                            inc.status === "Open" && "bg-rose-500/10 text-rose-600",
                            inc.status === "Contained" && "bg-emerald-500/10 text-emerald-600",
                            inc.status === "Resolved" && "bg-purple-500/10 text-purple-600"
                          )}
                        >
                          {inc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Row 4: Security Control Compliance, Patch Management & Training Radials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Security Control Compliance Progress Bars */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <h3 className="font-display text-sm font-bold text-foreground pb-2 border-b border-border">
              Security Control Compliance
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Access Control</span>
                  <span className="font-bold text-foreground">96%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "96%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Endpoint Security</span>
                  <span className="font-bold text-foreground">92%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Network Security</span>
                  <span className="font-bold text-foreground">94%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "94%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Cloud Security</span>
                  <span className="font-bold text-foreground">90%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: "90%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Data Protection</span>
                  <span className="font-bold text-foreground">93%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "93%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Incident Response</span>
                  <span className="font-bold text-foreground">88%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: "88%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Patch Management Radial */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <h3 className="font-display text-sm font-bold text-foreground pb-2 border-b border-border">
              Patch Management
            </h3>

            <div className="flex items-center justify-center py-3">
              <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-8 border-emerald-500/20 border-t-emerald-500">
                <div className="text-center">
                  <span className="font-display text-xl font-bold text-foreground">94.6%</span>
                  <p className="text-[10px] font-semibold text-emerald-600">Compliant</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs pt-2 border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Patches</span>
                <span className="font-bold text-foreground">248</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Installed</span>
                <span className="font-bold text-emerald-600">235</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-bold text-amber-600">10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Failed</span>
                <span className="font-bold text-rose-600">3</span>
              </div>
            </div>
          </div>

          {/* Cybersecurity Training Radial */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <h3 className="font-display text-sm font-bold text-foreground pb-2 border-b border-border">
              Cybersecurity Training
            </h3>

            <div className="flex items-center justify-center py-3">
              <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-8 border-emerald-500/20 border-t-emerald-500">
                <div className="text-center">
                  <span className="font-display text-xl font-bold text-foreground">96.4%</span>
                  <p className="text-[10px] font-semibold text-emerald-600">Completed</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs pt-2 border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Users</span>
                <span className="font-bold text-foreground">486</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-bold text-emerald-600">469</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">In Progress</span>
                <span className="font-bold text-amber-600">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Not Started</span>
                <span className="font-bold text-rose-600">5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: New Security Record */}
        {showNewRecordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-base font-bold text-foreground">Add Cybersecurity Record</h3>
                <button onClick={() => setShowNewRecordModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
                <div>
                  <label className="font-semibold text-foreground">Asset Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. EV Charging Station Controller - PCS-03"
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Asset Type *</label>
                    <select className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs">
                      <option>EVSE</option>
                      <option>Server</option>
                      <option>Database</option>
                      <option>IoT Gateway</option>
                      <option>API Service</option>
                      <option>Cloud Resource</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Criticality *</label>
                    <select className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs">
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Location</label>
                    <input
                      type="text"
                      placeholder="Plant 2 - Coimbatore"
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Asset Owner</label>
                    <input
                      type="text"
                      placeholder="Ramesh S"
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-foreground">Description & Security Scope</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details on internet exposure, firmware version, and communication channels..."
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setShowNewRecordModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    setShowNewRecordModal(false);
                    const sub = makeSubmission(submissions, "CYB", readFieldsNear(e.currentTarget));
                    setSubmissions((prev) => [sub, ...prev]);
                    toast.success(`Record ${sub.code} registered & enrolled in SIEM monitoring`);
                  }}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Register Asset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
