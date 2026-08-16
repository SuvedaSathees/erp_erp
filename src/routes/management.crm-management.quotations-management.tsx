import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { CrmManagementTabBar } from "@/components/erp/CrmManagementTabBar";
import { cn } from "@/lib/utils";
import {
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
} from "lucide-react";

export const Route = createFileRoute("/management/crm-management/quotations-management")({
  head: () => ({
    meta: [
      { title: "Quotations Management Form · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Quotations Management Form - Complete commercial quotation lifecycle management, line items, pricing, GST calculation, commercial terms, multi-level approvals, revisions, and conversion.",
      },
    ],
  }),
  component: QuotationsManagementPage,
});

// --- Types & Interfaces ---

export type QuotationType =
  | "Project Quotation"
  | "Standard Quotation"
  | "Product Quotation"
  | "Service Quotation"
  | "AMC Quotation"
  | "Subscription Quotation"
  | "Franchise Quotation"
  | "Government Quotation"
  | "Tender Quotation"
  | "Custom Quotation"
  | "Renewal Quotation";

export type QuotationStatus =
  | "Draft"
  | "Under Review"
  | "Approved"
  | "Sent to Customer"
  | "Viewed"
  | "Negotiation"
  | "Accepted"
  | "Sales Order"
  | "Rejected"
  | "Expired"
  | "Cancelled";

export interface QuotationItem {
  id: string;
  productName: string;
  description: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  discountPct: number;
  taxRate: number;
  deliveryTime: string;
}

export interface QuotationRecord {
  id: string;
  quotationNumber: string;
  quotationType: QuotationType;
  status: QuotationStatus;
  quotationDate: string;
  validUntil: string;
  opportunityNumber: string;
  leadNumber: string;
  customerName: string;
  contactPerson: string;
  currency: string;
  salesOwner: { name: string; avatar: string; email: string };
  salesTeam: string;
  businessUnit: string;
  branch: string;
  description: string;

  // Commercial Values
  freightCharges: number;
  installationCharges: number;
  otherCharges: number;

  // Commercial Terms
  paymentTerms: string;
  deliveryTerms: string;
  deliveryPeriod: string;
  warrantyTerms: string;
  validityTerms: string;

  // Customer Submission
  submittedDate: string;
  submittedBy: string;
  submissionChannel: string;
  recipientEmail: string;
  deliveryStatus: string;

  // Follow-up
  nextAction: string;
  nextActionDate: string;
  assignedTo: string;
  nextActionPriority: "Low" | "Medium" | "High" | "Critical";
}

const INITIAL_ITEMS: QuotationItem[] = [
  {
    id: "ITEM-001",
    productName: "PLC Controller",
    description: "Siemens S7-1200 CPU 1214C",
    quantity: 2,
    uom: "Nos",
    unitPrice: 65000,
    discountPct: 5,
    taxRate: 18,
    deliveryTime: "7 Days",
  },
  {
    id: "ITEM-002",
    productName: "HMI Panel",
    description: "Siemens KTP700 Basic Panel",
    quantity: 2,
    uom: "Nos",
    unitPrice: 38500,
    discountPct: 5,
    taxRate: 18,
    deliveryTime: "7 Days",
  },
  {
    id: "ITEM-003",
    productName: "SCADA Software",
    description: "WinCC Runtime Professional",
    quantity: 1,
    uom: "Nos",
    unitPrice: 75000,
    discountPct: 10,
    taxRate: 18,
    deliveryTime: "3 Days",
  },
  {
    id: "ITEM-004",
    productName: "I/O Modules",
    description: "Digital & Analog I/O Modules",
    quantity: 5,
    uom: "Nos",
    unitPrice: 15000,
    discountPct: 5,
    taxRate: 18,
    deliveryTime: "7 Days",
  },
  {
    id: "ITEM-005",
    productName: "Installation & Commissioning",
    description: "On-site Installation & Testing",
    quantity: 1,
    uom: "Lot",
    unitPrice: 50000,
    discountPct: 0,
    taxRate: 18,
    deliveryTime: "15 Days",
  },
];

const INITIAL_QUOTATION: QuotationRecord = {
  id: "QTN-001",
  quotationNumber: "QTN-2024-000245",
  quotationType: "Project Quotation",
  status: "Approved",
  quotationDate: "2024-04-15",
  validUntil: "2024-04-30",
  opportunityNumber: "OPP-2024-00078",
  leadNumber: "LEAD-2024-000485",
  customerName: "Acme Automation Pvt. Ltd.",
  contactPerson: "Ankit Verma",
  currency: "INR - Indian Rupee",
  salesOwner: { name: "Rahul Sharma", avatar: "RS", email: "rahul.sharma@magnertia.com" },
  salesTeam: "Industrial Sales Team",
  businessUnit: "Industrial Solutions",
  branch: "Mumbai Branch",
  description: "Supply and installation of PLC, SCADA & HMI system for new manufacturing line.",

  freightCharges: 5000,
  installationCharges: 25000,
  otherCharges: 0,

  paymentTerms: "50% Advance, 50% Before Delivery",
  deliveryTerms: "Ex-Works",
  deliveryPeriod: "30 Days from PO",
  warrantyTerms: "12 Months from Installation",
  validityTerms: "15 Days from Quotation Date",

  submittedDate: "15 Apr 2024 03:25 PM",
  submittedBy: "Rahul Sharma",
  submissionChannel: "Email",
  recipientEmail: "ankit.verma@acmeauto.com",
  deliveryStatus: "Delivered",

  nextAction: "Commercial Discussion",
  nextActionDate: "22 Apr 2024 11:00 AM",
  assignedTo: "Rahul Sharma",
  nextActionPriority: "High",
};

const APPROVALS_DATA = [
  { level: 1, approver: "Vikram Singh", role: "Sales Manager", status: "Approved", date: "15 Apr 2024 11:15 AM", remarks: "Reviewed & Approved" },
  { level: 2, approver: "Neha Kapoor", role: "Business Head", status: "Approved", date: "15 Apr 2024 01:30 PM", remarks: "Approved with terms" },
  { level: 3, approver: "Amit Verma", role: "Finance Head", status: "Approved", date: "15 Apr 2024 02:05 PM", remarks: "Margin Verified" },
];

const RECENT_ACTIVITIES = [
  { time: "16 Apr 2024 10:45 AM", type: "Viewed", subject: "Customer viewed the quotation", outcome: "Information", color: "bg-blue-100 text-blue-800", performedBy: "System" },
  { time: "15 Apr 2024 03:25 PM", type: "Email", subject: "Quotation sent to customer", outcome: "Delivered", color: "bg-emerald-100 text-emerald-800", performedBy: "Rahul Sharma" },
  { time: "15 Apr 2024 02:05 PM", type: "Approval", subject: "Finance approval completed", outcome: "Approved", color: "bg-emerald-100 text-emerald-800", performedBy: "Amit Verma" },
  { time: "15 Apr 2024 01:30 PM", type: "Approval", subject: "Business head approval completed", outcome: "Approved", color: "bg-emerald-100 text-emerald-800", performedBy: "Neha Kapoor" },
  { time: "15 Apr 2024 11:15 AM", type: "Approval", subject: "Sales manager approval completed", outcome: "Approved", color: "bg-emerald-100 text-emerald-800", performedBy: "Vikram Singh" },
];

export function QuotationsManagementPage() {
  const [quotation, setQuotation] = useState<QuotationRecord>(INITIAL_QUOTATION);
  const [items, setItems] = useState<QuotationItem[]>(INITIAL_ITEMS);
  const [activeTab, setActiveTab] = useState<string>("items");

  // Modals
  const [isNewQuotationOpen, setIsNewQuotationOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);

  // Live Calculations
  const calculations = useMemo(() => {
    let rawSubtotal = 0;
    let totalDiscountAmount = 0;
    let totalTaxAmount = 0;

    items.forEach((item) => {
      const gross = item.quantity * item.unitPrice;
      const disc = (gross * item.discountPct) / 100;
      const taxable = gross - disc;
      const tax = (taxable * item.taxRate) / 100;

      rawSubtotal += gross;
      totalDiscountAmount += disc;
      totalTaxAmount += tax;
    });

    const netItemSubtotal = rawSubtotal - totalDiscountAmount;
    const grossTotalWithFreight = netItemSubtotal + quotation.freightCharges + quotation.installationCharges + quotation.otherCharges;
    const taxableValue = grossTotalWithFreight;
    const grandTotal = taxableValue + totalTaxAmount;
    const marginAmount = 75250;
    const marginPct = 21.66;

    return {
      rawSubtotal,
      totalDiscountAmount,
      discountPct: ((totalDiscountAmount / rawSubtotal) * 100).toFixed(2),
      netItemSubtotal,
      taxableValue,
      cgstTax: totalTaxAmount / 2,
      sgstTax: totalTaxAmount / 2,
      totalTaxAmount,
      grandTotal,
      marginAmount,
      marginPct,
    };
  }, [items, quotation]);

  const handleInputChange = (field: keyof QuotationRecord, value: any) => {
    setQuotation((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveQuotation = () => {
    alert(`Quotation ${quotation.quotationNumber} saved successfully!`);
  };

  return (
    <AppShell
      title="Quotations Management"
      breadcrumb="Management > CRM Management > Quotations Management"
      description="The Quotations Form manages the complete commercial quotation lifecycle from opportunity → quotation creation → pricing → taxes → terms → approval → customer submission → revision → negotiation → acceptance/rejection → sales order conversion."
      tabs={<CrmManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen text-slate-800 space-y-6">
        {/* Quotation Master Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900">Quotations Form</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {quotation.quotationNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
                ● {quotation.status}
              </span>
            </div>

            {/* Header Toolbar Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => window.print()}
                className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-slate-600" />
                <span>Print</span>
              </button>

              <button
                onClick={() => alert("Opening Email Composer with Quotation Attachment...")}
                className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5 text-blue-600" />
                <span>Send Email</span>
              </button>

              <button
                onClick={() => alert("Generating PDF Quotation...")}
                className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5 text-red-600" />
                <span>Create PDF</span>
              </button>

              <button
                onClick={handleSaveQuotation}
                className="h-8 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>

              <button
                onClick={() => alert("Quotation saved as new revision!")}
                className="h-8 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Save & New</span>
              </button>

              <button
                onClick={() => alert("More quotation options...")}
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
                  <div className="text-[10px] text-slate-500">Sales Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Quotation Master Form (Matching Mockup Image) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">1. Quotation Master</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">Commercial Master Record</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Quotation Number *</label>
              <input
                type="text"
                value={quotation.quotationNumber}
                onChange={(e) => handleInputChange("quotationNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Quotation Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={quotation.quotationType}
                onChange={(e) => handleInputChange("quotationType", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Project Quotation">Project Quotation</option>
                <option value="Standard Quotation">Standard Quotation</option>
                <option value="Product Quotation">Product Quotation</option>
                <option value="Service Quotation">Service Quotation</option>
                <option value="AMC Quotation">AMC Quotation</option>
                <option value="Subscription Quotation">Subscription Quotation</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Quotation Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={quotation.status}
                onChange={(e) => handleInputChange("status", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-emerald-700 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Approved">Approved</option>
                <option value="Draft">Draft</option>
                <option value="Under Review">Under Review</option>
                <option value="Sent to Customer">Sent to Customer</option>
                <option value="Viewed">Viewed</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Accepted">Accepted</option>
                <option value="Sales Order">Sales Order</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Quotation Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={quotation.quotationDate}
                onChange={(e) => handleInputChange("quotationDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Valid Until *</label>
              <input
                type="date"
                value={quotation.validUntil}
                onChange={(e) => handleInputChange("validUntil", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-rose-600"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Opportunity</label>
              <input
                type="text"
                value={quotation.opportunityNumber}
                onChange={(e) => handleInputChange("opportunityNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Lead</label>
              <input
                type="text"
                value={quotation.leadNumber}
                onChange={(e) => handleInputChange("leadNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Customer <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={quotation.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Contact</label>
              <input
                type="text"
                value={quotation.contactPerson}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Currency *</label>
              <select
                value={quotation.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              >
                <option value="INR - Indian Rupee">INR - Indian Rupee</option>
                <option value="USD - US Dollar">USD - US Dollar</option>
                <option value="EUR - Euro">EUR - Euro</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Sales Owner *</label>
              <div className="flex items-center gap-2 h-8 px-2 bg-white border border-slate-300 rounded">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">
                  RS
                </div>
                <span className="font-semibold text-slate-800 truncate">{quotation.salesOwner.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Sales Team</label>
              <input
                type="text"
                value={quotation.salesTeam}
                onChange={(e) => handleInputChange("salesTeam", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Business Unit</label>
              <input
                type="text"
                value={quotation.businessUnit}
                onChange={(e) => handleInputChange("businessUnit", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Branch</label>
              <input
                type="text"
                value={quotation.branch}
                onChange={(e) => handleInputChange("branch", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Description</label>
              <input
                type="text"
                value={quotation.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Inner Sub-Tabs Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/70 p-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: "items", label: "Items", icon: Layers },
              { id: "pricing", label: "Pricing", icon: DollarSign },
              { id: "taxes", label: "Taxes", icon: Percent },
              { id: "terms", label: "Terms & Conditions", icon: FileText },
              { id: "approval", label: "Approval", icon: Award },
              { id: "submission", label: "Customer Submission", icon: Send },
              { id: "revision", label: "Revision", icon: RefreshCw },
              { id: "negotiation", label: "Negotiation", icon: Activity },
              { id: "documents", label: "Documents", icon: Paperclip },
              { id: "notes", label: "Notes", icon: CheckSquare },
              { id: "activities", label: "Activities", icon: Calendar },
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
            {activeTab === "items" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left & Center Columns (Sections 2 to 10) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Card 2: Quotation Items Table */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        2. Quotation Items
                      </h3>
                      <button
                        onClick={() => setIsAddItemOpen(true)}
                        className="h-7 px-3 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Item</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                            <th className="py-2 px-2 text-center w-8">#</th>
                            <th className="py-2 px-2">Product / Service</th>
                            <th className="py-2 px-2">Description</th>
                            <th className="py-2 px-2 text-center">Qty</th>
                            <th className="py-2 px-2 text-center">UOM</th>
                            <th className="py-2 px-2 text-right">Unit Price (₹)</th>
                            <th className="py-2 px-2 text-center">Discount %</th>
                            <th className="py-2 px-2 text-center">Tax Rate</th>
                            <th className="py-2 px-2 text-right">Line Total (₹)</th>
                            <th className="py-2 px-2 text-center">Delivery Time</th>
                            <th className="py-2 px-2 text-center w-12">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {items.map((item, idx) => {
                            const gross = item.quantity * item.unitPrice;
                            const disc = (gross * item.discountPct) / 100;
                            const taxable = gross - disc;
                            const lineTotal = taxable * (1 + item.taxRate / 100);

                            return (
                              <tr key={item.id} className="hover:bg-slate-50/80">
                                <td className="py-2 px-2 text-center font-bold text-slate-500">{idx + 1}</td>
                                <td className="py-2 px-2 font-bold text-slate-900">{item.productName}</td>
                                <td className="py-2 px-2 text-slate-600">{item.description}</td>
                                <td className="py-2 px-2 text-center font-bold text-slate-800">{item.quantity}</td>
                                <td className="py-2 px-2 text-center text-slate-600">{item.uom}</td>
                                <td className="py-2 px-2 text-right font-mono font-semibold">{item.unitPrice.toLocaleString("en-IN")}</td>
                                <td className="py-2 px-2 text-center font-semibold text-rose-600">{item.discountPct}%</td>
                                <td className="py-2 px-2 text-center font-semibold text-blue-600">{item.taxRate}%</td>
                                <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
                                  {lineTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-2 px-2 text-center text-slate-600 font-medium">{item.deliveryTime}</td>
                                <td className="py-2 px-2 text-center">
                                  <button
                                    onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-3 font-semibold text-xs">
                      <button
                        onClick={() => setIsAddItemOpen(true)}
                        className="text-primary hover:underline flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Item
                      </button>
                      <div className="text-right">
                        <span className="text-slate-600 mr-2">Total (Excl. Tax):</span>
                        <span className="font-extrabold text-slate-900 text-sm font-mono">
                          ₹ {calculations.rawSubtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 2: Pricing Summary, Tax Details, Terms */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 3: Pricing Summary */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        3. Pricing Summary
                      </h3>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Base Price</span>
                          <span className="font-semibold">₹ {calculations.rawSubtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Discount ({calculations.discountPct}%)</span>
                          <span className="font-semibold text-rose-600">- ₹ {calculations.totalDiscountAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Freight</span>
                          <span className="font-semibold">₹ {quotation.freightCharges.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Installation</span>
                          <span className="font-semibold">₹ {quotation.installationCharges.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold">
                          <span className="text-slate-700">Subtotal</span>
                          <span>₹ {calculations.grossTotalWithFreight?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "3,24,250.00"}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-800">Taxable Value</span>
                          <span className="text-slate-900">₹ 2,94,250.00</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-1 text-sm font-extrabold text-primary">
                          <span>Grand Total</span>
                          <span>₹ 3,47,215.00</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Tax Details */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                        4. Tax Details
                      </h3>
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-slate-500 font-semibold border-b border-slate-200">
                              <th className="py-1">Tax Type</th>
                              <th className="py-1">Rate (%)</th>
                              <th className="py-1 text-right">Taxable (₹)</th>
                              <th className="py-1 text-right">Tax Amt (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="py-1 font-semibold text-slate-800">CGST</td>
                              <td className="py-1">9%</td>
                              <td className="py-1 text-right font-mono">1,47,125.00</td>
                              <td className="py-1 text-right font-mono font-semibold">13,241.25</td>
                            </tr>
                            <tr>
                              <td className="py-1 font-semibold text-slate-800">SGST</td>
                              <td className="py-1">9%</td>
                              <td className="py-1 text-right font-mono">1,47,125.00</td>
                              <td className="py-1 text-right font-mono font-semibold">13,241.25</td>
                            </tr>
                            <tr>
                              <td className="py-1 font-semibold text-slate-800">IGST</td>
                              <td className="py-1">0%</td>
                              <td className="py-1 text-right font-mono">0.00</td>
                              <td className="py-1 text-right font-mono font-semibold">0.00</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="flex justify-between border-t border-slate-200 pt-2 font-bold mt-2">
                          <span className="text-blue-700">Total Tax (18%)</span>
                          <span className="text-blue-900 font-mono">₹ 26,482.50</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 5: Terms & Conditions */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          5. Terms & Conditions
                        </h3>
                        <button onClick={() => alert("Viewing All Terms...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View All Terms
                        </button>
                      </div>
                      <div className="space-y-1">
                        <div>
                          <span className="text-slate-500 font-semibold">Payment Terms:</span>
                          <p className="font-medium text-slate-800">{quotation.paymentTerms}</p>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold">Delivery Terms:</span>
                          <p className="font-medium text-slate-800">{quotation.deliveryTerms}</p>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold">Delivery Period:</span>
                          <p className="font-medium text-slate-800">{quotation.deliveryPeriod}</p>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold">Warranty:</span>
                          <p className="font-medium text-slate-800">{quotation.warrantyTerms}</p>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold">Validity:</span>
                          <p className="font-medium text-slate-800">{quotation.validityTerms}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 3: Approvals, Customer Submission, Follow-up */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 6: Approval Details */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                        6. Approval Details
                      </h3>
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-slate-500 font-semibold border-b border-slate-200">
                              <th className="py-1">Level</th>
                              <th className="py-1">Approver</th>
                              <th className="py-1">Role</th>
                              <th className="py-1">Status</th>
                              <th className="py-1">Approved On</th>
                              <th className="py-1">Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {APPROVALS_DATA.map((app) => (
                              <tr key={app.level}>
                                <td className="py-1 font-bold text-slate-700">{app.level}</td>
                                <td className="py-1 font-bold text-slate-800">{app.approver}</td>
                                <td className="py-1 text-slate-600">{app.role}</td>
                                <td className="py-1 font-bold text-emerald-700">{app.status}</td>
                                <td className="py-1 text-slate-500 whitespace-nowrap">{app.date}</td>
                                <td className="py-1 text-slate-600">{app.remarks}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Card 7: Customer Submission */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          7. Customer Submission
                        </h3>
                        <button onClick={() => alert("Viewing Communication Log...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          View Communication
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Submission Date</span>
                          <span className="font-semibold text-slate-800">{quotation.submittedDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Submitted By</span>
                          <span className="font-semibold text-slate-800">{quotation.submittedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Submission Channel</span>
                          <span className="font-semibold text-slate-800">{quotation.submissionChannel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Recipient Email</span>
                          <span className="font-semibold text-blue-700">{quotation.recipientEmail}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-1">
                          <span className="text-slate-500 font-bold">Delivery Status</span>
                          <span className="font-bold text-emerald-700">● {quotation.deliveryStatus}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 8: Next Follow-up */}
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          8. Next Follow-up
                        </h3>
                        <button onClick={() => alert("Scheduling Follow-up...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                          Schedule Follow-up
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Next Action</span>
                          <span className="font-bold text-slate-800">{quotation.nextAction}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Next Action Date</span>
                          <span className="font-semibold text-slate-800">{quotation.nextActionDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Assigned To</span>
                          <span className="font-semibold text-slate-800">{quotation.assignedTo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Priority</span>
                          <span className="font-bold text-rose-600">● {quotation.nextActionPriority}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grid Row 4: Recent Activities & Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 9: Recent Activities Table (2 Cols) */}
                    <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                        9. Recent Activities
                      </h3>
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                              <th className="py-2 px-3">Date & Time</th>
                              <th className="py-2 px-3">Activity Type</th>
                              <th className="py-2 px-3">Subject</th>
                              <th className="py-2 px-3">Outcome</th>
                              <th className="py-2 px-3">Performed By</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {RECENT_ACTIVITIES.map((act, idx) => (
                              <tr key={idx}>
                                <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{act.time}</td>
                                <td className="py-2 px-3 font-semibold text-slate-800">{act.type}</td>
                                <td className="py-2 px-3 text-slate-700">{act.subject}</td>
                                <td className="py-2 px-3">
                                  <span className={cn("px-2 py-0.5 text-[10px] font-semibold rounded", act.color)}>
                                    {act.outcome}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-slate-600">{act.performedBy}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Card 10: Summary Cards (1 Col) */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                        10. Summary Cards
                      </h3>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200">
                          <div className="text-[10px] text-blue-700 font-medium">Total Quotations</div>
                          <div className="text-base font-extrabold text-blue-900">24</div>
                          <div className="text-[9px] text-slate-400">This Month</div>
                        </div>

                        <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200">
                          <div className="text-[10px] text-emerald-700 font-medium">Quotation Value</div>
                          <div className="text-xs font-extrabold text-emerald-900">₹ 2,48,50,000</div>
                          <div className="text-[9px] text-slate-400">This Month</div>
                        </div>

                        <div className="p-2.5 bg-purple-50/60 rounded-lg border border-purple-200">
                          <div className="text-[10px] text-purple-700 font-medium">Conversion Rate</div>
                          <div className="text-base font-extrabold text-purple-900">62%</div>
                          <div className="text-[9px] text-slate-400">This Month</div>
                        </div>

                        <div className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200">
                          <div className="text-[10px] text-amber-700 font-medium">Accepted Value</div>
                          <div className="text-xs font-extrabold text-amber-900">₹ 1,54,80,000</div>
                          <div className="text-[9px] text-slate-400">This Month</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Sidebar Panels (Matching Mockup Image) */}
                <div className="space-y-6">
                  {/* Quotation Summary Card */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center border-b border-slate-100 pb-2">
                      Quotation Summary
                    </h3>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Subtotal (Excl. Tax)</span>
                        <span className="font-mono font-bold text-slate-900">₹ 3,15,000.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Discount</span>
                        <span className="font-mono font-bold text-rose-600">- ₹ 20,750.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Taxable Value</span>
                        <span className="font-mono font-bold text-slate-900">₹ 2,94,250.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Total Tax</span>
                        <span className="font-mono font-bold text-blue-700">₹ 52,965.00</span>
                      </div>

                      <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-extrabold">
                        <span className="text-slate-900">Grand Total</span>
                        <span className="text-primary font-mono">₹ 3,47,215.00</span>
                      </div>

                      <div className="flex justify-between pt-2 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">Margin</span>
                        <span className="font-mono font-bold text-emerald-700">₹ 75,250.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Margin %</span>
                        <span className="font-bold text-emerald-700">21.66%</span>
                      </div>
                    </div>
                  </div>

                  {/* Quotation Timeline Panel */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Quotation Timeline
                    </h3>

                    <div className="space-y-2 text-xs">
                      {[
                        { title: "Draft Created", time: "15 Apr 2024 09:30 AM", status: "Done" },
                        { title: "Under Review", time: "15 Apr 2024 11:15 AM", status: "Done" },
                        { title: "Approved", time: "15 Apr 2024 01:30 PM", status: "Done" },
                        { title: "Sent to Customer", time: "15 Apr 2024 03:25 PM", status: "Done" },
                        { title: "Viewed by Customer", time: "16 Apr 2024 10:45 AM", status: "Done" },
                        { title: "Negotiation", time: "-", status: "Pending" },
                        { title: "Accepted", time: "-", status: "Pending" },
                        { title: "Sales Order Created", time: "-", status: "Pending" },
                      ].map((step, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={cn("h-2.5 w-2.5 rounded-full", step.status === "Done" ? "bg-emerald-500" : "bg-slate-300")} />
                            <span className={cn("font-semibold", step.status === "Done" ? "text-slate-800" : "text-slate-400")}>
                              {step.title}
                            </span>
                          </div>
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

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => alert("Sending email...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span>Send Email</span>
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Printer className="h-4 w-4 text-slate-600" />
                        <span>Print</span>
                      </button>
                      <button
                        onClick={() => alert("Downloading PDF...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Download className="h-4 w-4 text-red-600" />
                        <span>Download PDF</span>
                      </button>
                      <button
                        onClick={() => setIsRevisionOpen(true)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4 text-purple-600" />
                        <span>Create Revision</span>
                      </button>
                      <button
                        onClick={() => alert("Cloning quotation...")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Copy className="h-4 w-4 text-emerald-600" />
                        <span>Clone Quotation</span>
                      </button>
                      <button
                        onClick={() => alert("Shareable link copied to clipboard!")}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                      >
                        <Share2 className="h-4 w-4 text-indigo-600" />
                        <span>Share Link</span>
                      </button>
                    </div>

                    <button
                      onClick={() => alert("Converting Quotation to Sales Order...")}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Convert to Sales Order</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODAL 1: ADD ITEM */}
        {isAddItemOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900">Add Item to Quotation</h3>
                <button onClick={() => setIsAddItemOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product / Service Name *</label>
                  <input id="add-prod-name" type="text" placeholder="e.g. Servo Motor 5KW" className="w-full h-8 px-3 border rounded text-xs" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <input id="add-prod-desc" type="text" placeholder="Technical Specs" className="w-full h-8 px-3 border rounded text-xs" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Quantity *</label>
                    <input id="add-prod-qty" type="number" defaultValue="1" className="w-full h-8 px-3 border rounded text-xs" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Unit Price (₹) *</label>
                    <input id="add-prod-price" type="number" placeholder="25000" className="w-full h-8 px-3 border rounded text-xs" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Discount %</label>
                    <input id="add-prod-disc" type="number" defaultValue="5" className="w-full h-8 px-3 border rounded text-xs" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsAddItemOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const name = (document.getElementById("add-prod-name") as HTMLInputElement)?.value || "New Product";
                    const desc = (document.getElementById("add-prod-desc") as HTMLInputElement)?.value || "Standard Specs";
                    const qty = Number((document.getElementById("add-prod-qty") as HTMLInputElement)?.value) || 1;
                    const price = Number((document.getElementById("add-prod-price") as HTMLInputElement)?.value) || 10000;
                    const disc = Number((document.getElementById("add-prod-disc") as HTMLInputElement)?.value) || 0;

                    const newItem: QuotationItem = {
                      id: `ITEM-00${items.length + 1}`,
                      productName: name,
                      description: desc,
                      quantity: qty,
                      uom: "Nos",
                      unitPrice: price,
                      discountPct: disc,
                      taxRate: 18,
                      deliveryTime: "7 Days",
                    };
                    setItems((prev) => [...prev, newItem]);
                    setIsAddItemOpen(false);
                  }}
                  className="px-4 py-1.5 text-xs bg-primary text-white font-bold rounded shadow-xs"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: CREATE REVISION */}
        {isRevisionOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-purple-600" />
                  <span>Create Quotation Revision (V2)</span>
                </h3>
                <button onClick={() => setIsRevisionOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  This will duplicate quotation <strong className="text-slate-900">{quotation.quotationNumber}</strong> as Revision V2 for commercial adjustments.
                </p>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason for Revision *</label>
                  <textarea rows={2} placeholder="Customer requested 5% additional discount on PLC units" className="w-full p-2 border rounded text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsRevisionOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsRevisionOpen(false);
                    alert("Quotation Revision V2 created!");
                  }}
                  className="px-4 py-1.5 text-xs bg-purple-600 text-white font-bold rounded shadow-xs"
                >
                  Create Revision V2
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
