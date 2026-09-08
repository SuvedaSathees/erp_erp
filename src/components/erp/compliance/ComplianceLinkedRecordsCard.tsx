import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, ExternalLink, ShieldCheck, AlertOctagon, RefreshCw } from "lucide-react";
import { ComplianceRecord } from "@/services/complianceTypes";
import { Link } from "@tanstack/react-router";

interface ComplianceLinkedRecordsCardProps {
  record: ComplianceRecord;
}

export function ComplianceLinkedRecordsCard({
  record,
}: ComplianceLinkedRecordsCardProps) {
  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" />
          Interconnected Quality Records
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 p-0">
        <div className="divide-y divide-border/60 text-xs">
          {/* Linked Audit */}
          {record.linkedAuditId && (
            <Link
              to="/management/quality-management/audit-management"
              className="p-3 hover:bg-muted/30 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="font-semibold text-foreground group-hover:text-primary">
                    {record.linkedAuditId}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Q3 ISO 9001 Internal Quality Audit
                  </span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
            </Link>
          )}

          {/* Linked NCR */}
          {record.linkedNcrId && (
            <Link
              to="/management/quality-management/ncr-management"
              className="p-3 hover:bg-muted/30 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <div>
                  <span className="font-semibold text-foreground group-hover:text-primary">
                    {record.linkedNcrId}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Cleanroom RH excursion non-conformance
                  </span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
            </Link>
          )}

          {/* Linked CAPA */}
          {record.linkedCapaId && (
            <Link
              to="/management/quality-management/capa"
              className="p-3 hover:bg-muted/30 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-purple-600" />
                <div>
                  <span className="font-semibold text-foreground group-hover:text-primary">
                    {record.linkedCapaId}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    HVAC RH Stabilization Preventive Action
                  </span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
