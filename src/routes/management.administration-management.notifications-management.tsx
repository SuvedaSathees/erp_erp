import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AdminManagementTabBar } from "@/components/erp/AdminManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Bell,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Save,
  Send,
  Plus,
  Sliders,
  Clock,
  UserCheck,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Upload,
  Download,
  Share2,
  Lock,
  Archive,
  Edit,
  Building,
  Briefcase,
  FolderTree,
  User,
  Shield,
  Activity,
  History,
  File,
  Check,
  ChevronRight,
  Users,
  Copy,
  Mail,
  MessageSquare,
  Smartphone,
  Radio,
  BarChart2,
  FileSpreadsheet,
  Power,
  Zap,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/management/administration-management/notifications-management")({
  head: () => ({
    meta: [
      { title: "Notifications Management · Magnertia ERP" },
      {
        name: "description",
        content: "Manage complete lifecycle of system and business notifications across creation, trigger, audience, channel, delivery, acknowledgement, escalation, tracking, and audit.",
      },
    ],
  }),
  component: NotificationsManagementPage,
});

// --- Data & Mock Definitions ---

const NOTIFICATION_TYPES = [
  "System Notification",
  "Business Notification",
  "Workflow Notification",
  "Approval Notification",
  "Reminder",
  "Alert",
  "Warning",
  "Escalation",
  "Exception Notification",
  "Compliance Notification",
  "Security Notification",
  "Transaction Notification",
  "Scheduled Notification",
  "Broadcast Notification",
];

const AUDIENCE_SUMMARY_DATA = [
  { id: "AUD-1", type: "Role", count: 45, rule: "Accounts Receivable Team", status: "Active" },
  { id: "AUD-2", type: "Department", count: 25, rule: "Finance Department", status: "Active" },
  { id: "AUD-3", type: "User Group", count: 30, rule: "Collections Team", status: "Active" },
  { id: "AUD-4", type: "Manager", count: 10, rule: "Invoice Owner Manager", status: "Active" },
  { id: "AUD-5", type: "Dynamic Rule", count: 18, rule: "Invoice Created By", status: "Active" },
];

const CHANNEL_CONFIG_DATA = [
  { id: "CHN-1", name: "Email", primary: true, priority: 1, status: "Active" },
  { id: "CHN-2", name: "In-App", primary: true, priority: 2, status: "Active" },
  { id: "CHN-3", name: "SMS", primary: false, priority: 3, status: "Active" },
  { id: "CHN-4", name: "WhatsApp", primary: false, priority: 4, status: "Inactive" },
  { id: "CHN-5", name: "Push Notification", primary: false, priority: 5, status: "Active" },
];

const RECENT_NOTIFICATIONS_DATA = [
  { id: "NTF-0003487", recipient: "Rahul Sharma", channel: "Email", status: "Delivered", sentAt: "15 Apr 2024 09:00 AM", ackAt: "15 Apr 2024 09:15 AM", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "NTF-0003488", recipient: "Neha Kapoor", channel: "In-App", status: "Read", sentAt: "15 Apr 2024 09:01 AM", ackAt: "15 Apr 2024 09:20 AM", badge: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { id: "NTF-0003489", recipient: "Amit Verma", channel: "Email", status: "Delivered", sentAt: "15 Apr 2024 09:02 AM", ackAt: "-", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "NTF-0003490", recipient: "Pooja Mehta", channel: "SMS", status: "Sent", sentAt: "15 Apr 2024 09:03 AM", ackAt: "-", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "NTF-0003491", recipient: "Vikram Singh", channel: "Email", status: "Failed", sentAt: "15 Apr 2024 09:03 AM", ackAt: "-", badge: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
];

export function NotificationsManagementPage() {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "trigger"
    | "rule"
    | "template"
    | "audience"
    | "channel"
    | "schedule"
    | "priority"
    | "actions"
    | "escalation"
    | "preferences"
    | "tracking"
    | "audit"
  >("overview");

  // Master Form State
  const [notifMaster, setNotifMaster] = useState({
    notifId: "NTF-2024-00087",
    notifCode: "INV-DUE-REM-03",
    notifTitle: "Invoice Due Date Reminder",
    notifType: "Reminder",
    notifCategory: "Financial",
    description: "Remind users about upcoming invoice due date 3 days before due date.",
    module: "Finance",
    submodule: "Accounts Receivable",
    businessFunction: "Collections",
    eventType: "Deadline Approaching",
    priority: "High",
    severity: "Warning",
    owner: "Amit Verma",
    status: "Active",
    effectiveFrom: "2024-04-01",
    effectiveTo: "2026-03-31",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="Notifications Management"
      breadcrumb="Management > Administration Management > Notifications Management > Notifications Form"
      description="Manage system & business notifications—from event triggers, dynamic templates, audience resolution, channels, delivery, to acknowledgement and escalation."
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
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-foreground">Notifications Form</h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  {notifMaster.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                MAICW Classification · Multi-Channel Business Communication Gateway Engine
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showNotification("Test notification dispatched to your email & in-app inbox.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Test Notification
            </button>

            <button
              onClick={() => showNotification("Notification preview modal opened.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-primary" />
              Preview
            </button>

            <button
              onClick={() => showNotification("Notification Master record saved successfully.")}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>

            <button
              onClick={() => showNotification("Submitted for Communication & Systems Administrator Approval.")}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Approval
            </button>
          </div>
        </div>

        {/* 1. Notification Master Form & Snapshot Side Card (Matching Attached Reference Screenshot) */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left 9 columns: Notification Master Fields */}
          <div className="lg:col-span-9 rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> Notification Master
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
                  <span>Notification ID</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={notifMaster.notifId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Notification Code *</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  value={notifMaster.notifCode}
                  onChange={(e) => setNotifMaster({ ...notifMaster, notifCode: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Notification Title *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <input
                  type="text"
                  value={notifMaster.notifTitle}
                  onChange={(e) => setNotifMaster({ ...notifMaster, notifTitle: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Notification Type *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={notifMaster.notifType}
                  onChange={(e) => setNotifMaster({ ...notifMaster, notifType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {NOTIFICATION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Notification Category *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={notifMaster.notifCategory}
                  onChange={(e) => setNotifMaster({ ...notifMaster, notifCategory: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Financial">Financial</option>
                  <option value="Operational">Operational</option>
                  <option value="System">System</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Module *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={notifMaster.module}
                  onChange={(e) => setNotifMaster({ ...notifMaster, module: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Finance">Finance</option>
                  <option value="Procurement">Procurement</option>
                  <option value="HRMS">HRMS</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Submodule *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={notifMaster.submodule}
                  onChange={(e) => setNotifMaster({ ...notifMaster, submodule: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Accounts Receivable">Accounts Receivable</option>
                  <option value="Accounts Payable">Accounts Payable</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Business Function</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={notifMaster.businessFunction}
                  onChange={(e) => setNotifMaster({ ...notifMaster, businessFunction: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Collections">Collections</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Event Type *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={notifMaster.eventType}
                  onChange={(e) => setNotifMaster({ ...notifMaster, eventType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Deadline Approaching">Deadline Approaching</option>
                  <option value="Record Created">Record Created</option>
                  <option value="Approval Required">Approval Required</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Priority *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={notifMaster.priority}
                  onChange={(e) => setNotifMaster({ ...notifMaster, priority: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-amber-600 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Severity *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={notifMaster.severity}
                  onChange={(e) => setNotifMaster({ ...notifMaster, severity: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-amber-600 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Warning">Warning</option>
                  <option value="Information">Information</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Owner *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={notifMaster.owner}
                  onChange={(e) => setNotifMaster({ ...notifMaster, owner: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Amit Verma">Amit Verma (Finance Manager)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Status *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <select
                  value={notifMaster.status}
                  onChange={(e) => setNotifMaster({ ...notifMaster, status: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Effective From *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <input
                  type="date"
                  value={notifMaster.effectiveFrom}
                  onChange={(e) => setNotifMaster({ ...notifMaster, effectiveFrom: e.target.value })}
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
                  value={notifMaster.effectiveTo}
                  onChange={(e) => setNotifMaster({ ...notifMaster, effectiveTo: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Description Box */}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Description *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <textarea
                  rows={2}
                  value={notifMaster.description}
                  onChange={(e) => setNotifMaster({ ...notifMaster, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right 3 columns: Notification Snapshot Side Card */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Notification Snapshot</h4>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {notifMaster.status}
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Created On</span>
                  <span className="font-mono text-muted-foreground text-[10px]">01 Apr 2024 09:15 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Created By</span>
                  <span className="font-semibold text-foreground">Amit Verma</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-mono text-muted-foreground text-[10px]">15 Apr 2024 11:20 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Updated By</span>
                  <span className="font-semibold text-foreground">Neha Kapoor</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Approval Status</span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">
                    Approved
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Delivery Status</span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">
                    Delivered
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Recipients</span>
                  <span className="font-bold text-foreground font-mono">128</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending Ack</span>
                  <span className="font-bold text-amber-600 font-mono">36</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Acknowledgement Rate</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Good</span>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-full border-4 border-emerald-500 text-xs font-bold font-mono text-emerald-600">
                72%
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "overview", label: "Overview", icon: Layers },
              { key: "trigger", label: "Trigger", icon: Zap },
              { key: "rule", label: "Rule", icon: Sliders },
              { key: "template", label: "Template", icon: FileText },
              { key: "audience", label: "Audience", icon: Users },
              { key: "channel", label: "Channel", icon: Radio },
              { key: "schedule", label: "Schedule", icon: Clock },
              { key: "priority", label: "Priority & Severity", icon: AlertTriangle },
              { key: "actions", label: "Actions", icon: CheckCircle2 },
              { key: "escalation", label: "Escalation", icon: TrendingUp },
              { key: "preferences", label: "Preferences", icon: Lock },
              { key: "tracking", label: "Tracking", icon: Activity },
              { key: "audit", label: "Audit Trail", icon: History },
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

          {/* OVERVIEW TAB CONTENT (Matching attached screenshot layout) */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Row 1: 2. Trigger Summary | 3. Template Preview | 4. Audience Summary | 5. Channel Configuration */}
              <div className="grid gap-4 lg:grid-cols-4">
                {/* 2. Trigger Summary */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      2. Trigger Summary
                    </h4>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Trigger Type</span>
                        <span className="font-semibold text-foreground">Deadline Approaching</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Source Module</span>
                        <span className="font-semibold text-foreground">Finance</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Source Transaction</span>
                        <span className="font-medium text-foreground">Customer Invoice</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Event</span>
                        <span className="font-medium text-foreground">Invoice Due Date</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Condition</span>
                        <span className="font-mono text-primary font-bold">Due Date ≤ 3 Days</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Trigger Frequency</span>
                        <span className="font-medium text-foreground">Daily</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Delay</span>
                        <span className="font-mono text-muted-foreground">00:00</span>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-border/50">
                        <span className="text-muted-foreground">Trigger Status</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Trigger configuration rule editor opened.")}
                    className="w-full text-center py-1.5 rounded-lg border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    View Trigger Details
                  </button>
                </div>

                {/* 3. Template Preview */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      3. Template Preview
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-semibold text-muted-foreground block">Subject</span>
                        <p className="font-mono text-xs font-bold text-foreground truncate bg-muted/20 p-1.5 rounded border border-border/50">
                          Reminder: Invoice {"{{DocumentNumber}}"} is Due on {"{{DueDate}}"}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-muted-foreground block">Message</span>
                        <div className="mt-0.5 rounded-md border border-border bg-muted/20 p-2 text-[11px] text-foreground space-y-1 font-mono">
                          <p>Hello {"{{UserName}}"},</p>
                          <p className="text-[10px]">
                            This is a reminder that invoice {"{{DocumentNumber}}"} for {"{{Amount}}"} is due on {"{{DueDate}}"}.
                          </p>
                          <p className="text-[10px]">Please make the payment on time to avoid late fees.</p>
                          <p className="text-[10px]">You can view the invoice details using the link below:</p>
                          <p className="text-primary text-[10px]">{"{{RecordLink}}"}</p>
                          <p className="text-[10px] pt-1">Thank you,</p>
                          <p className="text-[10px]">{"{{CompanyName}}"} Finance Team</p>
                        </div>
                      </div>

                      <div className="text-[9px] text-muted-foreground font-mono">
                        Variables: <span className="text-primary">{"{{UserName}}, {{DocumentNumber}}, {{Amount}}, {{DueDate}}, {{RecordLink}}, {{CompanyName}}"}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Template editor opened.")}
                    className="w-full text-center py-1.5 rounded-lg border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    Edit Template
                  </button>
                </div>

                {/* 4. Audience Summary */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      4. Audience Summary
                    </h4>

                    <div className="overflow-x-auto mt-1">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                            <th className="py-1 px-1">Audience Type</th>
                            <th className="py-1 px-1 text-center">Count</th>
                            <th className="py-1 px-1">Rule</th>
                            <th className="py-1 px-1">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 text-[10px]">
                          {AUDIENCE_SUMMARY_DATA.map((aud) => (
                            <tr key={aud.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-1 px-1 font-medium text-foreground">{aud.type}</td>
                              <td className="py-1 px-1 text-center font-mono font-bold text-primary">{aud.count}</td>
                              <td className="py-1 px-1 text-muted-foreground truncate max-w-[80px]">{aud.rule}</td>
                              <td className="py-1 px-1">
                                <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-[9px] font-bold text-emerald-600">
                                  {aud.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Audience directory opened.")}
                    className="w-full text-center py-1.5 rounded-lg border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    View Audience Details
                  </button>
                </div>

                {/* 5. Channel Configuration */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      5. Channel Configuration
                    </h4>

                    <div className="overflow-x-auto mt-1">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                            <th className="py-1 px-1">Channel</th>
                            <th className="py-1 px-1 text-center">Primary</th>
                            <th className="py-1 px-1 text-center">Priority</th>
                            <th className="py-1 px-1">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 text-[10px]">
                          {CHANNEL_CONFIG_DATA.map((chn) => (
                            <tr key={chn.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-1 px-1 font-medium text-foreground">{chn.name}</td>
                              <td className="py-1 px-1 text-center">
                                {chn.primary ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 inline" />
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </td>
                              <td className="py-1 px-1 text-center font-mono font-bold">{chn.priority}</td>
                              <td className="py-1 px-1">
                                <span
                                  className={cn(
                                    "rounded px-1 py-0.2 text-[9px] font-bold",
                                    chn.status === "Active"
                                      ? "bg-emerald-500/10 text-emerald-600"
                                      : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  {chn.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Manage Channels gateway opened.")}
                    className="w-full text-center py-1.5 rounded-lg border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    Manage Channels
                  </button>
                </div>
              </div>

              {/* Row 2: 8. Priority & Severity | 7. Acknowledgement Summary | 9. Quick Actions */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 8. Priority & Severity */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      8. Priority & Severity
                    </h4>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Priority</span>
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20">
                          High
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Severity</span>
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20">
                          Warning
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Response Required</span>
                        <span className="font-bold text-foreground">Yes</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Response SLA</span>
                        <span className="font-mono text-foreground font-bold">1 Day</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Escalation Required</span>
                        <span className="font-semibold text-primary">3 Levels</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("SLA & Escalation matrix details opened.")}
                    className="text-[11px] font-bold text-primary hover:underline cursor-pointer pt-1"
                  >
                    View Details
                  </button>
                </div>

                {/* 7. Acknowledgement Summary */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      7. Acknowledgement Summary
                    </h4>

                    {/* Donut Ring Chart Graphic */}
                    <div className="flex items-center justify-center gap-6 py-3">
                      <div className="relative h-24 w-24 rounded-full border-8 border-emerald-500 border-t-amber-500 border-r-rose-500 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold font-mono text-foreground">128</span>
                        <span className="text-[9px] text-muted-foreground">Total Sent</span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-muted-foreground text-[11px]">Acknowledged (92)</span>
                          <span className="font-mono font-bold text-foreground ml-auto">72%</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="text-muted-foreground text-[11px]">Pending (36)</span>
                          <span className="font-mono font-bold text-foreground ml-auto">28%</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" />
                          <span className="text-muted-foreground text-[11px]">Overdue (8)</span>
                          <span className="font-mono font-bold text-foreground ml-auto">6%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Acknowledgement breakdown report loaded.")}
                    className="w-full text-center py-1.5 rounded-lg border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    View Acknowledgement Details
                  </button>
                </div>

                {/* 9. Quick Actions & Recent Notifications */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-4 shadow-xs">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      9. Quick Actions
                    </h4>

                    <div className="grid grid-cols-5 gap-1.5 pt-2 text-center text-[9px]">
                      <button
                        onClick={() => showNotification("Test notification sent.")}
                        className="p-1.5 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5 text-primary" />
                        <span>Send Test</span>
                      </button>

                      <button
                        onClick={() => showNotification("Notification template copied.")}
                        className="p-1.5 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <Copy className="h-3.5 w-3.5 text-blue-600" />
                        <span>Copy Notif</span>
                      </button>

                      <button
                        onClick={() => showNotification("Notification cloned.")}
                        className="p-1.5 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5 text-purple-600" />
                        <span>Clone</span>
                      </button>

                      <button
                        onClick={() => showNotification("Notification deactivated.")}
                        className="p-1.5 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer text-rose-600"
                      >
                        <Power className="h-3.5 w-3.5" />
                        <span>Deactivate</span>
                      </button>

                      <button
                        onClick={() => showNotification("Analytics dashboard loaded.")}
                        className="p-1.5 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <BarChart2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Analytics</span>
                      </button>

                      <button
                        onClick={() => showNotification("Recipients exported.")}
                        className="p-1.5 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Export</span>
                      </button>

                      <button
                        onClick={() => showNotification("Notification logs opened.")}
                        className="p-1.5 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                        <span>Logs</span>
                      </button>

                      <button
                        onClick={() => showNotification("Delivery report loaded.")}
                        className="p-1.5 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Delivery</span>
                      </button>

                      <button
                        onClick={() => showNotification("Escalation log loaded.")}
                        className="p-1.5 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        <span>Escalation</span>
                      </button>

                      <button
                        onClick={() => showNotification("Audit trail loaded.")}
                        className="p-1.5 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                        <span>Audit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: 8. Recent Notifications */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="text-xs font-bold text-foreground">8. Recent Notifications</h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                        <th className="py-1.5 px-1">Notification ID</th>
                        <th className="py-1.5 px-1">Recipient</th>
                        <th className="py-1.5 px-1">Channel</th>
                        <th className="py-1.5 px-1">Status</th>
                        <th className="py-1.5 px-1">Sent At</th>
                        <th className="py-1.5 px-1">Acknowledged At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-[11px]">
                      {RECENT_NOTIFICATIONS_DATA.map((n) => (
                        <tr key={n.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-1.5 px-1 font-mono font-medium text-primary">{n.id}</td>
                          <td className="py-1.5 px-1 font-medium text-foreground">{n.recipient}</td>
                          <td className="py-1.5 px-1 text-muted-foreground">{n.channel}</td>
                          <td className="py-1.5 px-1">
                            <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-bold border", n.badge)}>
                              {n.status}
                            </span>
                          </td>
                          <td className="py-1.5 px-1 font-mono text-[10px] text-muted-foreground">{n.sentAt}</td>
                          <td className="py-1.5 px-1 font-mono text-[10px] text-muted-foreground">{n.ackAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={() => showNotification("All notifications list loaded.")}
                  className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer pt-1"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}

          {/* OTHER TABS PLACEHOLDER */}
          {activeTab !== "overview" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h4 className="text-sm font-bold text-foreground capitalize">{activeTab} Workspace</h4>
                <span className="text-xs text-muted-foreground">Notification ID: NTF-2024-00087</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Detailed settings for <span className="font-semibold text-foreground capitalize">{activeTab}</span> adhering to MAICW specification.
              </p>
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Active Gateways</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">Email, In-App, Push</span>
                  <p className="text-[11px] text-muted-foreground">99.2% delivery success rate.</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Escalation Path</span>
                  <span className="text-xl font-bold font-mono text-blue-600">3 Levels Configured</span>
                  <p className="text-[11px] text-muted-foreground">Level 1 User → Level 2 Manager → Level 3 Head.</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Acknowledgement Rate</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">72.0%</span>
                  <p className="text-[11px] text-muted-foreground">92 of 128 recipients confirmed.</p>
                </div>
              </div>
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
            Last Modified: <span className="font-sans font-semibold text-foreground">15 Apr 2024 11:20 AM</span> by <span className="font-sans font-semibold text-foreground">Neha Kapoor</span> | Created By: <span className="font-sans font-semibold text-foreground">Amit Verma</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
