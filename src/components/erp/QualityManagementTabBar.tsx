import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  ClipboardList,
  PackageCheck,
  Activity,
  CheckSquare,
  ShieldAlert,
  RefreshCw,
  Search,
  FileCheck,
  Scale,
  FileBadge,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TAB_BASE =
  "shrink-0 whitespace-nowrap border-b-2 border-transparent bg-transparent px-3 pb-3 pt-1 text-[13px] font-semibold text-muted-foreground shadow-none transition-all hover:text-foreground focus-visible:outline-none select-none";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

export const QUALITY_MANAGEMENT_TABS = [
  { to: "/management/quality-management/overview", label: "Overview", icon: BarChart3 },
  { to: "/management/quality-management/quality-planning", label: "Quality Planning", icon: ClipboardList },
  { to: "/management/quality-management/incoming-inspection", label: "Incoming Inspection", icon: PackageCheck },
  { to: "/management/quality-management/in-process-inspection", label: "In-Process Inspection", icon: Activity },
  { to: "/management/quality-management/final-inspection", label: "Final Inspection", icon: CheckSquare },
  { to: "/management/quality-management/ncr-management", label: "NCR Management", icon: ShieldAlert },
  { to: "/management/quality-management/capa", label: "CAPA Management", icon: RefreshCw },
  { to: "/management/quality-management/root-cause-analysis", label: "Root Cause Analysis", icon: Search },
  { to: "/management/quality-management/audit-management", label: "Audit Management", icon: FileCheck },
  { to: "/management/quality-management/calibration", label: "Calibration", icon: Scale },
  { to: "/management/quality-management/compliance", label: "Compliance", icon: FileBadge },
  { to: "/management/quality-management/quality-analytics", label: "Quality Analytics", icon: TrendingUp },
  { to: "/management/quality-management/reports", label: "Report", icon: FileCheck },
];

export function QualityManagementTabBar() {
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

    const activeEl = container.querySelector<HTMLElement>("[data-active='true']");
    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      if (activeRect.left < containerRect.left || activeRect.right > containerRect.right) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
    setTimeout(checkScroll, 350);
  }, [pathname, checkScroll]);

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

  // Drag-to-scroll handlers
  const onMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    container.scrollLeft = scrollLeftRef.current - walk;
    checkScroll();
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const onWheel = (e: React.WheelEvent) => {
    const container = scrollContainerRef.current;
    if (container && container.scrollWidth > container.clientWidth) {
      const isRight = e.deltaY > 0;
      const isLeft = e.deltaY < 0;
      const canRight = container.scrollLeft + container.clientWidth < container.scrollWidth - 2;
      const canLeft = container.scrollLeft > 2;
      if ((isRight && canRight) || (isLeft && canLeft)) {
        container.scrollLeft += e.deltaY;
        checkScroll();
      }
    }
  };

  return (
    <div className="relative border-b border-border/80 w-full group/tabbar">
      {/* Left scroll chevron */}
      {showLeftBtn && (
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-background via-background/90 to-transparent pr-4 pl-0.5 pointer-events-none">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="pointer-events-auto h-6 w-6 rounded-full border border-border/80 bg-background/95 shadow-xs flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Tabs container */}
      <div
        ref={scrollContainerRef}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className={cn(
          "flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 px-0.5 select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {QUALITY_MANAGEMENT_TABS.map((tab) => {
          const isActive =
            pathname === tab.to ||
            (tab.to !== "/management/quality-management/overview" && pathname.startsWith(tab.to));
          const Icon = tab.icon;

          return (
            <Link
              key={tab.to}
              to={tab.to}
              data-active={isActive ? "true" : "false"}
              onClick={(e) => {
                if (isDragging) e.preventDefault();
              }}
              className={cn(
                TAB_BASE,
                isActive && TAB_ACTIVE,
                "relative flex items-center gap-1.5 transition-colors duration-150 py-2",
              )}
            >
              <Icon className="h-3.5 w-3.5 opacity-80 shrink-0" />
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-1px_4px_rgba(11,59,123,0.3)]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right scroll chevron */}
      {showRightBtn && (
        <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-background via-background/90 to-transparent pl-4 pr-0.5 pointer-events-none">
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="pointer-events-auto h-6 w-6 rounded-full border border-border/80 bg-background/95 shadow-xs flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-95 cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default QualityManagementTabBar;
