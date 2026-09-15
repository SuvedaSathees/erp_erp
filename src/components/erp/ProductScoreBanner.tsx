import React from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScoreItem {
  label: string;
  score: number;
  max?: number;
  sub?: string;
  size?: "normal" | "large";
}

export function ScoreGauge({
  label,
  score,
  max = 100,
  sub,
  size = "normal",
}: ScoreItem) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const colorClass =
    score >= 90
      ? "text-emerald-500"
      : score >= 80
      ? "text-blue-600"
      : score >= 70
      ? "text-amber-500"
      : "text-rose-500";

  const isLarge = size === "large";
  const circleSize = isLarge ? 84 : 64;
  const radius = isLarge ? 36 : 26;
  const stroke = isLarge ? 7 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * pct) / 100;

  const displaySub =
    sub ??
    (score >= 90
      ? "Excellent"
      : score >= 80
      ? "Very Good"
      : score >= 70
      ? "Good"
      : "Needs Attention");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-border bg-card shadow-xs text-center transition-all hover:shadow-md hover:border-primary/30",
        isLarge ? "p-4" : "p-3"
      )}
    >
      <div className="relative grid place-items-center" style={{ width: circleSize, height: circleSize }}>
        <svg
          className="-rotate-90 transform"
          width={circleSize}
          height={circleSize}
          viewBox={`0 0 ${circleSize} ${circleSize}`}
        >
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted/20"
            fill="transparent"
          />
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            className={cn("transition-all duration-1000 ease-out", colorClass)}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={cn("font-display font-bold text-foreground", isLarge ? "text-xl" : "text-sm")}>
            {score}
          </span>
          {isLarge && <span className="text-[9px] text-muted-foreground font-semibold">/ {max}</span>}
        </div>
      </div>
      <span
        title={label}
        className={cn(
          "font-bold text-foreground truncate max-w-[125px]",
          isLarge ? "mt-2 text-xs" : "mt-1.5 text-[11px]"
        )}
      >
        {label}
      </span>
      <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[120px]">{displaySub}</span>
    </div>
  );
}

export interface ModuleMetrics {
  overallScore: number;
  overallSub?: string;
  scores: Array<{ label: string; score: number; sub?: string }>;
  lifecycleStage: string;
}

export const PRODUCT_SUBMODULE_METRICS: Record<string, ModuleMetrics> = {
  "product-strategy": {
    overallScore: 87,
    overallSub: "Very Good",
    scores: [
      { label: "Market Alignment", score: 86, sub: "Very Good" },
      { label: "Revenue Potential", score: 85, sub: "Very Good" },
      { label: "Feasibility", score: 84, sub: "Very Good" },
      { label: "Scalability", score: 88, sub: "Very Good" },
      { label: "AI Strategy", score: 91, sub: "Excellent" },
    ],
    lifecycleStage: "Growth",
  },
  "product-roadmap": {
    overallScore: 88,
    overallSub: "Very Good",
    scores: [
      { label: "Milestone Velocity", score: 85, sub: "Very Good" },
      { label: "Dependency Health", score: 89, sub: "Very Good" },
      { label: "Resource Allocation", score: 84, sub: "Very Good" },
      { label: "Predictability", score: 87, sub: "Very Good" },
      { label: "AI Horizon", score: 90, sub: "Excellent" },
    ],
    lifecycleStage: "Active",
  },
  prd: {
    overallScore: 89,
    overallSub: "Very Good",
    scores: [
      { label: "Business Value", score: 92, sub: "Excellent" },
      { label: "Functional Scope", score: 88, sub: "Very Good" },
      { label: "Tech Feasibility", score: 85, sub: "Very Good" },
      { label: "Verification Gate", score: 86, sub: "Very Good" },
      { label: "AI Requirements", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Specification",
  },
  "product-architecture": {
    overallScore: 88,
    overallSub: "Very Good",
    scores: [
      { label: "Modularity", score: 90, sub: "Excellent" },
      { label: "System Integration", score: 86, sub: "Very Good" },
      { label: "Headroom Margin", score: 87, sub: "Very Good" },
      { label: "Scalability", score: 89, sub: "Very Good" },
      { label: "AI Architecture", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Architecture",
  },
  "industrial-design": {
    overallScore: 89,
    overallSub: "Very Good",
    scores: [
      { label: "Ergonomics Index", score: 91, sub: "Excellent" },
      { label: "CMF Feasibility", score: 86, sub: "Very Good" },
      { label: "User Experience", score: 90, sub: "Excellent" },
      { label: "Tooling Readiness", score: 84, sub: "Very Good" },
      { label: "AI Aesthetics", score: 88, sub: "Very Good" },
    ],
    lifecycleStage: "Design",
  },
  "mechanical-design": {
    overallScore: 87,
    overallSub: "Very Good",
    scores: [
      { label: "Structural Integrity", score: 89, sub: "Very Good" },
      { label: "Thermal Margin", score: 88, sub: "Very Good" },
      { label: "DFM Feasibility", score: 86, sub: "Very Good" },
      { label: "Tolerance Stackup", score: 85, sub: "Very Good" },
      { label: "AI CAE Physics", score: 90, sub: "Excellent" },
    ],
    lifecycleStage: "CAD Design",
  },
  "electrical-design": {
    overallScore: 88,
    overallSub: "Very Good",
    scores: [
      { label: "Power Efficiency", score: 90, sub: "Excellent" },
      { label: "Schematic Integrity", score: 87, sub: "Very Good" },
      { label: "Harness Reliability", score: 86, sub: "Very Good" },
      { label: "EMC Compliance", score: 88, sub: "Very Good" },
      { label: "AI Simulation", score: 89, sub: "Very Good" },
    ],
    lifecycleStage: "Schematic",
  },
  "electronics-design": {
    overallScore: 89,
    overallSub: "Very Good",
    scores: [
      { label: "Signal Integrity", score: 91, sub: "Excellent" },
      { label: "PCB Thermal Margin", score: 87, sub: "Very Good" },
      { label: "Component Supply", score: 85, sub: "Very Good" },
      { label: "Testpoint Coverage", score: 88, sub: "Very Good" },
      { label: "AI PCB Placement", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Layout",
  },
  "embedded-systems-development": {
    overallScore: 88,
    overallSub: "Very Good",
    scores: [
      { label: "HAL Coverage", score: 90, sub: "Excellent" },
      { label: "RTOS Latency", score: 88, sub: "Very Good" },
      { label: "Memory Footprint", score: 86, sub: "Very Good" },
      { label: "Driver Stability", score: 89, sub: "Very Good" },
      { label: "AI Embedded", score: 91, sub: "Excellent" },
    ],
    lifecycleStage: "Prototyping",
  },
  "firmware-development": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "Bootloader Margin", score: 92, sub: "Excellent" },
      { label: "OTA Security", score: 91, sub: "Excellent" },
      { label: "Crash-Free Rate", score: 94, sub: "Excellent" },
      { label: "Driver Reliability", score: 89, sub: "Very Good" },
      { label: "AI Diagnostics", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Release Candidate",
  },
  "software-development": {
    overallScore: 89,
    overallSub: "Very Good",
    scores: [
      { label: "Code Quality", score: 91, sub: "Excellent" },
      { label: "Service Uptime", score: 93, sub: "Excellent" },
      { label: "API Latency", score: 88, sub: "Very Good" },
      { label: "CI/CD Automation", score: 90, sub: "Excellent" },
      { label: "AI DevSecOps", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Sprint",
  },
  "mobile-app-development": {
    overallScore: 88,
    overallSub: "Very Good",
    scores: [
      { label: "Store Readiness", score: 90, sub: "Excellent" },
      { label: "Crash-Free Users", score: 92, sub: "Excellent" },
      { label: "UI Responsiveness", score: 89, sub: "Very Good" },
      { label: "Battery Usage", score: 87, sub: "Very Good" },
      { label: "AI Telemetry", score: 91, sub: "Excellent" },
    ],
    lifecycleStage: "Beta",
  },
  "cloud-platform-development": {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Cloud Resilience", score: 93, sub: "Excellent" },
      { label: "Cost Optimization", score: 88, sub: "Very Good" },
      { label: "Multi-Region Latency", score: 90, sub: "Excellent" },
      { label: "Auto-Scaling", score: 92, sub: "Excellent" },
      { label: "AI Reliability", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Production",
  },
  "api-development": {
    overallScore: 89,
    overallSub: "Very Good",
    scores: [
      { label: "Endpoint Security", score: 92, sub: "Excellent" },
      { label: "OpenAPI Specs", score: 90, sub: "Excellent" },
      { label: "Rate Limit Health", score: 88, sub: "Very Good" },
      { label: "Contract Tests", score: 87, sub: "Very Good" },
      { label: "AI API Gateway", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Published",
  },
  "ai-model-development": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Model Accuracy", score: 94, sub: "Excellent" },
      { label: "Drift Resilience", score: 89, sub: "Very Good" },
      { label: "F1-Score / ROC", score: 91, sub: "Excellent" },
      { label: "Inference Latency", score: 90, sub: "Excellent" },
      { label: "AI Governance", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Deployed",
  },
  "iot-development": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "MQTT Telemetry", score: 92, sub: "Excellent" },
      { label: "Edge Intelligence", score: 89, sub: "Very Good" },
      { label: "Device Provisioning", score: 91, sub: "Excellent" },
      { label: "Gateway Uptime", score: 93, sub: "Excellent" },
      { label: "AI IoT Analytics", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Connected",
  },
  "ui-ux-development": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "Usability Score", score: 92, sub: "Excellent" },
      { label: "Design System Sync", score: 91, sub: "Excellent" },
      { label: "WCAG Accessibility", score: 89, sub: "Very Good" },
      { label: "User Task Speed", score: 88, sub: "Very Good" },
      { label: "AI UX Heatmap", score: 90, sub: "Excellent" },
    ],
    lifecycleStage: "High-Fidelity",
  },
  "cybersecurity-engineering": {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "Threat Mitigation", score: 95, sub: "Excellent" },
      { label: "Zero-Trust Health", score: 91, sub: "Excellent" },
      { label: "Vulnerability SLA", score: 94, sub: "Excellent" },
      { label: "Encryption Grade", score: 96, sub: "Excellent" },
      { label: "AI Cyber Defense", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Hardened",
  },
  "simulation-analysis": {
    overallScore: 89,
    overallSub: "Very Good",
    scores: [
      { label: "FEA Stress Margin", score: 91, sub: "Excellent" },
      { label: "CFD Thermal Flow", score: 88, sub: "Very Good" },
      { label: "Mesh Convergence", score: 90, sub: "Excellent" },
      { label: "Empirical Correlation", score: 87, sub: "Very Good" },
      { label: "AI CAE Physics", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Verified",
  },
  "testing-validation": {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Test Coverage", score: 93, sub: "Excellent" },
      { label: "Pass Rate", score: 95, sub: "Excellent" },
      { label: "Regression Health", score: 90, sub: "Excellent" },
      { label: "Defect SLA", score: 89, sub: "Very Good" },
      { label: "AI Automation", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Validation",
  },
  "certification-readiness": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "Standards Audit", score: 92, sub: "Excellent" },
      { label: "Regulatory Gates", score: 91, sub: "Excellent" },
      { label: "Lab Reports Signoff", score: 89, sub: "Very Good" },
      { label: "Compliance Index", score: 88, sub: "Very Good" },
      { label: "AI Certification", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Pre-Certification",
  },
  "product-documentation": {
    overallScore: 89,
    overallSub: "Very Good",
    scores: [
      { label: "Manual Completeness", score: 92, sub: "Excellent" },
      { label: "Version Baseline", score: 90, sub: "Excellent" },
      { label: "Regulatory Annexes", score: 88, sub: "Very Good" },
      { label: "Publishing Gate", score: 91, sub: "Excellent" },
      { label: "AI Documentation", score: 90, sub: "Excellent" },
    ],
    lifecycleStage: "Documentation",
  },
  "product-release-management": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Gate 5 Sign-Off", score: 94, sub: "Excellent" },
      { label: "Commercial Check", score: 90, sub: "Excellent" },
      { label: "Supply Chain", score: 91, sub: "Excellent" },
      { label: "Go/No-Go Approval", score: 93, sub: "Excellent" },
      { label: "AI Release Gate", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Launch Ready",
  },
  "product-lifecycle-management": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "BOM Traceability", score: 92, sub: "Excellent" },
      { label: "ECO Turnaround", score: 89, sub: "Very Good" },
      { label: "Obsolescence Margin", score: 87, sub: "Very Good" },
      { label: "Sustaining Quality", score: 91, sub: "Excellent" },
      { label: "AI PLM Engine", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Active Sustaining",
  },
};

export interface ProductScoreBannerProps {
  submoduleKey?: string;
  overallScore?: number;
  overallSub?: string;
  scores?: Array<{ label: string; score: number; sub?: string }>;
  lifecycleStage?: string;
  className?: string;
}

export function ProductScoreBanner({
  submoduleKey = "product-strategy",
  overallScore: propOverallScore,
  overallSub: propOverallSub,
  scores: propScores,
  lifecycleStage: propLifecycle,
  className,
}: ProductScoreBannerProps) {
  const fallback = PRODUCT_SUBMODULE_METRICS[submoduleKey] ?? PRODUCT_SUBMODULE_METRICS["product-strategy"];

  const overall = propOverallScore ?? fallback.overallScore;
  const overallSub = propOverallSub ?? fallback.overallSub ?? (overall >= 90 ? "Excellent" : "Very Good");
  const scores = propScores ?? fallback.scores;
  const lifecycleStage = propLifecycle ?? fallback.lifecycleStage;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7 w-full",
        className
      )}
    >
      {/* 1. Overall Score */}
      <ScoreGauge label="Overall Score" score={overall} sub={overallSub} size="normal" />

      {/* 2 - 6. Specific Domain Metric Gauges */}
      {scores.slice(0, 5).map((item, idx) => (
        <ScoreGauge
          key={item.label || idx}
          label={item.label}
          score={item.score}
          sub={item.sub}
          size="normal"
        />
      ))}

      {/* 7. Lifecycle Stage Card with TrendingUp Icon */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-xs text-center transition-all hover:border-primary/30">
        <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="h-6 w-6" />
        </div>
        <span className="mt-2 text-xs font-bold text-foreground">Lifecycle Stage</span>
        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{lifecycleStage}</span>
      </div>
    </div>
  );
}
