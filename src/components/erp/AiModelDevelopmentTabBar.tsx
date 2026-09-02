import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type AiModelDevelopmentTabId =
  | "all"
  | "overview"
  | "dataset"
  | "features"
  | "architecture"
  | "training"
  | "evaluation"
  | "governance"
  | "deployment"
  | "ai_assessment"
  | "summary"
  | "attachments"
  | "review_approval"
  | "system_info";

export interface AiModelDevelopmentTabItem {
  id: AiModelDevelopmentTabId;
  label: string;
  badge?: string | number;
}

export const AI_MODEL_TABS: AiModelDevelopmentTabItem[] = [
  { id: "all", label: "All Sections" },
  { id: "overview", label: "Overview" },
  { id: "dataset", label: "Dataset", badge: "2.4 TB" },
  { id: "features", label: "Features", badge: "88/100" },
  { id: "architecture", label: "Architecture", badge: "XGBoost" },
  { id: "training", label: "Training", badge: "200 Ep" },
  { id: "evaluation", label: "Evaluation", badge: "92.4% Acc" },
  { id: "governance", label: "Governance", badge: "GDPR" },
  { id: "deployment", label: "Deployment", badge: "Deployed" },
  { id: "ai_assessment", label: "AI Assessment", badge: "92/100" },
  { id: "summary", label: "Summary", badge: "90/100" },
  { id: "attachments", label: "Attachments", badge: "8 Files" },
  { id: "review_approval", label: "Review & Approval", badge: "In Review" },
  { id: "system_info", label: "System Info" },
];

export function AiModelDevelopmentTabBar({
  activeTab = "overview",
  onTabChange,
}: {
  activeTab?: AiModelDevelopmentTabId;
  onTabChange?: (tabId: AiModelDevelopmentTabId) => void;
}) {
  return null;
}
