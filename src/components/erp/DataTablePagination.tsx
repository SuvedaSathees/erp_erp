import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalEntries: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  entityName?: string;
  className?: string;
}

export function DataTablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalEntries,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  entityName = "entries",
  className,
}: DataTablePaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);

  const startEntry = totalEntries === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endEntry = Math.min(safeCurrentPage * pageSize, totalEntries);

  // Generate page numbers with smart ellipsis matching `< 1 2 3 4 5 ... N >`
  const pageNumbers = useMemo(() => {
    if (safeTotalPages <= 7) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis-end", safeTotalPages];
    }

    if (safeCurrentPage >= safeTotalPages - 3) {
      return [
        1,
        "ellipsis-start",
        safeTotalPages - 4,
        safeTotalPages - 3,
        safeTotalPages - 2,
        safeTotalPages - 1,
        safeTotalPages,
      ];
    }

    return [
      1,
      "ellipsis-start",
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      "ellipsis-end",
      safeTotalPages,
    ];
  }, [safeTotalPages, safeCurrentPage]);

  return (
    <div
      className={cn(
        "p-3 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground select-none",
        className
      )}
    >
      <span>
        Showing <strong className="font-mono font-semibold text-foreground">{startEntry}</strong> to{" "}
        <strong className="font-mono font-semibold text-foreground">{endEntry}</strong> of{" "}
        <strong className="font-mono font-semibold text-foreground">{totalEntries.toLocaleString()}</strong>{" "}
        {entityName}
      </span>

      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Previous Page Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safeCurrentPage <= 1}
          onClick={() => onPageChange(Math.max(1, safeCurrentPage - 1))}
          className="h-7 w-7 p-0 text-xs font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          title="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        {/* Page Number Buttons */}
        {pageNumbers.map((item, idx) => {
          if (typeof item === "string") {
            return (
              <span key={`ellipsis-${idx}`} className="px-1.5 font-mono text-muted-foreground">
                &hellip;
              </span>
            );
          }

          const isActive = item === safeCurrentPage;
          return (
            <Button
              key={item}
              type="button"
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(item)}
              className={cn(
                "h-7 min-w-[28px] px-2 text-xs font-mono font-semibold transition-all cursor-pointer",
                isActive
                  ? "bg-[#0B3B7B] hover:bg-[#082B5B] text-white shadow-xs font-bold"
                  : "hover:bg-muted text-foreground"
              )}
            >
              {item}
            </Button>
          );
        })}

        {/* Next Page Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safeCurrentPage >= safeTotalPages}
          onClick={() => onPageChange(Math.min(safeTotalPages, safeCurrentPage + 1))}
          className="h-7 w-7 p-0 text-xs font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          title="Next page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>

        {/* Page Size Selector */}
        {onPageSizeChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="ml-2 inline-flex items-center gap-1 h-7 px-2.5 rounded-md border border-border/80 bg-background hover:bg-muted text-foreground text-xs font-medium cursor-pointer transition shadow-2xs"
              >
                <span>{pageSize} / page</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28 text-xs">
              {pageSizeOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => onPageSizeChange(opt)}
                  className={cn(
                    "cursor-pointer font-mono flex items-center justify-between",
                    pageSize === opt && "font-bold text-primary"
                  )}
                >
                  <span>{opt} / page</span>
                  {pageSize === opt && <span>✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
