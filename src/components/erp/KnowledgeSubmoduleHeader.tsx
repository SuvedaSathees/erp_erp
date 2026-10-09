import React, { useState, useRef, useEffect } from "react";
import {
  Save,
  Send,
  FileSpreadsheet,
  MoreVertical,
  Printer,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { exportPageReport } from "@/lib/recordExport";

export interface KnowledgeSubmoduleHeaderProps {
  icon: LucideIcon;
  title?: string;
  code: string;
  version?: string;
  status?: string;
  subtitle?: string;
  onSave?: () => void;
  onSubmit?: () => void;
  onGenerateReport?: () => void;
  moreActions?: Array<{ label: string; icon?: LucideIcon; onClick: () => void }>;
  hideRibbon?: boolean;
}

export function KnowledgeSubmoduleHeader({
  icon: Icon,
  title = "Module",
  code,
  version = "v1.0",
  status = "Active",
  subtitle = "",
  onSave,
  onSubmit,
  onGenerateReport,
  moreActions,
}: KnowledgeSubmoduleHeaderProps) {
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

  const handleDefaultSave = () => {
    if (onSave) {
      onSave();
    } else {
      toast.success(`${title} record saved to Knowledge Vault!`);
    }
  };

  const handleDefaultSubmit = () => {
    if (onSubmit) {
      onSubmit();
    } else {
      toast.success(`${title} (${code}) dispatched to Knowledge Review Board!`);
    }
  };

  const handleDefaultGenerateReport = () => {
    if (onGenerateReport) {
      onGenerateReport();
    } else {
      toast.success(`Generating executive compliance audit report for ${title}...`);
    }
  };



  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      {/* Left: Icon, Module Name/Title & Status / Version Badges */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shadow-blue-500/20 shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {title && (
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mr-1">
              {title}
            </h2>
          )}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {status}
          </span>
          <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
            {code}
          </span>
          <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
            {version}
          </span>
        </div>
      </div>

      {/* Right: Action Toolbar */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
        <button
          type="button"
          onClick={handleDefaultSave}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>
        <button
          type="button"
          onClick={handleDefaultSubmit}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          <span>Submit</span>
        </button>
        <button
          type="button"
          onClick={handleDefaultGenerateReport}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Generate Report</span>
        </button>

        {/* More Actions Dropdown */}
        <div className="relative" ref={moreRef}>
          <button
            type="button"
            onClick={() => setShowMoreActions((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
          >
            <span>More Actions</span>
            <MoreVertical className="w-3.5 h-3.5 text-slate-500" />
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
                      toast.success("Printing controlled summary sheet...");
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Printer className="h-3.5 w-3.5 text-slate-400" />
                    <span>Print Summary Sheet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreActions(false);
                      void exportPageReport("Audit Trail Ledger", "pdf");
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                    <span>Audit Trail & Signoffs</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreActions(false);
                      toast.success("Syncing with enterprise knowledge vault...");
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                    <span>Sync Vault Checksum</span>
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
