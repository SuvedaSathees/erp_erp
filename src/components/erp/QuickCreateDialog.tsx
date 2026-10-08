import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type QuickField = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "textarea";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number;
};

export type QuickValues = Record<string, string | number>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: QuickField[];
  submitLabel?: string;
  onSubmit: (values: QuickValues) => void;
};

const initialValues = (fields: QuickField[]): QuickValues =>
  Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? (f.type === "select" ? f.options?.[0] ?? "" : "")]));

/** Small create/edit form used by module pages for "New …" actions. */
export function QuickCreateDialog({ open, onOpenChange, title, description, fields, submitLabel = "Create", onSubmit }: Props) {
  const [values, setValues] = useState<QuickValues>(() => initialValues(fields));
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setValues(initialValues(fields));
      setMissing([]);
    }
    // reset each time the dialog opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const empty = fields.filter((f) => f.required && String(values[f.name] ?? "").trim() === "").map((f) => f.name);
    setMissing(empty);
    if (empty.length) return;
    const out: QuickValues = {};
    for (const f of fields) {
      const v = values[f.name];
      out[f.name] = f.type === "number" ? Number(v) || 0 : String(v ?? "").trim();
    }
    onSubmit(out);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={submit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => {
              const id = `qc-${f.name}`;
              const invalid = missing.includes(f.name);
              const common = {
                id,
                value: String(values[f.name] ?? ""),
                placeholder: f.placeholder,
                "aria-invalid": invalid || undefined,
              };
              const set = (v: string) => setValues((prev) => ({ ...prev, [f.name]: v }));
              const wide = f.type === "textarea";
              return (
                <div key={f.name} className={wide ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
                  <Label htmlFor={id} className="text-xs font-semibold">
                    {f.label}
                    {f.required ? <span className="text-destructive"> *</span> : null}
                  </Label>
                  {f.type === "select" ? (
                    <select
                      {...common}
                      onChange={(e) => set(e.target.value)}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {(f.options ?? []).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "textarea" ? (
                    <Textarea {...common} rows={3} onChange={(e) => set(e.target.value)} />
                  ) : (
                    <Input
                      {...common}
                      type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                      onChange={(e) => set(e.target.value)}
                    />
                  )}
                  {invalid ? <p className="text-xs text-destructive">{f.label} is required.</p> : null}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
