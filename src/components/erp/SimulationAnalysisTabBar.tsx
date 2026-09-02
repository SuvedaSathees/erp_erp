import React from "react";
import { cn } from "@/lib/utils";

export type SimulationAnalysisTabId =
  | "all"
  | "overview"
  | "model_preparation"
  | "boundary_conditions"
  | "configuration"
  | "analysis"
  | "results_validation"
  | "optimization"
  | "ai_assessment"
  | "summary"
  | "attachments"
  | "review_approval"
  | "system_info";

export interface SimulationAnalysisTabItem {
  id: SimulationAnalysisTabId;
  label: string;
  badge?: string | number;
}

export const SIMULATION_TABS: SimulationAnalysisTabItem[] = [
  { id: "all", label: "All Sections" },
  { id: "overview", label: "Overview" },
  { id: "model_preparation", label: "Model Preparation", badge: "1.2M Mesh" },
  { id: "boundary_conditions", label: "Boundary Conditions", badge: "Fixed / 45°C" },
  { id: "configuration", label: "Configuration", badge: "ANSYS 2024" },
  { id: "analysis", label: "Analysis", badge: "Multi-Physics" },
  { id: "results_validation", label: "Results & Validation", badge: "78.6 MPa" },
  { id: "optimization", label: "Optimization", badge: "-8.7% Wt" },
  { id: "ai_assessment", label: "AI Assessment", badge: "92/100" },
  { id: "summary", label: "Summary", badge: "91/100" },
  { id: "attachments", label: "Attachments", badge: "8 Files" },
  { id: "review_approval", label: "Review & Approval", badge: "In Progress" },
  { id: "system_info", label: "System Info" },
];

export function SimulationAnalysisTabBar(_props?: any) {
  return null;
}

