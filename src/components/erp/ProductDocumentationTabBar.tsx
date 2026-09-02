import React from "react";
import { cn } from "@/lib/utils";

export type ProductDocumentationTabId =
  | "overview"
  | "engineering_docs"
  | "manufacturing_docs"
  | "quality_compliance"
  | "customer_docs"
  | "version_control"
  | "ai_assessment"
  | "summary"
  | "attachments"
  | "review_approval"
  | "system_info";

export interface ProductDocumentationTabItem {
  id: ProductDocumentationTabId;
  label: string;
  badge?: string | number;
}

export const PRODUCT_DOCUMENTATION_TABS: ProductDocumentationTabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "engineering_docs", label: "Engineering Docs", badge: "92" },
  { id: "manufacturing_docs", label: "Manufacturing Docs", badge: "90" },
  { id: "quality_compliance", label: "Quality & Compliance", badge: "89" },
  { id: "customer_docs", label: "Customer Docs", badge: "91" },
  { id: "version_control", label: "Version Control", badge: "88" },
  { id: "ai_assessment", label: "AI Assessment", badge: "90/100" },
  { id: "summary", label: "Summary", badge: "90/100" },
  { id: "attachments", label: "Attachments", badge: "15 Files" },
  { id: "review_approval", label: "Review & Approval", badge: "In Review" },
  { id: "system_info", label: "System Info" },
];

export function ProductDocumentationTabBar(_props?: any) {
  return null;
}
