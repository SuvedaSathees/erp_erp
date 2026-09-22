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
  { id: "AUD-1", type: "Role", count: 68, rule: "Department Approvers & Managers", status: "Active" },
  { id: "AUD-2", type: "Department", count: 142, rule: "Quality & Plant Operations", status: "Active" },
  { id: "AUD-3", type: "User Group", count: 12, rule: "Corporate Security & IAM Administrators", status: "Active" },
  { id: "AUD-4", type: "Executive Committee", count: 8, rule: "C-Suite & Steering Committee Leads", status: "Active" },
  { id: "AUD-5", type: "Dynamic Rule", count: 320, rule: "Active System Session Users", status: "Active" },
];

const CHANNEL_CONFIG_DATA = [
  { id: "CHN-1", name: "Email", primary: true, priority: 1, status: "Active" },
  { id: "CHN-2", name: "In-App", primary: true, priority: 2, status: "Active" },
  { id: "CHN-3", name: "SMS", primary: false, priority: 3, status: "Active" },
  { id: "CHN-4", name: "WhatsApp", primary: false, priority: 4, status: "Inactive" },
  { id: "CHN-5", name: "Push Notification", primary: false, priority: 5, status: "Active" },
];

const RECENT_NOTIFICATIONS_DATA = [
  { id: "NTF-0003487", recipient: "Raghavan Sundaram", channel: "Email", status: "Delivered", sentAt: "15 Apr 2024 09:00 AM", ackAt: "15 Apr 2024 09:15 AM", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "NTF-0003488", recipient: "Anita Verma (CFO)", channel: "In-App", status: "Read", sentAt: "15 Apr 2024 09:01 AM", ackAt: "15 Apr 2024 09:20 AM", badge: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { id: "NTF-0003489", recipient: "Sanjay Mathur (GM)", channel: "Email", status: "Delivered", sentAt: "15 Apr 2024 09:02 AM", ackAt: "-", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "NTF-0003490", recipient: "Meera Nair (VP HR)", channel: "SMS", status: "Sent", sentAt: "15 Apr 2024 09:03 AM", ackAt: "-", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "NTF-0003491", recipient: "Vikram Singh (CTO)", channel: "Email", status: "Delivered", sentAt: "15 Apr 2024 09:03 AM", ackAt: "15 Apr 2024 09:05 AM", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
];

function NotificationsManagementPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "templates" | "audience" | "logs">("overview");

  // Master Form State
  const [notifMaster, setNotifMaster] = useState({
    notifId: "NTF-2024-00087",
    notifCode: "SYS-MFA-ROT-01",
    notifTitle: "Enterprise Security Key & Credential Rotation Alert",
    notifType: "Security Notification",
    notifCategory: "System Security",
    description: "Automated alert sent to all privileged administrators when credential renewal or policy rotation is required within 7 days.",
    module: "Administration",
    submodule: "User & Role Management",
    businessFunction: "Security Governance",
    eventType: "Credential Expiry Warning",
    priority: "High",
    severity: "Warning",
    owner: "Vikram Singh (CTO)",
    status: "Active",
    effectiveFrom: "2024-04-01",
    effectiveTo: "2026-03-31",
  });

  // Dynamic Templates State
  const [templatesList, setTemplatesList] = useState([
    { id: "TMP-1", code: "SEC-MFA-EML", name: "Security Credential Expiry (Email)", channel: "Email", subject: "Action Required: API Key & MFA Renewal for {{user_name}}", status: "Active" },
    { id: "TMP-2", code: "SOP-REV-APP", name: "Controlled SOP Review In-App", channel: "In-App", subject: "Document {{doc_number}} assigned for your engineering sign-off", status: "Active" },
    { id: "TMP-3", code: "CAP-APP-SMS", name: "High-Value Capex SMS Alert", channel: "SMS", subject: "Urgent: Capex approval {{req_id}} awaits Executive Board sign-off.", status: "Active" },
    { id: "TMP-4", code: "POL-PUB-EML", name: "Corporate Policy Release Notification", channel: "Email", subject: "New Enterprise Policy Published: {{policy_title}}", status: "Active" },
  ]);

  // Dynamic Dispatch Logs
  const [dispatchLogs, setDispatchLogs] = useState([
    { id: "NTF-0003487", recipient: "Raghavan Sundaram (Finance Head)", channel: "Email", event: "Q1 Budget Allocation", status: "Delivered", sentAt: "15 Apr 2024 09:00 AM" },
    { id: "NTF-0003488", recipient: "Anita Verma (CFO)", channel: "In-App", event: "Capex Board Request", status: "Read", sentAt: "15 Apr 2024 09:01 AM" },
    { id: "NTF-0003489", recipient: "Sanjay Mathur (Delhi GM)", channel: "Email", event: "Branch Audit Digest", status: "Delivered", sentAt: "15 Apr 2024 09:02 AM" },
    { id: "NTF-0003490", recipient: "Meera Nair (VP HR)", channel: "SMS", event: "Policy Acknowledgment Milestone", status: "Sent", sentAt: "15 Apr 2024 09:03 AM" },
  ]);

  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [newTemplateForm, setNewTemplateForm] = useState({
    name: "",
    code: "",
    channel: "Email",
    subject: "",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="Notifications Management"
      breadcrumb="Management > Organization > Notifications Management"
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
                  <option value="Administration">Administration</option>
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
                  <option value="User & Role Management">User & Role Management</option>
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
                  <option value="Security Governance">Security Governance</option>
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
                    strokeDashoffset={2 * Math.PI * 19 * (1 - 0.72)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold font-mono text-emerald-600">72%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs (Centered & Streamlined) */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "overview", label: "Notification Parameters & Triggers", icon: Layers },
              { key: "templates", label: "Templates & Channel Gateways", icon: FileText },
              { key: "audience", label: "Audience & Escalation Path", icon: Users },
              { key: "logs", label: "Dispatch Logs & Delivery Audit", icon: Clock },
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

          {/* OVERVIEW TAB CONTENT */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Row 1: Trigger Summary & Source Event | Priority & Routing */}
              <div className="grid gap-4 lg:grid-cols-2">
                {/* 2. Trigger Specification */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    2. Event Trigger & Firing Condition
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Trigger Code:</span>
                      <span className="font-mono font-bold text-primary">{notifMaster.notifCode}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Source Module:</span>
                      <span className="font-semibold text-foreground">{notifMaster.module} &gt; {notifMaster.submodule}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Firing Event:</span>
                      <span className="font-semibold text-foreground">{notifMaster.eventType}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Threshold Condition:</span>
                      <span className="font-mono font-bold text-primary">Due Date &le; 3 Days (Daily Evaluation)</span>
                    </div>
                  </div>
                </div>

                {/* 3. Priority & Governance */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    3. Dispatch Priority & Owner
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">System Priority:</span>
                      <span className="rounded bg-rose-500/10 text-rose-600 px-2 py-0.5 text-[10px] font-bold">
                        {notifMaster.priority} Priority / {notifMaster.severity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Notification Owner:</span>
                      <span className="font-semibold text-foreground">{notifMaster.owner}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Validity Period:</span>
                      <span className="font-mono text-muted-foreground">{notifMaster.effectiveFrom} to {notifMaster.effectiveTo}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Do-Not-Disturb Override:</span>
                      <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                        Enabled for Critical Overdue
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATES WORKSPACE */}
          {activeTab === "templates" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Active Gateways</span>
                  <div className="text-xl font-bold font-mono text-foreground">3 Live</div>
                  <p className="text-[10px] text-emerald-600 font-medium">Email, In-App, SMS</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Delivery Success</span>
                  <div className="text-xl font-bold font-mono text-foreground">99.4%</div>
                  <p className="text-[10px] text-blue-600 font-medium">Over last 30 days</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Templates Configured</span>
                  <div className="text-xl font-bold font-mono text-foreground">{templatesList.length} Templates</div>
                  <p className="text-[10px] text-purple-600 font-medium">Multi-lingual enabled</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Avg Dispatch Latency</span>
                  <div className="text-xl font-bold font-mono text-foreground">&lt; 350ms</div>
                  <p className="text-[10px] text-amber-600 font-medium">Real-time queue</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="text-xs font-bold text-foreground">Notification Message Templates ({templatesList.length})</h4>
                  <button
                    onClick={() => setShowAddTemplateModal(true)}
                    className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
                  >
                    + Create Template
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                        <th className="py-2.5 px-3">Template Code</th>
                        <th className="py-2.5 px-3">Template Name</th>
                        <th className="py-2.5 px-3">Channel Gateway</th>
                        <th className="py-2.5 px-3">Subject / Body Snippet</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-[11px]">
                      {templatesList.map((tpl) => (
                        <tr key={tpl.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2 px-3 font-mono font-bold text-primary">{tpl.code}</td>
                          <td className="py-2 px-3 font-semibold text-foreground">{tpl.name}</td>
                          <td className="py-2 px-3 text-muted-foreground">{tpl.channel}</td>
                          <td className="py-2 px-3 font-mono text-muted-foreground truncate max-w-[240px]">{tpl.subject}</td>
                          <td className="py-2 px-3">
                            <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                              {tpl.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setTemplatesList((prev) => prev.filter((t) => t.id !== tpl.id));
                                showNotification(`Template ${tpl.code} removed.`);
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

          {/* AUDIENCE & ESCALATION WORKSPACE */}
          {activeTab === "audience" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                  Target Audience Resolution Rules
                </h4>

                <div className="space-y-2 text-xs">
                  {AUDIENCE_SUMMARY_DATA.map((aud) => (
                    <div key={aud.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/15">
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground">{aud.rule}</span>
                        <p className="text-muted-foreground text-[11px]">Type: {aud.type} &middot; Dynamic resolution target</p>
                      </div>
                      <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded text-xs">
                        ~{aud.count} recipients
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                  Multi-Tier Escalation Path Matrix
                </h4>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="p-3 rounded-lg border border-border bg-muted/10 space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Stage 1 (Immediate)</span>
                    <p className="text-xs font-bold text-foreground">Direct Assignee / Invoice Owner</p>
                    <p className="text-[11px] text-muted-foreground">Delivered via In-App & Email</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/10 space-y-1">
                    <span className="text-[10px] font-bold text-amber-600 uppercase">Stage 2 (+24 Hours Inactive)</span>
                    <p className="text-xs font-bold text-foreground">Department Lead / Approver</p>
                    <p className="text-[11px] text-muted-foreground">High priority Email & SMS reminder</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/10 space-y-1">
                    <span className="text-[10px] font-bold text-rose-600 uppercase">Stage 3 (+48 Hours Overdue)</span>
                    <p className="text-xs font-bold text-foreground">Finance Director / Admin</p>
                    <p className="text-[11px] text-muted-foreground">Direct escalation alert & audit flag</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DISPATCH LOGS WORKSPACE */}
          {activeTab === "logs" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-bold text-foreground">Live Dispatch Queue & Delivery Audit Trail</h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newLog = {
                      id: `NTF-000${Math.floor(1000 + Math.random() * 9000)}`,
                      recipient: "Self (Current User)",
                      channel: "In-App",
                      event: "Test Trigger Dispatch",
                      status: "Delivered",
                      sentAt: "Just now",
                    };
                    setDispatchLogs((prev) => [newLog, ...prev]);
                    showNotification("Test notification dispatched successfully.");
                  }}
                  className="px-3 py-1 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  ⚡ Send Test Alert
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2 px-2">Dispatch ID</th>
                      <th className="py-2 px-2">Recipient</th>
                      <th className="py-2 px-2">Gateway Channel</th>
                      <th className="py-2 px-2">Trigger Event</th>
                      <th className="py-2 px-2">Delivery Status</th>
                      <th className="py-2 px-2 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-[11px]">
                    {dispatchLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-2 font-mono font-bold text-primary">{log.id}</td>
                        <td className="py-2 px-2 font-semibold text-foreground">{log.recipient}</td>
                        <td className="py-2 px-2 text-muted-foreground">{log.channel}</td>
                        <td className="py-2 px-2 text-foreground">{log.event}</td>
                        <td className="py-2 px-2">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[10px] font-bold border",
                              log.status === "Delivered" || log.status === "Read"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            )}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-muted-foreground">{log.sentAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* --- CREATE TEMPLATE MODAL --- */}
        {showAddTemplateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Create Notification Template</h3>
                </div>
                <button onClick={() => setShowAddTemplateModal(false)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Template Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. SHIP-DISPATCH-EML"
                    value={newTemplateForm.code}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, code: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Template Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Shipment Dispatch Notice"
                    value={newTemplateForm.name}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Channel Gateway</label>
                  <select
                    value={newTemplateForm.channel}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, channel: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                  >
                    <option value="Email">Email</option>
                    <option value="In-App">In-App</option>
                    <option value="SMS">SMS</option>
                    <option value="Push">Push Notification</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Subject / Body Template *</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Shipment {{shipment_id}} has been dispatched to {{customer}}."
                    value={newTemplateForm.subject}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, subject: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground font-mono resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddTemplateModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newTemplateForm.name || !newTemplateForm.code || !newTemplateForm.subject) {
                      alert("Please fill in all template fields.");
                      return;
                    }
                    setTemplatesList((prev) => [
                      ...prev,
                      {
                        id: `TMP-${prev.length + 1}`,
                        name: newTemplateForm.name,
                        code: newTemplateForm.code.toUpperCase(),
                        channel: newTemplateForm.channel,
                        subject: newTemplateForm.subject,
                        status: "Active",
                      },
                    ]);
                    setShowAddTemplateModal(false);
                    showNotification(`Template ${newTemplateForm.code.toUpperCase()} created successfully.`);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
                >
                  Save Template
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
            Last Modified: <span className="font-sans font-semibold text-foreground">15 Apr 2024 11:20 AM</span> by <span className="font-sans font-semibold text-foreground">Neha Kapoor</span> | Created By: <span className="font-sans font-semibold text-foreground">Amit Verma</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
