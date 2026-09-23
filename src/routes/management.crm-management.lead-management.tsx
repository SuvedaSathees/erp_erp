import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { crmManagementService } from "@/services";
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
    outcomeColor: "bg-blue-100 text-primary border-blue-300",
    nextAction: "Prepare Demo Plan",
    nextActionDate: "20 Apr 2024",
    assignedTo: "Rahul Sharma",
    status: "Completed",
  },
];

function LeadManagementPage() {
  const leadsQuery = useQuery({
    queryKey: ["crm", "leads"],
    queryFn: () => crmManagementService.fetchLeads(),
  });
  const dbLeads: LeadRecord[] = (leadsQuery.data ?? []).map((l: any) => ({
    ...INITIAL_LEADS[0],
    id: l.id,
    leadNumber: l.leadNumber,
    leadName: l.leadName,
    leadType: l.leadType ?? "Business",
    status: l.status ?? "New",
    rating: l.rating ?? "Warm",
    priority: l.priority ?? "Medium",
    owner: { name: l.ownerName ?? "", avatar: (l.ownerName ?? "").split(" ").map((w: string) => w[0]).join(""), email: l.ownerEmail ?? "" },
    contactPerson: l.contactPerson ?? "",
    email: l.email ?? "",
    mobile: l.phone ?? "",
    orgName: l.orgName ?? "",
    industry: l.industry ?? "",
    city: l.city ?? "",
    state: l.state ?? "",
    leadSource: l.leadSource ?? "",
    description: l.description ?? "",
    createdDate: new Date(l.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  }));
  const [leads, setLeads] = useState<LeadRecord[]>(INITIAL_LEADS);
  const mergedLeads = dbLeads.length > 0 ? dbLeads : leads;
  const [selectedLeadId, setSelectedLeadId] = useState<string>("LEAD-0000578");
  const [activeTab, setActiveTab] = useState<string>("contact");

  // Dialog States
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Active Lead Object
  const currentLead = useMemo(() => {
    return mergedLeads.find((l) => l.id === selectedLeadId) || mergedLeads[0];
  }, [mergedLeads, selectedLeadId]);

  // Form State initialized from current Lead
  const [formState, setFormState] = useState<LeadRecord>(currentLead);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Update formState when selected lead changes
  const handleSelectLead = (id: string) => {
    setSelectedLeadId(id);
    const target = mergedLeads.find((l) => l.id === id);
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
    showNotification(`Lead ${formState.leadNumber} updated successfully!`);
  };

  // KPI Analytics Computations
  const totalLeadsCount = mergedLeads.length;
  const qualifiedCount = mergedLeads.filter((l) => l.status === "Qualified").length;
  const hotLeadsCount = mergedLeads.filter((l) => l.rating === "Hot").length;
  const warmLeadsCount = mergedLeads.filter((l) => l.rating === "Warm").length;

  const leadSourceChartData = [
    { name: "Website", value: 45, color: "#2563eb" },
    { name: "Exhibition", value: 25, color: "#16a34a" },
    { name: "Referral", value: 15, color: "#d97706" },
    { name: "Social Media", value: 10, color: "#0A3C75" },
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
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col min-h-screen text-slate-800 space-y-6">
        {/* Lead Master Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-3 flex-nowrap overflow-x-auto scrollbar-none">
            {/* Lead Status & Number Badges */}
            <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap">Lead Master Form</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap font-mono">
                {formState.leadNumber}
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap flex items-center gap-1",
                  formState.status === "Qualified"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : formState.status === "Contacted"
                    ? "bg-blue-50 text-blue-700 border-blue-300"
                    : "bg-amber-50 text-amber-700 border-amber-300"
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current inline-block" />
                <span>{formState.status}</span>
              </span>
            </div>

            {/* Quick Actions Header Buttons & Lead Selector */}
            <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
              {/* Select Existing Lead */}
              <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Select Lead:</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => handleSelectLead(e.target.value)}
                  className="h-8 max-w-[210px] text-xs bg-slate-50 border border-slate-300 rounded-md px-2 font-medium focus:ring-2 focus:ring-primary focus:outline-none truncate"
                >
                  {mergedLeads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.leadNumber} - {l.leadName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsNewLeadOpen(true)}
                className="h-8 px-3 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Lead</span>
              </button>

              <button
                onClick={handleSaveLead}
                className="h-8 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>

              {/* User Avatar Info */}
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
                { id: "contact", label: "Contact & Company", icon: Building2 },
                { id: "requirement", label: "Requirements & Scope", icon: Target },
                { id: "qualification", label: "Qualification & Scoring", icon: Award },
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
              {/* TAB 1: CONTACT & COMPANY */}
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
                      <span className="text-xs font-semibold text-slate-500">Hot Leads</span>
                      <div className="text-2xl font-bold text-rose-600 mt-1">{hotLeadsCount}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-xs font-semibold text-slate-500">Qualification Rate</span>
                      <div className="text-2xl font-bold text-primary mt-1 font-mono">
                        {totalLeadsCount > 0 ? ((qualifiedCount / totalLeadsCount) * 100).toFixed(1) : "0.0"}%
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
                    showNotification(`Lead ${formState.leadNumber} successfully converted to Opportunity!`);
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
                    showNotification("Activity logged successfully!");
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
