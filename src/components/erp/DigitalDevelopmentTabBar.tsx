import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TAB_BASE =
  "shrink-0 whitespace-nowrap border-b-2 border-transparent bg-transparent px-3.5 pb-2.5 pt-1 text-[13px] font-semibold text-muted-foreground shadow-none transition-all hover:text-foreground focus-visible:outline-none cursor-pointer";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

export const DIGITAL_DEVELOPMENT_TABS = [
  { to: "/development/digital-development/data-warehouse-development", label: "Data Warehouse Development" },
  { to: "/development/digital-development/predictive-analytics", label: "Predictive Analytics" },
  { to: "/development/digital-development/ai-insights", label: "AI Insights" },
  { to: "/development/digital-development/data-visualization", label: "Data Visualization" },
];

export function DigitalDevelopmentTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftBtn(scrollLeft > 5);
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 5);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener("scroll", checkScroll, { passive: true });
      const observer = new ResizeObserver(() => checkScroll());
      observer.observe(container);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        observer.disconnect();
      };
    }
  }, [checkScroll]);

  return (
    <div className="relative border-b border-border bg-background/95 backdrop-blur-xs select-none">
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1 overflow-x-auto px-4 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {DIGITAL_DEVELOPMENT_TABS.map((tab) => {
          const isActive = pathname === tab.to || pathname.startsWith(tab.to + "/");
          return (
            <Link
              key={tab.to}
              to={tab.to}
              data-active={isActive}
              className={cn(TAB_BASE, isActive && TAB_ACTIVE)}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
