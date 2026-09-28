import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TAB_BASE =
  "shrink-0 whitespace-nowrap border-b-2 border-transparent bg-transparent px-3.5 pb-2.5 pt-1 text-[13px] font-semibold text-muted-foreground shadow-none transition-all hover:text-foreground focus-visible:outline-none cursor-pointer";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

export const SUSTAINABILITY_MANAGEMENT_TABS = [
  { to: "/management/sustainability-management/overview", label: "Overview" },
  { to: "/management/sustainability-management/esg", label: "ESG" },
  { to: "/management/sustainability-management/carbon-footprint", label: "Carbon Footprint" },
  { to: "/management/sustainability-management/energy-monitoring", label: "Energy Monitoring" },
  { to: "/management/sustainability-management/water-management", label: "Water Management" },
  { to: "/management/sustainability-management/waste-management", label: "Waste Management" },
  { to: "/management/sustainability-management/recycling-management", label: "Recycling Management" },
  { to: "/management/sustainability-management/environmental-compliance", label: "Environmental Compliance" },
  { to: "/management/sustainability-management/sustainability-reporting", label: "Sustainability Reporting" },
  { to: "/management/sustainability-management/reports", label: "Reports" },
];

export function SustainabilityManagementTabBar() {
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
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 3) {
      hasDraggedRef.current = true;
      setIsDragging(true);
    }
    container.scrollLeft = scrollLeftRef.current - walk;
  };

  const onMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
    setTimeout(() => {
      hasDraggedRef.current = false;
      setIsDragging(false);
    }, 50);
  };

  const scrollByAmount = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-background">
      {/* Scroll indicator - Left arrow button */}
      {showLeftBtn && (
        <button
          type="button"
          onClick={() => scrollByAmount(-200)}
          className="absolute left-0 top-0 bottom-0 z-10 flex w-7 items-center justify-center bg-linear-to-r from-background via-background/90 to-transparent text-muted-foreground hover:text-foreground transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* Draggable / Scrollable container */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
        className={cn(
          "flex w-full items-center gap-1 overflow-x-auto border-b border-border select-none",
          "scrollbar-none scroll-smooth",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex items-center gap-1 px-4 pt-1">
          {SUSTAINABILITY_MANAGEMENT_TABS.map((tab) => {
            const isActive =
              pathname === tab.to ||
              (tab.to !== "/management/sustainability-management/overview" &&
                pathname.startsWith(tab.to + "/")) ||
              (tab.to === "/management/sustainability-management/overview" &&
                (pathname === "/management/sustainability-management" ||
                  pathname === "/management/sustainability-management/overview"));

            return (
              <Link
                key={tab.to}
                to={tab.to}
                data-active={isActive ? "true" : "false"}
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
      </div>

      {/* Scroll indicator - Right arrow button */}
      {showRightBtn && (
        <button
          type="button"
          onClick={() => scrollByAmount(200)}
          className="absolute right-0 top-0 bottom-0 z-10 flex w-7 items-center justify-center bg-linear-to-l from-background via-background/90 to-transparent text-muted-foreground hover:text-foreground transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
