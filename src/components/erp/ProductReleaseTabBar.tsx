import React from "react";
import { cn } from "@/lib/utils";

export type ProductReleaseTabId =
  | "all"
  | "overview"
  | "engineering"
  | "manufacturing"
  | "commercial"
  | "deployment"
  | "risk_compliance"
  | "ai_assessment"
  | "summary"
  | "attachments"
  | "review_approval"
  | "system_info";

export interface ProductReleaseTabItem {
  id: ProductReleaseTabId;
  label: string;
  badge?: string | number;
}

export const PRODUCT_RELEASE_TABS: ProductReleaseTabItem[] = [
  { id: "all", label: "All Sections" },
  { id: "overview", label: "Overview" },
  { id: "engineering", label: "Engineering", badge: "92" },
  { id: "manufacturing", label: "Manufacturing", badge: "90" },
  { id: "commercial", label: "Commercial", badge: "88" },
  { id: "deployment", label: "Deployment", badge: "89" },
  { id: "risk_compliance", label: "Risk & Compliance", badge: "80" },
  { id: "ai_assessment", label: "AI Assessment", badge: "91/100" },
  { id: "summary", label: "Summary", badge: "88/100" },
  { id: "attachments", label: "Attachments", badge: "8 Files" },
  { id: "review_approval", label: "Review & Approval", badge: "In Review" },
  { id: "system_info", label: "System Info" },
];

export function ProductReleaseTabBar(_props?: any) {
  return null;
}
