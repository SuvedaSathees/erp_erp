import { queryOptions } from "@tanstack/react-query";

export interface AdminOverviewData {
  kpis: {
    totalBranches: number;
    activeDepartments: number;
    activeUsers: number;
    rolesAndPermissions: number;
    pendingApprovals: number;
    controlledDocuments: number;
    activePolicies: number;
    masterDataEntities: number;
    systemAuditScore: number;
    unreadNotifications: number;
  };
  branchDistribution: Array<{
    branch: string;
    code: string;
    city: string;
    headcount: number;
    departmentsCount: number;
    status: "Active" | "Expanding";
  }>;
  approvalMatrixPipeline: Array<{
    matrixType: string;
    pendingCount: number;
    avgApprovalHours: number;
    slaMetPercentage: number;
  }>;
  documentLifecycle: Array<{
    status: string;
    count: number;
    color: string;
  }>;
  pendingApprovalsList: Array<{
    id: string;
    requestType: string;
    reference: string;
    requestedBy: string;
    department: string;
    submissionDate: string;
    amount?: number;
    priority: "High" | "Medium" | "Urgent";
  }>;
  recentAuditLogs: Array<{
    id: string;
    event: string;
    module: string;
    actor: string;
    timestamp: string;
    severity: "Info" | "Warning" | "Critical";
  }>;
}

const MOCK_ADMIN_DATA: AdminOverviewData = {
  kpis: {
    totalBranches: 6,
    activeDepartments: 14,
    activeUsers: 385,
    rolesAndPermissions: 28,
    pendingApprovals: 19,
    controlledDocuments: 142,
    activePolicies: 36,
    masterDataEntities: 1250,
    systemAuditScore: 98.2,
    unreadNotifications: 8,
  },
  branchDistribution: [
    { branch: "Corporate Headquarters", code: "HQ-BLR", city: "Bengaluru", headcount: 165, departmentsCount: 12, status: "Active" },
    { branch: "Plant 1 - Manufacturing Hub", code: "PLT-PUN", city: "Pune", headcount: 140, departmentsCount: 8, status: "Active" },
    { branch: "R&D Centre of Excellence", code: "RND-HYD", city: "Hyderabad", headcount: 62, departmentsCount: 5, status: "Active" },
    { branch: "North Regional Sales Office", code: "SLS-DEL", city: "New Delhi", headcount: 28, departmentsCount: 3, status: "Active" },
    { branch: "West Regional Logistics Hub", code: "LOG-MUM", city: "Mumbai", headcount: 22, departmentsCount: 3, status: "Active" },
    { branch: "Chennai Assembly Facility", code: "FAC-CHE", city: "Chennai", headcount: 11, departmentsCount: 2, status: "Expanding" },
  ],
  approvalMatrixPipeline: [
    { matrixType: "Purchase Orders > ₹5L", pendingCount: 6, avgApprovalHours: 4.2, slaMetPercentage: 96 },
    { matrixType: "CapEx & Asset Procurement", pendingCount: 4, avgApprovalHours: 12.5, slaMetPercentage: 92 },
    { matrixType: "HR Headcount Requisition", pendingCount: 3, avgApprovalHours: 8.0, slaMetPercentage: 100 },
    { matrixType: "Quality Non-Conformance Deviation", pendingCount: 2, avgApprovalHours: 2.5, slaMetPercentage: 98 },
    { matrixType: "Vendor Master Onboarding", pendingCount: 4, avgApprovalHours: 6.8, slaMetPercentage: 94 },
  ],
  documentLifecycle: [
    { status: "Approved / Effective", count: 98, color: "#16a34a" },
    { status: "Under Periodic Review", count: 24, color: "#2563eb" },
    { status: "Draft Revision", count: 12, color: "#f59e0b" },
    { status: "Archived / Superseded", count: 8, color: "#94a3b8" },
  ],
  pendingApprovalsList: [
    { id: "APR-2026-081", requestType: "CapEx Procurement", reference: "PO-2026-0419 (SMT Feeder Line)", requestedBy: "Karthik Subramanian", department: "Manufacturing", submissionDate: "Today, 10:15 AM", amount: 1450000, priority: "Urgent" },
    { id: "APR-2026-079", requestType: "Vendor Master", reference: "VND-2026-0128 (Precision Mold Works)", requestedBy: "Anita Sharma", department: "Procurement", submissionDate: "Today, 09:30 AM", priority: "High" },
    { id: "APR-2026-075", requestType: "Headcount Requisition", reference: "REQ-2026-0042 (Senior ASIC Designer)", requestedBy: "Dr. Aris Vance", department: "R&D", submissionDate: "Yesterday", priority: "Medium" },
    { id: "APR-2026-072", requestType: "SOP Revision", reference: "SOP-MFG-082 (High-Voltage Flash Test)", requestedBy: "David Miller", department: "Quality", submissionDate: "Yesterday", priority: "High" },
  ],
  recentAuditLogs: [
    { id: "AUD-8912", event: "User Role Escalation Approved", module: "User & Role Management", actor: "Rahul Sharma (Admin)", timestamp: "20 mins ago", severity: "Info" },
    { id: "AUD-8911", event: "Master Data Schema Updated", module: "Master Data Management", actor: "System Daemon", timestamp: "1 hour ago", severity: "Info" },
    { id: "AUD-8910", event: "Policy Document Signed Off", module: "Policy Management", actor: "Elena Rostova (VP Legal)", timestamp: "3 hours ago", severity: "Info" },
    { id: "AUD-8909", event: "Failed Login Threshold Warning", module: "Security & Access", actor: "IP 192.168.1.104", timestamp: "5 hours ago", severity: "Warning" },
  ],
};

export function adminOverviewOptions() {
  return queryOptions<AdminOverviewData>({
    queryKey: ["administration-management", "overview"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 80));
      return MOCK_ADMIN_DATA;
    },
  });
}
