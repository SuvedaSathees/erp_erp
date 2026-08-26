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
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/workforce-planning")({
  head: () => ({
    meta: [
      { title: "Workforce Planning · HRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Workforce Planning Form manages the organization’s workforce requirements from business demand → workforce analysis → manpower requirement → skills gap → hiring plan → workforce allocation → capacity → cost → succession → optimization → monitoring.",
      },
    ],
  }),
  component: WorkforcePlanningPage,
});

// --- Types & Data Models ---

export type PlanStatusType =
  | "Draft"
  | "Workforce Analysis"
  | "Demand Planning"
  | "Gap Analysis"
  | "Budget Review"
  | "Approval"
  | "Approved"
  | "Execution"
  | "Monitoring"
  | "Closed";

export type PlanTypeEnum =
  | "Annual Workforce Plan"
  | "Strategic Workforce Plan"
  | "Project Workforce Plan"
  | "Department Workforce Plan"
  | "Branch Workforce Plan"
  | "Expansion Workforce Plan"
  | "Hiring Plan"
  | "Capacity Plan"
  | "Contingency Workforce Plan"
  | "Transformation Workforce Plan";

export interface MasterPlan {
  planId: string;
  planNumber: string;
  planName: string;
  startDate: string;
  endDate: string;
  planningYear: string;
  planType: PlanTypeEnum;
  organization: string;
  branch: string;
  businessUnit: string;
  department: string;
  planOwner: { name: string; avatar: string; email: string; role: string };
  approver: { name: string; avatar: string; email: string; role: string };
  status: PlanStatusType;
  createdDate: string;
  planObjective: string;
}

export interface DemandForecastItem {
  id: string;
  businessUnit: string;
  department: string;
  demandDriver: string;
  forecastMetric: string;
  currentValue: number;
  forecastValue: number;
  growthRate: number;
  period: string;
  demandVolume: number;
  productivityAssumption: number;
  forecastMethod: string;
  confidenceLevel: number;
  status: "Draft" | "Reviewed" | "Approved";
}

export interface CurrentWorkforceItem {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  designation: string;
  jobRole: string;
  location: string;
  employmentType: "Full-Time" | "Part-Time" | "Contract" | "Temporary" | "Intern" | "Apprentice" | "Consultant" | "Freelancer";
  grade: string;
  joiningDate: string;
  status: "Active" | "On Notice" | "On Leave";
  fte: number;
  salaryCost: number;
  skillLevel: number;
  criticalRole: boolean;
}

export interface WorkforceCapacityItem {
  id: string;
  department: string;
  jobRole: string;
  availableHeadcount: number;
  availableFTE: number;
  workingHours: number;
  productiveHours: number;
  utilizationRate: number;
  capacityHours: number;
  requiredHours: number;
  capacityGap: number;
  status: "Sufficient" | "Deficit" | "Surplus";
}

export interface GapAnalysisItem {
  id: string;
  department: string;
  jobRole: string;
  currentHeadcount: number;
  requiredHeadcount: number;
  headcountGap: number;
  currentSkills: string;
  requiredSkills: string;
  skillGap: number;
  capacityGap: number;
  costGap: number;
  gapType: "Headcount Shortage" | "Headcount Surplus" | "Skill Shortage" | "Skill Obsolescence" | "Capacity Shortage" | "Location Gap" | "Leadership Gap" | "Critical Talent Gap" | "Productivity Gap";
  gapPriority: "High" | "Medium" | "Low";
  status: "Identified" | "In Review" | "Action Planned" | "Resolved";
}

export interface HiringPlanItem {
  id: string;
  jobRole: string;
  department: string;
  vacancies: number;
  hiringType: "New Position" | "Replacement" | "Expansion" | "Critical Hire" | "Temporary Hire" | "Contract Hire" | "Campus Hire" | "Lateral Hire";
  requiredSkills: string;
  experienceRequired: string;
  targetHiringDate: string;
  recruitmentSource: string;
  hiringBudget: number;
  hiringPriority: "High" | "Medium" | "Low";
  status: "Open" | "Sourcing" | "Interviewing" | "Offered" | "Filled";
}

export interface SkillPlanItem {
  id: string;
  jobRole: string;
  category: "Technical" | "Functional" | "Managerial" | "Digital" | "Software" | "Engineering" | "Manufacturing" | "Sales" | "Finance" | "HR" | "Leadership" | "Compliance";
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  skillGap: number;
  employeesAffected: number;
  criticalSkill: boolean;
  developmentRequired: boolean;
  status: "Under Assessment" | "Training Scheduled" | "In Progress" | "Proficient";
}

export interface SuccessionItem {
  id: string;
  criticalPosition: string;
  currentEmployee: string;
  successor: string;
  readinessLevel: "Ready Now" | "Ready < 1 Year" | "Ready 1–2 Years" | "Ready > 2 Years" | "Not Ready";
  competencyGap: number;
  developmentPlan: string;
  expectedReadinessDate: string;
  riskLevel: number;
  status: "Nominated" | "In Development" | "Validated";
}

export interface ScenarioItem {
  id: string;
  scenarioName: string;
  scenarioType: "Base Case" | "Growth Case" | "Downside";
  revenueAssumption: number;
  demandAssumption: number;
  attritionAssumption: number;
  productivityAssumption: number;
  headcountReq: number;
  workforceCost: number;
  capacity: number;
  businessImpact: string;
  scenarioScore: number;
  status: "Active" | "Simulated" | "Archived";
}

export interface ActionPlanItem {
  id: string;
  actionType: "Hire" | "Redeploy" | "Train" | "Retain" | "Outsource" | "Automate" | "Restructure" | "Promote" | "Contract" | "Reduce Workforce";
  actionDescription: string;
  owner: string;
  department: string;
  priority: "High" | "Medium" | "Low";
  startDate: string;
  dueDate: string;
  budget: number;
  expectedOutcome: string;
  completionDate?: string;
  status: "Pending" | "In Progress" | "Completed" | "Delayed";
}

export interface ApprovalLevelItem {
  id: string;
  level: number;
  role: string;
  approver: string;
  approvalType: "Mandatory" | "Conditional" | "Advisory";
  submittedDate: string;
  decisionDate: string;
  decision: "Approved" | "Pending" | "Rejected" | "In Review";
  comments: string;
}

export interface DocumentItem {
  id: string;
  documentType: string;
  documentNumber: string;
  fileName: string;
  fileSize: string;
  version: string;
  uploadedBy: string;
  uploadDate: string;
  confidential: boolean;
  status: "Verified" | "Draft" | "Archived";
}

// Initial Mock Data
const INITIAL_MASTER: MasterPlan = {
  planId: "WFP-2024-8891",
  planNumber: "WFPL-2024-0001",
  planName: "Annual Workforce Plan 2024-25",
  startDate: "2024-04-01",
  endDate: "2025-03-31",
  planningYear: "FY 2024-25",
  planType: "Annual Workforce Plan",
  organization: "Magnertia Private Limited",
  branch: "Head Office - Coimbatore",
  businessUnit: "Autonomous EV Charging",
  department: "All Departments",
  planOwner: {
    name: "Neha Kapoor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    email: "neha.kapoor@magnertia.com",
    role: "Lead HR Strategist",
  },
  approver: {
    name: "Vikram Singh",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    email: "vikram.singh@magnertia.com",
    role: "VP Operations & HR",
  },
  status: "Approved",
  createdDate: "2024-04-15",
  planObjective:
    "To ensure we have the right people, with the right skills, in the right roles, at the right time to achieve business goals across EV Charging infrastructure and scaling targets.",
};

const INITIAL_DEMAND_FORECAST: DemandForecastItem[] = [
  {
    id: "DF-01",
    businessUnit: "Autonomous EV Charging",
    department: "R&D Engineering",
    demandDriver: "New Product",
    forecastMetric: "Generation-4 High-Speed Chargers",
    currentValue: 102,
    forecastValue: 118,
    growthRate: 15.68,
    period: "2024-04-01 to 2025-03-31",
    demandVolume: 16,
    productivityAssumption: 0.92,
    forecastMethod: "Workload Analysis",
    confidenceLevel: 94,
    status: "Approved",
  },
  {
    id: "DF-02",
    businessUnit: "Autonomous EV Charging",
    department: "Operations",
    demandDriver: "Capacity Expansion",
    forecastMetric: "Charging Grid Network Expansion (50 New Hubs)",
    currentValue: 72,
    forecastValue: 86,
    growthRate: 19.44,
    period: "2024-04-01 to 2025-03-31",
    demandVolume: 14,
    productivityAssumption: 0.88,
    forecastMethod: "Ratio Analysis",
    confidenceLevel: 90,
    status: "Approved",
  },
  {
    id: "DF-03",
    businessUnit: "Autonomous EV Charging",
    department: "Sales & Marketing",
    demandDriver: "Sales Growth",
    forecastMetric: "Annual B2B Fleet Sales Target ₹120 Cr",
    currentValue: 34,
    forecastValue: 40,
    growthRate: 17.65,
    period: "2024-04-01 to 2025-03-31",
    demandVolume: 6,
    productivityAssumption: 0.85,
    forecastMethod: "Trend Analysis",
    confidenceLevel: 88,
    status: "Approved",
  },
  {
    id: "DF-04",
    businessUnit: "Autonomous EV Charging",
    department: "Customer Support",
    demandDriver: "Customer Growth",
    forecastMetric: "24/7 Grid Network Monitoring & Support",
    currentValue: 28,
    forecastValue: 32,
    growthRate: 14.28,
    period: "2024-04-01 to 2025-03-31",
    demandVolume: 4,
    productivityAssumption: 0.95,
    forecastMethod: "Workload Analysis",
    confidenceLevel: 92,
    status: "Approved",
  },
  {
    id: "DF-05",
    businessUnit: "Autonomous EV Charging",
    department: "Finance & Accounts",
    demandDriver: "Regulatory Requirement",
    forecastMetric: "Multi-State Taxation & Compliance",
    currentValue: 12,
    forecastValue: 13,
    growthRate: 8.33,
    period: "2024-04-01 to 2025-03-31",
    demandVolume: 1,
    productivityAssumption: 0.98,
    forecastMethod: "Regression",
    confidenceLevel: 96,
    status: "Approved",
  },
  {
    id: "DF-06",
    businessUnit: "Autonomous EV Charging",
    department: "HR & Admin",
    demandDriver: "Revenue Growth",
    forecastMetric: "Enterprise Talent Acquisition & Enablement",
    currentValue: 10,
    forecastValue: 11,
    growthRate: 10.0,
    period: "2024-04-01 to 2025-03-31",
    demandVolume: 1,
    productivityAssumption: 0.95,
    forecastMethod: "Trend Analysis",
    confidenceLevel: 91,
    status: "Approved",
  },
];

const INITIAL_CURRENT_WORKFORCE: CurrentWorkforceItem[] = [
  {
    id: "CW-01",
    employeeName: "Aditya Verma",
    employeeId: "EMP-1048",
    department: "R&D Engineering",
    designation: "Principal Firmware Architect",
    jobRole: "Senior Embedded Engineer",
    location: "Coimbatore",
    employmentType: "Full-Time",
    grade: "L5 - Principal",
    joiningDate: "2021-03-12",
    status: "Active",
    fte: 1.0,
    salaryCost: 2800000,
    skillLevel: 5,
    criticalRole: true,
  },
  {
    id: "CW-02",
    employeeName: "Sneha Reddy",
    employeeId: "EMP-1092",
    department: "R&D Engineering",
    designation: "Lead Power Electronics Engineer",
    jobRole: "Electronics Designer",
    location: "Coimbatore",
    employmentType: "Full-Time",
    grade: "L4 - Lead",
    joiningDate: "2022-07-01",
    status: "Active",
    fte: 1.0,
    salaryCost: 2200000,
    skillLevel: 4,
    criticalRole: true,
  },
  {
    id: "CW-03",
    employeeName: "Rajesh Kannan",
    employeeId: "EMP-1115",
    department: "Operations",
    designation: "Field Services Lead",
    jobRole: "Service Technician",
    location: "Bengaluru Hub",
    employmentType: "Full-Time",
    grade: "L3 - Senior",
    joiningDate: "2022-11-15",
    status: "Active",
    fte: 1.0,
    salaryCost: 1100000,
    skillLevel: 4,
    criticalRole: false,
  },
  {
    id: "CW-04",
    employeeName: "Pooja Malhotra",
    employeeId: "EMP-1180",
    department: "Sales & Marketing",
    designation: "Enterprise Accounts Director",
    jobRole: "Sales Executive",
    location: "Mumbai",
    employmentType: "Full-Time",
    grade: "L4 - Manager",
    joiningDate: "2023-01-20",
    status: "Active",
    fte: 1.0,
    salaryCost: 1950000,
    skillLevel: 5,
    criticalRole: true,
  },
  {
    id: "CW-05",
    employeeName: "Karthik Subramanian",
    employeeId: "EMP-1205",
    department: "R&D Engineering",
    designation: "Robotics Controls Engineer",
    jobRole: "Automation Engineer",
    location: "Coimbatore",
    employmentType: "Full-Time",
    grade: "L3 - Senior",
    joiningDate: "2023-05-10",
    status: "Active",
    fte: 1.0,
    salaryCost: 1450000,
    skillLevel: 4,
    criticalRole: true,
  },
  {
    id: "CW-06",
    employeeName: "Meera Krishnan",
    employeeId: "EMP-1244",
    department: "Finance & Accounts",
    designation: "Senior Financial Analyst",
    jobRole: "Accounts Executive",
    location: "Coimbatore",
    employmentType: "Full-Time",
    grade: "L3 - Senior",
    joiningDate: "2023-09-01",
    status: "Active",
    fte: 1.0,
    salaryCost: 1200000,
    skillLevel: 4,
    criticalRole: false,
  },
];

const INITIAL_GAP_ANALYSIS: GapAnalysisItem[] = [
  {
    id: "GAP-01",
    department: "R&D Engineering",
    jobRole: "Senior Embedded Engineer",
    currentHeadcount: 12,
    requiredHeadcount: 16,
    headcountGap: 4,
    currentSkills: "C++, RTOS, STM32",
    requiredSkills: "AUTOSAR, ISO 26262, Rust for Embedded",
    skillGap: 4,
    capacityGap: 520,
    costGap: 6400000,
    gapType: "Skill Shortage",
    gapPriority: "High",
    status: "Action Planned",
  },
  {
    id: "GAP-02",
    department: "R&D Engineering",
    jobRole: "Automation Engineer",
    currentHeadcount: 8,
    requiredHeadcount: 11,
    headcountGap: 3,
    currentSkills: "PLC, SCADA, Ladder",
    requiredSkills: "ROS2, Robotic Motion Planning, Computer Vision",
    skillGap: 4,
    capacityGap: 390,
    costGap: 4200000,
    gapType: "Critical Talent Gap",
    gapPriority: "High",
    status: "Action Planned",
  },
  {
    id: "GAP-03",
    department: "Sales & Marketing",
    jobRole: "Sales Executive",
    currentHeadcount: 14,
    requiredHeadcount: 19,
    headcountGap: 5,
    currentSkills: "Direct B2B Sales",
    requiredSkills: "EV Fleet Procurement & PPP Government Tenders",
    skillGap: 3,
    capacityGap: 650,
    costGap: 5000000,
    gapType: "Headcount Shortage",
    gapPriority: "Medium",
    status: "Action Planned",
  },
  {
    id: "GAP-04",
    department: "Operations",
    jobRole: "Service Technician",
    currentHeadcount: 24,
    requiredHeadcount: 30,
    headcountGap: 6,
    currentSkills: "AC Level 2 Chargers Repair",
    requiredSkills: "DC Fast Charger 350kW Liquid-Cooled Maintenance",
    skillGap: 4,
    capacityGap: 780,
    costGap: 3600000,
    gapType: "Capacity Shortage",
    gapPriority: "High",
    status: "Action Planned",
  },
  {
    id: "GAP-05",
    department: "Finance & Accounts",
    jobRole: "Accounts Executive",
    currentHeadcount: 6,
    requiredHeadcount: 8,
    headcountGap: 2,
    currentSkills: "General Ledger, GST",
    requiredSkills: "Project Cost Accounting, Capex Asset Amortization",
    skillGap: 2,
    capacityGap: 260,
    costGap: 1800000,
    gapType: "Headcount Shortage",
    gapPriority: "Low",
    status: "In Review",
  },
];

const INITIAL_HIRING_PLAN: HiringPlanItem[] = [
  {
    id: "HP-01",
    jobRole: "Senior Embedded Engineer",
    department: "R&D Engineering",
    vacancies: 4,
    hiringType: "Critical Hire",
    requiredSkills: "AUTOSAR, CAN/LIN Protocols, Embedded Linux",
    experienceRequired: "5–8 Years",
    targetHiringDate: "2024-05-31",
    recruitmentSource: "Executive Search / Direct",
    hiringBudget: 6800000,
    hiringPriority: "High",
    status: "Interviewing",
  },
  {
    id: "HP-02",
    jobRole: "Automation Engineer",
    department: "R&D Engineering",
    vacancies: 3,
    hiringType: "New Position",
    requiredSkills: "Robotics Kinematics, Python/C++, OpenCV",
    experienceRequired: "4–6 Years",
    targetHiringDate: "2024-05-31",
    recruitmentSource: "Tech Job Portals",
    hiringBudget: 4500000,
    hiringPriority: "High",
    status: "Sourcing",
  },
  {
    id: "HP-03",
    jobRole: "Sales Executive",
    department: "Sales & Marketing",
    vacancies: 5,
    hiringType: "Expansion",
    requiredSkills: "B2B Mobility Solutions, Fleet Contracts",
    experienceRequired: "3–6 Years",
    targetHiringDate: "2024-06-30",
    recruitmentSource: "LinkedIn & Staffing Partner",
    hiringBudget: 5500000,
    hiringPriority: "Medium",
    status: "Interviewing",
  },
  {
    id: "HP-04",
    jobRole: "Service Technician",
    department: "Operations",
    vacancies: 6,
    hiringType: "Expansion",
    requiredSkills: "High Voltage Certifications, Electrical Troubleshooting",
    experienceRequired: "2–4 Years",
    targetHiringDate: "2024-06-15",
    recruitmentSource: "Technical Institutes / Campus",
    hiringBudget: 3800000,
    hiringPriority: "High",
    status: "Offered",
  },
  {
    id: "HP-05",
    jobRole: "Accounts Executive",
    department: "Finance & Accounts",
    vacancies: 2,
    hiringType: "Replacement",
    requiredSkills: "ERP Accounting, Fixed Asset Ledger, Reconciliation",
    experienceRequired: "3–5 Years",
    targetHiringDate: "2024-06-30",
    recruitmentSource: "Job Portals",
    hiringBudget: 1900000,
    hiringPriority: "Low",
    status: "Open",
  },
];

const INITIAL_CAPACITY: WorkforceCapacityItem[] = [
  {
    id: "CAP-01",
    department: "R&D Engineering",
    jobRole: "Embedded & Firmware Systems",
    availableHeadcount: 36,
    availableFTE: 36.0,
    workingHours: 2000,
    productiveHours: 1640,
    utilizationRate: 82,
    capacityHours: 59040,
    requiredHours: 72000,
    capacityGap: -12960,
    status: "Deficit",
  },
  {
    id: "CAP-02",
    department: "Operations",
    jobRole: "Grid Deployment & Field Services",
    availableHeadcount: 48,
    availableFTE: 48.0,
    workingHours: 2000,
    productiveHours: 1520,
    utilizationRate: 76,
    capacityHours: 72960,
    requiredHours: 88000,
    capacityGap: -15040,
    status: "Deficit",
  },
  {
    id: "CAP-03",
    department: "Sales & Marketing",
    jobRole: "Enterprise Client Acquisition",
    availableHeadcount: 22,
    availableFTE: 22.0,
    workingHours: 2000,
    productiveHours: 1420,
    utilizationRate: 71,
    capacityHours: 31240,
    requiredHours: 36000,
    capacityGap: -4760,
    status: "Deficit",
  },
  {
    id: "CAP-04",
    department: "Customer Support",
    jobRole: "24/7 Operations Center",
    availableHeadcount: 24,
    availableFTE: 24.0,
    workingHours: 2000,
    productiveHours: 1780,
    utilizationRate: 89,
    capacityHours: 42720,
    requiredHours: 46000,
    capacityGap: -3280,
    status: "Deficit",
  },
  {
    id: "CAP-05",
    department: "Finance & Accounts",
    jobRole: "Financial Governance & Tax",
    availableHeadcount: 10,
    availableFTE: 10.0,
    workingHours: 2000,
    productiveHours: 1800,
    utilizationRate: 90,
    capacityHours: 18000,
    requiredHours: 19000,
    capacityGap: -1000,
    status: "Sufficient",
  },
  {
    id: "CAP-06",
    department: "HR & Admin",
    jobRole: "People Operations & Facility",
    availableHeadcount: 8,
    availableFTE: 8.0,
    workingHours: 2000,
    productiveHours: 1760,
    utilizationRate: 88,
    capacityHours: 14080,
    requiredHours: 15000,
    capacityGap: -920,
    status: "Sufficient",
  },
];

const INITIAL_SKILLS: SkillPlanItem[] = [
  {
    id: "SKP-01",
    jobRole: "Firmware Engineer",
    category: "Software",
    skill: "AUTOSAR & ISO 26262 ASIL-D",
    currentLevel: 2,
    requiredLevel: 4,
    skillGap: 2,
    employeesAffected: 14,
    criticalSkill: true,
    developmentRequired: true,
    status: "In Progress",
  },
  {
    id: "SKP-02",
    jobRole: "Power Electronics Designer",
    category: "Engineering",
    skill: "High Voltage SiC MOSFET Inverters",
    currentLevel: 3,
    requiredLevel: 5,
    skillGap: 2,
    employeesAffected: 8,
    criticalSkill: true,
    developmentRequired: true,
    status: "Training Scheduled",
  },
  {
    id: "SKP-03",
    jobRole: "Operations Lead",
    category: "Technical",
    skill: "Megawatt Charging System (MCS) Protocol",
    currentLevel: 2,
    requiredLevel: 4,
    skillGap: 2,
    employeesAffected: 12,
    criticalSkill: true,
    developmentRequired: true,
    status: "Under Assessment",
  },
  {
    id: "SKP-04",
    jobRole: "Enterprise Sales Lead",
    category: "Sales",
    skill: "Government EV Tender Negotiation",
    currentLevel: 3,
    requiredLevel: 4,
    skillGap: 1,
    employeesAffected: 6,
    criticalSkill: false,
    developmentRequired: true,
    status: "Proficient",
  },
  {
    id: "SKP-05",
    jobRole: "Cloud Platform Lead",
    category: "Digital",
    skill: "Kubernetes & Real-time OCPP 2.0.1 Broker",
    currentLevel: 3,
    requiredLevel: 5,
    skillGap: 2,
    employeesAffected: 7,
    criticalSkill: true,
    developmentRequired: true,
    status: "In Progress",
  },
];

const INITIAL_SUCCESSION: SuccessionItem[] = [
  {
    id: "SUC-01",
    criticalPosition: "Chief Technology Officer (CTO)",
    currentEmployee: "Dr. Arvind Rao",
    successor: "Aditya Verma",
    readinessLevel: "Ready < 1 Year",
    competencyGap: 2,
    developmentPlan: "Executive Leadership Program & Board Mentorship",
    expectedReadinessDate: "2025-01-15",
    riskLevel: 2,
    status: "Validated",
  },
  {
    id: "SUC-02",
    criticalPosition: "VP of Grid Operations",
    currentEmployee: "Rajeshwar Iyer",
    successor: "Kavita Menon",
    readinessLevel: "Ready Now",
    competencyGap: 1,
    developmentPlan: "Strategic Cross-Functional Shadowing",
    expectedReadinessDate: "2024-06-01",
    riskLevel: 1,
    status: "Validated",
  },
  {
    id: "SUC-03",
    criticalPosition: "Head of Power Electronics R&D",
    currentEmployee: "Sneha Reddy",
    successor: "Praveen Nair",
    readinessLevel: "Ready 1–2 Years",
    competencyGap: 3,
    developmentPlan: "Advanced SiC Design Certification & Tech Lead Mentoring",
    expectedReadinessDate: "2025-08-30",
    riskLevel: 3,
    status: "In Development",
  },
  {
    id: "SUC-04",
    criticalPosition: "Director of Supply Chain & Manufacturing",
    currentEmployee: "Manoj Chawla",
    successor: "TBD - External Search",
    readinessLevel: "Not Ready",
    competencyGap: 4,
    developmentPlan: "Accelerated Talent Acquisition",
    expectedReadinessDate: "2025-12-31",
    riskLevel: 4,
    status: "Nominated",
  },
];

const INITIAL_SCENARIOS: ScenarioItem[] = [
  {
    id: "SCN-01",
    scenarioName: "Base Case - Planned EV Grid Scale",
    scenarioType: "Base Case",
    revenueAssumption: 25.0,
    demandAssumption: 16.4,
    attritionAssumption: 12.5,
    productivityAssumption: 5.0,
    headcountReq: 312,
    workforceCost: 187500000,
    capacity: 276.5,
    businessImpact: "Achieves targeted 50 new hub deployments with optimal margin.",
    scenarioScore: 92,
    status: "Active",
  },
  {
    id: "SCN-02",
    scenarioName: "Growth Case - High Fleet Demand & Fast Expansion",
    scenarioType: "Growth Case",
    revenueAssumption: 45.0,
    demandAssumption: 32.0,
    attritionAssumption: 15.0,
    productivityAssumption: 8.0,
    headcountReq: 365,
    workforceCost: 228000000,
    capacity: 340.0,
    businessImpact: "Requires aggressive lateral hiring & contractor deployment across 10 metro cities.",
    scenarioScore: 86,
    status: "Simulated",
  },
  {
    id: "SCN-03",
    scenarioName: "Downside Case - Regulatory Delay & Slow Rollout",
    scenarioType: "Downside",
    revenueAssumption: 5.0,
    demandAssumption: 2.0,
    attritionAssumption: 8.0,
    productivityAssumption: 2.0,
    headcountReq: 278,
    workforceCost: 168000000,
    capacity: 250.0,
    businessImpact: "Focuses on upskilling existing staff and freezing external recruitment.",
    scenarioScore: 78,
    status: "Simulated",
  },
];

const INITIAL_ACTIONS: ActionPlanItem[] = [
  {
    id: "ACT-01",
    actionType: "Hire",
    actionDescription: "Execute fast-track recruitment for 4 Senior Embedded Engineers with AUTOSAR experience",
    owner: "Neha Kapoor",
    department: "R&D Engineering",
    priority: "High",
    startDate: "2024-04-15",
    dueDate: "2024-05-31",
    budget: 6800000,
    expectedOutcome: "Zero firmware delivery bottlenecks for Gen-4 high-speed chargers",
    status: "In Progress",
  },
  {
    id: "ACT-02",
    actionType: "Train",
    actionDescription: "Enroll 14 Firmware and Hardware engineers into ISO 26262 Functional Safety Certification",
    owner: "Dr. Arvind Rao",
    department: "R&D Engineering",
    priority: "High",
    startDate: "2024-05-01",
    dueDate: "2024-06-30",
    budget: 1500000,
    expectedOutcome: "100% compliance with automotive functional safety audits",
    status: "In Progress",
  },
  {
    id: "ACT-03",
    actionType: "Redeploy",
    actionDescription: "Transfer 3 senior technicians from Bengaluru to Chennai Greenfield Charging Depot",
    owner: "Rajeshwar Iyer",
    department: "Operations",
    priority: "Medium",
    startDate: "2024-05-15",
    dueDate: "2024-06-15",
    budget: 450000,
    expectedOutcome: "Immediate on-site leadership for new station commissioning",
    status: "In Progress",
  },
  {
    id: "ACT-04",
    actionType: "Automate",
    actionDescription: "Deploy automated cloud telemetry diagnostics to reduce Tier-1 manual dispatch by 25%",
    owner: "Sneha Reddy",
    department: "Customer Support",
    priority: "High",
    startDate: "2024-04-20",
    dueDate: "2024-07-15",
    budget: 2200000,
    expectedOutcome: "Support capacity optimization without increasing linear headcount",
    status: "Pending",
  },
];

const INITIAL_APPROVALS: ApprovalLevelItem[] = [
  {
    id: "APV-01",
    level: 1,
    role: "HR Strategist & Lead",
    approver: "Neha Kapoor",
    approvalType: "Mandatory",
    submittedDate: "2024-04-10 10:30 AM",
    decisionDate: "2024-04-11 02:15 PM",
    decision: "Approved",
    comments: "Workforce demand consolidated across all business units with gap metrics.",
  },
  {
    id: "APV-02",
    level: 2,
    role: "Department Heads (Engineering & Ops)",
    approver: "Dr. Arvind Rao & Rajeshwar Iyer",
    approvalType: "Mandatory",
    submittedDate: "2024-04-11 03:00 PM",
    decisionDate: "2024-04-12 11:45 AM",
    decision: "Approved",
    comments: "Critical talent requirements and lab test capacity fully aligned.",
  },
  {
    id: "APV-03",
    level: 3,
    role: "Finance & Budget Controller",
    approver: "Sunil Shenoy",
    approvalType: "Mandatory",
    submittedDate: "2024-04-12 01:30 PM",
    decisionDate: "2024-04-13 04:00 PM",
    decision: "Approved",
    comments: "Budget within ₹20.00 Cr allocation with a safe reserve of ₹1.25 Cr.",
  },
  {
    id: "APV-04",
    level: 4,
    role: "VP Operations & HR",
    approver: "Vikram Singh",
    approvalType: "Mandatory",
    submittedDate: "2024-04-14 09:00 AM",
    decisionDate: "2024-04-14 05:30 PM",
    decision: "Approved",
    comments: "Final approval granted for execution across all branches.",
  },
];

const INITIAL_DOCS: DocumentItem[] = [
  {
    id: "DOC-01",
    documentType: "Workforce Plan",
    documentNumber: "WFP-DOC-2024-01",
    fileName: "Annual_Workforce_Plan_2024_25_Executive.pdf",
    fileSize: "4.8 MB",
    version: "v2.1",
    uploadedBy: "Neha Kapoor",
    uploadDate: "2024-04-15",
    confidential: true,
    status: "Verified",
  },
  {
    id: "DOC-02",
    documentType: "Manpower Budget",
    documentNumber: "WFP-DOC-2024-02",
    fileName: "FY24_25_Workforce_Budget_Cost_Model.xlsx",
    fileSize: "2.4 MB",
    version: "v1.4",
    uploadedBy: "Sunil Shenoy",
    uploadDate: "2024-04-13",
    confidential: true,
    status: "Verified",
  },
  {
    id: "DOC-03",
    documentType: "Skill Matrix",
    documentNumber: "WFP-DOC-2024-03",
    fileName: "Engineering_Competency_Matrix_2024.pdf",
    fileSize: "3.1 MB",
    version: "v1.0",
    uploadedBy: "Aditya Verma",
    uploadDate: "2024-04-10",
    confidential: false,
    status: "Verified",
  },
  {
    id: "DOC-04",
    documentType: "Succession Plan",
    documentNumber: "WFP-DOC-2024-04",
    fileName: "Leadership_Succession_Risk_Assessment.pdf",
    fileSize: "1.9 MB",
    version: "v1.2",
    uploadedBy: "Vikram Singh",
    uploadDate: "2024-04-14",
    confidential: true,
    status: "Verified",
  },
];

// Main Component
export default function WorkforcePlanningPage() {
  const [activeTab, setActiveTab] = useState<string>("demand");
  const [master, setMaster] = useState<MasterPlan>(INITIAL_MASTER);
  const [demandList, setDemandList] = useState<DemandForecastItem[]>(INITIAL_DEMAND_FORECAST);
  const [workforceList, setWorkforceList] = useState<CurrentWorkforceItem[]>(INITIAL_CURRENT_WORKFORCE);
  const [gapList, setGapList] = useState<GapAnalysisItem[]>(INITIAL_GAP_ANALYSIS);
  const [hiringList, setHiringList] = useState<HiringPlanItem[]>(INITIAL_HIRING_PLAN);
  const [skillsList, setSkillsList] = useState<SkillPlanItem[]>(INITIAL_SKILLS);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State for New Entries
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHiringRole, setNewHiringRole] = useState("");
  const [newHiringDept, setNewHiringDept] = useState("R&D Engineering");
  const [newHiringVacancies, setNewHiringVacancies] = useState(1);
  const [newHiringPriority, setNewHiringPriority] = useState<"High" | "Medium" | "Low">("High");
  const [newHiringDate, setNewHiringDate] = useState("2024-07-31");

  // Demand Driver Modal
  const [isDemandModalOpen, setIsDemandModalOpen] = useState(false);
  const [newDemandDept, setNewDemandDept] = useState("R&D Engineering");
  const [newDemandDriver, setNewDemandDriver] = useState("");
  const [newDemandMetric, setNewDemandMetric] = useState("");
  const [newDemandCurrent, setNewDemandCurrent] = useState("10");
  const [newDemandForecast, setNewDemandForecast] = useState("15");
  const [newDemandGrowth, setNewDemandGrowth] = useState("50");

  const handleSavePlan = () => {
    toast.success("Workforce Plan WFPL-2024-0001 saved successfully", {
      description: "All changes across 16 sub-dimensions synchronized to central ERP database.",
    });
  };

  const handleStatusProgress = (newStatus: PlanStatusType) => {
    setMaster((prev) => ({ ...prev, status: newStatus }));
    toast.success(`Plan Status updated to ${newStatus}`);
  };

  const handleAddNewHiring = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHiringRole) {
      toast.error("Please enter a job role name");
      return;
    }
    const newItem: HiringPlanItem = {
      id: `HP-0${hiringList.length + 1}`,
      jobRole: newHiringRole,
      department: newHiringDept,
      vacancies: Number(newHiringVacancies) || 1,
      hiringType: "New Position",
      requiredSkills: "Domain expertise, relevant certifications",
      experienceRequired: "3–5 Years",
      targetHiringDate: newHiringDate,
      recruitmentSource: "Direct Portal",
      hiringBudget: Number(newHiringVacancies) * 1200000,
      hiringPriority: newHiringPriority,
      status: "Open",
    };
    setHiringList([newItem, ...hiringList]);
    setIsModalOpen(false);
    setNewHiringRole("");
    toast.success(`Hiring requirement created for ${newHiringRole}`);
  };

  const handleAddNewDemand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDemandDriver) {
      toast.error("Please enter a demand driver name");
      return;
    }
    const newDemand: DemandForecastItem = {
      id: `DF-00${demandList.length + 1}`,
      businessUnit: master.businessUnit || "Autonomous EV Charging",
      department: newDemandDept,
      demandDriver: newDemandDriver,
      forecastMetric: newDemandMetric || `${newDemandDriver} Capacity Target`,
      currentValue: Number(newDemandCurrent) || 0,
      forecastValue: Number(newDemandForecast) || 0,
      growthRate: Number(newDemandGrowth) || 25,
      period: "2024-04-01 to 2025-03-31",
      demandVolume: Math.max(0, (Number(newDemandForecast) || 0) - (Number(newDemandCurrent) || 0)),
      productivityAssumption: 0.9,
      forecastMethod: "Driver-Based",
      confidenceLevel: 85,
      status: "Approved",
    };
    setDemandList([newDemand, ...demandList]);
    setIsDemandModalOpen(false);
    setNewDemandDriver("");
    setNewDemandMetric("");
    toast.success(`Demand driver "${newDemandDriver}" added successfully`);
  };

  const handleExportData = (type: "excel" | "pdf") => {
    toast.success(`Workforce Plan exported as ${type.toUpperCase()}`, {
      description: `Downloaded WFPL-2024-0001_${new Date().toISOString().slice(0, 10)}.${type === "excel" ? "xlsx" : "pdf"}`,
    });
  };

  const formatCurrency = (val: number) => {
    return "₹ " + val.toLocaleString("en-IN");
  };

  const STATUS_WORKFLOW_STEPS: PlanStatusType[] = [
    "Draft",
    "Workforce Analysis",
    "Demand Planning",
    "Gap Analysis",
    "Budget Review",
    "Approval",
    "Approved",
    "Execution",
    "Monitoring",
    "Closed",
  ];

  return (
    <AppShell
      title="Workforce Planning"
      breadcrumb="Management > HRM Management > Workforce Planning"
      description="The Workforce Planning Form manages the organization’s workforce requirements from business demand → workforce analysis → manpower requirement → skills gap → hiring plan → workforce allocation → capacity → cost → succession → optimization → monitoring."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Status Badges */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Workforce Planning Form
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" />
                {master.status}
              </span>
              <span className="hidden md:inline-block font-mono text-xs text-muted-foreground">
                {master.planNumber}
              </span>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                New Plan
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
                onClick={handleSavePlan}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Master Form Card & Top Workforce Summary Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8-Cols: 1. Workforce Planning Master */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  1
                </span>
                Workforce Planning Master
              </h3>
              <span className="text-xs text-muted-foreground">
                ID: <span className="font-mono font-medium text-slate-700">{master.planId}</span>
              </span>
            </div>

            {/* Master Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Plan Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={master.planNumber}
                  onChange={(e) => setMaster({ ...master, planNumber: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Plan Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={master.planName}
                  onChange={(e) => setMaster({ ...master, planName: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Planning Period <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    value={master.startDate}
                    onChange={(e) => setMaster({ ...master, startDate: e.target.value })}
                    className="w-1/2 h-8 px-2 rounded-md border border-slate-200 text-[11px] font-medium text-slate-800 focus:border-primary focus:outline-hidden"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="date"
                    value={master.endDate}
                    onChange={(e) => setMaster({ ...master, endDate: e.target.value })}
                    className="w-1/2 h-8 px-2 rounded-md border border-slate-200 text-[11px] font-medium text-slate-800 focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Planning Year <span className="text-rose-500">*</span>
                </label>
                <select
                  value={master.planningYear}
                  onChange={(e) => setMaster({ ...master, planningYear: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden bg-white"
                >
                  <option value="FY 2024-25">FY 2024-25</option>
                  <option value="FY 2025-26">FY 2025-26</option>
                  <option value="FY 2026-27">FY 2026-27</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Plan Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={master.planType}
                  onChange={(e) => setMaster({ ...master, planType: e.target.value as PlanTypeEnum })}
                  className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden bg-white"
                >
                  <option value="Annual Workforce Plan">Annual Workforce Plan</option>
                  <option value="Strategic Workforce Plan">Strategic Workforce Plan</option>
                  <option value="Project Workforce Plan">Project Workforce Plan</option>
                  <option value="Department Workforce Plan">Department Workforce Plan</option>
                  <option value="Branch Workforce Plan">Branch Workforce Plan</option>
                  <option value="Expansion Workforce Plan">Expansion Workforce Plan</option>
                  <option value="Hiring Plan">Hiring Plan</option>
                  <option value="Capacity Plan">Capacity Plan</option>
                  <option value="Contingency Workforce Plan">Contingency Workforce Plan</option>
                  <option value="Transformation Workforce Plan">Transformation Workforce Plan</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Organization <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={master.organization}
                  onChange={(e) => setMaster({ ...master, organization: e.target.value })}
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
                  Business Unit <span className="text-slate-400">(Lookup)</span>
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
                  Department <span className="text-slate-400">(Lookup)</span>
                </label>
                <input
                  type="text"
                  value={master.department}
                  onChange={(e) => setMaster({ ...master, department: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* Plan Owner */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Plan Owner <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={master.planOwner.name}
                  onChange={(e) =>
                    setMaster({
                      ...master,
                      planOwner: { ...master.planOwner, name: e.target.value },
                    })
                  }
                  className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* Approver */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Approver <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={master.approver.name}
                  onChange={(e) =>
                    setMaster({
                      ...master,
                      approver: { ...master.approver, name: e.target.value },
                    })
                  }
                  className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* Plan Status Workflow selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Plan Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={master.status}
                  onChange={(e) => handleStatusProgress(e.target.value as PlanStatusType)}
                  className="w-full h-8 px-2.5 rounded-md border border-emerald-300 text-xs font-bold text-emerald-700 bg-emerald-50/50 focus:border-primary focus:outline-hidden"
                >
                  {STATUS_WORKFLOW_STEPS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plan Objective */}
              <div className="sm:col-span-2 md:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Plan Objective <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={master.planObjective}
                  onChange={(e) => setMaster({ ...master, planObjective: e.target.value })}
                  className="w-full p-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 focus:border-primary focus:outline-hidden bg-slate-50/30 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right 4-Cols: Workforce Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Workforce Summary
              </h3>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                FY 24-25
              </span>
            </div>

            {/* KPI List Grid */}
            <div className="space-y-2 text-xs divide-y divide-slate-100/80">
              <div className="flex items-center justify-between pt-1.5">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  Total Headcount (Current)
                </span>
                <span className="font-bold text-slate-900 font-mono">268</span>
              </div>

              <div className="flex items-center justify-between pt-1.5">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-blue-500" />
                  Planned Headcount
                </span>
                <span className="font-bold text-slate-900 font-mono">312</span>
              </div>

              <div className="flex items-center justify-between pt-1.5">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                  Headcount Gap
                </span>
                <span className="font-bold text-rose-600 font-mono">44</span>
              </div>

              <div className="flex items-center justify-between pt-1.5">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-amber-500" />
                  Open Positions
                </span>
                <span className="font-bold text-slate-900 font-mono">37</span>
              </div>

              <div className="flex items-center justify-between pt-1.5">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <UserPlus className="h-3.5 w-3.5 text-emerald-500" />
                  Hiring Requirement
                </span>
                <span className="font-bold text-slate-900 font-mono">44</span>
              </div>

              <div className="flex items-center justify-between pt-1.5">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
                  Attrition Rate (Forecast)
                </span>
                <span className="font-bold text-slate-900 font-mono">12.5%</span>
              </div>

              <div className="flex items-center justify-between pt-1.5">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                  Total Workforce Cost
                </span>
                <span className="font-bold text-slate-900 font-mono">₹ 18,75,00,000</span>
              </div>

              <div className="flex items-center justify-between pt-1.5">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5 text-indigo-500" />
                  Budgeted Cost
                </span>
                <span className="font-bold text-slate-900 font-mono">₹ 20,00,00,000</span>
              </div>

              <div className="flex items-center justify-between pt-1.5">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Budget Variance
                </span>
                <span className="font-bold text-emerald-600 font-mono">₹ 1,25,00,000</span>
              </div>

              <div className="flex items-center justify-between pt-1.5">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  Utilization Rate
                </span>
                <span className="font-bold text-slate-900 font-mono">78%</span>
              </div>

              <div className="flex items-center justify-between pt-1.5">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <BrainCircuit className="h-3.5 w-3.5 text-purple-500" />
                  Productivity Index
                </span>
                <span className="font-bold text-slate-900 font-mono">1.24</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Overall Plan Progress</span>
                <span className="font-bold text-primary font-mono">65%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-2 rounded-full transition-all duration-500 w-[65%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Inner Sub-Navigation Tabs */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "demand", label: "Demand Forecast", icon: TrendingUp },
              { id: "workforce", label: "Current Workforce", icon: Users },
              { id: "gap", label: "Gap Analysis", icon: Scale },
              { id: "hiring", label: "Hiring Plan", icon: UserPlus },
              { id: "skills", label: "Skills & Development", icon: GraduationCap },
              { id: "budget", label: "Cost & Budget", icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer",
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



        {/* TAB 2: DEMAND FORECAST */}
        {activeTab === "demand" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Business Demand Forecast
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Forecast workforce requirements driven by revenue, fleet expansion, new products & grid projects.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDemandModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Demand Driver
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Forecast ID</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Demand Driver</th>
                    <th className="py-2.5 px-3">Forecast Metric</th>
                    <th className="py-2.5 px-3 text-center">Current</th>
                    <th className="py-2.5 px-3 text-center">Forecast</th>
                    <th className="py-2.5 px-3 text-center">Growth %</th>
                    <th className="py-2.5 px-3 text-center">Method</th>
                    <th className="py-2.5 px-3 text-center">Confidence</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {demandList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-mono font-semibold text-blue-600">{item.id}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{item.department}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {item.demandDriver}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate">{item.forecastMetric}</td>
                      <td className="py-3 px-3 text-center font-mono font-medium">{item.currentValue}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-primary">{item.forecastValue}</td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-emerald-600">
                        +{item.growthRate}%
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">{item.forecastMethod}</td>
                      <td className="py-3 px-3 text-center font-mono font-semibold">{item.confidenceLevel}%</td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CURRENT WORKFORCE */}
        {activeTab === "workforce" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Current Workforce Snapshot
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Live snapshot of employees, designations, skill proficiency, FTE and critical roles.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search employee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 pl-8 pr-3 text-xs rounded-md border border-slate-200 focus:border-primary focus:outline-hidden w-48"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Job Role</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3 text-center">FTE</th>
                    <th className="py-2.5 px-3 text-center">Skill (1-5)</th>
                    <th className="py-2.5 px-3 text-center">Critical</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workforceList
                    .filter(
                      (emp) =>
                        emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        emp.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900">{emp.employeeName}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{emp.employeeId}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{emp.department}</td>
                      <td className="py-3 px-3 text-slate-600">{emp.jobRole}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700">
                          {emp.employmentType}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{emp.location}</td>
                      <td className="py-3 px-3 text-center font-mono font-medium">{emp.fte}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-slate-800">{emp.skillLevel}.0 / 5.0</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {emp.criticalRole ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Critical
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Standard</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}



        {/* TAB 5: GAP ANALYSIS */}
        {activeTab === "gap" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" />
                Workforce Gap Analysis Matrix
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Evaluate headcount, skill shortages, leadership deficits, capacity and cost impact.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Gap ID</th>
                    <th className="py-2.5 px-3">Department & Role</th>
                    <th className="py-2.5 px-3">Gap Type</th>
                    <th className="py-2.5 px-3 text-center">Headcount Gap</th>
                    <th className="py-2.5 px-3">Required Competencies</th>
                    <th className="py-2.5 px-3 text-center">Cost Gap</th>
                    <th className="py-2.5 px-3 text-center">Priority</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gapList.map((gap) => (
                    <tr key={gap.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-mono font-semibold text-blue-600">{gap.id}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{gap.jobRole}</div>
                        <div className="text-[10px] text-muted-foreground">{gap.department}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          {gap.gapType}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-rose-600">+{gap.headcountGap}</td>
                      <td className="py-3 px-3 text-slate-700 max-w-[200px] truncate">{gap.requiredSkills}</td>
                      <td className="py-3 px-3 text-center font-mono font-semibold">{formatCurrency(gap.costGap)}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                            gap.gapPriority === "High"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800",
                          )}
                        >
                          {gap.gapPriority}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {gap.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: HIRING PLAN */}
        {activeTab === "hiring" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-primary" />
                  Talent Acquisition & Hiring Plan
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Position requirements, hiring type, recruitment sources, target dates and hiring budgets.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                New Hiring Requirement
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Plan ID</th>
                    <th className="py-2.5 px-3">Job Role</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-center">Vacancies</th>
                    <th className="py-2.5 px-3">Hiring Type</th>
                    <th className="py-2.5 px-3">Target Date</th>
                    <th className="py-2.5 px-3">Recruitment Source</th>
                    <th className="py-2.5 px-3 text-center">Hiring Budget</th>
                    <th className="py-2.5 px-3 text-center">Priority</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hiringList.map((hire) => (
                    <tr key={hire.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-mono font-semibold text-blue-600">{hire.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{hire.jobRole}</td>
                      <td className="py-3 px-3 font-medium text-slate-700">{hire.department}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-primary">{hire.vacancies}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                          {hire.hiringType}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-mono">{hire.targetHiringDate}</td>
                      <td className="py-3 px-3 text-slate-600">{hire.recruitmentSource}</td>
                      <td className="py-3 px-3 text-center font-mono">{formatCurrency(hire.hiringBudget)}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                            hire.hiringPriority === "High"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200",
                          )}
                        >
                          {hire.hiringPriority}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {hire.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: SKILLS & DEVELOPMENT */}
        {activeTab === "skills" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Skill Matrix & Training Development Plan
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upskilling roadmap across 12 Skill Categories: Technical, Functional, Managerial, Digital, Compliance, etc.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Skill Plan ID</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Competency / Skill</th>
                    <th className="py-2.5 px-3 text-center">Current Level</th>
                    <th className="py-2.5 px-3 text-center">Required Level</th>
                    <th className="py-2.5 px-3 text-center">Skill Gap</th>
                    <th className="py-2.5 px-3 text-center">Employees Affected</th>
                    <th className="py-2.5 px-3 text-center">Critical Skill</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {skillsList.map((skill) => (
                    <tr key={skill.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-mono font-semibold text-blue-600">{skill.id}</td>
                      <td className="py-3 px-3 font-medium text-slate-700">{skill.category}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{skill.skill}</td>
                      <td className="py-3 px-3 text-center font-mono">{skill.currentLevel}.0</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-primary">{skill.requiredLevel}.0</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-rose-600">-{skill.skillGap}</td>
                      <td className="py-3 px-3 text-center font-mono font-semibold">{skill.employeesAffected}</td>
                      <td className="py-3 px-3 text-center">
                        {skill.criticalSkill ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Yes
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">No</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {skill.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: COST & BUDGET */}
        {activeTab === "budget" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Workforce Cost & Budget Breakdown
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Detailed cost planning covering base salary, benefits, recruitment, training, overtime and budget variance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs text-muted-foreground font-semibold">Total Approved Budget</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">₹ 20,00,00,000</div>
                <div className="text-[11px] text-slate-500">Board Approved for FY2024-25</div>
              </div>
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-1">
                <div className="text-xs text-blue-700 font-semibold">Planned Workforce Cost</div>
                <div className="text-xl font-extrabold text-blue-900 font-mono">₹ 18,75,00,000</div>
                <div className="text-[11px] text-blue-600">Committed base + expansion cost</div>
              </div>
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-1">
                <div className="text-xs text-emerald-700 font-semibold">Variance & Contingency</div>
                <div className="text-xl font-extrabold text-emerald-900 font-mono">₹ 1,25,00,000</div>
                <div className="text-[11px] text-emerald-600">6.25% safe reserve available</div>
              </div>
            </div>
          </div>
        )}




      </div>

      {/* Modal: New Hiring Requirement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-primary" />
                Create Hiring Requirement
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewHiring} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Role Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Power Electronics Engineer"
                  value={newHiringRole}
                  onChange={(e) => setNewHiringRole(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newHiringDept}
                    onChange={(e) => setNewHiringDept(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white"
                  >
                    <option value="R&D Engineering">R&D Engineering</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="HR & Admin">HR & Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vacancies</label>
                  <input
                    type="number"
                    min={1}
                    value={newHiringVacancies}
                    onChange={(e) => setNewHiringVacancies(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newHiringPriority}
                    onChange={(e) => setNewHiringPriority(e.target.value as "High" | "Medium" | "Low")}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newHiringDate}
                    onChange={(e) => setNewHiringDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer shadow-xs"
                >
                  Add to Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Demand Driver */}
      {isDemandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Add Business Demand Driver
              </h3>
              <button
                type="button"
                onClick={() => setIsDemandModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewDemand} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Demand Driver Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EV Powertrain Program Expansion"
                  value={newDemandDriver}
                  onChange={(e) => setNewDemandDriver(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newDemandDept}
                    onChange={(e) => setNewDemandDept(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white"
                  >
                    <option value="R&D Engineering">R&D Engineering</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="HR & Admin">HR & Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Growth %</label>
                  <input
                    type="number"
                    value={newDemandGrowth}
                    onChange={(e) => setNewDemandGrowth(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Forecast Metric / Target</label>
                <input
                  type="text"
                  placeholder="e.g. 50,000 Units Annual Output"
                  value={newDemandMetric}
                  onChange={(e) => setNewDemandMetric(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Metric</label>
                  <input
                    type="text"
                    value={newDemandCurrent}
                    onChange={(e) => setNewDemandCurrent(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Forecast Metric</label>
                  <input
                    type="text"
                    value={newDemandForecast}
                    onChange={(e) => setNewDemandForecast(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDemandModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer shadow-xs"
                >
                  Add Demand Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
