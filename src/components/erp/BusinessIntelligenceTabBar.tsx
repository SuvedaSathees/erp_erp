import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TAB_BASE =
  "shrink-0 whitespace-nowrap border-b-2 border-transparent bg-transparent px-3 pb-2 pt-1 text-[12.5px] font-semibold text-muted-foreground shadow-none transition-all hover:text-foreground focus-visible:outline-none cursor-pointer";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

export const BUSINESS_INTELLIGENCE_TABS = [
  { to: "/management/business-intelligence/overview", label: "Overview" },
  { to: "/management/business-intelligence/executive-dashboard", label: "Executive Dashboard" },
  { to: "/management/business-intelligence/kpi-monitoring", label: "KPI Monitoring" },
  { to: "/management/business-intelligence/decision-support", label: "Decision Support" },
  { to: "/management/business-intelligence/data-warehouse-development", label: "Data Warehouse" },
  { to: "/management/business-intelligence/etl-pipelines", label: "ETL Pipelines" },
  { to: "/management/business-intelligence/predictive-analytics", label: "Predictive Analytics" },
  { to: "/management/business-intelligence/ai-insights", label: "AI Insights" },
  { to: "/management/business-intelligence/data-visualization", label: "Data Visualization" },
  { to: "/management/business-intelligence/reports", label: "Reports" },
];

export function BusinessIntelligenceTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

  // Mouse Drag to Scroll state
  const isMouseDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

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

  // Smoothly center the active tab when route changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeEl = container.querySelector<HTMLElement>("[data-active='true']");
    if (!activeEl) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    const scrollTarget =
      container.scrollLeft +
      (activeRect.left - containerRect.left) -
      containerRect.width / 2 +
      activeRect.width / 2;

    container.scrollTo({
      left: Math.max(0, scrollTarget),
      behavior: "smooth",
    });
  }, [pathname]);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 280;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const x = e.pageX - container.offsetLeft;
    const walk = x - startXRef.current;

    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
      setIsDragging(true);
      container.scrollLeft = scrollLeftRef.current - walk;
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    setTimeout(() => {
      setIsDragging(false);
      hasDraggedRef.current = false;
    }, 50);
  };

  return (
    <div className="relative border-b border-border bg-background/95 backdrop-blur-xs select-none">
      {/* Left Scroll Button */}
      {showLeftBtn && (
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 flex w-7 items-center justify-center bg-gradient-to-r from-background via-background/90 to-transparent text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4 drop-shadow-xs" />
        </button>
      )}

      {/* Tabs Container */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={cn(
          "flex items-center gap-1 overflow-x-auto px-4 scrollbar-none",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {BUSINESS_INTELLIGENCE_TABS.map((tab) => {
          const tabSlug = tab.to.split("/").pop() || "";
          const isActive =
            pathname === tab.to ||
            pathname.startsWith(tab.to + "/") ||
            (tabSlug && pathname.includes(tabSlug));
          return (
            <Link
              key={tab.to}
              to={tab.to}
              data-active={isActive}
              onClick={(e) => {
                if (hasDraggedRef.current) {
                  e.preventDefault();
                }
              }}
              className={cn(TAB_BASE, isActive && TAB_ACTIVE)}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Right Scroll Button */}
      {showRightBtn && (
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-0 bottom-0 z-10 flex w-7 items-center justify-center bg-gradient-to-l from-background via-background/90 to-transparent text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4 drop-shadow-xs" />
        </button>
      )}
    </div>
  );
}
