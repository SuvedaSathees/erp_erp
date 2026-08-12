import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollableTabBarContainerProps {
  children: ReactNode;
  activeKey?: string | number | boolean;
  className?: string;
  containerClassName?: string;
  scrollDistance?: number;
  gradientBackground?: string; // CSS gradient class or background class
}

export function ScrollableTabBarContainer({
  children,
  activeKey,
  className,
  containerClassName,
  scrollDistance = 200,
  gradientBackground = "from-background via-background/90 to-transparent",
}: ScrollableTabBarContainerProps) {
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

  // Smoothly scroll active tab to center whenever activeKey changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const activeEl =
        container.querySelector('[data-active="true"]') ||
        container.querySelector('[aria-selected="true"]') ||
        container.querySelector(".border-primary");
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
      setTimeout(checkScroll, 350);
    }
  }, [activeKey]);

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
    scrollContainerRef.current?.scrollBy({ left: -scrollDistance, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: scrollDistance, behavior: "smooth" });
  };

  return (
    <div className={cn("relative border-b border-border/80 bg-background/95 backdrop-blur", className)}>
      {showLeftBtn && (
        <button
          type="button"
          onClick={scrollLeft}
          className={cn(
            "absolute left-0 top-0 z-10 flex h-full w-8 items-center justify-center bg-gradient-to-r text-muted-foreground transition-colors hover:text-foreground cursor-pointer",
            gradientBackground
          )}
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className={cn("no-scrollbar flex items-center gap-1 overflow-x-auto px-3 scroll-smooth", containerClassName)}
      >
        {children}
      </div>

      {showRightBtn && (
        <button
          type="button"
          onClick={scrollRight}
          className={cn(
            "absolute right-0 top-0 z-10 flex h-full w-8 items-center justify-center bg-gradient-to-l text-muted-foreground transition-colors hover:text-foreground cursor-pointer",
            gradientBackground
          )}
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
