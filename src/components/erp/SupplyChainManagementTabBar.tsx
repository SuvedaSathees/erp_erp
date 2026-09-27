import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TAB_BASE =
  "shrink-0 whitespace-nowrap border-b-2 border-transparent bg-transparent px-3 pb-3 pt-1 text-[13px] font-semibold text-muted-foreground shadow-none transition-all hover:text-foreground focus-visible:outline-none select-none";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

export const SUPPLY_CHAIN_MANAGEMENT_TABS = [
  { to: "/management/supply-chain-management/overview", label: "Overview" },
  { to: "/management/supply-chain-management/demand-planning", label: "Demand Planning" },
  { to: "/management/supply-chain-management/supply-planning", label: "Supply Planning" },
  { to: "/management/supply-chain-management/inventory", label: "Inventory" },
  { to: "/management/supply-chain-management/warehouse", label: "Warehouse" },
  { to: "/management/supply-chain-management/material-planning", label: "Material Planning" },
  { to: "/management/supply-chain-management/logistics", label: "Logistics & Distribution" },
  { to: "/management/supply-chain-management/fleet-management", label: "Fleet Management" },
  { to: "/management/supply-chain-management/packaging-management", label: "Packaging Management" },
  { to: "/management/supply-chain-management/reverse-logistics", label: "Reverse Logistics" },
  { to: "/management/supply-chain-management/supply-analytics", label: "Supply Analytics" },
  { to: "/management/supply-chain-management/reports", label: "Report" },
];

export function SupplyChainManagementTabBar() {
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
    if (!container) return;

    const activeEl = container.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      // If active element is outside of visible area, smoothly center it
      if (activeRect.left < containerRect.left || activeRect.right > containerRect.right) {
        const offset =
          activeEl.offsetLeft -
          container.clientWidth / 2 +
          activeEl.clientWidth / 2;
        container.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
      }
    }
  }, [pathname]);

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

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    container.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div className="relative border-b border-border/80 bg-background/50 px-2 sm:px-4">
      {/* Scroll indicator overlay left */}
      {showLeftBtn && (
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-background via-background/80 to-transparent pr-4 pl-1">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll tabs left"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-card shadow-sm border border-border/80 text-muted-foreground hover:text-foreground transition-colors hover:scale-105"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tabs Container */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={cn(
          "flex space-x-1 overflow-x-auto no-scrollbar scroll-smooth py-1",
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {SUPPLY_CHAIN_MANAGEMENT_TABS.map((tab) => {
          const isActive =
            pathname === tab.to ||
            (tab.to === "/management/supply-chain-management/logistics" &&
              (pathname.startsWith("/management/supply-chain-management/logistics") ||
                pathname.startsWith("/management/supply-chain-management/transportation") ||
                pathname.startsWith("/management/supply-chain-management/distribution") ||
                pathname.startsWith("/management/supply-chain-management/dispatch-management"))) ||
            (tab.to !== "/management/supply-chain-management/overview" &&
              tab.to !== "/management/supply-chain-management/reports" &&
              tab.to !== "/management/supply-chain-management/logistics" &&
              pathname.startsWith(tab.to));

          return (
            <Link
              key={tab.to}
              to={tab.to}
              data-active={isActive}
              draggable={false}
              className={cn(TAB_BASE, isActive && TAB_ACTIVE)}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Scroll indicator overlay right */}
      {showRightBtn && (
        <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-background via-background/80 to-transparent pl-4 pr-1">
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll tabs right"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-card shadow-sm border border-border/80 text-muted-foreground hover:text-foreground transition-colors hover:scale-105"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default SupplyChainManagementTabBar;
