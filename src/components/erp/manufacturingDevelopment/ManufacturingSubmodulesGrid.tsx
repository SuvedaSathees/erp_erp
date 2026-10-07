import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  FileCheck2,
  Cpu,
  ClipboardList,
  ShieldAlert,
  Factory,
  TrendingUp,
  GitBranch,
  Wrench,
  Cog,
  Binary,
  LayoutGrid,
  Sparkles,
  Zap,
  Gauge,
  FileText,
  BookOpen,
  Boxes,
  Route as RouteIcon,
  ArrowRight,
  Plus,
  Search,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export interface ManufacturingSubmodule {
  id: string;
  name: string;
  shortLabel: string;
  category: "Quality & Compliance" | "Tooling & Equipment" | "Process & Engineering" | "Shop Floor & Standards" | "Excellence & Capacity";
  description: string;
  route: string;
  newRoute: string;
  icon: any;
  color: string;
  score: number;
  scoreLabel: string;
  activeCount: number;
  statusBadge: string;
}

export const MANUFACTURING_SUBMODULES: ManufacturingSubmodule[] = [
  {
    id: "apqp",
    name: "Quality Planning (APQP)",
    shortLabel: "APQP",
    category: "Quality & Compliance",
    description: "Advanced Product Quality Planning gates, feasibility commits, and product timing.",
    route: "/development/manufacturing-development/quality-planning-apqp",
    newRoute: "/development/manufacturing-development/quality-planning-apqp/new",
    icon: FileCheck2,
    color: "#10b981", // Emerald
    score: 85,
    scoreLabel: "Readiness",
    activeCount: 8,
    statusBadge: "Gate 3 Active",
  },
  {
    id: "process",
    name: "Production Process Engineering",
    shortLabel: "Process",
    category: "Process & Engineering",
    description: "Govern production process flows, takt times, operating parameters, and work cell design.",
    route: "/development/manufacturing-development/production-engineering",
    newRoute: "/development/manufacturing-development/production-engineering/new",
    icon: Cpu,
    color: "#3b82f6", // Blue
    score: 92,
    scoreLabel: "Takt Balanced",
    activeCount: 14,
    statusBadge: "92% Efficiency",
  },
  {
    id: "control-plan",
    name: "Control Plan Development",
    shortLabel: "Control Plan",
    category: "Quality & Compliance",
    description: "Establish process control points, inspection criteria, sampling frequencies, and reactions.",
    route: "/development/manufacturing-development/control-plan",
    newRoute: "/development/manufacturing-development/control-plan/new",
    icon: ClipboardList,
    color: "#3B82F6", // Blue
    score: 88,
    scoreLabel: "Compliance",
    activeCount: 12,
    statusBadge: "100% Verified",
  },
  {
    id: "pfmea",
    name: "PFMEA Development",
    shortLabel: "PFMEA",
    category: "Quality & Compliance",
    description: "Process failure mode analysis, severity/occurrence/detection scoring, and mitigation.",
    route: "/development/manufacturing-development/pfmea-development",
    newRoute: "/development/manufacturing-development/pfmea-development/new",
    icon: ShieldAlert,
    color: "#ef4444", // Red
    score: 78,
    scoreLabel: "Max RPN < 100",
    activeCount: 9,
    statusBadge: "Low Risk",
  },
  {
    id: "ppap",
    name: "Process Validation (PPAP)",
    shortLabel: "PPAP",
    category: "Quality & Compliance",
    description: "Production Part Approval Process submissions, trial run validation, and customer sign-off.",
    route: "/development/manufacturing-development/process-validation",
    newRoute: "/development/manufacturing-development/process-validation/new",
    icon: Factory,
    color: "#0A3C75", // Navy
    score: 82,
    scoreLabel: "PPAP L3 Ready",
    activeCount: 6,
    statusBadge: "Level 3 Target",
  },
  {
    id: "six-sigma",
    name: "Six Sigma Projects",
    shortLabel: "Six Sigma",
    category: "Quality & Compliance",
    description: "DMAIC project governance, statistical process control (SPC), and Cp/Cpk optimization.",
    route: "/development/manufacturing-development/six-sigma-projects",
    newRoute: "/development/manufacturing-development/six-sigma-projects/new",
    icon: TrendingUp,
    color: "#f59e0b", // Amber
    score: 94,
    scoreLabel: "DMAIC Score",
    activeCount: 5,
    statusBadge: "Cpk 1.67",
  },
  {
    id: "assembly-line",
    name: "Assembly Line Development",
    shortLabel: "Assembly Line",
    category: "Process & Engineering",
    description: "Line balancing, ergonomics, takt time distribution, conveyor systems, and automated line feeds.",
    route: "/development/manufacturing-development/assembly-line-development",
    newRoute: "/development/manufacturing-development/assembly-line-development/new",
    icon: GitBranch,
    color: "#06b6d4", // Cyan
    score: 87,
    scoreLabel: "Line Balance",
    activeCount: 4,
    statusBadge: "88 sec Takt",
  },
  {
    id: "fixture",
    name: "Fixture Development",
    shortLabel: "Fixture",
    category: "Tooling & Equipment",
    description: "Custom hydraulic/pneumatic clamping fixtures, locating pins, welding jigs, and holding units.",
    route: "/development/manufacturing-development/fixture-development",
    newRoute: "/development/manufacturing-development/fixture-development/new",
    icon: Wrench,
    color: "#0ea5e9", // Sky
    score: 90,
    scoreLabel: "Fixture Accuracy",
    activeCount: 16,
    statusBadge: "±0.02 mm",
  },
  {
    id: "tooling",
    name: "Tooling Development",
    shortLabel: "Tooling",
    category: "Tooling & Equipment",
    description: "Stamping dies, injection molds, cutting tooling, lifecycle tracking, and preventive upkeep.",
    route: "/development/manufacturing-development/tooling-development",
    newRoute: "/development/manufacturing-development/tooling-development/new",
    icon: Cog,
    color: "#d97706", // Amber dark
    score: 86,
    scoreLabel: "Tool Life Index",
    activeCount: 22,
    statusBadge: "Class A Tools",
  },
  {
    id: "jig",
    name: "Jig Development",
    shortLabel: "Jig",
    category: "Tooling & Equipment",
    description: "Precision drilling, alignment, soldering, testing jigs, and shop floor operator aids.",
    route: "/development/manufacturing-development/jig-development",
    newRoute: "/development/manufacturing-development/jig-development/new",
    icon: Binary,
    color: "#ec4899", // Pink
    score: 91,
    scoreLabel: "Repeatability",
    activeCount: 18,
    statusBadge: "Validated",
  },
  {
    id: "factory-layout",
    name: "Factory Layout Design",
    shortLabel: "Factory Layout",
    category: "Process & Engineering",
    description: "Plant CAD layouts, material flow paths, utility drops, AGV pathways, and safety aisles.",
    route: "/development/manufacturing-development/factory-layout-design",
    newRoute: "/development/manufacturing-development/factory-layout-design/new",
    icon: LayoutGrid,
    color: "#84cc16", // Lime
    score: 85,
    scoreLabel: "Logistics Score",
    activeCount: 3,
    statusBadge: "EHS Certified",
  },
  {
    id: "smart-factory",
    name: "Smart Factory Development",
    shortLabel: "Smart Factory",
    category: "Process & Engineering",
    description: "Industry 4.0 transformation, IIoT sensors, edge computing, SCADA, and Digital Twins.",
    route: "/development/manufacturing-development/smart-factory-development",
    newRoute: "/development/manufacturing-development/smart-factory-development/new",
    icon: Sparkles,
    color: "#0A3C75", // Navy light
    score: 89,
    scoreLabel: "Integration",
    activeCount: 7,
    statusBadge: "Level 3 Smart",
  },
  {
    id: "manufacturing-excellence",
    name: "Manufacturing Excellence",
    shortLabel: "Excellence",
    category: "Excellence & Capacity",
    description: "OEE improvement, TPM deployment, Lean Kaizen, zero-defect culture, and sustainability ESG.",
    route: "/development/manufacturing-development/manufacturing-excellence",
    newRoute: "/development/manufacturing-development/manufacturing-excellence/new",
    icon: Zap,
    color: "#eab308", // Yellow
    score: 86,
    scoreLabel: "Operational OEE",
    activeCount: 11,
    statusBadge: "OEE 72.65%",
  },
  {
    id: "capacity-planning",
    name: "Capacity Planning",
    shortLabel: "Capacity",
    category: "Excellence & Capacity",
    description: "Equipment utilization modeling, shift schedule balancing, machine bottlenecks, and capacity limits.",
    route: "/development/manufacturing-development/capacity-planning",
    newRoute: "/development/manufacturing-development/capacity-planning/new",
    icon: Gauge,
    color: "#14b8a6", // Teal
    score: 88,
    scoreLabel: "Utilization",
    activeCount: 6,
    statusBadge: "84% Load",
  },
  {
    id: "work-instruction",
    name: "Work Instruction Development",
    shortLabel: "Work Instruction",
    category: "Shop Floor & Standards",
    description: "Standard Operation Sheets (SOS), step-by-step visual guidance, and digital operator aids.",
    route: "/development/manufacturing-development/work-instruction-development",
    newRoute: "/development/manufacturing-development/work-instruction-development/new",
    icon: FileText,
    color: "#3b82f6", // Blue
    score: 95,
    scoreLabel: "Coverage",
    activeCount: 42,
    statusBadge: "100% Visual",
  },
  {
    id: "sop",
    name: "SOP Development",
    shortLabel: "SOP",
    category: "Shop Floor & Standards",
    description: "Standard Operating Procedures for machine setup, calibration, maintenance, and safety.",
    route: "/development/manufacturing-development/sop-development",
    newRoute: "/development/manufacturing-development/sop-development/new",
    icon: BookOpen,
    color: "#64748b", // Slate
    score: 92,
    scoreLabel: "SOP Audit Score",
    activeCount: 38,
    statusBadge: "ISO 9001",
  },
  {
    id: "bom-engineering",
    name: "BOM Engineering",
    shortLabel: "BOM",
    category: "Shop Floor & Standards",
    description: "Manufacturing Bill of Materials (MBOM), Phantom assemblies, revisions, and alternate parts.",
    route: "/development/manufacturing-development/bom-engineering",
    newRoute: "/development/manufacturing-development/bom-engineering/new",
    icon: Boxes,
    color: "#f97316", // Orange
    score: 96,
    scoreLabel: "Structure Health",
    activeCount: 29,
    statusBadge: "EBOM Synced",
  },
  {
    id: "routing-development",
    name: "Routing Development",
    shortLabel: "Routing",
    category: "Shop Floor & Standards",
    description: "Manufacturing operation sequences, work centers, standard labor times, and scrap allowances.",
    route: "/development/manufacturing-development/routing-development",
    newRoute: "/development/manufacturing-development/routing-development/new",
    icon: RouteIcon,
    color: "#10b981", // Emerald
    score: 91,
    scoreLabel: "ERP Verified",
    activeCount: 26,
    statusBadge: "Active Routing",
  },
];

const CATEGORIES = [
  "All",
  "Quality & Compliance",
  "Process & Engineering",
  "Tooling & Equipment",
  "Shop Floor & Standards",
  "Excellence & Capacity",
] as const;

export const ManufacturingSubmodulesGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredSubmodules = useMemo(() => {
    return MANUFACTURING_SUBMODULES.filter((sub) => {
      const matchesSearch =
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.shortLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === "All" || sub.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-4">
      {/* Control Bar: Category Tabs & Search */}
      <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === "All"
                ? MANUFACTURING_SUBMODULES.length
                : MANUFACTURING_SUBMODULES.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search submodules..."
            className="h-8.5 pl-8 text-xs bg-background"
          />
        </div>
      </div>

      {/* 18 Submodules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
        {filteredSubmodules.map((sub) => {
          const Icon = sub.icon;
          return (
            <div
              key={sub.id}
              className="bg-card border border-border/80 rounded-xl shadow-xs p-4 flex flex-col justify-between hover:border-primary/50 hover:shadow-md transition-all group relative"
            >
              <div>
                {/* Card Top: Icon, Category & Status Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
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
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3.5 min-h-[32px]">
                  {sub.description}
                </p>

                {/* Score & Active Records Meter */}
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
                    <span>Active Records: <strong className="text-foreground">{sub.activeCount}</strong></span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Live Pipeline</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40 mt-1">
                <Link
                  to={sub.newRoute as any}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Record
                </Link>

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
    </div>
  );
};
