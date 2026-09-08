import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Layers, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { ApqpFormInput } from "@/services/types";

interface AddApqpProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (input: ApqpFormInput) => void;
  onSubmit?: (input: ApqpFormInput) => void;
}

export const AddApqpProjectModal: React.FC<AddApqpProjectModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  onSubmit,
}) => {
  const [apqpProjectName, setApqpProjectName] = useState(
    "Next-Gen 11kW High-Power EVSE Wallbox APQP"
  );
  const [apqpNumber, setApqpNumber] = useState(
    `APQP-EVSE-${Math.floor(100 + Math.random() * 900)}`
  );
  const [product, setProduct] = useState("Smart EVSE Wallbox 11kW");
  const [productRevision, setProductRevision] = useState("REV-1.0");
  const [customer, setCustomer] = useState("ElectraFlow Networks Ltd.");
  const [projectManager, setProjectManager] = useState("Arun Kumar");
  const [targetSopDate, setTargetSopDate] = useState("15 Nov 2026");
  const [projectScope, setProjectScope] = useState(
    "Design, validation, and full PPAP production handover of 11kW Three-Phase AC EV Charger with ISO 15118 Plug & Charge support."
  );

  const handleAutoFill = () => {
    setApqpProjectName("Commercial Heavy-Duty DC Fast Charger 120kW");
    setApqpNumber(`APQP-DCFC-${Math.floor(200 + Math.random() * 800)}`);
    setProduct("DCFC-120KW Fast Dispenser");
    setProductRevision("REV-2.0");
    setCustomer("National Grid Fleet Electrification");
    setProjectManager("Neha Reddy");
    setTargetSopDate("28 Feb 2027");
    setProjectScope(
      "Full turnkey APQP development of dual-gun 120kW CCS2 DC Fast Charger with liquid-cooled power module and ISO 9001:2015 traceability."
    );
    toast.success("Autofilled sample APQP program data");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apqpProjectName || !product) {
      toast.error("Please fill project name and product");
      return;
    }

    const payload: ApqpFormInput = {
      apqpProjectName,
      apqpNumber,
      product,
      productRevision,
      customer,
      projectManager,
      targetSopDate,
      projectScope,
      workflowStatus: "In Progress",
      programStatus: "In Progress",
    };

    if (onSubmit) {
      onSubmit(payload);
    } else if (onAdd) {
      onAdd(payload);
    }

    toast.success(`Initialized APQP Project: ${apqpNumber}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl w-full p-5 bg-card border border-border shadow-2xl rounded-xl">
        <DialogHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0B3B7B] text-white flex items-center justify-center font-bold text-xs">
                APQP
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Create New APQP Quality Program
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Initiate 5-phase Advanced Product Quality Planning and gate governance.
                </DialogDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutoFill}
              className="h-7 text-xs gap-1 text-blue-600 border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autofill Sample</span>
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2 text-xs">
          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-foreground">
              APQP Project Name *
            </Label>
            <Input
              value={apqpProjectName}
              onChange={(e) => setApqpProjectName(e.target.value)}
              placeholder="e.g. 7kW Smart EVSE Quality Program"
              required
              className="h-8 text-xs font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">
                APQP Number *
              </Label>
              <Input
                value={apqpNumber}
                onChange={(e) => setApqpNumber(e.target.value)}
                required
                className="h-8 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">
                Product Revision *
              </Label>
              <Input
                value={productRevision}
                onChange={(e) => setProductRevision(e.target.value)}
                required
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Product *</Label>
              <Input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">
                Customer Name *
              </Label>
              <Input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">
                Project Manager
              </Label>
              <Input
                value={projectManager}
                onChange={(e) => setProjectManager(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">
                Target SOP Date
              </Label>
              <Input
                value={targetSopDate}
                onChange={(e) => setTargetSopDate(e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-foreground">
              Project Scope & Technical Description
            </Label>
            <Textarea
              rows={2}
              value={projectScope}
              onChange={(e) => setProjectScope(e.target.value)}
              placeholder="Brief description of product APQP scope..."
              className="text-xs min-h-[60px] resize-none"
            />
          </div>

          <DialogFooter className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs bg-[#0B3B7B] hover:bg-[#092e60] text-white gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Initialize APQP Project</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
