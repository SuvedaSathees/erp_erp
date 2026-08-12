import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AdminManagementTabBar } from "@/components/erp/AdminManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Building2,
  FolderTree,
  Users,
  Briefcase,
  ShieldCheck,
  MapPin,
  Landmark,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  Layers,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Filter,
  Save,
  Send,
  Sliders,
  Award,
  Sparkles,
  Info,
  DollarSign,
  UserCheck,
  Clock,
  ArrowRight,
  UserCheck2,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/management/administration-management/organization-structure")({
  head: () => ({
    meta: [
      { title: "Organization Structure · Magnertia ERP" },
      {
        name: "description",
        content: "Manage complete organizational architecture from legal entity to reporting, authority, RACI matrix, locations and governance.",
      },
    ],
  }),
  component: OrganizationStructurePage,
});

// --- Mock Data & Definitions ---

interface OrgTreeNode {
  id: string;
  code: string;
  name: string;
  type: string;
  head: string;
  count: number;
  children?: OrgTreeNode[];
}

const ORG_HIERARCHY_TREE: OrgTreeNode = {
  id: "NODE-001",
  code: "MAG-GLOBAL",
  name: "Magnertia Global Technologies",
  type: "Corporate",
  head: "Rajeev Malhotra",
  count: 3256,
  children: [
    {
      id: "NODE-002",
      code: "CORP-MGMT",
      name: "Corporate Management",
      type: "Division",
      head: "Rajeev Malhotra",
      count: 6,
    },
    {
      id: "NODE-003",
      code: "BU-GRP",
      name: "Business Units",
      type: "Group",
      head: "Amit Desai",
      count: 4,
      children: [
        { id: "BU-001", code: "BU-PROD", name: "Product Business", type: "Business Unit", head: "Amit Desai", count: 1024 },
        { id: "BU-002", code: "BU-TECH", name: "Technology Business", type: "Business Unit", head: "Vikram Singh", count: 866 },
        { id: "BU-003", code: "BU-SRV", name: "Services Business", type: "Business Unit", head: "Sandeep Iyer", count: 732 },
        { id: "BU-004", code: "BU-INTL", name: "International Business", type: "Business Unit", head: "Arjun Mehta", count: 644 },
      ],
    },
    {
      id: "NODE-004",
      code: "FUNC-GRP",
      name: "Functions",
      type: "Group",
      head: "Anita Verma",
      count: 8,
      children: [
        { id: "FUNC-FIN", code: "FN-FIN", name: "Finance", type: "Function", head: "Anita Verma", count: 186 },
        { id: "FUNC-HR", code: "FN-HR", name: "Human Resources", type: "Function", head: "Meera Nair", count: 154 },
        { id: "FUNC-SLS", code: "FN-SLS", name: "Sales", type: "Function", head: "Arjun Mehta", count: 412 },
        { id: "FUNC-MKT", code: "FN-MKT", name: "Marketing", type: "Function", head: "Priya Sharma", count: 198 },
        { id: "FUNC-OPS", code: "FN-OPS", name: "Operations", type: "Function", head: "Sandeep Iyer", count: 356 },
        { id: "FUNC-RD", code: "FN-RD", name: "R&D", type: "Function", head: "Vikram Singh", count: 256 },
        { id: "FUNC-MFG", code: "FN-MFG", name: "Manufacturing", type: "Function", head: "Ramesh Kumar", count: 864 },
        { id: "FUNC-SCM", code: "FN-SCM", name: "Supply Chain", type: "Function", head: "Karan Patel", count: 404 },
      ],
    },
    {
      id: "NODE-005",
      code: "LOC-GRP",
      name: "Locations",
      type: "Group",
      head: "Sunil Verma",
      count: 4,
      children: [
        { id: "LOC-001", code: "HQ-BLR", name: "Headquarters", type: "Headquarters", head: "Rajeev Malhotra", count: 1256 },
        { id: "LOC-002", code: "DC-HYD", name: "Development Centre", type: "Development Centre", head: "Vikram Singh", count: 856 },
        { id: "LOC-003", code: "MU-PNE", name: "Manufacturing Unit", type: "Manufacturing Unit", head: "Ramesh Kumar", count: 872 },
        { id: "LOC-004", code: "RO-DEL", name: "Regional Offices", type: "Regional Office", head: "Arjun Mehta", count: 272 },
      ],
    },
  ],
};

const UNITS_DATA = [
  { id: "UNIT-001", name: "Product Business", code: "BU-PROD", type: "Business Unit", parent: "Business Units", head: "Amit Desai", function: "Product Strategy", costCentre: "CC-BU-PROD", profitCentre: "PC-BU-PROD", location: "Multiple Locations", employees: 1024, budget: "$12,500,000", revenueTarget: "$28,000,000", costTarget: "$10,000,000", status: "Active" },
  { id: "UNIT-002", name: "Technology Business", code: "BU-TECH", type: "Business Unit", parent: "Business Units", head: "Vikram Singh", function: "Engineering", costCentre: "CC-BU-TECH", profitCentre: "PC-BU-TECH", location: "Development Centre", employees: 866, budget: "$14,000,000", revenueTarget: "$24,000,000", costTarget: "$11,500,000", status: "Active" },
  { id: "UNIT-003", name: "Services Business", code: "BU-SRV", type: "Business Unit", parent: "Business Units", head: "Sandeep Iyer", function: "Operations", costCentre: "CC-BU-SRV", profitCentre: "PC-BU-SRV", location: "Headquarters", employees: 732, budget: "$8,200,000", revenueTarget: "$18,500,000", costTarget: "$6,800,000", status: "Active" },
  { id: "UNIT-004", name: "International Business", code: "BU-INTL", type: "Business Unit", parent: "Business Units", head: "Arjun Mehta", function: "Global Sales", costCentre: "CC-BU-INTL", profitCentre: "PC-BU-INTL", location: "Regional Offices", employees: 644, budget: "$9,500,000", revenueTarget: "$22,000,000", costTarget: "$7,800,000", status: "Active" },
  { id: "UNIT-005", name: "Finance Function", code: "FN-FIN", type: "Function", parent: "Functions", head: "Anita Verma", function: "Finance", costCentre: "CC-FN-FIN", profitCentre: "N/A", location: "Headquarters", employees: 186, budget: "$3,400,000", revenueTarget: "$0", costTarget: "$3,200,000", status: "Active" },
];

const CORE_FUNCTIONS = [
  { id: "FNC-001", name: "Corporate Governance", code: "FN-GOV", head: "Rajeev Malhotra", objective: "Drive strategic leadership, policy compliance & board reporting", budget: "$1,800,000", status: "Active" },
  { id: "FNC-002", name: "Strategy & Transformation", code: "FN-STR", head: "Rajeev Malhotra", objective: "Define corporate growth, M&A strategy & transformation agenda", budget: "$2,200,000", status: "Active" },
  { id: "FNC-003", name: "Product Development", code: "FN-PDV", head: "Amit Desai", objective: "Deliver innovative SaaS & hardware product suite", budget: "$12,500,000", status: "Active" },
  { id: "FNC-004", name: "Research & Development", code: "FN-RND", head: "Vikram Singh", objective: "Pioneer next-gen technologies, AI algorithms & patents", budget: "$14,000,000", status: "Active" },
  { id: "FNC-005", name: "Engineering & Cloud", code: "FN-ENG", head: "Vikram Singh", objective: "Architect robust enterprise platform & cloud backend", budget: "$11,200,000", status: "Active" },
  { id: "FNC-006", name: "Manufacturing", code: "FN-MFG", head: "Ramesh Kumar", objective: "Precision electronics & hardware manufacturing operations", budget: "$18,400,000", status: "Active" },
  { id: "FNC-007", name: "Quality Assurance", code: "FN-QA", head: "Suresh Raina", objective: "Ensure ISO, APQP & Six Sigma quality compliance", budget: "$3,100,000", status: "Active" },
  { id: "FNC-008", name: "Supply Chain Management", code: "FN-SCM", head: "Karan Patel", objective: "Optimize procurement, logistics & global inventory", budget: "$9,800,000", status: "Active" },
  { id: "FNC-009", name: "Sales & Enterprise", code: "FN-SLS", head: "Arjun Mehta", objective: "Achieve annual revenue targets across global channels", budget: "$8,500,000", status: "Active" },
  { id: "FNC-010", name: "Marketing & Brand", code: "FN-MKT", head: "Priya Sharma", objective: "Strengthen global brand positioning & lead generation", budget: "$4,600,000", status: "Active" },
  { id: "FNC-011", name: "Finance & Accounts", code: "FN-FIN", head: "Anita Verma", objective: "Maintain fiscal discipline, tax compliance & audit integrity", budget: "$3,400,000", status: "Active" },
  { id: "FNC-012", name: "Human Capital Management", code: "FN-HCM", head: "Meera Nair", objective: "Attract, develop & retain top tier global talent", budget: "$4,200,000", status: "Active" },
];

const DEPARTMENTS_DATA = [
  { id: "DEPT-001", name: "Accounts & Financial Control", code: "DP-ACC", function: "Finance", head: "Sunil Agarwal", employees: 82, budget: "$1,400,000", kpis: ["Month-End Close SLA", "Audit Zero-Defect"], status: "Active" },
  { id: "DEPT-002", name: "Treasury & Cash Management", code: "DP-TRS", function: "Finance", head: "Kavita Rao", employees: 48, budget: "$950,000", kpis: ["Liquidity Ratio", "Yield Optimization"], status: "Active" },
  { id: "DEPT-003", name: "Production Engineering", code: "DP-PRD", function: "Manufacturing", head: "Ramesh Kumar", employees: 214, budget: "$6,200,000", kpis: ["OEE Score", "First Pass Yield"], status: "Active" },
  { id: "DEPT-004", name: "Quality Assurance & APQP", code: "DP-QAS", function: "Quality", head: "Suresh Raina", employees: 142, budget: "$3,100,000", kpis: ["PPM Defect Rate", "Customer COPQ"], status: "Active" },
  { id: "DEPT-005", name: "Product Engineering", code: "DP-PDE", function: "Product Development", head: "Amit Desai", employees: 172, budget: "$5,400,000", kpis: ["On-time Sprint Velocity", "Release Stability"], status: "Active" },
  { id: "DEPT-006", name: "Cloud Architecture", code: "DP-CLD", function: "Engineering", head: "Vikram Singh", employees: 126, budget: "$4,800,000", kpis: ["99.99% Uptime SLA", "Latency < 50ms"], status: "Active" },
  { id: "DEPT-007", name: "Talent Acquisition", code: "DP-TA", function: "Human Resources", head: "Meera Nair", employees: 68, budget: "$1,800,000", kpis: ["Time-to-Fill SLA", "Offer Acceptance %"], status: "Active" },
  { id: "DEPT-008", name: "Employee Relations & Legal", code: "DP-ER", function: "Human Resources", head: "Deepak Joshi", employees: 86, budget: "$1,200,000", kpis: ["Retention Rate", "Compliance Score"], status: "Active" },
];

const POSITIONS_DATA = [
  { id: "POS-001", title: "Chief Executive Officer", code: "POS-CEO", level: "CEO / Managing Director", unit: "Corporate", function: "Corporate Governance", dept: "Executive Office", headcount: 1, manager: "Board of Directors", status: "Active" },
  { id: "POS-002", title: "Chief Financial Officer", code: "POS-CFO", level: "CXO / Executive Management", unit: "Corporate", function: "Finance", dept: "Finance", headcount: 1, manager: "Rajeev Malhotra (CEO)", status: "Active" },
  { id: "POS-003", title: "Chief Operating Officer", code: "POS-COO", level: "CXO / Executive Management", unit: "Corporate", function: "Operations", dept: "Operations", headcount: 1, manager: "Rajeev Malhotra (CEO)", status: "Active" },
  { id: "POS-004", title: "Chief Technology Officer", code: "POS-CTO", level: "CXO / Executive Management", unit: "Corporate", function: "R&D / Technology", dept: "Engineering", headcount: 1, manager: "Rajeev Malhotra (CEO)", status: "Active" },
  { id: "POS-005", title: "Chief Human Resources Officer", code: "POS-CHRO", level: "CXO / Executive Management", unit: "Corporate", function: "Human Resources", dept: "Human Resources", headcount: 1, manager: "Rajeev Malhotra (CEO)", status: "Active" },
  { id: "POS-006", title: "Chief Sales Officer", code: "POS-CSO", level: "CXO / Executive Management", unit: "Corporate", function: "Sales", dept: "Sales", headcount: 1, manager: "Rajeev Malhotra (CEO)", status: "Active" },
  { id: "POS-007", title: "Head of Product Development", code: "POS-HPD", level: "Business Head / Function Head", unit: "Product Business", function: "Product Development", dept: "Product Engineering", headcount: 1, manager: "Rajeev Malhotra (CEO)", status: "Active" },
];

const RACI_MATRIX = [
  { id: "RACI-001", process: "Annual Corporate Budgeting", activity: "Approval of Capital & Operational Budgets", responsible: "Anita Verma (CFO)", accountable: "Rajeev Malhotra (CEO)", consulted: "Function Heads, Business Heads", informed: "Board of Directors", escalation: "Board Audit Committee", sla: 15, status: "Active" },
  { id: "RACI-002", process: "Reorganization & Entity Change", activity: "Approval of New Business Unit / Dept Creation", responsible: "Meera Nair (CHRO)", accountable: "Rajeev Malhotra (CEO)", consulted: "CFO, Legal Counsel, COO", informed: "All Employees", escalation: "CEO / Board", sla: 30, status: "Active" },
  { id: "RACI-003", process: "Product Release & Architecture", activity: "Sign-off on Production Architecture", responsible: "Vikram Singh (CTO)", accountable: "Amit Desai (Product Head)", consulted: "Security Lead, QA Head", informed: "Customer Success", escalation: "CTO", sla: 5, status: "Active" },
  { id: "RACI-004", process: "Capex Procurement (> $250k)", activity: "Contract Approval & Vendor Binding", responsible: "Karan Patel (SCM Head)", accountable: "Anita Verma (CFO)", consulted: "Legal Lead, Unit Head", informed: "Internal Audit", escalation: "CFO / CEO", sla: 7, status: "Active" },
];

const AUTHORITY_MATRIX = [
  { id: "AUTH-001", position: "Chief Executive Officer", unit: "Corporate", authorityType: "Strategic & Legal", approvalLimit: "$5,000,000", financial: true, contract: true, hiring: true, procurement: true, technical: true, legal: true, status: "Active" },
  { id: "AUTH-002", position: "Chief Financial Officer", unit: "Corporate", authorityType: "Financial & Tax", approvalLimit: "$2,500,000", financial: true, contract: true, hiring: true, procurement: true, technical: false, legal: true, status: "Active" },
  { id: "AUTH-003", position: "Chief Operating Officer", unit: "Corporate", authorityType: "Operational & Capex", approvalLimit: "$1,000,000", financial: true, contract: true, hiring: true, procurement: true, technical: true, legal: false, status: "Active" },
  { id: "AUTH-004", position: "Business Head / VP", unit: "Business Unit", authorityType: "BU Operational", approvalLimit: "$500,000", financial: true, contract: true, hiring: true, procurement: true, technical: false, legal: false, status: "Active" },
];

const LOCATIONS_DATA = [
  { id: "LOC-001", name: "Global Headquarters", code: "HQ-BLR", type: "Headquarters", head: "Rajeev Malhotra", address: "Magnertia Tech Park, Outer Ring Road, Bengaluru", country: "India", capacity: 1500, current: 1256, status: "Active" },
  { id: "LOC-002", name: "R&D Development Centre", code: "DC-HYD", type: "Development Centre", head: "Vikram Singh", address: "HITEC City Phase II, Hyderabad", country: "India", capacity: 1000, current: 856, status: "Active" },
  { id: "LOC-003", name: "Smart Manufacturing Facility", code: "MU-PNE", type: "Manufacturing Unit", head: "Ramesh Kumar", address: "Chakan Industrial Area Phase III, Pune", country: "India", capacity: 1000, current: 872, status: "Active" },
  { id: "LOC-004", name: "North America Regional Office", code: "RO-US", type: "Regional Office", head: "Arjun Mehta", address: "100 Tech Promenade, San Jose, CA", country: "United States", capacity: 350, current: 272, status: "Active" },
];

const GOVERNANCE_BODIES = [
  { id: "GOV-001", body: "Board of Directors", role: "Supreme Governance", frequency: "Quarterly", rights: "Approve strategy, CEO appointment, financial results & dividends", escalation: "Shareholders", policy: "POL-GOV-001", status: "Active" },
  { id: "GOV-002", body: "Executive Leadership Council", role: "Operational Execution", frequency: "Weekly", rights: "Approve operational targets, cross-functional budgets & policies", escalation: "Board of Directors", policy: "POL-GOV-002", status: "Active" },
  { id: "GOV-003", body: "Audit & Risk Committee", role: "Risk & Compliance", frequency: "Bi-Monthly", rights: "Approve internal audit scope, risk appetite & financial disclosures", escalation: "Board Audit Chair", policy: "POL-GOV-003", status: "Active" },
  { id: "GOV-004", body: "Technology & Product Steering", role: "R&D Oversight", frequency: "Monthly", rights: "Approve product roadmaps, platform standards & patent filings", escalation: "Executive Leadership", policy: "POL-GOV-004", status: "Active" },
];

const ORG_RISK_ASSESSMENT = [
  { id: "RSK-001", category: "Succession Risk", unit: "Corporate", desc: "Key person risk in Executive Officer positions without designated backup", prob: "35%", impact: "High (8.5/10)", score: "High", mitigation: "Implement dual-hat succession pipeline & shadow VP development", status: "Active" },
  { id: "RSK-002", category: "Span-of-Control Risk", unit: "Product Business", desc: "Excessive direct reports (>12) for Engineering Team Leads", prob: "60%", impact: "Medium (6.2/10)", score: "Medium", mitigation: "Introduce Tech Lead sub-tier to balance reporting span", status: "Active" },
  { id: "RSK-003", category: "Capacity Utilization Risk", unit: "Development Centre", desc: "Cloud engineering team running at 112% capacity utilization", prob: "75%", impact: "High (8.8/10)", score: "Critical", mitigation: "Accelerate hiring pipeline & engage contract specialist team", status: "Active" },
];

export function OrganizationStructurePage() {
  const [activeTab, setActiveTab] = useState<
    | "hierarchy"
    | "units"
    | "functions"
    | "departments"
    | "teams"
    | "positions"
    | "reporting"
    | "authority"
    | "raci"
    | "locations"
    | "cost-centres"
    | "governance"
    | "kpis"
    | "analytics"
  >("hierarchy");

  // Master Form State
  const [masterForm, setMasterForm] = useState({
    structureId: "ORG-STR-2024-0001",
    formCode: "ORG-FRM-2024",
    version: "1.0",
    status: "Active",
    effectiveFrom: "2024-04-01",
    effectiveTo: "",
    orgName: "Magnertia Global Technologies",
    orgCode: "MAG-GLOBAL",
    legalEntity: "Magnertia Global Pvt. Ltd.",
    parentOrg: "Magnertia Group",
    orgType: "Corporate",
    orgLevel: "Level 1 - Corporate",
    orgHead: "Rajeev Malhotra",
    operatingModel: "Functional",
    buCount: 4,
    functionCount: 8,
    deptCount: 24,
    totalEmployees: 3256,
    vision: "To be a global leader in technology-driven products and services that create sustainable value for customers, employees, and society.",
    mission: "We innovate, build and deliver technology solutions that empower businesses and improve lives.",
    objectives: "• Drive innovation and digital transformation\n• Deliver operational excellence\n• Build global capabilities\n• Create sustainable growth and value",
  });

  const [selectedTreeNode, setSelectedTreeNode] = useState<string>("BU-001");
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleValidateStructure = () => {
    showNotification("Validation Passed: 0 circular dependencies, 100% position reporting integrity verified.");
  };

  const handleSaveMaster = () => {
    showNotification("Organization Structure Master record saved successfully.");
  };

  return (
    <AppShell
      title="Organization Structure"
      breadcrumb="Management > Administration Management > Organization Structure"
      description="The Organization Structure Form manages the complete organizational architecture of Magnertia—from legal entity to positions, authority, RACI matrix, locations & governance."
      tabs={<AdminManagementTabBar />}
    >
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#0a192f] border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Top Header Actions & Workflow Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <FolderTree className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-foreground">Organization Structure Form</h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  {masterForm.status}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                  v{masterForm.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                MAICW Classification · Organization Architecture & Governance Suite
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("hierarchy")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-primary" />
              Preview Chart
            </button>

            <button
              onClick={handleValidateStructure}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              Validate Structure
            </button>

            <button
              onClick={handleSaveMaster}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>

            <button
              onClick={() => showNotification("Submitted for Executive Board Approval.")}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Approval
            </button>
          </div>
        </div>

        {/* 1. Organization Structure Master Form Section */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="text-primary">1.</span> Organization Structure Master
            </h3>
            <span className="text-[11px] text-muted-foreground font-medium">
              MAICW Fields: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
              <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
              <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
              <span className="text-purple-500 font-bold">C</span> (Calculated) |{" "}
              <span className="text-rose-500 font-bold">W</span> (Workflow)
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Auto Fields */}
            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Organization Structure ID</span>
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
              </label>
              <input
                type="text"
                readOnly
                value={masterForm.structureId}
                className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Form Code</span>
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
              </label>
              <input
                type="text"
                readOnly
                value={masterForm.formCode}
                className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Version</span>
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
              </label>
              <input
                type="text"
                readOnly
                value={masterForm.version}
                className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Status</span>
                <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
              </label>
              <select
                value={masterForm.status}
                onChange={(e) => setMasterForm({ ...masterForm, status: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Effective From</span>
                <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
              </label>
              <input
                type="date"
                value={masterForm.effectiveFrom}
                onChange={(e) => setMasterForm({ ...masterForm, effectiveFrom: e.target.value })}
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
                value={masterForm.effectiveTo}
                onChange={(e) => setMasterForm({ ...masterForm, effectiveTo: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Mandatory Inputs */}
            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Organization Name *</span>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
              </label>
              <input
                type="text"
                value={masterForm.orgName}
                onChange={(e) => setMasterForm({ ...masterForm, orgName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Organization Code *</span>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
              </label>
              <input
                type="text"
                value={masterForm.orgCode}
                onChange={(e) => setMasterForm({ ...masterForm, orgCode: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Informational Lookups */}
            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Legal Entity *</span>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
              </label>
              <select
                value={masterForm.legalEntity}
                onChange={(e) => setMasterForm({ ...masterForm, legalEntity: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Magnertia Global Pvt. Ltd.">Magnertia Global Pvt. Ltd.</option>
                <option value="Magnertia Tech Inc.">Magnertia Tech Inc. (USA)</option>
                <option value="Magnertia Europe GmbH">Magnertia Europe GmbH</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Parent Organization</span>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
              </label>
              <select
                value={masterForm.parentOrg}
                onChange={(e) => setMasterForm({ ...masterForm, parentOrg: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Magnertia Group">Magnertia Group</option>
                <option value="None">None (Root Holding)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Organization Type *</span>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
              </label>
              <select
                value={masterForm.orgType}
                onChange={(e) => setMasterForm({ ...masterForm, orgType: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Corporate">Corporate</option>
                <option value="Business Unit">Business Unit</option>
                <option value="Division">Division</option>
                <option value="Function">Function</option>
                <option value="Department">Department</option>
                <option value="Regional Office">Regional Office</option>
                <option value="Development Centre">Development Centre</option>
                <option value="Manufacturing Unit">Manufacturing Unit</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Organization Level *</span>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
              </label>
              <select
                value={masterForm.orgLevel}
                onChange={(e) => setMasterForm({ ...masterForm, orgLevel: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Level 1 - Corporate">Level 1 - Corporate</option>
                <option value="Level 2 - Business Unit">Level 2 - Business Unit</option>
                <option value="Level 3 - Function">Level 3 - Function</option>
                <option value="Level 4 - Department">Level 4 - Department</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Organization Head *</span>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
              </label>
              <select
                value={masterForm.orgHead}
                onChange={(e) => setMasterForm({ ...masterForm, orgHead: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Rajeev Malhotra">Rajeev Malhotra (CEO)</option>
                <option value="Anita Verma">Anita Verma (CFO)</option>
                <option value="Vikram Singh">Vikram Singh (CTO)</option>
                <option value="Sandeep Iyer">Sandeep Iyer (COO)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Operating Model *</span>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
              </label>
              <select
                value={masterForm.operatingModel}
                onChange={(e) => setMasterForm({ ...masterForm, operatingModel: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Functional">Functional</option>
                <option value="Divisional">Divisional</option>
                <option value="Matrix">Matrix Structure</option>
                <option value="Flat / Hybrid">Flat / Hybrid</option>
              </select>
            </div>

            {/* Calculated Counters */}
            <div className="grid grid-cols-4 gap-2 sm:col-span-2 lg:col-span-2 rounded-lg bg-muted/30 p-2 border border-border/50">
              <div className="text-center">
                <span className="text-[10px] text-muted-foreground block">Business Units</span>
                <span className="text-sm font-bold text-foreground font-mono">{masterForm.buCount}</span>
                <span className="text-[9px] font-bold text-purple-500 block">C</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-muted-foreground block">Functions</span>
                <span className="text-sm font-bold text-foreground font-mono">{masterForm.functionCount}</span>
                <span className="text-[9px] font-bold text-purple-500 block">C</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-muted-foreground block">Departments</span>
                <span className="text-sm font-bold text-foreground font-mono">{masterForm.deptCount}</span>
                <span className="text-[9px] font-bold text-purple-500 block">C</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-muted-foreground block">Total Employees</span>
                <span className="text-sm font-bold text-primary font-mono">{masterForm.totalEmployees.toLocaleString()}</span>
                <span className="text-[9px] font-bold text-purple-500 block">C</span>
              </div>
            </div>
          </div>

          {/* Strategic Purpose & Vision Text Areas */}
          <div className="grid gap-3 sm:grid-cols-3 pt-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Organization Vision *</span>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
              </label>
              <textarea
                rows={2}
                value={masterForm.vision}
                onChange={(e) => setMasterForm({ ...masterForm, vision: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Organization Mission *</span>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
              </label>
              <textarea
                rows={2}
                value={masterForm.mission}
                onChange={(e) => setMasterForm({ ...masterForm, mission: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Strategic Objectives *</span>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
              </label>
              <textarea
                rows={2}
                value={masterForm.objectives}
                onChange={(e) => setMasterForm({ ...masterForm, objectives: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Sub-Module Interactive Workspace Tabs */}
        <div className="space-y-4">
          {/* Tab Navigation Header */}
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "hierarchy", label: "Hierarchy", icon: FolderTree },
              { key: "units", label: "Units", icon: Building2 },
              { key: "functions", label: "Functions", icon: Layers },
              { key: "departments", label: "Departments", icon: Briefcase },
              { key: "teams", label: "Teams", icon: Users },
              { key: "positions", label: "Positions", icon: UserCheck },
              { key: "reporting", label: "Reporting", icon: GitBranchIcon },
              { key: "authority", label: "Authority", icon: ShieldCheck },
              { key: "raci", label: "RACI", icon: Sliders },
              { key: "locations", label: "Locations", icon: MapPin },
              { key: "cost-centres", label: "Cost Centres", icon: Landmark },
              { key: "governance", label: "Governance", icon: Award },
              { key: "kpis", label: "KPIs", icon: TrendingUp },
              { key: "analytics", label: "Analytics", icon: Sparkles },
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

          {/* TAB 1: Hierarchy View (Matching the attached screenshot exactly) */}
          {activeTab === "hierarchy" && (
            <div className="grid gap-4 lg:grid-cols-12">
              {/* Left Column: Organization Hierarchy Tree */}
              <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground">3. Organization Hierarchy</h4>
                </div>

                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search in hierarchy..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1 max-h-[520px] overflow-y-auto text-xs pr-1">
                  <TreeNodeItem node={ORG_HIERARCHY_TREE} selectedId={selectedTreeNode} onSelect={setSelectedTreeNode} />
                </div>
              </div>

              {/* Center Column: Organization Visual Chart (Diagram matching screenshot) */}
              <div className="lg:col-span-6 rounded-xl border border-border bg-card p-4 flex flex-col justify-between min-h-[560px]">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">Organization Chart</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono">
                      Zoom: {zoomLevel}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(z - 10, 60))}
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(100)}
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => showNotification("Chart exported to high-resolution PNG & PDF.")}
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Download Chart"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Visual Chart Canvas */}
                <div
                  className="flex-1 my-4 flex flex-col items-center justify-center overflow-auto p-4 border border-dashed border-border/60 rounded-lg bg-muted/10 transition-transform origin-top duration-200"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                >
                  {/* Level 0: Board */}
                  <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-center text-xs font-bold text-purple-700 shadow-xs mb-4">
                    Board of Directors
                  </div>

                  <div className="h-4 w-0.5 bg-border" />

                  {/* Level 1: CEO */}
                  <div className="rounded-xl border border-primary/40 bg-card p-3 shadow-md flex items-center gap-3 w-64 mb-6">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0 border border-primary/30">
                      RM
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-foreground">Rajeev Malhotra</h5>
                      <p className="text-[10px] text-muted-foreground">Chief Executive Officer</p>
                      <span className="text-[9px] font-semibold text-primary bg-primary/10 px-1.5 py-0.2 rounded mt-1 inline-block">
                        Legal Entity Head
                      </span>
                    </div>
                  </div>

                  <div className="h-4 w-0.5 bg-border" />
                  <div className="w-[85%] h-0.5 bg-border mb-4" />

                  {/* Level 2: Executive CXOs */}
                  <div className="grid grid-cols-5 gap-3 w-full max-w-2xl">
                    <VisualOrgCard name="Anita Verma" title="Chief Financial Officer" dept="Finance" count="186" color="border-amber-500/40 bg-amber-500/5" text="text-amber-600" />
                    <VisualOrgCard name="Sandeep Iyer" title="Chief Operating Officer" dept="Operations" count="356" color="border-emerald-500/40 bg-emerald-500/5" text="text-emerald-600" />
                    <VisualOrgCard name="Vikram Singh" title="Chief Technology Officer" dept="R&D / Cloud" count="298" color="border-blue-500/40 bg-blue-500/5" text="text-blue-600" />
                    <VisualOrgCard name="Meera Nair" title="Chief Human Resources Officer" dept="HR" count="154" color="border-rose-500/40 bg-rose-500/5" text="text-rose-600" />
                    <VisualOrgCard name="Arjun Mehta" title="Chief Sales Officer" dept="Sales" count="412" color="border-orange-500/40 bg-orange-500/5" text="text-orange-600" />
                  </div>

                  {/* Level 3: Departments Sub-tier */}
                  <div className="grid grid-cols-5 gap-3 w-full max-w-2xl mt-6">
                    <div className="space-y-2">
                      <MiniDeptCard label="Accounts" count="82" />
                      <MiniDeptCard label="Treasury" count="48" />
                    </div>
                    <div className="space-y-2">
                      <MiniDeptCard label="Production" count="214" />
                      <MiniDeptCard label="Quality" count="142" />
                    </div>
                    <div className="space-y-2">
                      <MiniDeptCard label="Product Dev" count="172" />
                      <MiniDeptCard label="Engineering" count="126" />
                    </div>
                    <div className="space-y-2">
                      <MiniDeptCard label="Talent Acq" count="68" />
                      <MiniDeptCard label="Emp Relations" count="86" />
                    </div>
                    <div className="space-y-2">
                      <MiniDeptCard label="Domestic Sales" count="214" />
                      <MiniDeptCard label="Intl Sales" count="198" />
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground text-center">
                  Click any node card to inspect detailed organizational unit metrics.
                </div>
              </div>

              {/* Right Column: Organization Unit Details Card */}
              <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <h4 className="text-xs font-bold text-foreground">Organization Unit Details</h4>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                    Active
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] text-muted-foreground block">Unit Name</label>
                    <input
                      type="text"
                      readOnly
                      value="Product Business"
                      className="mt-0.5 w-full rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-semibold text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-muted-foreground block">Unit Code</label>
                    <input
                      type="text"
                      readOnly
                      value="BU-PROD"
                      className="mt-0.5 w-full rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-mono text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-muted-foreground block">Unit Type</label>
                    <input
                      type="text"
                      readOnly
                      value="Business Unit"
                      className="mt-0.5 w-full rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-muted-foreground block">Unit Head</label>
                    <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground">
                      <option value="Amit Desai">Amit Desai</option>
                      <option value="Rajeev Malhotra">Rajeev Malhotra</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-muted-foreground block">Parent Unit</label>
                    <input
                      type="text"
                      readOnly
                      value="Business Units Group"
                      className="mt-0.5 w-full rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[11px] text-muted-foreground block">Cost Centre</label>
                      <input
                        type="text"
                        readOnly
                        value="CC-BU-PROD"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/40 px-2 py-1 text-[11px] font-mono text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted-foreground block">Profit Centre</label>
                      <input
                        type="text"
                        readOnly
                        value="PC-BU-PROD"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/40 px-2 py-1 text-[11px] font-mono text-foreground"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Total Headcount</span>
                      <span className="font-bold text-primary text-sm font-mono">1,024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Units (Organizational Units Data Surface) */}
          {activeTab === "units" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Organizational Units Directory</h4>
                  <p className="text-xs text-muted-foreground">List of all registered legal entities, business units, and functions.</p>
                </div>
                <button
                  onClick={() => showNotification("New Unit Wizard launched.")}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Organization Unit
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="p-3">Unit ID</th>
                      <th className="p-3">Unit Name</th>
                      <th className="p-3">Code</th>
                      <th className="p-3">Unit Type</th>
                      <th className="p-3">Unit Head</th>
                      <th className="p-3">Cost Centre</th>
                      <th className="p-3">Profit Centre</th>
                      <th className="p-3 text-right">Employees</th>
                      <th className="p-3 text-right">Budget</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {UNITS_DATA.map((unit) => (
                      <tr key={unit.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono font-medium text-primary">{unit.id}</td>
                        <td className="p-3 font-bold text-foreground">{unit.name}</td>
                        <td className="p-3 font-mono text-muted-foreground">{unit.code}</td>
                        <td className="p-3">
                          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                            {unit.type}
                          </span>
                        </td>
                        <td className="p-3 text-foreground">{unit.head}</td>
                        <td className="p-3 font-mono text-xs">{unit.costCentre}</td>
                        <td className="p-3 font-mono text-xs">{unit.profitCentre}</td>
                        <td className="p-3 text-right font-bold font-mono">{unit.employees}</td>
                        <td className="p-3 text-right font-medium">{unit.budget}</td>
                        <td className="p-3">
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                            {unit.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Business Functions */}
          {activeTab === "functions" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Business Function Structure</h4>
                  <p className="text-xs text-muted-foreground">Functional classification and leadership allocation.</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {CORE_FUNCTIONS.map((fn) => (
                  <div key={fn.id} className="rounded-lg border border-border bg-background p-3.5 space-y-2 hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground">{fn.name}</span>
                      <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{fn.code}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{fn.objective}</p>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/50">
                      <span className="text-muted-foreground">Head: <span className="font-semibold text-foreground">{fn.head}</span></span>
                      <span className="font-bold text-primary">{fn.budget}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Department Structure */}
          {activeTab === "departments" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Department Structure</h4>
                  <p className="text-xs text-muted-foreground">Departmental breakdown, heads, headcount, and budget allocation.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="p-3">Dept ID</th>
                      <th className="p-3">Department Name</th>
                      <th className="p-3">Code</th>
                      <th className="p-3">Function</th>
                      <th className="p-3">Department Head</th>
                      <th className="p-3 text-right">Headcount</th>
                      <th className="p-3 text-right">Budget</th>
                      <th className="p-3">KPIs</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {DEPARTMENTS_DATA.map((d) => (
                      <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono font-medium text-primary">{d.id}</td>
                        <td className="p-3 font-bold text-foreground">{d.name}</td>
                        <td className="p-3 font-mono text-muted-foreground">{d.code}</td>
                        <td className="p-3">{d.function}</td>
                        <td className="p-3 font-medium text-foreground">{d.head}</td>
                        <td className="p-3 text-right font-bold font-mono">{d.employees}</td>
                        <td className="p-3 text-right font-medium">{d.budget}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {d.kpis.map((kpi, i) => (
                              <span key={i} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                {kpi}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: Positions */}
          {activeTab === "positions" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Position Architecture</h4>
                  <p className="text-xs text-muted-foreground">Formal job titles, management levels, and direct reporting lines.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="p-3">Position Code</th>
                      <th className="p-3">Position Title</th>
                      <th className="p-3">Management Level</th>
                      <th className="p-3">Unit / Dept</th>
                      <th className="p-3">Reporting Manager</th>
                      <th className="p-3 text-center">Headcount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {POSITIONS_DATA.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono font-medium text-primary">{p.code}</td>
                        <td className="p-3 font-bold text-foreground">{p.title}</td>
                        <td className="p-3">
                          <span className="rounded bg-purple-500/10 px-2 py-0.5 text-[11px] font-medium text-purple-600">
                            {p.level}
                          </span>
                        </td>
                        <td className="p-3">{p.dept}</td>
                        <td className="p-3 font-medium text-foreground">{p.manager}</td>
                        <td className="p-3 text-center font-bold font-mono">{p.headcount}</td>
                        <td className="p-3">
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
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

          {/* TAB 6: Reporting & Management Hierarchy */}
          {activeTab === "reporting" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-foreground">Management Hierarchy & Reporting Chains</h4>
                <p className="text-xs text-muted-foreground">Vertical reporting structure from Board of Directors down to Associate level.</p>
              </div>

              {/* Management Level Flow Diagram */}
              <div className="flex flex-wrap items-center justify-center gap-2 py-3 bg-muted/20 rounded-xl p-4 border border-border/50">
                {[
                  "Board",
                  "CEO / MD",
                  "CXO Executive",
                  "Business Head",
                  "Function Head",
                  "Dept Head",
                  "Team Lead",
                  "Manager",
                  "Specialist / Engineer",
                  "Associate",
                ].map((lvl, idx, arr) => (
                  <div key={lvl} className="flex items-center gap-2">
                    <div className="rounded-lg border border-primary/30 bg-card px-3 py-1.5 text-center text-xs font-bold text-foreground shadow-2xs">
                      {lvl}
                    </div>
                    {idx < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: Authority & Delegation */}
          {activeTab === "authority" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-foreground">Authority & Delegation Matrix</h4>
                <p className="text-xs text-muted-foreground">Financial limits, contract binding, and hiring approval authority per position.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="p-3">Auth ID</th>
                      <th className="p-3">Position</th>
                      <th className="p-3">Authority Type</th>
                      <th className="p-3 text-right">Approval Limit</th>
                      <th className="p-3 text-center">Financial</th>
                      <th className="p-3 text-center">Contract</th>
                      <th className="p-3 text-center">Hiring</th>
                      <th className="p-3 text-center">Procurement</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {AUTHORITY_MATRIX.map((a) => (
                      <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono font-medium text-primary">{a.id}</td>
                        <td className="p-3 font-bold text-foreground">{a.position}</td>
                        <td className="p-3 text-muted-foreground">{a.authorityType}</td>
                        <td className="p-3 text-right font-bold font-mono text-emerald-600">{a.approvalLimit}</td>
                        <td className="p-3 text-center">{a.financial ? <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : <XCircle className="h-4 w-4 text-muted-foreground inline opacity-40" />}</td>
                        <td className="p-3 text-center">{a.contract ? <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : <XCircle className="h-4 w-4 text-muted-foreground inline opacity-40" />}</td>
                        <td className="p-3 text-center">{a.hiring ? <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : <XCircle className="h-4 w-4 text-muted-foreground inline opacity-40" />}</td>
                        <td className="p-3 text-center">{a.procurement ? <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : <XCircle className="h-4 w-4 text-muted-foreground inline opacity-40" />}</td>
                        <td className="p-3">
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: RACI Matrix */}
          {activeTab === "raci" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-foreground">Responsibility Matrix (RACI)</h4>
                <p className="text-xs text-muted-foreground">
                  <span className="font-bold text-emerald-600">R</span> Responsible ·{" "}
                  <span className="font-bold text-blue-600">A</span> Accountable ·{" "}
                  <span className="font-bold text-amber-600">C</span> Consulted ·{" "}
                  <span className="font-bold text-purple-600">I</span> Informed
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="p-3">Process</th>
                      <th className="p-3">Key Activity</th>
                      <th className="p-3">Responsible (R)</th>
                      <th className="p-3">Accountable (A)</th>
                      <th className="p-3">Consulted (C)</th>
                      <th className="p-3">Informed (I)</th>
                      <th className="p-3 text-center">SLA (Days)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {RACI_MATRIX.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-bold text-foreground">{r.process}</td>
                        <td className="p-3 text-muted-foreground">{r.activity}</td>
                        <td className="p-3 font-semibold text-emerald-600">{r.responsible}</td>
                        <td className="p-3 font-semibold text-blue-600">{r.accountable}</td>
                        <td className="p-3 text-amber-600">{r.consulted}</td>
                        <td className="p-3 text-purple-600">{r.informed}</td>
                        <td className="p-3 text-center font-mono font-bold">{r.sla}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: Locations */}
          {activeTab === "locations" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-foreground">Organizational Locations</h4>
                <p className="text-xs text-muted-foreground">Geographic footprint, campuses, and employee capacity.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {LOCATIONS_DATA.map((loc) => (
                  <div key={loc.id} className="rounded-xl border border-border bg-background p-4 space-y-2 hover:border-primary/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground">{loc.name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{loc.code}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      {loc.address}
                    </p>
                    <div className="pt-2 border-t border-border/50 flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Capacity: {loc.current} / {loc.capacity}</span>
                      <span className="font-bold text-emerald-600">{Math.round((loc.current / loc.capacity) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: Governance & Risk */}
          {(activeTab === "governance" || activeTab === "teams" || activeTab === "cost-centres" || activeTab === "kpis" || activeTab === "analytics") && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-foreground">Governance Bodies & Organization Risk Assessment</h4>
                <p className="text-xs text-muted-foreground">Governance structure oversight, policy references, and structural risk mitigation.</p>
              </div>

              {/* Governance Bodies */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="p-3">Governance Body</th>
                      <th className="p-3">Governance Role</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Decision Rights</th>
                      <th className="p-3">Policy Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {GOVERNANCE_BODIES.map((g) => (
                      <tr key={g.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-bold text-foreground">{g.body}</td>
                        <td className="p-3 text-primary font-medium">{g.role}</td>
                        <td className="p-3 text-muted-foreground">{g.frequency}</td>
                        <td className="p-3 text-muted-foreground">{g.rights}</td>
                        <td className="p-3 font-mono text-xs text-purple-600">{g.policy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Organization Risk Assessment */}
              <div className="space-y-3 pt-3 border-t border-border/60">
                <h5 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Organization Structural Risk Matrix
                </h5>
                <div className="grid gap-3 sm:grid-cols-3">
                  {ORG_RISK_ASSESSMENT.map((r) => (
                    <div key={r.id} className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-foreground">{r.category}</span>
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                          {r.score}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{r.desc}</p>
                      <p className="text-[10px] text-foreground font-semibold pt-1 border-t border-amber-500/20">
                        Mitigation: {r.mitigation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Classification & Modification Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-[11px] text-muted-foreground font-mono">
          <div>
            MAICW: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
            <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
            <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
            <span className="text-purple-500 font-bold">C</span> (Calculated) |{" "}
            <span className="text-rose-500 font-bold">W</span> (Workflow)
          </div>
          <div>
            Last Modified: <span className="font-sans font-semibold text-foreground">15 May 2024 11:30 AM</span> | Created By: <span className="font-sans font-semibold text-foreground">Rahul Sharma</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// --- Supporting UI Sub-components ---

function TreeNodeItem({
  node,
  selectedId,
  onSelect,
}: {
  node: OrgTreeNode;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div className="space-y-0.5">
      <div
        onClick={() => onSelect(node.id)}
        className={cn(
          "flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors cursor-pointer",
          isSelected ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted text-foreground"
        )}
      >
        <div className="flex items-center gap-1.5 truncate">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="p-0.5 hover:bg-black/10 rounded"
            >
              {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
          ) : (
            <span className="w-4" />
          )}
          <span className="truncate">{node.name}</span>
        </div>
        <span
          className={cn(
            "rounded-full px-1.5 py-0.2 text-[9px] font-mono shrink-0",
            isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
          )}
        >
          {node.count}
        </span>
      </div>

      {hasChildren && expanded && (
        <div className="pl-3.5 border-l border-border/50 ml-2 space-y-0.5">
          {node.children!.map((child) => (
            <TreeNodeItem key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

function VisualOrgCard({
  name,
  title,
  dept,
  count,
  color,
  text,
}: {
  name: string;
  title: string;
  dept: string;
  count: string;
  color: string;
  text: string;
}) {
  return (
    <div className={cn("rounded-xl border p-2.5 shadow-xs text-center space-y-1 bg-card", color)}>
      <h6 className="text-[11px] font-bold text-foreground leading-tight">{name}</h6>
      <p className="text-[9px] text-muted-foreground leading-tight line-clamp-1">{title}</p>
      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[9px]">
        <span className={cn("font-bold", text)}>{dept}</span>
        <span className="font-mono text-muted-foreground">{count} emp</span>
      </div>
    </div>
  );
}

function MiniDeptCard({ label, count }: { label: string; count: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-1.5 text-center shadow-2xs">
      <span className="text-[10px] font-bold text-foreground block truncate">{label}</span>
      <span className="text-[9px] font-mono text-muted-foreground">{count} Employees</span>
    </div>
  );
}

function GitBranchIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}
