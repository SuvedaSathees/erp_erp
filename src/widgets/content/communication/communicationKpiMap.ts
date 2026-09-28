import type { WidgetPageId } from "../../types";

export const COMMUNICATION_PAGE_KPIS: Partial<Record<WidgetPageId, Record<string, string>>> = {
  "communication-overview": {
    "Total Emails": "kpi.communication.total-emails",
    "Real-Time Messages": "kpi.communication.realtime-messages",
    "Video Meetings": "kpi.communication.video-meetings",
    "Notifications": "kpi.communication.notifications",
    "Announcements": "kpi.communication.announcements",
    "Avg Response SLA": "kpi.communication.response-sla",
    "Active Channels": "kpi.communication.active-channels",
    "Delivery Rate": "kpi.communication.delivery-rate",
    "SLA Adherence": "kpi.communication.sla-adherence",
    "AI Assistant Actions": "kpi.communication.ai-actions",
  },
};
