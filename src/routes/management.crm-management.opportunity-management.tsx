import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { CrmManagementTabBar } from "@/components/erp/CrmManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Users,
  Target,
  Building2,
  Phone,
  Mail,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  Printer,
  Save,
  Send,
  Download,
  Share2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  MessageSquare,
  Paperclip,
  Activity,
  Layers,
  ChevronRight,
  UserCheck,
  Award,
  BarChart3,
  PieChart,
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
  ArrowLeft,
  Lock,
  Eye,
  Trophy,
  AlertTriangle,
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
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/management/crm-management/opportunity-management")({
  head: () => ({
    meta: [
      { title: "Opportunity Management Form · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Opportunity Management Form - Manage qualified business opportunities, sales pipeline stages, proposal generation, commercial negotiation, forecasting and conversion.",
      },
    ],
  }),
  component: OpportunityManagementPage,
});

// --- Data Models & Interfaces ---

export type OpportunityType =
  | "New Business"
  | "Existing Customer"
  | "Cross-Sell"
  | "Up-Sell"
  | "Renewal"
  | "Replacement"
  | "Expansion"
  | "Franchise"
  | "Project"
  | "Tender"
  | "Government Order"
  | "Strategic Account";

export type SalesStage =
  | "Lead Qualified"
  | "Opportunity Created"
  | "Discovery"
  | "Requirement Confirmed"
  | "Solution / Demo"
  | "Proposal / Quotation"
  | "Commercial Negotiation"
  | "Final Approval"
  | "Contract / PO"
  | "Closed Won"
  | "Closed Lost";

export type ForecastCategory = "Pipeline" | "Best Case" | "Commit" | "Omitted" | "Closed Won" | "Closed Lost";

export interface OpportunityRecord {
  id: string;
  opportunityNumber: string;
  opportunityName: string;
  opportunityType: OpportunityType;
  status: "Active" | "Inactive" | "Closed Won" | "Closed Lost";
  stage: SalesStage;
  owner: { name: string; avatar: string; email: string };
  accountName: string;
  salesTeam: string;
  businessUnit: string;
  branch: string;
  territory: string;
  sourceLead: string;
  createdDate: string;
  expectedCloseDate: string;
  probability: number; // percentage e.g. 60
  forecastCategory: ForecastCategory;
  description: string;

  // Value Breakdown
  productValue: number;
  serviceValue: number;
  installationValue: number;
  amcValue: number;
  otherValue: number;
  grossValue: number;
  discountValue: number;
  netOpportunityValue: number;
  expectedRevenue: number;
  currency: string;

  // Qualification (BANT & Fit)
  needRating: number;
  authorityRating: number;
  budgetRating: number;
  timelineRating: number;
  strategicFitRating: number;
  technicalFitRating: number;
  commercialFitRating: number;
  qualificationScore: number;
  qualificationStatus: "Qualified" | "In Review" | "Disqualified";

  // Next Step & Activity
  nextAction: string;
  nextActionDate: string;
  nextActionPriority: "Low" | "Medium" | "High" | "Critical";
  assignedTo: string;

  // Risk & Strategy
  topRisk: string;
  riskScore: number;
  riskSeverity: "Low" | "Medium" | "High" | "Critical";
  winStrategy: string;
  relationshipStrength: number;

  // Pipeline Dates
  stageEnteredOn: string;
  lastActivityOn: string;
  nextFollowUpDate: string;
  proposalDueDate: string;
}

const INITIAL_OPPORTUNITIES: OpportunityRecord[] = [
  {
    id: "OPP-001",
    opportunityNumber: "OPP-2024-000256",
    opportunityName: "Industrial Automation Project",
    opportunityType: "New Business",
    status: "Active",
    stage: "Solution / Demo",
    owner: { name: "Rahul Sharma", avatar: "RS", email: "rahul.sharma@magnertia.com" },
    accountName: "Acme Automation Pvt. Ltd.",
    salesTeam: "Industrial Sales Team",
    businessUnit: "Industrial Solutions",
    branch: "Mumbai Branch",
    territory: "West Zone",
    sourceLead: "LEAD-2024-000485",
    createdDate: "15 Apr 2024 09:30 AM",
    expectedCloseDate: "2024-06-30",
    probability: 60,
    forecastCategory: "Pipeline",
    description: "Supply and implementation of PLC, SCADA and HMI systems for new manufacturing line. Includes integration, installation and training.",

    productValue: 4250000,
    serviceValue: 500000,
    installationValue: 200000,
    amcValue: 120000,
    otherValue: 0,
    grossValue: 5070000,
    discountValue: 250000,
    netOpportunityValue: 4820000,
    expectedRevenue: 2892000,
    currency: "INR",

    needRating: 5,
    authorityRating: 4,
    budgetRating: 3,
    timelineRating: 4,
    strategicFitRating: 5,
    technicalFitRating: 5,
    commercialFitRating: 4,
    qualificationScore: 78,
    qualificationStatus: "Qualified",

    nextAction: "Product Demo at Site",
    nextActionDate: "22 May 2024 11:00 AM",
    nextActionPriority: "High",
    assignedTo: "Rahul Sharma",

    topRisk: "Competitor Price Pressure",
    riskScore: 12,
    riskSeverity: "Medium",
    winStrategy: "Superior Technical Solution & Turnkey Execution",
    relationshipStrength: 4.2,

    stageEnteredOn: "15 May 2024",
    lastActivityOn: "18 May 2024",
    nextFollowUpDate: "22 May 2024",
    proposalDueDate: "31 May 2024",
  },
  {
    id: "OPP-002",
    opportunityNumber: "OPP-2024-000257",
    opportunityName: "Robotic Arm Line Expansion",
    opportunityType: "Expansion",
    status: "Active",
    stage: "Proposal / Quotation",
    owner: { name: "Priya Nair", avatar: "PN", email: "priya.nair@magnertia.com" },
    accountName: "Zenith Robotics Corp",
    salesTeam: "Robotics Sales Team",
    businessUnit: "Robotics & AI",
    branch: "Bengaluru Branch",
    territory: "South Zone",
    sourceLead: "LEAD-2024-000486",
    createdDate: "16 Apr 2024 10:15 AM",
    expectedCloseDate: "2024-05-30",
    probability: 80,
    forecastCategory: "Commit",
    description: "4 Units of 6-axis robotic integration arms with vision feedback feedback for warehouse automation line.",

    productValue: 16000000,
    serviceValue: 1500000,
    installationValue: 500000,
    amcValue: 500000,
    otherValue: 0,
    grossValue: 18500000,
    discountValue: 500000,
    netOpportunityValue: 18000000,
    expectedRevenue: 14400000,
    currency: "INR",

    needRating: 5,
    authorityRating: 5,
    budgetRating: 5,
    timelineRating: 5,
    strategicFitRating: 5,
    technicalFitRating: 5,
    commercialFitRating: 5,
    qualificationScore: 95,
    qualificationStatus: "Qualified",

    nextAction: "Final Contract Sign-off",
    nextActionDate: "24 May 2024 02:00 PM",
    nextActionPriority: "Critical",
    assignedTo: "Priya Nair",

    topRisk: "Delivery Lead Time",
    riskScore: 8,
    riskSeverity: "Low",
    winStrategy: "Guaranteed 4-week delivery SLA",
    relationshipStrength: 4.8,

    stageEnteredOn: "18 May 2024",
    lastActivityOn: "19 May 2024",
    nextFollowUpDate: "24 May 2024",
    proposalDueDate: "20 May 2024",
  },
];

const CONTACTS_MAPPED = [
  {
    name: "Ankit Verma",
    role: "Plant Head",
    decisionRole: "Decision Maker",
    influence: 5,
    primary: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Neha Kapoor",
    role: "Automation Manager",
    decisionRole: "Technical Evaluator",
    influence: 4,
    primary: false,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Vikram Singh",
    role: "Purchase Manager",
    decisionRole: "Buyer",
    influence: 4,
    primary: false,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Pooja Mehta",
    role: "Finance Manager",
    decisionRole: "Approver",
    influence: 3,
    primary: false,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
  },
];

const COMPETITORS_DATA = [
  { competitor: "ABC Automation", product: "PLC & SCADA", price: "₹ 51,00,000", strength: "Brand, Service", position: "Strong" },
  { competitor: "XYZ Controls", product: "PLC & HMI", price: "₹ 49,50,000", strength: "Pricing", position: "Strong" },
  { competitor: "Delta Systems", product: "SCADA", price: "₹ 46,00,000", strength: "Features", position: "Moderate" },
];

const RECENT_ACTIVITIES = [
  {
    id: "ACT-201",
    time: "18 May 2024 11:15 AM",
    type: "Meeting",
    subject: "Solution Demo with Technical Team",
    outcome: "Positive",
    outcomeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    nextAction: "Send Proposal",
    nextActionDate: "22 May 2024",
    assignedTo: "Rahul Sharma",
    status: "Completed",
  },
  {
    id: "ACT-202",
    time: "15 May 2024 04:30 PM",
    type: "Email",
    subject: "Technical Specification Shared",
    outcome: "Info Sent",
    outcomeColor: "bg-blue-50 text-blue-700 border-blue-200",
    nextAction: "Clarify Technical Queries",
    nextActionDate: "20 May 2024",
    assignedTo: "Rahul Sharma",
    status: "Completed",
  },
  {
    id: "ACT-203",
    time: "12 May 2024 03:00 PM",
    type: "Call",
    subject: "Requirement Discussion",
    outcome: "Interested",
    outcomeColor: "bg-purple-50 text-purple-700 border-purple-200",
    nextAction: "Schedule Product Demo",
    nextActionDate: "18 May 2024",
    assignedTo: "Rahul Sharma",
    status: "Completed",
  },
  {
    id: "ACT-204",
    time: "10 May 2024 10:00 AM",
    type: "Note",
    subject: "Initial Discovery Meeting",
    outcome: "Req. Identified",
    outcomeColor: "bg-amber-50 text-amber-700 border-amber-200",
    nextAction: "Share Brochure",
    nextActionDate: "13 May 2024",
    assignedTo: "Rahul Sharma",
    status: "Completed",
  },
];

function OpportunityManagementPage() {
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>(INITIAL_OPPORTUNITIES);
  const [selectedOppId, setSelectedOppId] = useState<string>("OPP-001");

  // Dialog States
  const [isNewOppOpen, setIsNewOppOpen] = useState(false);
  const [isConvertOrderOpen, setIsConvertOrderOpen] = useState(false);
  const [isChangeStageOpen, setIsChangeStageOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Active Record Object
  const currentOpp = useMemo(() => {
    return opportunities.find((o) => o.id === selectedOppId) || opportunities[0];
  }, [opportunities, selectedOppId]);

  const [formState, setFormState] = useState<OpportunityRecord>(currentOpp);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectOpp = (id: string) => {
    setSelectedOppId(id);
    const target = opportunities.find((o) => o.id === id);
    if (target) setFormState(target);
  };

  const handleInputChange = (field: keyof OpportunityRecord, value: any) => {
    setFormState((prev) => {
      const updated = { ...prev, [field]: value };
      // Recalculate Expected Revenue if Net Value or Probability changes
      if (field === "netOpportunityValue" || field === "probability") {
        updated.expectedRevenue = Math.round((updated.netOpportunityValue * updated.probability) / 100);
      }
      return updated;
    });
  };

  const handleSaveOpp = () => {
    setOpportunities((prev) => prev.map((o) => (o.id === formState.id ? formState : o)));
    showNotification(`Opportunity ${formState.opportunityNumber} (${formState.opportunityName}) saved successfully!`);
  };

  const STAGES_PIPELINE: { stage: SalesStage; date: string; status: "Completed" | "In Progress" | "Pending" }[] = [
    { stage: "Lead Qualified", date: "10 Apr 2024", status: "Completed" },
    { stage: "Opportunity Created", date: "15 Apr 2024", status: "Completed" },
    { stage: "Discovery", date: "18 Apr 2024", status: "Completed" },
    { stage: "Requirement Confirmed", date: "25 Apr 2024", status: "Completed" },
    { stage: "Solution / Demo", date: "15 May 2024", status: "In Progress" },
    { stage: "Proposal / Quotation", date: "-", status: "Pending" },
    { stage: "Commercial Negotiation", date: "-", status: "Pending" },
    { stage: "Final Approval", date: "-", status: "Pending" },
    { stage: "Contract / PO", date: "-", status: "Pending" },
    { stage: "Closed Won", date: "-", status: "Pending" },
  ];

  return (
    <AppShell
      title="Opportunity Management"
      breadcrumb="Management > CRM Management > Opportunity Management"
      description="The Opportunity Management Form is the central CRM record for managing revenue-generating deals—from lead conversion/creation → qualification → solution mapping → competitor strategy → stage progression → revenue forecasting → proposal/quoting → discount approvals → closing → win/loss analysis."
      tabs={<CrmManagementTabBar />}
    >
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col min-h-screen text-slate-800 space-y-6">
        {/* Opportunity Master Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-3 flex-nowrap overflow-x-auto scrollbar-none">
            {/* Title & Status Badges */}
            <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap">Opportunity Form</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap font-mono">
                {formState.opportunityNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 whitespace-nowrap flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block" />
                <span>{formState.stage}</span>
              </span>
            </div>

            {/* Quick Actions Header */}
            <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
              <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Select Deal:</label>
                <select
                  value={selectedOppId}
                  onChange={(e) => handleSelectOpp(e.target.value)}
                  className="h-8 max-w-[210px] text-xs bg-slate-50 border border-slate-300 rounded-md px-2 font-medium focus:ring-2 focus:ring-primary focus:outline-none truncate"
                >
                  {opportunities.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.opportunityNumber} - {o.opportunityName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsNewOppOpen(true)}
                className="h-8 px-3 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Deal</span>
              </button>

              <button
                onClick={handleSaveOpp}
                className="h-8 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>

              <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1 shrink-0 whitespace-nowrap">
                <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs shadow-2xs shrink-0">
                  RS
                </div>
                <div className="text-left hidden sm:block whitespace-nowrap">
                  <div className="text-xs font-semibold text-slate-800 leading-none">Rahul Sharma</div>
                  <div className="text-[10px] text-slate-500">Sales Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Opportunity Master Card (Matching Mockup Image) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">1. Opportunity Master</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">MAICW Pipeline Master Record</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Opportunity Number *</label>
              <input
                type="text"
                value={formState.opportunityNumber}
                onChange={(e) => handleInputChange("opportunityNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800"
              />
            </div>

            <div className="col-span-1 lg:col-span-2">
              <label className="block text-slate-500 font-semibold mb-1">
                Opportunity Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formState.opportunityName}
                onChange={(e) => handleInputChange("opportunityName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Opportunity Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={formState.opportunityType}
                onChange={(e) => handleInputChange("opportunityType", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="New Business">New Business</option>
                <option value="Existing Customer">Existing Customer</option>
                <option value="Cross-Sell">Cross-Sell</option>
                <option value="Up-Sell">Up-Sell</option>
                <option value="Renewal">Renewal</option>
                <option value="Expansion">Expansion</option>
                <option value="Project">Project</option>
                <option value="Tender">Tender</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Opportunity Stage <span className="text-rose-500">*</span>
              </label>
              <select
                value={formState.stage}
                onChange={(e) => handleInputChange("stage", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-blue-700 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Lead Qualified">Lead Qualified</option>
                <option value="Opportunity Created">Opportunity Created</option>
                <option value="Discovery">Discovery</option>
                <option value="Requirement Confirmed">Requirement Confirmed</option>
                <option value="Solution / Demo">Solution / Demo</option>
                <option value="Proposal / Quotation">Proposal / Quotation</option>
                <option value="Commercial Negotiation">Commercial Negotiation</option>
                <option value="Final Approval">Final Approval</option>
                <option value="Contract / PO">Contract / PO</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Account / Customer *</label>
              <input
                type="text"
                value={formState.accountName}
                onChange={(e) => handleInputChange("accountName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Sales Team</label>
              <input
                type="text"
                value={formState.salesTeam}
                onChange={(e) => handleInputChange("salesTeam", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Business Unit</label>
              <input
                type="text"
                value={formState.businessUnit}
                onChange={(e) => handleInputChange("businessUnit", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Branch</label>
              <input
                type="text"
                value={formState.branch}
                onChange={(e) => handleInputChange("branch", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Territory</label>
              <input
                type="text"
                value={formState.territory}
                onChange={(e) => handleInputChange("territory", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Source Lead</label>
              <input
                type="text"
                value={formState.sourceLead}
                onChange={(e) => handleInputChange("sourceLead", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Created Date</label>
              <input
                type="text"
                disabled
                value={formState.createdDate}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-200 rounded font-medium text-slate-600"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Expected Close Date</label>
              <input
                type="date"
                value={formState.expectedCloseDate}
                onChange={(e) => handleInputChange("expectedCloseDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Probability (%)</label>
              <input
                type="number"
                value={formState.probability}
                onChange={(e) => handleInputChange("probability", Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-amber-600 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Forecast Category</label>
              <select
                value={formState.forecastCategory}
                onChange={(e) => handleInputChange("forecastCategory", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-semibold text-emerald-700 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Pipeline">Pipeline</option>
                <option value="Best Case">Best Case</option>
                <option value="Commit">Commit</option>
                <option value="Omitted">Omitted</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold text-xs mb-1">Description / Scope Summary</label>
            <textarea
              rows={2}
              value={formState.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left & Center Columns: Cards 2 to 10 */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Grid Row 1: Stage Progress & Opportunity Value */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 2: Stage Progress (Pipeline Stepper) */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          2. Stage Progress
                        </h3>
                        <button
                          onClick={() => setIsChangeStageOpen(true)}
                          className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                        >
                          Change Stage
                        </button>
                      </div>

                      <div className="space-y-2 text-xs">
                        {STAGES_PIPELINE.map((stg, idx) => (
                          <div key={idx} className="flex items-center justify-between py-0.5">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "h-3.5 w-3.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white",
                                  stg.status === "Completed"
                                    ? "bg-emerald-500"
                                    : stg.status === "In Progress"
                                    ? "bg-blue-600 animate-pulse"
                                    : "bg-slate-300"
                                )}
                              >
                                {stg.status === "Completed" ? "✓" : idx + 1}
                              </div>
                              <span className={cn("font-medium", stg.status === "In Progress" ? "font-bold text-blue-700" : "text-slate-700")}>
                                {stg.stage}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "px-2 py-0.5 text-[10px] font-semibold rounded border",
                                  stg.status === "Completed"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : stg.status === "In Progress"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-slate-100 text-slate-500 border-slate-200"
                                )}
                              >
                                {stg.status}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono w-16 text-right">{stg.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card 3: Opportunity Value */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          3. Opportunity Value
                        </h3>
                        <button onClick={() => showNotification("Viewing Value Details...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View Value Details
                        </button>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Product Value</span>
                          <span className="font-semibold text-slate-800">₹ {(formState.productValue).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Service Value</span>
                          <span className="font-semibold text-slate-800">₹ {(formState.serviceValue).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Installation Value</span>
                          <span className="font-semibold text-slate-800">₹ {(formState.installationValue).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">AMC Value (1 Year)</span>
                          <span className="font-semibold text-slate-800">₹ {(formState.amcValue).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-200 pt-1">
                          <span className="text-slate-600 font-semibold">Gross Opportunity Value</span>
                          <span className="font-bold text-slate-900">₹ {(formState.grossValue).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Discount</span>
                          <span className="font-semibold text-rose-600">- ₹ {(formState.discountValue).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-200 pt-1">
                          <span className="text-slate-800 font-bold">Net Opportunity Value</span>
                          <span className="font-extrabold text-primary text-sm">₹ {(formState.netOpportunityValue).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center justify-between bg-emerald-50 p-1.5 rounded border border-emerald-200">
                          <span className="text-emerald-800 font-bold">Expected Revenue ({formState.probability}%)</span>
                          <span className="font-bold text-emerald-700">₹ {(formState.expectedRevenue).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 2: Contacts Involved & Qualification Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 4: Contacts Involved */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          4. Contacts Involved
                        </h3>
                        <button onClick={() => showNotification("Viewing All Contacts...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View All Contacts
                        </button>
                      </div>

                      <div className="w-full">
                        <table className="w-full text-left text-xs border-collapse table-fixed">
                          <thead>
                            <tr className="text-slate-500 text-[11px] font-semibold border-b border-slate-200">
                              <th className="py-1 px-1 w-[38%]">Contact</th>
                              <th className="py-1 px-1 w-[30%]">Decision Role</th>
                              <th className="py-1 px-1 w-[20%]">Influence</th>
                              <th className="py-1 px-1 w-[12%] text-center">Primary</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {CONTACTS_MAPPED.map((c, idx) => (
                              <tr key={idx} className="hover:bg-slate-100/60 transition-colors">
                                <td className="py-1.5 px-1">
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-800 text-xs truncate leading-tight">{c.name}</div>
                                    <div className="text-[10px] text-slate-500 truncate leading-tight">{c.role}</div>
                                  </div>
                                </td>
                                <td className="py-1.5 px-1">
                                  <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium truncate max-w-full">
                                    {c.decisionRole}
                                  </span>
                                </td>
                                <td className="py-1.5 px-1 text-amber-500 text-xs">
                                  {"★".repeat(c.influence)}
                                  <span className="text-slate-300">{"★".repeat(5 - c.influence)}</span>
                                </td>
                                <td className="py-1.5 px-1 text-center">
                                  {c.primary ? (
                                    <span className="inline-flex items-center justify-center h-4 px-1.5 bg-blue-50 border border-blue-200 text-primary text-[9px] font-bold rounded-full">
                                      Primary
                                    </span>
                                  ) : (
                                    <span className="text-slate-300 text-xs">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Card 5: Qualification Summary */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          5. Qualification Summary
                        </h3>
                        <button onClick={() => showNotification("Viewing Qualification Details...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View Qualification Details
                        </button>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {[
                          { label: "Need", val: formState.needRating, status: "High" },
                          { label: "Authority", val: formState.authorityRating, status: "High" },
                          { label: "Budget", val: formState.budgetRating, status: "Medium" },
                          { label: "Timeline", val: formState.timelineRating, status: "High" },
                          { label: "Strategic Fit", val: formState.strategicFitRating, status: "High" },
                          { label: "Technical Fit", val: formState.technicalFitRating, status: "High" },
                          { label: "Commercial Fit", val: formState.commercialFitRating, status: "High" },
                        ].map((q, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">{q.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-amber-500 font-bold">{"★".repeat(q.val)}</span>
                              <span className="text-[10px] font-semibold text-slate-500 w-12 text-right">{q.status}</span>
                            </div>
                          </div>
                        ))}

                        <div className="flex items-center justify-between border-t border-slate-200 pt-2 mt-2">
                          <div>
                            <span className="font-bold text-slate-800 block">Qualification Score</span>
                            <span className="font-extrabold text-emerald-600 text-sm font-mono">{formState.qualificationScore}%</span>
                          </div>
                          <div className="relative inline-flex items-center justify-center shrink-0">
                            <svg width="36" height="36" className="transform -rotate-90">
                              <circle cx="18" cy="18" r="13" stroke="currentColor" strokeWidth="2.5" className="text-emerald-100" fill="transparent" />
                              <circle
                                cx="18"
                                cy="18"
                                r="13"
                                stroke="#10b981"
                                strokeWidth="2.5"
                                strokeDasharray={2 * Math.PI * 13}
                                strokeDashoffset={2 * Math.PI * 13 * (1 - (Number(formState.qualificationScore) || 85) / 100)}
                                strokeLinecap="round"
                                fill="transparent"
                              />
                            </svg>
                            <span className="absolute text-[8px] font-bold font-mono text-emerald-700">{formState.qualificationScore}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Qualification Status</span>
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded border border-emerald-200">
                            {formState.qualificationStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 3: Top Competitors & Next Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 6: Top Competitors */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          6. Top Competitors
                        </h3>
                        <button onClick={() => showNotification("Viewing Competition Analysis...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View Competition Analysis
                        </button>
                      </div>

                      <div className="w-full">
                        <table className="w-full text-left text-xs border-collapse table-fixed">
                          <thead>
                            <tr className="text-slate-500 text-[11px] font-semibold border-b border-slate-200">
                              <th className="py-1 px-1 w-[34%]">Competitor</th>
                              <th className="py-1 px-1 w-[24%]">Price (INR)</th>
                              <th className="py-1 px-1 w-[24%]">Strength</th>
                              <th className="py-1 px-1 w-[18%] text-right">Position</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {COMPETITORS_DATA.map((comp, idx) => (
                              <tr key={idx} className="hover:bg-slate-100/60 transition-colors">
                                <td className="py-1.5 px-1">
                                  <div className="font-bold text-slate-800 text-xs truncate leading-tight">{comp.competitor}</div>
                                  <div className="text-[10px] text-slate-500 truncate leading-tight">{comp.product}</div>
                                </td>
                                <td className="py-1.5 px-1 font-mono text-xs text-slate-700 font-semibold truncate">
                                  {comp.price}
                                </td>
                                <td className="py-1.5 px-1 text-slate-600 text-xs truncate">
                                  {comp.strength}
                                </td>
                                <td className="py-1.5 px-1 text-right">
                                  <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full inline-block", comp.position === "Strong" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200")}>
                                    {comp.position}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Card 7 & 8: Next Steps & Risk / Strategy */}
                    <div className="space-y-6">
                      {/* Card 7: Next Steps */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            7. Next Steps
                          </h3>
                          <button onClick={() => showNotification("Viewing All Follow-ups...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                            View All Follow-ups
                          </button>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Next Action</label>
                            <input
                              type="text"
                              value={formState.nextAction}
                              onChange={(e) => handleInputChange("nextAction", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-medium"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Next Action Date</label>
                              <input
                                type="text"
                                value={formState.nextActionDate}
                                onChange={(e) => handleInputChange("nextActionDate", e.target.value)}
                                className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Priority</label>
                              <select
                                value={formState.nextActionPriority}
                                onChange={(e) => handleInputChange("nextActionPriority", e.target.value as any)}
                                className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-bold text-rose-600"
                              >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card 8: Risk & Strategy */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            8. Risk & Strategy
                          </h3>
                          <button onClick={() => showNotification("Viewing Risk Details...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                            View Risk Details
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Competitor Pricing Risk</span>
                          <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            12 ({formState.riskSeverity})
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold">Win Strategy:</span>
                          <p className="font-medium text-slate-800 bg-white p-1.5 border border-slate-200 rounded mt-0.5">
                            {formState.winStrategy}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 4: Recent Activities & Win / Loss Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 9: Recent Activities Table (2 Cols) */}
                    <div className="md:col-span-2 bg-white rounded-lg border border-slate-200 p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          9. Recent Activities
                        </h3>
                        <button
                          onClick={() => setIsActivityModalOpen(true)}
                          className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" /> Log Activity
                        </button>
                      </div>

                      <div className="w-full">
                        <table className="w-full text-left text-xs border-collapse table-fixed">
                          <thead>
                            <tr className="bg-slate-50 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
                              <th className="py-2 px-2.5 w-[30%]">Date & Type</th>
                              <th className="py-2 px-2.5 w-[44%]">Subject & Next Action</th>
                              <th className="py-2 px-2.5 w-[26%] text-right">Outcome</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {RECENT_ACTIVITIES.map((act) => (
                              <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-2.5 px-2.5">
                                  <div className="font-bold text-slate-800 text-xs leading-tight">{act.type}</div>
                                  <div className="text-slate-500 font-mono text-[10px] truncate leading-tight mt-0.5">{act.time}</div>
                                </td>
                                <td className="py-2.5 px-2.5">
                                  <div className="font-bold text-slate-900 text-xs truncate leading-tight">{act.subject}</div>
                                  <div className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                                    Next: <span className="font-medium text-slate-700">{act.nextAction}</span> ({act.nextActionDate})
                                  </div>
                                </td>
                                <td className="py-2.5 px-2.5 text-right">
                                  <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full border shadow-2xs whitespace-nowrap inline-flex items-center justify-center gap-1", act.outcomeColor)}>
                                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                                    <span>{act.outcome}</span>
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Card 10: Win / Loss Summary (1 Col) */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs flex flex-col justify-between">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          10. Win / Loss Summary
                        </h3>
                        <button onClick={() => showNotification("Viewing Opportunity Analytics...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View Analytics
                        </button>
                      </div>

                      <div className="flex items-center gap-4 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                        <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                          <Trophy className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-500">Win Rate</div>
                          <div className="text-2xl font-extrabold text-emerald-700">64%</div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Closed Won Deals</span>
                          <span className="font-bold text-emerald-700">14</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Closed Lost Deals</span>
                          <span className="font-bold text-rose-600">8</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Open Opportunities</span>
                          <span className="font-bold text-blue-700">23</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-2 font-semibold">
                          <span className="text-slate-800">Total Pipeline Value</span>
                          <span className="font-extrabold text-primary">₹ 2,48,50,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Sidebar Widgets (Matching Mockup Image) */}
                <div className="space-y-6">
                  {/* Pipeline & Forecast Meter Widget */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">
                      Pipeline & Forecast
                    </h3>

                    {/* Probability Gauge Meter */}
                    <div className="relative flex flex-col items-center justify-center py-2">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                          {/* Background Track */}
                          <circle
                            cx="70"
                            cy="70"
                            r="56"
                            className="text-slate-100"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                          />
                          {/* Probability Segment */}
                          <circle
                            cx="70"
                            cy="70"
                            r="56"
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeDasharray={2 * Math.PI * 56}
                            strokeDashoffset={2 * Math.PI * 56 * (1 - (formState.probability || 75) / 100)}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-2xl font-extrabold text-slate-900 font-mono">{formState.probability}%</span>
                          <span className="text-[11px] font-semibold text-slate-400">Probability</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Opportunity Value</span>
                        <span className="font-bold text-slate-900">₹ {(formState.netOpportunityValue).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Weighted Value</span>
                        <span className="font-extrabold text-emerald-700">₹ {(formState.expectedRevenue).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Forecast Category</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded border border-emerald-200">
                          {formState.forecastCategory}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Forecast Month</span>
                        <span className="font-semibold text-slate-800">Jun 2024</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Forecast Year</span>
                        <span className="font-semibold text-slate-800">FY 2024-25</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Dates Widget */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Key Dates
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Stage Entered On</span>
                        <span className="font-semibold text-slate-700">{formState.stageEnteredOn}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Last Activity On</span>
                        <span className="font-semibold text-slate-700">{formState.lastActivityOn}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Next Follow-up</span>
                        <span className="font-semibold text-blue-700">{formState.nextFollowUpDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Proposal Due</span>
                        <span className="font-semibold text-amber-700">{formState.proposalDueDate}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-800 font-bold">Expected Close</span>
                        <span className="font-bold text-rose-600">{formState.expectedCloseDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Panel */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Quick Actions
                    </h3>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setIsActivityModalOpen(true)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Phone className="h-4 w-4 text-primary" />
                        <span>Add Activity</span>
                      </button>
                      <button
                        onClick={() => showNotification("Meeting invite generated for " + formState.accountName)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span>Schedule</span>
                      </button>
                      <button
                        onClick={() => showNotification("Email drafted to " + formState.accountName)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Mail className="h-4 w-4 text-emerald-600" />
                        <span>Send Email</span>
                      </button>
                      <button
                        onClick={() => showNotification("Draft proposal QT-2024-0091 created from opportunity deal.")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span>Proposal</span>
                      </button>
                      <button
                        onClick={() => showNotification("Note added to deal timeline.")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <CheckSquare className="h-4 w-4 text-amber-600" />
                        <span>Add Note</span>
                      </button>
                      <button
                        onClick={() => showNotification("Document attachment window ready.")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Paperclip className="h-4 w-4 text-indigo-600" />
                        <span>Upload</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setIsConvertOrderOpen(true)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Convert to Sales Order</span>
                    </button>
                  </div>
                </div>
              </div>

        {/* MODAL 1: NEW OPPORTUNITY */}
        {isNewOppOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900">Create New Opportunity Master</h3>
                <button onClick={() => setIsNewOppOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Opportunity Name *</label>
                  <input id="new-opp-name" type="text" placeholder="e.g. SCADA Upgrade Line 2" className="w-full h-8 px-3 border rounded text-xs" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Name *</label>
                  <input id="new-opp-account" type="text" placeholder="e.g. Acme Automation Pvt. Ltd." className="w-full h-8 px-3 border rounded text-xs" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Value (INR) *</label>
                  <input id="new-opp-value" type="number" placeholder="5000000" className="w-full h-8 px-3 border rounded text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsNewOppOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const name = (document.getElementById("new-opp-name") as HTMLInputElement)?.value || "New Opportunity";
                    const acc = (document.getElementById("new-opp-account") as HTMLInputElement)?.value || "Account";
                    const val = Number((document.getElementById("new-opp-value") as HTMLInputElement)?.value) || 2500000;
                    const newObj: OpportunityRecord = {
                      ...INITIAL_OPPORTUNITIES[0],
                      id: `OPP-00${Math.floor(Math.random() * 900 + 100)}`,
                      opportunityNumber: `OPP-2024-000${Math.floor(Math.random() * 900 + 100)}`,
                      opportunityName: name,
                      accountName: acc,
                      netOpportunityValue: val,
                      grossValue: val,
                      expectedRevenue: Math.round(val * 0.6),
                    };
                    setOpportunities((prev) => [newObj, ...prev]);
                    setSelectedOppId(newObj.id);
                    setFormState(newObj);
                    setIsNewOppOpen(false);
                  }}
                  className="px-4 py-1.5 text-xs bg-primary text-white font-bold rounded shadow-xs"
                >
                  Create Opportunity
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: CONVERT TO SALES ORDER */}
        {isConvertOrderOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-emerald-600" />
                  <span>Convert Opportunity to Sales Order</span>
                </h3>
                <button onClick={() => setIsConvertOrderOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Converting opportunity <strong className="text-slate-900">{formState.opportunityName}</strong> will mark it as <strong>Closed Won</strong> and generate a Sales Order draft.
                </p>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Final Agreed Order Value (INR)</label>
                  <input type="text" defaultValue={`₹ ${formState.netOpportunityValue.toLocaleString("en-IN")}`} className="w-full h-8 border rounded text-xs px-2 font-bold text-emerald-700" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsConvertOrderOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleInputChange("stage", "Closed Won");
                    handleInputChange("status", "Closed Won");
                    setIsConvertOrderOpen(false);
                    setFormState((prev) => ({ ...prev, stage: "Closed Won", probability: 100 }));
                    showNotification(`Opportunity ${formState.opportunityNumber} converted to Closed Won Sales Order!`);
                  }}
                  className="px-4 py-1.5 text-xs bg-emerald-600 text-white font-bold rounded shadow-xs"
                >
                  Confirm Conversion
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
