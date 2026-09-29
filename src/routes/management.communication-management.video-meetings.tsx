// Magnertia ERP - Video Meetings Collaboration
// Management -> Communication Management -> Video Meetings
// Complete Video Meetings Workspace matching Screenshot 3 and Specifications

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCommunicationManagementRecordFn } from "@/lib/communicationManagementFns.server";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  ScreenShare,
  Circle,
  Users,
  MessageSquare,
  MoreVertical,
  PhoneOff,
  Plus,
  Edit2,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  Sparkles,
  ExternalLink,
  Download,
  AlertCircle,
  X,
  Play,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { CommunicationTabBar } from "@/components/erp/CommunicationManagementTabBar";
import { CommunicationSubmoduleHeader } from "@/components/erp/CommunicationSubmoduleHeader";
import {
  MOCK_MEETING_KPIS,
  MOCK_ACTIVE_MEETING,
} from "@/services/communicationManagementService";

export const Route = createFileRoute("/management/communication-management/video-meetings")({
  head: () => ({
    meta: [
      { title: "Video Meetings · Communication Management · Magnertia ERP" },
      {
        name: "description",
        content: "Enterprise Video Collaboration, Screen Sharing, Meeting Minutes, AI Transcription and Action Items.",
      },
    ],
  }),
  component: VideoMeetingsPage,
});

function VideoMeetingsPage() {
  const { data: dbRecord } = useQuery({
    queryKey: ["communication-management", "record"],
    queryFn: () => getCommunicationManagementRecordFn({ data: {} }),
  });

  const [activeNavTab, setActiveNavTab] = useState<string>("overview");
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>("");
  const [meetingChat, setMeetingChat] = useState([
    {
      sender: "Priya Sharma",
      time: "10:12 AM",
      text: "Sharing the latest test results.",
      attachment: "WPT_Test_Results.pdf (2.4 MB)",
    },
    {
      sender: "Ramesh S",
      time: "10:15 AM",
      text: "The efficiency is above 92%. Let's discuss the next steps.",
    },
    {
      sender: "Sankaranarayanan",
      time: "10:18 AM",
      text: "I'll share the commercialization roadmap.",
    },
  ]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const copyMeetingLink = () => {
    navigator.clipboard?.writeText(MOCK_ACTIVE_MEETING.meetingLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setMeetingChat([
      ...meetingChat,
      {
        sender: "Arun Kumar (You)",
        time: "10:25 AM",
        text: chatInput.trim(),
      },
    ]);
    setChatInput("");
  };

  return (
    <AppShell
      title="Video Meetings"
      breadcrumb="Management > Communication Management > Video Meetings"
      description="Collaborate. Discuss. Decide. Deliver. Real-time video conferencing & action tracking."
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
          icon={Video}
          title="Video Meetings"
          code="MTG-2026-001"
          version="v1.0"
          status="Active"
          onSave={() => showToast("Meeting record saved to vault")}
          onSubmit={() => showToast("Meeting minutes and action items submitted")}
          onGenerateReport={() => showToast("Exporting Meeting Minutes (MoM)")}
          moreActions={[
            {
              label: "Join Virtual Room",
              icon: Video,
              onClick: () => showToast("Connecting to Virtual Meeting Room..."),
            },
            {
              label: "Schedule New Meeting",
              icon: Calendar,
              onClick: () => showToast("Schedule New Meeting Modal"),
            },
          ]}
        />

        {/* Top 6 KPI Cards matching Screenshot 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* 1. Total Meetings */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">32</div>
                <div className="text-[11px] font-semibold text-slate-500">Total Meetings</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 18%
                </div>
              </div>
            </div>

            {/* 2. This Month */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">12</div>
                <div className="text-[11px] font-semibold text-slate-500">This Month</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 33%
                </div>
              </div>
            </div>

            {/* 3. Completed */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">28</div>
                <div className="text-[11px] font-semibold text-slate-500">Completed</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 27%
                </div>
              </div>
            </div>

            {/* 4. In Progress */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">3</div>
                <div className="text-[11px] font-semibold text-slate-500">In Progress</div>
                <div className="text-[10px] font-bold text-blue-600">Active Live</div>
              </div>
            </div>

            {/* 5. Upcoming */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">1</div>
                <div className="text-[11px] font-semibold text-slate-500">Upcoming</div>
                <div className="text-[10px] font-bold text-amber-600">In 35 mins</div>
              </div>
            </div>

            {/* 6. Attendance Rate */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">92%</div>
                <div className="text-[11px] font-semibold text-slate-500">Attendance Rate</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 5%
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Ribbon Navigation matching Screenshot 3 */}
          <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2">
            {[
              { id: "overview", label: "Overview" },
              { id: "agenda", label: "Agenda" },
              { id: "participants", label: "Participants (8)" },
              { id: "documents", label: "Documents (5)" },
              { id: "recording", label: "Recording & Transcript" },
              { id: "actions", label: "Action Items (4)" },
              { id: "chat", label: "Chat" },
              { id: "polls", label: "Polls" },
              { id: "related", label: "Related Records" },
              { id: "history", label: "History" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveNavTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                  activeNavTab === tab.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 3-Column Conference Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Meeting Details (3 cols) */}
            <div className="lg:col-span-3 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="font-bold text-slate-900 text-sm">Meeting Details</h3>
                <button className="text-blue-600 hover:underline flex items-center gap-1 font-semibold text-[11px]">
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">Meeting Number</span>
                  <span className="font-mono font-bold text-slate-800">{MOCK_ACTIVE_MEETING.meetingNumber}</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Meeting Title</span>
                  <span className="font-semibold text-slate-900">{MOCK_ACTIVE_MEETING.title}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Type</span>
                    <span className="font-medium text-slate-800">{MOCK_ACTIVE_MEETING.meetingType}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Category</span>
                    <span className="font-medium text-slate-800">{MOCK_ACTIVE_MEETING.category}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Organizer</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="h-5 w-5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">AK</span>
                      <span className="font-medium text-slate-800">{MOCK_ACTIVE_MEETING.organizer}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Host</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="h-5 w-5 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">PS</span>
                      <span className="font-medium text-slate-800">{MOCK_ACTIVE_MEETING.host}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] text-slate-400 block">Date & Time</span>
                  <div className="font-medium text-slate-800">{MOCK_ACTIVE_MEETING.date}</div>
                  <div className="text-[11px] text-slate-600">{MOCK_ACTIVE_MEETING.time}</div>
                  <div className="text-[10px] text-slate-400">{MOCK_ACTIVE_MEETING.timeZone}</div>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] text-slate-400 block">Meeting Link</span>
                  <div className="flex items-center justify-between p-1.5 rounded-lg border border-slate-200 bg-slate-50 mt-0.5">
                    <span className="text-[11px] font-mono text-blue-700 truncate">{MOCK_ACTIVE_MEETING.meetingLink}</span>
                    <button onClick={copyMeetingLink} className="p-1 hover:text-blue-600 text-slate-400">
                      {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Meeting ID</span>
                    <span className="font-mono text-slate-800">{MOCK_ACTIVE_MEETING.meetingCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Passcode</span>
                    <span className="font-mono text-slate-800">{MOCK_ACTIVE_MEETING.password}</span>
                  </div>
                </div>

                <div className="pt-2 border-t text-[11px]">
                  <span className="text-slate-400 block">Description</span>
                  <p className="text-slate-600 leading-relaxed mt-0.5">{MOCK_ACTIVE_MEETING.description}</p>
                </div>

                <div className="pt-2 flex flex-wrap gap-1">
                  {MOCK_ACTIVE_MEETING.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column: Video Conference & Agendas / Actions (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              {/* Video Conference Screen */}
              <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-md flex flex-col">
                {/* Conference Top Bar */}
                <div className="p-3 bg-slate-950/80 px-4 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-white">Video Conference</span>
                    <span className="font-mono text-slate-400">00:42:16</span>
                    <span className="text-[11px] text-slate-500">8 Participants</span>
                  </div>
                  <button className="text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded">
                    Gallery View ▾
                  </button>
                </div>

                {/* 3x3 Video Tile Grid matching Screenshot 3 */}
                <div className="p-3 grid grid-cols-3 gap-2 bg-slate-900 aspect-video max-h-[360px]">
                  {/* Tile 1: Arun Kumar (You) */}
                  <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-emerald-500/80 flex items-center justify-center group">
                    <div className="h-16 w-16 rounded-full bg-linear-to-br from-blue-600 to-indigo-700 text-white font-bold text-lg flex items-center justify-center shadow-lg">
                      AK
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">
                      <Mic className="h-3 w-3 text-emerald-400" />
                      <span>Arun Kumar (You)</span>
                    </div>
                  </div>

                  {/* Tile 2: Priya Sharma (Host) */}
                  <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-linear-to-br from-purple-600 to-pink-700 text-white font-bold text-lg flex items-center justify-center shadow-lg">
                      PS
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">
                      <Mic className="h-3 w-3 text-emerald-400" />
                      <span>Priya Sharma</span>
                    </div>
                  </div>

                  {/* Tile 3: Ramesh S */}
                  <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-linear-to-br from-emerald-600 to-teal-700 text-white font-bold text-lg flex items-center justify-center shadow-lg">
                      RS
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">
                      <Mic className="h-3 w-3 text-emerald-400" />
                      <span>Ramesh S</span>
                    </div>
                  </div>

                  {/* Tile 4: Vijay K */}
                  <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-linear-to-br from-amber-600 to-orange-700 text-white font-bold text-lg flex items-center justify-center shadow-lg">
                      VK
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">
                      <MicOff className="h-3 w-3 text-rose-400" />
                      <span>Vijay K</span>
                    </div>
                  </div>

                  {/* Tile 5: Sankaranarayanan */}
                  <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-linear-to-br from-cyan-600 to-blue-700 text-white font-bold text-lg flex items-center justify-center shadow-lg">
                      S
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">
                      <Mic className="h-3 w-3 text-emerald-400" />
                      <span>Sankaranarayanan</span>
                    </div>
                  </div>

                  {/* Tile 6: Divya M */}
                  <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-linear-to-br from-rose-600 to-pink-700 text-white font-bold text-lg flex items-center justify-center shadow-lg">
                      DM
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">
                      <MicOff className="h-3 w-3 text-rose-400" />
                      <span>Divya M</span>
                    </div>
                  </div>

                  {/* Tile 7: James (GreenFleet) */}
                  <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-slate-700 text-slate-300 font-bold text-lg flex items-center justify-center">
                      J
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">
                      <Mic className="h-3 w-3 text-emerald-400" />
                      <span>James (GreenFleet)</span>
                    </div>
                  </div>

                  {/* Tile 8: Sarah (TechConsult) */}
                  <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-slate-700 text-slate-300 font-bold text-lg flex items-center justify-center">
                      S
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">
                      <MicOff className="h-3 w-3 text-rose-400" />
                      <span>Sarah (TechConsult)</span>
                    </div>
                  </div>

                  {/* Tile 9: Rahul G */}
                  <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-slate-700 text-slate-300 font-bold text-lg flex items-center justify-center">
                      RG
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">
                      <span>Rahul G</span>
                    </div>
                  </div>
                </div>

                {/* Call Control Strip */}
                <div className="p-3 bg-slate-950 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`p-2.5 rounded-full text-white transition ${isMicOn ? "bg-slate-800 hover:bg-slate-700" : "bg-rose-600 hover:bg-rose-700"}`}
                    title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                  >
                    {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-2.5 rounded-full text-white transition ${isVideoOn ? "bg-slate-800 hover:bg-slate-700" : "bg-rose-600 hover:bg-rose-700"}`}
                    title={isVideoOn ? "Stop Video" : "Start Video"}
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setIsSharing(!isSharing)}
                    className={`p-2.5 rounded-full text-white transition ${isSharing ? "bg-blue-600" : "bg-slate-800 hover:bg-slate-700"}`}
                    title="Share Screen"
                  >
                    <ScreenShare className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-2.5 rounded-full text-white transition ${isRecording ? "bg-red-900/80 text-red-400" : "bg-slate-800 hover:bg-slate-700"}`}
                    title="Record Meeting"
                  >
                    <Circle className={`h-4 w-4 ${isRecording ? "fill-red-500 animate-pulse" : ""}`} />
                  </button>
                  <button
                    onClick={() => showToast("Opening Participant List")}
                    className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white"
                    title="Participants"
                  >
                    <Users className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => showToast("Opening Chat Panel")}
                    className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white"
                    title="Chat"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => showToast("Leaving Meeting Session")}
                    className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Leave
                  </button>
                </div>
              </div>

              {/* Lower Split: Upcoming Agenda & Action Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upcoming Agenda */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b">
                    <h4 className="font-bold text-slate-900 text-xs">Upcoming Agenda</h4>
                    <button className="text-blue-600 font-semibold text-[11px] hover:underline">+ Add</button>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {MOCK_ACTIVE_MEETING.agenda.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400 text-[11px]">#{item.id}</span>
                          <div>
                            <div className="font-medium text-slate-800 text-[11px]">{item.topic}</div>
                            <div className="text-[10px] text-slate-400">{item.presenter} · {item.duration}</div>
                          </div>
                        </div>
                        {item.status === "completed" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        ) : item.status === "in_progress" ? (
                          <Clock className="h-3.5 w-3.5 text-blue-600 animate-spin" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-slate-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Items (4) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b">
                    <h4 className="font-bold text-slate-900 text-xs">Action Items (4)</h4>
                    <button className="text-blue-600 font-semibold text-[11px] hover:underline">View All</button>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {MOCK_ACTIVE_MEETING.actionItems.map((act) => (
                      <div key={act.id} className="p-1.5 rounded hover:bg-slate-50 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-800 text-[11px]">{act.action}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            act.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {act.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span>{act.owner}</span>
                          <span>Due: {act.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Participants & Meeting Chat (3 cols) */}
            <div className="lg:col-span-3 space-y-5">
              {/* Participants List */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900">Participants (8)</h4>
                  <button className="text-blue-600 font-semibold text-[11px] hover:underline">+ Add</button>
                </div>

                <div className="space-y-2">
                  {MOCK_ACTIVE_MEETING.participants.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                          {p.name.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-800 text-[11px] leading-tight">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {p.mic ? (
                          <Mic className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <MicOff className="h-3 w-3 text-rose-500" />
                        )}
                        <MoreVertical className="h-3 w-3 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meeting Chat */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900">Meeting Chat</h4>
                  <button className="text-blue-600 font-semibold text-[11px] hover:underline">View All</button>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto">
                  {meetingChat.map((m, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex items-baseline justify-between text-[11px]">
                        <span className="font-bold text-slate-800">{m.sender}</span>
                        <span className="text-[10px] text-slate-400">{m.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded">{m.text}</p>
                      {m.attachment && (
                        <div className="flex items-center gap-1.5 text-[10px] text-blue-600 bg-blue-50 p-1 rounded font-medium">
                          <FileText className="h-3 w-3" />
                          <span>{m.attachment}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="flex items-center gap-1 pt-2 border-t">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    className="flex-1 rounded-md border border-slate-300 p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendChat}
                    className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Related Documents (5) & AI Meeting Assistant (Beta) */}
          <div className="space-y-4">
            {/* Related Documents */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="text-sm font-bold text-slate-900">Related Documents (5)</h3>
                <button className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { name: "Design_Specification.pdf", size: "1.8 MB", color: "text-rose-500" },
                  { name: "Test_Report.pdf", size: "2.4 MB", color: "text-rose-500" },
                  { name: "BOM_Draft.xlsx", size: "1.2 MB", color: "text-emerald-600" },
                  { name: "Roadmap.pptx", size: "4.6 MB", color: "text-amber-600" },
                  { name: "Meeting_Agenda.pdf", size: "320 KB", color: "text-rose-500" },
                ].map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white transition flex flex-col justify-between space-y-2">
                    <div className="flex items-start gap-2">
                      <FileText className={`h-4 w-4 shrink-0 ${doc.color}`} />
                      <span className="font-medium text-slate-800 text-xs truncate" title={doc.name}>
                        {doc.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{doc.size}</span>
                      <Download className="h-3 w-3 hover:text-blue-600 cursor-pointer" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Meeting Assistant (Beta) */}
            <div className="bg-linear-to-r from-purple-900 via-indigo-950 to-slate-950 text-white p-5 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm">AI Meeting Assistant</h4>
                    <span className="bg-purple-500/30 text-purple-200 text-[10px] font-bold px-2 py-0.2 rounded-full border border-purple-400/30">
                      Beta
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    AI Assistant can provide real-time transcription, summaries, action items and key insights during the meeting.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast("AI Meeting Summary Generated with 4 Action Items")}
                className="bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Summarize Meeting
              </button>
            </div>
          </div>
        </div>
    </AppShell>
  );
}
