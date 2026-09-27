import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TAB_BASE =
  "shrink-0 whitespace-nowrap border-b-2 border-transparent bg-transparent px-3.5 pb-2.5 pt-1 text-[13px] font-semibold text-muted-foreground shadow-none transition-all hover:text-foreground focus-visible:outline-none cursor-pointer";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

const RISK_TABS = [
  { to: "/management/risk-management/overview", label: "Overview" },
  { to: "/management/risk-management/enterprise-risk", label: "Enterprise Risk" },
  { to: "/management/risk-management/operational-risk", label: "Operational Risk" },
  { to: "/management/risk-management/financial-risk", label: "Financial Risk" },
  { to: "/management/risk-management/vendor-risk", label: "Vendor Risk" },
  { to: "/management/risk-management/project-risk", label: "Project Risk" },
  { to: "/management/risk-management/compliance-risk", label: "Compliance Risk" },
  { to: "/management/risk-management/incident-management", label: "Incident Management" },
  { to: "/management/risk-management/business-continuity", label: "Business Continuity" },
  { to: "/management/risk-management/disaster-recovery", label: "Disaster Recovery" },
  { to: "/management/risk-management/reports", label: "Report" },
];

export function RiskManagementTabBar() {
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

  // Smoothly center the active tab when route changes or initially mounted
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeEl = container.querySelector<HTMLElement>("[data-active='true']");
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
    setTimeout(checkScroll, 300);
  }, [pathname, checkScroll]);

  // Mouse Wheel horizontal scroll
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollWidth, clientWidth } = container;
      if (scrollWidth > clientWidth) {
        container.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX;
        checkScroll();
      }
    }
  };

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const delta = Math.abs(x - startXRef.current);
    if (delta > 5) {
      hasDraggedRef.current = true;
      if (!isDragging) setIsDragging(true);
      e.preventDefault();
      const walk = (x - startXRef.current) * 1.5;
      container.scrollLeft = scrollLeftRef.current - walk;
      checkScroll();
    }
  };

  const stopDragging = () => {
    isMouseDownRef.current = false;
    if (hasDraggedRef.current) {
      setTimeout(() => {
        hasDraggedRef.current = false;
        setIsDragging(false);
      }, 50);
    } else {
      setIsDragging(false);
    }
  };

  // Button click scrolls by 240px
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 240;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative border-b border-border bg-card w-full group/tabbar select-none">
      {/* Left scroll chevron */}
      {showLeftBtn && (
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-card via-card/95 to-transparent pr-6 pl-1.5 pointer-events-none">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="pointer-events-auto h-7 w-7 rounded-full border border-border bg-card shadow-sm flex items-center justify-center text-foreground hover:bg-muted transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tabs Container */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className={cn(
          "flex items-center gap-1 overflow-x-auto scroll-smooth py-1 px-8 scrollbar-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {RISK_TABS.map((tab) => {
          const isActive =
            pathname === tab.to ||
            (tab.to !== "/management/risk-management/overview" && pathname.startsWith(tab.to));

          return (
            <Link
              key={tab.to}
              to={tab.to}
              preload="intent"
              preloadDelay={0}
              data-active={isActive ? "true" : "false"}
              onClick={(e) => {
                if (hasDraggedRef.current) e.preventDefault();
              }}
              className={cn(
                TAB_BASE,
                isActive && TAB_ACTIVE,
                "relative flex items-center gap-1.5 transition-colors duration-150",
              )}
            >
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Right scroll chevron */}
      {showRightBtn && (
        <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-card via-card/95 to-transparent pl-6 pr-1.5 pointer-events-none">
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="pointer-events-auto h-7 w-7 rounded-full border border-border bg-card shadow-sm flex items-center justify-center text-foreground hover:bg-muted transition-all active:scale-95 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default RiskManagementTabBar;
