import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TAB_BASE =
  "shrink-0 whitespace-nowrap border-b-2 border-transparent bg-transparent px-3.5 pb-2.5 pt-1 text-[13px] font-semibold text-muted-foreground shadow-none transition-all hover:text-foreground focus-visible:outline-none cursor-pointer";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

export const SECURITY_MANAGEMENT_TABS = [
  { to: "/management/security-management/overview", label: "Overview" },
  { to: "/management/security-management/access-control", label: "Access Control" },
  { to: "/management/security-management/identity-management", label: "Identity Management" },
  { to: "/management/security-management/cybersecurity", label: "Cybersecurity" },
  { to: "/management/security-management/information-security", label: "Information Security" },
  { to: "/management/security-management/physical-security", label: "Physical Security" },
  { to: "/management/security-management/visitor-management", label: "Visitor Management" },
  { to: "/management/security-management/surveillance", label: "Surveillance" },
  { to: "/management/security-management/security-audit", label: "Security Audit" },
  { to: "/management/security-management/reports", label: "Reports" },
];

export function SecurityManagementTabBar() {
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
    if (container) {
      const activeEl = container.querySelector("[data-state='active']") as HTMLElement;
      if (activeEl) {
        const containerWidth = container.clientWidth;
        const targetScroll = activeEl.offsetLeft - containerWidth / 2 + activeEl.clientWidth / 2;
        container.scrollTo({ left: Math.max(0, targetScroll), behavior: "smooth" });
      }
    }
  }, [pathname]);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 240;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
      setIsDragging(true);
    }
    container.scrollLeft = scrollLeftRef.current - walk;
  };

  const onMouseUp = () => {
    isMouseDownRef.current = false;
    setTimeout(() => {
      setIsDragging(false);
      hasDraggedRef.current = false;
    }, 50);
  };

  const onMouseLeave = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
    hasDraggedRef.current = false;
  };

  return (
    <div className="relative flex items-center border-b border-border bg-card/60 backdrop-blur-xs select-none">
      {/* Scroll Left Button */}
      {showLeftBtn && (
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 z-20 flex h-full items-center bg-gradient-to-r from-card via-card/90 to-transparent pr-4 pl-1 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          aria-label="Scroll left"
        >
          <div className="rounded-full p-1 hover:bg-muted/80 shadow-xs border border-border/40 bg-card">
            <ChevronLeft className="h-4 w-4" />
          </div>
        </button>
      )}

      {/* Tabs Container */}
      <div
        ref={scrollContainerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        className={cn(
          "flex w-full items-center gap-1 overflow-x-auto scrollbar-none px-4 pt-2.5 pb-0.5",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {SECURITY_MANAGEMENT_TABS.map((tab) => {
          const isActive = pathname === tab.to || (tab.to !== "/management/security-management/overview" && pathname.startsWith(tab.to));

          return (
            <Link
              key={tab.to}
              to={tab.to}
              data-state={isActive ? "active" : "inactive"}
              onClick={(e) => {
                if (hasDraggedRef.current) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className={cn(
                TAB_BASE,
                isActive && TAB_ACTIVE,
                "flex items-center gap-1.5"
              )}
            >
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      {showRightBtn && (
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 z-20 flex h-full items-center bg-gradient-to-l from-card via-card/90 to-transparent pl-4 pr-1 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          aria-label="Scroll right"
        >
          <div className="rounded-full p-1 hover:bg-muted/80 shadow-xs border border-border/40 bg-card">
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>
      )}
    </div>
  );
}
