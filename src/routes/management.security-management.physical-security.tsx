// Magnertia ERP - Physical Security
// Management → Security Management → Physical Security
// Aligned with Screenshot 1 & Prompt 5 Specifications

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  Shield,
  Building2,
  Camera,
  Users,
  AlertTriangle,
  Clock,
  UserCheck,
  FileText,
  Plus,
  RefreshCw,
  Printer,
  Edit2,
  X,
  CheckCircle2,
  MapPin,
  Save,
  Radio,
  FileCheck2,
  Video,
  Key,
  ShieldAlert,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
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
  mockPhysicalSecurityRecord,
  mockFacilitiesList,
  mockPhysicalIncidents,
  type PhysicalSecurityMaster,
} from "@/services/securityManagementService";
import { toast } from "sonner";

export const Route = createFileRoute("/management/security-management/physical-security")({
  head: () => ({
    meta: [
      { title: "Physical Security · Magnertia ERP" },
      {
        name: "description",
        content:
          "Protect people, facilities, equipment, manufacturing areas, charging stations, utilities, and infrastructure against physical threats.",
      },
    ],
  }),
  component: PhysicalSecurityPage,
});

const ACCESS_ACTIVITY_7DAYS = [
  { day: "22 Sep", employee: 380, visitor: 22, contractor: 15 },
  { day: "23 Sep", employee: 420, visitor: 28, contractor: 18 },
  { day: "24 Sep", employee: 450, visitor: 32, contractor: 20 },
  { day: "25 Sep", employee: 440, visitor: 25, contractor: 16 },
  { day: "26 Sep", employee: 460, visitor: 30, contractor: 19 },
  { day: "27 Sep", employee: 240, visitor: 12, contractor: 8 },
  { day: "28 Sep", employee: 486, visitor: 27, contractor: 18 },
];

const INCIDENT_STATUS_DATA = [
  { name: "Unauthorized Access", count: 2, color: "#EF4444" },
  { name: "Theft", count: 1, color: "#F97316" },
  { name: "Vandalism", count: 1, color: "#FBBF24" },
  { name: "CCTV Failure", count: 1, color: "#06B6D4" },
];

const CCTV_HEALTH_DATA = [
  { name: "Online", count: 94, pct: "97.9%", color: "#10B981" },
  { name: "Offline", count: 2, pct: "2.1%", color: "#EF4444" },
  { name: "Maintenance", count: 0, pct: "0%", color: "#F59E0B" },
];

const PATROL_COMPLIANCE_DATA = [
  { day: "22 Sep", scheduled: 24, completed: 23, compliance: 95.8 },
  { day: "23 Sep", scheduled: 24, completed: 24, compliance: 100 },
  { day: "24 Sep", scheduled: 24, completed: 22, compliance: 91.6 },
  { day: "25 Sep", scheduled: 24, completed: 23, compliance: 95.8 },
  { day: "26 Sep", scheduled: 24, completed: 24, compliance: 100 },
  { day: "27 Sep", scheduled: 24, completed: 24, compliance: 100 },
  { day: "28 Sep", scheduled: 24, completed: 23, compliance: 97.2 },
];

function PhysicalSecurityPage() {
  const [formData, setFormData] = useState<PhysicalSecurityMaster>(mockPhysicalSecurityRecord);
  const [showFacilityModal, setShowFacilityModal] = useState(false);

  return (
    <AppShell
      title="Physical Security"
      breadcrumb="Management > Security Management > Physical Security"
      description="Facility perimeter defense, biometric turnstile controls, security guard post operations, visitor checkpoints, and critical asset physical safeguards."
      tabs={<SecurityManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Executive Header matching screenshot 1 */}
        <SecuritySubmoduleHeader
          icon={Shield}
          title="Physical Security"
          code="PS-2026-001"
          badge="Active"
          subtitle="Plant-wide access zones, perimeter intrusion sensors, automated security patrol schedules, and physical site barrier protection."
          bannerQuote="Secure People. Secure Facilities. Secure Assets. A Safer Tomorrow."
          primaryActionLabel="+ New Facility"
          onPrimaryAction={() => setShowFacilityModal(true)}
          onGenerateReport={() => toast.success("Physical Security Master Audit Report exported")}
        />

        {/* Executive 7-Gauge Circular Score Banner matching Screenshot */}
        <ProductScoreBanner submoduleKey="physical-security" />

        {/* 8 KPI Cards matching screenshot 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">Facilities</span>
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">8</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold truncate">
              <span>↑ 14%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs last month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">Security Zones</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">42</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold truncate">
              <span>↑ 5%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs last month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">Active Badges</span>
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Key className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">486</div>
            <div className="mt-1 flex items-center text-[10px] text-rose-600 font-semibold truncate">
              <span>↓ 3%</span>
              <span className="ml-1 text-muted-foreground font-normal">vs last month</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">Visitors Today</span>
              <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">27</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold truncate">
              <span>↑ 18%</span>
              <span className="ml-1 text-muted-foreground font-normal">verified</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">Contractors On-Site</span>
              <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">18</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold truncate">
              <span>↑ 20%</span>
              <span className="ml-1 text-muted-foreground font-normal">cleared</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">CCTV Cameras</span>
              <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
                <Camera className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">96</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold truncate">
              <span>↑ 7%</span>
              <span className="ml-1 text-muted-foreground font-normal">installed</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">Cameras Online</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Video className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">94</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold truncate">
              <span>97.9%</span>
              <span className="ml-1 text-muted-foreground font-normal">streaming</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground truncate">Open Incidents</span>
              <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold font-display text-foreground">5</div>
            <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold truncate">
              <span>↓ 44%</span>
              <span className="ml-1 text-muted-foreground font-normal">containment</span>
            </div>
          </div>
        </div>

        {/* Row 1: Facility Security Overview + Access Activity (Last 7 Days) + Incident Status + Risk Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Facility Security Overview with Photo */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Facility Security Overview</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            {/* Building Graphic Banner matching screenshot 1 */}
            <div className="relative my-2 h-28 rounded-xl overflow-hidden border border-border/80 bg-gradient-to-tr from-slate-900 via-slate-800 to-sky-950 flex flex-col items-center justify-center text-center p-3 text-white">
              <Building2 className="h-8 w-8 text-sky-400 mb-1" />
              <span className="font-display font-bold text-sm tracking-wide">MAGNERTIA PLANT 2</span>
              <span className="text-[10px] text-sky-300">Coimbatore Facility Hub</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {mockFacilitiesList.map((fac) => (
                <div key={fac.name} className="flex items-center justify-between py-0.5">
                  <span className="text-muted-foreground flex items-center gap-1.5 truncate">
                    <span className="h-2 w-2 rounded-full shrink-0 bg-blue-500" />
                    {fac.name}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      fac.status === "Secure" && "bg-emerald-500/10 text-emerald-600",
                      fac.status === "Attention" && "bg-amber-500/10 text-amber-600",
                      fac.status === "Monitor" && "bg-sky-500/10 text-sky-600"
                    )}
                  >
                    ● {fac.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Access Activity (Last 7 Days) Stacked Bar Chart */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">Access Activity (Last 7 Days)</h3>
                <p className="text-[11px] text-muted-foreground">Gate access volume by identity category</p>
              </div>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="h-[210px] w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ACCESS_ACTIVITY_7DAYS} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="employee" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="visitor" fill="#F59E0B" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="contractor" fill="#10B981" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-5 text-xs pt-2 border-t border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Employee
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Visitor
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Contractor
              </span>
            </div>
          </div>

          {/* Incident Status Donut */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Incident Status</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={INCIDENT_STATUS_DATA} innerRadius={40} outerRadius={58} paddingAngle={3} dataKey="count">
                      {INCIDENT_STATUS_DATA.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute top-[50px] text-center">
                <span className="font-display text-base font-bold text-foreground">5</span>
                <p className="text-[9px] text-muted-foreground font-semibold">Open</p>
              </div>
            </div>

            <div className="space-y-1 text-[11px] pt-2 border-t border-border">
              {INCIDENT_STATUS_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground truncate">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-semibold text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Heatmap Matrix */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Risk Heatmap</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="space-y-1.5 py-1">
              <div className="grid grid-cols-5 gap-1.5 items-center text-[10px] text-muted-foreground">
                <span>Critical</span>
                <div className="h-6 rounded bg-rose-500/20 text-rose-700 flex items-center justify-center font-bold">0</div>
                <div className="h-6 rounded bg-rose-500/30 text-rose-800 flex items-center justify-center font-bold">2</div>
                <div className="h-6 rounded bg-rose-500/40 text-rose-900 flex items-center justify-center font-bold">3</div>
                <div className="h-6 rounded bg-rose-500/20 text-rose-700 flex items-center justify-center font-bold">0</div>
              </div>
              <div className="grid grid-cols-5 gap-1.5 items-center text-[10px] text-muted-foreground">
                <span>High</span>
                <div className="h-6 rounded bg-amber-500/10 flex items-center justify-center font-bold">2</div>
                <div className="h-6 rounded bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">4</div>
                <div className="h-6 rounded bg-amber-500/30 text-amber-800 flex items-center justify-center font-bold">3</div>
                <div className="h-6 rounded bg-rose-500/20 text-rose-700 flex items-center justify-center font-bold">2</div>
              </div>
              <div className="grid grid-cols-5 gap-1.5 items-center text-[10px] text-muted-foreground">
                <span>Medium</span>
                <div className="h-6 rounded bg-emerald-500/10 flex items-center justify-center font-bold">5</div>
                <div className="h-6 rounded bg-emerald-500/15 flex items-center justify-center font-bold">8</div>
                <div className="h-6 rounded bg-amber-500/15 flex items-center justify-center font-bold">6</div>
                <div className="h-6 rounded bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">2</div>
              </div>
              <div className="grid grid-cols-5 gap-1.5 items-center text-[10px] text-muted-foreground">
                <span>Low</span>
                <div className="h-6 rounded bg-emerald-500/10 flex items-center justify-center font-bold">12</div>
                <div className="h-6 rounded bg-emerald-500/10 flex items-center justify-center font-bold">10</div>
                <div className="h-6 rounded bg-emerald-500/15 flex items-center justify-center font-bold">14</div>
                <div className="h-6 rounded bg-emerald-500/20 flex items-center justify-center font-bold">8</div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1 text-[10px] text-muted-foreground pt-2 border-t border-border text-center">
              <span>People</span>
              <span>Facilities</span>
              <span>Assets</span>
              <span>Access</span>
              <span>Env</span>
            </div>
          </div>
        </div>

        {/* Row 2: CCTV Status Gauge, Guard & Patrol Compliance Chart & Recent Incidents Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* CCTV Status Gauge */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">CCTV Status</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-8 border-emerald-500/20 border-t-emerald-500">
                <div className="text-center">
                  <span className="font-display text-xl font-bold text-foreground">96</span>
                  <p className="text-[10px] font-semibold text-muted-foreground">Cameras</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs pt-2 border-t border-border">
              {CCTV_HEALTH_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-semibold text-foreground">
                    {item.count} ({item.pct})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Guard & Patrol Compliance Chart */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">Guard & Patrol Compliance</h3>
                <p className="text-[11px] text-muted-foreground">Daily scheduled checkpoints vs completion</p>
              </div>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="h-[170px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={PATROL_COMPLIANCE_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10 }} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="scheduled" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                  <Bar yAxisId="left" dataKey="completed" fill="#10B981" radius={[3, 3, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="compliance" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs pt-2 border-t border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Scheduled
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Completed
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Compliance %
              </span>
            </div>
          </div>

          {/* Recent Security Incidents Table */}
          <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Recent Security Incidents</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                    <th className="pb-2">Date & Time</th>
                    <th className="pb-2">Incident No.</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Location</th>
                    <th className="pb-2">Severity</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {mockPhysicalIncidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 text-muted-foreground">{inc.date}</td>
                      <td className="py-2.5 font-mono text-foreground font-medium">{inc.id}</td>
                      <td className="py-2.5 text-foreground font-semibold">{inc.type}</td>
                      <td className="py-2.5 text-muted-foreground">{inc.location}</td>
                      <td className="py-2.5">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            inc.severity === "Critical" && "bg-rose-500/10 text-rose-600",
                            inc.severity === "High" && "bg-amber-500/10 text-amber-600",
                            inc.severity === "Medium" && "bg-yellow-500/10 text-yellow-600"
                          )}
                        >
                          {inc.severity}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            inc.status === "Investigating" && "bg-amber-500/10 text-amber-600",
                            inc.status === "Open" && "bg-rose-500/10 text-rose-600",
                            inc.status === "Resolved" && "bg-emerald-500/10 text-emerald-600",
                            inc.status === "Closed" && "bg-muted text-muted-foreground"
                          )}
                        >
                          {inc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Row 3: Physical Security Form (matching screenshot 1) */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border gap-2">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-base font-bold text-foreground">Physical Security Form</h3>
              <span className="font-mono text-xs text-muted-foreground">{formData.psId}</span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                Active
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.success("Physical Security details saved")}
                className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" /> Save
              </button>
              <button
                onClick={() => toast.info("Submitted for Security Manager approval")}
                className="rounded-xl border border-border bg-muted/30 px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Submit for Approval
              </button>
            </div>
          </div>

          {/* Form Content: 4 Columns matching screenshot 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-xs pt-2">
            {/* Column 1: Physical Security Master fields */}
            <div className="space-y-2.5 border-r border-border/60 pr-4">
              <h4 className="font-semibold text-foreground text-xs pb-1 border-b border-border/40">
                1. Physical Security Master
              </h4>
              <div>
                <span className="text-muted-foreground">Physical Security ID *</span>
                <input
                  type="text"
                  disabled
                  value={formData.psId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 text-xs font-mono"
                />
              </div>
              <div>
                <span className="text-muted-foreground">Reference No. *</span>
                <input
                  type="text"
                  value={formData.referenceNo}
                  onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/20 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <span className="text-muted-foreground">Organization *</span>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/20 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <span className="text-muted-foreground">Security Scope *</span>
                <select
                  value={formData.securityScope}
                  onChange={(e) => setFormData({ ...formData, securityScope: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/20 px-2.5 py-1.5 text-xs"
                >
                  <option>Site</option>
                  <option>Facility</option>
                  <option>Area</option>
                  <option>Enterprise</option>
                </select>
              </div>
              <div>
                <span className="text-muted-foreground">Facility *</span>
                <input
                  type="text"
                  value={formData.facility}
                  onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/20 px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
              <div>
                <span className="text-muted-foreground">Security Manager *</span>
                <input
                  type="text"
                  value={formData.securityManager}
                  onChange={(e) => setFormData({ ...formData, securityManager: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/20 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <span className="text-muted-foreground">ISMS / Security Lead</span>
                <input
                  type="text"
                  value={formData.ismsLead}
                  onChange={(e) => setFormData({ ...formData, ismsLead: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/20 px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            {/* Column 2: Classification & Schedule */}
            <div className="space-y-2.5 border-r border-border/60 pr-4">
              <h4 className="font-semibold text-foreground text-xs pb-1 border-b border-border/40">
                Classification & Details
              </h4>
              <div>
                <span className="text-muted-foreground">Security Classification *</span>
                <select
                  value={formData.securityClassification}
                  onChange={(e: any) => setFormData({ ...formData, securityClassification: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/20 px-2.5 py-1.5 text-xs font-semibold"
                >
                  <option>Confidential</option>
                  <option>Internal</option>
                  <option>Restricted</option>
                </select>
              </div>
              <div>
                <span className="text-muted-foreground">Risk Level *</span>
                <span className="mt-1 flex items-center gap-1.5 font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                  ● Medium Risk
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Security Status</span>
                <span className="mt-1 flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                  ● Active
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Effective From *</span>
                <input
                  type="text"
                  value={formData.effectiveFrom}
                  onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/20 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <span className="text-muted-foreground">Review Date</span>
                <input
                  type="text"
                  value={formData.reviewDate}
                  onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/20 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <span className="text-muted-foreground">Description</span>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/20 px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            {/* Column 3: Facility Visual & Location */}
            <div className="space-y-3 border-r border-border/60 pr-4">
              <h4 className="font-semibold text-foreground text-xs pb-1 border-b border-border/40">
                Facility Visual & Site Map
              </h4>
              <div className="rounded-xl border border-border overflow-hidden bg-slate-900 p-4 text-white text-center space-y-2">
                <Building2 className="h-10 w-10 text-sky-400 mx-auto" />
                <p className="font-bold text-xs">Plant 2, Coimbatore, Tamil Nadu, India</p>
                <span className="text-[10px] text-sky-300 block">Manufacturing & Battery Storage Yard</span>
                <button
                  onClick={() => toast.info("Facility blueprint viewer opened")}
                  className="text-[10px] text-sky-400 underline cursor-pointer"
                >
                  Upload / Change Blueprint
                </button>
              </div>

              <div className="rounded-xl border border-border p-3 bg-muted/20 space-y-1.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" /> Plant 2 Coimbatore
                  </span>
                  <span className="text-primary cursor-pointer hover:underline text-[10px]">View Map</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Latitude: 11.0168° N, Longitude: 76.9558° E. Zone: High Security Manufacturing.
                </p>
              </div>
            </div>

            {/* Column 4: Validation Messages & Workflow States */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-xs pb-1 border-b border-border/40">
                Validation & Lifecycle States
              </h4>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-1.5 text-[11px]">
                <span className="font-bold text-emerald-700 block">Validation Messages</span>
                <p className="text-emerald-700 flex items-center gap-1">✓ All mandatory fields completed</p>
                <p className="text-emerald-700 flex items-center gap-1">✓ Valid facility selected</p>
                <p className="text-emerald-700 flex items-center gap-1">✓ Security classification is set</p>
                <p className="text-emerald-700 flex items-center gap-1">✓ Review date is in future</p>
                <p className="text-emerald-700 flex items-center gap-1">✓ No duplicate record found</p>
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                <span className="font-semibold text-foreground block text-[11px]">Workflow History</span>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> Draft
                  </span>
                  <span className="text-muted-foreground text-[10px]">26 Sep 2026 Arun Kumar</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> Approved
                  </span>
                  <span className="text-muted-foreground text-[10px]">27 Sep 2026 Ramesh S</span>
                </div>
                <div className="flex justify-between items-center text-[11px] bg-primary/10 p-1.5 rounded-lg text-primary font-bold">
                  <span>● Active (Current)</span>
                  <span className="text-[10px]">28 Sep 2026 Priya Sharma</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: New Facility */}
        {showFacilityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-base font-bold text-foreground">Register New Facility / Protected Site</h3>
                <button onClick={() => setShowFacilityModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
                <div>
                  <label className="font-semibold text-foreground">Facility Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Plant 3 - Robotic Assembly & Test Track"
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Facility Type *</label>
                    <select className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs">
                      <option>Manufacturing Facility</option>
                      <option>R&D Laboratory</option>
                      <option>Corporate Office</option>
                      <option>Warehouse & Logistics</option>
                      <option>EV Charging Station Site</option>
                      <option>Data Centre</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Security Level</label>
                    <select className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs">
                      <option>High Security (Restricted Access)</option>
                      <option>Controlled Zone</option>
                      <option>General Employee Zone</option>
                      <option>Public / Visitor</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Security Manager</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh S"
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">CCTV Coverage Targets</label>
                    <input
                      type="number"
                      placeholder="e.g. 24 Cameras"
                      className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-foreground">Address & Geographic Scope</label>
                  <textarea
                    rows={3}
                    placeholder="Provide site boundary, perimeter fence specs, and security guard post counts..."
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setShowFacilityModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowFacilityModal(false);
                    toast.success("New Facility registered in Physical Security Master");
                  }}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Register Facility
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
