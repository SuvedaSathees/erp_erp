// Magnertia ERP - Collaboration Workspace
// Management -> Communication Management -> Collaboration Workspace
// Complete Project & Team Digital Collaboration Hub matching Image 2 and Specifications

import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCommunicationManagementRecordFn } from "@/lib/communicationManagementFns.server";
import {
  FolderKanban,
  CheckSquare,
  Users,
  Folder,
  Calendar,
  MessageSquare,
  AlertTriangle,
  UserPlus,
  Video,
  Settings,
  MoreHorizontal,
  Plus,
  Edit2,
  Share2,
  FileText,
  Upload,
  BarChart2,
  Sparkles,
  Download,
  ThumbsUp,
  Bookmark,
  CheckCircle2,
  X,
  Clock,
  ArrowRight,
  TrendingUp,
  Globe,
  Tag,
  Circle,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { CommunicationTabBar } from "@/components/erp/CommunicationManagementTabBar";
import { CommunicationSubmoduleHeader } from "@/components/erp/CommunicationSubmoduleHeader";
import {
  MOCK_WORKSPACE_DETAILS,
  MOCK_WORKSPACE_TASKS,
  MOCK_WORKSPACE_DOCS,
  MOCK_WORKSPACE_MEMBERS,
  MOCK_WORKSPACE_MEETINGS,
  MOCK_SOCIAL_POSTS,
  SocialFeedPost,
} from "@/services/communicationManagementService";

export const Route = createFileRoute("/management/communication-management/collaboration-workspace")({
  head: () => ({
    meta: [
      { title: "Collaboration Workspace · Communication Management · Magnertia ERP" },
      {
        name: "description",
        content: "Centralized workspace bringing together tasks, documents, discussions, meetings, and ERP context.",
      },
    ],
  }),
  component: CollaborationWorkspacePage,
});

const WORKSPACE_PROJECT_POSTS: SocialFeedPost[] = [
  {
    id: "wsp-1",
    author: "Priya Sharma",
    authorRole: "R&D Engineer",
    authorAvatar: "PS",
    timeAgo: "2 hours ago",
    content: "Prototype Test Successful! ⚡ We have successfully completed the prototype test of the 3.3 kW wireless charging module. The efficiency achieved is 92.4% at 150 mm air gap. Great teamwork by the R&D team!",
    tags: ["#EVCharging", "#WPT", "#Prototype", "#Testing"],
    hasImages: true,
    bannerType: "prototype",
    metrics: {
      efficiency: "92.4%",
      power: "3.31 kW",
    },
    likes: 48,
    comments: 12,
    shares: 4,
    isLiked: true,
  },
  {
    id: "wsp-2",
    author: "Ramesh S",
    authorRole: "Head - Engineering",
    authorAvatar: "RS",
    timeAgo: "4 hours ago",
    content: "Thermal Simulation & BOM Review 🛠️ Thermal dissipation report has been verified under continuous 30 kW peak load. Please review the updated BOM draft before our manufacturing sign-off tomorrow.",
    tags: ["#ThermalAnalysis", "#BOM", "#EngineeringReview"],
    likes: 34,
    comments: 8,
    shares: 2,
    isLiked: false,
  },
  {
    id: "wsp-3",
    author: "Vijay K",
    authorRole: "Project Manager",
    authorAvatar: "VK",
    timeAgo: "Yesterday",
    content: "Component Procurement Update 📦 High-frequency ferrite cores and power electronics modules have arrived from ElectroDrive. Inspection scheduled for tomorrow morning at the Coimbatore plant.",
    tags: ["#Procurement", "#Hardware", "#Milestone"],
    likes: 29,
    comments: 5,
    shares: 1,
    isLiked: true,
  },
];

function CollaborationWorkspacePage() {
  const { data: dbRecord } = useQuery({
    queryKey: ["communication-management", "record"],
    queryFn: () => getCommunicationManagementRecordFn({ data: {} }),
  });

  const [feedTab, setFeedTab] = useState<string>("all");
  const [posts, setPosts] = useState<SocialFeedPost[]>(WORKSPACE_PROJECT_POSTS);
  const [newUpdateText, setNewUpdateText] = useState<string>("");
  const [tasks, setTasks] = useState(MOCK_WORKSPACE_TASKS);
  const [documents, setDocuments] = useState(MOCK_WORKSPACE_DOCS);
  const [meetings, setMeetings] = useState(MOCK_WORKSPACE_MEETINGS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreatePost = () => {
    if (!newUpdateText.trim()) return;
    const newPost: SocialFeedPost = {
      id: "post-" + Date.now(),
      author: "Arun Kumar",
      authorRole: "Project Manager",
      authorAvatar: "AK",
      timeAgo: "Just now",
      content: newUpdateText.trim(),
      tags: ["#EVCharging", "#Update"],
      likes: 1,
      comments: 0,
      shares: 0,
      isLiked: true,
    };
    setPosts([newPost, ...posts]);
    setNewUpdateText("");
    showToast("Workspace update shared with Project Team");
  };

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          showToast(next ? `Completed task: ${t.title}` : `Reopened task`);
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  const handleLike = (id: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id === id) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likes: nextLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  return (
    <AppShell
      title="Collaboration Workspace"
      breadcrumb="Management > Communication Management > Collaboration Workspace"
      description="Design · Build · Deploy · Scale. Unified team cockpit for documents, tasks, meetings and execution."
      tabs={<CommunicationTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Floating Toast */}
        {toastMsg && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              {toastMsg}
            </span>
            <button onClick={() => setToastMsg(null)}>
              <X className="h-3.5 w-3.5 text-blue-600" />
            </button>
          </div>
        )}

        {/* Executive Submodule Header */}
        <CommunicationSubmoduleHeader
          icon={FolderKanban}
          title={MOCK_WORKSPACE_DETAILS.name || "Collaboration Workspace"}
          code="WSP-2026-001"
          version="v1.0"
          status={MOCK_WORKSPACE_DETAILS.status || "Active"}
          onSave={() => showToast("Workspace state synchronized")}
          onSubmit={() => showToast("Workspace deliverables submitted for milestone review")}
          onGenerateReport={() => showToast("Exporting Workspace execution summary")}
          moreActions={[
            {
              label: "Invite Team Member",
              icon: UserPlus,
              onClick: () => showToast("Invite team member modal opened"),
            },
            {
              label: "Start Workspace Meeting",
              icon: Video,
              onClick: () => showToast("Launching Instant Workspace Meeting..."),
            },
          ]}
        />

        {/* Main Content Area */}
        <div className="p-6 space-y-6">
          {/* 6 KPI Cards matching Image 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* 1. Open Tasks */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <CheckSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">24</div>
                <div className="text-[11px] font-semibold text-slate-500">Open Tasks</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↓ 12%
                </div>
              </div>
            </div>

            {/* 2. Members */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">18</div>
                <div className="text-[11px] font-semibold text-slate-500">Members</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 20%
                </div>
              </div>
            </div>

            {/* 3. Documents */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
                <Folder className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">86</div>
                <div className="text-[11px] font-semibold text-slate-500">Documents</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 35%
                </div>
              </div>
            </div>

            {/* 4. Upcoming Meetings */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">5</div>
                <div className="text-[11px] font-semibold text-slate-500">Upcoming Meetings</div>
                <div className="text-[10px] font-bold text-slate-400">0%</div>
              </div>
            </div>

            {/* 5. Discussions */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">12</div>
                <div className="text-[11px] font-semibold text-slate-500">Discussions</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  ↑ 50%
                </div>
              </div>
            </div>

            {/* 6. Open Issues */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-tight">3</div>
                <div className="text-[11px] font-semibold text-slate-500">Open Issues</div>
                <div className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                  ↓ 25%
                </div>
              </div>
            </div>
          </div>

          {/* 3-Column Split matching Image 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (3 cols): Workspace Details, Progress, Quick Actions */}
            <div className="lg:col-span-3 space-y-5">
              {/* Workspace Details Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900">Workspace Details</h4>
                  <button
                    onClick={() => showToast("Edit Workspace Details")}
                    className="text-blue-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                  >
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Workspace Code:</span>
                    <span className="font-mono font-bold text-slate-800">{MOCK_WORKSPACE_DETAILS.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Workspace Name:</span>
                    <span className="font-medium text-slate-900">{MOCK_WORKSPACE_DETAILS.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="font-medium text-slate-800">{MOCK_WORKSPACE_DETAILS.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Owner:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="h-4 w-4 rounded-full bg-blue-600 text-white text-[8px] font-bold flex items-center justify-center">
                        AK
                      </span>
                      <span className="font-medium text-slate-800">{MOCK_WORKSPACE_DETAILS.owner}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-medium text-slate-800">{MOCK_WORKSPACE_DETAILS.department}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Priority:</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                      {MOCK_WORKSPACE_DETAILS.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Status:</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Start Date:</span>
                    <span className="text-slate-700">{MOCK_WORKSPACE_DETAILS.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Date:</span>
                    <span className="text-slate-700">{MOCK_WORKSPACE_DETAILS.targetDate}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Description</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {MOCK_WORKSPACE_DETAILS.description}
                  </p>
                </div>

                <div className="pt-2 border-t flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 mr-1">Tags:</span>
                  {MOCK_WORKSPACE_DETAILS.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {tag}
                    </span>
                  ))}
                  <button className="text-[10px] text-blue-600 font-bold hover:underline">+</button>
                </div>
              </div>

              {/* Progress Summary Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900">Progress</h4>
                  <span className="font-bold text-blue-600">42%</span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Overall Completion</span>
                    <span className="font-bold text-slate-800">42%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tasks</span>
                    <span className="font-semibold text-slate-800">12 / 24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Milestones</span>
                    <span className="font-semibold text-slate-800">3 / 8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Documents</span>
                    <span className="font-semibold text-slate-800">86</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Issues</span>
                    <span className="font-bold text-rose-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Risks</span>
                    <span className="font-bold text-amber-600">2</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel matching Image 2 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 pb-1 border-b">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => showToast("Create Task Dialog")}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 font-medium text-slate-700 text-[11px]"
                  >
                    <CheckSquare className="h-3.5 w-3.5 text-blue-600" /> Create Task
                  </button>
                  <button
                    onClick={() => showToast("Schedule Meeting Dialog")}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 font-medium text-slate-700 text-[11px]"
                  >
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" /> Schedule Meeting
                  </button>
                  <button
                    onClick={() => showToast("Document Upload Dialog")}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 font-medium text-slate-700 text-[11px]"
                  >
                    <Upload className="h-3.5 w-3.5 text-blue-600" /> Upload Document
                  </button>
                  <button
                    onClick={() => showToast("Start New Discussion")}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 font-medium text-slate-700 text-[11px]"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-amber-600" /> Start Discussion
                  </button>
                  <button
                    onClick={() => showToast("Create Workspace Poll")}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 font-medium text-slate-700 text-[11px]"
                  >
                    <BarChart2 className="h-3.5 w-3.5 text-purple-600" /> Create Poll
                  </button>
                  <button
                    onClick={() => showToast("Share Status Update")}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 font-medium text-slate-700 text-[11px]"
                  >
                    <Share2 className="h-3.5 w-3.5 text-teal-600" /> Share Update
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Column (6 cols): Update Composer, Filter Ribbon, Workspace Feed */}
            <div className="lg:col-span-6 space-y-5">
              {/* Workspace Update Composer */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    AK
                  </div>
                  <input
                    type="text"
                    placeholder="Share an update, idea, document or start a discussion..."
                    value={newUpdateText}
                    onChange={(e) => setNewUpdateText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreatePost()}
                    className="flex-1 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                  />
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold text-[11px]">
                    Project Team
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => showToast("Attaching Media")}
                      className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium px-2 py-1"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Photo/Video
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("Attaching Document")}
                      className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium px-2 py-1"
                    >
                      <FileText className="h-3.5 w-3.5 text-blue-600" /> Document
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("Creating Poll")}
                      className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium px-2 py-1"
                    >
                      <BarChart2 className="h-3.5 w-3.5 text-amber-600" /> Poll
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("Linking Meeting")}
                      className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium px-2 py-1"
                    >
                      <Calendar className="h-3.5 w-3.5 text-purple-600" /> Meeting
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("Tag People")}
                      className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium px-2 py-1"
                    >
                      <Users className="h-3.5 w-3.5 text-slate-500" /> Tag People
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreatePost}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-xs cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Filter Ribbon */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold text-slate-600">
                {[
                  { id: "all", label: "All Posts" },
                  { id: "announcements", label: "Announcements" },
                  { id: "updates", label: "Updates" },
                  { id: "discussions", label: "Discussions" },
                  { id: "documents", label: "Documents" },
                  { id: "polls", label: "Polls" },
                  { id: "recognitions", label: "Recognitions" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFeedTab(f.id)}
                    className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                      feedTab === f.id
                        ? "bg-blue-600 text-white shadow-xs font-bold"
                        : "hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Feed Posts */}
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {post.authorAvatar}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs leading-tight">{post.author}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{post.authorRole}</span>
                            <span>·</span>
                            <span>{post.timeAgo}</span>
                            <span>·</span>
                            <Globe className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed">{post.content}</p>

                    <div className="flex flex-wrap gap-1.5 text-xs text-blue-600 font-medium">
                      {post.tags.map((t, idx) => (
                        <span key={idx} className="hover:underline cursor-pointer">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Media Card */}
                    {post.bannerType === "prototype" && (
                      <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 p-2 text-white">
                        <div className="h-36 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center p-2 text-center">
                          <div className="h-12 w-12 rounded-full border-2 border-emerald-400/80 flex items-center justify-center bg-emerald-950/40 text-emerald-300 font-bold mb-1">
                            WPT
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">Prototype Rig</span>
                          <span className="text-[9px] text-emerald-400">150 mm air gap</span>
                        </div>

                        <div className="h-36 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between p-3">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                              3.3 kW Test
                            </span>
                            <div className="text-emerald-400 font-bold text-xs mt-0.5">Test Successful ✓</div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400">Efficiency</span>
                              <span className="font-bold text-emerald-400">{post.metrics?.efficiency}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400">Output</span>
                              <span className="font-bold text-emerald-400">{post.metrics?.power}</span>
                            </div>
                          </div>
                        </div>

                        <div className="h-36 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center p-2 text-center">
                          <span className="text-xs font-bold text-white tracking-widest">MAGNERTIA</span>
                          <span className="text-[9px] text-slate-400 mt-1">Autonomous Docking System</span>
                          <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 text-[9px] font-semibold mt-2">
                            Verified
                          </span>
                        </div>
                      </div>
                    )}

                    {post.bannerType === "charging_station" && (
                      <div className="relative rounded-xl overflow-hidden bg-linear-to-r from-emerald-900 via-teal-900 to-sky-950 text-white p-5 border border-slate-700 flex flex-col justify-between h-40">
                        <div>
                          <div className="text-xs font-bold tracking-widest uppercase text-emerald-300">
                            Innovating for a Cleaner Tomorrow
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1">
                            Shortlisted for TANSEED 8.0 Seed Grant!
                          </h4>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
                          <span>Magnertia Autonomous Wireless EV Charging</span>
                          <span className="font-mono text-emerald-400 font-bold">Startup TN Recognition</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="h-4 w-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">
                          👍
                        </span>
                        <span className="h-4 w-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px]">
                          ❤️
                        </span>
                        <span className="text-[11px]">You, Ramesh S and {post.likes - 2} others</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-semibold text-center">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`p-2 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5 ${
                          post.isLiked ? "text-blue-600 font-bold" : ""
                        }`}
                      >
                        <ThumbsUp className={`h-4 w-4 ${post.isLiked ? "fill-blue-600" : ""}`} />
                        <span>Like</span>
                      </button>
                      <button
                        onClick={() => showToast("Opening discussion thread")}
                        className="p-2 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Comment</span>
                      </button>
                      <button
                        onClick={() => showToast("Copied share link")}
                        className="p-2 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                      <button
                        onClick={() => showToast("Saved to project bookmarks")}
                        className="p-2 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5"
                      >
                        <Bookmark className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (3 cols): Upcoming Meetings, Tasks, Recent Documents, Members */}
            <div className="lg:col-span-3 space-y-5">
              {/* Upcoming Meetings matching Image 2 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900 text-xs">Upcoming Meetings</h4>
                  <button
                    onClick={() => showToast("Viewing All Scheduled Meetings")}
                    className="text-blue-600 font-semibold text-[11px] hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2.5">
                  {meetings.map((m) => (
                    <div key={m.id} className="flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800 text-[11px] leading-tight">{m.title}</div>
                        <div className="text-[10px] text-slate-400">{m.time}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Users className="h-3 w-3" />
                          <span>{m.attendees} attendees</span>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast(`Joining ${m.title}...`)}
                        className="px-3 py-1 rounded bg-blue-600 text-white font-bold text-[10px] hover:bg-blue-700 shrink-0 transition cursor-pointer"
                      >
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks matching Image 2 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900 text-xs">Tasks</h4>
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 font-semibold text-[11px] hover:underline">View All</button>
                    <button
                      onClick={() => showToast("New Task Dialog")}
                      className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] hover:bg-blue-700"
                    >
                      + New Task
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {}}
                          className="rounded text-blue-600"
                        />
                        <span
                          className={`font-medium text-[11px] truncate ${
                            task.completed ? "line-through text-slate-400" : "text-slate-800"
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            task.priority === "High"
                              ? "bg-rose-100 text-rose-700"
                              : task.priority === "Medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[9px] flex items-center justify-center">
                          {task.assignee}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Documents matching Image 2 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900 text-xs">Recent Documents</h4>
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 font-semibold text-[11px] hover:underline">View All</button>
                    <button
                      onClick={() => showToast("File Upload Dialog")}
                      className="text-blue-600 font-semibold text-[11px] hover:underline"
                    >
                      + Upload
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                        <div className="truncate">
                          <div className="font-semibold text-slate-800 text-[11px] truncate">{doc.name}</div>
                          <div className="text-[10px] text-slate-400">{doc.size} · {doc.time}</div>
                        </div>
                      </div>
                      <span className="h-5 w-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[9px] flex items-center justify-center shrink-0">
                        {doc.author}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workspace Members (18) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900 text-xs">Workspace Members (18)</h4>
                  <button className="text-blue-600 font-semibold text-[11px] hover:underline">View All</button>
                </div>

                <div className="flex items-center justify-between">
                  {MOCK_WORKSPACE_MEMBERS.map((m) => (
                    <div key={m.id} className="flex flex-col items-center text-center">
                      <div className="relative">
                        <span className="h-7 w-7 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                          {m.avatar}
                        </span>
                        {m.online && (
                          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-white" />
                        )}
                      </div>
                      <span className="font-semibold text-slate-800 text-[10px] mt-1">{m.name.split(" ")[0]}</span>
                      <span className="text-[9px] text-slate-400">{m.role}</span>
                    </div>
                  ))}
                  <div className="flex flex-col items-center text-center">
                    <span className="h-7 w-7 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center border border-slate-200">
                      +13
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">Others</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
