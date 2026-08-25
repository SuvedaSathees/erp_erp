import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { CrmManagementTabBar } from "@/components/erp/CrmManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Building2,
  Printer,
  Mail,
  Save,
  Plus,
  MoreHorizontal,
  Clock,
  Calendar,
  DollarSign,
  Layers,
  Paperclip,
  Activity,
  Users,
  CheckCircle2,
  TrendingUp,
  Heart,
  ShoppingCart,
  FileText,
  HelpCircle,
  Award,
  Crown,
  FileCheck,
  Star,
  ExternalLink,
  ChevronRight,
  Zap,
  CreditCard,
  Phone,
} from "lucide-react";

export const Route = createFileRoute("/management/crm-management/account-management")({
  head: () => ({
    meta: [
      { title: "Account Management Form · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Account Management Form - Central CRM record for complete business relationship lifecycle, account health (82/100), revenue overview (₹2.48 Cr), opportunity pipeline funnel (₹1.10 Cr), contracts, support, key contacts, and account summary.",
      },
    ],
  }),
  component: AccountManagementPage,
});

// Types & Mock Data

export interface AccountRecord {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  status: string;
  accountCategory: string;
  industry: string;
  customerSegment: string;
  parentAccount: string;
  website: string;
  gstin: string;
  pan: string;
  cin: string;
  country: string;
  state: string;
  city: string;
  accountOwner: { name: string; avatar: string };
  csm: { name: string; avatar: string };
  branch: string;
  businessUnit: string;
  createdDate: string;
  description: string;

  // Account Health
  healthScore: number; // 82
  healthStatus: "Healthy" | "Monitor" | "At Risk" | "Critical";

  // Financial Summary
  totalRevenueFY24: number; // 24800000
  ytdRevenue: number; // 13250000
  potentialRevenue: number; // 7650000
  outstandingAmount: number; // 1875000

  // Opportunities & Orders
  totalOpportunities: number; // 8
  pipelineValue: number; // 11000000
  openOrdersCount: number; // 5

  // Contracts & Support
  activeContractsCount: number; // 4
  openTicketsCount: number; // 3
}

const INITIAL_ACCOUNT: AccountRecord = {
  id: "ACC-001",
  accountNumber: "ACC-2024-000125",
  accountName: "Acme Automation Pvt. Ltd.",
  accountType: "Customer",
  status: "Active Customer",
  accountCategory: "Key Account",
  industry: "Manufacturing",
  customerSegment: "Industrial Automation",
  parentAccount: "Acme Group",
  website: "www.acmeautomation.com",
  gstin: "27AAECA1234B1Z5",
  pan: "AAECA1234B",
  cin: "U29199MH2010PTC204567",
  country: "India",
  state: "Maharashtra",
  city: "Pune",
  accountOwner: { name: "Vikram Singh", avatar: "VS" },
  csm: { name: "Neha Kapoor", avatar: "NK" },
  branch: "Mumbai Branch",
  businessUnit: "Industrial Solutions",
  createdDate: "01 Jan 2024",
  description: "Leading manufacturer of industrial automation equipment and control systems.",

  healthScore: 82,
  healthStatus: "Healthy",

  totalRevenueFY24: 24800000,
  ytdRevenue: 13250000,
  potentialRevenue: 7650000,
  outstandingAmount: 1875000,

  totalOpportunities: 8,
  pipelineValue: 11000000,
  openOrdersCount: 5,

  activeContractsCount: 4,
  openTicketsCount: 3,
};

const RECENT_ACTIVITIES = [
  { type: "Meeting", title: "QBR Review", date: "16 Apr 2024", by: "Rahul Sharma", icon: Users },
  { type: "Email", title: "Proposal Shared", date: "15 Apr 2024", by: "Neha Kapoor", icon: Mail },
  { type: "Support", title: "Support Ticket #TK-2024-0156", date: "14 Apr 2024", by: "Open", icon: HelpCircle },
  { type: "Order", title: "Order #SO-2024-0178 Confirmed", date: "12 Apr 2024", by: "₹ 12,50,000", icon: ShoppingCart },
  { type: "Contract", title: "Contract Renewal Upcoming", date: "10 Apr 2024", by: "AMC-2024-0003", icon: FileText },
];

const CONTRACTS_LIST = [
  { number: "CT-2024-0001", type: "AMC", start: "01 Jan 2024", end: "31 Dec 2024", value: "₹ 25,00,000", status: "Active" },
  { number: "CT-2024-0002", type: "Service Agreement", start: "15 Feb 2024", end: "14 Feb 2025", value: "₹ 12,00,000", status: "Active" },
  { number: "CT-2023-0005", type: "NDA", start: "01 Aug 2023", end: "31 Jul 2026", value: "-", status: "Active" },
  { number: "CT-2024-0004", type: "SLA", start: "01 Mar 2024", end: "28 Feb 2025", value: "₹ 9,00,000", status: "Active" },
];

const KEY_CONTACTS = [
  { name: "Amit Verma", title: "Director", dept: "Operations", mobile: "+91 98765 43210", email: "amit.verma@acme.com" },
  { name: "Priya Nair", title: "Procurement Manager", dept: "Procurement", mobile: "+91 98111 22334", email: "priya.nair@acme.com" },
  { name: "Rohit Mehta", title: "IT Head", dept: "IT", mobile: "+91 98222 33445", email: "rohit.mehta@acme.com" },
  { name: "Sneha Kulkarni", title: "Finance Manager", dept: "Finance", mobile: "+91 98333 44556", email: "sneha.k@acme.com" },
];

const FUNNEL_STAGES = [
  { stage: "Qualification (3)", val: "₹ 45,00,000", width: "w-full", bg: "bg-blue-600" },
  { stage: "Proposal (2)", val: "₹ 30,00,000", width: "w-4/5", bg: "bg-emerald-500" },
  { stage: "Negotiation (2)", val: "₹ 20,00,000", width: "w-3/5", bg: "bg-amber-500" },
  { stage: "Closed Won (1)", val: "₹ 15,00,000", width: "w-2/5", bg: "bg-purple-600" },
];

export function AccountManagementPage() {
  const [account, setAccount] = useState<AccountRecord>(INITIAL_ACCOUNT);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Modal States
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);

  const handleInputChange = (field: keyof AccountRecord, value: any) => {
    setAccount((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAccount = () => {
    showNotification(`Account ${account.accountName} (${account.accountNumber}) saved successfully!`);
  };

  return (
    <AppShell
      title="Account Management Form"
      breadcrumb="Management > CRM Management > Account Management > Account Management Form"
      description="The Account Management Form is the central CRM record for managing the complete business relationship with an organization—from account creation → classification → contacts → ownership → opportunities → orders → contracts → support → customer success → financial relationship → retention → expansion → analytics."
      tabs={<CrmManagementTabBar />}
    >
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col min-h-screen text-slate-800 space-y-6">
        {/* Top Header Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-3 flex-nowrap overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
                <span>Account Management Form</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap font-mono">
                {account.accountNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 whitespace-nowrap flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block" />
                <span>{account.status}</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
              <button
                onClick={() => setIsNewAccountModalOpen(true)}
                className="h-8 px-3 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Account</span>
              </button>

              <button
                onClick={handleSaveAccount}
                className="h-8 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>

              <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1 shrink-0 whitespace-nowrap">
                <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs shadow-2xs shrink-0">
                  VS
                </div>
                <div className="text-left hidden sm:block whitespace-nowrap">
                  <div className="text-xs font-semibold text-slate-800 leading-none">Vikram Singh</div>
                  <div className="text-[10px] text-slate-500">VP, Sales</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Account Master Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">1. Account Master</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">Master Account Record</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Account Number *</label>
              <input
                type="text"
                value={account.accountNumber}
                onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Account Name *</label>
              <input
                type="text"
                value={account.accountName}
                onChange={(e) => handleInputChange("accountName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Account Type *</label>
              <select
                value={account.accountType}
                onChange={(e) => handleInputChange("accountType", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-semibold text-slate-800"
              >
                <option value="Customer">Customer</option>
                <option value="Prospect">Prospect</option>
                <option value="Strategic Customer">Strategic Customer</option>
                <option value="Key Account">Key Account</option>
                <option value="Partner">Partner</option>
                <option value="Distributor">Distributor</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Account Status *</label>
              <select
                value={account.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full h-8 px-2.5 bg-emerald-50 border border-emerald-300 rounded font-bold text-emerald-800"
              >
                <option value="Active Customer">Active Customer</option>
                <option value="Prospect">Prospect</option>
                <option value="Qualified">Qualified</option>
                <option value="Key Account">Key Account</option>
                <option value="Dormant">Dormant</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Account Category *</label>
              <select
                value={account.accountCategory}
                onChange={(e) => handleInputChange("accountCategory", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-semibold text-slate-800"
              >
                <option value="Key Account">Key Account</option>
                <option value="Strategic">Strategic</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Industry *</label>
              <input
                type="text"
                value={account.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer Segment</label>
              <input
                type="text"
                value={account.customerSegment}
                onChange={(e) => handleInputChange("customerSegment", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Parent Account</label>
              <input
                type="text"
                value={account.parentAccount}
                onChange={(e) => handleInputChange("parentAccount", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Website</label>
              <input
                type="text"
                value={account.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium text-blue-600 underline"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">GSTIN</label>
              <input
                type="text"
                value={account.gstin}
                onChange={(e) => handleInputChange("gstin", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">PAN</label>
              <input
                type="text"
                value={account.pan}
                onChange={(e) => handleInputChange("pan", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">CIN</label>
              <input
                type="text"
                value={account.cin}
                onChange={(e) => handleInputChange("cin", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Country *</label>
              <input
                type="text"
                value={account.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">State *</label>
              <input
                type="text"
                value={account.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">City *</label>
              <input
                type="text"
                value={account.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Account Owner *</label>
              <div className="flex items-center gap-2 h-8 px-2 bg-white border border-slate-300 rounded">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">
                  VS
                </div>
                <span className="font-semibold text-slate-800 truncate">{account.accountOwner.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer Success Manager</label>
              <div className="flex items-center gap-2 h-8 px-2 bg-white border border-slate-300 rounded">
                <div className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                  NK
                </div>
                <span className="font-semibold text-slate-800 truncate">{account.csm.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Branch</label>
              <input
                type="text"
                value={account.branch}
                onChange={(e) => handleInputChange("branch", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Business Unit</label>
              <input
                type="text"
                value={account.businessUnit}
                onChange={(e) => handleInputChange("businessUnit", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Created Date</label>
              <input
                type="text"
                value={account.createdDate}
                onChange={(e) => handleInputChange("createdDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-300 rounded font-medium text-slate-700"
              />
            </div>

            <div className="col-span-1 lg:col-span-5">
              <label className="block text-slate-500 font-semibold mb-1">Account Description</label>
              <input
                type="text"
                value={account.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Main Account Management Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left & Center Columns (Sections 2 to 12) */}
          <div className="lg:col-span-2 space-y-6">
                  {/* Grid Row 1: Account Health, Revenue Overview, Opportunity Pipeline, Recent Activities */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Card 2: Account Health */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 space-y-3.5 shadow-2xs hover:shadow-xs transition-all duration-200 relative overflow-hidden group">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider whitespace-nowrap">
                          2. Account Health
                        </h3>
                      </div>

                      <div className="space-y-2.5 text-[11px] pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">Overall Score</span>
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "82%" }} />
                            </div>
                            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-[11px] w-7 text-right">82%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">Adoption</span>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "80%" }} />
                            </div>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px] w-7 text-right">80%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">Engagement</span>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "85%" }} />
                            </div>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px] w-7 text-right">85%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">Support</span>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "78%" }} />
                            </div>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px] w-7 text-right">78%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-0.5">
                          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">Risk Score</span>
                          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] rounded border border-emerald-200/60 dark:border-emerald-800/50">
                            Low
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Revenue Overview */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 space-y-3.5 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider whitespace-nowrap">
                            3. Revenue Overview
                          </h3>
                        </div>

                        <div className="bg-slate-50/80 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Total Revenue (FY 2023-24)</div>
                          <div className="text-base font-black text-blue-900 dark:text-blue-400 tracking-tight mt-0.5">₹ 2,48,00,000</div>
                        </div>

                        <div className="space-y-2 text-[11px] pt-1">
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">YTD Revenue</div>
                              <div className="font-bold text-slate-900 dark:text-slate-200 font-mono text-xs">₹ 1,32,50,000</div>
                            </div>
                            <span className="text-[9px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-bold whitespace-nowrap mt-1">
                              ▲ 18%
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Potential Revenue</div>
                              <div className="font-bold text-slate-900 dark:text-slate-200 font-mono text-xs">₹ 76,50,000</div>
                            </div>
                            <span className="text-[9px] text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded font-bold whitespace-nowrap mt-1">
                              ▲ 24%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Opportunity Pipeline */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 space-y-3 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider whitespace-nowrap">
                            4. Pipeline Funnel
                          </h3>
                        </div>

                        <div className="space-y-2 text-[10px]">
                          {FUNNEL_STAGES.map((st, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between font-semibold gap-1">
                                <span className="text-slate-700 dark:text-slate-300 truncate">{st.stage}</span>
                                <span className="font-mono text-slate-900 dark:text-slate-100 shrink-0">{st.val}</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full", st.bg, st.width)} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] gap-2">
                        <span className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold truncate">Total Pipeline</span>
                        <span className="text-blue-900 dark:text-blue-400 font-mono font-extrabold text-xs shrink-0">₹ 1,10,00,000</span>
                      </div>
                    </div>

                    {/* Card 5: Recent Activities */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 space-y-2.5 text-xs shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-2 mb-2">
                          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider whitespace-nowrap">
                            5. Activities
                          </h3>
                          <button onClick={() => showNotification("Viewing All Activities...")} className="text-[10px] font-semibold text-primary hover:underline cursor-pointer">
                            View All
                          </button>
                        </div>

                        <div className="space-y-1.5 text-[10px]">
                          {RECENT_ACTIVITIES.slice(0, 3).map((act, idx) => {
                            const Icon = act.icon;
                            return (
                              <div key={idx} className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-800">
                                <Icon className="h-3 w-3 text-slate-500 shrink-0" />
                                <div className="min-w-0 flex-1 truncate">
                                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{act.title}</div>
                                  <div className="text-[9px] text-slate-400">{act.date} · {act.by}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 6: Contracts & Renewals (Full Width) */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        6. Contracts & Renewals
                      </h3>
                      <button onClick={() => showNotification("Viewing All Contracts...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                        View All Contracts
                      </button>
                    </div>

                    <div className="w-full">
                      <table className="w-full text-left text-xs border-collapse table-fixed">
                        <thead>
                          <tr className="bg-slate-50/80 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
                            <th className="py-2 px-2.5 w-[24%]">Contract No</th>
                            <th className="py-2 px-2 w-[22%]">Type</th>
                            <th className="py-2 px-2.5 w-[26%]">Start - End</th>
                            <th className="py-2 px-2 w-[16%]">Value</th>
                            <th className="py-2 px-2 w-[12%] text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {CONTRACTS_LIST.map((ct, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2 px-2.5 font-mono font-bold text-slate-800 truncate">{ct.number}</td>
                              <td className="py-2 px-2 text-slate-700 font-medium truncate">{ct.type}</td>
                              <td className="py-2 px-2.5 text-slate-500 font-medium truncate">{ct.start} - {ct.end}</td>
                              <td className="py-2 px-2 font-mono font-bold text-slate-900 truncate">{ct.value}</td>
                              <td className="py-2 px-2 text-center">
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 whitespace-nowrap inline-block">
                                  {ct.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Card 7: Support Summary (Full Width) */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        7. Support Summary
                      </h3>
                      <button onClick={() => showNotification("Viewing All Support Tickets...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                        View All Tickets
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200">
                        <div className="text-[11px] text-slate-500 font-semibold">Total Tickets</div>
                        <div className="text-xl font-extrabold text-slate-900 mt-1">18</div>
                      </div>
                      <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200">
                        <div className="text-[11px] text-amber-700 font-semibold">Open Tickets</div>
                        <div className="text-xl font-extrabold text-amber-900 mt-1">3</div>
                      </div>
                      <div className="p-3 bg-emerald-50/80 rounded-lg border border-emerald-200">
                        <div className="text-[11px] text-emerald-700 font-semibold">Closed Tickets</div>
                        <div className="text-xl font-extrabold text-emerald-900 mt-1">15</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-100">
                      <div className="text-center p-2 bg-slate-50/50 rounded">
                        <div className="text-[10px] text-slate-500">Avg Response</div>
                        <div className="font-bold text-slate-800 text-sm mt-0.5">4.6 hrs</div>
                      </div>
                      <div className="text-center p-2 bg-slate-50/50 rounded">
                        <div className="text-[10px] text-slate-500">Avg Resolution</div>
                        <div className="font-bold text-slate-800 text-sm mt-0.5">18.3 hrs</div>
                      </div>
                      <div className="text-center p-2 bg-slate-50/50 rounded">
                        <div className="text-[10px] text-slate-500">CSAT Score</div>
                        <div className="font-bold text-amber-600 text-sm mt-0.5">4.2 / 5.0</div>
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 3: Key Contacts & Loyalty & Renewal */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 8: Key Contacts */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 space-y-3.5 shadow-2xs hover:shadow-xs transition-all md:col-span-2">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider whitespace-nowrap">
                          8. Key Contacts
                        </h3>
                        <button
                          onClick={() => showNotification("Viewing All Contacts...")}
                          className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          View All Contacts
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="w-full">
                        <table className="w-full text-left text-xs border-collapse table-fixed">
                          <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-[11px] font-semibold border-b border-slate-100 dark:border-slate-800">
                              <th className="py-2.5 px-3 w-[36%]">Contact Name & Title</th>
                              <th className="py-2.5 px-2.5 w-[20%]">Department</th>
                              <th className="py-2.5 px-3 w-[44%]">Contact Info</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-[11px]">
                            {KEY_CONTACTS.map((kc, idx) => {
                              const initials = kc.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("");
                              return (
                                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-800/50 flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-blue-300 shrink-0">
                                        {initials}
                                      </div>
                                      <div className="min-w-0 truncate">
                                        <div className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate leading-tight">{kc.name}</div>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-tight">{kc.title}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-2.5">
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold inline-block whitespace-nowrap">
                                      {kc.dept}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <div className="space-y-0.5 min-w-0">
                                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-mono text-[11px] truncate">
                                        <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                                        <span className="truncate">{kc.mobile}</span>
                                      </div>
                                      <a
                                        href={`mailto:${kc.email}`}
                                        className="text-primary hover:underline flex items-center gap-1.5 text-[10px] font-medium truncate"
                                      >
                                        <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                                        <span className="truncate">{kc.email}</span>
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Card 9 & 10 Column */}
                    <div className="space-y-4">
                      {/* Card 9: Loyalty & Engagement */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-3.5 space-y-2 text-xs">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            9. Loyalty & Engagement
                          </h3>
                          <button onClick={() => showNotification("Viewing Loyalty Details...")} className="text-[10px] font-semibold text-primary hover:underline cursor-pointer">
                            Details
                          </button>
                        </div>
                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Program</span>
                            <span className="font-bold text-slate-800">Magnertia Rewards</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Membership No</span>
                            <span className="font-mono font-bold text-slate-700">MR-ACME-000125</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Current Tier</span>
                            <span className="font-extrabold text-amber-700">Gold Tier</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Points Balance</span>
                            <span className="font-bold text-emerald-700">12,450 Points</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 10: Renewal & Expansion */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-3.5 space-y-2 text-xs">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            10. Renewal & Expansion
                          </h3>
                          <button onClick={() => showNotification("Viewing Renewal Pipeline...")} className="text-[10px] font-semibold text-primary hover:underline cursor-pointer">
                            Pipeline
                          </button>
                        </div>
                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Next Renewal</span>
                            <span className="font-bold text-slate-900">31 Dec 2024 (259 Days)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Renewal Probability</span>
                            <span className="font-bold text-emerald-700">88% High</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Expansion Potential</span>
                            <span className="font-mono font-extrabold text-blue-900">₹ 50,00,000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 4: Documents & Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 11: Documents */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          11. Documents
                        </h3>
                        <button onClick={() => showNotification("Viewing All Documents...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View All
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-white rounded border border-slate-200 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                          <div className="truncate">
                            <div className="font-bold text-slate-800 truncate">GST Certificate</div>
                            <div className="text-[9px] text-slate-400">Uploaded 01 Jan 2024</div>
                          </div>
                        </div>
                        <div className="p-2 bg-white rounded border border-slate-200 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                          <div className="truncate">
                            <div className="font-bold text-slate-800 truncate">Company Profile</div>
                            <div className="text-[9px] text-slate-400">Uploaded 10 Jan 2024</div>
                          </div>
                        </div>
                        <div className="p-2 bg-white rounded border border-slate-200 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-purple-600 shrink-0" />
                          <div className="truncate">
                            <div className="font-bold text-slate-800 truncate">AMC Contract</div>
                            <div className="text-[9px] text-slate-400">Uploaded 01 Jan 2024</div>
                          </div>
                        </div>
                        <div className="p-2 bg-white rounded border border-slate-200 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-amber-600 shrink-0" />
                          <div className="truncate">
                            <div className="font-bold text-slate-800 truncate">SLA Document</div>
                            <div className="text-[9px] text-slate-400">Uploaded 01 Mar 2024</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 12: Quick Actions */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        12. Quick Actions
                      </h3>

                      <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => showNotification("Add Contact...")} className="p-2 bg-white border border-slate-200 rounded text-center text-[10px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                          + Add Contact
                        </button>
                        <button onClick={() => showNotification("Log Activity...")} className="p-2 bg-white border border-slate-200 rounded text-center text-[10px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                          + Log Activity
                        </button>
                        <button onClick={() => showNotification("Create Opportunity...")} className="p-2 bg-white border border-slate-200 rounded text-center text-[10px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                          + Opportunity
                        </button>
                        <button onClick={() => showNotification("Create Order...")} className="p-2 bg-white border border-slate-200 rounded text-center text-[10px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                          + Create Order
                        </button>
                        <button onClick={() => showNotification("Create Contract...")} className="p-2 bg-white border border-slate-200 rounded text-center text-[10px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                          + Contract
                        </button>
                        <button onClick={() => showNotification("Create Ticket...")} className="p-2 bg-white border border-slate-200 rounded text-center text-[10px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                          + Create Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Sidebar Panels (Matching Mockup Image) */}
                <div className="space-y-6">
                  {/* Account Summary Widget (8 Stat Tiles) */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Account Summary
                    </h3>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200 flex justify-between items-center">
                        <div>
                          <div className="text-[10px] text-blue-700 font-semibold">Total Opportunities</div>
                          <div className="text-lg font-extrabold text-blue-900">8</div>
                        </div>
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>

                      <div className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200 flex justify-between items-center">
                        <div>
                          <div className="text-[10px] text-amber-700 font-semibold">Open Orders</div>
                          <div className="text-base font-extrabold text-amber-900">5</div>
                        </div>
                        <ShoppingCart className="h-5 w-5 text-amber-600" />
                      </div>

                      <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200 flex justify-between items-center">
                        <div>
                          <div className="text-[10px] text-emerald-700 font-semibold">Total Revenue (FY 23-24)</div>
                          <div className="text-base font-extrabold text-emerald-900">₹ 2,48,00,000</div>
                        </div>
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                      </div>

                      <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-200 flex justify-between items-center">
                        <div>
                          <div className="text-[10px] text-rose-700 font-semibold">Outstanding Amount</div>
                          <div className="text-base font-extrabold text-rose-900">₹ 18,75,000</div>
                        </div>
                        <CreditCard className="h-5 w-5 text-rose-600" />
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-semibold">Active Contracts</span>
                        <span className="font-bold text-slate-800 text-xs">4</span>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-semibold">Open Tickets</span>
                        <span className="font-bold text-slate-800 text-xs">3</span>
                      </div>

                      <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-semibold text-emerald-800 block">Customer Health Score</span>
                          <span className="font-extrabold text-emerald-900 text-xs font-mono">82 / 100 (Healthy)</span>
                        </div>
                        <div className="relative inline-flex items-center justify-center shrink-0">
                          <svg width="38" height="38" className="transform -rotate-90">
                            <circle cx="19" cy="19" r="14" stroke="currentColor" strokeWidth="3" className="text-emerald-200" fill="transparent" />
                            <circle
                              cx="19"
                              cy="19"
                              r="14"
                              stroke="#059669"
                              strokeWidth="3"
                              strokeDasharray={2 * Math.PI * 14}
                              strokeDashoffset={2 * Math.PI * 14 * (1 - 0.82)}
                              strokeLinecap="round"
                              fill="transparent"
                            />
                          </svg>
                          <span className="absolute text-[9px] font-bold font-mono text-emerald-700">82%</span>
                        </div>
                      </div>

                      <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 flex justify-between items-center">
                        <span className="text-[10px] font-semibold text-amber-800">Account Tier</span>
                        <span className="font-extrabold text-amber-900 text-xs">Gold</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

        {/* Modal: New Account */}
        {isNewAccountModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900">Create New Account Master</h3>
                <button onClick={() => setIsNewAccountModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Name *</label>
                  <input id="new-acc-name" type="text" placeholder="e.g. Acme Automation Pvt. Ltd." className="w-full h-8 px-2 border rounded text-xs" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Type</label>
                  <select className="w-full h-8 px-2 border rounded text-xs">
                    <option value="Customer">Customer</option>
                    <option value="Prospect">Prospect</option>
                    <option value="Key Account">Key Account</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsNewAccountModalOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const name = (document.getElementById("new-acc-name") as HTMLInputElement)?.value || "New Account";
                    setAccount((prev) => ({
                      ...prev,
                      accountNumber: `ACC-2024-000${Math.floor(Math.random() * 900 + 100)}`,
                      accountName: name,
                    }));
                    setIsNewAccountModalOpen(false);
                    showNotification("Account created successfully!");
                  }}
                  className="px-4 py-1.5 text-xs bg-primary text-white font-bold rounded shadow-xs"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
