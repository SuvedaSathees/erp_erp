import React from "react";
import { cn } from "@/lib/utils";

export type PlmTabId =
  | "all"
  | "overview"
  | "configuration"
  | "engineering"
  | "manufacturing"
  | "service_support"
  | "change_management"
  | "ai_assessment"
  | "summary"
  | "attachments"
  | "review_approval"
  | "system_info";

export interface PlmTabItem {
  id: PlmTabId;
  label: string;
  badge?: string | number;
}

export const PLM_TABS: PlmTabItem[] = [
  { id: "all", label: "All Sections" },
  { id: "overview", label: "Overview" },
  { id: "configuration", label: "Configuration", badge: "92" },
  { id: "engineering", label: "Engineering", badge: "91" },
  { id: "manufacturing", label: "Manufacturing", badge: "90" },
  { id: "service_support", label: "Service & Support", badge: "88" },
  { id: "change_management", label: "Change Management", badge: "72" },
  { id: "ai_assessment", label: "AI Assessment", badge: "89/100" },
  { id: "summary", label: "Summary", badge: "88/100" },
  { id: "attachments", label: "Attachments", badge: "8 Files" },
  { id: "review_approval", label: "Review & Approval", badge: "In Review" },
  { id: "system_info", label: "System Info" },
];

export function PlmTabBar(_props?: any) {
  return null;
}

