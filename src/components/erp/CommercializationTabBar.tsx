import { cn } from "@/lib/utils";

export type CommercializationTabId = "register" | "form";

export interface CommercializationTabItem {
  id: CommercializationTabId;
  label: string;
  tooltip: string;
  badge?: string | number;
}

export const COMMERCIALIZATION_TABS: CommercializationTabItem[] = [
  { id: "register", label: "Commercialization Register", tooltip: "Commercialization Plans Register & Pipeline", badge: "2" },
  { id: "form", label: "Commercialization Planning Form", tooltip: "Edit Commercialization Plan & Milestones" },
];

export function CommercializationPageTabBar({
  activeTab = "register",
  onTabChange,
}: {
  activeTab?: CommercializationTabId;
  onTabChange?: (tab: CommercializationTabId) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 border-b border-border/80 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 px-4 py-1.5 overflow-x-auto shadow-2xs">
      {COMMERCIALIZATION_TABS.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange?.(t.id)}
            className={cn(
              "group relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap select-none",
              isActive
                ? "bg-primary text-white shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
            title={t.tooltip}
          >
            <span>{t.label}</span>
            {t.badge && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default CommercializationPageTabBar;
