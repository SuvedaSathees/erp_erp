import React from "react";
import { cn } from "@/lib/utils";

export type TestingTabKey =
  | "all"
  | "overview"
  | "test_planning"
  | "prototype_equipment"
  | "functional_testing"
  | "performance_reliability"
  | "safety_compliance"
  | "results_validation"
  | "ai_assessment"
  | "summary"
  | "attachments"
  | "review_approval"
  | "system_info";

export const TESTING_VALIDATION_TABS: { key: TestingTabKey; label: string; num: number }[] = [
  { key: "all", label: "All Sections", num: 0 },
  { key: "overview", label: "Overview", num: 1 },
  { key: "test_planning", label: "Test Planning", num: 2 },
  { key: "prototype_equipment", label: "Prototype & Equipment", num: 3 },
  { key: "functional_testing", label: "Functional Testing", num: 4 },
  { key: "performance_reliability", label: "Performance & Reliability", num: 5 },
  { key: "safety_compliance", label: "Safety & Compliance", num: 6 },
  { key: "results_validation", label: "Results & Validation", num: 7 },
  { key: "ai_assessment", label: "AI Assessment", num: 8 },
  { key: "summary", label: "Summary", num: 9 },
  { key: "attachments", label: "Attachments", num: 10 },
  { key: "review_approval", label: "Review & Approval", num: 11 },
  { key: "system_info", label: "System Info", num: 12 },
];

interface TestingValidationTabBarProps {
  activeTab: TestingTabKey;
  onTabChange: (key: TestingTabKey) => void;
  className?: string;
}

export function TestingValidationTabBar(_props: TestingValidationTabBarProps) {
  return null;
}
