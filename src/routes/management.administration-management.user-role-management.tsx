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
  { id: "R-001", name: "Chief Technology Officer", type: "Executive Role", isPrimary: true, scope: "Enterprise", effectiveFrom: "01 Apr 2024", effectiveTo: "-", status: "Active" },
  { id: "R-002", name: "Technology Architecture Board Lead", type: "Governance Role", isPrimary: false, scope: "Enterprise", effectiveFrom: "01 Apr 2024", effectiveTo: "-", status: "Active" },
  { id: "R-003", name: "Cloud Infrastructure Controller", type: "Functional Role", isPrimary: false, scope: "Division", effectiveFrom: "01 Apr 2024", effectiveTo: "-", status: "Active" },
];

const RECENT_USER_ACTIVITY = [
  { id: "ACT-101", datetime: "15 May 2024 10:45 AM", module: "Infrastructure", action: "Login (MFA)", ip: "103.21.45.67", status: "Success" },
  { id: "ACT-102", datetime: "15 May 2024 10:44 AM", module: "Architecture Review", action: "Approve RFC-108", ip: "103.21.45.67", status: "Success" },
  { id: "ACT-103", datetime: "15 May 2024 10:20 AM", module: "Security Console", action: "Audit Key Rotation", ip: "103.21.45.67", status: "Success" },
  { id: "ACT-104", datetime: "15 May 2024 09:10 AM", module: "DevOps Pipeline", action: "View", ip: "103.21.45.67", status: "Success" },
  { id: "ACT-105", datetime: "14 May 2024 05:30 PM", module: "Settings", action: "View", ip: "103.21.45.67", status: "Success" },
];

function UserRoleManagementPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "directory" | "roles" | "activity">("profile");

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

  // Dynamic Users List State
  const [usersList, setUsersList] = useState([
    { code: "USR-VIK-001", name: "Vikram Singh", email: "vikram.singh@magnertia.com", role: "Chief Technology Officer", dept: "Technology & Engineering", type: "Management", status: "Active" },
    { code: "USR-ANI-002", name: "Anita Verma", email: "anita.verma@magnertia.com", role: "Chief Financial Officer", dept: "Finance & Accounts", type: "Management", status: "Active" },
    { code: "USR-RAJ-003", name: "Rajeev Malhotra", email: "rajeev.m@magnertia.com", role: "Chief Executive Officer", dept: "Executive Office", type: "Management", status: "Active" },
    { code: "USR-PRI-004", name: "Priya Menon", email: "priya.menon@magnertia.com", role: "Lead Systems Architect", dept: "R&D Systems", type: "Employee", status: "Active" },
    { code: "USR-ROH-005", name: "Rohan Kapoor", email: "rohan.k@magnertia.com", role: "Accounts Controller", dept: "Finance & Accounts", type: "Employee", status: "Active" },
  ]);

  // Dynamic Roles List State
  const [rolesList, setRolesList] = useState([
    { code: "ROL-EXE-001", name: "Chief Technology Officer", type: "Executive Role", isPri: "Yes", scope: "Enterprise", date: "01 Apr 2024", status: "Active" },
    { code: "ROL-ARC-002", name: "Principal Enterprise Architect", type: "Technical Role", isPri: "No", scope: "Enterprise", date: "01 Apr 2024", status: "Active" },
    { code: "ROL-SEC-003", name: "Security & Compliance Officer", type: "Governance Role", isPri: "No", scope: "Enterprise", date: "15 May 2024", status: "Active" },
    { code: "ROL-ENG-004", name: "DevOps & Cloud Administrator", type: "System Role", isPri: "No", scope: "Engineering", date: "10 Mar 2024", status: "Active" },
  ]);

  // Dynamic Permissions List
  const [permissionsList, setPermissionsList] = useState([
    { module: "Core Infrastructure & Cloud", read: true, create: true, edit: true, delete: false },
    { module: "Security & IAM Policies", read: true, create: true, edit: true, delete: true },
    { module: "Architecture Blueprints", read: true, create: true, edit: true, delete: false },
    { module: "DevOps CI/CD Pipelines", read: true, create: true, edit: true, delete: false },
    { module: "Database Clusters", read: true, create: false, edit: false, delete: false },
    { module: "Cybersecurity Audits", read: true, create: true, edit: true, delete: false },
    { module: "Technical Specifications", read: true, create: true, edit: true, delete: true },
    { module: "System Master Settings", read: true, create: false, edit: false, delete: false },
  ]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);

  const [newUserForm, setNewUserForm] = useState({
    code: "",
    name: "",
    email: "",
    role: "Senior Software Engineer",
    dept: "Technology & Engineering",
    type: "Employee",
  });

  const [newRoleForm, setNewRoleForm] = useState({
    code: "",
    name: "",
    type: "Functional Role",
    scope: "Department",
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
      breadcrumb="Management > Organization > User & Role Management"
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
              <div className="relative inline-flex items-center justify-center">
                <svg width="48" height="48" className="transform -rotate-90">
                  <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="3.5" className="text-muted/30" fill="transparent" />
                  <circle
                    cx="24"
                    cy="24"
                    r="19"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 19}
                    strokeDashoffset={2 * Math.PI * 19 * (1 - 0.92)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold font-mono text-emerald-600">92%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs (Centered & Streamlined) */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "profile", label: "User Profile & Access", icon: Users },
              { key: "directory", label: "User Directory", icon: UserCheck },
              { key: "roles", label: "Role Matrix & Permissions", icon: ShieldCheck },
              { key: "activity", label: "Activity & Audit Log", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer",
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

          {/* PROFILE / OVERVIEW TAB CONTENT */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Row 1: User Identity & Profile | Organization Mapping | Role Assignment & Permission Summary */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 2. User Identity & Profile */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    2. User Identity & Profile
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-muted-foreground block">Display Name</label>
                      <input
                        type="text"
                        readOnly
                        value={userMaster.displayName}
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Username / Login ID</label>
                      <input
                        type="text"
                        readOnly
                        value={userMaster.username}
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono text-primary font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Email Address</label>
                      <input
                        type="text"
                        readOnly
                        value={userMaster.email}
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Contact Mobile</label>
                      <input
                        type="text"
                        readOnly
                        value={userMaster.mobile}
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-[11px] text-muted-foreground block">Employee Linkage</label>
                      <div className="mt-0.5 rounded-md border border-border bg-muted/20 px-2 py-1 text-xs text-foreground font-mono">
                        {userMaster.employee}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Organization Mapping */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    3. Organization Mapping
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-border bg-muted/15 p-2 space-y-0.5">
                        <span className="text-[10px] text-muted-foreground block">Legal Entity</span>
                        <span className="font-semibold text-foreground truncate block">Magnertia Global Pvt. Ltd.</span>
                      </div>
                      <div className="rounded-lg border border-border bg-muted/15 p-2 space-y-0.5">
                        <span className="text-[10px] text-muted-foreground block">Primary Branch</span>
                        <span className="font-semibold text-foreground truncate block">Delhi Corporate Hub</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-border bg-muted/15 p-2 space-y-0.5">
                        <span className="text-[10px] text-muted-foreground block">Assigned Dept</span>
                        <span className="font-semibold text-foreground truncate block">Technology & Engineering</span>
                      </div>
                      <div className="rounded-lg border border-border bg-muted/15 p-2 space-y-0.5">
                        <span className="text-[10px] text-muted-foreground block">Reporting Manager</span>
                        <span className="font-semibold text-foreground truncate block">Rajeev Malhotra (CEO)</span>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/15 p-2 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Cost Centre Mapping</span>
                      <span className="font-mono text-xs font-semibold text-primary">CC-TECH-001</span>
                    </div>
                  </div>
                </div>

                {/* 4. Security & Authentication Health */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      4. Authentication & Security Status
                    </h4>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Auth Provider:</span>
                        <span className="font-semibold text-foreground">Azure AD / SAML 2.0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">MFA Status:</span>
                        <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">Enabled</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Active Roles:</span>
                        <span className="font-bold text-foreground font-mono">{rolesList.length} Roles Assigned</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">SoD Policy Conflicts:</span>
                        <span className="font-bold text-emerald-600 font-mono">0 Conflicts</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex justify-between items-center">
                    <span className="text-[11px] text-muted-foreground">Account Status</span>
                    <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-600">
                      Active & Compliant
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USER DIRECTORY WORKSPACE */}
          {activeTab === "directory" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Active User Accounts</span>
                  <div className="text-xl font-bold font-mono text-foreground">{usersList.length} Users</div>
                  <p className="text-[10px] text-emerald-600 font-medium">100% Verified</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">MFA Protected</span>
                  <div className="text-xl font-bold font-mono text-foreground">100%</div>
                  <p className="text-[10px] text-blue-600 font-medium">Enterprise SSO Enforced</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Active Sessions</span>
                  <div className="text-xl font-bold font-mono text-foreground">14 Sessions</div>
                  <p className="text-[10px] text-purple-600 font-medium">Zero anomalous logins</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">License Utilization</span>
                  <div className="text-xl font-bold font-mono text-foreground">248 / 300</div>
                  <p className="text-[10px] text-amber-600 font-medium">52 Available seats</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="text-xs font-bold text-foreground">Enterprise User Directory ({usersList.length} Accounts)</h4>
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
                  >
                    + Add User
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="py-2 px-2">User ID</th>
                        <th className="py-2 px-2">Full Name</th>
                        <th className="py-2 px-2">Email Address</th>
                        <th className="py-2 px-2">Assigned Primary Role</th>
                        <th className="py-2 px-2">Department</th>
                        <th className="py-2 px-2">User Type</th>
                        <th className="py-2 px-2">Status</th>
                        <th className="py-2 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-[11px]">
                      {usersList.map((user) => (
                        <tr key={user.code} className="hover:bg-muted/30">
                          <td className="py-2 px-2 font-mono font-bold text-primary">{user.code}</td>
                          <td className="py-2 px-2 font-semibold text-foreground">{user.name}</td>
                          <td className="py-2 px-2 text-muted-foreground font-mono text-[11px]">{user.email}</td>
                          <td className="py-2 px-2 text-foreground font-medium">{user.role}</td>
                          <td className="py-2 px-2 text-muted-foreground">{user.dept}</td>
                          <td className="py-2 px-2">
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground font-medium">
                              {user.type}
                            </span>
                          </td>
                          <td className="py-2 px-2">
                            <span className="rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                              {user.status}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setUsersList((prev) => prev.filter((u) => u.code !== user.code));
                                showNotification(`User ${user.code} removed.`);
                              }}
                              className="text-rose-500 hover:text-rose-700 text-[11px] font-medium cursor-pointer"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ROLE MATRIX & PERMISSIONS WORKSPACE */}
          {activeTab === "roles" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="text-xs font-bold text-foreground">Role Architecture & Data Access Scopes ({rolesList.length} Roles)</h4>
                  <button
                    onClick={() => setShowAddRoleModal(true)}
                    className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
                  >
                    + Add Role
                  </button>
                </div>

                <div className="overflow-x-auto">
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
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-foreground font-mono text-[11px]">
                      {rolesList.map((r) => (
                        <tr key={r.code} className="hover:bg-muted/30 transition-colors">
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
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setRolesList((prev) => prev.filter((item) => item.code !== r.code));
                                showNotification(`Role ${r.code} removed.`);
                              }}
                              className="text-rose-500 hover:text-rose-700 text-[11px] font-medium cursor-pointer"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Granular Module Permissions Matrix */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="text-xs font-bold text-foreground">Granular Module Permissions Grid (CRUD Matrix)</h4>
                  <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">R: Read</span>
                    <span className="text-blue-600 font-bold">C: Create</span>
                    <span className="text-amber-600 font-bold">E: Edit</span>
                    <span className="text-rose-600 font-bold">D: Delete</span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {permissionsList.map((perm, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-muted/15 p-3 space-y-2 shadow-2xs">
                      <span className="text-xs font-bold text-foreground block">{perm.module}</span>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => {
                            setPermissionsList((prev) => prev.map((p, i) => i === idx ? { ...p, read: !p.read } : p));
                          }}
                          className={cn("px-2 py-0.5 rounded cursor-pointer transition-colors", perm.read ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30" : "bg-muted text-muted-foreground opacity-40")}
                        >
                          R
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPermissionsList((prev) => prev.map((p, i) => i === idx ? { ...p, create: !p.create } : p));
                          }}
                          className={cn("px-2 py-0.5 rounded cursor-pointer transition-colors", perm.create ? "bg-blue-500/15 text-blue-600 border border-blue-500/30" : "bg-muted text-muted-foreground opacity-40")}
                        >
                          C
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPermissionsList((prev) => prev.map((p, i) => i === idx ? { ...p, edit: !p.edit } : p));
                          }}
                          className={cn("px-2 py-0.5 rounded cursor-pointer transition-colors", perm.edit ? "bg-amber-500/15 text-amber-600 border border-amber-500/30" : "bg-muted text-muted-foreground opacity-40")}
                        >
                          E
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPermissionsList((prev) => prev.map((p, i) => i === idx ? { ...p, delete: !p.delete } : p));
                          }}
                          className={cn("px-2 py-0.5 rounded cursor-pointer transition-colors", perm.delete ? "bg-rose-500/15 text-rose-600 border border-rose-500/30" : "bg-muted text-muted-foreground opacity-40")}
                        >
                          D
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY & AUDIT LOG WORKSPACE */}
          {activeTab === "activity" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Security Authentication & Access Activity Audit Trail
                </h4>
                <span className="text-[11px] font-mono text-muted-foreground">Active IP Geolocation Monitoring</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2 px-2">Timestamp</th>
                      <th className="py-2 px-2">Target Module</th>
                      <th className="py-2 px-2">Action Executed</th>
                      <th className="py-2 px-2">IP Address</th>
                      <th className="py-2 px-2">Security Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-[11px]">
                    {RECENT_USER_ACTIVITY.map((act) => (
                      <tr key={act.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-2 font-mono text-muted-foreground">{act.datetime}</td>
                        <td className="py-2 px-2 font-semibold text-foreground">{act.module}</td>
                        <td className="py-2 px-2 text-primary font-medium">{act.action}</td>
                        <td className="py-2 px-2 font-mono">{act.ip}</td>
                        <td className="py-2 px-2">
                          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                            {act.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* --- ADD USER MODAL --- */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Create User Account</h3>
                </div>
                <button onClick={() => setShowAddUserModal(false)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">User Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. USR-DEV-006"
                    value={newUserForm.code}
                    onChange={(e) => setNewUserForm({ ...newUserForm, code: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Anand Kumar"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g. anand.k@magnertia.com"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Primary Role</label>
                    <input
                      type="text"
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Department</label>
                    <input
                      type="text"
                      value={newUserForm.dept}
                      onChange={(e) => setNewUserForm({ ...newUserForm, dept: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newUserForm.code || !newUserForm.name || !newUserForm.email) {
                      alert("Please provide user code, name, and email.");
                      return;
                    }
                    setUsersList((prev) => [
                      ...prev,
                      {
                        code: newUserForm.code.toUpperCase(),
                        name: newUserForm.name,
                        email: newUserForm.email,
                        role: newUserForm.role,
                        dept: newUserForm.dept,
                        type: newUserForm.type,
                        status: "Active",
                      },
                    ]);
                    setShowAddUserModal(false);
                    showNotification(`User account ${newUserForm.code.toUpperCase()} successfully created.`);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- ADD ROLE MODAL --- */}
        {showAddRoleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Create RBAC Role</h3>
                </div>
                <button onClick={() => setShowAddRoleModal(false)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Role Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. ROL-OPS-005"
                    value={newRoleForm.code}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, code: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Role Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Operations Coordinator"
                    value={newRoleForm.name}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Role Type</label>
                    <select
                      value={newRoleForm.type}
                      onChange={(e) => setNewRoleForm({ ...newRoleForm, type: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                    >
                      <option value="Management Role">Management Role</option>
                      <option value="Functional Role">Functional Role</option>
                      <option value="Approval Role">Approval Role</option>
                      <option value="System Role">System Role</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Data Scope</label>
                    <select
                      value={newRoleForm.scope}
                      onChange={(e) => setNewRoleForm({ ...newRoleForm, scope: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                    >
                      <option value="Enterprise">Enterprise</option>
                      <option value="Organization">Organization</option>
                      <option value="Department">Department</option>
                      <option value="Branch">Branch</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newRoleForm.code || !newRoleForm.name) {
                      alert("Please provide role code and name.");
                      return;
                    }
                    setRolesList((prev) => [
                      ...prev,
                      {
                        code: newRoleForm.code.toUpperCase(),
                        name: newRoleForm.name,
                        type: newRoleForm.type,
                        isPri: "No",
                        scope: newRoleForm.scope,
                        date: "Today",
                        status: "Active",
                      },
                    ]);
                    setShowAddRoleModal(false);
                    showNotification(`Role ${newRoleForm.code.toUpperCase()} successfully created.`);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
                >
                  Create Role
                </button>
              </div>
            </div>
          </div>
        )}

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
