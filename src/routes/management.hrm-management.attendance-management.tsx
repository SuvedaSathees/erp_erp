import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { hrmManagementService } from "@/services";
import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";

export const Route = createFileRoute("/management/hrm-management/attendance-management")({
  head: () => ({
    meta: [
      { title: "Attendance Management · HRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Attendance Form manages the complete employee attendance lifecycle from work schedule → shift assignment → attendance capture → time calculation → exceptions → regularization → approval → overtime → payroll integration → attendance analytics.",
      },
    ],
  }),
  component: AttendanceManagementPage,
});

// --- Types & Data Models ---

export interface PunchRecord {
  id: string;
  type: "Check In" | "Break Start" | "Break End" | "Check Out";
  time: string;
  device: string;
  location: string;
  source: "Biometric" | "Manual" | "Web App" | "Mobile App";
  status: "Valid" | "Invalid" | "Pending";
}

export interface AttendanceException {
  id: string;
  type: "Late Arrival" | "Early Departure" | "Missing Punch" | "Excessive Break";
  details: string;
  duration: string;
  severity: "Low" | "Medium" | "High";
  status: "Open" | "Regularized" | "Approved";
}

const INITIAL_PUNCHES: PunchRecord[] = [
  { id: "1", type: "Check In", time: "09:38:12", device: "Bio-Device-01", location: "Main Entrance", source: "Biometric", status: "Valid" },
  { id: "2", type: "Break Start", time: "13:00:05", device: "Web App", location: "Head Office", source: "Manual", status: "Valid" },
  { id: "3", type: "Break End", time: "14:00:03", device: "Web App", location: "Head Office", source: "Manual", status: "Valid" },
  { id: "4", type: "Check Out", time: "18:55:22", device: "Bio-Device-01", location: "Main Entrance", source: "Biometric", status: "Valid" },
];

const INITIAL_EXCEPTIONS: AttendanceException[] = [
  { id: "EX-01", type: "Late Arrival", details: "Arrived after grace period", duration: "00:08", severity: "Low", status: "Open" },
  { id: "EX-02", type: "Early Departure", details: "Left before scheduled time", duration: "00:25", severity: "Low", status: "Open" },
];

const ATTENDANCE_DONUT = [
  { name: "Present", value: 8.45, color: "#10B981" },
  { name: "Break", value: 1.0, color: "#2563EB" },
  { name: "Overtime", value: 0.95, color: "#F59E0B" },
  { name: "Shortfall", value: 0.0, color: "#EF4444" },
];

export default function AttendanceManagementPage() {
  const queryClient = useQueryClient();
  const { data: _dbData, isLoading: _dbLoading } = useQuery({
    queryKey: ["hrm", "attendance"],
    queryFn: () => hrmManagementService.fetchAttendance(),
  });

  const [activeTab, setActiveTab] = useState<string>("daily");
  const [punches, setPunches] = useState<PunchRecord[]>(INITIAL_PUNCHES);
  const [exceptions, setExceptions] = useState<AttendanceException[]>(INITIAL_EXCEPTIONS);
  const [selectedDate, setSelectedDate] = useState("2024-05-16");

  // Modals
  const [isPunchModalOpen, setIsPunchModalOpen] = useState(false);
  const [isRegularizationModalOpen, setIsRegularizationModalOpen] = useState(false);

  // Form State
  const [punchType, setPunchType] = useState<PunchRecord["type"]>("Check In");
  const [punchTime, setPunchTime] = useState("09:45");
  const [regType, setRegType] = useState("Late Mark Correction");
  const [regReason, setRegReason] = useState("");

  const handleAddPunch = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: PunchRecord = {
      id: `${punches.length + 1}`,
      type: punchType,
      time: `${punchTime}:00`,
      device: "Web App",
      location: "Head Office",
      source: "Manual",
      status: "Valid",
    };
    setPunches([...punches, newRecord]);
    setIsPunchModalOpen(false);
    toast.success(`Manual punch (${punchType} at ${punchTime}) recorded successfully`);
  };

  const handleApplyRegularization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regReason) {
      toast.error("Please enter a reason for regularization");
      return;
    }
    setIsRegularizationModalOpen(false);
    setRegReason("");
    toast.success("Attendance regularization request submitted to Arun Kumar for approval");
  };

  return (
    <AppShell
      title="Attendance Management"
      breadcrumb="Management > HRM Management > Attendance Management"
      description="The Attendance Form manages the complete employee attendance lifecycle from work schedule → shift assignment → attendance capture → time calculation → exceptions → regularization → approval → overtime → payroll integration → attendance analytics."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Star */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Attendance Form
              </h2>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toast.info("Biometric Device / Excel Sync opened")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-blue-600" />
                Import Attendance
              </button>
              <button
                type="button"
                onClick={() => toast.success("Attendance report downloaded as XLSX")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export
              </button>
              <button
                type="button"
                onClick={() => toast.info("More actions opened")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                More
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.success("Attendance record updated and saved")}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* 1. Employee Header & Filter Master Bar (Exact visual match to reference image) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
          {/* Top Row: Employee Profile + Dropdown Selectors */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Employee Quick Identity */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900 text-sm">EMP-000125</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Sankaranarayanan R</h3>
              <div className="text-xs text-muted-foreground font-medium">
                Senior Mechanical Engineer • Engineering Department
              </div>
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs flex-1 max-w-4xl">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-900 focus:border-primary focus:outline-hidden bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Organization <span className="text-rose-500">*</span>
                </label>
                <select className="w-full h-8 px-2 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden bg-white truncate">
                  <option>Magnertia Private Limited</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Department
                </label>
                <select className="w-full h-8 px-2 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden bg-white">
                  <option>Engineering</option>
                  <option>Operations</option>
                  <option>Sales</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Shift
                </label>
                <select className="w-full h-8 px-2 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden bg-white truncate">
                  <option>General Shift (09:30 - 18:30)</option>
                  <option>Morning Shift (06:00 - 14:30)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Location
                </label>
                <select className="w-full h-8 px-2 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden bg-white truncate">
                  <option>Coimbatore Head Office</option>
                  <option>Bangalore Branch</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sub-Meta Indicator Strip */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Work Schedule</div>
                <div className="font-bold text-slate-900">5 Days</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <div className="text-[10px] text-muted-foreground">Weekly Off</div>
                <div className="font-bold text-slate-900">Sat, Sun</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <div>
                <div className="text-[10px] text-muted-foreground">Attendance Policy</div>
                <div className="font-bold text-slate-900">Standard Policy</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Grace Period</div>
                <div className="font-bold text-slate-900">15 Minutes</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-cyan-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Overtime After</div>
                <div className="font-bold text-slate-900 font-mono">09:30 Hours</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Status</div>
                <div className="font-bold text-emerald-700">Present</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Total Work Hours</div>
                <div className="font-extrabold text-slate-900 font-mono">08:27</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Bar (Matching screenshot) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "daily", label: "Daily Attendance", icon: Clock },
              { id: "punches", label: "Punch Details", icon: FingerprintIcon },
              { id: "regularization", label: "Regularization & Exceptions", badge: "1", icon: CheckSquare },
              { id: "overtime", label: "Overtime & Comp Off", icon: Timer },
              { id: "monthly", label: "Monthly Summary", icon: CalendarDays },
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
                  {tab.badge && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                        active ? "bg-white/20 text-white" : "bg-rose-500 text-white",
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: DAILY ATTENDANCE DASHBOARD (Exact match to reference image) */}
        {activeTab === "daily" && (
          <div className="space-y-6">
            {/* Row 1: Attendance Summary, Time Overview, Today's Status, This Month Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. Attendance Summary (16 May 2024) - Donut Chart */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Attendance Summary (16 May 2024)</h4>
                </div>

                <div className="h-32 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={ATTENDANCE_DONUT}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={52}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {ATTENDANCE_DONUT.map((entry, index) => (
                          <Cell key={`donut-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-lg font-extrabold text-slate-900 font-mono">08:27</span>
                    <span className="text-[9px] text-muted-foreground">Net Working Hours</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Present
                    </span>
                    <span className="font-mono font-bold">08:27</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-blue-500" /> Break
                    </span>
                    <span className="font-mono font-bold">01:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-amber-500" /> Overtime
                    </span>
                    <span className="font-mono font-bold">00:57</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-rose-500" /> Shortfall
                    </span>
                    <span className="font-mono font-bold text-slate-400">00:00</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 text-center pt-1 border-t border-slate-100">
                  Required Hours: <strong className="font-mono text-slate-900">08:30</strong>
                </div>
              </div>

              {/* 2. Time Overview */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Time Overview</h4>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Scheduled In</span>
                    <span className="font-mono font-semibold text-slate-800">09:30</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Actual In</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900">09:38</span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Late (00:08)
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Scheduled Out</span>
                    <span className="font-mono font-semibold text-slate-800">18:30</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Actual Out</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900">18:55</span>
                      <span className="px-1.5 py-0.2 rounded-sm text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Early (00:25)
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Break Duration</span>
                    <span className="font-mono font-semibold text-slate-800">01:00</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Gross Hours</span>
                    <span className="font-mono font-semibold text-slate-800">09:17</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Net Working Hours</span>
                    <span className="font-mono font-bold text-slate-900">08:27</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-0.5">
                    <span className="text-slate-500 font-semibold">Overtime Hours</span>
                    <span className="font-mono font-bold text-emerald-700">00:57</span>
                  </div>
                </div>
              </div>

              {/* 3. Today's Status */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col items-center justify-between text-center">
                <div className="w-full flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Today's Status</h4>
                </div>

                <div className="space-y-2 flex flex-col items-center my-auto">
                  <div className="h-16 w-16 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-xs">
                    <Check className="h-8 w-8 stroke-[2.5]" />
                  </div>
                  <div>
                    <h5 className="text-base font-extrabold text-emerald-700">Present</h5>
                    <p className="text-xs text-slate-600">You are present for today.</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Last updated: 16 May 2024 18:55:10
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("punches")}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Punch Details
                </button>
              </div>

              {/* 4. This Month Overview (May 2024) */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">This Month Overview (May 2024)</h4>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Working Days</span>
                    <span className="font-mono font-bold text-slate-900">22</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Present Days</span>
                    <span className="font-mono font-bold text-emerald-700">19</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Absent Days</span>
                    <span className="font-mono font-bold text-rose-600">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Leave Days</span>
                    <span className="font-mono font-bold text-amber-600">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Late Arrivals</span>
                    <span className="font-mono font-bold text-orange-600">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Early Departures</span>
                    <span className="font-mono font-bold text-blue-600">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Overtime Hours</span>
                    <span className="font-mono font-bold text-slate-900">08:35</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-0.5">
                    <span className="font-semibold text-slate-800">Attendance %</span>
                    <span className="font-mono font-extrabold text-emerald-700 text-xs">90.91%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Punch Details (16 May 2024) & Exceptions (16 May 2024) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Punch Details Table (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Punch Details (16 May 2024)</h4>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Total Punches: <strong className="text-slate-900 font-bold">{punches.length}</strong>
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="pb-1.5">Punch Type</th>
                        <th className="pb-1.5">Punch Time</th>
                        <th className="pb-1.5">Device</th>
                        <th className="pb-1.5">Location</th>
                        <th className="pb-1.5">Source</th>
                        <th className="pb-1.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {punches.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/60">
                          <td className="py-2 flex items-center gap-1.5 font-medium text-slate-800">
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full",
                                p.type === "Check In"
                                  ? "bg-emerald-500"
                                  : p.type === "Check Out"
                                    ? "bg-blue-500"
                                    : "bg-amber-500",
                              )}
                            />
                            {p.type}
                          </td>
                          <td className="py-2 font-mono font-bold text-slate-900">{p.time}</td>
                          <td className="py-2 text-slate-600">{p.device}</td>
                          <td className="py-2 text-slate-600">{p.location}</td>
                          <td className="py-2 text-slate-600">{p.source}</td>
                          <td className="py-2 text-right">
                            <span className="px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsPunchModalOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Manual Punch
                  </button>
                </div>
              </div>

              {/* Exceptions Table (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Exceptions (16 May 2024)</h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="pb-1.5">Exception Type</th>
                        <th className="pb-1.5">Details</th>
                        <th className="pb-1.5">Duration</th>
                        <th className="pb-1.5">Severity</th>
                        <th className="pb-1.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {exceptions.map((ex) => (
                        <tr key={ex.id} className="hover:bg-slate-50/60">
                          <td className="py-2 font-bold text-slate-900">{ex.type}</td>
                          <td className="py-2 text-slate-600 truncate max-w-[130px]">{ex.details}</td>
                          <td className="py-2 font-mono font-semibold text-slate-800">{ex.duration}</td>
                          <td className="py-2">
                            <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              {ex.severity}
                            </span>
                          </td>
                          <td className="py-2 text-right">
                            <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              {ex.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t border-slate-100 text-right">
                  <button
                    onClick={() => setActiveTab("regularization")}
                    className="text-[10px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    View All Exceptions →
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Leave/Holiday, Overtime, Approvals, Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. Leave / Holiday */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Leave / Holiday</h4>
                </div>

                <div className="my-auto text-center py-6 space-y-2">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <p className="text-xs text-muted-foreground">No leave or holiday for this date.</p>
                </div>
              </div>

              {/* 2. Overtime */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Overtime</h4>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Overtime Eligible</span>
                    <span className="font-semibold text-slate-900">Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Overtime After</span>
                    <span className="font-mono font-semibold text-slate-800">18:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Overtime Hours</span>
                    <span className="font-mono font-bold text-emerald-700">00:57</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Overtime Type</span>
                    <span className="text-slate-800">Regular Overtime</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-1">
                    <span className="text-slate-500">Overtime Status</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700">
                      Pending Approval
                    </span>
                  </div>
                </div>

                <button onClick={() => setActiveTab("overtime")} className="text-[10px] font-semibold text-primary hover:underline cursor-pointer pt-1">
                  View Overtime Details →
                </button>
              </div>

              {/* 3. Approvals */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Approvals</h4>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Submitted by Employee
                    </span>
                    <span className="font-mono text-slate-500">16 May 2024 19:00</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Clock className="h-3.5 w-3.5 text-blue-600" />
                      Reporting Manager
                    </span>
                    <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-blue-50 text-blue-700">
                      Pending
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-slate-200 ml-1 mr-0.5" /> HR Approval
                    </span>
                    <span>-</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-slate-200 ml-1 mr-0.5" /> Payroll Sync
                    </span>
                    <span>-</span>
                  </div>
                </div>

                <button onClick={() => setActiveTab("regularization")} className="text-[10px] font-semibold text-primary hover:underline cursor-pointer pt-1">
                  View Approval History →
                </button>
              </div>

              {/* 4. Quick Actions */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Quick Actions</h4>
                </div>

                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsRegularizationModalOpen(true)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-primary hover:bg-slate-50/70 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <CheckSquare className="h-3.5 w-3.5 text-primary" />
                    Apply for Regularization
                  </button>

                  <Link
                    to="/management/hrm-management/leave-management"
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                      Apply for Leave
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">Leave Module &rarr;</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => toast.info("Apply for Comp Off form opened")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-primary hover:bg-blue-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-primary" />
                    Apply for Comp Off
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Monthly attendance sheet preview")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-blue-600 hover:bg-blue-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-blue-600" />
                    View Monthly Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PUNCH DETAILS */}
        {activeTab === "punches" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FingerprintIcon className="h-4 w-4 text-primary" />
                Raw Attendance Punch Logs
              </h3>
              <button
                type="button"
                onClick={() => setIsPunchModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Punch
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Punch Type</th>
                    <th className="py-2.5 px-3">Punch Time</th>
                    <th className="py-2.5 px-3">Device / Machine</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Capture Mode</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {punches.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{p.type}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{p.time}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono">{p.device}</td>
                      <td className="py-2.5 px-3 text-slate-600">{p.location}</td>
                      <td className="py-2.5 px-3 text-slate-600">{p.source}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REGULARIZATION & EXCEPTIONS */}
        {activeTab === "regularization" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-primary" />
                  Attendance Regularization & Exceptions
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Missed punch regularization requests, late mark justifications, and on-duty approvals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRegularizationModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Apply Regularization
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reason / Justification</th>
                    <th className="py-2.5 px-3">Approver</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">16 May 2024</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Late Mark (09:38)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">Metro signal disruption between Gandhipuram & Tech Park</td>
                    <td className="py-3 px-3 text-slate-600">Arun Kumar (Engineering Manager)</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Pending Approval
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">08 May 2024</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-primary border border-blue-200">
                        On Duty / Client Visit
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">EV Fleet fast-charger site inspection at Pollachi Depot</td>
                    <td className="py-3 px-3 text-slate-600">Arun Kumar (Engineering Manager)</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Approved
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: OVERTIME & COMP OFF */}
        {activeTab === "overtime" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Timer className="h-4 w-4 text-emerald-600" />
                  Overtime Tracking & Compensatory Off Ledger
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Overtime calculations, multiplier rates, accumulated hours, and compensatory off grant balance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Comp Off request submitted")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Claim Comp Off
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="text-muted-foreground text-[11px] font-semibold">Overtime Rate & Eligibility</div>
                <div className="text-lg font-bold font-mono text-slate-900">1.5x Hourly CTC</div>
                <div className="text-[11px] text-emerald-700 font-semibold">Eligible for Weekend & After-Shift Overtime</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="text-muted-foreground text-[11px] font-semibold">Accumulated Overtime (May)</div>
                <div className="text-lg font-bold font-mono text-primary">06 hrs 45 mins</div>
                <div className="text-[11px] text-slate-500">3 Sessions Logged</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="text-muted-foreground text-[11px] font-semibold">Comp Off Balance</div>
                <div className="text-lg font-bold font-mono text-primary">2.0 Days Available</div>
                <div className="text-[11px] text-slate-500">Valid until 30 Jun 2024</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MONTHLY SUMMARY */}
        {activeTab === "monthly" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Monthly Attendance & Muster Roll Summary (May 2024)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Consolidated monthly attendance summary, presence percentage, and payroll sync metrics.
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Monthly attendance report downloaded")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Export Monthly Roll
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-semibold">Present Days</span>
                <div className="text-base font-bold font-mono text-emerald-900 mt-1">22.0 Days</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] text-blue-800 font-semibold">Weekly Offs</span>
                <div className="text-base font-bold font-mono text-blue-900 mt-1">4.0 Days</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] text-amber-800 font-semibold">Paid Leave</span>
                <div className="text-base font-bold font-mono text-amber-900 mt-1">1.0 Day</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] text-primary font-semibold">Comp Off Used</span>
                <div className="text-base font-bold font-mono text-blue-900 mt-1">0.0 Days</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 font-semibold">Loss of Pay (LOP)</span>
                <div className="text-base font-bold font-mono text-slate-800 mt-1">0.0 Days</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] text-primary font-semibold">Total Payable</span>
                <div className="text-base font-bold font-mono text-blue-900 mt-1">27.0 / 27 Days</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Manual Punch Entry */}
      {isPunchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Add Manual Punch
              </h3>
              <button
                type="button"
                onClick={() => setIsPunchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPunch} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Punch Type *</label>
                <select
                  value={punchType}
                  onChange={(e) => setPunchType(e.target.value as PunchRecord["type"])}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white"
                >
                  <option value="Check In">Check In</option>
                  <option value="Break Start">Break Start</option>
                  <option value="Break End">Break End</option>
                  <option value="Check Out">Check Out</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Time (HH:MM) *</label>
                <input
                  type="time"
                  required
                  value={punchTime}
                  onChange={(e) => setPunchTime(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPunchModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer"
                >
                  Record Punch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Apply for Regularization */}
      {isRegularizationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                Apply for Regularization
              </h3>
              <button
                type="button"
                onClick={() => setIsRegularizationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApplyRegularization} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Request Type *</label>
                <select
                  value={regType}
                  onChange={(e) => setRegType(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white"
                >
                  <option value="Late Mark Correction">Late Mark Correction (09:38)</option>
                  <option value="Early Out Correction">Early Out Correction (18:55)</option>
                  <option value="Missing Punch">Missing Punch</option>
                  <option value="On Duty / Field Visit">On Duty / Field Visit</option>
                  <option value="Work From Home">Work From Home</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Justification *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the reason for regularization..."
                  value={regReason}
                  onChange={(e) => setRegReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegularizationModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function FingerprintIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M2 12a10 10 0 0 1 18-6" />
      <path d="M2 16h.01" />
      <path d="M21.8 16c.2-2 .131-5.354 0-6" />
      <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
      <path d="M8.65 22c.21-.66.45-1.32.57-2" />
      <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
    </svg>
  );
}
