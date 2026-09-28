// Magnertia ERP - Sustainability Submodule Header Component
// Standard Executive Header matching Screenshot for all Sustainability Management Submodules

import React, { useState, useRef, useEffect } from "react";
import {
  FileSpreadsheet,
  MoreVertical,
  Plus,
  RefreshCw,
  Printer,
  ShieldCheck,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

export interface SustainabilitySubmoduleHeaderProps {
  icon: LucideIcon;
  title: string;
  code: string;
  programName?: string;
  version?: string;
  status?: string;
  subtitle?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onGenerateReport?: () => void;
  moreActions?: Array<{ label: string; icon?: LucideIcon; onClick: () => void }>;
}

export function SustainabilitySubmoduleHeader({
  icon: Icon,
  title,
  code,
  programName = "Sustainable Growth 2030",
  version = "v1.0",
  status = "Active",
  subtitle = "Building a Sustainable Tomorrow • Measure. Target. Implement. Monitor. Verify. Report. Disclose. Improve.",
  primaryActionLabel,
  onPrimaryAction,
  onGenerateReport,
  moreActions,
}: SustainabilitySubmoduleHeaderProps) {
  const [showMoreActions, setShowMoreActions] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setShowMoreActions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDefaultPrimaryAction = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      toast.success(`New ${title} program created.`);
    }
  };

  const handleDefaultGenerateReport = () => {
    if (onGenerateReport) {
      onGenerateReport();
    } else {
      toast.success(`Generating ${title} executive compliance report...`);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left: Icon, Title, Status, Code & Subtitle */}
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 font-medium">
            <span>{code}</span>
            {programName && (
              <>
                <span>|</span>
                <span>{programName}</span>
              </>
            )}
            {version && (
              <>
                <span>|</span>
                <span className="text-[11px] font-sans bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                  {version}
                </span>
              </>
            )}
          </div>

          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic font-normal pt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions matching Screenshot */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
        <button
          type="button"
          onClick={handleDefaultPrimaryAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{primaryActionLabel || `+ New ${title} Program`}</span>
        </button>

        <button
          type="button"
          onClick={handleDefaultGenerateReport}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span>Generate Report</span>
        </button>

        {/* More Actions Dropdown */}
        <div className="relative" ref={moreRef}>
          <button
            type="button"
            onClick={() => setShowMoreActions((prev) => !prev)}
            className="inline-flex items-center justify-center h-8.5 w-8.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer shrink-0"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4 text-slate-300" />
          </button>

          {showMoreActions && (
            <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 shadow-xl z-50 text-xs animate-in fade-in zoom-in-95">
              {moreActions ? (
                moreActions.map((action, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setShowMoreActions(false);
                      action.onClick();
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    {action.icon && <action.icon className="h-3.5 w-3.5 text-slate-400" />}
                    <span>{action.label}</span>
                  </button>
                ))
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreActions(false);
                      toast.success("Printing sustainability dossier...");
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Printer className="h-3.5 w-3.5 text-slate-400" />
                    <span>Print Dossier</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreActions(false);
                      toast.success("Audit verification ledger exported.");
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Audit Verification</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreActions(false);
                      toast.success("Syncing statutory filings...");
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                    <span>Sync Statutory Filings</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
