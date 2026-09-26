import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
  ArrowLeft,
  Lock,
  Eye,
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

export const Route = createFileRoute("/management/crm-management/contact-management")({
  head: () => ({
    meta: [
      { title: "Contact Management Form · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Contact Management Form - Central CRM record for managing individual business contacts, organization relationship, communication details, engagement history, and lifecycle.",
      },
    ],
  }),
  component: ContactManagementPage,
});

// --- Data Models & Interfaces ---

export type ContactType =
  | "Prospect"
  | "Lead Contact"
  | "Customer Contact"
  | "Supplier Contact"
  | "Partner Contact"
  | "Franchise Contact"
  | "Investor Contact"
  | "Government Contact"
  | "Consultant Contact"
  | "Employee Contact"
  | "Professional Contact"
  | "Other";

export type ContactStatus = "New" | "Active" | "Engaged" | "Inactive" | "Archived";

export interface ContactRecord {
  id: string;
  contactNumber: string;
  contactType: ContactType;
  status: ContactStatus;
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  owner: { name: string; avatar: string; email: string };
  businessUnit: string;
  branch: string;
  department: string;
  createdDate: string;
  description: string;

  // Contact Information
  primaryEmail: string;
  alternateEmail: string;
  workPhone: string;
  mobile: string;
  alternateMobile: string;
  whatsApp: string;
  fax: string;
  extension: string;
  preferredContactMethod: string;
  preferredContactTime: string;
  timeZone: string;

  // Organization Relationship
  orgName: string;
  orgType: string;
  designation: string;
  orgDepartment: string;
  decisionMakingRole: string;
  relationshipType: string;
  reportingManager: string;
  joiningDate: string;
  contactSince: string;

  // Address Details
  addressType: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  territory: string;
  region: string;
  primaryAddress: boolean;

  // Classification
  industry: string;
  industrySegment: string;
  marketSegment: string;
  customerSegment: string;
  priority: "Low" | "Normal" | "High" | "Critical";
  rating: "A" | "B" | "C" | "D";
  tags: string[];

  // Relationship Overview
  relationshipStrength: number; // 1-5
  influenceLevel: "Low" | "Medium" | "High" | "Critical";
  communicationFrequency: string;
  preferredChannel: string;
  bestContactTime: string;
  relationshipNotes: string;

  // Associated Records
  linkedLead: string;
  linkedOpportunity: string;
  linkedAccount: string;
  openActivitiesCount: number;
  lastActivity: string;
  nextFollowUpDate: string;

  // Consent & Preferences
  emailConsent: boolean;
  smsConsent: boolean;
  whatsAppConsent: boolean;
  marketingConsent: boolean;
  doNotContact: boolean;
  consentExpiryDate: string;

  // Personal / Additional Details
  nationality: string;
  dateOfBirth: string;
  preferredLanguage: string;
  linkedInProfile: string;
  professionalProfile: string;
  interests: string;

  // Engagement Metrics
  engagementScore: number; // 0-100
  emailOpens: number;
  emailClicks: number;
  calls: number;
  meetings: number;
  websiteVisits: number;
  contentDownloads: number;
  lastEngagementDate: string;
  lastContactedDate: string;
}

const INITIAL_CONTACTS: ContactRecord[] = [
  {
    id: "CONT-0002458",
    contactNumber: "C-2024-0002458",
    contactType: "Customer Contact",
    status: "Active",
    salutation: "Mr.",
    firstName: "Ankit",
    middleName: "Kumar",
    lastName: "Verma",
    preferredName: "Ankit Verma",
    owner: { name: "Rahul Sharma", avatar: "RS", email: "rahul.sharma@magnertia.com" },
    businessUnit: "Industrial Solutions",
    branch: "Mumbai Branch",
    department: "Operations",
    createdDate: "15 Apr 2024 09:35 AM",
    description: "Key decision maker for industrial automation projects. Interested in PLC, SCADA and HMI solutions for their manufacturing plant.",

    primaryEmail: "ankit.verma@acmeauto.com",
    alternateEmail: "ankit.v@acmeauto.com",
    workPhone: "022-49876500",
    mobile: "+91 98765 43210",
    alternateMobile: "+91 91234 56789",
    whatsApp: "+91 98765 43210",
    fax: "022-49876501",
    extension: "215",
    preferredContactMethod: "Email",
    preferredContactTime: "10:00 AM - 12:00 PM",
    timeZone: "(GMT +05:30) IST",

    orgName: "Acme Automation Pvt. Ltd.",
    orgType: "Customer",
    designation: "Plant Head",
    orgDepartment: "Operations",
    decisionMakingRole: "Decision Maker",
    relationshipType: "Reports To",
    reportingManager: "Rajesh Malhotra",
    joiningDate: "2020-01-01",
    contactSince: "2022-01-05",

    addressType: "Office",
    addressLine1: "Unit No. 12, Acme Industrial Park",
    addressLine2: "Near MIDC, Andheri (E)",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postalCode: "400093",
    territory: "West Zone",
    region: "Mumbai Region",
    primaryAddress: true,

    industry: "Manufacturing",
    industrySegment: "Industrial Automation",
    marketSegment: "Mid Market",
    customerSegment: "Existing Customer",
    priority: "High",
    rating: "A",
    tags: ["Decision Maker", "Automation", "Plant Head"],

    relationshipStrength: 4.5,
    influenceLevel: "High",
    communicationFrequency: "Weekly",
    preferredChannel: "Email, Phone",
    bestContactTime: "10:00 AM - 12:00 PM",
    relationshipNotes: "Strong technical understanding and key decision maker.",

    linkedLead: "LEAD-0001256 (Qualified)",
    linkedOpportunity: "OPPT-000458 (Proposal)",
    linkedAccount: "ACC-0000365 (Active)",
    openActivitiesCount: 2,
    lastActivity: "Product Demo",
    nextFollowUpDate: "2024-04-22",

    emailConsent: true,
    smsConsent: true,
    whatsAppConsent: true,
    marketingConsent: true,
    doNotContact: false,
    consentExpiryDate: "2025-04-15",

    nationality: "Indian",
    dateOfBirth: "1983-08-14",
    preferredLanguage: "English",
    linkedInProfile: "linkedin.com/in/ankitverma",
    professionalProfile: "Experienced plant head with 12+ years in manufacturing automation.",
    interests: "Industrial Automation, AI, IoT",

    engagementScore: 78,
    emailOpens: 24,
    emailClicks: 8,
    calls: 15,
    meetings: 8,
    websiteVisits: 12,
    contentDownloads: 6,
    lastEngagementDate: "18 Apr 2024 02:30 PM",
    lastContactedDate: "18 Apr 2024 02:30 PM",
  },
  {
    id: "CONT-0002459",
    contactNumber: "C-2024-0002459",
    contactType: "Prospect",
    status: "New",
    salutation: "Dr.",
    firstName: "Vikram",
    middleName: "",
    lastName: "Seth",
    preferredName: "Dr. Vikram Seth",
    owner: { name: "Priya Nair", avatar: "PN", email: "priya.nair@magnertia.com" },
    businessUnit: "Robotics & AI",
    branch: "Bengaluru Branch",
    department: "R&D Robotics",
    createdDate: "16 Apr 2024 10:15 AM",
    description: "CTO at Zenith Robotics Corp. Evaluator for high-payload robotic arm solutions.",

    primaryEmail: "vikram.seth@zenithrobotics.com",
    alternateEmail: "vseth@zenithrobotics.com",
    workPhone: "080-28394000",
    mobile: "+91 99887 76655",
    alternateMobile: "+91 99887 76656",
    whatsApp: "+91 99887 76655",
    fax: "080-28394001",
    extension: "101",
    preferredContactMethod: "WhatsApp",
    preferredContactTime: "02:00 PM - 05:00 PM",
    timeZone: "(GMT +05:30) IST",

    orgName: "Zenith Robotics Corp",
    orgType: "Prospect",
    designation: "CTO",
    orgDepartment: "R&D",
    decisionMakingRole: "Technical Evaluator",
    relationshipType: "Reports To",
    reportingManager: "Board of Directors",
    joiningDate: "2018-05-10",
    contactSince: "2024-04-16",

    addressType: "Registered Office",
    addressLine1: "Electronics City Phase 1",
    addressLine2: "Hosur Main Road",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    postalCode: "560100",
    territory: "South Zone",
    region: "Bengaluru Region",
    primaryAddress: true,

    industry: "Robotics",
    industrySegment: "Warehouse Automation",
    marketSegment: "Enterprise",
    customerSegment: "Key Account Prospect",
    priority: "Critical",
    rating: "A",
    tags: ["Technical Evaluator", "Robotics", "CTO"],

    relationshipStrength: 4.8,
    influenceLevel: "Critical",
    communicationFrequency: "Bi-Weekly",
    preferredChannel: "Meeting / Demo",
    bestContactTime: "02:00 PM - 05:00 PM",
    relationshipNotes: "Key technical evaluator for 6-axis robotic arms.",

    linkedLead: "LEAD-0001257 (New)",
    linkedOpportunity: "OPPT-000459 (Draft)",
    linkedAccount: "ACC-0000366 (Prospect)",
    openActivitiesCount: 1,
    lastActivity: "Initial Discussion",
    nextFollowUpDate: "2024-04-20",

    emailConsent: true,
    smsConsent: true,
    whatsAppConsent: true,
    marketingConsent: true,
    doNotContact: false,
    consentExpiryDate: "2025-04-16",

    nationality: "Indian",
    dateOfBirth: "1978-11-22",
    preferredLanguage: "English",
    linkedInProfile: "linkedin.com/in/vikramseth",
    professionalProfile: "PhD in Robotics & AI from IISc. Leading next-gen automation architecture.",
    interests: "ROS 2, Robotics, Machine Vision",

    engagementScore: 92,
    emailOpens: 30,
    emailClicks: 14,
    calls: 8,
    meetings: 6,
    websiteVisits: 22,
    contentDownloads: 10,
    lastEngagementDate: "17 Apr 2024 04:00 PM",
    lastContactedDate: "17 Apr 2024 04:00 PM",
  },
];

const RECENT_ACTIVITIES = [
  {
    id: "ACT-101",
    time: "18 Apr 2024 02:30 PM",
    type: "Meeting",
    subject: "Product Demo - PLC Solutions",
    outcome: "Positive",
    outcomeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    nextAction: "Send Technical Proposal",
    nextActionDate: "22 Apr 2024",
    assignedTo: "Rahul Sharma",
    status: "Completed",
  },
  {
    id: "ACT-102",
    time: "16 Apr 2024 11:15 AM",
    type: "Email",
    subject: "Product Brochure Shared",
    outcome: "Information Sent",
    outcomeColor: "bg-blue-50 text-blue-700 border-blue-200",
    nextAction: "Follow-up Call",
    nextActionDate: "20 Apr 2024",
    assignedTo: "Rahul Sharma",
    status: "Completed",
  },
  {
    id: "ACT-103",
    time: "15 Apr 2024 10:30 AM",
    type: "Call",
    subject: "Initial Discussion",
    outcome: "Interested",
    outcomeColor: "bg-blue-50 text-primary border-blue-200",
    nextAction: "Schedule Demo",
    nextActionDate: "18 Apr 2024",
    assignedTo: "Rahul Sharma",
    status: "Completed",
  },
  {
    id: "ACT-104",
    time: "10 Apr 2024 04:00 PM",
    type: "Note",
    subject: "Requirement Understanding",
    outcome: "Requirement Captured",
    outcomeColor: "bg-amber-50 text-amber-700 border-amber-200",
    nextAction: "Prepare Solution",
    nextActionDate: "15 Apr 2024",
    assignedTo: "Rahul Sharma",
    status: "Completed",
  },
];

function ContactManagementPage() {
  const contactsQuery = useQuery({
    queryKey: ["crm", "contacts"],
    queryFn: () => crmManagementService.fetchContacts(),
  });

  const queryClient = useQueryClient();

  const createContactMutation = useMutation({
    mutationFn: (input: any) => crmManagementService.createContact(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm"] });
      toast.success("Contact created successfully");
    },
    onError: () => toast.error("Failed to create contact"),
  });

  const dbContacts: ContactRecord[] = (contactsQuery.data ?? []).map((c: any) => ({
    ...INITIAL_CONTACTS[0],
    id: c.id,
    contactNumber: c.contactNumber ?? c.id,
    firstName: c.firstName ?? "",
    lastName: c.lastName ?? "",
    preferredName: `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim(),
    primaryEmail: c.email ?? "",
    mobile: c.phone ?? "",
    designation: c.designation ?? "",
    orgName: c.accountId ?? "",
    status: "Active",
    createdDate: new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  }));
  const [contacts, setContacts] = useState<ContactRecord[]>(INITIAL_CONTACTS);
  const mergedContacts = dbContacts.length > 0 ? dbContacts : contacts;
  const [selectedContactId, setSelectedContactId] = useState<string>("CONT-0002458");

  // Dialog States
  const [isNewContactOpen, setIsNewContactOpen] = useState(false);
  const [isConvertLeadOpen, setIsConvertLeadOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Active Contact Object
  const currentContact = useMemo(() => {
    return mergedContacts.find((c) => c.id === selectedContactId) || mergedContacts[0];
  }, [mergedContacts, selectedContactId]);

  // Form State initialized from current Contact
  const [formState, setFormState] = useState<ContactRecord>(currentContact);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectContact = (id: string) => {
    setSelectedContactId(id);
    const target = contacts.find((c) => c.id === id);
    if (target) setFormState(target);
  };

  const handleInputChange = (field: keyof ContactRecord, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveContact = () => {
    setContacts((prev) => prev.map((c) => (c.id === formState.id ? formState : c)));
    showNotification(`Contact ${formState.contactNumber} (${formState.preferredName}) saved successfully!`);
  };

  return (
    <AppShell
      title="Contact Management"
      breadcrumb="Management > CRM Management > Contact Management"
      description="The Contact Management Form is the central CRM record for managing individual business contacts, their organization relationship, communication details, engagement history, responsibilities, preferences, and lifecycle."
      tabs={<CrmManagementTabBar />}
    >
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col min-h-screen text-slate-800 space-y-6">
        {/* Contact Master Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-3 flex-nowrap overflow-x-auto scrollbar-none">
            {/* Title & Status Badges */}
            <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap">Contact Master Form</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap font-mono">
                {formState.contactNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 whitespace-nowrap flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block" />
                <span>{formState.status}</span>
              </span>
            </div>

            {/* Quick Actions Header Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
              <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Select Contact:</label>
                <select
                  value={selectedContactId}
                  onChange={(e) => handleSelectContact(e.target.value)}
                  className="h-8 max-w-[210px] text-xs bg-slate-50 border border-slate-300 rounded-md px-2 font-medium focus:ring-2 focus:ring-primary focus:outline-none truncate"
                >
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.contactNumber} - {c.preferredName} ({c.orgName})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsNewContactOpen(true)}
                className="h-8 px-3 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Contact</span>
              </button>

              <button
                onClick={handleSaveContact}
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

        {/* Section 1: Contact Master Card (Matching Mockup Image) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">1. Contact Master</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">MAICW Controlled Record</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Contact ID</label>
              <input
                type="text"
                disabled
                  value={formState.id}
                  className="w-full h-8 px-2.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Contact Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.contactNumber}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Contact Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formState.contactType}
                  onChange={(e) => handleInputChange("contactType", e.target.value as any)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="Prospect">Prospect</option>
                  <option value="Lead Contact">Lead Contact</option>
                  <option value="Customer Contact">Customer Contact</option>
                  <option value="Supplier Contact">Supplier Contact</option>
                  <option value="Partner Contact">Partner Contact</option>
                  <option value="Franchise Contact">Franchise Contact</option>
                  <option value="Investor Contact">Investor Contact</option>
                  <option value="Government Contact">Government Contact</option>
                  <option value="Consultant Contact">Consultant Contact</option>
                  <option value="Employee Contact">Employee Contact</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Contact Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formState.status}
                  onChange={(e) => handleInputChange("status", e.target.value as any)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-semibold text-emerald-700 focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Active">Active</option>
                  <option value="Engaged">Engaged</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Salutation</label>
                <select
                  value={formState.salutation}
                  onChange={(e) => handleInputChange("salutation", e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Er.">Er.</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Middle Name</label>
                <input
                  type="text"
                  value={formState.middleName}
                  onChange={(e) => handleInputChange("middleName", e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Preferred Name</label>
                <input
                  type="text"
                  value={formState.preferredName}
                  onChange={(e) => handleInputChange("preferredName", e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Contact Owner</label>
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
                <label className="block text-slate-500 font-semibold mb-1">Created Date</label>
                <input
                  type="text"
                  disabled
                  value={formState.createdDate}
                  className="w-full h-8 px-2.5 bg-slate-100 border border-slate-200 rounded font-medium text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold text-xs mb-1">Description / Summary</label>
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
                  {/* Grid Row 1: Contact Information & Organization Relationship */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 2: Contact Information */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          2. Contact Information
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Primary Email *</label>
                          <input
                            type="email"
                            value={formState.primaryEmail}
                            onChange={(e) => handleInputChange("primaryEmail", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 text-primary font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Alternate Email</label>
                          <input
                            type="email"
                            value={formState.alternateEmail}
                            onChange={(e) => handleInputChange("alternateEmail", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Work Phone</label>
                          <input
                            type="text"
                            value={formState.workPhone}
                            onChange={(e) => handleInputChange("workPhone", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Mobile *</label>
                          <input
                            type="text"
                            value={formState.mobile}
                            onChange={(e) => handleInputChange("mobile", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-semibold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Alternate Mobile</label>
                          <input
                            type="text"
                            value={formState.alternateMobile}
                            onChange={(e) => handleInputChange("alternateMobile", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">WhatsApp</label>
                          <input
                            type="text"
                            value={formState.whatsApp}
                            onChange={(e) => handleInputChange("whatsApp", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Preferred Contact Method *</label>
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
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Preferred Contact Time</label>
                          <input
                            type="text"
                            value={formState.preferredContactTime}
                            onChange={(e) => handleInputChange("preferredContactTime", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Organization Relationship */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          3. Organization Relationship
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Organization *</label>
                          <input
                            type="text"
                            value={formState.orgName}
                            onChange={(e) => handleInputChange("orgName", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-semibold text-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Organization Type *</label>
                          <select
                            value={formState.orgType}
                            onChange={(e) => handleInputChange("orgType", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                          >
                            <option value="Customer">Customer</option>
                            <option value="Prospect">Prospect</option>
                            <option value="Partner">Partner</option>
                            <option value="Supplier">Supplier</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Designation *</label>
                          <input
                            type="text"
                            value={formState.designation}
                            onChange={(e) => handleInputChange("designation", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Department</label>
                          <input
                            type="text"
                            value={formState.orgDepartment}
                            onChange={(e) => handleInputChange("orgDepartment", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Decision-Making Role *</label>
                          <select
                            value={formState.decisionMakingRole}
                            onChange={(e) => handleInputChange("decisionMakingRole", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-semibold"
                          >
                            <option value="Decision Maker">Decision Maker</option>
                            <option value="Influencer">Influencer</option>
                            <option value="Approver">Approver</option>
                            <option value="User">User</option>
                            <option value="Buyer">Buyer</option>
                            <option value="Technical Evaluator">Technical Evaluator</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Relationship Type *</label>
                          <select
                            value={formState.relationshipType}
                            onChange={(e) => handleInputChange("relationshipType", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                          >
                            <option value="Reports To">Reports To</option>
                            <option value="Manages">Manages</option>
                            <option value="Colleague">Colleague</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 2: Address Details & Contact Classification */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 4: Address Details */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          4. Address Details
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Address Type *</label>
                          <select
                            value={formState.addressType}
                            onChange={(e) => handleInputChange("addressType", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                          >
                            <option value="Office">Office</option>
                            <option value="Registered Office">Registered Office</option>
                            <option value="Branch">Branch</option>
                            <option value="Billing">Billing</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Address Line 1 *</label>
                          <input
                            type="text"
                            value={formState.addressLine1}
                            onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">City *</label>
                          <input
                            type="text"
                            value={formState.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">State *</label>
                          <input
                            type="text"
                            value={formState.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Postal Code *</label>
                          <input
                            type="text"
                            value={formState.postalCode}
                            onChange={(e) => handleInputChange("postalCode", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Territory</label>
                          <input
                            type="text"
                            value={formState.territory}
                            onChange={(e) => handleInputChange("territory", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card 5: Contact Classification */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          5. Contact Classification
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Industry *</label>
                          <input
                            type="text"
                            value={formState.industry}
                            onChange={(e) => handleInputChange("industry", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Industry Segment</label>
                          <input
                            type="text"
                            value={formState.industrySegment}
                            onChange={(e) => handleInputChange("industrySegment", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Market Segment *</label>
                          <input
                            type="text"
                            value={formState.marketSegment}
                            onChange={(e) => handleInputChange("marketSegment", e.target.value)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Priority *</label>
                          <select
                            value={formState.priority}
                            onChange={(e) => handleInputChange("priority", e.target.value as any)}
                            className="w-full h-7 text-xs bg-white border border-slate-300 rounded px-2 font-semibold text-rose-600"
                          >
                            <option value="Low">Low</option>
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                          </select>
                        </div>
                        <div className="col-span-2 flex items-center gap-1.5 pt-1">
                          <span className="text-slate-500 font-semibold text-[11px]">Tags:</span>
                          {formState.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded border border-primary/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 3: Relationship Overview & Associations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 6: Relationship Overview */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          6. Relationship Overview
                        </h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-medium">Relationship Strength</span>
                          <div className="flex items-center gap-1 text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn("h-3.5 w-3.5", star <= Math.floor(formState.relationshipStrength) ? "fill-amber-400 text-amber-400" : "text-slate-300")}
                              />
                            ))}
                            <span className="text-xs font-bold text-slate-700 ml-1">({formState.relationshipStrength})</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-medium">Influence Level</span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded border border-emerald-200">
                            {formState.influenceLevel}
                          </span>
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold text-[11px] mb-0.5">Notes</label>
                          <p className="text-slate-700 bg-white p-2 border border-slate-200 rounded text-xs font-medium">
                            {formState.relationshipNotes}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card 7: Associated Records */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          7. Associated Records
                        </h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-medium">Linked Lead</span>
                          <span className="font-semibold text-primary">{formState.linkedLead}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-medium">Linked Opportunity</span>
                          <span className="font-semibold text-emerald-700">{formState.linkedOpportunity}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-medium">Linked Account</span>
                          <span className="font-semibold text-primary">{formState.linkedAccount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 10: Recent Activities Table */}
                  <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        10. Recent Activities
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
                            <th className="py-2 px-3 w-[22%]">Date & Time</th>
                            <th className="py-2 px-2 w-[12%]">Type</th>
                            <th className="py-2 px-3 w-[34%]">Subject & Next Action</th>
                            <th className="py-2 px-2.5 w-[20%] text-center">Outcome</th>
                            <th className="py-2 px-2 w-[12%] text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {RECENT_ACTIVITIES.map((act) => (
                            <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2.5 px-3">
                                <div className="text-slate-600 font-mono text-[11px] truncate leading-tight">{act.time}</div>
                              </td>
                              <td className="py-2.5 px-2">
                                <span className="font-semibold text-slate-800 text-xs">{act.type}</span>
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="font-semibold text-slate-900 text-xs truncate leading-tight">{act.subject}</div>
                                <div className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                                  Next: <span className="font-medium text-slate-700">{act.nextAction}</span> ({act.nextActionDate}) · By: <span className="text-slate-600">{act.assignedTo}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-2.5 text-center">
                                <span className={cn("px-2.5 py-1 text-[11px] font-bold rounded-full border shadow-2xs whitespace-nowrap inline-flex items-center justify-center gap-1.5", act.outcomeColor)}>
                                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                                  <span>{act.outcome}</span>
                                </span>
                              </td>
                              <td className="py-2.5 px-2 text-right">
                                <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 whitespace-nowrap inline-block">
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

                {/* Right Column: Sidebar Widgets (Matching Mockup Image) */}
                <div className="space-y-6">
                  {/* Contact Snapshot Card */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Contact Snapshot
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">Organization</span>
                        <span className="font-bold text-slate-900">{formState.orgName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">Designation</span>
                        <span className="font-semibold text-slate-800">{formState.designation}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">Mobile</span>
                        <span className="font-mono font-semibold text-slate-800">{formState.mobile}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">Email</span>
                        <span className="font-semibold text-primary truncate max-w-[160px]">{formState.primaryEmail}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">City, State</span>
                        <span className="font-semibold text-slate-700">{formState.city}, {formState.state}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">Country</span>
                        <span className="font-semibold text-slate-700">{formState.country}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-500 font-semibold">Relationship Strength</span>
                        <span className="font-bold text-amber-600 flex items-center gap-1">
                          ★★★★☆ ({formState.relationshipStrength})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">Last Contacted</span>
                        <span className="font-mono text-[11px] text-slate-600">{formState.lastContactedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Score Widget (Matching Meter in Screenshot) */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">
                      Engagement Score
                    </h3>

                    {/* Gauge Meter */}
                    <div className="relative flex flex-col items-center justify-center pt-1 pb-1">
                      <div className="relative inline-flex items-center justify-center">
                        <svg width="128" height="128" className="transform -rotate-90">
                          <circle cx="64" cy="64" r="50" stroke="currentColor" strokeWidth="8" className="text-slate-100" fill="transparent" />
                          <circle
                            cx="64"
                            cy="64"
                            r="50"
                            stroke="#10b981"
                            strokeWidth="8"
                            strokeDasharray={2 * Math.PI * 50}
                            strokeDashoffset={2 * Math.PI * 50 * (1 - formState.engagementScore / 100)}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-2xl font-extrabold text-slate-900 font-mono">{formState.engagementScore}%</span>
                        </div>
                      </div>
                      <span className="mt-2 px-3 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                        {formState.engagementScore >= 75 ? "High Engagement" : "Moderate Engagement"}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Email Opens</span>
                        <span className="font-bold text-slate-800">{formState.emailOpens}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Meetings</span>
                        <span className="font-bold text-slate-800">{formState.meetings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Calls</span>
                        <span className="font-bold text-slate-800">{formState.calls}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Website Visits</span>
                        <span className="font-bold text-slate-800">{formState.websiteVisits}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Content Downloads</span>
                        <span className="font-bold text-slate-800">{formState.contentDownloads}</span>
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
                        onClick={() => showNotification("Opening Email Composer...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Mail className="h-4 w-4 text-emerald-600" />
                        <span>Send Email</span>
                      </button>
                      <button
                        onClick={() => showNotification("Opening Meeting Scheduler...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Schedule</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setIsConvertLeadOpen(true)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Convert to Lead / Opportunity</span>
                    </button>
                  </div>
                </div>
              </div>

        {/* MODAL 1: NEW CONTACT */}
        {isNewContactOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900">Create New Contact Master</h3>
                <button onClick={() => setIsNewContactOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                    <input id="new-fname" type="text" placeholder="e.g. Suresh" className="w-full h-8 px-3 border rounded text-xs" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                    <input id="new-lname" type="text" placeholder="e.g. Mehta" className="w-full h-8 px-3 border rounded text-xs" />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organization *</label>
                  <input id="new-org" type="text" placeholder="e.g. Magnetron Industries" className="w-full h-8 px-3 border rounded text-xs" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                  <input id="new-email" type="email" placeholder="suresh@magnetron.com" className="w-full h-8 px-3 border rounded text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsNewContactOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const fname = (document.getElementById("new-fname") as HTMLInputElement)?.value || "New";
                    const lname = (document.getElementById("new-lname") as HTMLInputElement)?.value || "Contact";
                    const org = (document.getElementById("new-org") as HTMLInputElement)?.value || "Organization";
                    const newObj: ContactRecord = {
                      ...INITIAL_CONTACTS[0],
                      id: `CONT-000${Math.floor(Math.random() * 900 + 100)}`,
                      contactNumber: `C-2024-000${Math.floor(Math.random() * 900 + 100)}`,
                      firstName: fname,
                      lastName: lname,
                      preferredName: `${fname} ${lname}`,
                      orgName: org,
                    };
                    setContacts((prev) => [newObj, ...prev]);
                    setSelectedContactId(newObj.id);
                    setFormState(newObj);
                    setIsNewContactOpen(false);
                  }}
                  className="px-4 py-1.5 text-xs bg-primary text-white font-bold rounded shadow-xs"
                >
                  Create Contact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: LOG ACTIVITY */}
        {isActivityModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900">Log Contact Activity</h3>
                <button onClick={() => setIsActivityModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Activity Type</label>
                  <select className="w-full h-8 border rounded text-xs bg-white px-2">
                    <option value="Meeting">Meeting</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Email">Email</option>
                    <option value="Demo">Demo</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <input type="text" placeholder="e.g. Account Review Meeting" className="w-full h-8 border rounded text-xs px-2" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsActivityModalOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsActivityModalOpen(false);
                    showNotification("Contact Activity logged!");
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
