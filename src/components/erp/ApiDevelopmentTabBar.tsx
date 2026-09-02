import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Grid,
  Code,
  ShieldCheck,
  Cpu,
  FileText,
  CheckCircle2,
  Rocket,
  Activity,
  Sparkles,
  Award,
  Paperclip,
  Workflow,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export type ApiDevelopmentTabId =
  | "overview"
  | "design"
  | "security"
  | "integration"
  | "documentation"
  | "testing"
  | "deployment"
  | "monitoring"
  | "ai_assessment"
  | "summary"
  | "attachments"
  | "review_approval"
  | "system_info";

export interface ApiDevelopmentTabItem {
  id: ApiDevelopmentTabId;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const API_DEVELOPMENT_TABS: ApiDevelopmentTabItem[] = [
  { id: "overview", label: "Overview", shortLabel: "Overview", icon: Grid },
  { id: "design", label: "API Design", shortLabel: "Design", icon: Code },
  { id: "security", label: "Security", shortLabel: "Security", icon: ShieldCheck },
  { id: "integration", label: "Integration", shortLabel: "Integration", icon: Cpu },
  { id: "documentation", label: "Documentation", shortLabel: "Docs", icon: FileText },
  { id: "testing", label: "Testing", shortLabel: "Testing", icon: CheckCircle2 },
  { id: "deployment", label: "Deployment", shortLabel: "Deploy", icon: Rocket },
  { id: "monitoring", label: "Monitoring", shortLabel: "Monitor", icon: Activity },
  { id: "ai_assessment", label: "AI Assessment", shortLabel: "AI Review", icon: Sparkles },
  { id: "summary", label: "Summary", shortLabel: "Summary", icon: Award },
  { id: "attachments", label: "Attachments", shortLabel: "Files", icon: Paperclip, badge: 5 },
  { id: "review_approval", label: "Review & Approval", shortLabel: "Approval", icon: Workflow },
  { id: "system_info", label: "System Info", shortLabel: "System", icon: Info },
];

interface ApiDevelopmentTabBarProps {
  activeTab: ApiDevelopmentTabId;
  onTabChange: (tab: ApiDevelopmentTabId) => void;
  className?: string;
}

export function ApiDevelopmentTabBar(_props: ApiDevelopmentTabBarProps) {
  return null;
}
