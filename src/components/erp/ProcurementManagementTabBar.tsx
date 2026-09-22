import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  FileText,
  FileCheck,
  Layers,
  Users,
  FileSpreadsheet,
  ShieldAlert,
  BarChart3,
  Building2,
  Scale,
  FileBadge,
  PackageCheck,
  Receipt,
  CreditCard,
  Award,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TAB_BASE =
  "shrink-0 whitespace-nowrap border-b-2 border-transparent bg-transparent px-3 pb-2.5 pt-1 text-[13px] font-semibold text-muted-foreground shadow-none transition-all hover:text-foreground focus-visible:outline-none cursor-pointer flex items-center gap-1.5";
const TAB_ACTIVE = "border-primary text-primary hover:text-primary font-bold";

export const PROCUREMENT_MANAGEMENT_TABS = [
  { to: "/management/procurement-management/overview", label: "Overview", icon: BarChart3 },
  { to: "/management/procurement-management/purchase-requisition", label: "Purchase Requisition", icon: FileText },
  { to: "/management/procurement-management/rfq-quotation", label: "RFQ / Quotation", icon: FileCheck },
  { to: "/management/procurement-management/tender-management", label: "Tender Management", icon: Building2 },
  { to: "/management/procurement-management/vendor-quotation", label: "Vendor Quotation", icon: ShoppingCart },
  { to: "/management/procurement-management/vendor-comparison", label: "Vendor Comparison", icon: Scale },
  { to: "/management/procurement-management/purchase-order", label: "Purchase Order", icon: FileBadge },
  { to: "/management/procurement-management/goods-receipt", label: "Goods Receipt", icon: PackageCheck },
  { to: "/management/procurement-management/invoice-verification", label: "Invoice Verification", icon: Receipt },
  { to: "/management/procurement-management/vendor-payment", label: "Vendor Payment", icon: CreditCard },
  { to: "/management/procurement-management/contract-management", label: "Contract Management", icon: FileSpreadsheet },
  { to: "/management/procurement-management/vendor-evaluation", label: "Vendor Evaluation", icon: Award },
  { to: "/management/procurement-management/supplier-portal", label: "Supplier Portal", icon: Globe },
  { to: "/management/procurement-management/reports", label: "Report", icon: FileText },
];

export function ProcurementManagementTabBar() {
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
        {PROCUREMENT_MANAGEMENT_TABS.map((tab) => {
          const isActive = pathname === tab.to || (tab.to !== "/management/procurement-management/overview" && pathname.startsWith(tab.to));
          const Icon = tab.icon;

          return (
            <Link
              key={tab.to}
              to={tab.to}
              data-active={isActive ? "true" : "false"}
              className={cn(TAB_BASE, isActive && TAB_ACTIVE)}
            >
              <Icon className="h-3.5 w-3.5 opacity-70" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={cn(
                  "ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                  isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {tab.badge}
                </span>
              )}
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
