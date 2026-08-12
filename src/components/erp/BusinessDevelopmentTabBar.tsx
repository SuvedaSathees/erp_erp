import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TAB_BASE =
  "shrink-0 whitespace-nowrap border-b-2 border-transparent bg-transparent px-4 pb-3 pt-1 text-[13px] font-semibold text-muted-foreground shadow-none transition-all hover:text-foreground focus-visible:outline-none cursor-pointer";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

export const BUSINESS_DEVELOPMENT_TABS = [
  {
    to: "/development/business-development/business-model-development",
    label: "Business Model Development",
    full: "Business Model Development",
  },
  {
    to: "/development/business-development/value-proposition-development",
    label: "Value Proposition Development",
    full: "Value Proposition Development",
  },
  {
    to: "/development/business-development/customer-discovery",
    label: "Customer Discovery",
    full: "Customer Discovery",
  },
  {
    to: "/development/business-development/customer-validation",
    label: "Customer Validation",
    full: "Customer Validation",
  },
  {
    to: "/development/business-development/market-research",
    label: "Market Research",
    full: "Market Research",
  },
  {
    to: "/development/business-development/competitive-analysis",
    label: "Competitive Analysis",
    full: "Competitive Analysis",
  },
  {
    to: "/development/business-development/go-to-market-development",
    label: "Go-To-Market (GTM) Development",
    full: "Go-To-Market (GTM) Development",
  },
  {
    to: "/development/business-development/pricing-strategy-development",
    label: "Pricing Strategy Development",
    full: "Pricing Strategy Development",
  },
  {
    to: "/development/business-development/revenue-model-development",
    label: "Revenue Model Development",
    full: "Revenue Model Development",
  },
  {
    to: "/development/business-development/sales-channel-development",
    label: "Sales Channel Development",
    full: "Sales Channel Development",
  },
  {
    to: "/development/business-development/franchise-development",
    label: "Franchise Development",
    full: "Franchise Development",
  },
  {
    to: "/development/business-development/partnership-development",
    label: "Partnership Development",
    full: "Partnership Development",
  },
  {
    to: "/development/business-development/dealer-network-development",
    label: "Dealer Network Development",
    full: "Dealer Network Development",
  },
  {
    to: "/development/business-development/distributor-development",
    label: "Distributor Development",
    full: "Distributor Development",
  },
  {
    to: "/development/business-development/vendor-ecosystem-development",
    label: "Vendor Ecosystem Development",
    full: "Vendor Ecosystem Development",
  },
  {
    to: "/development/business-development/investor-relations-development",
    label: "Investor Relations Development",
    full: "Investor Relations Development",
  },
  {
    to: "/development/business-development/fundraising-development",
    label: "Fundraising Development",
    full: "Fundraising Development",
  },
  {
    to: "/development/business-development/international-expansion-development",
    label: "International Expansion Development",
    full: "International Expansion Development",
  },
  {
    to: "/development/business-development/export-development",
    label: "Export Development",
    full: "Export Development",
  },
  {
    to: "/development/business-development/business-scaling-development",
    label: "Business Scaling Development",
    full: "Business Scaling Development",
  },
  {
    to: "/development/business-development/corporate-strategy-development",
    label: "Corporate Strategy Development",
    full: "Corporate Strategy Development",
  },
  {
    to: "/development/business-development/business-transformation-development",
    label: "Business Transformation Development",
    full: "Business Transformation Development",
  },
];

export function BusinessDevelopmentTabBar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
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
  }, []);

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
  }, [currentPath]);

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
    <div className="sticky-tab-bar relative border-b border-border/80 bg-card">
      {showLeftBtn && (
        <button
          type="button"
          onClick={scrollLeft}
          className="absolute left-0 top-0 z-10 flex h-full w-8 items-center justify-center bg-gradient-to-r from-card via-card/90 to-transparent text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="no-scrollbar flex items-center gap-1 overflow-x-auto px-2 pt-2 scroll-smooth"
      >
        {BUSINESS_DEVELOPMENT_TABS.map((tab) => {
          const isActive =
            currentPath === tab.to ||
            (tab.to !== "/development/business-development" && currentPath.startsWith(tab.to));

          return (
            <Link
              key={tab.to}
              to={tab.to}
              title={tab.full}
              aria-label={tab.full}
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
          className="absolute right-0 top-0 z-10 flex h-full w-8 items-center justify-center bg-gradient-to-l from-card via-card/90 to-transparent text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
