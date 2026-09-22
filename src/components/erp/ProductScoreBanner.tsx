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

  // =========================================================================
  // 1. ORGANIZATION (ADMINISTRATION MANAGEMENT)
  // =========================================================================
  "organization-structure": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Entity Hierarchy", score: 94, sub: "Excellent" },
      { label: "Reporting Lines", score: 91, sub: "Excellent" },
      { label: "Cost Center Sync", score: 90, sub: "Excellent" },
      { label: "Headcount Headroom", score: 89, sub: "Very Good" },
      { label: "AI Org Matrix", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Active Alignment",
  },
  "branch-management": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "Facility Uptime", score: 92, sub: "Excellent" },
      { label: "License Compliance", score: 94, sub: "Excellent" },
      { label: "Inter-Branch Sync", score: 89, sub: "Very Good" },
      { label: "Asset Readiness", score: 88, sub: "Very Good" },
      { label: "AI Footprint", score: 91, sub: "Excellent" },
    ],
    lifecycleStage: "Operational",
  },
  "department-management": {
    overallScore: 89,
    overallSub: "Very Good",
    scores: [
      { label: "Staffing Capacity", score: 88, sub: "Very Good" },
      { label: "Budget Alignment", score: 90, sub: "Excellent" },
      { label: "KPI Delivery", score: 89, sub: "Very Good" },
      { label: "Collaboration SLA", score: 87, sub: "Very Good" },
      { label: "AI Org Health", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Structured",
  },
  "user-role-management": {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "RBAC Compliance", score: 95, sub: "Excellent" },
      { label: "Privilege Review", score: 92, sub: "Excellent" },
      { label: "MFA Enforcement", score: 94, sub: "Excellent" },
      { label: "Session Security", score: 91, sub: "Excellent" },
      { label: "AI Access Guard", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Secured",
  },
  "approval-matrix-management": {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Turnaround SLA", score: 90, sub: "Excellent" },
      { label: "Delegation Health", score: 89, sub: "Very Good" },
      { label: "Audit Traceability", score: 95, sub: "Excellent" },
      { label: "Threshold Governance", score: 92, sub: "Excellent" },
      { label: "AI Smart Routing", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Optimized",
  },
  "document-control-management": {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "Version Control", score: 96, sub: "Excellent" },
      { label: "Access Governance", score: 93, sub: "Excellent" },
      { label: "Retention Policy", score: 92, sub: "Excellent" },
      { label: "Digital Signatures", score: 95, sub: "Excellent" },
      { label: "AI Document OCR", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Controlled",
  },
  "policy-management": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "Compliance Mapping", score: 92, sub: "Excellent" },
      { label: "Attestation Rate", score: 88, sub: "Very Good" },
      { label: "Review Cadence", score: 90, sub: "Excellent" },
      { label: "Regulatory Gate", score: 93, sub: "Excellent" },
      { label: "AI Policy Audit", score: 91, sub: "Excellent" },
    ],
    lifecycleStage: "Enforced",
  },
  "master-data-management": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Data Quality Score", score: 94, sub: "Excellent" },
      { label: "Deduplication Rate", score: 93, sub: "Excellent" },
      { label: "Golden Record Sync", score: 91, sub: "Excellent" },
      { label: "Schema Hygiene", score: 90, sub: "Excellent" },
      { label: "AI Data Cleansing", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Governed",
  },
  "notifications-management": {
    overallScore: 89,
    overallSub: "Very Good",
    scores: [
      { label: "Delivery Rate", score: 96, sub: "Excellent" },
      { label: "Channel Latency", score: 91, sub: "Excellent" },
      { label: "Escalation Speed", score: 88, sub: "Very Good" },
      { label: "Alert Precision", score: 87, sub: "Very Good" },
      { label: "AI Smart Alerts", score: 90, sub: "Excellent" },
    ],
    lifecycleStage: "Broadcasting",
  },
  "administration-management/audit-management": {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "Audit Trail Integrity", score: 97, sub: "Excellent" },
      { label: "Statutory Coverage", score: 94, sub: "Excellent" },
      { label: "Finding Resolution", score: 91, sub: "Excellent" },
      { label: "Chain of Custody", score: 95, sub: "Excellent" },
      { label: "AI Log Forensics", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Audit Ready",
  },

  // =========================================================================
  // 2. SALES MANAGEMENT
  // =========================================================================
  "sales-planning": {
    overallScore: 89,
    overallSub: "Very Good",
    scores: [
      { label: "Quota Feasibility", score: 90, sub: "Excellent" },
      { label: "Rep Capacity", score: 87, sub: "Very Good" },
      { label: "Seasonality Balance", score: 89, sub: "Very Good" },
      { label: "Territory Coverage", score: 88, sub: "Very Good" },
      { label: "AI Demand Plan", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Target Set",
  },
  "sales-forecasting": {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Weighted Pipeline", score: 93, sub: "Excellent" },
      { label: "Forecast Accuracy", score: 89, sub: "Very Good" },
      { label: "Deal Slippage Rate", score: 88, sub: "Very Good" },
      { label: "Win Probability", score: 91, sub: "Excellent" },
      { label: "AI Predictive Run", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Calibrated",
  },
  "sales-analytics": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Conversion Velocity", score: 90, sub: "Excellent" },
      { label: "CAC to LTV Health", score: 93, sub: "Excellent" },
      { label: "Win/Loss Intel", score: 89, sub: "Very Good" },
      { label: "Revenue Momentum", score: 92, sub: "Excellent" },
      { label: "AI Sales Insights", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Insightful",
  },
  "sales-orders": {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "Fulfillment Speed", score: 95, sub: "Excellent" },
      { label: "OTIF Delivery", score: 93, sub: "Excellent" },
      { label: "Order Accuracy", score: 97, sub: "Excellent" },
      { label: "Backlog Balance", score: 90, sub: "Excellent" },
      { label: "AI Order Router", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Order Execution",
  },
  pricing: {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "Margin Protection", score: 92, sub: "Excellent" },
      { label: "Price Elasticity", score: 88, sub: "Very Good" },
      { label: "Competitor Index", score: 90, sub: "Excellent" },
      { label: "Currency Hedging", score: 89, sub: "Very Good" },
      { label: "AI Dynamic Pricing", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Optimized",
  },
  discounts: {
    overallScore: 88,
    overallSub: "Very Good",
    scores: [
      { label: "Discount Cap Health", score: 89, sub: "Very Good" },
      { label: "Approval Velocity", score: 91, sub: "Excellent" },
      { label: "Margin Guard", score: 87, sub: "Very Good" },
      { label: "Policy Adherence", score: 90, sub: "Excellent" },
      { label: "AI Discount Engine", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Controlled",
  },
  contracts: {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "SLA Compliance", score: 95, sub: "Excellent" },
      { label: "Renewal Rate", score: 92, sub: "Excellent" },
      { label: "Risk Mitigation", score: 94, sub: "Excellent" },
      { label: "Milestone Billing", score: 91, sub: "Excellent" },
      { label: "AI Contract Guard", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Active Enforced",
  },
  "channel-partners": {
    overallScore: 89,
    overallSub: "Very Good",
    scores: [
      { label: "Partner Engagement", score: 91, sub: "Excellent" },
      { label: "Deal Registration", score: 88, sub: "Very Good" },
      { label: "Co-op Marketing", score: 86, sub: "Very Good" },
      { label: "Tier Attainment", score: 90, sub: "Excellent" },
      { label: "AI Partner Matrix", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Partner Growth",
  },
  "territory-management": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "Quota Distribution", score: 92, sub: "Excellent" },
      { label: "Account Density", score: 89, sub: "Very Good" },
      { label: "Rep Workload Balance", score: 88, sub: "Very Good" },
      { label: "Travel Efficiency", score: 91, sub: "Excellent" },
      { label: "AI Territory Mesh", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Balanced",
  },
  "sales-commission": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Calculation Precision", score: 98, sub: "Excellent" },
      { label: "Dispute Rate", score: 93, sub: "Excellent" },
      { label: "Payout Velocity", score: 91, sub: "Excellent" },
      { label: "Tier Attainment", score: 89, sub: "Very Good" },
      { label: "AI Commission Audit", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Calculated",
  },

  // =========================================================================
  // 3. CRM MANAGEMENT
  // =========================================================================
  "lead-management": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "Lead Quality Index", score: 91, sub: "Excellent" },
      { label: "Response Time SLA", score: 94, sub: "Excellent" },
      { label: "Qualification Speed", score: 88, sub: "Very Good" },
      { label: "Channel Yield", score: 89, sub: "Very Good" },
      { label: "AI Lead Scoring", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Nurturing",
  },
  "contact-management": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Data Enrichment", score: 93, sub: "Excellent" },
      { label: "Deliverability", score: 95, sub: "Excellent" },
      { label: "Touchpoint Recency", score: 90, sub: "Excellent" },
      { label: "Consent & GDPR", score: 94, sub: "Excellent" },
      { label: "AI Relationship Graph", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Engaged",
  },
  "account-management": {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Account Health", score: 93, sub: "Excellent" },
      { label: "Expansion Pipeline", score: 90, sub: "Excellent" },
      { label: "Stakeholder Coverage", score: 89, sub: "Very Good" },
      { label: "Churn Risk Guard", score: 92, sub: "Excellent" },
      { label: "AI Signal Monitor", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Tier-1 Active",
  },
  accounts: {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Account Health", score: 93, sub: "Excellent" },
      { label: "Expansion Pipeline", score: 90, sub: "Excellent" },
      { label: "Stakeholder Coverage", score: 89, sub: "Very Good" },
      { label: "Churn Risk Guard", score: 92, sub: "Excellent" },
      { label: "AI Signal Monitor", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Tier-1 Active",
  },
  "opportunity-management": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "Stage Progression", score: 91, sub: "Excellent" },
      { label: "Deal Velocity", score: 89, sub: "Very Good" },
      { label: "Decision Access", score: 90, sub: "Excellent" },
      { label: "Value Realization", score: 88, sub: "Very Good" },
      { label: "AI Win Predictor", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Negotiation",
  },
  "sales-pipeline-management": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Pipeline Coverage", score: 94, sub: "Excellent" },
      { label: "Stage Velocity", score: 90, sub: "Excellent" },
      { label: "Conversion Ratio", score: 91, sub: "Excellent" },
      { label: "Funnel Leakage Guard", score: 89, sub: "Very Good" },
      { label: "AI Pipeline Intel", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Healthy Funnel",
  },
  "quotations-management": {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "Turnaround SLA", score: 95, sub: "Excellent" },
      { label: "CPQ Accuracy", score: 96, sub: "Excellent" },
      { label: "Margin Approval", score: 91, sub: "Excellent" },
      { label: "Quote Acceptance", score: 90, sub: "Excellent" },
      { label: "AI Price Assist", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Approved",
  },
  "customer-orders-management": {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "Order Execution", score: 96, sub: "Excellent" },
      { label: "Backorder Guard", score: 92, sub: "Excellent" },
      { label: "Credit Verification", score: 94, sub: "Excellent" },
      { label: "EDI Transmission", score: 95, sub: "Excellent" },
      { label: "AI Order Sync", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Fulfillment",
  },
  "customer-support": {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "First Contact Res.", score: 92, sub: "Excellent" },
      { label: "CSAT Score", score: 94, sub: "Excellent" },
      { label: "Resolution Speed", score: 89, sub: "Very Good" },
      { label: "Agent Efficiency", score: 90, sub: "Excellent" },
      { label: "AI Ticket Copilot", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "High SLA",
  },
  "complaint-management": {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "Root Cause Speed", score: 94, sub: "Excellent" },
      { label: "SLA Adherence", score: 96, sub: "Excellent" },
      { label: "Recurrence Guard", score: 91, sub: "Excellent" },
      { label: "Customer Sign-off", score: 92, sub: "Excellent" },
      { label: "AI Sentiment Scan", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Resolved",
  },
  "customer-feedback": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "NPS Rating", score: 92, sub: "Excellent" },
      { label: "Response Rate", score: 88, sub: "Very Good" },
      { label: "Sentiment Index", score: 91, sub: "Excellent" },
      { label: "Closed-Loop Action", score: 89, sub: "Very Good" },
      { label: "AI Voice of Cust.", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Listening",
  },
  "customer-success": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Retention Rate", score: 95, sub: "Excellent" },
      { label: "Adoption Velocity", score: 91, sub: "Excellent" },
      { label: "QBR Cadence", score: 90, sub: "Excellent" },
      { label: "Expansion Health", score: 92, sub: "Excellent" },
      { label: "AI Churn Predictor", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Adopted",
  },
  "loyalty-management": {
    overallScore: 89,
    overallSub: "Very Good",
    scores: [
      { label: "Member Engagement", score: 91, sub: "Excellent" },
      { label: "Redemption Velocity", score: 88, sub: "Very Good" },
      { label: "Tier Upgrades", score: 87, sub: "Very Good" },
      { label: "Campaign ROI", score: 90, sub: "Excellent" },
      { label: "AI Loyalty Engine", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Rewarding",
  },

  // =========================================================================
  // 4. HRM MANAGEMENT
  // =========================================================================
  "workforce-planning": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "Capacity Headroom", score: 91, sub: "Excellent" },
      { label: "Skill Gap Ratio", score: 89, sub: "Very Good" },
      { label: "Attrition Forecast", score: 88, sub: "Very Good" },
      { label: "Cost Per Head", score: 90, sub: "Excellent" },
      { label: "AI Workforce Model", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Planned",
  },
  "recruitment-management": {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Time-to-Hire SLA", score: 90, sub: "Excellent" },
      { label: "Candidate CSAT", score: 93, sub: "Excellent" },
      { label: "Offer Acceptance", score: 92, sub: "Excellent" },
      { label: "Diversity Index", score: 89, sub: "Very Good" },
      { label: "AI Resume Match", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Sourcing",
  },
  "onboarding-management": {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "30-Day Completion", score: 95, sub: "Excellent" },
      { label: "Doc Verification", score: 96, sub: "Excellent" },
      { label: "Buddy Cadence", score: 91, sub: "Excellent" },
      { label: "Day-1 IT Setup", score: 94, sub: "Excellent" },
      { label: "AI Onboarding Flow", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Ramping Up",
  },
  "employee-management": {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "Profile Integrity", score: 97, sub: "Excellent" },
      { label: "Asset Mapping", score: 94, sub: "Excellent" },
      { label: "Policy Clearance", score: 95, sub: "Excellent" },
      { label: "Record Audit Rate", score: 93, sub: "Excellent" },
      { label: "AI Talent Profile", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Active",
  },
  "attendance-management": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Punctuality Rate", score: 94, sub: "Excellent" },
      { label: "Biometric Sync", score: 96, sub: "Excellent" },
      { label: "Shift Compliance", score: 90, sub: "Excellent" },
      { label: "Overtime Guard", score: 91, sub: "Excellent" },
      { label: "AI Roster Match", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Tracked",
  },
  "leave-management": {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "Request SLA", score: 96, sub: "Excellent" },
      { label: "Accrual Precision", score: 95, sub: "Excellent" },
      { label: "Shift Continuity", score: 91, sub: "Excellent" },
      { label: "Statutory Sync", score: 94, sub: "Excellent" },
      { label: "AI Leave Balance", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Approved",
  },
  "payroll-management": {
    overallScore: 97,
    overallSub: "Excellent",
    scores: [
      { label: "Calculation Accuracy", score: 99, sub: "Excellent" },
      { label: "Tax Withholding", score: 98, sub: "Excellent" },
      { label: "Payout Timeline", score: 97, sub: "Excellent" },
      { label: "Statutory Deductions", score: 96, sub: "Excellent" },
      { label: "AI Audit Engine", score: 96, sub: "Excellent" },
    ],
    lifecycleStage: "Disbursed",
  },
  "performance-management": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "Review Completion", score: 92, sub: "Excellent" },
      { label: "360 Feedback Sync", score: 89, sub: "Very Good" },
      { label: "Goal Alignment", score: 91, sub: "Excellent" },
      { label: "Bell Curve Balance", score: 88, sub: "Very Good" },
      { label: "AI KPI Evaluation", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Appraisal",
  },
  "learning-development": {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Training Hours SLA", score: 93, sub: "Excellent" },
      { label: "Assessment Pass", score: 94, sub: "Excellent" },
      { label: "Course Completion", score: 90, sub: "Excellent" },
      { label: "Skill Certification", score: 89, sub: "Very Good" },
      { label: "AI Course Curator", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Skilling",
  },
  "competency-form": {
    overallScore: 89,
    overallSub: "Very Good",
    scores: [
      { label: "Skill Matrix Score", score: 91, sub: "Excellent" },
      { label: "Role Fitment Index", score: 89, sub: "Very Good" },
      { label: "Training Gap SLA", score: 87, sub: "Very Good" },
      { label: "Peer Validation", score: 90, sub: "Excellent" },
      { label: "AI Skill Match", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Benchmarked",
  },
  "career-development": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "Succession Ready", score: 92, sub: "Excellent" },
      { label: "Promotion Velocity", score: 89, sub: "Very Good" },
      { label: "Internal Mobility", score: 90, sub: "Excellent" },
      { label: "Leadership Pipeline", score: 88, sub: "Very Good" },
      { label: "AI Career Pathway", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Ascending",
  },
  "travel-expense": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Policy Compliance", score: 94, sub: "Excellent" },
      { label: "Per Diem Precision", score: 93, sub: "Excellent" },
      { label: "Booking Efficiency", score: 91, sub: "Excellent" },
      { label: "Reimbursement SLA", score: 92, sub: "Excellent" },
      { label: "AI Travel Audit", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Reconciled",
  },
  "expense-claims": {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "Receipt Audit Rate", score: 96, sub: "Excellent" },
      { label: "Tax Compliance", score: 95, sub: "Excellent" },
      { label: "Turnaround Speed", score: 92, sub: "Excellent" },
      { label: "Duplicate Guard", score: 97, sub: "Excellent" },
      { label: "AI Fraud Shield", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Processed",
  },
  "employee-welfare": {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Benefit Utilization", score: 93, sub: "Excellent" },
      { label: "Health & Safety", score: 95, sub: "Excellent" },
      { label: "Ergonomics Score", score: 89, sub: "Very Good" },
      { label: "Grievance SLA", score: 92, sub: "Excellent" },
      { label: "AI Wellness Index", score: 90, sub: "Excellent" },
    ],
    lifecycleStage: "Engaged",
  },
  "exit-management": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Clearance Checklist", score: 96, sub: "Excellent" },
      { label: "Knowledge Handover", score: 91, sub: "Excellent" },
      { label: "Asset Recovery", score: 97, sub: "Excellent" },
      { label: "Interview Feedback", score: 90, sub: "Excellent" },
      { label: "AI Attrition Intel", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Offboarded",
  },
  "hr-analytics": {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "Telemetry Health", score: 95, sub: "Excellent" },
      { label: "Flight Risk Engine", score: 92, sub: "Excellent" },
      { label: "Compensation Ratio", score: 94, sub: "Excellent" },
      { label: "Diversity Matrix", score: 93, sub: "Excellent" },
      { label: "AI People Analytics", score: 96, sub: "Excellent" },
    ],
    lifecycleStage: "Strategic",
  },

  // =========================================================================
  // 5. FINANCE
  // =========================================================================
  payables: {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "3-Way Match Rate", score: 96, sub: "Excellent" },
      { label: "Discount Capture", score: 91, sub: "Excellent" },
      { label: "DPO Optimization", score: 92, sub: "Excellent" },
      { label: "Payment SLA", score: 95, sub: "Excellent" },
      { label: "AI Invoice OCR", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Scheduled",
  },
  receivables: {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "DSO Efficiency", score: 93, sub: "Excellent" },
      { label: "Collection Yield", score: 94, sub: "Excellent" },
      { label: "Aging Health", score: 90, sub: "Excellent" },
      { label: "Credit Risk Guard", score: 92, sub: "Excellent" },
      { label: "AI Collection Bot", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Collecting",
  },
  "finance/audit": {
    overallScore: 95,
    overallSub: "Excellent",
    scores: [
      { label: "Ledger Integrity", score: 98, sub: "Excellent" },
      { label: "Finding Resolution", score: 94, sub: "Excellent" },
      { label: "SOX / GAAP Standard", score: 96, sub: "Excellent" },
      { label: "Sampling Coverage", score: 93, sub: "Excellent" },
      { label: "AI Ledger Audit", score: 97, sub: "Excellent" },
    ],
    lifecycleStage: "Compliant",
  },
  budgeting: {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Variance Margin", score: 92, sub: "Excellent" },
      { label: "Capex Allocation", score: 90, sub: "Excellent" },
      { label: "Opex Discipline", score: 93, sub: "Excellent" },
      { label: "Burn Velocity", score: 89, sub: "Very Good" },
      { label: "AI Budget Model", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Approved FY26",
  },
  "cash-bank": {
    overallScore: 96,
    overallSub: "Excellent",
    scores: [
      { label: "Bank Reconciliation", score: 99, sub: "Excellent" },
      { label: "Liquidity Buffer", score: 96, sub: "Excellent" },
      { label: "FX Hedging Health", score: 94, sub: "Excellent" },
      { label: "Float Minimization", score: 95, sub: "Excellent" },
      { label: "AI Cash Forecast", score: 97, sub: "Excellent" },
    ],
    lifecycleStage: "Balanced",
  },
  consolidation: {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "Intercompany Trim", score: 97, sub: "Excellent" },
      { label: "FX Translation", score: 95, sub: "Excellent" },
      { label: "Closing Velocity", score: 93, sub: "Excellent" },
      { label: "Group Reporting", score: 96, sub: "Excellent" },
      { label: "AI Entity Sync", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Consolidated",
  },
  "cost-centers": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Overhead Absorption", score: 93, sub: "Excellent" },
      { label: "Activity-Based Cost", score: 91, sub: "Excellent" },
      { label: "Variance Analysis", score: 92, sub: "Excellent" },
      { label: "Budget Cap Health", score: 90, sub: "Excellent" },
      { label: "AI Cost Driver", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Monitored",
  },
  assets: {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "Asset Register Sync", score: 96, sub: "Excellent" },
      { label: "NBV Precision", score: 95, sub: "Excellent" },
      { label: "Depreciation Audit", score: 94, sub: "Excellent" },
      { label: "Physical Match", score: 92, sub: "Excellent" },
      { label: "AI Capital Engine", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Capitalized",
  },
  ledger: {
    overallScore: 97,
    overallSub: "Excellent",
    scores: [
      { label: "Trial Balance Sync", score: 99, sub: "Excellent" },
      { label: "Posting Accuracy", score: 98, sub: "Excellent" },
      { label: "Account Reconcile", score: 96, sub: "Excellent" },
      { label: "Closing Turnaround", score: 95, sub: "Excellent" },
      { label: "AI Journal Verifier", score: 97, sub: "Excellent" },
    ],
    lifecycleStage: "Balanced",
  },
  profitability: {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "Gross Margin Index", score: 94, sub: "Excellent" },
      { label: "EBITDA Margin", score: 92, sub: "Excellent" },
      { label: "Product Line Yield", score: 93, sub: "Excellent" },
      { label: "Customer Margin", score: 91, sub: "Excellent" },
      { label: "AI Profit Guard", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Accretive",
  },
  setup: {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "Integration Health", score: 96, sub: "Excellent" },
      { label: "API Gateway SLA", score: 95, sub: "Excellent" },
      { label: "COA Alignment", score: 97, sub: "Excellent" },
      { label: "Sandbox Security", score: 93, sub: "Excellent" },
      { label: "AI Setup Copilot", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Configured",
  },
  tax: {
    overallScore: 95,
    overallSub: "Excellent",
    scores: [
      { label: "GST / VAT Accuracy", score: 97, sub: "Excellent" },
      { label: "TDS Reconciliation", score: 96, sub: "Excellent" },
      { label: "Withholding Guard", score: 95, sub: "Excellent" },
      { label: "Filing Timeliness", score: 94, sub: "Excellent" },
      { label: "AI Tax Reconciler", score: 96, sub: "Excellent" },
    ],
    lifecycleStage: "Filing Ready",
  },

  // =========================================================================
  // 6. PROCUREMENT MANAGEMENT
  // =========================================================================
  "purchase-requisition": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Budget Pre-check", score: 95, sub: "Excellent" },
      { label: "Catalog Adherence", score: 93, sub: "Excellent" },
      { label: "Approval SLA", score: 91, sub: "Excellent" },
      { label: "Requisition Speed", score: 90, sub: "Excellent" },
      { label: "AI PR Optimizer", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "PR Approved",
  },
  "rfq-quotation": {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Vendor Bid Rate", score: 93, sub: "Excellent" },
      { label: "RFQ Turnaround", score: 90, sub: "Excellent" },
      { label: "Price Benchmark", score: 92, sub: "Excellent" },
      { label: "Specs Conformity", score: 89, sub: "Very Good" },
      { label: "AI Bid Evaluator", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Bidding",
  },
  "tender-management": {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "Evaluation Matrix", score: 95, sub: "Excellent" },
      { label: "Regulatory Gate", score: 96, sub: "Excellent" },
      { label: "Milestone Defense", score: 91, sub: "Excellent" },
      { label: "Technical Compliance", score: 94, sub: "Excellent" },
      { label: "AI Tender Scoring", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Published",
  },
  "vendor-quotation": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "Quote Completeness", score: 92, sub: "Excellent" },
      { label: "Cost Transparency", score: 91, sub: "Excellent" },
      { label: "Lead Time SLA", score: 89, sub: "Very Good" },
      { label: "Payment Term Fit", score: 88, sub: "Very Good" },
      { label: "AI Price Parser", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Under Review",
  },
  "vendor-comparison": {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "TCO Scorecard", score: 96, sub: "Excellent" },
      { label: "Delivery Guarantee", score: 93, sub: "Excellent" },
      { label: "Quality Reliability", score: 94, sub: "Excellent" },
      { label: "Commercial Terms", score: 92, sub: "Excellent" },
      { label: "AI Best-Value Match", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Evaluated",
  },
  "purchase-order": {
    overallScore: 95,
    overallSub: "Excellent",
    scores: [
      { label: "PO Accuracy", score: 98, sub: "Excellent" },
      { label: "Line Item Delivery", score: 94, sub: "Excellent" },
      { label: "Vendor Confirmation", score: 96, sub: "Excellent" },
      { label: "Terms Governance", score: 93, sub: "Excellent" },
      { label: "AI PO Dispatch", score: 96, sub: "Excellent" },
    ],
    lifecycleStage: "PO Released",
  },
  "goods-receipt": {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "Dock Inspection", score: 96, sub: "Excellent" },
      { label: "Quantity Match", score: 97, sub: "Excellent" },
      { label: "Packing Slip Audit", score: 95, sub: "Excellent" },
      { label: "Quarantine Control", score: 92, sub: "Excellent" },
      { label: "AI GRN Scanner", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Inspected",
  },
  "invoice-verification": {
    overallScore: 96,
    overallSub: "Excellent",
    scores: [
      { label: "3-Way Match Audit", score: 98, sub: "Excellent" },
      { label: "Price Variance Cap", score: 96, sub: "Excellent" },
      { label: "Tax Calculation", score: 95, sub: "Excellent" },
      { label: "Processing Speed", score: 94, sub: "Excellent" },
      { label: "AI Invoice Match", score: 97, sub: "Excellent" },
    ],
    lifecycleStage: "3-Way Match",
  },
  "vendor-payment": {
    overallScore: 95,
    overallSub: "Excellent",
    scores: [
      { label: "Payment Run Accuracy", score: 98, sub: "Excellent" },
      { label: "Early Cash Discount", score: 93, sub: "Excellent" },
      { label: "Bank Advice SLA", score: 96, sub: "Excellent" },
      { label: "Remittance Speed", score: 94, sub: "Excellent" },
      { label: "AI Fraud Prevention", score: 96, sub: "Excellent" },
    ],
    lifecycleStage: "Scheduled",
  },
  "contract-management": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "MSA Health Index", score: 94, sub: "Excellent" },
      { label: "SLA Monitoring", score: 92, sub: "Excellent" },
      { label: "Penalty Guard", score: 90, sub: "Excellent" },
      { label: "Renewal Window", score: 91, sub: "Excellent" },
      { label: "AI Clause Analysis", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Active",
  },
  "vendor-evaluation": {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Vendor Scorecard", score: 93, sub: "Excellent" },
      { label: "Defect Rate PPM", score: 92, sub: "Excellent" },
      { label: "On-Time Delivery", score: 90, sub: "Excellent" },
      { label: "ESG / CSR Rating", score: 89, sub: "Very Good" },
      { label: "AI Vendor Scoring", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Graded",
  },
  "supplier-portal": {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "Vendor Adoption", score: 95, sub: "Excellent" },
      { label: "Self-Service Ack", score: 94, sub: "Excellent" },
      { label: "ASN Sync Speed", score: 92, sub: "Excellent" },
      { label: "Digital Invoicing", score: 93, sub: "Excellent" },
      { label: "AI Portal Bot", score: 91, sub: "Excellent" },
    ],
    lifecycleStage: "Collaborating",
  },

  // =========================================================================
  // 7. PROJECT MANAGEMENT
  // =========================================================================
  "project-planning": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Schedule Baseline", score: 93, sub: "Excellent" },
      { label: "Critical Path Guard", score: 90, sub: "Excellent" },
      { label: "Resource Loading", score: 91, sub: "Excellent" },
      { label: "Scope Breakdown", score: 94, sub: "Excellent" },
      { label: "AI Gantt Engine", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Baseline Set",
  },
  wbs: {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "Package Granularity", score: 96, sub: "Excellent" },
      { label: "Deliverable Match", score: 95, sub: "Excellent" },
      { label: "Hierarchy Depth", score: 97, sub: "Excellent" },
      { label: "Milestone Mapping", score: 93, sub: "Excellent" },
      { label: "AI WBS Builder", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Decomposed",
  },
  milestones: {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Milestone Velocity", score: 93, sub: "Excellent" },
      { label: "Gate Review Signoff", score: 92, sub: "Excellent" },
      { label: "Dependency Buffer", score: 89, sub: "Very Good" },
      { label: "Timeline Accuracy", score: 90, sub: "Excellent" },
      { label: "AI Gate Guard", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "On Track",
  },
  "task-management": {
    overallScore: 90,
    overallSub: "Excellent",
    scores: [
      { label: "Sprint Velocity", score: 92, sub: "Excellent" },
      { label: "Burndown Rate", score: 89, sub: "Very Good" },
      { label: "Task SLA Delivery", score: 91, sub: "Excellent" },
      { label: "Backlog Health", score: 88, sub: "Very Good" },
      { label: "AI Task Dispatch", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "In Execution",
  },
  "time-tracking": {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "Timesheet Logging", score: 96, sub: "Excellent" },
      { label: "Billable Ratio", score: 94, sub: "Excellent" },
      { label: "Overtime Control", score: 91, sub: "Excellent" },
      { label: "Activity Coding", score: 92, sub: "Excellent" },
      { label: "AI Timesheet Audit", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Logged",
  },
  "resource-allocation": {
    overallScore: 89,
    overallSub: "Very Good",
    scores: [
      { label: "Headcount Yield", score: 91, sub: "Excellent" },
      { label: "Skill Allocation", score: 88, sub: "Very Good" },
      { label: "Burnout Protection", score: 90, sub: "Excellent" },
      { label: "Bench Cost Margin", score: 87, sub: "Very Good" },
      { label: "AI Capacity Solver", score: 92, sub: "Excellent" },
    ],
    lifecycleStage: "Balanced",
  },
  "budget-control": {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "EVM Index (CPI/SPI)", score: 95, sub: "Excellent" },
      { label: "Cost Variance Cap", score: 94, sub: "Excellent" },
      { label: "Contingency Buffer", score: 92, sub: "Excellent" },
      { label: "Commitment Track", score: 91, sub: "Excellent" },
      { label: "AI Cost Forecaster", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Within Budget",
  },
  "risk-management": {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Risk Mitigation SLA", score: 93, sub: "Excellent" },
      { label: "Threat Matrix Score", score: 91, sub: "Excellent" },
      { label: "Residual Risk Guard", score: 90, sub: "Excellent" },
      { label: "Contingency Plan", score: 89, sub: "Very Good" },
      { label: "AI Risk Radar", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Mitigated",
  },
  "issue-management": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Resolution Velocity", score: 94, sub: "Excellent" },
      { label: "Severity Index", score: 93, sub: "Excellent" },
      { label: "Escalation Control", score: 91, sub: "Excellent" },
      { label: "Root Cause Log", score: 90, sub: "Excellent" },
      { label: "AI Issue Triage", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Contained",
  },
  "project-billing": {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "Milestone Billing", score: 96, sub: "Excellent" },
      { label: "WIP Realization", score: 94, sub: "Excellent" },
      { label: "Retention Recovery", score: 93, sub: "Excellent" },
      { label: "Invoice Accuracy", score: 92, sub: "Excellent" },
      { label: "AI Revenue Gate", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Invoiced",
  },
  "project-analytics": {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "Portfolio Health", score: 94, sub: "Excellent" },
      { label: "Velocity Tracking", score: 93, sub: "Excellent" },
      { label: "EVM Analytics", score: 95, sub: "Excellent" },
      { label: "Margin Delivery", score: 92, sub: "Excellent" },
      { label: "AI Project Engine", score: 96, sub: "Excellent" },
    ],
    lifecycleStage: "Insightful",
  },

  // =========================================================================
  // 8. ASSET MANAGEMENT
  // =========================================================================
  "fixed-assets": {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "Asset Tagging Rate", score: 98, sub: "Excellent" },
      { label: "NBV Precision", score: 96, sub: "Excellent" },
      { label: "Custodian Mapping", score: 94, sub: "Excellent" },
      { label: "Audit Verification", score: 93, sub: "Excellent" },
      { label: "AI Valuation Model", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Capitalized",
  },
  equipment: {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "Machine OEE Score", score: 95, sub: "Excellent" },
      { label: "Uptime SLA", score: 96, sub: "Excellent" },
      { label: "Operating Hours", score: 92, sub: "Excellent" },
      { label: "Telemetry Health", score: 91, sub: "Excellent" },
      { label: "AI Diagnostics", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Operational",
  },
  "tool-management": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "Crib Check-in/out", score: 95, sub: "Excellent" },
      { label: "Tool Wear Margin", score: 90, sub: "Excellent" },
      { label: "RFID Locating", score: 94, sub: "Excellent" },
      { label: "Regrinding Cycles", score: 89, sub: "Very Good" },
      { label: "AI Tool Life Model", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Controlled",
  },
  "asset-management/calibration": {
    overallScore: 96,
    overallSub: "Excellent",
    scores: [
      { label: "Calibration On-Time", score: 98, sub: "Excellent" },
      { label: "NABL Traceability", score: 97, sub: "Excellent" },
      { label: "Certificate Validity", score: 99, sub: "Excellent" },
      { label: "Out-of-Spec SLA", score: 94, sub: "Excellent" },
      { label: "AI Drift Detection", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Calibrated",
  },
  calibration: {
    overallScore: 96,
    overallSub: "Excellent",
    scores: [
      { label: "Calibration On-Time", score: 98, sub: "Excellent" },
      { label: "NABL Traceability", score: 97, sub: "Excellent" },
      { label: "Certificate Validity", score: 99, sub: "Excellent" },
      { label: "Out-of-Spec SLA", score: 94, sub: "Excellent" },
      { label: "AI Drift Detection", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Calibrated",
  },
  maintenance: {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "MTBF / MTTR Index", score: 92, sub: "Excellent" },
      { label: "Work Order SLA", score: 93, sub: "Excellent" },
      { label: "Spare Part Health", score: 89, sub: "Very Good" },
      { label: "Safety Clearance", score: 95, sub: "Excellent" },
      { label: "AI Priority Engine", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Maintained",
  },
  "preventive-maintenance": {
    overallScore: 95,
    overallSub: "Excellent",
    scores: [
      { label: "Schedule Adherence", score: 97, sub: "Excellent" },
      { label: "Checklist Rigor", score: 96, sub: "Excellent" },
      { label: "Lubrication Routine", score: 95, sub: "Excellent" },
      { label: "Downtime Prevented", score: 94, sub: "Excellent" },
      { label: "AI PM Optimizer", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "PM Scheduled",
  },
  "predictive-maintenance": {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "Vibration Health", score: 94, sub: "Excellent" },
      { label: "Thermal Spectrum", score: 95, sub: "Excellent" },
      { label: "Oil Degradation", score: 91, sub: "Excellent" },
      { label: "Pre-Warning Lead", score: 93, sub: "Excellent" },
      { label: "AI Predictive Motor", score: 96, sub: "Excellent" },
    ],
    lifecycleStage: "IoT Connected",
  },
  "asset-lifecycle": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "TCO Assessment", score: 94, sub: "Excellent" },
      { label: "Useful Life Ratio", score: 93, sub: "Excellent" },
      { label: "Overhaul Strategy", score: 91, sub: "Excellent" },
      { label: "Disposal Readiness", score: 89, sub: "Very Good" },
      { label: "AI Life Extension", score: 94, sub: "Excellent" },
    ],
    lifecycleStage: "Full Lifecycle",
  },
  "asset-depreciation": {
    overallScore: 97,
    overallSub: "Excellent",
    scores: [
      { label: "SLM / WDV Precision", score: 99, sub: "Excellent" },
      { label: "Tax vs Book Sync", score: 98, sub: "Excellent" },
      { label: "GL Posting Schedule", score: 97, sub: "Excellent" },
      { label: "Residual Value Cap", score: 96, sub: "Excellent" },
      { label: "AI Ledger Posting", score: 97, sub: "Excellent" },
    ],
    lifecycleStage: "Booked",
  },
  "asset-tracking": {
    overallScore: 95,
    overallSub: "Excellent",
    scores: [
      { label: "BLE / RFID Sync", score: 97, sub: "Excellent" },
      { label: "Movement Audit", score: 96, sub: "Excellent" },
      { label: "Location Accuracy", score: 98, sub: "Excellent" },
      { label: "Ghost Asset Guard", score: 95, sub: "Excellent" },
      { label: "AI Sensor Sync", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Tracked",
  },

  // =========================================================================
  // 9. QUALITY MANAGEMENT
  // =========================================================================
  "quality-planning": {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "Control Plan Rigor", score: 96, sub: "Excellent" },
      { label: "FMEA Severity Guard", score: 94, sub: "Excellent" },
      { label: "Key Characteristics", score: 95, sub: "Excellent" },
      { label: "Process Capability", score: 93, sub: "Excellent" },
      { label: "AI Blueprint QA", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "APQP Level 3",
  },
  "incoming-inspection": {
    overallScore: 95,
    overallSub: "Excellent",
    scores: [
      { label: "AQL Acceptance", score: 97, sub: "Excellent" },
      { label: "Supplier Lot Grade", score: 96, sub: "Excellent" },
      { label: "Turnaround Speed", score: 94, sub: "Excellent" },
      { label: "Quarantine Protocol", score: 95, sub: "Excellent" },
      { label: "AI Defect Scanner", score: 96, sub: "Excellent" },
    ],
    lifecycleStage: "IQC Cleared",
  },
  "in-process-inspection": {
    overallScore: 96,
    overallSub: "Excellent",
    scores: [
      { label: "First Pass Yield", score: 98, sub: "Excellent" },
      { label: "SPC Run Rules", score: 96, sub: "Excellent" },
      { label: "Operator Self-Check", score: 95, sub: "Excellent" },
      { label: "Cpk / Ppk Health", score: 97, sub: "Excellent" },
      { label: "AI Vision Inspection", score: 97, sub: "Excellent" },
    ],
    lifecycleStage: "Zero Defects",
  },
  "final-inspection": {
    overallScore: 97,
    overallSub: "Excellent",
    scores: [
      { label: "Outgoing PPM Rate", score: 99, sub: "Excellent" },
      { label: "COC Certification", score: 98, sub: "Excellent" },
      { label: "Packing Verification", score: 97, sub: "Excellent" },
      { label: "Pre-Shipment Audit", score: 96, sub: "Excellent" },
      { label: "AI Outgoing Gate", score: 97, sub: "Excellent" },
    ],
    lifecycleStage: "FQC Released",
  },
  "ncr-management": {
    overallScore: 91,
    overallSub: "Excellent",
    scores: [
      { label: "Containment SLA", score: 94, sub: "Excellent" },
      { label: "Disposition Velocity", score: 92, sub: "Excellent" },
      { label: "Scrap & Rework Cost", score: 89, sub: "Very Good" },
      { label: "Tagging Discipline", score: 95, sub: "Excellent" },
      { label: "AI Cause Classifier", score: 93, sub: "Excellent" },
    ],
    lifecycleStage: "Quarantined",
  },
  capa: {
    overallScore: 93,
    overallSub: "Excellent",
    scores: [
      { label: "8D Discipline Rate", score: 95, sub: "Excellent" },
      { label: "Recurrence Guard", score: 94, sub: "Excellent" },
      { label: "Verification SLA", score: 92, sub: "Excellent" },
      { label: "Action Timeliness", score: 93, sub: "Excellent" },
      { label: "AI CAPA Validator", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "8D Verified",
  },
  "root-cause-analysis": {
    overallScore: 92,
    overallSub: "Excellent",
    scores: [
      { label: "5-Why Depth Index", score: 94, sub: "Excellent" },
      { label: "Fishbone Diagram", score: 93, sub: "Excellent" },
      { label: "Fault Tree Analysis", score: 91, sub: "Excellent" },
      { label: "Empirical Evidence", score: 92, sub: "Excellent" },
      { label: "AI RCA Hypothesis", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Investigated",
  },
  "quality-management/audit-management": {
    overallScore: 95,
    overallSub: "Excellent",
    scores: [
      { label: "IATF / ISO Audit", score: 98, sub: "Excellent" },
      { label: "Internal Audit Plan", score: 96, sub: "Excellent" },
      { label: "Checklist Rigor", score: 94, sub: "Excellent" },
      { label: "Non-conformance SLA", score: 93, sub: "Excellent" },
      { label: "AI Audit Copilot", score: 95, sub: "Excellent" },
    ],
    lifecycleStage: "Certified",
  },
  "quality-management/compliance": {
    overallScore: 96,
    overallSub: "Excellent",
    scores: [
      { label: "Regulatory Register", score: 98, sub: "Excellent" },
      { label: "REACH & RoHS Sync", score: 97, sub: "Excellent" },
      { label: "Statutory Filings", score: 96, sub: "Excellent" },
      { label: "Safety Standard Gate", score: 95, sub: "Excellent" },
      { label: "AI Compliance Shield", score: 96, sub: "Excellent" },
    ],
    lifecycleStage: "Compliant",
  },
  compliance: {
    overallScore: 96,
    overallSub: "Excellent",
    scores: [
      { label: "Regulatory Register", score: 98, sub: "Excellent" },
      { label: "REACH & RoHS Sync", score: 97, sub: "Excellent" },
      { label: "Statutory Filings", score: 96, sub: "Excellent" },
      { label: "Safety Standard Gate", score: 95, sub: "Excellent" },
      { label: "AI Compliance Shield", score: 96, sub: "Excellent" },
    ],
    lifecycleStage: "Compliant",
  },
  "quality-analytics": {
    overallScore: 94,
    overallSub: "Excellent",
    scores: [
      { label: "Pareto Analysis", score: 95, sub: "Excellent" },
      { label: "Six Sigma Sigma-Lvl", score: 94, sub: "Excellent" },
      { label: "COPQ Heatmap", score: 93, sub: "Excellent" },
      { label: "Yield Trend Accuracy", score: 95, sub: "Excellent" },
      { label: "AI Quality Pulse", score: 96, sub: "Excellent" },
    ],
    lifecycleStage: "Monitored",
  },
};

/**
 * Intelligent helper to resolve submodule metrics for any route key.
 * If not explicitly registered, generates domain-tailored ERP scores from the key.
 */
export function getSubmoduleScoreMetrics(key?: string): ModuleMetrics {
  if (!key) return PRODUCT_SUBMODULE_METRICS["product-strategy"];

  // Normalize key: remove leading/trailing slashes, replace dots, strip trailing .new or /new
  const cleanKey = key
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.new$|\/new$/, "")
    .replace(/^management\//, "");

  // 1. Direct match
  if (PRODUCT_SUBMODULE_METRICS[cleanKey]) {
    return PRODUCT_SUBMODULE_METRICS[cleanKey];
  }

  // 2. Last segment match (e.g. "finance/tax" -> "tax")
  const lastSegment = cleanKey.split(/[\/\.]/).pop() || cleanKey;
  if (PRODUCT_SUBMODULE_METRICS[lastSegment]) {
    return PRODUCT_SUBMODULE_METRICS[lastSegment];
  }

  // 3. Fallback: Generate intelligent ERP metrics based on the title
  const formattedTitle = lastSegment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const hash = Array.from(lastSegment).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const base = 88 + (hash % 7); // 88 - 94

  return {
    overallScore: base,
    overallSub: base >= 90 ? "Excellent" : "Very Good",
    scores: [
      { label: `${formattedTitle} SLA`, score: Math.min(97, base + 2), sub: "Excellent" },
      { label: "Process Quality", score: Math.min(96, base + 1), sub: "Excellent" },
      { label: "Compliance Index", score: Math.max(86, base - 2), sub: "Very Good" },
      { label: "Throughput Rate", score: Math.min(95, base + 3), sub: "Excellent" },
      { label: "AI Automation", score: Math.min(96, base + 2), sub: "Excellent" },
    ],
    lifecycleStage: base >= 92 ? "Optimized" : "Operational",
  };
}

export const SUBMODULE_SCORE_METRICS = PRODUCT_SUBMODULE_METRICS;

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
  const fallback = getSubmoduleScoreMetrics(submoduleKey);

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

// Aliases for clear semantic usage across modules
export const ModuleScoreBanner = ProductScoreBanner;
export const ScoreBanner = ProductScoreBanner;

