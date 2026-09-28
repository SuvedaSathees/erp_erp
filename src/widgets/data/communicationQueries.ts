import { queryOptions } from "@tanstack/react-query";

export type CommunicationOverviewData = {
  kpis: {
    totalEmails: { value: string; delta: string; isPositive: boolean; subtext: string };
    realtimeMessages: { value: string; delta: string; isPositive: boolean; subtext: string };
    videoMeetings: { value: string; badge: string; isPositive: boolean; subtext: string };
    notifications: { value: string; badge: string; isPositive: boolean; subtext: string };
    announcements: { value: string; badge: string; isPositive: boolean; subtext: string };
    responseSla: { value: string; delta: string; isPositive: boolean; subtext: string };
    activeChannels: { value: string; caption: string };
    deliveryRate: { value: string; caption: string };
    slaAdherence: { value: string; caption: string };
    aiAssistantActions: { value: string; caption: string };
  };
  volumeTrendData: Array<{
    month: string;
    emails: number;
    chats: number;
  }>;
  domainDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  slaPerformance: Array<{
    dept: string;
    onTime: number;
    breached: number;
  }>;
  operationsLedger: Array<{
    id: string;
    refId: string;
    type: "Email" | "Chat" | "Video Meeting" | "Notification" | "Announcement";
    title: string;
    module: string;
    contextRecord: string;
    sender: string;
    recipient: string;
    priority: "Low" | "Normal" | "High" | "Urgent" | "Critical";
    status: "Delivered" | "Active" | "Completed" | "Published" | "Scheduled";
    timestamp: string;
  }>;
  aiAssistant: {
    status: "ACTIVE";
    subtitle: "Autonomous extraction & governance";
    insights: Array<{
      id: string;
      title: string;
      detail: string;
      category: string;
      priority: "high" | "medium" | "low";
      actionLabel?: string;
    }>;
  };
  channelGateways: Array<{
    name: string;
    protocol: string;
    uptime: string;
    latency: string;
    status: "Operational" | "Degraded" | "Offline";
  }>;
};

export const MOCK_COMMUNICATION_OVERVIEW: CommunicationOverviewData = {
  kpis: {
    totalEmails: {
      value: "12,840",
      delta: "+18%",
      isPositive: true,
      subtext: "Sent: 7420 · Rcvd: 5420",
    },
    realtimeMessages: {
      value: "18,420",
      delta: "+24%",
      isPositive: true,
      subtext: "142 Active conversations",
    },
    videoMeetings: {
      value: "486",
      badge: "96.4% Att.",
      isPositive: true,
      subtext: "458 completed · 28 upcoming",
    },
    notifications: {
      value: "248",
      badge: "99.2% Del.",
      isPositive: true,
      subtext: "196 Delivered · 32 pending action",
    },
    announcements: {
      value: "54",
      badge: "94.8% Ack",
      isPositive: true,
      subtext: "18 awaiting approval · 32 scheduled",
    },
    responseSla: {
      value: "1.4 hrs",
      delta: "-30% Time",
      isPositive: true,
      subtext: "14 pending · 2 overdue",
    },
    activeChannels: {
      value: "142",
      caption: "Active Squad & Group Channels",
    },
    deliveryRate: {
      value: "99.2%",
      caption: "SMTP, Webhook & Push Gateways",
    },
    slaAdherence: {
      value: "95.4%",
      caption: "On-time SLA Across Departments",
    },
    aiAssistantActions: {
      value: "42",
      caption: "Autonomous Drafts & Triaged",
    },
  },
  volumeTrendData: [
    { month: "May", emails: 9400, chats: 14200 },
    { month: "Jun", emails: 10200, chats: 15600 },
    { month: "Jul", emails: 11100, chats: 16800 },
    { month: "Aug", emails: 11900, chats: 17500 },
    { month: "Sep", emails: 12840, chats: 18420 },
  ],
  domainDistribution: [
    { name: "Sales & CRM", value: 34, color: "#2563eb" },
    { name: "Procurement & SCM", value: 24, color: "#059669" },
    { name: "Engineering & R&D", value: 18, color: "#7c3aed" },
    { name: "Quality & Compliance", value: 12, color: "#d97706" },
    { name: "Finance & Legal", value: 8, color: "#dc2626" },
    { name: "HR & Operations", value: 4, color: "#0891b2" },
  ],
  slaPerformance: [
    { dept: "Sales", onTime: 96, breached: 4 },
    { dept: "Procurement", onTime: 94, breached: 6 },
    { dept: "Engineering", onTime: 92, breached: 8 },
    { dept: "Quality", onTime: 98, breached: 2 },
    { dept: "Customer Support", onTime: 95, breached: 5 },
    { dept: "Finance", onTime: 97, breached: 3 },
  ],
  operationsLedger: [
    {
      id: "rec-1",
      refId: "COMM-EML-2026-089",
      type: "Email",
      title: "Quotation for Wireless EV Charging Station - Magnertia",
      module: "Sales",
      contextRecord: "QTN-2026-0145",
      sender: "Arun Kumar",
      recipient: "vijay@greenfleet.in",
      priority: "High",
      status: "Delivered",
      timestamp: "Today, 10:24 AM",
    },
    {
      id: "rec-2",
      refId: "COMM-CHT-2026-041",
      type: "Chat",
      title: "Battery Pack Thermal Runaway Simulation Sync",
      module: "R&D",
      contextRecord: "SIM-2026-0042",
      sender: "Priya Sharma",
      recipient: "Engineering Squad (12)",
      priority: "Urgent",
      status: "Active",
      timestamp: "Today, 09:45 AM",
    },
    {
      id: "rec-3",
      refId: "COMM-MTG-2026-012",
      type: "Video Meeting",
      title: "Product Design Review & ISO 9001 Stage 2 Audit",
      module: "Quality",
      contextRecord: "AUD-2026-0018",
      sender: "Ramesh Sundaram",
      recipient: "Lead Auditors & Ops",
      priority: "High",
      status: "Completed",
      timestamp: "Yesterday, 03:00 PM",
    },
    {
      id: "rec-4",
      refId: "COMM-NOT-2026-095",
      type: "Notification",
      title: "Purchase Order PO-2026-0892 Approval SLA Alert",
      module: "Procurement",
      contextRecord: "PO-2026-0892",
      sender: "ERP System Workflow",
      recipient: "Finance Controller",
      priority: "Critical",
      status: "Delivered",
      timestamp: "Today, 08:15 AM",
    },
    {
      id: "rec-5",
      refId: "COMM-ANN-2026-008",
      type: "Announcement",
      title: "Q3 Factory Maintenance & Cleanroom Sanitization Window",
      module: "Manufacturing",
      contextRecord: "FAC-MAINT-2026-Q3",
      sender: "Chief Operating Officer",
      recipient: "All Plant Employees",
      priority: "Normal",
      status: "Published",
      timestamp: "22-Sep-2026",
    },
    {
      id: "rec-6",
      refId: "COMM-EML-2026-088",
      type: "Email",
      title: "TANSEED Grant Application Submission & Compliance Dossier",
      module: "Legal & Grants",
      contextRecord: "GRT-TN-2026-01",
      sender: "Arun Kumar",
      recipient: "grants@startuptn.in",
      priority: "High",
      status: "Delivered",
      timestamp: "21-Sep-2026",
    },
    {
      id: "rec-7",
      refId: "COMM-MTG-2026-015",
      type: "Video Meeting",
      title: "Weekly Supply Chain Escalation & Vendor Onboarding Review",
      module: "Supply Chain",
      contextRecord: "SCM-WK-38",
      sender: "Divya M",
      recipient: "Procurement & SCM Leads",
      priority: "Normal",
      status: "Scheduled",
      timestamp: "Tomorrow, 11:00 AM",
    },
    {
      id: "rec-8",
      refId: "COMM-NOT-2026-094",
      type: "Notification",
      title: "SOP-MFG-042 Revision Published & Ready for Signoff",
      module: "Knowledge",
      contextRecord: "SOP-MFG-042",
      sender: "Quality Assurance",
      recipient: "Manufacturing Operators",
      priority: "Normal",
      status: "Delivered",
      timestamp: "20-Sep-2026",
    },
  ],
  aiAssistant: {
    status: "ACTIVE",
    subtitle: "Autonomous extraction & governance",
    insights: [
      {
        id: "ai-comm-1",
        title: "Quotation Follow-Up Trigger (QTN-2026-0145)",
        detail: "GreenFleet Solutions opened the 30 kW DC Fast Charger quote 4 times in 48 hours without replying. Recommended follow-up email template auto-generated.",
        category: "Sales Acceleration",
        priority: "high",
        actionLabel: "Review Auto-Draft",
      },
      {
        id: "ai-comm-2",
        title: "Meeting Minutes & Action Items Synced (AUD-2026-0018)",
        detail: "Audio transcription completed for ISO 9001 Stage 2 Audit review. 4 corrective actions assigned to floor supervisors with calendar deadlines.",
        category: "Audit Governance",
        priority: "medium",
        actionLabel: "Inspect Action Log",
      },
      {
        id: "ai-comm-3",
        title: "High Chat Thread Volume: Thermal Runaway Simulation",
        detail: "Channel #engineering-thermal reached 214 messages today. AI summarized key decision: 150mm cooling fin spacing approved for prototype batch B2.",
        category: "Context Summarization",
        priority: "low",
        actionLabel: "View Summary",
      },
    ],
  },
  channelGateways: [
    { name: "Enterprise SMTP Relay", protocol: "TLS / Port 587", uptime: "99.98%", latency: "142 ms", status: "Operational" },
    { name: "WebSocket Chat Cluster", protocol: "WSS / Redis PubSub", uptime: "99.95%", latency: "18 ms", status: "Operational" },
    { name: "WebRTC Video SFU Mesh", protocol: "DTLS-SRTP / Opus", uptime: "99.91%", latency: "42 ms", status: "Operational" },
    { name: "Push Notification Hub", protocol: "FCM / APNs Gateway", uptime: "99.99%", latency: "88 ms", status: "Operational" },
  ],
};

export const communicationOverviewOptions = queryOptions({
  queryKey: ["communication-overview"],
  queryFn: async () => MOCK_COMMUNICATION_OVERVIEW,
});
