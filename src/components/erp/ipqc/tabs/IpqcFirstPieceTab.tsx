import React from "react";
import { CheckCircle2, ShieldCheck, PlayCircle, AlertCircle, Award } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { IpqcFirstPieceVerification } from "@/services/ipqcTypes";

interface IpqcFirstPieceTabProps {
  firstPiece: IpqcFirstPieceVerification;
  onUpdate: (updates: Partial<IpqcFirstPieceVerification>) => void;
}

export const IpqcFirstPieceTab: React.FC<IpqcFirstPieceTabProps> = ({
  firstPiece,
  onUpdate,
}) => {
  const gates = [
    { key: "setupVerified", label: "Setup Verification", desc: "Machine parameters, speed, and feeds set according to SOP" },
    { key: "toolVerified", label: "Tool Verification", desc: "Tool condition, wear offset, and calibration verified" },
    { key: "fixtureVerified", label: "Fixture Verification", desc: "Pneumatic clamps, datum pins, and jig alignment checked" },
    { key: "materialVerified", label: "Material Verification", desc: "Correct raw material, part number, and batch verified" },
    { key: "programRecipeVerified", label: "Program / Recipe Verification", desc: "Approved PLC program and torque profile loaded" },
    { key: "criticalDimensionsVerified", label: "Critical Dimensions", desc: "All 100% critical-to-quality dimensions verified" },
    { key: "functionalTestVerified", label: "Functional Test", desc: "Zero load and basic functional continuity validated" },
    { key: "inspectorApproved", label: "Inspector Approval", desc: "Lead Quality Inspector authorized signoff" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span>First-Piece Inspection & Production Release Gate</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Mandatory quality gate at every job setup changeover before full production run release.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Result: {firstPiece.firstPieceResult}</span>
          </span>

          {firstPiece.productionReleased && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Production Released</span>
            </span>
          )}
        </div>
      </div>

      {/* Gates Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {gates.map((gate) => {
          const isChecked = (firstPiece as any)[gate.key];
          return (
            <div
              key={gate.key}
              onClick={() => onUpdate({ [gate.key]: !isChecked })}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                isChecked
                  ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                  : "bg-muted/20 border-border hover:bg-muted/40"
              }`}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={(c) => onUpdate({ [gate.key]: !!c })}
                className="mt-0.5"
              />
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-bold text-foreground block">
                  {gate.label}
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  {gate.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Signoff banner */}
      <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-muted-foreground block text-[11px]">Authorized Signoff</span>
          <span className="font-bold text-foreground">
            Inspector: {firstPiece.signoffInspector} • Date: {firstPiece.signoffDate}
          </span>
          <p className="text-[11px] text-muted-foreground mt-0.5">{firstPiece.notes}</p>
        </div>

        <Button
          size="sm"
          onClick={() =>
            onUpdate({
              productionReleased: true,
              firstPieceResult: "Pass",
              signoffDate: new Date().toLocaleDateString(),
            })
          }
          className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
          <span>Release Production Run</span>
        </Button>
      </div>
    </div>
  );
};
