import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { FactoryLayoutFormInput } from "@/services/types";

export function InfrastructureSection({
  form,
}: {
  form: UseFormReturn<FactoryLayoutFormInput>;
}) {
  const { register, watch, setValue } = form;

  const infraScore = watch("infrastructureScore") ?? 86;

  const availableProdAreas = ["Machining", "Stamping", "Testing", "Packing", "Welding", "Painting"];
  const selectedProdAreas = watch("productionAreas") || ["Machining", "Assembly", "Testing", "Packing"];

  const toggleProdArea = (item: string) => {
    if (selectedProdAreas.includes(item)) {
      setValue("productionAreas", selectedProdAreas.filter((x) => x !== item));
    } else {
      setValue("productionAreas", [...selectedProdAreas, item]);
    }
  };

  const availableAssyAreas = ["SMT", "Panel Assembly", "Final Assembly", "Sub-Assembly"];
  const selectedAssyAreas = watch("assemblyAreas") || ["SMT", "Panel Assembly", "Final Assembly"];

  const toggleAssyArea = (item: string) => {
    if (selectedAssyAreas.includes(item)) {
      setValue("assemblyAreas", selectedAssyAreas.filter((x) => x !== item));
    } else {
      setValue("assemblyAreas", [...selectedAssyAreas, item]);
    }
  };

  return (
    <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold">Manufacturing Infrastructure</CardTitle>
          <CardDescription className="text-xs">
            Shop floor allocation, production zones, warehousing capacity & maintenance workshops.
          </CardDescription>
        </div>

        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-2">
          <div>
            <span className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400 block tracking-wider">
              Infrastructure Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
                {infraScore}
              </span>
              <span className="text-xs text-emerald-500 font-semibold">/100</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
          {/* Warehouse Capacity */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground block">Warehouse Capacity (m²)</label>
            <Input
              type="number"
              {...register("warehouseCapacityM2", { valueAsNumber: true })}
              className="h-9 text-xs font-mono"
            />
          </div>

          {/* Loading Bays */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground block">Loading & Unloading Bays</label>
            <Input
              type="number"
              {...register("loadingUnloadingBays", { valueAsNumber: true })}
              className="h-9 text-xs font-mono"
            />
          </div>

          {/* Maintenance Workshop Checkbox */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground block">Maintenance Workshop</label>
            <div className="flex items-center gap-2.5 h-9 px-3 border border-border rounded-md bg-slate-50 dark:bg-slate-800/50">
              <Checkbox
                id="maintenanceWorkshop"
                checked={watch("maintenanceWorkshop") ?? true}
                onCheckedChange={(val) => setValue("maintenanceWorkshop", Boolean(val))}
              />
              <label htmlFor="maintenanceWorkshop" className="text-xs font-medium cursor-pointer whitespace-nowrap">
                Dedicated Tool & Maintenance Bay ✓
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-border/60">
          {/* Production Areas */}
          <div className="space-y-2">
            <span className="font-semibold text-foreground text-xs block">Production Areas</span>
            <div className="flex flex-wrap gap-2">
              {availableProdAreas.map((area) => {
                const isSelected = selectedProdAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleProdArea(area)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-background text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {isSelected ? `✓ ${area}` : `+ ${area}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assembly Areas */}
          <div className="space-y-2">
            <span className="font-semibold text-foreground text-xs block">Assembly Areas</span>
            <div className="flex flex-wrap gap-2">
              {availableAssyAreas.map((area) => {
                const isSelected = selectedAssyAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleAssyArea(area)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-background text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {isSelected ? `✓ ${area}` : `+ ${area}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
