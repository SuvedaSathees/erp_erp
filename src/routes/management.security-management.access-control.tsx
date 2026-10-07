// Magnertia ERP - Access Control
// Management → Security Management → Access Control
// Aligned with Screenshot 3 & Prompt 1 Specifications

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Key,
  Lock,
  GitPullRequest,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Plus,
  RefreshCw,
  Printer,
  Edit2,
  X,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  UserCheck,
  UserX,
  FileCheck2,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
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
  mockAccessControlMaster,
  mockAccessRequests,
  mockSoDConflicts,
  mockPrivilegedUsers,
  type AccessControlRecord,
} from "@/services/securityManagementService";
import { toast } from "sonner";

export const Route = createFileRoute("/management/security-management/access-control")({
  head: () => ({
    meta: [
      { title: "Access Control · Magnertia ERP" },
      {
        name: "description",
        content:
          "Manage Identity, Roles, Permissions and Secure Access. Segregation of Duties (SoD), Privileged Access Management, and Certification.",
      },
    ],
  }),
  component: AccessControlPage,
});


const ACCESS_TREND_DATA = [
  { month: "Jan", granted: 120, modified: 60, revoked: 20, total: 410 },
  { month: "Feb", granted: 140, modified: 70, revoked: 25, total: 430 },
  { month: "Mar", granted: 160, modified: 65, revoked: 30, total: 450 },
  { month: "Apr", granted: 150, modified: 80, revoked: 22, total: 460 },
  { month: "May", granted: 175, modified: 85, revoked: 28, total: 470 },
  { month: "Jun", granted: 160, modified: 90, revoked: 35, total: 475 },
  { month: "Jul", granted: 180, modified: 95, revoked: 24, total: 480 },
  { month: "Aug", granted: 170, modified: 80, revoked: 30, total: 482 },
  { month: "Sep", granted: 190, modified: 88, revoked: 20, total: 486 },
];

const ROLES_PIE_DATA = [
  { name: "Standard User", value: 32, color: "#3B82F6" },
  { name: "Manager", value: 18, color: "#10B981" },
  { name: "Approver", value: 12, color: "#F59E0B" },
  { name: "Administrator", value: 8, color: "#EF4444" },
  { name: "Security Admin", value: 6, color: "#8B5CF6" },
  { name: "Auditor", value: 5, color: "#EC4899" },
  { name: "Developer", value: 4, color: "#06B6D4" },
  { name: "Service Account", value: 7, color: "#64748B" },
  { name: "Others", value: 8, color: "#94A3B8" },
];

function AccessControlPage() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showEditMasterModal, setShowEditMasterModal] = useState(false);
  const [masterRecord, setMasterRecord] = useState<AccessControlRecord>(mockAccessControlMaster);

  return (
    <AppShell
      title="Access Control"
      breadcrumb="Management > Security Management > Access Control"
      description="Role-based and attribute-based access control, privilege management, segregation of duties (SoD), and zero-trust authentication across enterprise resources."
      tabs={<SecurityManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Executive Header matching screenshot 3 */}
        <SecuritySubmoduleHeader
          icon={ShieldCheck}
          title="Access Control"
          code="AC-2026-001"
          badge="Active"
          subtitle="Granular access governance, multi-factor authorization, role entitlement lifecycles, and automated segregation-of-duties conflict prevention."
          bannerQuote="Secure Access. Stronger Governance. A Safer Tomorrow."
          primaryActionLabel="+ New Access Request"
          onPrimaryAction={() => setShowRequestModal(true)}
          onGenerateReport={() => toast.success("Access Control Master Audit Report exported")}
        />

        {/* Executive 7-Gauge Circular Score Banner matching Screenshot */}
        <ProductScoreBanner submoduleKey="access-control" />

        {/* 7 KPI Cards matching screenshot 3 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Active Users</span>
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">486</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↑ 5%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Active Roles</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">74</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↑ 3%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Permissions</span>
              <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Key className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">1,284</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↑ 8%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Pending Requests</span>
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">12</div>
            <div className="mt-1 flex items-center text-[10px] text-amber-600 font-semibold">
              <span>↑ 20%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">SoD Conflicts</span>
              <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">4</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↓ 50%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Privileged Users</span>
              <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                <Lock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">18</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
              <span>↑ 12%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs prev month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">MFA Adoption</span>
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

        {/* Row 1: Access Control Details (Left) + User Access Trend (Center) + Access by Role Donut (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Access Control Details Card */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Access Control Details</h3>
              <button
                onClick={() => setShowEditMasterModal(true)}
                className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Access Control ID</span>
                <span className="font-mono font-semibold text-foreground">{masterRecord.code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">User</span>
                <span className="font-semibold text-foreground">{masterRecord.user} ({masterRecord.empId})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">User Type</span>
                <span className="text-foreground">{masterRecord.userType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Department</span>
                <span className="text-foreground">{masterRecord.department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Access Type</span>
                <span className="text-foreground">{masterRecord.accessType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Role</span>
                <span className="font-semibold text-primary">{masterRecord.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Permission Set</span>
                <span className="text-foreground font-mono text-[11px]">{masterRecord.permissionSet}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Access Level</span>
                <span className="text-foreground">{masterRecord.accessLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Source</span>
                <span className="text-foreground">{masterRecord.source}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Effective From</span>
                <span className="text-foreground">{masterRecord.effectiveFrom}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Effective To</span>
                <span className="text-foreground">{masterRecord.effectiveTo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">MFA Enabled</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Yes
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {masterRecord.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Risk Level</span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                  {masterRecord.riskLevel}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Confidentiality</span>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                  {masterRecord.confidentiality}
                </span>
              </div>
              <div className="pt-2 border-t border-border/60">
                <p className="text-[11px] text-muted-foreground">Description</p>
                <p className="text-xs text-foreground mt-0.5 line-clamp-2">{masterRecord.description}</p>
              </div>
            </div>
          </div>

          {/* User Access Trend Chart */}
          <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">User Access Trend</h3>
                <p className="text-xs text-muted-foreground">Granted, modified and revoked authorizations</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-lg bg-muted px-2 py-1 font-semibold text-foreground">Monthly</span>
                <span className="text-muted-foreground">Last 12 Months</span>
              </div>
            </div>

            <div className="h-[260px] w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={ACCESS_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="granted" fill="#10B981" radius={[3, 3, 0, 0]} stackId="a" />
                  <Bar dataKey="modified" fill="#F59E0B" radius={[0, 0, 0, 0]} stackId="a" />
                  <Bar dataKey="revoked" fill="#EF4444" radius={[0, 0, 0, 0]} stackId="a" />
                  <Line type="monotone" dataKey="total" stroke="#0A3C75" strokeWidth={2.5} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-5 text-xs pt-2 border-t border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Granted
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Modified
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Revoked
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[#0A3C75]" /> Total Users
              </span>
            </div>
          </div>

          {/* Access by Role Donut */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Access by Role</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <div className="h-[170px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ROLES_PIE_DATA} innerRadius={50} outerRadius={72} paddingAngle={2} dataKey="value">
                      {ROLES_PIE_DATA.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute top-[65px] text-center">
                <span className="font-display text-lg font-bold text-foreground">486</span>
                <p className="text-[10px] text-muted-foreground font-semibold">Active Users</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-2 border-t border-border">
              {ROLES_PIE_DATA.slice(0, 8).map((role) => (
                <div key={role.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground truncate">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: role.color }} />
                    {role.name}
                  </span>
                  <span className="font-semibold text-foreground">{role.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Lifecycle Stepper & Request Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Access Management Lifecycle Stepper */}
          <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-4 shadow-xs">
            <h3 className="font-display text-sm font-bold text-foreground pb-3 border-b border-border">
              Access Management Lifecycle
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-4 text-center">
              <div className="rounded-xl border border-border/80 bg-muted/20 p-2.5 space-y-1">
                <div className="h-8 w-8 mx-auto rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="font-semibold text-xs text-foreground">Request</div>
                <div className="text-[11px] text-amber-600 font-bold">12 Pending</div>
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/20 p-2.5 space-y-1">
                <div className="h-8 w-8 mx-auto rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div className="font-semibold text-xs text-foreground">Approval</div>
                <div className="text-[11px] text-blue-600 font-bold">9 In Review</div>
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/20 p-2.5 space-y-1">
                <div className="h-8 w-8 mx-auto rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Key className="h-4 w-4" />
                </div>
                <div className="font-semibold text-xs text-foreground">Provisioning</div>
                <div className="text-[11px] text-purple-600 font-bold">18 This Month</div>
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/20 p-2.5 space-y-1">
                <div className="h-8 w-8 mx-auto rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="font-semibold text-xs text-foreground">Active Access</div>
                <div className="text-[11px] text-emerald-600 font-bold">486 Active</div>
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/20 p-2.5 space-y-1">
                <div className="h-8 w-8 mx-auto rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <div className="font-semibold text-xs text-foreground">Review</div>
                <div className="text-[11px] text-amber-600 font-bold">27 Due Review</div>
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/20 p-2.5 space-y-1">
                <div className="h-8 w-8 mx-auto rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <UserX className="h-4 w-4" />
                </div>
                <div className="font-semibold text-xs text-foreground">Revocation</div>
                <div className="text-[11px] text-rose-600 font-bold">6 Scheduled</div>
              </div>
            </div>
          </div>

          {/* Access Requests Status */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Access Requests Status</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">New Requests</span>
                  <span className="font-bold text-foreground">12</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: "40%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">In Approval</span>
                  <span className="font-bold text-foreground">9</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "30%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Approved</span>
                  <span className="font-bold text-foreground">24</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "75%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Rejected</span>
                  <span className="font-bold text-foreground">3</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: "10%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Provisioned</span>
                  <span className="font-bold text-foreground">21</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Tables - Recent Access Requests & SoD Conflicts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Recent Access Requests */}
          <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Recent Access Requests</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Request No.</th>
                    <th className="pb-2">User</th>
                    <th className="pb-2">Role / Access</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {mockAccessRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 text-muted-foreground">{req.date}</td>
                      <td className="py-2.5 font-mono font-medium text-foreground">{req.reqNo}</td>
                      <td className="py-2.5 font-medium text-foreground">{req.user}</td>
                      <td className="py-2.5 text-muted-foreground">{req.role}</td>
                      <td className="py-2.5 text-muted-foreground">{req.type}</td>
                      <td className="py-2.5">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            req.status === "Approved" && "bg-emerald-500/10 text-emerald-600",
                            req.status === "In Approval" && "bg-amber-500/10 text-amber-600",
                            req.status === "Risk Review" && "bg-sky-500/10 text-sky-600",
                            req.status === "Provisioned" && "bg-purple-500/10 text-purple-600",
                            req.status === "Rejected" && "bg-rose-500/10 text-rose-600"
                          )}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SoD Conflicts */}
          <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">SoD Conflicts</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                    <th className="pb-2">Rule</th>
                    <th className="pb-2">User</th>
                    <th className="pb-2">Conflicting Roles</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {mockSoDConflicts.map((sod) => (
                    <tr key={sod.rule} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 font-mono font-semibold text-rose-600">{sod.rule}</td>
                      <td className="py-2.5 font-medium text-foreground">{sod.user}</td>
                      <td className="py-2.5 text-muted-foreground">{sod.conflictingRoles}</td>
                      <td className="py-2.5">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            sod.status === "Open" && "bg-rose-500/10 text-rose-600",
                            sod.status === "Mitigated" && "bg-emerald-500/10 text-emerald-600",
                            sod.status === "Under Review" && "bg-amber-500/10 text-amber-600"
                          )}
                        >
                          {sod.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Row 4: PAM Monitoring, Certification Radial & AI Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Privileged Access Monitoring */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Privileged Access Monitoring</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-2 text-xs">
              {mockPrivilegedUsers.map((pam) => (
                <div key={pam.user} className="flex items-center justify-between p-2 rounded-xl bg-muted/20 border border-border/50">
                  <div>
                    <span className="font-semibold text-foreground">{pam.user}</span>
                    <p className="text-[11px] text-muted-foreground">{pam.role}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                        pam.status === "Active" && "bg-emerald-500/10 text-emerald-600",
                        pam.status === "Expired" && "bg-muted text-muted-foreground",
                        pam.status === "Suspended" && "bg-rose-500/10 text-rose-600"
                      )}
                    >
                      {pam.status}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{pam.lastLogin}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access Review & Certification Gauge */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Access Review & Certification</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="flex items-center justify-center py-4">
              <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-8 border-emerald-500/20 border-t-emerald-500">
                <div className="text-center">
                  <span className="font-display text-2xl font-bold text-foreground">94.6%</span>
                  <p className="text-[10px] font-semibold text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500" /> Reviewed
                </span>
                <span className="font-bold text-foreground">459</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Pending
                </span>
                <span className="font-bold text-foreground">27</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-orange-500" /> Excess Access
                </span>
                <span className="font-bold text-foreground">14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> Revocations
                </span>
                <span className="font-bold text-foreground">8</span>
              </div>
            </div>
          </div>

          {/* AI Security Intelligence Feed */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-bold text-foreground">AI Security Intelligence</h3>
              </div>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1">
                <div className="flex items-center justify-between font-semibold text-rose-700">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" /> Unusual login location detected for Admin01
                  </span>
                  <span className="text-[10px] text-muted-foreground">2h ago</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Login originating from unrecognized external ISP IP address. Step-up MFA verification required.
                </p>
              </div>

              <div className="p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
                <div className="flex items-center justify-between font-semibold text-amber-700">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Dormant account &gt; 90 days (12 accounts)
                  </span>
                  <span className="text-[10px] text-muted-foreground">5h ago</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Accounts have had zero activity for over a quarter. Automatic deactivation scheduled.
                </p>
              </div>

              <div className="p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-1">
                <div className="flex items-center justify-between font-semibold text-blue-700">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5" /> SoD conflict risk for new request (REQ-2026-184)
                  </span>
                  <span className="text-[10px] text-muted-foreground">1d ago</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Granting requested role combines PO generation and invoice clearance capability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: New Access Request */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-base font-bold text-foreground">Submit Access Request</h3>
                <button onClick={() => setShowRequestModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground">User / Requester *</label>
                  <input
                    type="text"
                    defaultValue="John Mathew (EMP-1024)"
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Access Type *</label>
                    <select className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs">
                      <option>Application</option>
                      <option>Data</option>
                      <option>Privileged</option>
                      <option>API</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Access Scope *</label>
                    <select className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs">
                      <option>Enterprise</option>
                      <option>Department</option>
                      <option>Site / Plant</option>
                      <option>Project</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-foreground">Requested Role *</label>
                  <select className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs">
                    <option>Production Manager</option>
                    <option>Quality Inspector</option>
                    <option>Maintenance Engineer</option>
                    <option>Finance Approver</option>
                    <option>System Administrator (Privileged)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-foreground">Business Justification *</label>
                  <textarea
                    rows={3}
                    placeholder="State reason, business impact and expected tenure..."
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    toast.success("Access request REQ-2026-185 submitted for Manager & SoD review");
                  }}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit Master Record */}
        {showEditMasterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-base font-bold text-foreground">Edit Access Control Record ({masterRecord.code})</h3>
                <button onClick={() => setShowEditMasterModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">User</label>
                    <input
                      type="text"
                      value={masterRecord.user}
                      onChange={(e) => setMasterRecord({ ...masterRecord, user: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Department</label>
                    <input
                      type="text"
                      value={masterRecord.department}
                      onChange={(e) => setMasterRecord({ ...masterRecord, department: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Role</label>
                    <input
                      type="text"
                      value={masterRecord.role}
                      onChange={(e) => setMasterRecord({ ...masterRecord, role: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Access Level</label>
                    <input
                      type="text"
                      value={masterRecord.accessLevel}
                      onChange={(e) => setMasterRecord({ ...masterRecord, accessLevel: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-foreground">Description</label>
                  <textarea
                    rows={2}
                    value={masterRecord.description}
                    onChange={(e) => setMasterRecord({ ...masterRecord, description: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setShowEditMasterModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowEditMasterModal(false);
                    toast.success("Access Control Record updated successfully");
                  }}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
