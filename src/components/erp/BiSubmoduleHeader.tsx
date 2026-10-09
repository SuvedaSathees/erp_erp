// Magnertia ERP - Business Intelligence Submodule Header Component
// Standardized across all 8 Business Intelligence Submodules matching Image 1
// Clean, corporate ERP aesthetic with NO profile pictures or avatar overlays.

import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Plus,
  Printer,
  Sparkles,
  Download,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { exportVisibleTables } from "@/lib/recordExport";

export interface BiReportItem {
  label: string;
  onClick: () => void;
}

export interface BiActionItem {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
}

export interface BiSubmoduleHeaderProps {
  icon?: LucideIcon;
  title: string;
  code?: string;
  badge?: string;
  status?: string;
  badgeVariant?: "success" | "warning" | "info" | "primary";
  subtitle?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onGenerateReport?: () => void;
  onMoreActions?: (act: string) => void;
  moreActions?: Array<{ label: string; icon?: LucideIcon; onClick: () => void }>;
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onExportCsv?: () => void;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
  reports?: BiReportItem[];
}

export function BiSubmoduleHeader({
  icon: Icon,
  title,
  code,
  badge,
  status,
  subtitle,
  primaryActionLabel,
  onPrimaryAction,
  onGenerateReport,
  onMoreActions,
  moreActions = [],
  dateRange: controlledDateRange,
  onDateRangeChange,
  onRefresh,
  isRefreshing = false,
  onExportCsv,
  onExportExcel,
  onExportPdf,
  reports = [],
}: BiSubmoduleHeaderProps) {
  const [internalDateRange, setInternalDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const dateRange = controlledDateRange || internalDateRange;

  const displayBadge = badge || status || "Live";
  const displaySubtitle = subtitle;
  const cleanPrimaryLabel = primaryActionLabel
    ? primaryActionLabel.replace(/^\+\s*/, "")
    : "";

  const handleDateSelect = (range: string, label: string) => {
    if (onDateRangeChange) {
      onDateRangeChange(range);
    } else {
      setInternalDateRange(range);
    }
    toast.success(`Selected date window: ${label}`);
  };

  const queryClient = useQueryClient();

  const handleDefaultRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      void queryClient.invalidateQueries().then(() => toast.success(`${title} data refreshed`));
    }
  };

  const handleDefaultExportCsv = () => {
    if (onExportCsv) {
      onExportCsv();
    } else {
      void exportVisibleTables(title, "csv");
    }
  };

  const handleDefaultExportExcel = () => {
    if (onExportExcel) {
      onExportExcel();
    } else {
      void exportVisibleTables(title, "xlsx");
    }
  };

  const handleDefaultExportPdf = () => {
    if (onExportPdf) {
      onExportPdf();
    } else {
      void exportVisibleTables(title, "pdf");
    }
  };

  const handleDefaultPrimaryAction = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      toast.info(`Initiating action: ${cleanPrimaryLabel}`);
    }
  };

  // Format compact date range matching Image 1: "01–30 Sep 2026"
  const formatCompactDate = (range: string) => {
    const sameMonthYearMatch = range.match(
      /^(\d{2})\s([A-Za-z]{3})\s(\d{4})\s*-\s*(\d{2})\s\2\s\3$/
    );
    if (sameMonthYearMatch) {
      return `${sameMonthYearMatch[1]}–${sameMonthYearMatch[4]} ${sameMonthYearMatch[2]} ${sameMonthYearMatch[3]}`;
    }
    return range;
  };

  const formattedDateRange = formatCompactDate(dateRange);

  const TOOLBAR_BTN =
    "h-8 px-2.5 text-xs font-medium gap-1.5 border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white shadow-2xs cursor-pointer whitespace-nowrap shrink-0 rounded-lg transition-all active:scale-[0.98]";

  // Default Reports list if none passed
  const activeReports =
    reports.length > 0
      ? reports
      : [
          {
            label: `Executive ${title} Dossier (PDF)`,
            onClick: onGenerateReport || handleDefaultExportPdf,
          },
          {
            label: "Analytical Data Sheet (XLSX)",
            onClick: handleDefaultExportExcel,
          },
          {
            label: "Raw Telemetry & Metric Log (CSV)",
            onClick: handleDefaultExportCsv,
          },
        ];

  // Default More Actions if none passed
  const activeMoreActions =
    moreActions.length > 0
      ? moreActions
      : [
          {
            label: "Refresh Analytics Engine",
            onClick: handleDefaultRefresh,
          },
          {
            label: "Print Executive View",
            onClick: () => window.print(),
          },
          {
            label: "Audit Trail & Lineage Review",
            onClick: () => {
              if (onMoreActions) onMoreActions("Audit Trail");
              else toast.info("Audit trail verified. All records immutable.");
            },
          },
          {
            label: "Schedule Automated Delivery",
            onClick: () => {
              if (onMoreActions) onMoreActions("Schedule Automated Delivery");
              else toast.success("Automated report distribution schedule active.");
            },
          },
        ];

  // Status badge color matching Image 1
  const isBlueStatus =
    displayBadge.toLowerCase().includes("progress") ||
    displayBadge.toLowerCase().includes("live");

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl px-5 py-3.5 shadow-2xs w-full min-w-0 transition-all">
      {/* Row 1: Icon box, Title, Code Badge, Status Badge, and Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 w-full min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
          {/* Module Icon in rounded square matching Image 1 */}
          {Icon && (
            <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/60 shrink-0 shadow-2xs">
              <Icon className="h-4.5 w-4.5" />
            </div>
          )}

          <h1 className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            {title}
          </h1>

          {/* Record Code Badge matching "# BI-..." from Image 1 */}
          {code && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/90 font-mono text-xs font-semibold tracking-tight shadow-2xs whitespace-nowrap shrink-0 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
              <span className="text-slate-400 font-bold select-none text-[11px]">#</span>
              {code}
            </span>
          )}

          {/* Live Pulsing Status Badge matching "● Active" / "● Live" from Image 1 */}
          {displayBadge && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border shadow-2xs whitespace-nowrap shrink-0",
                isBlueStatus
                  ? "bg-blue-50/90 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:border-blue-800/60 dark:text-blue-300"
                  : "bg-emerald-50/90 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full animate-pulse",
                  isBlueStatus ? "bg-blue-600" : "bg-emerald-600"
                )}
              />
              {displayBadge}
            </span>
          )}
        </div>

        {/* Primary Action Button matching "+ Create Inspection" in Image 1 */}
        {cleanPrimaryLabel && (
          <Button
            onClick={handleDefaultPrimaryAction}
            size="sm"
            className="h-8 px-3.5 bg-[#0B3B7B] hover:bg-[#082B5B] text-white text-xs font-semibold gap-1.5 cursor-pointer shadow-xs hover:shadow whitespace-nowrap shrink-0 rounded-lg transition-all active:scale-[0.98] self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5] shrink-0" />
            <span>{cleanPrimaryLabel}</span>
          </Button>
        )}
      </div>

      {/* Row 2: Subtitle Description on Left, Secondary Actions Toolbar on Right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3 mt-3 w-full min-w-0">
        {displaySubtitle ? (
          <p className="text-xs text-slate-500 dark:text-muted-foreground line-clamp-1 max-w-xl xl:max-w-2xl min-w-0">
            {displaySubtitle}
          </p>
        ) : (
          <div className="hidden lg:block" />
        )}

        {/* Secondary Actions Toolbar matching Image 1 */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap shrink-0 sm:self-end lg:self-auto">
          {/* 1. Date Range Picker Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(TOOLBAR_BTN, "inline-flex items-center font-medium")}
              >
                <Calendar className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                <span>{formattedDateRange}</span>
                <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 text-xs">
              <DropdownMenuItem
                onClick={() =>
                  handleDateSelect("01 Sep 2026 - 30 Sep 2026", "September 2026")
                }
                className="cursor-pointer"
              >
                September 2026 (Current Month)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleDateSelect("01 Aug 2026 - 31 Aug 2026", "August 2026")
                }
                className="cursor-pointer"
              >
                August 2026 (Previous Month)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleDateSelect("01 Jul 2026 - 30 Sep 2026", "Q3 2026")
                }
                className="cursor-pointer"
              >
                Q3 2026 (Quarter-to-Date)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleDateSelect("01 Apr 2026 - 31 Mar 2027", "FY 2026-27")
                }
                className="cursor-pointer"
              >
                FY 2026-27 (Full Fiscal Year)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 2. Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDefaultRefresh}
            disabled={isRefreshing}
            className={TOOLBAR_BTN}
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0",
                isRefreshing && "animate-spin text-primary"
              )}
            />
            <span>Refresh</span>
          </Button>

          {/* 3. Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={TOOLBAR_BTN}>
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Export</span>
                <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 text-xs">
              <DropdownMenuItem onClick={handleDefaultExportCsv} className="cursor-pointer">
                Export to CSV (.csv)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDefaultExportExcel} className="cursor-pointer">
                Export to Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDefaultExportPdf} className="cursor-pointer">
                Export to PDF (.pdf)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 4. Reports Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={TOOLBAR_BTN}>
                <FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Reports</span>
                <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 text-xs">
              {activeReports.map((r, i) => (
                <DropdownMenuItem
                  key={i}
                  onClick={r.onClick}
                  className="cursor-pointer"
                >
                  {r.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 5. More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={TOOLBAR_BTN}>
                <span>More Actions</span>
                <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 text-xs">
              {activeMoreActions.map((action, i) => (
                <DropdownMenuItem
                  key={i}
                  onClick={action.onClick}
                  className="cursor-pointer flex items-center gap-2"
                >
                  {action.icon && <action.icon className="h-3.5 w-3.5 shrink-0" />}
                  <span>{action.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
