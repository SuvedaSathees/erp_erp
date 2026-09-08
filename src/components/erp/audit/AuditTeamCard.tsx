import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Shield } from "lucide-react";
import { AuditRecord } from "@/services/auditTypes";

interface AuditTeamCardProps {
  record: AuditRecord;
}

export function AuditTeamCard({ record }: AuditTeamCardProps) {
  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Audit Team Roster
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3 text-xs">
        {/* Lead Auditor */}
        <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-foreground">{record.leadAuditor}</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-medium">
                Lead Auditor (ISO Certified)
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 px-1.5 py-0.5 rounded font-semibold">
            Active
          </span>
        </div>

        {/* Audit Team Members */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block px-1">
            Assigned Co-Auditors
          </span>
          {record.auditTeam.map((member, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium text-foreground">{member}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Auditor</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
