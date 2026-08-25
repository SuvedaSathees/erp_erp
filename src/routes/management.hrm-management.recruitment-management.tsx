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

export default function RecruitmentManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("requisition");
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
              <input
                type="text"
                value={master.recruiter.name}
                onChange={(e) =>
                  setMaster({
                    ...master,
                    recruiter: { ...master.recruiter, name: e.target.value },
                  })
                }
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
              />
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
              <input
                type="text"
                value={master.hiringManager.name}
                onChange={(e) =>
                  setMaster({
                    ...master,
                    hiringManager: { ...master.hiringManager, name: e.target.value },
                  })
                }
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
              />
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
              { id: "requisition", label: "Requisition", icon: FileCheck },
              { id: "job-description", label: "Job Description", icon: FileText },
              { id: "sourcing", label: "Sourcing", icon: Globe },
              { id: "applications", label: "Applications", badge: "32", icon: Users },
              { id: "interview", label: "Interview", badge: "5", icon: Video },
              { id: "offer", label: "Offer & Joining", badge: "2", icon: Mail },
              { id: "documents", label: "Documents", icon: Paperclip },
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

        {/* TAB 1: REQUISITION */}
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

        {/* TAB 2: JOB DESCRIPTION */}
        {activeTab === "job-description" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Job Description & Key Responsibilities
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Designation: {master.position} • Department: {master.department} • Experience: 5–8 Years
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Job description updated")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit JD
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
                <h4 className="font-bold text-slate-900">Role Summary</h4>
                <p className="text-slate-600 leading-relaxed">
                  We are looking for an experienced Senior Embedded Systems & Firmware Engineer to architect and develop real-time embedded firmware for our next-generation battery management systems (BMS) and smart electric vehicle power modules.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <h4 className="font-bold text-slate-900">Key Responsibilities</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                    <li>Design, code, and verify firmware in Embedded C/C++ on ARM Cortex-M/R microcontrollers.</li>
                    <li>Develop RTOS tasks, device drivers (CAN, SPI, I2C, UART), and communication stacks.</li>
                    <li>Collaborate with hardware and system engineering teams for board bring-up.</li>
                    <li>Ensure ISO 26262 functional safety compliance across all critical modules.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <h4 className="font-bold text-slate-900">Required Qualifications & Skills</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                    <li>B.Tech/M.Tech in Electrical, Electronics, or Computer Science.</li>
                    <li>5+ years of hands-on experience in Embedded C and real-time operating systems (FreeRTOS/Zephyr).</li>
                    <li>Proficiency with CAN bus analyzers, oscilloscopes, and hardware debuggers (JTAG).</li>
                    <li>Experience in automotive electronics or energy storage systems preferred.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SOURCING */}
        {activeTab === "sourcing" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Sourcing Channels & Job Postings
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Multi-channel candidate sourcing across job boards, professional networks, and internal referrals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Job posting published to LinkedIn and Careers Portal")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Post to New Channel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {[
                { channel: "Careers Website", applicants: 14, status: "Active", views: 420 },
                { channel: "LinkedIn Jobs", applicants: 11, status: "Active", views: 680 },
                { channel: "Naukri.com", applicants: 5, status: "Active", views: 310 },
                { channel: "Employee Referral", applicants: 2, status: "Active", views: 45 },
              ].map((src) => (
                <div key={src.channel} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{src.channel}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {src.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] pt-1">
                    <span className="text-slate-500">Applicants</span>
                    <span className="font-mono font-bold text-primary">{src.applicants}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Total Views</span>
                    <span className="font-mono text-slate-700">{src.views}</span>
                  </div>
                </div>
              ))}
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
                        <div>
                          <div className="font-bold text-slate-900">
                            {can.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">{can.email} • {can.mobile}</div>
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

        {/* TAB 6: OFFER & JOINING */}
        {activeTab === "offer" && (
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

        {/* TAB 7: DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-primary" />
                  Recruitment Documents & Attachments
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Job specifications, candidate resumes, interview scorecards, and offer letters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success("File uploaded successfully")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Upload Document
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: "Approved_Manpower_Requisition.pdf", type: "PDF", size: "450 KB", date: "15 Apr 2024", uploader: "Arun Kumar" },
                { name: "Senior_Firmware_Engineer_JD_v2.docx", type: "Word Document", size: "120 KB", date: "16 Apr 2024", uploader: "Neha Kapoor" },
                { name: "Priyanka_Sharma_Offer_Letter_Signed.pdf", type: "PDF", size: "820 KB", date: "20 Apr 2024", uploader: "HR Operations" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <Paperclip className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[10px] text-muted-foreground">{doc.size} • Uploaded by {doc.uploader} on {doc.date}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.success(`Downloading ${doc.name}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                </div>
              ))}
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
