import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  FileText,
  Send,
  CheckCircle2,
  Activity,
  Shield,
  Cloud,
  Sparkles,
  LayoutGrid,
  Code2,
  Cpu,
  GitBranch,
  Wrench,
  Cog,
  Binary,
  Building,
  TrendingUp,
  BookOpen,
  FileCheck2,
  Boxes,
  Route as RouteIcon,
  ShieldAlert,
  ClipboardList,
  Zap,
  Factory,
  Search,
  Plus,
  ArrowRight,
  ExternalLink,
  Layers,
  ChevronRight,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface ResearchInnovationSubmodule {
  id: string;
  name: string;
  shortLabel: string;
  category:
    | "Governance & Release"
    | "Verification & Validation"
    | "Software & Digital"
    | "Industrialization & Tooling"
    | "Operations & Standards"
    | "Quality & Process Excellence";
  description: string;
  route: string;
  newRoute: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  score: number;
  scoreLabel: string;
  activeCount: number;
  statusBadge: string;
  leadProject: string;
  standards: string[];
}

export const RESEARCH_INNOVATION_SUBMODULES: ResearchInnovationSubmodule[] = [
  // Governance & Release
  {
    id: "certification-readiness",
    name: "Certification Readiness",
    shortLabel: "Certification",
    category: "Governance & Release",
    description: "Evaluate product certification readiness, statutory safety directives, gap analysis, and laboratory approvals.",
    route: "/development/research-innovation/certification-readiness/new",
    newRoute: "/development/research-innovation/certification-readiness/new",
    icon: Award,
    color: "#0284c7",
    score: 88,
    scoreLabel: "Readiness",
    activeCount: 6,
    statusBadge: "TÜV Scheduled",
    leadProject: "Smart EV Charger AC 7kW",
    standards: ["IEC 61851-1", "IEC 62196-2", "BIS 17017", "FCC Part 15B"],
  },
  {
    id: "product-documentation",
    name: "Product Documentation",
    shortLabel: "Documentation",
    category: "Governance & Release",
    description: "Collect, version, review, and release multi-stream engineering, manufacturing, quality, and user documentation.",
    route: "/development/research-innovation/product-documentation/new",
    newRoute: "/development/research-innovation/product-documentation/new",
    icon: FileText,
    color: "#0A3C75",
    score: 92,
    scoreLabel: "Completeness",
    activeCount: 9,
    statusBadge: "Board Review",
    leadProject: "Smart EV Charger AC 7kW",
    standards: ["ISO 9001", "EU Machinery", "CE Technical Dossier"],
  },
  {
    id: "product-release-management",
    name: "Product Release Management",
    shortLabel: "Release",
    category: "Governance & Release",
    description: "Multi-disciplinary commercialization gate verifying engineering, supply chain, and quality readiness.",
    route: "/development/research-innovation/product-release-management/new",
    newRoute: "/development/research-innovation/product-release-management/new",
    icon: Send,
    color: "#059669",
    score: 94,
    scoreLabel: "Gate Score",
    activeCount: 4,
    statusBadge: "Gate 3 Approved",
    leadProject: "Smart EV Charger AC 7kW",
    standards: ["Stage-Gate", "APQP Phase 4", "PPAP Level 3"],
  },

  // Verification & Validation
  {
    id: "testing-validation",
    name: "Testing & Validation",
    shortLabel: "Testing",
    category: "Verification & Validation",
    description: "Manage end-to-end prototype verification, high voltage safety, dielectric, thermal, and endurance test protocols.",
    route: "/development/research-innovation/testing-validation/new",
    newRoute: "/development/research-innovation/testing-validation/new",
    icon: CheckCircle2,
    color: "#16a34a",
    score: 91,
    scoreLabel: "Validation",
    activeCount: 18,
    statusBadge: "142 Tests Pass",
    leadProject: "Smart EV Charger AC 7kW",
    standards: ["IEC 61851", "IEC 60529 (IP65)", "ISO 16750"],
  },
  {
    id: "simulation-analysis",
    name: "Simulation & CAE Analysis",
    shortLabel: "Simulation",
    category: "Verification & Validation",
    description: "Execute multi-physics FEA structural stress, CFD thermal airflow, electromagnetic mesh, and digital twin correlation.",
    route: "/development/research-innovation/simulation-analysis/new",
    newRoute: "/development/research-innovation/simulation-analysis/new",
    icon: Activity,
    color: "#0A3C75",
    score: 91,
    scoreLabel: "FEA/CFD Match",
    activeCount: 11,
    statusBadge: "GPU Accelerated",
    leadProject: "Autonomous W-EVSE",
    standards: ["Ansys Fluent", "Altair OptiStruct", "ASME B31.3"],
  },
  {
    id: "cybersecurity-engineering",
    name: "Cybersecurity Engineering",
    shortLabel: "Cybersecurity",
    category: "Verification & Validation",
    description: "Govern secure-by-design threat modeling, Zero Trust architecture, cryptographic HSM, and SIEM monitoring.",
    route: "/development/research-innovation/cybersecurity-engineering/new",
    newRoute: "/development/research-innovation/cybersecurity-engineering/new",
    icon: Shield,
    color: "#dc2626",
    score: 91,
    scoreLabel: "ASVS L2",
    activeCount: 7,
    statusBadge: "Zero Trust Active",
    leadProject: "Smart EV Charging Platform",
    standards: ["ISO/SAE 21434", "STRIDE", "OWASP ASVS L2"],
  },

  // Software & Digital
  {
    id: "cloud-platform-development",
    name: "Cloud Platform Development",
    shortLabel: "Cloud Platform",
    category: "Software & Digital",
    description: "Architect, provision, secure, monitor, and scale microservices, IoT telemetry ingestion, and multi-tenant backends.",
    route: "/development/research-innovation/cloud-platform-development/new",
    newRoute: "/development/research-innovation/cloud-platform-development/new",
    icon: Cloud,
    color: "#2563eb",
    score: 94,
    scoreLabel: "Cloud Health",
    activeCount: 15,
    statusBadge: "99.99% Uptime",
    leadProject: "EV Fleet Telemetry Platform",
    standards: ["AWS Well-Architected", "Kubernetes", "SOC 2 Type II"],
  },
  {
    id: "ai-model-development",
    name: "AI Model Development",
    shortLabel: "AI Model",
    category: "Software & Digital",
    description: "Develop, benchmark, quantize, and deploy neural network models for edge inference and predictive thermal maintenance.",
    route: "/development/research-innovation/ai-model-development/new",
    newRoute: "/development/research-innovation/ai-model-development/new",
    icon: Sparkles,
    color: "#0A3C75",
    score: 92,
    scoreLabel: "Inference Acc",
    activeCount: 8,
    statusBadge: "v1.4.2 Deployed",
    leadProject: "Predictive Battery Health AI",
    standards: ["ONNX Runtime", "MLflow", "TensorRT"],
  },
  {
    id: "ui-ux-development",
    name: "UI/UX Development",
    shortLabel: "UI/UX",
    category: "Software & Digital",
    description: "Design, prototype, and hand off responsive charger HMI interfaces, mobile companion apps, and verified design tokens.",
    route: "/development/research-innovation/ui-ux-development/new",
    newRoute: "/development/research-innovation/ui-ux-development/new",
    icon: LayoutGrid,
    color: "#ea580c",
    score: 93,
    scoreLabel: "WCAG 2.1 AA",
    activeCount: 12,
    statusBadge: "Design Tokens v2.0",
    leadProject: "EVSE Touch HMI & Mobile App",
    standards: ["WCAG 2.1 AA", "ISO 9241-11", "Design System"],
  },
  {
    id: "api-development",
    name: "API Development",
    shortLabel: "API",
    category: "Software & Digital",
    description: "Design, secure, test, deploy, and monitor enterprise REST, GraphQL, and gRPC APIs for charge point operations.",
    route: "/development/research-innovation/api-development/new",
    newRoute: "/development/research-innovation/api-development/new",
    icon: Code2,
    color: "#0891b2",
    score: 95,
    scoreLabel: "Latency < 45ms",
    activeCount: 22,
    statusBadge: "OCPP 2.0.1 Live",
    leadProject: "OCPP CPO Gateway API",
    standards: ["OpenAPI 3.0", "OCPP 2.0.1", "OAuth 2.0 / mTLS"],
  },

  // Industrialization & Tooling
  {
    id: "production-engineering",
    name: "Production Engineering",
    shortLabel: "Production Eng",
    category: "Industrialization & Tooling",
    description: "Govern mass production process flows, takt times, workstation allocation, pilot runs, and line balancing.",
    route: "/development/research-innovation/production-engineering/new",
    newRoute: "/development/research-innovation/production-engineering/new",
    icon: Cpu,
    color: "#2563eb",
    score: 92,
    scoreLabel: "OEE 85% Target",
    activeCount: 14,
    statusBadge: "Takt Balanced",
    leadProject: "EV Charger Assembly Line",
    standards: ["VDA 6.3", "Lean 5S", "SMED"],
  },
  {
    id: "assembly-line-development",
    name: "Assembly Line Development",
    shortLabel: "Assembly Line",
    category: "Industrialization & Tooling",
    description: "Govern assembly line layout design, workstations, takt time balancing, automation level, and OEE targets.",
    route: "/development/research-innovation/assembly-line-development/new",
    newRoute: "/development/research-innovation/assembly-line-development/new",
    icon: GitBranch,
    color: "#0d9488",
    score: 90,
    scoreLabel: "Line Balance",
    activeCount: 9,
    statusBadge: "14 Stations Active",
    leadProject: "Automated AC 7kW Cell",
    standards: ["ISO 11228", "Poka-Yoke", "Industry 4.0 AGV"],
  },
  {
    id: "fixture-development",
    name: "Fixture Development",
    shortLabel: "Fixture Dev",
    category: "Industrialization & Tooling",
    description: "Govern fixture drawings, locator design, clamp designs, safety inspections, commissioning logs, and wear tracking.",
    route: "/development/research-innovation/fixture-development/new",
    newRoute: "/development/research-innovation/fixture-development/new",
    icon: Wrench,
    color: "#ca8a04",
    score: 89,
    scoreLabel: "Repeatability",
    activeCount: 7,
    statusBadge: "Commissioned",
    leadProject: "Enclosure Robotic Fixture",
    standards: ["ASME Y14.5", "ISO 2768-mK", "Pneumatic Safety"],
  },
  {
    id: "tooling-development",
    name: "Tooling Development",
    shortLabel: "Tooling Dev",
    category: "Industrialization & Tooling",
    description: "High-pressure die casting tooling, injection molds, progressive stamping dies, hardening specs, and maintenance.",
    route: "/development/research-innovation/tooling-development/new",
    newRoute: "/development/research-innovation/tooling-development/new",
    icon: Cog,
    color: "#4b5563",
    score: 87,
    scoreLabel: "Die Integrity",
    activeCount: 10,
    statusBadge: "Tool Life 250k",
    leadProject: "Housing HPDC Tooling",
    standards: ["NADCA #207", "DIN 16750", "H13 Tool Steel"],
  },
  {
    id: "jig-development",
    name: "Jig Development",
    shortLabel: "Jig Dev",
    category: "Industrialization & Tooling",
    description: "Dedicated wire harness dressing boards, solder inspection fixtures, error-proofing guides, and terminal insertion jigs.",
    route: "/development/research-innovation/jig-development/new",
    newRoute: "/development/research-innovation/jig-development/new",
    icon: Binary,
    color: "#65a30d",
    score: 91,
    scoreLabel: "Accuracy",
    activeCount: 8,
    statusBadge: "Poka-Yoke Pass",
    leadProject: "HV Wire Routing Jig",
    standards: ["IPC/WHMA-A-620", "Poka-Yoke Level 3"],
  },
  {
    id: "factory-layout-design",
    name: "Factory Layout Design",
    shortLabel: "Factory Layout",
    category: "Industrialization & Tooling",
    description: "2D/3D plant layout design, material flow optimization, AGV transport corridors, Kanban supermarkets, and egress safety.",
    route: "/development/research-innovation/factory-layout-design/new",
    newRoute: "/development/research-innovation/factory-layout-design/new",
    icon: Building,
    color: "#475569",
    score: 89,
    scoreLabel: "Space Efficiency",
    activeCount: 5,
    statusBadge: "Lean Flow 1800m²",
    leadProject: "Plant 2 EV Expansion Hall",
    standards: ["OSHA 1910", "ISO 14122", "Lean Spaghetti Flow"],
  },

  // Operations & Standards
  {
    id: "capacity-planning",
    name: "Capacity Planning",
    shortLabel: "Capacity Plan",
    category: "Operations & Standards",
    description: "Multi-shift machine capacity modeling, bottleneck identification, scrap rate compensation, and headcount scheduling.",
    route: "/development/research-innovation/capacity-planning/new",
    newRoute: "/development/research-innovation/capacity-planning/new",
    icon: TrendingUp,
    color: "#0284c7",
    score: 88,
    scoreLabel: "Utilization",
    activeCount: 6,
    statusBadge: "5,000 Units/Mo",
    leadProject: "Q3/Q4 Production Ramp",
    standards: ["APICS CPIM", "TOC Theory of Constraints"],
  },
  {
    id: "work-instruction-development",
    name: "Work Instruction Development",
    shortLabel: "Work Instruction",
    category: "Operations & Standards",
    description: "Station-by-station visual work instructions, torque specifications, safety alerts, and step-by-step operator guides.",
    route: "/development/research-innovation/work-instruction-development/new",
    newRoute: "/development/research-innovation/work-instruction-development/new",
    icon: BookOpen,
    color: "#059669",
    score: 94,
    scoreLabel: "Compliance",
    activeCount: 26,
    statusBadge: "Visual 3D Standard",
    leadProject: "PCBA Inverter Work Instructions",
    standards: ["ISO 9001:2015", "TWI Job Instruction", "ESD Safe"],
  },
  {
    id: "sop-development",
    name: "SOP Development",
    shortLabel: "SOP Dev",
    category: "Operations & Standards",
    description: "Standard Operating Procedures for critical manufacturing routines, calibration, hi-pot testing, and containment.",
    route: "/development/research-innovation/sop-development/new",
    newRoute: "/development/research-innovation/sop-development/new",
    icon: FileCheck2,
    color: "#2563eb",
    score: 93,
    scoreLabel: "Governance",
    activeCount: 19,
    statusBadge: "ISO 9001 Audited",
    leadProject: "Hi-Pot Dielectric SOP",
    standards: ["ISO 9001", "IATF 16949 §8.5", "OSHA Safety"],
  },
  {
    id: "bom-engineering",
    name: "BOM Engineering",
    shortLabel: "BOM Eng",
    category: "Operations & Standards",
    description: "Multi-level Engineering BOM (eBOM) to Manufacturing BOM (mBOM) transformation, alternate sourcing, and cost rollups.",
    route: "/development/research-innovation/bom-engineering/new",
    newRoute: "/development/research-innovation/bom-engineering/new",
    icon: Boxes,
    color: "#d97706",
    score: 96,
    scoreLabel: "148 Parts Valid",
    activeCount: 15,
    statusBadge: "eBOM ↔ mBOM Synced",
    leadProject: "Smart EV Charger AC 7kW",
    standards: ["PLM Hierarchy", "RoHS / REACH", "IPC-1752A"],
  },
  {
    id: "routing-development",
    name: "Routing Development",
    shortLabel: "Routing Dev",
    category: "Operations & Standards",
    description: "Standard manufacturing process routing, setup times, run hours, labor allocation, machine cost center codes, and ERP backflush.",
    route: "/development/research-innovation/routing-development/new",
    newRoute: "/development/research-innovation/routing-development/new",
    icon: RouteIcon,
    color: "#0A3C75",
    score: 91,
    scoreLabel: "Cycle 108 min",
    activeCount: 13,
    statusBadge: "12 Ops Balanced",
    leadProject: "Charger Final Assembly Routing",
    standards: ["REFA Work Study", "MTM-1 Standards", "ERP Work Center"],
  },

  // Quality & Process Excellence
  {
    id: "quality-planning-apqp",
    name: "Quality Planning (APQP)",
    shortLabel: "APQP Quality",
    category: "Quality & Process Excellence",
    description: "Advanced Product Quality Planning gates (1 through 5), design feasibility, process sign-off, and customer PPAP submissions.",
    route: "/development/research-innovation/quality-planning-apqp/new",
    newRoute: "/development/research-innovation/quality-planning-apqp/new",
    icon: FileCheck2,
    color: "#10b981",
    score: 88,
    scoreLabel: "PPAP Readiness",
    activeCount: 8,
    statusBadge: "Phase 3 Active",
    leadProject: "EV Charger Industrialization",
    standards: ["AIAG APQP 3rd Ed", "PPAP 4th Ed", "IATF 16949"],
  },
  {
    id: "pfmea-development",
    name: "PFMEA Development",
    shortLabel: "PFMEA Dev",
    category: "Quality & Process Excellence",
    description: "Process Failure Mode and Effects Analysis, Severity/Occurrence/Detection ratings, Action Priority (AP), and mitigations.",
    route: "/development/research-innovation/pfmea-development/new",
    newRoute: "/development/research-innovation/pfmea-development/new",
    icon: ShieldAlert,
    color: "#e11d48",
    score: 89,
    scoreLabel: "Risk Mitigated",
    activeCount: 11,
    statusBadge: "Max RPN < 80",
    leadProject: "PCBA SMT & Terminal Crimping",
    standards: ["AIAG & VDA FMEA 1st Ed", "ISO 26262 ASIL"],
  },
  {
    id: "control-plan",
    name: "Control Plan Development",
    shortLabel: "Control Plan",
    category: "Quality & Process Excellence",
    description: "Process control characteristics, sampling frequencies, measurement systems analysis (MSA), and documented reaction plans.",
    route: "/development/research-innovation/control-plan/new",
    newRoute: "/development/research-innovation/control-plan/new",
    icon: ClipboardList,
    color: "#0A3C75",
    score: 88,
    scoreLabel: "SPC Compliance",
    activeCount: 12,
    statusBadge: "100% Critical Points",
    leadProject: "EVSE Inverter & Enclosure",
    standards: ["AIAG Control Plan", "MSA 4th Ed", "SPC 2nd Ed"],
  },
  {
    id: "process-validation",
    name: "Process Validation",
    shortLabel: "Process Validation",
    category: "Quality & Process Excellence",
    description: "Installation, Operational, and Performance Qualification (IQ/OQ/PQ), Gage R&R studies, and statistical capability indices.",
    route: "/development/research-innovation/process-validation/new",
    newRoute: "/development/research-innovation/process-validation/new",
    icon: Zap,
    color: "#0891b2",
    score: 92,
    scoreLabel: "Capability Cpk 1.67",
    activeCount: 9,
    statusBadge: "Cpk 1.67 Verified",
    leadProject: "Ultrasonic Plastic Welding",
    standards: ["GHTF Validation Guidelines", "ISO 13485", "ASTM F2095"],
  },
  {
    id: "smart-factory-development",
    name: "Smart Factory Development",
    shortLabel: "Smart Factory",
    category: "Quality & Process Excellence",
    description: "Edge PLC telemetry, OPC-UA protocol integration, automated optical inspection (AOI), and real-time shopfloor Andon alerts.",
    route: "/development/research-innovation/smart-factory-development/new",
    newRoute: "/development/research-innovation/smart-factory-development/new",
    icon: Factory,
    color: "#0A3C75",
    score: 90,
    scoreLabel: "Industry 4.0",
    activeCount: 14,
    statusBadge: "IIoT MQTT Live",
    leadProject: "Plant 2 Connected Line",
    standards: ["OPC-UA", "MQTT Sparkplug B", "ISA-95 Architecture"],
  },
  {
    id: "manufacturing-excellence",
    name: "Manufacturing Excellence",
    shortLabel: "Excellence",
    category: "Quality & Process Excellence",
    description: "Continuous improvement, Kaizen project tracking, Overall Equipment Effectiveness (OEE), scrap containment, and Six Sigma.",
    route: "/development/research-innovation/manufacturing-excellence/new",
    newRoute: "/development/research-innovation/manufacturing-excellence/new",
    icon: Award,
    color: "#f59e0b",
    score: 93,
    scoreLabel: "Six Sigma 4.8σ",
    activeCount: 16,
    statusBadge: "98.4% FPY",
    leadProject: "Plant-Wide Kaizen Yield Initiative",
    standards: ["DMAIC Six Sigma", "Lean TPS", "TPM Autonomous Maint"],
  },
];

export const ResearchInnovationSubmodulesGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewSubmodule, setPreviewSubmodule] = useState<ResearchInnovationSubmodule | null>(null);

  const filteredSubmodules = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return RESEARCH_INNOVATION_SUBMODULES;
    return RESEARCH_INNOVATION_SUBMODULES.filter((sub) => {
      return (
        sub.name.toLowerCase().includes(q) ||
        sub.shortLabel.toLowerCase().includes(q) ||
        sub.description.toLowerCase().includes(q) ||
        sub.leadProject.toLowerCase().includes(q) ||
        sub.standards.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search Control Only */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 27 engineering submodules by name, standard, or project..."
            className="h-9 pl-9 pr-8 text-xs bg-card border-border/80 shadow-2xs rounded-lg"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
        <span className="text-xs text-muted-foreground font-medium font-mono shrink-0">
          Showing {filteredSubmodules.length} of {RESEARCH_INNOVATION_SUBMODULES.length} submodules
        </span>
      </div>

      {/* 27 Submodules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubmodules.map((sub) => {
          const Icon = sub.icon;
          return (
            <div
              key={sub.id}
              className="bg-card border border-border/80 rounded-xl shadow-xs p-4 flex flex-col justify-between hover:border-primary/50 hover:shadow-md transition-all group relative"
            >
              <div>
                {/* Top: Icon, Category & Status Badge */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: `${sub.color}15`, color: sub.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block truncate">
                        {sub.category}
                      </span>
                      <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {sub.name}
                      </h3>
                    </div>
                  </div>

                  <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0.5 whitespace-nowrap shrink-0">
                    {sub.statusBadge}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[32px]">
                  {sub.description}
                </p>

                {/* Score & Active Pipeline Box */}
                <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40 mb-3 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-muted-foreground font-medium">{sub.scoreLabel}:</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-foreground font-mono">{sub.score}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">/ 100</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${sub.score}%`, backgroundColor: sub.color }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-0.5">
                    <span>
                      Lead: <strong className="text-foreground">{sub.leadProject}</strong>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                      {sub.activeCount} Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40 mt-1">
                <div className="flex items-center gap-1.5">
                  <Link
                    to={sub.newRoute as any}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Record
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPreviewSubmodule(sub)}
                    className="p-1 rounded text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    title="Quick Specs & Standards"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Link
                  to={sub.route as any}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline cursor-pointer"
                >
                  Open Submodule
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submodule Quick Specs Modal */}
      <Dialog open={!!previewSubmodule} onOpenChange={(open) => !open && setPreviewSubmodule(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              {previewSubmodule && (
                <div
                  className="p-1.5 rounded-lg text-white"
                  style={{ backgroundColor: previewSubmodule.color }}
                >
                  {React.createElement(previewSubmodule.icon, { className: "w-4 h-4" })}
                </div>
              )}
              <span>{previewSubmodule?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {previewSubmodule?.category} • Active Enterprise Stream
            </DialogDescription>
          </DialogHeader>

          {previewSubmodule && (
            <div className="space-y-3 py-2 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                {previewSubmodule.description}
              </p>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted/40 border border-border">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">Readiness Benchmark</span>
                  <span className="font-bold text-foreground text-sm font-mono">{previewSubmodule.score}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">Active Records</span>
                  <span className="font-bold text-foreground text-sm font-mono">{previewSubmodule.activeCount} Records</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-border/60">
                  <span className="text-[10px] text-muted-foreground block font-medium">Lead Commercial Project</span>
                  <span className="font-bold text-primary">{previewSubmodule.leadProject}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold block mb-1.5 text-foreground">
                  Associated Standards & Directives:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {previewSubmodule.standards.map((std) => (
                    <Badge key={std} variant="outline" className="text-[10px] font-mono">
                      {std}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setPreviewSubmodule(null)}>
              Close
            </Button>
            {previewSubmodule && (
              <Link to={previewSubmodule.route as any}>
                <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground">
                  Launch Submodule
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </Link>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
