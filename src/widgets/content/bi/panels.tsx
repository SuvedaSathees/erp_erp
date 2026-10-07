// Panel Widgets for Business Intelligence Management Overview & Reports
import { memo, useState } from "react";
import {
  TrendingUp,
  PieChart as PieIcon,
  Filter,
  Factory,
  Truck,
  FolderKanban,
  Shield,
  AlertTriangle,
  CheckSquare,
  Sparkles,
  Calendar,
  Activity,
  FileText,
  Sliders,
  ChevronRight,
  ExternalLink,
  Download,
  Share2,
  BrainCircuit,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Layers,
  Database,
  Cpu,
  ShieldAlert,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
} from "recharts";
import { CardHeader } from "@/components/erp/CardHeader";
import { StatusBadge } from "@/components/erp/StatusBadge";
import type { WidgetContentProps, WidgetDefinition } from "@/widgets/types";
import { BI_OVERVIEW_DATA } from "@/widgets/data/biQueries";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Shared Alert & Prediction rows matching Finance Overview standard
function AlertRow({
  type,
  title,
  desc,
}: {
  type: "warning" | "info" | "success" | "destructive";
  title: string;
  desc: string;
}) {
  const border =
    type === "warning"
      ? "border-l-warning"
      : type === "info"
        ? "border-l-primary"
        : type === "destructive"
          ? "border-l-destructive"
          : "border-l-success";
  return (
    <div className={`rounded-r-lg border border-border border-l-4 ${border} bg-muted/30 p-2.5`}>
      <p className="text-xs font-semibold text-foreground">{title}</p>
      <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

function PredictionRow({
  month,
  flow,
  amount,
}: {
  month: string;
  flow: "positive" | "negative";
  amount: string;
}) {
  const color = flow === "positive" ? "text-success" : "text-destructive";
  const Arrow = flow === "positive" ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-2 text-xs">
      <span className="font-medium text-muted-foreground">{month}</span>
      <div className="flex items-center gap-1.5 font-bold tabular">
        <Arrow className={`h-3 w-3 ${color}`} />
        <span className={color}>{amount}</span>
      </div>
    </div>
  );
}

function AiScoreBall({
  label,
  value,
  inverse = false,
}: {
  label: string;
  value: number;
  inverse?: boolean;
}) {
  const isHealthy = inverse ? value < 30 : value > 75;
  const colorClass = isHealthy ? "text-[#22C55E]" : "text-destructive";
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border/40 bg-muted/20 p-4 shadow-2xs">
      <span className={`font-display text-2xl font-bold ${colorClass}`}>{value}%</span>
      <span className="mt-1 text-center text-[10px] font-semibold text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

// 1. Revenue & Profit Trend Panel (Tier 2, 40-col desktop span)
export const BiRevenueProfitTrendWidget = memo(function BiRevenueProfitTrendWidget(_props: WidgetContentProps) {
  const trend = BI_OVERVIEW_DATA.revenueAndProfitTrend;

  return (
    <div className="card-soft p-5">
      <CardHeader
        title="Revenue, Profitability & Margin Progression"
        right={
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="h-2.5 w-2.5 rounded-sm bg-blue-600" /> Revenue
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Gross Profit
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
              <span className="h-1.5 w-3 rounded-full bg-amber-500" /> EBITDA Margin
            </span>
          </div>
        }
      />
      <div className="h-[280px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trend} margin={{ top: 10, right: 12, left: -10, bottom: 0 }} barCategoryGap={10}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#9CA3AF"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v} Cr`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "10px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(val: any) => [`₹${val} Cr`, ""]}
            />
            <Bar dataKey="grossProfit" name="Gross Profit" fill="#10B981" radius={[4, 4, 0, 0]} barSize={14} />
            <Bar dataKey="ebitda" name="EBITDA" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={14} />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{ r: 4, fill: "#2563EB", strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="h-3.5 w-3.5" />
          Q3 Cumulative Revenue: ₹56.4 Cr · Gross Margin: 32.6% · EBITDA: ₹7.8 Cr (24.2%)
        </span>
        <span className="font-semibold text-primary">All Business Units Meeting Annual Plan →</span>
      </div>
    </div>
  );
});

// 2. Revenue By Product Donut (Tier 2, 20-col desktop span)
const BI_PRODUCT_MIX_DATA = [
  {
    name: "Autonomous W-EVSE",
    share: 38,
    amount: "₹4.86 Cr",
    color: "#2563EB",
    category: "Commercial Hardware",
    yoy: "+28.4%",
    margin: "36.2%",
    units: "1,420 units",
  },
  {
    name: "DC Fast Chargers",
    share: 22,
    amount: "₹2.82 Cr",
    color: "#7C3AED",
    category: "Fleet Infrastructure",
    yoy: "+19.1%",
    margin: "31.5%",
    units: "640 units",
  },
  {
    name: "AC Wall Chargers",
    share: 15,
    amount: "₹1.92 Cr",
    color: "#059669",
    category: "Residential & Retail",
    yoy: "+12.8%",
    margin: "28.0%",
    units: "2,850 units",
  },
  {
    name: "CaaS Services",
    share: 12,
    amount: "₹1.54 Cr",
    color: "#D97706",
    category: "Recurring Subscriptions",
    yoy: "+44.6%",
    margin: "48.5%",
    units: "320 contracts",
  },
  {
    name: "AMC & Spares",
    share: 8,
    amount: "₹1.02 Cr",
    color: "#0891B2",
    category: "Field Support Services",
    yoy: "+16.2%",
    margin: "42.0%",
    units: "1,180 sites",
  },
  {
    name: "Software & Data Platform",
    share: 5,
    amount: "₹0.64 Cr",
    color: "#475569",
    category: "Enterprise Cloud",
    yoy: "+52.0%",
    margin: "68.4%",
    units: "450 nodes",
  },
];

export const BiRevenueByProductWidget = memo(function BiRevenueByProductWidget(_props: WidgetContentProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <div>
        <CardHeader
          title="Revenue by Product Line"
          right={
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
              ₹12.8 Cr Total
            </span>
          }
        />

        {/* Hero Donut Centerpiece with Interactive Hover Spotlight */}
        <div className="relative h-[150px] w-full flex items-center justify-center my-0.5">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={BI_PRODUCT_MIX_DATA}
                dataKey="share"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={68}
                paddingAngle={3}
                cornerRadius={5}
                stroke="none"
                onMouseEnter={(_, index) => setActiveIdx(index)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {BI_PRODUCT_MIX_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={activeIdx === null || activeIdx === index ? 1 : 0.4}
                    className="transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-border bg-card/95 px-3 py-2 shadow-md backdrop-blur-xs text-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-foreground">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: data.color }} />
                          <span>{data.name}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-4 text-muted-foreground text-[11px]">
                          <span>Revenue: <strong className="text-foreground">{data.amount}</strong></span>
                          <span className="font-semibold text-primary">{data.share}% share</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-2">
            {activeIdx !== null ? (
              <>
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground truncate max-w-[120px]">
                  {BI_PRODUCT_MIX_DATA[activeIdx].name}
                </span>
                <span className="font-display text-base font-extrabold text-foreground tracking-tight">
                  {BI_PRODUCT_MIX_DATA[activeIdx].amount}
                </span>
                <span
                  className="text-[10px] font-bold"
                  style={{ color: BI_PRODUCT_MIX_DATA[activeIdx].color }}
                >
                  {BI_PRODUCT_MIX_DATA[activeIdx].share}% Portfolio Share
                </span>
              </>
            ) : (
              <>
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">TOP LINE</span>
                <span className="font-display text-base font-extrabold text-foreground tracking-tight">₹12.8 Cr</span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3 inline" />+18.4% YoY
                </span>
              </>
            )}
          </div>
        </div>

        {/* Executive Macro Distribution Bar (Hardware Capex vs Recurring ARR) */}
        <div className="my-2 rounded-lg border border-border/50 bg-muted/20 p-2">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
              <span className="text-muted-foreground">Hardware Capex:</span>
              <span className="font-bold text-foreground">75% (₹9.6 Cr)</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
              <span className="text-muted-foreground">Recurring ARR:</span>
              <span className="font-bold text-foreground">25% (₹3.2 Cr)</span>
            </div>
          </div>
          <div className="mt-1.5 flex h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: "75%" }} />
            <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: "25%" }} />
          </div>
        </div>

        {/* Detailed Product Streams with Progress Bars (Full Width, Zero Truncation) */}
        <div className="space-y-1.5 w-full">
          {BI_PRODUCT_MIX_DATA.map((p, idx) => {
            const isHovered = activeIdx === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                className={cn(
                  "rounded-md p-1.5 -mx-1.5 transition-all duration-150 cursor-pointer",
                  isHovered ? "bg-muted/60 shadow-2xs" : "hover:bg-muted/30"
                )}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full shrink-0 transition-transform",
                        isHovered && "scale-125 shadow-xs"
                      )}
                      style={{ backgroundColor: p.color }}
                    />
                    <span className={cn(
                      "font-medium tracking-tight truncate",
                      isHovered ? "text-foreground font-semibold" : "text-foreground"
                    )}>
                      {p.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 tabular text-xs shrink-0">
                    <span className="text-muted-foreground font-normal">{p.amount}</span>
                    <span className="w-8 text-right font-bold text-foreground">{p.share}%</span>
                  </div>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${p.share}%`,
                      backgroundColor: p.color,
                      opacity: activeIdx === null || isHovered ? 1 : 0.45,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer with Portfolio Lead & Interactive Breakdown Dialog Trigger */}
      <div className="mt-3 border-t border-border/40 pt-2.5 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 truncate text-[11px]">
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate">Autonomous W-EVSE leads portfolio (38%)</span>
        </span>
        <button
          onClick={() => setShowModal(true)}
          className="font-semibold text-primary shrink-0 hover:underline cursor-pointer flex items-center gap-0.5 text-[11px]"
        >
          <span>View Breakdown</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* Product Portfolio Detailed Breakdown Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <PieIcon className="h-5 w-5 text-primary" />
              <span>Revenue by Product Line — Q3 FY26 Detailed Analysis</span>
            </DialogTitle>
            <DialogDescription>
              Consolidated commercial EVSE hardware, charging-as-a-service, and recurring support streams.
            </DialogDescription>
          </DialogHeader>

          {/* 4 Summary Stat Badges */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 my-2">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <span className="text-[11px] font-medium text-muted-foreground">Total Revenue</span>
              <div className="text-lg font-bold text-foreground mt-0.5">₹12.80 Cr</div>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">+18.4% YoY</span>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <span className="text-[11px] font-medium text-muted-foreground">Top Contributor</span>
              <div className="text-lg font-bold text-foreground mt-0.5">₹4.86 Cr</div>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">Autonomous W-EVSE (38%)</span>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <span className="text-[11px] font-medium text-muted-foreground">Blended Margin</span>
              <div className="text-lg font-bold text-foreground mt-0.5">34.2%</div>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">+3.1% vs budget</span>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <span className="text-[11px] font-medium text-muted-foreground">Recurring ARR</span>
              <div className="text-lg font-bold text-foreground mt-0.5">₹3.20 Cr</div>
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">25.0% Portfolio Mix</span>
            </div>
          </div>

          {/* Full Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-2.5">Product Line</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5 text-right">Q3 Revenue</th>
                  <th className="p-2.5 text-right">Share</th>
                  <th className="p-2.5 text-right">YoY Growth</th>
                  <th className="p-2.5 text-right">Gross Margin</th>
                  <th className="p-2.5 text-right">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {BI_PRODUCT_MIX_DATA.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="p-2.5 font-medium text-foreground flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: row.color }} />
                      <span>{row.name}</span>
                    </td>
                    <td className="p-2.5 text-muted-foreground">{row.category}</td>
                    <td className="p-2.5 text-right font-semibold text-foreground tabular">{row.amount}</td>
                    <td className="p-2.5 text-right font-bold tabular">{row.share}%</td>
                    <td className="p-2.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold tabular">{row.yoy}</td>
                    <td className="p-2.5 text-right font-medium tabular">{row.margin}</td>
                    <td className="p-2.5 text-right text-muted-foreground tabular">{row.units}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/40 font-semibold text-foreground border-t border-border">
                <tr>
                  <td className="p-2.5" colSpan={2}>Consolidated Portfolio Total</td>
                  <td className="p-2.5 text-right font-bold text-foreground tabular">₹12.80 Cr</td>
                  <td className="p-2.5 text-right font-bold tabular">100%</td>
                  <td className="p-2.5 text-right text-emerald-600 dark:text-emerald-400 tabular">+18.4%</td>
                  <td className="p-2.5 text-right tabular">34.2%</td>
                  <td className="p-2.5 text-right text-muted-foreground tabular">6,860 units/subs</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.success("Exported product breakdown to CSV (.csv)")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => toast.success("Exported board presentation pack (.xlsx)")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Export Excel</span>
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

// 3. Sales Pipeline Funnel Widget (Tier 3, 20-col desktop span)
export const BiSalesPipelineWidget = memo(function BiSalesPipelineWidget(_props: WidgetContentProps) {
  const pipeline = BI_OVERVIEW_DATA.salesPipeline;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalDeals = pipeline.reduce((acc, p) => acc + p.count, 0);
  const totalPipelineCr = pipeline.reduce((acc, p) => acc + p.valueCr, 0);

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <div>
        <CardHeader
          title="Commercial Conversion Funnel"
          right={
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              ₹{totalPipelineCr.toFixed(1)} Cr Active
            </span>
          }
        />

        {/* Funnel Pipeline Stages with Proportional Bars and Deal Counts */}
        <div className="space-y-2.5 py-1 w-full">
          {pipeline.map((stage, idx) => {
            const widthPercent = Math.max(30, Math.min(100, Math.round((stage.valueCr / 42.0) * 100)));
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={cn(
                  "rounded-md p-1.5 -mx-1.5 transition-all duration-150 cursor-pointer space-y-1",
                  isHovered ? "bg-muted/60 shadow-2xs" : "hover:bg-muted/30"
                )}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className={cn("font-medium", isHovered ? "text-foreground font-semibold" : "text-foreground")}>
                      {stage.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 tabular text-xs">
                    <span className="text-[11px] text-muted-foreground">{stage.count} deals</span>
                    <span className="font-bold text-foreground">₹{stage.valueCr} Cr</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: stage.color,
                      opacity: hoveredIdx === null || isHovered ? 1 : 0.6,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border/40 pt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Weighted Forecast: <strong className="text-foreground font-semibold">₹14.2 Cr</strong> ({totalDeals} deals)</span>
        <button
          onClick={() => toast.info("Opening CRM Pipeline deals...")}
          className="font-semibold text-primary shrink-0 hover:underline cursor-pointer"
        >
          Manage CRM Deals →
        </button>
      </div>
    </div>
  );
});

// 4. Manufacturing & SCM Operational Telemetry (Tier 3, 40-col desktop span)
export const BiManufacturingPerfWidget = memo(function BiManufacturingPerfWidget(_props: WidgetContentProps) {
  const mfg = BI_OVERVIEW_DATA.manufacturingMetrics;
  const scm = BI_OVERVIEW_DATA.supplyChainMetrics;

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <div>
        <CardHeader
          title="Manufacturing OEE & SCM Fulfillment Telemetry"
          right={
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-teal-500/10 px-2 py-0.5 font-semibold text-teal-600 dark:text-teal-400">
                Line A & B Online
              </span>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 font-semibold text-blue-600 dark:text-blue-400">
                SCM OTIF 92.4%
              </span>
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-1">
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="text-[11px] text-muted-foreground font-medium">Production Output</span>
            <div className="mt-1 text-base font-bold text-foreground">{mfg.output.value}</div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">↑ {mfg.output.delta} vs plan</span>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="text-[11px] text-muted-foreground font-medium">Capacity Utilization</span>
            <div className="mt-1 text-base font-bold text-foreground">{mfg.capacity.value}</div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">↑ {mfg.capacity.delta} MoM</span>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="text-[11px] text-muted-foreground font-medium">On-Time Delivery</span>
            <div className="mt-1 text-base font-bold text-foreground">{mfg.onTimeDelivery.value}</div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">↑ {mfg.onTimeDelivery.delta} target</span>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="text-[11px] text-muted-foreground font-medium">Rejection Rate</span>
            <div className="mt-1 text-base font-bold text-foreground">{mfg.rejectionRate.value}</div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">↓ {mfg.rejectionRate.delta} defect drop</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-3">
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="text-[11px] text-muted-foreground font-medium">Active POs</span>
            <div className="mt-1 text-base font-bold text-foreground">{scm.purchaseOrders.value}</div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">↑ {scm.purchaseOrders.delta} active</span>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="text-[11px] text-muted-foreground font-medium">Inventory Value</span>
            <div className="mt-1 text-base font-bold text-foreground">{scm.inventoryValue.value}</div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">↑ {scm.inventoryValue.delta} reserve</span>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="text-[11px] text-muted-foreground font-medium">Supplier OTIF</span>
            <div className="mt-1 text-base font-bold text-foreground">{scm.supplierOtif.value}</div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">↑ {scm.supplierOtif.delta} SLA</span>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="text-[11px] text-muted-foreground font-medium">Material Shortages</span>
            <div className="mt-1 text-base font-bold text-foreground">{scm.materialShortage.value} lines</div>
            <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">↓ {scm.materialShortage.delta} buffer watch</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 pt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Continuous SCADA OPC-UA Telemetry Active</span>
        <span className="font-semibold text-primary">Open Shopfloor Control →</span>
      </div>
    </div>
  );
});

// 5. Strategic Operations & Executive Ledger (Tier 4, 40-col desktop span)
const BI_LEDGER_TABS = [
  { id: "executive", label: "Executive Actions" },
  { id: "projects", label: "Project Portfolio" },
  { id: "security", label: "Security & Audits" },
  { id: "pipelines", label: "ETL Data Pipelines" },
] as const;

export const BiTopManagementActionsWidget = memo(function BiTopManagementActionsWidget(_props: WidgetContentProps) {
  const [activeTab, setActiveTab] = useState<"executive" | "projects" | "security" | "pipelines">("executive");
  const actions = BI_OVERVIEW_DATA.managementActions;

  return (
    <div className="card-soft p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-2">
        <div>
          <h3 className="font-display text-[15px] font-semibold text-foreground">
            Strategic Operations & Executive Ledger
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cross-functional accountability ledger, deliverables, audits, and automated data pipelines
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5">
          {BI_LEDGER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
                activeTab === tab.id
                  ? "bg-white text-foreground shadow-xs dark:bg-card"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[220px] overflow-x-auto">
        {activeTab === "executive" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2">Code</th>
                <th className="py-2">Strategic Action</th>
                <th className="py-2">Owner</th>
                <th className="py-2">Target Date</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((act) => (
                <tr key={act.id} className="border-b border-border/30 hover:bg-muted/10">
                  <td className="py-2.5 font-semibold text-primary font-mono">ACT-00{act.id}</td>
                  <td className="py-2.5 font-medium text-foreground">{act.action}</td>
                  <td className="py-2.5 text-muted-foreground">{act.owner}</td>
                  <td className="py-2.5 text-muted-foreground">{act.dueDate}</td>
                  <td className="py-2.5 text-right">
                    <StatusBadge status={act.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "projects" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2">Project Name</th>
                <th className="py-2">Domain</th>
                <th className="py-2">Budget</th>
                <th className="py-2">Milestone Stage</th>
                <th className="py-2 text-right">Delivery Health</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-2.5 font-semibold text-foreground">Autonomous W-EVSE 22kW Platform</td>
                <td className="py-2.5 text-muted-foreground">EV Power Electronics</td>
                <td className="py-2.5 font-medium text-foreground tabular">₹4.2 Cr</td>
                <td className="py-2.5 text-muted-foreground">Pilot Line Verification</td>
                <td className="py-2.5 text-right">
                  <StatusBadge status="on track" />
                </td>
              </tr>
              <tr className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-2.5 font-semibold text-foreground">High-Power 350kW DC Fast Dispenser</td>
                <td className="py-2.5 text-muted-foreground">Ultra-Fast Infrastructure</td>
                <td className="py-2.5 font-medium text-foreground tabular">₹3.8 Cr</td>
                <td className="py-2.5 text-muted-foreground">Field Validation</td>
                <td className="py-2.5 text-right">
                  <StatusBadge status="on track" />
                </td>
              </tr>
              <tr className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-2.5 font-semibold text-foreground">Shopfloor SCADA Telemetry Ingestion</td>
                <td className="py-2.5 text-muted-foreground">Smart Automation</td>
                <td className="py-2.5 font-medium text-foreground tabular">₹1.2 Cr</td>
                <td className="py-2.5 text-muted-foreground">Full Production</td>
                <td className="py-2.5 text-right">
                  <StatusBadge status="closed" />
                </td>
              </tr>
              <tr className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-2.5 font-semibold text-foreground">QMS Quality & NCR Automated Gate</td>
                <td className="py-2.5 text-muted-foreground">Digital Quality</td>
                <td className="py-2.5 font-medium text-foreground tabular">₹0.9 Cr</td>
                <td className="py-2.5 text-muted-foreground">Supplier Audit Verification</td>
                <td className="py-2.5 text-right">
                  <StatusBadge status="pending" />
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {activeTab === "security" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2">Governance Audit / Asset</th>
                <th className="py-2">Lead Office</th>
                <th className="py-2">Target Scope</th>
                <th className="py-2">Audit Due Date</th>
                <th className="py-2 text-right">Posture</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-2.5 font-semibold text-foreground">SOC 2 Type II Annual Attestation</td>
                <td className="py-2.5 text-muted-foreground">CISO Governance Office</td>
                <td className="py-2.5 text-muted-foreground">Cloud SaaS & Data Warehouses</td>
                <td className="py-2.5 text-muted-foreground">15 Oct 2026</td>
                <td className="py-2.5 text-right">
                  <StatusBadge status="compliant" />
                </td>
              </tr>
              <tr className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-2.5 font-semibold text-foreground">Namakkal CCTV AI Camera Grid</td>
                <td className="py-2.5 text-muted-foreground">Physical Security</td>
                <td className="py-2.5 text-muted-foreground">94/96 Cameras Online</td>
                <td className="py-2.5 text-muted-foreground">30 Sep 2026</td>
                <td className="py-2.5 text-right">
                  <StatusBadge status="online" />
                </td>
              </tr>
              <tr className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-2.5 font-semibold text-foreground">Access Violation Remediation</td>
                <td className="py-2.5 text-muted-foreground">Identity IAM Council</td>
                <td className="py-2.5 text-muted-foreground">2 Low-Risk Violations</td>
                <td className="py-2.5 text-muted-foreground">28 Sep 2026</td>
                <td className="py-2.5 text-right">
                  <StatusBadge status="in progress" />
                </td>
              </tr>
              <tr className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-2.5 font-semibold text-foreground">ISO 27001 Surveillance Audit</td>
                <td className="py-2.5 text-muted-foreground">Enterprise Risk</td>
                <td className="py-2.5 text-muted-foreground">Enterprise ERP Core</td>
                <td className="py-2.5 text-muted-foreground">10 Nov 2026</td>
                <td className="py-2.5 text-right">
                  <StatusBadge status="active" />
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {activeTab === "pipelines" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2">Pipeline Identifier</th>
                <th className="py-2">Data Flow</th>
                <th className="py-2">Cadence / Mode</th>
                <th className="py-2">Latency / Volume</th>
                <th className="py-2 text-right">SLA Health</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-2.5 font-mono font-semibold text-primary">PIP-FIN-001</td>
                <td className="py-2.5 font-medium text-foreground">Finance General Ledger Stream</td>
                <td className="py-2.5 text-muted-foreground">CDC Real-Time</td>
                <td className="py-2.5 text-muted-foreground">140 ms · 1.42M rows</td>
                <td className="py-2.5 text-right">
                  <StatusBadge status="active" />
                </td>
              </tr>
              <tr className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-2.5 font-mono font-semibold text-primary">PIP-MFG-006</td>
                <td className="py-2.5 font-medium text-foreground">Shopfloor Telemetry Ingestion</td>
                <td className="py-2.5 text-muted-foreground">Continuous OPC-UA</td>
                <td className="py-2.5 text-muted-foreground">310 ms · 18,400 rows/s</td>
                <td className="py-2.5 text-right">
                  <StatusBadge status="active" />
                </td>
              </tr>
              <tr className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-2.5 font-mono font-semibold text-primary">PIP-CRM-003</td>
                <td className="py-2.5 font-medium text-foreground">CRM Opportunities & Deals</td>
                <td className="py-2.5 text-muted-foreground">15m Incremental Sync</td>
                <td className="py-2.5 text-muted-foreground">12s run · 4.8k rows</td>
                <td className="py-2.5 text-right">
                  <StatusBadge status="active" />
                </td>
              </tr>
              <tr className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-2.5 font-mono font-semibold text-primary">PIP-DBT-012</td>
                <td className="py-2.5 font-medium text-foreground">dbt Core Analytical Transform</td>
                <td className="py-2.5 text-muted-foreground">Nightly Orchestrated</td>
                <td className="py-2.5 text-muted-foreground">4m 12s · 84 models</td>
                <td className="py-2.5 text-right">
                  <StatusBadge status="posted" />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
});

// 6. Executive Risk Warnings & 3-Month Strategic Forecast (Tier 4, 20-col desktop span)
export const BiRiskHeatmapWidget = memo(function BiRiskHeatmapWidget(_props: WidgetContentProps) {
  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <div>
        <CardHeader title="Executive Risk & Strategic Warnings" />
        <div className="mt-2 space-y-2.5">
          <AlertRow
            type="warning"
            title="Tier-1 Microchip Buffer Watch"
            desc="Supply chain buffer for high-voltage semiconductor switches is down to 2 weeks. Alternate suppliers activated."
          />
          <AlertRow
            type="info"
            title="Automotive CE Certification"
            desc="Product engineering certification milestone is 88% ready. Audit scheduled for 15 October."
          />
          <AlertRow
            type="success"
            title="Quarterly Board Audit Clean"
            desc="Zero high-severity compliance or access exceptions discovered during Q3 review."
          />
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
          3-Month Strategic Horizon Forecast
        </h4>
        <div className="space-y-1.5">
          <PredictionRow month="October 2026" flow="positive" amount="+22.4% Revenue Run-Rate" />
          <PredictionRow month="November 2026" flow="positive" amount="Line A Target 85% OEE" />
          <PredictionRow month="December 2026" flow="positive" amount="₹5.8 Cr Cash Reserves" />
        </div>
      </div>
    </div>
  );
});

// 7. Full-Width AI Executive Decision & Intelligence Command Center (Tier 5, 60-col desktop span)
export const BiAiExecutiveIntelligenceWidget = memo(function BiAiExecutiveIntelligenceWidget(_props: WidgetContentProps) {
  const [activeTab, setActiveTab] = useState<"insights" | "recommendations" | "forecast">("insights");
  const insights = BI_OVERVIEW_DATA.aiInsights;

  return (
    <div className="card-soft p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-2">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 animate-pulse text-primary" />
          <div>
            <h3 className="font-display text-[15px] font-semibold text-foreground">
              AI Executive Decision & Strategic Intelligence Command Center
            </h3>
            <p className="text-xs text-muted-foreground">
              Autonomous cross-functional correlation, anomaly detection, predictive horizon modeling and executive advice.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3" /> Cognitive Engine Active · v4.2
          </span>
          <div className="flex rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs font-medium">
            <button
              onClick={() => setActiveTab("insights")}
              className={cn(
                "rounded-md px-2.5 py-0.5 transition-all text-xs",
                activeTab === "insights"
                  ? "bg-white text-foreground shadow-2xs dark:bg-card"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Key Insights
            </button>
            <button
              onClick={() => setActiveTab("recommendations")}
              className={cn(
                "rounded-md px-2.5 py-0.5 transition-all text-xs",
                activeTab === "recommendations"
                  ? "bg-white text-foreground shadow-2xs dark:bg-card"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Recommendations
            </button>
            <button
              onClick={() => setActiveTab("forecast")}
              className={cn(
                "rounded-md px-2.5 py-0.5 transition-all text-xs",
                activeTab === "forecast"
                  ? "bg-white text-foreground shadow-2xs dark:bg-card"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Forecast
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        <AiScoreBall label="Enterprise Health" value={94} />
        <AiScoreBall label="Strategy Alignment" value={91} />
        <AiScoreBall label="Supply Chain Risk" value={14} inverse />
        <AiScoreBall label="Data Lake Integrity" value={99} />
        <AiScoreBall label="Execution Velocity" value={88} />
      </div>

      <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4 text-[13px] leading-relaxed text-foreground">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <strong className="font-bold text-primary">
            Autonomous Strategic Executive Recommendations:
          </strong>
          <div className="flex items-center gap-2">
            <button className="text-xs font-semibold text-primary hover:underline cursor-pointer">
              Apply Strategic Action Plan →
            </button>
            <span className="text-muted-foreground">•</span>
            <button className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer">
              Simulate What-If Scenario
            </button>
          </div>
        </div>

        {activeTab === "insights" && (
          <div className="space-y-1.5 text-xs text-muted-foreground">
            {insights.map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">•</span>
                <span className="text-foreground leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "recommendations" && (
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold shrink-0">•</span>
              <span className="text-foreground leading-relaxed">
                <strong>Commercial Acceleration:</strong> Prioritize 350kW DC Fast Dispenser proposals in Karnataka and Tamil Nadu corridors for projected ₹4.8 Cr Q4 pipeline conversions.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold shrink-0">•</span>
              <span className="text-foreground leading-relaxed">
                <strong>Procurement De-risking:</strong> Formalize blanket orders with secondary domestic supplier for high-voltage relays to maintain zero factory downtime.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold shrink-0">•</span>
              <span className="text-foreground leading-relaxed">
                <strong>Plant Line-3 Balancing:</strong> Transition robotic cell maintenance window to weekend off-peak hours to lift monthly OEE by 2.8%.
              </span>
            </div>
          </div>
        )}

        {activeTab === "forecast" && (
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold shrink-0">•</span>
              <span className="text-foreground leading-relaxed">
                <strong>Q4 Fiscal Trajectory:</strong> Projected quarterly consolidated revenue run-rate: ₹24.2 Cr with a 95% confidence interval.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold shrink-0">•</span>
              <span className="text-foreground leading-relaxed">
                <strong>Operating Cash Headroom:</strong> Expected month-end working capital to reach ₹5.8 Cr, supporting un-leveraged Capex expansion.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Additional Widgets for Library & Reports
export const BiProjectPortfolioWidget = memo(function BiProjectPortfolioWidget(_props: WidgetContentProps) {
  const data = BI_OVERVIEW_DATA.projectPortfolio;
  const pieData = [
    { name: "On Track", value: data.onTrack, color: "#10B981" },
    { name: "At Risk", value: data.atRisk, color: "#F59E0B" },
    { name: "Delayed", value: data.delayed, color: "#EF4444" },
    { name: "Completed", value: data.completed, color: "#3B82F6" },
  ];

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <CardHeader title="Project Portfolio Health" />
      <div className="flex items-center gap-4 py-2">
        <div className="relative h-[150px] w-[150px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={2}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Active</span>
            <span className="text-base font-bold text-foreground">{data.active}</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {pieData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-semibold text-foreground">{item.value} projects</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border/40 pt-3 text-right">
        <span className="text-xs font-semibold text-primary">View Project Matrix →</span>
      </div>
    </div>
  );
});

export const BiSecurityComplianceWidget = memo(function BiSecurityComplianceWidget(_props: WidgetContentProps) {
  const sc = BI_OVERVIEW_DATA.securityCompliance;

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <CardHeader title="Security & Compliance Posture" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 py-2">
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <span className="text-[11px] text-muted-foreground">Security Incidents</span>
          <div className="mt-1 text-base font-bold text-foreground">{sc.incidents.value}</div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">↓ {sc.incidents.delta}</span>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <span className="text-[11px] text-muted-foreground">CCTV Grid Online</span>
          <div className="mt-1 text-base font-bold text-foreground">{sc.cctvOnline.value}</div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{sc.cctvOnline.percentage}</span>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <span className="text-[11px] text-muted-foreground">Access Violations</span>
          <div className="mt-1 text-base font-bold text-foreground">{sc.accessViolations.value}</div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">↓ {sc.accessViolations.delta}</span>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <span className="text-[11px] text-muted-foreground">Audit Compliance</span>
          <div className="mt-1 text-base font-bold text-foreground">{sc.auditCompliance.value}</div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">↑ {sc.auditCompliance.delta}</span>
        </div>
      </div>
      <div className="border-t border-border/40 pt-3 text-right">
        <span className="text-xs font-semibold text-primary">Open Security Center →</span>
      </div>
    </div>
  );
});

export const BiEnterprisePerformanceWidget = memo(function BiEnterprisePerformanceWidget(_props: WidgetContentProps) {
  const health = BI_OVERVIEW_DATA.enterpriseHealth;

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <CardHeader title="Enterprise Composite Health Dial" />
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row py-2">
        <div className="flex flex-col items-center justify-center p-2">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-8 border-emerald-500/20 border-t-emerald-500">
            <div className="text-center">
              <span className="text-2xl font-black text-foreground">{health.score}</span>
              <span className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{health.status}</span>
            </div>
          </div>
          <span className="mt-1.5 text-[11px] text-muted-foreground">Index (0-100)</span>
        </div>
        <div className="flex-1 space-y-2 w-full">
          {health.breakdown.map((b, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-muted-foreground text-[11px]">{b.name}</span>
                <span className="font-bold text-foreground text-[11px]">{b.score}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${b.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border/40 pt-3 text-right">
        <span className="text-xs font-semibold text-primary">Executive Summary File →</span>
      </div>
    </div>
  );
});

export const BiUpcomingMeetingsWidget = memo(function BiUpcomingMeetingsWidget(_props: WidgetContentProps) {
  const meetings = BI_OVERVIEW_DATA.upcomingMeetings;

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <CardHeader title="Upcoming Executive Reviews & Governance" />
      <div className="space-y-2 py-1">
        {meetings.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-2.5 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 flex-col items-center justify-center rounded-md bg-primary/10 text-primary font-bold">
                <span className="text-[11px] leading-none">{m.date}</span>
                <span className="text-[8px] uppercase leading-none">{m.month}</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-[12px]">{m.title}</h4>
                <p className="text-[11px] text-muted-foreground">{m.time} · {m.location}</p>
              </div>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                m.type === "Executive" && "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                m.type === "Project" && "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
                m.type === "Security" && "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
                m.type === "Management" && "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
              )}
            >
              {m.type}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-border/40 pt-3 text-right">
        <span className="text-xs font-semibold text-primary">View Corporate Calendar →</span>
      </div>
    </div>
  );
});

export const BI_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "bi.panel.revenue-profit-trend",
    title: "Revenue & Profit Progression",
    description: "Monthly revenue, gross profit, and EBITDA progression trajectory.",
    category: "bi",
    icon: TrendingUp,
    keywords: ["revenue", "profit", "trend", "ebitda"],
    roles: "all",
    defaultSize: "xl",
    allowedSizes: ["md", "lg", "xl", "full"],
    component: BiRevenueProfitTrendWidget,
  },
  {
    id: "bi.panel.revenue-by-product",
    title: "Revenue by Product Line",
    description: "Breakdown of consolidated revenue across EV charger portfolio.",
    category: "bi",
    icon: PieIcon,
    keywords: ["revenue", "product", "breakdown"],
    roles: "all",
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    component: BiRevenueByProductWidget,
  },
  {
    id: "bi.panel.sales-pipeline",
    title: "Commercial Conversion Funnel",
    description: "Commercial deal progression from lead to contract closure.",
    category: "bi",
    icon: Filter,
    keywords: ["sales", "pipeline", "funnel"],
    roles: "all",
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    component: BiSalesPipelineWidget,
  },
  {
    id: "bi.panel.manufacturing-performance",
    title: "Manufacturing OEE & SCM Fulfillment",
    description: "Plant throughput, line yield, and supplier fulfillment metrics.",
    category: "bi",
    icon: Factory,
    keywords: ["manufacturing", "plant", "oee", "scm"],
    roles: "all",
    defaultSize: "xl",
    allowedSizes: ["md", "lg", "xl"],
    component: BiManufacturingPerfWidget,
  },
  {
    id: "bi.panel.project-portfolio",
    title: "Project Portfolio Status",
    description: "Active engineering projects classified by delivery health.",
    category: "bi",
    icon: FolderKanban,
    keywords: ["projects", "portfolio", "delivery"],
    roles: "all",
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    component: BiProjectPortfolioWidget,
  },
  {
    id: "bi.panel.security-compliance",
    title: "Security & Compliance Status",
    description: "Incidents, CCTV surveillance uptime, and audit compliance score.",
    category: "bi",
    icon: Shield,
    keywords: ["security", "compliance", "cctv"],
    roles: "all",
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    component: BiSecurityComplianceWidget,
  },
  {
    id: "bi.panel.risk-heatmap",
    title: "Executive Risk & Strategic Warnings",
    description: "Enterprise risk warnings and 3-month performance predictions.",
    category: "bi",
    icon: AlertTriangle,
    keywords: ["risk", "heatmap", "warnings", "forecast"],
    roles: "all",
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    component: BiRiskHeatmapWidget,
  },
  {
    id: "bi.panel.management-actions",
    title: "Strategic Operations & Executive Ledger",
    description: "Accountability action tracker, portfolio, security, and data pipelines.",
    category: "bi",
    icon: CheckSquare,
    keywords: ["actions", "management", "accountability", "ledger"],
    roles: "all",
    defaultSize: "xl",
    allowedSizes: ["md", "lg", "xl", "full"],
    component: BiTopManagementActionsWidget,
  },
  {
    id: "bi.panel.ai-intelligence",
    title: "AI Executive Decision & Intelligence Command Center",
    description: "Automated executive summary, score gauges, risk detection, and forecasting.",
    category: "bi",
    icon: BrainCircuit,
    keywords: ["ai", "intelligence", "forecast", "executive"],
    roles: "all",
    defaultSize: "full",
    allowedSizes: ["md", "lg", "xl", "full"],
    component: BiAiExecutiveIntelligenceWidget,
  },
  {
    id: "bi.panel.enterprise-health",
    title: "Enterprise Performance Score",
    description: "Consolidated health dial and cross-functional performance bars.",
    category: "bi",
    icon: Activity,
    keywords: ["health", "enterprise", "score"],
    roles: "all",
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    component: BiEnterprisePerformanceWidget,
  },
  {
    id: "bi.panel.upcoming-meetings",
    title: "Upcoming Executive Meetings",
    description: "Upcoming management reviews and governance dates.",
    category: "bi",
    icon: Calendar,
    keywords: ["meetings", "executive", "reviews"],
    roles: "all",
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    component: BiUpcomingMeetingsWidget,
  },
];
