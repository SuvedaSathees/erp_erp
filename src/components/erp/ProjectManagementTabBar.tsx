import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TAB_BASE =
  "shrink-0 whitespace-nowrap border-b-2 border-transparent bg-transparent px-3 pb-3 pt-1 text-[13px] font-semibold text-muted-foreground shadow-none transition-all hover:text-foreground focus-visible:outline-none select-none";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

export const PROJECT_MANAGEMENT_TABS = [
  { to: "/management/project-management/overview", label: "Overview" },
  { to: "/management/project-management/project-planning", label: "Project Planning" },
  { to: "/management/project-management/wbs", label: "WBS" },
  { to: "/management/project-management/milestones", label: "Milestones" },
  { to: "/management/project-management/task-management", label: "Task Management" },
  { to: "/management/project-management/time-tracking", label: "Time Tracking" },
  { to: "/management/project-management/resource-allocation", label: "Resource Allocation" },
  { to: "/management/project-management/budget-control", label: "Budget Control" },
  { to: "/management/project-management/risk-management", label: "Risk Management" },
  { to: "/management/project-management/issue-management", label: "Issue Management" },
  { to: "/management/project-management/project-billing", label: "Project Billing" },
  { to: "/management/project-management/project-analytics", label: "Project Analytics" },
];

export function ProjectManagementTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

  // Mouse Drag to Scroll state
  const isDraggingRef = useRef(false);
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

  // Auto-scroll active tab into view whenever route changes or on mount
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const activeTabEl = container.querySelector<HTMLElement>("[data-active='true']");
      if (activeTabEl) {
        activeTabEl.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
      setTimeout(checkScroll, 350);
    }
  }, [pathname, checkScroll]);

  // Mouse wheel horizontal scroll handler
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollWidth, clientWidth } = container;
      if (scrollWidth > clientWidth) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.2;
      }
    }
  };

  // Click handler for left/right scroll buttons
  const scrollBy = (amount: number) => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  // Mouse drag handlers for smooth swiping/dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    container.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div className="relative flex items-center border-b border-border bg-white dark:bg-slate-900 px-2 shadow-sm">
      {/* Left Scroll Button */}
      {showLeftBtn && (
        <button
          type="button"
          onClick={() => scrollBy(-240)}
          className="absolute left-0 z-10 flex h-full w-10 items-center justify-center bg-gradient-to-r from-white dark:from-slate-900 via-white/95 dark:via-slate-900/95 to-transparent text-muted-foreground hover:text-foreground cursor-pointer transition-opacity"
          aria-label="Scroll submodules left"
        >
          <div className="h-6 w-6 rounded-full bg-white dark:bg-slate-800 border border-border shadow-md flex items-center justify-center hover:scale-110 transition-transform">
            <ChevronLeft className="h-4 w-4" />
          </div>
        </button>
      )}

      {/* Navigation Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={cn(
          "flex w-full gap-4 overflow-x-auto scroll-smooth py-2 px-2 [&::-webkit-scrollbar]:hidden",
          isDragging ? "cursor-grabbing select-none" : "cursor-grab",
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {PROJECT_MANAGEMENT_TABS.map((tab) => {
          const active =
            pathname === tab.to ||
            (tab.to !== "/management/project-management/overview" && pathname.startsWith(tab.to));

          return (
            <Link
              key={tab.to}
              to={tab.to}
              data-active={active ? "true" : undefined}
              className={cn(TAB_BASE, active && TAB_ACTIVE)}
              draggable={false}
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
          onClick={() => scrollBy(240)}
          className="absolute right-0 z-10 flex h-full w-10 items-center justify-end bg-gradient-to-l from-white dark:from-slate-900 via-white/95 dark:via-slate-900/95 to-transparent text-muted-foreground hover:text-foreground cursor-pointer transition-opacity pr-0.5"
          aria-label="Scroll submodules right"
        >
          <div className="h-6 w-6 rounded-full bg-white dark:bg-slate-800 border border-border shadow-md flex items-center justify-center hover:scale-110 transition-transform">
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>
      )}
    </div>
  );
}

export default ProjectManagementTabBar;
