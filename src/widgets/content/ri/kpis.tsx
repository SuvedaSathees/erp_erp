/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Activity,
  Award,
  CheckCircle2,
  Layers,
  TrendingUp,
} from "lucide-react";
import type { WidgetDefinition } from "../../types";
import { makeStatCardWidget } from "../shared/StatCardWidget";
import { RI_PANEL_WIDGETS } from "./panels";

export const riKpis: WidgetDefinition[] = [
  makeStatCardWidget({
    id: "kpi.ri.active-submodules",
    title: "Active R&I Submodules",
    description: "Total connected research, engineering, quality, and digital innovation modules.",
    category: "kpi",
    tags: ["kpi", "ri"],
    icon: Layers,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    options: () => ({ queryKey: ["ri", "active-submodules"], queryFn: async () => ({ value: 27, statusText: "100% operational pipeline" }) }),
    map: (data: any) => ({ value: String(data?.value ?? 27), delta: { label: "100% operational pipeline", direction: "up", tone: "positive" } }),
  }),
  makeStatCardWidget({
    id: "kpi.ri.composite-readiness",
    title: "Composite Readiness",
    description: "Aggregate engineering and compliance readiness score across all active programs.",
    category: "kpi",
    tags: ["kpi", "ri"],
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    options: () => ({ queryKey: ["ri", "composite-readiness"], queryFn: async () => ({ value: "91.4%", statusText: "Lead: Smart EV Charger AC 7kW" }) }),
    map: (data: any) => ({ value: String(data?.value ?? "91.4%"), delta: { label: "Lead: Smart EV Charger AC 7kW", direction: "up", tone: "positive" } }),
  }),
  makeStatCardWidget({
    id: "kpi.ri.active-workflows",
    title: "Active Engineering Workflows",
    description: "Active engineering baselines and qualification workflows progressing through gates.",
    category: "kpi",
    tags: ["kpi", "ri"],
    icon: Activity,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    options: () => ({ queryKey: ["ri", "active-workflows"], queryFn: async () => ({ value: 249, statusText: "Across 27 integrated streams" }) }),
    map: (data: any) => ({ value: String(data?.value ?? 249), delta: { label: "Across 27 integrated streams", direction: "up", tone: "positive" } }),
  }),
  makeStatCardWidget({
    id: "kpi.ri.gate-adherence",
    title: "Gate Adherence Velocity",
    description: "Stage-gate milestone compliance and release schedule adherence.",
    category: "kpi",
    tags: ["kpi", "ri"],
    icon: TrendingUp,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    options: () => ({ queryKey: ["ri", "gate-adherence"], queryFn: async () => ({ value: "94.2%", statusText: "Launch: Q3/Q4 2024" }) }),
    map: (data: any) => ({ value: String(data?.value ?? "94.2%"), delta: { label: "Launch: Q3/Q4 2024", direction: "up", tone: "positive" } }),
  }),
  makeStatCardWidget({
    id: "kpi.ri.ip-patents",
    title: "Patents & IP Filings",
    description: "Proprietary charging patents, utility designs, and trade secrets filed.",
    category: "kpi",
    tags: ["kpi", "ri"],
    icon: Award,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-500",
    options: () => ({ queryKey: ["ri", "ip-patents"], queryFn: async () => ({ value: 18, statusText: "4 granted, 14 published" }) }),
    map: (data: any) => ({ value: String(data?.value ?? 18), delta: { label: "4 granted, 14 published", direction: "up", tone: "positive" } }),
  }),
];

export const RI_KPI_WIDGETS: WidgetDefinition[] = [
  ...riKpis,
  ...RI_PANEL_WIDGETS,
];
