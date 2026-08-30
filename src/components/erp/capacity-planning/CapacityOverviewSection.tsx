import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { CapacityFormInput, CapacityPlanningRecord } from "@/services/types";

export function CapacityOverviewSection({
  form,
  record,
  onNavigateTab,
}: {
  form: UseFormReturn<CapacityFormInput>;
  record: CapacityPlanningRecord;
  onNavigateTab?: (tabId: string) => void;
}) {
  const demandTrendData = [
    { month: "Jul 2024", demand: 52000, available: 75000, planned: 48000 },
    { month: "Aug 2024", demand: 75000, available: 95000, planned: 72000 },
    { month: "Sep 2024", demand: 82000, available: 110000, planned: 78000 },
    { month: "Oct 2024", demand: 78000, available: 108000, planned: 75000 },
    { month: "Nov 2024", demand: 80000, available: 110000, planned: 77000 },
    { month: "Dec 2024", demand: 85000, available: 122000, planned: 82000 },
    { month: "Jan 2025", demand: 82000, available: 118000, planned: 79000 },
    { month: "Feb 2025", demand: 86000, available: 120000, planned: 83000 },
    { month: "Mar 2025", demand: 95000, available: 130000, planned: 92000 },
    { month: "Apr 2025", demand: 102000, available: 140000, planned: 98000 },
    { month: "May 2025", demand: 98000, available: 135000, planned: 95000 },
    { month: "Jun 2025", demand: 120000, available: 145000, planned: 118000 },
  ];

  const machineUtilData = [
    { line: "Line 1", util: 82 },
    { line: "Line 2", util: 76 },
    { line: "Line 3", util: 85 },
    { line: "Line 4", util: 71 },
    { line: "Line 5", util: 80 },
  ];

  const workforceData = [
    { station: "S1", loading: 75 },
    { station: "S2", loading: 82 },
    { station: "S3", loading: 77 },
    { station: "S4", loading: 69 },
    { station: "S5", loading: 80 },
  ];

  return (
    <div className="space-y-5">
      {/* Demand vs Capacity Trend Chart */}
      <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold">Demand vs Capacity Trend (Units)</CardTitle>
            <CardDescription className="text-xs">
              Monthly demand forecast vs available capacity vs planned production volume.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">
            Monthly View
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0A3C75",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "11px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="demand"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Demand Forecast"
                />
                <Line
                  type="monotone"
                  dataKey="available"
                  stroke="#059669"
                  strokeWidth={2}
                  name="Available Capacity"
                />
                <Line
                  type="monotone"
                  dataKey="planned"
                  stroke="#d97706"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Planned Production"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Machine & Workforce Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Machine Utilization Bar Chart */}
        <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold">Machine Utilization (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={machineUtilData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="line" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="util" fill="#0A3C75" radius={[4, 4, 0, 0]} name="Utilization %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Workforce Loading Bar Chart */}
        <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold">Workforce Loading (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workforceData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="station" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="loading" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Loading %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
