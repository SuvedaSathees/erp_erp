import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/erp/AppShell";
import { ManufacturingDevelopmentTabBar } from "@/components/erp/ManufacturingDevelopmentTabBar";
import {
  Gauge,
  Target,
  TrendingUp,
  Plus,
  CheckSquare,
  Search,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  X,
  FileText,
  Activity,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/development/manufacturing-development/six-sigma-projects/")({
  component: SixSigmaProjectsPage,
});

interface DmaicProject {
  id: string;
  title: string;
  phase: "Define" | "Measure" | "Analyze" | "Improve" | "Control";
  lead: string;
  cpk: string;
  dpmo: string;
  savings: string;
  status: "Active" | "In Review" | "Completed" | "On Hold";
  plant: string;
  process: string;
  problemStatement: string;
  rootCause: string;
  targetCpk: string;
  targetDpmo: string;
  startDate: string;
  targetCompletion: string;
}

const initialProjects: DmaicProject[] = [
  {
    id: "SS-2026-001",
    title: "SMT Solder Defect Reduction (DPMO Reduction)",
    phase: "Control",
    lead: "Dr. Rajesh Kumar",
    cpk: "1.67",
    dpmo: "3.4",
    savings: "$145,000",
    status: "Active",
    plant: "Plant-01 — PCBA Assembly Cell",
    process: "Automated Reflow Soldering",
    problemStatement: "Bridging and voiding defect rate exceeds automotive electronics PPM standards.",
    rootCause: "Solder paste viscosity variation and reflow thermal ramp rate mismatch.",
    targetCpk: "1.67",
    targetDpmo: "3.4",
    startDate: "2026-01-10",
    targetCompletion: "2026-06-30",
  },
  {
    id: "SS-2026-002",
    title: "Automated Stator Winding Variance Minimization",
    phase: "Improve",
    lead: "Sarah Jenkins",
    cpk: "1.52",
    dpmo: "12.8",
    savings: "$98,000",
    status: "Active",
    plant: "Plant-01 — Motor Stator Cell",
    process: "CNC Wire Winding & Tensioning",
    problemStatement: "Coil resistance variance caused uneven electromagnetic balance in stator assemblies.",
    rootCause: "Tensioner pneumatic fluctuating pressure during high-speed feed spool rotations.",
    targetCpk: "1.60",
    targetDpmo: "8.0",
    startDate: "2026-02-01",
    targetCompletion: "2026-07-15",
  },
  {
    id: "SS-2026-003",
    title: "Enclosure Injection Mold Shrinkage Control",
    phase: "Analyze",
    lead: "Michael Chang",
    cpk: "1.33",
    dpmo: "45.0",
    savings: "$72,000",
    status: "In Review",
    plant: "Plant-02 — Tooling & Injection Mold Shop",
    process: "High-Pressure Thermoplastic Injection",
    problemStatement: "Dimensional warp and sink marks on top cover enclosure mounting flanges.",
    rootCause: "Cooling line temperature differential across core and cavity mold halves.",
    targetCpk: "1.50",
    targetDpmo: "15.0",
    startDate: "2026-03-01",
    targetCompletion: "2026-08-30",
  },
  {
    id: "SS-2026-004",
    title: "High-Voltage Harness Terminal Crimp Yield",
    phase: "Measure",
    lead: "Priya Sharma",
    cpk: "1.28",
    dpmo: "68.2",
    savings: "$110,000",
    status: "Active",
    plant: "Plant-01 — Wiring Harness Cell",
    process: "Semi-Automated Crimp Termination",
    problemStatement: "Pull-force test variations and micro-voids in crimp barrel cross-sections.",
    rootCause: "Under investigation: blade wear rate versus insulation strip depth accuracy.",
    targetCpk: "1.55",
    targetDpmo: "10.0",
    startDate: "2026-03-15",
    targetCompletion: "2026-09-30",
  },
];

function SixSigmaProjectsPage({
  breadcrumb = "Development > Manufacturing Development",
  tabs = <ManufacturingDevelopmentTabBar />,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const [projects, setProjects] = useState<DmaicProject[]>(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals state
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<DmaicProject | null>(null);

  // New Project Form state
  const [newTitle, setNewTitle] = useState("");
  const [newPhase, setNewPhase] = useState<DmaicProject["phase"]>("Define");
  const [newLead, setNewLead] = useState("");
  const [newPlant, setNewPlant] = useState("Plant-01 — Assembly Cell");
  const [newProcess, setNewProcess] = useState("");
  const [newProblem, setNewProblem] = useState("");
  const [newTargetCpk, setNewTargetCpk] = useState("1.67");
  const [newTargetDpmo, setNewTargetDpmo] = useState("3.4");
  const [newSavings, setNewSavings] = useState("$100,000");

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.process.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPhase = phaseFilter === "ALL" || p.phase === phaseFilter;
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesPhase && matchesStatus;
  });

  const handleLaunchProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLead.trim()) {
      toast.error("Please enter a Project Title and Project Lead");
      return;
    }

    const nextId = `SS-2026-00${projects.length + 1}`;
    const created: DmaicProject = {
      id: nextId,
      title: newTitle,
      phase: newPhase,
      lead: newLead,
      cpk: "1.30",
      dpmo: "50.0",
      savings: newSavings.startsWith("$") ? newSavings : `$${newSavings}`,
      status: "Active",
      plant: newPlant,
      process: newProcess || "Assembly Operations",
      problemStatement: newProblem || "Reduce process variation and elevate yield to Six Sigma quality standards.",
      rootCause: "Under initial baseline measurement & SIPOC analysis.",
      targetCpk: newTargetCpk,
      targetDpmo: newTargetDpmo,
      startDate: new Date().toISOString().split("T")[0],
      targetCompletion: "2026-12-31",
    };

    setProjects([created, ...projects]);
    setIsLaunchModalOpen(false);
    setNewTitle("");
    setNewLead("");
    setNewProcess("");
    setNewProblem("");
    toast.success(`DMAIC Project ${created.id} launched successfully!`);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    toast.success(`Project ${id} removed`);
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
  };

  const handleExportSingleReport = (p: DmaicProject) => {
    const content = `=====================================================
SIX SIGMA (DMAIC) PROJECT CHARTER: ${p.title}
=====================================================
Project ID: ${p.id}
Project Lead: ${p.lead}
DMAIC Phase: ${p.phase}
Workflow Status: ${p.status}
Plant / Work Center: ${p.plant}
Manufacturing Process: ${p.process}
Start Date: ${p.startDate}
Target Completion: ${p.targetCompletion}

STATISTICAL PROCESS CAPABILITY & QUALITY METRICS:
-----------------------------------------------------
Current Process Cpk: ${p.cpk} (Target: ${p.targetCpk})
Current DPMO: ${p.dpmo} (Target: ${p.targetDpmo})
Projected Annual Savings: ${p.savings}

DMAIC PROBLEM STATEMENT:
-----------------------------------------------------
${p.problemStatement}

IDENTIFIED ROOT CAUSE / HYPOTHESIS:
-----------------------------------------------------
${p.rootCause}

PHASE GATE PROGRESSION:
-----------------------------------------------------
[✓] Define: Problem scope & team charter approved
[${p.phase === "Define" ? "●" : "✓"}] Measure: Baseline data collection & MSA gauge R&R
[${p.phase === "Define" || p.phase === "Measure" ? "○" : "●"}] Analyze: Cause & effect matrix, DOE, and hypothesis tests
[${p.phase === "Improve" || p.phase === "Control" ? "●" : "○"}] Improve: Solution piloting, poka-yoke, and tolerance optimization
[${p.phase === "Control" ? "●" : "○"}] Control: SPC control charts, standard operating procedures, and handover

Validated by Six Sigma Master Black Belt & Quality Directorate.
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${p.id}_DMAIC_Project_Charter.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${p.id} DMAIC Charter`);
  };

  const handleExportDirectory = () => {
    const content = `=====================================================
SIX SIGMA DMAIC PROJECTS DIRECTORY SUMMARY
=====================================================
Generated On: ${new Date().toLocaleString()}
Total Active Projects: ${projects.length}

${projects
  .map(
    (p) =>
      `[${p.id}] ${p.title}\n` +
      `Phase: ${p.phase} | Lead: ${p.lead} | Status: ${p.status}\n` +
      `Cpk: ${p.cpk} | DPMO: ${p.dpmo} | Savings: ${p.savings}\n` +
      `Plant: ${p.plant} | Process: ${p.process}\n` +
      `-----------------------------------------------------`
  )
  .join("\n\n")}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Six_Sigma_DMAIC_Projects_Directory.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Six Sigma Directory Report exported successfully!");
  };

  return (
    <AppShell
      title="Six Sigma Projects"
      breadcrumb={breadcrumb}
      description="Manage DMAIC projects, statistical process control, process capability (Cpk), and defect reduction."
      tabs={tabs}
    >
      <div className="p-4 sm:p-6 space-y-5 pb-16">
        {/* Top Header Bar */}
        <div className="bg-card text-card-foreground border-b border-border px-5 py-3 shadow-xs rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            {/* Left: Identity, Title & Sub-metadata */}
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-[11px] border border-border">
                  SIX-SIGMA
                </span>
                <h1 className="text-sm sm:text-base font-bold text-foreground">
                  Six Sigma DMAIC Projects
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  Continuous Improvement Active
                </span>
                <span className="text-[10px] font-bold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/50 font-mono">
                  {projects.length} Projects
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Avg Cpk: <strong className="text-foreground font-mono">1.54</strong></span>
                <span>•</span>
                <span>Defect Rate: <strong className="text-foreground font-mono">14.2 DPMO</strong></span>
                <span>•</span>
                <span>Realized Savings: <strong className="text-foreground font-mono">$425,000</strong></span>
              </div>
            </div>

            {/* Right: Actions Toolbar */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("DMAIC project portfolio status updated")}
                className="gap-1.5 border-border hover:bg-muted text-xs font-semibold"
              >
                Save Draft
              </Button>

              <Button
                size="sm"
                onClick={() => setIsLaunchModalOpen(true)}
                className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Launch DMAIC Project
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportDirectory}
                className="gap-1.5 border-border hover:bg-muted text-xs font-semibold"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Header Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => {
              setPhaseFilter("ALL");
              setStatusFilter("ALL");
            }}
            className="rounded-xl border border-border/80 bg-card p-4 shadow-sm hover:border-primary/50 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Active DMAIC Projects</span>
              <Gauge className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{projects.length} Projects</div>
            <p className="mt-1 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> 3 Completed this quarter
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Avg Process Capability (Cpk)</span>
              <Target className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">1.54 Cpk</div>
            <p className="mt-1 text-[11px] text-emerald-600 font-medium">Target ≥ 1.67 Six Sigma</p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Overall Defect Rate (DPMO)</span>
              <CheckSquare className="h-4 w-4 text-purple-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">14.2 DPMO</div>
            <p className="mt-1 text-[11px] text-purple-600 font-medium">↓ 42% reduction YTD</p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Cost Savings Realized</span>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">$425,000</div>
            <p className="mt-1 text-[11px] text-blue-600 font-medium">Validated by Finance</p>
          </div>
        </div>

        {/* Filter & Action Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
          <div className="flex flex-1 flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search DMAIC projects, leads, or phases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-8.5 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* DMAIC Phase Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-semibold bg-muted/40 p-1 rounded-lg border border-border/60">
              {["ALL", "Define", "Measure", "Analyze", "Improve", "Control"].map((phase) => (
                <button
                  key={phase}
                  onClick={() => setPhaseFilter(phase)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    phaseFilter === phase
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {phase}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-input bg-background text-xs text-foreground font-semibold cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="In Review">In Review</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

        {/* Project Table */}
        <div className="rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-foreground">
              <thead className="bg-muted/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="px-4 py-3">Project ID & Title</th>
                  <th className="px-4 py-3">DMAIC Phase</th>
                  <th className="px-4 py-3">Project Lead</th>
                  <th className="px-4 py-3 text-center">Process Cpk</th>
                  <th className="px-4 py-3 text-center">DPMO</th>
                  <th className="px-4 py-3 text-right">Annual Savings</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-muted-foreground font-semibold text-xs">
                      No DMAIC projects found matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div
                          onClick={() => setSelectedProject(p)}
                          className="font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                        >
                          {p.title}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span className="font-semibold text-primary">{p.id}</span>
                          <span>•</span>
                          <span>{p.plant}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            p.phase === "Control"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300"
                              : p.phase === "Improve"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300"
                              : p.phase === "Analyze"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300"
                          }`}
                        >
                          {p.phase}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-muted-foreground">{p.lead}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-center">
                        {p.cpk}
                      </td>
                      <td className="px-4 py-3 font-mono font-medium text-center">{p.dpmo}</td>
                      <td className="px-4 py-3 font-mono font-bold text-foreground text-right">{p.savings}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            p.status === "Active"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : p.status === "In Review"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedProject(p)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            title="View Details & Telemetry"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleExportSingleReport(p)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            title="Export DMAIC Report"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-card text-card-foreground border border-border rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{selectedProject.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      {selectedProject.phase} Phase
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-foreground mt-1">{selectedProject.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* DMAIC Stepper Progression Bar */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">DMAIC Stage Progression</span>
                <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
                  {["Define", "Measure", "Analyze", "Improve", "Control"].map((phase, idx) => {
                    const phases = ["Define", "Measure", "Analyze", "Improve", "Control"];
                    const currentIdx = phases.indexOf(selectedProject.phase);
                    const isPassed = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={phase}
                        className={`p-2 rounded-lg border flex flex-col items-center gap-1 ${
                          isCurrent
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : isPassed
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                            : "bg-muted/30 text-muted-foreground border-border/50"
                        }`}
                      >
                        {isPassed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : isCurrent ? (
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full bg-muted border border-border" />
                        )}
                        <span>{phase}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grid Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30 p-3.5 rounded-lg border border-border/60 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Project Lead</span>
                  <span className="font-bold text-foreground">{selectedProject.lead}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Process Cpk</span>
                  <span className="font-bold font-mono text-emerald-600">
                    {selectedProject.cpk} (Target: {selectedProject.targetCpk})
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">DPMO</span>
                  <span className="font-bold font-mono text-purple-600">
                    {selectedProject.dpmo} (Target: {selectedProject.targetDpmo})
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Annual Savings</span>
                  <span className="font-bold font-mono text-foreground">{selectedProject.savings}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-foreground block mb-1">Problem Statement</span>
                  <p className="p-2.5 bg-muted/20 border border-border/50 rounded-lg text-muted-foreground">
                    {selectedProject.problemStatement}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-foreground block mb-1">Identified Root Cause & Hypothesis</span>
                  <p className="p-2.5 bg-muted/20 border border-border/50 rounded-lg text-muted-foreground">
                    {selectedProject.rootCause}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportSingleReport(selectedProject)}
                  className="gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download Project Charter
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    const phases: DmaicProject["phase"][] = ["Define", "Measure", "Analyze", "Improve", "Control"];
                    const currentIdx = phases.indexOf(selectedProject.phase);
                    if (currentIdx < phases.length - 1) {
                      const nextPhase = phases[currentIdx + 1];
                      const updated = { ...selectedProject, phase: nextPhase };
                      setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
                      setSelectedProject(updated);
                      toast.success(`Advanced project to ${nextPhase} Phase!`);
                    } else {
                      toast.info("Project is already in final Control Phase.");
                    }
                  }}
                  className="gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" /> Advance Phase Gate
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Launch DMAIC Project Modal */}
        {isLaunchModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-card text-card-foreground border border-border rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">Launch Six Sigma DMAIC Project</h2>
                    <p className="text-xs text-muted-foreground">
                      Initialize a statistical defect reduction & process capability project.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLaunchModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleLaunchProject} className="space-y-4 text-xs">
                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Inverter Heat Sink Thermal Gap Variance Reduction"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 bg-background border border-input rounded-lg text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Initial DMAIC Phase</label>
                    <select
                      value={newPhase}
                      onChange={(e) => setNewPhase(e.target.value as any)}
                      className="w-full p-2.5 bg-background border border-input rounded-lg text-foreground font-semibold cursor-pointer"
                    >
                      <option value="Define">Define</option>
                      <option value="Measure">Measure</option>
                      <option value="Analyze">Analyze</option>
                      <option value="Improve">Improve</option>
                      <option value="Control">Control</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Project Lead (Belt) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Sarah Jenkins (Black Belt)"
                      value={newLead}
                      onChange={(e) => setNewLead(e.target.value)}
                      className="w-full p-2.5 bg-background border border-input rounded-lg text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Manufacturing Plant / Cell</label>
                    <input
                      type="text"
                      value={newPlant}
                      onChange={(e) => setNewPlant(e.target.value)}
                      className="w-full p-2.5 bg-background border border-input rounded-lg text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Manufacturing Process</label>
                    <input
                      type="text"
                      placeholder="e.g., CNC Milling, Wave Soldering"
                      value={newProcess}
                      onChange={(e) => setNewProcess(e.target.value)}
                      className="w-full p-2.5 bg-background border border-input rounded-lg text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Target Capability (Cpk)</label>
                    <input
                      type="text"
                      value={newTargetCpk}
                      onChange={(e) => setNewTargetCpk(e.target.value)}
                      className="w-full p-2.5 bg-background border border-input rounded-lg text-foreground font-bold text-emerald-600 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Projected Annual Savings</label>
                    <input
                      type="text"
                      value={newSavings}
                      onChange={(e) => setNewSavings(e.target.value)}
                      className="w-full p-2.5 bg-background border border-input rounded-lg text-foreground font-bold text-blue-600 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Problem Statement</label>
                  <textarea
                    rows={2}
                    placeholder="Describe the defect type, baseline PPM/DPMO, and business impact..."
                    value={newProblem}
                    onChange={(e) => setNewProblem(e.target.value)}
                    className="w-full p-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsLaunchModalOpen(false)}
                    className="text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="text-xs font-bold cursor-pointer">
                    Launch DMAIC Project
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
