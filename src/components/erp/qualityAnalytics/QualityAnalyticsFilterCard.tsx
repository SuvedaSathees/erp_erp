import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RotateCcw, ChevronDown, ChevronUp, Check, SlidersHorizontal } from "lucide-react";
import { QualityAnalyticsFilters } from "@/services/qualityAnalyticsTypes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QualityAnalyticsFilterCardProps {
  filters: QualityAnalyticsFilters;
  onFilterChange: (key: keyof QualityAnalyticsFilters, value: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export function QualityAnalyticsFilterCard({
  filters,
  onFilterChange,
  onApply,
  onReset,
}: QualityAnalyticsFilterCardProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-card border border-border/80 rounded-xl p-3 shadow-xs space-y-3">
      {/* Primary Sleek Filter Bar (Single Row) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <span>Filters:</span>
          </div>

          {/* Plant Selector */}
          <Select
            value={filters.plant}
            onValueChange={(val) => onFilterChange("plant", val)}
          >
            <SelectTrigger className="h-8 text-xs w-[140px] bg-background border-border/70 font-medium">
              <SelectValue placeholder="Plant" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="All Plants">All Plants</SelectItem>
              <SelectItem value="Plant 1 (SMT)">Plant 1 (SMT)</SelectItem>
              <SelectItem value="Plant 2 (Assembly)">Plant 2 (Assembly)</SelectItem>
              <SelectItem value="Plant 3 (Final Testing)">Plant 3 (Final Testing)</SelectItem>
            </SelectContent>
          </Select>

          {/* Process Selector */}
          <Select
            value={filters.process}
            onValueChange={(val) => onFilterChange("process", val)}
          >
            <SelectTrigger className="h-8 text-xs w-[140px] bg-background border-border/70 font-medium">
              <SelectValue placeholder="Process" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="All Processes">All Processes</SelectItem>
              <SelectItem value="Assembly">Assembly</SelectItem>
              <SelectItem value="Electrical Test">Electrical Test</SelectItem>
              <SelectItem value="Functional Test">Functional Test</SelectItem>
              <SelectItem value="Packaging">Packaging</SelectItem>
            </SelectContent>
          </Select>

          {/* Shift Selector */}
          <Select
            value={filters.shift}
            onValueChange={(val) => onFilterChange("shift", val)}
          >
            <SelectTrigger className="h-8 text-xs w-[130px] bg-background border-border/70 font-medium">
              <SelectValue placeholder="Shift" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="All Shifts">All Shifts</SelectItem>
              <SelectItem value="Morning Shift A">Morning Shift A</SelectItem>
              <SelectItem value="Evening Shift B">Evening Shift B</SelectItem>
              <SelectItem value="Night Shift C">Night Shift C</SelectItem>
            </SelectContent>
          </Select>

          {/* More Filters Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <span>{showAdvanced ? "Fewer Filters" : "More Filters"}</span>
            {showAdvanced ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-8 px-2.5 text-xs font-medium border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onApply}
            className="h-8 px-3 text-xs font-semibold bg-[#0B3B7B] hover:bg-[#092e60] text-white flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3 h-3" />
            <span>Apply</span>
          </Button>
        </div>
      </div>

      {/* Advanced Collapsible Row */}
      {showAdvanced && (
        <div className="pt-2 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-2.5 animate-in fade-in-50 duration-200">
          <div>
            <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
              Department
            </span>
            <Select
              value={filters.department}
              onValueChange={(val) => onFilterChange("department", val)}
            >
              <SelectTrigger className="h-8 text-xs bg-background">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="All Departments">All Departments</SelectItem>
                <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Incoming Stores">Incoming Stores</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
              Product Family
            </span>
            <Select
              value={filters.productFamily}
              onValueChange={(val) => onFilterChange("productFamily", val)}
            >
              <SelectTrigger className="h-8 text-xs bg-background">
                <SelectValue placeholder="Product Family" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="All">All Families</SelectItem>
                <SelectItem value="Industrial Drives">Industrial Drives</SelectItem>
                <SelectItem value="Power Controllers">Power Controllers</SelectItem>
                <SelectItem value="Sensors & Relays">Sensors & Relays</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
              Supplier Tier
            </span>
            <Select
              value={filters.supplier}
              onValueChange={(val) => onFilterChange("supplier", val)}
            >
              <SelectTrigger className="h-8 text-xs bg-background">
                <SelectValue placeholder="Supplier" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="All Suppliers">All Suppliers</SelectItem>
                <SelectItem value="Tier 1 Direct">Tier 1 Direct</SelectItem>
                <SelectItem value="Tier 2 Component">Tier 2 Component</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
              Defect Category
            </span>
            <Select
              value={filters.defectCategory}
              onValueChange={(val) => onFilterChange("defectCategory", val)}
            >
              <SelectTrigger className="h-8 text-xs bg-background">
                <SelectValue placeholder="Defect Category" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="All">All Defects</SelectItem>
                <SelectItem value="Surface Defect">Surface Defect</SelectItem>
                <SelectItem value="Assembly Error">Assembly Error</SelectItem>
                <SelectItem value="Electrical Failure">Electrical Failure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

export default QualityAnalyticsFilterCard;
