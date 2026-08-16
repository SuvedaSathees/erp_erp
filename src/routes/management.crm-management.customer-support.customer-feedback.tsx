import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { CrmManagementTabBar } from "@/components/erp/CrmManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Star,
  Printer,
  Mail,
  FileText,
  Save,
  Plus,
  MoreHorizontal,
  ChevronRight,
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  Layers,
  ShieldCheck,
  Paperclip,
  Activity,
  Award,
  RefreshCw,
  Copy,
  Share2,
  Trash2,
  Edit,
  Download,
  Send,
  UserCheck,
  Building2,
  Percent,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  PieChart as PieIcon,
  MessageSquare,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";

export const Route = createFileRoute("/management/crm-management/customer-support/customer-feedback")({
  head: () => ({
    meta: [
      { title: "Customer Feedback Form ⭐ · Customer Support · Magnertia ERP" },
      {
        name: "description",
        content:
          "Customer Feedback Form - Structured customer feedback management, CSAT satisfaction scores, NPS Net Promoter Score (+60), CES customer effort score, sentiment analysis, monthly feedback analytics, and CSAT reports.",
      },
    ],
  }),
  component: CustomerFeedbackPage,
});

// --- Types & Data Interfaces ---

export type FeedbackType =
  | "Support Feedback"
  | "General Feedback"
  | "Product Feedback"
  | "Service Feedback"
  | "Complaint Resolution Feedback"
  | "Delivery Feedback"
  | "Installation Feedback"
  | "Technician Feedback"
  | "Sales Feedback"
  | "Website / Portal Feedback"
  | "Training Feedback"
  | "AMC Feedback";

export type FeedbackStatus =
  | "Responded"
  | "Requested"
  | "Sent"
  | "Opened"
  | "Under Review"
  | "Action Required"
  | "Action Completed"
  | "Closed";

export interface CustomerFeedbackRecord {
  id: string;
  feedbackNumber: string;
  feedbackType: FeedbackType;
  status: FeedbackStatus;
  feedbackDate: string;
  feedbackChannel: string;
  customerName: string;
  contactPerson: string;
  accountName: string;
  businessUnit: string;
  branch: string;
  subject: string;
  feedbackOwner: { name: string; avatar: string; email: string };
  interactionType: string;
  interactionReference: string;
  interactionDate: string;
  technician: { name: string; avatar: string };
  productName: string;
  serialNumber: string;
  installationDate: string;
  overallFeedbackText: string;

  // Customer Details
  customerType: string;
  industry: string;
  customerSegment: string;
  customerPriority: string;
  email: string;
  mobile: string;
  location: string;
  accountOwner: string;

  // CSAT Ratings (1 to 5)
  overallCsatScore: number; // e.g. 4.2
  productSatisfaction: number; // 4.0
  serviceSatisfaction: number; // 4.5
  supportSatisfaction: number; // 4.0
  deliverySatisfaction: number; // 4.0
  installationSatisfaction: number; // 4.0
  valueForMoney: number; // 4.0
  communicationSatisfaction: number; // 4.5

  // NPS
  npsScoreSelected: number; // 9
  npsNetScore: number; // +60
  npsCategory: "Promoter" | "Passive" | "Detractor";

  // CES
  cesSelectedRating: number; // 4 (Easy)
  cesScoreText: string; // "4 / 5 Easy"

  // Detailed ratings table
  responseTimeRating: number; // 4
  resolutionTimeRating: number; // 4
  technicalExpertiseRating: number; // 5
  professionalismRating: number; // 5
  communicationRating: number; // 4

  // Comments & Sentiment
  customerComments: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  sentimentScore: number; // 0.86
}

const INITIAL_FEEDBACK: CustomerFeedbackRecord = {
  id: "FEED-001",
  feedbackNumber: "FEED-2024-000245",
  feedbackType: "Support Feedback",
  status: "Responded",
  feedbackDate: "16 Apr 2024 10:35 AM",
  feedbackChannel: "Email",
  customerName: "Acme Automation Pvt. Ltd.",
  contactPerson: "Ankit Verma",
  accountName: "Acme Automation Pvt. Ltd.",
  businessUnit: "Industrial Solutions",
  branch: "Mumbai Branch",
  subject: "Excellent support and quick resolution",
  feedbackOwner: { name: "Vikram Singh", avatar: "VS", email: "vikram.singh@magnertia.com" },
  interactionType: "Support",
  interactionReference: "SUP-2024-000523",
  interactionDate: "15 Apr 2024",
  technician: { name: "Vikram Singh", avatar: "VS" },
  productName: "Magnertia 60kW DC Fast Charger",
  serialNumber: "MAG60KW-23-00048",
  installationDate: "12 Mar 2024",
  overallFeedbackText: "Very happy with the quick response and professional support.",

  customerType: "Corporate",
  industry: "Manufacturing",
  customerSegment: "Enterprise",
  customerPriority: "High",
  email: "ankit.verma@acmeauto.com",
  mobile: "+91 98765 43210",
  location: "Mumbai, Maharashtra, India",
  accountOwner: "Rahul Sharma",

  overallCsatScore: 4.2,
  productSatisfaction: 4.0,
  serviceSatisfaction: 4.5,
  supportSatisfaction: 4.0,
  deliverySatisfaction: 4.0,
  installationSatisfaction: 4.0,
  valueForMoney: 4.0,
  communicationSatisfaction: 4.5,

  npsScoreSelected: 9,
  npsNetScore: 60,
  npsCategory: "Promoter",

  cesSelectedRating: 4,
  cesScoreText: "4 / 5 Easy",

  responseTimeRating: 4,
  resolutionTimeRating: 4,
  technicalExpertiseRating: 5,
  professionalismRating: 5,
  communicationRating: 4,

  customerComments:
    "The support team responded quickly and resolved the issue in a professional manner. The technician was knowledgeable and courteous. Overall a great experience.",
  sentiment: "Positive",
  sentimentScore: 0.86,
};

const RECENT_FEEDBACK_HISTORY = [
  { no: "FEED-2024-000244", date: "15 Apr 2024", customer: "Beta Electric Ltd.", type: "Product Feedback", csat: 5, nps: "+80", status: "Closed", owner: "Vikram Singh" },
  { no: "FEED-2024-000243", date: "14 Apr 2024", customer: "GreenFleet Logistics", type: "Service Feedback", csat: 4, nps: "+40", status: "Responded", owner: "Neha Kapoor" },
  { no: "FEED-2024-000242", date: "13 Apr 2024", customer: "City Transport Corp.", type: "Support Feedback", csat: 3, nps: "+20", status: "Under Review", owner: "Amit Verma" },
  { no: "FEED-2024-000241", date: "12 Apr 2024", customer: "Sunrise Industries", type: "Installation Feedback", csat: 5, nps: "+100", status: "Closed", owner: "Vikram Singh" },
  { no: "FEED-2024-000240", date: "11 Apr 2024", customer: "Alpha Automation", type: "Service Feedback", csat: 4, nps: "+60", status: "Closed", owner: "Rahul Sharma" },
];

const FEEDBACK_BY_TYPE_DONUT = [
  { name: "Support", value: 35, color: "#0284c7" },
  { name: "Product", value: 25, color: "#059669" },
  { name: "Service", value: 20, color: "#f59e0b" },
  { name: "Installation", value: 10, color: "#8b5cf6" },
  { name: "Other", value: 10, color: "#64748b" },
];

const SENTIMENT_DONUT = [
  { name: "Positive", value: 70, color: "#059669" },
  { name: "Neutral", value: 20, color: "#f59e0b" },
  { name: "Negative", value: 10, color: "#e11d48" },
];

export function CustomerFeedbackPage() {
  const [feedback, setFeedback] = useState<CustomerFeedbackRecord>(INITIAL_FEEDBACK);
  const [activeTab, setActiveTab] = useState<string>("satisfaction");

  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);

  const handleInputChange = (field: keyof CustomerFeedbackRecord, value: any) => {
    setFeedback((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveFeedback = () => {
    alert(`Customer Feedback ${feedback.feedbackNumber} saved successfully!`);
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <span className="text-amber-500 font-bold tracking-tighter">
        {"★".repeat(full)}
        {half ? "½" : ""}
        {"☆".repeat(Math.max(0, 5 - full - (half ? 1 : 0)))}
      </span>
    );
  };

  return (
    <AppShell
      title="Customer Feedback Form ⭐"
      breadcrumb="Management > CRM Management > Customer Support > Customer Feedback > Customer Feedback Form"
      description="The Customer Feedback Form manages structured customer feedback after interactions, support tickets, complaints, deliveries, installations, products, and services. It captures customer satisfaction → service experience → resolution quality → loyalty → suggestions → improvement actions → analytics."
      tabs={<CrmManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen text-slate-800 space-y-6">
        {/* Feedback Master Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>Customer Feedback Form</span>
                <span className="text-amber-500 text-sm">⭐</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {feedback.feedbackNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
                ● {feedback.status}
              </span>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="h-8 px-3 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Request Feedback</span>
              </button>

              <button
                onClick={() => window.print()}
                className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-slate-600" />
                <span>Print</span>
              </button>

              <button
                onClick={() => alert("Opening Email Composer for CSAT Feedback...")}
                className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5 text-blue-600" />
                <span>Send Email</span>
              </button>

              <button
                onClick={handleSaveFeedback}
                className="h-8 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>

              <button
                onClick={() => alert("More options...")}
                className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>More</span>
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1">
                <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs shadow-2xs">
                  RS
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 leading-none">Rahul Sharma</div>
                  <div className="text-[10px] text-slate-500">CRM Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Feedback Master (Matching Mockup Image) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">1. Feedback Master</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">Customer CSAT & Experience Record</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Feedback Number *</label>
              <input
                type="text"
                value={feedback.feedbackNumber}
                onChange={(e) => handleInputChange("feedbackNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Feedback Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={feedback.feedbackType}
                onChange={(e) => handleInputChange("feedbackType", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Support Feedback">Support Feedback</option>
                <option value="General Feedback">General Feedback</option>
                <option value="Product Feedback">Product Feedback</option>
                <option value="Service Feedback">Service Feedback</option>
                <option value="Complaint Resolution Feedback">Complaint Resolution Feedback</option>
                <option value="Installation Feedback">Installation Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Feedback Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={feedback.status}
                onChange={(e) => handleInputChange("status", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-emerald-700 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Responded">Responded</option>
                <option value="Requested">Requested</option>
                <option value="Sent">Sent</option>
                <option value="Opened">Opened</option>
                <option value="Under Review">Under Review</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Feedback Date *</label>
              <input
                type="text"
                disabled
                value={feedback.feedbackDate}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-200 rounded font-medium text-slate-600"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Feedback Channel *</label>
              <select
                value={feedback.feedbackChannel}
                onChange={(e) => handleInputChange("feedbackChannel", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              >
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="Customer Portal">Customer Portal</option>
                <option value="Survey">Survey</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer *</label>
              <input
                type="text"
                value={feedback.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Contact *</label>
              <input
                type="text"
                value={feedback.contactPerson}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Account</label>
              <input
                type="text"
                value={feedback.accountName}
                onChange={(e) => handleInputChange("accountName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Business Unit</label>
              <input
                type="text"
                value={feedback.businessUnit}
                onChange={(e) => handleInputChange("businessUnit", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Branch</label>
              <input
                type="text"
                value={feedback.branch}
                onChange={(e) => handleInputChange("branch", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Subject *</label>
              <input
                type="text"
                value={feedback.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Feedback Owner *</label>
              <div className="flex items-center gap-2 h-8 px-2 bg-white border border-slate-300 rounded">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">
                  VS
                </div>
                <span className="font-semibold text-slate-800 truncate">{feedback.feedbackOwner.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Interaction Type *</label>
              <input
                type="text"
                value={feedback.interactionType}
                onChange={(e) => handleInputChange("interactionType", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Interaction Reference *</label>
              <input
                type="text"
                value={feedback.interactionReference}
                onChange={(e) => handleInputChange("interactionReference", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-primary"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Interaction Date</label>
              <input
                type="text"
                value={feedback.interactionDate}
                onChange={(e) => handleInputChange("interactionDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Technician / Employee</label>
              <div className="flex items-center gap-2 h-8 px-2 bg-white border border-slate-300 rounded">
                <div className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                  VS
                </div>
                <span className="font-semibold text-slate-800 truncate">{feedback.technician.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Product / Service</label>
              <input
                type="text"
                value={feedback.productName}
                onChange={(e) => handleInputChange("productName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Serial Number</label>
              <input
                type="text"
                value={feedback.serialNumber}
                onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Purchase/Installation Date</label>
              <input
                type="text"
                value={feedback.installationDate}
                onChange={(e) => handleInputChange("installationDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div className="col-span-1 lg:col-span-5">
              <label className="block text-slate-500 font-semibold mb-1">Overall Feedback</label>
              <input
                type="text"
                value={feedback.overallFeedbackText}
                onChange={(e) => handleInputChange("overallFeedbackText", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Inner Sub-Tabs Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/70 p-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: "satisfaction", label: "Satisfaction", icon: Star },
              { id: "ratings", label: "Ratings", icon: Award },
              { id: "nps", label: "NPS & CES", icon: TrendingUp },
              { id: "comments", label: "Comments", icon: MessageSquare },
              { id: "suggestions", label: "Suggestions", icon: ThumbsUp },
              { id: "actions", label: "Actions", icon: CheckSquare },
              { id: "attachments", label: "Attachments", icon: Paperclip },
              { id: "communication", label: "Communication", icon: Mail },
              { id: "history", label: "History", icon: Clock },
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
            {activeTab === "satisfaction" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left & Center Columns (Sections 2 to 9) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Grid Row 1: Customer Details, Overall Satisfaction, NPS, CES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 2: Customer Details */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        2. Customer Details
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 font-medium block">Customer Type</span>
                          <span className="font-semibold text-slate-800">{feedback.customerType}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Industry</span>
                          <span className="font-semibold text-slate-800">{feedback.industry}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Customer Segment</span>
                          <span className="font-semibold text-slate-800">{feedback.customerSegment}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Customer Priority</span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200 text-[10px]">
                            {feedback.customerPriority}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Email</span>
                          <span className="font-semibold text-blue-700">{feedback.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Mobile</span>
                          <span className="font-semibold text-slate-800">{feedback.mobile}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs border-t border-slate-200 pt-2">
                        <div>
                          <span className="text-slate-500 font-semibold">Location:</span>
                          <p className="font-medium text-slate-800 text-[11px]">{feedback.location}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-slate-500 font-semibold">Account Owner</span>
                          <div className="flex items-center gap-1.5">
                            <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[9px]">
                              RS
                            </div>
                            <span className="font-bold text-slate-800">{feedback.accountOwner}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Overall Satisfaction (CSAT) */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        3. Overall Satisfaction (CSAT)
                      </h3>

                      <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                        <div className="text-center shrink-0">
                          <div className="text-2xl font-extrabold text-slate-900">{feedback.overallCsatScore} / 5</div>
                          <div className="text-[10px] font-bold text-emerald-700 uppercase">Satisfied</div>
                        </div>
                        <div className="text-amber-500 text-lg tracking-tight">
                          {renderStars(feedback.overallCsatScore)}
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Product Satisfaction</span>
                          {renderStars(feedback.productSatisfaction)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Service Satisfaction</span>
                          {renderStars(feedback.serviceSatisfaction)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Support Satisfaction</span>
                          {renderStars(feedback.supportSatisfaction)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Delivery Satisfaction</span>
                          {renderStars(feedback.deliverySatisfaction)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Installation Satisfaction</span>
                          {renderStars(feedback.installationSatisfaction)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Value for Money</span>
                          {renderStars(feedback.valueForMoney)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Communication</span>
                          {renderStars(feedback.communicationSatisfaction)}
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Net Promoter Score (NPS) */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        4. Net Promoter Score (NPS)
                      </h3>

                      <div>
                        <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                          How likely are you to recommend us?
                        </span>
                        <div className="flex items-center justify-between gap-1 overflow-x-auto">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <button
                              key={num}
                              onClick={() => handleInputChange("npsScoreSelected", num)}
                              className={cn(
                                "h-6 w-6 rounded font-bold text-[10px] flex items-center justify-center transition-all cursor-pointer",
                                feedback.npsScoreSelected === num
                                  ? "bg-emerald-600 text-white shadow-xs scale-110"
                                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                              )}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                        <div>
                          <div className="text-[10px] text-slate-500 font-semibold">NPS Score</div>
                          <div className="text-xl font-extrabold text-emerald-700">+{feedback.npsNetScore}</div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded border border-emerald-300">
                          {feedback.npsCategory}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-600 flex items-center gap-1 font-medium">
                            <span className="h-2 w-2 rounded-full bg-emerald-600" /> Promoters (9-10)
                          </span>
                          <span className="font-bold text-slate-800">60%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 flex items-center gap-1 font-medium">
                            <span className="h-2 w-2 rounded-full bg-amber-500" /> Passives (7-8)
                          </span>
                          <span className="font-bold text-slate-800">20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 flex items-center gap-1 font-medium">
                            <span className="h-2 w-2 rounded-full bg-rose-600" /> Detractors (0-6)
                          </span>
                          <span className="font-bold text-slate-800">20%</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 5: Customer Effort Score (CES) */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        5. Customer Effort Score (CES)
                      </h3>

                      <div>
                        <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                          How easy was it to get your issue resolved?
                        </span>
                        <div className="space-y-1">
                          {[
                            { val: 1, label: "1 Very Difficult" },
                            { val: 2, label: "2 Difficult" },
                            { val: 3, label: "3 Neutral" },
                            { val: 4, label: "4 Easy" },
                            { val: 5, label: "5 Very Easy" },
                          ].map((opt) => (
                            <label key={opt.val} className="flex items-center gap-2 cursor-pointer text-[11px]">
                              <input
                                type="radio"
                                name="ces"
                                checked={feedback.cesSelectedRating === opt.val}
                                onChange={() => handleInputChange("cesSelectedRating", opt.val)}
                                className="text-primary"
                              />
                              <span className={cn(feedback.cesSelectedRating === opt.val ? "font-bold text-slate-900" : "text-slate-600")}>
                                {opt.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                        <div>
                          <div className="text-[10px] text-slate-500 font-semibold">CES Score</div>
                          <div className="text-xl font-extrabold text-slate-900">4 / 5</div>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200">
                          Easy
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 2: Detailed Ratings & Comments & Sentiment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 6: Detailed Ratings */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                        6. Detailed Ratings
                      </h3>
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                              <th className="py-1.5 px-2">Criteria</th>
                              <th className="py-1.5 px-2 text-center">Rating</th>
                              <th className="py-1.5 px-2 text-center">Score (1-5)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {[
                              { label: "Response Time", score: feedback.responseTimeRating },
                              { label: "Resolution Time", score: feedback.resolutionTimeRating },
                              { label: "Technical Expertise", score: feedback.technicalExpertiseRating },
                              { label: "Professionalism", score: feedback.professionalismRating },
                              { label: "Communication", score: feedback.communicationRating },
                            ].map((row, idx) => (
                              <tr key={idx}>
                                <td className="py-2 px-2 font-semibold text-slate-800">{row.label}</td>
                                <td className="py-2 px-2 text-center">{renderStars(row.score)}</td>
                                <td className="py-2 px-2 text-center font-bold text-slate-900">{row.score}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Card 7: Comments & Sentiment */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                        7. Comments & Sentiment
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-slate-500 font-semibold block mb-1">Customer Comments</span>
                          <textarea
                            rows={3}
                            value={feedback.customerComments}
                            onChange={(e) => handleInputChange("customerComments", e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded text-xs text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-semibold">Sentiment:</span>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-xs border border-emerald-300">
                              ● {feedback.sentiment}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-semibold mr-1">Score:</span>
                            <span className="font-mono font-bold text-slate-900">{feedback.sentimentScore}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 8: Recent Feedback History Table */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        8. Recent Feedback History
                      </h3>
                      <button onClick={() => alert("Viewing All Feedback History...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                        View All History
                      </button>
                    </div>

                    <div className="overflow-x-auto text-xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                            <th className="py-2 px-2">Feedback No.</th>
                            <th className="py-2 px-2">Date</th>
                            <th className="py-2 px-2">Customer</th>
                            <th className="py-2 px-2">Type</th>
                            <th className="py-2 px-2 text-center">CSAT</th>
                            <th className="py-2 px-2 text-center">NPS</th>
                            <th className="py-2 px-2 text-center">Status</th>
                            <th className="py-2 px-2">Owner</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {RECENT_FEEDBACK_HISTORY.map((row) => (
                            <tr key={row.no} className="hover:bg-slate-50/80">
                              <td className="py-2 px-2 font-mono font-bold text-slate-900">{row.no}</td>
                              <td className="py-2 px-2 text-slate-500 whitespace-nowrap">{row.date}</td>
                              <td className="py-2 px-2 font-bold text-slate-800">{row.customer}</td>
                              <td className="py-2 px-2 text-slate-600">{row.type}</td>
                              <td className="py-2 px-2 text-center">{renderStars(row.csat)}</td>
                              <td className="py-2 px-2 text-center font-extrabold text-emerald-700">{row.nps}</td>
                              <td className="py-2 px-2 text-center">
                                <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded", row.status === "Closed" ? "bg-slate-100 text-slate-700" : "bg-emerald-100 text-emerald-800")}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-slate-600 font-medium">{row.owner}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Card 9: Feedback Analytics (This Month) */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                      9. Feedback Analytics (This Month)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Donut 1: Feedback by Type */}
                      <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-200 space-y-2">
                        <h4 className="text-[11px] font-bold text-slate-700 text-center">Feedback by Type</h4>
                        <div className="flex items-center justify-between gap-2">
                          <div className="w-24 h-24 relative shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={FEEDBACK_BY_TYPE_DONUT}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={24}
                                  outerRadius={38}
                                  paddingAngle={3}
                                  dataKey="value"
                                >
                                  {FEEDBACK_BY_TYPE_DONUT.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <RechartsTooltip formatter={(val: number) => `${val}%`} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                              <span className="text-xs font-extrabold text-slate-900">48</span>
                              <span className="text-[8px] text-slate-400 font-bold">Total</span>
                            </div>
                          </div>
                          <div className="space-y-1 text-[10px] w-full">
                            {FEEDBACK_BY_TYPE_DONUT.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <span className="flex items-center gap-1 font-medium text-slate-600">
                                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} /> {item.name}
                                </span>
                                <span className="font-bold text-slate-800">{item.value}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Donut 2: Sentiment Distribution */}
                      <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-200 space-y-2">
                        <h4 className="text-[11px] font-bold text-slate-700 text-center">Sentiment Distribution</h4>
                        <div className="flex items-center justify-between gap-2">
                          <div className="w-24 h-24 relative shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={SENTIMENT_DONUT}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={24}
                                  outerRadius={38}
                                  paddingAngle={3}
                                  dataKey="value"
                                >
                                  {SENTIMENT_DONUT.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <RechartsTooltip formatter={(val: number) => `${val}%`} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                              <span className="text-xs font-extrabold text-slate-900">48</span>
                              <span className="text-[8px] text-slate-400 font-bold">Total</span>
                            </div>
                          </div>
                          <div className="space-y-1 text-[10px] w-full">
                            {SENTIMENT_DONUT.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <span className="flex items-center gap-1 font-medium text-slate-600">
                                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} /> {item.name}
                                </span>
                                <span className="font-bold text-slate-800">{item.value}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-t border-slate-200 pt-3 text-center text-xs">
                      <div className="bg-slate-50 p-2 rounded border">
                        <div className="text-[10px] text-slate-500 font-semibold">Average CSAT</div>
                        <div className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-1">
                          4.2 / 5 {renderStars(4.2)}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border">
                        <div className="text-[10px] text-slate-500 font-semibold">NPS Score</div>
                        <div className="text-sm font-extrabold text-emerald-700 flex items-center justify-center gap-1">
                          +60 <span className="px-1 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px]">Promoter</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border">
                        <div className="text-[10px] text-slate-500 font-semibold">Response Rate</div>
                        <div className="text-sm font-extrabold text-blue-700">85%</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border">
                        <div className="text-[10px] text-slate-500 font-semibold">Closure Rate</div>
                        <div className="text-sm font-extrabold text-emerald-700">92%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Sidebar Panels (Matching Mockup Image) */}
                <div className="space-y-6">
                  {/* Feedback Summary Widget (8 Stat Tiles) */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 text-center">
                      Feedback Summary
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200">
                        <div className="text-[10px] text-blue-700 font-semibold">Total Feedbacks</div>
                        <div className="text-lg font-extrabold text-blue-900">523</div>
                      </div>
                      <div className="p-2.5 bg-purple-50/60 rounded-lg border border-purple-200">
                        <div className="text-[10px] text-purple-700 font-semibold">This Month</div>
                        <div className="text-lg font-extrabold text-purple-900">48</div>
                      </div>
                      <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200">
                        <div className="text-[10px] text-emerald-700 font-semibold">Responded</div>
                        <div className="text-lg font-extrabold text-emerald-900">41</div>
                      </div>
                      <div className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200">
                        <div className="text-[10px] text-amber-700 font-semibold">Pending</div>
                        <div className="text-lg font-extrabold text-amber-900">7</div>
                      </div>
                      <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-300">
                        <div className="text-[10px] text-slate-600 font-semibold">Closed</div>
                        <div className="text-lg font-extrabold text-slate-900">475</div>
                      </div>
                      <div className="p-2.5 bg-teal-50/60 rounded-lg border border-teal-200">
                        <div className="text-[10px] text-teal-700 font-semibold">Avg. CSAT</div>
                        <div className="text-sm font-extrabold text-teal-900">4.2 / 5</div>
                      </div>
                      <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-200">
                        <div className="text-[10px] text-indigo-700 font-semibold">NPS Score</div>
                        <div className="text-lg font-extrabold text-emerald-700">+60</div>
                      </div>
                      <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-200">
                        <div className="text-[10px] text-rose-700 font-semibold">Avg. Response Time</div>
                        <div className="text-sm font-extrabold text-rose-900">12.6 Hrs</div>
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
                        onClick={() => setIsRequestModalOpen(true)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Send className="h-4 w-4 text-blue-600" />
                        <span>Request Feedback</span>
                      </button>
                      <button
                        onClick={() => alert("Adding activity...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span>Add Activity</span>
                      </button>
                      <button
                        onClick={() => alert("Creating task...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <CheckSquare className="h-4 w-4 text-slate-600" />
                        <span>Create Task</span>
                      </button>
                      <button
                        onClick={() => alert("Uploading document...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Paperclip className="h-4 w-4 text-indigo-600" />
                        <span>Upload Doc</span>
                      </button>
                      <button
                        onClick={() => alert("Sending email...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Mail className="h-4 w-4 text-emerald-600" />
                        <span>Send Email</span>
                      </button>
                      <button
                        onClick={() => alert("Downloading PDF summary...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Download className="h-4 w-4 text-teal-600" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODAL 1: REQUEST FEEDBACK */}
        {isRequestModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Send className="h-4 w-4 text-blue-600" />
                  <span>Send CSAT Survey Request</span>
                </h3>
                <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Account *</label>
                  <input type="text" defaultValue={feedback.customerName} className="w-full h-8 px-2 border rounded text-xs font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Survey Template *</label>
                  <select className="w-full h-8 px-2 border rounded text-xs font-medium">
                    <option>Post-Support CSAT Survey</option>
                    <option>Post-Installation Survey</option>
                    <option>NPS Annual Survey</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsRequestModalOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsRequestModalOpen(false);
                    alert("CSAT Survey link sent to customer email!");
                  }}
                  className="px-4 py-1.5 text-xs bg-blue-600 text-white font-bold rounded shadow-xs"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
