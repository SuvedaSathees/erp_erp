import { useState, useMemo } from "react";
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
  Star,
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
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/recruitment-management")({
  head: () => ({
    meta: [
      { title: "Recruitment Management · HRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Recruitment Form manages the complete hiring lifecycle from manpower requirement → requisition → job creation → sourcing → screening → interviews → assessment → selection → offer → joining → onboarding handover → recruitment analytics.",
      },
    ],
  }),
  component: RecruitmentManagementPage,
});

// --- Types & Data Models ---

export type RecruitmentStatusType =
  | "Draft"
  | "Requisition Raised"
  | "Approval"
  | "Approved"
  | "Sourcing"
  | "Applications Received"
  | "Screening"
  | "Assessment"
  | "Interview"
  | "Selection"
  | "Offer"
  | "Offer Accepted"
  | "Pre-Joining"
  | "Joined"
  | "Onboarding Handover"
  | "Closed";

export type RecruitmentTypeEnum =
  | "New Position"
  | "Replacement"
  | "Expansion"
  | "Critical Hire"
  | "Internal Recruitment"
  | "External Recruitment"
  | "Campus Recruitment"
  | "Lateral Recruitment"
  | "Contract Recruitment"
  | "Temporary Recruitment"
  | "Apprentice Recruitment"
  | "Internship";

export interface RecruitmentMaster {
  recruitmentId: string;
  recruitmentNumber: string;
  position: string;
  recruitmentStatus: RecruitmentStatusType;
  targetJoiningDate: string;
  recruitmentType: RecruitmentTypeEnum;
  jobRole: string;
  branch: string;
  createdDate: string;
  workforcePlan: string;
  businessUnit: string;
  recruiter: { name: string; avatar: string; email: string };
  priority: "High" | "Medium" | "Low";
  department: string;
  hiringManager: { name: string; avatar: string; email: string };
  requiredHeadcount: number;
  location: string;
  recruitmentObjective: string;
}

export interface CandidateApplication {
  id: string;
  candidateNumber: string;
  name: string;
  email: string;
  mobile: string;
  currentCompany: string;
  designation: string;
  experience: string;
  source: string;
  appliedDate: string;
  score: number;
  ratingStar: boolean;
  avatar: string;
  status: "Applied" | "Screening" | "Assessment" | "Interview" | "Selected" | "Offered" | "Joined" | "Rejected";
  stage: string;
  skills: string;
}

export interface ScreeningRecord {
  id: string;
  candidateName: string;
  qualificationMatch: number; // 1-5
  experienceMatch: number;
  skillMatch: number;
  salaryFit: number;
  locationFit: number;
  noticePeriodFit: number;
  overallScore: number; // percentage
  decision: "Shortlist" | "Hold" | "Reject" | "More Info";
  remarks: string;
}

export interface AssessmentRecord {
  id: string;
  candidateName: string;
  assessmentType: "Technical Test" | "Aptitude Test" | "Coding Test" | "Domain Test" | "Psychometric Test" | "System Design";
  score: number;
  maxScore: number;
  percentage: number;
  evaluator: string;
  result: "Pass" | "Fail" | "Under Review";
  assessmentDate: string;
}

export interface InterviewRecord {
  id: string;
  candidateName: string;
  interviewRound: number;
  interviewType: "HR Round" | "Technical Round" | "Managerial Round" | "Functional Round" | "Panel Interview" | "Leadership Interview" | "Final Interview";
  interviewer: string;
  scheduledDate: string;
  mode: "Video Call (Google Meet)" | "In-Person (Office)" | "Telephonic";
  overallRating: number;
  recommendation: "Strong Hire" | "Hire" | "Hold" | "Reject";
  feedback: string;
  status: "Completed" | "Scheduled" | "In Progress" | "Cancelled";
}

export interface OfferRecord {
  id: string;
  offerNumber: string;
  candidateName: string;
  position: string;
  offerDate: string;
  joiningDate: string;
  totalCTC: number;
  basicSalary: number;
  allowances: number;
  variablePay: number;
  probationPeriod: string;
  noticePeriod: string;
  validUntil: string;
  offerStatus: "Draft" | "Approved" | "Released" | "Accepted" | "Rejected" | "Expired";
}

export interface RecentActivityItem {
  id: string;
  date: string;
  activity: string;
  candidateDetails: string;
  by: string;
  nextAction: string;
}

// Initial Mock Data
const INITIAL_MASTER: RecruitmentMaster = {
  recruitmentId: "REC-2024-8890",
  recruitmentNumber: "REC-2024-00056",
  position: "Senior Software Engineer",
  recruitmentStatus: "Interview",
  targetJoiningDate: "2024-06-30",
  recruitmentType: "Replacement",
  jobRole: "Software Development",
  branch: "Head Office",
  createdDate: "2024-04-15",
  workforcePlan: "Annual Workforce Plan 2024-25",
  businessUnit: "Product Development",
  recruiter: {
    name: "Neha Kapoor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    email: "neha.kapoor@magnertia.com",
  },
  priority: "High",
  department: "Engineering",
  hiringManager: {
    name: "Arun Kumar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    email: "arun.kumar@magnertia.com",
  },
  requiredHeadcount: 2,
  location: "Coimbatore",
  recruitmentObjective:
    "To fill the vacant positions of Senior Software Engineer due to employee attrition and to strengthen our product development team.",
};

const INITIAL_CANDIDATES: CandidateApplication[] = [
  {
    id: "APP-01",
    candidateNumber: "CAN-2024-0101",
    name: "Raghav Verma",
    email: "raghav.verma@gmail.com",
    mobile: "+91 98765 43210",
    currentCompany: "Infosys Labs",
    designation: "Senior Software Engineer",
    experience: "5.5 Years",
    source: "Employee Referral",
    appliedDate: "16 Apr 2024",
    score: 92,
    ratingStar: true,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80",
    status: "Interview",
    stage: "Interview Scheduled (Round 2)",
    skills: "React, TypeScript, Node.js, Microservices, AWS",
  },
  {
    id: "APP-02",
    candidateNumber: "CAN-2024-0102",
    name: "Sanjana Nair",
    email: "sanjana.nair@outlook.com",
    mobile: "+91 98456 12345",
    currentCompany: "Thoughtworks",
    designation: "Software Engineer",
    experience: "4.8 Years",
    source: "LinkedIn",
    appliedDate: "16 Apr 2024",
    score: 88,
    ratingStar: true,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    status: "Interview",
    stage: "Assessment Completed (Score: 90%)",
    skills: "Go, Kubernetes, Postgres, Redis, GraphQL",
  },
  {
    id: "APP-03",
    candidateNumber: "CAN-2024-0103",
    name: "Karthik Subramanian",
    email: "karthik.sub@gmail.com",
    mobile: "+91 97123 45678",
    currentCompany: "Zoho Corporation",
    designation: "Senior Software Engineer",
    experience: "6.0 Years",
    source: "Job Portal",
    appliedDate: "15 Apr 2024",
    score: 84,
    ratingStar: true,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80",
    status: "Interview",
    stage: "Application Shortlisted",
    skills: "Java, Spring Boot, Kafka, Docker, Distributed Systems",
  },
  {
    id: "APP-04",
    candidateNumber: "CAN-2024-0104",
    name: "Priyanka Sharma",
    email: "priyanka.s@gmail.com",
    mobile: "+91 99887 76655",
    currentCompany: "Wipro Technologies",
    designation: "Lead Developer",
    experience: "7.0 Years",
    source: "Employee Referral",
    appliedDate: "15 Apr 2024",
    score: 95,
    ratingStar: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    status: "Offered",
    stage: "Offer Released",
    skills: "Full Stack, React, Python, FastAPI, Azure",
  },
  {
    id: "APP-05",
    candidateNumber: "CAN-2024-0105",
    name: "Abhishek Reddy",
    email: "abhishek.reddy@gmail.com",
    mobile: "+91 91234 56789",
    currentCompany: "TCS Innovation",
    designation: "Software Engineer",
    experience: "3.5 Years",
    source: "Company Website",
    appliedDate: "14 Apr 2024",
    score: 76,
    ratingStar: false,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    status: "Screening",
    stage: "New Application Received",
    skills: "JavaScript, Express, MongoDB, HTML5, Tailwind",
  },
];

const RECENT_ACTIVITIES: RecentActivityItem[] = [
  {
    id: "ACT-01",
    date: "16 Apr 2024",
    activity: "Interview Scheduled (Round 2)",
    candidateDetails: "Raghav Verma",
    by: "Neha Kapoor",
    nextAction: "18 Apr 2024",
  },
  {
    id: "ACT-02",
    date: "16 Apr 2024",
    activity: "Assessment Completed",
    candidateDetails: "Sanjana Nair",
    by: "System",
    nextAction: "-",
  },
  {
    id: "ACT-03",
    date: "15 Apr 2024",
    activity: "Application Shortlisted",
    candidateDetails: "Karthik Subramanian",
    by: "Neha Kapoor",
    nextAction: "Interview",
  },
  {
    id: "ACT-04",
    date: "15 Apr 2024",
    activity: "Offer Released",
    candidateDetails: "Priyanka Sharma",
    by: "Neha Kapoor",
    nextAction: "Awaiting Response",
  },
  {
    id: "ACT-05",
    date: "14 Apr 2024",
    activity: "New Application Received",
    candidateDetails: "Abhishek Reddy",
    by: "Career Portal",
    nextAction: "Screening",
  },
];

const SOURCE_EFFECTIVENESS_PIE = [
  { name: "Employee Referral", value: 12, percentage: "37.5%", color: "#2563EB" },
  { name: "LinkedIn", value: 8, percentage: "25.0%", color: "#06B6D4" },
  { name: "Job Portal", value: 7, percentage: "21.9%", color: "#F59E0B" },
  { name: "Company Website", value: 3, percentage: "9.4%", color: "#8B5CF6" },
  { name: "Walk-in", value: 2, percentage: "6.2%", color: "#EC4899" },
];

const STAGE_WISE_TABLE = [
  { stage: "Applications Received", count: 32, percentage: "100%", avgDays: "-" },
  { stage: "Screening", count: 12, percentage: "37.50%", avgDays: 3 },
  { stage: "Assessment", count: 8, percentage: "25.00%", avgDays: 5 },
  { stage: "Interview", count: 5, percentage: "15.63%", avgDays: 7 },
  { stage: "Offer", count: 2, percentage: "6.25%", avgDays: 2 },
  { stage: "Joined", count: 1, percentage: "3.13%", avgDays: 1 },
];

const OFFER_SUMMARY_PIE = [
  { name: "Awaiting Response", value: 1, percentage: "50%", color: "#F59E0B" },
  { name: "Accepted", value: 1, percentage: "50%", color: "#10B981" },
  { name: "Rejected", value: 0, percentage: "0%", color: "#EF4444" },
  { name: "Expired", value: 0, percentage: "0%", color: "#6366F1" },
];

export default function RecruitmentManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [master, setMaster] = useState<RecruitmentMaster>(INITIAL_MASTER);
  const [candidates, setCandidates] = useState<CandidateApplication[]>(INITIAL_CANDIDATES);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isNewCandidateOpen, setIsNewCandidateOpen] = useState(false);
  const [newCanName, setNewCanName] = useState("");
  const [newCanEmail, setNewCanEmail] = useState("");
  const [newCanPhone, setNewCanPhone] = useState("");
  const [newCanExp, setNewCanExp] = useState("4 Years");
  const [newCanSource, setNewCanSource] = useState("LinkedIn");

  const handleSaveRecruitment = () => {
    toast.success(`Recruitment Record ${master.recruitmentNumber} saved successfully`, {
      description: "Hiring parameters, requisition status and candidate stages updated.",
    });
  };

  const handleStatusProgress = (newStatus: RecruitmentStatusType) => {
    setMaster((prev) => ({ ...prev, recruitmentStatus: newStatus }));
    toast.success(`Recruitment Status updated to ${newStatus}`);
  };

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCanName) {
      toast.error("Please enter candidate name");
      return;
    }
    const newCandidate: CandidateApplication = {
      id: `APP-0${candidates.length + 1}`,
      candidateNumber: `CAN-2024-01${candidates.length + 10}`,
      name: newCanName,
      email: newCanEmail || `${newCanName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      mobile: newCanPhone || "+91 98765 00000",
      currentCompany: "Software Corp",
      designation: "Senior Engineer",
      experience: newCanExp,
      source: newCanSource,
      appliedDate: "Today",
      score: 85,
      ratingStar: true,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      status: "Screening",
      stage: "Application Received",
      skills: "Full Stack, React, TypeScript, APIs",
    };
    setCandidates([newCandidate, ...candidates]);
    setIsNewCandidateOpen(false);
    setNewCanName("");
    setNewCanEmail("");
    setNewCanPhone("");
    toast.success(`Candidate ${newCanName} added to application pipeline`);
  };

  const handleExportData = (type: "excel" | "pdf") => {
    toast.success(`Recruitment report exported as ${type.toUpperCase()}`, {
      description: `Downloaded REC-2024-00056_${new Date().toISOString().slice(0, 10)}.${type === "excel" ? "xlsx" : "pdf"}`,
    });
  };

  const STATUS_WORKFLOW_STEPS: RecruitmentStatusType[] = [
    "Draft",
    "Requisition Raised",
    "Approval",
    "Approved",
    "Sourcing",
    "Applications Received",
    "Screening",
    "Assessment",
    "Interview",
    "Selection",
    "Offer",
    "Offer Accepted",
    "Pre-Joining",
    "Joined",
    "Onboarding Handover",
    "Closed",
  ];

  return (
    <AppShell
      title="Recruitment Management"
      breadcrumb="Management > HRM Management > Recruitment Management"
      description="The Recruitment Form manages the complete hiring lifecycle from manpower requirement → requisition → job creation → sourcing → screening → interviews → assessment → selection → offer → joining → onboarding handover → recruitment analytics."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Status Badges */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Recruitment Form
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Video className="h-3 w-3" />
                {master.recruitmentStatus}
              </span>
              <span className="hidden md:inline-block font-mono text-xs text-muted-foreground">
                {master.recruitmentNumber}
              </span>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsNewCandidateOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                New Recruitment
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
              <button
                type="button"
                onClick={() => handleExportData("pdf")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                Send Email
              </button>
              <button
                type="button"
                onClick={() => handleExportData("excel")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export
              </button>
              <button
                type="button"
                onClick={handleSaveRecruitment}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* 1. Recruitment Master Form (Matching screenshot layout) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                1
              </span>
              Recruitment Master
            </h3>
            <span className="text-xs text-muted-foreground">
              ID: <span className="font-mono font-medium text-slate-700">{master.recruitmentId}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Col 1 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Recruitment Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={master.recruitmentNumber}
                onChange={(e) => setMaster({ ...master, recruitmentNumber: e.target.value })}
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Position <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={master.position}
                onChange={(e) => setMaster({ ...master, position: e.target.value })}
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Recruitment Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={master.recruitmentStatus}
                onChange={(e) => handleStatusProgress(e.target.value as RecruitmentStatusType)}
                className="w-full h-8 px-2.5 rounded-md border border-blue-300 text-xs font-bold text-blue-700 bg-blue-50/50 focus:border-primary focus:outline-hidden"
              >
                {STATUS_WORKFLOW_STEPS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Target Joining Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={master.targetJoiningDate}
                onChange={(e) => setMaster({ ...master, targetJoiningDate: e.target.value })}
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
              />
            </div>

            {/* Col 2 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Recruitment Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={master.recruitmentType}
                onChange={(e) => setMaster({ ...master, recruitmentType: e.target.value as RecruitmentTypeEnum })}
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden bg-white"
              >
                <option value="Replacement">Replacement</option>
                <option value="New Position">New Position</option>
                <option value="Expansion">Expansion</option>
                <option value="Critical Hire">Critical Hire</option>
                <option value="Campus Recruitment">Campus Recruitment</option>
                <option value="Lateral Recruitment">Lateral Recruitment</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Job Role <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={master.jobRole}
                onChange={(e) => setMaster({ ...master, jobRole: e.target.value })}
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Branch <span className="text-slate-400">(Lookup)</span>
              </label>
              <input
                type="text"
                value={master.branch}
                onChange={(e) => setMaster({ ...master, branch: e.target.value })}
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Created Date
              </label>
              <input
                type="date"
                value={master.createdDate}
                disabled
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-500 bg-slate-50"
              />
            </div>

            {/* Col 3 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Workforce Plan
              </label>
              <input
                type="text"
                value={master.workforcePlan}
                onChange={(e) => setMaster({ ...master, workforcePlan: e.target.value })}
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Business Unit <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={master.businessUnit}
                onChange={(e) => setMaster({ ...master, businessUnit: e.target.value })}
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Recruiter <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2 h-8 px-2 rounded-md border border-slate-200 bg-white">
                <img
                  src={master.recruiter.avatar}
                  alt={master.recruiter.name}
                  className="h-5 w-5 rounded-full object-cover"
                />
                <span className="text-xs font-medium text-slate-800 truncate">{master.recruiter.name}</span>
                <button
                  type="button"
                  onClick={() => toast.info("Recruiter selector opened")}
                  className="text-slate-400 hover:text-slate-600 ml-auto text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Objective spanning last column */}
            <div className="md:row-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Recruitment Objective <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={master.recruitmentObjective}
                onChange={(e) => setMaster({ ...master, recruitmentObjective: e.target.value })}
                className="w-full p-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden bg-slate-50/30 resize-none h-[88px]"
              />
            </div>

            {/* Col 4 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                value={master.department}
                onChange={(e) => setMaster({ ...master, department: e.target.value })}
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="HR & Admin">HR & Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Hiring Manager <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2 h-8 px-2 rounded-md border border-slate-200 bg-white">
                <img
                  src={master.hiringManager.avatar}
                  alt={master.hiringManager.name}
                  className="h-5 w-5 rounded-full object-cover"
                />
                <span className="text-xs font-medium text-slate-800 truncate">{master.hiringManager.name}</span>
                <button
                  type="button"
                  onClick={() => toast.info("Hiring manager selector opened")}
                  className="text-slate-400 hover:text-slate-600 ml-auto text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Priority <span className="text-rose-500">*</span>
              </label>
              <span className="flex items-center justify-center h-8 rounded-md bg-amber-50 text-amber-700 font-bold border border-amber-200">
                {master.priority}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={master.location}
                onChange={(e) => setMaster({ ...master, location: e.target.value })}
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Required Headcount <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={master.requiredHeadcount}
                onChange={(e) => setMaster({ ...master, requiredHeadcount: Number(e.target.value) })}
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-bold text-slate-900 focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Sub-Tabs bar with badge counters matching screenshot */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "requisition", label: "Requisition", icon: FileCheck },
              { id: "job-description", label: "Job Description", icon: FileText },
              { id: "sourcing", label: "Sourcing", icon: Globe },
              { id: "applications", label: "Applications", badge: "32", icon: Users },
              { id: "screening", label: "Screening", badge: "12", icon: UserCheck2 },
              { id: "assessment", label: "Assessment", badge: "8", icon: BrainCircuit },
              { id: "interview", label: "Interview", badge: "5", icon: Video },
              { id: "selection", label: "Selection", icon: Award },
              { id: "offer", label: "Offer", badge: "2", icon: Mail },
              { id: "joining", label: "Joining", icon: UserCheck },
              { id: "documents", label: "Documents", icon: Paperclip },
              { id: "timeline", label: "Timeline", icon: Clock },
              { id: "history", label: "History", icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer",
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

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Stat Cards Row (7 Cards matching screenshot) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {/* Card 1: Open Positions */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground">Open Positions</span>
                  <div className="p-1 rounded-md bg-blue-50 text-blue-600">
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">2</div>
                <div className="text-[10px] text-muted-foreground">of 2</div>
              </div>

              {/* Card 2: Applications */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground">Applications</span>
                  <div className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">32</div>
              </div>

              {/* Card 3: Shortlisted */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground">Shortlisted</span>
                  <div className="p-1 rounded-md bg-amber-50 text-amber-600">
                    <UserCheck2 className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">12</div>
                <div className="text-[10px] text-amber-600 font-semibold">37.50%</div>
              </div>

              {/* Card 4: Interviews */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground">Interviews</span>
                  <div className="p-1 rounded-md bg-purple-50 text-purple-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">5</div>
                <div className="text-[10px] text-purple-600 font-semibold">15.63%</div>
              </div>

              {/* Card 5: Offers */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground">Offers</span>
                  <div className="p-1 rounded-md bg-teal-50 text-teal-600">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">2</div>
              </div>

              {/* Card 6: Joined */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground">Joined</span>
                  <div className="p-1 rounded-md bg-rose-50 text-rose-600">
                    <UserCheck className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">1</div>
              </div>

              {/* Card 7: Time to Fill */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground">Time to Fill</span>
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-lg font-bold text-slate-900">28 Days</div>
                <div className="text-[10px] text-muted-foreground">Target: 30 Days</div>
              </div>
            </div>

            {/* Row 1: Charts & Details (4 Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 2. Recruitment Funnel */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                      2
                    </span>
                    Recruitment Funnel
                  </h4>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between bg-blue-600 text-white px-2.5 py-1 rounded-md">
                    <span>Applications Received</span>
                    <span className="font-mono font-bold">32 (100%)</span>
                  </div>
                  <div className="flex items-center justify-between bg-blue-500 text-white px-2.5 py-1 rounded-md mx-2">
                    <span>Screening</span>
                    <span className="font-mono font-bold">12 (37.50%)</span>
                  </div>
                  <div className="flex items-center justify-between bg-cyan-500 text-white px-2.5 py-1 rounded-md mx-4">
                    <span>Assessment</span>
                    <span className="font-mono font-bold">8 (25.00%)</span>
                  </div>
                  <div className="flex items-center justify-between bg-amber-500 text-white px-2.5 py-1 rounded-md mx-6">
                    <span>Interview</span>
                    <span className="font-mono font-bold">5 (15.63%)</span>
                  </div>
                  <div className="flex items-center justify-between bg-orange-500 text-white px-2.5 py-1 rounded-md mx-8">
                    <span>Offer</span>
                    <span className="font-mono font-bold">2 (6.25%)</span>
                  </div>
                  <div className="flex items-center justify-between bg-emerald-600 text-white px-2.5 py-1 rounded-md mx-10">
                    <span>Joined</span>
                    <span className="font-mono font-bold">1 (3.13%)</span>
                  </div>
                </div>

                <div className="text-center pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-700">
                  Conversion Rate: <span className="font-mono text-emerald-600 font-bold">3.13%</span>
                </div>
              </div>

              {/* 3. Source Effectiveness */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                      3
                    </span>
                    Source Effectiveness
                  </h4>
                </div>

                <div className="h-36 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={SOURCE_EFFECTIVENESS_PIE}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={58}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {SOURCE_EFFECTIVENESS_PIE.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-lg font-extrabold text-slate-900 font-mono">32</span>
                    <span className="text-[9px] text-muted-foreground">Applications</span>
                  </div>
                </div>

                <div className="space-y-1 text-[10px]">
                  {SOURCE_EFFECTIVENESS_PIE.slice(0, 3).map((s) => (
                    <div key={s.name} className="flex justify-between items-center">
                      <span className="flex items-center gap-1 text-slate-600 truncate">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                        {s.name}
                      </span>
                      <span className="font-mono font-semibold text-slate-800">
                        {s.value} ({s.percentage})
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-500">Total Cost: <strong className="text-slate-900 font-mono">₹ 48,700</strong></span>
                  <button onClick={() => setActiveTab("sourcing")} className="text-primary font-semibold hover:underline cursor-pointer">
                    View Report
                  </button>
                </div>
              </div>

              {/* 4. Stage Wise Details Table */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                      4
                    </span>
                    Stage Wise Details
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="pb-1">Stage</th>
                        <th className="pb-1 text-center">Count</th>
                        <th className="pb-1 text-center">%</th>
                        <th className="pb-1 text-right">Avg. Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {STAGE_WISE_TABLE.map((row) => (
                        <tr key={row.stage} className="hover:bg-slate-50/60">
                          <td className="py-1.5 font-medium text-slate-800 truncate max-w-[100px]">{row.stage}</td>
                          <td className="py-1.5 text-center font-mono font-semibold">{row.count}</td>
                          <td className="py-1.5 text-center font-mono text-slate-600">{row.percentage}</td>
                          <td className="py-1.5 text-right font-mono">{row.avgDays !== "-" ? `${row.avgDays} Days` : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. Top Candidates */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                      5
                    </span>
                    Top Candidates
                  </h4>
                  <button onClick={() => setActiveTab("applications")} className="text-[10px] font-semibold text-primary hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="space-y-2.5">
                  {candidates.slice(0, 3).map((can) => (
                    <div key={can.id} className="flex items-center justify-between gap-2 p-1.5 rounded-lg border border-slate-100 bg-slate-50/40">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={can.avatar} alt={can.name} className="h-7 w-7 rounded-full object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{can.name}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{can.designation}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                          {can.score}%
                        </span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Recent Activities, Offer Summary, Key Dates, Cost Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 6. Recent Activities */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                      6
                    </span>
                    Recent Activities
                  </h4>
                </div>

                <div className="space-y-2 text-[10px]">
                  {RECENT_ACTIVITIES.slice(0, 4).map((act) => (
                    <div key={act.id} className="p-1.5 rounded-md bg-slate-50 border border-slate-100 space-y-0.5">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>{act.date}</span>
                        <span className="text-slate-600 font-medium">{act.by}</span>
                      </div>
                      <div className="font-semibold text-slate-900">{act.activity}</div>
                      <div className="text-muted-foreground truncate">{act.candidateDetails}</div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveTab("history")} className="text-center text-[10px] font-semibold text-primary hover:underline cursor-pointer pt-1">
                  View All Activities →
                </button>
              </div>

              {/* 7. Offer Summary */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                      7
                    </span>
                    Offer Summary
                  </h4>
                </div>

                <div className="h-32 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={OFFER_SUMMARY_PIE}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={52}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {OFFER_SUMMARY_PIE.map((entry, index) => (
                          <Cell key={`offer-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-lg font-extrabold text-slate-900 font-mono">2</span>
                    <span className="text-[9px] text-muted-foreground">Offers</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px] pt-1">
                  {OFFER_SUMMARY_PIE.map((o) => (
                    <div key={o.name} className="flex justify-between items-center">
                      <span className="flex items-center gap-1 text-slate-600 truncate">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: o.color }} />
                        {o.name}
                      </span>
                      <span className="font-mono font-bold">{o.value} ({o.percentage})</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveTab("offer")} className="text-center text-[10px] font-semibold text-primary hover:underline cursor-pointer pt-1">
                  View Offer Report →
                </button>
              </div>

              {/* 8. Key Dates */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                      8
                    </span>
                    Key Dates
                  </h4>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Requisition Approved
                    </span>
                    <span className="font-mono text-slate-600">12 Apr 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Globe className="h-3.5 w-3.5 text-blue-600" />
                      Job Posted
                    </span>
                    <span className="font-mono text-slate-600">13 Apr 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <UserCheck2 className="h-3.5 w-3.5 text-cyan-600" />
                      Screening Started
                    </span>
                    <span className="font-mono text-slate-600">14 Apr 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Video className="h-3.5 w-3.5 text-amber-600" />
                      Interview Started
                    </span>
                    <span className="font-mono text-slate-600">16 Apr 2024</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-slate-900 border-t border-slate-100 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-rose-600" />
                      Target Joining Date
                    </span>
                    <span className="font-mono text-rose-600">30 Jun 2024</span>
                  </div>
                </div>
              </div>

              {/* 9. Cost Summary */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                      9
                    </span>
                    Cost Summary
                  </h4>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Recruitment Budget</span>
                    <span className="font-mono font-bold text-slate-900">₹ 1,20,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Actual Cost</span>
                    <span className="font-mono font-bold text-blue-600">₹ 48,700</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cost per Hire</span>
                    <span className="font-mono font-bold text-emerald-600">₹ 48,700</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>Budget Utilization</span>
                      <span className="font-mono font-bold text-primary">40.58%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[40.58%]" />
                    </div>
                  </div>
                </div>

                <button onClick={() => setActiveTab("overview")} className="text-center text-[10px] font-semibold text-primary hover:underline cursor-pointer pt-1">
                  View Cost Report →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REQUISITION */}
        {activeTab === "requisition" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-primary" />
                Manpower Requisition Details
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Workforce Demand → Recruitment Requisition → Position Justification & Approval
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="text-[10px] text-muted-foreground font-semibold">Requisition ID</div>
                <div className="text-sm font-bold font-mono text-primary">REQ-2024-00124</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="text-[10px] text-muted-foreground font-semibold">Hiring Reason</div>
                <div className="text-sm font-bold text-slate-800">Replacement (Attrition)</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="text-[10px] text-muted-foreground font-semibold">Budgeted Salary Band</div>
                <div className="text-sm font-bold font-mono text-emerald-700">₹ 18,00,000 - ₹ 24,00,000</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-lg border border-slate-200/80 space-y-2 text-xs">
              <div className="font-semibold text-slate-800">Business Justification</div>
              <p className="text-slate-600 leading-relaxed">
                Critical requirement to support Generation-4 EV High-Speed Charging firmware and embedded cloud controllers.
                Immediate replacement is required to maintain zero downtime delivery timelines for Q2 enterprise fleet deployments.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATIONS TABLE */}
        {activeTab === "applications" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Candidate Applications Pipeline (32 Total)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search candidate..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 pl-8 pr-3 text-xs rounded-md border border-slate-200 focus:border-primary focus:outline-hidden w-48"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewCandidateOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Candidate
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Candidate</th>
                    <th className="py-2.5 px-3">Experience</th>
                    <th className="py-2.5 px-3">Source</th>
                    <th className="py-2.5 px-3">Key Skills</th>
                    <th className="py-2.5 px-3 text-center">Score</th>
                    <th className="py-2.5 px-3">Stage</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((can) => (
                    <tr key={can.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img src={can.avatar} alt={can.name} className="h-8 w-8 rounded-full object-cover" />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1">
                              {can.name}
                              {can.ratingStar && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                            </div>
                            <div className="text-[10px] text-muted-foreground">{can.email} • {can.mobile}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">{can.experience}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {can.source}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate">{can.skills}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {can.score}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">{can.stage}</td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                            can.status === "Interview"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : can.status === "Offered"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-700",
                          )}
                        >
                          {can.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: INTERVIEWS */}
        {activeTab === "interview" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary" />
                  Scheduled & Conducted Interviews
                </h3>
              </div>
              <button
                type="button"
                onClick={() => toast.info("Interview scheduler dialog launched")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Schedule Interview
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900">Raghav Verma</div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Round 2: Technical Deep Dive
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Interviewer: <strong>Arun Kumar (Engineering Lead)</strong></div>
                  <div>Scheduled: <strong>18 Apr 2024, 03:00 PM - 04:00 PM</strong></div>
                  <div>Mode: <strong>Google Meet Video</strong></div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/60">
                  <button className="px-3 py-1 text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/5">
                    Join Call
                  </button>
                  <button className="px-3 py-1 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary/90">
                    Submit Feedback
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900">Sanjana Nair</div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    Round 1: System Design & Architecture
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Interviewer: <strong>Dr. Arvind Rao (CTO)</strong></div>
                  <div>Scheduled: <strong>19 Apr 2024, 11:30 AM - 12:30 PM</strong></div>
                  <div>Mode: <strong>Google Meet Video</strong></div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/60">
                  <button className="px-3 py-1 text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/5">
                    Join Call
                  </button>
                  <button className="px-3 py-1 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary/90">
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: OFFER & JOINING */}
        {(activeTab === "offer" || activeTab === "joining") && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-600" />
                Offer Management & Joining Status
              </h3>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">Priyanka Sharma</span>
                  <div className="text-slate-500">Offer ID: OFR-2024-0012 • Senior Software Engineer</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Offer Released (Awaiting Response)
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <div className="text-[10px] text-muted-foreground">Offered Total CTC</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">₹ 22,50,000</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Basic Salary</div>
                  <div className="font-mono font-bold text-slate-800">₹ 11,25,000</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Joining Date</div>
                  <div className="font-mono font-bold text-slate-800">15 Jun 2024</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Offer Valid Until</div>
                  <div className="font-mono font-bold text-rose-600">22 Apr 2024</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: New Candidate Application */}
      {isNewCandidateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-primary" />
                Add Candidate Application
              </h3>
              <button
                type="button"
                onClick={() => setIsNewCandidateOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCandidate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={newCanName}
                  onChange={(e) => setNewCanName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={newCanEmail}
                    onChange={(e) => setNewCanEmail(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={newCanPhone}
                    onChange={(e) => setNewCanPhone(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Experience</label>
                  <input
                    type="text"
                    value={newCanExp}
                    onChange={(e) => setNewCanExp(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source</label>
                  <select
                    value={newCanSource}
                    onChange={(e) => setNewCanSource(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Employee Referral">Employee Referral</option>
                    <option value="Job Portal">Job Portal</option>
                    <option value="Company Website">Company Website</option>
                    <option value="Campus">Campus</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewCandidateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer"
                >
                  Save Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
