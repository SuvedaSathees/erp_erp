import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { hrmManagementService } from "@/services";
import { AppShell } from "@/components/erp/AppShell";
import { HrmManagementTabBar } from "@/components/erp/HrmManagementTabBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Heart,
  Landmark,
  BadgeCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";

export const Route = createFileRoute("/management/hrm-management/employee-management")({
  head: () => ({
    meta: [
      { title: "Employee Management · HRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Employee Records Form is the central employee master and 360° HR record. It connects personal identity, employment, organization, compensation, attendance, leave, performance, skills, training, assets, documents, compliance, payroll, career, and separation into one employee record.",
      },
    ],
  }),
  component: EmployeeManagementPage,
});

// --- Types & Data Models ---

export interface EmployeeProfile {
  employeeId: string;
  employeeNumber: string;
  name: string;
  photo: string;
  designation: string;
  department: string;
  status: "Active" | "On Leave" | "Suspended" | "Resigned" | "Notice Period" | "Separated" | "Retired";
  officialEmail: string;
  mobile: string;
  dob: string;
  age: number;
  location: string;
  joiningDate: string;
  totalExperience: string;
  currentGrade: string;
  annualCTC: string;
  businessUnit: string;
  reportingManager: { name: string; designation: string; avatar: string };
  employmentType: string;
  nextReviewDate: string;
}

const INITIAL_PROFILE: EmployeeProfile = {
  employeeId: "EMP-000125",
  employeeNumber: "MAG/EMP/2023/125",
  name: "Sankaranarayanan R",
  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  designation: "Senior Mechanical Engineer",
  department: "Engineering",
  status: "Active",
  officialEmail: "sankar.r@magnertia.com",
  mobile: "+91 98765 43210",
  dob: "27 Jul 1996",
  age: 27,
  location: "Coimbatore",
  joiningDate: "01 Aug 2023",
  totalExperience: "5.2 Years",
  currentGrade: "G4",
  annualCTC: "₹ 12,50,000",
  businessUnit: "Product Development",
  reportingManager: {
    name: "Arun Kumar",
    designation: "Engineering Manager",
    avatar: "",
  },
  employmentType: "Full Time",
  nextReviewDate: "01 Oct 2024",
};

const ATTENDANCE_PIE = [
  { name: "Present", value: 22, color: "#10B981" },
  { name: "Half Day", value: 1, color: "#2563EB" },
  { name: "Absent", value: 0, color: "#EF4444" },
  { name: "Leave", value: 2, color: "#F59E0B" },
];

const SKILLS_PIE = [
  { name: "Technical", value: 10, color: "#2563EB" },
  { name: "Functional", value: 5, color: "#10B981" },
  { name: "Behavioral", value: 2, color: "#F59E0B" },
  { name: "Other", value: 1, color: "#64748B" },
];

const LEAVE_BALANCES = [
  { type: "Casual Leave", entitlement: 12.0, balance: 6.5, icon: FolderOpen, color: "text-emerald-600 bg-emerald-50" },
  { type: "Earned Leave", entitlement: 18.0, balance: 10.0, icon: Calendar, color: "text-amber-600 bg-amber-50" },
  { type: "Sick Leave", entitlement: 12.0, balance: 8.0, icon: Heart, color: "text-rose-600 bg-rose-50" },
  { type: "Comp Off", entitlement: 5.0, balance: 2.0, icon: Clock, color: "text-blue-600 bg-blue-50" },
];

const RECENT_DOCUMENTS = [
  { name: "Aadhaar Card", type: "Identity Proof", uploadDate: "01 Aug 2023", status: "Verified" },
  { name: "PAN Card", type: "Identity Proof", uploadDate: "01 Aug 2023", status: "Verified" },
  { name: "Degree Certificate", type: "Education", uploadDate: "02 Aug 2023", status: "Verified" },
  { name: "Experience Letter", type: "Experience", uploadDate: "02 Aug 2023", status: "Verified" },
  { name: "Offer Letter", type: "Contract", uploadDate: "28 Jul 2023", status: "Verified" },
];

const ASSIGNED_ASSETS = [
  { name: "Dell Laptop", type: "Laptop", assetNumber: "AST-LAP-1123", issuedOn: "01 Aug 2023", status: "Issued" },
  { name: "iPhone 14", type: "Mobile Phone", assetNumber: "AST-MOB-2045", issuedOn: "01 Aug 2023", status: "Issued" },
  { name: "ID Card", type: "Access Card", assetNumber: "AST-ID-3030", issuedOn: "01 Aug 2023", status: "Issued" },
  { name: "Logitech Mouse", type: "Peripheral", assetNumber: "AST-PER-112", issuedOn: "01 Aug 2023", status: "Issued" },
  { name: "Workstation", type: "Equipment", assetNumber: "AST-WS-045", issuedOn: "01 Aug 2023", status: "Issued" },
];

export default function EmployeeManagementPage() {
  const employeesQuery = useQuery({
    queryKey: ["hrm", "employees"],
    queryFn: () => hrmManagementService.fetchEmployees(),
  });

  const [profile, setProfile] = useState<EmployeeProfile>(INITIAL_PROFILE);
  const [dbApplied, setDbApplied] = useState(false);

  useEffect(() => {
    const list = employeesQuery.data as any[] | undefined;
    if (list && list.length > 0 && !dbApplied) {
      const e = list[0];
      setProfile((prev) => ({
        ...prev,
        employeeId: e.id,
        employeeNumber: e.employeeCode ?? prev.employeeNumber,
        name: e.fullName ?? prev.name,
        designation: e.designation ?? prev.designation,
        department: e.department ?? prev.department,
        status: e.status ?? prev.status,
        officialEmail: e.email ?? prev.officialEmail,
        location: e.location ?? prev.location,
        joiningDate: e.joiningDate
          ? new Date(e.joiningDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
          : prev.joiningDate,
        annualCTC: e.annualCTC
          ? `₹ ${Number(e.annualCTC).toLocaleString("en-IN")}`
          : prev.annualCTC,
      }));
      setDbApplied(true);
    }
  }, [employeesQuery.data, dbApplied]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // New Employee Form State
  const [newEmployeeForm, setNewEmployeeForm] = useState({
    name: "",
    designation: "Software Engineer",
    department: "Engineering",
    officialEmail: "",
    mobile: "",
    location: "Coimbatore",
    joiningDate: new Date().toISOString().slice(0, 10),
    annualCTC: "₹ 9,50,000",
    employmentType: "Full Time",
    reportingManager: "Arun Kumar",
    currentGrade: "G3",
    businessUnit: "Product Development",
  });

  // Send Email Form State
  const [emailForm, setEmailForm] = useState({
    recipient: INITIAL_PROFILE.officialEmail,
    subject: `Employee Master Record - [${INITIAL_PROFILE.employeeId}] ${INITIAL_PROFILE.name}`,
    message: "Dear Team,\n\nPlease find attached the official 360° Employee Master Record dossier including employment identity, organization hierarchy, compensation, compliance, and asset allocations.\n\nBest regards,\nHR Operations Team",
    includeCompensation: true,
    includeAssets: true,
  });

  // Edit Profile Form State
  const [editForm, setEditForm] = useState<EmployeeProfile>(INITIAL_PROFILE);

  const handleSave = () => {
    toast.success(`Employee Record ${profile.employeeNumber} saved successfully`, {
      description: "Employee details, compensation, organization and records updated.",
    });
  };

  const handleExportData = (type: "excel" | "pdf") => {
    toast.success(`Employee 360° record exported as ${type.toUpperCase()}`, {
      description: `Downloaded ${profile.employeeId}_${new Date().toISOString().slice(0, 10)}.${type === "excel" ? "xlsx" : "pdf"}`,
    });
  };

  const handleCreateNewEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployeeForm.name.trim()) {
      toast.error("Please enter the employee's full name.");
      return;
    }

    const newEmpId = `EMP-000${Math.floor(130 + Math.random() * 50)}`;
    const newEmpNum = `MAG/EMP/2026/${newEmpId.split("-")[1]}`;

    const createdProfile: EmployeeProfile = {
      employeeId: newEmpId,
      employeeNumber: newEmpNum,
      name: newEmployeeForm.name,
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      designation: newEmployeeForm.designation,
      department: newEmployeeForm.department,
      status: "Active",
      officialEmail: newEmployeeForm.officialEmail || `${newEmployeeForm.name.toLowerCase().replace(/\s+/g, ".")}@magnertia.com`,
      mobile: newEmployeeForm.mobile || "+91 98765 00000",
      dob: "15 May 1998",
      age: 26,
      location: newEmployeeForm.location,
      joiningDate: newEmployeeForm.joiningDate,
      totalExperience: "3.5 Years",
      currentGrade: newEmployeeForm.currentGrade,
      annualCTC: newEmployeeForm.annualCTC,
      businessUnit: newEmployeeForm.businessUnit,
      reportingManager: {
        name: newEmployeeForm.reportingManager,
        designation: "Engineering Manager",
        avatar: "",
      },
      employmentType: newEmployeeForm.employmentType,
      nextReviewDate: "01 Nov 2026",
    };

    setProfile(createdProfile);
    setIsNewEmployeeModalOpen(false);
    toast.success(`Employee ${createdProfile.name} (${createdProfile.employeeId}) onboarded successfully!`, {
      description: `Profile initialized with ${createdProfile.department} department and ${createdProfile.designation} role.`,
    });
  };

  const handleSendEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.recipient.trim()) {
      toast.error("Please provide a recipient email.");
      return;
    }
    setIsEmailModalOpen(false);
    toast.success(`Employee Dossier dispatched to ${emailForm.recipient}!`, {
      description: `Encrypted PDF with checksum verification sent.`,
    });
  };

  const handleSaveEditProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editForm);
    setIsEditModalOpen(false);
    toast.success(`Employee Record ${editForm.employeeId} updated successfully!`);
  };

  return (
    <AppShell
      title="Employee Management"
      breadcrumb="Management > HRM Management > Employee Management"
      description="The Employee Records Form is the central employee master and 360° HR record. It connects personal identity, employment, organization, compensation, attendance, leave, performance, skills, training, assets, documents, compliance, payroll, career, and separation into one employee record."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Employee Records Form
              </h2>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setNewEmployeeForm({
                    name: "",
                    designation: "Software Engineer",
                    department: "Engineering",
                    officialEmail: "",
                    mobile: "",
                    location: "Coimbatore",
                    joiningDate: new Date().toISOString().slice(0, 10),
                    annualCTC: "₹ 9,50,000",
                    employmentType: "Full Time",
                    reportingManager: "Arun Kumar",
                    currentGrade: "G3",
                    businessUnit: "Product Development",
                  });
                  setIsNewEmployeeModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                New Employee
              </button>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmailForm((prev) => ({
                    ...prev,
                    recipient: profile.officialEmail,
                    subject: `Employee Master Record - [${profile.employeeId}] ${profile.name}`,
                  }));
                  setIsEmailModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                Send Email
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
                  >
                    More
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1.5 text-xs">
                  <DropdownMenuItem onClick={() => handleExportData("excel")} className="cursor-pointer">
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
                    Export Full Dossier (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportData("pdf")} className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4 text-rose-600" />
                    Export Official Profile (.pdf)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsIdCardModalOpen(true)} className="cursor-pointer">
                    <BadgeCheck className="mr-2 h-4 w-4 text-primary" />
                    Generate Digital ID Card
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsAuditModalOpen(true)} className="cursor-pointer">
                    <Activity className="mr-2 h-4 w-4 text-amber-600" />
                    View HR Audit Trail
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      const nextStatus = profile.status === "Active" ? "Notice Period" : "Active";
                      setProfile((p) => ({ ...p, status: nextStatus }));
                      toast.info(`Employee status updated to "${nextStatus}"`);
                    }}
                    className="text-rose-600 cursor-pointer"
                  >
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    {profile.status === "Active" ? "Mark as Notice Period" : "Re-activate Profile"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                type="button"
                onClick={() => {
                  setEditForm(profile);
                  setIsEditModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* 1. Employee Master Header & Profile Banner (Premium Enterprise Card Layout) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
          {/* Top Identity Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{profile.name}</h3>
                <BadgeCheck className="h-5 w-5 text-blue-600 shrink-0" />
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-700">
                {profile.designation} • <span className="text-primary font-bold">{profile.department} Department</span>
              </div>

              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {profile.officialEmail}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {profile.mobile}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  27 Jul 1996 (Age {profile.age})
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {profile.location}, Tamil Nadu, India
                </span>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-2.5 px-3 rounded-lg bg-slate-50 border border-slate-200 text-right">
                <div className="text-[10px] text-muted-foreground font-semibold">Current Grade</div>
                <div className="text-sm font-bold font-mono text-slate-900">{profile.currentGrade}</div>
              </div>
              <div className="p-2.5 px-3 rounded-lg bg-emerald-50/50 border border-emerald-200 text-right">
                <div className="text-[10px] text-emerald-800 font-semibold">Annual CTC</div>
                <div className="text-sm font-bold font-mono text-emerald-700">{profile.annualCTC}</div>
              </div>
            </div>
          </div>

          {/* Core Metric Cards Grid (6 Clean Distinct Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Employee ID</span>
              <div className="font-mono font-bold text-slate-900 text-sm truncate">{profile.employeeId}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Employee No.</span>
              <div className="font-mono font-bold text-slate-900 text-sm truncate">{profile.employeeNumber}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Joining Date</span>
              <div className="font-semibold text-slate-900 text-sm truncate">{profile.joiningDate}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Experience</span>
              <div className="font-bold text-slate-900 text-sm truncate">{profile.totalExperience}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Grade Band</span>
              <div className="font-bold font-mono text-slate-900 text-sm truncate">{profile.currentGrade} (Executive)</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-0.5">
              <span className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">CTC (Annual)</span>
              <div className="font-mono font-bold text-emerald-700 text-sm truncate">{profile.annualCTC}</div>
            </div>
          </div>

          {/* Bottom Meta Summary Row */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50/50 border border-slate-100">
              <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground">Business Unit</div>
                <div className="font-semibold truncate">{profile.businessUnit}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50/50 border border-slate-100">
              <Layers className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground">Department</div>
                <div className="font-semibold truncate">{profile.department}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50/50 border border-slate-100">
              <UserCheck className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground">Reporting Manager</div>
                <div className="font-semibold truncate">{profile.reportingManager.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50/50 border border-slate-100">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground">Location</div>
                <div className="font-semibold truncate">{profile.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50/50 border border-slate-100">
              <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground">Employment Type</div>
                <div className="font-semibold truncate">{profile.employmentType}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50/50 border border-rose-100">
              <Calendar className="h-4 w-4 text-rose-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground">Next Review</div>
                <div className="font-semibold text-rose-600 truncate">{profile.nextReviewDate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Master 12-Card Grid Layout (No Sub-Tabs, Direct Access) */}
        <div className="space-y-6">
          {/* Row 1: Personal Info, Job & Org, Employment Details, Compensation Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Personal Information */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">1. Personal Information</h4>
                <button onClick={() => setIsEditModalOpen(true)} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                  Edit
                </button>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date of Birth</span>
                  <span className="text-slate-900 font-medium">27 Jul 1996 (Age {profile.age})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gender</span>
                  <span className="text-slate-900 font-medium">Male</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Marital Status</span>
                  <span className="text-slate-900 font-medium">Single</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Blood Group</span>
                  <span className="text-slate-900 font-medium">O+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nationality</span>
                  <span className="text-slate-900 font-medium">Indian</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PAN Number</span>
                  <span className="font-mono font-bold text-slate-800">ABCDE1234F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Aadhaar Number</span>
                  <span className="font-mono font-bold text-slate-800">xxxx xxxx 1234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Personal Email</span>
                  <span className="text-slate-700 truncate max-w-[130px]">sankar.personal@gmail.com</span>
                </div>
              </div>
            </div>

            {/* 2. Job & Organization */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">2. Job & Organization</h4>
                <button onClick={() => setIsEditModalOpen(true)} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                  Edit
                </button>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Job Role</span>
                  <span className="text-slate-900 font-medium">Mechanical Design</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department</span>
                  <span className="text-slate-900 font-medium">Engineering</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Business Unit</span>
                  <span className="text-slate-900 font-medium">Product Development</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Branch</span>
                  <span className="text-slate-900 font-medium">Coimbatore Head Office</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Work Location</span>
                  <span className="text-slate-900 font-medium">Coimbatore</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reporting Manager</span>
                  <span className="text-slate-900 font-medium">{profile.reportingManager.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cost Center</span>
                  <span className="font-mono font-bold text-slate-800">CC-ENG-1001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shift Timing</span>
                  <span className="font-medium text-slate-800">General (09:00 - 18:00)</span>
                </div>
              </div>
            </div>

            {/* 3. Employment Details */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">3. Employment Details</h4>
                <button onClick={() => setIsEditModalOpen(true)} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                  Edit
                </button>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Employment Type</span>
                  <span className="text-slate-900 font-medium">Full Time</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Employee Category</span>
                  <span className="text-slate-900 font-medium">Permanent</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Joining Date</span>
                  <span className="text-slate-900 font-medium">{profile.joiningDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Confirmation Date</span>
                  <span className="text-slate-900 font-medium">01 Feb 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Probation Period</span>
                  <span className="text-slate-900 font-medium">6 Months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Notice Period</span>
                  <span className="text-slate-900 font-medium">90 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Work Mode</span>
                  <span className="text-slate-900 font-medium">Hybrid</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Compensation Summary */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">4. Compensation Summary</h4>
                <button onClick={() => toast.info("Viewing Full Compensation Structure")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                  Breakdown
                </button>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Basic Salary</span>
                  <span className="font-mono font-bold text-slate-900">₹ 6,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">HRA</span>
                  <span className="font-mono font-semibold text-slate-800">₹ 2,40,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Allowances</span>
                  <span className="font-mono font-semibold text-slate-800">₹ 2,10,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Variable Pay</span>
                  <span className="font-mono font-semibold text-slate-800">₹ 1,00,000</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-1">
                  <span className="font-semibold text-slate-800">Annual CTC</span>
                  <span className="font-mono font-extrabold text-emerald-700">₹ 12,50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly CTC</span>
                  <span className="font-mono font-bold text-slate-900">₹ 1,04,167</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pay Grade</span>
                  <span className="font-mono font-bold text-slate-800">G4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Salary Structure</span>
                  <span className="text-slate-700">Eng - Grade 4</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Attendance Overview, Leave Balance, Performance Summary, Skills Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 5. Attendance Overview */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">5. Attendance Overview</h4>
                <span className="text-[10px] text-slate-500">This Month</span>
              </div>

              <div className="h-32 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={ATTENDANCE_PIE}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={52}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {ATTENDANCE_PIE.map((entry, index) => (
                        <Cell key={`att-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-extrabold text-slate-900 font-mono">96%</span>
                  <span className="text-[9px] text-muted-foreground">Present</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 text-[10px]">
                {ATTENDANCE_PIE.map((a) => (
                  <div key={a.name} className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-slate-600 truncate">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: a.color }} />
                      {a.name}
                    </span>
                    <span className="font-mono font-bold">{a.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                <span>Working Days: <strong>25</strong></span>
                <span>Present Days: <strong className="text-emerald-700">23</strong></span>
              </div>
            </div>

            {/* 6. Leave Balance */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">6. Leave Balances</h4>
                <span className="text-[10px] text-slate-500">As on Date</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                  <span>Leave Type</span>
                  <div className="flex gap-4">
                    <span>Entitlement</span>
                    <span>Balance</span>
                  </div>
                </div>

                {LEAVE_BALANCES.map((leave) => (
                  <div key={leave.type} className="flex items-center justify-between p-1.5 rounded-lg border border-slate-100 bg-slate-50/50 text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1 rounded-md", leave.color)}>
                        <leave.icon className="h-3 w-3" />
                      </div>
                      <span className="font-semibold text-slate-800">{leave.type}</span>
                    </div>
                    <div className="flex items-center gap-6 font-mono font-bold">
                      <span className="text-slate-500">{leave.entitlement.toFixed(1)}</span>
                      <span className="text-slate-900">{leave.balance.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[9px] text-muted-foreground text-center pt-1 border-t border-slate-100">
                Financial Year 2024 - 2025
              </div>
            </div>

            {/* 7. Performance Summary */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">7. Performance Summary</h4>
                <span className="text-[10px] text-slate-500">FY 2023-24</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Overall Rating</span>
                  <div className="font-mono font-bold text-slate-900">
                    <span>4.4 / 5</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Goal Achievement</span>
                    <span className="font-mono font-bold text-primary">92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[92%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Competency Score</span>
                    <span className="font-mono font-bold text-emerald-600">4.2 / 5</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[84%]" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[10px]">
                <span className="text-slate-500">Next Review Date</span>
                <span className="font-mono font-bold text-rose-600">{profile.nextReviewDate}</span>
              </div>
            </div>

            {/* 8. Skills Overview */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">8. Skills & Competencies</h4>
                <span className="text-[10px] font-bold text-primary">18 Skills</span>
              </div>

              <div className="h-32 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={SKILLS_PIE}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={52}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {SKILLS_PIE.map((entry, index) => (
                        <Cell key={`skill-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-extrabold text-slate-900 font-mono">18</span>
                  <span className="text-[9px] text-muted-foreground">Competencies</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 text-[10px]">
                {SKILLS_PIE.map((s) => (
                  <div key={s.name} className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-slate-600 truncate">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                      {s.name}
                    </span>
                    <span className="font-mono font-bold">{s.value}</span>
                  </div>
                ))}
              </div>

              <div className="text-[9px] text-slate-500 truncate pt-1 border-t border-slate-100">
                Top: SolidWorks, FEA, CATIA, CFD
              </div>
            </div>
          </div>

          {/* Row 3: Recent Documents, Assigned Assets, Emergency Contact, Important Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 9. Recent Documents */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">9. Document Repository</h4>
                <span className="text-[10px] text-slate-500">4 Files</span>
              </div>

              <div className="space-y-1.5 text-[10px]">
                {RECENT_DOCUMENTS.map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between p-1.5 rounded-md bg-slate-50 border border-slate-100">
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-slate-900 truncate">{doc.name}</div>
                      <div className="text-[9px] text-muted-foreground">{doc.type} • {doc.uploadDate}</div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-[9px] text-muted-foreground text-center pt-1 border-t border-slate-100">
                All mandatory compliance documents verified
              </div>
            </div>

            {/* 10. Assigned Assets */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">10. Assigned Assets</h4>
                <span className="text-[10px] text-slate-500">{ASSIGNED_ASSETS.length} Assets</span>
              </div>

              <div className="space-y-1.5 text-[10px]">
                {ASSIGNED_ASSETS.slice(0, 4).map((asset) => (
                  <div key={asset.name} className="flex items-center justify-between p-1.5 rounded-md bg-slate-50 border border-slate-100">
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-slate-900 truncate">{asset.name}</div>
                      <div className="text-[9px] text-muted-foreground font-mono">{asset.assetNumber} • {asset.issuedOn}</div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                      {asset.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-[9px] text-muted-foreground text-center pt-1 border-t border-slate-100">
                Next asset audit on 15 Nov 2024
              </div>
            </div>

            {/* 11. Emergency Contact */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">11. Emergency Contact</h4>
                <button onClick={() => setIsEditModalOpen(true)} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                  Edit
                </button>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div>
                  <div className="text-[10px] text-muted-foreground">Primary Contact</div>
                  <div className="font-bold text-slate-900">Ravichandran S (Father)</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Mobile Phone</div>
                  <div className="font-mono font-bold text-slate-900">+91 98765 43211</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Alternate Phone</div>
                  <div className="font-mono text-slate-700">+91 98945 67890</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Emergency Address</div>
                  <div className="text-slate-700 text-[10px] leading-tight">Coimbatore, Tamil Nadu, India</div>
                </div>
              </div>

              <div className="text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium text-center border border-emerald-100">
                Verified Contact Info
              </div>
            </div>

            {/* 12. Important Dates */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">12. Important Dates</h4>
                <span className="text-[10px] text-slate-500">Timeline</span>
              </div>

              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Work Anniversary</div>
                    <div className="text-slate-500">01 Aug 2023</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700">
                    9 Months
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Confirmation Date</div>
                    <div className="text-slate-500">01 Feb 2024</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700">
                    Completed
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Next Review Date</div>
                    <div className="text-slate-500">01 Oct 2024</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-primary">
                    in 5 Mos
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Birth Day</div>
                    <div className="text-slate-500">27 Jul 2024</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-pink-50 text-pink-700">
                    in 2 Mos
                  </span>
                </div>
              </div>

              <div className="text-[9px] text-muted-foreground text-center pt-1 border-t border-slate-100">
                Probation successfully completed on 01 Feb 2024
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Modal: New Employee Onboarding Wizard */}
      {isNewEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">New Employee Onboarding Wizard</h3>
                  <p className="text-xs text-slate-500">Initialize a new employee master record in the ERP</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewEmployeeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newEmployeeForm.name}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, name: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={newEmployeeForm.designation}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, designation: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    value={newEmployeeForm.department}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, department: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white cursor-pointer"
                  >
                    <option>Engineering</option>
                    <option>Product Development</option>
                    <option>Manufacturing</option>
                    <option>Human Resources</option>
                    <option>Finance & Accounts</option>
                    <option>Sales & Marketing</option>
                    <option>Quality Assurance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Business Unit</label>
                  <select
                    value={newEmployeeForm.businessUnit}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, businessUnit: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white cursor-pointer"
                  >
                    <option>Product Development</option>
                    <option>Industrial Systems</option>
                    <option>EV Mobility Division</option>
                    <option>Corporate Headquarters</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul.sharma@magnertia.com"
                    value={newEmployeeForm.officialEmail}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, officialEmail: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 12345"
                    value={newEmployeeForm.mobile}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, mobile: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Joining</label>
                  <input
                    type="date"
                    value={newEmployeeForm.joiningDate}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, joiningDate: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Annual CTC (₹)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹ 14,50,000"
                    value={newEmployeeForm.annualCTC}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, annualCTC: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Work Location</label>
                  <select
                    value={newEmployeeForm.location}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, location: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white cursor-pointer"
                  >
                    <option>Coimbatore</option>
                    <option>Bengaluru</option>
                    <option>Chennai</option>
                    <option>Hyderabad</option>
                    <option>Pune</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reporting Manager</label>
                  <select
                    value={newEmployeeForm.reportingManager}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, reportingManager: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white cursor-pointer"
                  >
                    <option>Arun Kumar</option>
                    <option>Sneha Patel</option>
                    <option>Vikramaditya Bose</option>
                    <option>Pooja Hegde</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewEmployeeModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Create Employee Master Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Print Preview Dossier */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Printer className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Print Employee 360° Record</h3>
                  <p className="text-xs text-slate-500">Official HR Master Summary Printout</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Print Document Paper Preview */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4 text-xs font-sans">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="text-sm font-black text-slate-900">MAGNERTIA INDUSTRIAL ERP</div>
                  <div className="text-[10px] text-slate-500">Confidential HR Master Dossier</div>
                </div>
                <div className="text-right font-mono font-bold text-slate-700">
                  {profile.employeeNumber}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div><strong className="text-slate-600">Employee Name:</strong> <span className="font-bold text-slate-900">{profile.name}</span></div>
                <div><strong className="text-slate-600">Employee ID:</strong> <span className="font-mono text-slate-900">{profile.employeeId}</span></div>
                <div><strong className="text-slate-600">Designation:</strong> <span className="text-slate-900">{profile.designation}</span></div>
                <div><strong className="text-slate-600">Department:</strong> <span className="text-slate-900">{profile.department}</span></div>
                <div><strong className="text-slate-600">Official Email:</strong> <span className="text-slate-900">{profile.officialEmail}</span></div>
                <div><strong className="text-slate-600">Mobile Phone:</strong> <span className="text-slate-900">{profile.mobile}</span></div>
                <div><strong className="text-slate-600">Date of Joining:</strong> <span className="text-slate-900">{profile.joiningDate}</span></div>
                <div><strong className="text-slate-600">Annual CTC:</strong> <span className="font-bold text-slate-900">{profile.annualCTC}</span></div>
                <div><strong className="text-slate-600">Reporting Manager:</strong> <span className="text-slate-900">{profile.reportingManager.name}</span></div>
                <div><strong className="text-slate-600">Current Status:</strong> <span className="font-bold text-emerald-600">{profile.status}</span></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setIsPrintModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer inline-flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                Print Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Send Email */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Dispatch Employee Dossier</h3>
                  <p className="text-xs text-slate-500">Send encrypted master profile via email</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmailSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recipient Email *</label>
                <input
                  type="email"
                  required
                  value={emailForm.recipient}
                  onChange={(e) => setEmailForm({ ...emailForm, recipient: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message Body</label>
                <textarea
                  rows={4}
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden resize-none"
                />
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-slate-700">
                  <Paperclip className="h-4 w-4 text-slate-400" />
                  <span className="font-semibold">{profile.employeeId}_360_Master.pdf</span>
                </div>
                <span className="font-mono text-slate-500">2.4 MB</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Digital ID Card */}
      {isIdCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-primary" />
                Digital Employee Badge
              </h3>
              <button
                type="button"
                onClick={() => setIsIdCardModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Smart ID Badge UI */}
            <div className="rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-primary/10 via-white to-slate-50 p-5 text-center shadow-lg space-y-3">
              <div className="text-[11px] font-black uppercase tracking-widest text-primary">Magnertia ERP</div>
              <img
                src={profile.photo}
                alt={profile.name}
                className="h-20 w-20 rounded-full mx-auto object-cover border-2 border-white shadow-md"
              />
              <div>
                <div className="text-sm font-black text-slate-900">{profile.name}</div>
                <div className="text-xs text-slate-600 font-medium">{profile.designation}</div>
                <div className="text-[10px] text-primary font-bold">{profile.department}</div>
              </div>

              <div className="border-t border-slate-200 pt-2 flex justify-between text-[10px] font-mono text-slate-600">
                <span>ID: {profile.employeeId}</span>
                <span>BLD: {profile.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsIdCardModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Digital ID Badge downloaded as PNG!");
                  setIsIdCardModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer text-xs inline-flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" /> Download Badge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal: HR Audit Trail */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-amber-600" />
                HR Master Audit Trail
              </h3>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex gap-3 items-start border-l-2 border-primary pl-3 py-1">
                <div>
                  <div className="font-bold text-slate-900">Profile Updated</div>
                  <div className="text-slate-500 text-[11px]">Changed designation to Senior Engineer by Admin</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Today at 11:20 AM</div>
                </div>
              </div>

              <div className="flex gap-3 items-start border-l-2 border-emerald-500 pl-3 py-1">
                <div>
                  <div className="font-bold text-slate-900">Annual Appraisal Sign-off</div>
                  <div className="text-slate-500 text-[11px]">Band revision to G4 and CTC updated to ₹ 12,50,000</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">15 Jan 2026</div>
                </div>
              </div>

              <div className="flex gap-3 items-start border-l-2 border-slate-300 pl-3 py-1">
                <div>
                  <div className="font-bold text-slate-900">Asset Assignment</div>
                  <div className="text-slate-500 text-[11px]">Dell Laptop AST-LAP-1123 issued by IT Admin</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">01 Aug 2023</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer text-xs"
              >
                Close Audit Trail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit className="h-4 w-4 text-primary" />
                Edit Employee Master Record
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee Full Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={editForm.designation}
                    onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white cursor-pointer"
                  >
                    <option>Engineering</option>
                    <option>Product Development</option>
                    <option>Manufacturing</option>
                    <option>Human Resources</option>
                    <option>Finance & Accounts</option>
                    <option>Sales & Marketing</option>
                    <option>Quality Assurance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={editForm.officialEmail}
                    onChange={(e) => setEditForm({ ...editForm, officialEmail: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={editForm.mobile}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Annual CTC</label>
                  <input
                    type="text"
                    value={editForm.annualCTC}
                    onChange={(e) => setEditForm({ ...editForm, annualCTC: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white cursor-pointer font-bold text-slate-800"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Notice Period">Notice Period</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
