import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TAB_BASE =
  "shrink-0 whitespace-nowrap border-b-2 border-transparent bg-transparent px-3 pb-2.5 pt-1 text-[13px] font-semibold text-muted-foreground shadow-none transition-all hover:text-foreground focus-visible:outline-none cursor-pointer";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

export const ADMIN_MANAGEMENT_TABS = [
  { to: "/management/administration-management/organization-structure", label: "Organization Structure" },
  { to: "/management/administration-management/branch-management", label: "Branch Management" },
  { to: "/management/administration-management/department-management", label: "Department Management" },
  { to: "/management/administration-management/user-role-management", label: "User & Role Management" },
  { to: "/management/administration-management/approval-matrix-management", label: "Approval Matrix Management" },
  { to: "/management/administration-management/document-control-management", label: "Document Control Management" },
  { to: "/management/administration-management/policy-management", label: "Policy Management" },
  { to: "/management/administration-management/master-data-management", label: "Master Data Management" },
  { to: "/management/administration-management/notifications-management", label: "Notifications Management" },
  { to: "/management/administration-management/audit-management", label: "Audit Management" },
];

export function AdminManagementTabBar() {
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
  }, [pathname, checkScroll]);

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
    scrollContainerRef.current?.scrollBy({ left: -240, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 240, behavior: "smooth" });
  };

  return (
    <div className="sticky-tab-bar relative w-full border-b border-border/60 bg-card/50 py-0.5 group">
      {showLeftBtn && (
        <button
          type="button"
          onClick={scrollLeft}
          className="absolute left-0 top-0 z-20 flex h-full w-8 items-center justify-center bg-gradient-to-r from-card via-card/90 to-transparent text-slate-700 hover:text-slate-950 transition-all cursor-pointer"
          aria-label="Scroll sub-modules left"
        >
          <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="no-scrollbar flex items-center gap-2 overflow-x-auto px-2 pt-1 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {ADMIN_MANAGEMENT_TABS.map((tab) => {
          const isActive = pathname.startsWith(tab.to);

          return (
            <Link
              key={tab.to}
              to={tab.to}
              data-active={isActive ? "true" : "false"}
              className={cn(TAB_BASE, isActive && TAB_ACTIVE)}
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
          className="absolute right-0 top-0 z-20 flex h-full w-8 items-center justify-center bg-gradient-to-l from-card via-card/90 to-transparent text-slate-700 hover:text-slate-950 transition-all cursor-pointer"
          aria-label="Scroll sub-modules right"
        >
          <ChevronRight className="h-4 w-4 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}

