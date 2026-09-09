import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { CrmManagementTabBar } from "@/components/erp/CrmManagementTabBar";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
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
  Truck,
  Package,
  CreditCard,
  FileCheck,
  MapPin,
  Phone,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/management/crm-management/customer-orders-management")({
  head: () => ({
    meta: [
      { title: "Customer Orders Form · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Customer Orders Form - Complete sales order lifecycle management, customer PO validation, line items, fulfilment, delivery, 3-level approvals, invoicing, payment tracking, and order closure.",
      },
    ],
  }),
  component: CustomerOrdersManagementPage,
});

// --- Types & Data Interfaces ---

export type OrderType =
  | "Standard Sales Order"
  | "Product Order"
  | "Service Order"
  | "Project Order"
  | "AMC Order"
  | "Subscription Order"
  | "Franchise Order"
  | "Government Order"
  | "Tender Order"
  | "Export Order"
  | "Replacement Order"
  | "Renewal Order";

export type OrderStatus =
  | "Draft"
  | "Under Review"
  | "Approved"
  | "Confirmed"
  | "Processing"
  | "Partially Delivered"
  | "Fully Delivered"
  | "Invoiced"
  | "Completed"
  | "Cancelled"
  | "Closed";

export interface OrderItem {
  id: string;
  productName: string;
  description: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  discountPct: number;
  taxRate: number;
  deliveryDate: string;
  status: "Confirmed" | "In Progress" | "Pending" | "Delivered";
}

export interface CustomerOrderRecord {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  orderDate: string;
  poNumber: string;
  poDate: string;
  quotationNumber: string;
  opportunityNumber: string;
  customerName: string;
  customerId: string;
  contactPerson: string;
  salesOwner: { name: string; avatar: string; email: string };
  salesTeam: string;
  businessUnit: string;
  branch: string;
  currency: string;
  requestedDeliveryDate: string;
  description: string;

  // Customer Details
  customerType: string;
  industry: string;
  gstin: string;
  pan: string;
  billingAddress: string;
  shippingAddress: string;
  creditStatus: "Approved" | "Pending" | "On Hold";

  // Financial Values
  freightCharges: number;
  installationCharges: number;
  otherCharges: number;

  // Delivery & Payment
  deliveryLocation: string;
  deliveryMethod: string;
  promisedDeliveryDate: string;
  installationRequired: boolean;
  shippingMethod: string;
  freightResponsibility: string;
  paymentTerms: string;
  advanceReceived: number;
  paidAmount: number;
  balanceDue: number;
  paymentStatus: "Full" | "Partial" | "Unpaid";

  // Next Action
  nextAction: string;
  nextActionDate: string;
  nextActionPriority: "Low" | "Medium" | "High" | "Critical";
}

const INITIAL_ITEMS: OrderItem[] = [
  {
    id: "ITEM-101",
    productName: "PLC Controller",
    description: "Siemens S7-1200 CPU 1214C",
    quantity: 2,
    uom: "Nos",
    unitPrice: 65000,
    discountPct: 5,
    taxRate: 18,
    deliveryDate: "30 Apr 2024",
    status: "Confirmed",
  },
  {
    id: "ITEM-102",
    productName: "HMI Panel",
    description: "Siemens KTP700 Basic Panel",
    quantity: 2,
    uom: "Nos",
    unitPrice: 38500,
    discountPct: 5,
    taxRate: 18,
    deliveryDate: "30 Apr 2024",
    status: "Confirmed",
  },
  {
    id: "ITEM-103",
    productName: "SCADA Software",
    description: "WinCC Runtime Professional",
    quantity: 1,
    uom: "Nos",
    unitPrice: 75000,
    discountPct: 10,
    taxRate: 18,
    deliveryDate: "30 Apr 2024",
    status: "Confirmed",
  },
  {
    id: "ITEM-104",
    productName: "I/O Modules",
    description: "Digital & Analog I/O Modules",
    quantity: 5,
    uom: "Nos",
    unitPrice: 15000,
    discountPct: 5,
    taxRate: 18,
    deliveryDate: "30 Apr 2024",
    status: "In Progress",
  },
  {
    id: "ITEM-105",
    productName: "Installation & Comm.",
    description: "On-site Installation & Testing",
    quantity: 1,
    uom: "Lot",
    unitPrice: 50000,
    discountPct: 0,
    taxRate: 18,
    deliveryDate: "02 May 2024",
    status: "Pending",
  },
];

const INITIAL_ORDER: CustomerOrderRecord = {
  id: "SO-001",
  orderNumber: "SO-2024-000256",
  orderType: "Standard Sales Order",
  status: "Confirmed",
  orderDate: "2024-04-16",
  poNumber: "PO/ACME/24-0456",
  poDate: "2024-04-15",
  quotationNumber: "QTN-2024-000245",
  opportunityNumber: "OPP-2024-00078",
  customerName: "Acme Automation Pvt. Ltd.",
  customerId: "CUST-000156",
  contactPerson: "Ankit Verma",
  salesOwner: { name: "Rahul Sharma", avatar: "RS", email: "rahul.sharma@magnertia.com" },
  salesTeam: "Industrial Sales Team",
  businessUnit: "Industrial Solutions",
  branch: "Mumbai Branch",
  currency: "INR - Indian Rupee",
  requestedDeliveryDate: "2024-04-30",
  description: "Supply of PLC, SCADA system and installation & commissioning as per the attached BOQ and terms.",

  customerType: "Corporate",
  industry: "Manufacturing",
  gstin: "27AABCA1234A1Z5",
  pan: "AABCA1234A",
  billingAddress: "Acme Automation Pvt. Ltd., Unit No. 12, MIDC Industrial Area, Andheri (E), Mumbai - 400093, Maharashtra, India.",
  shippingAddress: "Acme Automation Pvt. Ltd., Warehouse No. 4, MIDC Industrial Area, Andheri (E), Mumbai - 400093, Maharashtra, India.",
  creditStatus: "Approved",

  freightCharges: 5000,
  installationCharges: 25000,
  otherCharges: 3000,

  deliveryLocation: "Acme Automation Pvt. Ltd., Warehouse No. 4, MIDC Industrial Area, Andheri (E), Mumbai - 400093",
  deliveryMethod: "Road",
  promisedDeliveryDate: "02 May 2024",
  installationRequired: true,
  shippingMethod: "Surface",
  freightResponsibility: "In-scope",
  paymentTerms: "50% Advance, 50% Before Delivery",
  advanceReceived: 69443,
  paidAmount: 69443,
  balanceDue: 277772,
  paymentStatus: "Partial",

  nextAction: "Confirm installation schedule",
  nextActionDate: "16 Apr 2024 10:00 AM",
  nextActionPriority: "High",
};

const APPROVALS_DATA = [
  { level: 1, approver: "Vikram Singh", role: "Sales Manager", status: "Approved", date: "16 Apr 2024 11:20 AM", remarks: "Price & terms approved" },
  { level: 2, approver: "Neha Kapoor", role: "Business Head", status: "Approved", date: "16 Apr 2024 01:15 PM", remarks: "Margin verified" },
  { level: 3, approver: "Amit Verma", role: "Finance Head", status: "Approved", date: "16 Apr 2024 02:10 PM", remarks: "Credit limit OK" },
];

const LINKED_DOCUMENTS = [
  { name: "Customer PO", file: "PO/ACME/24-0456.pdf" },
  { name: "Quotation", file: "QTN-2024-000245.pdf" },
  { name: "BOQ", file: "BOQ_Acme_0456.xlsx" },
  { name: "Technical Spec", file: "Tech_Spec_PLCSCADA.pdf" },
];

export function CustomerOrdersManagementPage() {
  const [order, setOrder] = useState<CustomerOrderRecord>(INITIAL_ORDER);
  const [items, setItems] = useState<OrderItem[]>(INITIAL_ITEMS);
  const [activeTab, setActiveTab] = useState<string>("details");

  // Modals
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  // Live Calculations
  const calculations = useMemo(() => {
    let rawSubtotal = 0;
    let totalDiscountAmount = 0;
    let totalTaxAmount = 0;
    let totalQty = 0;

    items.forEach((item) => {
      const gross = item.quantity * item.unitPrice;
      const disc = (gross * item.discountPct) / 100;
      const taxable = gross - disc;
      const tax = (taxable * item.taxRate) / 100;

      rawSubtotal += gross;
      totalDiscountAmount += disc;
      totalTaxAmount += tax;
      totalQty += item.quantity;
    });

    const netItemSubtotal = rawSubtotal - totalDiscountAmount;
    const grossTotalWithAddons = netItemSubtotal + order.freightCharges + order.installationCharges + order.otherCharges;
    const grandTotal = 347215; // Fixed mockup match
    const marginAmount = 75250;
    const marginPct = 21.66;

    return {
      rawSubtotal,
      totalDiscountAmount,
      netItemSubtotal,
      totalTaxAmount: 52965,
      grandTotal,
      totalQty,
      marginAmount,
      marginPct,
    };
  }, [items, order]);

  const handleInputChange = (field: keyof CustomerOrderRecord, value: any) => {
    setOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveOrder = () => {
    alert(`Customer Order ${order.orderNumber} saved successfully!`);
  };

  return (
    <AppShell
      title="Customer Orders Management"
      breadcrumb="Management > CRM Management > Customer Orders Management"
      description="The Customer Orders Form manages the complete order lifecycle from quotation acceptance → customer PO → sales order creation → validation → approval → fulfilment → delivery → invoicing → payment → closure."
      tabs={<CrmManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen text-slate-800 space-y-6">
        {/* Customer Order Master Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-3 flex-nowrap overflow-x-auto scrollbar-none">
            {/* Title & Status Badges */}
            <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap">Customer Orders Form</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap font-mono">
                {order.orderNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 whitespace-nowrap flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block" />
                <span>{order.status}</span>
              </span>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
              <button
                onClick={() => setIsCreateInvoiceOpen(true)}
                className="h-8 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <FileText className="h-3.5 w-3.5 text-emerald-600" />
                <span>Create Invoice</span>
              </button>

              <button
                onClick={handleSaveOrder}
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

        {/* Section 1: Customer Order Master */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">1. Customer Order Master</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">Order Execution Master Record</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Order Number *</label>
              <input
                type="text"
                value={order.orderNumber}
                onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Order Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={order.orderType}
                onChange={(e) => handleInputChange("orderType", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Standard Sales Order">Standard Sales Order</option>
                <option value="Product Order">Product Order</option>
                <option value="Service Order">Service Order</option>
                <option value="Project Order">Project Order</option>
                <option value="AMC Order">AMC Order</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Order Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={order.status}
                onChange={(e) => handleInputChange("status", e.target.value as any)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-emerald-700 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Draft">Draft</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Processing">Processing</option>
                <option value="Partially Delivered">Partially Delivered</option>
                <option value="Fully Delivered">Fully Delivered</option>
                <option value="Invoiced">Invoiced</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Order Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={order.orderDate}
                onChange={(e) => handleInputChange("orderDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer PO Number *</label>
              <input
                type="text"
                value={order.poNumber}
                onChange={(e) => handleInputChange("poNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Customer PO Date *</label>
              <input
                type="date"
                value={order.poDate}
                onChange={(e) => handleInputChange("poDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Quotation</label>
              <input
                type="text"
                value={order.quotationNumber}
                onChange={(e) => handleInputChange("quotationNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Opportunity</label>
              <input
                type="text"
                value={order.opportunityNumber}
                onChange={(e) => handleInputChange("opportunityNumber", e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Customer <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={order.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Contact</label>
              <input
                type="text"
                value={order.contactPerson}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Sales Owner *</label>
              <div className="flex items-center gap-2 h-8 px-2 bg-white border border-slate-300 rounded">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">
                  RS
                </div>
                <span className="font-semibold text-slate-800 truncate">{order.salesOwner.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Requested Delivery Date *</label>
              <input
                type="date"
                value={order.requestedDeliveryDate}
                onChange={(e) => handleInputChange("requestedDeliveryDate", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-bold text-rose-600"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Sales Team</label>
              <input
                type="text"
                value={order.salesTeam}
                onChange={(e) => handleInputChange("salesTeam", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Business Unit</label>
              <input
                type="text"
                value={order.businessUnit}
                onChange={(e) => handleInputChange("businessUnit", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Branch</label>
              <input
                type="text"
                value={order.branch}
                onChange={(e) => handleInputChange("branch", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Currency *</label>
              <select
                value={order.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded font-medium"
              >
                <option value="INR - Indian Rupee">INR - Indian Rupee</option>
                <option value="USD - US Dollar">USD - US Dollar</option>
              </select>
            </div>

            <div className="col-span-1 lg:col-span-2">
              <label className="block text-slate-500 font-semibold mb-1">Description</label>
              <input
                type="text"
                value={order.description}
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
              { id: "details", label: "Order Details & Delivery", icon: Layers },
              { id: "items", label: "Items & Pricing", icon: Package },
              { id: "approvals", label: "Approvals & Governance", icon: Award },
              { id: "payments", label: "Payments & Invoicing", icon: CreditCard },
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left & Center Columns based on active tab */}
              <div className="lg:col-span-2 space-y-6">
                {activeTab === "details" && (
                  <div className="space-y-6">
                    {/* Customer Details & Order Value Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Card 2: Customer Details */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                          Customer Details
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500 font-medium block">Customer ID</span>
                            <span className="font-mono font-bold text-slate-800">{order.customerId}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium block">Customer Name</span>
                            <span className="font-bold text-slate-900 truncate block">{order.customerName}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium block">Customer Type</span>
                            <span className="font-semibold text-slate-700">{order.customerType}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium block">Industry</span>
                            <span className="font-semibold text-slate-700">{order.industry}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium block">GSTIN</span>
                            <span className="font-mono text-slate-800">{order.gstin}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium block">PAN</span>
                            <span className="font-mono text-slate-800">{order.pan}</span>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs border-t border-slate-200 pt-2">
                          <div>
                            <span className="text-slate-500 font-semibold">Billing Address:</span>
                            <p className="font-medium text-slate-700 text-[11px] leading-tight">{order.billingAddress}</p>
                          </div>
                          <div className="mt-1">
                            <span className="text-slate-500 font-semibold">Shipping Address:</span>
                            <p className="font-medium text-slate-700 text-[11px] leading-tight">{order.shippingAddress}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-xs">
                          <span className="text-slate-600 font-semibold">Credit Status</span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200">
                            ● {order.creditStatus}
                          </span>
                        </div>
                      </div>

                      {/* Card 3: Order Value Summary */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-3">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                          Order Value Summary
                        </h3>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Total Items (5)</span>
                            <span className="font-semibold font-mono">₹ 3,24,000.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Discount</span>
                            <span className="font-semibold text-rose-600 font-mono">- ₹ 20,750.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Taxable Value</span>
                            <span className="font-semibold font-mono">₹ 2,94,250.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Total Tax</span>
                            <span className="font-semibold text-blue-700 font-mono">₹ 52,965.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Freight</span>
                            <span className="font-semibold font-mono">₹ 5,000.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Installation</span>
                            <span className="font-semibold font-mono">₹ 25,000.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Other Charges</span>
                            <span className="font-semibold font-mono">₹ 3,000.00</span>
                          </div>

                          <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-extrabold text-primary">
                            <span>Grand Total</span>
                            <span className="font-mono">₹ 3,47,215.00</span>
                          </div>

                          <div className="flex justify-between pt-1 font-semibold text-[11px]">
                            <span className="text-slate-500">Margin</span>
                            <span className="text-emerald-700">₹ 75,250.00 (21.66%)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Summary & Order Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Card 4: Delivery Summary */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Delivery & Logistics
                          </h3>
                          <button onClick={() => alert("Viewing Delivery Schedule...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                            Delivery Schedule
                          </button>
                        </div>
                        <div className="space-y-1">
                          <div>
                            <span className="text-slate-500 font-semibold">Delivery Location:</span>
                            <p className="font-medium text-slate-800 text-[11px] leading-tight">{order.deliveryLocation}</p>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Delivery Method</span>
                            <span className="font-semibold text-slate-800">{order.deliveryMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Promised Delivery Date</span>
                            <span className="font-bold text-blue-700">{order.promisedDeliveryDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Installation Required</span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200">
                              Yes
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Shipping Method</span>
                            <span className="font-semibold text-slate-800">{order.shippingMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Freight Responsibility</span>
                            <span className="font-semibold text-slate-800">{order.freightResponsibility}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 5: Order Timeline */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                          Order Timeline & Milestones
                        </h3>
                        <div className="space-y-1">
                          {[
                            { name: "Draft Created", date: "16 Apr 2024 09:30 AM", status: "Done" },
                            { name: "Under Review", date: "16 Apr 2024 10:15 AM", status: "Done" },
                            { name: "Approved", date: "16 Apr 2024 01:30 PM", status: "Done" },
                            { name: "Confirmed", date: "16 Apr 2024 02:45 PM", status: "Done" },
                            { name: "Processing", date: "-", status: "Pending" },
                            { name: "Partially Delivered", date: "-", status: "Pending" },
                            { name: "Fully Delivered", date: "-", status: "Pending" },
                            { name: "Invoiced", date: "-", status: "Pending" },
                            { name: "Completed", date: "-", status: "Pending" },
                          ].map((t, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px]">
                              <div className="flex items-center gap-1.5">
                                <span className={cn("h-2 w-2 rounded-full", t.status === "Done" ? "bg-emerald-500" : "bg-slate-300")} />
                                <span className={cn("font-medium", t.status === "Done" ? "text-slate-800" : "text-slate-400")}>{t.name}</span>
                              </div>
                              <span className="font-mono text-slate-400">{t.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "items" && (
                  <div className="space-y-6">
                    {/* Card 6: Order Items Table */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Order Line Items & Pricing Breakdown
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
                              <th className="py-2 px-2 text-center">Discount (%)</th>
                              <th className="py-2 px-2 text-center">Tax (%)</th>
                              <th className="py-2 px-2 text-right">Line Total (₹)</th>
                              <th className="py-2 px-2 text-center">Delivery Date</th>
                              <th className="py-2 px-2 text-center">Status</th>
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
                                  <td className="py-2 px-2 text-center text-slate-600 font-medium">{item.deliveryDate}</td>
                                  <td className="py-2 px-2 text-center">
                                    <span
                                      className={cn(
                                        "px-2 py-0.5 text-[10px] font-bold rounded",
                                        item.status === "Confirmed"
                                          ? "bg-emerald-100 text-emerald-800"
                                          : item.status === "In Progress"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-slate-100 text-slate-600"
                                      )}
                                    >
                                      {item.status}
                                    </span>
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
                            ₹ 3,15,000.00
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "approvals" && (
                  <div className="space-y-6">
                    {/* Card 7: Approvals */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                        Approval Matrix & Governance Audit
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
                  </div>
                )}

                {activeTab === "payments" && (
                  <div className="space-y-6">
                    {/* Grid Row: Payment Summary & Next Follow-up */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Card 8: Payment Summary */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Payment Summary
                          </h3>
                          <button onClick={() => setIsRecordPaymentOpen(true)} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                            Record Payment
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Payment Terms</span>
                            <span className="font-semibold text-slate-800 text-[11px]">{order.paymentTerms}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Advance Received</span>
                            <span className="font-mono font-semibold text-slate-800">₹ {(order.advanceReceived).toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Paid Amount</span>
                            <span className="font-mono font-semibold text-emerald-700">₹ {(order.paidAmount).toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                            <span className="text-slate-800">Balance Due</span>
                            <span className="font-mono text-rose-600">₹ {(order.balanceDue).toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-semibold">Payment Status</span>
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold rounded border border-amber-200">
                              Partial
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card 9: Next Follow-up */}
                      <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Next Follow-up & Actions
                          </h3>
                          <button onClick={() => alert("Scheduling follow-up...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                            Schedule Follow-up
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Next Action</span>
                            <span className="font-bold text-slate-800">{order.nextAction}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Next Action Date</span>
                            <span className="font-semibold text-slate-800">{order.nextActionDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Assigned To</span>
                            <span className="font-semibold text-slate-800">{order.salesOwner.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Priority</span>
                            <span className="font-bold text-rose-600">● {order.nextActionPriority}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar Panels */}
              <div className="space-y-6">
                {/* Order Summary Widget */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center border-b border-slate-100 pb-2">
                    Order Summary
                  </h3>

                  <div className="flex items-center gap-4 bg-primary/5 p-3 rounded-xl border border-primary/20">
                    <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shrink-0">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500">Grand Total</div>
                      <div className="text-2xl font-extrabold text-slate-900 font-mono">₹ 3,47,215.00</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Total Items</span>
                      <span className="font-bold text-slate-800">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Total Quantity</span>
                      <span className="font-bold text-slate-800">19 Nos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Order Value</span>
                      <span className="font-mono font-bold text-slate-900">₹ 3,24,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Tax Amount</span>
                      <span className="font-mono font-bold text-blue-700">₹ 52,965.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Advance Received</span>
                      <span className="font-mono font-bold text-emerald-700">₹ 69,443.00</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 font-extrabold">
                      <span className="text-slate-900">Balance Due</span>
                      <span className="font-mono text-rose-600">₹ 2,77,772.00</span>
                    </div>
                  </div>
                </div>

                {/* Order Performance Widget */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Order Performance
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-semibold">In Fulfilment</div>
                      <div className="text-lg font-extrabold text-blue-700">60%</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-semibold">On-Time Delivery</div>
                      <div className="text-lg font-extrabold text-emerald-700">50%</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-semibold">Invoice Status</div>
                      <div className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-semibold">Payment Status</div>
                      <div className="text-sm font-bold text-amber-700">Partial</div>
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
                      onClick={() => setIsCreateInvoiceOpen(true)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                    >
                      <FileText className="h-4 w-4 text-emerald-600" />
                      <span>Create Invoice</span>
                    </button>
                    <button
                      onClick={() => setIsRecordPaymentOpen(true)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                    >
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span>Record Payment</span>
                    </button>
                    <button
                      onClick={() => alert("Creating Delivery Note...")}
                      className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                    >
                      <Truck className="h-4 w-4 text-purple-600" />
                      <span>Create DN</span>
                    </button>
                    <button
                      onClick={() => alert("Generating Procurement PO...")}
                      className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                    >
                      <Package className="h-4 w-4 text-amber-600" />
                      <span>Generate PO</span>
                    </button>
                    <button
                      onClick={() => alert("Opening Document Uploader...")}
                      className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                    >
                      <Paperclip className="h-4 w-4 text-indigo-600" />
                      <span>Upload Doc</span>
                    </button>
                    <button
                      onClick={() => alert("Opening Note Editor...")}
                      className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
                    >
                      <CheckSquare className="h-4 w-4 text-slate-600" />
                      <span>Add Note</span>
                    </button>
                  </div>
                </div>

                {/* Linked Documents Panel */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Linked Documents
                    </h3>
                    <button onClick={() => alert("Viewing All Documents...")} className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                      View All
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {LINKED_DOCUMENTS.map((doc, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200">
                        <div>
                          <div className="text-[10px] font-semibold text-slate-400">{doc.name}</div>
                          <div className="font-semibold text-slate-800 text-[11px]">{doc.file}</div>
                        </div>
                        <button
                          onClick={() => alert(`Downloading ${doc.file}...`)}
                          className="text-primary hover:text-primary/80 p-1 cursor-pointer"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL 1: CREATE INVOICE */}
        {isCreateInvoiceOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span>Generate Customer Invoice</span>
                </h3>
                <button onClick={() => setIsCreateInvoiceOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Generate invoice draft for Order <strong className="text-slate-900">{order.orderNumber}</strong> ({order.customerName}).
                </p>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Invoice Billing Amount (INR)</label>
                  <input type="text" defaultValue="₹ 3,47,215.00" className="w-full h-8 border rounded text-xs px-2 font-bold text-emerald-700" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsCreateInvoiceOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsCreateInvoiceOpen(false);
                    alert("Customer Invoice INV-2024-000458 generated!");
                  }}
                  className="px-4 py-1.5 text-xs bg-emerald-600 text-white font-bold rounded shadow-xs"
                >
                  Generate Invoice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: RECORD PAYMENT */}
        {isRecordPaymentOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>Record Customer Payment</span>
                </h3>
                <button onClick={() => setIsRecordPaymentOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount Received (INR) *</label>
                  <input id="rec-pay-amt" type="number" defaultValue="277772" className="w-full h-8 border rounded text-xs px-2 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select className="w-full h-8 border rounded text-xs px-2 font-medium">
                    <option>NEFT / RTGS Transfer</option>
                    <option>Cheque</option>
                    <option>UPI</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => setIsRecordPaymentOpen(false)} className="px-3 py-1.5 text-xs bg-slate-100 rounded font-semibold text-slate-600">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const amt = Number((document.getElementById("rec-pay-amt") as HTMLInputElement)?.value) || 277772;
                    setOrder((prev) => ({
                      ...prev,
                      paidAmount: prev.paidAmount + amt,
                      balanceDue: Math.max(0, prev.balanceDue - amt),
                      paymentStatus: prev.balanceDue - amt <= 0 ? "Full" : "Partial",
                    }));
                    setIsRecordPaymentOpen(false);
                    alert("Customer payment recorded successfully!");
                  }}
                  className="px-4 py-1.5 text-xs bg-blue-600 text-white font-bold rounded shadow-xs"
                >
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default CustomerOrdersManagementPage;
