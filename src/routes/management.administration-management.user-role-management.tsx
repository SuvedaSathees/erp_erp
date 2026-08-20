import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AdminManagementTabBar } from "@/components/erp/AdminManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  UserCheck,
  Building,
  Briefcase,
  Layers,
  Sliders,
  TrendingUp,
  AlertTriangle,
  FileText,
  Clock,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Save,
  Send,
  Pencil,
  Trash2,
  Check,
  X,
  Smartphone,
  Globe,
  Radio,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  ExternalLink,
  Shield,
  Activity,
  History,
} from "lucide-react";

export const Route = createFileRoute("/management/administration-management/user-role-management")({
  head: () => ({
    meta: [
      { title: "User & Role Management · Magnertia ERP" },
      {
        name: "description",
        content: "Manage complete lifecycle of system users, role-based access control, granular permissions, data access scopes, approval authority, authentication, and security audit monitoring.",
      },
    ],
  }),
  component: UserRoleManagementPage,
});

// --- Data & Mock Definitions ---

const USER_TYPES = [
  "Employee",
  "Management",
  "Administrator",
  "Contractor",
  "Consultant",
  "Auditor",
  "Customer",
  "Supplier",
  "Franchisee",
  "Investor",
  "Partner",
  "External Professional",
  "API / Service User",
];

const ROLES_ASSIGNED_DATA = [
  { id: "R-001", name: "Finance Manager", type: "Management Role", isPrimary: true, scope: "Organization", effectiveFrom: "01 Apr 2024", effectiveTo: "-", status: "Active" },
  { id: "R-002", name: "Accounts Approver", type: "Approval Role", isPrimary: false, scope: "Department", effectiveFrom: "01 Apr 2024", effectiveTo: "-", status: "Active" },
  { id: "R-003", name: "Budget Controller", type: "Functional Role", isPrimary: false, scope: "Department", effectiveFrom: "01 Apr 2024", effectiveTo: "-", status: "Active" },
];

const RECENT_USER_ACTIVITY = [
  { id: "ACT-101", datetime: "15 May 2024 10:45 AM", module: "Finance", action: "Login", ip: "103.21.45.67", status: "Success" },
  { id: "ACT-102", datetime: "15 May 2024 10:44 AM", module: "AP Invoice", action: "Approve", ip: "103.21.45.67", status: "Success" },
  { id: "ACT-103", datetime: "15 May 2024 10:20 AM", module: "Budget", action: "Edit", ip: "103.21.45.67", status: "Success" },
  { id: "ACT-104", datetime: "15 May 2024 09:10 AM", module: "Reports", action: "View", ip: "103.21.45.67", status: "Success" },
  { id: "ACT-105", datetime: "14 May 2024 05:30 PM", module: "Settings", action: "View", ip: "103.21.45.67", status: "Success" },
];

export function UserRoleManagementPage() {
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "organization"
    | "roles"
    | "permissions"
    | "data-access"
    | "authority"
    | "authentication"
    | "security"
    | "activity"
    | "review"
    | "documents"
    | "history"
  >("profile");

  // Master Form State
  const [userMaster, setUserMaster] = useState({
    userId: "USR-2024-00456",
    userCode: "USR-VIK-001",
    username: "vikram.singh",
    displayName: "Vikram Singh",
    employee: "VIK001 - Vikram Singh",
    userType: "Employee",
    userCategory: "Internal",
    email: "vikram.singh@magnertia.com",
    mobile: "+91 98765 43210",
    userStatus: "Active",
    effectiveFrom: "2024-04-01",
    effectiveTo: "",
    version: "1.0",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [delegationAllowed, setDelegationAllowed] = useState(true);
  const [primaryOrgToggle, setPrimaryOrgToggle] = useState(true);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="User & Role Management"
      breadcrumb="Management > Administration Management > User & Role Management"
      description="Manage system users, identity mapping, role-based access control, permissions, data access scopes, approval authority, and security audit logs."
      tabs={<AdminManagementTabBar />}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#0a192f] border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Top Header Actions & Workflow Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-foreground">User & Role Management Form</h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  {userMaster.userStatus}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                  v{userMaster.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                MAICW Classification · Central Identity, RBAC & Security Administration
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showNotification("User access summary preview generated.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-primary" />
              Preview User
            </button>

            <button
              onClick={() => showNotification("Access validation complete: 0 Segregation of Duties (SoD) conflicts found.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              Validate Access
            </button>

            <button
              onClick={() => showNotification("User & Role Master record saved successfully.")}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>

            <button
              onClick={() => showNotification("Access request submitted for Information Security & System Admin Approval.")}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Approval
            </button>
          </div>
        </div>

        {/* 1. User Master Form & Snapshot Card (Matching Attached Reference Screenshot) */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left 9 columns: User Master Fields */}
          <div className="lg:col-span-9 rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> User Master
              </h3>
              <span className="text-[11px] text-muted-foreground font-medium">
                MAICW Fields: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
                <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
                <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
                <span className="text-purple-500 font-bold">C</span> (Calculated) |{" "}
                <span className="text-rose-500 font-bold">W</span> (Workflow)
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Auto Fields */}
              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>User ID</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={userMaster.userId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>User Code *</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  value={userMaster.userCode}
                  onChange={(e) => setUserMaster({ ...userMaster, userCode: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Username *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <input
                  type="text"
                  value={userMaster.username}
                  onChange={(e) => setUserMaster({ ...userMaster, username: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Display Name *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <input
                  type="text"
                  value={userMaster.displayName}
                  onChange={(e) => setUserMaster({ ...userMaster, displayName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Employee *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={userMaster.employee}
                  onChange={(e) => setUserMaster({ ...userMaster, employee: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="VIK001 - Vikram Singh">VIK001 - Vikram Singh</option>
                  <option value="RAJ001 - Rajeev Malhotra">RAJ001 - Rajeev Malhotra</option>
                  <option value="ANI001 - Anita Verma">ANI001 - Anita Verma</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>User Type *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={userMaster.userType}
                  onChange={(e) => setUserMaster({ ...userMaster, userType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {USER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>User Category *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={userMaster.userCategory}
                  onChange={(e) => setUserMaster({ ...userMaster, userCategory: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                  <option value="System API">System API</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Email *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <input
                  type="email"
                  value={userMaster.email}
                  onChange={(e) => setUserMaster({ ...userMaster, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Mobile *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <input
                  type="text"
                  value={userMaster.mobile}
                  onChange={(e) => setUserMaster({ ...userMaster, mobile: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>User Status *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <select
                  value={userMaster.userStatus}
                  onChange={(e) => setUserMaster({ ...userMaster, userStatus: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Locked">Locked</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Deactivated">Deactivated</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Effective From *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <input
                  type="date"
                  value={userMaster.effectiveFrom}
                  onChange={(e) => setUserMaster({ ...userMaster, effectiveFrom: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Effective To</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <input
                  type="date"
                  value={userMaster.effectiveTo}
                  onChange={(e) => setUserMaster({ ...userMaster, effectiveTo: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Profile Photo Upload Box */}
              <div className="sm:col-span-2 flex items-center gap-3 bg-muted/20 p-2 rounded-lg border border-border/60">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  <span className="font-mono">VS</span>
                </div>
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-foreground block">Profile Photo</label>
                  <p className="text-[10px] text-muted-foreground">JPEG or PNG under 2MB</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <button
                    onClick={() => showNotification("Photo updated.")}
                    className="p-1.5 rounded-md border border-border hover:bg-muted text-foreground cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => showNotification("Photo removed.")}
                    className="p-1.5 rounded-md border border-border hover:bg-muted text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right 3 columns: User Snapshot Side Card */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">User Snapshot</h4>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  Active
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Primary Role</span>
                  <span className="font-bold text-foreground font-sans">Finance Manager</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Secondary Roles</span>
                  <span className="font-bold text-foreground font-mono">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active Modules</span>
                  <span className="font-bold text-foreground font-mono">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Permissions</span>
                  <span className="font-bold text-primary font-mono">126</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Login</span>
                  <span className="font-mono text-muted-foreground text-[10px]">15 May 2024 10:45 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">MFA Status</span>
                  <span className="font-semibold text-emerald-600">Enabled</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Account Health</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Excellent</span>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-full border-4 border-emerald-500 text-xs font-bold font-mono text-emerald-600">
                92%
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "profile", label: "Profile", icon: UserCheck },
              { key: "organization", label: "Organization Mapping", icon: Building },
              { key: "roles", label: "Roles", icon: ShieldCheck },
              { key: "permissions", label: "Permissions", icon: Key },
              { key: "data-access", label: "Data Access", icon: Lock },
              { key: "authority", label: "Approval Authority", icon: Sliders },
              { key: "authentication", label: "Authentication", icon: Smartphone },
              { key: "security", label: "Security", icon: ShieldAlert },
              { key: "activity", label: "Activity", icon: Activity },
              { key: "review", label: "Review", icon: CheckCircle2 },
              { key: "documents", label: "Documents", icon: FileText },
              { key: "history", label: "History", icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* PROFILE / OVERVIEW TAB CONTENT (Matching attached screenshot layout) */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Row 1: User Identity & Profile | Organization Mapping | Role Assignment & Permission Summary */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 2. User Identity & Profile */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    2. User Identity & Profile
                  </h4>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-muted-foreground block">First Name *</label>
                      <input
                        type="text"
                        readOnly
                        value="Vikram"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Middle Name</label>
                      <input
                        type="text"
                        readOnly
                        value="Kumar"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Last Name *</label>
                      <input
                        type="text"
                        readOnly
                        value="Singh"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Preferred Name</label>
                      <input
                        type="text"
                        readOnly
                        value="Vikram"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-[11px] text-muted-foreground block">Employee ID</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>VIK001 - Vikram Singh</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Department</label>
                      <input
                        type="text"
                        readOnly
                        value="Finance & Accounts"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Branch</label>
                      <input
                        type="text"
                        readOnly
                        value="Noida Head Office"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Business Unit</label>
                      <input
                        type="text"
                        readOnly
                        value="Corporate Services"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Function</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Finance</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Reporting Manager</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Neha Kapoor</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Work Location</label>
                      <input
                        type="text"
                        readOnly
                        value="Noida"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Employment Type *</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Permanent</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Joining Date</label>
                      <input
                        type="text"
                        readOnly
                        value="10 Jan 2022"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Manager User ID</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>USR-NEH-001</option>
                      </select>
                    </div>

                    <div className="col-span-3 pt-1">
                      <label className="text-[11px] text-muted-foreground block">User Profile</label>
                      <input
                        type="text"
                        readOnly
                        value="Finance Professional"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-medium text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Organization Mapping */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    3. Organization Mapping
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-muted-foreground block">Legal Entity *</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Magnertia Global Pvt. Ltd.</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Business Unit</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Corporate Services</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Function</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Finance</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Department</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Finance & Accounts</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Division</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Finance Operations</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Team</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Accounts Payable</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Branch</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Noida Head Office</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Region</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>North Region</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Cost Centre</label>
                      <input
                        type="text"
                        readOnly
                        value="CC-FIN-001"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Profit Centre</label>
                      <input
                        type="text"
                        readOnly
                        value="PC-FIN-001"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono text-foreground"
                      />
                    </div>

                    <div className="col-span-2 flex items-center justify-between pt-2 border-t border-border/50">
                      <div>
                        <label className="text-[11px] text-muted-foreground block">Organization Level</label>
                        <select className="mt-0.5 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                          <option>Level 3 - Department</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPrimaryOrgToggle(!primaryOrgToggle)}>
                        <span className="text-[11px] text-muted-foreground">Primary Org</span>
                        {primaryOrgToggle ? (
                          <ToggleRight className="h-6 w-6 text-primary" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Role Assignment & 5. Permission Summary */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-4 shadow-xs">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <h4 className="text-xs font-bold text-foreground">4. Role Assignment</h4>
                    </div>

                    <div className="overflow-x-auto mt-2">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[11px]">
                            <th className="py-1.5 px-1">Role</th>
                            <th className="py-1.5 px-1">Type</th>
                            <th className="py-1.5 px-1 text-center">Primary</th>
                            <th className="py-1.5 px-1">Scope</th>
                            <th className="py-1.5 px-1">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 text-[11px]">
                          {ROLES_ASSIGNED_DATA.map((r) => (
                            <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-1.5 px-1 font-bold text-foreground">{r.name}</td>
                              <td className="py-1.5 px-1 text-muted-foreground">{r.type}</td>
                              <td className="py-1.5 px-1 text-center">
                                <div className={cn("h-3 w-3 rounded-full mx-auto border flex items-center justify-center", r.isPrimary ? "bg-primary border-primary" : "border-muted-foreground")}>
                                  {r.isPrimary && <div className="h-1 w-1 bg-white rounded-full" />}
                                </div>
                              </td>
                              <td className="py-1.5 px-1 text-muted-foreground">{r.scope}</td>
                              <td className="py-1.5 px-1">
                                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">
                                  {r.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button
                      onClick={() => showNotification("Role selection modal opened.")}
                      className="mt-2 text-[11px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      Add Role
                    </button>
                  </div>

                  {/* 5. Permission Summary */}
                  <div className="pt-3 border-t border-border/60 space-y-2">
                    <h4 className="text-xs font-bold text-foreground">5. Permission Summary</h4>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="rounded-lg border border-primary/30 bg-primary/5 p-2">
                        <Shield className="h-4 w-4 text-primary mx-auto mb-1" />
                        <span className="font-bold text-sm text-foreground block font-mono">126</span>
                        <span className="text-[9px] text-muted-foreground">Total</span>
                      </div>

                      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                        <span className="font-bold text-sm text-emerald-600 block font-mono">98</span>
                        <span className="text-[9px] text-muted-foreground">Allow</span>
                      </div>

                      <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-2">
                        <XCircle className="h-4 w-4 text-rose-500 mx-auto mb-1" />
                        <span className="font-bold text-sm text-rose-600 block font-mono">20</span>
                        <span className="text-[9px] text-muted-foreground">Deny</span>
                      </div>

                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-2">
                        <Clock className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                        <span className="font-bold text-sm text-amber-600 block font-mono">8</span>
                        <span className="text-[9px] text-muted-foreground">Conditional</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Data Access Scope | Approval Authority | Authentication | Recent Activity */}
              <div className="grid gap-4 lg:grid-cols-4">
                {/* 6. Data Access Scope */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    6. Data Access Scope
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[11px] text-muted-foreground block">Scope Type</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Department Scope</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Branch Scope</label>
                      <input
                        type="text"
                        readOnly
                        value="Noida Head Office"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Department Scope</label>
                      <input
                        type="text"
                        readOnly
                        value="Finance & Accounts"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Cost Centre Scope</label>
                      <input
                        type="text"
                        readOnly
                        value="CC-FIN-001"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Data Filter</label>
                      <input
                        type="text"
                        readOnly
                        value="Own Department Data"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-border/50">
                      <span className="text-muted-foreground text-[11px]">Status</span>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* 7. Approval Authority */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    7. Approval Authority
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[11px] text-muted-foreground block">Approval Type</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Finance Approval</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Transaction Type</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Payment</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Approval Limit (INR)</label>
                      <input
                        type="text"
                        readOnly
                        value="₹ 25,00,000"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono font-bold text-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Escalation User</label>
                      <input
                        type="text"
                        readOnly
                        value="Neha Kapoor"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-1" onClick={() => setDelegationAllowed(!delegationAllowed)}>
                      <span className="text-[11px] text-muted-foreground">Delegation Allowed</span>
                      {delegationAllowed ? (
                        <ToggleRight className="h-6 w-6 text-primary cursor-pointer" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-muted-foreground cursor-pointer" />
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-border/50">
                      <span className="text-muted-foreground text-[11px]">Status</span>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* 8. Authentication */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    8. Authentication
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[11px] text-muted-foreground block">Authentication Method</label>
                      <input
                        type="text"
                        readOnly
                        value="SSO (Azure AD)"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[11px]">MFA Status</span>
                      <span className="font-bold text-emerald-600 text-[11px]">Enabled</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[11px]">Last Login</span>
                      <span className="font-mono text-muted-foreground text-[10px]">15 May 2024 10:45 AM</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[11px]">Password Expiry</span>
                      <span className="font-mono text-foreground text-[10px]">12 Jun 2024</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[11px]">Account Locked</span>
                      <span className="font-semibold text-foreground text-[11px]">No</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                      <span className="text-muted-foreground text-[11px]">Status</span>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* 9. Recent Activity */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      9. Recent Activity
                    </h4>

                    <div className="overflow-x-auto mt-2">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                            <th className="py-1 px-1">Date & Time</th>
                            <th className="py-1 px-1">Module</th>
                            <th className="py-1 px-1">Action</th>
                            <th className="py-1 px-1">IP Address</th>
                            <th className="py-1 px-1">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 text-[10px]">
                          {RECENT_USER_ACTIVITY.map((act) => (
                            <tr key={act.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-1 px-1 font-mono text-[9px] text-muted-foreground">{act.datetime}</td>
                              <td className="py-1 px-1 font-medium text-foreground">{act.module}</td>
                              <td className="py-1 px-1 text-primary">{act.action}</td>
                              <td className="py-1 px-1 font-mono text-[9px]">{act.ip}</td>
                              <td className="py-1 px-1">
                                <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-[9px] font-bold text-emerald-600">
                                  {act.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Full security audit trail logs opened.")}
                    className="w-full text-center py-1.5 rounded-lg border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    View All Activity
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS / DETAILED SURFACES */}
          {activeTab !== "profile" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h4 className="text-base font-bold text-foreground capitalize flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    {activeTab.replace("-", " ")} Security Workspace
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Target Identity: <span className="font-semibold text-foreground font-mono">vikram.singh</span> (USR-VIK-001) · Enterprise RBAC & Security Scopes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                    Active Session
                  </span>
                  <button
                    onClick={() => showNotification(`Saved security rule to ${activeTab} workspace`)}
                    className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Assign {activeTab.slice(0, -1)} Rule
                  </button>
                </div>
              </div>

              {activeTab === "roles" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                          <th className="py-2.5 px-3">Role Code</th>
                          <th className="py-2.5 px-3">Role Name</th>
                          <th className="py-2.5 px-3">Role Type</th>
                          <th className="py-2.5 px-3">Primary</th>
                          <th className="py-2.5 px-3">Data Scope</th>
                          <th className="py-2.5 px-3">Assigned Date</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-foreground font-mono">
                        {[
                          { code: "ROL-FIN-001", name: "Finance Manager", type: "Management Role", isPri: "Yes", scope: "Organization", date: "01 Apr 2024", status: "Active" },
                          { code: "ROL-FIN-002", name: "Accounts Approver", type: "Approval Role", isPri: "No", scope: "Department", date: "01 Apr 2024", status: "Active" },
                          { code: "ROL-FIN-003", name: "Budget Controller", type: "Functional Role", isPri: "No", scope: "Department", date: "15 May 2024", status: "Active" },
                        ].map((r, idx) => (
                          <tr key={idx} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2 px-3 font-semibold text-primary">{r.code}</td>
                            <td className="py-2 px-3 font-sans font-medium text-foreground">{r.name}</td>
                            <td className="py-2 px-3 font-sans text-muted-foreground">{r.type}</td>
                            <td className="py-2 px-3">
                              <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold font-sans", r.isPri === "Yes" ? "bg-blue-500/10 text-blue-600" : "bg-muted text-muted-foreground")}>
                                {r.isPri}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-sans text-muted-foreground">{r.scope}</td>
                            <td className="py-2 px-3 text-muted-foreground">{r.date}</td>
                            <td className="py-2 px-3">
                              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20 font-sans">
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "permissions" && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { module: "General Ledger", read: true, create: true, edit: true, delete: false },
                    { module: "Accounts Payable", read: true, create: true, edit: true, delete: true },
                    { module: "Accounts Receivable", read: true, create: true, edit: true, delete: false },
                    { module: "Budgeting & Planning", read: true, create: true, edit: true, delete: false },
                    { module: "Fixed Assets", read: true, create: false, edit: false, delete: false },
                    { module: "Tax & Compliance", read: true, create: true, edit: true, delete: false },
                    { module: "Financial Reports", read: true, create: true, edit: true, delete: true },
                    { module: "System Settings", read: true, create: false, edit: false, delete: false },
                  ].map((perm, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-card p-3 space-y-2 shadow-xs">
                      <span className="text-xs font-bold text-foreground block">{perm.module}</span>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold">
                        <span className={cn("px-1.5 py-0.5 rounded", perm.read ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground opacity-50")}>R</span>
                        <span className={cn("px-1.5 py-0.5 rounded", perm.create ? "bg-blue-500/10 text-blue-600" : "bg-muted text-muted-foreground opacity-50")}>C</span>
                        <span className={cn("px-1.5 py-0.5 rounded", perm.edit ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground opacity-50")}>E</span>
                        <span className={cn("px-1.5 py-0.5 rounded", perm.delete ? "bg-rose-500/10 text-rose-600" : "bg-muted text-muted-foreground opacity-50")}>D</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab !== "roles" && activeTab !== "permissions" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                      <span className="text-xs font-bold text-foreground block">Active Role Count</span>
                      <span className="text-xl font-bold font-mono text-emerald-600">3 Roles</span>
                      <p className="text-[11px] text-muted-foreground">1 Primary, 2 Secondary Roles assigned.</p>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                      <span className="text-xs font-bold text-foreground block">Segregation of Duties (SoD)</span>
                      <span className="text-xl font-bold font-mono text-blue-600">0 Conflicts</span>
                      <p className="text-[11px] text-muted-foreground">Compliant with internal control policies.</p>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                      <span className="text-xs font-bold text-foreground block">Security Policy Index</span>
                      <span className="text-xl font-bold font-mono text-emerald-600">High Protection</span>
                      <p className="text-[11px] text-muted-foreground">MFA Enabled & SSO Bound.</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-4">
                    <h5 className="text-xs font-bold text-foreground mb-3 capitalize">{activeTab} Parameters & Audit Trail</h5>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between py-1 border-b border-border/50">
                        <span>Last Security Audit:</span>
                        <span className="font-mono text-foreground">15 May 2024, 10:45 AM</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/50">
                        <span>Assigned Security Officer:</span>
                        <span className="font-semibold text-foreground">Ananya Roy (CISO Office)</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Authentication Identity:</span>
                        <span className="text-emerald-600 font-bold">Verified SAML 2.0 SSO</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Classification & Modification Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-[11px] text-muted-foreground font-mono">
          <div>
            MAICW: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
            <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
            <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
            <span className="text-purple-500 font-bold">C</span> (Calculated) |{" "}
            <span className="text-rose-500 font-bold">W</span> (Workflow)
          </div>
          <div>
            Last Modified: <span className="font-sans font-semibold text-foreground">15 May 2024 11:30 AM</span> by <span className="font-sans font-semibold text-foreground">Rahul Sharma</span> | Created By: <span className="font-sans font-semibold text-foreground">Rahul Sharma</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
