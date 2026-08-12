import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TAB_BASE =
  "shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent bg-transparent px-0.5 pb-3 text-[13px] font-semibold text-muted-foreground shadow-none transition-colors hover:text-foreground focus-visible:outline-none";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary";

const TABS = [
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -240 : 240;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center w-full group">
      {/* Left Arrow Button */}
      {canScrollLeft && (
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/95 border border-border/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-muted hover:scale-105 cursor-pointer -translate-y-1.5"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* Tab Items Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-6 overflow-x-auto border-b border-border/40 pb-0 scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth w-full px-1"
      >
        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.to);
          return (
            <Link key={tab.to} to={tab.to} className={cn(TAB_BASE, active && TAB_ACTIVE)}>
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Right Arrow Button */}
      {canScrollRight && (
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/95 border border-border/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-muted hover:scale-105 cursor-pointer -translate-y-1.5"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
