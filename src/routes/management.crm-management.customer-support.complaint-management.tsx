import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { CrmManagementTabBar } from "@/components/erp/CrmManagementTabBar";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
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
  Search,
  FileCheck,
  Check,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";

export const Route = createFileRoute("/management/crm-management/customer-support/complaint-management")({
  head: () => ({
    meta: [
      { title: "Complaint Management Form · Customer Support · Magnertia ERP" },
      {
        name: "description",
        content:
          "Complaint Management Form - Structured quality & service complaint process, classification, investigation, 5-Why RCA, CAPA 75% completion donut meter, SLA countdown, CSAT feedback, and complaint summary analytics.",
      },
    ],
  }),
  component: ComplaintManagementPage,
});

// --- Types & Data Interfaces ---

export type ComplaintType =
  | "Product Complaint"
  | "Service Complaint"
  | "Quality Complaint"
  | "Delivery Complaint"
  | "Installation Complaint"
  | "Warranty Complaint"
  | "Billing Complaint"
  | "Technical Complaint"
  | "Communication Complaint"
  | "Support Complaint"
  | "Documentation Complaint"
  | "Safety Complaint"
  | "Regulatory Complaint";

export type ComplaintStatus =
  | "In Progress"
  | "Draft"
  | "Under Review"
  | "Approved"
  | "Investigating"
  | "RCA In Progress"
  | "CAPA Initiated"
  | "Resolved"
  | "Closed"
  | "On Hold"
  | "Cancelled";

export interface ComplaintRecord {
  id: string;
  complaintNumber: string;
  complaintType: ComplaintType;
  status: ComplaintStatus;
  complaintDate: string;
  source: string;
  customerName: string;
  contactPerson: string;
  accountName: string;
  customerOrderNumber: string;
  invoiceNumber: string;
  productName: string;
  serialNumber: string;
  warrantyStatus: string;
  complaintOwner: { name: string; avatar: string; email: string };
  supportTeam: string;
  branch: string;
  expectedResolutionDate: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  severity: string;
  description: string;

  // Classification
  category: string;
  subcategory: string;
  productCategory: string;
  failureType: string;
  processArea: string;
  rootArea: string;
  recurrence: boolean;
  customerImpact: string;
  classificationRemarks: string;

  // Priority & Severity
  businessImpact: string;
  safetyImpact: string;
  regulatoryImpact: string;
  financialImpact: number;
  urgencyRating: number;
  severityScore: number;

  // Investigation Summary
  investigator: { name: string; avatar: string };
  investigationDate: string;
  symptoms: string;
  findings: string;
  testReportFile: string;
  investigationStatus: "Completed" | "In Progress" | "Pending";

  // CAPA Summary
  capaCompletedPct: number; // e.g. 75
  correctiveActionsCompleted: string; // "3/4"
  preventiveActionsCompleted: string; // "2/3"
  overdueActionsCount: number; // 1

  // SLA
  slaPolicy: string;
  slaStatus: "On Track" | "Breached" | "Met";
  responseSla: string;
  slaStartTime: string;
  responseDue: string;
  resolutionDue: string;
  timeElapsed: string;
  timeLeft: string;

  // Next Action
  nextAction: string;
  assignedTo: string;
  nextActionDate: string;
  nextActionPriority: "High" | "Medium" | "Low";

  // Customer Feedback
  satisfactionScore: number; // 4.2
  customerFeedbackText: string;
  improvementSuggestion: string;
  feedbackStatus: "Received" | "Pending" | "Request Sent";
}

const INITIAL_COMPLAINT: ComplaintRecord = {
  id: "CMP-001",
  complaintNumber: "CMP-2024-000256",
  complaintType: "Product Complaint",
  status: "In Progress",
  complaintDate: "16 Apr 2024 10:35 AM",
  source: "Email",
  customerName: "Acme Automation Pvt. Ltd.",
  contactPerson: "Ankit Verma",
  accountName: "Acme Automation Pvt. Ltd.",
  customerOrderNumber: "SO-2024-000256",
  invoiceNumber: "INV-2024-000589",
  productName: "Magnertia 60kW DC Fast Charger",
  serialNumber: "MAG60KW-23-00048",
  warrantyStatus: "Under Warranty",
  complaintOwner: { name: "Rahul Sharma", avatar: "RS", email: "rahul.sharma@magnertia.com" },
  supportTeam: "Level 2 Support",
  branch: "Mumbai Branch",
  expectedResolutionDate: "22 Apr 2024 06:00 PM",
  priority: "High",
  severity: "S2 - Major",
  description: "EV charger stops charging randomly during operation. Error code EVC-023 displayed on screen.",

  category: "Hardware",
  subcategory: "Power Supply",
  productCategory: "DC Fast Charger",
  failureType: "Power Issue",
  processArea: "Assembly",
  rootArea: "Power Module",
  recurrence: true,
  customerImpact: "High",
  classificationRemarks: "Issue reported in multiple units. Power module overheating observed.",

  businessImpact: "High",
  safetyImpact: "Low",
  regulatoryImpact: "Low",
  financialImpact: 25000,
  urgencyRating: 4,
  severityScore: 85,

  investigator: { name: "Vikram Singh", avatar: "VS" },
  investigationDate: "16 Apr 2024 02:15 PM",
  symptoms: "Charger stops charging and reboot occurs.",
  findings: "Overheating in power module and voltage fluctuation detected.",
  testReportFile: "TR-2024-00058.pdf",
  investigationStatus: "Completed",

  capaCompletedPct: 75,
  correctiveActionsCompleted: "3/4",
  preventiveActionsCompleted: "2/3",
  overdueActionsCount: 1,

  slaPolicy: "Standard 24x7",
  slaStatus: "On Track",
  responseSla: "2 Hours",
  slaStartTime: "16 Apr 2024 10:35 AM",
  responseDue: "16 Apr 2024 12:35 PM",
  resolutionDue: "17 Apr 2024 10:35 AM",
  timeElapsed: "2h 45m",
  timeLeft: "21h 20m",

  nextAction: "Replace power module",
  assignedTo: "Vikram Singh",
  nextActionDate: "17 Apr 2024 09:00 AM",
  nextActionPriority: "High",

  satisfactionScore: 4.2,
  customerFeedbackText: "Support team responded quickly and issue resolved within expected time.",
  improvementSuggestion: "Provide preventive maintenance alerts in future.",
  feedbackStatus: "Received",
};

const RECENT_ACTIVITIES = [
  { time: "16 Apr 2024 10:35 AM", type: "Complaint Received", desc: "Complaint logged by customer", by: "Ankit Verma", outcome: "Ticket Created", next: "Classification", status: "Completed" },
  { time: "16 Apr 2024 11:20 AM", type: "Assigned", desc: "Assigned to Level 2 Support", by: "Vikram Singh", outcome: "Acknowledged", next: "Investigation", status: "Completed" },
  { time: "16 Apr 2024 01:15 PM", type: "Investigation", desc: "Initial investigation completed", by: "Vikram Singh", outcome: "Issue Identified", next: "RCA", status: "Completed" },
  { time: "16 Apr 2024 02:30 PM", type: "RCA", desc: "Root cause analysis initiated", by: "Rahul Sharma", outcome: "In Progress", next: "CAPA", status: "In Progress" },
  { time: "16 Apr 2024 03:10 PM", type: "Customer Update", desc: "Customer informed about status", by: "Vikram Singh", outcome: "Information Sent", next: "Follow-up", status: "Completed" },
];

const CAPA_DONUT_DATA = [
  { name: "Completed", value: 75, color: "#059669" },
  { name: "In Progress", value: 15, color: "#f59e0b" },
  { name: "Not Started", value: 10, color: "#94a3b8" },
];

const LINKED_DOCUMENTS = [
  { name: "Complaint_Image_01.jpg", date: "16 Apr 2024" },
  { name: "Test_Report_TR-2024-00058.pdf", date: "16 Apr 2024" },
  { name: "RCA_Report_RCA-2024-00025.pdf", date: "16 Apr 2024" },
  { name: "Replacement_Approval_APR-00045.pdf", date: "17 Apr 2024" },
  { name: "Service_Report_SR-2024-00078.pdf", date: "17 Apr 2024" },
];

export function ComplaintManagementPage() {
  const [complaint, setComplaint] = useState<ComplaintRecord>(INITIAL_COMPLAINT);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Modals
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [isRcaModalOpen, setIsRcaModalOpen] = useState(false);
  const [isScheduleActionOpen, setIsScheduleActionOpen] = useState(false);

  const handleInputChange = (field: keyof ComplaintRecord, value: any) => {
    setComplaint((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveComplaint = () => {
    alert(`Complaint Master ${complaint.complaintNumber} saved successfully!`);
  };

  return (
    <AppShell
      title="Complaint Management Form"
      breadcrumb="Management > CRM Management > Customer Support > Complaint Management > Complaint Management Form"
      description="The Complaint Management Form manages customer complaints as a structured quality and service process from complaint registration → classification → validation → investigation → root-cause analysis → corrective action → preventive action → customer response → closure → CAPA → analytics."
      tabs={<CrmManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen text-slate-800 space-y-6">
        {/* Complaint Master Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900">Complaint Management Form</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {complaint.complaintNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
                ● {complaint.status}
              </span>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => window.print()}
                className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-slate-600" />
                <span>Print</span>
              </button>

              <button
                onClick={() => alert("Opening Email Composer for Complaint Notification...")}
                className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5 text-blue-600" />
                <span>Send Email</span>
              </button>

              <button
                onClick={handleSaveComplaint}
                className="h-8 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>

              <button
                onClick={() => alert("More complaint options...")}
                className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>More</span>
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1">
                <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs shadow-2xs">
                  RS
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 leading-none">Rahul Sharma</div>
                  <div className="text-[10px] text-slate-500">Support Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Complaint Master (Matching Mockup Image) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">1. Complaint Master</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">Quality & Service Complaint Master</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Complaint Number *</label>
              <input
                type="text"
                value={complaint.complaintNumber}
                onChange={(e) => handleInputChange("complaintNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Complaint Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={complaint.complaintType}
                onChange={(e) => handleInputChange("complaintType", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Product Complaint">Product Complaint</option>
                <option value="Service Complaint">Service Complaint</option>
                <option value="Quality Complaint">Quality Complaint</option>
                <option value="Delivery Complaint">Delivery Complaint</option>
                <option value="Installation Complaint">Installation Complaint</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Complaint Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={complaint.status}
                onChange={(e) => handleInputChange("status", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-emerald-700 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="In Progress">In Progress</option>
                <option value="Investigating">Investigating</option>
                <option value="RCA In Progress">RCA In Progress</option>
                <option value="CAPA Initiated">CAPA Initiated</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Complaint Date *</label>
              <input
                type="text"
                disabled
                value={complaint.complaintDate}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-200 rounded font-medium text-slate-600"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Source *</label>
              <select
                value={complaint.source}
                onChange={(e) => handleInputChange("source", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              >
                <option value="Email">Email</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Customer Portal">Customer Portal</option>
                <option value="Site Visit">Site Visit</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer *</label>
              <input
                type="text"
                value={complaint.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Contact *</label>
              <input
                type="text"
                value={complaint.contactPerson}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Account</label>
              <input
                type="text"
                value={complaint.accountName}
                onChange={(e) => handleInputChange("accountName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer Order</label>
              <input
                type="text"
                value={complaint.customerOrderNumber}
                onChange={(e) => handleInputChange("customerOrderNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Invoice</label>
              <input
                type="text"
                value={complaint.invoiceNumber}
                onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Product / Service *</label>
              <input
                type="text"
                value={complaint.productName}
                onChange={(e) => handleInputChange("productName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Serial Number</label>
              <input
                type="text"
                value={complaint.serialNumber}
                onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Warranty Status</label>
              <span className="w-full h-8 px-2.5 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded font-bold flex items-center gap-1.5">
                ● {complaint.warrantyStatus}
              </span>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Complaint Owner *</label>
              <div className="flex items-center gap-2 h-8 px-2 bg-white border border-slate-300 rounded">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">
                  RS
                </div>
                <span className="font-semibold text-slate-800 truncate">{complaint.complaintOwner.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Support Team</label>
              <input
                type="text"
                value={complaint.supportTeam}
                onChange={(e) => handleInputChange("supportTeam", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Branch</label>
              <input
                type="text"
                value={complaint.branch}
                onChange={(e) => handleInputChange("branch", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Expected Resolution Date *</label>
              <input
                type="text"
                value={complaint.expectedResolutionDate}
                onChange={(e) => handleInputChange("expectedResolutionDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-blue-700"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Priority *</label>
              <select
                value={complaint.priority}
                onChange={(e) => handleInputChange("priority", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-rose-600"
              >
                <option value="High">● High</option>
                <option value="Critical">● Critical</option>
                <option value="Medium">● Medium</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Severity *</label>
              <select
                value={complaint.severity}
                onChange={(e) => handleInputChange("severity", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-amber-700"
              >
                <option value="S2 - Major">S2 - Major</option>
                <option value="S1 - Critical">S1 - Critical</option>
                <option value="S3 - Moderate">S3 - Moderate</option>
              </select>
            </div>

            <div className="col-span-1 lg:col-span-5">
              <label className="block text-slate-500 font-semibold mb-1">Description *</label>
              <input
                type="text"
                value={complaint.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Inner Sub-Tabs Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/70 p-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: "overview", label: "Overview", icon: Layers },
              { id: "classification", label: "Classification", icon: AlertCircle },
              { id: "investigation", label: "Investigation", icon: Search },
              { id: "rca", label: "RCA & CAPA", icon: FileCheck },
              { id: "actions", label: "Actions", icon: Wrench },
              { id: "communications", label: "Communications", icon: MessageSquare },
              { id: "documents", label: "Documents", icon: Paperclip },
              { id: "sla", label: "SLA", icon: Clock },
              { id: "resolution", label: "Resolution", icon: CheckCircle2 },
              { id: "feedback", label: "Customer Feedback", icon: Star },
              { id: "history", label: "History", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                    active
                      ? "bg-white text-primary shadow-2xs border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", active ? "text-primary" : "text-slate-400")} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT AREA */}
          <div className="p-5">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left & Center Columns (Sections 2 to 10) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Quality Audit & Containment Banner (Distinct Quality Context) */}
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                          Quality Containment & Batch Recall Assessment: ACTIVE
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                        ISO 9001 / CAPA Protocol
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="bg-white p-2 rounded border border-amber-200">
                        <span className="text-slate-500 block text-[10px]">Affected Batch</span>
                        <span className="font-mono font-bold text-slate-800">BATCH-2024-048</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-amber-200">
                        <span className="text-slate-500 block text-[10px]">Product Hold Status</span>
                        <span className="font-bold text-rose-600">● On Hold (14 Units)</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-amber-200">
                        <span className="text-slate-500 block text-[10px]">RCA Investigation</span>
                        <span className="font-bold text-amber-700">5-Why Analysis Done</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-amber-200">
                        <span className="text-slate-500 block text-[10px]">CAPA Completion</span>
                        <span className="font-bold text-emerald-700">75% (3/4 Done)</span>
                      </div>
                    </div>

                    {/* 5-Why Root Cause Stepper */}
                    <div className="bg-white p-3 rounded-lg border border-amber-200/80 space-y-2 text-xs">
                      <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">
                        5-Why Root Cause Analysis Trace:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="px-2 py-1 bg-slate-100 border rounded font-semibold text-slate-700">1. Charger Reboots</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        <span className="px-2 py-1 bg-slate-100 border rounded font-semibold text-slate-700">2. Power Module Overheating</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        <span className="px-2 py-1 bg-slate-100 border rounded font-semibold text-slate-700">3. Fan Voltage Fluctuation</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        <span className="px-2 py-1 bg-amber-100 border border-amber-300 rounded font-bold text-amber-900">4. Sub-vendor Connector Loose</span>
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 1: Classification, Priority & Severity, Investigation Summary, RCA & CAPA Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 2: Classification */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        2. Classification
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 font-medium block">Category *</span>
                          <span className="font-bold text-slate-800">{complaint.category}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Subcategory *</span>
                          <span className="font-semibold text-slate-800">{complaint.subcategory}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Product Category</span>
                          <span className="font-semibold text-slate-800">{complaint.productCategory}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Failure Type</span>
                          <span className="font-semibold text-slate-800">{complaint.failureType}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Process Area</span>
                          <span className="font-semibold text-slate-800">{complaint.processArea}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Root Area</span>
                          <span className="font-semibold text-slate-800">{complaint.rootArea}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <input type="checkbox" checked={complaint.recurrence} readOnly className="h-3.5 w-3.5 text-primary rounded" />
                          <span className="text-slate-700 font-semibold">Recurrence</span>
                        </div>
                        <div>
                          <span className="text-slate-500 mr-1 font-medium">Customer Impact:</span>
                          <span className="font-bold text-rose-600">{complaint.customerImpact}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 italic bg-white p-1.5 rounded border">
                        "{complaint.classificationRemarks}"
                      </div>
                    </div>

                    {/* Card 3: Priority & Severity */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        3. Priority & Severity
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-500 font-medium block">Customer Impact</span>
                          <span className="font-semibold text-slate-800">{complaint.customerImpact}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Business Impact</span>
                          <span className="font-semibold text-slate-800">{complaint.businessImpact}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Safety Impact</span>
                          <span className="font-semibold text-slate-800">{complaint.safetyImpact}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Regulatory Impact</span>
                          <span className="font-semibold text-slate-800">{complaint.regulatoryImpact}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Financial Impact (₹)</span>
                          <span className="font-mono font-bold text-slate-800">₹ {(complaint.financialImpact).toLocaleString("en-IN")}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Urgency</span>
                          <span className="text-amber-500 font-bold">{"★".repeat(complaint.urgencyRating)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                        <span className="text-slate-600 font-semibold">Severity Score</span>
                        <span className="font-extrabold text-slate-900 text-sm font-mono">{complaint.severityScore}</span>
                      </div>
                    </div>

                    {/* Card 4: Investigation Summary */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          4. Investigation Summary
                        </h3>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200 text-[10px]">
                          ● {complaint.investigationStatus}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-semibold">Investigator</span>
                          <div className="flex items-center gap-1">
                            <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[9px]">
                              {complaint.investigator.avatar}
                            </div>
                            <span className="font-bold text-slate-800">{complaint.investigator.name}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Investigation Date</span>
                          <span className="font-medium text-slate-800">{complaint.investigationDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold">Symptoms:</span>
                          <p className="font-medium text-slate-800 text-[11px] leading-tight">{complaint.symptoms}</p>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold">Findings:</span>
                          <p className="font-medium text-slate-800 text-[11px] leading-tight">{complaint.findings}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-200 pt-1">
                          <span className="text-slate-500 font-semibold">Test Report</span>
                          <button onClick={() => alert(`Downloading ${complaint.testReportFile}...`)} className="text-primary font-mono text-[11px] hover:underline flex items-center gap-1 cursor-pointer">
                            <Download className="h-3 w-3" /> {complaint.testReportFile}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Card 5: RCA & CAPA Status (Recharts Donut) */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        5. RCA & CAPA Status
                      </h3>

                      <div className="flex items-center justify-between gap-2">
                        <div className="w-28 h-28 relative shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={CAPA_DONUT_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={28}
                                outerRadius={44}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {CAPA_DONUT_DATA.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip formatter={(val: number) => `${val}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                            <span className="text-sm font-extrabold text-emerald-700">75%</span>
                            <span className="text-[8px] font-bold text-slate-400">CAPA Done</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs w-full">
                          <div className="flex justify-between items-center bg-emerald-50 p-1.5 rounded border border-emerald-200">
                            <span className="text-emerald-800 font-semibold text-[11px]">Corrective Actions</span>
                            <span className="font-bold text-emerald-900 font-mono">{complaint.correctiveActionsCompleted}</span>
                          </div>
                          <div className="flex justify-between items-center bg-amber-50 p-1.5 rounded border border-amber-200">
                            <span className="text-amber-800 font-semibold text-[11px]">Preventive Actions</span>
                            <span className="font-bold text-amber-900 font-mono">{complaint.preventiveActionsCompleted}</span>
                          </div>
                          <div className="flex justify-between items-center bg-rose-50 p-1.5 rounded border border-rose-200">
                            <span className="text-rose-800 font-semibold text-[11px]">Overdue Actions</span>
                            <span className="font-bold text-rose-900 font-mono">{complaint.overdueActionsCount}</span>
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
                      <button onClick={() => alert("Viewing All Activities...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                        View All Activities
                      </button>
                    </div>

                    <div className="overflow-x-auto text-xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                            <th className="py-2 px-2">Date & Time</th>
                            <th className="py-2 px-2">Activity Type</th>
                            <th className="py-2 px-2">Description</th>
                            <th className="py-2 px-2">By</th>
                            <th className="py-2 px-2">Outcome</th>
                            <th className="py-2 px-2">Next Action</th>
                            <th className="py-2 px-2 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {RECENT_ACTIVITIES.map((act, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80">
                              <td className="py-2 px-2 text-slate-500 whitespace-nowrap">{act.time}</td>
                              <td className="py-2 px-2 font-bold text-slate-800">{act.type}</td>
                              <td className="py-2 px-2 text-slate-700">{act.desc}</td>
                              <td className="py-2 px-2 text-slate-600">{act.by}</td>
                              <td className="py-2 px-2 font-medium text-slate-700">{act.outcome}</td>
                              <td className="py-2 px-2 text-slate-700">{act.next}</td>
                              <td className="py-2 px-2 text-center">
                                <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded", act.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800")}>
                                  {act.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Grid Row 3: SLA Info, Next Action, Customer Feedback */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 7: SLA Information */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          7. SLA Information
                        </h3>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200 text-[10px]">
                          ● {complaint.slaStatus}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">SLA Policy</span>
                          <span className="font-semibold text-slate-800">{complaint.slaPolicy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Response SLA</span>
                          <span className="font-semibold text-slate-800">{complaint.responseSla}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Resolution Due</span>
                          <span className="font-bold text-blue-700">{complaint.resolutionDue}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2 text-center">
                          <div className="bg-slate-100 p-1.5 rounded">
                            <span className="text-[10px] text-slate-500 font-semibold block">Time Elapsed</span>
                            <span className="font-mono font-bold text-slate-800">{complaint.timeElapsed}</span>
                          </div>
                          <div className="bg-emerald-50 p-1.5 rounded border border-emerald-200">
                            <span className="text-[10px] text-emerald-700 font-semibold block">Time Left</span>
                            <span className="font-mono font-bold text-emerald-800">{complaint.timeLeft}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 8: Next Action */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        8. Next Action
                      </h3>
                      <div className="space-y-1.5">
                        <div>
                          <span className="text-slate-500 font-semibold">Next Action</span>
                          <span className="font-bold text-slate-900 block font-mono">{complaint.nextAction}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Assigned To</span>
                          <span className="font-bold text-slate-800">{complaint.assignedTo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Target Date</span>
                          <span className="font-semibold text-slate-800">{complaint.nextActionDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Priority</span>
                          <span className="font-bold text-rose-600">● {complaint.nextActionPriority}</span>
                        </div>
                        <button
                          onClick={() => setIsScheduleActionOpen(true)}
                          className="w-full mt-1 py-1.5 bg-primary text-white font-bold text-xs rounded shadow-xs cursor-pointer"
                        >
                          Schedule Action
                        </button>
                      </div>
                    </div>

                    {/* Card 9: Customer Feedback */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          9. Customer Feedback
                        </h3>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200 text-[10px]">
                          Received
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-semibold">Satisfaction Score</span>
                          <span className="text-amber-500 font-bold text-xs">★★★★☆ 4.2 / 5</span>
                        </div>
                        <div className="bg-white p-2 rounded border text-slate-700 text-[11px] leading-tight">
                          "{complaint.customerFeedbackText}"
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold text-[10px]">Improvement Suggestion:</span>
                          <p className="font-medium text-slate-700 text-[10px] leading-tight">{complaint.improvementSuggestion}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 10: Linked Documents Table */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        10. Linked Documents
                      </h3>
                      <button onClick={() => alert("Viewing All Documents...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                        View All Documents
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {LINKED_DOCUMENTS.map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded border border-slate-200">
                          <div>
                            <div className="font-semibold text-slate-800 text-[11px]">{doc.name}</div>
                            <div className="text-[10px] text-slate-400">{doc.date}</div>
                          </div>
                          <button
                            onClick={() => alert(`Downloading ${doc.name}...`)}
                            className="text-primary hover:text-primary/80 p-1 cursor-pointer"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Sidebar Panels (Matching Mockup Image) */}
                <div className="space-y-6">
                  {/* Complaint Summary Widget (8 Stat Tiles) */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 text-center">
                      Complaint Summary
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200">
                        <div className="text-[10px] text-blue-700 font-semibold">Total Complaints</div>
                        <div className="text-lg font-extrabold text-blue-900">523</div>
                      </div>
                      <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200">
                        <div className="text-[10px] text-emerald-700 font-semibold">Open Complaints</div>
                        <div className="text-lg font-extrabold text-emerald-900">48</div>
                      </div>
                      <div className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200">
                        <div className="text-[10px] text-amber-700 font-semibold">In Progress</div>
                        <div className="text-lg font-extrabold text-amber-900">22</div>
                      </div>
                      <div className="p-2.5 bg-purple-50/60 rounded-lg border border-purple-200">
                        <div className="text-[10px] text-purple-700 font-semibold">On Hold</div>
                        <div className="text-lg font-extrabold text-purple-900">6</div>
                      </div>
                      <div className="p-2.5 bg-teal-50/60 rounded-lg border border-teal-200">
                        <div className="text-[10px] text-teal-700 font-semibold">Resolved</div>
                        <div className="text-lg font-extrabold text-teal-900">412</div>
                      </div>
                      <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-300">
                        <div className="text-[10px] text-slate-600 font-semibold">Closed</div>
                        <div className="text-lg font-extrabold text-slate-900">372</div>
                      </div>
                      <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-200">
                        <div className="text-[10px] text-rose-700 font-semibold">Overdue</div>
                        <div className="text-lg font-extrabold text-rose-900">7</div>
                      </div>
                      <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-200">
                        <div className="text-[10px] text-indigo-700 font-semibold">Avg. Resolution Time</div>
                        <div className="text-sm font-extrabold text-indigo-900">18.6 Hrs</div>
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
                        onClick={() => alert("Adding activity...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>Add Activity</span>
                      </button>
                      <button
                        onClick={() => alert("Uploading document...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Paperclip className="h-4 w-4 text-indigo-600" />
                        <span>Upload Doc</span>
                      </button>
                      <button
                        onClick={() => alert("Sending email...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Mail className="h-4 w-4 text-purple-600" />
                        <span>Send Email</span>
                      </button>
                      <button
                        onClick={() => alert("Escalating ticket...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <AlertTriangle className="h-4 w-4 text-rose-600" />
                        <span>Escalate Ticket</span>
                      </button>
                      <button
                        onClick={() => setIsScheduleActionOpen(true)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Wrench className="h-4 w-4 text-amber-600" />
                        <span>Schedule Visit</span>
                      </button>
                      <button
                        onClick={() => alert("Closing complaint...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Close Complaint</span>
                      </button>
                      <button
                        onClick={() => alert("Creating task...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <CheckSquare className="h-4 w-4 text-slate-600" />
                        <span>Create Task</span>
                      </button>
                      <button
                        onClick={() => alert("Linking to order...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <FileText className="h-4 w-4 text-teal-600" />
                        <span>Link to Order</span>
                      </button>
                      <button
                        onClick={() => alert("Viewing history...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span>View History</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODAL 1: SCHEDULE ACTION */}
        {isScheduleActionOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-amber-600" />
                  <span>Schedule Service Action</span>
                </h3>
                <button onClick={() => setIsScheduleActionOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Action Type *</label>
                  <select className="w-full h-8 px-2 border rounded text-xs">
                    <option>Replace Power Module</option>
                    <option>On-Site Technical Inspection</option>
                    <option>Firmware Update</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Technician *</label>
                  <input type="text" defaultValue="Vikram Singh" className="w-full h-8 px-2 border rounded text-xs font-bold text-slate-800" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scheduled Date & Time *</label>
                  <input type="text" defaultValue="17 Apr 2024 09:00 AM" className="w-full h-8 px-2 border rounded text-xs font-semibold text-blue-700" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsScheduleActionOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsScheduleActionOpen(false);
                    alert("Service Action scheduled successfully!");
                  }}
                  className="px-4 py-1.5 text-xs bg-primary text-white font-bold rounded shadow-xs"
                >
                  Schedule Action
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
