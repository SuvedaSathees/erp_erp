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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface QualityReportItem {
  label: string;
  onClick: () => void;
}

export interface QualityActionItem {
  label: string;
  onClick: () => void;
}

export interface QualityModuleHeaderCardProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onExportCsv?: () => void;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
  reports?: QualityReportItem[];
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  moreActions?: QualityActionItem[];
  extraActions?: React.ReactNode;
}

export function QualityModuleHeaderCard({
  title,
  description,
  badge,
  dateRange: controlledDateRange,
  onDateRangeChange,
  onRefresh,
  isRefreshing = false,
  onExportCsv,
  onExportExcel,
  onExportPdf,
  reports = [],
  primaryAction,
  moreActions = [],
  extraActions,
}: QualityModuleHeaderCardProps) {
  const [internalDateRange, setInternalDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const dateRange = controlledDateRange || internalDateRange;

  const handleDateSelect = (range: string, label: string) => {
    if (onDateRangeChange) {
      onDateRangeChange(range);
    } else {
      setInternalDateRange(range);
    }
    toast.success(`Selected ${label}`);
  };

  const handleDefaultExportCsv = () => {
    if (onExportCsv) {
      onExportCsv();
    } else {
      toast.success(`Exported ${title} to CSV (.csv)`);
    }
  };

  const handleDefaultExportExcel = () => {
    if (onExportExcel) {
      onExportExcel();
    } else {
      toast.success(`Exported ${title} to Excel (.xlsx)`);
    }
  };

  const handleDefaultExportPdf = () => {
    if (onExportPdf) {
      onExportPdf();
    } else {
      toast.success(`Exported ${title} to PDF (.pdf)`);
    }
  };

  // Compact date formatting e.g. "01 Sep 2026 - 30 Sep 2026" -> "01–30 Sep 2026"
  const formatCompactDate = (range: string) => {
    const sameMonthYearMatch = range.match(/^(\d{2})\s([A-Za-z]{3})\s(\d{4})\s*-\s*(\d{2})\s\2\s\3$/);
    if (sameMonthYearMatch) {
      return `${sameMonthYearMatch[1]}–${sameMonthYearMatch[4]} ${sameMonthYearMatch[2]} ${sameMonthYearMatch[3]}`;
    }
    const sameYearMatch = range.match(/^(\d{2}\s[A-Za-z]{3})\s(\d{4})\s*-\s*(\d{2}\s[A-Za-z]{3})\s\2$/);
    if (sameYearMatch) {
      return `${sameYearMatch[1]} – ${sameYearMatch[3]} ${sameYearMatch[2]}`;
    }
    return range.replace(/(\d{2}\s\w{3})\s\d{4}\s-\s(\d{2}\s\w{3}\s\d{4})/, "$1 - $2");
  };

  const formattedDateRange = formatCompactDate(dateRange);

  const TOOLBAR_BTN =
    "h-8 px-2.5 text-xs font-medium gap-1.5 border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white shadow-2xs cursor-pointer whitespace-nowrap shrink-0 rounded-lg transition-all active:scale-[0.98]";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 rounded-xl px-4 sm:px-5 py-3 shadow-2xs w-full min-w-0 transition-all">
      {/* Row 1: Title, Badges, and Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 w-full min-w-0">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-wrap">
          <h1 className="text-[15px] sm:text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            {title}
          </h1>
          {badge && (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap">
              {badge}
            </div>
          )}
        </div>

        {primaryAction && (
          <Button
            onClick={primaryAction.onClick}
            size="sm"
            className="h-8 px-3.5 bg-[#0B3B7B] hover:bg-[#082B5B] text-white text-xs font-semibold gap-1.5 cursor-pointer shadow-xs hover:shadow whitespace-nowrap shrink-0 rounded-lg transition-all active:scale-[0.98] self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5] shrink-0" />
            <span>{primaryAction.label}</span>
          </Button>
        )}
      </div>

      {/* Row 2: Subtitle Description on Left, Secondary Toolbar on Right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 sm:gap-3 pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/60 w-full min-w-0">
        {description ? (
          <p className="text-xs text-muted-foreground line-clamp-1 max-w-xl xl:max-w-2xl min-w-0">
            {description}
          </p>
        ) : (
          <div className="hidden lg:block" />
        )}

        {/* Secondary Actions Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap shrink-0 sm:self-end lg:self-auto">
          {extraActions}

          {/* Date Range Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  TOOLBAR_BTN,
                  "inline-flex items-center font-medium"
                )}
              >
                <Calendar className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                <span>{formattedDateRange}</span>
                <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 text-xs">
              <DropdownMenuItem
                onClick={() =>
                  handleDateSelect("01 Sep 2026 - 30 Sep 2026", "Current Month: Sep 2026")
                }
                className="cursor-pointer"
              >
                September 2026 (Current Month)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleDateSelect("01 Aug 2026 - 31 Aug 2026", "Previous Month: Aug 2026")
                }
                className="cursor-pointer"
              >
                August 2026 (Previous Month)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDateSelect("01 Jul 2026 - 30 Sep 2026", "Q3 2026")}
                className="cursor-pointer"
              >
                Q3 2026 (Quarter-to-Date)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleDateSelect("01 Apr 2026 - 31 Mar 2027", "Fiscal Year 2026-27")
                }
                className="cursor-pointer"
              >
                FY 2026-27 (Full Fiscal Year)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className={TOOLBAR_BTN}
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0", isRefreshing && "animate-spin text-primary")}
            />
            <span>Refresh</span>
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={TOOLBAR_BTN}
              >
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

          {/* Reports Dropdown */}
          {reports.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={TOOLBAR_BTN}
                >
                  <FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Reports</span>
                  <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 text-xs">
                {reports.map((report, idx) => (
                  <DropdownMenuItem key={idx} onClick={report.onClick} className="cursor-pointer">
                    {report.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Subtle Vertical Divider */}
          {moreActions.length > 0 && (
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0 hidden sm:block" />
          )}

          {/* More Actions Dropdown */}
          {moreActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={TOOLBAR_BTN}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                  <span>More Actions</span>
                  <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 text-xs">
                {moreActions.map((action, idx) => (
                  <DropdownMenuItem key={idx} onClick={action.onClick} className="cursor-pointer">
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
