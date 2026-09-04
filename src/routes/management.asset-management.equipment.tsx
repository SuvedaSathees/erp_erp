import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AssetManagementTabBar } from "@/components/erp/AssetManagementTabBar";
import { DataTablePagination } from "@/components/erp/DataTablePagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  PauseCircle,
  ShieldAlert,
  Gauge,
  Calendar,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Plus,
  ChevronDown,
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Edit2,
  QrCode,
  Printer,
  Maximize2,
  X,
  Sparkles,
  Hourglass,
  MapPin,
  User,
  Clock,
  Activity,
  Layers,
  Check,
  Zap,
  MoreVertical,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/management/asset-management/equipment")({
  head: () => ({
    meta: [
      { title: "Equipment Form · Magnertia ERP" },
      {
        name: "description",
        content: "Operational equipment lifecycle management: specifications, assignment, utilization, maintenance, and calibration.",
      },
    ],
  }),
  component: EquipmentFormPage,
});

interface EquipmentItem {
  id: string;
  code?: string;
  name: string;
  category: string;
  location: string;
  operator: string;
  utilization: number;
  condition: "New" | "Good" | "Fair" | "Poor";
  status: "Active" | "Maintenance" | "Idle" | "Calibration" | "Retired";
  nextMaintenance: string;
  model: string;
  serialNo: string;
  assetId: string;
  installDate: string;
  commissionDate: string;
  custodian: string;
  operatingHours: number;
  nextCalibration: string;
  warrantyExpiry: string;
  criticality: "Critical" | "High" | "Medium" | "Low";
  manufacturer?: string;
}

const BASE_EQUIPMENT_TEMPLATES = [
  { name: "CNC Vertical Machining Center", category: "Production Equipment", location: "Plant 01 - Machine Shop", model: "VMC-850", prefix: "CNC", crit: "Critical" as const, hours: 4820 },
  { name: "Forklift 3 Ton", category: "Material Handling", location: "Warehouse - Aisle 02", model: "FL-3000X", prefix: "FLT", crit: "High" as const, hours: 3240 },
  { name: "Air Compressor 75kW", category: "Utility Equipment", location: "Utility Bay - Plant 01", model: "AC-75K", prefix: "CMP", crit: "High" as const, hours: 6120 },
  { name: "Laser Cutting Machine 6kW", category: "Production Equipment", location: "Plant 02 - Sheet Metal", model: "FLC-6000", prefix: "LSR", crit: "Critical" as const, hours: 2980 },
  { name: "Coordinate Measuring Machine", category: "Testing Equipment", location: "QA Metrology Lab", model: "CMM-Bridge-8", prefix: "CMM", crit: "High" as const, hours: 1840 },
  { name: "Hydraulic Stamping Press 200T", category: "Production Equipment", location: "Plant 01 - Press Shop", model: "HP-200T", prefix: "PRS", crit: "Critical" as const, hours: 5600 },
  { name: "Robotic Welding Station", category: "Production Equipment", location: "Plant 02 - Welding Bay", model: "MIG-400X", prefix: "WLD", crit: "Medium" as const, hours: 3780 },
  { name: "Online Industrial UPS 20kVA", category: "Electrical Equipment", location: "Data Center - 01", model: "UPS-20K", prefix: "UPS", crit: "Critical" as const, hours: 5400 },
  { name: "Automated Guided Vehicle (AGV)", category: "Material Handling", location: "Assembly Line 01", model: "AGV-200", prefix: "AGV", crit: "Medium" as const, hours: 2150 },
  { name: "Overhead EOT Crane 10 Ton", category: "Material Handling", location: "Heavy Fabrication Bay", model: "EOT-10T", prefix: "CRN", crit: "High" as const, hours: 4200 },
  { name: "Injection Molding Press 350T", category: "Production Equipment", location: "Plastics Plant 02", model: "IMM-350", prefix: "IMM", crit: "Critical" as const, hours: 6400 },
  { name: "Diesel Backup Generator 500kVA", category: "Utility Equipment", location: "Power Yard", model: "DG-500", prefix: "GEN", crit: "High" as const, hours: 1450 },
  { name: "Precision Surface Grinder", category: "Production Equipment", location: "Tool Room B", model: "PSG-500", prefix: "GRD", crit: "Medium" as const, hours: 3100 },
  { name: "Tensile Strength Testing Bench", category: "Testing Equipment", location: "Materials Testing Lab", model: "UTM-100", prefix: "UTM", crit: "High" as const, hours: 1200 },
  { name: "Electric Stacker 1.5 Ton", category: "Material Handling", location: "Finished Goods Bay", model: "STK-15", prefix: "STK", crit: "Low" as const, hours: 2700 },
  { name: "High Voltage Transformer 11kV", category: "Electrical Equipment", location: "Substation 01", model: "XFR-11K", prefix: "XFR", crit: "Critical" as const, hours: 8760 },
];

const INITIAL_EQUIPMENT: EquipmentItem[] = Array.from({ length: 186 }, (_, i) => {
  const tpl = BASE_EQUIPMENT_TEMPLATES[i % BASE_EQUIPMENT_TEMPLATES.length];
  const numStr = String(i + 1).padStart(5, "0");
  const id = `EQ-${tpl.prefix}-${numStr}`;
  const year = 2026 - (i % 5);
  const status: "Active" | "Maintenance" | "Idle" =
    i % 16 === 0 ? "Maintenance" :
    i % 19 === 0 ? "Idle" : "Active";

  const condition: "Good" | "Fair" | "Poor" =
    status === "Maintenance" ? "Fair" :
    status === "Idle" ? "Fair" : "Good";

  const utilization =
    status === "Active" ? 75 + (i % 23) :
    status === "Maintenance" ? 10 : 0;

  return {
    id,
    code: id,
    name: i < BASE_EQUIPMENT_TEMPLATES.length ? tpl.name : `${tpl.name} Unit #${Math.floor(i / BASE_EQUIPMENT_TEMPLATES.length) + 1}`,
    category: tpl.category as any,
    location: tpl.location,
    operator: `Operator ${(i % 18) + 1}`,
    utilization,
    condition,
    status,
    nextMaintenance: `${((i * 3) % 28) + 1} Oct 2026`,
    model: tpl.model,
    serialNo: `${tpl.prefix}-${year}-${numStr}`,
    assetId: `FA-EQP-${numStr}`,
    installDate: `15 Jan ${year}`,
    commissionDate: `20 Jan ${year}`,
    custodian: "Plant Superintendent",
    operatingHours: tpl.hours + (i * 45),
    nextCalibration: `${((i * 5) % 28) + 1} Nov 2026`,
    warrantyExpiry: `15 Jan ${year + 4}`,
    criticality: tpl.crit,
    manufacturer: "Haas Automation",
  };
});

export function EquipmentFormPage() {
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT);
  const [activeItem, setActiveItem] = useState<EquipmentItem>(INITIAL_EQUIPMENT[0]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExportCsv = () => {
    const headers = ["Equipment Code", "Name", "Category", "Location", "Status", "Asset ID", "Manufacturer", "Criticality"];
    const rows = equipmentList.map(eq => [
      eq.code || eq.id,
      `"${eq.name}"`,
      `"${eq.category}"`,
      `"${eq.location}"`,
      eq.status,
      eq.assetId,
      `"${eq.manufacturer || "Haas Automation"}"`,
      eq.criticality
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Equipment_Master_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Equipment Master exported as CSV successfully!");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Equipment register & sensor telemetry synchronized!");
    }, 600);
  };

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isMaintOpen, setIsMaintOpen] = useState(false);
  const [isCalibOpen, setIsCalibOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Create Equipment form
  const [newEq, setNewEq] = useState({
    name: "CNC Vertical Machining Center",
    category: "Production Equipment",
    type: "CNC Machining Center",
    equipmentClass: "Manufacturing Equipment",
    assetId: "FA-PLT-00241",
    code: "EQ-CNC-00241",
    tag: "EQ-TAG-00241",
    serialNo: "VMC-2026-00871",
    manufacturer: "Haas Automation",
    model: "VMC-850",
    capacity: "850 × 500 × 500 mm",
    supplier: "Makino Machinery India",
    po: "PO-2026-0148",
    purchaseDate: "2026-09-01",
    installationDate: "2026-09-10",
    commissioningDate: "2026-09-15",
    department: "Production",
    costCenter: "CC-PRD-001",
    location: "Plant 01 - Machine Shop",
    custodian: "Production Manager",
    operator: "Operator 01",
    project: "PRJ-2026-0195",
  });

  // Filter items
  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((item) => {
      const matchSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.operator.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedFilter === "All") return matchSearch;
      if (selectedFilter === "Active") return matchSearch && item.status === "Active";
      if (selectedFilter === "Maintenance") return matchSearch && item.status === "Maintenance";
      if (selectedFilter === "Idle") return matchSearch && item.status === "Idle";
      if (selectedFilter === "Critical") return matchSearch && item.criticality === "Critical";
      if (selectedFilter === "Calibration Due") return matchSearch && item.status === "Calibration";
      if (selectedFilter === "Inspection Due") return matchSearch && item.utilization >= 85;
      return matchSearch;
    });
  }, [equipmentList, searchQuery, selectedFilter]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  // Paginated Equipment
  const totalPages = Math.max(1, Math.ceil(filteredEquipment.length / pageSize));
  const paginatedEquipment = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEquipment.slice(start, start + pageSize);
  }, [filteredEquipment, currentPage, pageSize]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: EquipmentItem = {
      id: newEq.code,
      name: newEq.name,
      category: newEq.category,
      location: newEq.location,
      operator: newEq.operator,
      utilization: 85,
      condition: "New",
      status: "Active",
      nextMaintenance: "15 Oct 2026",
      model: newEq.model,
      serialNo: newEq.serialNo,
      assetId: newEq.assetId,
      installDate: newEq.installationDate,
      commissionDate: newEq.commissioningDate,
      custodian: newEq.custodian,
      operatingHours: 0,
      nextCalibration: "15 Oct 2026",
      warrantyExpiry: "14 Sep 2029",
      criticality: "Critical",
    };
    setEquipmentList([created, ...equipmentList]);
    setActiveItem(created);
    setIsCreateOpen(false);
    toast.success(`Equipment ${created.id} registered and activated successfully!`);
  };

  return (
    <AppShell
      title="Equipment Form"
      breadcrumb="Management > Asset Management > Equipment"
      description="Manage operational equipment throughout its lifecycle with maintenance, calibration and utilization."
      tabs={<AssetManagementTabBar />}
    >
      <div className="w-full space-y-4">
        {/* ====================================================================
           1. ACTION HEADER CARD
           ==================================================================== */}
        <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-3 flex-nowrap">
            {/* Title in Single Line */}
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Equipment Form
              </h1>
              <span className="text-xs text-muted-foreground truncate hidden 2xl:inline">
                &bull; Manage operational equipment throughout its lifecycle with maintenance and utilization
              </span>
            </div>

            {/* Header Right Actions in Single Line */}
            <div className="flex items-center gap-1.5 shrink-0 flex-nowrap">
              {/* Date Range Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-semibold rounded-lg border border-border/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer whitespace-nowrap"
                  >
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{dateRange}</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 text-xs">
                  <DropdownMenuItem onClick={() => { setDateRange("01 Sep 2026 - 30 Sep 2026"); toast.success("Selected Current Month: Sep 2026"); }}>
                    September 2026 (Current Month)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDateRange("01 Aug 2026 - 31 Aug 2026"); toast.success("Selected Previous Month: Aug 2026"); }}>
                    August 2026 (Previous Month)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDateRange("01 Jul 2026 - 30 Sep 2026"); toast.success("Selected Q3 2026"); }}>
                    Q3 2026 (Quarter-to-Date)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDateRange("01 Apr 2026 - 31 Mar 2027"); toast.success("Selected Fiscal Year 2026-27"); }}>
                    FY 2026-27 (Full Fiscal Year)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-primary")} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1 cursor-pointer">
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Export</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 text-xs">
                  <DropdownMenuItem onClick={handleExportCsv}>
                    Export to CSV (.csv)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { handleExportCsv(); toast.success("Exported Equipment Master (.xlsx)"); }}>
                    Export to Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { window.print(); }}>
                    Print / Export PDF (.pdf)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reports Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1 cursor-pointer">
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                    <span>Reports</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 text-xs">
                  <DropdownMenuItem onClick={() => toast.info("Opening OEE & Equipment Utilization Report...")}>
                    OEE & Utilization Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Maintenance Work Order Log...")}>
                    Maintenance Work Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Calibration Due Schedule...")}>
                    Calibration Due Schedule
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* + Create Equipment Primary Button */}
              <Button
                onClick={() => setIsCreateOpen(true)}
                size="sm"
                className="h-8 px-3 bg-[#0B3B7B] hover:bg-[#082B5B] text-white text-xs gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Equipment</span>
              </Button>

              {/* More Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1 cursor-pointer">
                    <span>More Actions</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 text-xs">
                  <DropdownMenuItem onClick={() => toast.info("Import Equipment: Select CSV / Excel file")}>
                    Import Equipment
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsSpecsOpen(true)}>
                    Technical Specifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsMaintOpen(true)}>
                    Schedule Preventive Maint.
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsCalibOpen(true)}>
                    Calibration Log
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { window.print(); }}>
                    Print Equipment QR Tags
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* ====================================================================
           2. TOP 6 METRIC KPI CARDS (Matching exact layout from screenshot)
           ==================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Total Equipment */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Total Equipment</span>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Wrench className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">186</span>
              <span className="block text-[10px] text-muted-foreground font-medium">All Equipment</span>
            </div>
          </div>

          {/* Card 2: Active Equipment */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Active Equipment</span>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-600">164</span>
              <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                88.17% of Total
              </span>
            </div>
          </div>

          {/* Card 3: Under Maintenance */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Under Maintenance</span>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-amber-600">12</span>
              <span className="block text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                6.45% of Total
              </span>
            </div>
          </div>

          {/* Card 4: Idle Equipment */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Idle Equipment</span>
              <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <PauseCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-purple-600">10</span>
              <span className="block text-[10px] text-purple-700 dark:text-purple-400 font-medium">
                5.38% of Total
              </span>
            </div>
          </div>

          {/* Card 5: Critical Equipment */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Critical Equipment</span>
              <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-rose-600">18</span>
              <span className="block text-[10px] text-rose-700 dark:text-rose-400 font-medium">
                High Criticality
              </span>
            </div>
          </div>

          {/* Card 6: Plant Fleet OEE */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Plant Fleet OEE</span>
              <div className="h-8 w-8 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <Gauge className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-teal-600">86.4%</span>
              <span className="block text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                Avail 92.1% &bull; Perf 95.8%
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================================
           3. MIDDLE SECTION (4 CARDS: Compact, Small & Balanced)
           ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Equipment by Category (Compact Side-by-Side Donut) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Equipment by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-3">
                {/* Compact Donut */}
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="133.5" />
                    <circle cx="50" cy="50" r="38" stroke="#06b6d4" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="186.1" />
                    <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="222.0" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="246.4" />
                    <circle cx="50" cy="50" r="38" stroke="#64748b" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="260.5" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">186</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Total</span>
                  </div>
                </div>

                {/* Compact Legend */}
                <div className="flex-1 space-y-1 text-[10px]">
                  {[
                    { name: "Production", count: "82", color: "bg-blue-600" },
                    { name: "Material Handling", count: "41", color: "bg-emerald-500" },
                    { name: "Electrical", count: "28", color: "bg-cyan-500" },
                    { name: "Testing & Labs", count: "19", color: "bg-purple-500" },
                    { name: "Utility", count: "11", color: "bg-amber-500" },
                    { name: "Other Fleet", count: "5", color: "bg-slate-500" },
                  ].map((item) => (
                    <div key={item.name} className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate">
                        <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", item.color)} />
                        <span className="truncate">{item.name}</span>
                      </span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[10px] ml-1">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1.5 border-t border-border/40 text-muted-foreground">
                <span>Fleet Operational: <strong className="text-emerald-600 font-mono">88.2%</strong></span>
                <span>Critical: <strong className="text-primary font-mono">18 Units</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Equipment Status (Compact Bar Chart) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Equipment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="h-24 flex items-end justify-between gap-2 px-1 pt-1 pb-1 border-b border-border/30">
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-bold font-mono text-emerald-600">164</span>
                  <div className="w-full bg-emerald-500 rounded-t-sm" style={{ height: "60px" }} />
                  <span className="text-[8.5px] text-muted-foreground font-medium mt-0.5">Active</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-bold font-mono text-amber-600">12</span>
                  <div className="w-full bg-amber-500 rounded-t-sm" style={{ height: "14px" }} />
                  <span className="text-[8.5px] text-muted-foreground font-medium mt-0.5">Maint.</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-bold font-mono text-purple-600">10</span>
                  <div className="w-full bg-purple-500 rounded-t-sm" style={{ height: "11px" }} />
                  <span className="text-[8.5px] text-muted-foreground font-medium mt-0.5">Idle</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-bold font-mono text-rose-600">0</span>
                  <div className="w-full bg-rose-500 rounded-t-sm" style={{ height: "3px" }} />
                  <span className="text-[8.5px] text-muted-foreground font-medium mt-0.5">Retired</span>
                </div>
              </div>

              {/* Status Breakdown Detail List */}
              <div className="space-y-1 text-[10px]">
                <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-emerald-50/60 dark:bg-emerald-950/20">
                  <span className="flex items-center gap-1 font-medium text-emerald-800 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> In Active Production
                  </span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">164 (88.2%)</span>
                </div>
                <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-amber-50/60 dark:bg-amber-950/20">
                  <span className="flex items-center gap-1 font-medium text-amber-800 dark:text-amber-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Scheduled Servicing
                  </span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-300">12 (6.5%)</span>
                </div>
                <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-purple-50/60 dark:bg-purple-950/20">
                  <span className="flex items-center gap-1 font-medium text-purple-800 dark:text-purple-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Standby & Tool Crib
                  </span>
                  <span className="font-mono font-bold text-purple-700 dark:text-purple-300">10 (5.4%)</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1 border-t border-border/30 text-muted-foreground">
                <span>Availability: <strong className="font-mono font-bold text-emerald-600">93.5%</strong></span>
                <span>Critical Fleet: <strong className="font-mono font-bold text-rose-600">18 Units</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Maintenance Summary (Compact) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Maintenance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1.5">
              <div className="space-y-1 text-[10.5px]">
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/40">
                  <span className="text-muted-foreground">Due Today</span>
                  <span className="font-mono font-bold text-rose-600">3</span>
                </div>
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40">
                  <span className="text-muted-foreground">Due This Week</span>
                  <span className="font-mono font-bold text-amber-600">8</span>
                </div>
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-muted/20">
                  <span className="text-muted-foreground">Due This Month</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">16</span>
                </div>
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/40">
                  <span className="text-muted-foreground">Overdue</span>
                  <span className="font-mono font-bold text-rose-600">5</span>
                </div>
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/40">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span className="font-mono font-bold text-blue-600">24</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toast.info("Opening Maintenance Work Order Schedule")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer block pt-1 text-center w-full"
              >
                View Maintenance Calendar &rarr;
              </button>
            </CardContent>
          </Card>

          {/* Card 4: Equipment Health Score Gauge (Compact) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Equipment Health Score
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex flex-col justify-between items-center text-center space-y-1.5">
              {/* Compact Semi-Circle Speedometer Gauge */}
              <div className="relative w-44 h-24 mt-1 flex items-center justify-center">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 180 98">
                  <defs>
                    <linearGradient id="eqHealthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="70%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <filter id="eqHealthGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {/* Outer subtle decorative tick ring */}
                  <path
                    d="M 18 85 A 72 72 0 0 1 162 85"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.08"
                    strokeWidth="1"
                    strokeDasharray="2 6"
                  />

                  {/* Background Track with rounded ends */}
                  <path
                    d="M 26 85 A 64 64 0 0 1 154 85"
                    fill="none"
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />

                  {/* Active Health Arc (91% = dashoffset 18.10 on total length 201.06) */}
                  <path
                    d="M 26 85 A 64 64 0 0 1 154 85"
                    fill="none"
                    stroke="url(#eqHealthGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="201.06"
                    strokeDashoffset="18.10"
                    filter="url(#eqHealthGlow)"
                    className="transition-all duration-1000 ease-out"
                  />

                  {/* Target Benchmark at 85% */}
                  <line x1="140" y1="53" x2="149" y2="48" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />

                  {/* Leading Edge Accent Indicator Pip at 91% */}
                  <circle cx="151.5" cy="67.1" r="3.5" fill="#ffffff" stroke="#059669" strokeWidth="2.5" />
                </svg>

                {/* Centered Value Readout */}
                <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      91
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground font-mono">/ 100</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400 -mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Excellent
                  </span>
                </div>
              </div>

              {/* Scale Labels */}
              <div className="flex justify-between w-full text-[8.5px] font-mono text-muted-foreground px-3 -mt-1.5">
                <span>0</span>
                <span className="text-blue-600 font-semibold text-[8px]">Benchmark: 85</span>
                <span>100</span>
              </div>

              <div className="w-full grid grid-cols-3 gap-1 text-[9.5px] pt-1.5 border-t border-border/40">
                <div className="p-1 rounded bg-slate-50 dark:bg-slate-800/60 border border-border/30">
                  <span className="text-muted-foreground block text-[8px]">MTBF</span>
                  <span className="font-bold font-mono text-[10px]">620 h</span>
                </div>
                <div className="p-1 rounded bg-slate-50 dark:bg-slate-800/60 border border-border/30">
                  <span className="text-muted-foreground block text-[8px]">MTTR</span>
                  <span className="font-bold font-mono text-[10px]">4.2 h</span>
                </div>
                <div className="p-1 rounded bg-slate-50 dark:bg-slate-800/60 border border-border/30">
                  <span className="text-muted-foreground block text-[8px]">OEE</span>
                  <div className="font-bold font-mono text-emerald-600 text-[10px]">86.4%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           4. EQUIPMENT REGISTER TABLE (Full Width Master Box - Zero Side Scrolling)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2 border-b border-border/40">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Equipment Register
                  <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                    {filteredEquipment.length} items
                  </Badge>
                </CardTitle>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search equipment, serial, location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 pl-8 text-xs w-48 sm:w-64 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFilter("All");
                      setSearchQuery("");
                      toast.info("Reset filter");
                    }}
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <Filter className="h-3.5 w-3.5 text-slate-500" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Displaying all 10 register columns")}
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                    Columns
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
                {["All", "Active", "Maintenance", "Idle", "Critical", "Calibration Due", "Inspection Due"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedFilter(filter)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer shrink-0",
                      selectedFilter === filter
                        ? "bg-primary text-white shadow-2xs"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b bg-muted/30 text-[10.5px] text-muted-foreground font-semibold">
                    <th className="p-3 pl-4">Equipment ID</th>
                    <th className="p-3">Equipment Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Operator</th>
                    <th className="p-3 font-mono text-center">Utilization</th>
                    <th className="p-3 text-center">Condition</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 font-mono">Next Maintenance</th>
                    <th className="p-3 pr-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedEquipment.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-muted-foreground">
                        No equipment units match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedEquipment.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setActiveItem(item)}
                        className={cn(
                          "hover:bg-muted/30 cursor-pointer transition-colors",
                          activeItem.id === item.id ? "bg-primary/5 dark:bg-primary/10" : ""
                        )}
                      >
                        <td className="p-3 pl-4 font-mono font-bold text-primary text-[11px]">
                          {item.id}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          <div>
                            <span>{item.name}</span>
                            <span className="block text-[10px] text-muted-foreground font-mono font-normal">
                              SN: {item.serialNo} &bull; Model: {item.model}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {item.category}
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {item.location}
                        </td>
                        <td className="p-3 text-slate-800 dark:text-slate-200">
                          {item.operator}
                        </td>
                        <td className="p-3 font-mono font-bold text-center text-emerald-600">
                          {item.utilization}%
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-bold inline-block border",
                              item.condition === "Good" || item.condition === "Fair"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            )}
                          >
                            {item.condition}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border",
                              item.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : item.status === "Maintenance"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            )}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[10.5px]">
                          {item.nextMaintenance}
                        </td>
                        <td className="p-3 pr-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveItem(item);
                                setIsSpecsOpen(true);
                              }}
                              className="p-1 rounded hover:text-primary hover:bg-muted cursor-pointer transition-colors"
                              title="View Specifications"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveItem(item);
                                setIsLogModalOpen(true);
                              }}
                              className="p-1 rounded hover:text-emerald-600 hover:bg-muted cursor-pointer transition-colors"
                              title="Log Downtime / Incident"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalEntries={filteredEquipment.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              entityName="equipment"
            />
          </CardContent>
        </Card>

        {/* ====================================================================
           5. SELECTED EQUIPMENT MASTER DETAILS (Full Width Box)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2.5 border-b border-border/40 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                Equipment Details: <span className="font-mono text-primary">{activeItem.id}</span> - {activeItem.name}
              </CardTitle>
              <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                {activeItem.status}
              </Badge>
              <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">
                {activeItem.criticality} Criticality
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <button
                type="button"
                onClick={() => setIsSpecsOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Edit Specifications"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => toast.info(`Scanned Barcode Tag: ${activeItem.id}`)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Tag QR Barcode"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>QR Tag</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Print Equipment Sheet"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSpecsOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
                title="Expand Full View"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Full Specifications &rarr;</span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Col 1: Visual & Primary Identification */}
              <div className="space-y-3">
                <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl border flex items-center justify-center p-2 relative overflow-hidden">
                  <svg className="h-24 w-auto text-slate-600 dark:text-slate-300 drop-shadow-md" viewBox="0 0 160 120" fill="none">
                    <rect x="20" y="20" width="120" height="85" rx="6" fill="#334155" stroke="#0f172a" strokeWidth="2" />
                    <rect x="35" y="30" width="90" height="50" rx="3" fill="#0f172a" />
                    <rect x="40" y="35" width="80" height="40" fill="#1e293b" />
                    <rect x="75" y="35" width="10" height="25" fill="#94a3b8" />
                    <polygon points="75,60 85,60 80,70" fill="#e2e8f0" />
                    <rect x="110" y="35" width="20" height="30" rx="2" fill="#475569" />
                    <circle cx="118" cy="42" r="3" fill="#10b981" />
                    <circle cx="118" cy="50" r="3" fill="#f59e0b" />
                    <circle cx="118" cy="58" r="3" fill="#ef4444" />
                    <rect x="15" y="105" width="130" height="10" rx="2" fill="#1e293b" />
                  </svg>
                  <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    {activeItem.id}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-muted/20 rounded-lg border border-border/40 text-[11px]">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Manufacturer</span>
                    <span className="font-semibold">Haas Automation</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Model</span>
                    <span className="font-semibold font-mono">{activeItem.model}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Serial Number</span>
                    <span className="font-mono">{activeItem.serialNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Asset ID</span>
                    <span className="font-mono text-primary font-bold">{activeItem.assetId}</span>
                  </div>
                </div>
              </div>

              {/* Col 2: Location, Custody & Live Telemetry */}
              <div className="space-y-3">
                <div className="space-y-2 p-3 bg-muted/20 rounded-lg border border-border/40 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{activeItem.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="text-muted-foreground">Custodian:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{activeItem.custodian}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                    <span className="text-muted-foreground">Operator:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{activeItem.operator}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded bg-muted/20 border border-border/40">
                    <span className="text-[10px] text-muted-foreground block">Utilization</span>
                    <span className="font-mono font-bold text-emerald-600 text-sm">{activeItem.utilization}%</span>
                  </div>
                  <div className="p-2.5 rounded bg-muted/20 border border-border/40">
                    <span className="text-[10px] text-muted-foreground block">Operating Hours</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{activeItem.operatingHours.toLocaleString()} h</span>
                  </div>
                  <div className="p-2.5 rounded bg-muted/20 border border-border/40">
                    <span className="text-[10px] text-muted-foreground block">Condition</span>
                    <span className="font-bold text-emerald-600 text-sm">{activeItem.condition}</span>
                  </div>
                </div>
              </div>

              {/* Col 3: Maintenance, Calibration & Warranty Schedules */}
              <div className="space-y-3">
                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-2.5 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Next Maintenance:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">{activeItem.nextMaintenance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Next Calibration:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">{activeItem.nextCalibration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Installation Date:</span>
                    <span className="font-mono">{activeItem.installDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Warranty Expiry:</span>
                    <span className="font-mono font-semibold text-amber-600">{activeItem.warrantyExpiry}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSpecsOpen(true)}
                  className="w-full text-xs text-primary font-bold cursor-pointer"
                >
                  View Technical Documentation & Specifications &rarr;
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ====================================================================
           6. BOTTOM 5 CARDS (Utilization Trend, Top Downtime, Calibration, End of Life, AI Insights)
           ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
          {/* Card 1: Utilization Trend */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Utilization Trend (Last 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="h-32 w-full pt-2">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 240 100">
                  <line x1="10" y1="20" x2="230" y2="20" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                  <line x1="10" y1="50" x2="230" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                  <line x1="10" y1="80" x2="230" y2="80" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                  <polyline
                    points="20,70 60,62 100,48 140,42 180,38 220,32"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {[
                    { x: 20, y: 70, val: "72%" },
                    { x: 60, y: 62, val: "76%" },
                    { x: 100, y: 48, val: "81%" },
                    { x: 140, y: 42, val: "83%" },
                    { x: 180, y: 38, val: "84%" },
                    { x: 220, y: 32, val: "86%" },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                      <text x={pt.x} y={pt.y - 7} fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="currentColor">
                        {pt.val}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-muted-foreground px-1 border-t border-border/40 pt-1">
                <span>Apr 26</span>
                <span>May 26</span>
                <span>Jun 26</span>
                <span>Jul 26</span>
                <span>Aug 26</span>
                <span>Sep 26</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Top Downtime Reasons */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Top Downtime Reasons
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="space-y-1.5 text-[10.5px]">
                {[
                  { name: "Breakdown", pct: 42, color: "bg-rose-500" },
                  { name: "Setup / Adjustment", pct: 19, color: "bg-amber-500" },
                  { name: "Waiting for Material", pct: 15, color: "bg-yellow-500" },
                  { name: "Power Failure", pct: 10, color: "bg-purple-500" },
                  { name: "Other Reasons", pct: 14, color: "bg-slate-500" },
                ].map((item) => (
                  <div key={item.name} className="space-y-0.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{item.name}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{item.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className={item.color} style={{ width: `${item.pct}%`, height: "100%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Calibration Due */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Calibration Due
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  {/* Overdue: 28.6% */}
                  <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                  {/* This Week: 42.9% */}
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="170" />
                  {/* This Month: 28.6% */}
                  <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="68" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white">7</span>
                  <span className="text-[8px] text-muted-foreground uppercase font-semibold">Equipment</span>
                </div>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-rose-500" /> Overdue</span>
                  <span className="font-mono font-bold text-rose-600">2 (28.6%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-amber-500" /> This Week</span>
                  <span className="font-mono font-bold text-amber-600">3 (42.9%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500" /> This Month</span>
                  <span className="font-mono font-bold text-emerald-600">2 (28.6%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Assets Near End of Life */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Assets Near End of Life
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto">
                <Hourglass className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white block">
                  6
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">Equipment Units</span>
              </div>
              <div className="w-full p-1.5 rounded bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 text-xs">
                <span className="text-muted-foreground block text-[9px]">Total NBV</span>
                <span className="font-bold font-mono text-rose-600 text-xs">₹ 1.85 Cr</span>
              </div>
              <button
                type="button"
                onClick={() => toast.info("Viewing equipment replacement plan")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View Details &rarr;
              </button>
            </CardContent>
          </Card>

          {/* Card 5: AI Insights */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                AI Insights
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Viewing all AI Equipment Insights")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[9.5px]">
              <div className="flex items-start gap-1">
                <span className="text-rose-600">🔴</span>
                <span>CNC-01 has increasing downtime and high maintenance cost.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-500">🟠</span>
                <span>7 equipment units have utilization below target level.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-500">🟠</span>
                <span>5 preventive maintenance activities are overdue.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-yellow-600">🟡</span>
                <span>4 calibration certificates are approaching expiry.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-emerald-500">🟢</span>
                <span>Overall equipment health score is excellent at 91/100.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           6. FOOTER
           ==================================================================== */}
        <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground gap-2">
          <span>&copy; 2026 Magnertia ERP. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>System Online</span>
          </div>
        </div>

        {/* ====================================================================
           MODAL 1: CREATE EQUIPMENT
           ==================================================================== */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <span>Create Equipment</span>
                <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-700">
                  DRAFT
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Register operational equipment into the plant equipment master linked to Fixed Asset.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Equipment Name *</Label>
                  <Input
                    required
                    value={newEq.name}
                    onChange={(e) => setNewEq({ ...newEq, name: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Equipment Category *</Label>
                  <Select
                    value={newEq.category}
                    onValueChange={(val) => setNewEq({ ...newEq, category: val })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Production Equipment">Production Equipment</SelectItem>
                      <SelectItem value="Material Handling">Material Handling</SelectItem>
                      <SelectItem value="Electrical Equipment">Electrical Equipment</SelectItem>
                      <SelectItem value="Testing Equipment">Testing Equipment</SelectItem>
                      <SelectItem value="Utility Equipment">Utility Equipment</SelectItem>
                      <SelectItem value="Other Equipment">Other Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Linked Fixed Asset ID</Label>
                  <Input
                    value={newEq.assetId}
                    onChange={(e) => setNewEq({ ...newEq, assetId: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Equipment Code</Label>
                  <Input
                    value={newEq.code}
                    onChange={(e) => setNewEq({ ...newEq, code: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Asset Physical Tag</Label>
                  <Input
                    value={newEq.tag}
                    onChange={(e) => setNewEq({ ...newEq, tag: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Manufacturer</Label>
                  <Input
                    value={newEq.manufacturer}
                    onChange={(e) => setNewEq({ ...newEq, manufacturer: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Model Number</Label>
                  <Input
                    value={newEq.model}
                    onChange={(e) => setNewEq({ ...newEq, model: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Rated Capacity</Label>
                  <Input
                    value={newEq.capacity}
                    onChange={(e) => setNewEq({ ...newEq, capacity: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Department</Label>
                  <Input
                    value={newEq.department}
                    onChange={(e) => setNewEq({ ...newEq, department: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Location</Label>
                  <Input
                    value={newEq.location}
                    onChange={(e) => setNewEq({ ...newEq, location: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Assigned Operator</Label>
                  <Input
                    value={newEq.operator}
                    onChange={(e) => setNewEq({ ...newEq, operator: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#0B3B7B] hover:bg-[#082B5B] text-white">
                  Activate Equipment
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 2: TECHNICAL SPECIFICATIONS
           ==================================================================== */}
        <Dialog open={isSpecsOpen} onOpenChange={setIsSpecsOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Technical Specifications &mdash; {activeItem.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Detailed electrical, mechanical, and operational parameters.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="p-3 bg-muted/20 rounded-lg border space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">Performance Ratings</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Rated Power</span>
                    <span className="font-bold font-mono">15 kW</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Voltage / Phase</span>
                    <span className="font-bold font-mono">415 V (3-Phase)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Frequency</span>
                    <span className="font-bold font-mono">50 Hz</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Spindle Speed</span>
                    <span className="font-bold font-mono">8,000 RPM</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Precision Accuracy</span>
                    <span className="font-bold font-mono text-emerald-600">&plusmn;0.01 mm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Axis Travel (X/Y/Z)</span>
                    <span className="font-bold font-mono">850x500x500 mm</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-muted/20 rounded-lg border space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">Physical Dimensions & Weight</span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Length</span>
                    <span className="font-mono">2,500 mm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Width</span>
                    <span className="font-mono">2,200 mm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Height</span>
                    <span className="font-mono">2,600 mm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Machine Weight</span>
                    <span className="font-mono font-bold">5,500 kg</span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button size="sm" onClick={() => setIsSpecsOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 3: MAINTENANCE SCHEDULE
           ==================================================================== */}
        <Dialog open={isMaintOpen} onOpenChange={setIsMaintOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Preventive Maintenance &mdash; {activeItem.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Schedule PM inspection and work order generation.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="space-y-1">
                <Label className="text-[11px]">Task Description</Label>
                <Input defaultValue="Spindle lubrication, coolant filtration, axis calibration" className="h-8 text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Scheduled Date</Label>
                  <Input type="date" defaultValue="2026-09-25" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Technician Lead</Label>
                  <Input defaultValue="Chief Mech. Tech" className="h-8 text-xs" />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setIsMaintOpen(false)}>Cancel</Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsMaintOpen(false);
                    toast.success(`Work order created for ${activeItem.id} on 25 Sep 2026.`);
                  }}
                  className="bg-[#0B3B7B] text-white"
                >
                  Create Work Order
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 4: CALIBRATION LOG
           ==================================================================== */}
        <Dialog open={isCalibOpen} onOpenChange={setIsCalibOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Calibration Certificate &mdash; {activeItem.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                ISO/NABL calibration traceability and certificate logging.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="p-2.5 rounded bg-muted/20 border space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Standard</span>
                  <span className="font-semibold">ISO 230-2 (Linear Positioning)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certificate No.</span>
                  <span className="font-mono font-bold">CAL-2026-0941</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deviation / Error</span>
                  <span className="font-mono text-emerald-600 font-bold">&lt; 0.004 mm (PASS)</span>
                </div>
              </div>

              <div className="p-2 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs flex items-center gap-1.5 font-semibold">
                <Check className="h-3.5 w-3.5" />
                Calibration is valid until {activeItem.nextCalibration}
              </div>

              <DialogFooter>
                <Button size="sm" onClick={() => setIsCalibOpen(false)}>Done</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 5: LOG DOWNTIME / INCIDENT
           ==================================================================== */}
        <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Log Downtime / Incident &mdash; {activeItem.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Record an unscheduled stoppage, failure event, or maintenance incident.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsLogModalOpen(false);
                toast.success(`Downtime incident logged for ${activeItem.id}`);
              }}
              className="space-y-3 text-xs pt-1"
            >
              <div className="space-y-1">
                <Label className="text-[11px]">Incident Nature / Symptom *</Label>
                <Input defaultValue="Spindle vibration anomaly during high-speed feed" required className="h-8 text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Severity</Label>
                  <Select defaultValue="High">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Critical">Critical (Line Stoppage)</SelectItem>
                      <SelectItem value="High">High (Major Slowdown)</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Est. Downtime (Hours)</Label>
                  <Input defaultValue="3.5" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px]">Immediate Action Taken</Label>
                <Input defaultValue="Machine halted, maintenance crew dispatched for vibration inspection" className="h-8 text-xs" />
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsLogModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-rose-600 hover:bg-rose-700 text-white">
                  Record Downtime
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default EquipmentFormPage;
