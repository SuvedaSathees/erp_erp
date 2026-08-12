import React from "react";
import { ScrollableTabBarContainer } from "./ScrollableTabBarContainer";
import { cn } from "@/lib/utils";

export interface BusinessSectionNavItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface BusinessSectionNavTabBarProps {
  sections: BusinessSectionNavItem[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  className?: string;
}

export function BusinessSectionNavTabBar({
  sections,
  activeSection,
  onSectionClick,
  className,
}: BusinessSectionNavTabBarProps) {
  return (
    <ScrollableTabBarContainer
      activeKey={activeSection}
      className={cn("rounded-xl border border-border bg-card shadow-xs", className)}
      containerClassName="py-1.5 px-2"
      gradientBackground="from-card via-card/90 to-transparent"
    >
      {sections.map((sec) => {
        const Icon = sec.icon;
        const isActive = activeSection === sec.id;

        return (
          <button
            key={sec.id}
            type="button"
            data-active={isActive ? "true" : "false"}
            onClick={() => onSectionClick(sec.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 border",
              isActive
                ? "bg-primary text-white border-primary shadow-xs font-bold"
                : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/60"
            )}
          >
            {Icon && <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-white" : "text-muted-foreground")} />}
            <span>{sec.label}</span>
            {sec.badge !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                  isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                )}
              >
                {sec.badge}
              </span>
            )}
          </button>
        );
      })}
    </ScrollableTabBarContainer>
  );
}
