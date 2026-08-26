import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TAB_BASE =
  "shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent bg-transparent px-0.5 pb-3 text-[13px] font-semibold text-muted-foreground shadow-none transition-colors hover:text-foreground focus-visible:outline-none";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

export const HRM_TABS: { to: string; label: string; disabled?: boolean }[] = [
  { to: "/management/hrm-management/overview", label: "Overview" },
  { to: "/management/hrm-management/workforce-planning", label: "Workforce Planning" },
  { to: "/management/hrm-management/recruitment-management", label: "Recruitment Management" },
  { to: "/management/hrm-management/onboarding-management", label: "Onboarding Management" },
  { to: "/management/hrm-management/employee-management", label: "Employee Management" },
  { to: "/management/hrm-management/attendance-management", label: "Attendance Management" },
  { to: "/management/hrm-management/leave-management", label: "Leave Management" },
  { to: "/management/hrm-management/payroll-management", label: "Payroll Management" },
  { to: "/management/hrm-management/performance-management", label: "Performance Management" },
  { to: "/management/hrm-management/learning-development", label: "Training & Development" },
  { to: "/management/hrm-management/performance-management/competency-form", label: "Competency Form" },
  { to: "/management/hrm-management/career-development", label: "Career Development" },
  { to: "/management/hrm-management/travel-expense", label: "Travel & Expense" },
  { to: "/management/hrm-management/expense-claims", label: "Expense Claims" },
  { to: "/management/hrm-management/employee-welfare", label: "Employee Welfare" },
  { to: "/management/hrm-management/exit-management", label: "Exit Management" },
  { to: "/management/hrm-management/hr-analytics", label: "HR Analytics" },
];

export function HrmManagementTabBar() {
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

    // Auto-scroll active tab into view
    const activeEl = el.querySelector("[data-active='true']") as HTMLElement;
    if (activeEl) {
      const containerLeft = el.getBoundingClientRect().left;
      const containerRight = el.getBoundingClientRect().right;
      const activeLeft = activeEl.getBoundingClientRect().left;
      const activeRight = activeEl.getBoundingClientRect().right;

      if (activeLeft < containerLeft || activeRight > containerRight) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [pathname, checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -280 : 280;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center w-full group py-1">
      {/* Left Arrow Button */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="absolute left-0 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-slate-300 text-slate-700 shadow-md transition-all hover:bg-slate-50 hover:scale-110 cursor-pointer -translate-y-1"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* Tab Items Container Slider */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-6 overflow-x-auto border-b border-border/40 pb-0 scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth w-full px-2"
      >
        {HRM_TABS.map((tab) => {
          const active = pathname.startsWith(tab.to);

          if (tab.disabled) {
            return (
              <span
                key={tab.to}
                className={cn(
                  TAB_BASE,
                  "cursor-not-allowed opacity-50 hover:text-muted-foreground",
                )}
                title="Upcoming HRM Submodule"
              >
                {tab.label}
              </span>
            );
          }

          return (
            <Link
              key={tab.to}
              to={tab.to}
              data-active={active}
              className={cn(TAB_BASE, active && TAB_ACTIVE)}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Right Arrow Button */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="absolute right-0 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-slate-300 text-slate-700 shadow-md transition-all hover:bg-slate-50 hover:scale-110 cursor-pointer -translate-y-1"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
