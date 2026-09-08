import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HelpCircle, MapPin, Calendar, User, AlertOctagon, TrendingDown, Cpu } from "lucide-react";
import { RcaRecord } from "@/services/rcaTypes";

interface RcaProblemDefinitionCardProps {
  record: RcaRecord;
  onChange: (field: keyof RcaRecord, value: any) => void;
}

export function RcaProblemDefinitionCard({
  record,
  onChange,
}: RcaProblemDefinitionCardProps) {
  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          5W2H Structured Problem Definition
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 min-w-0">
        {/* What */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            WHAT happened? (Specific Defect Symptom)
          </Label>
          <Textarea
            value={record.what}
            onChange={(e) => onChange("what", e.target.value)}
            rows={2}
            className="text-xs leading-relaxed resize-none font-medium"
          />
        </div>

        {/* Where, When, Who */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              WHERE was it found?
            </Label>
            <Input
              value={record.where}
              onChange={(e) => onChange("where", e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              WHEN did it happen?
            </Label>
            <Input
              value={record.when}
              onChange={(e) => onChange("when", e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              WHO detected it?
            </Label>
            <Input
              value={record.who}
              onChange={(e) => onChange("who", e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Why, How, How Much */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              WHY is it critical?
            </Label>
            <Input
              value={record.why}
              onChange={(e) => onChange("why", e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              HOW did it occur?
            </Label>
            <Input
              value={record.how}
              onChange={(e) => onChange("how", e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
              HOW MUCH? (Quantification)
            </Label>
            <Input
              value={record.howMuch}
              onChange={(e) => onChange("howMuch", e.target.value)}
              className="h-9 text-xs font-mono font-bold text-rose-600 dark:text-rose-400"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
