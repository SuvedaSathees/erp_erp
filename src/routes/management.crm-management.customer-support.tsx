import { useState, useMemo } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { CrmManagementTabBar } from "@/components/erp/CrmManagementTabBar";
import { cn } from "@/lib/utils";
import {
  LifeBuoy,
  Printer,
  Mail,
  FileText,
  Save,
  Plus,
  MoreHorizontal,
  ChevronRight,
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  Layers,
  ShieldCheck,
  Paperclip,
  Activity,
  Award,
  RefreshCw,
  Copy,
  Share2,
  Trash2,
  Edit,
  Download,
  Send,
  UserCheck,
  Building2,
  Percent,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  Wrench,
  HelpCircle,
  Star,
  UserPlus,
  PieChart as PieIcon,
  MessageSquare,
  Laptop,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";

export const Route = createFileRoute("/management/crm-management/customer-support")({
  head: () => ({
    meta: [
      { title: "Customer Support Form · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Customer Support Form - Central CRM record for managing customer support tickets, diagnosis, parts & service replacement, SLA countdown, resolution, and CSAT feedback.",
      },
    ],
  }),
  component: CustomerSupportPage,
});

// --- Types & Interfaces ---

export type TicketType =
  | "Technical Support"
  | "Complaint"
  | "Service Request"
  | "Product Issue"
  | "Installation Support"
  | "Warranty Claim"
  | "AMC Support"
  | "Billing Query"
  | "Delivery Query"
  | "Software Support"
  | "Hardware Support"
  | "Maintenance Request";

export type TicketStatus =
  | "In Progress"
  | "New"
  | "Assigned"
  | "Acknowledged"
  | "Under Diagnosis"
  | "Action in Progress"
  | "Resolved"
  | "Customer Confirmation"
  | "Closed"
  | "On Hold"
  | "Cancelled";

export interface SupportTicketRecord {
  id: string;
  ticketNumber: string;
  ticketType: TicketType;
  status: TicketStatus;
  ticketSubject: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  customerName: string;
  contactPerson: string;
  accountName: string;
  customerOrderNumber: string;
  productName: string;
  serialNumber: string;
  warrantyStatus: "Under Warranty" | "Expired" | "Out of Warranty" | "AMC Covered";
  supportOwner: { name: string; avatar: string; email: string };
  supportTeam: string;
  branch: string;
  createdDate: string;
  expectedResolution: string;
  source: string;
  customerPriority: string;
  description: string;

  // Customer details
  customerType: string;
  industry: string;
  email: string;
  mobile: string;
  serviceAddress: string;
  customerAccountOwner: string;
  creditLimit: number;
  outstandingBalance: number;

  // Classification & Severity
  issueCategory: string;
  issueSubcategory: string;
  productCategory: string;
  failureType: string;
  issueSource: string;
  rootArea: string;
  customerImpact: string;
  recurrence: boolean;
  severity: string;
  businessImpact: string;
  safetyImpact: string;
  financialImpact: number;
  urgencyRating: number;
  priorityScore: number;

  // SLA
  slaPolicy: string;
  responseSla: string;
  resolutionSla: string;
  slaStartTime: string;
  responseDue: string;
  resolutionDue: string;
  slaStatus: "On Track" | "Breached" | "Met";
  timePassed: string;
  timeLeft: string;

  // Feedback
  satisfactionScore: number; // e.g. 4.2
  feedbackQuote: string;
}

const INITIAL_TICKET: SupportTicketRecord = {
  id: "SUP-001",
  ticketNumber: "SUP-2024-000523",
  ticketType: "Technical Support",
  status: "In Progress",
  ticketSubject: "EV Charger not powering on",
  priority: "High",
  customerName: "Acme Automation Pvt. Ltd.",
  contactPerson: "Ankit Verma",
  accountName: "Acme Automation Pvt. Ltd.",
  customerOrderNumber: "SO-2024-000256",
  productName: "Magnertia 60kW DC Fast Charger",
  serialNumber: "MAG60KW-23-00048",
  warrantyStatus: "Under Warranty",
  supportOwner: { name: "Vikram Singh", avatar: "VS", email: "vikram.singh@magnertia.com" },
  supportTeam: "Level 2 Support",
  branch: "Mumbai Branch",
  createdDate: "16 Apr 2024 10:35 AM",
  expectedResolution: "20 Apr 2024 06:00 PM",
  source: "Phone Call",
  customerPriority: "Premium",
  description: "Charger display not turning ON. Power LED blinks but screen remains off.",

  customerType: "Corporate",
  industry: "Manufacturing",
  email: "ankit.verma@acmeauto.com",
  mobile: "+91 98765 43210",
  serviceAddress: "Acme Automation Pvt. Ltd., Unit No. 12, MIDC Industrial Area, Andheri (E), Mumbai - 400093, Maharashtra, India.",
  customerAccountOwner: "Rahul Sharma",
  creditLimit: 500000,
  outstandingBalance: 127500,

  issueCategory: "Hardware",
  issueSubcategory: "Power Supply",
  productCategory: "DC Fast Charger",
  failureType: "Power Issue",
  issueSource: "Customer Call",
  rootArea: "Power Module",
  customerImpact: "High",
  recurrence: false,
  severity: "S2 - Major",
  businessImpact: "High",
  safetyImpact: "Low",
  financialImpact: 25000,
  urgencyRating: 4,
  priorityScore: 82,

  slaPolicy: "Standard 24x7",
  responseSla: "2 Hours",
  resolutionSla: "24 Hours",
  slaStartTime: "16 Apr 2024 10:35 AM",
  responseDue: "16 Apr 2024 12:35 PM",
  resolutionDue: "17 Apr 2024 10:35 AM",
  slaStatus: "On Track",
  timePassed: "1h 45m",
  timeLeft: "22h 50m",

  satisfactionScore: 4.2,
  feedbackQuote: "Support team responded quickly and are working on the issue.",
};

const RECENT_ACTIVITIES = [
  { time: "16 Apr 2024 12:20 PM", type: "Phone Call", desc: "Initial issue logged by customer", by: "Ankit Verma", outcome: "Information Captured", next: "Ticket Created", status: "Completed" },
  { time: "16 Apr 2024 12:45 PM", type: "Assigned", desc: "Ticket assigned to Level 2 Support", by: "System", outcome: "Assigned to Vikram Singh", next: "Acknowledge", status: "Completed" },
  { time: "16 Apr 2024 01:10 PM", type: "Acknowledged", desc: "Ticket acknowledged to customer", by: "Vikram Singh", outcome: "Customer Notified", next: "Start Diagnosis", status: "Completed" },
  { time: "16 Apr 2024 02:15 PM", type: "Diagnosis", desc: "Remote access and log analysis", by: "Vikram Singh", outcome: "Issue Identified", next: "Fix Power Module", status: "In Progress" },
  { time: "16 Apr 2024 03:00 PM", type: "Note Added", desc: "Replacement part required", by: "Vikram Singh", outcome: "Part Identified", next: "Raise Part Request", status: "In Progress" },
];

const PARTS_SERVICE_DATA = [
  { part: "Power Supply Module", partNo: "PSM-60KW-01", reqQty: 1, issuedQty: 0, status: "Pending", color: "bg-amber-100 text-amber-800" },
  { part: "Control Board", partNo: "CTRL-60KW-02", reqQty: 0, issuedQty: 0, status: "-", color: "bg-slate-100 text-slate-600" },
  { part: "Service Visit", partNo: "FSE-01", reqQty: 1, issuedQty: 0, status: "Scheduled", color: "bg-blue-100 text-blue-800" },
];

const SLA_PERFORMANCE_DONUT = [
  { name: "SLA Met", value: 480, pct: "92%", color: "#059669" },
  { name: "SLA Breach", value: 32, pct: "6%", color: "#e11d48" },
  { name: "On Track", value: 11, pct: "2%", color: "#0284c7" },
];

const LINKED_DOCUMENTS = [
  { name: "Charger_Image_01.jpg", date: "16 Apr 2024" },
  { name: "System_Log_16-04-2024.txt", date: "16 Apr 2024" },
  { name: "Installation_Report.pdf", date: "10 Mar 2024" },
  { name: "Warranty_Certificate.pdf", date: "10 Mar 2024" },
];

export function CustomerSupportPage() {
  const [ticket, setTicket] = useState<SupportTicketRecord>(INITIAL_TICKET);

  // Modals
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isAddPartOpen, setIsAddPartOpen] = useState(false);
  const [isEscalateOpen, setIsEscalateOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleInputChange = (field: keyof SupportTicketRecord, value: any) => {
    setTicket((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveTicket = () => {
    showNotification(`Support Ticket ${ticket.ticketNumber} saved successfully!`);
  };

  return (
    <AppShell
      title="Customer Support Form"
      breadcrumb="Management > CRM Management > Customer Support > Customer Support Form"
      description="The Customer Support Form is the central CRM record for managing customer issues, service requests, complaints, technical support, warranty cases, and service communication from ticket creation → classification → assignment → diagnosis → resolution → customer confirmation → closure → feedback → analytics."
      tabs={<CrmManagementTabBar />}
    >
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col min-h-screen text-slate-800 space-y-6">
        {/* Support Ticket Master Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-3 flex-nowrap overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap">Support Ticket Master Form</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap font-mono">
                {ticket.ticketNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-300 whitespace-nowrap flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 inline-block" />
                <span>{ticket.status}</span>
              </span>
            </div>

            {/* Top Toolbar Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
              <button
                onClick={() => setIsNewTicketOpen(true)}
                className="h-8 px-3 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Ticket</span>
              </button>

              <button
                onClick={handleSaveTicket}
                className="h-8 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>

              <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1 shrink-0 whitespace-nowrap">
                <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs shadow-2xs shrink-0">
                  RS
                </div>
                <div className="text-left hidden sm:block whitespace-nowrap">
                  <div className="text-xs font-semibold text-slate-800 leading-none">Rahul Sharma</div>
                  <div className="text-[10px] text-slate-500">Support Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Support Ticket Master (Matching Mockup Image) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">1. Support Ticket Master</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">Customer Support Ticket Master</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Ticket Number *</label>
              <input
                type="text"
                value={ticket.ticketNumber}
                onChange={(e) => handleInputChange("ticketNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Ticket Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={ticket.ticketType}
                onChange={(e) => handleInputChange("ticketType", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Technical Support">Technical Support</option>
                <option value="Complaint">Complaint</option>
                <option value="Service Request">Service Request</option>
                <option value="Product Issue">Product Issue</option>
                <option value="Warranty Claim">Warranty Claim</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Ticket Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={ticket.status}
                onChange={(e) => handleInputChange("status", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-amber-700 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="In Progress">In Progress</option>
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Ticket Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={ticket.ticketSubject}
                onChange={(e) => handleInputChange("ticketSubject", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Priority <span className="text-rose-500">*</span>
              </label>
              <select
                value={ticket.priority}
                onChange={(e) => handleInputChange("priority", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-rose-600 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="High">● High</option>
                <option value="Critical">● Critical</option>
                <option value="Medium">● Medium</option>
                <option value="Low">● Low</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer *</label>
              <input
                type="text"
                value={ticket.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Contact *</label>
              <input
                type="text"
                value={ticket.contactPerson}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Account</label>
              <input
                type="text"
                value={ticket.accountName}
                onChange={(e) => handleInputChange("accountName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer Order</label>
              <input
                type="text"
                value={ticket.customerOrderNumber}
                onChange={(e) => handleInputChange("customerOrderNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Product / Service</label>
              <input
                type="text"
                value={ticket.productName}
                onChange={(e) => handleInputChange("productName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Serial Number</label>
              <input
                type="text"
                value={ticket.serialNumber}
                onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Warranty Status</label>
              <span className="w-full h-8 px-2.5 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded font-bold flex items-center gap-1.5">
                ● {ticket.warrantyStatus}
              </span>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Support Owner *</label>
              <div className="flex items-center gap-2 h-8 px-2 bg-white border border-slate-300 rounded">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">
                  VS
                </div>
                <span className="font-semibold text-slate-800 truncate">{ticket.supportOwner.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Support Team</label>
              <input
                type="text"
                value={ticket.supportTeam}
                onChange={(e) => handleInputChange("supportTeam", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Branch</label>
              <input
                type="text"
                value={ticket.branch}
                onChange={(e) => handleInputChange("branch", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Created Date</label>
              <input
                type="text"
                disabled
                value={ticket.createdDate}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-200 rounded font-medium text-slate-600"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Expected Resolution *</label>
              <input
                type="text"
                value={ticket.expectedResolution}
                onChange={(e) => handleInputChange("expectedResolution", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-blue-700"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Source</label>
              <input
                type="text"
                value={ticket.source}
                onChange={(e) => handleInputChange("source", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer Priority</label>
              <input
                type="text"
                value={ticket.customerPriority}
                onChange={(e) => handleInputChange("customerPriority", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div className="col-span-1 lg:col-span-5">
              <label className="block text-slate-500 font-semibold mb-1">Description</label>
              <input
                type="text"
                value={ticket.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Main Support Ticket Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left & Center Columns (Sections 2 to 9) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Service Ticket & Live SLA Countdown Banner (Distinct Service Context) */}
                  <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LifeBuoy className="h-4 w-4 text-blue-600 shrink-0" />
                        <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                          Service Ticket SLA Engine & Field Dispatch: LIVE
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ● SLA On Track (22h 50m Left)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="bg-white p-2 rounded border border-blue-200">
                        <span className="text-slate-500 block text-[10px]">Response SLA</span>
                        <span className="font-bold text-emerald-700">✓ Met in 1h 45m</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-blue-200">
                        <span className="text-slate-500 block text-[10px]">Resolution Due</span>
                        <span className="font-bold text-slate-800">17 Apr 10:35 AM</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-blue-200">
                        <span className="text-slate-500 block text-[10px]">Technician Assigned</span>
                        <span className="font-bold text-blue-700">Vikram Singh (L2)</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-blue-200">
                        <span className="text-slate-500 block text-[10px]">Spare Part Status</span>
                        <span className="font-bold text-amber-700">1 Part Pending</span>
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 1: Customer Details, Issue Classification, Priority & Severity, SLA Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 2: Customer Details */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        2. Customer Details
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 font-medium block">Customer Type</span>
                          <span className="font-semibold text-slate-800">{ticket.customerType}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Industry</span>
                          <span className="font-semibold text-slate-800">{ticket.industry}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Email</span>
                          <span className="font-semibold text-blue-700">{ticket.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Mobile</span>
                          <span className="font-semibold text-slate-800">{ticket.mobile}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs border-t border-slate-200 pt-2">
                        <div>
                          <span className="text-slate-500 font-semibold">Service Address:</span>
                          <p className="font-medium text-slate-700 text-[11px] leading-tight">{ticket.serviceAddress}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-slate-500 font-semibold">Customer Account Owner</span>
                          <div className="flex items-center gap-1.5">
                            <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[9px]">
                              RS
                            </div>
                            <span className="font-bold text-slate-800">{ticket.customerAccountOwner}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2 text-xs">
                        <div>
                          <span className="text-slate-500 font-medium block">Credit Limit</span>
                          <span className="font-mono font-bold text-slate-800">₹ {(ticket.creditLimit).toLocaleString("en-IN")}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Outstanding Balance</span>
                          <span className="font-mono font-bold text-rose-600">₹ {(ticket.outstandingBalance).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Issue Classification */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        3. Issue Classification
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 font-medium block">Issue Category</span>
                          <span className="font-bold text-slate-800">{ticket.issueCategory}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Issue Subcategory</span>
                          <span className="font-semibold text-slate-800">{ticket.issueSubcategory}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Product Category</span>
                          <span className="font-semibold text-slate-800">{ticket.productCategory}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Failure Type</span>
                          <span className="font-semibold text-slate-800">{ticket.failureType}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Issue Source</span>
                          <span className="font-semibold text-slate-800">{ticket.issueSource}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Root Area</span>
                          <span className="font-semibold text-slate-800">{ticket.rootArea}</span>
                        </div>
                      </div>
                      <div className="border-t border-slate-200 pt-2 text-xs">
                        <span className="text-slate-500 font-semibold">Remarks:</span>
                        <p className="font-medium text-slate-800 bg-white p-1 border rounded mt-0.5">
                          Power LED blinks, display not turning ON
                        </p>
                      </div>
                    </div>

                    {/* Card 4: Priority & Severity */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        4. Priority & Severity
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-500 font-medium block">Priority</span>
                          <span className="font-extrabold text-rose-600">● {ticket.priority}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Severity</span>
                          <span className="font-bold text-amber-700">{ticket.severity}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Business Impact</span>
                          <span className="font-semibold text-slate-800">{ticket.businessImpact}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Customer Impact</span>
                          <span className="font-semibold text-slate-800">{ticket.customerImpact}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Safety Impact</span>
                          <span className="font-semibold text-slate-800">{ticket.safetyImpact}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Financial Impact</span>
                          <span className="font-mono font-bold text-slate-800">₹ {(ticket.financialImpact).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                        <span className="text-slate-600 font-semibold">Urgency</span>
                        <span className="text-amber-500 font-bold">{"★".repeat(ticket.urgencyRating)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-semibold">Priority Score</span>
                        <span className="font-extrabold text-slate-900 text-sm">{ticket.priorityScore}</span>
                      </div>
                    </div>

                    {/* Card 5: SLA Information */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          5. SLA Information
                        </h3>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200">
                          ● {ticket.slaStatus}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">SLA Policy</span>
                          <span className="font-semibold text-slate-800">{ticket.slaPolicy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Response SLA</span>
                          <span className="font-semibold text-slate-800">{ticket.responseSla}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Resolution SLA</span>
                          <span className="font-semibold text-slate-800">{ticket.resolutionSla}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Response Due</span>
                          <span className="font-semibold text-slate-800">{ticket.responseDue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Resolution Due</span>
                          <span className="font-bold text-blue-700">{ticket.resolutionDue}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2 text-center">
                          <div className="bg-slate-100 p-1.5 rounded">
                            <span className="text-[10px] text-slate-500 font-semibold block">Time Passed</span>
                            <span className="font-mono font-bold text-slate-800">{ticket.timePassed}</span>
                          </div>
                          <div className="bg-emerald-50 p-1.5 rounded border border-emerald-200">
                            <span className="text-[10px] text-emerald-700 font-semibold block">Time Left</span>
                            <span className="font-mono font-bold text-emerald-800">{ticket.timeLeft}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 6: Recent Activities Table */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        6. Recent Activities
                      </h3>
                      <button onClick={() => showNotification("Viewing All Activities...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                        View All Activities
                      </button>
                    </div>

                    <div className="w-full">
                      <table className="w-full text-left text-xs border-collapse table-fixed">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
                            <th className="py-2 px-2.5 w-[24%]">Date & Time</th>
                            <th className="py-2 px-2 w-[14%]">Type</th>
                            <th className="py-2 px-2.5 w-[36%]">Description & Next Step</th>
                            <th className="py-2 px-2 w-[14%]">Outcome</th>
                            <th className="py-2 px-2 w-[12%] text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {RECENT_ACTIVITIES.map((act, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2 px-2.5">
                                <div className="text-slate-600 font-mono text-[11px] truncate leading-tight">{act.time}</div>
                              </td>
                              <td className="py-2 px-2">
                                <span className="font-semibold text-slate-800 text-xs">{act.type}</span>
                              </td>
                              <td className="py-2 px-2.5">
                                <div className="font-medium text-slate-800 text-xs truncate leading-tight">{act.desc}</div>
                                <div className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                                  Next: <span className="font-medium text-slate-700">{act.next}</span> · By: <span className="text-slate-600">{act.by}</span>
                                </div>
                              </td>
                              <td className="py-2 px-2">
                                <span className="font-medium text-slate-700 text-xs truncate block">{act.outcome}</span>
                              </td>
                              <td className="py-2 px-2 text-right">
                                <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full inline-block whitespace-nowrap", act.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200")}>
                                  {act.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Grid Row 3: Parts & Service, Resolution, Customer Feedback */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 7: Parts & Service */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          7. Parts & Service
                        </h3>
                        <button
                          onClick={() => setIsAddPartOpen(true)}
                          className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                        >
                          + Add Part
                        </button>
                      </div>
                      <div className="w-full">
                        <table className="w-full text-left text-xs border-collapse table-fixed">
                          <thead>
                            <tr className="text-slate-500 text-[11px] font-semibold border-b border-slate-200">
                              <th className="py-1.5 px-1 w-[48%]">Part / Service</th>
                              <th className="py-1.5 px-1 w-[24%] text-center">Qty (Req/Iss)</th>
                              <th className="py-1.5 px-1 w-[28%] text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {PARTS_SERVICE_DATA.map((p, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2 px-1">
                                  <div className="font-bold text-slate-800 text-xs truncate leading-tight">{p.part}</div>
                                  <div className="font-mono text-[10px] text-slate-400 truncate">{p.partNo}</div>
                                </td>
                                <td className="py-2 px-1 text-center font-mono text-xs text-slate-700">
                                  <span className="font-bold text-slate-900">{p.reqQty}</span>
                                  <span className="text-slate-400"> / </span>
                                  <span className="text-slate-600">{p.issuedQty}</span>
                                </td>
                                <td className="py-2 px-1 text-right">
                                  <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full inline-block whitespace-nowrap", p.color)}>
                                    {p.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Card 8: Resolution */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        8. Resolution
                      </h3>
                      <div className="space-y-1.5">
                        <div>
                          <span className="text-slate-500 font-semibold">Resolution Type</span>
                          <span className="font-bold text-slate-900 block font-mono">Replacement</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold">Resolution Summary</span>
                          <p className="font-medium text-slate-800 bg-white p-1.5 border rounded mt-0.5">
                            Power supply module failed. Replacement required.
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Technician</span>
                          <span className="font-bold text-slate-800">{ticket.supportOwner.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Resolution Status</span>
                          <span className="font-bold text-amber-700">In Progress</span>
                        </div>
                        <button
                          onClick={() => showNotification("Marking Ticket as Resolved...")}
                          className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded shadow-xs cursor-pointer"
                        >
                          Resolve Ticket
                        </button>
                      </div>
                    </div>

                    {/* Card 9: Customer Feedback */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          9. Customer Feedback
                        </h3>
                        <button onClick={() => showNotification("Sending CSAT Survey...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          Request Feedback
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-semibold">Satisfaction Score</span>
                          <span className="text-amber-500 font-bold text-sm">★★★★☆ 4.2 / 5</span>
                        </div>
                        <div className="bg-white p-2 rounded border text-slate-700 italic text-[11px]">
                          "{ticket.feedbackQuote}"
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Submitted On: <span className="font-semibold text-slate-600">Pending final closure</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Sidebar Panels (Matching Mockup Image) */}
                <div className="space-y-6">
                  {/* Ticket Summary Widget (6 Stat Tiles) */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 text-center">
                      Ticket Summary
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200">
                        <div className="text-[10px] text-blue-700 font-semibold">Total Tickets</div>
                        <div className="text-lg font-extrabold text-blue-900">523</div>
                      </div>
                      <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200">
                        <div className="text-[10px] text-emerald-700 font-semibold">Open Tickets</div>
                        <div className="text-lg font-extrabold text-emerald-900">48</div>
                      </div>
                      <div className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200">
                        <div className="text-[10px] text-amber-700 font-semibold">In Progress</div>
                        <div className="text-lg font-extrabold text-amber-900">22</div>
                      </div>
                      <div className="p-2.5 bg-purple-50/60 rounded-lg border border-purple-200">
                        <div className="text-[10px] text-purple-700 font-semibold">Awaiting Response</div>
                        <div className="text-lg font-extrabold text-purple-900">11</div>
                      </div>
                      <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-200">
                        <div className="text-[10px] text-rose-700 font-semibold">Overdue</div>
                        <div className="text-lg font-extrabold text-rose-900">7</div>
                      </div>
                      <div className="p-2.5 bg-teal-50/60 rounded-lg border border-teal-200">
                        <div className="text-[10px] text-teal-700 font-semibold">Resolved Today</div>
                        <div className="text-lg font-extrabold text-teal-900">9</div>
                      </div>
                    </div>
                  </div>

                  {/* SLA Performance Widget (Recharts Donut) */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 text-center">
                      SLA Performance
                    </h3>

                    <div className="flex items-center justify-between gap-2">
                      <div className="w-28 h-28 relative shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={SLA_PERFORMANCE_DONUT}
                              cx="50%"
                              cy="50%"
                              innerRadius={28}
                              outerRadius={44}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {SLA_PERFORMANCE_DONUT.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip formatter={(val: number) => `${val} Tickets`} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                          <span className="text-base font-extrabold text-emerald-700">92%</span>
                          <span className="text-[8px] font-bold text-slate-400">SLA Met</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs w-full">
                        {SLA_PERFORMANCE_DONUT.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px]">
                            <div className="flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-slate-600 font-medium">{item.name}</span>
                            </div>
                            <span className="font-bold text-slate-800">{item.pct}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Panel */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Quick Actions
                    </h3>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => showNotification("Ticket assigned to Senior Diagnostics Engineer.")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <UserPlus className="h-4 w-4 text-blue-600" />
                        <span>Assign Ticket</span>
                      </button>
                      <button
                        onClick={() => showNotification("Activity logged into support thread.")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span>Add Activity</span>
                      </button>
                      <button
                        onClick={() => showNotification("Document upload window active.")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Paperclip className="h-4 w-4 text-indigo-600" />
                        <span>Upload Doc</span>
                      </button>
                      <button
                        onClick={() => showNotification("Field service visit booked for customer site.")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Wrench className="h-4 w-4 text-amber-600" />
                        <span>Schedule Visit</span>
                      </button>
                      <button
                        onClick={() => showNotification("Follow-up task created in maintenance queue.")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <CheckSquare className="h-4 w-4 text-slate-600" />
                        <span>Create Task</span>
                      </button>
                      <button
                        onClick={() => setIsEscalateOpen(true)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <AlertTriangle className="h-4 w-4 text-rose-600" />
                        <span>Escalate Ticket</span>
                      </button>
                    </div>
                  </div>

                  {/* Linked Documents Panel */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Linked Documents
                      </h3>
                      <button onClick={() => showNotification("Viewing All Documents...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                        View All
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      {LINKED_DOCUMENTS.map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200">
                          <div>
                            <div className="font-semibold text-slate-800 text-[11px]">{doc.name}</div>
                            <div className="text-[10px] text-slate-400">{doc.date}</div>
                          </div>
                          <button
                            onClick={() => showNotification(`Downloading ${doc.name}...`)}
                            className="text-primary hover:text-primary/80 p-1 cursor-pointer"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

        {/* MODAL 1: NEW TICKET */}
        {isNewTicketOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900">Log New Support Ticket</h3>
                <button onClick={() => setIsNewTicketOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ticket Subject *</label>
                  <input id="new-tkt-subj" type="text" placeholder="e.g. PLC Communication Error" className="w-full h-8 px-3 border rounded text-xs" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer *</label>
                  <input id="new-tkt-cust" type="text" placeholder="e.g. Acme Automation Pvt. Ltd." className="w-full h-8 px-3 border rounded text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Ticket Type</label>
                    <select id="new-tkt-type" className="w-full h-8 px-3 border rounded text-xs">
                      <option value="Technical Support">Technical Support</option>
                      <option value="Complaint">Complaint</option>
                      <option value="Warranty Claim">Warranty Claim</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                    <select id="new-tkt-prio" className="w-full h-8 px-3 border rounded text-xs font-bold text-rose-600">
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                      <option value="Medium">Medium</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsNewTicketOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const subj = (document.getElementById("new-tkt-subj") as HTMLInputElement)?.value || "New Ticket";
                    const cust = (document.getElementById("new-tkt-cust") as HTMLInputElement)?.value || "Customer";
                    setTicket((prev) => ({
                      ...prev,
                      ticketNumber: `SUP-2024-000${Math.floor(Math.random() * 900 + 100)}`,
                      ticketSubject: subj,
                      customerName: cust,
                      status: "New",
                    }));
                    setIsNewTicketOpen(false);
                    showNotification("New Support Ticket created!");
                  }}
                  className="px-4 py-1.5 text-xs bg-primary text-white font-bold rounded shadow-xs"
                >
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: ESCALATE TICKET */}
        {isEscalateOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  <span>Escalate Ticket Level</span>
                </h3>
                <button onClick={() => setIsEscalateOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Escalate ticket <strong className="text-slate-900">{ticket.ticketNumber}</strong> to Level 3 Engineering Support.
                </p>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason for Escalation *</label>
                  <textarea rows={2} placeholder="Requires Level 3 hardware engineering diagnosis" className="w-full p-2 border rounded text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsEscalateOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setTicket((prev) => ({ ...prev, status: "Escalated - L3" }));
                    setIsEscalateOpen(false);
                    showNotification("Ticket escalated to Level 3 Support!");
                  }}
                  className="px-4 py-1.5 text-xs bg-rose-600 text-white font-bold rounded shadow-xs"
                >
                  Confirm Escalation
                </button>
              </div>
            </div>
          </div>
        )}
        <Outlet />
      </div>
    </AppShell>
  );
}
