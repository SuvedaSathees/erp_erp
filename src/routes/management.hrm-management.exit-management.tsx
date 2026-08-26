import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
  UserCheck2,
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
  Coffee,
  CheckCheck,
  FileDown,
  Heart,
  Landmark,
  ArrowDownCircle,
  Banknote,
  Coins,
  Settings,
  Rocket,
  ThumbsUp,
  ThumbsDown,
  Plane,
  Car,
  Hotel,
  Receipt,
  Navigation,
  FileCode,
  StickyNote,
  HeartHandshake,
  Flame,
  Hospital,
  Stethoscope,
  Smile,
  LogOut as ExitIcon,
  KeyRound,
  FileCheck2,
  Smartphone,
  CreditCard as CardIcon,
  ShieldOff,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/exit-management")({
  head: () => ({
    meta: [
      { title: "Exit Management · HRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Exit Management Form manages the complete employee separation lifecycle from resignation / termination → exit initiation → notice period → handover → clearance → exit interview → asset return → knowledge transfer → final settlement → access deactivation → relieving documents → closure → alumni management → analytics.",
      },
    ],
  }),
  component: ExitManagementPage,
});

// --- Data Models ---

const ASSETS_LIST = [
  { type: "Laptop", id: "LT-00045", date: "10 Jan 2022", status: "Returned" },
  { type: "Mobile Phone", id: "MB-00123", date: "10 Jan 2022", status: "Returned" },
  { type: "Access Card", id: "AC-00456", date: "10 Jan 2022", status: "Pending" },
  { type: "ID Card", id: "ID-000125", date: "10 Jan 2022", status: "Pending" },
  { type: "Software Token", id: "ST-00078", date: "10 Jan 2022", status: "Pending" },
];

const CLEARANCE_ITEMS = [
  { name: "HR Clearance", status: "Completed" },
  { name: "Finance Clearance", status: "In Progress" },
  { name: "IT Clearance", status: "Pending" },
  { name: "Asset Clearance", status: "In Progress" },
  { name: "Admin Clearance", status: "Completed" },
  { name: "Project Clearance", status: "Pending" },
  { name: "Library Clearance", status: "Completed" },
  { name: "Security Clearance", status: "Pending" },
];

export function ExitManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Modals
  const [isNewExitModalOpen, setIsNewExitModalOpen] = useState(false);
  const [isClearanceModalOpen, setIsClearanceModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppShell
      title="Exit Management"
      breadcrumb="Management > HRM Management > Exit Management"
      description="The Exit Management Form manages the complete employee separation lifecycle from resignation / termination → exit initiation → notice period → handover → clearance → exit interview → asset return → knowledge transfer → final settlement → access deactivation → relieving documents → closure → alumni management → analytics."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Document Exit Icon */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Exit Management Form
              </h2>
            </div>

            {/* Top Action Buttons & Status Badge */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsNewExitModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                New Exit Request
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-slate-600" />
                Print
              </button>
              <button
                type="button"
                onClick={() => toast.success("Exit clearance records exported")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.info("More exit tools opened")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                More
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <div className="flex items-center gap-1 pl-2 text-xs font-semibold text-slate-600">
                <span>Status :</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Notice Period
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Exit Requisition Header (Clean enterprise layout, no profile photos, no stars) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
          {/* Top Row Meta Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Exit Number</span>
              <div className="font-mono font-bold text-slate-900 text-sm truncate">EX-2024-00125</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Exit Type</span>
              <div className="font-semibold text-slate-900 text-sm truncate">Voluntary Resignation</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Exit Reason</span>
              <div className="font-semibold text-slate-900 text-sm truncate">Career Growth / Opportunity</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Notice Period</span>
              <div className="font-bold text-slate-900 text-sm truncate">30 Days</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Request Date</span>
              <div className="font-mono font-semibold text-slate-900 text-sm truncate">01 Jun 2024</div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/80 space-y-0.5">
              <span className="text-[10px] text-rose-800 font-semibold uppercase tracking-wider">Last Working Day</span>
              <div className="font-mono font-bold text-rose-700 text-sm truncate">30 Jun 2024</div>
            </div>
          </div>

          {/* Bottom Row Meta Strip */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div>
              <div className="text-[10px] text-muted-foreground">Date of Joining</div>
              <div className="font-semibold text-slate-900 font-mono">10 Jan 2022</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Notice Period</div>
              <div className="font-bold text-slate-900 font-mono">30 Days</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Rehire Eligible</div>
              <div className="mt-0.5 flex items-center gap-1 text-emerald-700 font-bold text-xs">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Yes
              </div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Exit Risk</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-amber-700 font-bold text-xs">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Medium
              </div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Reporting Manager</div>
              <div className="font-bold text-slate-900">Arun Kumar</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Department</div>
              <div className="font-semibold text-slate-900">Engineering</div>
            </div>
          </div>
        </div>

        {/* 6-Stage Milestone Progress Tracker */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
          <div className="py-2">
            <div className="flex items-start justify-between relative">
              <div className="absolute top-3 left-6 right-6 h-0.5 bg-slate-200 z-0" />
              <div className="absolute top-3 left-6 w-1/3 h-0.5 bg-emerald-600 z-0" />

              {[
                { step: "1", title: "Exit Initiated", date: "01 Jun 2024", done: true },
                { step: "2", title: "Notice Period", date: "01 - 30 Jun", active: true },
                { step: "3", title: "Handover & KT", date: "Pending", future: true },
                { step: "4", title: "Clearance", date: "Pending", future: true },
                { step: "5", title: "Exit Interview", date: "Pending", future: true },
                { step: "6", title: "Final Settlement", date: "30 Jun 2024", future: true },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center relative z-10 max-w-[85px] text-center">
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs shrink-0",
                      s.done
                        ? "bg-emerald-600 text-white ring-4 ring-white"
                        : s.active
                          ? "bg-blue-600 text-white ring-4 ring-blue-100 ring-offset-2 ring-offset-white"
                          : "bg-white border-2 border-slate-300 text-slate-400 ring-4 ring-white",
                    )}
                  >
                    {s.done ? "✓" : s.step}
                  </div>
                  <div className="text-[10px] font-bold text-slate-900 mt-2.5 text-center leading-tight">
                    {s.title}
                  </div>
                  {s.date && <div className="text-[8px] text-muted-foreground text-center font-mono mt-0.5">{s.date}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Working Grid (Exact match to reference screenshot) */}
        <div className="space-y-6">
          {/* Row 1: Exit Request Details, Notice Period Details, Handover & Knowledge Transfer, Clearance Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Exit Request Details */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  Exit Request Details
                </h4>
              </div>

              <div className="space-y-1.5 text-[10px]">
                <div>
                  <span className="text-slate-400">Request Type</span>
                  <div className="font-semibold text-slate-900">Employee Resignation</div>
                </div>
                <div>
                  <span className="text-slate-400">Detailed Reason</span>
                  <div className="text-slate-700">Received a better career opportunity with higher growth.</div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="text-slate-400">Requested Last Working Date</span>
                    <div className="font-bold text-slate-900 font-mono">30 Jun 2024</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Notice Period</span>
                    <div className="font-bold text-slate-900 font-mono">30 Days</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="text-slate-400">Early Release Requested</span>
                    <div className="font-semibold text-slate-900">No</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Immediate Release Requested</span>
                    <div className="font-semibold text-slate-900">No</div>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Employee Comments</span>
                  <div className="text-slate-600 italic">I appreciate the support and opportunities provided during my tenure.</div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Supporting Document</span>
                  <button
                    type="button"
                    onClick={() => toast.success("Downloading Resignation_Letter.pdf")}
                    className="inline-flex items-center gap-1 text-[9px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    <Paperclip className="h-3 w-3" /> Resignation_Letter.pdf <Download className="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Notice Period Details */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Notice Period Details
                </h4>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Notice Start Date</span>
                  <span className="font-mono font-bold text-slate-900">03 Jun 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Notice End Date</span>
                  <span className="font-mono font-bold text-slate-900">02 Jul 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Notice Period (Required)</span>
                  <span className="font-mono font-bold text-slate-900">30 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Notice Served</span>
                  <span className="font-mono font-bold text-emerald-700">27 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Remaining Notice</span>
                  <span className="font-mono font-bold text-amber-700">3 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Notice Waiver</span>
                  <span className="font-mono font-bold text-slate-900">0 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Leave During Notice</span>
                  <span className="font-mono font-bold text-slate-900">2 Days</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-slate-100">
                  <span className="text-slate-800">Last Working Date</span>
                  <span className="font-mono text-rose-600">30 Jun 2024</span>
                </div>
              </div>

              <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-800 text-[9px] font-medium">
                Employee is in notice period. Expected exit on 30 Jun 2024.
              </div>
            </div>

            {/* 3. Handover & Knowledge Transfer */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  Handover & Knowledge Transfer
                </h4>
              </div>

              <div className="flex items-center justify-between gap-2">
                {/* Circular Gauge */}
                <div className="h-20 w-20 relative shrink-0 flex items-center justify-center">
                  <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-emerald-600" strokeDasharray="76, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="font-mono text-xs font-extrabold text-slate-900">76%</span>
                    <span className="text-[6px] text-muted-foreground">Completed</span>
                  </div>
                </div>

                <div className="space-y-1 text-[9px] flex-1">
                  {[
                    { name: "Project Handover", pct: 80 },
                    { name: "Document Handover", pct: 100 },
                    { name: "Knowledge Transfer", pct: 70 },
                    { name: "Client Handover", pct: 60 },
                    { name: "System Handover", pct: 100 },
                  ].map((h) => (
                    <div key={h.name} className="flex justify-between items-center">
                      <span className="text-slate-600 truncate max-w-[80px]">{h.name}</span>
                      <div className="flex items-center gap-1">
                        <div className="h-1 w-10 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${h.pct}%` }} />
                        </div>
                        <span className="font-mono font-bold text-slate-800">{h.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => toast.info("Viewing handover transition plan")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                View Handover Plan →
              </button>
            </div>

            {/* 4. Clearance Status */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Clearance Status
                </h4>
              </div>

              <div className="space-y-1 text-[10px]">
                {CLEARANCE_ITEMS.map((c) => (
                  <div key={c.name} className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-slate-600">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          c.status === "Completed"
                            ? "bg-emerald-600"
                            : c.status === "In Progress"
                              ? "bg-amber-500"
                              : "bg-slate-300",
                        )}
                      />
                      {c.name}
                    </span>
                    <span
                      className={cn(
                        "px-1.5 py-0.2 rounded-md font-bold text-[8px]",
                        c.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : c.status === "In Progress"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-600",
                      )}
                    >
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>

              <button onClick={() => setIsClearanceModalOpen(true)} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                View Clearance Details →
              </button>
            </div>
          </div>

          {/* Row 2: Assets to be Returned, Final Settlement Summary, Exit Interview, Important Dates & Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Assets to be Returned */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Laptop className="h-3.5 w-3.5 text-primary" />
                  Assets to be Returned
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[9px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                      <th className="pb-1">Asset Type</th>
                      <th className="pb-1">Asset ID</th>
                      <th className="pb-1">Issued Date</th>
                      <th className="pb-1 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ASSETS_LIST.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/60">
                        <td className="py-1.5 font-medium text-slate-900">{a.type}</td>
                        <td className="py-1.5 font-mono text-slate-500">{a.id}</td>
                        <td className="py-1.5 font-mono text-slate-500">{a.date}</td>
                        <td className="py-1.5 text-right">
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-md font-bold text-[8px]",
                              a.status === "Returned"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700",
                            )}
                          >
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button onClick={() => toast.info("Complete asset inventory records")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                View All Assets →
              </button>
            </div>

            {/* 2. Final Settlement Summary */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Banknote className="h-3.5 w-3.5 text-emerald-600" />
                  Final Settlement Summary
                </h4>
              </div>

              <div className="space-y-1 text-[9px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Salary Payable</span>
                  <span className="font-mono font-bold text-slate-900">₹ 82,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Leave Encashment</span>
                  <span className="font-mono font-bold text-slate-900">₹ 18,500.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bonus / Incentive</span>
                  <span className="font-mono font-bold text-slate-900">₹ 10,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reimbursements</span>
                  <span className="font-mono font-bold text-slate-900">₹ 7,200.00</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-0.5 border-t border-slate-100">
                  <span>Gross Payable</span>
                  <span className="font-mono">₹ 1,17,700.00</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Loan Recovery</span>
                  <span className="font-mono font-bold">- ₹ 15,000.00</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Notice Buyout Recovery</span>
                  <span className="font-mono font-bold">- ₹ 5,000.00</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Asset Damage Recovery</span>
                  <span className="font-mono font-bold">- ₹ 2,000.00</span>
                </div>
                <div className="flex justify-between font-extrabold text-emerald-700 pt-1 border-t border-slate-200 text-[10px]">
                  <span>Net Settlement</span>
                  <span className="font-mono">₹ 95,700.00</span>
                </div>
              </div>

              <button onClick={() => toast.info("Detailed settlement statement")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                View Settlement Details →
              </button>
            </div>

            {/* 3. Exit Interview */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  Exit Interview
                </h4>
              </div>

              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Interview Date</span>
                  <span className="font-mono font-bold text-slate-900">27 Jun 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Interviewer</span>
                  <span className="font-bold text-slate-900">Priya Nair (HR Manager)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Overall Experience</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">4.0 / 5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Would Recommend Company</span>
                  <span className="font-bold text-emerald-700">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Would Rejoin</span>
                  <span className="font-semibold text-slate-700">Maybe</span>
                </div>
                <div>
                  <span className="text-slate-400">Key Feedback</span>
                  <div className="text-slate-600 italic text-[9px] mt-0.5">
                    "Good learning culture. Scope for improvement in career growth clarity."
                  </div>
                </div>
              </div>

              <button onClick={() => setIsInterviewModalOpen(true)} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                View Interview Report →
              </button>
            </div>

            {/* 4. Important Dates & Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-500" /> Important Dates
                  </h4>
                </div>

                <div className="space-y-0.5 text-[8.5px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Notice Start Date</span>
                    <span className="font-mono font-bold text-slate-800">03 Jun 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Notice End Date</span>
                    <span className="font-mono font-bold text-slate-800">02 Jul 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Working Date</span>
                    <span className="font-mono font-bold text-slate-800">30 Jun 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Exit Interview Date</span>
                    <span className="font-mono font-bold text-slate-800">27 Jun 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Settlement Date</span>
                    <span className="font-mono font-bold text-slate-800">01 Jul 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Exit Effective Date</span>
                    <span className="font-mono font-bold text-slate-800">30 Jun 2024</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-1">
                  <h4 className="text-xs font-bold text-slate-800">Quick Actions</h4>
                </div>

                <div className="grid grid-cols-3 gap-1 text-[8.5px]">
                  <button
                    type="button"
                    onClick={() => toast.info("Handover checklist updated")}
                    className="p-1 rounded-md border border-slate-100 hover:border-primary hover:bg-slate-50 text-slate-700 font-semibold text-center cursor-pointer"
                  >
                    Update Handover
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsClearanceModalOpen(true)}
                    className="p-1 rounded-md border border-slate-100 hover:border-blue-600 hover:bg-blue-50 text-slate-700 font-semibold text-center cursor-pointer"
                  >
                    Start Clearance
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsInterviewModalOpen(true)}
                    className="p-1 rounded-md border border-slate-100 hover:border-purple-600 hover:bg-purple-50 text-slate-700 font-semibold text-center cursor-pointer"
                  >
                    Schedule Interview
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success("Settlement statement computed")}
                    className="p-1 rounded-md border border-slate-100 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 font-semibold text-center cursor-pointer"
                  >
                    Process Settlement
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.error("System access revoked")}
                    className="p-1 rounded-md border border-slate-100 hover:border-rose-600 hover:bg-rose-50 text-rose-700 font-semibold text-center cursor-pointer"
                  >
                    Revoke Access
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success("Relieving & Experience letters generated")}
                    className="p-1 rounded-md border border-slate-100 hover:border-cyan-600 hover:bg-cyan-50 text-slate-700 font-semibold text-center cursor-pointer"
                  >
                    Generate Docs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Meta Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-200">
          <div>Created by Sankaranarayanan R on 01 Jun 2024 10:15 AM</div>
          <div className="flex items-center gap-1">
            Last Updated by Priya Nair on 27 Jun 2024 04:30 PM
            <RefreshCw className="h-3 w-3 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Modal: New Exit Request */}
      {isNewExitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ExitIcon className="h-4 w-4 text-primary" />
                Initiate Employee Exit Request
              </h3>
              <button
                type="button"
                onClick={() => setIsNewExitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewExitModalOpen(false);
                toast.success("Exit initiation request submitted to HR & Manager.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exit Type *</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Resignation</option>
                  <option>Retirement</option>
                  <option>Contract Completion</option>
                  <option>Mutual Separation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Exit Reason *</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Better Opportunity</option>
                  <option>Higher Compensation</option>
                  <option>Career Growth / Role Change</option>
                  <option>Relocation / Personal</option>
                  <option>Higher Education</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Request Date</label>
                  <input
                    type="date"
                    required
                    defaultValue="2024-06-01"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requested LWD</label>
                  <input
                    type="date"
                    required
                    defaultValue="2024-06-30"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewExitModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer"
                >
                  Submit Exit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Department Clearance */}
      {isClearanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Department Clearance Sign-Off
              </h3>
              <button
                type="button"
                onClick={() => setIsClearanceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsClearanceModalOpen(false);
                toast.success("Department clearance sign-off recorded.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clearance Department *</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>IT & Systems</option>
                  <option>Finance & Accounts</option>
                  <option>Asset Management</option>
                  <option>Project Engineering</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sign-Off Status *</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Completed (No Outstanding)</option>
                  <option>In Progress (Pending Handover)</option>
                  <option>Recovery Required</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Remarks / Checklist notes</label>
                <textarea
                  rows={2}
                  defaultValue="All physical and digital assets verified and returned."
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClearanceModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold cursor-pointer"
                >
                  Sign Off Clearance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Exit Interview */}
      {isInterviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-600" />
                Exit Interview Record
              </h3>
              <button
                type="button"
                onClick={() => setIsInterviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsInterviewModalOpen(false);
                toast.success("Exit interview responses saved.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Overall Company Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  defaultValue={4}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Feedback & Reflections *</label>
                <textarea
                  rows={3}
                  defaultValue="Good learning culture. Scope for improvement in career growth clarity."
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInterviewModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-semibold cursor-pointer"
                >
                  Save Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default ExitManagementPage;

