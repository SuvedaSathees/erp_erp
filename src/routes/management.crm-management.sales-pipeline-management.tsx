import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { CrmManagementTabBar } from "@/components/erp/CrmManagementTabBar";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Layers,
  Target,
  DollarSign,
  Activity,
  FileText,
  ShieldCheck,
  Paperclip,
  CheckSquare,
  Award,
  Plus,
  Printer,
  Save,
  Upload,
  RefreshCw,
  MoreHorizontal,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Users,
  Building2,
  PieChart as PieIcon,
  BarChart3,
  Search,
  Filter,
  ArrowRight,
  Download,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/management/crm-management/sales-pipeline-management")({
  head: () => ({
    meta: [
      { title: "Sales Pipeline Management Form · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Sales Pipeline Form - Manage opportunity progression through sales stages, pipeline value, probability, forecasting, risks, and win/loss conversion analytics.",
      },
    ],
  }),
  component: SalesPipelineManagementPage,
});

// --- Types & Data Interfaces ---

export type PipelineType =
  | "Enterprise Sales"
  | "New Business"
  | "Existing Customer"
  | "Government Sales"
  | "Tender Sales"
  | "Franchise Sales"
  | "Project Sales"
  | "Product Sales"
  | "Service Sales"
  | "Subscription Sales"
  | "Renewal Sales"
  | "Strategic Accounts";

export interface PipelineRecord {
  id: string;
  pipelineNumber: string;
  pipelineName: string;
  pipelineType: PipelineType;
  period: "Monthly" | "Quarterly" | "Annual";
  status: "Active" | "Closed" | "Archived";
  businessUnit: string;
  salesTeam: string;
  branch: string;
  territory: string;
  pipelineOwner: { name: string; avatar: string; email: string };
  startDate: string;
  endDate: string;
  currency: string;
  description: string;

  // Key KPI Aggregates
  totalPipelineValue: number;
  weightedPipelineValue: number;
  openOpportunities: number;
  closedWonValue: number;
  closedLostValue: number;
  winRate: number; // percentage
  avgDealSize: number;
  avgSalesCycleDays: number;
  forecastAccuracy: number;
}

const INITIAL_PIPELINES: PipelineRecord[] = [
  {
    id: "PIPE-001",
    pipelineNumber: "PIPE-2024-00045",
    pipelineName: "Q2 FY 2024 Pipeline",
    pipelineType: "Enterprise Sales",
    period: "Quarterly",
    status: "Active",
    businessUnit: "Industrial Solutions",
    salesTeam: "Industrial Sales Team",
    branch: "Mumbai Branch",
    territory: "West Zone",
    pipelineOwner: { name: "Rahul Sharma", avatar: "RS", email: "rahul.sharma@magnertia.com" },
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    currency: "INR - Indian Rupee",
    description: "Q2 Pipeline for Industrial Automation & Control Systems across West Zone.",

    totalPipelineValue: 24850000,
    weightedPipelineValue: 14980000,
    openOpportunities: 23,
    closedWonValue: 4820000,
    closedLostValue: 2340000,
    winRate: 64,
    avgDealSize: 1775000,
    avgSalesCycleDays: 52,
    forecastAccuracy: 85,
  },
];

const STAGE_CARDS_DATA = [
  { num: 1, name: "Lead Qualified", value: "₹ 12,50,000", prob: "10%", count: "2 Opportunities", color: "border-slate-300 text-slate-700 bg-slate-100" },
  { num: 2, name: "Opportunity Created", value: "₹ 25,20,000", prob: "20%", count: "3 Opportunities", color: "border-blue-300 text-blue-700 bg-blue-50" },
  { num: 3, name: "Discovery", value: "₹ 32,40,000", prob: "30%", count: "4 Opportunities", color: "border-indigo-300 text-indigo-700 bg-indigo-50" },
  { num: 4, name: "Requirement Confirmed", value: "₹ 45,80,000", prob: "40%", count: "4 Opportunities", color: "border-purple-300 text-purple-700 bg-purple-50" },
  { num: 5, name: "Solution / Demo", value: "₹ 51,75,000", prob: "60%", count: "3 Opportunities", color: "border-amber-300 text-amber-700 bg-amber-50" },
  { num: 6, name: "Proposal / Quotation", value: "₹ 38,60,000", prob: "75%", count: "3 Opportunities", color: "border-orange-300 text-orange-700 bg-orange-50" },
  { num: 7, name: "Commercial Negotiation", value: "₹ 25,20,000", prob: "85%", count: "2 Opportunities", color: "border-emerald-300 text-emerald-700 bg-emerald-50" },
  { num: 8, name: "Final Approval", value: "₹ 11,30,000", prob: "90%", count: "1 Opportunity", color: "border-teal-300 text-teal-700 bg-teal-50" },
  { num: 9, name: "Contract / PO", value: "₹ 5,45,000", prob: "95%", count: "1 Opportunity", color: "border-cyan-300 text-cyan-700 bg-cyan-50" },
  { num: 10, name: "Closed Won", value: "₹ 48,20,000", prob: "100%", count: "1 Opportunity", color: "border-emerald-500 text-emerald-800 bg-emerald-100" },
  { num: "✕", name: "Lost", value: "₹ 23,40,000", prob: "0%", count: "8 Lost", color: "border-rose-300 text-rose-700 bg-rose-50" },
];

const FORECAST_DONUT_DATA = [
  { name: "Pipeline", value: 11020000, pct: "44.3%", color: "#2563eb" },
  { name: "Best Case", value: 6540000, pct: "26.3%", color: "#10b981" },
  { name: "Commit", value: 4980000, pct: "20.1%", color: "#f59e0b" },
  { name: "Omitted", value: 1230000, pct: "5.0%", color: "#8b5cf6" },
  { name: "Closed Won", value: 4820000, pct: "19.4%", color: "#059669" },
  { name: "Closed Lost", value: 2340000, pct: "9.4%", color: "#e11d48" },
];

const TOP_OPPORTUNITIES = [
  { num: "OPP-2024-00078", name: "PLC Automation Project", account: "Tata Steel Ltd.", stage: "Proposal / Quote", value: "₹ 18,60,000", prob: "75%", weighted: "₹ 13,95,000", stageColor: "bg-orange-100 text-orange-800" },
  { num: "OPP-2024-00064", name: "SCADA System Upgrade", account: "Adani Power Ltd.", stage: "Solution / Demo", value: "₹ 15,40,000", prob: "60%", weighted: "₹ 9,24,000", stageColor: "bg-amber-100 text-amber-800" },
  { num: "OPP-2024-00052", name: "Robotics Integration", account: "Mahindra & Mahindra", stage: "Negotiation", value: "₹ 11,20,000", prob: "85%", weighted: "₹ 9,52,000", stageColor: "bg-emerald-100 text-emerald-800" },
  { num: "OPP-2024-00031", name: "Control Panel Supply", account: "Larsen & Toubro", stage: "Requirement Confirmed", value: "₹ 9,80,000", prob: "40%", weighted: "₹ 3,92,000", stageColor: "bg-purple-100 text-purple-800" },
  { num: "OPP-2024-00019", name: "IoT Gateway Project", account: "Reliance Industries", stage: "Discovery", value: "₹ 7,50,000", prob: "30%", weighted: "₹ 2,28,000", stageColor: "bg-blue-100 text-blue-800" },
];

const RECENT_ACTIVITIES = [
  { time: "15 Apr 2024 11:30 AM", opp: "OPP-2024-00078", type: "Meeting", subject: "Proposal Discussion with Technical Team", outcome: "Positive", color: "bg-emerald-100 text-emerald-800", nextAction: "Send Revised Proposal", nextDate: "18 Apr 2024", owner: "Rahul Sharma" },
  { time: "15 Apr 2024 10:15 AM", opp: "OPP-2024-00064", type: "Email", subject: "SCADA Demo Invitation", outcome: "Information Sent", color: "bg-blue-100 text-blue-800", nextAction: "Schedule Demo", nextDate: "20 Apr 2024", owner: "Vikram Singh" },
  { time: "15 Apr 2024 09:45 AM", opp: "OPP-2024-00052", type: "Call", subject: "Commercial Discussion", outcome: "Follow-Up Required", color: "bg-amber-100 text-amber-800", nextAction: "Share Commercial Offer", nextDate: "19 Apr 2024", owner: "Neha Kapoor" },
  { time: "15 Apr 2024 09:10 AM", opp: "OPP-2024-00031", type: "Meeting", subject: "Requirement Review Meeting", outcome: "Positive", color: "bg-emerald-100 text-emerald-800", nextAction: "Prepare Solution", nextDate: "17 Apr 2024", owner: "Ankit Verma" },
  { time: "14 Apr 2024 05:00 PM", opp: "OPP-2024-00019", type: "Note", subject: "Initial Discussion", outcome: "In Progress", color: "bg-slate-100 text-slate-800", nextAction: "Send Presentation", nextDate: "16 Apr 2024", owner: "Pooja Mehta" },
];

const PIPELINE_BY_OWNER_DATA = [
  { name: "Rahul Sharma", value: 7840000 },
  { name: "Vikram Singh", value: 5520000 },
  { name: "Neha Kapoor", value: 4280000 },
  { name: "Ankit Verma", value: 3820000 },
  { name: "Pooja Mehta", value: 3290000 },
];

export function SalesPipelineManagementPage() {
  const [pipelines, setPipelines] = useState<PipelineRecord[]>(INITIAL_PIPELINES);
  const [selectedPipeId, setSelectedPipeId] = useState<string>("PIPE-001");

  // Modal Dialogs
  const [isNewPipeOpen, setIsNewPipeOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentPipe = useMemo(() => {
    return pipelines.find((p) => p.id === selectedPipeId) || pipelines[0];
  }, [pipelines, selectedPipeId]);

  const [formState, setFormState] = useState<PipelineRecord>(currentPipe);

  const handleInputChange = (field: keyof PipelineRecord, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePipeline = () => {
    setPipelines((prev) => prev.map((p) => (p.id === formState.id ? formState : p)));
    showNotification(`Sales Pipeline ${formState.pipelineNumber} saved successfully!`);
  };

  return (
    <AppShell
      title="Sales Pipeline Management"
      breadcrumb="Management > CRM Management > Sales Pipeline Management"
      description="The Sales Pipeline Form manages the complete progression of opportunities through defined sales stages, providing a single control system for pipeline creation → stage progression → value → probability → activities → forecasting → risk → conversion → closure → analytics."
      tabs={<CrmManagementTabBar />}
    >
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col min-h-screen text-slate-800 space-y-6">
        {/* Sales Pipeline Master Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-3 flex-nowrap overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap">Sales Pipeline Master Form</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap font-mono">
                {formState.pipelineNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 whitespace-nowrap flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block" />
                <span>{formState.status}</span>
              </span>
            </div>

            {/* Top Header Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
              <button
                onClick={() => setIsNewPipeOpen(true)}
                className="h-8 px-3 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Pipeline</span>
              </button>

              <button
                onClick={handleSavePipeline}
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
                  <div className="text-[10px] text-slate-500">Sales Director</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Sales Pipeline Master (Matching Mockup Image) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">1. Sales Pipeline Master</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">Pipeline Control System Master</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Pipeline Number *</label>
              <input
                type="text"
                value={formState.pipelineNumber}
                onChange={(e) => handleInputChange("pipelineNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Pipeline Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formState.pipelineName}
                onChange={(e) => handleInputChange("pipelineName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Pipeline Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={formState.pipelineType}
                onChange={(e) => handleInputChange("pipelineType", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Enterprise Sales">Enterprise Sales</option>
                <option value="New Business">New Business</option>
                <option value="Existing Customer">Existing Customer</option>
                <option value="Government Sales">Government Sales</option>
                <option value="Tender Sales">Tender Sales</option>
                <option value="Project Sales">Project Sales</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Pipeline Period <span className="text-rose-500">*</span>
              </label>
              <select
                value={formState.period}
                onChange={(e) => handleInputChange("period", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annual">Annual</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Status</label>
              <span className="w-full h-8 px-2.5 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded font-bold flex items-center gap-1.5">
                ● Active
              </span>
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
              <label className="block text-slate-500 font-semibold mb-1">Sales Team</label>
              <input
                type="text"
                value={formState.salesTeam}
                onChange={(e) => handleInputChange("salesTeam", e.target.value)}
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
              <label className="block text-slate-500 font-semibold mb-1">Pipeline Owner *</label>
              <div className="flex items-center gap-2 h-8 px-2 bg-white border border-slate-300 rounded">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">
                  RS
                </div>
                <span className="font-semibold text-slate-800 truncate">{formState.pipelineOwner.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Start Date *</label>
              <input
                type="date"
                value={formState.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">End Date *</label>
              <input
                type="date"
                value={formState.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Currency *</label>
              <select
                value={formState.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              >
                <option value="INR - Indian Rupee">INR - Indian Rupee</option>
                <option value="USD - US Dollar">USD - US Dollar</option>
                <option value="EUR - Euro">EUR - Euro</option>
              </select>
            </div>

            <div className="col-span-1 lg:col-span-2">
              <label className="block text-slate-500 font-semibold mb-1">Description</label>
              <input
                type="text"
                value={formState.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Pipeline Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left & Center Columns (Sections 2 to 7) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Card 2: Pipeline Stages Overview (11 Horizontal Stage Cards) */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        2. Pipeline Stages Overview
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-500">10 Standard Sales Stages + Lost</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
                      {STAGE_CARDS_DATA.map((stg, idx) => (
                        <div key={idx} className={cn("p-2.5 rounded-lg border flex flex-col justify-between space-y-1.5 transition-all hover:shadow-2xs", stg.color)}>
                          <div className="flex items-center justify-between">
                            <span className="h-4 w-4 rounded-full bg-white text-slate-800 font-extrabold text-[9px] flex items-center justify-center border shadow-2xs">
                              {stg.num}
                            </span>
                            <span className="text-[10px] font-bold opacity-80">{stg.prob}</span>
                          </div>
                          <div>
                            <div className="font-bold text-[11px] leading-tight truncate">{stg.name}</div>
                            <div className="font-mono font-bold text-xs mt-0.5">{stg.value}</div>
                          </div>
                          <div className="text-[10px] opacity-75 font-medium border-t border-slate-200/60 pt-1">
                            {stg.count}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 3: Pipeline by Forecast Category (Recharts Donut) */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        3. Pipeline by Forecast Category
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-500">Total: ₹ 2,48,50,000</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
                      {/* Donut Chart */}
                      <div className="w-40 h-40 relative shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={FORECAST_DONUT_DATA}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={65}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {FORECAST_DONUT_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip formatter={(val: number) => `₹ ${val.toLocaleString("en-IN")}`} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                          <span className="text-[10px] font-bold text-slate-400">Total</span>
                          <span className="text-xs font-extrabold text-slate-900">₹ 2.48 Cr</span>
                        </div>
                      </div>

                      {/* Category Legend List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs w-full">
                        {FORECAST_DONUT_DATA.map((cat, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-50/60 rounded border border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                              <span className="font-medium text-slate-700 truncate">{cat.name}</span>
                            </div>
                            <div className="font-mono font-bold text-slate-900 shrink-0 ml-2">
                              ₹ {(cat.value).toLocaleString("en-IN")} <span className="text-slate-400 font-normal">({cat.pct})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Top Opportunities in Pipeline (Full Width) */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        4. Top Opportunities in Pipeline
                      </h3>
                      <button onClick={() => showNotification("Viewing All Opportunities...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                        View All Opportunities
                      </button>
                    </div>

                    <div className="w-full">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="text-slate-500 font-semibold border-b border-slate-200">
                            <th className="py-2 px-2 whitespace-nowrap">Opportunity</th>
                            <th className="py-2 px-2 whitespace-nowrap">Account</th>
                            <th className="py-2 px-2 whitespace-nowrap">Stage</th>
                            <th className="py-2 px-2 whitespace-nowrap">Value (INR)</th>
                            <th className="py-2 px-2 whitespace-nowrap">Prob.</th>
                            <th className="py-2 px-2 whitespace-nowrap">Weighted Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {TOP_OPPORTUNITIES.map((opp, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2 px-2 font-bold text-slate-800">
                                <div className="font-mono text-[10px] text-slate-400">{opp.num}</div>
                                <div className="font-medium text-slate-900">{opp.name}</div>
                              </td>
                              <td className="py-2 px-2 text-slate-700 font-medium">{opp.account}</td>
                              <td className="py-2 px-2">
                                <span className={cn("px-2 py-0.5 text-[11px] font-bold rounded inline-block", opp.stageColor)}>
                                  {opp.stage}
                                </span>
                              </td>
                              <td className="py-2 px-2 font-mono font-bold text-slate-900 whitespace-nowrap">{opp.value}</td>
                              <td className="py-2 px-2 font-bold text-amber-600 whitespace-nowrap">{opp.prob}</td>
                              <td className="py-2 px-2 font-mono font-bold text-emerald-700 whitespace-nowrap">{opp.weighted}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Card 5: Pipeline Metrics (9 Metrics Grid) */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        5. Pipeline Metrics
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-500">Q2 FY 2024 Performance</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                        <div className="text-[11px] font-medium text-blue-700">Total Pipeline Value</div>
                        <div className="text-base font-extrabold text-blue-900 mt-0.5">₹ 2,48,50,000</div>
                      </div>
                      <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
                        <div className="text-[11px] font-medium text-emerald-700">Weighted Pipeline</div>
                        <div className="text-base font-extrabold text-emerald-900 mt-0.5">₹ 1,49,80,000</div>
                      </div>
                      <div className="p-3 bg-purple-50/60 rounded-lg border border-purple-200">
                        <div className="text-[11px] font-medium text-purple-700">Open Opportunities</div>
                        <div className="text-base font-extrabold text-purple-900 mt-0.5">23 Deals</div>
                      </div>

                      <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-200">
                        <div className="text-[11px] font-medium text-teal-700">Closed Won Value</div>
                        <div className="text-base font-extrabold text-teal-900 mt-0.5">₹ 48,20,000</div>
                      </div>
                      <div className="p-3 bg-rose-50/60 rounded-lg border border-rose-200">
                        <div className="text-[11px] font-medium text-rose-700">Closed Lost Value</div>
                        <div className="text-base font-extrabold text-rose-900 mt-0.5">₹ 23,40,000</div>
                      </div>
                      <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
                        <div className="text-[11px] font-medium text-emerald-700">Win Rate</div>
                        <div className="text-base font-extrabold text-emerald-800 mt-0.5">64%</div>
                      </div>

                      <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200">
                        <div className="text-[11px] font-medium text-amber-700">Avg. Sales Cycle (Days)</div>
                        <div className="text-base font-extrabold text-amber-900 mt-0.5">52 Days</div>
                      </div>
                      <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200">
                        <div className="text-[11px] font-medium text-indigo-700">Avg. Deal Size</div>
                        <div className="text-base font-extrabold text-indigo-900 mt-0.5">₹ 17,75,000</div>
                      </div>
                      <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                        <div className="text-[11px] font-medium text-blue-700">Forecast Accuracy</div>
                        <div className="text-base font-extrabold text-blue-900 mt-0.5">85%</div>
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 4: Recent Pipeline Activities (Full Width) */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        6. Recent Pipeline Activities
                      </h3>
                      <button onClick={() => showNotification("Viewing All Activities...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                        View All Activities
                      </button>
                    </div>

                    <div className="w-full">
                      <table className="w-full text-left text-xs border-collapse table-fixed">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
                            <th className="py-2 px-2.5 w-[22%]">Date & Time</th>
                            <th className="py-2 px-2 w-[12%]">Type</th>
                            <th className="py-2 px-2.5 w-[36%]">Opportunity & Subject</th>
                            <th className="py-2 px-2 w-[16%]">Outcome</th>
                            <th className="py-2 px-2 w-[14%] text-right">Owner</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {RECENT_ACTIVITIES.map((act, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2 px-2.5">
                                <div className="text-slate-600 font-mono text-[11px] truncate leading-tight">{act.time}</div>
                              </td>
                              <td className="py-2 px-2">
                                <span className="font-semibold text-slate-800 text-xs">{act.type}</span>
                              </td>
                              <td className="py-2 px-2.5">
                                <div className="font-semibold text-slate-800 text-xs truncate leading-tight">{act.subject}</div>
                                <div className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                                  <span className="font-mono text-slate-600">{act.opp}</span> · Next: <span className="text-slate-700 font-medium">{act.nextAction}</span>
                                </div>
                              </td>
                              <td className="py-2 px-2">
                                <span className={cn("inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full border whitespace-nowrap", act.color)}>
                                  {act.outcome}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-right">
                                <span className="text-slate-700 font-medium text-xs truncate block" title={act.owner}>
                                  {act.owner}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Grid Row 5: Pipeline by Owner (Horizontal Bar Chart) */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        7. Pipeline by Owner
                      </h3>
                      <button onClick={() => showNotification("Viewing Detailed Report...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                        View Detailed Report
                      </button>
                    </div>

                    <div className="h-52 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={PIPELINE_BY_OWNER_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" tickFormatter={(val) => `₹${val / 100000}L`} textAnchor="end" tick={{ fontSize: 11 }} />
                          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontWeight: 600 }} />
                          <RechartsTooltip formatter={(val: number) => `₹ ${val.toLocaleString("en-IN")}`} />
                          <Bar dataKey="value" fill="#0284c7" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Right Column: Sidebar Panel (Matching Mockup Image) */}
                <div className="space-y-6">
                  {/* Pipeline Summary Card */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">
                      Pipeline Summary
                    </h3>

                    {/* Circular Total Pipeline Value Gauge */}
                    <div className="relative flex flex-col items-center justify-center py-2">
                      <div className="relative w-44 h-44 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                          {/* Background Track */}
                          <circle
                            cx="80"
                            cy="80"
                            r="64"
                            className="text-slate-100"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                          />
                          {/* Segment 1: Active Deals (Blue) */}
                          <circle
                            cx="80"
                            cy="80"
                            r="64"
                            stroke="#2563eb"
                            strokeWidth="10"
                            strokeDasharray={2 * Math.PI * 64}
                            strokeDashoffset={2 * Math.PI * 64 * (1 - 0.75)}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                          {/* Segment 2: Closed / Won (Emerald) */}
                          <circle
                            cx="80"
                            cy="80"
                            r="64"
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeDasharray={2 * Math.PI * 64}
                            strokeDashoffset={2 * Math.PI * 64 * (1 - 0.35)}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                          <span className="text-lg font-extrabold text-slate-900 font-mono tracking-tight whitespace-nowrap">
                            ₹ 2,48,50,000
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 mt-0.5 whitespace-nowrap">
                            Total Pipeline Value
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Weighted Pipeline</span>
                        <span className="font-extrabold text-emerald-700">₹ 1,49,80,000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Open Opportunities</span>
                        <span className="font-bold text-slate-800">23 Deals</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Closed Won</span>
                        <span className="font-bold text-emerald-600">14 Deals</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Closed Lost</span>
                        <span className="font-bold text-rose-600">8 Deals</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Win Rate</span>
                        <span className="font-extrabold text-emerald-700">64%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Average Deal Size</span>
                        <span className="font-bold text-slate-900">₹ 17,75,000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Average Sales Cycle</span>
                        <span className="font-semibold text-slate-800">52 Days</span>
                      </div>
                    </div>

                    <button
                      onClick={() => showNotification("Viewing Pipeline Analytics...")}
                      className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>View Pipeline Analytics</span>
                    </button>
                  </div>
                </div>
              </div>

        {/* MODAL 1: NEW PIPELINE */}
        {isNewPipeOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900">Create New Sales Pipeline Master</h3>
                <button onClick={() => setIsNewPipeOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pipeline Name *</label>
                  <input id="new-pipe-name" type="text" placeholder="e.g. Q3 FY 2024 Pipeline" className="w-full h-8 px-3 border rounded text-xs" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pipeline Type *</label>
                  <select id="new-pipe-type" className="w-full h-8 px-3 border rounded text-xs">
                    <option value="Enterprise Sales">Enterprise Sales</option>
                    <option value="New Business">New Business</option>
                    <option value="Project Sales">Project Sales</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsNewPipeOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const name = (document.getElementById("new-pipe-name") as HTMLInputElement)?.value || "New Pipeline";
                    const newObj: PipelineRecord = {
                      ...INITIAL_PIPELINES[0],
                      id: `PIPE-00${Math.floor(Math.random() * 900 + 100)}`,
                      pipelineNumber: `PIPE-2024-000${Math.floor(Math.random() * 900 + 100)}`,
                      pipelineName: name,
                    };
                    setPipelines((prev) => [newObj, ...prev]);
                    setSelectedPipeId(newObj.id);
                    setFormState(newObj);
                    setIsNewPipeOpen(false);
                  }}
                  className="px-4 py-1.5 text-xs bg-primary text-white font-bold rounded shadow-xs"
                >
                  Create Pipeline
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: IMPORT PIPELINE */}
        {isImportOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-purple-600" />
                  <span>Import Pipeline Data (CSV / Excel)</span>
                </h3>
                <button onClick={() => setIsImportOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center space-y-2 bg-slate-50">
                <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                <div className="text-xs font-semibold text-slate-700">Drag and drop pipeline CSV file here</div>
                <div className="text-[11px] text-slate-400">Supports .csv, .xlsx up to 10MB</div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsImportOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsImportOpen(false);
                    showNotification("Pipeline opportunities imported successfully!");
                  }}
                  className="px-4 py-1.5 text-xs bg-purple-600 text-white font-bold rounded shadow-xs"
                >
                  Start Import
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
