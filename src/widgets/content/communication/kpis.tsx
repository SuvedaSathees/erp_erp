import type { LucideIcon } from "lucide-react";
import {
  Mail,
  MessageSquare,
  Video,
  Bell,
  Megaphone,
  Clock,
  Users,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import {
  communicationOverviewOptions,
  type CommunicationOverviewData,
} from "../../data/communicationQueries";
import { makeStatCardWidget, type StatCardShape } from "../shared/StatCardWidget";

type Cfg = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  category?: WidgetCategory;
  tags?: WidgetCategory[];
  roles?: WidgetRole[] | "all";
  sourceRoute?: string;
  inLibrary?: boolean;
};

function widget(c: Cfg, map: (d: CommunicationOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "communication"],
    icon: c.icon,
    keywords: c.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/management/communication-management/overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: communicationOverviewOptions,
    map,
  });
}

export const COMMUNICATION_KPI_WIDGETS: WidgetDefinition[] = [
  widget(
    {
      id: "kpi.communication.total-emails",
      title: "Total Emails",
      description: "Aggregated volume of sent and received corporate emails with transmission audits.",
      icon: Mail,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      sourceRoute: "/management/communication-management/email",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.totalEmails?.value ?? "12,840",
      delta: {
        label: d?.kpis?.totalEmails?.delta ?? "+18%",
        direction: "up",
        tone: "positive",
      },
      neutralText: d?.kpis?.totalEmails?.subtext ?? "Sent: 7420 · Rcvd: 5420",
    }),
  ),

  widget(
    {
      id: "kpi.communication.realtime-messages",
      title: "Real-Time Messages",
      description: "Instant chat messages across 1-on-1 and squad engineering channels.",
      icon: MessageSquare,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      sourceRoute: "/management/communication-management/chat",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.realtimeMessages?.value ?? "18,420",
      delta: {
        label: d?.kpis?.realtimeMessages?.delta ?? "+24%",
        direction: "up",
        tone: "positive",
      },
      neutralText: d?.kpis?.realtimeMessages?.subtext ?? "142 Active conversations",
    }),
  ),

  widget(
    {
      id: "kpi.communication.video-meetings",
      title: "Video Meetings",
      description: "Scheduled, in-progress and completed video conferences with attendee rates.",
      icon: Video,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
      sourceRoute: "/management/communication-management/video-meetings",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.videoMeetings?.value ?? "486",
      delta: {
        label: d?.kpis?.videoMeetings?.badge ?? "96.4% Att.",
        direction: "up",
        tone: "positive",
      },
      neutralText: d?.kpis?.videoMeetings?.subtext ?? "458 completed · 28 upcoming",
    }),
  ),

  widget(
    {
      id: "kpi.communication.notifications",
      title: "Notifications",
      description: "Automated ERP workflow notifications, dispatch telemetry and pending actions.",
      icon: Bell,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      sourceRoute: "/management/communication-management/notifications",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.notifications?.value ?? "248",
      delta: {
        label: d?.kpis?.notifications?.badge ?? "99.2% Del.",
        direction: "up",
        tone: "positive",
      },
      neutralText: d?.kpis?.notifications?.subtext ?? "196 Delivered · 32 pending action",
    }),
  ),

  widget(
    {
      id: "kpi.communication.announcements",
      title: "Announcements",
      description: "Enterprise-wide policy and executive announcements with acknowledgement tracking.",
      icon: Megaphone,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600",
      sourceRoute: "/management/communication-management/announcements",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.announcements?.value ?? "54",
      delta: {
        label: d?.kpis?.announcements?.badge ?? "94.8% Ack",
        direction: "up",
        tone: "positive",
      },
      neutralText: d?.kpis?.announcements?.subtext ?? "18 awaiting approval · 32 scheduled",
    }),
  ),

  widget(
    {
      id: "kpi.communication.response-sla",
      title: "Avg Response SLA",
      description: "Mean turnaround time for customer inquiries and cross-departmental communications.",
      icon: Clock,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-600",
      sourceRoute: "/management/communication-management/overview",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.responseSla?.value ?? "1.4 hrs",
      delta: {
        label: d?.kpis?.responseSla?.delta ?? "-30% Time",
        direction: "down",
        tone: "positive",
      },
      neutralText: d?.kpis?.responseSla?.subtext ?? "14 pending · 2 overdue",
    }),
  ),

  widget(
    {
      id: "kpi.communication.active-channels",
      title: "Active Channels",
      description: "Active squad, project, and department collaboration workspaces.",
      icon: Users,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-600",
      sourceRoute: "/management/communication-management/collaboration-workspace",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.activeChannels?.value ?? "142",
      neutralText: d?.kpis?.activeChannels?.caption ?? "Active Squad & Group Channels",
    }),
  ),

  widget(
    {
      id: "kpi.communication.delivery-rate",
      title: "Delivery Rate",
      description: "Aggregate message delivery reliability across SMTP, push and SMS gateways.",
      icon: CheckCircle2,
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-600",
      sourceRoute: "/management/communication-management/overview",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.deliveryRate?.value ?? "99.2%",
      neutralText: d?.kpis?.deliveryRate?.caption ?? "SMTP, Webhook & Push Gateways",
    }),
  ),

  widget(
    {
      id: "kpi.communication.sla-adherence",
      title: "SLA Adherence",
      description: "Overall percentage of communications responded to within designated enterprise SLA.",
      icon: ShieldCheck,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      sourceRoute: "/management/communication-management/reports",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.slaAdherence?.value ?? "95.4%",
      neutralText: d?.kpis?.slaAdherence?.caption ?? "On-time SLA Across Departments",
    }),
  ),

  widget(
    {
      id: "kpi.communication.ai-actions",
      title: "AI Actions Taken",
      description: "Autonomous draft suggestions, meeting action extraction and message triage.",
      icon: Sparkles,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600",
      sourceRoute: "/management/communication-management/overview",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.aiAssistantActions?.value ?? "42",
      neutralText: d?.kpis?.aiAssistantActions?.caption ?? "Autonomous Drafts & Triaged",
    }),
  ),
];
