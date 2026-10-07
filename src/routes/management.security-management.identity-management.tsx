// Magnertia ERP - Identity Management
// Management → Security Management → Identity Management
// Aligned with Screenshot 2 & Prompt 2 Specifications

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  UserCheck,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  Clock,
  AlertTriangle,
  FileText,
  Plus,
  RefreshCw,
  Printer,
  Edit2,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Server,
  Layers,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
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
  mockIdentityProfile,
  mockIdentityActivities,
  type IdentityProfile,
} from "@/services/securityManagementService";
import { toast } from "sonner";

export const Route = createFileRoute("/management/security-management/identity-management")({
  head: () => ({
    meta: [
      { title: "Identity Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Controlled ERP framework for creating, validating, governing and retiring digital identities across employees, contractors, service accounts, and APIs.",
      },
    ],
  }),
  component: IdentityManagementPage,
});


const IDENTITY_TYPES_PIE = [
  { name: "Employee", value: 56, color: "#3B82F6" },
  { name: "Contractor", value: 14, color: "#06B6D4" },
  { name: "Vendor", value: 8, color: "#F59E0B" },
  { name: "Customer", value: 6, color: "#EC4899" },
  { name: "Service Account", value: 8, color: "#8B5CF6" },
  { name: "Application", value: 5, color: "#10B981" },
  { name: "API Identity", value: 2, color: "#6366F1" },
  { name: "Others", value: 1, color: "#94A3B8" },
];

const IDENTITY_STATUS_BARS = [
  { status: "Active", count: 486, color: "#10B981" },
  { status: "Suspended", count: 24, color: "#F59E0B" },
  { status: "Dormant", count: 16, color: "#F97316" },
  { status: "Pending", count: 9, color: "#06B6D4" },
  { status: "Deactivated", count: 7, color: "#EF4444" },
];

function IdentityManagementPage() {
  const [profile, setProfile] = useState<IdentityProfile>(mockIdentityProfile);
  const [showNewIdentityModal, setShowNewIdentityModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [requestTab, setRequestTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  return (
    <AppShell
      title="Identity Management"
      breadcrumb="Management > Security Management > Identity Management"
      description="Enterprise digital identity directory, user credential governance, federated single sign-on (SSO), and lifecycle credential provisioning."
      tabs={<SecurityManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Executive Submodule Header */}
        <SecuritySubmoduleHeader
          icon={Users}
          title="Identity Management"
          code="ID-2026-001"
          badge="Active"
          subtitle="Centralized identity repository, cryptographic access tokens, employee and service account provisioning, and identity audit trails."
          bannerQuote="Right Identity. Right Access. A Safer Tomorrow."
          primaryActionLabel="+ New Identity"
          onPrimaryAction={() => setShowNewIdentityModal(true)}
          onGenerateReport={() => toast.success("Identity Management Master Report exported")}
        />

        {/* Executive 7-Gauge Circular Score Banner matching Screenshot */}
        <ProductScoreBanner submoduleKey="identity-management" />

        {/* 8 KPI Cards matching screenshot 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">Total Identities</span>
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">542</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold truncate">
              <span>↑ 8%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">Active Identities</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">486</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold truncate">
              <span>↑ 5%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">Pending Verification</span>
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">9</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold truncate">
              <span>↓ 25%</span>
              <span className="ml-1 text-muted-foreground font-normal">cleared</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">Pending Approvals</span>
              <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">12</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold truncate">
              <span>↓ 20%</span>
              <span className="ml-1 text-muted-foreground font-normal">cleared</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">Privileged Identities</span>
              <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">18</div>
            <div className="mt-1 flex items-center text-[10px] text-amber-600 font-semibold truncate">
              <span>↑ 12%</span>
              <span className="ml-1 text-muted-foreground font-normal">elevated</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">Service Identities</span>
              <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
                <Key className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">24</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold truncate">
              <span>↑ 9%</span>
              <span className="ml-1 text-muted-foreground font-normal">owned</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">Dormant Identities</span>
              <div className="h-7 w-7 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">16</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold truncate">
              <span>↓ 33%</span>
              <span className="ml-1 text-muted-foreground font-normal">flagged</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">MFA Coverage</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">98.2%</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold truncate">
              <span>↑ 2.1%</span>
              <span className="ml-1 text-muted-foreground font-normal">enforced</span>
            </div>
          </div>
        </div>

        {/* Row 1: Identity Details (Left) + Identity Lifecycle & Activities (Center) + Risk & Compliance (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Identity Details Card */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Identity Details</h3>
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Identity ID</span>
                <span className="font-mono font-semibold text-foreground">{profile.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Reference No.</span>
                <span className="font-mono text-muted-foreground">{profile.referenceNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Identity Type</span>
                <span className="rounded-lg bg-muted px-2 py-0.5 font-semibold text-foreground">{profile.identityType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Legal Name</span>
                <span className="font-semibold text-foreground">{profile.legalName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Display Name</span>
                <span className="text-foreground">{profile.displayName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Identity Status</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {profile.identityStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Organization</span>
                <span className="text-foreground truncate max-w-[150px]">{profile.organization}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Business Unit</span>
                <span className="text-foreground">{profile.businessUnit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Department</span>
                <span className="text-foreground">{profile.department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Function</span>
                <span className="text-foreground">{profile.function}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Location</span>
                <span className="text-foreground">{profile.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Manager</span>
                <span className="text-foreground font-semibold">{profile.manager}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Identity Owner</span>
                <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                  {profile.identityOwner}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Risk Classification</span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                  {profile.riskClassification}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Confidentiality</span>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                  {profile.confidentiality}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Join Date</span>
                <span className="text-foreground">{profile.joinDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Employment Type</span>
                <span className="text-foreground">{profile.employmentType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Email</span>
                <span className="text-primary truncate max-w-[140px]">{profile.email}</span>
              </div>
              <div className="pt-2 border-t border-border/60">
                <p className="text-[11px] text-muted-foreground">Description</p>
                <p className="text-xs text-foreground mt-0.5 line-clamp-2">{profile.description}</p>
              </div>
            </div>
          </div>

          {/* Center Column: Identity Lifecycle Stepper & Recent Activities */}
          <div className="lg:col-span-6 space-y-4">
            {/* Identity Lifecycle Stepper */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <h3 className="font-display text-sm font-bold text-foreground pb-3 border-b border-border">
                Identity Lifecycle
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 pt-4 text-center">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-2 space-y-1">
                  <div className="h-7 w-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div className="font-semibold text-xs text-foreground">Register</div>
                  <div className="text-[10px] text-muted-foreground">28 Sep 2026</div>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-2 space-y-1">
                  <div className="h-7 w-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div className="font-semibold text-xs text-foreground">Verify</div>
                  <div className="text-[10px] text-muted-foreground">28 Sep 2026</div>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-2 space-y-1">
                  <div className="h-7 w-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div className="font-semibold text-xs text-foreground">Create Acc</div>
                  <div className="text-[10px] text-muted-foreground">28 Sep 2026</div>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-2 space-y-1">
                  <div className="h-7 w-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div className="font-semibold text-xs text-foreground">Assign Roles</div>
                  <div className="text-[10px] text-muted-foreground">29 Sep 2026</div>
                </div>
                <div className="rounded-xl border border-emerald-500 bg-emerald-500/10 p-2 space-y-1 ring-2 ring-emerald-500/20">
                  <div className="h-7 w-7 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                    ●
                  </div>
                  <div className="font-semibold text-xs text-emerald-700">Activate</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Active</div>
                </div>
                <div className="rounded-xl border border-border/80 bg-muted/20 p-2 space-y-1">
                  <div className="h-7 w-7 mx-auto rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center text-xs font-bold">
                    ?
                  </div>
                  <div className="font-semibold text-xs text-foreground">Review</div>
                  <div className="text-[10px] text-amber-600 font-bold">Due 29 Dec</div>
                </div>
                <div className="rounded-xl border border-border/80 bg-muted/10 p-2 space-y-1 opacity-60">
                  <div className="h-7 w-7 mx-auto rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">
                    -
                  </div>
                  <div className="font-semibold text-xs text-foreground">Deactivate</div>
                  <div className="text-[10px] text-muted-foreground">-</div>
                </div>
              </div>
            </div>

            {/* Recent Identity Activities */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-display text-sm font-bold text-foreground">Recent Identity Activities</h3>
                <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                      <th className="pb-2">Role / Timestamp</th>
                      <th className="pb-2">Permission Set</th>
                      <th className="pb-2">Access Level</th>
                      <th className="pb-2">Application</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {mockIdentityActivities.map((act, idx) => (
                      <tr key={idx} className="hover:bg-muted/40 transition-colors">
                        <td className="py-2.5 font-medium text-foreground">{act.role}</td>
                        <td className="py-2.5 font-mono text-muted-foreground">{act.permissionSet}</td>
                        <td className="py-2.5 text-muted-foreground">{act.accessLevel}</td>
                        <td className="py-2.5 text-foreground">{act.app}</td>
                        <td className="py-2.5">
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                            {act.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Identity Risk & Compliance Card */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Identity Risk & Compliance</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View Details</span>
            </div>

            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-8 border-amber-500/20 border-t-amber-500">
                <div className="text-center">
                  <span className="font-display text-2xl font-bold text-amber-600">{profile.riskScore}</span>
                  <p className="text-[10px] font-bold text-amber-600 uppercase">Risk Score (Med)</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Privileged Access</span>
                <span className="font-semibold text-foreground">No</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SoD Conflict</span>
                <span className="font-semibold text-emerald-600">No</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">MFA Enabled</span>
                <span className="font-semibold text-emerald-600">Yes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Expiry</span>
                <span className="text-foreground">31 Dec 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Login</span>
                <span className="text-foreground">28 Sep 2026 08:12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Failed Logins (30d)</span>
                <span className="font-semibold text-foreground">0</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-border/60">
                <span className="text-muted-foreground">Policy Compliance</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  Compliant
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Review Status</span>
                <span className="text-sky-600 font-semibold text-[11px]">Due in 92 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Distribution by Type Donut, Status Bars, MFA Gauge & AI Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Identity Distribution by Type */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Identity Distribution by Type</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <div className="h-[170px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={IDENTITY_TYPES_PIE} innerRadius={48} outerRadius={70} paddingAngle={2} dataKey="value">
                      {IDENTITY_TYPES_PIE.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute top-[65px] text-center">
                <span className="font-display text-lg font-bold text-foreground">542</span>
                <p className="text-[10px] text-muted-foreground font-semibold">Total Identities</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-2 border-t border-border">
              {IDENTITY_TYPES_PIE.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground truncate">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-semibold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Identity Status Bar Chart */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Identity Lifecycle Status</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View Details</span>
            </div>

            <div className="h-[170px] w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={IDENTITY_STATUS_BARS} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="status" tick={{ fontSize: 11 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {IDENTITY_STATUS_BARS.map((entry, idx) => (
                      <Cell key={`bar-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-5 gap-1 text-center text-[10px] pt-2 border-t border-border">
              {IDENTITY_STATUS_BARS.map((item) => (
                <div key={item.status} className="p-1 rounded-lg bg-muted/20">
                  <span className="font-bold block text-foreground">{item.count}</span>
                  <span className="text-muted-foreground truncate block">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Authentication & MFA Radial + AI Security Intelligence */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Authentication & MFA</h3>
              <span className="text-xs font-semibold text-emerald-600">98.2% Enrolled</span>
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-8 border-emerald-500/20 border-t-emerald-500">
                <div className="text-center">
                  <span className="font-display text-xl font-bold text-foreground">98.2%</span>
                  <p className="text-[9px] font-semibold text-emerald-600">MFA Enabled</p>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs pt-2 border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">MFA Enabled</span>
                <span className="font-bold text-emerald-600">98.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Password Only</span>
                <span className="font-medium text-foreground">1.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SSO Provider</span>
                <span className="font-medium text-foreground">0.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Certificate / Hardware</span>
                <span className="font-medium text-foreground">0.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Others</span>
                <span className="font-medium text-foreground">0.1%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: AI Intelligence Alerts Box */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-display text-sm font-bold text-foreground">AI Identity Intelligence</h3>
            </div>
            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All Alerts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1">
              <div className="flex items-center justify-between font-semibold text-rose-700">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" /> Duplicate identity detected: 'john.mathew.j'
                </span>
                <span className="text-[10px] text-muted-foreground">2h ago</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Matches existing employee ID-EMP-1024 with same national ID reference. Review for consolidation.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
              <div className="flex items-center justify-between font-semibold text-amber-700">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Dormant account &gt; 90 days (4 accounts)
                </span>
                <span className="text-[10px] text-muted-foreground">5h ago</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Zero authentication tokens created in last quarter. Auto-deactivation alert issued.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-1">
              <div className="flex items-center justify-between font-semibold text-blue-700">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Privileged access request review required
                </span>
                <span className="text-[10px] text-muted-foreground">1d ago</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Elevation requested for System Administrator role requires secondary CISO sign-off.
              </p>
            </div>
          </div>
        </div>

        {/* Modal: New Identity */}
        {showNewIdentityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-base font-bold text-foreground">Register New Digital Identity</h3>
                <button onClick={() => setShowNewIdentityModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Legal Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. John Mathew"
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Identity Type *</label>
                    <select className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs">
                      <option>Employee</option>
                      <option>Contractor</option>
                      <option>Vendor</option>
                      <option>Service Account</option>
                      <option>API Identity</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Department *</label>
                    <input
                      type="text"
                      placeholder="Production / Engineering"
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Primary Location *</label>
                    <input
                      type="text"
                      placeholder="Plant 2 - Coimbatore"
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-foreground">Email Address *</label>
                  <input
                    type="email"
                    placeholder="name@magnertia.com"
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Risk Classification</label>
                    <select className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">MFA Enforcement</label>
                    <select className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs">
                      <option>Enforced (Hardware/App)</option>
                      <option>Enforced (SMS/OTP)</option>
                      <option>Exempted (Service Acct)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setShowNewIdentityModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowNewIdentityModal(false);
                    toast.success("New Identity registered & queued for HRMS verification");
                  }}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Create Identity
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit Identity Profile */}
        {showEditProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-base font-bold text-foreground">Edit Identity Profile ({profile.id})</h3>
                <button onClick={() => setShowEditProfileModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Display Name</label>
                    <input
                      type="text"
                      value={profile.displayName}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Manager</label>
                    <input
                      type="text"
                      value={profile.manager}
                      onChange={(e) => setProfile({ ...profile, manager: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Department</label>
                    <input
                      type="text"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-foreground">Description</label>
                  <textarea
                    rows={2}
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setShowEditProfileModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowEditProfileModal(false);
                    toast.success("Identity profile updated successfully");
                  }}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
