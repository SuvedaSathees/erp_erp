import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TAB_BASE =
  "shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent bg-transparent px-0.5 pb-3 text-[13px] font-semibold text-muted-foreground shadow-none transition-colors hover:text-foreground focus-visible:outline-none";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

const CRM_TABS = [
  { to: "/management/crm-management/lead-management", label: "Lead Management" },
  { to: "/management/crm-management/contact-management", label: "Contact Management" },
  { to: "/management/crm-management/account-management", label: "Account Management" },
  { to: "/management/crm-management/opportunity-management", label: "Opportunity Management" },
  { to: "/management/crm-management/sales-pipeline-management", label: "Sales Pipeline Management" },
  { to: "/management/crm-management/quotations-management", label: "Quotations Management" },
  { to: "/management/crm-management/customer-orders-management", label: "Customer Orders Management" },
  { to: "/management/crm-management/customer-support", label: "Customer Support" },
  { to: "/management/crm-management/complaint-management", label: "Complaint Management" },
  { to: "/management/crm-management/customer-feedback", label: "Customer Feedback" },
  { to: "/management/crm-management/customer-success", label: "Customer Success" },
  { to: "/management/crm-management/loyalty-management", label: "Loyalty Management" },
];

export function CrmManagementTabBar() {
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
        {CRM_TABS.map((tab) => {
          const active = pathname.startsWith(tab.to);

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
