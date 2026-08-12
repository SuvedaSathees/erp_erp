import React from "react";
import {
  LayoutDashboard,
  FolderTree,
  Boxes,
  Factory,
  ShieldCheck,
  Calculator,
  Sparkles,
  FileSpreadsheet,
  UserCheck,
  History,
} from "lucide-react";
import { ScrollableTabBarContainer } from "../ScrollableTabBarContainer";
import { cn } from "@/lib/utils";

export type BomTabType =
  | "overview"
  | "structure"
  | "material"
  | "manufacturing"
  | "quality"
  | "cost"
  | "ai"
  | "summary"
  | "approval"
  | "history";

interface BomEngineeringTabBarProps {
  activeTab: BomTabType;
  onTabChange: (tab: BomTabType) => void;
}

export const BomEngineeringTabBar: React.FC<BomEngineeringTabBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: BomTabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "structure", label: "BOM Structure", icon: FolderTree },
    { id: "material", label: "Material & Components", icon: Boxes },
    { id: "manufacturing", label: "Manufacturing", icon: Factory },
    { id: "quality", label: "Quality & Compliance", icon: ShieldCheck },
    { id: "cost", label: "Cost Engineering", icon: Calculator },
    { id: "ai", label: "AI Assessment", icon: Sparkles },
    { id: "summary", label: "Summary", icon: FileSpreadsheet },
    { id: "approval", label: "Review & Approval", icon: UserCheck },
    { id: "history", label: "Activity History", icon: History },
  ];

  return (
    <ScrollableTabBarContainer activeKey={activeTab} className="sticky top-[56px] z-20 bg-background/95 backdrop-blur-md border-b border-border/80">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            data-active={isActive ? "true" : "false"}
            onClick={() => onTabChange(t.id)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer shrink-0 whitespace-nowrap",
              isActive
                ? "border-primary text-primary bg-primary/5 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <Icon className={cn("w-3.5 h-3.5", isActive ? "text-primary" : "text-muted-foreground")} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </ScrollableTabBarContainer>
  );
};
