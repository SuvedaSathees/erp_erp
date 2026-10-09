import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { StrategyManagementTabBar } from "@/components/erp/StrategyManagementTabBar";
import { StrategyScoreBanner } from "@/components/erp/StrategyScoreBanner";
import {
  ShieldCheck,
  Users,
  Calendar,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon,
  ChevronRight,
  Building2,
  Scale,
  Award,
  Send,
  X,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useModuleDataset, usePersistentState } from "@/services/moduleDatasetService";
export const Route = createFileRoute("/management/strategy-management/corporate-governance")({
  head: () => ({
    meta: [
      { title: "Corporate Governance · Strategy Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Ensure corporate transparency, fiduciary accountability, board management, committee oversight, cap table, and regulatory compliance.",
      },
    ],
  }),
  component: CorporateGovernancePage,
});

const BOARD_COMPOSITION = [
  { name: "Executive Directors", value: 3, percentage: 37.5, color: "#3b82f6" },
  { name: "Independent Directors", value: 3, percentage: 37.5, color: "#10b981" },
  { name: "Nominee Directors", value: 1, percentage: 12.5, color: "#8b5cf6" },
  { name: "Women Directors", value: 1, percentage: 12.5, color: "#f59e0b" },
];

const SHAREHOLDING_DATA = [
  { name: "Promoters", value: 52, color: "#3b82f6" },
  { name: "Institutional Investors", value: 24, color: "#10b981" },
  { name: "Public & Retail", value: 16, color: "#f59e0b" },
  { name: "Employees / ESOP", value: 8, color: "#8b5cf6" },
];

const GOVERNANCE_RESOLUTIONS = [
    { id: "BR-2026-011", subject: "Approve Q2 Budget", date: "01 Jul 2026", status: "Completed" },
    { id: "BR-2026-012", subject: "Approve New Product Launch", date: "15 Jul 2026", status: "In Progress" },
    { id: "BR-2026-013", subject: "Re-appoint Independent Director", date: "30 Jul 2026", status: "Approved" },
    { id: "BR-2026-014", subject: "Change in Banking Authority", date: "12 Aug 2026", status: "Pending" },
    { id: "BR-2026-015", subject: "ESG Sustainability Initiative", date: "25 Aug 2026", status: "Approved" },
  ];

const PAGE_DATASET = { BOARD_COMPOSITION, SHAREHOLDING_DATA, resolutions: GOVERNANCE_RESOLUTIONS };

function CorporateGovernancePage() {
  const { BOARD_COMPOSITION, SHAREHOLDING_DATA } = useModuleDataset("strategy-management.corporate-governance", "Corporate Governance", PAGE_DATASET);
  const [fiscalYear, setFiscalYear] = useState("FY 2026-27");
  const [entity, setEntity] = useState("Magnertia Private Limited");
  const [currentMaturityStage, setCurrentMaturityStage] = usePersistentState("strategy-management.corporate-governance", "Corporate Governance", "currentMaturityStage", 3); // Independent Directors

  // Modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordType, setRecordType] = useState("Board Resolution");
  const [recordSubject, setRecordSubject] = useState("");

  // Live Resolutions
  const [resolutions, setResolutions] = usePersistentState("strategy-management.corporate-governance", "Corporate Governance", "resolutions", GOVERNANCE_RESOLUTIONS);

  // AI Chat
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hello! I am your AI Governance Assistant. Ask me about committee compliance, voting records, or board resolutions." },
  ]);
  const [aiQuery, setAiQuery] = useState("");

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordSubject.trim()) return;
    const newRes = {
      id: `BR-2026-0${resolutions.length + 11}`,
      subject: recordSubject,
      date: "05 Oct 2026",
      status: "Approved",
    };
    setResolutions([newRes, ...resolutions]);
    setRecordSubject("");
    setIsRecordModalOpen(false);
    toast.success("Governance Record Created", {
      description: `${recordType} "${newRes.subject}" registered with number ${newRes.id}.`,
    });
  };

  const handleAiAsk = (promptText?: string) => {
    const q = promptText || aiQuery;
    if (!q.trim()) return;
    setAiChatMessages((prev) => [...prev, { sender: "user", text: q }]);
    setAiQuery("");

    setTimeout(() => {
      let reply = `Governance Score is currently at 92% (Exemplary). Board independence ratio is 37.5%, fulfilling all Companies Act and SEBI LODR requirements.`;
      if (q.toLowerCase().includes("risk")) {
        reply = `Governance Risk Heatmap shows 1 critical compliance item due: Statutory Audit for FY 2026-27. Next Audit Committee meets on 22 Oct 2026.`;
      }
      setAiChatMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 600);
  };

  return (
    <AppShell
      title="Corporate Governance"
      breadcrumb="Management"
      description="Ensure transparency, accountability and sustainable growth."
      tabs={<StrategyManagementTabBar />}
    >
      <div className="space-y-5 pb-16">
        {/* Top Header Card */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-xl bg-card p-4 border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Corporate Governance</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  92% Score
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Ensure transparency, accountability and sustainable growth.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="h-9 px-3 text-xs font-medium rounded-lg border bg-background text-foreground shadow-2xs cursor-pointer"
            >
              <option value="FY 2026-27">FY 2026-27</option>
              <option value="FY 2025-26">FY 2025-26</option>
            </select>

            <select
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              className="h-9 px-3 text-xs font-medium rounded-lg border bg-background text-foreground shadow-2xs cursor-pointer"
            >
              <option value="Magnertia Private Limited">Magnertia Private Limited</option>
              <option value="BharatMandeer Private Limited">BharatMandeer Private Limited</option>
            </select>

            <button
              type="button"
              onClick={() => setIsRecordModalOpen(true)}
              className="h-9 px-4 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New Governance Record</span>
            </button>
          </div>
        </div>

        {/* 7 Metric Score Banner (Executive Standard) */}
        <StrategyScoreBanner moduleName="Governance" />

        {/* Overview Workbench */}
        <div className="space-y-5">
            {/* Top Row: Overview (4) + Maturity (4) + Upcoming Meetings (4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Governance Overview (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-sm text-foreground">Governance Overview</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                    Active
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground">Governance Model</span>
                    <p className="font-semibold text-foreground">Independent Director Governed</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] text-muted-foreground">Legal Entity</span>
                      <p className="font-medium text-foreground">{entity}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground">Planning Period</span>
                      <p className="font-medium text-foreground">Apr 2026 - Mar 2027</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] text-muted-foreground">Governance Owner</span>
                      <p className="font-medium text-foreground">Company Secretary</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground">Version</span>
                      <p className="font-medium font-mono text-foreground">1.0</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t flex items-center justify-between">
                  <div className="text-xs text-muted-foreground font-medium">Composite Score:</div>
                  <div className="text-xl font-extrabold text-blue-600">92%</div>
                </div>
              </div>

              {/* Governance Maturity Stepper (5 cols) */}
              <div className="lg:col-span-5 bg-card border rounded-xl p-4 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-2 mb-3">
                    <h4 className="font-bold text-sm text-foreground">Governance Maturity</h4>
                    <span className="text-xs text-muted-foreground font-semibold">Stage 3 of 5</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 text-center py-2">
                    {[
                      { id: 1, label: "Founder Managed" },
                      { id: 2, label: "Professional Mgmt" },
                      { id: 3, label: "Independent Directors" },
                      { id: 4, label: "Board Committees" },
                      { id: 5, label: "Listed Governance" },
                    ].map((st) => (
                      <div key={st.id} className="space-y-1">
                        <div
                          className={cn(
                            "h-7 w-7 mx-auto rounded-full text-xs font-bold flex items-center justify-center transition-all",
                            currentMaturityStage === st.id
                              ? "bg-blue-600 text-white ring-4 ring-blue-600/20"
                              : currentMaturityStage > st.id
                              ? "bg-emerald-500 text-white"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {currentMaturityStage > st.id ? <Check className="h-3 w-3" /> : st.id}
                        </div>
                        <span className="text-[9px] font-medium text-muted-foreground block leading-tight">
                          {st.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-[11px] p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 font-medium">
                  Current Stage: Independent Directors & Board Oversight Committee Structure active.
                </div>
              </div>

              {/* Upcoming Board Meetings (3 cols) */}
              <div className="lg:col-span-3 bg-card border rounded-xl p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-sm text-foreground">Upcoming Meetings</h4>
                  <span className="text-xs text-blue-600 font-semibold cursor-pointer">View All</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg border bg-muted/20">
                    <div className="font-semibold text-foreground">Board Meeting #4/2026-27</div>
                    <div className="text-[10px] text-muted-foreground">15 Oct 2026 | 10:00 AM</div>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 mt-1 inline-block">Scheduled</span>
                  </div>
                  <div className="p-2 rounded-lg border bg-muted/20">
                    <div className="font-semibold text-foreground">Audit Committee Meeting</div>
                    <div className="text-[10px] text-muted-foreground">22 Oct 2026 | 11:00 AM</div>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 mt-1 inline-block">Scheduled</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Row: Board Composition + Committees + Governance Compliance */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Board Composition Donut (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <h4 className="font-bold text-sm text-foreground">Board Composition</h4>
                  <span className="text-xs text-muted-foreground font-semibold">8 Total Directors</span>
                </div>
                <div className="h-44 w-full flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={BOARD_COMPOSITION}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={2}
                      >
                        {BOARD_COMPOSITION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1 text-xs pt-1">
                  {BOARD_COMPOSITION.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-semibold text-foreground">{item.value} ({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Committee Overview Table (5 cols) */}
              <div className="lg:col-span-5 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="font-bold text-sm text-foreground">Committee Overview</h4>
                  <span className="text-xs text-muted-foreground">6 Active</span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { name: "Audit Committee", chair: "R. Meenakshi", members: 5, freq: "Quarterly" },
                    { name: "Nomination & Remuneration", chair: "S. Ravi", members: 4, freq: "Quarterly" },
                    { name: "Risk Committee", chair: "K. Prakash", members: 4, freq: "Quarterly" },
                    { name: "CSR Committee", chair: "P. Nithya", members: 3, freq: "Half-Yearly" },
                    { name: "ESG Committee", chair: "M. Prakash", members: 4, freq: "Quarterly" },
                  ].map((c) => (
                    <div key={c.name} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground">{c.name}</div>
                        <div className="text-[10px] text-muted-foreground">Chair: {c.chair} • {c.members} Members</div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Governance Compliance (3 cols) */}
              <div className="lg:col-span-3 bg-card border rounded-xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-sm text-foreground">Governance Compliance</h4>
                  <span className="text-xs text-emerald-600 font-bold">85% Rate</span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { label: "Statutory Filings", done: 3, total: 4 },
                    { label: "Board Resolutions", done: 12, total: 15 },
                    { label: "Policy Reviews", done: 6, total: 8 },
                    { label: "Disclosures", done: 4, total: 5 },
                    { label: "Secretarial Records", done: 9, total: 10 },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-semibold text-foreground">{item.done}/{item.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: Resolutions + Cap Table + Compliance Deadlines */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Recent Resolutions (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="font-bold text-sm text-foreground">Recent Resolutions</h4>
                  <button
                    type="button"
                    onClick={() => setIsRecordModalOpen(true)}
                    className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                  {resolutions.map((res) => (
                    <div key={res.id} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-foreground">{res.subject}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{res.id} • {res.date}</div>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded",
                          res.status === "Completed" || res.status === "Approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        )}
                      >
                        {res.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shareholding Pattern (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <h4 className="font-bold text-sm text-foreground">Shareholding Pattern</h4>
                  <span className="text-xs text-muted-foreground font-semibold">100% Equity</span>
                </div>
                <div className="h-40 w-full flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={SHAREHOLDING_DATA}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                      >
                        {SHAREHOLDING_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  {SHAREHOLDING_DATA.map((s) => (
                    <div key={s.name} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{s.name}:</span>
                      <span className="font-semibold text-foreground">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Compliance Deadlines & AI Assistant (4 cols) */}
              <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span>AI Governance Assistant</span>
                    </h4>
                  </div>
                  <div className="space-y-1.5 h-32 overflow-y-auto no-scrollbar p-1 rounded-lg bg-muted/20 border text-xs">
                    {aiChatMessages.map((m, i) => (
                      <div
                        key={i}
                        className={cn(
                          "p-2 rounded-lg text-xs",
                          m.sender === "user" ? "bg-blue-600 text-white ml-4" : "bg-background border mr-4 text-foreground shadow-2xs"
                        )}
                      >
                        {m.text}
                      </div>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAiAsk();
                  }}
                  className="flex items-center gap-1.5 pt-2"
                >
                  <input
                    type="text"
                    placeholder="Ask governance questions..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="flex-1 h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                  />
                  <button
                    type="submit"
                    className="h-8 w-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

      {/* Modal: Add Governance Record */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-foreground">Create Governance Record</h3>
              <button
                type="button"
                onClick={() => setIsRecordModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-muted-foreground block mb-1">Record Type</label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                  className="w-full h-8 px-2 rounded-lg border bg-background text-foreground text-xs"
                >
                  <option>Board Resolution</option>
                  <option>Committee Charter</option>
                  <option>Secretarial Audit Finding</option>
                  <option>Shareholder Notice</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-muted-foreground block mb-1">Subject / Resolution Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Appointment of Internal Auditor"
                  value={recordSubject}
                  onChange={(e) => setRecordSubject(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border bg-background text-foreground text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Create Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
