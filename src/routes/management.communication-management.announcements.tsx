// Magnertia ERP - Announcements Management
// Management -> Communication Management -> Announcements
// Complete 5-Step Announcement Wizard matching Screenshot 5 and Specifications

import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCommunicationManagementRecordFn } from "@/lib/communicationManagementFns.server";
import {
  Megaphone,
  Save,
  Send,
  Eye,
  MoreVertical,
  Plus,
  Sparkles,
  Paperclip,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  Shield,
  FileText,
  Download,
  Check,
  Edit2,
  Sliders,
  X,
  ArrowRight,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { CommunicationTabBar } from "@/components/erp/CommunicationManagementTabBar";
import { CommunicationSubmoduleHeader } from "@/components/erp/CommunicationSubmoduleHeader";
import {
  INITIAL_ANNOUNCEMENT_RECORD,
  MOCK_AUDIENCE_RECIPIENTS,
} from "@/services/communicationManagementService";

export const Route = createFileRoute("/management/communication-management/announcements")({
  head: () => ({
    meta: [
      { title: "Announcements · Communication Management · Magnertia ERP" },
      {
        name: "description",
        content: "Enterprise Controlled Announcements, 5-Step Authoring Wizard, Targeted Audience and Multi-Channel Broadcast.",
      },
    ],
  }),
  component: AnnouncementsManagementPage,
});

function AnnouncementsManagementPage() {
  const { data: dbRecord } = useQuery({
    queryKey: ["communication-management", "record"],
    queryFn: () => getCommunicationManagementRecordFn({ data: {} }),
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [contentTab, setContentTab] = useState<string>("content");
  const [audienceTab, setAudienceTab] = useState<string>("recipients");
  const [previewTab, setPreviewTab] = useState<string>("in_app");
  const [announcement, setAnnouncement] = useState(INITIAL_ANNOUNCEMENT_RECORD);
  useEffect(() => { if (dbRecord?.data) setAnnouncement(dbRecord.data); }, [dbRecord]);
  const [notifyInApp, setNotifyInApp] = useState<boolean>(true);
  const [notifyEmail, setNotifyEmail] = useState<boolean>(true);
  const [notifySms, setNotifySms] = useState<boolean>(false);
  const [notifyWhatsApp, setNotifyWhatsApp] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <AppShell
      title="Announcements"
      breadcrumb="Management > Communication Management > Announcements"
      description="Communicate today for a stronger tomorrow. Governed enterprise announcements & policy distribution."
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
          icon={Megaphone}
          title="Enterprise Announcements"
          code="ANN-2026-001"
          version="v1.0"
          status="Active"
          onSave={() => showToast("Announcement Draft Saved to Communication Vault")}
          onSubmit={() => showToast("Submitted for Multi-Level Review & Approval")}
          onGenerateReport={() => showToast("Generating acknowledgement compliance report")}
          moreActions={[
            {
              label: "Live Preview",
              icon: Eye,
              onClick: () => showToast("Toggling Live Preview"),
            },
          ]}
        />

        {/* 5-Step Wizard Progress Bar matching Screenshot 5 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between px-8">
            {/* Step 1: Create */}
            <div
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                  currentStep >= 1 ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-500"
                }`}
              >
                1
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 leading-tight">Create</div>
                <div className="text-[10px] text-slate-400">Announcement Details</div>
              </div>
            </div>
            <div className={`h-0.5 flex-1 mx-4 ${currentStep >= 2 ? "bg-blue-600" : "bg-slate-200"}`} />

            {/* Step 2: Content */}
            <div
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                  currentStep >= 2 ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-500"
                }`}
              >
                2
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 leading-tight">Content</div>
                <div className="text-[10px] text-slate-400">Write & Format</div>
              </div>
            </div>
            <div className={`h-0.5 flex-1 mx-4 ${currentStep >= 3 ? "bg-blue-600" : "bg-slate-200"}`} />

            {/* Step 3: Audience */}
            <div
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                  currentStep >= 3 ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-500"
                }`}
              >
                3
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 leading-tight">Audience</div>
                <div className="text-[10px] text-slate-400">Select Recipients</div>
              </div>
            </div>
            <div className={`h-0.5 flex-1 mx-4 ${currentStep >= 4 ? "bg-blue-600" : "bg-slate-200"}`} />

            {/* Step 4: Review & Approve */}
            <div
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                  currentStep >= 4 ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-500"
                }`}
              >
                4
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 leading-tight">Review & Approve</div>
                <div className="text-[10px] text-slate-400">Workflow</div>
              </div>
            </div>
            <div className={`h-0.5 flex-1 mx-4 ${currentStep >= 5 ? "bg-blue-600" : "bg-slate-200"}`} />

            {/* Step 5: Publish */}
            <div
              onClick={() => setCurrentStep(5)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                  currentStep >= 5 ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-500"
                }`}
              >
                5
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 leading-tight">Publish</div>
                <div className="text-[10px] text-slate-400">Go Live</div>
              </div>
            </div>
          </div>

          {/* Form Split Grid matching Screenshot 5 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: 1. Announcement Details & 2. Announcement Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Announcement Details */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="text-sm font-bold text-slate-900">1. Announcement Details</h3>
                  <span className="text-[11px] font-semibold text-slate-500">Step 1 of 5</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Announcement Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={announcement.announcementNumber}
                        readOnly
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-700"
                      />
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold">
                        Auto
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">
                      Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={announcement.title}
                      onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs font-medium focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Announcement Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={announcement.type}
                      onChange={(e) => setAnnouncement({ ...announcement, type: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    >
                      <option>Policy Announcement</option>
                      <option>Corporate Announcement</option>
                      <option>Operational Announcement</option>
                      <option>Quality Announcement</option>
                      <option>Safety Announcement</option>
                      <option>Compliance Announcement</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={announcement.category}
                      onChange={(e) => setAnnouncement({ ...announcement, category: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    >
                      <option>Quality</option>
                      <option>Safety</option>
                      <option>Compliance</option>
                      <option>HR</option>
                      <option>Operations</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-300 bg-white">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      <select
                        value={announcement.priority}
                        onChange={(e) => setAnnouncement({ ...announcement, priority: e.target.value as any })}
                        className="w-full text-xs outline-none bg-transparent"
                      >
                        <option>Low</option>
                        <option>Normal</option>
                        <option>High</option>
                        <option>Urgent</option>
                        <option>Critical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Severity</label>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-300 bg-white">
                      <Flame className="h-3.5 w-3.5 text-rose-500" />
                      <select
                        value={announcement.severity}
                        onChange={(e) => setAnnouncement({ ...announcement, severity: e.target.value as any })}
                        className="w-full text-xs outline-none bg-transparent"
                      >
                        <option>Information</option>
                        <option>Advisory</option>
                        <option>Warning</option>
                        <option>Critical</option>
                        <option>Emergency</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Function, Module, Process, Owner, Publisher */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs pt-1">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Business Function</label>
                    <select
                      value={announcement.businessFunction}
                      onChange={(e) => setAnnouncement({ ...announcement, businessFunction: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    >
                      <option>Quality Management</option>
                      <option>Operations</option>
                      <option>Engineering</option>
                      <option>HR</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Module</label>
                    <select
                      value={announcement.module}
                      onChange={(e) => setAnnouncement({ ...announcement, module: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    >
                      <option>Quality</option>
                      <option>Manufacturing</option>
                      <option>Supply Chain</option>
                      <option>HRMS</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Process</label>
                    <select
                      value={announcement.process}
                      onChange={(e) => setAnnouncement({ ...announcement, process: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    >
                      <option>Final Inspection</option>
                      <option>Incoming Quality</option>
                      <option>In-Process</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Owner *</label>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-300 bg-white">
                      <span className="h-5 w-5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                        AK
                      </span>
                      <span className="truncate text-slate-800 text-[11px] font-medium">Arun Kumar</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Publisher</label>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-300 bg-white">
                      <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                        RS
                      </span>
                      <span className="truncate text-slate-800 text-[11px] font-medium">Ramesh S</span>
                    </div>
                  </div>
                </div>

                {/* Dates & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Effective Date *</label>
                    <input
                      type="date"
                      defaultValue={announcement.effectiveDate}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Expiry Date</label>
                    <input
                      type="date"
                      defaultValue={announcement.expiryDate}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Status</label>
                    <div className="p-2 rounded-lg border border-slate-300 bg-slate-50 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Draft
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Confidentiality</label>
                    <select
                      value={announcement.confidentiality}
                      onChange={(e) => setAnnouncement({ ...announcement, confidentiality: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    >
                      <option>Internal</option>
                      <option>Public</option>
                      <option>Confidential</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Announcement Content */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">2. Announcement Content</h3>
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md text-[11px] font-semibold">
                      {["content", "summary", "key_message", "instructions", "call_to_action"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setContentTab(tab)}
                          className={`px-2 py-0.5 rounded capitalize ${
                            contentTab === tab
                              ? "bg-blue-600 text-white font-bold"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {tab.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => showToast("Loaded Policy Announcement Template")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
                    >
                      Use Template
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("AI Draft Assistant enhanced announcement text")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-purple-600" /> AI Assist
                    </button>
                  </div>
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
                <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-sans">
                  <h4 className="font-bold text-sm text-slate-900">New Quality Inspection Procedure</h4>
                  <p>
                    We are pleased to announce the implementation of a revised Quality Inspection Procedure effective 20th September 2026.
                  </p>
                  <p>
                    The updated procedure enhances inspection accuracy, standardizes documentation, and aligns with our ISO 9001:2015 compliance requirements.
                  </p>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-semibold text-slate-900">Key Highlights:</div>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      <li>Updated inspection checklist (Version 2.0)</li>
                      <li>Digital inspection records in ERP</li>
                      <li>Mandatory photo evidence for critical components</li>
                      <li>Applicable to all manufacturing sites</li>
                      <li>Training sessions scheduled next week</li>
                    </ul>
                  </div>

                  <p>
                    For details, please refer to the attached document or contact the Quality Assurance team.
                  </p>

                  <div className="pt-2 text-slate-600 border-t border-slate-100 text-xs">
                    <div>Regards,</div>
                    <div className="font-bold text-slate-900">Quality Management Team</div>
                    <div>Magnertia Private Limited</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t text-[11px] text-slate-400">
                  <span>Words: 86</span>
                  <span>Draft saved at 10:24 AM</span>
                </div>
              </div>

              {/* 6. Approval Workflow */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="text-sm font-bold text-slate-900">6. Approval Workflow</h3>
                  <button className="text-xs font-semibold text-blue-600 hover:underline">View Workflow</button>
                </div>

                <div className="flex items-center justify-between pt-2 px-2 text-center text-xs">
                  <div>
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mx-auto shadow-xs">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="font-bold text-slate-900 text-[11px] mt-1">Draft</div>
                    <div className="text-[10px] text-slate-400">19-Sep-2026</div>
                  </div>
                  <div className="h-0.5 flex-1 bg-emerald-500 mx-2 -mt-5" />

                  <div>
                    <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 border border-slate-300 flex items-center justify-center font-bold text-xs mx-auto">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="font-medium text-slate-700 text-[11px] mt-1">Content Review</div>
                    <div className="text-[10px] text-amber-600 font-semibold">Pending</div>
                  </div>
                  <div className="h-0.5 flex-1 bg-slate-200 mx-2 -mt-5" />

                  <div>
                    <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 border border-slate-300 flex items-center justify-center font-bold text-xs mx-auto">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="font-medium text-slate-700 text-[11px] mt-1">Management Review</div>
                    <div className="text-[10px] text-amber-600 font-semibold">Pending</div>
                  </div>
                  <div className="h-0.5 flex-1 bg-slate-200 mx-2 -mt-5" />

                  <div>
                    <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 border border-slate-300 flex items-center justify-center font-bold text-xs mx-auto">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="font-medium text-slate-700 text-[11px] mt-1">Approval</div>
                    <div className="text-[10px] text-amber-600 font-semibold">Pending</div>
                  </div>
                  <div className="h-0.5 flex-1 bg-slate-200 mx-2 -mt-5" />

                  <div>
                    <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-400 border border-slate-300 flex items-center justify-center font-bold text-xs mx-auto">
                      <Send className="h-4 w-4" />
                    </div>
                    <div className="font-medium text-slate-500 text-[11px] mt-1">Publish</div>
                    <div className="text-[10px] text-slate-400">-</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: 3. Audience, 4. Attachments, 5. Schedule, 7. Preview */}
            <div className="lg:col-span-5 space-y-6">
              {/* 3. Audience & Targeting */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="text-sm font-bold text-slate-900">3. Audience & Targeting</h3>
                  <button className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add Audience
                  </button>
                </div>

                {/* Audience Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                  {["recipients (4)", "departments", "roles", "sites", "user groups"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAudienceTab(tab)}
                      className={`px-2 py-1 rounded capitalize ${
                        audienceTab === tab ? "bg-blue-600 text-white shadow-xs font-bold" : "text-slate-600"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Audience Table */}
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                      <tr>
                        <th className="p-1.5">#</th>
                        <th className="p-1.5">Audience Type</th>
                        <th className="p-1.5">Name</th>
                        <th className="p-1.5">Recipients</th>
                        <th className="p-1.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOCK_AUDIENCE_RECIPIENTS.map((aud) => (
                        <tr key={aud.id}>
                          <td className="p-1.5 font-bold text-slate-400">{aud.id}</td>
                          <td className="p-1.5 font-medium text-slate-800">{aud.type}</td>
                          <td className="p-1.5 text-slate-600">{aud.name}</td>
                          <td className="p-1.5 font-bold text-blue-700">{aud.count}</td>
                          <td className="p-1.5 text-right text-slate-400">
                            <button className="hover:text-slate-600">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Targeting Rules */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Targeting Rules</span>
                    <button className="text-blue-600 text-[11px] font-semibold hover:underline">Edit Rules</button>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600">
                    Department = Quality<br />
                    AND Process = Final Inspection<br />
                    AND Site = Coimbatore
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold pt-1">
                    ✓ Matches 30 Quality Inspectors
                  </div>
                </div>
              </div>

              {/* 4. Attachments (3) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="text-sm font-bold text-slate-900">4. Attachments (3)</h3>
                  <button className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add Files
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { name: "Quality_Inspection_Procedure_v2.0.pdf", type: "PDF", size: "2.4 MB", author: "Arun Kumar" },
                    { name: "Inspection_Checklist.xlsx", type: "XLSX", size: "1.1 MB", author: "Priya Sharma" },
                    { name: "Training_Schedule.pdf", type: "PDF", size: "320 KB", author: "Ramesh S" },
                  ].map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-slate-800 text-[11px]">{f.name}</div>
                          <div className="text-[10px] text-slate-400">{f.type} · {f.size} · {f.author}</div>
                        </div>
                      </div>
                      <Download className="h-3.5 w-3.5 text-slate-400 hover:text-blue-600 cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Schedule & Notifications */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="text-sm font-bold text-slate-900">5. Schedule & Notifications</h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-500 block mb-1 text-[11px]">Publication Type</label>
                    <select className="w-full rounded-lg border border-slate-300 p-1.5 text-xs bg-white">
                      <option>Scheduled</option>
                      <option>Immediate</option>
                      <option>Recurring</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1 text-[11px]">Publish Date *</label>
                    <input type="date" defaultValue="2026-09-20" className="w-full rounded-lg border border-slate-300 p-1.5 text-xs" />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1 text-[11px]">Publish Time *</label>
                    <input type="time" defaultValue="09:00" className="w-full rounded-lg border border-slate-300 p-1.5 text-xs" />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Send Notifications via</label>
                  <div className="flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={notifyInApp} onChange={(e) => setNotifyInApp(e.target.checked)} className="rounded text-blue-600" />
                      <span>In-App</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} className="rounded text-blue-600" />
                      <span>Email</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={notifySms} onChange={(e) => setNotifySms(e.target.checked)} className="rounded text-blue-600" />
                      <span>SMS</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={notifyWhatsApp} onChange={(e) => setNotifyWhatsApp(e.target.checked)} className="rounded text-blue-600" />
                      <span>WhatsApp</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 7. Preview (Email / In-App) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="text-sm font-bold text-slate-900">7. Preview (Email / In-App)</h3>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[11px] font-semibold">
                    <button
                      onClick={() => setPreviewTab("in_app")}
                      className={`px-2 py-0.5 rounded ${previewTab === "in_app" ? "bg-blue-600 text-white font-bold" : "text-slate-600"}`}
                    >
                      In-App Preview
                    </button>
                    <button
                      onClick={() => setPreviewTab("email")}
                      className={`px-2 py-0.5 rounded ${previewTab === "email" ? "bg-blue-600 text-white font-bold" : "text-slate-600"}`}
                    >
                      Email Preview
                    </button>
                    <button
                      onClick={() => setPreviewTab("mobile")}
                      className={`px-2 py-0.5 rounded ${previewTab === "mobile" ? "bg-blue-600 text-white font-bold" : "text-slate-600"}`}
                    >
                      Mobile Preview
                    </button>
                  </div>
                </div>

                {/* Preview Banner Card matching Screenshot 5 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-linear-to-r from-red-500/10 via-rose-50 to-white flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-xs truncate">New Quality Inspection Procedure</h4>
                      <span className="px-2 py-0.2 rounded bg-rose-100 text-rose-700 font-bold text-[9px]">
                        High Priority
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">20-Sep-2026</div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                      We are pleased to announce the implementation of a revised Quality Inspection Procedure effective 20th September 2026...
                    </p>
                    <button className="text-[11px] text-blue-600 font-bold hover:underline mt-1 block">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </AppShell>
  );
}
