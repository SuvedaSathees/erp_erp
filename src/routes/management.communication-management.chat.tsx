// Magnertia ERP - Real-Time Chat & Collaboration
// Management -> Communication Management -> Chat
// Complete 3-Panel Chat Workspace matching Screenshot 2 and Specifications

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  MessageSquare,
  Users,
  Video,
  Phone,
  UserPlus,
  MoreVertical,
  Search,
  Plus,
  Send,
  Paperclip,
  Smile,
  Mic,
  Sparkles,
  FileText,
  Download,
  Calendar,
  CheckSquare,
  Share2,
  BookOpen,
  Edit2,
  Check,
  Filter,
  Code,
  Link as LinkIcon,
  Maximize2,
  ThumbsUp,
  Heart,
  Target,
  CheckCircle2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { CommunicationTabBar } from "@/components/erp/CommunicationManagementTabBar";
import { CommunicationSubmoduleHeader } from "@/components/erp/CommunicationSubmoduleHeader";
import {
  MOCK_CHAT_CONVERSATIONS,
  MOCK_ACTIVE_CHAT,
  ChatMessage,
} from "@/services/communicationManagementService";

export const Route = createFileRoute("/management/communication-management/chat")({
  head: () => ({
    meta: [
      { title: "Chat · Communication Management · Magnertia ERP" },
      {
        name: "description",
        content: "Real-time communication, team collaboration, task conversion and ERP context chat.",
      },
    ],
  }),
  component: ChatManagementPage,
});

function ChatManagementPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [chatSearch, setChatSearch] = useState<string>("");
  const [selectedChatId, setSelectedChatId] = useState<string>("CHAT-2026-0015");
  const activeChat =
    MOCK_CHAT_CONVERSATIONS.find((c) => c.id === selectedChatId) ||
    MOCK_ACTIVE_CHAT ||
    MOCK_CHAT_CONVERSATIONS[0];
  const [messages, setMessages] = useState<ChatMessage[]>(activeChat?.messages || MOCK_ACTIVE_CHAT.messages);
  const [newMessage, setNewMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "Arun Kumar",
      senderAvatar: "AK",
      time: "Just now",
      date: "Today",
      content: newMessage.trim(),
      reactions: [{ emoji: "👍", count: 1 }],
      isMe: true,
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  const filteredConversations = MOCK_CHAT_CONVERSATIONS.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(chatSearch.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(chatSearch.toLowerCase());
    if (filterType === "direct") return matchesSearch && c.type === "direct";
    if (filterType === "groups") return matchesSearch && c.type === "group";
    if (filterType === "channels") return matchesSearch && c.type === "channel";
    return matchesSearch;
  });

  return (
    <AppShell
      title="Chat"
      breadcrumb="Management > Communication Management > Chat"
      description="People. Projects. Progress. Real-time enterprise messaging & task coordination."
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
          icon={MessageSquare}
          title="Enterprise Real-Time Chat"
          code="CHT-2026-001"
          version="v1.0"
          status="Active"
          onSave={() => showToast("Chat session state saved")}
          onSubmit={() => showToast("Chat transcript submitted for compliance archiving")}
          onGenerateReport={() => showToast("Exporting conversation transcript")}
          moreActions={[
            {
              label: "New Conversation",
              icon: Plus,
              onClick: () => showToast("Opening New Conversation dialog"),
            },
            {
              label: "Start Instant Huddle",
              icon: Video,
              onClick: () => showToast("Starting instant team huddle"),
            },
          ]}
        />

        {/* Main 3-Column Chat Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden min-h-[700px]">
          {/* Column 1: Conversations List (3.5 cols) */}
          <div className="lg:col-span-3 border-r border-slate-200 flex flex-col bg-slate-50/40">
              {/* Filter Tabs */}
              <div className="p-3 border-b border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                    {["all", "direct", "groups", "channels"].map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setFilterType(tab)}
                        className={`px-2.5 py-1 rounded-md capitalize font-semibold transition ${
                          filterType === tab
                            ? "bg-blue-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => showToast("Create new room dialog")}
                    className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600"
                    title="Compose new conversation"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    className="w-full pl-8 pr-8 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Filter className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              {/* Chat List Items */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {filteredConversations.map((conv) => {
                  const isSelected = conv.id === selectedChatId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedChatId(conv.id)}
                      className={`p-3 flex items-start gap-3 cursor-pointer transition ${
                        isSelected ? "bg-blue-50/70 border-l-4 border-l-blue-600" : "hover:bg-slate-100/60"
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs text-white ${
                          conv.badgeColor || "bg-blue-600"
                        }`}
                      >
                        {conv.avatarText}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{conv.title}</h4>
                          <span className="text-[10px] text-slate-400 shrink-0">{conv.time}</span>
                        </div>
                        {conv.members && (
                          <div className="text-[10px] text-slate-400">{conv.members} members</div>
                        )}
                        <p className="text-xs text-slate-600 truncate mt-0.5">{conv.lastMessage}</p>
                      </div>

                      {conv.unreadCount && (
                        <span className="h-4 min-w-4 px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 self-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Active Conversation & Composer (5.5 cols) */}
            <div className="lg:col-span-6 flex flex-col bg-white">
              {/* Active Chat Header */}
              <div className="p-3 px-5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {activeChat?.details?.title ?? activeChat?.title ?? "EV Charging Project Team"}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      8 members · Project: <span className="font-mono text-blue-700">{activeChat?.details?.relatedProject ?? activeChat?.project ?? "PRJ-2026-0032"}</span> · Wireless EV Charging Station
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <button
                    onClick={() => showToast("Initiating voice call")}
                    className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-800"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => showToast("Initiating video meeting")}
                    className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-800"
                  >
                    <Video className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => showToast("Add participant")}
                    className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-800"
                  >
                    <UserPlus className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-800">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Secondary Navigation Ribbon */}
              <div className="px-5 border-b border-slate-100 flex items-center gap-5 text-xs font-semibold text-slate-600 bg-slate-50/50">
                {[
                  { id: "chat", label: "Chat" },
                  { id: "files", label: "Files (12)" },
                  { id: "tasks", label: "Tasks (6)" },
                  { id: "links", label: "Links (4)" },
                  { id: "meeting", label: "Meeting" },
                  { id: "settings", label: "Settings" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`py-2 border-b-2 transition ${
                      activeTab === t.id
                        ? "border-blue-600 text-blue-600 font-bold"
                        : "border-transparent hover:text-slate-900"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {/* Date Divider */}
                <div className="flex items-center justify-center my-2">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Today
                  </span>
                </div>

                {/* Message List */}
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 group">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        msg.senderAvatar === "AK"
                          ? "bg-blue-600 text-white"
                          : msg.senderAvatar === "PS"
                          ? "bg-purple-600 text-white"
                          : msg.senderAvatar === "RS"
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {msg.senderAvatar || msg.sender.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-slate-900">{msg.sender}</span>
                        <span className="text-[10px] text-slate-400">{msg.time}</span>
                      </div>

                      <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed max-w-xl">
                        {msg.content}

                        {/* File Attachment if exists */}
                        {msg.file && (
                          <div className="mt-2 flex items-center justify-between p-2 rounded-md bg-white border border-slate-200">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-rose-500" />
                              <div>
                                <div className="font-semibold text-slate-800 text-[11px]">{msg.file.name}</div>
                                <div className="text-[10px] text-slate-400">{msg.file.size}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => showToast(`Downloading ${msg.file?.name}`)}
                              className="p-1 text-slate-400 hover:text-blue-600"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Reactions */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          {msg.reactions.map((rx, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
                            >
                              <span>{rx.emoji}</span>
                              <span>{rx.count}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rich Chat Composer */}
              <div className="p-3 border-t border-slate-200 space-y-2 bg-white">
                {/* Formatting Tools */}
                <div className="flex items-center gap-2 text-slate-500 text-xs px-1">
                  <button className="font-bold hover:text-slate-900 px-1">B</button>
                  <button className="italic hover:text-slate-900 px-1">I</button>
                  <button className="underline hover:text-slate-900 px-1">U</button>
                  <button className="hover:text-slate-900 px-1">List</button>
                  <button className="hover:text-slate-900 px-1">Code</button>
                  <button className="hover:text-slate-900 px-1">Link</button>
                  <button className="hover:text-slate-900 px-1">Attach</button>
                  <button className="hover:text-slate-900 px-1">Emoji</button>
                </div>

                {/* Input & Buttons */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => showToast("AI Draft Assistant ready")}
                    className="p-2 rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50"
                    title="AI Smart Compose"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("Voice recording started")}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className="inline-flex items-center gap-1 bg-blue-600 text-white px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-xs cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" /> Send
                  </button>
                </div>
              </div>
            </div>

            {/* Column 3: Conversation Details, Participants & Quick Actions (3 cols) */}
            <div className="lg:col-span-3 border-l border-slate-200 p-4 space-y-5 overflow-y-auto bg-slate-50/30 text-xs">
              {/* Section: Conversation Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900">Conversation Details</h4>
                  <button className="text-blue-600 hover:underline flex items-center gap-1 font-semibold">
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chat ID:</span>
                    <span className="font-mono text-slate-800">{activeChat?.details?.chatId ?? activeChat?.id ?? "CHAT-2026-0015"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chat Type:</span>
                    <span className="font-medium text-slate-800">{activeChat?.details?.chatType ?? activeChat?.type ?? "Group"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-medium text-slate-800">{activeChat?.details?.category ?? activeChat?.category ?? "Engineering"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Owner:</span>
                    <span className="font-medium text-slate-800">{activeChat?.details?.owner ?? activeChat?.owner ?? "Arun Kumar"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-slate-800">{activeChat?.details?.department ?? activeChat?.department ?? "R&D"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Related Project:</span>
                    <span className="font-mono text-blue-700">{activeChat?.details?.relatedProject ?? activeChat?.project ?? "PRJ-2026-0032"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Priority:</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                      {activeChat?.details?.priority ?? activeChat?.priority ?? "High"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Confidentiality:</span>
                    <span className="font-medium text-slate-800">{activeChat?.details?.confidentiality ?? activeChat?.confidentiality ?? "Internal"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Created On:</span>
                    <span className="text-slate-700">{activeChat?.details?.createdOn ?? "12-Sep-2026"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Activity:</span>
                    <span className="text-slate-700">{activeChat?.details?.lastActivity ?? activeChat?.lastMessageTime ?? "10:24 AM"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Status:</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Section: Participants (8) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900">Participants (8)</h4>
                  <button className="text-blue-600 hover:underline font-semibold">+ Add</button>
                </div>

                <div className="space-y-2">
                  {(activeChat?.participants || MOCK_ACTIVE_CHAT.participants || []).map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                          {p.name.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-800 text-[11px] leading-tight">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.role}</div>
                        </div>
                      </div>
                      {p.online && <span className="h-2 w-2 rounded-full bg-emerald-500" title="Online" />}
                    </div>
                  ))}
                  <button className="text-[11px] text-blue-600 font-semibold hover:underline block pt-1">
                    View All (8)
                  </button>
                </div>
              </div>

              {/* Section: Shared Files (12) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900">Shared Files (12)</h4>
                  <button className="text-blue-600 hover:underline font-semibold text-[11px]">View All</button>
                </div>

                <div className="space-y-2">
                  {(activeChat?.sharedFiles || MOCK_ACTIVE_CHAT.sharedFiles || []).map((file, idx) => (
                    <div key={idx} className="p-2 rounded-lg border border-slate-200 bg-white space-y-0.5">
                      <div className="font-medium text-slate-800 truncate text-[11px]">{file.name}</div>
                      <div className="text-[10px] text-slate-400">{file.size} · {file.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Quick Actions */}
              <div className="space-y-2 pt-2 border-t">
                <h4 className="font-bold text-slate-900">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => showToast("Task created from chat")}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 font-medium text-slate-700 text-[11px]"
                  >
                    <CheckSquare className="h-3.5 w-3.5 text-blue-600" /> Create Task
                  </button>
                  <button
                    onClick={() => showToast("Meeting scheduled")}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 font-medium text-slate-700 text-[11px]"
                  >
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" /> Schedule Meet
                  </button>
                  <button
                    onClick={() => showToast("ERP Record selector opened")}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 font-medium text-slate-700 text-[11px]"
                  >
                    <Share2 className="h-3.5 w-3.5 text-purple-600" /> Share Record
                  </button>
                  <button
                    onClick={() => showToast("Added to Knowledge Base")}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 font-medium text-slate-700 text-[11px]"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-amber-600" /> Add to KB
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </AppShell>
  );
}
