import { useState , useEffect} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { hrmManagementService } from "@/services";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AdminManagementTabBar } from "@/components/erp/AdminManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  Users,
  Layers,
  Sliders,
  TrendingUp,
  AlertTriangle,
  FileText,
  Clock,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Save,
  Send,
  ShieldCheck,
  DollarSign,
  Building,
  Landmark,
  Star,
  Activity,
  CheckSquare,
  FileCheck,
  FolderTree,
  UserCheck,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Percent,
  Lock,
  Archive,
  RefreshCw,
  Award,
  Zap,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/management/administration-management/department-management")({
  head: () => ({
    meta: [
      { title: "Department Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Manage complete department lifecycle from strategy, organizational mapping, workforce positions, processes, resources, budget, KPIs, compliance, risk to performance.",
      },
    ],
  }),
  component: DepartmentManagementPage,
});

// --- Data & Mock Definitions ---

const DEPARTMENT_TYPES = [
  "Corporate Department",
  "Functional Department",
  "Operational Department",
  "Technical Department",
  "Commercial Department",
  "Support Department",
  "Shared Services Department",
  "Regional Department",
  "Project Department",
  "R&D Department",
  "Manufacturing Department",
  "Service Department",
  "International Department",
];

const TOP_KPIS_DATA = [
  { id: "KPI-001", name: "Budget Utilization", target: "100%", actual: "34%", achievement: "34%", status: "On Track", statusColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "KPI-002", name: "Monthly Closing Timeliness", target: "100%", actual: "95%", achievement: "95%", status: "On Track", statusColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "KPI-003", name: "Financial Reporting Accuracy", target: "100%", actual: "98%", achievement: "98%", status: "On Track", statusColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "KPI-004", name: "Cost Variance", target: "< 5%", actual: "3.2%", achievement: "64%", status: "On Track", statusColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "KPI-005", name: "Compliance Score", target: "100%", actual: "90%", achievement: "90%", status: "At Risk", statusColor: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "KPI-006", name: "Audit Findings Closed", target: "100%", actual: "80%", achievement: "80%", status: "At Risk", statusColor: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
];

const RECENT_ACTIVITIES = [
  { id: "ACT-001", title: "Budget FY 2024-25 approved", by: "Anita Verma (CFO)", date: "14 May 2024", icon: DollarSign, color: "text-emerald-500" },
  { id: "ACT-002", title: "New Position 'Financial Analyst' created", by: "Raghavan Sundaram", date: "13 May 2024", icon: UserCheck, color: "text-blue-500" },
  { id: "ACT-003", title: "Monthly Financial Closing completed", by: "Priya Malhotra", date: "10 May 2024", icon: CheckCircle2, color: "text-emerald-500" },
  { id: "ACT-004", title: "Internal Audit - Q4 completed", by: "Audit Team", date: "08 May 2024", icon: ShieldCheck, color: "text-amber-500" },
  { id: "ACT-005", title: "Tax Compliance return filed", by: "Rohit Verma", date: "05 May 2024", icon: FileCheck, color: "text-blue-600" },
];

function DepartmentManagementPage() {
  const queryClient = useQueryClient();
  const { data: _dbData, isLoading: _dbLoading } = useQuery({
    queryKey: [["hrm", "departments"]],
    queryFn: () => hrmManagementService.fetchDepartments(),
  });

  const [activeTab, setActiveTab] = useState<
    "organization" | "people" | "positions" | "budget" | "kpis" | "compliance"
  >("organization");

  // Master Form State
  const [deptMaster, setDeptMaster] = useState({
    deptId: "DEP-2024-0007",
    deptCode: "FIN-ACC",
    deptName: "Finance & Accounts",
    legalEntity: "Magnertia Global Pvt. Ltd.",
    businessUnit: "Corporate Services",
    functionName: "Finance",
    division: "Finance Operations",
    parentDept: "Corporate Services",
    deptType: "Functional Department",
    deptHead: "Raghavan Sundaram",
    location: "Noida Head Office",
    costCentre: "CC-FIN-001",
    deptStatus: "Active",
    effectiveFrom: "2024-04-01",
    effectiveTo: "",
    version: "1.0",
    orgLevel: "Level 3 - Department",
  });

  // Dynamic Departments List State
  const [departmentsList, setDepartmentsList] = useState([
    { code: "DEPT-ACC-01", name: "Corporate Accounts & General Ledger", fn: "Finance", head: "Rohan Kapoor", count: 82, cc: "CC-FIN-ACC", status: "Active" },
    { code: "DEPT-TRS-02", name: "Treasury & Cash Management", fn: "Finance", head: "Sunil Joshi", count: 48, cc: "CC-FIN-TRS", status: "Active" },
    { code: "DEPT-PRD-03", name: "Plant Production Line A/B", fn: "Operations", head: "Dinesh Patil", count: 214, cc: "CC-OPS-PRD", status: "Active" },
    { code: "DEPT-QA-04", name: "Quality Assurance & Testing", fn: "Operations", head: "Anjali Gupta", count: 142, cc: "CC-OPS-QA", status: "Active" },
    { code: "DEPT-DEV-05", name: "Core Product Development", fn: "R&D", head: "Siddharth Roy", count: 172, cc: "CC-RD-DEV", status: "Active" },
    { code: "DEPT-ENG-06", name: "Systems & Cloud Engineering", fn: "R&D", head: "Priya Menon", count: 126, cc: "CC-RD-ENG", status: "Active" },
    { code: "DEPT-TA-07", name: "Talent Acquisition & Sourcing", fn: "HR", head: "Karan Johar", count: 68, cc: "CC-HR-TA", status: "Active" },
    { code: "DEPT-ER-08", name: "Employee Relations & Payroll", fn: "HR", head: "Deepa Nair", count: 86, cc: "CC-HR-ER", status: "Active" },
  ]);

  // Dynamic Positions List State
  const [positionsList, setPositionsList] = useState([
    { code: "POS-FIN-001", title: "Chief Financial Officer", grade: "CXO", sanc: 1, filled: 1, vac: 0, status: "Occupied" },
    { code: "POS-FIN-002", title: "General Manager - Accounts", grade: "M1", sanc: 2, filled: 2, vac: 0, status: "Occupied" },
    { code: "POS-FIN-003", title: "Senior Finance Controller", grade: "M2", sanc: 4, filled: 3, vac: 1, status: "Hiring Open" },
    { code: "POS-FIN-004", title: "Tax & Compliance Lead", grade: "M3", sanc: 3, filled: 3, vac: 0, status: "Occupied" },
    { code: "POS-FIN-005", title: "Accounts Executive", grade: "E1", sanc: 12, filled: 10, vac: 2, status: "Hiring Open" },
  ]);

  // Department People Roster State
  const [peopleRoster, setPeopleRoster] = useState([
    { id: "EMP-101", name: "Raghavan Sundaram", role: "Head - Finance & Accounts", email: "raghavan.s@magnertia.com", phone: "+91 98112 34567", rating: "4.8/5", status: "Active" },
    { id: "EMP-102", name: "Priya Malhotra", role: "Senior Finance Controller", email: "priya.m@magnertia.com", phone: "+91 98112 34568", rating: "4.7/5", status: "Active" },
    { id: "EMP-103", name: "Rohit Verma", role: "Tax & Compliance Lead", email: "rohit.v@magnertia.com", phone: "+91 98112 34569", rating: "4.9/5", status: "Active" },
    { id: "EMP-104", name: "Sunil Yadav", role: "Treasury Manager", email: "sunil.y@magnertia.com", phone: "+91 98112 34570", rating: "4.6/5", status: "Active" },
    { id: "EMP-105", name: "Kavita Sharma", role: "Accounts Executive", email: "kavita.s@magnertia.com", phone: "+91 98112 34571", rating: "4.5/5", status: "Active" },
  ]);

  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showAddPosModal, setShowAddPosModal] = useState(false);

  const [newDeptForm, setNewDeptForm] = useState({
    code: "",
    name: "",
    fn: "Finance",
    head: "Raghavan Sundaram",
    count: "25",
    cc: "CC-NEW",
  });

  const [newPosForm, setNewPosForm] = useState({
    code: "",
    title: "",
    grade: "M2",
    sanc: "1",
    filled: "1",
    vac: "0",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="Department Management"
      breadcrumb="Management > Organization > Department Management"
      description="Manage the complete lifecycle of a department—from strategy, organizational mapping, workforce positions, processes, resources, budget, KPIs, compliance to performance."
      tabs={<AdminManagementTabBar />}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Top Header Actions & Workflow Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-foreground">{deptMaster.deptName}</h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  {deptMaster.deptStatus}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                  v{deptMaster.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                MAICW Classification · Code: <span className="font-mono font-bold text-foreground">{deptMaster.deptCode}</span> | Cost Centre: <span className="font-mono text-foreground">{deptMaster.costCentre}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showNotification("Department configuration preview generated.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-primary" />
              Preview Department
            </button>

            <button
              onClick={() => showNotification("Department validation complete: 0 process or budget gaps detected.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              Validate Department
            </button>

            <button
              onClick={() => showNotification("Department Master record saved successfully.")}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>

            <button
              onClick={() => showNotification("Submitted for Function Head & Executive Review.")}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Approval
            </button>
          </div>
        </div>

        {/* 1. Department Master Parameters & Snapshot Card */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left 9 columns: Department Master Fields */}
          <div className="lg:col-span-9 rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> Department Master Parameters
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Department ID</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={deptMaster.deptId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Department Code *</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  value={deptMaster.deptCode}
                  onChange={(e) => setDeptMaster({ ...deptMaster, deptCode: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Department Name *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <input
                  type="text"
                  value={deptMaster.deptName}
                  onChange={(e) => setDeptMaster({ ...deptMaster, deptName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Legal Entity *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={deptMaster.legalEntity}
                  onChange={(e) => setDeptMaster({ ...deptMaster, legalEntity: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Magnertia Global Pvt. Ltd.">Magnertia Global Pvt. Ltd.</option>
                  <option value="Magnertia Tech Inc.">Magnertia Tech Inc.</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Business Unit *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={deptMaster.businessUnit}
                  onChange={(e) => setDeptMaster({ ...deptMaster, businessUnit: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Corporate Services">Corporate Services</option>
                  <option value="Product Business">Product Business</option>
                  <option value="Technology Business">Technology Business</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Function *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={deptMaster.functionName}
                  onChange={(e) => setDeptMaster({ ...deptMaster, functionName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Finance">Finance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Division</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={deptMaster.division}
                  onChange={(e) => setDeptMaster({ ...deptMaster, division: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Finance Operations">Finance Operations</option>
                  <option value="Global Treasury">Global Treasury</option>
                  <option value="Strategic Planning">Strategic Planning</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Parent Department</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={deptMaster.parentDept}
                  onChange={(e) => setDeptMaster({ ...deptMaster, parentDept: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Corporate Services">Corporate Services</option>
                  <option value="Executive Secretariat">Executive Secretariat</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Department Type *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={deptMaster.deptType}
                  onChange={(e) => setDeptMaster({ ...deptMaster, deptType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {DEPARTMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Department Head *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={deptMaster.deptHead}
                  onChange={(e) => setDeptMaster({ ...deptMaster, deptHead: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Raghavan Sundaram">Raghavan Sundaram</option>
                  <option value="Anita Verma">Anita Verma</option>
                  <option value="Rajeev Malhotra">Rajeev Malhotra</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Location *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={deptMaster.location}
                  onChange={(e) => setDeptMaster({ ...deptMaster, location: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Noida Head Office">Noida Head Office</option>
                  <option value="Bengaluru Campus">Bengaluru Campus</option>
                  <option value="Pune Plant">Pune Plant</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Cost Centre *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <input
                  type="text"
                  value={deptMaster.costCentre}
                  onChange={(e) => setDeptMaster({ ...deptMaster, costCentre: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Department Status *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <select
                  value={deptMaster.deptStatus}
                  onChange={(e) => setDeptMaster({ ...deptMaster, deptStatus: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Planned">Planned</option>
                  <option value="Restructuring">Restructuring</option>
                  <option value="Merged">Merged</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Effective From *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <input
                  type="date"
                  value={deptMaster.effectiveFrom}
                  onChange={(e) => setDeptMaster({ ...deptMaster, effectiveFrom: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Effective To</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <input
                  type="date"
                  value={deptMaster.effectiveTo}
                  onChange={(e) => setDeptMaster({ ...deptMaster, effectiveTo: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Organization Level *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={deptMaster.orgLevel}
                  onChange={(e) => setDeptMaster({ ...deptMaster, orgLevel: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Level 3 - Department">Level 3 - Department</option>
                  <option value="Level 4 - Sub-Department">Level 4 - Sub-Department</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right 3 columns: Department Snapshot Side Card */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Department Snapshot</h4>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {deptMaster.deptStatus}
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Employees</span>
                  <span className="font-bold text-foreground font-mono">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Positions</span>
                  <span className="font-bold text-foreground font-mono">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Open Positions</span>
                  <span className="font-bold text-amber-600 font-mono">6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cost Centre</span>
                  <span className="font-mono text-muted-foreground text-[11px]">{deptMaster.costCentre}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Budget (FY 2024-25)</span>
                  <span className="font-bold text-foreground font-mono">₹ 12,50,00,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Spent (YTD)</span>
                  <span className="font-bold text-emerald-600 font-mono">₹ 4,25,00,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Budget Utilization</span>
                  <span className="font-mono text-foreground font-bold">34.00%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Performance Score</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Good</span>
              </div>
              <div className="relative inline-flex items-center justify-center">
                <svg width="48" height="48" className="transform -rotate-90">
                  <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="3.5" className="text-muted/30" fill="transparent" />
                  <circle
                    cx="24"
                    cy="24"
                    r="19"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 19}
                    strokeDashoffset={2 * Math.PI * 19 * (1 - 0.82)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold font-mono text-emerald-600">82%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "organization", label: "Organization & Roster", icon: Building },
              { key: "people", label: "People Directory", icon: Users },
              { key: "positions", label: "Positions & Roles", icon: UserCheck },
              { key: "budget", label: "Budget & Financials", icon: Landmark },
              { key: "kpis", label: "KPIs & Performance", icon: TrendingUp },
              { key: "compliance", label: "Compliance & Risk", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ORGANIZATION & ROSTER TAB */}
          {activeTab === "organization" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Total Departments</span>
                  <div className="text-xl font-bold font-mono text-foreground">{departmentsList.length} Depts</div>
                  <p className="text-[10px] text-emerald-600 font-medium">100% Operational</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Total Personnel</span>
                  <div className="text-xl font-bold font-mono text-foreground">
                    {departmentsList.reduce((acc, d) => acc + Number(d.count), 0).toLocaleString()} Staff
                  </div>
                  <p className="text-[10px] text-blue-600 font-medium">Active Headcount</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Average Dept Size</span>
                  <div className="text-xl font-bold font-mono text-foreground">
                    {Math.round(departmentsList.reduce((acc, d) => acc + Number(d.count), 0) / (departmentsList.length || 1))} Members
                  </div>
                  <p className="text-[10px] text-primary font-medium">Balanced Distribution</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Cost Ledgers</span>
                  <div className="text-xl font-bold font-mono text-foreground">{departmentsList.length} Centres</div>
                  <p className="text-[10px] text-amber-600 font-medium">Mapped to SAP/GL</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="text-xs font-bold text-foreground">Enterprise Department Roster ({departmentsList.length} Departments)</h4>
                  <button
                    onClick={() => setShowAddDeptModal(true)}
                    className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
                  >
                    + Add Department
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="py-2 px-2">Dept Code</th>
                        <th className="py-2 px-2">Department Name</th>
                        <th className="py-2 px-2">Parent Function / BU</th>
                        <th className="py-2 px-2">Department Manager</th>
                        <th className="py-2 px-2 text-right">Headcount</th>
                        <th className="py-2 px-2">Cost Center</th>
                        <th className="py-2 px-2">Status</th>
                        <th className="py-2 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-[11px]">
                      {departmentsList.map((dept) => (
                        <tr key={dept.code} className="hover:bg-muted/30">
                          <td className="py-2 px-2 font-mono font-bold text-primary">{dept.code}</td>
                          <td className="py-2 px-2 font-semibold text-foreground">{dept.name}</td>
                          <td className="py-2 px-2 text-muted-foreground">{dept.fn}</td>
                          <td className="py-2 px-2 text-foreground">{dept.head}</td>
                          <td className="py-2 px-2 text-right font-mono font-bold">{dept.count}</td>
                          <td className="py-2 px-2 font-mono text-muted-foreground">{dept.cc}</td>
                          <td className="py-2 px-2">
                            <span className="rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                              {dept.status}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setDepartmentsList((prev) => prev.filter((item) => item.code !== dept.code));
                                showNotification(`Department ${dept.code} removed.`);
                              }}
                              className="text-rose-500 hover:text-rose-700 text-[11px] font-medium cursor-pointer"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PEOPLE DIRECTORY TAB */}
          {activeTab === "people" && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Department Personnel Directory ({peopleRoster.length} Members)</h4>
                <button
                  onClick={() => showNotification("Add staff requisition opened.")}
                  className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
                >
                  + Add Member
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2 px-2">Staff ID</th>
                      <th className="py-2 px-2">Employee Name</th>
                      <th className="py-2 px-2">Role & Title</th>
                      <th className="py-2 px-2">Email</th>
                      <th className="py-2 px-2">Contact</th>
                      <th className="py-2 px-2 text-center">Rating</th>
                      <th className="py-2 px-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-[11px]">
                    {peopleRoster.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/30">
                        <td className="py-2 px-2 font-mono font-bold text-primary">{p.id}</td>
                        <td className="py-2 px-2 font-semibold text-foreground">{p.name}</td>
                        <td className="py-2 px-2 text-muted-foreground">{p.role}</td>
                        <td className="py-2 px-2 font-mono text-[10px]">{p.email}</td>
                        <td className="py-2 px-2 font-mono text-[10px]">{p.phone}</td>
                        <td className="py-2 px-2 text-center font-bold text-emerald-600">{p.rating}</td>
                        <td className="py-2 px-2 text-right">
                          <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/20">
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

          {/* POSITIONS & ROLES WORKSPACE */}
          {activeTab === "positions" && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Department Positions & Role Architecture ({positionsList.length} Roles)</h4>
                <button
                  onClick={() => setShowAddPosModal(true)}
                  className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
                >
                  + Add Position
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2 px-2">Position Code</th>
                      <th className="py-2 px-2">Position Title</th>
                      <th className="py-2 px-2">Grade Level</th>
                      <th className="py-2 px-2 text-right">Sanctioned</th>
                      <th className="py-2 px-2 text-right">Filled</th>
                      <th className="py-2 px-2 text-right">Vacant</th>
                      <th className="py-2 px-2">Status</th>
                      <th className="py-2 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground font-mono text-[11px]">
                    {positionsList.map((p) => (
                      <tr key={p.code} className="hover:bg-muted/30">
                        <td className="py-2 px-2 font-semibold text-primary">{p.code}</td>
                        <td className="py-2 px-2 font-sans font-medium text-foreground">{p.title}</td>
                        <td className="py-2 px-2">{p.grade}</td>
                        <td className="py-2 px-2 text-right">{p.sanc}</td>
                        <td className="py-2 px-2 text-right text-emerald-600 font-bold">{p.filled}</td>
                        <td className="py-2 px-2 text-right text-amber-600 font-bold">{p.vac}</td>
                        <td className="py-2 px-2">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold border font-sans",
                              Number(p.vac) > 0 ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            )}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setPositionsList((prev) => prev.filter((item) => item.code !== p.code));
                              showNotification(`Position ${p.code} removed.`);
                            }}
                            className="text-rose-500 hover:text-rose-700 text-[11px] font-medium cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BUDGET & FINANCIALS TAB */}
          {activeTab === "budget" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-primary" />
                  Department Financial Breakdown & Cost Allocation
                </h4>
                <span className="text-[11px] font-mono text-emerald-600 font-bold">FY 2024-25 Allocated: ₹ 12,50,00,000</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-lg border border-border bg-muted/15 space-y-1">
                  <span className="text-muted-foreground block text-[11px]">Personnel Expenditure</span>
                  <div className="text-lg font-bold font-mono text-foreground">₹ 4,20,00,000</div>
                  <span className="text-[10px] text-emerald-600">Salaries, bonuses & health insurance</span>
                </div>
                <div className="p-3.5 rounded-lg border border-border bg-muted/15 space-y-1">
                  <span className="text-muted-foreground block text-[11px]">Operational & Software Costs</span>
                  <div className="text-lg font-bold font-mono text-foreground">₹ 6,30,00,000</div>
                  <span className="text-[10px] text-blue-600">ERP licenses, audits & consulting</span>
                </div>
                <div className="p-3.5 rounded-lg border border-border bg-muted/15 space-y-1">
                  <span className="text-muted-foreground block text-[11px]">CAPEX Hardware & Infrastructure</span>
                  <div className="text-lg font-bold font-mono text-foreground">₹ 1,00,00,000</div>
                  <span className="text-[10px] text-primary">Servers, secured workstations & laptops</span>
                </div>
              </div>
            </div>
          )}

          {/* KPIS TAB */}
          {activeTab === "kpis" && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Department Performance & Metric Scorecard</h4>
                <span className="text-xs font-semibold text-emerald-600">Quarterly Audit Grade: A</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2 px-2">KPI Code</th>
                      <th className="py-2 px-2">Performance Indicator</th>
                      <th className="py-2 px-2 text-right">Target</th>
                      <th className="py-2 px-2 text-right">Actual YTD</th>
                      <th className="py-2 px-2 text-right">Achievement</th>
                      <th className="py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-[11px]">
                    {TOP_KPIS_DATA.map((kpi) => (
                      <tr key={kpi.id} className="hover:bg-muted/30">
                        <td className="py-2 px-2 font-mono font-bold text-primary">{kpi.id}</td>
                        <td className="py-2 px-2 font-semibold text-foreground">{kpi.name}</td>
                        <td className="py-2 px-2 text-right font-mono text-muted-foreground">{kpi.target}</td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-foreground">{kpi.actual}</td>
                        <td className="py-2 px-2 text-right font-mono">{kpi.achievement}</td>
                        <td className="py-2 px-2">
                          <span className={cn("rounded px-2 py-0.5 text-[9px] font-bold border", kpi.statusColor)}>
                            {kpi.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* COMPLIANCE TAB */}
          {activeTab === "compliance" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Regulatory Compliance & Statutory Alignment
                </h4>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                  Compliant (100%)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-border bg-muted/10">
                  <div className="font-bold text-foreground">Statutory GST & TDS Filing</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Status: Filed On-Time (May 2024)</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/10">
                  <div className="font-bold text-foreground">SOX / Internal Financial Controls</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Status: Fully Audited (Grade A)</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/10">
                  <div className="font-bold text-foreground">ISO 9001 QMS Compliance</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Status: Certified (Expiry 2026)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- ADD DEPARTMENT MODAL --- */}
        {showAddDeptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Add New Department</h3>
                </div>
                <button onClick={() => setShowAddDeptModal(false)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Dept Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. DEPT-SEC-09"
                    value={newDeptForm.code}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, code: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Department Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Cybersecurity & Compliance"
                    value={newDeptForm.name}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Parent Function</label>
                    <select
                      value={newDeptForm.fn}
                      onChange={(e) => setNewDeptForm({ ...newDeptForm, fn: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                    >
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                      <option value="R&D">R&D</option>
                      <option value="HR">HR</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Department Manager</label>
                    <input
                      type="text"
                      value={newDeptForm.head}
                      onChange={(e) => setNewDeptForm({ ...newDeptForm, head: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Headcount</label>
                    <input
                      type="number"
                      value={newDeptForm.count}
                      onChange={(e) => setNewDeptForm({ ...newDeptForm, count: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Cost Centre</label>
                    <input
                      type="text"
                      value={newDeptForm.cc}
                      onChange={(e) => setNewDeptForm({ ...newDeptForm, cc: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newDeptForm.code || !newDeptForm.name) {
                      alert("Please provide department code and name.");
                    }
                    setDepartmentsList((prev) => [
                      ...prev,
                      {
                        code: newDeptForm.code.toUpperCase(),
                        name: newDeptForm.name,
                        fn: newDeptForm.fn,
                        head: newDeptForm.head,
                        count: Number(newDeptForm.count) || 20,
                        cc: newDeptForm.cc,
                        status: "Active",
                      },
                    ]);
                    setShowAddDeptModal(false);
                    showNotification(`Department ${newDeptForm.code.toUpperCase()} successfully added.`);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
                >
                  Add Department
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- ADD POSITION MODAL --- */}
        {showAddPosModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Add New Position</h3>
                </div>
                <button onClick={() => setShowAddPosModal(false)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Position Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. POS-FIN-006"
                    value={newPosForm.code}
                    onChange={(e) => setNewPosForm({ ...newPosForm, code: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Position Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Internal Audit Manager"
                    value={newPosForm.title}
                    onChange={(e) => setNewPosForm({ ...newPosForm, title: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Grade Level</label>
                    <select
                      value={newPosForm.grade}
                      onChange={(e) => setNewPosForm({ ...newPosForm, grade: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                    >
                      <option value="CXO">CXO</option>
                      <option value="M1">M1 - Director</option>
                      <option value="M2">M2 - Senior Manager</option>
                      <option value="M3">M3 - Manager</option>
                      <option value="E1">E1 - Executive</option>
                      <option value="E2">E2 - Analyst</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Sanctioned</label>
                    <input
                      type="number"
                      value={newPosForm.sanc}
                      onChange={(e) => setNewPosForm({ ...newPosForm, sanc: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-mono text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Vacant</label>
                    <input
                      type="number"
                      value={newPosForm.vac}
                      onChange={(e) => setNewPosForm({ ...newPosForm, vac: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-mono text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddPosModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newPosForm.code || !newPosForm.title) {
                      alert("Please provide position code and title.");
                      return;
                    }
                    setPositionsList((prev) => [
                      ...prev,
                      {
                        code: newPosForm.code.toUpperCase(),
                        title: newPosForm.title,
                        grade: newPosForm.grade,
                        sanc: Number(newPosForm.sanc) || 1,
                        filled: Math.max(0, (Number(newPosForm.sanc) || 1) - (Number(newPosForm.vac) || 0)),
                        vac: Number(newPosForm.vac) || 0,
                        status: Number(newPosForm.vac) > 0 ? "Hiring Open" : "Occupied",
                      },
                    ]);
                    setShowAddPosModal(false);
                    showNotification(`Position ${newPosForm.code.toUpperCase()} created successfully.`);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
                >
                  Add Position
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Classification & Modification Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-[11px] text-muted-foreground font-mono">
          <div>
            MAICW: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
            <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
            <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
            <span className="text-blue-600 font-bold">C</span> (Calculated) |{" "}
            <span className="text-rose-500 font-bold">W</span> (Workflow)
          </div>
          <div>
            Last Modified: <span className="font-sans font-semibold text-foreground">15 May 2024 11:30 AM</span> by <span className="font-sans font-semibold text-foreground">Rahul Sharma</span> | Created By: <span className="font-sans font-semibold text-foreground">Rahul Sharma</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
