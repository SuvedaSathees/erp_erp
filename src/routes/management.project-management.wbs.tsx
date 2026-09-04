import { useState, useRef, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProjectManagementTabBar } from "@/components/erp/ProjectManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Star,
  RefreshCw,
  Download,
  Upload,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Layers,
  Calendar,
  IndianRupee,
  MoreHorizontal,
  FileText,
  Clock,
  Sparkles,
  Edit2,
  Copy,
  Trash2,
  FileCode,
  Share2,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Paperclip,
  Check,
  ExternalLink,
  ShieldCheck,
  SlidersHorizontal,
  CheckSquare,
  Send,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  INITIAL_WBS_ELEMENTS,
  INITIAL_PLANNING_RECORD,
  type WbsElement,
  type WbsActivity,
  type WbsDeliverable,
} from "@/services/projectPlanningService";

export const Route = createFileRoute("/management/project-management/wbs")({
  head: () => ({
    meta: [
      { title: "Work Breakdown Structure (WBS) Form · Magnertia ERP" },
      {
        name: "description",
        content:
          "Decompose the project into hierarchical deliverables and work packages for effective planning and execution.",
      },
    ],
  }),
  component: WbsFormPage,
});

export function WbsFormPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [wbsList, setWbsList] = useState<WbsElement[]>(INITIAL_WBS_ELEMENTS);
  const [selectedWbsCode, setSelectedWbsCode] = useState<string>("2.2.3");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const [activeTab, setActiveTab] = useState<
    "Overview" | "Activities" | "Deliverables" | "Resources" | "Cost" | "Documents" | "Risks" | "Notes"
  >("Overview");
  const [inspectorTab, setInspectorTab] = useState<"Properties" | "Links">("Properties");

  // Modals
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityDuration, setNewActivityDuration] = useState("2d");
  const [newActivityStart, setNewActivityStart] = useState("16 Sep 2026");
  const [newActivityFinish, setNewActivityFinish] = useState("18 Sep 2026");

  const [isAddDeliverableOpen, setIsAddDeliverableOpen] = useState(false);
  const [newDeliverableName, setNewDeliverableName] = useState("");

  const [isCreateWbsOpen, setIsCreateWbsOpen] = useState(false);
  const [createWbsCode, setCreateWbsCode] = useState("");
  const [createWbsName, setCreateWbsName] = useState("");
  const [createWbsType, setCreateWbsType] = useState<WbsElement["type"]>("Work Package");
  const [createWbsOwner, setCreateWbsOwner] = useState("Suresh Kumar");
  const [createWbsBudget, setCreateWbsBudget] = useState("₹ 3.50 L");

  const [isEditWbsOpen, setIsEditWbsOpen] = useState(false);
  const [editWbsData, setEditWbsData] = useState<WbsElement | null>(null);

  const [isBaselineOpen, setIsBaselineOpen] = useState(false);
  const [baselineTag, setBaselineTag] = useState("V2.0 (Baseline)");

  const [isValidationOpen, setIsValidationOpen] = useState(false);

  // Editable notes state keyed by WBS code
  const [wbsNotes, setWbsNotes] = useState<Record<string, string>>({
    "2.2.3":
      "All high-voltage DC busbar clearances must strictly conform to IEC 61851-23 standards. Ensure enclosure meets IP65 ingress rating and seismic zone IV compliance.",
  });

  const selectedWbs = useMemo(() => {
    return wbsList.find((w) => w.code === selectedWbsCode) || wbsList[0];
  }, [wbsList, selectedWbsCode]);

  // Filtered WBS list
  const filteredWbsList = useMemo(() => {
    return wbsList.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.includes(searchQuery);
      const matchesType = filterType === "All" || item.type === filterType;
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [wbsList, searchQuery, filterType, filterStatus]);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setWbsList(INITIAL_WBS_ELEMENTS);
      setSelectedWbsCode("2.2.3");
      setFilterType("All");
      setFilterStatus("All");
      setSearchQuery("");
      toast.success("WBS hierarchy and financial roll-up re-synchronized from baseline.");
    }, 450);
  };

  const handleExportCsv = () => {
    const headers = [
      "WBS Code",
      "WBS Name",
      "Type",
      "Level",
      "Parent Code",
      "Status",
      "Progress %",
      "Owner",
      "Department",
      "Budget",
      "Committed",
      "Actual",
      "Remaining",
      "Planned Start",
      "Planned Finish",
      "Duration",
      "Deliverables Count",
    ];

    const rows = wbsList.map((w) => [
      `"${w.code}"`,
      `"${w.name.replace(/"/g, '""')}"`,
      `"${w.type}"`,
      w.level,
      `"${w.parentCode || "None"}"`,
      `"${w.status}"`,
      w.percent,
      `"${w.owner}"`,
      `"${w.department}"`,
      `"${w.budget}"`,
      `"${w.committed}"`,
      `"${w.actual}"`,
      `"${w.remaining}"`,
      `"${w.plannedStart}"`,
      `"${w.plannedFinish}"`,
      `"${w.duration}"`,
      w.deliverables.length,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PRJ_2026_0195_WBS_Dictionary.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("WBS dictionary (.CSV) exported successfully!");
  };

  const handleExportDossier = () => {
    const dossier = `=====================================================
WORK BREAKDOWN STRUCTURE (WBS) DOSSIER
Project: ${INITIAL_PLANNING_RECORD.projectName} (${INITIAL_PLANNING_RECORD.projectCode})
Generated: ${new Date().toLocaleString()}
Baseline Revision: ${selectedWbs.version}
=====================================================

HIERARCHICAL WBS DECOMPOSITION:
-----------------------------------------------------
${wbsList
  .map((w) => {
    const indent = "  ".repeat(w.level - 1);
    return `${indent}[${w.code}] ${w.name} (${w.type} • Level ${w.level})
${indent}  Status: ${w.status} | Progress: ${w.percent}% | Budget: ${w.budget}
${indent}  Owner: ${w.owner} (${w.department}) | Schedule: ${w.plannedStart} -> ${w.plannedFinish}
${indent}  Deliverables: ${w.deliverables.map((d) => d.name).join(", ") || "Standard deliverable package"}
`;
  })
  .join("\n")}
=====================================================`;

    const blob = new Blob([dossier], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PRJ_2026_0195_WBS_Dossier.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("WBS Dossier (.TXT) exported successfully!");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (file.name.endsWith(".json")) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            setWbsList(parsed);
            if (parsed.length > 0) setSelectedWbsCode(parsed[0].code);
            toast.success(`Imported ${parsed.length} WBS elements from ${file.name}`);
            return;
          }
        }
        toast.success(`File "${file.name}" processed into WBS structure.`);
      } catch {
        toast.error("Failed to parse file. Please upload a valid JSON or CSV file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityName.trim()) return;

    const newAct: WbsActivity = {
      id: `ACT-0${Math.floor(25 + Math.random() * 75)}`,
      name: newActivityName.trim(),
      start: newActivityStart,
      finish: newActivityFinish,
      duration: newActivityDuration,
      percent: 0,
      status: "Planned",
      owner: selectedWbs.owner,
    };

    setWbsList((prev) =>
      prev.map((item) =>
        item.code === selectedWbs.code
          ? {
              ...item,
              activities: [...item.activities, newAct],
            }
          : item,
      ),
    );
    setIsAddActivityOpen(false);
    setNewActivityName("");
    toast.success(`Activity '${newAct.name}' added to WBS ${selectedWbs.code}!`);
  };

  const handleToggleActivityStatus = (actId: string) => {
    setWbsList((prev) =>
      prev.map((item) => {
        if (item.code !== selectedWbs.code) return item;
        const updatedActs = item.activities.map((a) => {
          if (a.id !== actId) return a;
          const nextStatus: WbsActivity["status"] =
            a.status === "Planned" ? "In Progress" : a.status === "In Progress" ? "Completed" : "Planned";
          const nextPercent = nextStatus === "Completed" ? 100 : nextStatus === "In Progress" ? 50 : 0;
          return { ...a, status: nextStatus, percent: nextPercent };
        });
        const totalPct = Math.round(
          updatedActs.reduce((acc, cur) => acc + cur.percent, 0) / (updatedActs.length || 1),
        );
        return { ...item, activities: updatedActs, percent: totalPct };
      }),
    );
    toast.success("Activity status and WBS progress updated.");
  };

  const handleDeleteActivity = (actId: string) => {
    setWbsList((prev) =>
      prev.map((item) => {
        if (item.code !== selectedWbs.code) return item;
        return {
          ...item,
          activities: item.activities.filter((a) => a.id !== actId),
        };
      }),
    );
    toast.success(`Activity ${actId} deleted.`);
  };

  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeliverableName.trim()) return;

    const newDel: WbsDeliverable = {
      id: `DEL-${Date.now()}`,
      name: newDeliverableName.trim(),
      status: "In Progress",
    };

    setWbsList((prev) =>
      prev.map((item) =>
        item.code === selectedWbs.code
          ? {
              ...item,
              deliverables: [...item.deliverables, newDel],
            }
          : item,
      ),
    );
    setIsAddDeliverableOpen(false);
    setNewDeliverableName("");
    toast.success(`Deliverable added to WBS ${selectedWbs.code}!`);
  };

  const handleToggleDeliverable = (delId: string) => {
    setWbsList((prev) =>
      prev.map((item) => {
        if (item.code !== selectedWbs.code) return item;
        return {
          ...item,
          deliverables: item.deliverables.map((d) =>
            d.id === delId
              ? { ...d, status: d.status === "Complete" ? "In Progress" : "Complete" }
              : d,
          ),
        };
      }),
    );
    toast.success("Deliverable status updated.");
  };

  const handleDeleteDeliverable = (delId: string) => {
    setWbsList((prev) =>
      prev.map((item) => {
        if (item.code !== selectedWbs.code) return item;
        return {
          ...item,
          deliverables: item.deliverables.filter((d) => d.id !== delId),
        };
      }),
    );
    toast.success("Deliverable removed.");
  };

  const handleCreateWbsElement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createWbsName.trim()) return;

    const newEl: WbsElement = {
      id: `wbs-${Date.now()}`,
      code: createWbsCode.trim() || `2.2.${selectedWbs.activities.length + 5}`,
      name: createWbsName.trim(),
      type: createWbsType,
      level: 3,
      parentCode: selectedWbs.code,
      parentName: `${selectedWbs.code} ${selectedWbs.name}`,
      version: selectedWbs.version,
      status: "Planned",
      percent: 0,
      owner: createWbsOwner,
      ownerRole: "Engineering",
      ownerAvatarText: createWbsOwner.slice(0, 2).toUpperCase(),
      department: "Engineering",
      businessUnit: "Renewable Energy Solutions",
      plannedStart: "16 Sep 2026",
      plannedFinish: "22 Sep 2026",
      duration: "6 Days",
      calendar: "Standard Calendar",
      priority: "Medium",
      critical: false,
      budget: createWbsBudget,
      budgetValue: parseFloat(createWbsBudget.replace(/[^\d.]/g, "")) || 3.0,
      committed: "₹ 0.00 L",
      actual: "₹ 0.00 L",
      remaining: createWbsBudget,
      description: createWbsName,
      weightage: 2,
      deliverables: [
        { id: `del-${Date.now()}-1`, name: "Technical Design Report", status: "In Progress" },
        { id: `del-${Date.now()}-2`, name: "Approval Certificate", status: "Pending" },
      ],
      activities: [
        {
          id: `ACT-${Date.now().toString().slice(-3)}`,
          name: "Detailed Engineering Specification",
          start: "16 Sep 2026",
          finish: "19 Sep 2026",
          duration: "3d",
          percent: 0,
          status: "Planned",
        },
      ],
    };

    setWbsList((prev) => [...prev, newEl]);
    setSelectedWbsCode(newEl.code);
    setIsCreateWbsOpen(false);
    setCreateWbsCode("");
    setCreateWbsName("");
    toast.success(`Created WBS element ${newEl.code} - ${newEl.name}`);
  };

  const handleSaveEditWbs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editWbsData) return;
    setWbsList((prev) => prev.map((w) => (w.code === editWbsData.code ? editWbsData : w)));
    setIsEditWbsOpen(false);
    toast.success(`WBS element ${editWbsData.code} updated successfully!`);
  };

  const handleCopyWbs = () => {
    const text = `WBS [${selectedWbs.code}] ${selectedWbs.name}
Type: ${selectedWbs.type} | Level: ${selectedWbs.level} | Status: ${selectedWbs.status} (${selectedWbs.percent}%)
Owner: ${selectedWbs.owner} (${selectedWbs.department})
Budget: ${selectedWbs.budget} (Spent: ${selectedWbs.actual}, Remaining: ${selectedWbs.remaining})
Schedule: ${selectedWbs.plannedStart} to ${selectedWbs.plannedFinish} (${selectedWbs.duration})
Deliverables: ${selectedWbs.deliverables.map((d) => d.name).join(", ")}`;

    navigator.clipboard.writeText(text);
    toast.success(`WBS ${selectedWbs.code} details copied to clipboard`);
  };

  const handleDeleteWbs = () => {
    if (selectedWbs.level === 1) {
      toast.error("Cannot delete root Phase element.");
      return;
    }
    const remaining = wbsList.filter((w) => w.code !== selectedWbs.code);
    setWbsList(remaining);
    setSelectedWbsCode(remaining[0]?.code || "1.0");
    toast.success(`WBS element ${selectedWbs.code} deleted.`);
  };

  const handleCreateBaseline = (e: React.FormEvent) => {
    e.preventDefault();
    setWbsList((prev) => prev.map((w) => ({ ...w, version: baselineTag })));
    setIsBaselineOpen(false);
    toast.success(`WBS Baseline ${baselineTag} Frozen!`, {
      description: "Scope decomposition and work packages locked for execution tracking.",
    });
  };

  const handleSaveNotes = () => {
    toast.success(`Engineering notes saved for WBS ${selectedWbs.code}`);
  };

  return (
    <AppShell
      title="Work Breakdown Structure (WBS) Form"
      breadcrumb="Management > Project Management > WBS"
      description="Decompose the project into hierarchical deliverables and work packages for effective planning and execution."
      tabs={<ProjectManagementTabBar />}
    >
      <div className="w-full space-y-4">
          {/* ====================================================================
             1. ACTION HEADER CARD (Exact Workforce Planning Form heading style)
             ==================================================================== */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl px-5 py-3.5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Title & Status Badges */}
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Work Breakdown Structure (WBS) Form
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Approved
                </span>
                <span className="hidden md:inline-block font-mono text-xs text-muted-foreground">
                  PRJ-2026-0195
                </span>
              </div>

              {/* Hidden file input for Import */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileImport}
                accept=".json,.csv,.xml"
                className="hidden"
              />

              {/* Top Action Buttons */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateWbsOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0B3B7B] hover:bg-[#082B5B] text-white transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New WBS Element
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("WBS report emailed to stakeholders.");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Email
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                      Export
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 text-xs">
                    <DropdownMenuItem onClick={handleExportCsv} className="cursor-pointer">
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Export WBS CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportDossier} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-primary" /> Export WBS Dossier (.TXT)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleImportClick} className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4 text-slate-500" /> Import WBS File
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("WBS baseline saved successfully!");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* ====================================================================
             2. TOP WBS METADATA STRIP CARD
             ==================================================================== */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
            {/* Row 1: Code, Name, Type, Level, Parent WBS, Version, Status */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">WBS Code</span>
                <span className="font-bold font-mono text-sm text-primary">{selectedWbs.code}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">WBS Name</span>
                <span className="font-bold text-sm text-foreground truncate block">{selectedWbs.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">WBS Type</span>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 font-semibold text-[11px] mt-0.5"
                >
                  {selectedWbs.type}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">WBS Level</span>
                <span className="font-bold text-sm text-foreground font-mono">{selectedWbs.level}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Parent WBS</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedWbs.parentName || selectedWbs.parentCode || "None (Root)"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">WBS Version</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{selectedWbs.version}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Status</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] mt-0.5",
                    selectedWbs.status === "Completed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : selectedWbs.status === "In Progress"
                      ? "bg-blue-50 text-blue-700 border-blue-300"
                      : "bg-slate-100 text-slate-700 border-slate-300",
                  )}
                >
                  {selectedWbs.status}
                </Badge>
              </div>
            </div>

            {/* Row 2: Project Code, Name, Owner, Department, Dates, % Complete */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs pt-3 border-t border-border/50 items-center">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Project Code</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">
                  {INITIAL_PLANNING_RECORD.projectCode}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Project Name</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate block">
                  {INITIAL_PLANNING_RECORD.projectName}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Owner</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-5 w-5 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0 shadow-2xs">
                    {selectedWbs.ownerAvatarText || selectedWbs.owner.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-slate-900 dark:text-white block truncate leading-tight">
                      {selectedWbs.owner}
                    </span>
                    <span className="text-[10px] text-muted-foreground block truncate">
                      {selectedWbs.ownerRole || selectedWbs.department}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Planned Start</span>
                <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{selectedWbs.plannedStart}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Planned Finish</span>
                <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{selectedWbs.plannedFinish}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">% Complete</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-primary font-mono text-sm">{selectedWbs.percent}%</span>
                  <Progress value={selectedWbs.percent} className="h-2 flex-1" />
                </div>
              </div>
            </div>
          </div>

                   {/* ====================================================================
             3. MAIN 2-COLUMN WORKSPACE: WBS TREE & UNIFIED DETAIL WORKSPACE
             ==================================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* ------------------------------------------------------------------
               COLUMN 1: WBS STRUCTURE TREE & PROPERTIES (4 cols)
               ------------------------------------------------------------------ */}
            <div className="lg:col-span-4 space-y-4">
              {/* Tree Card */}
              <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
                <CardHeader className="p-3 pb-2 border-b border-border/40">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        WBS Structure
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {filteredWbsList.length}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Filter WBS"
                          >
                            <Filter className={cn("h-3.5 w-3.5", (filterType !== "All" || filterStatus !== "All") && "text-primary")} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 text-xs">
                          <DropdownMenuItem onClick={() => { setFilterType("All"); setFilterStatus("All"); toast.info("Filters reset to all"); }}>
                            All Elements
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setFilterType("Phase"); toast.info("Showing Phases"); }}>
                            Level 1 (Phases)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setFilterType("Deliverable"); toast.info("Showing Deliverables"); }}>
                            Level 2 (Deliverables)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setFilterType("Work Package"); toast.info("Showing Work Packages"); }}>
                            Level 3 (Work Packages)
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setFilterStatus("In Progress"); toast.info("In Progress Only"); }}>
                            Status: In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setFilterStatus("Completed"); toast.info("Completed Only"); }}>
                            Status: Completed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <button
                        type="button"
                        onClick={() => setIsCreateWbsOpen(true)}
                        className="p-1 rounded text-primary hover:bg-primary/10 cursor-pointer font-bold"
                        title="Add WBS element"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="relative mt-2">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search WBS elements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 pl-8 text-xs bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </CardHeader>

                <CardContent className="p-2 text-xs space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-muted-foreground px-2 py-1 border-b border-border/40">
                    <span>WBS Code & Name</span>
                    <span>% Complete</span>
                  </div>
                  {filteredWbsList.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground text-xs space-y-1">
                      <p>No WBS elements match the filters.</p>
                      <button
                        type="button"
                        onClick={() => { setFilterType("All"); setFilterStatus("All"); setSearchQuery(""); }}
                        className="text-primary font-semibold hover:underline cursor-pointer text-[11px]"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    filteredWbsList.map((item) => {
                      const isSelected = item.code === selectedWbsCode;
                      const isChildLevel2 = item.level === 2;
                      const isChildLevel3 = item.level === 3;

                      return (
                        <div
                          key={item.code}
                          onClick={() => setSelectedWbsCode(item.code)}
                          className={cn(
                            "p-2 rounded-lg transition-all flex items-center justify-between cursor-pointer group",
                            isChildLevel2 && "pl-5",
                            isChildLevel3 && "pl-8",
                            isSelected
                              ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-l-primary font-bold text-primary dark:text-primary"
                              : "hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300",
                          )}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <ChevronRight
                              className={cn(
                                "h-3 w-3 shrink-0 text-muted-foreground transition-transform",
                                isSelected && "text-primary rotate-90",
                              )}
                            />
                            <span className="font-mono text-[11px] font-semibold text-primary shrink-0">
                              {item.code}
                            </span>
                            <span className="truncate text-xs">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="font-mono text-[11px] font-semibold">{item.percent}%</span>
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full",
                                item.percent === 100
                                  ? "bg-emerald-500"
                                  : item.percent > 50
                                  ? "bg-amber-500"
                                  : item.percent > 0
                                  ? "bg-blue-500"
                                  : "bg-slate-300 dark:bg-slate-600",
                              )}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>

              {/* Inspector Card */}
              <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                <CardHeader className="p-3 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setInspectorTab("Properties")}
                      className={cn(
                        "pb-1 cursor-pointer border-b-2 transition-all",
                        inspectorTab === "Properties" ? "border-primary text-primary" : "border-transparent text-muted-foreground",
                      )}
                    >
                      Properties
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectorTab("Links")}
                      className={cn(
                        "pb-1 cursor-pointer border-b-2 transition-all",
                        inspectorTab === "Links" ? "border-primary text-primary" : "border-transparent text-muted-foreground",
                      )}
                    >
                      Links & Dependencies
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="p-3 text-xs space-y-3">
                  {inspectorTab === "Properties" ? (
                    <>
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">
                          General
                        </span>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">WBS Code</span>
                          <span className="font-mono font-bold text-primary">{selectedWbs.code}</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">WBS Name</span>
                          <span className="font-medium text-foreground truncate max-w-[150px]">{selectedWbs.name}</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">WBS Type</span>
                          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700">
                            {selectedWbs.type}
                          </Badge>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Parent WBS</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {selectedWbs.parentCode || "None"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-border/40">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">
                          Financials
                        </span>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Budget</span>
                          <span className="font-bold font-mono">{selectedWbs.budget}</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Actual</span>
                          <span className="font-mono text-slate-700 dark:text-slate-300">{selectedWbs.actual}</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Remaining</span>
                          <span className="font-bold font-mono text-emerald-600">{selectedWbs.remaining}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="p-2 rounded-lg border space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground block">Predecessor WBS</span>
                        <p className="font-semibold text-slate-900 dark:text-white">2.2.2 Electronics Design</p>
                        <Badge variant="outline" className="text-[9px] bg-blue-50 text-blue-700">85% Complete</Badge>
                      </div>
                      <div className="p-2 rounded-lg border space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground block">Linked Milestone</span>
                        <p className="font-semibold text-emerald-600 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> M-003 Design Freeze
                        </p>
                      </div>
                      <div className="p-2 rounded-lg border space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground block">ERP Work Order</span>
                        <p className="font-mono font-bold text-slate-900 dark:text-white">WO-2026-ENG-089</p>
                      </div>
                    </div>
                  )}
                </CardContent>

                <div className="p-3 border-t border-border/40 grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditWbsData({ ...selectedWbs });
                      setIsEditWbsOpen(true);
                    }}
                    className="h-8 text-xs cursor-pointer hover:bg-primary/10"
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1 text-slate-500" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyWbs}
                    className="h-8 text-xs cursor-pointer hover:bg-primary/10"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1 text-slate-500" /> Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDeleteWbs}
                    className="h-8 text-xs cursor-pointer text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </Card>
            </div>

            {/* ------------------------------------------------------------------
               COLUMN 2: SELECTED WBS DETAILS, ACTIVITIES & DELIVERABLES (8 cols)
               ------------------------------------------------------------------ */}
            <div className="lg:col-span-8 space-y-4">
              {/* 1. Scope & Execution Header */}
              <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                <CardHeader className="p-4 pb-3 border-b border-border/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-base text-primary">
                          {selectedWbs.code}
                        </span>
                        <h3 className="font-bold text-base text-foreground">
                          {selectedWbs.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-semibold",
                            selectedWbs.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : selectedWbs.status === "In Progress"
                              ? "bg-blue-50 text-blue-700 border-blue-300"
                              : "bg-slate-100 text-slate-700 border-slate-300",
                          )}
                        >
                          {selectedWbs.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedWbs.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => setIsAddActivityOpen(true)}
                        className="gap-1.5 h-8 text-xs bg-[#0B3B7B] hover:bg-[#082B5B] text-white cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Activity
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsAddDeliverableOpen(true)}
                        className="gap-1.5 h-8 text-xs cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Deliverable
                      </Button>
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-border/40 text-xs">
                    <div>
                      <span className="text-muted-foreground text-[10px] uppercase font-semibold block">Planned Timeline</span>
                      <span className="font-medium text-foreground">{selectedWbs.plannedStart} → {selectedWbs.plannedFinish}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[10px] uppercase font-semibold block">Duration & Calendar</span>
                      <span className="font-medium text-foreground">{selectedWbs.duration} ({selectedWbs.calendar})</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[10px] uppercase font-semibold block">Budget vs Actual</span>
                      <span className="font-mono font-bold text-foreground">{selectedWbs.budget} <span className="font-normal text-muted-foreground">/ {selectedWbs.actual}</span></span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[10px] uppercase font-semibold block">% Complete</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-bold font-mono text-primary">{selectedWbs.percent}%</span>
                        <Progress value={selectedWbs.percent} className="h-1.5 flex-1" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* 2. Activities Register Table */}
              <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Work Package Activities ({selectedWbs.activities.length})
                    </CardTitle>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsAddActivityOpen(true)}
                    className="h-7 text-xs text-primary font-semibold gap-1 hover:bg-primary/10 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> New Activity
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="w-full overflow-x-auto">
                    <table className="w-full table-fixed text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border/60 bg-muted/40 text-[11px] text-muted-foreground">
                          <th className="p-2.5 pl-4 font-semibold w-24">Code</th>
                          <th className="p-2.5 font-semibold">Activity Name</th>
                          <th className="p-2.5 font-semibold w-28">Owner</th>
                          <th className="p-2.5 font-semibold w-28">Duration</th>
                          <th className="p-2.5 font-semibold w-28">% Complete</th>
                          <th className="p-2.5 font-semibold w-24">Status</th>
                          <th className="p-2.5 pr-4 font-semibold text-right w-16">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {selectedWbs.activities.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-6 text-center text-muted-foreground text-xs">
                              No activities created for this WBS element.
                            </td>
                          </tr>
                        ) : (
                          selectedWbs.activities.map((act) => (
                            <tr key={act.id} className="hover:bg-muted/20 transition-colors">
                              <td className="p-2.5 pl-4 font-mono font-bold text-primary">{act.id}</td>
                              <td className="p-2.5 font-medium text-foreground">{act.name}</td>
                              <td className="p-2.5 text-muted-foreground">{act.owner || selectedWbs.owner}</td>
                              <td className="p-2.5 font-mono text-[11px] text-muted-foreground">{act.duration}</td>
                              <td className="p-2.5">
                                <div className="flex items-center gap-1.5 w-20">
                                  <span className="font-mono text-[11px] font-bold">{act.percent}%</span>
                                  <Progress value={act.percent} className="h-1.5 flex-1" />
                                </div>
                              </td>
                              <td className="p-2.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleActivityStatus(act.id)}
                                  className="cursor-pointer"
                                >
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-[10px] cursor-pointer",
                                      act.status === "Completed"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                        : act.status === "In Progress"
                                        ? "bg-blue-50 text-blue-700 border-blue-300"
                                        : "bg-slate-100 text-slate-700 border-slate-300",
                                    )}
                                  >
                                    {act.status}
                                  </Badge>
                                </button>
                              </td>
                              <td className="p-2.5 pr-4 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteActivity(act.id)}
                                  className="h-6 w-6 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                  title="Delete Activity"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Deliverables & Documentation Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Deliverables Card */}
                <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                  <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Deliverables ({selectedWbs.deliverables.length})
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsAddDeliverableOpen(true)}
                      className="h-7 text-xs text-primary font-semibold gap-1 hover:bg-primary/10 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </Button>
                  </CardHeader>
                  <CardContent className="p-3 text-xs space-y-2">
                    {selectedWbs.deliverables.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No deliverables defined.</p>
                    ) : (
                      selectedWbs.deliverables.map((del) => (
                        <div key={del.id} className="p-2 rounded-lg border flex items-center justify-between gap-2 hover:bg-muted/20">
                          <div className="flex items-center gap-2 min-w-0">
                            <button
                              type="button"
                              onClick={() => handleToggleDeliverable(del.id)}
                              className="cursor-pointer"
                            >
                              <CheckCircle2
                                className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  del.status === "Complete" ? "text-emerald-600" : "text-slate-300 hover:text-slate-400",
                                )}
                              />
                            </button>
                            <div className="truncate">
                              <span className="font-medium text-foreground truncate block">{del.name}</span>
                              <span className="text-[10px] text-muted-foreground block font-mono">Status: {del.status}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[9px]",
                                del.status === "Complete" ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-blue-50 text-blue-700 border-blue-300",
                              )}
                            >
                              {del.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDeliverable(del.id)}
                              className="h-6 w-6 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                              title="Delete Deliverable"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Notes & Technical Observations Card */}
                <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
                  <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Engineering Notes & Specs
                    </CardTitle>
                    <Button size="sm" onClick={handleSaveNotes} className="h-7 text-xs bg-primary text-white cursor-pointer">
                      Save Notes
                    </Button>
                  </CardHeader>
                  <CardContent className="p-3 text-xs flex-1 flex flex-col justify-between space-y-2">
                    <textarea
                      value={wbsNotes[selectedWbs.code] || ""}
                      onChange={(e) => setWbsNotes({ ...wbsNotes, [selectedWbs.code]: e.target.value })}
                      placeholder="Enter technical observations, design decisions, or supplier specifications..."
                      className="w-full flex-1 min-h-[110px] p-2.5 rounded-lg border border-input text-xs bg-slate-50 dark:bg-slate-800 leading-relaxed font-sans"
                    />
                    <p className="text-[10px] text-muted-foreground">Notes are linked to WBS baseline {selectedWbs.code}.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          /* ====================================================================
             4. BOTTOM ROW (4 ANALYTICS CARDS): PROGRESS, DISTRIBUTION, BUDGET, TOP 5
             ==================================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: WBS Progress */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  WBS Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#0284c7" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="100" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="160" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">54.8%</span>
                    <span className="text-[8px] text-muted-foreground uppercase">Overall</span>
                  </div>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div
                    onClick={() => { setFilterStatus("Completed"); toast.info("Filtered by Completed WBS"); }}
                    className="flex justify-between items-center cursor-pointer hover:bg-muted/30 p-1 rounded transition-colors"
                  >
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Completed</span>
                    <span className="font-mono text-muted-foreground">12 (28.6%)</span>
                  </div>
                  <div
                    onClick={() => { setFilterStatus("In Progress"); toast.info("Filtered by In Progress WBS"); }}
                    className="flex justify-between items-center cursor-pointer hover:bg-muted/30 p-1 rounded transition-colors"
                  >
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-blue-500" /> In Progress</span>
                    <span className="font-mono text-muted-foreground">18 (42.9%)</span>
                  </div>
                  <div
                    onClick={() => { setFilterStatus("Planned"); toast.info("Filtered by Planned WBS"); }}
                    className="flex justify-between items-center cursor-pointer hover:bg-muted/30 p-1 rounded transition-colors"
                  >
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-amber-500" /> Planned</span>
                    <span className="font-mono text-muted-foreground">8 (19.0%)</span>
                  </div>
                  <div
                    onClick={() => { setFilterStatus("All"); toast.info("Showing all WBS elements"); }}
                    className="flex justify-between items-center cursor-pointer hover:bg-muted/30 p-1 rounded transition-colors"
                  >
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-rose-500" /> Reset Status</span>
                    <span className="font-mono text-primary font-semibold">View All</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Type Distribution */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="70" />
                    <circle cx="50" cy="50" r="38" stroke="#06b6d4" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="140" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">42</span>
                    <span className="text-[8px] text-muted-foreground uppercase">Total</span>
                  </div>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div
                    onClick={() => { setFilterType("Phase"); toast.info("Filtered by Phase"); }}
                    className="flex justify-between items-center cursor-pointer hover:bg-muted/30 p-0.5 rounded"
                  >
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-blue-500" /> Phase</span>
                    <span className="font-mono text-muted-foreground">7 (16.7%)</span>
                  </div>
                  <div
                    onClick={() => { setFilterType("Deliverable"); toast.info("Filtered by Deliverable"); }}
                    className="flex justify-between items-center cursor-pointer hover:bg-muted/30 p-0.5 rounded"
                  >
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Deliverable</span>
                    <span className="font-mono text-muted-foreground">9 (21.4%)</span>
                  </div>
                  <div
                    onClick={() => { setFilterType("Work Package"); toast.info("Filtered by Work Package"); }}
                    className="flex justify-between items-center cursor-pointer hover:bg-muted/30 p-0.5 rounded"
                  >
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-purple-600" /> Work Package</span>
                    <span className="font-mono text-muted-foreground">18 (42.9%)</span>
                  </div>
                  <div
                    onClick={() => { setFilterType("All"); toast.info("Showing all types"); }}
                    className="flex justify-between items-center cursor-pointer hover:bg-muted/30 p-0.5 rounded"
                  >
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-amber-500" /> Reset Filter</span>
                    <span className="font-mono text-primary font-semibold">View All</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Budget by WBS Type */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Budget by WBS Type
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#6366f1" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="90" />
                    <circle cx="50" cy="50" r="38" stroke="#f43f5e" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="180" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">₹ 1.67 Cr</span>
                    <span className="text-[8px] text-muted-foreground uppercase">Total Budget</span>
                  </div>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-blue-500" /> Phase</span>
                    <span className="font-mono text-muted-foreground">₹0.25 Cr (15%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Deliverable</span>
                    <span className="font-mono text-muted-foreground">₹0.40 Cr (24%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-purple-600" /> Work Package</span>
                    <span className="font-mono text-muted-foreground">₹0.72 Cr (43%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-rose-500" /> Activity Pool</span>
                    <span className="font-mono text-muted-foreground">₹0.30 Cr (18%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Top 5 WBS by Budget */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Top 5 WBS by Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2.5">
                {[
                  { name: "3.0 Procurement", budget: "₹ 0.85 Cr", pct: 100 },
                  { name: "4.0 Production", budget: "₹ 0.32 Cr", pct: 38 },
                  { name: "2.0 Engineering", budget: "₹ 0.18 Cr", pct: 21 },
                  { name: "5.0 Installation", budget: "₹ 0.18 Cr", pct: 21 },
                  { name: "1.0 Project Management", budget: "₹ 0.12 Cr", pct: 14 },
                ].map((item) => (
                  <div key={item.name} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
                      <span className="font-mono font-bold text-primary shrink-0">{item.budget}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div style={{ width: `${item.pct}%` }} className="bg-primary h-2 rounded-full transition-all" />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => navigate({ to: "/management/project-management/budget-control" })}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block text-left pt-1"
                >
                  View full budget control report →
                </button>
              </CardContent>
            </Card>
          </div>

        {/* ====================================================================
           MODALS
           ==================================================================== */}

        {/* 1. Add Activity Modal */}
        <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Add Activity to WBS {selectedWbs.code}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Define an executable activity within {selectedWbs.name}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddActivity} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Activity Name:</label>
                <Input
                  value={newActivityName}
                  onChange={(e) => setNewActivityName(e.target.value)}
                  placeholder="e.g. Enclosure Finite Element Analysis (FEA)"
                  className="h-8 text-xs"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Planned Start:</label>
                  <Input
                    value={newActivityStart}
                    onChange={(e) => setNewActivityStart(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Planned Finish:</label>
                  <Input
                    value={newActivityFinish}
                    onChange={(e) => setNewActivityFinish(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Duration:</label>
                <Input
                  value={newActivityDuration}
                  onChange={(e) => setNewActivityDuration(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsAddActivityOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Add Activity
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 2. Add Deliverable Modal */}
        <Dialog open={isAddDeliverableOpen} onOpenChange={setIsAddDeliverableOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Add Deliverable to WBS {selectedWbs.code}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Register a deliverable artifact for work package acceptance.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDeliverable} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Deliverable Name:</label>
                <Input
                  value={newDeliverableName}
                  onChange={(e) => setNewDeliverableName(e.target.value)}
                  placeholder="e.g. Electrical Busbar Thermal Simulation Report"
                  className="h-8 text-xs"
                  required
                />
              </div>
              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsAddDeliverableOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Add Deliverable
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 3. Create WBS Element Modal */}
        <Dialog open={isCreateWbsOpen} onOpenChange={setIsCreateWbsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Create WBS Element
              </DialogTitle>
              <DialogDescription className="text-xs">
                Decompose scope under parent {selectedWbs.code} ({selectedWbs.name}).
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateWbsElement} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">WBS Code:</label>
                <Input
                  value={createWbsCode}
                  onChange={(e) => setCreateWbsCode(e.target.value)}
                  placeholder="e.g. 2.2.5"
                  className="h-8 text-xs font-mono"
                  required
                />
              </div>
              <div>
                <label className="font-bold block mb-1">WBS Name:</label>
                <Input
                  value={createWbsName}
                  onChange={(e) => setCreateWbsName(e.target.value)}
                  placeholder="e.g. Ingress Protection & Thermal Validation"
                  className="h-8 text-xs"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">WBS Type:</label>
                  <select
                    value={createWbsType}
                    onChange={(e) => setCreateWbsType(e.target.value as any)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Work Package">Work Package</option>
                    <option value="Deliverable">Deliverable</option>
                    <option value="Phase">Phase</option>
                    <option value="Activity">Activity</option>
                    <option value="Milestone">Milestone</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Allocated Budget:</label>
                  <Input
                    value={createWbsBudget}
                    onChange={(e) => setCreateWbsBudget(e.target.value)}
                    placeholder="e.g. ₹ 3.50 L"
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Owner:</label>
                <Input
                  value={createWbsOwner}
                  onChange={(e) => setCreateWbsOwner(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsCreateWbsOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Create Element
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 4. Edit WBS Element Modal */}
        <Dialog open={isEditWbsOpen} onOpenChange={setIsEditWbsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-primary" />
                Edit WBS Element — {editWbsData?.code}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update work package scope definition and execution parameters.
              </DialogDescription>
            </DialogHeader>
            {editWbsData && (
              <form onSubmit={handleSaveEditWbs} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold block mb-1">WBS Name:</label>
                  <Input
                    value={editWbsData.name}
                    onChange={(e) => setEditWbsData({ ...editWbsData, name: e.target.value })}
                    className="h-8 text-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold block mb-1">Status:</label>
                    <select
                      value={editWbsData.status}
                      onChange={(e) => setEditWbsData({ ...editWbsData, status: e.target.value as any })}
                      className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                    >
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold block mb-1">% Complete:</label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={editWbsData.percent}
                      onChange={(e) => setEditWbsData({ ...editWbsData, percent: Number(e.target.value) })}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold block mb-1">Owner:</label>
                    <Input
                      value={editWbsData.owner}
                      onChange={(e) => setEditWbsData({ ...editWbsData, owner: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Budget:</label>
                    <Input
                      value={editWbsData.budget}
                      onChange={(e) => setEditWbsData({ ...editWbsData, budget: e.target.value })}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2 pt-2">
                  <Button size="sm" variant="outline" type="button" onClick={() => setIsEditWbsOpen(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* 5. Freeze Baseline Modal */}
        <Dialog open={isBaselineOpen} onOpenChange={setIsBaselineOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-primary" />
                Freeze WBS Baseline
              </DialogTitle>
              <DialogDescription className="text-xs">
                Lock hierarchical work decomposition baseline for PRJ-2026-0195.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateBaseline} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Baseline Revision Tag:</label>
                <Input
                  value={baselineTag}
                  onChange={(e) => setBaselineTag(e.target.value)}
                  className="h-8 text-xs font-mono"
                  required
                />
              </div>
              <div className="p-3 rounded bg-muted text-[11px] space-y-1">
                <p>• All {wbsList.length} WBS Elements will be frozen as Version {baselineTag}.</p>
                <p>• Future scope modifications will require a formal Change Request (CR).</p>
              </div>
              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsBaselineOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Confirm Baseline
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 6. Tree Validation Modal */}
        <Dialog open={isValidationOpen} onOpenChange={setIsValidationOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                WBS Tree Hierarchy Validation
              </DialogTitle>
              <DialogDescription className="text-xs">
                Algorithmic parent-child decomposition audit for PRJ-2026-0195.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" /> 100% Scope Decomposition Integrity
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  Zero orphaned work packages detected. All 42 elements strictly trace to Level 1 Phase parents.
                </p>
              </div>
              <div className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                <div className="flex justify-between py-1 border-b">
                  <span>Level 1 Root Phases:</span>
                  <span className="font-mono font-bold">7</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Level 2 Deliverables:</span>
                  <span className="font-mono font-bold">9</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Level 3 Work Packages:</span>
                  <span className="font-mono font-bold">18</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Critical Path Trace:</span>
                  <span className="font-mono font-bold text-emerald-600">Zero Float Passed</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsValidationOpen(false)} className="bg-primary text-white">
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default WbsFormPage;

