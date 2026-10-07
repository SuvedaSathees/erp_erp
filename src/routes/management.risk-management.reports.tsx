import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { listEnterpriseRiskRecordsFn } from "@/lib/enterpriseRiskFns.server";
import {
  FileText,
  Download,
  Printer,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Search,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { RiskManagementTabBar } from "@/components/erp/RiskManagementTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  enterpriseRiskService,
  REPORT_DEFINITIONS,
  FULL_ENTERPRISE_RISKS,
  KRI_ITEMS,
  RISK_TREATMENT_ACTIONS,
} from "@/services/enterpriseRiskService";

export const Route = createFileRoute("/management/risk-management/reports")({
  head: () => ({
    meta: [
      { title: "Risk Reports · Magnertia ERP" },
      {
        name: "description",
        content:
          "Consolidated Enterprise Risk reports, 25 controlled audit registers, heat map analytics, and AI risk summaries.",
      },
    ],
  }),
  component: RiskManagementReportPage,
});

function RiskManagementReportPage() {
  // --- Prisma-backed query with inline fallback ---
  const { data: dbList } = useQuery({
    queryKey: ["enterprise-risk", "list"],
    queryFn: () => listEnterpriseRiskRecordsFn({ data: {} }),
  });
  const allRisks = dbList?.data ?? FULL_ENTERPRISE_RISKS;

  const [selectedReportId, setSelectedReportId] = useState<string>("REP-01");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const selectedReport =
    REPORT_DEFINITIONS.find((r) => r.id === selectedReportId) ?? REPORT_DEFINITIONS[0];

  const filteredReports = REPORT_DEFINITIONS.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "All" || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categories = ["All", ...Array.from(new Set(REPORT_DEFINITIONS.map((r) => r.category)))];

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Title,Category,Inherent,Residual,Trend,Status"]
        .concat(
          allRisks.map(
            (r) =>
              `"${r.id}","${r.title}","${r.category}",${r.inherentScore},${r.residualScore},"${r.trend}","${r.status}"`,
          ),
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedReport.name.replace(/\s+/g, "_")}_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell
      title="Enterprise Risk Reports"
      breadcrumb="Management > Risk Management > Reports"
      description="Consolidated portfolio reporting, audit documentation, risk appetite compliance, and AI risk intelligence."
      tabs={<RiskManagementTabBar />}
      hideScoreBanner={true}
    >
      <div className="space-y-6">
        <Tabs defaultValue="executive-brief" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/60 pb-3">
            <TabsList className="bg-muted/60 p-1">
              <TabsTrigger value="executive-brief" className="text-xs font-semibold gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" />
                Executive Summary Brief
              </TabsTrigger>
              <TabsTrigger value="report-catalog" className="text-xs font-semibold gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Enterprise Report Catalog (25 Reports)
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 border-border"
                onClick={() => window.print()}
              >
                <Printer className="h-3.5 w-3.5 text-muted-foreground" />
                Print
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground font-semibold"
                onClick={handleExport}
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Tab 1: Standard Executive Module Report */}
          <TabsContent value="executive-brief" className="mt-4">
            <ModuleSummaryReport moduleId="risk-management" />
          </TabsContent>

          {/* Tab 2: 25 Controlled Enterprise Risk Reports */}
          <TabsContent value="report-catalog" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Report List */}
              <div className="lg:col-span-4 space-y-3">
                <Card className="border-border/80 shadow-2xs">
                  <CardHeader className="p-4 pb-2 border-b border-border/40">
                    <CardTitle className="text-sm font-bold text-foreground flex items-center justify-between">
                      <span>Controlled Risk Reports</span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {filteredReports.length} / 25
                      </Badge>
                    </CardTitle>
                    <div className="pt-2 space-y-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder="Search 25 report suites..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="h-8 pl-8 text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-xs">
                        {categories.map((c) => (
                          <button
                            key={c}
                            onClick={() => setCategoryFilter(c)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap transition-colors ${
                              categoryFilter === c
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 space-y-1 max-h-[560px] overflow-y-auto">
                    {filteredReports.map((rep) => {
                      const isSelected = rep.id === selectedReportId;
                      return (
                        <button
                          key={rep.id}
                          onClick={() => setSelectedReportId(rep.id)}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                            isSelected
                              ? "bg-primary/10 border-primary/40 text-foreground"
                              : "border-transparent hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-primary">{rep.id}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted font-medium">
                              {rep.category}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-foreground mt-0.5">{rep.name}</div>
                          <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {rep.description}
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Live Report Preview & Data Surface */}
              <div className="lg:col-span-8 space-y-4">
                <Card className="border-border/80 shadow-2xs">
                  <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs text-primary font-bold">
                          {selectedReport.id}
                        </Badge>
                        <CardTitle className="text-base font-bold text-foreground">
                          {selectedReport.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs mt-1">
                        {selectedReport.description}
                      </CardDescription>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-200 text-xs">
                      Live Telemetry
                    </Badge>
                  </CardHeader>

                  <CardContent className="p-4 space-y-4">
                    {/* Dynamic View based on Report Type */}
                    {selectedReport.id === "REP-12" ? (
                      /* KRI Report Table */
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                          Active Monitored Key Risk Indicators
                        </div>
                        <div className="overflow-x-auto border border-border/40 rounded-lg">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-muted/40 text-[10px] uppercase font-bold text-muted-foreground">
                              <tr>
                                <th className="p-2.5">KRI ID</th>
                                <th className="p-2.5">Indicator Name</th>
                                <th className="p-2.5">Category</th>
                                <th className="p-2.5 text-right">Current</th>
                                <th className="p-2.5 text-right">Threshold</th>
                                <th className="p-2.5 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {KRI_ITEMS.map((k) => (
                                <tr key={k.id} className="border-t border-border/20 hover:bg-muted/20">
                                  <td className="p-2.5 font-mono font-semibold text-primary">{k.id}</td>
                                  <td className="p-2.5 font-medium">{k.name}</td>
                                  <td className="p-2.5 text-muted-foreground">{k.category}</td>
                                  <td className="p-2.5 text-right font-mono font-bold">{k.currentValue}</td>
                                  <td className="p-2.5 text-right font-mono text-muted-foreground">
                                    {k.criticalThreshold}
                                  </td>
                                  <td className="p-2.5 text-center">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        k.status === "Red"
                                          ? "bg-rose-500/10 text-rose-600"
                                          : k.status === "Amber"
                                            ? "bg-amber-500/10 text-amber-600"
                                            : "bg-emerald-500/10 text-emerald-600"
                                      }`}
                                    >
                                      {k.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : selectedReport.id === "REP-14" || selectedReport.id === "REP-15" ? (
                      /* Risk Action Plans Table */
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                          Risk Treatment Action Plans & Escalations
                        </div>
                        <div className="overflow-x-auto border border-border/40 rounded-lg">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-muted/40 text-[10px] uppercase font-bold text-muted-foreground">
                              <tr>
                                <th className="p-2.5">Action ID</th>
                                <th className="p-2.5">Action Item</th>
                                <th className="p-2.5">Category</th>
                                <th className="p-2.5">Owner</th>
                                <th className="p-2.5">Budget</th>
                                <th className="p-2.5 font-mono">Due Date</th>
                                <th className="p-2.5 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {RISK_TREATMENT_ACTIONS.map((a) => (
                                <tr key={a.id} className="border-t border-border/20 hover:bg-muted/20">
                                  <td className="p-2.5 font-mono font-semibold text-primary">{a.id}</td>
                                  <td className="p-2.5 font-medium">{a.action}</td>
                                  <td className="p-2.5 text-muted-foreground">{a.category}</td>
                                  <td className="p-2.5">{a.owner}</td>
                                  <td className="p-2.5 font-mono">{a.budget}</td>
                                  <td className="p-2.5 font-mono text-muted-foreground">{a.dueDate}</td>
                                  <td className="p-2.5 text-right">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        a.status === "In Progress"
                                          ? "bg-blue-500/10 text-blue-600"
                                          : "bg-rose-500/10 text-rose-600"
                                      }`}
                                    >
                                      {a.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Enterprise Risk Portfolio Table */
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                          Risk Portfolio Master Records
                        </div>
                        <div className="overflow-x-auto border border-border/40 rounded-lg">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-muted/40 text-[10px] uppercase font-bold text-muted-foreground">
                              <tr>
                                <th className="p-2.5">ID</th>
                                <th className="p-2.5">Risk Statement & Title</th>
                                <th className="p-2.5">Category</th>
                                <th className="p-2.5">Owner</th>
                                <th className="p-2.5 text-center">Inherent</th>
                                <th className="p-2.5 text-center">Residual</th>
                                <th className="p-2.5 text-center">Trend</th>
                                <th className="p-2.5 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {allRisks.map((r) => (
                                <tr key={r.id} className="border-t border-border/20 hover:bg-muted/20">
                                  <td className="p-2.5 font-mono font-semibold text-primary">{r.id}</td>
                                  <td className="p-2.5">
                                    <div className="font-semibold text-foreground">{r.title}</div>
                                    <div className="text-[11px] text-muted-foreground line-clamp-1">
                                      {r.statement}
                                    </div>
                                  </td>
                                  <td className="p-2.5 text-muted-foreground">{r.category}</td>
                                  <td className="p-2.5">{r.owner}</td>
                                  <td className="p-2.5 text-center">
                                    <span
                                      className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                                        r.inherentScore >= 17
                                          ? "bg-red-500/10 text-red-600"
                                          : "bg-orange-500/10 text-orange-600"
                                      }`}
                                    >
                                      {r.inherentScore}
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-center">
                                    <span
                                      className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                                        r.residualScore >= 12
                                          ? "bg-orange-500/10 text-orange-600"
                                          : r.residualScore >= 8
                                            ? "bg-amber-500/10 text-amber-700"
                                            : "bg-emerald-500/10 text-emerald-600"
                                      }`}
                                    >
                                      {r.residualScore}
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-center font-bold">
                                    {r.trend === "Increasing" ? (
                                      <span className="text-red-500">↑</span>
                                    ) : r.trend === "Decreasing" ? (
                                      <span className="text-emerald-500">↓</span>
                                    ) : (
                                      <span className="text-amber-500">→</span>
                                    )}
                                  </td>
                                  <td className="p-2.5 text-right">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        r.status === "Monitoring"
                                          ? "bg-emerald-500/10 text-emerald-600"
                                          : "bg-rose-500/10 text-rose-600"
                                      }`}
                                    >
                                      {r.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

