import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Mail,
  MessageSquare,
  Video,
  Bell,
  Megaphone,
  Sparkles,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ExternalLink,
  Info,
  ShieldCheck,
  Server,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { WidgetDefinition } from "../../types";
import {
  communicationOverviewOptions,
  type CommunicationOverviewData,
} from "../../data/communicationQueries";

/* ===========================================================================
   1. Enterprise Communication Volume Trends (Area Chart)
   =========================================================================== */
export const VolumeTrendWidget = memo(function VolumeTrendWidget() {
  const { data, isLoading } = useQuery(communicationOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">Enterprise Communication Volume Trends</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monthly traffic volume across Email, Chat, and Notifications
          </p>
        </div>

        {/* Legend matching Screenshot */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-[#2563eb] inline-block" />
            Emails
          </span>
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-[#059669] inline-block" />
            Chats
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.volumeTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="emailGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="chatGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.6)" />
            <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={12} stroke="#64748b" />
            <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#64748b" tickFormatter={(v) => `${v}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card, #ffffff)",
                borderRadius: "12px",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                fontSize: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="emails"
              name="Emails"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#emailGrad)"
            />
            <Area
              type="monotone"
              dataKey="chats"
              name="Chats"
              stroke="#059669"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#chatGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

/* ===========================================================================
   2. Communication by Domain (Donut Chart)
   =========================================================================== */
export const DomainDistributionWidget = memo(function DomainDistributionWidget() {
  const { data, isLoading } = useQuery(communicationOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">Communication by Domain</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Traffic split across organizational functions</p>
        </div>
        <span className="text-[11px] font-bold text-muted-foreground">Total 100%</span>
      </div>

      <div className="relative h-48 w-full flex items-center justify-center my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.domainDistribution}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.domainDistribution.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card, #ffffff)",
                borderRadius: "12px",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                fontSize: "12px",
              }}
              formatter={(val: number) => [`${val}%`, "Share"]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-extrabold text-foreground">6</span>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Domains</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2 border-t border-border/50 text-[11px]">
        {data.domainDistribution.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground truncate">{item.name}</span>
            </div>
            <span className="font-bold text-foreground tabular">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ===========================================================================
   3. AI Communication Assistant
   =========================================================================== */
export const AiCommunicationAssistantWidget = memo(function AiCommunicationAssistantWidget() {
  const { data, isLoading } = useQuery(communicationOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between bg-gradient-to-br from-indigo-900/90 via-slate-900 to-slate-950 text-white rounded-2xl shadow-md border border-indigo-500/20">
      <div>
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Communication Assistant</h3>
              <p className="text-[11px] text-indigo-200/70">Autonomous extraction & governance</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
            ACTIVE
          </span>
        </div>

        <div className="space-y-3 mt-4">
          {data.aiAssistant.insights.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-400/30 transition-all text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-300 tracking-wide uppercase">
                  {item.category}
                </span>
                {item.actionLabel && (
                  <button className="text-[10px] text-indigo-300 hover:text-white font-semibold flex items-center gap-1">
                    {item.actionLabel} &rarr;
                  </button>
                )}
              </div>
              <div className="font-semibold text-slate-100">{item.title}</div>
              <p className="text-[11px] text-slate-300/80 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-indigo-500/20 flex items-center justify-between text-[11px] text-indigo-200/70 mt-3">
        <span>3 Actions Queued for Today</span>
        <span className="font-semibold text-indigo-300">Continuous NLP Monitoring</span>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. Communication SLA Performance by Department (Bar Chart)
   =========================================================================== */
export const SlaPerformanceWidget = memo(function SlaPerformanceWidget() {
  const { data, isLoading } = useQuery(communicationOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">Communication SLA Performance by Department</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Response & resolution adherence target &gt; 95%</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
            On Time (%)
          </span>
          <span className="flex items-center gap-1.5 text-rose-600">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block" />
            Breached (%)
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.slaPerformance} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.6)" />
            <XAxis dataKey="dept" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} fontSize={11} stroke="#64748b" />
            <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#64748b" domain={[80, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card, #ffffff)",
                borderRadius: "12px",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                fontSize: "12px",
              }}
              formatter={(val: number) => [`${val}%`]}
            />
            <Bar dataKey="onTime" name="On Time" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="breached" name="Breached" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

/* ===========================================================================
   5. Communication Operations & Dispatch Ledger (Interactive Table)
   =========================================================================== */
export const CommunicationOperationsLedgerWidget = memo(function CommunicationOperationsLedgerWidget() {
  const { data, isLoading } = useQuery(communicationOverviewOptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  if (isLoading || !data) return <Skeleton className="h-[400px] rounded-xl" />;

  const filtered = data.operationsLedger.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.refId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || rec.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="card-soft p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">Communication Audit & Dispatch Ledger</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cross-channel log of business correspondence, meetings, notifications, and customer transactions
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ref, title, sender..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary w-48"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none"
          >
            <option value="All">All Channels</option>
            <option value="Email">Email</option>
            <option value="Chat">Chat</option>
            <option value="Video Meeting">Video Meeting</option>
            <option value="Notification">Notification</option>
            <option value="Announcement">Announcement</option>
          </select>

          <Link
            to="/management/communication-management/reports"
            className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Export Register
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
            <tr>
              <th className="py-2.5 px-3">Ref ID</th>
              <th className="py-2.5 px-3">Channel / Type</th>
              <th className="py-2.5 px-3">Subject / Title</th>
              <th className="py-2.5 px-3">Module Context</th>
              <th className="py-2.5 px-3">Sender & Recipient</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-mono font-medium text-foreground">{item.refId}</td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-foreground">
                    {item.type === "Email" && <Mail className="h-3 w-3 text-blue-500" />}
                    {item.type === "Chat" && <MessageSquare className="h-3 w-3 text-emerald-500" />}
                    {item.type === "Video Meeting" && <Video className="h-3 w-3 text-purple-500" />}
                    {item.type === "Notification" && <Bell className="h-3 w-3 text-amber-500" />}
                    {item.type === "Announcement" && <Megaphone className="h-3 w-3 text-violet-500" />}
                    {item.type}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-medium text-foreground max-w-xs truncate" title={item.title}>
                  {item.title}
                </td>
                <td className="py-2.5 px-3 text-muted-foreground">
                  <span className="font-semibold text-foreground">{item.module}</span>
                  <span className="block text-[10px] font-mono text-muted-foreground">{item.contextRecord}</span>
                </td>
                <td className="py-2.5 px-3 text-muted-foreground">
                  <span className="font-semibold text-foreground">{item.sender}</span>
                  <span className="block text-[10px] text-muted-foreground truncate">&rarr; {item.recipient}</span>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === "Delivered" || item.status === "Completed" || item.status === "Published"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">{item.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

/* ===========================================================================
   6. Channel Gateways & Relay Health (Insight / Alert Panel)
   =========================================================================== */
export const ChannelHealthWidget = memo(function ChannelHealthWidget() {
  const { data, isLoading } = useQuery(communicationOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[220px] rounded-xl" />;

  return (
    <div className="card-soft p-5 space-y-3">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Communication Infrastructure Gateways</h3>
        </div>
        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" /> All Gateways Healthy
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {data.channelGateways.map((gw) => (
          <div key={gw.name} className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1 text-xs">
            <div className="font-bold text-foreground truncate">{gw.name}</div>
            <div className="text-[11px] text-muted-foreground font-mono">{gw.protocol}</div>
            <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px]">
              <span className="text-muted-foreground">Uptime: {gw.uptime}</span>
              <span className="font-bold text-emerald-600">{gw.latency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ===========================================================================
   Export all Communication Panels
   =========================================================================== */
export const COMMUNICATION_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.communication.volume-trend",
    title: "Communication Volume Trends",
    description: "Monthly enterprise volume across email, chat, and notification streams.",
    category: "chart",
    tags: ["chart", "communication"],
    icon: Mail,
    defaultSize: "xl",
    keywords: ["communication", "volume", "emails", "chats", "trends"],
    roles: "all",
    component: VolumeTrendWidget,
  },
  {
    id: "chart.communication.domain-distribution",
    title: "Communication by Domain",
    description: "Distribution of business communications across corporate functions and departments.",
    category: "chart",
    tags: ["chart", "communication"],
    icon: MessageSquare,
    defaultSize: "md",
    keywords: ["domain", "distribution", "sales", "scm", "engineering"],
    roles: "all",
    component: DomainDistributionWidget,
  },
  {
    id: "ai.communication.assistant",
    title: "AI Communication Assistant",
    description: "Autonomous NLP extraction, quotation follow-up recommendations, and meeting action sync.",
    category: "ai",
    tags: ["ai", "communication"],
    icon: Sparkles,
    defaultSize: "md",
    keywords: ["ai", "assistant", "extraction", "governance", "copilot"],
    roles: "all",
    component: AiCommunicationAssistantWidget,
  },
  {
    id: "chart.communication.sla-performance",
    title: "Communication SLA Performance",
    description: "Departmental response turnaround adherence against target response windows.",
    category: "chart",
    tags: ["chart", "communication"],
    icon: Clock,
    defaultSize: "xl",
    keywords: ["sla", "performance", "response", "adherence", "departments"],
    roles: "all",
    component: SlaPerformanceWidget,
  },
  {
    id: "table.communication.operations-ledger",
    title: "Communication Audit & Dispatch Ledger",
    description: "Searchable master ledger of outbound/inbound enterprise communications.",
    category: "table",
    tags: ["table", "communication"],
    icon: Activity,
    defaultSize: "full",
    keywords: ["ledger", "audit", "dispatch", "emails", "chats", "meetings"],
    roles: "all",
    component: CommunicationOperationsLedgerWidget,
  },
  {
    id: "insight.communication.channel-alerts",
    title: "Communication Gateways & Relay Status",
    description: "Real-time health monitoring of SMTP, WebSockets, WebRTC SFU, and Push notification relays.",
    category: "insight",
    tags: ["insight", "communication"],
    icon: Server,
    defaultSize: "full",
    keywords: ["infrastructure", "smtp", "gateways", "relay", "health"],
    roles: "all",
    component: ChannelHealthWidget,
  },
];
