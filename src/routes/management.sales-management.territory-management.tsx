import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  MapPin,
  Printer,
  Save,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
  Compass,
  Users,
  Target,
  FileText,
  DollarSign,
  TrendingUp,
  Award,
  Globe,
  Navigation,
  Plus,
  Trash2,
  Search,
  X,
  Check,
  Edit3,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { SalesManagementTabBar } from "@/components/erp/SalesManagementTabBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/sales-management/territory-management"
)({
  head: () => ({
    meta: [
      { title: "Territory Management · Sales Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Plan. Allocate. Grow. Win Together. — Geographic Boundary Governance, Account Mapping, Quota Distribution & Field Operations",
      },
    ],
  }),
  component: TerritoryManagementComponent,
});

const initialStepperStages = [
  { id: 1, title: "Market Potential", status: "completed" },
  { id: 2, title: "Boundary Definition", status: "completed" },
  { id: 3, title: "Account Mapping", status: "completed" },
  { id: 4, title: "Coverage Planning", status: "current" },
  { id: 5, title: "Target Allocation", status: "pending" },
  { id: 6, title: "Active Governance", status: "pending" },
];

const initialTerritoriesData: Record<string, {
  name: string;
  code: string;
  head: string;
  area: string;
  quota: string;
  quotaVal: number;
  reps: number;
  partners: number;
  tam: string;
  sam: string;
  tamVal: number;
  samVal: number;
  channelAllocation: Array<{ name: string; value: number; share: string; color: string }>;
  districts: Array<{
    id: number;
    district: string;
    cluster: string;
    cities: string;
    potential: string;
    partner: string;
    rep: string;
    status: string;
  }>;
}> = {
  TN: {
    name: "Tamil Nadu (State-wide)",
    code: "TERR-2026-001",
    head: "Priya Sharma",
    area: "1,30,058 Sq. Km",
    quota: "₹7.50 Cr",
    quotaVal: 7.5,
    reps: 8,
    partners: 12,
    tam: "₹120.00 Cr",
    sam: "₹75.00 Cr",
    tamVal: 120,
    samVal: 75,
    channelAllocation: [
      { name: "Authorized Dealers", value: 2.625, share: "35%", color: "#0A3C75" },
      { name: "Direct Enterprise", value: 2.25, share: "30%", color: "#22C55E" },
      { name: "Master Distributors", value: 1.5, share: "20%", color: "#0284C7" },
      { name: "System Integrators / EPC", value: 0.75, share: "10%", color: "#F59E0B" },
      { name: "GeM / State Tenders", value: 0.375, share: "5%", color: "#6366F1" },
    ],
    districts: [
      {
        id: 1,
        district: "Chennai Metro Region",
        cluster: "Tier 1 Industrial",
        cities: "Guindy, Ambattur, OMR, Poonamallee",
        potential: "₹3.20 Cr",
        partner: "VoltPlus Technologies",
        rep: "Priya Sharma",
        status: "Active",
      },
      {
        id: 2,
        district: "Coimbatore Cluster",
        cluster: "Tier 1 Engineering",
        cities: "Gandhipuram, Peelamedu, Tirupur",
        potential: "₹1.85 Cr",
        partner: "TexPower EV Systems",
        rep: "Arun Prakash",
        status: "Active",
      },
      {
        id: 3,
        district: "Madurai & South Cluster",
        cluster: "Tier 2 Commercial",
        cities: "Madurai, Dindigul, Tirunelveli",
        potential: "₹1.35 Cr",
        partner: "Pandian Green Energy",
        rep: "Karthik R.",
        status: "Active",
      },
      {
        id: 4,
        district: "Trichy & Central Cluster",
        cluster: "Tier 2 Industrial",
        cities: "Trichy, Thanjavur, Karur",
        potential: "₹1.10 Cr",
        partner: "Cauvery Power Hub",
        rep: "Divya M.",
        status: "Active",
      },
    ],
  },
  KA: {
    name: "Karnataka State",
    code: "TERR-2026-002",
    head: "Rajesh Hegde",
    area: "1,91,791 Sq. Km",
    quota: "₹5.20 Cr",
    quotaVal: 5.2,
    reps: 6,
    partners: 9,
    tam: "₹95.00 Cr",
    sam: "₹52.00 Cr",
    tamVal: 95,
    samVal: 52,
    channelAllocation: [
      { name: "Authorized Dealers", value: 2.08, share: "40%", color: "#0A3C75" },
      { name: "Direct Enterprise", value: 1.56, share: "30%", color: "#22C55E" },
      { name: "Master Distributors", value: 1.04, share: "20%", color: "#0284C7" },
      { name: "System Integrators / EPC", value: 0.52, share: "10%", color: "#F59E0B" },
    ],
    districts: [
      {
        id: 5,
        district: "Bengaluru Urban Corridor",
        cluster: "Tier 1 Tech & Fleet",
        cities: "Whitefield, Electronic City, Peenya",
        potential: "₹3.40 Cr",
        partner: "Bangalore Power EV",
        rep: "Sunil Gowda",
        status: "Active",
      },
      {
        id: 6,
        district: "Mysuru Heritage Corridor",
        cluster: "Tier 2 Commercial",
        cities: "Hebbal, Nanjangud, Mandya",
        potential: "₹1.10 Cr",
        partner: "Mysore GreenTech",
        rep: "Sneha Rao",
        status: "Active",
      },
      {
        id: 7,
        district: "Hubballi-Dharwad Belt",
        cluster: "Tier 2 Industrial",
        cities: "Hubballi, Belagavi, Gokul",
        potential: "₹0.70 Cr",
        partner: "North Karnataka Infra",
        rep: "Basavaraj K.",
        status: "Active",
      },
    ],
  },
  KL: {
    name: "Kerala State",
    code: "TERR-2026-003",
    head: "Thomas Kurian",
    area: "38,863 Sq. Km",
    quota: "₹3.10 Cr",
    quotaVal: 3.1,
    reps: 4,
    partners: 6,
    tam: "₹55.00 Cr",
    sam: "₹30.00 Cr",
    tamVal: 55,
    samVal: 30,
    channelAllocation: [
      { name: "Authorized Dealers", value: 1.55, share: "50%", color: "#0A3C75" },
      { name: "Direct Enterprise", value: 0.93, share: "30%", color: "#22C55E" },
      { name: "Master Distributors", value: 0.62, share: "20%", color: "#0284C7" },
    ],
    districts: [
      {
        id: 8,
        district: "Kochi Marine & Metro",
        cluster: "Tier 1 Commercial",
        cities: "Kakkanad, Edapally, Willingdon Island",
        potential: "₹1.80 Cr",
        partner: "Malabar EV Systems",
        rep: "Naveen Varghese",
        status: "Active",
      },
      {
        id: 9,
        district: "Trivandrum Tech Zone",
        cluster: "Tier 2 Institutional",
        cities: "Technopark, Kazhakkoottam, Attingal",
        potential: "₹1.30 Cr",
        partner: "Travancore Charging Solutions",
        rep: "Anjali Nair",
        status: "Active",
      },
    ],
  },
  TS_AP: {
    name: "Telangana & Andhra Pradesh",
    code: "TERR-2026-004",
    head: "Venkata Reddy",
    area: "2,74,400 Sq. Km",
    quota: "₹4.80 Cr",
    quotaVal: 4.8,
    reps: 5,
    partners: 8,
    tam: "₹85.00 Cr",
    sam: "₹48.00 Cr",
    tamVal: 85,
    samVal: 48,
    channelAllocation: [
      { name: "Authorized Dealers", value: 1.92, share: "40%", color: "#0A3C75" },
      { name: "Direct Enterprise", value: 1.44, share: "30%", color: "#22C55E" },
      { name: "Master Distributors", value: 0.96, share: "20%", color: "#0284C7" },
      { name: "EPC / Tenders", value: 0.48, share: "10%", color: "#F59E0B" },
    ],
    districts: [
      {
        id: 10,
        district: "Hyderabad Metro Core",
        cluster: "Tier 1 Industrial & IT",
        cities: "HITEC City, Gachibowli, Patancheru",
        potential: "₹3.10 Cr",
        partner: "Deccan EV Infrastructure",
        rep: "Srinivas Rao",
        status: "Active",
      },
      {
        id: 11,
        district: "Vijayawada-Guntur Corridor",
        cluster: "Tier 2 Commercial",
        cities: "Vijayawada, Guntur, Mangalagiri",
        potential: "₹1.70 Cr",
        partner: "Amaravati Power Grid",
        rep: "Kavitha K.",
        status: "Active",
      },
    ],
  },
};

export default function TerritoryManagementComponent() {
  const [selectedSubTerritory, setSelectedSubTerritory] = useState("TN");
  const [territories, setTerritories] = useState(initialTerritoriesData);
  const [stepperStages, setStepperStages] = useState(initialStepperStages);
  const [version, setVersion] = useState("v1.0");
  const [territoryStatus, setTerritoryStatus] = useState("Active Territory");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isAddDistrictOpen, setIsAddDistrictOpen] = useState(false);
  const [isReallocateOpen, setIsReallocateOpen] = useState(false);
  const [isRatifyOpen, setIsRatifyOpen] = useState(false);

  // Forms
  const [newDistrict, setNewDistrict] = useState({
    district: "Salem & Erode Belt",
    cluster: "Tier 2 Manufacturing",
    cities: "Salem Steel Plant, Perundurai, Bhavani",
    potential: "₹0.95 Cr",
    partner: "Kongu Energy Network",
    rep: "Manojkumar S.",
  });

  const [reallocateData, setReallocateData] = useState({
    districtId: 1,
    newRep: "Priya Sharma",
  });

  const currentTerritory = territories[selectedSubTerritory] || territories["TN"];

  const handlePrint = () => {
    toast.success("Printing Territory Governance Dossier & Account Distribution...");
    window.print();
  };

  const handleSave = () => {
    const nextVer = version === "v1.0" ? "v1.1" : version === "v1.1" ? "v1.2" : "v1.3";
    setVersion(nextVer);
    toast.success(`Territory Configuration saved successfully as ${nextVer}!`);
  };

  const handleAddDistrict = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: Date.now(),
      district: newDistrict.district,
      cluster: newDistrict.cluster,
      cities: newDistrict.cities,
      potential: newDistrict.potential,
      partner: newDistrict.partner,
      rep: newDistrict.rep,
      status: "Active",
    };

    setTerritories((prev) => ({
      ...prev,
      [selectedSubTerritory]: {
        ...prev[selectedSubTerritory],
        districts: [...prev[selectedSubTerritory].districts, item],
      },
    }));

    setIsAddDistrictOpen(false);
    toast.success(`District Cluster "${item.district}" added to ${currentTerritory.name}!`);
  };

  const handleDeleteDistrict = (id: number) => {
    setTerritories((prev) => ({
      ...prev,
      [selectedSubTerritory]: {
        ...prev[selectedSubTerritory],
        districts: prev[selectedSubTerritory].districts.filter((d) => d.id !== id),
      },
    }));
    toast.info("District cluster unmapped from current territory.");
  };

  const handleReallocateRep = (e: React.FormEvent) => {
    e.preventDefault();
    setTerritories((prev) => ({
      ...prev,
      [selectedSubTerritory]: {
        ...prev[selectedSubTerritory],
        districts: prev[selectedSubTerritory].districts.map((d) =>
          d.id === Number(reallocateData.districtId) ? { ...d, rep: reallocateData.newRep } : d
        ),
      },
    }));
    setIsReallocateOpen(false);
    toast.success(`Sales Rep reallocated to ${reallocateData.newRep} with immediate handover.`);
  };

  const handleRatifyTerritory = () => {
    setStepperStages((prev) =>
      prev.map((s) =>
        s.id <= 5
          ? { ...s, status: "completed" as const }
          : s.id === 6
          ? { ...s, status: "completed" as const }
          : s
      )
    );
    setTerritoryStatus("Active Governance (Ratified)");
    setIsRatifyOpen(false);
    toast.success("Territory Boundary, Headcount & Quota Plan ratified for FY26!");
  };

  const filteredDistricts = currentTerritory.districts.filter(
    (d) =>
      d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.cities.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.rep.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.partner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell
      title="Territory Management"
      breadcrumb="Management > Sales Management > Territory Management"
      description="Plan. Allocate. Grow. Win Together. — Geographic Boundary Governance, Account Mapping, Quota Distribution & Field Operations"
      tabs={<SalesManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen space-y-4 pb-12">
        {/* Top Header Card with Integrated Stepper */}
        <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0A3C75]/10 flex items-center justify-center text-[#0A3C75]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">Territory Management</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
                    {territoryStatus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                    {currentTerritory.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {version}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Plan. Allocate. Grow. Win Together. — Geographic Boundary Governance, Account Mapping, Quota Distribution & Field Operations
                </p>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2 shrink-0 flex-nowrap">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Territory Profile
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" /> Save
              </button>
              <button
                onClick={() => setIsRatifyOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#0A3C75] text-white hover:bg-[#0A3C75]/90 cursor-pointer shadow-xs transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Ratify Governance
              </button>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-5 pt-4 border-t border-border/50 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[760px] px-2">
              {stepperStages.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors",
                        step.status === "completed"
                          ? "bg-emerald-600 text-white"
                          : step.status === "current"
                          ? "bg-[#0A3C75] text-white shadow-xs"
                          : "bg-slate-100 text-slate-500 border border-border"
                      )}
                    >
                      {step.status === "completed" ? "✓" : step.id}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-800 leading-tight">{step.title}</p>
                      <p
                        className={cn(
                          "text-[10px] font-medium leading-tight",
                          step.status === "completed"
                            ? "text-emerald-700"
                            : step.status === "current"
                            ? "text-[#0A3C75] font-semibold"
                            : "text-slate-400"
                        )}
                      >
                        {step.status === "completed" ? "Complete" : step.status === "current" ? "In Progress" : "Pending"}
                      </p>
                    </div>
                  </div>
                  {idx < stepperStages.length - 1 && (
                    <div className="h-[2px] w-8 sm:w-12 bg-slate-200 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* General Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Identity, Territory Hierarchy Tree, Coverage Table, SVG Map Visual */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Identity & Governance */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#0A3C75]" />
                    Territory Master Record
                  </h3>
                  <span className="text-[11px] font-bold text-[#0A3C75] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    Tier A — Prime Economic Corridor
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Territory Name</span>
                    <span className="font-bold text-slate-800">{currentTerritory.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Territory Code</span>
                    <span className="font-bold text-slate-800 font-mono">{currentTerritory.code}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Parent Region</span>
                    <span className="font-bold text-[#0A3C75]">South India (REG-SOUTH-01)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Regional Sales Head</span>
                    <span className="font-bold text-slate-800">{currentTerritory.head}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Geographic Area</span>
                    <span className="font-bold text-slate-800">{currentTerritory.area}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Territory Quota FY26</span>
                    <span className="font-bold text-emerald-600 tabular-nums">{currentTerritory.quota}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Assigned Sales Team</span>
                    <span className="font-bold text-slate-800">{currentTerritory.reps} Field Executives</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Authorized Partners</span>
                    <span className="font-bold text-slate-800">{currentTerritory.partners} Channel Partners</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Interactive Territory Tree & Hierarchy */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#0A3C75]" />
                    Magnertia National Territory Hierarchy
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Click territory to inspect</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-medium space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <strong className="text-slate-900">India (National Market)</strong>
                  </div>
                  <div className="pl-5 space-y-1.5 border-l-2 border-slate-200 ml-1">
                    <div className="text-slate-500 hover:text-slate-800 cursor-pointer">
                      • North Region (Delhi-NCR, UP, Punjab, Haryana)
                    </div>
                    <div className="text-slate-500 hover:text-slate-800 cursor-pointer">
                      • West Region (Maharashtra, Gujarat, Goa)
                    </div>
                    <div className="text-[#0A3C75] font-bold">
                      ▾ South Region (HQ: Regional Operational Cluster)
                    </div>
                    <div className="pl-5 space-y-1 border-l-2 border-[#0A3C75]/40 ml-1">
                      <div
                        onClick={() => setSelectedSubTerritory("TN")}
                        className={`p-2 rounded-lg cursor-pointer transition flex items-center justify-between ${
                          selectedSubTerritory === "TN"
                            ? "bg-[#0A3C75] text-white font-bold shadow-xs"
                            : "text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span>✓ Tamil Nadu State (TERR-2026-001)</span>
                        <span className="text-[10px] tabular-nums">₹7.50 Cr Target</span>
                      </div>
                      <div
                        onClick={() => setSelectedSubTerritory("KA")}
                        className={`p-2 rounded-lg cursor-pointer transition flex items-center justify-between ${
                          selectedSubTerritory === "KA"
                            ? "bg-[#0A3C75] text-white font-bold shadow-xs"
                            : "text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span>• Karnataka State (TERR-2026-002)</span>
                        <span className="text-[10px] tabular-nums">₹5.20 Cr Target</span>
                      </div>
                      <div
                        onClick={() => setSelectedSubTerritory("KL")}
                        className={`p-2 rounded-lg cursor-pointer transition flex items-center justify-between ${
                          selectedSubTerritory === "KL"
                            ? "bg-[#0A3C75] text-white font-bold shadow-xs"
                            : "text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span>• Kerala State (TERR-2026-003)</span>
                        <span className="text-[10px] tabular-nums">₹3.10 Cr Target</span>
                      </div>
                      <div
                        onClick={() => setSelectedSubTerritory("TS_AP")}
                        className={`p-2 rounded-lg cursor-pointer transition flex items-center justify-between ${
                          selectedSubTerritory === "TS_AP"
                            ? "bg-[#0A3C75] text-white font-bold shadow-xs"
                            : "text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span>• Telangana & AP (TERR-2026-004)</span>
                        <span className="text-[10px] tabular-nums">₹4.80 Cr Target</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: District & City Operational Coverage Table */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#0A3C75]" />
                      District Clusters & Commercial Allocation
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {currentTerritory.districts.length} Active Operational Clusters in {currentTerritory.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search cluster, rep, city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75] w-48 sm:w-56"
                      />
                    </div>
                    <button
                      onClick={() => setIsAddDistrictOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#0A3C75] text-white rounded-lg hover:bg-[#0A3C75]/90 transition cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Cluster
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                        <th className="p-2.5">District / Cluster</th>
                        <th className="p-2.5">Key Cities Covered</th>
                        <th className="p-2.5 text-right">Market Potential</th>
                        <th className="p-2.5">Assigned Partner</th>
                        <th className="p-2.5">Field Rep</th>
                        <th className="p-2.5 text-center">Status</th>
                        <th className="p-2.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDistricts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-4 text-center text-slate-400 italic">
                            No district clusters match your search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredDistricts.map((d) => (
                          <tr key={d.id} className="hover:bg-slate-50/60 transition group">
                            <td className="p-2.5 font-bold text-slate-900">
                              {d.district}
                              <span className="block text-[10px] text-slate-400 font-normal">{d.cluster}</span>
                            </td>
                            <td className="p-2.5 text-slate-600">{d.cities}</td>
                            <td className="p-2.5 text-right font-bold text-[#0A3C75] tabular-nums">{d.potential}</td>
                            <td className="p-2.5 font-semibold text-slate-800">{d.partner}</td>
                            <td className="p-2.5 text-slate-700">{d.rep}</td>
                            <td className="p-2.5 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {d.status}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => handleDeleteDistrict(d.id)}
                                title="Unmap District Cluster"
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card 4: Geographic Coverage Map Visualization */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-[#0A3C75]" />
                      Geographic Spatial Coverage & Hub Densities
                    </h3>
                    <p className="text-xs text-slate-500">Tamil Nadu EV Corridor Depot Distribution</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                    High EV Penetration Corridor
                  </span>
                </div>

                <div className="relative h-[220px] bg-gradient-to-br from-slate-900 via-[#0A3C75] to-slate-950 rounded-xl overflow-hidden p-4 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                      <MapPin className="w-3.5 h-3.5" /> State Boundary: Tamil Nadu
                    </span>
                    <span className="text-slate-300 text-[11px]">1,30,058 Sq. Km • 7.21 Cr Pop.</span>
                  </div>

                  {/* Visual Node Grid */}
                  <div className="grid grid-cols-4 gap-3 my-auto">
                    <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-lg border border-white/20 text-center">
                      <div className="text-[10px] text-slate-300 uppercase">Chennai HQ</div>
                      <div className="text-sm font-bold text-white mt-0.5">Depot #01</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">38 Active Sites</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-lg border border-white/20 text-center">
                      <div className="text-[10px] text-slate-300 uppercase">Coimbatore</div>
                      <div className="text-sm font-bold text-white mt-0.5">Depot #02</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">24 Active Sites</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-lg border border-white/20 text-center">
                      <div className="text-[10px] text-slate-300 uppercase">Madurai Hub</div>
                      <div className="text-sm font-bold text-white mt-0.5">Depot #03</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">16 Active Sites</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-lg border border-white/20 text-center">
                      <div className="text-[10px] text-slate-300 uppercase">Trichy Depot</div>
                      <div className="text-sm font-bold text-white mt-0.5">Depot #04</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">12 Active Sites</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
                    <span>Active Charging Hubs: 90 Locations</span>
                    <span>Fleet Uptime: 99.4% SLA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Potential, Channel Donut, Resources, AI Insights */}
            <div className="lg:col-span-4 space-y-6">
              {/* Market Potential Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Market Potential ({currentTerritory.name})
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Score: 85/100
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Addressable Market (TAM)</span>
                    <span className="tabular-nums font-bold text-slate-900">{currentTerritory.tam}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Serviceable Market (SAM)</span>
                    <span className="tabular-nums font-bold text-slate-900">{currentTerritory.sam}</span>
                  </div>
                  <div className="flex justify-between text-[#0A3C75] font-bold pt-1.5 border-t border-slate-100">
                    <span>Magnertia Territory Quota Target</span>
                    <span className="tabular-nums text-sm">{currentTerritory.quota}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Target Market Penetration</span>
                    <span className="tabular-nums font-semibold text-emerald-700">10.0% SAM Share</span>
                  </div>
                </div>
              </div>

              {/* Channel Target Allocation Donut */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Channel Target Distribution
                  </h4>
                  <span className="text-xs font-bold text-slate-800">{currentTerritory.quota} Pool</span>
                </div>

                <div className="h-[180px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentTerritory.channelAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {currentTerritory.channelAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#06101E",
                          color: "#fff",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-base font-black text-slate-900">{currentTerritory.quota}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Territory Target</span>
                  </div>
                </div>

                <div className="space-y-1.5 mt-2">
                  {currentTerritory.channelAllocation.map((ch, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }}></span>
                        <span className="text-slate-700">{ch.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums">{ch.share}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource Capacity Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Assigned Operational Assets
                </h4>
                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-lg font-bold text-slate-900">{currentTerritory.reps}</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-0.5">Sales Executives</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-lg font-bold text-[#0A3C75]">{currentTerritory.partners}</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-0.5">Channel Partners</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-lg font-bold text-slate-900">{currentTerritory.districts.length * 95}</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-0.5">Mapped Accounts</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-lg font-bold text-emerald-600">{currentTerritory.districts.length}</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-0.5">Service Hubs</div>
                  </div>
                </div>
              </div>

              {/* AI Territory Optimization Insights */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    AI Territory Rebalancer
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700">Actionable</span>
                </div>
                <p className="bg-white p-2.5 rounded-lg border border-emerald-100 text-[11px] text-slate-700 leading-relaxed">
                  Industrial corridor analysis for {currentTerritory.name} indicates a surge in commercial EV fleet adoption. Recommend prioritizing Tier 1 corridor charging hubs to capture enterprise fleet mandates.
                </p>
              </div>

              {/* Actions */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Territory Workflows</h4>
                <button
                  onClick={() => setIsReallocateOpen(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-[#0A3C75] hover:bg-slate-50 transition text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#0A3C75]" />
                    Reallocate District Sales Reps
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => toast.success(`Annual quota rebalanced across ${currentTerritory.name} clusters based on active pipeline.`)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-slate-50 transition text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-emerald-600" />
                    Adjust Annual Quota Distribution
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Add District Modal */}
      {isAddDistrictOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-[#0A3C75] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Add District Cluster — {currentTerritory.name}</h3>
              </div>
              <button
                onClick={() => setIsAddDistrictOpen(false)}
                className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDistrict} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">District / Region Name</label>
                <input
                  type="text"
                  required
                  value={newDistrict.district}
                  onChange={(e) => setNewDistrict({ ...newDistrict, district: e.target.value })}
                  placeholder="e.g. Salem & Erode Belt"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cluster Category</label>
                  <input
                    type="text"
                    required
                    value={newDistrict.cluster}
                    onChange={(e) => setNewDistrict({ ...newDistrict, cluster: e.target.value })}
                    placeholder="e.g. Tier 2 Manufacturing"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Market Potential (₹)</label>
                  <input
                    type="text"
                    required
                    value={newDistrict.potential}
                    onChange={(e) => setNewDistrict({ ...newDistrict, potential: e.target.value })}
                    placeholder="e.g. ₹1.25 Cr"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Key Cities Covered</label>
                <input
                  type="text"
                  required
                  value={newDistrict.cities}
                  onChange={(e) => setNewDistrict({ ...newDistrict, cities: e.target.value })}
                  placeholder="e.g. Salem Steel City, Sankagiri, Bhavani"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Partner</label>
                  <input
                    type="text"
                    required
                    value={newDistrict.partner}
                    onChange={(e) => setNewDistrict({ ...newDistrict, partner: e.target.value })}
                    placeholder="e.g. Kongu Energy Network"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Field Sales Rep</label>
                  <input
                    type="text"
                    required
                    value={newDistrict.rep}
                    onChange={(e) => setNewDistrict({ ...newDistrict, rep: e.target.value })}
                    placeholder="e.g. Manojkumar S."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDistrictOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#0A3C75] text-white rounded-lg hover:bg-[#0A3C75]/90 transition shadow-sm cursor-pointer"
                >
                  Save Cluster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reallocate Sales Rep Modal */}
      {isReallocateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-[#0A3C75] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Reallocate Field Sales Rep</h3>
              </div>
              <button
                onClick={() => setIsReallocateOpen(false)}
                className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReallocateRep} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target District Cluster</label>
                <select
                  value={reallocateData.districtId}
                  onChange={(e) => setReallocateData({ ...reallocateData, districtId: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                >
                  {currentTerritory.districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.district} (Current: {d.rep})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Assigned Field Executive</label>
                <input
                  type="text"
                  required
                  value={reallocateData.newRep}
                  onChange={(e) => setReallocateData({ ...reallocateData, newRep: e.target.value })}
                  placeholder="e.g. Vignesh Sundaram"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
                Reallocating will transfer all unbilled opportunities, active partner mappings, and quarterly quotas to the newly assigned representative.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReallocateOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#0A3C75] text-white rounded-lg hover:bg-[#0A3C75]/90 transition shadow-sm cursor-pointer"
                >
                  Confirm Reallocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ratify Governance Modal */}
      {isRatifyOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-[#0A3C75] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Ratify Territory Governance</h3>
              </div>
              <button
                onClick={() => setIsRatifyOpen(false)}
                className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <p className="leading-relaxed">
                You are about to formally ratify the territory boundary mappings, quota allocations, and field executive assignments for <strong className="text-slate-900">{currentTerritory.name}</strong> ({currentTerritory.code}).
              </p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span>Territory Quota:</span>
                  <span className="font-bold text-[#0A3C75]">{currentTerritory.quota}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active District Clusters:</span>
                  <span className="font-bold text-slate-900">{currentTerritory.districts.length} Clusters</span>
                </div>
                <div className="flex justify-between">
                  <span>Authorized Partners:</span>
                  <span className="font-bold text-slate-900">{currentTerritory.partners} Partners</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] leading-relaxed">
                Ratification marks the territory stage as completed and activates field commission tracking against the published targets.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRatifyOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRatifyTerritory}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm cursor-pointer"
                >
                  Ratify & Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
