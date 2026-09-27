// Magnertia ERP - Internal Social Network
// Management -> Communication Management -> Internal Social Network
// Complete Employee Community & Engagement Layer matching Image 1 and Specifications

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Image,
  FileText,
  BarChart2,
  Calendar,
  Share2,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  MoreHorizontal,
  Plus,
  Search,
  Users,
  Award,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  Pin,
  Check,
  CheckCircle2,
  X,
  ExternalLink,
  Heart,
  Globe,
  Camera,
  Compass,
  Megaphone,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { CommunicationTabBar } from "@/components/erp/CommunicationManagementTabBar";
import { CommunicationSubmoduleHeader } from "@/components/erp/CommunicationSubmoduleHeader";
import {
  MOCK_SOCIAL_PROFILE,
  MOCK_MY_COMMUNITIES,
  MOCK_SUGGESTED_COMMUNITIES,
  MOCK_SOCIAL_POSTS,
  MOCK_SOCIAL_EVENTS,
  MOCK_TRENDING_TOPICS,
  MOCK_PEOPLE_TO_FOLLOW,
  SocialFeedPost,
  SocialCommunity,
} from "@/services/communicationManagementService";

export const Route = createFileRoute("/management/communication-management/internal-social-network")({
  head: () => ({
    meta: [
      { title: "Internal Social Network · Communication Management · Magnertia ERP" },
      {
        name: "description",
        content: "Employee collaboration, communities, feeds, recognition, knowledge sharing and organizational engagement.",
      },
    ],
  }),
  component: InternalSocialNetworkPage,
});

function InternalSocialNetworkPage() {
  const [feedFilterTab, setFeedFilterTab] = useState<string>("all");
  const [posts, setPosts] = useState<SocialFeedPost[]>(MOCK_SOCIAL_POSTS);
  const [postContent, setPostContent] = useState<string>("");
  const [audienceScope, setAudienceScope] = useState<string>("Everyone");
  const [myCommunities, setMyCommunities] = useState<SocialCommunity[]>(MOCK_MY_COMMUNITIES);
  const [suggestedCommunities, setSuggestedCommunities] = useState<SocialCommunity[]>(MOCK_SUGGESTED_COMMUNITIES);
  const [peopleToFollow, setPeopleToFollow] = useState(MOCK_PEOPLE_TO_FOLLOW);
  const [events, setEvents] = useState(MOCK_SOCIAL_EVENTS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreatePost = () => {
    if (!postContent.trim()) return;
    const newPost: SocialFeedPost = {
      id: "post-" + Date.now(),
      author: MOCK_SOCIAL_PROFILE.name,
      authorRole: `${MOCK_SOCIAL_PROFILE.role} · ${MOCK_SOCIAL_PROFILE.department}`,
      authorAvatar: MOCK_SOCIAL_PROFILE.avatarText,
      timeAgo: "Just now",
      content: postContent.trim(),
      tags: ["#Update", "#Magnertia"],
      likes: 1,
      comments: 0,
      shares: 0,
      isLiked: true,
    };
    setPosts([newPost, ...posts]);
    setPostContent("");
    showToast("Post published successfully to " + audienceScope);
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

  const handleSave = (id: string) => {
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, isSaved: !p.isSaved } : p))
    );
    showToast("Saved to reading list");
  };

  const handleJoinCommunity = (comm: SocialCommunity) => {
    setSuggestedCommunities(suggestedCommunities.filter((c) => c.id !== comm.id));
    setMyCommunities([...myCommunities, { ...comm, isJoined: true }]);
    showToast(`Joined community: ${comm.name}`);
  };

  const handleFollowUser = (id: string) => {
    setPeopleToFollow(
      peopleToFollow.map((u) => {
        if (u.id === id) {
          const next = !u.isFollowing;
          showToast(next ? `Now following ${u.name}` : `Unfollowed ${u.name}`);
          return { ...u, isFollowing: next };
        }
        return u;
      })
    );
  };

  const handleRegisterEvent = (id: string) => {
    setEvents(
      events.map((e) => {
        if (e.id === id) {
          const next = !e.isRegistered;
          showToast(next ? `Registered for ${e.title}` : `Cancelled registration`);
          return { ...e, isRegistered: next };
        }
        return e;
      })
    );
  };

  return (
    <AppShell
      title="Internal Social Network"
      breadcrumb="Management > Communication Management > Internal Social Network"
      description="Employee collaboration, communities, feeds, recognition, knowledge sharing and organizational engagement."
      tabs={<CommunicationTabBar />}
    >
      <div className="flex flex-col min-h-screen bg-slate-50/50">
        <CommunicationSubmoduleHeader
          icon={Globe}
          title="Internal Social Network"
          code="SOC-2026-001"
          version="v1.0"
          status="Active"
          onSave={() => showToast("Social preferences saved")}
          onSubmit={() => showToast("Feed settings updated")}
          onGenerateReport={() => showToast("Engagement analytics report generated")}
        />

        {/* Floating Toast */}
        {toastMsg && (
          <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              {toastMsg}
            </span>
            <button onClick={() => setToastMsg(null)}>
              <X className="h-3.5 w-3.5 text-blue-600" />
            </button>
          </div>
        )}

        {/* Main Content: 3 Columns matching Image 1 */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (3 cols): Profile Card, My Communities, Suggested Communities */}
            <div className="lg:col-span-3 space-y-5">
              {/* User Social Profile Card matching Image 1 */}
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                {/* Banner Header with clean energy backdrop */}
                <div className="relative h-28 bg-linear-to-r from-blue-700 via-sky-600 to-emerald-600 p-3 text-white flex flex-col justify-between">
                  <div className="text-[11px] font-bold tracking-wide uppercase opacity-90 drop-shadow-xs">
                    Clean Energy<br />Brighter Tomorrow
                  </div>
                  <button
                    onClick={() => showToast("Change banner photo")}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs"
                    title="Update Cover Photo"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="px-4 pb-4 pt-0 relative text-center">
                  {/* Avatar */}
                  <div className="relative -mt-10 mb-2 inline-block">
                    <div className="h-20 w-20 rounded-full border-4 border-white bg-slate-900 text-white text-xl font-bold flex items-center justify-center shadow-md mx-auto">
                      {MOCK_SOCIAL_PROFILE.avatarText}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{MOCK_SOCIAL_PROFILE.name}</h3>
                  <p className="text-xs font-medium text-slate-500">{MOCK_SOCIAL_PROFILE.role}</p>
                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed px-2">
                    {MOCK_SOCIAL_PROFILE.bio}
                  </p>

                  {/* Profile Stats */}
                  <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-slate-100 text-center">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{MOCK_SOCIAL_PROFILE.postsCount}</div>
                      <div className="text-[10px] text-slate-400">Posts</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{MOCK_SOCIAL_PROFILE.followersCount}</div>
                      <div className="text-[10px] text-slate-400">Followers</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{MOCK_SOCIAL_PROFILE.followingCount}</div>
                      <div className="text-[10px] text-slate-400">Following</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast("Opening Full Employee Social Profile")}
                    className="w-full py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    View Profile
                  </button>
                </div>
              </div>

              {/* My Communities */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900 text-xs">My Communities</h4>
                  <button
                    onClick={() => showToast("Viewing All Subscribed Communities")}
                    className="text-blue-600 font-semibold text-[11px] hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2">
                  {myCommunities.map((comm) => (
                    <div
                      key={comm.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          <Users className="h-3.5 w-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-slate-800 text-[11px] truncate flex items-center gap-1">
                            <span>{comm.name}</span>
                            {comm.isPinned && <Pin className="h-2.5 w-2.5 text-rose-500 fill-rose-500" />}
                          </div>
                          <div className="text-[10px] text-slate-400">{comm.members}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Communities */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900 text-xs">Suggested Communities</h4>
                </div>

                <div className="space-y-2">
                  {suggestedCommunities.map((comm) => (
                    <div key={comm.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                      <div className="truncate">
                        <div className="font-semibold text-slate-800 text-[11px] truncate">{comm.name}</div>
                        <div className="text-[10px] text-slate-400">{comm.members}</div>
                      </div>
                      <button
                        onClick={() => handleJoinCommunity(comm)}
                        className="px-2.5 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 text-[10px] font-bold shrink-0 transition cursor-pointer"
                      >
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column (6 cols): Post Creator, Sub-Filter Tabs, Posts Feed */}
            <div className="lg:col-span-6 space-y-5">
              {/* Post Creator Box matching Image 1 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {MOCK_SOCIAL_PROFILE.avatarText}
                  </div>
                  <input
                    type="text"
                    placeholder="What's on your mind, Arun?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreatePost()}
                    className="flex-1 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                  />
                  <select
                    value={audienceScope}
                    onChange={(e) => setAudienceScope(e.target.value)}
                    className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs bg-white text-slate-700"
                  >
                    <option>Everyone</option>
                    <option>My Department</option>
                    <option>EV Charging Team</option>
                    <option>Leadership</option>
                  </select>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => showToast("Attaching Photo or Video")}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-emerald-600 hover:bg-emerald-50 font-medium"
                    >
                      <Image className="h-4 w-4" /> Photo/Video
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("Attaching Document from Repository")}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      <FileText className="h-4 w-4" /> Document
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("Creating Social Poll")}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-amber-600 hover:bg-amber-50 font-medium"
                    >
                      <BarChart2 className="h-4 w-4" /> Poll
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("Scheduling Community Event")}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-purple-600 hover:bg-purple-50 font-medium"
                    >
                      <Calendar className="h-4 w-4" /> Event
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("Linking Live ERP Business Record")}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
                    >
                      <Share2 className="h-4 w-4" /> Share Record
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

              {/* Feed Filter Ribbon */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold text-slate-600">
                {[
                  { id: "all", label: "All Posts" },
                  { id: "following", label: "Following" },
                  { id: "dept", label: "My Department" },
                  { id: "comm", label: "My Communities" },
                  { id: "ann", label: "Announcements" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFeedFilterTab(f.id)}
                    className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                      feedFilterTab === f.id
                        ? "bg-blue-600 text-white shadow-xs font-bold"
                        : "hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Posts Feed */}
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                    {/* Post Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
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

                    {/* Post Text */}
                    <p className="text-xs text-slate-800 leading-relaxed">{post.content}</p>

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-1.5 text-xs text-blue-600 font-medium">
                      {post.tags.map((t, idx) => (
                        <span key={idx} className="hover:underline cursor-pointer">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Visual Media Demo matching Image 1 */}
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

                    {/* Reactions Bar */}
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

                    {/* Action Buttons */}
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-semibold text-center">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`p-2 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5 transition ${
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
                        onClick={() => showToast("Link copied to clipboard")}
                        className="p-2 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                      <button
                        onClick={() => handleSave(post.id)}
                        className={`p-2 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5 ${
                          post.isSaved ? "text-blue-600" : ""
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${post.isSaved ? "fill-blue-600" : ""}`} />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (3 cols): Announcements, Upcoming Events, Trending, People to Follow */}
            <div className="lg:col-span-3 space-y-5">
              {/* Announcements Panel matching Image 1 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900 text-xs">Announcements</h4>
                  <button
                    onClick={() => showToast("Navigating to Announcements Register")}
                    className="text-blue-600 font-semibold text-[11px] hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-800 text-[11px] leading-tight">
                      New Quality Inspection Procedure
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="bg-rose-100 text-rose-700 font-bold px-1.5 rounded">High Priority</span>
                      <span className="text-slate-400">20 Sep 2026</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Revised procedure is effective from 20 Sep 2026.</p>
                  </div>

                  <div className="space-y-0.5 border-t pt-2">
                    <div className="font-bold text-slate-800 text-[11px] leading-tight">
                      Office Closed for Ayudha Pooja
                    </div>
                    <div className="text-[10px] text-slate-400">18 Sep 2026</div>
                    <p className="text-[10px] text-slate-500">Our office will remain closed on 22 Sep 2026.</p>
                  </div>

                  <div className="space-y-0.5 border-t pt-2">
                    <div className="font-bold text-slate-800 text-[11px] leading-tight">
                      TANSEED 8.0 Shortlist Announcement
                    </div>
                    <div className="text-[10px] text-slate-400">15 Sep 2026</div>
                    <p className="text-[10px] text-slate-500">Magnertia has been shortlisted for TANSEED 8.0!</p>
                  </div>

                  <div className="space-y-0.5 border-t pt-2">
                    <div className="font-bold text-slate-800 text-[11px] leading-tight">
                      Mandatory Cybersecurity Training
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="bg-amber-100 text-amber-800 font-bold px-1.5 rounded">Action Required</span>
                      <span className="text-slate-400">12 Sep 2026</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Complete by 30 Sep 2026.</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900 text-xs">Upcoming Events</h4>
                  <button className="text-blue-600 font-semibold text-[11px] hover:underline">View All</button>
                </div>

                <div className="space-y-2.5">
                  {events.map((e) => (
                    <div key={e.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-9 rounded-lg bg-rose-50 border border-rose-200 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[9px] font-bold text-rose-600 uppercase">{e.month}</span>
                          <span className="text-xs font-bold text-rose-900 leading-none">{e.day}</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-[11px] leading-tight">{e.title}</div>
                          <div className="text-[10px] text-slate-400">{e.location}</div>
                          <div className="text-[10px] text-slate-400">{e.time}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRegisterEvent(e.id)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold shrink-0 transition ${
                          e.isRegistered
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {e.isRegistered ? "Registered" : "Register"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Topics */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900 text-xs">Trending Topics</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">Today</span>
                </div>

                <div className="space-y-2 text-xs">
                  {MOCK_TRENDING_TOPICS.map((topic, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800 text-[11px]">{topic.tag}</div>
                        <div className="text-[10px] text-slate-400">{topic.posts}</div>
                      </div>
                      <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-0.5">
                        ↑ {topic.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* People to Follow */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-1 border-b">
                  <h4 className="font-bold text-slate-900 text-xs">People to Follow</h4>
                  <button className="text-blue-600 font-semibold text-[11px] hover:underline">View All</button>
                </div>

                <div className="space-y-2">
                  {peopleToFollow.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="h-7 w-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {p.avatar}
                        </span>
                        <div className="truncate">
                          <div className="font-semibold text-slate-800 text-[11px] truncate">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.role}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleFollowUser(p.id)}
                        className={`px-3 py-1 rounded text-[10px] font-bold shrink-0 transition ${
                          p.isFollowing
                            ? "bg-slate-100 text-slate-700"
                            : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        {p.isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
