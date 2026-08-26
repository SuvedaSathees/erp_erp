# Magnertia ERP Suite — Architecture & Codebase Guide (`CLAUDE.md`)

> **Executive Reference**: This document is the single source of truth for Claude, Antigravity, and AI agents developing on the **Magnertia ERP Suite (`magnertia-flow`)** — an enterprise-grade ERP system built for Electric Vehicle (EV) manufacturing.

---

## 1. Tech Stack & Infrastructure

| Layer | Technology | Key Details |
| :--- | :--- | :--- |
| **Framework & SSR** | **TanStack Start** + **React 19.2.0** + **Nitro** | Full-stack TSX SSR engine, server-side data loading, Vite integration. |
| **Routing** | **TanStack Router 1.170.16** | File-based routing in `src/routes/`, automatically compiled to `src/routeTree.gen.ts`. |
| **State & Data Fetching** | **TanStack React Query v5** (`@tanstack/react-query`) | Universal client caching, queries & mutations, integrated into `__root.tsx`. |
| **Styling & CSS** | **Tailwind CSS v4.2.1** (`@tailwindcss/vite`) | **CSS-first `@theme inline`** via `src/styles.css`. No `tailwind.config.js`. |
| **UI Primitives** | **shadcn/ui** (`new-york` style) + **Radix UI** | Located in `src/components/ui/`. Re-usable accessible primitives. |
| **Domain Components** | **Magnertia ERP Component Library** | Located in `src/components/erp/` (`AppShell`, `StatCard`, `TreeTable`, `DataTable`, etc.). |
| **Charts & Visuals** | **Recharts 2.15.4** | Donut charts, Bar+Line combo charts, Aging summaries, Area trends. |
| **Interactive Widgets** | **@dnd-kit** (Core, Sortable, Modifiers) | Drag-and-drop customizable executive widgets system (`src/widgets/`). |
| **Database & ORM** | **Prisma 7.8.0** (`@prisma/adapter-pg` / `pg`) + **MongoDB 7.5.0** | PostgreSQL schema in `prisma/schema.prisma`. MongoDB dual-mode in `src/lib/mongodb.server.ts`. |
| **Server Functions** | **`*.server.ts`** | Server-side query/mutation functions located in `src/lib/*Fns.server.ts`. |
| **Icons & Notifications** | **Lucide React** + **Sonner 2.0.7** (`toast`) | Universal icons and unified toast notifications. |
| **Export Engines** | **jsPDF** + **jspdf-autotable** + **xlsx (SheetJS)** | Client/server PDF and Excel report generation. |
| **Build & Dev Runtime** | **Vite 8.0.16** / **Bun** / **Node 22** | Fast development server (`npm run dev` or `bun dev` on port 3000). |

---

## 2. Directory Structure Map

```
erp_erp/
├── .claude/                     # Claude configuration & launch settings
├── .lovable/                    # Lovable platform sync configs
├── prisma/
│   └── schema.prisma            # PostgreSQL Prisma schema (General Ledger, Journals, Accounts, etc.)
├── src/
│   ├── components/
│   │   ├── erp/                 # Domain ERP UI: AppShell, StatCard, DataTable, TreeTable, TabBars, Badges
│   │   ├── ui/                  # shadcn/ui primitives (Button, Dialog, Dropdown, Tabs, Card, Select, etc.)
│   │   ├── automation-development/     # Module-specific complex view components
│   │   ├── lean-manufacturing/
│   │   ├── mass-production-readiness/
│   │   ├── pilot-production/
│   │   └── robotics-integration/
│   ├── hooks/                   # Shared React hooks (use-mobile, use-toast, theme hooks)
│   ├── lib/
│   │   ├── *Fns.server.ts       # Server-side business logic & DB operations (SSR safe)
│   │   ├── mongodb.server.ts    # MongoDB connector with automatic mock fallback (mock_gl_db.json)
│   │   ├── prisma.server.ts     # Prisma PostgreSQL client instance
│   │   ├── mock-data.ts         # Master mock datasets, constants & currency/number formatters
│   │   ├── mock_gl_db.json      # In-memory JSON database for offline mock mode
│   │   ├── chartColors.ts       # Centralized chart color tokens
│   │   └── utils.ts             # Tailwind clsx + twMerge helper
│   ├── routes/                  # 289+ file-based routes for all ERP divisions
│   │   ├── __root.tsx           # Root shell layout with QueryClientProvider, Toaster, Meta, Fonts
│   │   ├── index.tsx            # Executive Dashboard (Financial Management Overview)
│   │   ├── management.finance.* # Finance & Accounting (Ledger, Cash, AP, AR, Budget, Assets, etc.)
│   │   ├── management.administration-management.* # Admin, Users, Roles, Departments, Audit
│   │   ├── management.crm-management.*            # CRM, Accounts, Leads, Pipelines, Support
│   │   ├── management.hrm-management.*            # HRM, Payroll, Attendance, Performance, Workforce
│   │   ├── development.research-innovation.*     # R&D, Ideation, POC, TRL, Patents, Scouting
│   │   ├── development.product-development.*      # Product Eng, CAD, Firmware, Cloud, IoT, PRD
│   │   ├── development.manufacturing-development.*# Factory Layout, APQP, Lean, Automation, Robotics
│   │   ├── development.business-development.*     # Business Models, Go-To-Market, Scaling, Channels
│   │   └── development.ip-development.*           # IP & Patent Lifecycle Management
│   ├── services/                # 116+ Client API service boundaries matching sequence diagrams
│   │   ├── apiClient.ts         # Central mock/live API seam (VITE_API_MODE switch)
│   │   ├── financialManagementService.ts # Orchestrator fanning out domain calls via Promise.all
│   │   ├── *Service.ts          # Domain services (generalLedgerService, accountsPayableService, etc.)
│   │   ├── types.ts             # Global domain types, queries, and module-scoped enums
│   │   └── index.ts             # Barrel exports
│   ├── widgets/                 # Customizable Executive Dashboard Widget Engine
│   │   ├── components/          # Widget container, drag handles, settings dialogs
│   │   ├── content/             # Individual widget view implementations
│   │   ├── defaults.ts          # Default widget layouts and system presets
│   │   ├── grid.ts              # Drag-and-drop 12-column grid calculations
│   │   ├── registry.tsx         # Central widget registration catalog
│   │   ├── templates.ts         # Pre-configured dashboard templates by role
│   │   └── types.ts             # Widget definitions, themes, metric interfaces
│   ├── router.tsx               # TanStack Router initialization
│   ├── server.ts                # TanStack Start SSR entrypoint & h3 error handler
│   ├── start.ts                 # Client entry initialization
│   └── styles.css               # Design system root tokens, OKLCH palette, Tailwind v4 theme
├── AGENTS.md                    # Lovable sync safety rules (NEVER rewrite pushed git history)
├── architecture.md              # Deep architectural specification and sequence diagram maps
├── design-system.md             # Visual design tokens, typography, chart conventions
├── package.json                 # Dependency manifests and scripts
├── tsconfig.json                # TypeScript compiler config with `@/*` aliases
└── vite.config.ts               # Vite configuration with TanStack Start & Tailwind plugins
```

---

## 3. Brand Identity & Design System

### 3.1 Color Palette (Strict Navy & Warm Beige — No Violet)
The brand identity is **Navy Blue + Soft Beige + EV Green accents**. Early design drafts with purple/violet were deliberately replaced with the Magnertia brand palette:

*   **Primary Brand Blue (`--primary`, `--blue-brand`)**: `oklch(0.38 0.14 245)` / `#0A3C75` — Active sidebar items, primary buttons, major KPI icons, revenue chart series.
*   **Soft Brand Accent (`--secondary`, `--blue-soft`)**: `oklch(0.94 0.02 245)` / `#E2EDF7` — Chip backgrounds, table header fills, subtle hover highlights.
*   **Background Canvas (`--background`, `--beige-bg`)**: `oklch(0.985 0.006 85)` / `#FAF9F5` — Soft warm enterprise background.
*   **Muted Neutral (`--muted`, `--beige-muted`)**: `oklch(0.955 0.01 85)` / `#F3EFE7` — Filter toolbars, subsection containers.
*   **Card Surface (`--card`)**: `oklch(1 0 0)` / `#FFFFFF` — Elevated cards with `--shadow-card`.
*   **Sidebar (`--sidebar`)**: `#06101E` — Deep space navy blue for high-contrast navigation.
*   **Semantic Status Tokens**:
    *   **Success (`--success`)**: `oklch(0.68 0.17 152)` / `#22C55E` (Paid, Active, Optimal, Positive growth).
    *   **Warning (`--warning`)**: `oklch(0.78 0.16 70)` / `#F59E0B` (Pending, Due Soon, Degraded).
    *   **Destructive (`--destructive`)**: `oklch(0.62 0.22 25)` / `#EF4444` (Overdue, Canceled, Offline, Error).
    *   **Info / Neutral**: Reused via secondary blue or muted beige.

### 3.2 Typography & Numeric Alignment
*   **Primary Typeface**: **Inter** (`--font-sans`, `--font-display`), loaded globally via Google Fonts.
*   **Numeric Data**: Never load a secondary monospace font. Always apply the `.tabular` utility (`font-variant-numeric: tabular-nums`) to financial figures, counts, dates, and percentages to maintain rigid grid alignment.
*   **Headings**: Globally set with `letter-spacing: -0.015em`.

### 3.3 Reusable ERP UI Components (`src/components/erp/`)
*   **`<AppShell>`**: Top-level page container providing the responsive dark navy sidebar, breadcrumbs, search bar, profile controls, action buttons, and contextual multi-level tab navigation.
*   **`<StatCard>` / `<KpiCard>`**: Standardized KPI metric containers displaying title, primary formatted value, delta trend badges, sparklines, or comparison subtitles.
*   **`<DataTable>`**: High-density responsive data table with sorting, search, column formatting, and auto-fallback to mobile card lists on narrow viewports.
*   **`<TreeTable>`**: Hierarchical expandable table (used extensively in General Ledger Chart of Accounts, BOM structures, and Department hierarchies).
*   **`<PaginationFooter>`**: Reusable footer with page index buttons, range selector, and total record count. Always pass the honest filtered length.
*   **`<StatusBadge>` & `<TypeBadge>`**: Unified semantic badges backed by five canonical tones (`success`, `warning`, `destructive`, `muted`, `info`).

---

## 4. Architectural Patterns & Data Flow

### 4.1 Sequence-Diagram Orchestration Pattern
The architecture strictly mirrors backend enterprise microservice sequence diagrams:

```
[UI / Route Component]
       │ (1) calls useQuery / useMutation
       ▼
[Orchestrator Service: financialManagementService.ts]
       │ (2) Promise.all() parallel fan-out (mirrors diagram 'par' fragments)
       ├──► revenueService.calculateTotalRevenue()
       ├──► expenseService.calculateTotalExpenses()
       ├──► cashBankService.fetchCashBalance()
       ├──► generalLedgerService.calculateNetProfit()
       └──► analyticsEngineService.calculateCurrentRatio()
       │ (3) assembles combined response payload
       ▼
[apiClient.ts (Mock / Live Seam)]
       ├── if VITE_API_MODE === "live"  --> fetch('/api/...')
       └── else                         --> Synthetic delay (150ms) + mock data resolver
```

1.  **Routes never import mock data directly**: A route only invokes orchestrators or domain services (e.g., `loadDashboardData()`, `generalLedgerService.fetchLatestTransactions()`).
2.  **Shared Orchestrator**: `financialManagementService.ts` is the shared orchestrator across all financial sub-modules (Dashboard, Transactions, General Ledger, Payables, Receivables).
3.  **Parallel Execution**: Orchestrator functions use `Promise.all` matching sequence diagram `par` blocks to preserve parallel network execution characteristics.

### 4.2 Mock / Live API Seam (`src/services/apiClient.ts`)
```ts
const USE_MOCK = import.meta.env.VITE_API_MODE !== "live";
const MOCK_LATENCY_MS = 150;

export async function apiRequest<T>(endpoint: string, mockResolver: () => T): Promise<T> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));
    return mockResolver();
  }
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`Request to ${endpoint} failed: ${res.status}`);
  return res.json() as Promise<T>;
}
```
*   Switching from mock to live requires zero changes to route components or service signatures — simply deploy the REST API and set `VITE_API_MODE=live`.

### 4.3 Data Fetching & Mutation Protocol
*   **Queries (Reads)**:
    ```tsx
    const { data, isLoading } = useQuery({
      queryKey: ["financial-management", "dashboard", fiscalYear, companyId],
      queryFn: () => loadDashboardData({ fiscalYear, companyId }),
    });
    ```
*   **Mutations (Writes)**:
    ```tsx
    const mutation = useMutation({
      mutationFn: (payload: UpdateTransactionPayload) => transactionService.updateTransaction(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        toast.success("Transaction updated successfully");
      },
      onError: (err) => {
        toast.error("Failed to update transaction");
      }
    });
    ```
    *   **Rule**: Never mutate component state locally to simulate writes. Always invalidate queries via `queryClient.invalidateQueries` and allow the refetched data to serve as the single source of truth.

### 4.4 Module-Scoped Status Unions
*   Do not merge distinct business status types into a generic enum.
*   Accounts Payable uses `InvoiceStatus = "Paid" | "Due Soon" | "Overdue" | "Canceled"`.
*   Accounts Receivable uses `ReceivableInvoiceStatus = "Paid" | "Partially Paid" | "Due Soon" | "Overdue" | "Canceled" | "Credit Memo"`.
*   Keep domain types strictly scoped in `src/services/types.ts`.

### 4.5 Stub vs. Build Convention
*   **Build what the sequence diagram specifies**: If a button (e.g., "+ New Invoice" in Accounts Payable) has a corresponding sequence flow (`Create Vendor Invoice -> Save Invoice -> Insert Record`), build the complete Dialog form, mutation handler, and cache invalidation.
*   **Stub what has no defined backend flow**: If a button (e.g., "+ New Transaction" in general transactions list) has no defined sequence diagram flow, render the UI with an intentional disabled state or informational toast (`toast.info("Create workflow scheduled for Phase 2")`).

---

## 5. Major ERP Divisions & Route Architecture

The suite is organized into 9 primary operational divisions with 289+ interactive views:

### 1. Administration & Governance (`/administration/*`, `/management/administration-management/*`)
*   **Organization Structure**: Multi-company hierarchy, branch networks, department management.
*   **Identity & Access**: User provisioning, RBAC roles, permission matrices, approval limits.
*   **Compliance & Audit**: System audit trails, document control lifecycle, policy governance, master data records.

### 2. Financial Management & Accounting (`/management/finance/*`, `/ledger`, `/expenses`, `/revenue`)
*   **General Ledger (`/management/finance/ledger`)**: Multi-level Chart of Accounts (`TreeTable`), automated journal entries, trial balance reconciliation.
*   **Cash & Bank Management (`/management/finance/cash-bank`)**: Real-time treasury balances, liquidity forecasting, multi-account bank reconciliation.
*   **Accounts Payable (`/management/finance/payables`)**: Vendor invoice processing, 3-way matching, approval workflows, aging buckets (0-30, 31-60, 61-90, 90+ days), payment batches.
*   **Accounts Receivable (`/management/finance/receivables`)**: Customer invoicing, collections management, dunning reminders, credit memos, aging donut summaries.
*   **Budgeting & Cost Centers (`/management/finance/budgeting`, `cost-centers`)**: FY budget allocations, variance analysis (Actual vs. Budget), divisional cost center tracking.
*   **Fixed Assets (`/management/finance/assets`)**: Asset registers, automated depreciation schedules (Straight-line, WDV), disposals, maintenance tracking.
*   **Taxation & Compliance (`/management/finance/tax`)**: GST/VAT filing, TDS ledgers, tax liability forecasting.
*   **Financial Reports (`/management/finance/reports`)**: Balance Sheet, P&L Statement, Cash Flow Statement, exportable to PDF/Excel.

### 3. CRM & Sales Operations (`/management/crm-management/*`, `/management/sales-management/*`)
*   **Accounts & Contacts**: 360-degree customer directory, relationship hierarchies, communications log.
*   **Lead & Opportunity Pipelines**: Visual sales funnels, stage tracking, win probability, deal value forecasting.
*   **Quotations & Customer Orders**: Order configuration, discount matrices, order status tracking, dispatch schedules.
*   **Customer Success & Support**: Ticket management, SLA tracking, complaint escalation, customer satisfaction (CSAT) scoring.

### 4. Human Resource Management (`/management/hrm-management/*`)
*   **Workforce Planning & Recruitment**: Headcount requisitions, applicant tracking (ATS), candidate interviews.
*   **Employee Master & Onboarding**: Digital employee records, document verification, asset handover.
*   **Time, Attendance & Leave**: Biometric integration feeds, shift scheduling, multi-tier leave approval policies.
*   **Payroll & Compensation**: Salary structures, allowances, tax deductions, payslip generation, payroll disbursement.
*   **Performance & Appraisal**: Goal tracking (OKRs/KPIs), 360-degree reviews, competency matrices.
*   **Learning & Welfare**: Training programs, skill certifications, employee wellness, travel & expense claims.

### 5. Research & Innovation (`/development/research-innovation/*`)
*   **Opportunity Discovery & Ideation**: Market gap identification, internal idea submission, community voting.
*   **Problem & Feasibility Studies**: Technical feasibility assessments, commercial viability scoring, risk registers.
*   **Proof of Concept (POC) & Prototyping**: Rapid validation sprints, test telemetry, design thinking workshops.
*   **Technology Scouting & TRL**: Emerging tech surveillance, Technology Readiness Level (TRL 1–9) milestone audits.
*   **Innovation Portfolio**: R&D investment allocation, pipeline health, milestone governance.

### 6. Product Engineering & Development (`/development/product-development/*`)
*   **Strategy & Roadmaps**: Multi-year vehicle platform roadmaps, Product Requirement Documents (PRDs).
*   **Hardware Engineering**: Mechanical CAD specifications, Electrical harnesses, Power electronics, Industrial design.
*   **Embedded Systems & Firmware**: Battery Management System (BMS) firmware, motor controllers, IoT telemetry modules.
*   **Digital Platform**: Vehicle companion mobile apps, cloud telemetry ingest, cybersecurity hardening, PLM release cycles.

### 7. Manufacturing & Factory Operations (`/development/manufacturing-development/*`, `/manufacturing-development/*`)
*   **Industrial Engineering**: Factory layout simulation, assembly line balancing, ergonomics, fixture and jig tooling development.
*   **Quality Planning (APQP / PPAP)**: Advanced Product Quality Planning, Process Flow Diagrams, Process FMEA (PFMEA), Control Plans.
*   **Manufacturing Execution**: Standard Operating Procedures (SOPs), digital work instructions with 3D/image aids.
*   **Smart Factory & Automation**: Industrial robotics integration, PLC automation loops, OEE monitoring, Lean 5S / Six Sigma tracking.
*   **Production Readiness**: Pilot batch runs, process validation protocols, Mass Production Readiness (MPR) sign-off.

### 8. IP & Patent Management (`/development/ip-development/*`)
*   **Patent Lifecycle**: Invention disclosure submissions, prior art search logs, patent application filing, patent grant tracking.
*   **IP Portfolio**: Trademark & copyright registers, IP valuation, renewal fee schedules.

### 9. Business & Strategic Development (`/development/business-development/*`)
*   **Market Strategy**: Business model canvas, revenue models, value proposition mapping, pricing strategies.
*   **Ecosystem Expansion**: Distributor partnerships, dealership networks, franchising models, international export development.
*   **Corporate Finance & Investor Relations**: Fundraising rounds, cap table management, investor reporting.

---

## 6. Widget Customization Engine (`src/widgets/`)

Magnertia ERP features a modular, role-tailored Executive Widget Engine:

*   **Registry (`src/widgets/registry.tsx`)**: Central catalog of available widgets (Revenue Trend, Expense Donut, Cash Liquidity, Open Payables, AR Aging, OEE Monitor, TRL Status, etc.).
*   **12-Column Responsive Grid (`src/widgets/grid.ts`)**: Built with `@dnd-kit`, supporting responsive column spans (`w-full`, `sm:col-span-6`, `lg:col-span-4`, `col-span-12`), customizable heights, and drag-and-drop reordering.
*   **Widget Theme Tokens**: Supports 4 palette accents (`default` Navy Blue, `blue` Electric Blue, `green` EV Emerald, `purple` Deep Indigo).
*   **Persistence (`widgetPreferencesService.ts` / `widgetPreferencesFns.server.ts`)**: Saves customized layouts to user preferences in MongoDB/PostgreSQL with instant in-memory fallback.

---

## 7. Database & Backend Integration

### 7.1 PostgreSQL with Prisma (`prisma/schema.prisma`)
*   Manages core relational models: `Account`, `Journal`, `JournalLine`, `FiscalYear`, `Company`, `CostCenter`, `Vendor`, `Customer`, `Invoice`, `Payment`, `AuditLog`.
*   Generated client located at `src/generated/prisma`.
*   Adapter configuration in `src/lib/prisma.server.ts` uses `@prisma/adapter-pg`.

### 7.2 MongoDB & In-Memory JSON Dual Mode (`src/lib/mongodb.server.ts`)
*   Handles document-oriented and rapidly evolving feature collections (R&D ideas, innovation portfolios, scouting records, widget configurations).
*   **Automatic Fallback**: If `MONGODB_URI` is not supplied, the server automatically reads and writes to `src/lib/mock_gl_db.json` in real time, guaranteeing full offline developer functionality without external database dependencies.

---

## 8. Development & Workflow Guidelines

### 8.1 Scripts & Commands
```bash
# Start development server on http://localhost:3000
npm run dev
# or: bun dev

# Build production bundle
npm run build

# Typecheck and lint codebase
npm run lint

# Format code with Prettier
npm run format
```

### 8.2 Adding a New Route
1.  Create a new file in `src/routes/` following TanStack Router conventions (e.g., `src/routes/development.product-development.telemetry.tsx`).
2.  Import and wrap the layout with `<AppShell>`:
    ```tsx
    import { createFileRoute } from "@tanstack/react-router";
    import { AppShell } from "@/components/erp/AppShell";
    import { StatCard } from "@/components/erp/StatCard";

    export const Route = createFileRoute("/development/product-development/telemetry")({
      component: TelemetryPage,
    });

    function TelemetryPage() {
      return (
        <AppShell
          title="Vehicle Telemetry"
          breadcrumb={[{ label: "Product Development" }, { label: "Telemetry" }]}
          description="Real-time IoT data and CAN bus telemetry ingest"
        >
          {/* Page contents */}
        </AppShell>
      );
    }
    ```
3.  TanStack Router automatically regenerates `src/routeTree.gen.ts`.

### 8.3 Adding a New Domain Service
1.  Define domain models, query parameters, and response types in `src/services/types.ts`.
2.  Create `src/services/<domain>Service.ts` exporting plain async functions.
3.  Wrap all calls in `apiRequest("/api/...", mockResolver)`.
4.  Export the service via `src/services/index.ts`.
5.  If this is part of Financial Management, expose a dedicated loader method in `src/services/financialManagementService.ts`.

---

## 9. Critical Rules & Guardrails

1.  **Lovable Git History Guardrail**: NEVER force push, squash, or rebase git commits that have already been pushed to the remote repository. This project syncs with Lovable; rewriting history breaks synchronization.
2.  **Color Integrity**: NEVER use purple or violet in UI components. Use the official Magnertia Navy Blue (`#0A3C75`), Beige (`#FAF9F5`), and EV Green (`#22C55E`) tokens.
3.  **Token-First Styling**: Never hardcode arbitrary hex codes inline (e.g., `style={{ color: "#123456" }}`). Use Tailwind design tokens (`text-primary`, `bg-secondary`, `border-border`).
4.  **No Direct Mock Imports in Routes**: Routes must always consume data via `src/services/*` through TanStack Query (`useQuery`), never by directly importing `mock-data.ts`.
5.  **Numeric Alignment**: Always append the `.tabular` class when displaying monetary amounts, percentages, and serial numbers.
6.  **Pagination Truth**: Always pass the genuine filtered count to `<PaginationFooter total={...} />`. Do not fake or hardcode mismatched pagination totals.
7.  **Preserve Invariants**: Ensure debit and credit sides balance across accounting datasets and trial balances.
