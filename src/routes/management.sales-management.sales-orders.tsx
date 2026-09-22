import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { salesManagementService } from "@/services";
import {
  ShoppingCart,
  Printer,
  Copy,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Building2,
  FileCheck,
  Send,
  Calendar,
  Sparkles,
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Layers,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  Zap,
  Plus,
  Trash2,
  Search,
  X,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { SalesManagementTabBar } from "@/components/erp/SalesManagementTabBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/sales-management/sales-orders"
)({
  head: () => ({
    meta: [
      { title: "Sales Orders · Sales Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Convert Opportunities into Reality — Order Capture, ATP Verification, Invoicing & Delivery Integration",
      },
    ],
  }),
  component: SalesOrdersComponent,
});

const initialLineItems = [
  {
    id: 1,
    itemCode: "ORD-PKG-RET-20",
    description: "Commercial Retail Fast-Charger Package (22kW Dual AC Wallbox Units - Pack of 20)",
    hsn: "85044090",
    qty: 4,
    uom: "PACK",
    unitPrice: 480000,
    discount: 5,
    taxable: 1824000,
    gstRate: 18,
    gstAmount: 328320,
    total: 2152320,
    atpStatus: "In Stock (4/4 Packs)",
    atpColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    id: 2,
    itemCode: "ACC-CABLE-05",
    description: "High-Grade 5-Meter CCS2 Heavy Duty Charging Cable & Gun Assembly",
    hsn: "85444299",
    qty: 20,
    uom: "NOS",
    unitPrice: 18500,
    discount: 0,
    taxable: 370000,
    gstRate: 18,
    gstAmount: 66600,
    total: 436600,
    atpStatus: "In Stock (20/20)",
    atpColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    id: 3,
    itemCode: "ACC-RFID-02",
    description: "High-Durability Master RFID Cards & Smart Fleet Consoles",
    hsn: "85235210",
    qty: 10,
    uom: "SET",
    unitPrice: 9800,
    discount: 0,
    taxable: 98000,
    gstRate: 18,
    gstAmount: 17640,
    total: 115640,
    atpStatus: "Allocated (10/10)",
    atpColor: "text-sky-700 bg-sky-50 border-sky-200",
  },
];

const initialStepperSteps = [
  { id: 1, title: "Order Entry", status: "completed" },
  { id: 2, title: "Credit & Validation", status: "completed" },
  { id: 3, title: "Approval", status: "completed" },
  { id: 4, title: "Fulfillment", status: "current" },
  { id: 5, title: "Delivery", status: "pending" },
  { id: 6, title: "Invoice", status: "pending" },
  { id: 7, title: "Closure", status: "pending" },
];

export default function SalesOrdersComponent() {
  const ordersQuery = useQuery({
    queryKey: ["sales", "orders"],
    queryFn: () => salesManagementService.fetchSalesOrders(),
  });

  const [items, setItems] = useState(initialLineItems);
  const [stepperSteps, setStepperSteps] = useState(initialStepperSteps);
  const [orderStatus, setOrderStatus] = useState("Confirmed");
  const [orderNo, setOrderNo] = useState("SO-2026-00123");
  const [dbApplied, setDbApplied] = useState(false);

  useEffect(() => {
    const list = ordersQuery.data as any[] | undefined;
    if (list && list.length > 0 && !dbApplied) {
      const so = list[0];
      setOrderNo(so.orderNumber ?? orderNo);
      setOrderStatus(so.status ?? orderStatus);
      setDbApplied(true);
    }
  }, [ordersQuery.data, dbApplied]);
  const [searchItem, setSearchItem] = useState("");

  // Modals
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    itemCode: "ORD-PKG-RET-10",
    description: "Compact Retail 11kW Fleet Bundle (Pack of 10)",
    hsn: "85044090",
    qty: 5,
    uom: "PACK",
    unitPrice: 240000,
    discount: 5,
  });

  // Dynamic calculations
  const grossSubtotal = items.reduce((acc, curr) => acc + curr.qty * curr.unitPrice, 0);
  const totalTaxable = items.reduce((acc, curr) => acc + curr.taxable, 0);
  const orderDiscount = grossSubtotal - totalTaxable;
  const freight = 25000;
  const totalTaxableWithFreight = totalTaxable + freight;
  const cgst = Math.round(totalTaxableWithFreight * 0.09);
  const sgst = Math.round(totalTaxableWithFreight * 0.09);
  const grandTotal = totalTaxableWithFreight + cgst + sgst;

  const handlePrint = () => {
    toast.success("Preparing Sales Order PDF document for print/dispatch...");
    window.print();
  };

  const handleDuplicate = () => {
    const nextOrder = `SO-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderNo(nextOrder);
    setOrderStatus("Draft Copied");
    toast.success(`Sales Order cloned into new draft ${nextOrder}!`);
  };

  const handleGenerateInvoice = () => {
    setIsInvoiceModalOpen(true);
  };

  const handleConfirmInvoice = () => {
    setOrderStatus("Invoiced");
    setStepperSteps((prev) =>
      prev.map((s) =>
        s.id <= 6 ? { ...s, status: "completed" } : s.id === 7 ? { ...s, status: "current" } : s
      )
    );
    setIsInvoiceModalOpen(false);
    toast.success(`Tax Invoice INV-2026-0091 generated for ₹${grandTotal.toLocaleString("en-IN")}! Sent to customer accounting.`);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const taxableVal = Math.round(newItem.qty * newItem.unitPrice * (1 - newItem.discount / 100));
    const gstVal = Math.round(taxableVal * 0.18);
    const lineTot = taxableVal + gstVal;

    const item = {
      id: Date.now(),
      itemCode: newItem.itemCode,
      description: newItem.description,
      hsn: newItem.hsn,
      qty: newItem.qty,
      uom: newItem.uom,
      unitPrice: newItem.unitPrice,
      discount: newItem.discount,
      taxable: taxableVal,
      gstRate: 18,
      gstAmount: gstVal,
      total: lineTot,
      atpStatus: "In Stock (Available)",
      atpColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    };

    setItems((prev) => [...prev, item]);
    setIsAddItemOpen(false);
    toast.success(`Added ${item.itemCode} to Sales Order!`);
  };

  const handleDeleteItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.info("Line item removed from Sales Order.");
  };

  const handleSendConfirmation = () => {
    toast.success("Sales Order Confirmation & Proforma emailed to karthik.selvam@si-evmobility.com");
  };

  const handleCreatePickList = () => {
    setStepperSteps((prev) =>
      prev.map((s) => (s.id === 4 ? { ...s, status: "completed" } : s.id === 5 ? { ...s, status: "current" } : s))
    );
    toast.success("Warehouse Pick List WH-PK-891 created & assigned to Coimbatore Regional Depot team!");
  };

  const filteredItems = items.filter((item) =>
    item.description.toLowerCase().includes(searchItem.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <AppShell
      title="Sales Order"
      breadcrumb="Management > Sales Management > Sales Orders"
      description="Convert Opportunities into Reality — Order Capture, ATP Verification, Invoicing & Delivery Integration"
      tabs={<SalesManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen space-y-4 pb-12">
        {/* Top Header Card with Integrated Stepper */}
        <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#0A3C75]/10 flex items-center justify-center text-[#0A3C75] shrink-0">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">Sales Order</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 shrink-0">
                    {orderStatus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
                    {orderNo}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    v1.0
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  Convert Opportunities into Reality — Order Capture, ATP Verification, Invoicing & Delivery Integration
                </p>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2 shrink-0 flex-nowrap">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Order
              </button>
              <button
                onClick={handleDuplicate}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition shadow-xs"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" /> Duplicate
              </button>
              <button
                onClick={handleGenerateInvoice}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] cursor-pointer shadow-xs transition"
              >
                <Receipt className="w-3.5 h-3.5" /> Generate Invoice
              </button>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-5 pt-4 border-t border-border/50 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[760px] px-2">
              {stepperSteps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors",
                        step.status === "completed"
                          ? "bg-emerald-600 text-white"
                          : step.status === "current"
                          ? "bg-[#0A3C75] text-white shadow-xs"
                          : "bg-slate-100 text-slate-500 border border-border"
                      )}
                    >
                      {step.status === "completed" ? "✓" : step.id}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-800 leading-tight">{step.title}</p>
                      <p
                        className={cn(
                          "text-[10px] font-medium leading-tight",
                          step.status === "completed"
                            ? "text-emerald-700"
                            : step.status === "current"
                            ? "text-[#0A3C75] font-semibold"
                            : "text-slate-400"
                        )}
                      >
                        {step.status === "completed" ? "Complete" : step.status === "current" ? "In Progress" : "Pending"}
                      </p>
                    </div>
                  </div>
                  {idx < stepperSteps.length - 1 && (
                    <div className="h-[2px] w-8 sm:w-12 bg-slate-200 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Order Header, Customer, Line Items, Delivery */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Order Information */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#0A3C75]" />
                    Order Header & References
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#0A3C75] border border-blue-200">
                    Direct Sales (Enterprise)
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Order Date</span>
                    <span className="font-bold text-slate-800">06-Sep-2026</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Order Type</span>
                    <span className="font-bold text-slate-800">Standard Commercial</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Linked Quotation</span>
                    <span className="font-bold text-[#0A3C75] hover:underline cursor-pointer">
                      QT-2026-00782
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">CRM Opportunity</span>
                    <span className="font-bold text-[#0A3C75] hover:underline cursor-pointer">
                      OPP-2026-00419
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Customer PO Ref</span>
                    <span className="font-bold text-slate-800">PO-8821-SIEV</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Business Unit</span>
                    <span className="font-bold text-slate-800">Retail Distribution & CPO</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Credit Limit Status</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Approved
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Payment Terms</span>
                    <span className="font-bold text-slate-800">30 Days Net Commercial</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Customer Profile */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    Customer & Consignee Information
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Customer ID: <strong className="text-slate-800">CUST-00219</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  {/* Bill To */}
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Billing Address</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        GSTIN Verified
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">South India EV Mobility Pvt. Ltd.</div>
                    <div className="text-slate-600">74/2, Avinashi Road Commercial Corridor, Peelamedu,</div>
                    <div className="text-slate-600">Coimbatore, Tamil Nadu - 641004</div>
                    <div className="text-slate-500 text-[11px] pt-1">
                      GSTIN: <strong className="text-slate-700">33AAECS5542P1ZV</strong> | PAN:{" "}
                      <strong className="text-slate-700">AAECS5542P</strong>
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 pt-1 text-[11px]">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-[#0A3C75]" /> Karthik Selvam
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#0A3C75]" /> +91 94432 78901
                      </span>
                    </div>
                  </div>

                  {/* Ship To */}
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Shipping Address</span>
                      <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded">
                        Regional Logistics Hub
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">Consolidated Logistics Park - Shed B-4</div>
                    <div className="text-slate-600">Sulur Bypass Highway Hub, Nilambur Junction,</div>
                    <div className="text-slate-600">Coimbatore, Tamil Nadu - 641402</div>
                    <div className="text-slate-500 text-[11px] pt-1">
                      Site Contact: <strong className="text-slate-700">Manikandan R. (Warehouse Head)</strong>
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 pt-1 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" /> +91 98940 12389
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-emerald-600" /> warehouse.cbe@si-evmobility.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Line Items Table */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#0A3C75]" />
                      Order Line Items & Committed Delivery
                    </h3>
                    <p className="text-xs text-slate-500">Live billable items, quantities, HSN codes, discounts and ATP stock status</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 font-semibold bg-slate-100 px-2.5 py-1 rounded-md">
                      {filteredItems.length} Items Listed
                    </span>
                    <button
                      onClick={() => setIsAddItemOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] cursor-pointer shadow-xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Item
                    </button>
                  </div>
                </div>

                {/* Search Item Filter */}
                <div className="relative pt-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter line items by code or description..."
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    className="w-full sm:w-80 pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Item & Description</th>
                        <th className="p-2.5">HSN/SAC</th>
                        <th className="p-2.5 text-center">Qty / UOM</th>
                        <th className="p-2.5 text-right">Unit Price</th>
                        <th className="p-2.5 text-right">Disc %</th>
                        <th className="p-2.5 text-right">Taxable Value</th>
                        <th className="p-2.5 text-center">ATP Inventory</th>
                        <th className="p-2.5 text-right">Line Total</th>
                        <th className="p-2.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredItems.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="p-6 text-center text-slate-400">
                            No items found matching filter.
                          </td>
                        </tr>
                      ) : (
                        filteredItems.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50/60 transition">
                            <td className="p-2.5 text-slate-400">{idx + 1}</td>
                            <td className="p-2.5">
                              <div className="font-bold text-slate-900">{item.description}</div>
                              <span className="text-[10px] text-slate-400 font-mono">{item.itemCode}</span>
                            </td>
                            <td className="p-2.5 text-slate-500 font-mono">{item.hsn}</td>
                            <td className="p-2.5 text-center font-bold text-slate-800">
                              {item.qty} <span className="text-[10px] text-slate-400 font-normal">{item.uom}</span>
                            </td>
                            <td className="p-2.5 text-right tabular-nums text-slate-700">
                              ₹{item.unitPrice.toLocaleString("en-IN")}
                            </td>
                            <td className="p-2.5 text-right text-emerald-600 font-semibold">{item.discount}%</td>
                            <td className="p-2.5 text-right tabular-nums font-bold text-slate-800">
                              ₹{item.taxable.toLocaleString("en-IN")}
                            </td>
                            <td className="p-2.5 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${item.atpColor}`}
                              >
                                {item.atpStatus}
                              </span>
                            </td>
                            <td className="p-2.5 text-right tabular-nums font-bold text-[#0A3C75]">
                              ₹{item.total.toLocaleString("en-IN")}
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card 4: Delivery & Warehouse Logistics */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600" />
                  Dispatch & Logistics Execution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Target Dispatch Date</span>
                    <span className="font-bold text-slate-800">22-Sep-2026</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Promised Site Handover</span>
                    <span className="font-bold text-slate-800">25-Sep-2026</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Dispatch Warehouse</span>
                    <span className="font-bold text-slate-800">Coimbatore Regional Depot (WH-03)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Logistics Partner</span>
                    <span className="font-bold text-slate-800">TCI Express Freight Logistics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Commercial Summary, ATP Status, Payment Schedule, Actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Commercial Financial Summary Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Commercial Summary
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">INR (₹)</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Gross Subtotal</span>
                    <span className="tabular-nums font-semibold">₹{grossSubtotal.toLocaleString("en-IN")}.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Order Level Discount</span>
                    <span className="tabular-nums font-semibold">-₹{orderDiscount.toLocaleString("en-IN")}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Freight, Handling & Insurance</span>
                    <span className="tabular-nums font-semibold">+₹{freight.toLocaleString("en-IN")}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-800 font-bold pt-1.5 border-t border-slate-100">
                    <span>Total Taxable Amount</span>
                    <span className="tabular-nums">₹{totalTaxableWithFreight.toLocaleString("en-IN")}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>CGST (9%)</span>
                    <span className="tabular-nums font-semibold">₹{cgst.toLocaleString("en-IN")}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SGST (9%)</span>
                    <span className="tabular-nums font-semibold">₹{sgst.toLocaleString("en-IN")}.00</span>
                  </div>

                  <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-center bg-slate-50 p-2.5 rounded-lg">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Grand Total</div>
                      <div className="text-lg font-black text-[#0A3C75] tabular-nums">₹{grandTotal.toLocaleString("en-IN")}.00</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      GST Inclusive
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestone Payment Schedule Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#0A3C75]" />
                    Milestone Payment Terms
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-600">30% Received</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">1. Advance Payment (30%)</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">Settled via NEFT • 07-Sep-2026</div>
                    </div>
                    <span className="font-black text-slate-900 tabular-nums">₹{Math.round(grandTotal * 0.3).toLocaleString("en-IN")}</span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/40 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">2. Before Dispatch (50%)</div>
                      <div className="text-[10px] text-amber-700 font-semibold">Due prior to warehouse release</div>
                    </div>
                    <span className="font-black text-slate-900 tabular-nums">₹{Math.round(grandTotal * 0.5).toLocaleString("en-IN")}</span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">3. Site Installation (15%)</div>
                      <div className="text-[10px] text-slate-500">Upon successful commissioning</div>
                    </div>
                    <span className="font-bold text-slate-800 tabular-nums">₹{Math.round(grandTotal * 0.15).toLocaleString("en-IN")}</span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">4. Retention / Warranty (5%)</div>
                      <div className="text-[10px] text-slate-500">180 Days post site handover</div>
                    </div>
                    <span className="font-bold text-slate-800 tabular-nums">₹{Math.round(grandTotal * 0.05).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* AI Order Insights */}
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    AI Fulfillment Copilot
                  </h4>
                  <span className="text-[10px] font-bold bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-full">
                    Optimized
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-2">
                  <p className="bg-white p-2.5 rounded-lg border border-emerald-100 text-[11px] leading-relaxed">
                    <strong className="text-slate-900 block mb-0.5">Automated Sourcing Recommendation:</strong>
                    RFID mounting kits (6 units shortage) can be inter-depot transferred from Bangalore Hub in 24 hours,
                    avoiding supplier lead time of 7 days.
                  </p>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Next Actions</h4>
                <button
                  onClick={handleSendConfirmation}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-[#0A3C75] hover:bg-slate-50 transition text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-[#0A3C75]" />
                    Send Order Confirmation to Customer
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={handleCreatePickList}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-slate-50 transition text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Create Warehouse Pick List & Dispatch Note
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={handleGenerateInvoice}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-sky-600 hover:bg-slate-50 transition text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Receipt className="w-3.5 h-3.5 text-sky-600" />
                    Generate Proforma / Advance Invoice
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Add Line Item */}
        {isAddItemOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#0A3C75]" />
                  <h3 className="text-sm font-bold text-slate-900">Add Line Item to Sales Order</h3>
                </div>
                <button
                  onClick={() => setIsAddItemOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Item Code</label>
                    <input
                      type="text"
                      required
                      value={newItem.itemCode}
                      onChange={(e) => setNewItem({ ...newItem, itemCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">HSN/SAC Code</label>
                    <input
                      type="text"
                      required
                      value={newItem.hsn}
                      onChange={(e) => setNewItem({ ...newItem, hsn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Item Description</label>
                  <input
                    type="text"
                    required
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                  />
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Quantity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newItem.qty}
                      onChange={(e) => setNewItem({ ...newItem, qty: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">UOM</label>
                    <input
                      type="text"
                      value={newItem.uom}
                      onChange={(e) => setNewItem({ ...newItem, uom: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Unit Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newItem.unitPrice}
                      onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Disc (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={newItem.discount}
                      onChange={(e) => setNewItem({ ...newItem, discount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between text-xs text-blue-900">
                  <span>Estimated Line Total (incl. 18% GST):</span>
                  <span className="font-bold text-sm">
                    ₹{Math.round(newItem.qty * newItem.unitPrice * (1 - newItem.discount / 100) * 1.18).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddItemOpen(false)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add to Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Generate Invoice */}
        {isInvoiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#0A3C75]" />
                  <h3 className="text-sm font-bold text-slate-900">Generate Commercial Tax Invoice</h3>
                </div>
                <button
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  Generate official GST Tax Invoice for Sales Order <span className="font-bold text-slate-900">{orderNo}</span> billed to{" "}
                  <span className="font-bold text-slate-900">GreenFuture Enterprises Ltd.</span>
                </p>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex justify-between text-slate-700">
                    <span>Taxable Value:</span>
                    <span className="font-bold text-slate-900">₹{totalTaxableWithFreight.toLocaleString("en-IN")}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>GST (CGST + SGST 18%):</span>
                    <span className="font-bold text-slate-900">₹{(cgst + sgst).toLocaleString("en-IN")}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-700 font-bold border-t border-slate-200 pt-1">
                    <span>Total Invoice Amount:</span>
                    <span className="text-emerald-700 text-sm">₹{grandTotal.toLocaleString("en-IN")}.00</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmInvoice}
                    className="px-4 py-1.5 rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] font-semibold flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Confirm & Issue Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AppShell>
    );
  }
