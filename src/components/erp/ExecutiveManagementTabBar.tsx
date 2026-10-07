import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TAB_BASE =
  "shrink-0 whitespace-nowrap border-b-2 border-transparent bg-transparent px-3 pb-2 pt-1 text-[12.5px] font-semibold text-muted-foreground shadow-none transition-all hover:text-foreground focus-visible:outline-none cursor-pointer flex items-center";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

export const EXECUTIVE_MANAGEMENT_TABS = [
  { to: "/management/executive-management/overview", label: "Overview" },
  { to: "/management/strategy-management/vision-mission", label: "Vision & Mission" },
  { to: "/management/strategy-management/okr-management", label: "OKR Management" },
  { to: "/management/strategy-management/kpi-management", label: "KPI Management" },
  { to: "/management/strategy-management/balanced-scorecard", label: "Balanced Scorecard" },
  { to: "/management/strategy-management/strategic-initiatives", label: "Strategic Initiatives" },
  { to: "/management/strategy-management/business-planning", label: "Business Planning" },
  { to: "/management/strategy-management/portfolio-management", label: "Portfolio Management" },
  { to: "/management/strategy-management/corporate-governance", label: "Corporate Governance" },
  { to: "/management/hrm-management/performance-management", label: "Performance Management" },
  { to: "/management/executive-management/executive-review", label: "Executive Review" },
  { to: "/management/executive-management/reports", label: "Reports" },
];

export function ExecutiveManagementTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

  // Drag-to-scroll state
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

  // Auto center active tab
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLElement>("[data-active='true']");
    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      if (activeRect.left < containerRect.left || activeRect.right > containerRect.right) {
        activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [pathname]);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 240;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    container.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDraggedRef.current = false;
    }
  };

  return (
    <div className="relative flex items-center border-b border-border/80 bg-background/95 backdrop-blur px-2 sm:px-4">
      {showLeftBtn && (
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="absolute left-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md border border-border/60 hover:bg-muted transition-all"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClickCapture={handleClickCapture}
        className={cn(
          "flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full",
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {EXECUTIVE_MANAGEMENT_TABS.map((tab) => {
          const isActive = pathname === tab.to || pathname.startsWith(tab.to + "/");
          return (
            <Link
              key={tab.to}
              to={tab.to}
              data-active={isActive}
              className={cn(TAB_BASE, isActive && TAB_ACTIVE)}
            >
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {showRightBtn && (
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="absolute right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md border border-border/60 hover:bg-muted transition-all"
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
