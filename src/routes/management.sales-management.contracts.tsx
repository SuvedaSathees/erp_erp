import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Printer,
  Save,
  Send,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle,
  FileCheck,
  ArrowUpRight,
  Zap,
  Repeat,
  DollarSign,
  Briefcase,
  FileBadge,
  Plus,
  Trash2,
  Search,
  X,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { SalesManagementTabBar } from "@/components/erp/SalesManagementTabBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/sales-management/contracts"
)({
  head: () => ({
    meta: [
      { title: "Contracts · Sales Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Stronger Partnerships. Sustainable Growth. — Commercial Agreements, Multi-year AMC, Delivery Milestones & SLA Compliance",
      },
    ],
  }),
  component: ContractsComponent,
});

const multiYearExecution = [
  { phase: "FY 2026-27 (Turnkey EPC & Dispatches)", value: 3.63, status: "Active" },
  { phase: "FY 2027-28 (AMC Y1 & 99.8% SLA)", value: 0.85, status: "Scheduled" },
  { phase: "FY 2028-29 (AMC Y2 & Firmware Ops)", value: 0.85, status: "Planned" },
];

const initialContractLines = [
  {
    id: 1,
    code: "MEGA-DC-180KW",
    description: "180kW Dual-Gun DC Heavy-Duty Ultra Fast Fleet Dispenser",
    qty: "8 NOS",
    freq: "One-Time Delivery",
    unitRate: 3250000,
    taxable: 26000000,
    gstRate: 18,
    gross: 30680000,
  },
  {
    id: 2,
    code: "GRID-SUB-500KVA",
    description: "500kVA Dedicated Substation Bay, HT Metering & Breaker Panel",
    qty: "4 LOT",
    freq: "Milestone Billing",
    unitRate: 1450000,
    taxable: 5800000,
    gstRate: 18,
    gross: 6844000,
  },
  {
    id: 3,
    code: "CIVIL-CANOPY-04",
    description: "Turnkey All-Weather Solarized Charging Canopy & Civil Foundations",
    qty: "4 SITE",
    freq: "Milestone Billing",
    unitRate: 1125000,
    taxable: 4500000,
    gstRate: 18,
    gross: 5310000,
  },
  {
    id: 4,
    code: "SLA-AMC-5YR",
    description: "5-Year 24/7 Mission-Critical SLA & 99.8% Uptime Maintenance Agreement",
    qty: "4 YR",
    freq: "Quarterly Advance",
    unitRate: 850000,
    taxable: 3400000,
    gstRate: 18,
    gross: 4012000,
  },
];

const initialStepperStages = [
  { id: 1, title: "Draft", status: "completed" },
  { id: 2, title: "Commercial Review", status: "completed" },
  { id: 3, title: "Legal Review", status: "completed" },
  { id: 4, title: "Finance Review", status: "completed" },
  { id: 5, title: "Customer Review", status: "completed" },
  { id: 6, title: "Execution", status: "completed" },
  { id: 7, title: "Active", status: "current" },
];

export default function ContractsComponent() {
  const [lines, setLines] = useState(initialContractLines);
  const [stepperStages, setStepperStages] = useState(initialStepperStages);
  const [version, setVersion] = useState("v1.0");
  const [contractStatus, setContractStatus] = useState("Active & Binding");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isAddScopeOpen, setIsAddScopeOpen] = useState(false);
  const [isAddendumOpen, setIsAddendumOpen] = useState(false);
  const [newScope, setNewScope] = useState({
    code: "EV-DC-30KW",
    description: "Commercial DC Fast Charger 30kW Dual CCS2 Guns",
    qty: "20 NOS",
    freq: "Milestone Delivery",
    unitRate: 450000,
  });

  const [addendumNote, setAddendumNote] = useState({
    title: "Addendum No. 1: Depot 5 Expansion",
    description: "Addition of 25 units of 11kW AC Dual Port chargers with 3-year AMC extension.",
    effectiveDate: "01-Oct-2026",
  });

  // Dynamic Valuation Calculations
  const totalTaxable = lines.reduce((acc, curr) => acc + curr.taxable, 0);
  const totalGst = Math.round(totalTaxable * 0.18);
  const grandTotal = totalTaxable + totalGst;

  const handlePrint = () => {
    toast.success("Formatting official legal contract document for printing...");
    window.print();
  };

  const handleSave = () => {
    const nextVer = version === "v1.0" ? "v1.1" : "v1.2";
    setVersion(nextVer);
    toast.success(`Master Agreement CON-2026-001 updated and saved as ${nextVer}!`);
  };

  const handleGeneratePdf = () => {
    toast.success("Master Agreement PDF compiled with digital signatures and stamp duty verified!");
  };

  const handleAddScope = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseInt(newScope.qty.replace(/[^0-9]/g, "")) || 1;
    const taxableVal = qtyNum * newScope.unitRate;
    const gstVal = Math.round(taxableVal * 0.18);
    const grossVal = taxableVal + gstVal;

    const item = {
      id: Date.now(),
      code: newScope.code,
      description: newScope.description,
      qty: newScope.qty,
      freq: newScope.freq,
      unitRate: newScope.unitRate,
      taxable: taxableVal,
      gstRate: 18,
      gross: grossVal,
    };

    setLines((prev) => [...prev, item]);
    setIsAddScopeOpen(false);
    toast.success(`Added scope item ${item.code} to contract schedule!`);
  };

  const handleDeleteLine = (id: number) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
    toast.info("Scope item removed from contract schedule.");
  };

  const handleSaveAddendum = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddendumOpen(false);
    toast.success(`Contract Addendum "${addendumNote.title}" registered! Sent to Legal for sign-off.`);
  };

  const filteredLines = lines.filter(
    (l) =>
      l.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell
      title="Contract Management"
      breadcrumb="Management > Sales Management > Contracts"
      description="Stronger Partnerships. Sustainable Growth. — Commercial Agreements, Multi-year AMC, Delivery Milestones & SLA Compliance"
      tabs={<SalesManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen space-y-4 pb-12">
        {/* Top Header Card with Integrated Stepper */}
        <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#0A3C75]/10 flex items-center justify-center text-[#0A3C75] shrink-0">
                <FileBadge className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">Contract Management</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
                    {contractStatus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                    CON-2026-001
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {version}
                  </span>
                </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2 shrink-0 flex-nowrap">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Contract
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" /> Save
              </button>
              <button
                onClick={handleGeneratePdf}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] cursor-pointer shadow-xs transition"
              >
                <FileCheck className="w-3.5 h-3.5" /> Generate PDF
              </button>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-5 pt-4 border-t border-border/50 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[760px] px-2">
              {stepperStages.map((step, idx) => (
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
                  {idx < stepperStages.length - 1 && (
                    <div className="h-[2px] w-8 sm:w-12 bg-slate-200 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* General Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Header, Parties, Products & Services, Multi-Year Trend */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Contract Header */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileBadge className="w-4 h-4 text-[#0A3C75]" />
                    Master Agreement Details
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Legally Binding & Active
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contract Title</span>
                    <span className="font-bold text-slate-800">EV Infra Supply & 3-Yr AMC</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contract Code</span>
                    <span className="font-bold text-slate-800 font-mono">CON-2026-001</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Agreement Nature</span>
                    <span className="font-bold text-[#0A3C75]">Master Supply & Service (MSA)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Governing Jurisdiction</span>
                    <span className="font-bold text-slate-800">High Court of Madras</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Effective Date</span>
                    <span className="font-bold text-slate-800">01-Apr-2026</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Expiry Date</span>
                    <span className="font-bold text-slate-800">31-Mar-2029</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contract Tenure</span>
                    <span className="font-bold text-[#0A3C75]">36 Months (3 Years)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Auto Renewal</span>
                    <span className="font-bold text-emerald-700">Yes (with 60-day notice)</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Contracting Parties */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0A3C75]" />
                    Contracting Entities & Authorized Signatories
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Stamp Duty Paid: ₹5,000 (E-Stamp)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">First Party (Supplier)</span>
                    <div className="font-bold text-slate-900 text-sm">Magnertia Technologies Private Limited</div>
                    <div className="text-slate-600">Plot 88, Electronic City Phase 1, Hosur Road, Bangalore</div>
                    <div className="text-slate-500 text-[11px] pt-1">
                      Authorized Signatory: <strong>R. Balasubramanian (CFO)</strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Second Party (Client)</span>
                    <div className="font-bold text-slate-900 text-sm">National Highway EV Infrastructure Corp (NHEIC)</div>
                    <div className="text-slate-600">Tower B, Core 4, SCOPE Complex, Lodhi Road, New Delhi - 110003</div>
                    <div className="text-slate-500 text-[11px] pt-1">
                      Authorized Signatory: <strong>Dr. Rajeshwar Rao (Chief Infrastructure Officer)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Scope of Products & Services */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#0A3C75]" />
                      Committed Deliverables & Tariff Schedule
                    </h3>
                    <p className="text-xs text-slate-500">Live billable scope line items, rates, taxable values, and committed SLAs</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 font-semibold bg-slate-100 px-2.5 py-1 rounded-md">
                      {filteredLines.length} Line Items
                    </span>
                    <button
                      onClick={() => setIsAddScopeOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] cursor-pointer shadow-xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Scope Item
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative pt-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search contract scope items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-80 pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                        <th className="p-2.5">Item Code</th>
                        <th className="p-2.5">Scope Description</th>
                        <th className="p-2.5 text-center">Qty / UOM</th>
                        <th className="p-2.5">Billing Cadence</th>
                        <th className="p-2.5 text-right">Contract Rate</th>
                        <th className="p-2.5 text-right">Taxable Subtotal</th>
                        <th className="p-2.5 text-right">Gross Total (GST)</th>
                        <th className="p-2.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLines.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-slate-400">
                            No scope items match search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredLines.map((line) => (
                          <tr key={line.id} className="hover:bg-slate-50/60 transition">
                            <td className="p-2.5 font-mono text-[11px] font-bold text-slate-600">{line.code}</td>
                            <td className="p-2.5 font-bold text-slate-900">{line.description}</td>
                            <td className="p-2.5 text-center font-bold text-slate-800">{line.qty}</td>
                            <td className="p-2.5 text-slate-600">{line.freq}</td>
                            <td className="p-2.5 text-right tabular-nums text-slate-700">
                              ₹{line.unitRate.toLocaleString("en-IN")}
                            </td>
                            <td className="p-2.5 text-right tabular-nums font-bold text-slate-800">
                              ₹{line.taxable.toLocaleString("en-IN")}
                            </td>
                            <td className="p-2.5 text-right tabular-nums font-bold text-[#0A3C75]">
                              ₹{line.gross.toLocaleString("en-IN")}
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => handleDeleteLine(line.id)}
                                className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition"
                                title="Remove line"
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

              {/* Card 4: Multi-Year Revenue Schedule */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <BarChart className="w-4 h-4 text-[#0A3C75]" />
                      3-Year Contract Milestone Revenue Realization (₹ Cr)
                    </h3>
                    <p className="text-xs text-slate-500">Scheduled rollout and recurring AMC commitments</p>
                  </div>
                  <span className="text-xs font-bold text-[#0A3C75]">Total: ₹3.23 Cr</span>
                </div>

                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={multiYearExecution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="phase" tick={{ fontSize: 11, fill: "#64748B" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#64748B" }} domain={[0, 2.5]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#06101E",
                          color: "#fff",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="value" fill="#0A3C75" radius={[4, 4, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Value Summary, Performance Rings, AI Copilot, Actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Value Summary Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Total Contract Valuation
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Approved
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Subtotal</span>
                    <span className="tabular-nums font-semibold">₹{totalTaxable.toLocaleString("en-IN")}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Applicable GST (18%)</span>
                    <span className="tabular-nums font-semibold">₹{totalGst.toLocaleString("en-IN")}.00</span>
                  </div>

                  <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-center bg-slate-50 p-2.5 rounded-lg">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Net Agreement Value</div>
                      <div className="text-lg font-black text-[#0A3C75] tabular-nums">₹{grandTotal.toLocaleString("en-IN")}.00</div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">36 Months</span>
                  </div>
                </div>
              </div>

              {/* Contract Performance Health Rings */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Contract Execution & SLA Health
                </h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-lg font-black text-[#0A3C75] tabular-nums">72%</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Delivered Units</div>
                    <div className="text-[10px] text-slate-400">108 / 150 Chargers</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-lg font-black text-[#0A3C75] tabular-nums">66%</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Billed Revenue</div>
                    <div className="text-[10px] text-slate-400">₹2.13 Cr Settled</div>
                  </div>
                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
                    <div className="text-lg font-black text-emerald-700 tabular-nums">99.4%</div>
                    <div className="text-[10px] font-bold text-emerald-800 uppercase mt-0.5">SLA Uptime</div>
                    <div className="text-[10px] text-emerald-600">Target: &gt;98.0%</div>
                  </div>
                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
                    <div className="text-lg font-black text-emerald-700 tabular-nums">96.2%</div>
                    <div className="text-[10px] font-bold text-emerald-800 uppercase mt-0.5">Collections</div>
                    <div className="text-[10px] text-emerald-600">Zero Default</div>
                  </div>
                </div>
              </div>

              {/* AI Contract Intelligence */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    AI Contract Sentinel
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700">Healthy</span>
                </div>
                <p className="bg-white p-2.5 rounded-lg border border-emerald-100 text-[11px] text-slate-700 leading-relaxed">
                  Q2 preventative maintenance milestone is due in 18 days across all 4 depot locations. 100% SLA compliance maintained.
                  Recommending early renewal proposal on 01-Jan-2029 with 3-year inflation lock clause.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Contract Workflows</h4>
                <button
                  onClick={() => toast.success("Drafting new Sales Order referencing Master Contract CON-2026-001...")}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-[#0A3C75] hover:bg-slate-50 transition text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#0A3C75]" />
                    Create Sales Order against Contract
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => setIsAddendumOpen(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-slate-50 transition text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Repeat className="w-3.5 h-3.5 text-emerald-600" />
                    Draft Addendum / Amendment
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Add Scope Item */}
        {isAddScopeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <FileBadge className="w-4 h-4 text-[#0A3C75]" />
                  <h3 className="text-sm font-bold text-slate-900">Add Deliverable Scope to Agreement</h3>
                </div>
                <button
                  onClick={() => setIsAddScopeOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddScope} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Item Code</label>
                    <input
                      type="text"
                      required
                      value={newScope.code}
                      onChange={(e) => setNewScope({ ...newScope, code: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Billing Cadence</label>
                    <select
                      value={newScope.freq}
                      onChange={(e) => setNewScope({ ...newScope, freq: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    >
                      <option value="One-Time Delivery">One-Time Delivery</option>
                      <option value="Milestone Delivery">Milestone Delivery</option>
                      <option value="Quarterly Advance">Quarterly Advance</option>
                      <option value="Annual Retainer">Annual Retainer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Scope Description</label>
                  <input
                    type="text"
                    required
                    value={newScope.description}
                    onChange={(e) => setNewScope({ ...newScope, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Quantity & UOM</label>
                    <input
                      type="text"
                      required
                      value={newScope.qty}
                      onChange={(e) => setNewScope({ ...newScope, qty: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Contract Unit Rate (₹)</label>
                    <input
                      type="number"
                      required
                      value={newScope.unitRate}
                      onChange={(e) => setNewScope({ ...newScope, unitRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddScopeOpen(false)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Deliverable
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Draft Addendum */}
        {isAddendumOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Draft Contract Addendum</h3>
                </div>
                <button
                  onClick={() => setIsAddendumOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveAddendum} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Addendum Title</label>
                  <input
                    type="text"
                    required
                    value={addendumNote.title}
                    onChange={(e) => setAddendumNote({ ...addendumNote, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Scope Change Description</label>
                  <textarea
                    rows={3}
                    required
                    value={addendumNote.description}
                    onChange={(e) => setAddendumNote({ ...addendumNote, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Effective Date</label>
                  <input
                    type="text"
                    required
                    value={addendumNote.effectiveDate}
                    onChange={(e) => setAddendumNote({ ...addendumNote, effectiveDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3C75]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddendumOpen(false)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 font-semibold flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Submit Addendum
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AppShell>
    );
  }
