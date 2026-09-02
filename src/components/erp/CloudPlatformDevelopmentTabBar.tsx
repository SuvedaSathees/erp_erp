import React from "react";
import { cn } from "@/lib/utils";

export type CloudPlatformDevelopmentTabId =
  | "overview"
  | "architecture"
  | "services"
  | "data_platform"
  | "security"
  | "devops_infrastructure"
  | "scalability"
  | "monitoring_operations"
  | "ai_assessment"
  | "summary"
  | "attachments"
  | "review_approval"
  | "system_info";

export interface CloudPlatformDevelopmentTabItem {
  id: CloudPlatformDevelopmentTabId;
  label: string;
  badge?: string | number;
}

export const CLOUD_PLATFORM_TABS: CloudPlatformDevelopmentTabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture", badge: "Microservices" },
  { id: "services", label: "Services", badge: "92/100" },
  { id: "data_platform", label: "Data Platform", badge: "PostgreSQL" },
  { id: "security", label: "Security", badge: "SOC 2 / ISO" },
  { id: "devops_infrastructure", label: "DevOps & Infra", badge: "Kubernetes" },
  { id: "scalability", label: "Scalability", badge: "10K TPS" },
  { id: "monitoring_operations", label: "Monitoring & Operations", badge: "99.98%" },
  { id: "ai_assessment", label: "AI Assessment", badge: "89/100" },
  { id: "summary", label: "Summary", badge: "89/100" },
  { id: "attachments", label: "Attachments", badge: "8 Files" },
  { id: "review_approval", label: "Review & Approval", badge: "In Review" },
  { id: "system_info", label: "System Info" },
];

export function CloudPlatformDevelopmentTabBar(_props?: any) {
  return null;
}

