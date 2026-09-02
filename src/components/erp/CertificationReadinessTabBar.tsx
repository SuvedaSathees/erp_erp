import React from "react";
import { cn } from "@/lib/utils";

export type CertificationTabKey =
  | "overview"
  | "standards_regulations"
  | "documentation"
  | "testing_readiness"
  | "laboratory"
  | "compliance"
  | "ai_assessment"
  | "summary"
  | "attachments"
  | "review_approval"
  | "system_info";

export const CERTIFICATION_READINESS_TABS: { key: CertificationTabKey; label: string; num: number; badge?: string }[] = [
  { key: "overview", label: "Overview", num: 1 },
  { key: "standards_regulations", label: "Standards & Regulations", num: 2, badge: "86" },
  { key: "documentation", label: "Documentation", num: 3, badge: "88" },
  { key: "testing_readiness", label: "Testing Readiness", num: 4, badge: "90" },
  { key: "laboratory", label: "Laboratory", num: 5, badge: "85" },
  { key: "compliance", label: "Compliance", num: 6, badge: "84" },
  { key: "ai_assessment", label: "AI Assessment", num: 7, badge: "89/100" },
  { key: "summary", label: "Summary", num: 8, badge: "88/100" },
  { key: "attachments", label: "Attachments", num: 9, badge: "4 Files" },
  { key: "review_approval", label: "Review & Approval", num: 10, badge: "In Progress" },
  { key: "system_info", label: "System Info", num: 11 },
];

interface CertificationReadinessTabBarProps {
  activeTab: CertificationTabKey;
  onTabChange: (key: CertificationTabKey) => void;
  className?: string;
}

export function CertificationReadinessTabBar(_props?: any) {
  return null;
}
