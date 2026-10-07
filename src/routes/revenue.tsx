import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, CircleDollarSign, Users, Briefcase, Download, Plus } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { AppShell, PageHeader } from "@/components/erp/AppShell";
import { KpiCard } from "@/components/erp/KpiCard";
import { ErpButton } from "@/components/erp/Button";
import { analyticsEngineService } from "@/services";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/revenue")({
  head: () => ({ meta: [{ title: "Revenue · Magnertia ERP" }] }),
  component: RevenuePage,
});

const revenueByStation = [
  { station: "Bengaluru – Whitefield Hub", revenue: 4_820_000, sessions: 8420 },
  { station: "Mumbai – BKC Tower", revenue: 4_310_000, sessions: 7180 },
  { station: "Delhi – Aerocity Plaza", revenue: 3_950_000, sessions: 6720 },
  { station: "Hyderabad – HITEC City", revenue: 3_580_000, sessions: 6240 },
  { station: "Pune – Hinjewadi Park", revenue: 3_120_000, sessions: 5410 },
  { station: "Chennai – OMR Tech Park", revenue: 2_880_000, sessions: 4980 },
  { station: "Gurugram – Cyber Hub", revenue: 2_640_000, sessions: 4520 },
  { station: "Ahmedabad – SG Road", revenue: 2_210_000, sessions: 3840 },
];

function RevenuePage() {
  const { data } = useQuery({
    queryKey: ["revenue", "data"],
    queryFn: () => analyticsEngineService.fetchRevenueData(),
  });

  const revenueTrend = data?.trend ?? [];
  const revenueSources = data?.sources ?? [];
  const total = revenueSources.reduce((s, r) => s + r.value, 0);

  return (
    <AppShell>
      <PageHeader
        title="Revenue Management"
        description="Charging, subscription, partner and commission revenue across all stations."
        actions={
          <>
            <ErpButton variant="outline" size="md">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </ErpButton>
            <ErpButton size="md">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Entry</span>
            </ErpButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Top Revenue Stream"
          value={formatCurrency(revenueSources[0]?.value ?? 0, true)}
          delta={{ value: "11.2%", positive: true }}
          icon={CircleDollarSign}
          hint={revenueSources[0]?.name ?? "—"}
        />
        <KpiCard
          label="Second Stream"
          value={formatCurrency(revenueSources[1]?.value ?? 0, true)}
          delta={{ value: "9.4%", positive: true }}
          icon={Users}
          tone="success"
        />
        <KpiCard
          label="Third Stream"
          value={formatCurrency(revenueSources[2]?.value ?? 0, true)}
          delta={{ value: "4.1%", positive: true }}
          icon={Briefcase}
        />
        <KpiCard
          label="Other Revenue"
          value={formatCurrency(revenueSources[3]?.value ?? 0, true)}
          delta={{ value: "2.3%", positive: false }}
          icon={TrendingUp}
          tone="warning"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card-soft p-5 lg:col-span-2">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="font-display text-base font-semibold text-foreground">
                Revenue Trend & Forecast
              </h3>
              <p className="text-xs text-muted-foreground">
                Total YTD · {formatCurrency(total, true)}
              </p>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer>
              <LineChart data={revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => formatCurrency(v, true)}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-soft p-5">
          <h3 className="font-display text-base font-semibold text-foreground">
            Revenue by Region
          </h3>
          <p className="text-xs text-muted-foreground">Top contributing cities</p>
          <ul className="mt-4 space-y-3">
            {[
              { city: "Bengaluru", value: 14820000, pct: 30 },
              { city: "Mumbai", value: 11240000, pct: 23 },
              { city: "Delhi NCR", value: 9680000, pct: 20 },
              { city: "Hyderabad", value: 6580000, pct: 14 },
              { city: "Pune", value: 3120000, pct: 7 },
              { city: "Others", value: 2835000, pct: 6 },
            ].map((r) => (
              <li key={r.city}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{r.city}</span>
                  <span className="font-semibold tabular-nums text-muted-foreground">
                    {formatCurrency(r.value, true)}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 card-soft p-5">
        <div className="mb-4">
          <h3 className="font-display text-base font-semibold text-foreground">
            Revenue by Station
          </h3>
          <p className="text-xs text-muted-foreground">Sessions and earnings per location</p>
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer>
            <BarChart
              data={revenueByStation}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis
                type="number"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
              />
              <YAxis
                dataKey="station"
                type="category"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={180}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: number) => formatCurrency(v, true)}
                cursor={{ fill: "var(--secondary)" }}
              />
              <Bar dataKey="revenue" fill="var(--chart-1)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
