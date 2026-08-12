import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ===========================================================================
   ModuleSubTabBar — the shared secondary tab row that every Research &
   Innovation, Product Development, and Manufacturing Development module
   renders beneath the area-level tab bar.
   Includes full horizontal scrolling with left/right gradient chevrons,
   mouse wheel horizontal scrolling, and auto active tab centering.
   =========================================================================== */

const TAB_BASE =
  "shrink-0 whitespace-nowrap border-b-2 border-transparent bg-transparent px-3 pb-3 pt-1 text-[13px] font-semibold text-muted-foreground shadow-none transition-all hover:text-foreground focus-visible:outline-none cursor-pointer";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

export type ModuleSubTab = {
  to: string;
  label: string;
  /** Tooltip / a11y label — full name when the visible label is shortened. */
  tooltip?: string;
  /** How to decide whether this tab is active for the current pathname.
   *  Defaults to `startsWith(to)`. Pass "exact" for tabs whose route is a
   *  prefix of another tab's route (e.g. `/foo` vs `/foo/new`). */
  activeMatch?: "startsWith" | "exact" | ((pathname: string) => boolean);
};

export function ModuleSubTabBar({ tabs }: { tabs: ModuleSubTab[] }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftBtn(scrollLeft > 5);
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

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
  }, [tabs]);

  // Smoothly scroll active tab to center whenever route/pathname changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const activeEl = container.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
      setTimeout(checkScroll, 350);
    }
  }, [pathname, tabs]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollWidth, clientWidth } = container;
      if (scrollWidth > clientWidth) {
        container.scrollLeft += e.deltaY;
      }
    }
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="relative border-b border-border/80 bg-background/95 backdrop-blur">
      {showLeftBtn && (
        <button
          type="button"
          onClick={scrollLeft}
          className="absolute left-0 top-0 z-10 flex h-full w-8 items-center justify-center bg-gradient-to-r from-background via-background/90 to-transparent text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="no-scrollbar flex items-center gap-1 overflow-x-auto px-3 scroll-smooth"
      >
        {tabs.map((tab) => {
          const active =
            typeof tab.activeMatch === "function"
              ? tab.activeMatch(pathname)
              : tab.activeMatch === "exact"
                ? pathname === tab.to
                : pathname.startsWith(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              title={tab.tooltip ?? tab.label}
              aria-label={tab.tooltip ?? tab.label}
              data-active={active ? "true" : "false"}
              className={cn(TAB_BASE, active && TAB_ACTIVE)}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {showRightBtn && (
        <button
          type="button"
          onClick={scrollRight}
          className="absolute right-0 top-0 z-10 flex h-full w-8 items-center justify-center bg-gradient-to-l from-background via-background/90 to-transparent text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
