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

export const Route = createFileRoute("/management/crm-management/lead-management")({
  head: () => ({
    meta: [
      { title: "Lead Management Form · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content: "Lead Management Form - Capture, qualify, score, assign, nurture, convert and track prospective customers from lead creation through conversion.",
      },
    ],
  }),
  component: LeadManagementPage,
});

// --- Mock Data & Enums ---

export type LeadStatus = "New" | "Assigned" | "Contacted" | "Qualified" | "Nurturing" | "Converted" | "Not Qualified" | "Lost";
export type LeadRating = "Hot" | "Warm" | "Cold";
export type LeadPriority = "Low" | "Medium" | "High" | "Critical";

export interface LeadRecord {
  id: string;
  leadNumber: string;
  leadType: "Individual" | "Business" | "Institutional";
  leadName: string;
  status: LeadStatus;
  rating: LeadRating;
  priority: LeadPriority;
  owner: { name: string; avatar: string; email: string };
  businessUnit: string;
  branch: string;
  department: string;
  createdDate: string;
  expectedConversionDate: string;
  description: string;
  // Source
  sourceId: string;
  leadSource: string;
  sourceCampaign: string;
  sourceChannel: string;
  sourceMedium: string;
  sourceDetail: string;
  referralPartner: string;
  referralCode: string;
  landingPage: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  // Contact
  contactPerson: string;
  designation: string;
  contactDepartment: string;
  email: string;
  alternateEmail: string;
  mobile: string;
  alternateMobile: string;
  whatsApp: string;
  telephone: string;
  website: string;
  preferredContactMethod: string;
  preferredLanguage: string;
  bestContactTime: string;
  // Organization
  orgId: string;
  orgName: string;
  legalName: string;
  industry: string;
  industrySegment: string;
  companySize: string;
  annualRevenue: string;
  employeeCount: number;
  gstin: string;
  pan: string;
  cin: string;
  customerType: string;
  businessModel: string;
  // Address
  addressType: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  territory: string;
  region: string;
  // Requirement
  requirementType: string;
  productService: string;
  quantity: string;
  budget: string;
  expectedPurchaseDate: string;
  requirementDescription: string;
  application: string;
  technicalRequirement: string;
  commercialRequirement: string;
  competitor: string;
  // Qualification (BANT)
  needRating: number; // 1-5
  authorityRating: number;
  budgetRating: number;
  timelineRating: number;
  fitRating: number;
  intentRating: number;
  qualificationScore: number; // percentage
  qualificationRemarks: string;
  qualifiedBy: string;
  qualificationDate: string;
  // Scoring
  demographicScore: number;
  firmographicScore: number;
  behaviourScore: number;
  engagementScore: number;
  intentScore: number;
  sourceScore: number;
  totalScore: number;
  scoreGrade: string;
  probability: string;
  // Next Step & Activity
  nextAction: string;
  nextActionDate: string;
  nextActionPriority: string;
  nextActionAssignedTo: string;
}

const INITIAL_LEADS: LeadRecord[] = [
  {
    id: "LEAD-0000578",
    leadNumber: "L-2024-000578",
    leadType: "Business",
    leadName: "Acme Automation Pvt. Ltd.",
    status: "Contacted",
    rating: "Warm",
    priority: "High",
    owner: { name: "Rahul Sharma", avatar: "RS", email: "rahul.sharma@magnertia.com" },
    businessUnit: "Industrial Solutions",
    branch: "Mumbai Branch",
    department: "Sales Department",
    createdDate: "15 Apr 2024 09:35 AM",
    expectedConversionDate: "2024-06-30",
    description: "Interested in our Industrial automation solutions for their new manufacturing plant. Requirement includes PLC systems, SCADA and HMI solutions.",
    // Source
    sourceId: "SRC-1092",
    leadSource: "Website",
    sourceCampaign: "Q2 Digital Campaign",
    sourceChannel: "Organic Search",
    sourceMedium: "Google",
    sourceDetail: "Product Enquiry Form",
    referralPartner: "-",
    referralCode: "-",
    landingPage: "/industrial-automation",
    utmSource: "google",
    utmMedium: "organic",
    utmCampaign: "q2-campaign",
    // Contact
    contactPerson: "Mr. Ankit Verma",
    designation: "Plant Head",
    contactDepartment: "Operations & Engineering",
    email: "ankit.verma@acmeauto.com",
    alternateEmail: "ankit.v@acmeauto.com",
    mobile: "+91 98765 43210",
    alternateMobile: "+91 98765 43211",
    whatsApp: "+91 98765 43210",
    telephone: "022-49876500",
    website: "www.acmeauto.com",
    preferredContactMethod: "Email",
    preferredLanguage: "English",
    bestContactTime: "10:00 AM - 12:00 PM",
    // Organization
    orgId: "ORG-4402",
    orgName: "Acme Automation Pvt. Ltd.",
    legalName: "Acme Automation Private Limited",
    industry: "Manufacturing",
    industrySegment: "Industrial Equipment",
    companySize: "201 - 500 Employees",
    annualRevenue: "₹100 Cr - ₹500 Cr",
    employeeCount: 350,
    gstin: "27AABCA1234B1Z5",
    pan: "AABCA1234B",
    cin: "U29100MH2012PTC234567",
    customerType: "Prospect",
    businessModel: "B2B Manufacturing",
    // Address
    addressType: "Billing",
    addressLine1: "Plot No. 45, MIDC Industrial Area, Thane West",
    addressLine2: "Near Jupiter Hospital",
    city: "Thane",
    state: "Maharashtra",
    country: "India",
    postalCode: "400601",
    territory: "Western Region",
    region: "India West",
    // Requirement
    requirementType: "New Installation",
    productService: "Industrial Automation Solution",
    quantity: "1 Lot",
    budget: "₹75,00,000",
    expectedPurchaseDate: "2024-06-30",
    requirementDescription: "Full turnkey automation setup for Line 3 assembly. Needs PLC panels, SCADA software dashboard, safety sensors and HMI interfaces.",
    application: "Manufacturing Plant Automation",
    technicalRequirement: "IEC 61131-3 compliance, Redundant Ethernet IP communication, Siemens S7-1500 PLC integration.",
    commercialRequirement: "Standard payment terms: 30% advance, 60% on delivery, 10% post commissioning.",
    competitor: "Siemens India / Schneider Electric",
    // Qualification (BANT)
    needRating: 5,
    authorityRating: 4,
    budgetRating: 4,
    timelineRating: 4,
    fitRating: 5,
    intentRating: 4,
    qualificationScore: 72,
    qualificationRemarks: "High intent lead with confirmed budget approval for Q2. Decision maker identified (Plant Head + VP Engineering).",
    qualifiedBy: "Rahul Sharma",
    qualificationDate: "18 Apr 2024 04:30 PM",
    // Scoring
    demographicScore: 18,
    firmographicScore: 24,
    behaviourScore: 12,
    engagementScore: 10,
    intentScore: 8,
    sourceScore: 0,
    totalScore: 72,
    scoreGrade: "A-",
    probability: "65%",
    // Next Step
    nextAction: "Product Demo & Technical Presentation",
    nextActionDate: "22 Apr 2024 11:00 AM",
    nextActionPriority: "High",
    nextActionAssignedTo: "Rahul Sharma",
  },
  {
    id: "LEAD-0000579",
    leadNumber: "L-2024-000579",
    leadType: "Business",
    leadName: "Zenith Robotics Corp",
    status: "Qualified",
    rating: "Hot",
    priority: "Critical",
    owner: { name: "Priya Nair", avatar: "PN", email: "priya.nair@magnertia.com" },
    businessUnit: "Robotics & AI",
    branch: "Bengaluru Branch",
    department: "Sales Department",
    createdDate: "16 Apr 2024 10:15 AM",
    expectedConversionDate: "2024-05-15",
    description: "Expansion of robotic arm assembly line with custom gripper tooling.",
    sourceId: "SRC-1093",
    leadSource: "Exhibition",
    sourceCampaign: "Automation Expo 2024",
    sourceChannel: "Direct Event",
    sourceMedium: "Trade Show",
    sourceDetail: "Booth Enquiry #42",
    referralPartner: "-",
    referralCode: "-",
    landingPage: "-",
    utmSource: "event",
    utmMedium: "offline",
    utmCampaign: "expo-2024",
    contactPerson: "Dr. Vikram Seth",
    designation: "CTO",
    contactDepartment: "R&D Robotics",
    email: "vikram.seth@zenithrobotics.com",
    alternateEmail: "vseth@zenithrobotics.com",
    mobile: "+91 99887 76655",
    alternateMobile: "+91 99887 76656",
    whatsApp: "+91 99887 76655",
    telephone: "080-28394000",
    website: "www.zenithrobotics.com",
    preferredContactMethod: "WhatsApp / Meeting",
    preferredLanguage: "English",
    bestContactTime: "02:00 PM - 05:00 PM",
    orgId: "ORG-4403",
    orgName: "Zenith Robotics Corp",
    legalName: "Zenith Robotics Systems Private Limited",
    industry: "Robotics & Automation",
    industrySegment: "Warehouse Automation",
    companySize: "501 - 1000 Employees",
    annualRevenue: "₹500 Cr - ₹1000 Cr",
    employeeCount: 650,
    gstin: "29AABCZ9876C1Z2",
    pan: "AABCZ9876C",
    cin: "U72200KA2015PTC087654",
    customerType: "Key Account Prospect",
    businessModel: "OEM Supplier",
    addressType: "Registered Office",
    addressLine1: "Electronics City Phase 1",
    addressLine2: "Hosur Main Road",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    postalCode: "560100",
    territory: "Southern Region",
    region: "India South",
    requirementType: "Expansion Project",
    productService: "6-Axis Robotic Integration Unit",
    quantity: "4 Units",
    budget: "₹1,80,00,000",
    expectedPurchaseDate: "2024-05-15",
    requirementDescription: "Supply of 4 high-payload 6-axis robotic arms integrated with vision feedback.",
    application: "Automated Material Handling",
    technicalRequirement: "Sub-millimeter repeatability, IP67 enclosure, ROS 2 SDK integration.",
    commercialRequirement: "100% L/C payment structure.",
    competitor: "ABB Robotics / KUKA",
    needRating: 5,
    authorityRating: 5,
    budgetRating: 5,
    timelineRating: 5,
    fitRating: 5,
    intentRating: 5,
    qualificationScore: 95,
    qualificationRemarks: "Immediate requirement with budget allocated. Board approval completed.",
    qualifiedBy: "Priya Nair",
    qualificationDate: "17 Apr 2024 02:00 PM",
    demographicScore: 20,
    firmographicScore: 25,
    behaviourScore: 20,
    engagementScore: 15,
    intentScore: 15,
    sourceScore: 0,
    totalScore: 95,
    scoreGrade: "A+",
    probability: "85%",
    nextAction: "Commercial Proposal Submission & Demo",
    nextActionDate: "20 Apr 2024 03:00 PM",
    nextActionPriority: "Critical",
    nextActionAssignedTo: "Priya Nair",
  },
];

const RECENT_ACTIVITIES = [
  {
    id: "ACT-001",
    time: "16 Apr 2024 11:15 AM",
    type: "Phone Call",
    subject: "Initial Discussion with Ankit Verma",
    outcome: "Positive",
    outcomeColor: "bg-emerald-100 text-emerald-700 border-emerald-300",
    nextAction: "Send Company Profile",
    nextActionDate: "18 Apr 2024",
    assignedTo: "Rahul Sharma",
    status: "Completed",
  },
  {
    id: "ACT-002",
    time: "18 Apr 2024 02:30 PM",
    type: "Email",
    subject: "Company Profile Shared",
    outcome: "Information Sent",
    outcomeColor: "bg-blue-100 text-blue-700 border-blue-300",
    nextAction: "Schedule Demo",
    nextActionDate: "22 Apr 2024",
    assignedTo: "Rahul Sharma",
    status: "Completed",
  },
  {
    id: "ACT-003",
    time: "18 Apr 2024 04:30 PM",
    type: "Note",
    subject: "Discussed Requirement Details",
    outcome: "Requirement Understood",
    outcomeColor: "bg-purple-100 text-purple-700 border-purple-300",
    nextAction: "Prepare Demo Plan",
    nextActionDate: "20 Apr 2024",
    assignedTo: "Rahul Sharma",
    status: "Completed",
  },
];

export function LeadManagementPage() {
  const [leads, setLeads] = useState<LeadRecord[]>(INITIAL_LEADS);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("LEAD-0000578");
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Dialog States
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Active Lead Object
  const currentLead = useMemo(() => {
    return leads.find((l) => l.id === selectedLeadId) || leads[0];
  }, [leads, selectedLeadId]);

  // Form State initialized from current Lead
  const [formState, setFormState] = useState<LeadRecord>(currentLead);

  // Update formState when selected lead changes
  const handleSelectLead = (id: string) => {
    setSelectedLeadId(id);
    const target = leads.find((l) => l.id === id);
    if (target) setFormState(target);
  };

  const handleInputChange = (field: keyof LeadRecord, value: any) => {
    setFormState((prev) => {
      const updated = { ...prev, [field]: value };
      // Recalculate BANT score automatically if rating ratings change
      if (
        [
          "needRating",
          "authorityRating",
          "budgetRating",
          "timelineRating",
          "fitRating",
          "intentRating",
        ].includes(field)
      ) {
        const sum =
          (updated.needRating || 0) +
          (updated.authorityRating || 0) +
          (updated.budgetRating || 0) +
          (updated.timelineRating || 0) +
          (updated.fitRating || 0) +
          (updated.intentRating || 0);
        const score = Math.round((sum / 30) * 100);
        updated.qualificationScore = score;
        updated.totalScore = score;
        updated.scoreGrade = score >= 90 ? "A+" : score >= 75 ? "A" : score >= 60 ? "A-" : score >= 40 ? "B" : "C";
      }
      return updated;
    });
  };

  const handleSaveLead = () => {
    setLeads((prev) => prev.map((l) => (l.id === formState.id ? formState : l)));
    alert(`Lead ${formState.leadNumber} updated successfully!`);
  };

  // KPI Analytics Computations
  const totalLeadsCount = leads.length;
  const qualifiedCount = leads.filter((l) => l.status === "Qualified").length;
  const hotLeadsCount = leads.filter((l) => l.rating === "Hot").length;
  const warmLeadsCount = leads.filter((l) => l.rating === "Warm").length;

  const leadSourceChartData = [
    { name: "Website", value: 45, color: "#2563eb" },
    { name: "Exhibition", value: 25, color: "#16a34a" },
    { name: "Referral", value: 15, color: "#d97706" },
    { name: "Social Media", value: 10, color: "#9333ea" },
    { name: "Direct Enquiry", value: 5, color: "#0891b2" },
  ];

  const leadStatusChartData = [
    { name: "New", value: 12 },
    { name: "Assigned", value: 18 },
    { name: "Contacted", value: 24 },
    { name: "Qualified", value: 30 },
    { name: "Nurturing", value: 10 },
    { name: "Converted", value: 8 },
  ];

  return (
    <AppShell
      title="Lead Management"
      breadcrumb="Management > CRM Management > Lead Management"
      description="The Lead Management Form is the central CRM record for capturing, qualifying, nurturing, assigning, converting, and tracking prospective customers from lead creation through conversion or closure."
      tabs={<CrmManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen text-slate-800 space-y-6">
        {/* Lead Master Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Lead Status & Number Badges */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900">Lead Master Form</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {formState.leadNumber}
              </span>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                  formState.status === "Qualified"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : formState.status === "Contacted"
                    ? "bg-blue-50 text-blue-700 border-blue-300"
                    : "bg-amber-50 text-amber-700 border-amber-300"
                )}
              >
                {formState.status}
              </span>
            </div>

            {/* Quick Actions Header Buttons & Lead Selector */}
            <div className="flex items-center flex-wrap gap-2">
              {/* Select Existing Lead */}
              <div className="flex items-center gap-2 mr-2">
                <label className="text-xs font-semibold text-slate-600">Select Lead:</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => handleSelectLead(e.target.value)}
                  className="h-8 text-xs bg-slate-50 border border-slate-300 rounded-md px-2 font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.leadNumber} - {l.leadName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsNewLeadOpen(true)}
                className="h-8 px-3 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md border border-primary/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Lead</span>
              </button>

              <button
                onClick={() => setIsConvertModalOpen(true)}
                className="h-8 px-3 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Convert Lead</span>
              </button>

              <button
                onClick={handleSaveLead}
                className="h-8 px-4 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>

              <button
                onClick={() => alert("Saved as new revision!")}
                className="h-8 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Save & New</span>
              </button>

              {/* User Avatar Info */}
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1">
                <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs shadow-2xs">
                  RS
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 leading-none">Rahul Sharma</div>
                  <div className="text-[10px] text-slate-500">Sales Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace Body Layout */}
        <div className="p-4 lg:p-6 space-y-6 max-w-[1700px] w-full mx-auto">
          {/* Section 1: Lead Master Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">1. Lead Master</h2>
              </div>
              <span className="text-xs font-medium text-slate-400">MAICW Controlled CRM Record</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Lead ID</label>
                <input
                  type="text"
                  disabled
                  value={formState.id}
                  className="w-full h-8 px-2.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Lead Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.leadNumber}
                  onChange={(e) => handleInputChange("leadNumber", e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Lead Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formState.leadType}
                  onChange={(e) => handleInputChange("leadType", e.target.value as any)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="Individual">Individual</option>
                  <option value="Business">Business</option>
                  <option value="Institutional">Institutional</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Lead Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.leadName}
                  onChange={(e) => handleInputChange("leadName", e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Lead Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formState.status}
                  onChange={(e) => handleInputChange("status", e.target.value as any)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Nurturing">Nurturing</option>
                  <option value="Converted">Converted</option>
                  <option value="Not Qualified">Not Qualified</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Lead Rating <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formState.rating}
                  onChange={(e) => handleInputChange("rating", e.target.value as any)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="Hot">🔥 Hot</option>
                  <option value="Warm">☀️ Warm</option>
                  <option value="Cold">❄️ Cold</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Lead Priority</label>
                <select
                  value={formState.priority}
                  onChange={(e) => handleInputChange("priority", e.target.value as any)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Lead Owner</label>
                <div className="flex items-center gap-2 h-8 px-2 bg-slate-50 border border-slate-300 rounded">
                  <div className="h-5 w-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                    {formState.owner.avatar}
                  </div>
                  <span className="font-medium text-slate-700 truncate">{formState.owner.name}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Business Unit</label>
                <input
                  type="text"
                  value={formState.businessUnit}
                  onChange={(e) => handleInputChange("businessUnit", e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Branch</label>
                <input
                  type="text"
                  value={formState.branch}
                  onChange={(e) => handleInputChange("branch", e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Department</label>
                <input
                  type="text"
                  value={formState.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Expected Conversion Date</label>
                <input
                  type="date"
                  value={formState.expectedConversionDate}
                  onChange={(e) => handleInputChange("expectedConversionDate", e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Description / Summary</label>
              <textarea
                rows={2}
                value={formState.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Form Sub-Tabs Header */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/70 p-1.5 overflow-x-auto scrollbar-none">
              {[
                { id: "overview", label: "Overview", icon: Layers },
                { id: "contact", label: "Contact & Company", icon: Building2 },
                { id: "requirement", label: "Requirement", icon: Target },
                { id: "qualification", label: "Qualification", icon: Award },
                { id: "activities", label: "Activities", icon: Activity },
                { id: "communication", label: "Communication", icon: Mail },
                { id: "documents", label: "Documents", icon: Paperclip },
                { id: "notes", label: "Notes & Follow-up", icon: CheckSquare },
                { id: "audit", label: "Audit Trail", icon: ShieldCheck },
                { id: "analytics", label: "Analytics Dashboard", icon: BarChart3 },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                      active
                        ? "bg-white text-primary shadow-2xs border border-slate-200/80"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    <Icon className={cn("h-3.5 w-3.5", active ? "text-primary" : "text-slate-400")} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT AREA */}
            <div className="p-5">
              {/* TAB 1: OVERVIEW (MATCHES UI MOCKUP SCREENSHOT) */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left & Middle Column: Grid of Lead Cards */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Grid Row 1: Lead Source & Contact Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Card 2: Lead Source */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            2. Lead Source
                          </h3>
                          <span className="text-[10px] text-slate-400 font-mono">{formState.sourceId}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Lead Source *</label>
                            <select
                              value={formState.leadSource}
                              onChange={(e) => handleInputChange("leadSource", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                            >
                              <option value="Website">Website</option>
                              <option value="Referral">Referral</option>
                              <option value="Social Media">Social Media</option>
                              <option value="Exhibition">Exhibition</option>
                              <option value="Trade Show">Trade Show</option>
                              <option value="Email Campaign">Email Campaign</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Source Channel</label>
                            <input
                              type="text"
                              value={formState.sourceChannel}
                              onChange={(e) => handleInputChange("sourceChannel", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Source Medium</label>
                            <input
                              type="text"
                              value={formState.sourceMedium}
                              onChange={(e) => handleInputChange("sourceMedium", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Source Campaign</label>
                            <input
                              type="text"
                              value={formState.sourceCampaign}
                              onChange={(e) => handleInputChange("sourceCampaign", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Landing Page</label>
                            <input
                              type="text"
                              value={formState.landingPage}
                              onChange={(e) => handleInputChange("landingPage", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Referral Partner</label>
                            <input
                              type="text"
                              value={formState.referralPartner}
                              onChange={(e) => handleInputChange("referralPartner", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Lead Contact Details */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            3. Lead Contact Details
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Contact Person *</label>
                            <input
                              type="text"
                              value={formState.contactPerson}
                              onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Designation</label>
                            <input
                              type="text"
                              value={formState.designation}
                              onChange={(e) => handleInputChange("designation", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Email *</label>
                            <input
                              type="email"
                              value={formState.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 text-primary font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Mobile *</label>
                            <input
                              type="text"
                              value={formState.mobile}
                              onChange={(e) => handleInputChange("mobile", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Preferred Contact Method</label>
                            <select
                              value={formState.preferredContactMethod}
                              onChange={(e) => handleInputChange("preferredContactMethod", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                            >
                              <option value="Email">Email</option>
                              <option value="Phone">Phone</option>
                              <option value="WhatsApp">WhatsApp</option>
                              <option value="Meeting">Meeting</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Best Contact Time</label>
                            <input
                              type="text"
                              value={formState.bestContactTime}
                              onChange={(e) => handleInputChange("bestContactTime", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grid Row 2: Organization / Company Details & Lead Requirement */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Card 4: Organization / Company Details */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            4. Organization / Company Details
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Organization Name *</label>
                            <input
                              type="text"
                              value={formState.orgName}
                              onChange={(e) => handleInputChange("orgName", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Industry *</label>
                            <input
                              type="text"
                              value={formState.industry}
                              onChange={(e) => handleInputChange("industry", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Company Size</label>
                            <input
                              type="text"
                              value={formState.companySize}
                              onChange={(e) => handleInputChange("companySize", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Annual Revenue Range</label>
                            <input
                              type="text"
                              value={formState.annualRevenue}
                              onChange={(e) => handleInputChange("annualRevenue", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">GSTIN</label>
                            <input
                              type="text"
                              value={formState.gstin}
                              onChange={(e) => handleInputChange("gstin", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">PAN</label>
                            <input
                              type="text"
                              value={formState.pan}
                              onChange={(e) => handleInputChange("pan", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card 5: Lead Requirement */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            5. Lead Requirement
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="col-span-2">
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Product / Service *</label>
                            <input
                              type="text"
                              value={formState.productService}
                              onChange={(e) => handleInputChange("productService", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-semibold text-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Quantity</label>
                            <input
                              type="text"
                              value={formState.quantity}
                              onChange={(e) => handleInputChange("quantity", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Budget</label>
                            <input
                              type="text"
                              value={formState.budget}
                              onChange={(e) => handleInputChange("budget", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-semibold text-emerald-700"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Application</label>
                            <input
                              type="text"
                              value={formState.application}
                              onChange={(e) => handleInputChange("application", e.target.value)}
                              className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grid Row 3: BANT Qualification & Next Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Card 6: Qualification Summary (BANT / FAINT) */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            6. Qualification Summary (BANT)
                          </h3>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Score: {formState.qualificationScore}/100
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">Need</span>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={cn("h-3 w-3 cursor-pointer", star <= formState.needRating ? "fill-amber-400 text-amber-400" : "text-slate-300")}
                                  onClick={() => handleInputChange("needRating", star)}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">Authority</span>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={cn("h-3 w-3 cursor-pointer", star <= formState.authorityRating ? "fill-amber-400 text-amber-400" : "text-slate-300")}
                                  onClick={() => handleInputChange("authorityRating", star)}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">Budget</span>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={cn("h-3 w-3 cursor-pointer", star <= formState.budgetRating ? "fill-amber-400 text-amber-400" : "text-slate-300")}
                                  onClick={() => handleInputChange("budgetRating", star)}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">Timeline</span>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={cn("h-3 w-3 cursor-pointer", star <= formState.timelineRating ? "fill-amber-400 text-amber-400" : "text-slate-300")}
                                  onClick={() => handleInputChange("timelineRating", star)}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">Business Fit</span>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={cn("h-3 w-3 cursor-pointer", star <= formState.fitRating ? "fill-amber-400 text-amber-400" : "text-slate-300")}
                                  onClick={() => handleInputChange("fitRating", star)}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">Purchase Intent</span>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={cn("h-3 w-3 cursor-pointer", star <= formState.intentRating ? "fill-amber-400 text-amber-400" : "text-slate-300")}
                                  onClick={() => handleInputChange("intentRating", star)}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card 7: Next Steps */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            7. Next Steps
                          </h3>
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
                              <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Assigned To</label>
                              <input
                                type="text"
                                value={formState.nextActionAssignedTo}
                                onChange={(e) => handleInputChange("nextActionAssignedTo", e.target.value)}
                                className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 8: Recent Activities Table */}
                    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          8. Recent Activities
                        </h3>
                        <button
                          onClick={() => setIsActivityModalOpen(true)}
                          className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" /> Log Activity
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                              <th className="py-2 px-3">Date & Time</th>
                              <th className="py-2 px-3">Activity Type</th>
                              <th className="py-2 px-3">Subject</th>
                              <th className="py-2 px-3">Outcome</th>
                              <th className="py-2 px-3">Next Action</th>
                              <th className="py-2 px-3">Assigned To</th>
                              <th className="py-2 px-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {RECENT_ACTIVITIES.map((act) => (
                              <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-2 px-3 text-slate-600 whitespace-nowrap">{act.time}</td>
                                <td className="py-2 px-3 font-semibold text-slate-800">{act.type}</td>
                                <td className="py-2 px-3 text-slate-700">{act.subject}</td>
                                <td className="py-2 px-3">
                                  <span className={cn("px-2 py-0.5 text-[11px] font-semibold rounded border", act.outcomeColor)}>
                                    {act.outcome}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-slate-700">{act.nextAction}</td>
                                <td className="py-2 px-3 text-slate-600">{act.assignedTo}</td>
                                <td className="py-2 px-3">
                                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                                    {act.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Sidebar Widgets (Matching Screenshot) */}
                  <div className="space-y-6">
                    {/* Lead Score & Qualification Gauge Widget */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">
                        Lead Score & Qualification
                      </h3>

                      {/* Semi-circular Meter */}
                      <div className="relative flex flex-col items-center justify-center pt-2 pb-1">
                        <div className="w-36 h-36 rounded-full border-8 border-slate-100 border-t-amber-500 border-r-emerald-500 border-b-emerald-500 flex flex-col items-center justify-center shadow-inner">
                          <span className="text-3xl font-extrabold text-slate-900">{formState.qualificationScore}</span>
                          <span className="text-xs font-semibold text-slate-400">/ 100</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Score Grade</span>
                          <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded">
                            {formState.scoreGrade}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Qualification Status</span>
                          <span className="px-2 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                            {formState.status === "Qualified" ? "Qualified" : formState.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Qualification Date</span>
                          <span className="font-semibold text-slate-700">{formState.qualificationDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Qualified By</span>
                          <span className="font-semibold text-slate-700">{formState.qualifiedBy}</span>
                        </div>
                      </div>
                    </div>

                    {/* Lead Lifecycle Stepper Timeline */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                        Lead Lifecycle Stage
                      </h3>

                      <div className="space-y-3 relative pl-4 border-l-2 border-slate-200">
                        {[
                          { stage: "Lead Created", time: "15 Apr 2024 09:35 AM", done: true },
                          { stage: "Assigned", time: "15 Apr 2024 09:40 AM", done: true },
                          { stage: "Contacted", time: "16 Apr 2024 11:15 AM", done: true },
                          { stage: "Qualified", time: "18 Apr 2024 04:30 PM", done: formState.status === "Qualified" },
                          { stage: "Nurturing", time: "-", done: false },
                          { stage: "Converted", time: "-", done: false },
                        ].map((step, idx) => (
                          <div key={idx} className="relative flex items-center justify-between text-xs">
                            <div
                              className={cn(
                                "absolute -left-[21px] h-3.5 w-3.5 rounded-full border-2 bg-white flex items-center justify-center",
                                step.done ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                              )}
                            >
                              {step.done && <CheckCircle2 className="h-3 w-3 text-white" />}
                            </div>
                            <span className={cn("font-semibold", step.done ? "text-slate-900" : "text-slate-400")}>
                              {step.stage}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{step.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                        Quick Actions
                      </h3>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setIsActivityModalOpen(true)}
                          className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-xs font-medium text-slate-700 transition-all cursor-pointer"
                        >
                          <Phone className="h-4 w-4 text-primary" />
                          <span>Add Activity</span>
                        </button>
                        <button
                          onClick={() => alert("Opening Email Composer...")}
                          className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-xs font-medium text-slate-700 transition-all cursor-pointer"
                        >
                          <Mail className="h-4 w-4 text-emerald-600" />
                          <span>Send Email</span>
                        </button>
                        <button
                          onClick={() => alert("Opening Note Editor...")}
                          className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-xs font-medium text-slate-700 transition-all cursor-pointer"
                        >
                          <FileText className="h-4 w-4 text-amber-600" />
                          <span>Add Note</span>
                        </button>
                        <button
                          onClick={() => alert("Opening Call Scheduler...")}
                          className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-xs font-medium text-slate-700 transition-all cursor-pointer"
                        >
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <span>Schedule Call</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setIsConvertModalOpen(true)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Convert to Opportunity</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CONTACT & COMPANY */}
              {activeTab === "contact" && (
                <div className="space-y-6 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs border-b pb-2">
                        Lead Address & Geography
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Address Type</label>
                          <input
                            type="text"
                            value={formState.addressType}
                            onChange={(e) => handleInputChange("addressType", e.target.value)}
                            className="w-full h-7 bg-white border border-slate-300 rounded px-2"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Address Line 1</label>
                          <input
                            type="text"
                            value={formState.addressLine1}
                            onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                            className="w-full h-7 bg-white border border-slate-300 rounded px-2"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">City</label>
                            <input
                              type="text"
                              value={formState.city}
                              onChange={(e) => handleInputChange("city", e.target.value)}
                              className="w-full h-7 bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">State</label>
                            <input
                              type="text"
                              value={formState.state}
                              onChange={(e) => handleInputChange("state", e.target.value)}
                              className="w-full h-7 bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Country</label>
                            <input
                              type="text"
                              value={formState.country}
                              onChange={(e) => handleInputChange("country", e.target.value)}
                              className="w-full h-7 bg-white border border-slate-300 rounded px-2"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Postal Code</label>
                            <input
                              type="text"
                              value={formState.postalCode}
                              onChange={(e) => handleInputChange("postalCode", e.target.value)}
                              className="w-full h-7 bg-white border border-slate-300 rounded px-2 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs border-b pb-2">
                        Legal & Compliance Registry
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">CIN (Corporate ID Number)</label>
                          <input
                            type="text"
                            value={formState.cin}
                            onChange={(e) => handleInputChange("cin", e.target.value)}
                            className="w-full h-7 bg-white border border-slate-300 rounded px-2 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Legal Company Name</label>
                          <input
                            type="text"
                            value={formState.legalName}
                            onChange={(e) => handleInputChange("legalName", e.target.value)}
                            className="w-full h-7 bg-white border border-slate-300 rounded px-2"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Customer Type</label>
                          <input
                            type="text"
                            value={formState.customerType}
                            onChange={(e) => handleInputChange("customerType", e.target.value)}
                            className="w-full h-7 bg-white border border-slate-300 rounded px-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: REQUIREMENT */}
              {activeTab === "requirement" && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs border-b pb-2">
                      Technical & Commercial Requirement Scope
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-500 font-semibold text-[11px] mb-1">Technical Requirements</label>
                        <textarea
                          rows={4}
                          value={formState.technicalRequirement}
                          onChange={(e) => handleInputChange("technicalRequirement", e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-semibold text-[11px] mb-1">Commercial Requirements</label>
                        <textarea
                          rows={4}
                          value={formState.commercialRequirement}
                          onChange={(e) => handleInputChange("commercialRequirement", e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: QUALIFICATION & SCORING */}
              {activeTab === "qualification" && (
                <div className="space-y-6 text-xs">
                  <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-4">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs border-b pb-2">
                      Interactive BANT Qualification Matrix Engine
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { key: "demographicScore", label: "Demographic Score", val: formState.demographicScore },
                        { key: "firmographicScore", label: "Firmographic Score", val: formState.firmographicScore },
                        { key: "behaviourScore", label: "Behaviour Score", val: formState.behaviourScore },
                        { key: "engagementScore", label: "Engagement Score", val: formState.engagementScore },
                        { key: "intentScore", label: "Intent Score", val: formState.intentScore },
                        { key: "totalScore", label: "Total Lead Score", val: formState.totalScore },
                      ].map((item) => (
                        <div key={item.key} className="bg-white p-3 rounded border border-slate-200 shadow-2xs">
                          <span className="text-slate-500 font-semibold">{item.label}</span>
                          <div className="text-xl font-bold text-primary mt-1">{item.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 10: ANALYTICS DASHBOARD */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  {/* KPI Cards Header */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-xs font-semibold text-slate-500">Total Leads</span>
                      <div className="text-2xl font-bold text-slate-900 mt-1">{totalLeadsCount}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-xs font-semibold text-slate-500">Qualified Leads</span>
                      <div className="text-2xl font-bold text-emerald-600 mt-1">{qualifiedCount}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-xs font-semibold text-slate-500">Hot Leads 🔥</span>
                      <div className="text-2xl font-bold text-rose-600 mt-1">{hotLeadsCount}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-xs font-semibold text-slate-500">Qualification Rate</span>
                      <div className="text-2xl font-bold text-primary mt-1">
                        {Math.round((qualifiedCount / totalLeadsCount) * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Recharts Graphs */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Leads by Source</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={leadSourceChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={11} />
                            <YAxis fontSize={11} />
                            <RechartsTooltip />
                            <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Leads by Status Pipeline</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={leadStatusChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={11} />
                            <YAxis fontSize={11} />
                            <RechartsTooltip />
                            <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MODAL 1: NEW LEAD */}
        {isNewLeadOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900">Create New Lead Master</h3>
                <button onClick={() => setIsNewLeadOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lead Name *</label>
                  <input id="new-lead-name" type="text" placeholder="e.g. Apex Engineering Ltd" className="w-full h-8 px-3 border rounded text-xs" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person *</label>
                  <input id="new-lead-contact" type="text" placeholder="e.g. Rajesh Gupta" className="w-full h-8 px-3 border rounded text-xs" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                  <input id="new-lead-email" type="email" placeholder="rajesh@apexeng.com" className="w-full h-8 px-3 border rounded text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsNewLeadOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const name = (document.getElementById("new-lead-name") as HTMLInputElement)?.value || "New Lead";
                    const newLeadObj: LeadRecord = {
                      ...INITIAL_LEADS[0],
                      id: `LEAD-000${Math.floor(Math.random() * 900 + 100)}`,
                      leadNumber: `L-2024-000${Math.floor(Math.random() * 900 + 100)}`,
                      leadName: name,
                      status: "New",
                    };
                    setLeads((prev) => [newLeadObj, ...prev]);
                    setSelectedLeadId(newLeadObj.id);
                    setFormState(newLeadObj);
                    setIsNewLeadOpen(false);
                  }}
                  className="px-4 py-1.5 text-xs bg-primary text-white font-bold rounded shadow-xs"
                >
                  Create Lead
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: CONVERT LEAD TO OPPORTUNITY */}
        {isConvertModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-emerald-600" />
                  <span>Convert Lead to Opportunity / Account</span>
                </h3>
                <button onClick={() => setIsConvertModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Converting lead <strong className="text-slate-900">{formState.leadName}</strong> will automatically generate linked Opportunity, Account & Contact records.
                </p>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Conversion Target</label>
                  <select className="w-full h-8 border rounded text-xs bg-white px-2">
                    <option value="Opportunity">Opportunity + Customer Account</option>
                    <option value="Customer">Direct Customer</option>
                    <option value="Project">Project Record</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Conversion Value</label>
                  <input type="text" defaultValue={formState.budget} className="w-full h-8 border rounded text-xs px-2 font-semibold text-emerald-700" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsConvertModalOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleInputChange("status", "Converted");
                    setIsConvertModalOpen(false);
                    alert(`Lead ${formState.leadNumber} successfully converted to Opportunity!`);
                  }}
                  className="px-4 py-1.5 text-xs bg-emerald-600 text-white font-bold rounded shadow-xs"
                >
                  Confirm Conversion
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: LOG ACTIVITY */}
        {isActivityModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900">Log Lead Activity</h3>
                <button onClick={() => setIsActivityModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Activity Type</label>
                  <select className="w-full h-8 border rounded text-xs bg-white px-2">
                    <option value="Phone Call">Phone Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Demo">Demo Presentation</option>
                    <option value="Site Visit">Site Visit</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <input type="text" placeholder="e.g. Technical Specs Review Call" className="w-full h-8 border rounded text-xs px-2" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsActivityModalOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsActivityModalOpen(false);
                    alert("Activity logged successfully!");
                  }}
                  className="px-4 py-1.5 text-xs bg-primary text-white font-bold rounded shadow-xs"
                >
                  Save Activity
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
