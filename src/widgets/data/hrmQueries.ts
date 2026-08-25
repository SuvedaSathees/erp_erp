import { queryOptions } from "@tanstack/react-query";

export interface HrmOverviewData {
  kpis: {
    totalEmployees: number;
    activeWorkforce: number;
    monthlyPayroll: number;
    openRequisitions: number;
    attendanceRate: number;
    onboardingInProgress: number;
    pendingLeaves: number;
    trainingHoursMonth: number;
    retentionRate: number;
    performanceScoreAvg: number;
    welfareClaims: number;
    exitsQuarter: number;
  };
  recruitmentFunnel: Array<{
    stage: string;
    count: number;
    conversionRate: number;
  }>;
  departmentDistribution: Array<{
    department: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  payrollTrend: Array<{
    month: string;
    baseSalaries: number;
    incentives: number;
    overtime: number;
    total: number;
  }>;
  attendanceBreakdown: Array<{
    status: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  upcomingReviewsAndExits: Array<{
    id: string;
    employeeName: string;
    department: string;
    role: string;
    type: "Probation Review" | "Exit Clearance" | "Appraisal Due" | "Contract Renewal";
    dueDate: string;
    status: "Pending" | "In Review" | "Scheduled";
    avatar: string;
  }>;
}

const MOCK_HRM_DATA: HrmOverviewData = {
  kpis: {
    totalEmployees: 428,
    activeWorkforce: 412,
    monthlyPayroll: 18450000,
    openRequisitions: 24,
    attendanceRate: 96.4,
    onboardingInProgress: 9,
    pendingLeaves: 14,
    trainingHoursMonth: 340,
    retentionRate: 94.8,
    performanceScoreAvg: 4.3,
    welfareClaims: 18,
    exitsQuarter: 5,
  },
  recruitmentFunnel: [
    { stage: "Applications Received", count: 480, conversionRate: 100 },
    { stage: "Shortlisted", count: 180, conversionRate: 37.5 },
    { stage: "Technical Assessment", count: 85, conversionRate: 17.7 },
    { stage: "Manager Interview", count: 42, conversionRate: 8.75 },
    { stage: "HR Discussion", count: 28, conversionRate: 5.8 },
    { stage: "Offers Extended", count: 18, conversionRate: 3.75 },
    { stage: "Joined / Onboarded", count: 14, conversionRate: 2.9 },
  ],
  departmentDistribution: [
    { department: "Engineering & R&D", count: 154, percentage: 36, color: "#2563eb" },
    { department: "Manufacturing & Assembly", count: 120, percentage: 28, color: "#16a34a" },
    { department: "Sales & Marketing", count: 58, percentage: 14, color: "#9333ea" },
    { department: "Quality Assurance", count: 38, percentage: 9, color: "#d97706" },
    { department: "Finance & Accounts", count: 28, percentage: 7, color: "#0891b2" },
    { department: "Human Resources & Admin", count: 30, percentage: 6, color: "#e11d48" },
  ],
  payrollTrend: [
    { month: "Mar", baseSalaries: 16200000, incentives: 1400000, overtime: 450000, total: 18050000 },
    { month: "Apr", baseSalaries: 16400000, incentives: 1550000, overtime: 480000, total: 18430000 },
    { month: "May", baseSalaries: 16400000, incentives: 1300000, overtime: 420000, total: 18120000 },
    { month: "Jun", baseSalaries: 16700000, incentives: 1600000, overtime: 510000, total: 18810000 },
    { month: "Jul", baseSalaries: 16700000, incentives: 1450000, overtime: 390000, total: 18540000 },
    { month: "Aug", baseSalaries: 16900000, incentives: 1100000, overtime: 450000, total: 18450000 },
  ],
  attendanceBreakdown: [
    { status: "Present", count: 398, percentage: 93, color: "#16a34a" },
    { status: "On Leave", count: 14, percentage: 3.3, color: "#2563eb" },
    { status: "Remote Work", count: 12, percentage: 2.8, color: "#9333ea" },
    { status: "Absent / Unaccounted", count: 4, percentage: 0.9, color: "#ef4444" },
  ],
  upcomingReviewsAndExits: [
    {
      id: "EMP-2026-089",
      employeeName: "Ananya Deshmukh",
      department: "Engineering & R&D",
      role: "Senior Embedded Systems Engineer",
      type: "Probation Review",
      dueDate: "28 Aug 2026",
      status: "Pending",
      avatar: "AD",
    },
    {
      id: "EMP-2025-142",
      employeeName: "Vikram Singhania",
      department: "Sales & Marketing",
      role: "Key Account Manager",
      type: "Appraisal Due",
      dueDate: "30 Aug 2026",
      status: "Scheduled",
      avatar: "VS",
    },
    {
      id: "EMP-2024-067",
      employeeName: "Rohan Kulkarni",
      department: "Manufacturing",
      role: "CNC Machinist",
      type: "Exit Clearance",
      dueDate: "31 Aug 2026",
      status: "In Review",
      avatar: "RK",
    },
    {
      id: "EMP-2026-114",
      employeeName: "Pooja Hegde",
      department: "Quality Assurance",
      role: "QA Inspector",
      type: "Probation Review",
      dueDate: "05 Sep 2026",
      status: "Pending",
      avatar: "PH",
    },
    {
      id: "EMP-2025-201",
      employeeName: "Siddharth Rao",
      department: "Finance",
      role: "Senior Accountant",
      type: "Contract Renewal",
      dueDate: "10 Sep 2026",
      status: "Scheduled",
      avatar: "SR",
    },
  ],
};

export function hrmOverviewOptions() {
  return queryOptions<HrmOverviewData>({
    queryKey: ["hrm-management", "overview"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 80));
      return MOCK_HRM_DATA;
    },
  });
}
