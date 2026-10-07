// Magnertia ERP - Information Security
// Management → Security Management → Information Security
// Aligned with Screenshot 4 & Prompt 4 Specifications

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  ShieldCheck,
  ShieldAlert,
  Database,
  Lock,
  Layers,
  FileCheck2,
  AlertTriangle,
  Plus,
  RefreshCw,
  Printer,
  Edit2,
  X,
  CheckCircle2,
  Eye,
  FileSpreadsheet,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Trash2,
  Archive,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
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
  mockInformationSecurityRecord,
  mockInformationAssetsList,
  mockTopInformationRisks,
  type InformationSecurityMaster,
} from "@/services/securityManagementService";
import { toast } from "sonner";

export const Route = createFileRoute("/management/security-management/information-security")({
  head: () => ({
    meta: [
      { title: "Information Security · Magnertia ERP" },
      {
        name: "description",
        content:
          "Govern confidentiality, integrity, availability, classification, retention and disposal of enterprise information assets.",
      },
    ],
  }),
  component: InformationSecurityPage,
});


const ASSETS_BY_TYPE_DATA = [
  { name: "Documents", value: 28, color: "#3B82F6" },
  { name: "Database", value: 18, color: "#10B981" },
  { name: "Engineering Data", value: 12, color: "#06B6D4" },
  { name: "Source Code", value: 10, color: "#8B5CF6" },
  { name: "Customer Data", value: 8, color: "#F59E0B" },
  { name: "Financial Data", value: 6, color: "#EC4899" },
  { name: "HR Data", value: 6, color: "#6366F1" },
  { name: "IoT / EVSE Data", value: 6, color: "#14B8A6" },
  { name: "Emails", value: 4, color: "#64748B" },
  { name: "Others", value: 2, color: "#94A3B8" },
];

const CLASSIFICATION_BARS = [
  { name: "Internal", count: 842, color: "#10B981" },
  { name: "Confidential", count: 684, color: "#F59E0B" },
  { name: "Restricted", count: 142, color: "#EF4444" },
  { name: "Critical", count: 38, color: "#881337" },
  { name: "Public", count: 780, color: "#3B82F6" },
];

const LIFECYCLE_PIE_DATA = [
  { name: "Create", value: 6, color: "#3B82F6" },
  { name: "Classify", value: 18, color: "#06B6D4" },
  { name: "Store", value: 32, color: "#10B981" },
  { name: "Use", value: 20, color: "#8B5CF6" },
  { name: "Share", value: 8, color: "#F59E0B" },
  { name: "Retain", value: 8, color: "#EC4899" },
  { name: "Archive", value: 5, color: "#64748B" },
  { name: "Dispose", value: 3, color: "#EF4444" },
];

const INCIDENT_TREND = [
  { month: "Apr", incidents: 8, resolved: 7 },
  { month: "May", incidents: 10, resolved: 9 },
  { month: "Jun", incidents: 12, resolved: 11 },
  { month: "Jul", incidents: 7, resolved: 8 },
  { month: "Aug", incidents: 9, resolved: 8 },
  { month: "Sep", incidents: 5, resolved: 7 },
];

function InformationSecurityPage() {
  const [formData, setFormData] = useState<InformationSecurityMaster>(mockInformationSecurityRecord);
  const [showAssetModal, setShowAssetModal] = useState(false);

  return (
    <AppShell
      title="Information Security"
      breadcrumb="Management > Security Management > Information Security"
      description="Information classification, data loss prevention (DLP), encryption key management, privacy governance, and ISO/IEC 27001 regulatory compliance."
      tabs={<SecurityManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Executive Header matching screenshot 4 */}
        <SecuritySubmoduleHeader
          icon={FileText}
          title="Information Security"
          code="ISM-2026-001"
          badge="Active"
          subtitle="Confidentiality, integrity, and availability governance, data protection impact assessments, cryptographic controls, and secure data retention."
          bannerQuote="Secure Information. Enable Trust. Drive Innovation."
          primaryActionLabel="+ New Information Asset"
          onPrimaryAction={() => setShowAssetModal(true)}
          onGenerateReport={() => toast.success("Information Asset Master Register exported")}
        />

        {/* Executive 7-Gauge Circular Score Banner matching Screenshot */}
        <ProductScoreBanner submoduleKey="information-security" />

        {/* 7 KPI Cards matching screenshot 4 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Information Assets</span>
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Database className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">2,486</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↑ 6%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Confidential Assets</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">684</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↑ 8%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Restricted Assets</span>
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">142</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↓ 12%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Critical Assets</span>
              <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">38</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↑ 4%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Open Incidents</span>
              <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">5</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↓ 29%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Security Training</span>
              <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                <FileCheck2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">96.4%</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↑ 3%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Retention Compliance</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">94.8%</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↑ 2%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>
        </div>

        {/* Row 1: Charts Panel - Assets by Type Donut, Classification Bar Chart, Risk Heatmap & Lifecycle Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Information Assets by Type Donut */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Information Assets by Type</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <div className="h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ASSETS_BY_TYPE_DATA} innerRadius={48} outerRadius={68} paddingAngle={2} dataKey="value">
                      {ASSETS_BY_TYPE_DATA.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute top-[60px] text-center">
                <span className="font-display text-lg font-bold text-foreground">2,486</span>
                <p className="text-[10px] text-muted-foreground font-semibold">Assets</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-2 border-t border-border">
              {ASSETS_BY_TYPE_DATA.slice(0, 8).map((asset) => (
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

          {/* Classification Distribution Bar Chart */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Classification Distribution</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="h-[160px] w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CLASSIFICATION_BARS} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {CLASSIFICATION_BARS.map((entry, idx) => (
                      <Cell key={`bar-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-5 gap-1 text-center text-[10px] pt-2 border-t border-border">
              {CLASSIFICATION_BARS.map((item) => (
                <div key={item.name} className="p-1 rounded-lg bg-muted/20">
                  <span className="font-bold block text-foreground">{item.count}</span>
                  <span className="text-muted-foreground truncate block">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Information Security Risk Heatmap */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Security Risk Heatmap</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View Details</span>
            </div>

            <div className="space-y-1.5 py-1">
              <div className="grid grid-cols-5 gap-1 items-center text-[10px] text-muted-foreground">
                <span className="text-[9px]">Very High</span>
                <div className="h-6 rounded bg-emerald-500/10 flex items-center justify-center font-bold">0</div>
                <div className="h-6 rounded bg-amber-500/15 flex items-center justify-center font-bold">0</div>
                <div className="h-6 rounded bg-rose-500/20 text-rose-700 flex items-center justify-center font-bold">3</div>
                <div className="h-6 rounded bg-rose-500/30 text-rose-800 flex items-center justify-center font-bold">0</div>
              </div>
              <div className="grid grid-cols-5 gap-1 items-center text-[10px] text-muted-foreground">
                <span className="text-[9px]">High</span>
                <div className="h-6 rounded bg-emerald-500/10 flex items-center justify-center font-bold">0</div>
                <div className="h-6 rounded bg-amber-500/15 flex items-center justify-center font-bold">12</div>
                <div className="h-6 rounded bg-rose-500/20 text-rose-700 flex items-center justify-center font-bold">9</div>
                <div className="h-6 rounded bg-rose-500/30 text-rose-800 flex items-center justify-center font-bold">0</div>
              </div>
              <div className="grid grid-cols-5 gap-1 items-center text-[10px] text-muted-foreground">
                <span className="text-[9px]">Medium</span>
                <div className="h-6 rounded bg-emerald-500/10 flex items-center justify-center font-bold">2</div>
                <div className="h-6 rounded bg-emerald-500/15 flex items-center justify-center font-bold">28</div>
                <div className="h-6 rounded bg-amber-500/15 flex items-center justify-center font-bold">4</div>
                <div className="h-6 rounded bg-rose-500/20 text-rose-700 flex items-center justify-center font-bold">1</div>
              </div>
              <div className="grid grid-cols-5 gap-1 items-center text-[10px] text-muted-foreground">
                <span className="text-[9px]">Low</span>
                <div className="h-6 rounded bg-emerald-500/10 flex items-center justify-center font-bold">21</div>
                <div className="h-6 rounded bg-emerald-500/10 flex items-center justify-center font-bold">14</div>
                <div className="h-6 rounded bg-emerald-500/15 flex items-center justify-center font-bold">2</div>
                <div className="h-6 rounded bg-amber-500/15 flex items-center justify-center font-bold">0</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border">
              <span>Low Impact</span>
              <span>Critical Impact</span>
            </div>
          </div>

          {/* Information Lifecycle Status Donut */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Lifecycle Status</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <div className="h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={LIFECYCLE_PIE_DATA} innerRadius={48} outerRadius={68} paddingAngle={2} dataKey="value">
                      {LIFECYCLE_PIE_DATA.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute top-[60px] text-center">
                <span className="font-display text-lg font-bold text-foreground">2,486</span>
                <p className="text-[10px] text-muted-foreground font-semibold">Assets</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-2 border-t border-border">
              {LIFECYCLE_PIE_DATA.slice(0, 8).map((stage) => (
                <div key={stage.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground truncate">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
                    {stage.name}
                  </span>
                  <span className="font-semibold text-foreground">{stage.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Master Information Security Form Card (matching screenshot 4) */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border gap-2">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-base font-bold text-foreground">Information Security Form</h3>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                Active
              </span>
              <span className="font-mono text-xs text-muted-foreground">ISM-2026-001</span>
              <span className="text-xs text-muted-foreground">Version 1.0</span>
            </div>

            {/* Stepper matching screenshot 4 */}
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span> Draft
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span> Under Review
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span> Approved
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="flex items-center gap-1 font-semibold text-primary">
                <span className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">4</span> Active
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px]">5</span> Suspended
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px]">6</span> Closed
              </span>
            </div>
          </div>

          {/* Form Content: 5 Columns/Sections matching screenshot 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs pt-1">
            {/* Section 1: Information Security Master */}
            <div className="space-y-2 border-r border-border/60 pr-3">
              <h4 className="font-semibold text-foreground text-xs pb-1 border-b border-border/40">
                1. Information Security Master
              </h4>
              <div className="space-y-1.5">
                <div>
                  <span className="text-muted-foreground">ISMS ID</span>
                  <input
                    type="text"
                    disabled
                    value={formData.ismsId}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/40 px-2 py-1 text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Reference No.</span>
                  <input
                    type="text"
                    value={formData.referenceNo}
                    onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Asset Name *</span>
                  <input
                    type="text"
                    value={formData.assetName}
                    onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs font-semibold"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Information Type</span>
                  <input
                    type="text"
                    value={formData.informationType}
                    onChange={(e) => setFormData({ ...formData, informationType: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Product / System</span>
                  <input
                    type="text"
                    value={formData.productSystem}
                    onChange={(e) => setFormData({ ...formData, productSystem: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Location</span>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Information Owner</span>
                  <input
                    type="text"
                    value={formData.informationOwner}
                    onChange={(e) => setFormData({ ...formData, informationOwner: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Ownership & Access */}
            <div className="space-y-2 border-r border-border/60 pr-3">
              <h4 className="font-semibold text-foreground text-xs pb-1 border-b border-border/40">
                2. Ownership & Access
              </h4>
              <div className="space-y-1.5">
                <div>
                  <span className="text-muted-foreground">Business Owner *</span>
                  <input
                    type="text"
                    value={formData.businessOwner}
                    onChange={(e) => setFormData({ ...formData, businessOwner: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">System Owner *</span>
                  <input
                    type="text"
                    value={formData.systemOwner}
                    onChange={(e) => setFormData({ ...formData, systemOwner: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Process Owner *</span>
                  <input
                    type="text"
                    value={formData.processOwner}
                    onChange={(e) => setFormData({ ...formData, processOwner: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Data Custodian</span>
                  <input
                    type="text"
                    value={formData.dataCustodian}
                    onChange={(e) => setFormData({ ...formData, dataCustodian: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Security Classification</span>
                  <select
                    value={formData.securityClassification}
                    onChange={(e: any) => setFormData({ ...formData, securityClassification: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs font-semibold"
                  >
                    <option>Public</option>
                    <option>Internal</option>
                    <option>Confidential</option>
                    <option>Restricted</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <span className="text-muted-foreground">Retention Period</span>
                  <input
                    type="text"
                    value={formData.retentionPeriod}
                    onChange={(e) => setFormData({ ...formData, retentionPeriod: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Security Framework & Policy */}
            <div className="space-y-2 border-r border-border/60 pr-3">
              <h4 className="font-semibold text-foreground text-xs pb-1 border-b border-border/40">
                3. Security Framework & Policy
              </h4>
              <div className="space-y-1.5">
                <div>
                  <span className="text-muted-foreground">Applicable Framework *</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {formData.applicableFramework.map((f) => (
                      <span key={f} className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Security Policy</span>
                  <input
                    type="text"
                    value={formData.securityPolicy}
                    onChange={(e) => setFormData({ ...formData, securityPolicy: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Control Category</span>
                  <input
                    type="text"
                    value={formData.controlCategory}
                    onChange={(e) => setFormData({ ...formData, controlCategory: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Control Requirements</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {formData.controlRequirements.map((r) => (
                      <span key={r} className="rounded-md bg-emerald-500/10 text-emerald-700 px-2 py-0.5 text-[10px] font-medium">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Policy Compliance</span>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Compliant
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: Risk & Assessment */}
            <div className="space-y-2 border-r border-border/60 pr-3">
              <h4 className="font-semibold text-foreground text-xs pb-1 border-b border-border/40">
                4. Risk & Assessment
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Risk Score</span>
                  <span className="font-display font-bold text-base text-rose-600">{formData.riskScore}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Assessment</span>
                  <input
                    type="text"
                    value={formData.lastAssessment}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Next Assessment</span>
                  <input
                    type="text"
                    value={formData.nextAssessment}
                    className="mt-0.5 w-full rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Risk Treatment</span>
                  <div className="mt-1 rounded-lg bg-amber-500/10 text-amber-700 px-2 py-1 text-xs font-semibold">
                    32 (Medium Residual)
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Approval Information */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-xs pb-1 border-b border-border/40">
                5. Approval Information
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested By</span>
                  <span className="font-medium text-foreground">{formData.requestedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved By</span>
                  <span className="font-semibold text-primary">{formData.approvedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approval Date</span>
                  <span className="text-foreground">{formData.approvalDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Approval Comments</span>
                  <p className="mt-1 p-2 rounded-lg bg-muted/20 text-[11px] text-muted-foreground italic">
                    "{formData.approvalComments}"
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => toast.info("Draft saved")}
                    className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-muted"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => toast.success("Submitted for annual ISMS audit review")}
                    className="rounded-lg bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Recent Information Assets Table & Lower Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Recent Information Assets Table */}
          <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Recent Information Assets</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                    <th className="pb-2">Asset ID</th>
                    <th className="pb-2">Asset Name</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Owner</th>
                    <th className="pb-2">Classification</th>
                    <th className="pb-2">Risk</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {mockInformationAssetsList.map((asset) => (
                    <tr key={asset.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 font-mono text-muted-foreground">{asset.id}</td>
                      <td className="py-2.5 font-semibold text-foreground">{asset.name}</td>
                      <td className="py-2.5 text-muted-foreground">{asset.type}</td>
                      <td className="py-2.5 text-foreground">{asset.owner}</td>
                      <td className="py-2.5">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            asset.classification === "Restricted" && "bg-rose-500/10 text-rose-600",
                            asset.classification === "Confidential" && "bg-amber-500/10 text-amber-600"
                          )}
                        >
                          {asset.classification}
                        </span>
                      </td>
                      <td className="py-2.5 font-semibold text-amber-600">{asset.risk}</td>
                      <td className="py-2.5">
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security Incidents Trend (Last 6 Months) */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Security Incidents (Last 6M)</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">Details</span>
            </div>

            <div className="h-[170px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INCIDENT_TREND} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="incidents" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="resolved" fill="#10B981" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs pt-2 border-t border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Incidents
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Resolved
              </span>
            </div>
          </div>

          {/* Top Information Risks List */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Top Information Risks</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-2 text-xs">
              {mockTopInformationRisks.map((r) => (
                <div key={r.risk} className="flex items-center justify-between p-2 rounded-xl bg-muted/20 border border-border/50">
                  <div>
                    <span className="font-semibold text-foreground">{r.risk}</span>
                    <p className="text-[11px] text-muted-foreground">{r.asset}</p>
                  </div>
                  <span className="font-display font-bold text-xs text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-md">
                    {r.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal: New Information Asset */}
        {showAssetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-base font-bold text-foreground">Catalog Information Asset</h3>
                <button onClick={() => setShowAssetModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
                <div>
                  <label className="font-semibold text-foreground">Information Asset Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Wireless Charging Firmware Repository"
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Information Type *</label>
                    <select className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs">
                      <option>Firmware / Source Code</option>
                      <option>CAD / Mechanical Drawing</option>
                      <option>Database Table / Schema</option>
                      <option>Contract / Document</option>
                      <option>Customer Telemetry</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Security Classification *</label>
                    <select className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs font-semibold">
                      <option>Restricted</option>
                      <option>Confidential</option>
                      <option>Internal</option>
                      <option>Public</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Asset Owner *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh S"
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Department *</label>
                    <input
                      type="text"
                      placeholder="R&D - Electronics"
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-foreground">Retention Policy & Handling Rules</label>
                  <textarea
                    rows={3}
                    placeholder="Specify encryption standards, backup redundancy and statutory retention years..."
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setShowAssetModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAssetModal(false);
                    toast.success("Information Asset registered in ISMS Master Register");
                  }}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Save Asset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
