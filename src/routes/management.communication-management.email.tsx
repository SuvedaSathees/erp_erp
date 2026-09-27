// Magnertia ERP - Email Management
// Management -> Communication Management -> Email
// Complete Email Form matching Screenshot 1 and Specifications

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Mail,
  Send,
  Save,
  Clock,
  CheckCircle,
  AlertCircle,
  Inbox,
  Users,
  Paperclip,
  Plus,
  MoreVertical,
  Download,
  Trash2,
  Calendar,
  Sparkles,
  Link as LinkIcon,
  Tag,
  Check,
  ChevronDown,
  ArrowRight,
  FileText,
  FileCheck,
  BookOpen,
  Share2,
  X,
  History,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { CommunicationTabBar } from "@/components/erp/CommunicationManagementTabBar";
import { CommunicationSubmoduleHeader } from "@/components/erp/CommunicationSubmoduleHeader";
import { INITIAL_EMAIL_RECORD } from "@/services/communicationManagementService";

export const Route = createFileRoute("/management/communication-management/email")({
  head: () => ({
    meta: [
      { title: "Email · Communication Management · Magnertia ERP" },
      {
        name: "description",
        content: "Enterprise Controlled Email Communication, Templates, Approvals and Audit.",
      },
    ],
  }),
  component: EmailManagementPage,
});

function EmailManagementPage() {
  const [activeSubTab, setActiveSubTab] = useState<string>("compose");
  const [emailData, setEmailData] = useState(INITIAL_EMAIL_RECORD);
  const [toInput, setToInput] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [setReminder, setSetReminder] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleAddRecipient = (type: "to" | "cc") => {
    if (!toInput.trim()) return;
    if (type === "to") {
      setEmailData({ ...emailData, to: [...emailData.to, toInput.trim()] });
    } else {
      setEmailData({ ...emailData, cc: [...emailData.cc, toInput.trim()] });
    }
    setToInput("");
  };

  const handleRemoveRecipient = (type: "to" | "cc", idx: number) => {
    if (type === "to") {
      const next = [...emailData.to];
      next.splice(idx, 1);
      setEmailData({ ...emailData, to: next });
    } else {
      const next = [...emailData.cc];
      next.splice(idx, 1);
      setEmailData({ ...emailData, cc: next });
    }
  };

  return (
    <AppShell
      title="Email"
      breadcrumb="Management > Communication Management > Email"
      description="Connect. Communicate. Collaborate. Controlled Enterprise Communication & Audit Layer."
      tabs={<CommunicationTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Floating Notification */}
        {notificationMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              {notificationMsg}
            </span>
            <button onClick={() => setNotificationMsg(null)}>
              <X className="h-3.5 w-3.5 text-emerald-600" />
            </button>
          </div>
        )}

        {/* Executive Submodule Header */}
        <CommunicationSubmoduleHeader
          icon={Mail}
          title="Enterprise Email"
          code="EML-2026-001"
          version="v1.0"
          status="Active"
          onSave={() => showNotification("Draft saved to Communication Vault")}
          onSubmit={() => showNotification("Email dispatched to mail queue")}
          onGenerateReport={() => showNotification("Exporting email communication audit")}
          moreActions={[
            {
              label: "Schedule Dispatch",
              icon: Clock,
              onClick: () => setIsScheduled(!isScheduled),
            },
            {
              label: "Request Approval",
              icon: FileCheck,
              onClick: () => showNotification("Approval request submitted to Dept Head"),
            },
          ]}
        />

        {/* Top 6 KPI Cards matching Screenshot 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* 1. Total Emails */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">1,248</div>
                <div className="text-[11px] font-semibold text-slate-500">Total Emails</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 18%
                </div>
              </div>
            </div>

            {/* 2. Sent Emails */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">1,020</div>
                <div className="text-[11px] font-semibold text-slate-500">Sent Emails</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 12%
                </div>
              </div>
            </div>

            {/* 3. Received Emails */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Inbox className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">186</div>
                <div className="text-[11px] font-semibold text-slate-500">Received Emails</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 25%
                </div>
              </div>
            </div>

            {/* 4. Pending Responses */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">32</div>
                <div className="text-[11px] font-semibold text-slate-500">Pending Responses</div>
                <div className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                  ↓ 20%
                </div>
              </div>
            </div>

            {/* 5. Open Threads */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">98</div>
                <div className="text-[11px] font-semibold text-slate-500">Open Threads</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 15%
                </div>
              </div>
            </div>

            {/* 6. Avg Response Time */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">4.2 hrs</div>
                <div className="text-[11px] font-semibold text-slate-500">Avg. Response Time</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↓ 30%
                </div>
              </div>
            </div>
          </div>

          {/* Sub Tabs Pill Row matching Screenshot 1 */}
          <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2">
            {[
              { id: "compose", label: "Compose Email" },
              { id: "templates", label: "Templates" },
              { id: "drafts", label: "Drafts (8)" },
              { id: "sent", label: "Sent" },
              { id: "inbox", label: "Inbox (186)" },
              { id: "scheduled", label: "Scheduled (6)" },
              { id: "approvals", label: "Approvals (2)" },
              { id: "archive", label: "Archive" },
              { id: "analytics", label: "Analytics" },
            ].map((subTab) => (
              <button
                key={subTab.id}
                type="button"
                onClick={() => setActiveSubTab(subTab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                  activeSubTab === subTab.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {subTab.label}
              </button>
            ))}
          </div>

          {/* Email Form Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: 1. Header & 2. Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Email Header */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="text-sm font-bold text-slate-900">1. Email Header</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Draft
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Email Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={emailData.emailType}
                      onChange={(e) => setEmailData({ ...emailData, emailType: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Customer Email</option>
                      <option>Supplier Email</option>
                      <option>Employee Email</option>
                      <option>Government Email</option>
                      <option>Investor Email</option>
                      <option>Internal Email</option>
                      <option>Support Email</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Email Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={emailData.emailCategory}
                      onChange={(e) => setEmailData({ ...emailData, emailCategory: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Sales Communication</option>
                      <option>Procurement RFQ</option>
                      <option>Financial Notification</option>
                      <option>Technical Review</option>
                      <option>Compliance Audit</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                    <select
                      value={emailData.priority}
                      onChange={(e) => setEmailData({ ...emailData, priority: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Low</option>
                      <option>Normal</option>
                      <option>High</option>
                      <option>Urgent</option>
                      <option>Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Confidentiality</label>
                    <select
                      value={emailData.confidentiality}
                      onChange={(e) => setEmailData({ ...emailData, confidentiality: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Public</option>
                      <option>Internal</option>
                      <option>Confidential</option>
                      <option>Secret</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 text-xs">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-medium focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* From & To */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      From <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={emailData.from}
                      readOnly
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      To <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg border border-slate-300 min-h-9">
                      {emailData.to.map((email, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-medium"
                        >
                          {email}
                          <button
                            type="button"
                            onClick={() => handleRemoveRecipient("to", idx)}
                            className="hover:text-blue-900 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="email"
                        placeholder="+ Add recipient"
                        value={toInput}
                        onChange={(e) => setToInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddRecipient("to");
                          }
                        }}
                        className="text-xs outline-none flex-1 min-w-[120px] bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* CC & BCC */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">CC</label>
                    <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg border border-slate-300 min-h-9">
                      {emailData.cc.map((email, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium"
                        >
                          {email}
                          <button
                            type="button"
                            onClick={() => handleRemoveRecipient("cc", idx)}
                            className="hover:text-slate-900 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <span className="text-[11px] text-slate-400">+ Add</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">BCC</label>
                    <input
                      type="text"
                      placeholder="Select recipients"
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Department, Process, Owner, Related Record */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Department</label>
                    <select
                      value={emailData.department}
                      onChange={(e) => setEmailData({ ...emailData, department: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    >
                      <option>Sales & Business Development</option>
                      <option>Procurement</option>
                      <option>Finance</option>
                      <option>Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Process</label>
                    <select
                      value={emailData.process}
                      onChange={(e) => setEmailData({ ...emailData, process: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    >
                      <option>Quotation</option>
                      <option>Purchase Order</option>
                      <option>Invoice</option>
                      <option>Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Owner</label>
                    <div className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-300 bg-white">
                      <span className="h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                        AK
                      </span>
                      <span className="font-medium text-slate-800 text-xs truncate">Arun Kumar</span>
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Related Record</label>
                    <input
                      type="text"
                      value={emailData.relatedOpportunity}
                      readOnly
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Email Content */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="text-sm font-bold text-slate-900">2. Email Content</h3>
                  <button
                    type="button"
                    onClick={() => showNotification("Applied Sales Quotation Template")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Use Template
                  </button>
                </div>

                {/* Editor Toolbar */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 text-xs text-slate-600">
                  <select className="border border-slate-300 rounded px-2 py-0.5 text-xs bg-white">
                    <option>Normal</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  <div className="h-4 w-px bg-slate-300 mx-1" />
                  <button type="button" className="font-bold px-1.5 hover:bg-slate-100 rounded">B</button>
                  <button type="button" className="italic px-1.5 hover:bg-slate-100 rounded">I</button>
                  <button type="button" className="underline px-1.5 hover:bg-slate-100 rounded">U</button>
                  <button type="button" className="line-through px-1.5 hover:bg-slate-100 rounded">S</button>
                  <div className="h-4 w-px bg-slate-300 mx-1" />
                  <button type="button" className="px-1.5 hover:bg-slate-100 rounded">Bullet</button>
                  <button type="button" className="px-1.5 hover:bg-slate-100 rounded">List</button>
                  <button type="button" className="px-1.5 hover:bg-slate-100 rounded">Link</button>
                  <button type="button" className="px-1.5 hover:bg-slate-100 rounded">Table</button>
                </div>

                {/* Body Content */}
                <div className="space-y-3 text-xs text-slate-700 font-sans leading-relaxed">
                  <p>Dear Mr. Vijay,</p>
                  <p>
                    Thank you for your interest in Magnertia's Autonomous Wireless EV Charging Station.
                  </p>
                  <p>
                    Please find attached the detailed quotation for your reference. Our solution offers high efficiency, autonomous docking, and smart charging management, designed for commercial and fleet applications.
                  </p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-semibold text-slate-900">Key Highlights:</div>
                    <ul className="list-disc pl-5 space-y-0.5 text-slate-600">
                      <li>Power Options: 7 kW / 11 kW / 30 kW DC Fast Charging</li>
                      <li>&gt;90% System Efficiency</li>
                      <li>Autonomous Robotic Docking</li>
                      <li>Cloud-based Monitoring & OCPP Compliance</li>
                      <li>Customizable for Fleet & Public Charging</li>
                    </ul>
                  </div>
                  <p>
                    We look forward to your valuable feedback. Please let us know if you need any clarifications.
                  </p>
                  <div className="pt-2 text-slate-600 border-t border-slate-100">
                    <div>Best regards,</div>
                    <div className="font-bold text-slate-900">Arun Kumar</div>
                    <div>General Manager - Business Development</div>
                    <div className="font-semibold text-blue-700">Magnertia Private Limited</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: 3. Attachments, 4. Business Context, 5. Tags, 6. Schedule, 7. Follow-up */}
            <div className="lg:col-span-5 space-y-6">
              {/* 3. Attachments (3) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">3. Attachments (3)</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => showNotification("File upload dialog opened")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Files
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="h-4 w-4 text-rose-500 shrink-0" />
                      <div className="truncate">
                        <div className="font-medium text-slate-800 truncate">Magnertia_Quotation_QTN-2026-01...</div>
                        <div className="text-[11px] text-slate-400">PDF · 1.2 MB · Generated</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button className="p-1 text-slate-400 hover:text-blue-600">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                      <div className="truncate">
                        <div className="font-medium text-slate-800 truncate">Technical_Specification.pdf</div>
                        <div className="text-[11px] text-slate-400">PDF · 2.8 MB · Document Repo</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button className="p-1 text-slate-400 hover:text-blue-600">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="h-4 w-4 text-emerald-500 shrink-0" />
                      <div className="truncate">
                        <div className="font-medium text-slate-800 truncate">Company_Profile.pdf</div>
                        <div className="text-[11px] text-slate-400">PDF · 3.5 MB · Local Upload</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button className="p-1 text-slate-400 hover:text-blue-600">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Business Context */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="text-sm font-bold text-slate-900">4. Business Context</h3>
                  <span className="text-[11px] font-semibold text-blue-600">ERP Linked</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[11px]">Module</label>
                    <div className="font-medium text-slate-800">{emailData.module}</div>
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[11px]">Submodule</label>
                    <div className="font-medium text-slate-800">{emailData.submodule}</div>
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[11px]">Transaction Number</label>
                    <div className="font-mono font-medium text-blue-700">{emailData.transactionNumber}</div>
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[11px]">Customer</label>
                    <div className="font-medium text-slate-800 truncate">{emailData.customer}</div>
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[11px]">Project</label>
                    <div className="font-medium text-slate-800">{emailData.project}</div>
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[11px]">Related Opportunity</label>
                    <div className="font-mono text-slate-700">{emailData.relatedOpportunity}</div>
                  </div>
                </div>
              </div>

              {/* 5. Tags & Classification */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="text-sm font-bold text-slate-900">5. Tags & Classification</h3>
                  <button className="text-xs font-semibold text-blue-600 hover:underline">Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[11px]">Domain</label>
                    <div className="font-medium text-slate-800">{emailData.communicationDomain}</div>
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[11px]">Business Function</label>
                    <div className="font-medium text-slate-800">{emailData.businessFunction}</div>
                  </div>
                </div>
                <div className="pt-1 flex flex-wrap gap-1.5">
                  {emailData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]"
                    >
                      {tag}
                      <button className="text-slate-400 hover:text-slate-600">×</button>
                    </span>
                  ))}
                  <button className="text-[11px] font-semibold text-blue-600 hover:underline">
                    + Add Tag
                  </button>
                </div>
              </div>

              {/* 6. Schedule / Reminder */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="text-sm font-bold text-slate-900">6. Schedule / Reminder</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isScheduled}
                      onChange={(e) => setIsScheduled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 block mb-1 text-[11px]">Send Date</label>
                    <input
                      type="date"
                      disabled={!isScheduled}
                      defaultValue="2026-09-20"
                      className="w-full rounded-lg border border-slate-300 p-1.5 text-xs disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1 text-[11px]">Send Time</label>
                    <input
                      type="time"
                      disabled={!isScheduled}
                      defaultValue="10:00"
                      className="w-full rounded-lg border border-slate-300 p-1.5 text-xs disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    id="reminderCheckbox"
                    checked={setReminder}
                    onChange={(e) => setSetReminder(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="reminderCheckbox" className="font-medium text-slate-700 cursor-pointer">
                    Set Reminder
                  </label>
                </div>
              </div>

              {/* 7. Follow-up Action */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="text-sm font-bold text-slate-900">7. Follow-up Action</h3>
                  <button
                    type="button"
                    onClick={() => showNotification("Task created in Project module")}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    + Create Task
                  </button>
                </div>

                <div className="text-xs space-y-2">
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[11px]">Action Required</label>
                    <input
                      type="text"
                      defaultValue={emailData.followUpAction}
                      className="w-full rounded-lg border border-slate-300 p-1.5 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-500 block mb-0.5 text-[11px]">Assign To</label>
                      <input
                        type="text"
                        defaultValue={emailData.followUpAssignee}
                        className="w-full rounded-lg border border-slate-300 p-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-0.5 text-[11px]">Due Date</label>
                      <input
                        type="date"
                        defaultValue="2026-09-22"
                        className="w-full rounded-lg border border-slate-300 p-1.5 text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                    <span className="font-semibold text-slate-600">Status:</span>
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Open</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid: 8. Review & Approval, 9. Version History, 10. Related Knowledge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 8. Review & Approval Pipeline */}
            <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="text-sm font-bold text-slate-900">8. Review & Approval</h3>
                <button
                  type="button"
                  onClick={() => showNotification("Approval requested")}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Request Approval
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between pt-2 px-1">
                <div className="flex flex-col items-center text-center">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 mt-1">Draft</span>
                  <span className="text-[10px] text-slate-400">15-Sep-2026</span>
                </div>
                <div className="h-0.5 w-8 bg-blue-300 -mt-5" />
                <div className="flex flex-col items-center text-center">
                  <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 border border-slate-300 flex items-center justify-center text-xs font-semibold">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 mt-1">Review</span>
                </div>
                <div className="h-0.5 w-8 bg-slate-200 -mt-5" />
                <div className="flex flex-col items-center text-center">
                  <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 border border-slate-300 flex items-center justify-center text-xs font-semibold">
                    <FileCheck className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 mt-1">Approval</span>
                </div>
                <div className="h-0.5 w-8 bg-slate-200 -mt-5" />
                <div className="flex flex-col items-center text-center">
                  <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 border border-slate-300 flex items-center justify-center text-xs font-semibold">
                    <Send className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 mt-1">Sent</span>
                </div>
              </div>
            </div>

            {/* 9. Version History */}
            <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="text-sm font-bold text-slate-900">9. Version History</h3>
                <button className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="p-1.5">Version</th>
                      <th className="p-1.5">Date</th>
                      <th className="p-1.5">Changed By</th>
                      <th className="p-1.5">Comments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-1.5 font-bold text-blue-600">v1.0</td>
                      <td className="p-1.5 text-slate-500">15-Sep-2026</td>
                      <td className="p-1.5 font-medium">Arun Kumar</td>
                      <td className="p-1.5 text-slate-500">Initial draft</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-medium text-slate-700">v0.9</td>
                      <td className="p-1.5 text-slate-500">14-Sep-2026</td>
                      <td className="p-1.5 font-medium">Priya Sharma</td>
                      <td className="p-1.5 text-slate-500">Updated pricing</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 10. Related Knowledge */}
            <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="text-sm font-bold text-slate-900">10. Related Knowledge</h3>
                <button className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  <LinkIcon className="h-3 w-3" /> Link
                </button>
              </div>

              {/* Knowledge Tabs */}
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 border-b pb-1.5">
                <span className="text-blue-600 border-b-2 border-blue-600 pb-1">SOPs (1)</span>
                <span>Wiki (2)</span>
                <span>Technical Library (1)</span>
                <span>Templates (2)</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="font-medium text-slate-800">SOP - Quotation Process</span>
                  </div>
                  <span className="text-[10px] text-slate-400">SOP</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                    <span className="font-medium text-slate-800">Wireless EV Charging Overview</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Wiki</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="font-medium text-slate-800">Product Brochure Template</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Template</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </AppShell>
  );
}
