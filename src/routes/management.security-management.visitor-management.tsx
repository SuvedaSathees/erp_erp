// Magnertia ERP - Visitor Management
// Management → Security Management → Physical Security → Visitor Management
// Aligned with Screenshot 2 & MAICW Specification

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  UserCheck,
  UserPlus,
  Shield,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Camera,
  QrCode,
  Download,
  Printer,
  ChevronRight,
  ArrowRight,
  X,
  Sparkles,
  FileText,
  BadgeCheck,
  Building,
  KeyRound,
  FileCheck,
  Sliders,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { SecurityManagementTabBar } from "@/components/erp/SecurityManagementTabBar";
import { SecuritySubmoduleHeader } from "@/components/erp/SecuritySubmoduleHeader";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import { cn } from "@/lib/utils";
import {
  mockTodayVisitors,
  mockVisitorRequestsList,
  type VisitorRecord,
} from "@/services/securityManagementService";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/management/security-management/visitor-management"
)({
  head: () => ({
    meta: [
      { title: "Visitor Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Controlled visitor registration, identity verification, host approval, temporary badge issuance, escort tracking, and automated check-in/out.",
      },
    ],
  }),
  component: VisitorManagementPage,
});

// Chart colors
const PURPOSE_COLORS = [
  "#2563eb",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#10b981",
  "#ec4899",
  "#64748b",
];

const STATUS_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];
const BADGE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#64748b"];

const PURPOSE_DATA = [
  { name: "Meeting", value: 32 },
  { name: "Customer Visit", value: 18 },
  { name: "Vendor/Supplier", value: 14 },
  { name: "Audit/Inspection", value: 11 },
  { name: "Training", value: 7 },
  { name: "Maintenance", value: 7 },
  { name: "Interview", value: 4 },
  { name: "Others", value: 7 },
];

const FACILITY_VISITOR_DATA = [
  { facility: "Plant 2 - Coimbatore", count: 10 },
  { facility: "Head Office - Namakkal", count: 7 },
  { facility: "R&D Centre", count: 5 },
  { facility: "Warehouse", count: 3 },
  { facility: "Charging Station Site", count: 2 },
];

const VISITOR_TREND_DATA = [
  { day: "15 Sep", expected: 20, checkedIn: 18, checkedOut: 16 },
  { day: "16 Sep", expected: 22, checkedIn: 20, checkedOut: 19 },
  { day: "17 Sep", expected: 25, checkedIn: 23, checkedOut: 21 },
  { day: "18 Sep", expected: 21, checkedIn: 19, checkedOut: 17 },
  { day: "19 Sep", expected: 24, checkedIn: 22, checkedOut: 20 },
  { day: "20 Sep", expected: 18, checkedIn: 16, checkedOut: 15 },
  { day: "21 Sep", expected: 28, checkedIn: 25, checkedOut: 23 },
  { day: "22 Sep", expected: 30, checkedIn: 27, checkedOut: 25 },
  { day: "23 Sep", expected: 26, checkedIn: 24, checkedOut: 22 },
  { day: "24 Sep", expected: 29, checkedIn: 26, checkedOut: 24 },
  { day: "25 Sep", expected: 32, checkedIn: 28, checkedOut: 26 },
  { day: "26 Sep", expected: 35, checkedIn: 30, checkedOut: 28 },
  { day: "27 Sep", expected: 28, checkedIn: 25, checkedOut: 23 },
  { day: "28 Sep", expected: 31, checkedIn: 27, checkedOut: 19 },
];

const BADGE_DISTRIBUTION = [
  { name: "Employee", value: 342 },
  { name: "Visitor", value: 86 },
  { name: "Contractor", value: 42 },
  { name: "Temporary", value: 10 },
  { name: "VIP", value: 4 },
  { name: "Others", value: 2 },
];

function VisitorManagementPage() {
  const [visitors, setVisitors] = useState<VisitorRecord[]>(mockTodayVisitors);
  const [visitorFilterTab, setVisitorFilterTab] = useState<
    "All" | "Expected" | "Checked-In" | "On-Site" | "Checked-Out"
  >("All");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRecord | null>(null);

  // Walk-in Check-In Stepper State
  const [checkInStep, setCheckInStep] = useState<number>(1);
  const [selectedIdType, setSelectedIdType] = useState<string>("Aadhaar Card");
  const [walkinName, setWalkinName] = useState("Rajesh Kumar");
  const [walkinOrg, setWalkinOrg] = useState("AlphaCorp Tech");
  const [walkinPurpose, setWalkinPurpose] = useState("Customer Visit");
  const [walkinHost, setWalkinHost] = useState("Priya Sharma");
  const [walkinFacility, setWalkinFacility] = useState("Access Room - Factory Tour");
  const [escortRequired, setEscortRequired] = useState(true);
  const [isIdentityVerified, setIsIdentityVerified] = useState(true);

  // Modal State
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [newVisitorName, setNewVisitorName] = useState("");
  const [newVisitorOrg, setNewVisitorOrg] = useState("");
  const [newVisitorHost, setNewVisitorHost] = useState("Priya Sharma");
  const [newVisitorPurpose, setNewVisitorPurpose] = useState("Business Discussion");


  const filteredVisitors = visitors.filter((v) => {
    if (visitorFilterTab === "All") return true;
    if (visitorFilterTab === "Checked-In") return v.status === "Checked-In";
    if (visitorFilterTab === "On-Site") return v.status === "On-Site";
    if (visitorFilterTab === "Expected") return v.status === "Expected";
    if (visitorFilterTab === "Checked-Out") return v.status === "Checked-Out";
    return true;
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitorName.trim()) {
      toast.error("Please enter a visitor name.");
      return;
    }
    const newRecord: VisitorRecord = {
      id: `vis-${Date.now()}`,
      name: newVisitorName,
      organization: newVisitorOrg || "External Organization",
      purpose: newVisitorPurpose,
      host: newVisitorHost,
      visitDate: "2026-09-28",
      time: "14:00",
      status: "Expected",
      badgeNo: `VIS-${Math.floor(100 + Math.random() * 900)}`,
      badgeType: "Visitor",
      idType: "Aadhaar Card",
      idReference: "XXXX 5678 9012",
      mobile: "+91 98000 11223",
      email: `${newVisitorName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      accessZone: "Main Conference Room",
      escortRequired: true,
      ndaSigned: true,
      riskLevel: "Low",
      facility: "Plant 2 - Coimbatore",
    };

    setVisitors([newRecord, ...visitors]);
    setShowNewRequestModal(false);
    setNewVisitorName("");
    setNewVisitorOrg("");
    toast.success(`Visit request registered for ${newRecord.name} (Badge: ${newRecord.badgeNo})`);
  };

  const handleStepNext = () => {
    if (checkInStep < 5) {
      setCheckInStep(checkInStep + 1);
      toast.info(`Proceeded to Step ${checkInStep + 1}`);
    } else {
      toast.success(`Check-In Completed! Badge VIS-084 issued to ${walkinName}.`);
      setCheckInStep(1);
    }
  };

  const handleStepPrev = () => {
    if (checkInStep > 1) {
      setCheckInStep(checkInStep - 1);
    }
  };

  return (
    <AppShell
      title="Visitor Management"
      breadcrumb="Management > Security Management > Visitor Management"
      description="Automated visitor registration, guest identity verification, digital badge issuing, host approval workflows, and facility escort tracking."
      tabs={<SecurityManagementTabBar />}
    >
      <div className="space-y-4 pb-16">
        {/* Executive Submodule Header */}
        <SecuritySubmoduleHeader
          icon={Users}
          title="Visitor Management"
          code="VIS-2026-001"
          status="Active"
          subtitle="Streamlined front-desk check-in, Aadhaar/ID verification, automated NDA signing, visitor zone restrictions, and real-time on-site logging."
          slogan="Secure Visitors. Safe Facilities. A Safer Tomorrow."
          bannerQuote="Ensuring seamless hospitality with zero-trust physical security across all Magnertia corporate, factory, and R&D facilities."
          primaryActionLabel="+ New Visitor Request"
          onPrimaryAction={() => setShowNewRequestModal(true)}
          onGenerateReport={() => toast.success("Exporting Daily Visitor Activity Report...")}
          onMoreActions={(act) => toast.info(`Action: ${act}`)}
        />

        {/* Executive 7-Gauge Circular Score Banner matching Screenshot */}
        <ProductScoreBanner submoduleKey="visitor-management" />


        {/* KPI Metrics Cards Matching Screenshot 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Visitors Today</span>
            <div className="text-xl font-bold text-slate-900 mt-1">27</div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">↑ 12% vs prev day</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Expected</span>
            <div className="text-xl font-bold text-slate-900 mt-1">31</div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">↑ 8% vs prev day</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Checked-In</span>
            <div className="text-xl font-bold text-emerald-600 mt-1">19</div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">↑ 18%</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Checked-Out</span>
            <div className="text-xl font-bold text-slate-700 mt-1">11</div>
            <span className="text-[10px] text-slate-500 font-semibold mt-0.5">↑ 5%</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Currently On-Site</span>
            <div className="text-xl font-bold text-blue-600 mt-1">8</div>
            <span className="text-[10px] text-blue-600 font-semibold mt-0.5">↓ 20%</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Pending Approvals</span>
            <div className="text-xl font-bold text-amber-600 mt-1">6</div>
            <span className="text-[10px] text-amber-600 font-semibold mt-0.5">↓ 25%</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Overdue Visitors</span>
            <div className="text-xl font-bold text-rose-600 mt-1">2</div>
            <span className="text-[10px] text-rose-600 font-semibold mt-0.5">↑ 100%</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Contractors On-Site</span>
            <div className="text-xl font-bold text-purple-600 mt-1">18</div>
            <span className="text-[10px] text-purple-600 font-semibold mt-0.5">↑ 6%</span>
          </div>
        </div>

        {/* Main Content Layout: Left 2/3 and Right 1/3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT 2/3 COLUMN */}
          <div className="lg:col-span-2 space-y-4">
            {/* Charts Row: Trend (14 Days) + Visit by Purpose */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trend Chart */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-900">
                    Visitor Trend (Last 14 Days)
                  </h3>
                  <button
                    onClick={() => toast.info("Opening 14-day trend analysis view")}
                    className="text-[11px] text-blue-600 font-semibold hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={VISITOR_TREND_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                      <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          color: "#fff",
                          borderRadius: "8px",
                          fontSize: "11px",
                        }}
                      />
                      <Bar dataKey="checkedIn" name="Checked-In" fill="#10b981" barSize={10} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="checkedOut" name="Checked-Out" fill="#f59e0b" barSize={10} radius={[2, 2, 0, 0]} />
                      <Line type="monotone" dataKey="expected" name="Expected" stroke="#2563eb" strokeWidth={2} dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Purpose Donut */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900">Visit by Purpose</h3>
                  <button
                    onClick={() => toast.info("Filtering visits by purpose categories")}
                    className="text-[11px] text-blue-600 font-semibold hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-36 w-36 shrink-0 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={PURPOSE_DATA}
                          innerRadius={36}
                          outerRadius={56}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {PURPOSE_DATA.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PURPOSE_COLORS[index % PURPOSE_COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                      <div className="text-xs font-bold text-slate-900">27</div>
                      <div className="text-[9px] text-slate-500">Today</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                    {PURPOSE_DATA.map((p, idx) => (
                      <div key={p.name} className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: PURPOSE_COLORS[idx] }}
                        />
                        <span className="text-slate-600 truncate">{p.name}</span>
                        <span className="font-bold text-slate-900 ml-auto">{p.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities Bar & Visit Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Facility-wise Visitors */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900">Facility-wise Visitors</h3>
                  <button
                    onClick={() => toast.info("Viewing all facility visitor counts")}
                    className="text-[11px] text-blue-600 font-semibold hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2 mt-2">
                  {FACILITY_VISITOR_DATA.map((fac) => (
                    <div key={fac.facility} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-700 font-medium">{fac.facility}</span>
                        <span className="font-bold text-slate-900">{fac.count}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(fac.count / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges & Compliance Gauges */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <h3 className="text-xs font-bold text-slate-900 mb-2">Badge & Compliance Posture</h3>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-xs text-slate-500 font-medium">Active Badges</div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">486</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">98.5% Return Rate</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <div className="text-xs text-emerald-800 font-medium">Visitor Compliance</div>
                    <div className="text-lg font-bold text-emerald-700 mt-0.5">97.6%</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">NDA + Briefing OK</div>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Overstay Rate: <strong className="text-slate-900">1.2%</strong></span>
                  <span>Escort Adherence: <strong className="text-emerald-700">92.1%</strong></span>
                </div>
              </div>
            </div>

            {/* Today's Visitors Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Today's Visitors</h3>
                  <p className="text-[11px] text-slate-500">Live check-in log and host sponsorships</p>
                </div>
                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                  {(["All", "Expected", "Checked-In", "On-Site", "Checked-Out"] as const).map(
                    (f) => (
                      <button
                        key={f}
                        onClick={() => setVisitorFilterTab(f)}
                        className={cn(
                          "px-2.5 py-1 rounded-md font-medium text-[11px] transition-colors",
                          visitorFilterTab === f
                            ? "bg-white text-slate-900 font-bold shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        )}
                      >
                        {f}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="px-3 py-2.5">Time</th>
                      <th className="px-3 py-2.5">Visitor</th>
                      <th className="px-3 py-2.5">Organization</th>
                      <th className="px-3 py-2.5">Purpose</th>
                      <th className="px-3 py-2.5">Host</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredVisitors.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-3 py-2.5 font-mono text-slate-500">{v.time}</td>
                        <td className="px-3 py-2.5 font-medium text-slate-900">
                          {v.name}
                          <span className="block text-[10px] text-slate-400 font-mono">
                            {v.badgeNo}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">{v.organization}</td>
                        <td className="px-3 py-2.5 text-slate-600">{v.purpose}</td>
                        <td className="px-3 py-2.5 font-medium text-blue-700">{v.host}</td>
                        <td className="px-3 py-2.5">
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full",
                              v.status === "Checked-In"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : v.status === "On-Site"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : v.status === "Expected"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-slate-100 text-slate-700"
                            )}
                          >
                            {v.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedVisitor(v);
                              toast.info(`Viewing pass for ${v.name}`);
                            }}
                            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-blue-600"
                            title="View Visitor Pass"
                          >
                            <ExternalLink className="h-3.5 w-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Requests & Upcoming Visits Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Requests */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900">Recent Visitor Requests</h3>
                  <span className="text-[11px] text-blue-600 font-semibold cursor-pointer">View All</span>
                </div>
                <div className="space-y-2 mt-2">
                  {mockVisitorRequestsList.map((req) => (
                    <div
                      key={req.id}
                      className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{req.visitorName}</div>
                        <div className="text-[11px] text-slate-500">
                          {req.organization} • {req.purpose}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded",
                            req.approvalStatus === "Approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          )}
                        >
                          {req.approvalStatus}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{req.requestNo}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Stepper Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-2">
                    Visitor Approval & Check-In Lifecycle
                  </h3>
                  <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                    Zero-Trust physical access flow: Sponsor Request → Host Authorization → Identity Verification → Zone Clearance → Check-Out Audit.
                  </p>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800">1. Pre-Registration & Justification</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800">2. Host & Facility Sponsorship</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800">3. Government ID & NDA Verification</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                      <span className="font-semibold text-blue-900">4. Badge Issuance & Escort Escort Route</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-500">5. Automatic Expiry & Badge Return</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Facility Policy: Mandatory Escort</span>
                  <button
                    onClick={() => toast.success("Verified all open visitor compliance passes.")}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Audit Check →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 1/3 COLUMN: Walk-in Visitor Check-In Interactive Form */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Walk-in Visitor Check-In</h3>
                  <p className="text-[11px] text-slate-500">Instant on-site registration & badge generation</p>
                </div>
              </div>

              {/* 5-Step Stepper Header */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100 text-[10px]">
                {[
                  { step: 1, label: "Verify Identity" },
                  { step: 2, label: "Capture Details" },
                  { step: 3, label: "Issue Badge" },
                  { step: 4, label: "Briefing" },
                  { step: 5, label: "Check-In" },
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setCheckInStep(s.step)}
                    className="flex flex-col items-center gap-1 group focus:outline-none"
                  >
                    <span
                      className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px]",
                        checkInStep === s.step
                          ? "bg-blue-600 text-white"
                          : checkInStep > s.step
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {checkInStep > s.step ? "✓" : s.step}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] text-center hidden sm:block",
                        checkInStep === s.step ? "font-bold text-blue-700" : "text-slate-400"
                      )}
                    >
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* ID Selector Pills */}
              <div className="mt-3">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Select Document for Verification
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["Aadhaar Card", "PAN Card", "Driving License", "Passport", "Company ID", "Others"].map(
                    (idType) => (
                      <button
                        key={idType}
                        type="button"
                        onClick={() => setSelectedIdType(idType)}
                        className={cn(
                          "px-2 py-1.5 rounded-lg text-[10px] font-medium border text-center transition-all",
                          selectedIdType === idType
                            ? "bg-blue-50 border-blue-400 text-blue-800 font-bold"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        {idType}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Verified Identity Card */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-100/80 border border-blue-200 flex items-center justify-center shrink-0 text-blue-700 shadow-2xs">
                    <UserCheck className="h-6 w-6" />
                  </div>

                  <div className="text-xs space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{walkinName}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        ✓ Verified
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">ID No: XXXX 1234 5678</div>
                    <div className="text-[11px] text-slate-500">DOB: 12 Jul 1990 • Male</div>
                    <div className="text-[10px] text-slate-500">Coimbatore, Tamil Nadu</div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => toast.success("ID Document scanned & OCR confirmed successfully.")}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    <QrCode className="h-3.5 w-3.5" /> Scan Document / QR
                  </button>
                  <span className="text-[10px] text-slate-400">Match confidence: 99.4%</span>
                </div>
              </div>

              {/* Interactive Fields */}
              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Visit Purpose *
                  </label>
                  <select
                    value={walkinPurpose}
                    onChange={(e) => setWalkinPurpose(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                  >
                    <option value="Customer Visit">Customer Visit</option>
                    <option value="Business Discussion">Business Discussion</option>
                    <option value="Supplier Meeting">Supplier Meeting</option>
                    <option value="Audit & Inspection">Audit & Inspection</option>
                    <option value="Maintenance / Service">Maintenance / Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Host Employee *
                  </label>
                  <select
                    value={walkinHost}
                    onChange={(e) => setWalkinHost(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                  >
                    <option value="Priya Sharma">Priya Sharma (Security Manager)</option>
                    <option value="Ramesh S">Ramesh S (Facility Lead)</option>
                    <option value="Karthik P">Karthik P (Engineering Lead)</option>
                    <option value="Divya R">Divya R (Operations)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Authorized Facility & Zone *
                  </label>
                  <select
                    value={walkinFacility}
                    onChange={(e) => setWalkinFacility(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                  >
                    <option value="Access Room - Factory Tour">Access Room - Factory Tour</option>
                    <option value="Executive Boardroom">Executive Boardroom</option>
                    <option value="R&D Electronics Wing">R&D Electronics Wing</option>
                    <option value="Wireless EVSE Yard">Wireless EVSE Yard</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-semibold text-slate-800 text-[11px]">Escort Required</div>
                    <div className="text-[10px] text-slate-500">Mandatory host accompaniment</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={escortRequired}
                    onChange={(e) => setEscortRequired(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="block font-medium text-slate-500 mb-0.5">Visit Date</label>
                    <input
                      type="text"
                      disabled
                      value="28 Sep 2026"
                      className="w-full px-2 py-1 rounded border border-slate-200 bg-slate-100 text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-500 mb-0.5">Valid Till</label>
                    <input
                      type="text"
                      disabled
                      value="28 Sep 2026 06:00 PM"
                      className="w-full px-2 py-1 rounded border border-slate-200 bg-slate-100 text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleStepPrev}
                disabled={checkInStep === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleStepNext}
                className="flex-1 px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
              >
                {checkInStep === 5 ? "Complete Check-In & Issue Badge" : "Next Step →"}
              </button>
            </div>
          </div>
        </div>

        {/* New Visitor Request Modal */}
        {showNewRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Pre-Register Visitor</h3>
                    <p className="text-xs text-slate-500">Create planned visit pass and notify host</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewRequestModal(false)}
                  className="h-7 w-7 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRequest} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Visitor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Mahindra"
                    value={newVisitorName}
                    onChange={(e) => setNewVisitorName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Organization *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahindra Electric"
                      value={newVisitorOrg}
                      onChange={(e) => setNewVisitorOrg(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Host Employee *
                    </label>
                    <select
                      value={newVisitorHost}
                      onChange={(e) => setNewVisitorHost(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none"
                    >
                      <option value="Priya Sharma">Priya Sharma</option>
                      <option value="Ramesh S">Ramesh S</option>
                      <option value="Karthik P">Karthik P</option>
                      <option value="Divya R">Divya R</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Purpose of Visit *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High-Power Wireless EV Charging Demo"
                    value={newVisitorPurpose}
                    onChange={(e) => setNewVisitorPurpose(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewRequestModal(false)}
                    className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs"
                  >
                    Confirm & Send Notification
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
