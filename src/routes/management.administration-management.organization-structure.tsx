import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AdminManagementTabBar } from "@/components/erp/AdminManagementTabBar";
import { cn } from "@/lib/utils";
import {
  FolderTree,
  Building2,
  Layers,
  Briefcase,
  Users,
  UserCheck,
  ShieldCheck,
  Sliders,
  MapPin,
  Landmark,
  Award,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Search,
  CheckCircle2,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Calendar,
  Save,
  Send,
  MoreHorizontal,
  GitFork,
  X,
  FileSpreadsheet,
  FileCheck,
  Check,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/management/administration-management/organization-structure")({
  head: () => ({
    meta: [
      { title: "Organization Structure · Magnertia ERP" },
      {
        name: "description",
        content: "Manage complete organizational architecture from legal entity to reporting, authority, RACI matrix, locations and governance.",
      },
    ],
  }),
  component: OrganizationStructurePage,
});

interface OrgTreeNode {
  id: string;
  name: string;
  count?: number;
  icon?: string;
  children?: OrgTreeNode[];
}

function OrganizationStructurePage() {
  const [activeTab, setActiveTab] = useState<string>("Hierarchy");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Master Form State
  const [masterForm, setMasterForm] = useState({
    structureId: "ORG-STR-2024-0001",
    formCode: "ORG-FRM-2024",
    version: "1.0",
    status: "Active",
    effectiveFrom: "2024-04-01",
    effectiveTo: "2029-03-31",
    orgName: "Magnertia Global Technologies",
    orgCode: "MAG-GLOBAL",
    legalEntity: "Magnertia Global Pvt. Ltd.",
    parentOrg: "Magnertia Group",
    orgType: "Corporate",
    orgLevel: "Level 1 - Corporate",
    orgHead: "Rajeev Malhotra",
    operatingModel: "Functional",
    vision: "To be a global leader in technology-driven products and services that create sustainable value for customers, employees, and society.",
    mission: "We innovate, build and deliver technology solutions that empower businesses and improve lives.",
    objectives: "• Drive innovation and digital transformation\n• Deliver operational excellence\n• Build global capabilities\n• Create sustainable growth and value",
  });

  // Business Units State (Fully Interactive)
  const [businessUnits, setBusinessUnits] = useState([
    { code: "BU-PROD", name: "Product Business", head: "Amit Desai", loc: "Bengaluru HQ", count: 1024, cc: "CC-BU-PROD", pc: "PC-BU-PROD", status: "Active" },
    { code: "BU-TECH", name: "Technology Business", head: "Vikram Singh", loc: "Hyderabad Tech Center", count: 856, cc: "CC-BU-TECH", pc: "PC-BU-TECH", status: "Active" },
    { code: "BU-SRV", name: "Services Business", head: "Sandeep Iyer", loc: "Noida Regional Hub", count: 732, cc: "CC-BU-SRV", pc: "PC-BU-SRV", status: "Active" },
    { code: "BU-INTL", name: "International Business", head: "Arjun Mehta", loc: "Singapore Hub", count: 644, cc: "CC-BU-INTL", pc: "PC-BU-INTL", status: "Active" },
  ]);

  // Functions State (Fully Interactive)
  const [functionsList, setFunctionsList] = useState([
    { name: "Finance & Accounting", lead: "Anita Verma (CFO)", count: 186, depts: 3, budget: "₹ 14.5 Cr", theme: "border-amber-500/30 bg-amber-500/5" },
    { name: "Operations & Quality", lead: "Sandeep Iyer (COO)", count: 356, depts: 4, budget: "₹ 38.0 Cr", theme: "border-emerald-500/30 bg-emerald-500/5" },
    { name: "R&D & Engineering", lead: "Vikram Singh (CTO)", count: 298, depts: 5, budget: "₹ 42.5 Cr", theme: "border-blue-500/30 bg-blue-500/5" },
    { name: "Human Resources", lead: "Meera Nair (CHRO)", count: 154, depts: 3, budget: "₹ 8.2 Cr", theme: "border-rose-500/30 bg-rose-500/5" },
    { name: "Sales & Marketing", lead: "Arjun Mehta (CSO)", count: 412, depts: 4, budget: "₹ 24.0 Cr", theme: "border-orange-500/30 bg-orange-500/5" },
    { name: "Manufacturing", lead: "Ramesh Sharma (VP Mfg)", count: 864, depts: 3, budget: "₹ 62.0 Cr", theme: "border-indigo-500/30 bg-indigo-500/5" },
    { name: "Supply Chain", lead: "Kavita Rao (VP SCM)", count: 404, depts: 3, budget: "₹ 31.5 Cr", theme: "border-teal-500/30 bg-teal-500/5" },
    { name: "Legal & Governance", lead: "Pooja Hegde (GC)", count: 582, depts: 2, budget: "₹ 6.8 Cr", theme: "border-purple-500/30 bg-purple-500/5" },
  ]);

  // Corporate Governance & Steering Committees State
  const [departmentsList, setDepartmentsList] = useState([
    { code: "COMM-AUD-01", name: "Board Audit & Risk Oversight Committee", fn: "Statutory Audit & Risk Governance", head: "Justice R. Swaminathan", count: 5, cc: "CC-GOV-AUD", status: "Active" },
    { code: "COMM-NRC-02", name: "Nomination & Executive Remuneration Committee", fn: "CXO Appraisal & Board Appointments", head: "Meera Nair (CHRO)", count: 4, cc: "CC-GOV-NRC", status: "Active" },
    { code: "COMM-ESG-03", name: "Sustainability, ESG & Net-Zero Council", fn: "Clean EV Infra & Decarbonization", head: "Dr. Anand Murthy", count: 6, cc: "CC-GOV-ESG", status: "Active" },
    { code: "COMM-CAP-04", name: "Capex & M&A Steering Council", fn: "Capital Allocation & Plant Expansion", head: "Anita Verma (CFO)", count: 5, cc: "CC-GOV-CAP", status: "Active" },
    { code: "COMM-TECH-05", name: "Technology & AI Ethics Advisory Board", fn: "Firmware Safety & Cloud Architecture", head: "Vikram Singh (CTO)", count: 7, cc: "CC-GOV-TECH", status: "Active" },
    { code: "COMM-ETH-06", name: "Ethics, Compliance & POSH Redressal Council", fn: "Corporate Whistleblower & Conduct", head: "Pooja Hegde (GC)", count: 4, cc: "CC-GOV-ETH", status: "Active" },
  ]);

  // Positions State (Fully Interactive)
  const [positionsList, setPositionsList] = useState([
    { level: "Level 1", grade: "E-10", role: "Chief Executive Officer / Managing Director", total: 1, filled: 1, open: 0, auth: "Board of Directors" },
    { level: "Level 2", grade: "E-09", role: "CXOs (CFO, COO, CTO, CHRO, CSO)", total: 5, filled: 5, open: 0, auth: "CEO & Board" },
    { level: "Level 3", grade: "E-08", role: "Executive Vice President / VP", total: 14, filled: 12, open: 2, auth: "CXO" },
    { level: "Level 4", grade: "M-07", role: "Director / Principal Architect", total: 48, filled: 44, open: 4, auth: "VP / Head of Unit" },
    { level: "Level 5", grade: "M-06", role: "Senior Manager / Lead Engineer", total: 186, filled: 172, open: 14, auth: "Department Manager" },
    { level: "Level 6", grade: "P-05", role: "Senior Associate / Specialist", total: 840, filled: 790, open: 50, auth: "Reporting Manager" },
    { level: "Level 7", grade: "P-04", role: "Associate / Analyst / Technician", total: 2162, filled: 2020, open: 142, auth: "Talent Acquisition" },
  ]);

  // Corporate Legal Entities & Global Subsidiaries State
  const [locationsList, setLocationsList] = useState([
    { name: "Magnertia Global Technologies Pvt. Ltd.", type: "Parent Operating Company (India ROC)", count: 2150, area: "Bengaluru Corp HQ", head: "Rajeev Malhotra (CEO)", status: "Active" },
    { name: "Magnertia Americas Inc.", type: "Wholly-Owned Subsidiary (Delaware, USA)", count: 480, area: "Silicon Valley Hub", head: "Amit Desai (President NA)", status: "Active" },
    { name: "Magnertia European Mobility GmbH", type: "European Operations & Engineering (Munich)", count: 390, area: "Bavaria Tech Campus", head: "Vikram Singh (Director)", status: "Active" },
    { name: "Magnertia APAC Pte. Ltd.", type: "Regional Holding & Treasury (Singapore ACRA)", count: 230, area: "Marina Bay Financial Centre", head: "Arjun Mehta (MD APAC)", status: "Active" },
  ]);

  // Calculated Metrics
  const calculatedTotalEmployees = useMemo(() => {
    return businessUnits.reduce((acc, bu) => acc + Number(bu.count), 0).toLocaleString();
  }, [businessUnits]);

  // Selected Unit State for Inspector (Interactive)
  const [selectedUnit, setSelectedUnit] = useState({
    name: "Product Business",
    code: "BU-PROD",
    type: "Business Unit",
    head: "Amit Desai",
    parentUnit: "Business Units",
    employees: "1,024",
    location: "Multiple Locations",
    costCentre: "CC-BU-PROD",
    profitCentre: "PC-BU-PROD",
    status: "Active",
  });

  // Modals State
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showAddPositionModal, setShowAddPositionModal] = useState(false);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);

  // New Unit Form State
  const [newUnitForm, setNewUnitForm] = useState({
    code: "",
    name: "",
    head: "Amit Desai",
    loc: "Bengaluru HQ",
    count: "100",
    cc: "CC-NEW",
    pc: "PC-NEW",
  });

  // New Dept Form State
  const [newDeptForm, setNewDeptForm] = useState({
    code: "",
    name: "",
    fn: "Finance",
    head: "Rohan Kapoor",
    count: "25",
    cc: "CC-NEW-DEPT",
  });

  // New Position Form State
  const [newPositionForm, setNewPositionForm] = useState({
    level: "Level 8",
    grade: "P-03",
    role: "",
    total: "10",
    filled: "8",
    open: "2",
    auth: "Talent Acquisition",
  });

  // New Location Form State
  const [newLocationForm, setNewLocationForm] = useState({
    name: "",
    type: "Regional Office",
    count: "50",
    area: "15,000 sq ft",
    head: "Rajeev Malhotra",
  });

  // Hierarchy Tree structure matching screenshot
  const hierarchyTreeData: OrgTreeNode = {
    id: "root",
    name: "Magnertia Global Technologies (Corporate)",
    children: [
      {
        id: "corp-mgmt",
        name: "Corporate Management",
        count: 6,
        icon: "users",
      },
      {
        id: "bu-group",
        name: "Business Units",
        count: 4,
        icon: "building",
        children: [
          { id: "bu-prod", name: "Product Business", count: 1024 },
          { id: "bu-tech", name: "Technology Business", count: 856 },
          { id: "bu-srv", name: "Services Business", count: 732 },
          { id: "bu-intl", name: "International Business", count: 644 },
        ],
      },
      {
        id: "func-group",
        name: "Functions",
        count: 8,
        icon: "layers",
        children: [
          { id: "fn-fin", name: "Finance", count: 186 },
          { id: "fn-hr", name: "Human Resources", count: 154 },
          { id: "fn-sls", name: "Sales", count: 412 },
          { id: "fn-mkt", name: "Marketing", count: 198 },
          { id: "fn-ops", name: "Operations", count: 356 },
          { id: "fn-rd", name: "R&D", count: 298 },
          { id: "fn-mfg", name: "Manufacturing", count: 864 },
          { id: "fn-scm", name: "Supply Chain", count: 404 },
        ],
      },
      {
        id: "loc-group",
        name: "Locations",
        count: 4,
        icon: "map",
        children: [
          { id: "loc-hq", name: "Headquarters", count: 1256 },
          { id: "loc-dc", name: "Development Centre", count: 856 },
          { id: "loc-mu", name: "Manufacturing Unit", count: 872 },
          { id: "loc-ro", name: "Regional Offices", count: 272 },
        ],
      },
    ],
  };

  const handleSelectNode = (name: string, count?: number) => {
    setSelectedUnit({
      name: name,
      code: name.substring(0, 3).toUpperCase() + "-" + (count || "001"),
      type: name.includes("Business") ? "Business Unit" : name.includes("Centre") || name.includes("Headquarters") ? "Location" : "Function",
      head: name.includes("Product") ? "Amit Desai" : name.includes("Technology") || name.includes("R&D") ? "Vikram Singh" : name.includes("Finance") ? "Anita Verma" : "Rajeev Malhotra",
      parentUnit: name.includes("Business") ? "Business Units" : "Corporate",
      employees: count ? count.toLocaleString() : "150",
      location: "Multiple Locations",
      costCentre: "CC-" + name.substring(0, 4).toUpperCase(),
      profitCentre: "PC-" + name.substring(0, 4).toUpperCase(),
      status: "Active",
    });
  };

  return (
    <AppShell
      title="Organization Structure"
      breadcrumb="Management > Administration Management > Organization Structure"
      tabs={<AdminManagementTabBar />}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* ========================================================================= */}
        {/* SECTION 1: ORGANIZATION STRUCTURE MASTER FORM                            */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
          {/* Header Row with Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              <span className="text-primary font-bold">1.</span> Organization Structure Master
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("Hierarchy");
                  showNotification("Switched to Org Hierarchy preview.");
                }}
                className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-background px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <FolderTree className="h-3.5 w-3.5" />
                Preview Chart
              </button>

              <button
                type="button"
                onClick={() => setShowValidationModal(true)}
                className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-background px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Validate Structure
              </button>

              <button
                type="button"
                onClick={() => showNotification("Organization Structure record saved.")}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </button>

              <button
                type="button"
                onClick={() => {
                  setMasterForm((prev) => ({ ...prev, status: "Active (Approved)" }));
                  showNotification("Organization Structure submitted and approved.");
                }}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                Submit for Approval
              </button>

              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                title="Export Package"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="space-y-3.5 text-xs">
            {/* Row 1: ID, Form Code, Version, Status, Effective From, Effective To */}
            <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Organization Structure ID</label>
                <div className="mt-1 font-mono font-semibold text-foreground bg-muted/30 border border-border rounded-lg px-2.5 py-1.5 text-xs">
                  {masterForm.structureId}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Form Code</label>
                <div className="mt-1 font-mono font-semibold text-foreground bg-muted/30 border border-border rounded-lg px-2.5 py-1.5 text-xs">
                  {masterForm.formCode}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Version</label>
                <div className="mt-1 font-mono font-semibold text-foreground bg-muted/30 border border-border rounded-lg px-2.5 py-1.5 text-xs">
                  {masterForm.version}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Status</label>
                <select
                  value={masterForm.status}
                  onChange={(e) => setMasterForm({ ...masterForm, status: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Effective From</label>
                <input
                  type="date"
                  value={masterForm.effectiveFrom}
                  onChange={(e) => setMasterForm({ ...masterForm, effectiveFrom: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Effective To</label>
                <input
                  type="date"
                  value={masterForm.effectiveTo}
                  onChange={(e) => setMasterForm({ ...masterForm, effectiveTo: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Row 2: Org Name, Org Code, Legal Entity, Parent Org, Org Type, Org Level */}
            <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Organization Name *</label>
                <input
                  type="text"
                  value={masterForm.orgName}
                  onChange={(e) => setMasterForm({ ...masterForm, orgName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Organization Code *</label>
                <input
                  type="text"
                  value={masterForm.orgCode}
                  onChange={(e) => setMasterForm({ ...masterForm, orgCode: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Legal Entity *</label>
                <select
                  value={masterForm.legalEntity}
                  onChange={(e) => setMasterForm({ ...masterForm, legalEntity: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Magnertia Global Pvt. Ltd.">Magnertia Global Pvt. Ltd.</option>
                  <option value="Magnertia Tech Inc.">Magnertia Tech Inc.</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Parent Organization</label>
                <select
                  value={masterForm.parentOrg}
                  onChange={(e) => setMasterForm({ ...masterForm, parentOrg: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Magnertia Group">Magnertia Group</option>
                  <option value="None">None (Root Holding)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Organization Type *</label>
                <select
                  value={masterForm.orgType}
                  onChange={(e) => setMasterForm({ ...masterForm, orgType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Corporate">Corporate</option>
                  <option value="Business Unit">Business Unit</option>
                  <option value="Division">Division</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Organization Level *</label>
                <select
                  value={masterForm.orgLevel}
                  onChange={(e) => setMasterForm({ ...masterForm, orgLevel: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Level 1 - Corporate">Level 1 - Corporate</option>
                  <option value="Level 2 - Business Unit">Level 2 - Business Unit</option>
                </select>
              </div>
            </div>

            {/* Row 3: Org Head, Operating Model, Business Unit Count, Function Count, Dept Count, Total Employees */}
            <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Organization Head *</label>
                <select
                  value={masterForm.orgHead}
                  onChange={(e) => setMasterForm({ ...masterForm, orgHead: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Rajeev Malhotra">Rajeev Malhotra (CEO)</option>
                  <option value="Anita Verma">Anita Verma (CFO)</option>
                  <option value="Vikram Singh">Vikram Singh (CTO)</option>
                  <option value="Sandeep Iyer">Sandeep Iyer (COO)</option>
                  <option value="Meera Nair">Meera Nair (CHRO)</option>
                  <option value="Arjun Mehta">Arjun Mehta (CSO)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Operating Model *</label>
                <select
                  value={masterForm.operatingModel}
                  onChange={(e) => setMasterForm({ ...masterForm, operatingModel: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Functional">Functional</option>
                  <option value="Matrix">Matrix</option>
                  <option value="Divisional">Divisional</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block flex items-center justify-between">
                  <span>Business Units</span>
                  <span className="text-[9px] font-bold text-purple-600 bg-purple-500/10 px-1 rounded">Calc</span>
                </label>
                <div className="mt-1 text-sm font-semibold font-mono text-primary px-1 py-1">
                  {businessUnits.length} Units
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block flex items-center justify-between">
                  <span>Functions</span>
                  <span className="text-[9px] font-bold text-purple-600 bg-purple-500/10 px-1 rounded">Calc</span>
                </label>
                <div className="mt-1 text-sm font-semibold font-mono text-primary px-1 py-1">
                  {functionsList.length} Functions
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block flex items-center justify-between">
                  <span>Departments</span>
                  <span className="text-[9px] font-bold text-purple-600 bg-purple-500/10 px-1 rounded">Calc</span>
                </label>
                <div className="mt-1 text-sm font-semibold font-mono text-primary px-1 py-1">
                  {departmentsList.length} Depts
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block flex items-center justify-between">
                  <span>Total Headcount</span>
                  <span className="text-[9px] font-bold text-purple-600 bg-purple-500/10 px-1 rounded">Calc</span>
                </label>
                <div className="mt-1 text-sm font-semibold font-mono text-emerald-600 px-1 py-1">
                  {calculatedTotalEmployees} Staff
                </div>
              </div>
            </div>

            {/* Row 4: Strategic Textareas (Vision, Mission, Strategic Objectives) */}
            <div className="grid gap-3.5 sm:grid-cols-3 pt-2 border-t border-border/50">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Organization Vision</label>
                <textarea
                  rows={3}
                  value={masterForm.vision}
                  onChange={(e) => setMasterForm({ ...masterForm, vision: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Organization Mission</label>
                <textarea
                  rows={3}
                  value={masterForm.mission}
                  onChange={(e) => setMasterForm({ ...masterForm, mission: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Strategic Objectives</label>
                <textarea
                  rows={3}
                  value={masterForm.objectives}
                  onChange={(e) => setMasterForm({ ...masterForm, objectives: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed font-sans"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUB-MODULE TAB BAR (Streamlined Core ERP Tabs)                            */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
          {[
            { label: "Hierarchy", icon: FolderTree },
            { label: "Units", icon: Building2 },
            { label: "Committees", icon: ShieldCheck },
            { label: "Positions", icon: UserCheck },
            { label: "Entities", icon: Landmark },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(tab.label)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 3-COLUMN WORKSPACE: TREE (LEFT), ORG CHART (CENTER), DETAILS (RIGHT)      */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* SUB-MODULE WORKSPACES                                                     */}
        {/* ========================================================================= */}

        {/* 1. HIERARCHY WORKSPACE (3 Columns: Tree, Org Chart Canvas, Unit Details) */}
        {activeTab === "Hierarchy" && (
          <div className="grid gap-4 lg:grid-cols-12 items-start">
            {/* COLUMN 1: 3. Organization Hierarchy Tree (Left Col - Span 3) */}
            <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <h3 className="text-sm font-bold text-foreground">
                <span className="text-primary font-bold">3.</span> Organization Hierarchy
              </h3>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in hierarchy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-3 pr-8 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Search className="absolute right-2.5 top-2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Tree Component */}
              <div className="space-y-1 max-h-[640px] overflow-y-auto text-xs pr-1">
                <TreeBranch node={hierarchyTreeData} onSelect={handleSelectNode} defaultOpen={true} searchQuery={searchQuery} />
              </div>
            </div>

            {/* COLUMN 2: Organization Chart Canvas (Center Col - Span 6) */}
            <div className="lg:col-span-6 rounded-xl border border-border bg-card p-4 flex flex-col justify-between min-h-[680px] shadow-xs relative">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-sm font-bold text-foreground">Organization Chart</h3>
              </div>

              {/* Visual Org Canvas */}
              <div
                className="my-3 flex-1 flex flex-col items-center justify-start overflow-x-auto p-4 transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
              >
                {/* Level 0: Board of Directors Pill */}
                <div className="rounded-lg border border-purple-400/40 bg-purple-500/10 px-4 py-1.5 text-center text-xs font-semibold text-purple-700 dark:text-purple-300 shadow-2xs flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-purple-600" />
                  <span>Board of Directors</span>
                </div>

                {/* Vertical connector line */}
                <div className="h-4 w-0.5 bg-slate-300 dark:bg-slate-700" />

                {/* Level 1: CEO Card (Rajeev Malhotra) */}
                <div
                  onClick={() => handleSelectNode("Corporate Management", 6)}
                  className="rounded-xl border border-border bg-card p-2.5 shadow-sm flex items-center gap-3 w-64 cursor-pointer hover:border-primary transition-all"
                >
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-foreground shrink-0 border border-border overflow-hidden">
                    <span className="text-primary font-bold">RM</span>
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-foreground truncate">Rajeev Malhotra</h5>
                    <p className="text-[11px] text-muted-foreground truncate">Chief Executive Officer</p>
                  </div>
                </div>

                {/* Vertical line down from CEO */}
                <div className="h-4 w-0.5 bg-slate-300 dark:bg-slate-700" />

                {/* Horizontal Connecting Branch Line */}
                <div className="w-[90%] h-0.5 bg-slate-300 dark:bg-slate-700" />

                {/* Vertical drop lines & 5 CXO Branches */}
                <div className="grid grid-cols-5 gap-2.5 w-full mt-0 pt-0">
                  {/* 1. ANITA VERMA (FINANCE - Amber Theme) */}
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />
                    <div
                      onClick={() => handleSelectNode("Finance", 186)}
                      className="w-full rounded-lg border border-border bg-card p-2 text-center shadow-2xs cursor-pointer hover:border-amber-500 transition-all"
                    >
                      <div className="h-7 w-7 rounded-full bg-amber-500/20 text-amber-700 mx-auto flex items-center justify-center font-bold text-[10px] mb-1">
                        AV
                      </div>
                      <h6 className="text-[11px] font-bold text-foreground truncate">Anita Verma</h6>
                      <p className="text-[9px] text-muted-foreground truncate">Chief Financial Officer</p>
                    </div>

                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />

                    <div className="w-full rounded-lg border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 p-2 text-center shadow-2xs space-y-0.5">
                      <h6 className="text-[11px] font-bold text-amber-900 dark:text-amber-300">Finance</h6>
                      <p className="text-[9px] text-amber-700 dark:text-amber-400">186 Employees</p>
                    </div>

                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />

                    <div className="w-full space-y-2">
                      <div className="rounded-lg border border-amber-400/30 bg-card p-2 text-center shadow-2xs">
                        <h6 className="text-[10px] font-bold text-foreground truncate">Accounts</h6>
                        <p className="text-[9px] text-muted-foreground">82 Employees</p>
                      </div>
                      <div className="rounded-lg border border-amber-400/30 bg-card p-2 text-center shadow-2xs">
                        <h6 className="text-[10px] font-bold text-foreground truncate">Treasury</h6>
                        <p className="text-[9px] text-muted-foreground">48 Employees</p>
                      </div>
                    </div>
                  </div>

                  {/* 2. SANDEEP IYER (OPERATIONS - Green/Emerald Theme) */}
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />
                    <div
                      onClick={() => handleSelectNode("Operations", 356)}
                      className="w-full rounded-lg border border-border bg-card p-2 text-center shadow-2xs cursor-pointer hover:border-emerald-500 transition-all"
                    >
                      <div className="h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-700 mx-auto flex items-center justify-center font-bold text-[10px] mb-1">
                        SI
                      </div>
                      <h6 className="text-[11px] font-bold text-foreground truncate">Sandeep Iyer</h6>
                      <p className="text-[9px] text-muted-foreground truncate">Chief Operating Officer</p>
                    </div>

                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />

                    <div className="w-full rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 p-2 text-center shadow-2xs space-y-0.5">
                      <h6 className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300">Operations</h6>
                      <p className="text-[9px] text-emerald-700 dark:text-emerald-400">356 Employees</p>
                    </div>

                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />

                    <div className="w-full space-y-2">
                      <div className="rounded-lg border border-emerald-400/30 bg-card p-2 text-center shadow-2xs">
                        <h6 className="text-[10px] font-bold text-foreground truncate">Production</h6>
                        <p className="text-[9px] text-muted-foreground">214 Employees</p>
                      </div>
                      <div className="rounded-lg border border-emerald-400/30 bg-card p-2 text-center shadow-2xs">
                        <h6 className="text-[10px] font-bold text-foreground truncate">Quality</h6>
                        <p className="text-[9px] text-muted-foreground">142 Employees</p>
                      </div>
                    </div>
                  </div>

                  {/* 3. VIKRAM SINGH (R&D - Blue Theme) */}
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />
                    <div
                      onClick={() => handleSelectNode("R&D", 298)}
                      className="w-full rounded-lg border border-border bg-card p-2 text-center shadow-2xs cursor-pointer hover:border-blue-500 transition-all"
                    >
                      <div className="h-7 w-7 rounded-full bg-blue-500/20 text-blue-700 mx-auto flex items-center justify-center font-bold text-[10px] mb-1">
                        VS
                      </div>
                      <h6 className="text-[11px] font-bold text-foreground truncate">Vikram Singh</h6>
                      <p className="text-[9px] text-muted-foreground truncate">Chief Technology Officer</p>
                    </div>

                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />

                    <div className="w-full rounded-lg border border-blue-500/30 bg-blue-50 dark:bg-blue-950/20 p-2 text-center shadow-2xs space-y-0.5">
                      <h6 className="text-[11px] font-bold text-blue-900 dark:text-blue-300">R&D</h6>
                      <p className="text-[9px] text-blue-700 dark:text-blue-400">298 Employees</p>
                    </div>

                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />

                    <div className="w-full space-y-2">
                      <div className="rounded-lg border border-blue-400/30 bg-card p-2 text-center shadow-2xs">
                        <h6 className="text-[10px] font-bold text-foreground truncate">Product Dev</h6>
                        <p className="text-[9px] text-muted-foreground">172 Employees</p>
                      </div>
                      <div className="rounded-lg border border-blue-400/30 bg-card p-2 text-center shadow-2xs">
                        <h6 className="text-[10px] font-bold text-foreground truncate">Engineering</h6>
                        <p className="text-[9px] text-muted-foreground">126 Employees</p>
                      </div>
                    </div>
                  </div>

                  {/* 4. MEERA NAIR (HR - Rose/Pink Theme) */}
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />
                    <div
                      onClick={() => handleSelectNode("Human Resources", 154)}
                      className="w-full rounded-lg border border-border bg-card p-2 text-center shadow-2xs cursor-pointer hover:border-rose-500 transition-all"
                    >
                      <div className="h-7 w-7 rounded-full bg-rose-500/20 text-rose-700 mx-auto flex items-center justify-center font-bold text-[10px] mb-1">
                        MN
                      </div>
                      <h6 className="text-[11px] font-bold text-foreground truncate">Meera Nair</h6>
                      <p className="text-[9px] text-muted-foreground truncate">Chief HR Officer</p>
                    </div>

                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />

                    <div className="w-full rounded-lg border border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 p-2 text-center shadow-2xs space-y-0.5">
                      <h6 className="text-[11px] font-bold text-rose-900 dark:text-rose-300">HR</h6>
                      <p className="text-[9px] text-rose-700 dark:text-rose-400">154 Employees</p>
                    </div>

                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />

                    <div className="w-full space-y-2">
                      <div className="rounded-lg border border-rose-400/30 bg-card p-2 text-center shadow-2xs">
                        <h6 className="text-[10px] font-bold text-foreground truncate">Talent Acq.</h6>
                        <p className="text-[9px] text-muted-foreground">68 Employees</p>
                      </div>
                      <div className="rounded-lg border border-rose-400/30 bg-card p-2 text-center shadow-2xs">
                        <h6 className="text-[10px] font-bold text-foreground truncate">Employee Rel.</h6>
                        <p className="text-[9px] text-muted-foreground">86 Employees</p>
                      </div>
                    </div>
                  </div>

                  {/* 5. ARJUN MEHTA (SALES - Orange Theme) */}
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />
                    <div
                      onClick={() => handleSelectNode("Sales", 412)}
                      className="w-full rounded-lg border border-border bg-card p-2 text-center shadow-2xs cursor-pointer hover:border-orange-500 transition-all"
                    >
                      <div className="h-7 w-7 rounded-full bg-orange-500/20 text-orange-700 mx-auto flex items-center justify-center font-bold text-[10px] mb-1">
                        AM
                      </div>
                      <h6 className="text-[11px] font-bold text-foreground truncate">Arjun Mehta</h6>
                      <p className="text-[9px] text-muted-foreground truncate">Chief Sales Officer</p>
                    </div>

                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />

                    <div className="w-full rounded-lg border border-orange-500/30 bg-orange-50 dark:bg-orange-950/20 p-2 text-center shadow-2xs space-y-0.5">
                      <h6 className="text-[11px] font-bold text-orange-900 dark:text-orange-300">Sales</h6>
                      <p className="text-[9px] text-orange-700 dark:text-orange-400">412 Employees</p>
                    </div>

                    <div className="h-3 w-0.5 bg-slate-300 dark:bg-slate-700" />

                    <div className="w-full space-y-2">
                      <div className="rounded-lg border border-orange-400/30 bg-card p-2 text-center shadow-2xs">
                        <h6 className="text-[10px] font-bold text-foreground truncate">Domestic Sales</h6>
                        <p className="text-[9px] text-muted-foreground">214 Employees</p>
                      </div>
                      <div className="rounded-lg border border-orange-400/30 bg-card p-2 text-center shadow-2xs">
                        <h6 className="text-[10px] font-bold text-foreground truncate">Int'l Sales</h6>
                        <p className="text-[9px] text-muted-foreground">198 Employees</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom floating zoom/download toolbar */}
              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(z + 10, 140))}
                  className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
                  className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(100)}
                  className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
                  title="Reset Zoom"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => showNotification("Full chart expanded.")}
                  className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
                  title="Maximize View"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => showNotification("Org Chart downloaded.")}
                  className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
                  title="Download Chart"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* COLUMN 3: Organization Unit Details (Right Col - Span 3) */}
            <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-xs">
              <h3 className="text-sm font-bold text-foreground">Organization Unit Details</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Unit Name</label>
                  <input
                    type="text"
                    value={selectedUnit.name}
                    onChange={(e) => setSelectedUnit({ ...selectedUnit, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Unit Code</label>
                  <input
                    type="text"
                    value={selectedUnit.code}
                    onChange={(e) => setSelectedUnit({ ...selectedUnit, code: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Unit Type</label>
                  <input
                    type="text"
                    value={selectedUnit.type}
                    onChange={(e) => setSelectedUnit({ ...selectedUnit, type: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Unit Head</label>
                  <select
                    value={selectedUnit.head}
                    onChange={(e) => setSelectedUnit({ ...selectedUnit, head: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                  >
                    <option value="Amit Desai">Amit Desai</option>
                    <option value="Vikram Singh">Vikram Singh</option>
                    <option value="Anita Verma">Anita Verma</option>
                    <option value="Sandeep Iyer">Sandeep Iyer</option>
                    <option value="Rajeev Malhotra">Rajeev Malhotra</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Parent Unit</label>
                  <select
                    value={selectedUnit.parentUnit}
                    onChange={(e) => setSelectedUnit({ ...selectedUnit, parentUnit: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                  >
                    <option value="Business Units">Business Units</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Functions">Functions</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Employees</label>
                  <input
                    type="text"
                    value={selectedUnit.employees}
                    onChange={(e) => setSelectedUnit({ ...selectedUnit, employees: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono font-semibold text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Location</label>
                  <select
                    value={selectedUnit.location}
                    onChange={(e) => setSelectedUnit({ ...selectedUnit, location: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                  >
                    <option value="Multiple Locations">Multiple Locations</option>
                    <option value="Headquarters - BLR">Headquarters - BLR</option>
                    <option value="Development Centre - HYD">Development Centre - HYD</option>
                    <option value="Manufacturing Unit - PNE">Manufacturing Unit - PNE</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Cost Centre</label>
                  <input
                    type="text"
                    value={selectedUnit.costCentre}
                    onChange={(e) => setSelectedUnit({ ...selectedUnit, costCentre: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Profit Centre</label>
                  <input
                    type="text"
                    value={selectedUnit.profitCentre}
                    onChange={(e) => setSelectedUnit({ ...selectedUnit, profitCentre: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Status</label>
                  <div className="mt-1">
                    <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                      {selectedUnit.status}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <button
                    type="button"
                    onClick={() => {
                      showNotification(`Unit '${selectedUnit.name}' properties updated successfully.`);
                    }}
                    className="w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 cursor-pointer shadow-xs transition-colors"
                  >
                    Save Unit Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. UNITS WORKSPACE */}
        {activeTab === "Units" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Active Business Units</span>
                <div className="text-xl font-bold font-mono text-foreground">{businessUnits.length} Units</div>
                <p className="text-[10px] text-emerald-600 font-medium">100% Operating</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Total Staffing</span>
                <div className="text-xl font-bold font-mono text-foreground">{calculatedTotalEmployees} Headcount</div>
                <p className="text-[10px] text-blue-600 font-medium">Across all units</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Profit Pools</span>
                <div className="text-xl font-bold font-mono text-foreground">{businessUnits.length} Active Pools</div>
                <p className="text-[10px] text-purple-600 font-medium">Linked to GL Accounts</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Operating Model</span>
                <div className="text-xl font-bold text-foreground">Functional Matrix</div>
                <p className="text-[10px] text-amber-600 font-medium">Corporate Governance</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Business Units Directory</h4>
                <button
                  onClick={() => setShowAddUnitModal(true)}
                  className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
                >
                  + Add Unit
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold">
                      <th className="py-2 px-2">Unit Code</th>
                      <th className="py-2 px-2">Business Unit Name</th>
                      <th className="py-2 px-2">Unit Head</th>
                      <th className="py-2 px-2">Location</th>
                      <th className="py-2 px-2 text-right">Headcount</th>
                      <th className="py-2 px-2">Cost Centre</th>
                      <th className="py-2 px-2">Profit Centre</th>
                      <th className="py-2 px-2">Status</th>
                      <th className="py-2 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {businessUnits.map((bu) => (
                      <tr key={bu.code} className="hover:bg-muted/30">
                        <td className="py-2 px-2 font-mono font-bold text-primary">{bu.code}</td>
                        <td className="py-2 px-2 font-semibold text-foreground">{bu.name}</td>
                        <td className="py-2 px-2 text-foreground">{bu.head}</td>
                        <td className="py-2 px-2 text-muted-foreground">{bu.loc}</td>
                        <td className="py-2 px-2 text-right font-mono font-bold">{Number(bu.count).toLocaleString()}</td>
                        <td className="py-2 px-2 font-mono text-[11px] text-muted-foreground">{bu.cc}</td>
                        <td className="py-2 px-2 font-mono text-[11px] text-muted-foreground">{bu.pc}</td>
                        <td className="py-2 px-2">
                          <span className="rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                            {bu.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setBusinessUnits((prev) => prev.filter((item) => item.code !== bu.code));
                              showNotification(`Unit ${bu.code} removed.`);
                            }}
                            className="text-rose-500 hover:text-rose-700 text-[11px] font-medium cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. COMMITTEES WORKSPACE */}
        {activeTab === "Committees" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Active Committees</span>
                <div className="text-xl font-bold font-mono text-foreground">{departmentsList.length} Bodies</div>
                <p className="text-[10px] text-emerald-600 font-medium">100% Active Mandate</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Committee Members</span>
                <div className="text-xl font-bold font-mono text-foreground">
                  {departmentsList.reduce((acc, d) => acc + Number(d.count), 0)} Leaders
                </div>
                <p className="text-[10px] text-blue-600 font-medium">Advisory & Board</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Average Committee Size</span>
                <div className="text-xl font-bold font-mono text-foreground">
                  {Math.round(departmentsList.reduce((acc, d) => acc + Number(d.count), 0) / (departmentsList.length || 1))} Members
                </div>
                <p className="text-[10px] text-purple-600 font-medium">Quorum Compliant</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Governance Budgets</span>
                <div className="text-xl font-bold font-mono text-foreground">{departmentsList.length} Ledgers</div>
                <p className="text-[10px] text-amber-600 font-medium">Corporate Secretarial</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Board Steering & Governance Committees ({departmentsList.length} Total Councils)</h4>
                <button
                  onClick={() => setShowAddDeptModal(true)}
                  className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
                >
                  + Add Committee
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold">
                      <th className="py-2 px-2">Committee Code</th>
                      <th className="py-2 px-2">Committee Name</th>
                      <th className="py-2 px-2">Advisory Mandate & Scope</th>
                      <th className="py-2 px-2">Committee Chair</th>
                      <th className="py-2 px-2 text-right">Members</th>
                      <th className="py-2 px-2">Governance Ledger</th>
                      <th className="py-2 px-2">Status</th>
                      <th className="py-2 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-[11px]">
                    {departmentsList.map((dept) => (
                      <tr key={dept.code} className="hover:bg-muted/30">
                        <td className="py-2 px-2 font-mono font-bold text-primary">{dept.code}</td>
                        <td className="py-2 px-2 font-semibold text-foreground">{dept.name}</td>
                        <td className="py-2 px-2 text-muted-foreground">{dept.fn}</td>
                        <td className="py-2 px-2 text-foreground font-medium">{dept.head}</td>
                        <td className="py-2 px-2 text-right font-mono font-bold">{dept.count}</td>
                        <td className="py-2 px-2 font-mono text-muted-foreground">{dept.cc}</td>
                        <td className="py-2 px-2">
                          <span className="rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                            {dept.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setDepartmentsList((prev) => prev.filter((item) => item.code !== dept.code));
                              showNotification(`Committee ${dept.code} removed.`);
                            }}
                            className="text-rose-500 hover:text-rose-700 text-[11px] font-medium cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. POSITIONS & JOB ARCHITECTURE */}
        {activeTab === "Positions" && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <h4 className="text-xs font-bold text-foreground">Job Level Architecture & Grade Ladder ({positionsList.length} Grades)</h4>
              <button
                onClick={() => setShowAddPositionModal(true)}
                className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                + Create Position
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold">
                    <th className="py-2 px-2">Job Level</th>
                    <th className="py-2 px-2">Grade Band</th>
                    <th className="py-2 px-2">Designation Example</th>
                    <th className="py-2 px-2 text-right">Approved Headcount</th>
                    <th className="py-2 px-2 text-right">Filled</th>
                    <th className="py-2 px-2 text-right">Open Positions</th>
                    <th className="py-2 px-2">Approval Authority</th>
                    <th className="py-2 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-[11px]">
                  {positionsList.map((pos) => (
                    <tr key={pos.grade} className="hover:bg-muted/30">
                      <td className="py-2 px-2 font-bold text-primary">{pos.level}</td>
                      <td className="py-2 px-2 font-mono font-bold text-foreground">{pos.grade}</td>
                      <td className="py-2 px-2 font-semibold text-foreground">{pos.role}</td>
                      <td className="py-2 px-2 text-right font-mono font-bold">{pos.total}</td>
                      <td className="py-2 px-2 text-right font-mono text-emerald-600 font-bold">{pos.filled}</td>
                      <td className="py-2 px-2 text-right font-mono text-amber-600 font-bold">{pos.open}</td>
                      <td className="py-2 px-2 text-muted-foreground">{pos.auth}</td>
                      <td className="py-2 px-2 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setPositionsList((prev) => prev.filter((p) => p.grade !== pos.grade));
                            showNotification(`Position ${pos.grade} removed.`);
                          }}
                          className="text-rose-500 hover:text-rose-700 text-[11px] font-medium cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. LEGAL ENTITIES & SUBSIDIARIES */}
        {activeTab === "Entities" && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <h4 className="text-xs font-bold text-foreground">Corporate Legal Entities & Global Subsidiaries ({locationsList.length} Entities)</h4>
              <button
                onClick={() => setShowAddLocationModal(true)}
                className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                + Register Entity
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {locationsList.map((loc) => (
                <div key={loc.name} className="rounded-xl border border-border bg-muted/15 p-3.5 space-y-2 relative group">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-foreground text-xs block leading-tight">{loc.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setLocationsList((prev) => prev.filter((l) => l.name !== loc.name));
                        showNotification(`Entity ${loc.name} deregistered.`);
                      }}
                      className="text-rose-500 hover:text-rose-700 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0 ml-1"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{loc.type}</p>
                  <div className="pt-2 border-t border-border/50 text-xs space-y-1 font-mono">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Total Headcount:</span>
                      <span className="text-foreground font-bold">{loc.count.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Corporate Seat:</span>
                      <span className="text-foreground text-right">{loc.area}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Entity Lead:</span>
                      <span className="text-foreground text-right">{loc.head}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FOOTER STRIP (MAICW Legend & Audit Metadata)                              */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 text-[11px] text-muted-foreground font-mono">
          <div>
            MAICW: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
            <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
            <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
            <span className="text-purple-500 font-bold">C</span> (Calculated) |{" "}
            <span className="text-rose-500 font-bold">W</span> (Workflow)
          </div>
          <div className="flex items-center gap-4">
            <span>Last Modified: 15 May 2024 11:30 AM</span>
            <span>Created By: Rahul Sharma</span>
          </div>
        </div>
      </div>

      {/* --- VALIDATION MODAL --- */}
      {showValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-500" />
                <h3 className="text-sm font-bold text-foreground">Organization Structure Audit</h3>
              </div>
              <button onClick={() => setShowValidationModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center justify-between">
                <span className="font-bold text-emerald-600">Integrity & Hierarchy Score</span>
                <span className="text-base font-bold text-emerald-600 font-mono">100% Validated</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>0 Circular Reporting Dependencies Detected</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>All Business Units Mapped to Active Cost Ledgers</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Legal Entity Governance Linkages Intact</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-border">
              <button
                onClick={() => setShowValidationModal(false)}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EXPORT MODAL --- */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground">Export Organization Package</h3>
              <button onClick={() => setShowExportModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Export the full organizational architecture package including Units, Functions, RACI Matrix, and Governance Charter.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  const csvRows = [
                    ["Category", "Code / Level", "Name / Designation", "Head / Manager", "Count / Headcount", "Cost Center", "Status"],
                    ...businessUnits.map((bu) => ["Business Unit", bu.code, bu.name, bu.head, bu.count, bu.cc, bu.status]),
                    ...departmentsList.map((d) => ["Department", d.code, d.name, d.head, d.count, d.cc, d.status]),
                    ...positionsList.map((p) => ["Position", p.grade, p.role, p.auth, p.total, "-", "Active"]),
                    ...locationsList.map((l) => ["Location", "-", l.name, l.head, l.count, "-", l.status]),
                  ];
                  const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", `ORG_STRUCTURE_${masterForm.orgCode}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  showNotification("Org Package exported to CSV/Excel successfully.");
                  setShowExportModal(false);
                }}
                className="w-full flex items-center justify-between rounded-lg border border-border bg-background p-3 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Excel / CSV Spreadsheet Package
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <button
                onClick={() => {
                  const exportObj = {
                    master: masterForm,
                    businessUnits,
                    departments: departmentsList,
                    positions: positionsList,
                    locations: locationsList,
                  };
                  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportObj, null, 2))}`;
                  const link = document.createElement("a");
                  link.setAttribute("href", jsonString);
                  link.setAttribute("download", `ORG_STRUCTURE_${masterForm.orgCode}.json`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  showNotification("Org Package exported to JSON successfully.");
                  setShowExportModal(false);
                }}
                className="w-full flex items-center justify-between rounded-lg border border-border bg-background p-3 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-blue-500" /> Full ERP JSON Dump
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- ADD BUSINESS UNIT MODAL --- */}
      {showAddUnitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Add New Business Unit</h3>
              </div>
              <button onClick={() => setShowAddUnitModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Unit Code *</label>
                <input
                  type="text"
                  placeholder="e.g. BU-DIGITAL"
                  value={newUnitForm.code}
                  onChange={(e) => setNewUnitForm({ ...newUnitForm, code: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Business Unit Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Digital & AI Business"
                  value={newUnitForm.name}
                  onChange={(e) => setNewUnitForm({ ...newUnitForm, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Unit Head</label>
                  <select
                    value={newUnitForm.head}
                    onChange={(e) => setNewUnitForm({ ...newUnitForm, head: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Amit Desai">Amit Desai</option>
                    <option value="Vikram Singh">Vikram Singh</option>
                    <option value="Sandeep Iyer">Sandeep Iyer</option>
                    <option value="Arjun Mehta">Arjun Mehta</option>
                    <option value="Anita Verma">Anita Verma</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Location</label>
                  <select
                    value={newUnitForm.loc}
                    onChange={(e) => setNewUnitForm({ ...newUnitForm, loc: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Bengaluru HQ">Bengaluru HQ</option>
                    <option value="Hyderabad Tech Center">Hyderabad Tech Center</option>
                    <option value="Noida Regional Hub">Noida Regional Hub</option>
                    <option value="Singapore Hub">Singapore Hub</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Headcount</label>
                  <input
                    type="number"
                    value={newUnitForm.count}
                    onChange={(e) => setNewUnitForm({ ...newUnitForm, count: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Cost Centre</label>
                  <input
                    type="text"
                    value={newUnitForm.cc}
                    onChange={(e) => setNewUnitForm({ ...newUnitForm, cc: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Profit Centre</label>
                  <input
                    type="text"
                    value={newUnitForm.pc}
                    onChange={(e) => setNewUnitForm({ ...newUnitForm, pc: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAddUnitModal(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newUnitForm.code || !newUnitForm.name) {
                    alert("Please provide unit code and name.");
                    return;
                  }
                  setBusinessUnits((prev) => [
                    ...prev,
                    {
                      code: newUnitForm.code.toUpperCase(),
                      name: newUnitForm.name,
                      head: newUnitForm.head,
                      loc: newUnitForm.loc,
                      count: Number(newUnitForm.count) || 50,
                      cc: newUnitForm.cc,
                      pc: newUnitForm.pc,
                      status: "Active",
                    },
                  ]);
                  setShowAddUnitModal(false);
                  showNotification(`Business Unit ${newUnitForm.code.toUpperCase()} successfully added.`);
                }}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
              >
                Add Unit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD COMMITTEE MODAL --- */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Add Governance Committee</h3>
              </div>
              <button onClick={() => setShowAddDeptModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Committee Code *</label>
                <input
                  type="text"
                  placeholder="e.g. COMM-SEC-07"
                  value={newDeptForm.code}
                  onChange={(e) => setNewDeptForm({ ...newDeptForm, code: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Committee Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Cyber Defense & Risk Steering Committee"
                  value={newDeptForm.name}
                  onChange={(e) => setNewDeptForm({ ...newDeptForm, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Mandate Scope</label>
                  <select
                    value={newDeptForm.fn}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, fn: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Governance & Risk">Governance &amp; Risk</option>
                    <option value="Audit & Compliance">Audit &amp; Compliance</option>
                    <option value="ESG & Sustainability">ESG &amp; Sustainability</option>
                    <option value="Technology & AI">Technology &amp; AI</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Committee Chair</label>
                  <input
                    type="text"
                    placeholder="e.g. Justice R. Swaminathan"
                    value={newDeptForm.head}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, head: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Quorum Count</label>
                  <input
                    type="number"
                    value={newDeptForm.count}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, count: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Governance Ledger</label>
                  <input
                    type="text"
                    placeholder="CC-GOV-01"
                    value={newDeptForm.cc}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, cc: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <button
                type="button"
                onClick={() => setShowAddDeptModal(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted font-medium text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newDeptForm.code || !newDeptForm.name) {
                    alert("Please provide committee code and name.");
                    return;
                  }
                  setDepartmentsList((prev) => [
                    ...prev,
                    {
                      code: newDeptForm.code.toUpperCase(),
                      name: newDeptForm.name,
                      fn: newDeptForm.fn,
                      head: newDeptForm.head,
                      count: Number(newDeptForm.count) || 5,
                      cc: newDeptForm.cc,
                      status: "Active",
                    },
                  ]);
                  setShowAddDeptModal(false);
                  showNotification(`Committee ${newDeptForm.code.toUpperCase()} successfully added.`);
                }}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
              >
                Add Committee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD POSITION MODAL --- */}
      {showAddPositionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Create Job Position & Grade</h3>
              </div>
              <button onClick={() => setShowAddPositionModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Job Level *</label>
                  <select
                    value={newPositionForm.level}
                    onChange={(e) => setNewPositionForm({ ...newPositionForm, level: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Level 1">Level 1 - Executive</option>
                    <option value="Level 2">Level 2 - CXO</option>
                    <option value="Level 3">Level 3 - VP</option>
                    <option value="Level 4">Level 4 - Director</option>
                    <option value="Level 5">Level 5 - Manager</option>
                    <option value="Level 6">Level 6 - Specialist</option>
                    <option value="Level 7">Level 7 - Associate</option>
                    <option value="Level 8">Level 8 - Intern/Trainee</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Grade Band *</label>
                  <input
                    type="text"
                    placeholder="e.g. P-03"
                    value={newPositionForm.grade}
                    onChange={(e) => setNewPositionForm({ ...newPositionForm, grade: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Designation / Role Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Cloud DevOps Engineer"
                  value={newPositionForm.role}
                  onChange={(e) => setNewPositionForm({ ...newPositionForm, role: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Approved</label>
                  <input
                    type="number"
                    value={newPositionForm.total}
                    onChange={(e) => setNewPositionForm({ ...newPositionForm, total: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Filled</label>
                  <input
                    type="number"
                    value={newPositionForm.filled}
                    onChange={(e) => setNewPositionForm({ ...newPositionForm, filled: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Open</label>
                  <input
                    type="number"
                    value={newPositionForm.open}
                    onChange={(e) => setNewPositionForm({ ...newPositionForm, open: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Approval Authority</label>
                <input
                  type="text"
                  value={newPositionForm.auth}
                  onChange={(e) => setNewPositionForm({ ...newPositionForm, auth: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAddPositionModal(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newPositionForm.grade || !newPositionForm.role) {
                    alert("Please provide grade band and role title.");
                    return;
                  }
                  setPositionsList((prev) => [
                    ...prev,
                    {
                      level: newPositionForm.level,
                      grade: newPositionForm.grade.toUpperCase(),
                      role: newPositionForm.role,
                      total: Number(newPositionForm.total) || 1,
                      filled: Number(newPositionForm.filled) || 1,
                      open: Number(newPositionForm.open) || 0,
                      auth: newPositionForm.auth,
                    },
                  ]);
                  setShowAddPositionModal(false);
                  showNotification(`Position ${newPositionForm.grade.toUpperCase()} created successfully.`);
                }}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
              >
                Create Position
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Location Modal */}
      {showAddLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Landmark className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Register Legal Entity / Subsidiary</h3>
              </div>
              <button onClick={() => setShowAddLocationModal(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Entity Legal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Magnertia Japan K.K."
                  value={newLocationForm.name}
                  onChange={(e) => setNewLocationForm({ ...newLocationForm, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block">Legal Entity Type</label>
                <select
                  value={newLocationForm.type}
                  onChange={(e) => setNewLocationForm({ ...newLocationForm, type: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                >
                  <option value="Parent Operating Company (India ROC)">Parent Operating Company (India ROC)</option>
                  <option value="Wholly-Owned Subsidiary (Delaware, USA)">Wholly-Owned Subsidiary (Delaware, USA)</option>
                  <option value="European Operations & Engineering (Munich)">European Operations & Engineering (Munich)</option>
                  <option value="Regional Holding & Treasury (Singapore ACRA)">Regional Holding & Treasury (Singapore ACRA)</option>
                  <option value="Regional Sales Office">Regional Sales Office</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Total Headcount</label>
                    <input
                      type="number"
                      value={newLocationForm.count}
                      onChange={(e) => setNewLocationForm({ ...newLocationForm, count: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Corporate Seat / Location</label>
                    <input
                      type="text"
                      placeholder="e.g. London Tech Hub"
                      value={newLocationForm.area}
                      onChange={(e) => setNewLocationForm({ ...newLocationForm, area: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Authorized Signatory / Director</label>
                  <input
                    type="text"
                    placeholder="e.g. David Sterling (Director)"
                    value={newLocationForm.head}
                    onChange={(e) => setNewLocationForm({ ...newLocationForm, head: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddLocationModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newLocationForm.name) {
                      alert("Please provide entity name.");
                      return;
                    }
                    setLocationsList((prev) => [
                      ...prev,
                      {
                        name: newLocationForm.name,
                        type: newLocationForm.type,
                        count: Number(newLocationForm.count) || 50,
                        area: newLocationForm.area,
                        head: newLocationForm.head,
                        status: "Active",
                      },
                    ]);
                    setShowAddLocationModal(false);
                    showNotification(`Entity ${newLocationForm.name} registered.`);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
                >
                  Register Entity
                </button>
              </div>
            </div>
          </div>
        )}
      </AppShell>
  );
}

// --- Supporting Tree Component ---

function TreeBranch({
  node,
  onSelect,
  defaultOpen = false,
  searchQuery = "",
}: {
  node: OrgTreeNode;
  onSelect: (name: string, count?: number) => void;
  defaultOpen?: boolean;
  searchQuery?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const hasChildren = node.children && node.children.length > 0;

  const matchesSearch = searchQuery.trim() !== "" && node.name.toLowerCase().includes(searchQuery.toLowerCase());
  const childMatches = hasChildren && node.children!.some((child) => child.name.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setOpen(true);
    }
  }, [searchQuery]);

  return (
    <div className="space-y-0.5">
      <div
        onClick={() => onSelect(node.name, node.count)}
        className={cn(
          "flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors cursor-pointer text-xs group",
          matchesSearch
            ? "bg-primary/20 text-primary font-bold border border-primary/30"
            : "hover:bg-muted text-foreground"
        )}
      >
        <div className="flex items-center gap-1.5 truncate">
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              className="p-0.5 hover:bg-black/10 rounded"
            >
              {open ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </button>
          ) : (
            <span className="w-3.5" />
          )}
          <span className={cn("truncate font-medium group-hover:text-primary transition-colors", matchesSearch && "text-primary font-bold")}>
            {node.name}
          </span>
        </div>

        {node.count !== undefined && (
          <span className="rounded-md bg-muted px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground shrink-0">
            {node.count.toLocaleString()}
          </span>
        )}
      </div>

      {hasChildren && open && (
        <div className="pl-3.5 border-l border-border/50 ml-2 space-y-0.5">
          {node.children!.map((child) => (
            <TreeBranch
              key={child.id}
              node={child}
              onSelect={onSelect}
              defaultOpen={child.id === "bu-group" || child.id === "func-group" || Boolean(childMatches)}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}
