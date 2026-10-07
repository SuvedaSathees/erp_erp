// Magnertia ERP - Notifications Management
// Management -> Communication Management -> Notifications
// Complete Notifications Form matching Screenshot 4 and Specifications

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCommunicationManagementRecordFn } from "@/lib/communicationManagementFns.server";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Eye,
  Plus,
  Edit2,
  Search,
  Filter,
  MoreVertical,
  Check,
  X,
  FileText,
  Sliders,
  Send,
  Phone,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { CommunicationTabBar } from "@/components/erp/CommunicationManagementTabBar";
import { CommunicationSubmoduleHeader } from "@/components/erp/CommunicationSubmoduleHeader";
import {
  MOCK_NOTIFICATION_RECORDS,
  MOCK_NOTIFICATION_KPIS,
  NotificationMaster,
} from "@/services/communicationManagementService";

export const Route = createFileRoute("/management/communication-management/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications · Communication Management · Magnertia ERP" },
      {
        name: "description",
        content: "Enterprise Notification Governance, Trigger Rules, Multi-Channel Delivery, Acknowledgement and SLA tracking.",
      },
    ],
  }),
  component: NotificationsManagementPage,
});

const TYPE_DISTRIBUTION = [
  { name: "Reminder", value: 28, color: "#f59e0b" },
  { name: "Approval", value: 22, color: "#2563eb" },
  { name: "Alert", value: 15, color: "#ef4444" },
  { name: "System", value: 12, color: "#10b981" },
  { name: "Transactional", value: 10, color: "#8b5cf6" },
  { name: "Compliance", value: 8, color: "#06b6d4" },
  { name: "Others", value: 5, color: "#64748b" },
];

const DELIVERY_STATUS_DATA = [
  { name: "Delivered", value: 79, color: "#10b981" },
  { name: "Read", value: 57, color: "#2563eb" },
  { name: "Pending", value: 13, color: "#f59e0b" },
  { name: "Failed", value: 4, color: "#ef4444" },
  { name: "Bounced", value: 2, color: "#94a3b8" },
];

const NOTIFICATIONS_TREND = [
  { date: "13 Sep", sent: 120, delivered: 110, read: 80 },
  { date: "15 Sep", sent: 165, delivered: 155, read: 120 },
  { date: "17 Sep", sent: 140, delivered: 130, read: 95 },
  { date: "19 Sep", sent: 196, delivered: 188, read: 142 },
];

function NotificationsManagementPage() {
  const { data: dbRecord } = useQuery({
    queryKey: ["communication-management", "record"],
    queryFn: () => getCommunicationManagementRecordFn({ data: {} }),
  });

  const [activeTab, setActiveTab] = useState<string>("register");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedNotification, setSelectedNotification] = useState<NotificationMaster>(
    MOCK_NOTIFICATION_RECORDS[1] // NTF-2026-002 matching Screenshot 4
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filtered = MOCK_NOTIFICATION_RECORDS.filter((n) => {
    const matchesSearch =
      (n.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.code || n.notificationId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.module || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || n.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <AppShell
      title="Notifications"
      breadcrumb="Management > Communication Management > Notifications"
      description="Stay informed. Take action. Drive progress. Multi-channel business alerts & escalation engine."
      tabs={<CommunicationTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Toast */}
        {toastMsg && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg flex items-center justify-between">
            <span>{toastMsg}</span>
            <button onClick={() => setToastMsg(null)}>
              <X className="h-3.5 w-3.5 text-blue-600" />
            </button>
          </div>
        )}

        {/* Executive Submodule Header */}
        <CommunicationSubmoduleHeader
          icon={Bell}
          title="Notifications Management"
          code="NTF-2026-001"
          version="v1.0"
          status="Active"
          onSave={() => showToast("Notification rules saved to Communication Vault")}
          onSubmit={() => showToast("Notification registered and triggers activated")}
          onGenerateReport={() => showToast("Exporting Delivery SLA report")}
          moreActions={[
            {
              label: "New Notification",
              icon: Plus,
              onClick: () => showToast("Create New Notification Dialog"),
            },
            {
              label: "Notification Rules Matrix",
              icon: Sliders,
              onClick: () => showToast("Notification Trigger Rules Matrix"),
            },
          ]}
        />

        {/* Top 6 KPI Cards matching Screenshot 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* 1. Total Notifications */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">248</div>
                <div className="text-[11px] font-semibold text-slate-500">Total Notifications</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 18%
                </div>
              </div>
            </div>

            {/* 2. Delivered */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">196</div>
                <div className="text-[11px] font-semibold text-slate-500">Delivered</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 22%
                </div>
              </div>
            </div>

            {/* 3. Read */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">142</div>
                <div className="text-[11px] font-semibold text-slate-500">Read</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 15%
                </div>
              </div>
            </div>

            {/* 4. Pending Action */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">32</div>
                <div className="text-[11px] font-semibold text-slate-500">Pending Action</div>
                <div className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                  ↓ 20%
                </div>
              </div>
            </div>

            {/* 5. Escalated */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">8</div>
                <div className="text-[11px] font-semibold text-slate-500">Escalated</div>
                <div className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                  ↓ 11%
                </div>
              </div>
            </div>

            {/* 6. Scheduled */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">12</div>
                <div className="text-[11px] font-semibold text-slate-500">Scheduled</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 33%
                </div>
              </div>
            </div>
          </div>



          {/* Split View: Table on Left (8 cols) & Details on Right (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Filter Ribbon + Notification Register Table */}
            <div className="lg:col-span-8 space-y-4">
              {/* Filter Ribbon */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="rounded-lg border border-slate-300 p-1.5 text-xs bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="approval">Approval</option>
                    <option value="reminder">Reminder</option>
                    <option value="system">System</option>
                    <option value="business">Business</option>
                    <option value="alert">Alert</option>
                    <option value="compliance">Compliance</option>
                  </select>

                  <select className="rounded-lg border border-slate-300 p-1.5 text-xs bg-white">
                    <option>All Categories</option>
                    <option>Purchase</option>
                    <option>Finance</option>
                    <option>CRM</option>
                    <option>Quality</option>
                  </select>

                  <select className="rounded-lg border border-slate-300 p-1.5 text-xs bg-white">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Inactive</option>
                  </select>

                  <div className="flex items-center gap-1 border border-slate-300 rounded-lg p-1 text-slate-600 bg-white">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>01-Sep-2026 - 30-Sep-2026</span>
                  </div>

                  <button className="flex items-center gap-1 border border-slate-300 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg text-slate-700 font-semibold">
                    <Filter className="h-3.5 w-3.5" /> Filters
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b">
                      <tr>
                        <th className="py-2.5 px-3 w-8">
                          <input type="checkbox" className="rounded border-slate-300" />
                        </th>
                        <th className="py-2.5 px-3">ID</th>
                        <th className="py-2.5 px-3">Notification Title</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Module</th>
                        <th className="py-2.5 px-3">Priority</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Created On</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((item) => {
                        const isSelected = selectedNotification.id === item.id;
                        return (
                          <tr
                            key={item.id}
                            onClick={() => setSelectedNotification(item)}
                            className={`cursor-pointer transition ${
                              isSelected ? "bg-blue-50/70" : "hover:bg-slate-50"
                            }`}
                          >
                            <td className="py-2.5 px-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="rounded border-slate-300"
                              />
                            </td>
                            <td className="py-2.5 px-3 font-mono font-medium text-blue-600">
                              {item.code}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-900 truncate max-w-xs">
                              {item.title}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                {item.type}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">{item.module}</td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  item.priority === "High"
                                    ? "bg-amber-100 text-amber-800"
                                    : item.priority === "Medium"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {item.priority}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                {item.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-400">{item.createdOn}</td>
                            <td className="py-2.5 px-3 text-right">
                              <button className="text-slate-400 hover:text-slate-600">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Notification Details, Message Template, Channels, Recipients */}
            <div className="lg:col-span-4 space-y-4">
              {/* Notification Details Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900">Notification Details</h4>
                  <button className="text-blue-600 hover:underline flex items-center gap-1 font-semibold text-[11px]">
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Notification ID:</span>
                    <span className="font-mono text-slate-800 font-bold">{selectedNotification.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Title:</span>
                    <span className="font-medium text-slate-900">{selectedNotification.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="font-medium text-slate-800">{selectedNotification.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="font-medium text-slate-800">{selectedNotification.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Module:</span>
                    <span className="font-medium text-slate-800">{selectedNotification.module}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Priority:</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                      {selectedNotification.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Status:</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Owner:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="h-4 w-4 rounded-full bg-blue-600 text-white text-[8px] font-bold flex items-center justify-center">
                        AK
                      </span>
                      <span className="font-medium text-slate-800">{selectedNotification.owner}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Effective From:</span>
                    <span className="text-slate-700">{selectedNotification.effectiveFrom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Effective To:</span>
                    <span className="text-slate-700">{selectedNotification.effectiveTo}</span>
                  </div>
                </div>
              </div>

              {/* Message Template Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900">Message Template</h4>
                  <button className="text-blue-600 font-semibold text-[11px] hover:underline">View Template</button>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Subject</span>
                  <div className="font-semibold text-slate-900 text-xs">
                    {selectedNotification?.subjectTemplate || selectedNotification?.subject || "Notification Alert"}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Message Preview</span>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 text-[11px] leading-relaxed whitespace-pre-line">
                    {selectedNotification?.messagePreview || selectedNotification?.preview || "Notification details and action parameters."}
                  </div>
                </div>
              </div>

              {/* Notification Channels */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900">Notification Channels</h4>
                  <button className="text-blue-600 font-semibold text-[11px] hover:underline">Edit</button>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-lg border border-blue-200 bg-blue-50/50 flex flex-col items-center">
                    <Bell className="h-4 w-4 text-blue-600 mb-1" />
                    <span className="font-semibold text-[11px] text-slate-800">In-App</span>
                    <span className="text-[9px] text-blue-600 font-bold">Primary</span>
                  </div>
                  <div className="p-2 rounded-lg border border-slate-200 bg-white flex flex-col items-center">
                    <Mail className="h-4 w-4 text-slate-600 mb-1" />
                    <span className="font-semibold text-[11px] text-slate-800">Email</span>
                    <span className="text-[9px] text-emerald-600 font-bold">Enabled</span>
                  </div>
                  <div className="p-2 rounded-lg border border-slate-200 bg-white flex flex-col items-center">
                    <Smartphone className="h-4 w-4 text-slate-600 mb-1" />
                    <span className="font-semibold text-[11px] text-slate-800">SMS</span>
                    <span className="text-[9px] text-emerald-600 font-bold">Enabled</span>
                  </div>
                  <div className="p-2 rounded-lg border border-slate-200 bg-white flex flex-col items-center">
                    <Phone className="h-4 w-4 text-slate-600 mb-1" />
                    <span className="font-semibold text-[11px] text-slate-800">WhatsApp</span>
                    <span className="text-[9px] text-emerald-600 font-bold">Enabled</span>
                  </div>
                </div>
              </div>

              {/* Recipients (5) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900">Recipients (5)</h4>
                  <button className="text-blue-600 font-semibold text-[11px] hover:underline">View All</button>
                </div>

                <div className="flex items-center justify-between">
                  {(selectedNotification?.recipients || [
                    { name: "Arun Kumar", role: "Manager", avatar: "AK" },
                    { name: "Priya Sharma", role: "Lead", avatar: "PS" },
                    { name: "Ramesh S", role: "Quality", avatar: "RS" },
                  ]).map((r, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <span className="h-7 w-7 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center border border-slate-200">
                        {r.avatar}
                      </span>
                      <span className="font-semibold text-slate-800 text-[10px] mt-1">{r.name}</span>
                      <span className="text-[9px] text-slate-400">{r.role}</span>
                    </div>
                  ))}
                  <div className="flex flex-col items-center text-center">
                    <span className="h-7 w-7 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center border border-slate-200">
                      +1
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">Others</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Analytics Row: Notifications by Type, Delivery Status, Trend */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Notifications by Type */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <h4 className="font-bold text-slate-900 text-xs mb-1">Notifications by Type</h4>
              <div className="flex items-center justify-center h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={TYPE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                      {TYPE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] pt-1 border-t">
                {TYPE_DISTRIBUTION.map((t) => (
                  <div key={t.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                      <span className="text-slate-600">{t.name}</span>
                    </span>
                    <span className="font-bold text-slate-800">{t.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Delivery Status */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <h4 className="font-bold text-slate-900 text-xs mb-1">Delivery Status</h4>
              <div className="flex items-center justify-center h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={DELIVERY_STATUS_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                      {DELIVERY_STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] pt-1 border-t">
                {DELIVERY_STATUS_DATA.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-slate-600">{d.name}</span>
                    </span>
                    <span className="font-bold text-slate-800">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Notifications Trend */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-slate-900 text-xs">Notifications Trend</h4>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-1 text-blue-600 font-semibold">● Sent</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">● Delivered</span>
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">● Read</span>
                </div>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={NOTIFICATIONS_TREND}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="sent" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="read" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="pt-2 border-t text-[11px] text-slate-500 text-center">
                Weekly traffic volume across all channels
              </div>
            </div>
          </div>

          {/* Quick Actions Bar matching Screenshot 4 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">Quick Actions</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <button
                onClick={() => showToast("Create New Notification Dialog")}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 flex items-center gap-2 text-left"
              >
                <Plus className="h-4 w-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 text-xs">New Notification</div>
                  <div className="text-[10px] text-slate-400">Create new notification</div>
                </div>
              </button>

              <button
                onClick={() => showToast("Design message template")}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 flex items-center gap-2 text-left"
              >
                <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Create Template</div>
                  <div className="text-[10px] text-slate-400">Design message template</div>
                </div>
              </button>

              <button
                onClick={() => showToast("Set trigger conditions")}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 flex items-center gap-2 text-left"
              >
                <Sliders className="h-4 w-4 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Manage Rules</div>
                  <div className="text-[10px] text-slate-400">Set trigger conditions</div>
                </div>
              </button>

              <button
                onClick={() => showToast("Track delivery status logs")}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 flex items-center gap-2 text-left"
              >
                <Layers className="h-4 w-4 text-purple-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 text-xs">View Delivery Logs</div>
                  <div className="text-[10px] text-slate-400">Track delivery status</div>
                </div>
              </button>

              <button
                onClick={() => showToast("View analytics report")}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 flex items-center gap-2 text-left"
              >
                <ArrowUpRight className="h-4 w-4 text-teal-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Notification Report</div>
                  <div className="text-[10px] text-slate-400">View analytics report</div>
                </div>
              </button>
            </div>
          </div>
        </div>
    </AppShell>
  );
}
