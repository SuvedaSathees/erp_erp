import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { CrmManagementTabBar } from "@/components/erp/CrmManagementTabBar";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  FileCheck,
  Clock,
  CheckCircle2,
  Calendar,
  Save,
  Printer,
  Mail,
  Plus,
  ShieldCheck,
  UserCheck,
  Search,
  Activity,
  Layers,
  HelpCircle,
  TrendingDown,
  RotateCcw,
} from "lucide-react";

export const Route = createFileRoute("/management/crm-management/complaint-management")({
  head: () => ({
    meta: [
      { title: "Complaint Management · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Manage customer complaints, root cause analysis (5-Why RCA), CAPA tracking, SLA escalation, and resolution workflows.",
      },
    ],
  }),
  component: ComplaintManagementPage,
});

interface ComplaintRecord {
  id: string;
  complaintNumber: string;
  customerName: string;
  contactPerson: string;
  phone: string;
  email: string;
  productName: string;
  orderNumber: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Under Investigation" | "CAPA In Progress" | "Resolved" | "Closed";
  category: string;
  assignedEngineer: string;
  loggedDate: string;
  targetResolutionDate: string;
  rcaCategory: string;
  rootCauseSummary: string;
  capaAction: string;
  capaProgress: number;
}

const INITIAL_COMPLAINTS: ComplaintRecord[] = [
  {
    id: "CMP-001",
    complaintNumber: "CMP-2024-0018",
    customerName: "Tata Steel Ltd.",
    contactPerson: "Amit Verma",
    phone: "+91 98765 43210",
    email: "amit.verma@tatasteel.com",
    productName: "High-Capacity PLC Panel Series-X",
    orderNumber: "ORD-2024-0089",
    severity: "Critical",
    status: "CAPA In Progress",
    category: "Hardware Overheating",
    assignedEngineer: "Rajesh Kulkarni",
    loggedDate: "12 May 2024",
    targetResolutionDate: "18 May 2024",
    rcaCategory: "Component Defect (Diode Thermal Dissipation)",
    rootCauseSummary: "Secondary cooling fan RPM throttled under 45°C ambient load causing thermal cutoff trips.",
    capaAction: "Replace auxiliary thermal sync and upgrade firmware sensor calibration curve to v2.4.",
    capaProgress: 75,
  },
  {
    id: "CMP-002",
    complaintNumber: "CMP-2024-0019",
    customerName: "Bharat Forge Ltd.",
    contactPerson: "Priya Nair",
    phone: "+91 98111 22334",
    email: "priya.n@bharatforge.com",
    productName: "Industrial Sensor Hub v3",
    orderNumber: "ORD-2024-0094",
    severity: "Medium",
    status: "Under Investigation",
    category: "Communication Timeout",
    assignedEngineer: "Sandeep Iyer",
    loggedDate: "14 May 2024",
    targetResolutionDate: "20 May 2024",
    rcaCategory: "Network Protocol Latency",
    rootCauseSummary: "Modbus TCP packets dropped during heavy RF noise interference.",
    capaAction: "Install shielded CAT6A STP cabling and ferrite core clamp on input bus.",
    capaProgress: 35,
  },
];

function ComplaintManagementPage() {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>(INITIAL_COMPLAINTS);
  const [selectedId, setSelectedId] = useState<string>("CMP-001");
  const [activeTab, setActiveTab] = useState<"investigation" | "rca" | "capa" | "sla" | "history">("investigation");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const current = complaints.find((c) => c.id === selectedId) || complaints[0];
  const [formState, setFormState] = useState<ComplaintRecord>(current);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const item = complaints.find((c) => c.id === id);
    if (item) setFormState(item);
  };

  return (
    <AppShell
      title="Complaint Management"
      breadcrumb="Management > CRM Management > Complaint Management"
      description="Manage customer complaints, root cause analysis (5-Why RCA), CAPA tracking, SLA escalation, and resolution workflows."
      tabs={<CrmManagementTabBar />}
    >
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Top Header Action Bar */}
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs flex-wrap">
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500/10 text-rose-600 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900 whitespace-nowrap font-mono">{formState.complaintNumber}</h2>
                <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-300 whitespace-nowrap">
                  {formState.severity}
                </span>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200 whitespace-nowrap">
                  ● {formState.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 whitespace-nowrap">
                Customer: <span className="font-semibold text-slate-800">{formState.customerName}</span> | Product: <span className="font-medium text-slate-700">{formState.productName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <select
              value={selectedId}
              onChange={(e) => handleSelect(e.target.value)}
              className="h-8 rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs"
            >
              {complaints.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.complaintNumber} - {c.customerName}
                </option>
              ))}
            </select>

            <button
              onClick={() => window.print()}
              className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Printer className="h-3.5 w-3.5 text-slate-600" />
              <span>Print</span>
            </button>

            <button
              onClick={() => showNotification("CAPA report emailed to " + formState.customerName)}
              className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Mail className="h-3.5 w-3.5 text-blue-600" />
              <span>Send Email</span>
            </button>

            <button
              onClick={() => {
                setComplaints((prev) => prev.map((c) => (c.id === formState.id ? formState : c)));
                showNotification(`Complaint ${formState.complaintNumber} saved successfully.`);
              }}
              className="h-8 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Record</span>
            </button>
          </div>
        </div>

        {/* 1. Master Complaint Header & Snapshot */}
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-9 rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> Complaint Master Parameters
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div>
                <label className="text-muted-foreground block font-medium">Customer Account *</label>
                <input
                  type="text"
                  value={formState.customerName}
                  onChange={(e) => setFormState({ ...formState, customerName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground block font-medium">Contact Person *</label>
                <input
                  type="text"
                  value={formState.contactPerson}
                  onChange={(e) => setFormState({ ...formState, contactPerson: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground block font-medium">Order Number</label>
                <input
                  type="text"
                  value={formState.orderNumber}
                  onChange={(e) => setFormState({ ...formState, orderNumber: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-mono text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground block font-medium">Assigned Lead Engineer *</label>
                <input
                  type="text"
                  value={formState.assignedEngineer}
                  onChange={(e) => setFormState({ ...formState, assignedEngineer: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground block font-medium">Severity *</label>
                <select
                  value={formState.severity}
                  onChange={(e) => setFormState({ ...formState, severity: e.target.value as any })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="text-muted-foreground block font-medium">Investigation Status *</label>
                <select
                  value={formState.status}
                  onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                >
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="CAPA In Progress">CAPA In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="text-muted-foreground block font-medium">Date Logged</label>
                <input
                  type="text"
                  readOnly
                  value={formState.loggedDate}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground font-mono"
                />
              </div>

              <div>
                <label className="text-muted-foreground block font-medium">Target SLA Resolution</label>
                <input
                  type="text"
                  value={formState.targetResolutionDate}
                  onChange={(e) => setFormState({ ...formState, targetResolutionDate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground font-mono"
                />
              </div>
            </div>
          </div>

          {/* Right 3 columns: CAPA & Health Side Card */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">CAPA Health Meter</h4>
                <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                  {formState.severity}
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Complaint Age</span>
                  <span className="font-bold text-foreground font-mono">3 Days (Active)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">SLA Threshold</span>
                  <span className="font-bold text-foreground font-mono">6 Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Repeat Issue Risk</span>
                  <span className="font-bold text-emerald-600 font-mono">Low (0.04%)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">CAPA Completion</span>
                <span className="text-[10px] text-emerald-600 font-semibold">On Track</span>
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
                    strokeDashoffset={2 * Math.PI * 19 * (1 - formState.capaProgress / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold font-mono text-emerald-600">{formState.capaProgress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs (No Overview) */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "investigation", label: "Investigation & Defect Analysis", icon: Search },
              { key: "rca", label: "5-Why Root Cause Analysis (RCA)", icon: Layers },
              { key: "capa", label: "Corrective & Preventive Action (CAPA)", icon: CheckCircle2 },
              { key: "sla", label: "SLA Tracker & Escalation Tree", icon: Clock },
              { key: "history", label: "Lifecycle Audit Log", icon: Activity },
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

          {/* TAB 1: INVESTIGATION */}
          {activeTab === "investigation" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs text-xs">
              <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                Defect Symptoms & Engineering Diagnosis
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-muted-foreground font-semibold">Reported Issue Summary</label>
                  <p className="bg-muted/20 p-3 rounded-lg border border-border leading-relaxed text-foreground">
                    PLC Controller throws E-402 thermal alarm during continuous shift operation exceeding 42°C in the factory floor cabinet. Panel trips every 4.5 hours.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-muted-foreground font-semibold">Field Diagnostic Log</label>
                  <p className="bg-muted/20 p-3 rounded-lg border border-border leading-relaxed text-foreground font-mono text-[11px]">
                    [DIAG] Thermal sensor diode T2 reads 82.4°C while heatsink fan runs at only 1200 RPM instead of standard 2800 RPM. Firmware throttling bug identified.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RCA */}
          {activeTab === "rca" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs text-xs">
              <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                5-Why Root Cause Breakdown
              </h4>
              <div className="space-y-2.5">
                {[
                  { why: "Why 1: Why did the PLC panel trip?", ans: "Thermal sensor triggered emergency power cutoff to prevent board burnout." },
                  { why: "Why 2: Why did temperature rise above threshold?", ans: "Auxiliary cooling fan did not ramp up to 2800 RPM." },
                  { why: "Why 3: Why did fan RPM stay throttled at 1200 RPM?", ans: "Firmware sensor polling loop dropped pulse-width modulation (PWM) scaling signals." },
                  { why: "Why 4: Why was PWM scaling signal dropped?", ans: "Firmware v2.1 code table lacked ambient offset calibration." },
                  { why: "Why 5 (Root Cause): Why was calibration omitted?", ans: "High ambient climate test suite was missing in v2.1 automated regression release." },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-muted/20 rounded-lg border border-border space-y-1">
                    <span className="font-bold text-primary block">{item.why}</span>
                    <span className="text-foreground">{item.ans}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CAPA */}
          {activeTab === "capa" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs text-xs">
              <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                Corrective & Preventive Action Workflow
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg border border-border bg-muted/15 space-y-2">
                  <span className="font-bold text-foreground block">Corrective Action (Immediate)</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Flash firmware patch v2.4 via remote OTA tool to recalibrate PWM fan curves and replace thermal sink on customer unit.
                  </p>
                  <span className="inline-block rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                    Completed (15 May 2024)
                  </span>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/15 space-y-2">
                  <span className="font-bold text-foreground block">Preventive Action (Long-Term)</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Add 50°C climatic chamber testing cycle into mandatory pre-dispatch factory acceptance checklist for all Series-X units.
                  </p>
                  <span className="inline-block rounded bg-blue-500/10 text-blue-600 px-2 py-0.5 text-[10px] font-bold">
                    Implemented in QA Pipeline
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SLA */}
          {activeTab === "sla" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs text-xs">
              <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                SLA Milestones & Escalation Hierarchy
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-muted/15 rounded-lg border border-border">
                  <span className="text-[10px] text-muted-foreground block">Initial Acknowledgment</span>
                  <span className="font-bold text-foreground">15 Mins (Met)</span>
                </div>
                <div className="p-3 bg-muted/15 rounded-lg border border-border">
                  <span className="text-[10px] text-muted-foreground block">Engineer Dispatched</span>
                  <span className="font-bold text-foreground">4 Hours (Met)</span>
                </div>
                <div className="p-3 bg-muted/15 rounded-lg border border-border">
                  <span className="text-[10px] text-muted-foreground block">Root Cause Identified</span>
                  <span className="font-bold text-foreground">24 Hours (Met)</span>
                </div>
                <div className="p-3 bg-muted/15 rounded-lg border border-border">
                  <span className="text-[10px] text-muted-foreground block">Target Final Resolution</span>
                  <span className="font-bold text-emerald-600">6 Days Total (On Track)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HISTORY */}
          {activeTab === "history" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs text-xs">
              <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                Audit Trail & Activity Log
              </h4>
              <div className="space-y-2">
                {[
                  { date: "15 May 2024, 02:30 PM", user: "Rajesh Kulkarni", msg: "OTA Firmware v2.4 patch flashed successfully. Ambient temperature stable at 38°C." },
                  { date: "13 May 2024, 11:00 AM", user: "Sandeep Iyer", msg: "5-Why RCA completed and reviewed with QA Lead." },
                  { date: "12 May 2024, 09:15 AM", user: "Amit Verma (Tata Steel)", msg: "Complaint logged via customer portal." },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-muted/15 rounded-lg border border-border flex justify-between items-center text-[11px]">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-foreground">{item.user}</span>
                      <p className="text-muted-foreground">{item.msg}</p>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Classification Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-[11px] text-muted-foreground font-mono">
          <div>
            MAICW: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
            <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
            <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
            <span className="text-blue-600 font-bold">C</span> (Calculated) |{" "}
            <span className="text-rose-500 font-bold">W</span> (Workflow)
          </div>
          <div>
            Complaint Workflow Version 2.4 · Magnertia Quality & Support Core
          </div>
        </div>
      </div>
    </AppShell>
  );
}
