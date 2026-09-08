import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, ShieldCheck, Award, FileCheck2, ExternalLink, Download } from "lucide-react";
import { toast } from "sonner";

export function ComplianceContinuousMonitoringCard() {
  const handleDownloadDossier = () => {
    toast.success("Downloading Continuous Surveillance Audit Dossier (TR-QMS-2024-8891)");
  };

  const handleScheduleCheck = () => {
    toast.info("Pre-Surveillance internal audit scheduled for 15-Oct-2026");
  };

  return (
    <Card className="shadow-xs border-border/80 overflow-hidden min-w-0">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary shrink-0" />
          <div>
            <CardTitle className="text-sm font-bold text-foreground">
              Continuous Monitoring & Surveillance Audit
            </CardTitle>
            <span className="text-[11px] text-muted-foreground block">
              Third-party registrar schedule, re-certification milestones & health pulse
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadDossier}
            className="h-8 text-xs px-2.5 font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Surveillance Dossier</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleScheduleCheck}
            className="h-8 text-xs px-3 font-semibold bg-[#0B3B7B] hover:bg-[#092e60] text-white flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pre-Audit Review</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3.5 text-xs">
        {/* Highlight Card: Next Surveillance Audit Countdown */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 via-primary/5 to-transparent border border-blue-200/60 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
              Next External Surveillance Audit
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-foreground font-mono">
                15-Nov-2026
              </span>
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-bold">
                68 Days Remaining
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Registrar: <strong>TÜV Rheinland India</strong> • Lead: Dr. Hans Becker
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/50">
            <span className="text-[10px] text-muted-foreground block">Surveillance Cycle</span>
            <span className="font-bold text-foreground block font-mono">Year 2 of 3</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
              ✓ Pre-Audit Readiness 94.2%
            </span>
          </div>
        </div>

        {/* 3-Point Statutory Regulatory Verification Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-2.5 rounded-lg border border-border/70 bg-card/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-foreground">IATF 16949:2016</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] text-muted-foreground block">Cert. No. 0489211</span>
            <span className="text-[10px] font-semibold text-emerald-600 block">Valid through Sep 2027</span>
          </div>

          <div className="p-2.5 rounded-lg border border-border/70 bg-card/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-foreground">ISO 9001:2015</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] text-muted-foreground block">Cert. No. 9001-2024-88</span>
            <span className="text-[10px] font-semibold text-emerald-600 block">Valid through Nov 2027</span>
          </div>

          <div className="p-2.5 rounded-lg border border-border/70 bg-card/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-foreground">RoHS 3 & REACH</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] text-muted-foreground block">Declaration 2026-REV4</span>
            <span className="text-[10px] font-semibold text-emerald-600 block">100% Certified Compliant</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ComplianceContinuousMonitoringCard;
