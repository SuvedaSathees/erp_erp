import React from "react";
import { cn } from "@/lib/utils";

export type CybersecurityEngineeringTabId =
  | "all"
  | "overview"
  | "threat_modeling"
  | "architecture"
  | "iam"
  | "secure_development"
  | "security_testing"
  | "monitoring"
  | "compliance"
  | "ai_assessment"
  | "summary"
  | "attachments"
  | "review_approval"
  | "system_info";

export interface CybersecurityEngineeringTabItem {
  id: CybersecurityEngineeringTabId;
  label: string;
  badge?: string | number;
}

export const CYBERSECURITY_TABS: CybersecurityEngineeringTabItem[] = [
  { id: "all", label: "All Sections" },
  { id: "overview", label: "Overview" },
  { id: "threat_modeling", label: "Threat Modeling", badge: "STRIDE" },
  { id: "architecture", label: "Architecture", badge: "Zero Trust" },
  { id: "iam", label: "IAM", badge: "OAuth 2.0" },
  { id: "secure_development", label: "Secure Development", badge: "OWASP ASVS" },
  { id: "security_testing", label: "Security Testing", badge: "DAST" },
  { id: "monitoring", label: "Monitoring", badge: "Sentinel SIEM" },
  { id: "compliance", label: "Compliance", badge: "ISO 27001" },
  { id: "ai_assessment", label: "AI Assessment", badge: "92/100" },
  { id: "summary", label: "Summary", badge: "91/100" },
  { id: "attachments", label: "Attachments", badge: "8 Files" },
  { id: "review_approval", label: "Review & Approval", badge: "In Review" },
  { id: "system_info", label: "System Info" },
];

export function CybersecurityEngineeringTabBar(_props?: any) {
  return null;
}

