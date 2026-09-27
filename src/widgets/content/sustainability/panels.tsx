import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Cloud,
  Leaf,
  Zap,
  Droplets,
  Recycle,
  Sparkles,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ExternalLink,
  Info,
  ShieldCheck,
  Building2,
  FileText,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { WidgetDefinition } from "../../types";
import {
  sustainabilityOverviewOptions,
  type SustainabilityOverviewData,
} from "../../data/sustainabilityQueries";

/* ===========================================================================
   1. Decarbonization & Clean Energy Transition Trend (Chart)
   =========================================================================== */
export const DecarbonizationTrendWidget = memo(function DecarbonizationTrendWidget() {
  const { data, isLoading } = useQuery(sustainabilityOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">Decarbonization & Clean Energy Transition Trend</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Scope 1 & 2 emissions reduction trajectory vs. renewable energy adoption
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            <span className="text-muted-foreground font-medium">Scope 1 & 2 (tCO2e)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="text-muted-foreground font-medium">Grid Power (MWh)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground font-medium">Renewable Share (%)</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.trendData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              unit="%"
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
            />
            <Bar yAxisId="left" dataKey="scope12" name="Scope 1 & 2 GHG" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="gridEnergy" name="Grid Power" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="renewablePct"
              name="Renewable Share"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#10b981" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
          <Activity className="h-3.5 w-3.5" />
          Renewable energy reached 48% in March 2026
        </span>
        <Link
          to="/management/sustainability-management/carbon-footprint"
          className="text-primary hover:underline font-semibold flex items-center gap-1"
        >
          View Carbon Accounting →
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   2. Sustainability Health Summary (YTD)
   =========================================================================== */
export const HealthSummaryWidget = memo(function HealthSummaryWidget() {
  const { data, isLoading } = useQuery(sustainabilityOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Sustainability Health Summary</h3>
            <p className="text-xs text-muted-foreground mt-0.5">YTD Key Environmental Performance Indices</p>
          </div>
          <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            FY 2024-25
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {data.healthSummary.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
            >
              <div>
                <div className="text-xs font-semibold text-foreground">{item.label}</div>
                <div className="text-[11px] text-muted-foreground">Target benchmark: {item.target}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-foreground">{item.value}</div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span>Verified by Sustainability Audit Team</span>
        <Link
          to="/management/sustainability-management/sustainability-reporting"
          className="text-primary hover:underline font-semibold"
        >
          BRSR Audit File →
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Facility Emissions & Energy Matrix
   =========================================================================== */
export const FacilityEmissionsWidget = memo(function FacilityEmissionsWidget() {
  const { data, isLoading } = useQuery(sustainabilityOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[300px] rounded-xl" />;

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Facility Emissions & Resource Matrix</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Operational footprint across all Gigafactories & labs</p>
          </div>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="pb-2 font-semibold">Facility</th>
                <th className="pb-2 font-semibold">GHG</th>
                <th className="pb-2 font-semibold">Energy</th>
                <th className="pb-2 font-semibold">Renewable %</th>
                <th className="pb-2 font-semibold">Water</th>
                <th className="pb-2 font-semibold text-right">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.facilityEmissions.map((fac, idx) => (
                <tr key={idx} className="hover:bg-muted/30">
                  <td className="py-2.5 font-semibold text-foreground">{fac.facility}</td>
                  <td className="py-2.5 text-muted-foreground">{fac.ghg}</td>
                  <td className="py-2.5 text-muted-foreground">{fac.energy}</td>
                  <td className="py-2.5 font-semibold text-emerald-600">{fac.renewable}</td>
                  <td className="py-2.5 text-muted-foreground">{fac.water}</td>
                  <td className="py-2.5 text-right font-bold text-primary">{fac.compliance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pt-3 border-t border-border/60 text-right">
        <Link
          to="/management/sustainability-management/environmental-compliance"
          className="text-xs font-semibold text-primary hover:underline"
        >
          View Environmental Compliance Register →
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. Environmental Permits & Statutory Filings
   =========================================================================== */
export const CompliancePermitsWidget = memo(function CompliancePermitsWidget() {
  const { data, isLoading } = useQuery(sustainabilityOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[300px] rounded-xl" />;

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Environmental Permits & Legal Register</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Pollution Control Board authorizations & valid licenses</p>
          </div>
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
        </div>

        <div className="mt-4 space-y-2.5">
          {data.permitsStatus.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-card hover:bg-muted/30"
            >
              <div>
                <div className="text-xs font-semibold text-foreground">{p.permitName}</div>
                <div className="text-[11px] text-muted-foreground">
                  {p.agency} • {p.facility}
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    p.status === "Valid"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/40"
                  }`}
                >
                  {p.status}
                </span>
                <div className="text-[10px] text-muted-foreground mt-0.5">Exp: {p.expiryDate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-border/60 text-right">
        <Link
          to="/management/sustainability-management/environmental-compliance"
          className="text-xs font-semibold text-primary hover:underline"
        >
          Manage All Permits →
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   5. AI ESG & Decarbonization Copilot
   =========================================================================== */
export const AiCopilotWidget = memo(function AiCopilotWidget() {
  const { data, isLoading } = useQuery(sustainabilityOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[300px] rounded-xl" />;

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">AI ESG & Decarbonization Copilot</h3>
              <p className="text-xs text-muted-foreground">{data.aiAdvisor.subtitle}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            {data.aiAdvisor.status}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {data.aiAdvisor.insights.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-foreground">{item.title}</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {item.savingEstimate}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span>Autonomous ISO 14064 AI Reasoning</span>
        <button className="text-primary hover:underline font-semibold cursor-pointer">
          Apply Suggested Actions
        </button>
      </div>
    </div>
  );
});

/* ===========================================================================
   6. ESG Initiatives & Milestone Ledger
   =========================================================================== */
export const InitiativesLedgerWidget = memo(function InitiativesLedgerWidget() {
  const { data, isLoading } = useQuery(sustainabilityOverviewOptions);
  if (isLoading || !data) return <Skeleton className="h-[300px] rounded-xl" />;

  return (
    <div className="card-soft p-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">ESG Action Initiatives & Audit Ledger</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Corporate strategic sustainability projects in flight</p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {data.initiativesLedger.length} Active Initiatives
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="pb-2 font-semibold">Code</th>
                <th className="pb-2 font-semibold">Title</th>
                <th className="pb-2 font-semibold">Pillar</th>
                <th className="pb-2 font-semibold">Owner</th>
                <th className="pb-2 font-semibold">Target</th>
                <th className="pb-2 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.initiativesLedger.map((init) => (
                <tr key={init.id} className="hover:bg-muted/30">
                  <td className="py-2.5 font-mono text-[11px] font-bold text-foreground">{init.code}</td>
                  <td className="py-2.5 font-medium text-foreground">{init.title}</td>
                  <td className="py-2.5 text-muted-foreground">{init.pillar}</td>
                  <td className="py-2.5 text-muted-foreground">{init.owner}</td>
                  <td className="py-2.5 text-muted-foreground">{init.targetCompletion}</td>
                  <td className="py-2.5 text-right font-semibold">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        init.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : init.status === "Under Audit"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {init.status} ({init.progress}%)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-3 border-t border-border/60 text-right">
        <Link
          to="/management/sustainability-management/esg"
          className="text-xs font-semibold text-primary hover:underline"
        >
          View Full ESG Strategy Board →
        </Link>
      </div>
    </div>
  );
});

export const SUSTAINABILITY_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "panel.sustainability.decarbonization-trend",
    title: "Decarbonization & Clean Energy Trend",
    description: "Monthly GHG emissions trajectory vs. renewable power mix",
    category: "chart",
    tags: ["chart", "sustainability"],
    defaultSize: "lg",
    supportedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/management/sustainability-management/carbon-footprint",
    component: DecarbonizationTrendWidget,
  },
  {
    id: "panel.sustainability.health-summary",
    title: "Sustainability Health Summary",
    description: "YTD core environmental performance indicators & targets",
    category: "table",
    tags: ["table", "sustainability"],
    defaultSize: "md",
    supportedSizes: ["sm", "md", "lg"],
    roles: "all",
    sourceRoute: "/management/sustainability-management/overview",
    component: HealthSummaryWidget,
  },
  {
    id: "panel.sustainability.facility-matrix",
    title: "Facility Emissions & Energy Matrix",
    description: "Facility breakdown of power, GHG, water, and compliance",
    category: "table",
    tags: ["table", "sustainability"],
    defaultSize: "lg",
    supportedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/management/sustainability-management/overview",
    component: FacilityEmissionsWidget,
  },
  {
    id: "panel.sustainability.compliance-permits",
    title: "Environmental Permits & Licenses",
    description: "Active SPCB licenses, CTO consents, and expiration monitoring",
    category: "list",
    tags: ["list", "sustainability"],
    defaultSize: "md",
    supportedSizes: ["sm", "md", "lg"],
    roles: "all",
    sourceRoute: "/management/sustainability-management/environmental-compliance",
    component: CompliancePermitsWidget,
  },
  {
    id: "panel.sustainability.ai-copilot",
    title: "AI ESG & Decarbonization Copilot",
    description: "Autonomous reasoning for emission abatement & cost savings",
    category: "summary",
    tags: ["summary", "sustainability"],
    defaultSize: "md",
    supportedSizes: ["sm", "md", "lg"],
    roles: "all",
    sourceRoute: "/management/sustainability-management/overview",
    component: AiCopilotWidget,
  },
  {
    id: "panel.sustainability.initiatives-ledger",
    title: "ESG Action Initiatives Ledger",
    description: "Active corporate ESG initiatives and milestone deliverables",
    category: "table",
    tags: ["table", "sustainability"],
    defaultSize: "lg",
    supportedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/management/sustainability-management/esg",
    component: InitiativesLedgerWidget,
  },
];
