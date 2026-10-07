/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Database,
  ExternalLink,
  FileCheck,
  FileText,
  Key,
  Layers,
  MapPin,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { adminOverviewOptions, type AdminOverviewData } from "../../data/adminQueries";
import type { WidgetContentProps, WidgetDefinition } from "../../types";

/* ===========================================================================
   1. Organization & Branch Operational Hierarchy
   =========================================================================== */
export const BranchHierarchyWidget = memo(function BranchHierarchyWidget() {
  const { data, isLoading } = useQuery(adminOverviewOptions());
  if (isLoading || !data) return <Skeleton className="h-[340px] rounded-xl" />;

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Branch & Facility Operational Matrix</h3>
              <p className="text-xs text-muted-foreground">Staff allocation and department footprint per location</p>
            </div>
          </div>
          <Link
            to="/management/administration-management/branch-management"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Branch Master</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                <th className="pb-2">Branch / Facility</th>
                <th className="pb-2">Code</th>
                <th className="pb-2">City</th>
                <th className="pb-2 text-center">Depts</th>
                <th className="pb-2 text-right">Headcount</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {data.branchDistribution.map((b) => (
                <tr key={b.code} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 font-bold text-foreground">{b.branch}</td>
                  <td className="py-2.5 text-muted-foreground font-mono text-[11px]">{b.code}</td>
                  <td className="py-2.5 text-slate-700 dark:text-slate-300">{b.city}</td>
                  <td className="py-2.5 text-center">{b.departmentsCount}</td>
                  <td className="py-2.5 text-right font-bold tabular">{b.headcount}</td>
                  <td className="py-2.5 text-right">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold",
                        b.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                      )}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>6 operational facilities</span>
        <Link to="/management/administration-management/organization-structure" className="text-primary font-semibold hover:underline">
          View Full Org Chart →
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   2. Approval Matrix SLA & Velocity Pipeline
   =========================================================================== */
export const ApprovalMatrixWidget = memo(function ApprovalMatrixWidget() {
  const { data, isLoading } = useQuery(adminOverviewOptions());
  if (isLoading || !data) return <Skeleton className="h-[340px] rounded-xl" />;

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <FileCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Approval Matrix Workflow Velocity</h3>
              <p className="text-xs text-muted-foreground">Pending volume & turnaround time by authorization tier</p>
            </div>
          </div>
          <Link
            to="/management/administration-management/approval-matrix-management"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Approval Master</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-3 divide-y divide-border/60">
          {data.approvalMatrixPipeline.map((matrix) => (
            <div key={matrix.matrixType} className="flex items-center justify-between py-2 text-xs">
              <div className="min-w-0 pr-2">
                <p className="font-semibold text-foreground truncate">{matrix.matrixType}</p>
                <p className="text-[11px] text-muted-foreground">
                  Avg turnaround: <strong>{matrix.avgApprovalHours} hrs</strong> · SLA: {matrix.slaMetPercentage}%
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 font-bold text-amber-600 dark:text-amber-400 text-xs">
                  {matrix.pendingCount}
                </span>
                <span className="text-[11px] text-muted-foreground">pending</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>Total Pending: <strong>{data.kpis.pendingApprovals} requests</strong></span>
        <span>Average SLA: <strong>95.6% compliant</strong></span>
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Document Control & Policy Lifecycle
   =========================================================================== */
export const DocumentControlWidget = memo(function DocumentControlWidget() {
  const { data, isLoading } = useQuery(adminOverviewOptions());
  if (isLoading || !data) return <Skeleton className="h-[340px] rounded-xl" />;

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Controlled Document Lifecycle</h3>
              <p className="text-xs text-muted-foreground">SOPs, Work Instructions & Policy revisions</p>
            </div>
          </div>
          <Link
            to="/management/administration-management/document-control-management"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Document Center</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-2 grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={data.documentLifecycle}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {data.documentLifecycle.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: any, name: any, item: any) => [`${value} documents`, item.payload.status]} />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {data.documentLifecycle.map((d) => (
              <div key={d.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{d.status}</span>
                </div>
                <span className="font-bold text-foreground ml-2">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>Controlled: <strong>{data.kpis.controlledDocuments} total</strong></span>
        <span>Active Policies: <strong>{data.kpis.activePolicies}</strong></span>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. Pending Approvals Action Table
   =========================================================================== */
export const PendingApprovalsActionWidget = memo(function PendingApprovalsActionWidget() {
  const { data, isLoading } = useQuery(adminOverviewOptions());
  if (isLoading || !data) return <Skeleton className="h-[340px] rounded-xl" />;

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Pending Action Items for Executive Authorization</h3>
              <p className="text-xs text-muted-foreground">High-priority matrix requisitions requiring executive review</p>
            </div>
          </div>
          <Link
            to="/management/administration-management/approval-matrix-management"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Review All (19)</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                <th className="pb-2">Request ID</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Reference Subject</th>
                <th className="pb-2">Initiator</th>
                <th className="pb-2 text-right">Amount</th>
                <th className="pb-2 text-right">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {data.pendingApprovalsList.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 font-bold text-primary">{item.id}</td>
                  <td className="py-2.5 text-foreground">{item.requestType}</td>
                  <td className="py-2.5 text-slate-700 dark:text-slate-300 font-semibold">{item.reference}</td>
                  <td className="py-2.5 text-muted-foreground">{item.requestedBy} ({item.department})</td>
                  <td className="py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {item.amount ? formatCurrency(item.amount) : "—"}
                  </td>
                  <td className="py-2.5 text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-bold",
                        item.priority === "Urgent"
                          ? "border-rose-300 text-rose-700 bg-rose-50 dark:bg-rose-950/40"
                          : "border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/40",
                      )}
                    >
                      {item.priority}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>4 urgent items on your desk</span>
        <span className="text-emerald-600 font-bold">1-click bulk approve enabled</span>
      </div>
    </div>
  );
});

/* ===========================================================================
   5. Administration & Governance AI Intelligence
   =========================================================================== */
export const AdminAiIntelligenceWidget = memo(function AdminAiIntelligenceWidget() {
  return (
    <div className="card-soft border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Governance, Security & Compliance AI Engine</h3>
            <p className="text-xs text-muted-foreground">Automated Segregation of Duties (SoD) & Master Data hygiene monitoring</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          Zero SoD Violations
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 text-xs">
        <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Audit & Access Hygiene</span>
          </div>
          <p className="text-muted-foreground">
            All 385 system users have active MFA enabled. Zero privilege escalation anomalies detected across past 90 days.
          </p>
        </div>

        <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold mb-1">
            <Database className="h-3.5 w-3.5" />
            <span>Master Data Deduplication</span>
          </div>
          <p className="text-muted-foreground">
            Automated entity scanner verified 1,250 vendor, customer, and GL master records with 100% field integrity.
          </p>
        </div>

        <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold mb-1">
            <Scale className="h-3.5 w-3.5" />
            <span>Statutory & Policy Sign-off</span>
          </div>
          <p className="text-muted-foreground">
            Annual statutory governance audit readiness score is 98.2%. All 36 corporate policies current with zero overdue reviews.
          </p>
        </div>
      </div>
    </div>
  );
});

/* ===========================================================================
   Widget Definition Exports
   =========================================================================== */
export const ADMIN_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "table.admin.branch-hierarchy",
    title: "Branch & Facility Matrix",
    description: "Multi-branch operational footprint and department staff allocations.",
    category: "table",
    tags: ["table", "admin"],
    icon: MapPin,
    keywords: ["branch", "facility", "headcount", "locations", "offices"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    roles: "all",
    sourceRoute: "/management/administration-management/branch-management",
    component: BranchHierarchyWidget,
  },
  {
    id: "list.admin.approval-matrix",
    title: "Approval Matrix Pipeline",
    description: "Authorization workflow turnaround time and SLA compliance by matrix type.",
    category: "list",
    tags: ["list", "admin"],
    icon: FileCheck,
    keywords: ["approval", "matrix", "sla", "workflow", "turnaround"],
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/management/administration-management/approval-matrix-management",
    component: ApprovalMatrixWidget,
  },
  {
    id: "chart.admin.document-control",
    title: "Document Control Lifecycle",
    description: "Revision status breakdown for controlled engineering and quality documentation.",
    category: "chart",
    tags: ["chart", "admin"],
    icon: FileText,
    keywords: ["document", "sop", "policy", "lifecycle", "revision"],
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/management/administration-management/document-control-management",
    component: DocumentControlWidget,
  },
  {
    id: "table.admin.pending-approvals",
    title: "Pending Matrix Approvals Table",
    description: "High-priority authorization requisitions awaiting executive sign-off.",
    category: "table",
    tags: ["table", "admin"],
    icon: Clock,
    keywords: ["pending", "approvals", "capex", "requisition", "sign-off"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    roles: "all",
    sourceRoute: "/management/administration-management/approval-matrix-management",
    component: PendingApprovalsActionWidget,
  },
  {
    id: "ai.admin.governance-intelligence",
    title: "Administration AI Governance Intelligence",
    description: "Real-time compliance monitoring, SoD conflict detection and policy tracking.",
    category: "ai",
    tags: ["ai", "admin"],
    icon: Sparkles,
    keywords: ["ai", "governance", "compliance", "sod", "audit", "security"],
    defaultSize: "full",
    allowedSizes: ["full"],
    roles: "all",
    sourceRoute: "/management/administration-management/overview",
    component: AdminAiIntelligenceWidget,
  },
];
