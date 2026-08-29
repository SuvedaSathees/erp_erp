import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProcurementManagementTabBar } from "@/components/erp/ProcurementManagementTabBar";
import {
  Building2,
  FileText,
  FileCheck,
  ShoppingCart,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Plus,
  Save,
  Send,
  Printer,
  MoreHorizontal,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Calendar,
  User,
  Users,
  ShieldCheck,
  Check,
  X,
  Edit,
  Trash2,
  Paperclip,
  Upload,
  ArrowRight,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Info,
  Sliders,
  AlertCircle,
  FileSpreadsheet,
  Zap,
  Tag,
  Star,
  CheckSquare,
  Sparkles,
  Award,
  Eye,
  Copy,
  FolderOpen,
  HelpCircle,
  FileCode,
  StickyNote,
  Mail,
  Phone,
  BarChart3,
  Scale,
  Handshake,
  MessageSquare,
  Lock,
  Unlock,
  Radio,
  FileBadge,
  History,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/management/procurement-management/tender-management")({
  head: () => ({
    meta: [
      { title: "Tender Management · Procurement Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Tender Management Form — large-value competitive procurement from tender planning and publication through bidder registration, two-envelope bid opening, technical & commercial evaluation, award, and contract conversion.",
      },
    ],
  }),
  component: TenderManagementPage,
});

// --- TYPE DEFINITIONS ---

interface TenderLineItem {
  id: number;
  itemService: string;
  itemCode: string;
  description: string;
  category: string;
  uom: string;
  quantity: number;
  estimatedUnitPrice: number;
  estimatedTotal: number;
  requiredDeliveryDate: string;
  hsnSac: string;
  taxRate: number;
  project: string;
  costCenter: string;
  status: "Active" | "Pending" | "Awarded" | "Cancelled";
}

interface TenderBidder {
  id: number;
  supplierName: string;
  supplierCode: string;
  contactPerson: string;
  email: string;
  phone: string;
  registrationStatus: "Registered" | "Invited";
  eligibilityStatus: "Eligible" | "Under Review" | "Disqualified";
  bidSubmitted: boolean;
  bidNumber?: string;
  submissionDate?: string;
  technicalBidSubmitted: boolean;
  commercialBidSubmitted: boolean;
  emdReceived: boolean;
  emdAmount: number;
  bidValidityDays: number;
  totalBidAmount?: number;
  technicalScore?: number;
  commercialRank?: string;
  overallRank?: number;
  bidStatus: "Received" | "Under Technical Review" | "Qualified" | "Disqualified" | "Under Commercial Review" | "Awarded";
}

interface CommitteeMember {
  id: number;
  name: string;
  role: "Chairperson" | "Technical Evaluator" | "Commercial Evaluator" | "Finance Representative" | "Procurement Representative" | "Legal Representative" | "Observer";
  department: string;
  employeeId: string;
  conflictDeclared: boolean;
  declarationDate: string;
  status: "Active" | "Signed Off";
}

interface TenderClarification {
  id: number;
  queryNumber: string;
  bidderName: string;
  category: "Technical" | "Commercial" | "Submission" | "BOQ" | "Site Visit";
  query: string;
  submittedDate: string;
  response: string;
  responseDate: string;
  visibility: "Public to All Bidders" | "Private to Bidder" | "Internal Only";
  status: "Answered" | "Pending";
}

interface TenderDocument {
  id: number;
  category: string;
  name: string;
  fileName: string;
  version: string;
  size: string;
  publishedDate: string;
  publishedBy: string;
  mandatory: boolean;
}

// --- INITIAL MASTER DATA ---

const INITIAL_TENDER_MASTER = {
  tenderId: "TND-ID-4102",
  tenderNumber: "TND-2026-000041",
  tenderTitle: "Smart EV Charging Infrastructure Components",
  tenderType: "Material Tender",
  tenderMethod: "Open Tender",
  bidType: "Two-Stage / Two-Envelope",
  evaluationMethod: "QCBS (Quality & Cost Based Selection)",
  procurementCategory: "Electrical Components",
  department: "Engineering",
  project: "Smart EV Charging System",
  sourcePrNumber: "PR-2026-000145",
  estimatedTenderValue: 4850000,
  currency: "INR",
  tenderOwner: "Rahul Sharma",
  tenderIssueDate: "28 Apr 2026 10:15 AM",
  bidSubmissionDeadline: "15 May 2026 15:00",
  bidOpeningDate: "15 May 2026 15:30",
  expectedAwardDate: "25 May 2026",
  contractTargetDate: "28 May 2026",
  projectStartDate: "01 Jun 2026",
  priority: "High" as const,
  tenderStatus: "Bid Submission" as const,
  publicationChannel: "E-Tender Portal & Company Procurement Hub",
  portalReference: "ET-2026-MAG-0894",
  publicUrl: "https://procurement.magnertia.com/tenders/TND-2026-000041",
  scopeOfWork: "Turnkey supply, factory inspection, and delivery of high-capacity DC contactors, revenue-grade digital meters, and modular auxiliary control kits for 100 Smart EV Charging Station units.",
  deliveryLocation: "Bengaluru Plant - Bay 4 (Electronic City)",
  completionPeriod: "45 Days from Contract Sign-off",
  biddersInvited: 12,
  bidsSubmitted: 8,
  qualifiedBids: 5,
  underEvaluation: 3,
  disqualified: 0,
  lowestBidValue: 4620000,
  averageBidValue: 4835000,
  potentialSavings: 230000,
  timeRemaining: "12 Days 04:35:20",
  domesticPreference: true,
  msmePreference: true,
  startupPreference: false,
  greenProcurement: true,
};

const INITIAL_LINE_ITEMS: TenderLineItem[] = [
  {
    id: 1,
    itemService: "Power Contactor",
    itemCode: "ELEC-CON-001",
    description: "3 Pole, 32A, 220V AC Heavy-Duty Contactor",
    category: "Electrical Components",
    uom: "Nos",
    quantity: 50,
    estimatedUnitPrice: 3200,
    estimatedTotal: 160000,
    requiredDeliveryDate: "15 May 2026",
    hsnSac: "8536",
    taxRate: 18,
    project: "Smart EV Charging System",
    costCenter: "CC-ENG-01",
    status: "Active",
  },
  {
    id: 2,
    itemService: "Energy Meter",
    itemCode: "ELEC-MTR-001",
    description: "Digital Energy Meter, 3 Phase Bi-directional RS485",
    category: "Electrical Components",
    uom: "Nos",
    quantity: 25,
    estimatedUnitPrice: 4500,
    estimatedTotal: 112500,
    requiredDeliveryDate: "15 May 2026",
    hsnSac: "9028",
    taxRate: 18,
    project: "Smart EV Charging System",
    costCenter: "CC-ENG-01",
    status: "Active",
  },
  {
    id: 3,
    itemService: "Control Components",
    itemCode: "CTRL-COMP-001",
    description: "Control Components Kit & Relays",
    category: "Control Systems",
    uom: "Set",
    quantity: 50,
    estimatedUnitPrice: 2500,
    estimatedTotal: 125000,
    requiredDeliveryDate: "15 May 2026",
    hsnSac: "8537",
    taxRate: 18,
    project: "Smart EV Charging System",
    costCenter: "CC-ENG-01",
    status: "Active",
  },
  {
    id: 4,
    itemService: "Electrical Accessories",
    itemCode: "ELEC-ACC-001",
    description: "Wiring Accessories, Terminals & Heavy-Duty Fittings",
    category: "Consumables",
    uom: "Lot",
    quantity: 1,
    estimatedUnitPrice: 87500,
    estimatedTotal: 87500,
    requiredDeliveryDate: "15 May 2026",
    hsnSac: "8538",
    taxRate: 18,
    project: "Smart EV Charging System",
    costCenter: "CC-ENG-01",
    status: "Active",
  },
];

const INITIAL_BIDDERS: TenderBidder[] = [
  {
    id: 1,
    supplierName: "ElectroMex Solutions Pvt. Ltd.",
    supplierCode: "BID-EM-126",
    contactPerson: "Arvind Joshi",
    email: "arvind@electromex.in",
    phone: "+91 98230 44551",
    registrationStatus: "Registered",
    eligibilityStatus: "Eligible",
    bidSubmitted: true,
    bidNumber: "BID-EM-126",
    submissionDate: "10 May 2026 14:20",
    technicalBidSubmitted: true,
    commercialBidSubmitted: true,
    emdReceived: true,
    emdAmount: 97000,
    bidValidityDays: 90,
    totalBidAmount: 4620000,
    technicalScore: 92.4,
    commercialRank: "L1",
    overallRank: 1,
    bidStatus: "Received",
  },
  {
    id: 2,
    supplierName: "PowerGrid Components",
    supplierCode: "BID-PG-118",
    contactPerson: "Meera Krishnan",
    email: "sales@powergridcomp.com",
    phone: "+91 97410 88231",
    registrationStatus: "Registered",
    eligibilityStatus: "Eligible",
    bidSubmitted: true,
    bidNumber: "BID-PG-118",
    submissionDate: "11 May 2026 11:30",
    technicalBidSubmitted: true,
    commercialBidSubmitted: true,
    emdReceived: true,
    emdAmount: 97000,
    bidValidityDays: 90,
    totalBidAmount: 4675000,
    technicalScore: 89.0,
    commercialRank: "L2",
    overallRank: 2,
    bidStatus: "Received",
  },
  {
    id: 3,
    supplierName: "VoltTech Engineers",
    supplierCode: "BID-VT-077",
    contactPerson: "Sanjay Singhal",
    email: "bids@volttech.co.in",
    phone: "+91 99100 33412",
    registrationStatus: "Registered",
    eligibilityStatus: "Eligible",
    bidSubmitted: true,
    bidNumber: "BID-VT-077",
    submissionDate: "12 May 2026 09:45",
    technicalBidSubmitted: true,
    commercialBidSubmitted: true,
    emdReceived: true,
    emdAmount: 97000,
    bidValidityDays: 90,
    totalBidAmount: 4840000,
    technicalScore: 95.2,
    commercialRank: "L3",
    overallRank: 3,
    bidStatus: "Received",
  },
  {
    id: 4,
    supplierName: "Energo Systems India",
    supplierCode: "BID-ES-044",
    contactPerson: "Vikram Rathore",
    email: "tenders@energosys.com",
    phone: "+91 98110 55231",
    registrationStatus: "Registered",
    eligibilityStatus: "Eligible",
    bidSubmitted: true,
    bidNumber: "BID-ES-044",
    submissionDate: "12 May 2026 16:10",
    technicalBidSubmitted: true,
    commercialBidSubmitted: true,
    emdReceived: true,
    emdAmount: 97000,
    bidValidityDays: 90,
    totalBidAmount: 4910000,
    technicalScore: 86.5,
    commercialRank: "L4",
    overallRank: 4,
    bidStatus: "Received",
  },
  {
    id: 5,
    supplierName: "Techno Electric Pvt. Ltd.",
    supplierCode: "BID-TE-055",
    contactPerson: "Kavita Reddy",
    email: "bids@technoelectric.in",
    phone: "+91 97000 66772",
    registrationStatus: "Registered",
    eligibilityStatus: "Eligible",
    bidSubmitted: true,
    bidNumber: "BID-TE-055",
    submissionDate: "13 May 2026 10:15",
    technicalBidSubmitted: true,
    commercialBidSubmitted: true,
    emdReceived: true,
    emdAmount: 97000,
    bidValidityDays: 90,
    totalBidAmount: 5020000,
    technicalScore: 84.0,
    commercialRank: "L5",
    overallRank: 5,
    bidStatus: "Received",
  },
  {
    id: 6,
    supplierName: "Apex Power Systems",
    supplierCode: "BID-AP-019",
    contactPerson: "Rajesh Bhatia",
    email: "rbhatia@apexpower.com",
    phone: "+91 98450 11223",
    registrationStatus: "Registered",
    eligibilityStatus: "Eligible",
    bidSubmitted: true,
    bidNumber: "BID-AP-019",
    submissionDate: "13 May 2026 14:00",
    technicalBidSubmitted: true,
    commercialBidSubmitted: true,
    emdReceived: true,
    emdAmount: 97000,
    bidValidityDays: 90,
    totalBidAmount: 4790000,
    technicalScore: 91.0,
    commercialRank: "L3-Alt",
    overallRank: 3,
    bidStatus: "Received",
  },
  {
    id: 7,
    supplierName: "Schneider Partner Consortium",
    supplierCode: "BID-SP-088",
    contactPerson: "Nikhil Desai",
    email: "consortium@schneider-dist.in",
    phone: "+91 98330 22119",
    registrationStatus: "Registered",
    eligibilityStatus: "Eligible",
    bidSubmitted: true,
    bidNumber: "BID-SP-088",
    submissionDate: "14 May 2026 11:00",
    technicalBidSubmitted: true,
    commercialBidSubmitted: true,
    emdReceived: true,
    emdAmount: 97000,
    bidValidityDays: 90,
    totalBidAmount: 4890000,
    technicalScore: 94.0,
    commercialRank: "L4-Alt",
    overallRank: 4,
    bidStatus: "Received",
  },
  {
    id: 8,
    supplierName: "ABB Industrial Channels",
    supplierCode: "BID-AB-092",
    contactPerson: "Gaurav Malhotra",
    email: "tenders@abbchannels.in",
    phone: "+91 98190 77441",
    registrationStatus: "Registered",
    eligibilityStatus: "Eligible",
    bidSubmitted: true,
    bidNumber: "BID-AB-092",
    submissionDate: "14 May 2026 15:30",
    technicalBidSubmitted: true,
    commercialBidSubmitted: true,
    emdReceived: true,
    emdAmount: 97000,
    bidValidityDays: 90,
    totalBidAmount: 4950000,
    technicalScore: 93.0,
    commercialRank: "L5-Alt",
    overallRank: 5,
    bidStatus: "Received",
  },
];

const INITIAL_COMMITTEE: CommitteeMember[] = [
  {
    id: 1,
    name: "Dr. K. S. Venkatesh",
    role: "Chairperson",
    department: "Executive Procurement Board",
    employeeId: "EMP-000012",
    conflictDeclared: true,
    declarationDate: "28 Apr 2026",
    status: "Active",
  },
  {
    id: 2,
    name: "Sneha Iyer",
    role: "Technical Evaluator",
    department: "Engineering R&D",
    employeeId: "EMP-000088",
    conflictDeclared: true,
    declarationDate: "28 Apr 2026",
    status: "Active",
  },
  {
    id: 3,
    name: "Vikas Jain",
    role: "Finance Representative",
    department: "Finance & Accounts",
    employeeId: "EMP-000054",
    conflictDeclared: true,
    declarationDate: "28 Apr 2026",
    status: "Active",
  },
  {
    id: 4,
    name: "Rahul Sharma",
    role: "Procurement Representative",
    department: "Sourcing & Contracts",
    employeeId: "EMP-000125",
    conflictDeclared: true,
    declarationDate: "28 Apr 2026",
    status: "Active",
  },
  {
    id: 5,
    name: "Adv. Ananya Roy",
    role: "Legal Representative",
    department: "Legal & Compliance",
    employeeId: "EMP-000031",
    conflictDeclared: true,
    declarationDate: "28 Apr 2026",
    status: "Active",
  },
];

const INITIAL_CLARIFICATIONS: TenderClarification[] = [
  {
    id: 1,
    queryNumber: "Q-05",
    bidderName: "Techno Electric Pvt. Ltd.",
    category: "Submission",
    query: "Can we get extension for submission?",
    submittedDate: "12 May 2026 11:00",
    response: "Submission deadline confirmed as 15 May 2026 15:00 hrs. No further extension is permissible due to commissioning timeline.",
    responseDate: "12 May 2026 16:30",
    visibility: "Public to All Bidders",
    status: "Answered",
  },
  {
    id: 2,
    queryNumber: "Q-04",
    bidderName: "VoltTech Engineers",
    category: "Commercial",
    query: "Please confirm warranty period.",
    submittedDate: "11 May 2026 14:20",
    response: "Warranty requirement is minimum 24 months from date of commissioning or 30 months from date of supply, whichever is earlier.",
    responseDate: "11 May 2026 18:00",
    visibility: "Public to All Bidders",
    status: "Answered",
  },
  {
    id: 3,
    queryNumber: "Q-03",
    bidderName: "Energo Systems India",
    category: "Submission",
    query: "Is registration on portal mandatory?",
    submittedDate: "10 May 2026 09:15",
    response: "Yes, Class-3 Digital Signature Certificate (DSC) and registered vendor profile on Magnertia e-Tender portal are mandatory for bid encryption.",
    responseDate: "10 May 2026 12:30",
    visibility: "Public to All Bidders",
    status: "Answered",
  },
  {
    id: 4,
    queryNumber: "Q-02",
    bidderName: "PowerGrid Components",
    category: "BOQ",
    query: "BOQ item 3 specifications clarification.",
    submittedDate: "09 May 2026 15:45",
    response: "Item 3 auxiliary control kits must include 24VDC opto-isolated solid state relays with DIN rail base sockets.",
    responseDate: "09 May 2026 19:10",
    visibility: "Public to All Bidders",
    status: "Answered",
  },
  {
    id: 5,
    queryNumber: "Q-01",
    bidderName: "ElectroMex Solutions Pvt. Ltd.",
    category: "Site Visit",
    query: "Request for site visit details.",
    submittedDate: "08 May 2026 10:00",
    response: "Pre-bid site visit organized on 04 May 2026 at Bengaluru High-Tech Campus. Minutes published under Corrigendum #1.",
    responseDate: "08 May 2026 14:00",
    visibility: "Public to All Bidders",
    status: "Answered",
  },
];

const INITIAL_DOCUMENTS: TenderDocument[] = [
  {
    id: 1,
    category: "Tender Document",
    name: "Tender_Document.pdf",
    fileName: "Tender_Document.pdf",
    version: "v1.0",
    size: "1.2 MB",
    publishedDate: "28 Apr 2026",
    publishedBy: "Rahul Sharma",
    mandatory: true,
  },
  {
    id: 2,
    category: "Scope of Work",
    name: "Scope_of_Work.pdf",
    fileName: "Scope_of_Work.pdf",
    version: "v1.1",
    size: "2.6 MB",
    publishedDate: "28 Apr 2026",
    publishedBy: "Rahul Sharma",
    mandatory: true,
  },
  {
    id: 3,
    category: "BOQ",
    name: "BOQ.xlsx",
    fileName: "BOQ.xlsx",
    version: "Rev B",
    size: "856 KB",
    publishedDate: "28 Apr 2026",
    publishedBy: "Rahul Sharma",
    mandatory: true,
  },
  {
    id: 4,
    category: "Technical Specification",
    name: "Technical_Specification.pdf",
    fileName: "Technical_Specification.pdf",
    version: "v2.0",
    size: "1.8 MB",
    publishedDate: "28 Apr 2026",
    publishedBy: "Rahul Sharma",
    mandatory: true,
  },
  {
    id: 5,
    category: "Terms & Conditions",
    name: "Terms_and_Conditions.pdf",
    fileName: "Terms_and_Conditions.pdf",
    version: "v1.0",
    size: "1.1 MB",
    publishedDate: "28 Apr 2026",
    publishedBy: "Rahul Sharma",
    mandatory: true,
  },
];

export function TenderManagementPage() {
  // Navigation & Active Tab
  const [activeTab, setActiveTab] = useState<string>("scope");

  // State
  const [tenderMaster, setTenderMaster] = useState(INITIAL_TENDER_MASTER);
  const [lineItems, setLineItems] = useState<TenderLineItem[]>(INITIAL_LINE_ITEMS);
  const [bidders, setBidders] = useState<TenderBidder[]>(INITIAL_BIDDERS);
  const [committee, setCommittee] = useState<CommitteeMember[]>(INITIAL_COMMITTEE);
  const [clarifications, setClarifications] = useState<TenderClarification[]>(INITIAL_CLARIFICATIONS);
  const [documents, setDocuments] = useState<TenderDocument[]>(INITIAL_DOCUMENTS);

  // Modals
  const [showNewTenderModal, setShowNewTenderModal] = useState<boolean>(false);
  const [showBidderModal, setShowBidderModal] = useState<boolean>(false);
  const [showClarificationModal, setShowClarificationModal] = useState<boolean>(false);
  const [showAwardModal, setShowAwardModal] = useState<boolean>(false);
  const [showContractModal, setShowContractModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Handlers
  const handleSaveDraft = () => {
    toast.success("Tender details saved as draft.");
  };

  const handleSubmitForApproval = () => {
    toast.success("Tender submitted for Tender Committee & Management approval!");
  };

  const handlePublishTender = () => {
    setTenderMaster((prev) => ({ ...prev, tenderStatus: "Bid Submission" }));
    toast.success("Tender published to e-Tender Portal and National Procurement Marketplace!");
  };

  const handleCreateContract = () => {
    toast.success("Contract & Purchase Order generated for ElectroMex Solutions Pvt. Ltd.!");
    setShowContractModal(false);
  };

  return (
    <AppShell
      title="Tender Management"
      breadcrumb="Management > Procurement Management"
      description="The Tender Management Form manages large-value, competitive, transparent procurement from requirement planning through tender publication, bidder participation, technical and commercial evaluation, award, contract/PO creation, and closure."
      tabs={<ProcurementManagementTabBar />}
    >
      <div className="space-y-6">
        {/* TOP TENDER MASTER BANNER & CONTROLS (Pixel-matched with design screenshot) */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          {/* Top Bar: Icon + Number + Status + Actions */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/25 shadow-xs">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Published
                  </span>
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground font-mono">
                    {tenderMaster.tenderNumber}
                  </h1>
                  <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-extrabold text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase tracking-wide">
                    {tenderMaster.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tender Issue Date: <strong className="text-foreground">{tenderMaster.tenderIssueDate}</strong> · Bid Submission Deadline:{" "}
                  <strong className="text-rose-600 dark:text-rose-400">{tenderMaster.bidSubmissionDeadline}</strong>
                </p>
              </div>
            </div>

            {/* Header Action Buttons - Streamlined & Purpose-built */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowContractModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                <FileBadge className="h-3.5 w-3.5" />
                Create Contract / PO
              </button>

              <button
                type="button"
                onClick={() => setShowNewTenderModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                New Tender
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
                title="Print Tender Docket"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
            </div>
          </div>

          {/* Master Detail Grid (Matching UI Layout) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-y-3.5 gap-x-4 text-xs">
            <div className="lg:col-span-2">
              <div className="text-[11px] text-muted-foreground font-medium">Tender Title</div>
              <div className="font-bold text-foreground mt-0.5 truncate">{tenderMaster.tenderTitle}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Tender Type</div>
              <div className="font-bold text-foreground mt-0.5">{tenderMaster.tenderType}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Tender Method</div>
              <div className="font-bold text-foreground mt-0.5">{tenderMaster.tenderMethod}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Procurement Category</div>
              <div className="font-bold text-foreground mt-0.5 truncate">{tenderMaster.procurementCategory}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Department</div>
              <div className="font-bold text-foreground mt-0.5">{tenderMaster.department}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Estimated Tender Value</div>
              <div className="text-sm font-extrabold text-foreground mt-0.5">
                ₹ {tenderMaster.estimatedTenderValue.toLocaleString("en-IN")}.00
              </div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Tender Status</div>
              <span className="inline-block mt-0.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 border border-blue-500/20">
                {tenderMaster.tenderStatus}
              </span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SUB-MODULE TABS NAVIGATION - Streamlined & Essential Only */}
        <div className="flex items-center gap-1.5 border-b border-border/80 overflow-x-auto no-scrollbar pb-px">
          {[
            { id: "scope", label: "Scope & Bill of Quantities", icon: ShoppingCart },
            { id: "bidders", label: "Bidders & Bid Submissions", icon: Users },
            { id: "evaluation", label: "Evaluation & Award Recommendation", icon: Scale },
            { id: "documents", label: "Legal Dossiers & Contract Award", icon: Paperclip },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-all border-b-2 cursor-pointer",
                  isActive
                    ? "border-primary text-primary font-bold bg-primary/5 rounded-t-lg"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SCOPE & BILL OF QUANTITIES */}
        {activeTab === "scope" && (
          <div className="space-y-6">
            {/* Scope & Parameters Card */}
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Tender Scope, Eligibility & Policy Preferences
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-muted-foreground text-[11px]">Tender Method</span>
                  <div className="text-sm font-bold text-foreground mt-0.5">{tenderMaster.tenderMethod}</div>
                  <div className="text-[10px] text-muted-foreground">Two-Envelope (Technical & Financial)</div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-muted-foreground text-[11px]">Evaluation Methodology</span>
                  <div className="text-sm font-bold text-foreground mt-0.5">{tenderMaster.evaluationMethod}</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Quality 70% / Cost 30%</div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-muted-foreground text-[11px]">Completion Timeline</span>
                  <div className="text-sm font-bold text-foreground mt-0.5">{tenderMaster.completionPeriod}</div>
                  <div className="text-[10px] text-muted-foreground">DAP Bengaluru Site</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="font-bold text-foreground">Detailed Scope of Work & Requirement Specifications:</div>
                <p className="p-3 rounded-lg bg-muted/20 border border-border text-foreground leading-relaxed">
                  {tenderMaster.scopeOfWork}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-2.5 rounded border border-border flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Domestic Preference Active</span>
                </div>
                <div className="p-2.5 rounded border border-border flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>MSME Policy Preference (15%)</span>
                </div>
                <div className="p-2.5 rounded border border-border flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Green Procurement Compliance</span>
                </div>
                <div className="p-2.5 rounded border border-border flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Earnest Money Deposit (EMD) Mandatory</span>
                </div>
              </div>
            </div>

            {/* Bill of Quantities (BoQ) Card */}
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    Bill of Quantities (BOQ) & Tender Line Items
                  </h3>
                  <p className="text-xs text-muted-foreground">Itemized scope with HSN/SAC codes, quantities, and cost center allocations</p>
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Item / Service</th>
                      <th className="py-2.5 px-3">Item Code</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">UOM</th>
                      <th className="py-2.5 px-3 text-right">Quantity</th>
                      <th className="py-2.5 px-3 text-right">Est. Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Total Estimated Value</th>
                      <th className="py-2.5 px-3">Required Date</th>
                      <th className="py-2.5 px-3">HSN/SAC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {lineItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold">{item.itemService}</div>
                          <div className="text-[11px] text-muted-foreground">{item.description}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-primary font-semibold">{item.itemCode}</td>
                        <td className="py-3 px-3 text-muted-foreground">{item.category}</td>
                        <td className="py-3 px-3">{item.uom}</td>
                        <td className="py-3 px-3 text-right font-bold">{item.quantity}</td>
                        <td className="py-3 px-3 text-right">₹ {item.estimatedUnitPrice.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-3 text-right font-bold text-foreground">
                          ₹ {item.estimatedTotal.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">{item.requiredDeliveryDate}</td>
                        <td className="py-3 px-3 font-mono text-[11px]">{item.hsnSac}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/40 font-bold border-t border-border">
                    <tr>
                      <td colSpan={7} className="py-3 px-3 text-right text-xs">Total Tender Budget Value:</td>
                      <td className="py-3 px-3 text-right text-sm font-extrabold text-foreground">
                        ₹ {tenderMaster.estimatedTenderValue.toLocaleString("en-IN")}.00
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BIDDERS & BID SUBMISSIONS */}
        {activeTab === "bidders" && (
          <div className="space-y-6">
            {/* Bidder Participation Register */}
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Bidder Participation & Eligibility Register (6 Verified Bidders)
                  </h3>
                  <p className="text-xs text-muted-foreground">Bidder registration verification, EMD proof, and formal submission logs</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBidderModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Register Bidder
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Bidder Name</th>
                      <th className="py-2.5 px-3">Bidder Code</th>
                      <th className="py-2.5 px-3">Contact Person</th>
                      <th className="py-2.5 px-3">Eligibility Check</th>
                      <th className="py-2.5 px-3">EMD Status</th>
                      <th className="py-2.5 px-3">Submission Timestamp</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {bidders.map((b) => (
                      <tr key={b.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-bold">{b.supplierName}</td>
                        <td className="py-3 px-3 font-mono text-[11px] text-primary">{b.supplierCode}</td>
                        <td className="py-3 px-3">
                          <div>{b.contactPerson}</div>
                          <div className="text-[10px] text-muted-foreground">{b.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ {b.eligibilityStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.2 text-[10px] font-semibold text-emerald-600">
                            ₹ {b.emdAmount.toLocaleString("en-IN")} Received
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground">{b.submissionDate}</td>
                        <td className="py-3 px-3">
                          <span className="rounded bg-emerald-500/10 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                            {b.bidStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Formal Bids Submissions Grid */}
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    Two-Envelope Bid Submissions Vault
                  </h3>
                  <p className="text-xs text-muted-foreground">Digital encryption vault (Technical & Commercial Bids)</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {bidders.slice(0, 6).map((b) => (
                  <div key={b.id} className="p-3.5 rounded-xl border border-border/80 bg-muted/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-border pb-1.5">
                      <span className="font-bold text-foreground truncate">{b.supplierName}</span>
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                        {b.bidNumber}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Submitted:</span>
                        <strong className="text-foreground">{b.submissionDate?.split(" ")[0]}</strong>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Total Bid Value:</span>
                        <strong className="text-foreground font-black text-sm">₹ {b.totalBidAmount?.toLocaleString("en-IN")}.00</strong>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>EMD Security:</span>
                        <span className="text-emerald-600 font-semibold">₹ {b.emdAmount.toLocaleString("en-IN")} (Verified)</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Validity:</span>
                        <span>{b.bidValidityDays} Days</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                      <span className="text-emerald-600 font-bold">Tech: {b.technicalScore}%</span>
                      <span className="font-black text-primary font-mono">{b.commercialRank}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-Bid Queries & Clarifications */}
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Pre-Bid Queries & Clarifications Register
                  </h3>
                  <p className="text-xs text-muted-foreground">Published addenda and responses visible to all participating bidders</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowClarificationModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Answer Query
                </button>
              </div>

              <div className="space-y-3">
                {clarifications.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-foreground flex items-center gap-2">
                        <span className="font-mono text-primary">{c.queryNumber}</span>
                        <span>{c.bidderName}</span>
                        <span className="rounded bg-muted px-2 py-0.2 text-[10px] text-muted-foreground">
                          {c.category}
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.2 text-[10px]">
                        {c.status}
                      </span>
                    </div>

                    <div className="font-semibold text-foreground">Q: {c.query}</div>

                    <div className="p-2.5 rounded-lg bg-background border border-border/60">
                      <div className="font-bold text-emerald-700 dark:text-emerald-300">A: {c.response}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">Published on {c.responseDate} · {c.visibility}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EVALUATION & AWARD RECOMMENDATION */}
        {activeTab === "evaluation" && (
          <div className="space-y-6">
            {/* Comparative Statement Matrix */}
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    Tender Comparative Statement (CS) Matrix
                  </h3>
                  <p className="text-xs text-muted-foreground">Side-by-side technical qualification and landed evaluated cost ranking</p>
                </div>

                <button
                  type="button"
                  onClick={() => toast.success("Tender CS exported to Excel.")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" /> Export CS
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs border border-border">
                  <thead className="bg-muted/50 text-foreground font-bold border-b border-border">
                    <tr>
                      <th className="py-3 px-4 w-48 bg-muted/70">Evaluation Parameter</th>
                      <th className="py-3 px-4 text-center bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 border-x border-border">
                        <div>ElectroMax Solutions</div>
                        <div className="text-[10px] font-normal text-muted-foreground">(Bidder A - L1 Recommended)</div>
                      </th>
                      <th className="py-3 px-4 text-center border-r border-border">
                        <div>PowerGrid Components</div>
                        <div className="text-[10px] font-normal text-muted-foreground">(Bidder B - L2)</div>
                      </th>
                      <th className="py-3 px-4 text-center">
                        <div>VoltTech Engineers</div>
                        <div className="text-[10px] font-normal text-muted-foreground">(Bidder C - L3)</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-muted-foreground">Technical Score</td>
                      <td className="py-2.5 px-4 text-center font-bold border-x border-border text-emerald-600">92%</td>
                      <td className="py-2.5 px-4 text-center font-bold border-r border-border">89%</td>
                      <td className="py-2.5 px-4 text-center font-bold text-primary">95%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-muted-foreground">Eligibility Result</td>
                      <td className="py-2.5 px-4 text-center border-x border-border font-bold text-emerald-600">Qualified</td>
                      <td className="py-2.5 px-4 text-center border-r border-border font-bold text-emerald-600">Qualified</td>
                      <td className="py-2.5 px-4 text-center font-bold text-emerald-600">Qualified</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-muted-foreground">Basic Quoted Bid</td>
                      <td className="py-2.5 px-4 text-center font-bold border-x border-border">₹ 42,50,000.00</td>
                      <td className="py-2.5 px-4 text-center font-semibold border-r border-border">₹ 41,80,000.00</td>
                      <td className="py-2.5 px-4 text-center font-semibold">₹ 44,50,000.00</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-muted-foreground">Freight & Logistics</td>
                      <td className="py-2.5 px-4 text-center border-x border-border">₹ 1,50,000.00</td>
                      <td className="py-2.5 px-4 text-center border-r border-border">₹ 2,20,000.00</td>
                      <td className="py-2.5 px-4 text-center">₹ 1,00,000.00</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-muted-foreground">Taxes (GST 18%)</td>
                      <td className="py-2.5 px-4 text-center border-x border-border">₹ 7,92,000.00</td>
                      <td className="py-2.5 px-4 text-center border-r border-border">₹ 7,92,000.00</td>
                      <td className="py-2.5 px-4 text-center">₹ 8,20,000.00</td>
                    </tr>
                    <tr className="bg-muted/30 font-black text-sm">
                      <td className="py-3 px-4 text-primary">EVALUATED BID COST</td>
                      <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400 border-x border-border">
                        ₹ 51,92,000.00
                      </td>
                      <td className="py-3 px-4 text-center border-r border-border">₹ 51,92,000.00</td>
                      <td className="py-3 px-4 text-center">₹ 53,70,000.00</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-muted-foreground">Delivery Timeline</td>
                      <td className="py-2.5 px-4 text-center font-bold border-x border-border">21 Days</td>
                      <td className="py-2.5 px-4 text-center font-bold border-r border-border text-emerald-600">15 Days</td>
                      <td className="py-2.5 px-4 text-center text-muted-foreground">30 Days</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-muted-foreground">Commercial Rank</td>
                      <td className="py-2.5 px-4 text-center font-black text-emerald-600 border-x border-border">L1</td>
                      <td className="py-2.5 px-4 text-center font-black text-blue-600 border-r border-border">L1</td>
                      <td className="py-2.5 px-4 text-center text-muted-foreground">L3</td>
                    </tr>
                    <tr className="bg-primary/5 font-extrabold text-sm">
                      <td className="py-3 px-4 text-foreground">OVERALL EVALUATION RANK</td>
                      <td className="py-3 px-4 text-center text-primary border-x border-border">
                        🏆 Rank #1 (Award)
                      </td>
                      <td className="py-3 px-4 text-center border-r border-border">Rank #2</td>
                      <td className="py-3 px-4 text-center">Rank #3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Committee Verification & Award Summary */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Tender Evaluation Committee Sign-offs
                </h3>
                <div className="space-y-2 text-xs">
                  {committee.slice(0, 3).map((c) => (
                    <div key={c.id} className="p-3 rounded-lg border border-border/80 bg-muted/20 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-foreground">{c.name}</div>
                        <div className="text-[11px] text-muted-foreground">{c.role} · {c.department}</div>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 text-[10px]">
                        ✓ Signed
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Official Award Recommendation
                  </h3>
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 dark:text-emerald-200">Recommended Vendor:</span>
                      <strong className="text-emerald-700 dark:text-emerald-300 font-extrabold text-sm">ElectroMax Solutions</strong>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Evaluated Award Value:</span>
                      <span className="font-bold text-foreground font-mono">₹ 51,92,000.00</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>QCBS Score:</span>
                      <span className="font-bold text-emerald-600">92.4 / 100 (Highest)</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground pt-1 border-t border-emerald-500/20">
                      Unanimously recommended by the Tender Committee for Purchase Order and Contract issuance.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAwardModal(true)}
                  className="w-full rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer text-center"
                >
                  Proceed to Contract Award →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LEGAL DOSSIERS & CONTRACT AWARD */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-primary" />
                    Tender Legal Dossiers & Document Library
                  </h3>
                  <p className="text-xs text-muted-foreground">Notice Inviting Tender (NIT), Scope, Specifications, BOQ, Corrigendum & Contract</p>
                </div>

                <button
                  type="button"
                  onClick={() => toast.success("Document uploaded successfully.")}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload Document
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Document Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Version</th>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Published Date</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{doc.id}</td>
                        <td className="py-3 px-3 font-bold text-foreground flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-primary" /> {doc.name}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">{doc.category}</td>
                        <td className="py-3 px-3 font-mono">{doc.version}</td>
                        <td className="py-3 px-3 text-muted-foreground">{doc.size}</td>
                        <td className="py-3 px-3 text-muted-foreground">{doc.publishedDate}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => toast.info(`Downloading ${doc.name}...`)}
                            className="text-primary hover:underline font-semibold cursor-pointer"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Action: Contract & Purchase Order Generation */}
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-foreground">Tender Execution & Contract Issuance</h4>
                <p className="text-[11px] text-muted-foreground">Generate finalized Purchase Order and formal legal supply contract for winning bidder</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/management/procurement-management/purchase-order"
                  className="rounded-lg border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Generate PO
                </Link>
                <Link
                  to="/management/procurement-management/contract-management"
                  className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                >
                  Generate Contract
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: NEW TENDER WIZARD */}
        {showNewTenderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Create New Tender Docket</h3>
                    <p className="text-xs text-muted-foreground">Draft a new high-value procurement tender</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewTenderModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-muted-foreground font-medium block mb-1">Tender Title *</label>
                  <input
                    type="text"
                    defaultValue="Smart EV Charging Infrastructure Components"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Tender Type *</label>
                  <select className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    <option>Material Tender</option>
                    <option>Service Tender</option>
                    <option>Works Tender</option>
                    <option>EPC Tender</option>
                    <option>Rate Contract Tender</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Tender Method *</label>
                  <select className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    <option>Open Tender</option>
                    <option>Limited Tender</option>
                    <option>Global Tender</option>
                    <option>Two-Stage Tender</option>
                    <option>Reverse Auction</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Estimated Tender Value (₹) *</label>
                  <input
                    type="number"
                    defaultValue={4850000}
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-bold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Bid Submission Deadline *</label>
                  <input
                    type="datetime-local"
                    defaultValue="2026-05-15T15:00"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNewTenderModal(false)}
                  className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("New tender created successfully!");
                    setShowNewTenderModal(false);
                  }}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Save & Configure BOQ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CREATE CONTRACT / PO */}
        {showContractModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileBadge className="h-4 w-4 text-emerald-500" />
                  Generate Award Contract & Purchase Order
                </h3>
                <button
                  type="button"
                  onClick={() => setShowContractModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Awarded Bidder (L1):</span>
                    <strong className="text-foreground">ElectroMex Solutions Pvt. Ltd.</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contract Number:</span>
                    <strong className="font-mono text-primary">CTR-2026-TND-0041</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Award Value:</span>
                    <strong className="text-emerald-700 dark:text-emerald-300 font-black text-sm">₹ 46,20,000.00</strong>
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Contract Start & Commissioning Target</label>
                  <input
                    type="date"
                    defaultValue="2026-06-01"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowContractModal(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateContract}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Confirm Contract Execution
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PRINT TENDER DOCKET */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl rounded-2xl border border-border bg-white text-slate-900 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <div className="text-xl font-extrabold text-slate-900 tracking-tight">MAGNERTIA SYSTEMS ERP</div>
                  <div className="text-xs font-semibold text-slate-500">NOTICE INVITING TENDER (NIT) OFFICIAL DOCKET</div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-base font-black text-slate-900">{tenderMaster.tenderNumber}</div>
                  <div className="text-slate-500">Issue Date: {tenderMaster.tenderIssueDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Tender Details</div>
                  <div className="mt-1 font-semibold">{tenderMaster.tenderTitle}</div>
                  <div className="text-slate-500">Method: {tenderMaster.tenderMethod} · Type: {tenderMaster.tenderType}</div>
                  <div className="text-slate-500">Officer: {tenderMaster.tenderOwner} (Dept: {tenderMaster.department})</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Financials & Milestones</div>
                  <div className="mt-1 font-semibold">Estimated Value: ₹ {tenderMaster.estimatedTenderValue.toLocaleString("en-IN")}.00</div>
                  <div className="text-rose-700 font-bold">Submission Deadline: {tenderMaster.bidSubmissionDeadline}</div>
                  <div className="text-slate-500">Bid Opening Date: {tenderMaster.bidOpeningDate}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Scope of Supply (Bill of Quantities)</div>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Item Description</th>
                      <th className="p-2">UOM</th>
                      <th className="p-2 text-right">Quantity</th>
                      <th className="p-2 text-right">Est. Unit Price</th>
                      <th className="p-2 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {lineItems.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="p-2 font-mono">{idx + 1}</td>
                        <td className="p-2 font-bold">{item.itemService}</td>
                        <td className="p-2">{item.uom}</td>
                        <td className="p-2 text-right font-bold">{item.quantity}</td>
                        <td className="p-2 text-right">₹ {item.estimatedUnitPrice.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-right font-bold">₹ {item.estimatedTotal.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                >
                  Print NIT PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default TenderManagementPage;
