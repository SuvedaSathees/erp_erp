import { cn } from "@/lib/utils";

export type UiUxDevelopmentTabId =
  | "overview"
  | "user_research"
  | "ia"
  | "wireframes"
  | "visual_design"
  | "accessibility"
  | "prototype"
  | "handoff"
  | "ai_assessment"
  | "summary"
  | "attachments"
  | "review_approval"
  | "system_info";

export interface UiUxDevelopmentTabItem {
  id: UiUxDevelopmentTabId;
  label: string;
  badge?: string | number;
}

export const UI_UX_TABS: UiUxDevelopmentTabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "user_research", label: "User Research", badge: "3" },
  { id: "ia", label: "Architecture", badge: "25" },
  { id: "wireframes", label: "Wireframes", badge: "64" },
  { id: "visual_design", label: "Design System & A11y", badge: "v3.2" },
  { id: "prototype", label: "Prototype & Handoff", badge: "Figma" },
  { id: "attachments", label: "Attachments", badge: "8" },
  { id: "review_approval", label: "Review & Approval", badge: "In Review" },
];

export function UiUxDevelopmentTabBar(_props?: any) {
  return null;
}

