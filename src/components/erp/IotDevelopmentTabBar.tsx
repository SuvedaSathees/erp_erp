import React from "react";
import { cn } from "@/lib/utils";

export type IotTabId =
  | "all"
  | "overview"
  | "hardware"
  | "connectivity"
  | "device_mgmt"
  | "data_analytics"
  | "security"
  | "integration"
  | "deployment"
  | "ai_assessment"
  | "summary"
  | "attachments"
  | "review_approval"
  | "system_info";

export interface IotTabItem {
  id: IotTabId;
  label: string;
  badge?: string | number;
}

export const IOT_TABS: IotTabItem[] = [
  { id: "all", label: "All Sections" },
  { id: "overview", label: "Overview" },
  { id: "hardware", label: "Hardware", badge: "89" },
  { id: "connectivity", label: "Connectivity", badge: "92" },
  { id: "device_mgmt", label: "Device Mgmt.", badge: "90" },
  { id: "data_analytics", label: "Data & Analytics", badge: "91" },
  { id: "security", label: "Security", badge: "90" },
  { id: "integration", label: "Integration", badge: "93" },
  { id: "deployment", label: "Deployment", badge: "92" },
  { id: "ai_assessment", label: "AI Assessment", badge: "92/100" },
  { id: "summary", label: "Summary", badge: "91/100" },
  { id: "attachments", label: "Attachments", badge: "8 Files" },
  { id: "review_approval", label: "Review & Approval", badge: "In Review" },
  { id: "system_info", label: "System Info" },
];

export function IotDevelopmentTabBar(_props?: any) {
  return null;
}

