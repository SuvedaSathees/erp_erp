// Magnertia ERP - Security Submodule Header Component
// Standardized across all 8 Security Management Submodules matching Image 1

import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Plus,
  SlidersHorizontal,
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

export interface SecurityReportItem {
  label: string;
  onClick: () => void;
}

export interface SecurityActionItem {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
}

export interface SecuritySubmoduleHeaderProps {
  icon?: LucideIcon;
  title: string;
  code?: string;
  badge?: string;
  status?: string;
  badgeVariant?: "success" | "warning" | "info" | "primary";
  subtitle?: string;
  slogan?: string;
  bannerQuote?: string;
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
  reports?: SecurityReportItem[];
}

export function SecuritySubmoduleHeader({
  icon: Icon,
  title,
  code,
  badge,
  status,
  subtitle,
  slogan,
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
}: SecuritySubmoduleHeaderProps) {
  const [internalDateRange, setInternalDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const dateRange = controlledDateRange || internalDateRange;

  const displayBadge = badge || status || "Active";
  const displaySubtitle = subtitle || slogan;
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
            label: "Export Master Audit Report (PDF)",
            onClick: onGenerateReport || handleDefaultExportPdf,
          },
          {
            label: "Export Compliance Register (XLSX)",
            onClick: handleDefaultExportExcel,
          },
          {
            label: "Activity & Telemetry Log (CSV)",
            onClick: handleDefaultExportCsv,
          },
        ];

  // Default More Actions if none passed
  const activeMoreActions =
    moreActions.length > 0
      ? moreActions
      : [
          {
            label: "Refresh Live Feed",
            onClick: handleDefaultRefresh,
          },
          {
            label: "Print Document / Ledger",
            onClick: () => window.print(),
          },
          {
            label: "Security Policy Sign-Off",
            onClick: () => {
              if (onMoreActions) onMoreActions("Security Policy Sign-Off");
              else toast.success("Security Policy sign-off verified.");
            },
          },
          {
            label: "Trigger SOC Alert Review",
            onClick: () => {
              if (onMoreActions) onMoreActions("Trigger SOC Alert Review");
              else toast.info("SOC Review requested.");
            },
          },
        ];

  // Status badge color matching Image 1
  const isBlueStatus =
    displayBadge.toLowerCase().includes("progress") ||
    displayBadge.toLowerCase().includes("active");

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl px-5 py-3.5 shadow-2xs w-full min-w-0 transition-all">
      {/* Row 1: Title, Code Badge, Status Badge, and Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 w-full min-w-0">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-wrap">
          <h1 className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            {title}
          </h1>

          {/* Record Code Badge matching "# IPQC-2026-00358" from Image 1 */}
          {code && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/90 font-mono text-xs font-semibold tracking-tight shadow-2xs whitespace-nowrap shrink-0 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
              <span className="text-slate-400 font-bold select-none text-[11px]">#</span>
              {code}
            </span>
          )}

          {/* Live Pulsing Status Badge matching "● In Progress" from Image 1 */}
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
                Print / Export PDF (.pdf)
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
            <DropdownMenuContent align="end" className="w-56 text-xs">
              {activeReports.map((report, idx) => (
                <DropdownMenuItem key={idx} onClick={report.onClick} className="cursor-pointer">
                  {report.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 5. Subtle Vertical Divider */}
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0 hidden sm:block" />

          {/* 6. More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={TOOLBAR_BTN}>
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                <span>More Actions</span>
                <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 text-xs">
              {activeMoreActions.map((action, idx) => (
                <DropdownMenuItem key={idx} onClick={action.onClick} className="cursor-pointer">
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
