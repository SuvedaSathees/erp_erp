import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GitCommit,
  ArrowDown,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Target,
} from "lucide-react";
import { FiveWhyItem } from "@/services/rcaTypes";
import { toast } from "sonner";

interface RcaFiveWhyCardProps {
  items: FiveWhyItem[];
  onAddWhy?: (newWhy: FiveWhyItem) => void;
  onUpdateWhy?: (level: number, question: string, answer: string, isRootCause?: boolean) => void;
  onDeleteWhy?: (level: number) => void;
}

export function RcaFiveWhyCard({
  items,
  onAddWhy,
  onUpdateWhy,
  onDeleteWhy,
}: RcaFiveWhyCardProps) {
  const [editingLevel, setEditingLevel] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [editIsRoot, setEditIsRoot] = useState(false);

  const startEdit = (item: FiveWhyItem) => {
    setEditingLevel(item.level);
    setEditQuestion(item.whyQuestion);
    setEditAnswer(item.answer);
    setEditIsRoot(Boolean(item.isRootCause));
  };

  const saveEdit = (level: number) => {
    if (!editAnswer.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }
    if (onUpdateWhy) {
      onUpdateWhy(level, editQuestion, editAnswer, editIsRoot);
    }
    setEditingLevel(null);
    toast.success(`Updated Why #${level}`);
  };

  const cancelEdit = () => {
    setEditingLevel(null);
  };

  const handleAddDefaultWhy = () => {
    const nextLevel = items.length + 1;
    const newWhy: FiveWhyItem = {
      level: nextLevel,
      whyQuestion: `Why did the step ${nextLevel - 1} condition occur?`,
      answer: "Inadequate preventive inspection protocol before production run.",
      isRootCause: false,
    };

    if (onAddWhy) {
      onAddWhy(newWhy);
    }
    toast.success(`Added Why #${nextLevel} to Causal Ladder`);
  };

  const handleDelete = (level: number) => {
    if (items.length <= 1) {
      toast.error("At least one Why iteration is required");
      return;
    }
    if (onDeleteWhy) {
      onDeleteWhy(level);
    }
    toast.success(`Removed Why #${level}`);
  };

  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <GitCommit className="h-4 w-4 text-primary shrink-0" />
          <CardTitle className="text-base font-semibold text-foreground">
            5-Why Investigative Cause Ladder
          </CardTitle>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            ({items.length} Iterations Complete)
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddDefaultWhy}
          className="h-7 text-xs px-2.5 font-medium border-primary/40 text-primary hover:bg-primary/10 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Why Level
        </Button>
      </CardHeader>
      <CardContent className="pt-4 space-y-3 min-w-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isEditing = editingLevel === item.level;

          return (
            <div key={item.level} className="relative min-w-0">
              <div
                className={`p-3.5 rounded-xl border transition-all text-xs min-w-0 ${
                  item.isRootCause
                    ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 shadow-xs"
                    : "bg-muted/30 border-border/70"
                }`}
              >
                {isEditing ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                        {item.level}
                      </span>
                      <Input
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
                        className="h-8 text-xs font-semibold"
                        placeholder="Why question..."
                      />
                    </div>
                    <div className="pl-7 space-y-2">
                      <Textarea
                        value={editAnswer}
                        onChange={(e) => setEditAnswer(e.target.value)}
                        rows={2}
                        className="text-xs resize-none"
                        placeholder="Because..."
                      />
                      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs select-none">
                          <input
                            type="checkbox"
                            checked={editIsRoot}
                            onChange={(e) => setEditIsRoot(e.target.checked)}
                            className="rounded border-border text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            Mark as Fundamental Root Cause
                          </span>
                        </label>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEdit}
                            className="h-7 text-xs px-2"
                          >
                            <X className="w-3.5 h-3.5 mr-1" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => saveEdit(item.level)}
                            className="h-7 text-xs px-2.5 bg-[#0B3B7B] hover:bg-[#0B3B7B]/90 text-white"
                          >
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                            item.isRootCause
                              ? "bg-emerald-600 text-white"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {item.level}
                        </span>
                        <span className="font-semibold text-foreground truncate">
                          {item.whyQuestion}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                        {item.isRootCause && (
                          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2 py-0.5 font-bold">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Physical Root Cause
                          </Badge>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(item)}
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          title="Edit iteration"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        {items.length > 1 && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(item.level)}
                            className="h-6 w-6 text-muted-foreground hover:text-rose-600"
                            title="Delete level"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <p
                      className={`pl-7 leading-relaxed ${
                        item.isRootCause
                          ? "font-semibold text-emerald-950 dark:text-emerald-200"
                          : "text-muted-foreground"
                      }`}
                    >
                      <strong className="text-foreground">Because:</strong> {item.answer}
                    </p>
                  </div>
                )}
              </div>

              {!isLast && (
                <div className="flex justify-center my-1">
                  <ArrowDown className="w-3.5 h-3.5 text-muted-foreground/60" />
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
