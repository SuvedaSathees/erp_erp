import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hrmManagementService } from "@/services";
import { AppShell } from "@/components/erp/AppShell";
import { HrmManagementTabBar } from "@/components/erp/HrmManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Users,
  Target,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  Save,
  Send,
  Download,
  Share2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  FileText,
  MessageSquare,
  Paperclip,
  Activity,
  Layers,
  ChevronRight,
  UserCheck,
  Award,
  BarChart3,
  PieChart as PieIcon,
  ShieldCheck,
  RefreshCw,
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  Globe,
  MapPin,
  Briefcase,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  Printer,
  Sliders,
  UserPlus,
  GraduationCap,
  Scale,
  BrainCircuit,
  Workflow,
  AlertTriangle,
  FileSpreadsheet,
  Check,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Compass,
  Zap,
  Lock,
  FileCheck,
  Mail,
  Phone,
  Video,
  ShieldAlert,
  HelpCircle,
  Eye,
  CheckCircle,
  Laptop,
  Key,
  Shield,
  MessageCircle,
  Flag,
  User,
  Sparkle,
  FolderOpen,
  ClipboardList,
  Upload,
  CalendarDays,
  Timer,
  LogIn,
  LogOut,
  Coffee,
  CheckCheck,
  FileDown,
  Heart,
  Landmark,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/leave-management")({
  head: () => ({
    meta: [
      { title: "Leave Management · HRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Leave Form manages the complete employee leave lifecycle from leave entitlement → leave request → balance validation → approval → attendance integration → payroll impact → leave encashment / carry-forward → closure → analytics.",
      },
    ],
  }),
  component: LeaveManagementPage,
});

// --- Types & Data Models ---

export interface LeaveRequestItem {
  id: string;
  leaveNumber: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  status: "Submitted" | "Approved" | "Under Review" | "Rejected" | "Draft";
  approvedBy: string;
}

export interface PendingApprovalItem {
  id: string;
  employee: string;
  leaveType: string;
  fromDate: string;
  days: number;
  level: string;
  status: "Pending" | "Approved" | "Rejected";
}

const FALLBACK_REQUESTS: LeaveRequestItem[] = [];

const INITIAL_APPROVALS: PendingApprovalItem[] = [
  { id: "APP-01", employee: "Priya Nair", leaveType: "Annual Leave", fromDate: "22 May 2024", days: 3.0, level: "Manager", status: "Pending" },
  { id: "APP-02", employee: "Karthik S", leaveType: "Sick Leave", fromDate: "21 May 2024", days: 1.0, level: "HR", status: "Pending" },
  { id: "APP-03", employee: "Vikram R", leaveType: "Casual Leave", fromDate: "20 May 2024", days: 0.5, level: "HR", status: "Pending" },
];

const LEAVE_BALANCES = [
  { type: "Annual Leave", entitlement: 30.0, taken: 16.5, balance: 13.5 },
  { type: "Sick Leave", entitlement: 12.0, taken: 3.0, balance: 9.0 },
  { type: "Casual Leave", entitlement: 12.0, taken: 6.0, balance: 6.0 },
  { type: "Comp Off", entitlement: 5.0, taken: 1.0, balance: 4.0 },
  { type: "Maternity Leave", entitlement: 90.0, taken: 0.0, balance: 90.0 },
];

export default function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("request");
  const leaveQuery = useQuery({
    queryKey: ["hrm", "leave-requests"],
    queryFn: () => hrmManagementService.fetchLeaveRequests(),
  });

  const queryClient = useQueryClient();

  const createLeaveMutation = useMutation({
    mutationFn: (input: any) => hrmManagementService.createLeaveRequest(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hrm"] });
      toast.success("Leave request submitted successfully");
    },
    onError: () => toast.error("Failed to submit leave request"),
  });

  const updateLeaveMutation = useMutation({
    mutationFn: (input: any) => hrmManagementService.updateLeaveRequest(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hrm"] });
      toast.success("Leave request updated successfully");
    },
    onError: () => toast.error("Failed to update leave request"),
  });

  const requests: LeaveRequestItem[] = (leaveQuery.data ?? []).map((r: any) => ({
    id: r.id,
    leaveNumber: r.leaveCode,
    leaveType: r.leaveType,
    fromDate: new Date(r.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    toDate: new Date(r.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    days: r.days,
    status: (r.status === "Pending" ? "Submitted" : r.status) as LeaveRequestItem["status"],
    approvedBy: r.approvedBy ?? "-",
  }));
  const [approvals, setApprovals] = useState<PendingApprovalItem[]>(INITIAL_APPROVALS);

  // Form State (Matching Screenshot)
  const [leaveType, setLeaveType] = useState("Annual Leave");
  const [fromDate, setFromDate] = useState("2024-05-20");
  const [toDate, setToDate] = useState("2024-05-24");
  const [durationType, setDurationType] = useState("Full Day");
  const [reason, setReason] = useState("Going home for a family function.");
  const [contactNumber, setContactNumber] = useState("+91 98765 43210");
  const [address, setAddress] = useState("12, Gandhi Street, Peelamedu, Coimbatore - 641004, Tamil Nadu, India");
  const [hasAttachment, setHasAttachment] = useState(true);

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Leave request submitted successfully to Arun Kumar for approval", {
      description: "Balance validation passed. Attendance and calendar updated.",
    });
    leaveQuery.refetch();
  };

  const handleApprove = (id: string, emp: string) => {
    setApprovals(approvals.filter((a) => a.id !== id));
    toast.success(`Leave request for ${emp} has been approved.`);
  };

  const handleReject = (id: string, emp: string) => {
    setApprovals(approvals.filter((a) => a.id !== id));
    toast.error(`Leave request for ${emp} has been rejected.`);
  };

  return (
    <AppShell
      title="Leave Management"
      breadcrumb="Management > HRM Management > Leave Management"
      description="The Leave Form manages the complete employee leave lifecycle from leave entitlement → leave request → balance validation → approval → attendance integration → payroll impact → leave encashment / carry-forward → closure → analytics."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Star */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Leave Form
              </h2>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toast.info("New Leave Request form active")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Apply Leave
              </button>
              <button
                type="button"
                onClick={() => toast.success("Leave summary exported to Excel")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.info("More leave options")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                More
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.success("Leave record saved")}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* 1. Employee Header & Leave Balance Summary Banner (Exact match to reference image) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
          {/* Top Profile Strip */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left Identity */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Sankaranarayanan R</h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white shadow-xs">
                  Active
                </span>
              </div>
              <div className="font-mono text-xs font-semibold text-slate-700">EMP-000125</div>
              <div className="text-xs text-muted-foreground font-medium">
                Senior Mechanical Engineer • Engineering Department
              </div>
            </div>

            {/* Quick Meta Info Fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs divide-x divide-slate-100">
              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Organization
                </span>
                <div className="font-semibold text-slate-900 mt-0.5">Magnertia Private Limited</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Branch
                </span>
                <div className="font-semibold text-slate-900 mt-0.5">Coimbatore HO</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> Reporting Manager
                </span>
                <div className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <span>Arun Kumar</span>
                </div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Leave Policy
                </span>
                <div className="font-semibold text-slate-900 mt-0.5">Standard Policy 2024</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Leave Year
                </span>
                <div className="font-semibold text-slate-900 mt-0.5">01 Apr 2024 - 31 Mar 2025</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Counter Strip */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs text-center">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-muted-foreground font-semibold">Total Entitlement</span>
              <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">30.0 <span className="text-xs font-normal">Days</span></div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-muted-foreground font-semibold">Leave Taken</span>
              <div className="text-base font-extrabold text-slate-800 font-mono mt-0.5">16.5 <span className="text-xs font-normal">Days</span></div>
            </div>

            <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-emerald-800 font-semibold">Leave Balance</span>
              <div className="text-base font-extrabold text-emerald-700 font-mono mt-0.5">13.5 <span className="text-xs font-normal">Days</span></div>
            </div>

            <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-100">
              <span className="text-[10px] text-amber-800 font-semibold">Pending Requests</span>
              <div className="text-base font-extrabold text-amber-700 font-mono mt-0.5">2 <span className="text-xs font-normal">Requests</span></div>
            </div>

            <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
              <span className="text-[10px] text-blue-800 font-semibold">Upcoming Leave</span>
              <div className="text-base font-extrabold text-blue-700 font-mono mt-0.5">3 <span className="text-xs font-normal">Days</span></div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Bar (Matching screenshot) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "request", label: "Leave Request", icon: Plus },
              { id: "balance", label: "Leave Balance", icon: FolderOpen },
              { id: "calendar", label: "Leave Calendar", icon: CalendarDays },
              { id: "history", label: "Leave History & Approvals", icon: Clock },
              { id: "encashment", label: "Comp Off & Encashment", icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer",
                    active
                      ? "bg-primary text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: LEAVE REQUEST FORM & CALENDAR OVERVIEW (Exact layout match to reference image) */}
        {activeTab === "request" && (
          <div className="space-y-6">
            {/* Top Grid: Main Form (Left 8-cols) + Balance & Calendar (Right 4-cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left 8-Cols: Leave Request Details Form */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Leave Request Details</h3>
                </div>

                <form onSubmit={handleSubmitLeave} className="space-y-4 text-xs">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Leave Type <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-900 focus:border-primary focus:outline-hidden bg-white"
                      >
                        <option value="Annual Leave">Annual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Comp Off">Comp Off</option>
                        <option value="Maternity Leave">Maternity Leave</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Leave Policy</label>
                      <input
                        type="text"
                        disabled
                        value="Standard Policy 2024"
                        className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-500 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Leave Balance (Days)</label>
                      <span className="flex items-center h-8 px-3 rounded-md bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
                        13.5
                      </span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        From Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        To Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Leave Days</label>
                      <span className="flex items-center h-8 px-3 rounded-md bg-slate-50 text-slate-800 font-mono font-bold border border-slate-200">
                        5.0
                      </span>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Duration Type <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={durationType}
                        onChange={(e) => setDurationType(e.target.value)}
                        className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden bg-white"
                      >
                        <option value="Full Day">Full Day</option>
                        <option value="Half Day - First Half">Half Day - First Half</option>
                        <option value="Half Day - Second Half">Half Day - Second Half</option>
                        <option value="Short Leave">Short Leave</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Total Duration</label>
                      <span className="flex items-center justify-between h-8 px-3 rounded-md bg-slate-50 text-slate-900 font-mono font-bold border border-slate-200">
                        <span>5.0</span>
                        <span className="text-[10px] text-muted-foreground font-normal">Days</span>
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Working Days</label>
                      <span className="flex items-center h-8 px-3 rounded-md bg-slate-50 text-slate-800 font-mono font-bold border border-slate-200">
                        5.0
                      </span>
                    </div>
                  </div>

                  {/* Row 4: Contact & Reason */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Contact During Leave</label>
                      <input
                        type="text"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Reason <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Row 5: Address */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Address During Leave</label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden resize-none"
                    />
                  </div>

                  {/* Row 6: Attachment & Reporting Manager */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Attachment</label>
                      {hasAttachment ? (
                        <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50">
                          <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                            <FileText className="h-3.5 w-3.5 text-primary" />
                            Invitation_Letter.pdf <span className="text-[10px] text-muted-foreground font-normal">PDF • 245 KB</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setHasAttachment(false)}
                            className="text-rose-500 hover:text-rose-700 p-0.5 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setHasAttachment(true)}
                          className="w-full h-8 border border-dashed border-slate-300 rounded-md text-[11px] text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="h-3.5 w-3.5 text-slate-400" />
                          Upload Supporting Document
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Reporting Manager <span className="text-rose-500">*</span>
                      </label>
                      <select className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-900 focus:border-primary focus:outline-hidden bg-white">
                        <option>Arun Kumar</option>
                      </select>
                    </div>
                  </div>

                  {/* Bottom Form Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => toast.info("Leave request saved as Draft")}
                      className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>

              {/* Right 4-Cols: Leave Balance Summary & Mini Calendar */}
              <div className="lg:col-span-4 space-y-5">
                {/* 1. Leave Balance Summary */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-800">Leave Balance Summary</h4>
                    <button onClick={() => setActiveTab("balance")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                      View Details
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[10px]">
                          <th className="pb-1">Leave Type</th>
                          <th className="pb-1 text-center">Entitlement</th>
                          <th className="pb-1 text-center">Taken</th>
                          <th className="pb-1 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {LEAVE_BALANCES.map((l) => (
                          <tr key={l.type} className="hover:bg-slate-50/60">
                            <td className="py-1.5 font-medium text-slate-800">{l.type}</td>
                            <td className="py-1.5 text-center font-mono text-slate-500">{l.entitlement.toFixed(1)}</td>
                            <td className="py-1.5 text-center font-mono text-slate-500">{l.taken.toFixed(1)}</td>
                            <td className="py-1.5 text-right font-mono font-bold text-emerald-700 bg-emerald-50/40 px-1 rounded">
                              {l.balance.toFixed(1)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Leave Calendar (May 2024) */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-800">Leave Calendar (May 2024)</h4>
                  </div>

                  {/* Calendar Grid */}
                  <div className="space-y-2 text-[11px]">
                    <div className="grid grid-cols-7 gap-1 text-center font-bold text-slate-400 text-[10px]">
                      <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px]">
                      <span className="text-slate-300">28</span><span className="text-slate-300">29</span><span className="text-slate-300">30</span>
                      <span>1</span><span>2</span><span>3</span><span className="text-slate-400">4</span>
                      <span className="text-slate-400">5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span className="text-slate-400">11</span>
                      <span className="text-slate-400">12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span className="text-slate-400">18</span>
                      <span className="text-slate-400">19</span>
                      {/* Highlighted Leave Range (20 - 24 May) */}
                      <span className="h-6 w-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto">20</span>
                      <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto">21</span>
                      <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto">22</span>
                      <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto">23</span>
                      <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto">24</span>
                      <span className="text-slate-400">25</span>
                      <span className="text-slate-400">26</span><span>27</span><span>28</span><span>29</span><span>30</span><span>31</span><span className="text-slate-300">1</span>
                    </div>
                  </div>

                  {/* Calendar Legend */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 text-[9px] text-slate-500">
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Applied</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Approved</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Pending</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Rejected</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-slate-300" /> Holiday</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Recent Leave Requests, Pending Approvals, Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Recent Leave Requests (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Recent Leave Requests</h4>
                  <button onClick={() => setActiveTab("history")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Leave Number</th>
                        <th className="pb-1">Type</th>
                        <th className="pb-1">From Date</th>
                        <th className="pb-1">To Date</th>
                        <th className="pb-1 text-center">Days</th>
                        <th className="pb-1 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {requests.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/60">
                          <td className="py-2 font-mono font-bold text-slate-900">{r.leaveNumber}</td>
                          <td className="py-2 text-slate-700">{r.leaveType}</td>
                          <td className="py-2 text-slate-600">{r.fromDate}</td>
                          <td className="py-2 text-slate-600">{r.toDate}</td>
                          <td className="py-2 text-center font-mono font-bold">{r.days.toFixed(1)}</td>
                          <td className="py-2 text-right">
                            <span
                              className={cn(
                                "px-1.5 py-0.2 rounded-md font-bold",
                                r.status === "Approved"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200",
                              )}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Pending Approvals (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Pending Approvals</h4>
                  <button onClick={() => setActiveTab("approvals")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Employee</th>
                        <th className="pb-1">Leave Type</th>
                        <th className="pb-1">From Date</th>
                        <th className="pb-1 text-center">Days</th>
                        <th className="pb-1 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {approvals.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/60">
                          <td className="py-2 font-bold text-slate-900">{app.employee}</td>
                          <td className="py-2 text-slate-600">{app.leaveType}</td>
                          <td className="py-2 text-slate-600">{app.fromDate}</td>
                          <td className="py-2 text-center font-mono font-bold">{app.days.toFixed(1)}</td>
                          <td className="py-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleApprove(app.id, app.employee)}
                                className="h-6 w-6 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition flex items-center justify-center cursor-pointer"
                                title="Approve"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleReject(app.id, app.employee)}
                                className="h-6 w-6 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition flex items-center justify-center cursor-pointer"
                                title="Reject"
                              >
                                <XCircle className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button onClick={() => setActiveTab("approvals")} className="text-[10px] font-semibold text-primary hover:underline cursor-pointer">
                    Go to Approval Page →
                  </button>
                </div>
              </div>

              {/* 3. Quick Actions (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Quick Actions</h4>
                </div>

                <div className="space-y-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("request")}
                    className="w-full flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-primary hover:bg-slate-50/70 text-slate-700 transition cursor-pointer text-[11px]"
                  >
                    <div className="p-1 rounded-md bg-blue-50 text-primary"><Plus className="h-3.5 w-3.5" /></div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900">Apply Leave</div>
                      <div className="text-[9px] text-muted-foreground">New Leave Request</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("balance")}
                    className="w-full flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/40 text-slate-700 transition cursor-pointer text-[11px]"
                  >
                    <div className="p-1 rounded-md bg-emerald-50 text-emerald-600"><FolderOpen className="h-3.5 w-3.5" /></div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900">Leave Balance</div>
                      <div className="text-[9px] text-muted-foreground">Check Leave Balance</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("calendar")}
                    className="w-full flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-primary hover:bg-blue-50/40 text-slate-700 transition cursor-pointer text-[11px]"
                  >
                    <div className="p-1 rounded-md bg-blue-50 text-primary"><CalendarDays className="h-3.5 w-3.5" /></div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900">Leave Calendar</div>
                      <div className="text-[9px] text-muted-foreground">View Team Calendar</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("policies")}
                    className="w-full flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-primary hover:bg-blue-50/40 text-slate-700 transition cursor-pointer text-[11px]"
                  >
                    <div className="p-1 rounded-md bg-blue-50 text-primary"><FileText className="h-3.5 w-3.5" /></div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900">Leave Policy</div>
                      <div className="text-[9px] text-muted-foreground">View Leave Policies</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("encashment")}
                    className="w-full flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-amber-600 hover:bg-amber-50/40 text-slate-700 transition cursor-pointer text-[11px]"
                  >
                    <div className="p-1 rounded-md bg-amber-50 text-amber-600"><DollarSign className="h-3.5 w-3.5" /></div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900">Encashment</div>
                      <div className="text-[9px] text-muted-foreground">Apply for Encashment</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEAVE BALANCE */}
        {activeTab === "balance" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  Leave Entitlement & Accrual Balance Ledger (FY 2024–25)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Category-wise annual quotas, monthly accruals, approved leaves, and available balance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Leave policy & accrual rules exported")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Export Ledger
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {LEAVE_BALANCES.map((l) => (
                <div key={l.type} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{l.type}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Annual Quota</span>
                      <span className="font-mono font-semibold text-slate-800">{l.entitlement.toFixed(1)} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Taken</span>
                      <span className="font-mono font-semibold text-rose-600">{l.taken.toFixed(1)} Days</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1.5">
                      <span className="font-bold text-slate-900">Available Balance</span>
                      <span className="font-mono font-bold text-emerald-700 text-sm">{l.balance.toFixed(1)} Days</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LEAVE CALENDAR */}
        {activeTab === "calendar" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Team Availability & Holiday Calendar
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upcoming organization holidays and team member planned leaves.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                <h4 className="font-bold text-slate-900">Upcoming Public Holidays</h4>
                <div className="space-y-2">
                  {[
                    { name: "Bakrid / Eid al-Adha", date: "17 Jun 2024", day: "Monday" },
                    { name: "Independence Day", date: "15 Aug 2024", day: "Thursday" },
                    { name: "Ganesh Chaturthi", date: "07 Sep 2024", day: "Saturday" },
                    { name: "Gandhi Jayanti", date: "02 Oct 2024", day: "Wednesday" },
                  ].map((h) => (
                    <div key={h.name} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                      <div>
                        <div className="font-bold text-slate-900">{h.name}</div>
                        <div className="text-[10px] text-muted-foreground">{h.day}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {h.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                <h4 className="font-bold text-slate-900">Engineering Team Planned Leaves</h4>
                <div className="space-y-2">
                  {[
                    { employee: "Sankaranarayanan R", dates: "20 May – 24 May 2024", days: "5 Days", type: "Annual Leave" },
                    { employee: "Karthik Subramanian", dates: "03 Jun – 04 Jun 2024", days: "2 Days", type: "Casual Leave" },
                    { employee: "Divya Ramesh", dates: "18 Jun 2024", days: "1 Day", type: "Comp Off" },
                  ].map((tl) => (
                    <div key={tl.employee} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                      <div>
                        <div className="font-bold text-slate-900">{tl.employee}</div>
                        <div className="text-[10px] text-muted-foreground">{tl.type} • {tl.days}</div>
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-slate-700">
                        {tl.dates}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LEAVE HISTORY & APPROVALS */}
        {activeTab === "history" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Leave Application History & Approval Trail
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Complete audit trail of submitted, approved, and rejected leave requests.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Leave Number</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">From Date</th>
                    <th className="py-2.5 px-3">To Date</th>
                    <th className="py-2.5 px-3 text-center">Days</th>
                    <th className="py-2.5 px-3">Approver</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{r.leaveNumber}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{r.leaveType}</td>
                      <td className="py-3 px-3 text-slate-600">{r.fromDate}</td>
                      <td className="py-3 px-3 text-slate-600">{r.toDate}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold">{r.days.toFixed(1)}</td>
                      <td className="py-3 px-3 text-slate-600">Arun Kumar (Engineering Manager)</td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                            r.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200",
                          )}
                        >
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

        {/* TAB 5: COMP OFF & ENCASHMENT */}
        {activeTab === "encashment" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  Compensatory Off Credit & Leave Encashment
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Earned comp off balances, year-end encashable leave calculation, and payout settlements.
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Encashment request submitted to Payroll")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Apply Encashment
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="text-muted-foreground text-[11px] font-semibold">Earned Comp Off Balance</div>
                <div className="text-lg font-bold font-mono text-primary">2.0 Days Available</div>
                <div className="text-[11px] text-slate-500">Credited for Weekend Shift Deployment</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="text-muted-foreground text-[11px] font-semibold">Encashable Annual Leave</div>
                <div className="text-lg font-bold font-mono text-emerald-700">6.0 Days Max</div>
                <div className="text-[11px] text-slate-500">Rate: ₹ 3,425 / Day</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="text-muted-foreground text-[11px] font-semibold">Estimated Encashment Payout</div>
                <div className="text-lg font-bold font-mono text-slate-900">₹ 20,550</div>
                <div className="text-[11px] text-emerald-600 font-semibold">Processed with March Payroll</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
