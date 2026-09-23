import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProcurementManagementTabBar } from "@/components/erp/ProcurementManagementTabBar";
import {
  FileText,
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
  Building2,
  Calendar,
  User,
  Users,
  ShieldCheck,
  Check,
  X,
  Edit,
  Trash2,
  FileCheck,
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
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Purchase Requisition Module · Procurement Management
export const Route = createFileRoute("/management/procurement-management/purchase-requisition")({
  head: () => ({
    meta: [
      { title: "Purchase Requisition · Procurement Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Purchase Requisition Form — end-to-end requisition master, multi-line item costing, item specifications, budget checks, multi-tier approvals, sourcing review, RFQ and PO conversion tracking.",
      },
    ],
  }),
  component: PurchaseRequisitionPage,
});

// --- TYPE DEFINITIONS ---

interface PRLineItem {
  id: number;
  itemService: string;
  itemCode: string;
  description: string;
  category: string;
  uom: string;
  quantity: number;
  estimatedUnitPrice: number;
  estimatedTotal: number;
  requiredDate: string;
  preferredBrand: string;
  specification: string;
  hsnSac: string;
  taxRate: number;
  project: string;
  costCenter: string;
  status: "Active" | "Pending" | "Ordered" | "Cancelled";
}

interface ItemSpecification {
  id: number;
  prLineId: number;
  prLineName: string;
  specType: "Technical" | "Functional" | "Quality" | "Performance" | "Material" | "Dimension" | "Electrical" | "Mechanical" | "Safety" | "Compliance" | "Commercial";
  parameter: string;
  requiredValue: string;
  minValue?: string;
  maxValue?: string;
  preferredValue?: string;
  mandatory: boolean;
  remarks: string;
}

interface ApprovalStep {
  level: number;
  role: string;
  approver: string;
  approvalType: string;
  decision: "Pending" | "Approved" | "Rejected" | "Returned" | "Escalated" | "Delegated";
  comments: string;
  approvedValue: number;
  date: string;
  avatarUrl?: string;
}

interface AttachmentItem {
  id: number;
  docType: string;
  docName: string;
  fileName: string;
  version: string;
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  status: "Verified" | "Pending Review";
}

interface AmendmentItem {
  id: number;
  amendmentNumber: string;
  amendmentType: "Quantity Change" | "Specification Change" | "Delivery Date Change" | "Cost Change" | "Supplier Preference Change" | "Budget Change" | "Project Change" | "Cancellation";
  previousValue: string;
  newValue: string;
  reason: string;
  requestedBy: string;
  approvedBy: string;
  date: string;
  status: "Approved" | "Under Review" | "Rejected";
}

interface PurchaseRequisitionMaster {
  prId: string;
  prNumber: string;
  prDate: string;
  requester: string;
  employeeId: string;
  department: string;
  costCenter: string;
  businessUnit: string;
  project: string;
  requirementType: string;
  procurementCategory: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  requiredByDate: string;
  deliveryLocation: string;
  deliveryAddress: string;
  currency: string;
  estimatedTotalValue: number;
  budgetAvailable: number;
  budgetStatus: "Available" | "Partially Available" | "Not Available" | "Over Budget" | "Approval Required";
  justification: string;
  urgencyReason?: string;
  contactPerson: string;
  contactNumber: string;
  specialInstructions: string;
  purchaseType: string;
  procurementMethod: string;
  requirementSource: string;
  prStatus: "Draft" | "Submitted" | "Budget Check" | "Manager Approval" | "Procurement Review" | "Approved" | "Sourcing" | "RFQ / Quotation" | "Supplier Selection" | "PO Created" | "Partially Ordered" | "Fully Ordered" | "Closed";
  createdBy: string;
  createdOn: string;
  lastUpdated: string;
}

// --- INITIAL MOCK DATA ---

const INITIAL_PR: PurchaseRequisitionMaster = {
  prId: "PR-ID-9042",
  prNumber: "PR-2026-000145",
  prDate: "26 Apr 2026",
  requester: "Rahul Sharma",
  employeeId: "EMP-000125",
  department: "Engineering",
  costCenter: "CC-ENG-01",
  businessUnit: "Electrical Systems",
  project: "Smart EV Charging System",
  requirementType: "Direct Material",
  procurementCategory: "Electrical Components",
  priority: "High",
  requiredByDate: "15 May 2026",
  deliveryLocation: "Bengaluru Plant - Bay 4",
  deliveryAddress: "Magnertia High-Tech Campus, Plot 42, Electronic City Phase 1, Bengaluru 560100",
  currency: "INR",
  estimatedTotalValue: 485000,
  budgetAvailable: 800000,
  budgetStatus: "Available",
  justification: "Purchase of electrical components for Smart EV Charging Infrastructure pilot project. Components required for assembly and installation of charging stations. High quality and timely delivery is critical for project timeline.",
  urgencyReason: "Pilot rollout committed to OEM partner for June testing window.",
  contactPerson: "Rahul Sharma (Lead Systems Engineer)",
  contactNumber: "+91 98401 23456",
  specialInstructions: "Components must be supplied with original OEM test certificates and IP67 weather-proofing compliance.",
  purchaseType: "Direct Material",
  procurementMethod: "Competitive RFQ",
  requirementSource: "Project BOM Requisition",
  prStatus: "Procurement Review",
  createdBy: "Rahul Sharma",
  createdOn: "26 Apr 2026 10:15 AM",
  lastUpdated: "26 Apr 2026 11:45 AM",
};

const INITIAL_LINE_ITEMS: PRLineItem[] = [
  {
    id: 1,
    itemService: "Power Contactor",
    itemCode: "ELEC-CON-001",
    description: "3 Pole, 32A, 220V AC Heavy-duty Contactor",
    category: "Electrical Components",
    uom: "Nos",
    quantity: 50,
    estimatedUnitPrice: 3200,
    estimatedTotal: 160000,
    requiredDate: "15 May 2026",
    preferredBrand: "Schneider / ABB",
    specification: "3-Pole 32A Coil 230VAC DIN Rail",
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
    requiredDate: "15 May 2026",
    preferredBrand: "Secure / L&T",
    specification: "Class 1.0 Accuracy MODBUS RTU",
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
    requiredDate: "15 May 2026",
    preferredBrand: "Phoenix Contact",
    specification: "24VDC Solid State Relay Modules",
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
    requiredDate: "15 May 2026",
    preferredBrand: "Lapp / Wago",
    specification: "High-temperature copper lugs & cable ducts",
    hsnSac: "8538",
    taxRate: 18,
    project: "Smart EV Charging System",
    costCenter: "CC-ENG-01",
    status: "Active",
  },
];

const INITIAL_SPECS: ItemSpecification[] = [
  {
    id: 1,
    prLineId: 1,
    prLineName: "Power Contactor",
    specType: "Electrical",
    parameter: "Rated Operating Voltage & Current",
    requiredValue: "415V AC / 32A continuous duty",
    minValue: "380V AC",
    maxValue: "440V AC",
    preferredValue: "415V AC",
    mandatory: true,
    remarks: "IEC 60947-4-1 compliant",
  },
  {
    id: 2,
    prLineId: 1,
    prLineName: "Power Contactor",
    specType: "Safety",
    parameter: "Dielectric Strength & Insulation",
    requiredValue: "2.5 kV for 1 minute",
    minValue: "2.0 kV",
    maxValue: "3.0 kV",
    preferredValue: "2.5 kV",
    mandatory: true,
    remarks: "Flammability rating UL94 V-0",
  },
  {
    id: 3,
    prLineId: 2,
    prLineName: "Energy Meter",
    specType: "Functional",
    parameter: "Communication Protocol",
    requiredValue: "RS485 Modbus RTU Protocol",
    minValue: "9600 baud",
    maxValue: "115200 baud",
    preferredValue: "19200 baud",
    mandatory: true,
    remarks: "Must support instantaneous power & harmonic logs",
  },
  {
    id: 4,
    prLineId: 2,
    prLineName: "Energy Meter",
    specType: "Quality",
    parameter: "Measurement Accuracy Class",
    requiredValue: "Class 0.5S or Class 1.0",
    preferredValue: "Class 0.5S",
    mandatory: true,
    remarks: "MID / BIS calibration certificate required",
  },
  {
    id: 5,
    prLineId: 3,
    prLineName: "Control Components",
    specType: "Technical",
    parameter: "Control Voltage",
    requiredValue: "24V DC Regulated ±5%",
    minValue: "22V DC",
    maxValue: "26V DC",
    preferredValue: "24V DC",
    mandatory: true,
    remarks: "Reverse polarity protected",
  },
  {
    id: 6,
    prLineId: 4,
    prLineName: "Electrical Accessories",
    specType: "Material",
    parameter: "Terminal Lug Metallurgy",
    requiredValue: "Electrolytic Grade Tin-plated Copper (99.9% Cu)",
    mandatory: false,
    remarks: "RoHS 3 and REACH compliant",
  },
];

const INITIAL_APPROVALS: ApprovalStep[] = [
  {
    level: 1,
    role: "Requester",
    approver: "Rahul Sharma",
    approvalType: "Initiation",
    decision: "Approved",
    comments: "PR generated with verified engineering BOM and required technical specs.",
    approvedValue: 485000,
    date: "26 Apr 2026 10:15 AM",
  },
  {
    level: 2,
    role: "Reporting Manager",
    approver: "Arun Kumar",
    approvalType: "Technical & Justification",
    decision: "Approved",
    comments: "Technical requirements verified for EV pilot build. Quantities are aligned with plan.",
    approvedValue: 485000,
    date: "26 Apr 2026 11:45 AM",
  },
  {
    level: 3,
    role: "Department Head",
    approver: "Priya Nair",
    approvalType: "Departmental Sign-off",
    decision: "Pending",
    comments: "Awaiting review on department priority matrix.",
    approvedValue: 485000,
    date: "Pending (Due: 27 Apr)",
  },
  {
    level: 4,
    role: "Procurement Officer",
    approver: "Sneha Iyer",
    approvalType: "Sourcing & Strategy Check",
    decision: "Pending",
    comments: "RFQ supplier list formulated (4 tier-1 vendors).",
    approvedValue: 485000,
    date: "Pending",
  },
  {
    level: 5,
    role: "Finance Review",
    approver: "Vikas Jain",
    approvalType: "Financial & Budget Clearance",
    decision: "Pending",
    comments: "Budget head allocation validated.",
    approvedValue: 485000,
    date: "Pending",
  },
];

const INITIAL_ATTACHMENTS: AttachmentItem[] = [
  {
    id: 1,
    docType: "Technical Specification",
    docName: "EV_Charging_Contactor_Spec_v2.pdf",
    fileName: "EV_Charging_Contactor_Spec_v2.pdf",
    version: "v2.1",
    size: "2.4 MB",
    uploadedBy: "Rahul Sharma",
    uploadedDate: "26 Apr 2026",
    status: "Verified",
  },
  {
    id: 2,
    docType: "BOM",
    docName: "Smart_EV_Subsystem_BOM_RevC.xlsx",
    fileName: "Smart_EV_Subsystem_BOM_RevC.xlsx",
    version: "Rev C",
    size: "1.1 MB",
    uploadedBy: "Rahul Sharma",
    uploadedDate: "26 Apr 2026",
    status: "Verified",
  },
  {
    id: 3,
    docType: "Budget Approval",
    docName: "CAPEX_Allocation_Sanction_CC-ENG.pdf",
    fileName: "CAPEX_Allocation_Sanction_CC-ENG.pdf",
    version: "v1.0",
    size: "850 KB",
    uploadedBy: "Rahul Sharma",
    uploadedDate: "26 Apr 2026",
    status: "Verified",
  },
];

const INITIAL_AMENDMENTS: AmendmentItem[] = [
  {
    id: 1,
    amendmentNumber: "AMD-2026-001",
    amendmentType: "Quantity Change",
    previousValue: "Power Contactor Qty: 40 Nos",
    newValue: "Power Contactor Qty: 50 Nos (+10 for backup)",
    reason: "Added 10 units buffer for pilot qualification destructive test bench",
    requestedBy: "Rahul Sharma",
    approvedBy: "Arun Kumar",
    date: "26 Apr 2026 11:20 AM",
    status: "Approved",
  },
];

export function PurchaseRequisitionPage() {
  // Navigation & Sub-tabs
  const [activeTab, setActiveTab] = useState<string>("lineItems");

  // Master PR State
  const [prMaster, setPrMaster] = useState<PurchaseRequisitionMaster>(INITIAL_PR);
  const [lineItems, setLineItems] = useState<PRLineItem[]>(INITIAL_LINE_ITEMS);
  const [specifications, setSpecifications] = useState<ItemSpecification[]>(INITIAL_SPECS);
  const [approvals, setApprovals] = useState<ApprovalStep[]>(INITIAL_APPROVALS);
  const [attachments, setAttachments] = useState<AttachmentItem[]>(INITIAL_ATTACHMENTS);
  const [amendments, setAmendments] = useState<AmendmentItem[]>(INITIAL_AMENDMENTS);

  // Dialog & Modal states
  const [showNewPrModal, setShowNewPrModal] = useState<boolean>(false);
  const [showAddLineModal, setShowAddLineModal] = useState<boolean>(false);
  const [showAddSpecModal, setShowAddSpecModal] = useState<boolean>(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState<boolean>(false);
  const [showBudgetReallocateModal, setShowBudgetReallocateModal] = useState<boolean>(false);
  const [showApproveDialog, setShowApproveDialog] = useState<boolean>(false);
  const [showRfqModal, setShowRfqModal] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [approvalComment, setApprovalComment] = useState<string>("");

  // Document Upload Form State
  const [docUploadForm, setDocUploadForm] = useState({
    docType: "Technical Specification",
    fileName: "",
    version: "v1.0",
    uploadedBy: "Rahul Sharma",
    notes: "",
  });

  // Reallocate Budget Form State
  const [reallocateForm, setReallocateForm] = useState({
    sourceCostCenter: "CC-CORP-01 (General Operational Buffer)",
    targetCostCenter: "CC-ENG-01 (Smart EV Charging System)",
    additionalAmount: 200000,
    justification: "Additional budget allocation required for pilot destructive testing units.",
  });

  // Preferred Supplier State
  const [preferredSupplier, setPreferredSupplier] = useState({
    supplierName: "Apex Power Systems Pvt Ltd",
    supplierCode: "SUP-00241",
    reason: "OEM Authorized Tier-1 partner with 99.2% on-time delivery track record and verified ISO 9001 compliance.",
    previousPurchase: "PO-2025-00892",
    previousPrice: "₹3,150.00 / Nos",
    qualityRating: 5,
    deliveryRating: 4.8,
    contractAvailable: true,
    justification: "Preferred partner due to validated connector pinout compatibility with existing chassis tooling.",
    approvalRequired: true,
    status: "Approved for Sourcing",
  });

  // Emergency / Urgent Purchase State
  const [emergencyData, setEmergencyData] = useState({
    isEmergency: false,
    emergencyType: "Production Line Risk",
    reason: "Immediate replenishment to safeguard pilot line ramp-up date against component lead-time volatility.",
    businessImpact: "Risk of delayed OEM inspection window causing ₹2.5L scheduled lab penalty.",
    productionImpact: "Medium",
    estimatedLoss: "₹50,000 / day",
    alternativeAvailable: false,
    immediateSupplier: "Apex Power Systems",
    emergencyApprover: "Arun Kumar (Engineering Lead)",
    status: "Standard High Priority",
  });

  // Procurement Review State
  const [procurementReview, setProcurementReview] = useState({
    reviewId: "REV-2026-0041",
    officer: "Sneha Iyer",
    category: "Electrical Components",
    sourcingStrategy: "Competitive RFQ",
    existingContract: "No (Open Spot Requisition)",
    preferredSupplierAvailable: true,
    rfqRequired: true,
    tenderRequired: false,
    singleSourceJustification: "N/A - 3 Qualified vendors empaneled",
    recommendation: "Proceed with competitive RFQ to 3 empaneled tier-1 vendors (Apex, Schneider Dist, ABB Channel) to secure bulk tier volume rebate.",
    reviewDate: "27 Apr 2026",
    status: "In Review",
  });

  // Sourcing Strategy options
  const sourcingStrategies = [
    "Existing Supplier",
    "Preferred Supplier",
    "Competitive RFQ",
    "Limited Tender",
    "Open Tender",
    "Reverse Auction",
    "Single Source",
    "Emergency Procurement",
  ];

  // Calculations
  const calculatedTotalValue = useMemo(() => {
    return lineItems.reduce((acc, item) => acc + (item.quantity * item.estimatedUnitPrice), 0);
  }, [lineItems]);

  const budgetRemaining = useMemo(() => {
    return prMaster.budgetAvailable - calculatedTotalValue;
  }, [prMaster.budgetAvailable, calculatedTotalValue]);

  // Form handlers
  const handleSaveDraft = () => {
    toast.success("Purchase Requisition saved as draft successfully.");
  };

  const handleSubmitForApproval = () => {
    setPrMaster((prev) => ({ ...prev, prStatus: "Submitted" }));
    toast.success("Purchase Requisition submitted for Approval workflow!");
  };

  const handleApproveStep = (decision: "Approved" | "Rejected" | "Returned") => {
    const updated = approvals.map((step) => {
      if (step.decision === "Pending" && step.level === 3) {
        return {
          ...step,
          decision,
          comments: approvalComment || (decision === "Approved" ? "Approved by Department Head" : "Returned for clarification"),
          date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        };
      }
      return step;
    });
    setApprovals(updated);
    if (decision === "Approved") {
      setPrMaster((prev) => ({ ...prev, prStatus: "Procurement Review" }));
      toast.success("Department Head approval logged successfully!");
    } else {
      toast.warning(`Requisition has been marked as ${decision}.`);
    }
    setShowApproveDialog(false);
    setApprovalComment("");
  };

  const handleAddLineItem = (newItem: Omit<PRLineItem, "id" | "estimatedTotal">) => {
    const calculated = newItem.quantity * newItem.estimatedUnitPrice;
    const item: PRLineItem = {
      ...newItem,
      id: lineItems.length + 1,
      estimatedTotal: calculated,
    };
    const updated = [...lineItems, item];
    setLineItems(updated);
    const newTotal = updated.reduce((acc, curr) => acc + curr.estimatedTotal, 0);
    setPrMaster((prev) => ({ ...prev, estimatedTotalValue: newTotal }));
    setShowAddLineModal(false);
    toast.success(`Line item '${item.itemService}' added successfully.`);
  };

  const handleDeleteLineItem = (id: number) => {
    const updated = lineItems.filter((i) => i.id !== id);
    setLineItems(updated);
    const newTotal = updated.reduce((acc, curr) => acc + curr.estimatedTotal, 0);
    setPrMaster((prev) => ({ ...prev, estimatedTotalValue: newTotal }));
    toast.info("Line item removed.");
  };

  // Specification add & delete
  const handleAddSpec = (newSpec: Omit<ItemSpecification, "id">) => {
    const spec: ItemSpecification = {
      ...newSpec,
      id: specifications.length + 1,
    };
    setSpecifications([...specifications, spec]);
    setShowAddSpecModal(false);
    toast.success(`Specification parameter '${spec.parameter}' added.`);
  };

  const handleDeleteSpec = (id: number) => {
    setSpecifications(specifications.filter((s) => s.id !== id));
    toast.info("Specification parameter removed.");
  };

  // Document Upload, Download & Delete Handlers
  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = docUploadForm.fileName.trim() || `PR_Doc_${Date.now()}.pdf`;
    const newDoc: AttachmentItem = {
      id: attachments.length + 1,
      docType: docUploadForm.docType,
      docName: fileName,
      fileName: fileName,
      version: docUploadForm.version || "v1.0",
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      uploadedBy: docUploadForm.uploadedBy || "Rahul Sharma",
      uploadedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Verified",
    };

    setAttachments([newDoc, ...attachments]);
    setShowUploadDocModal(false);
    setDocUploadForm({
      docType: "Technical Specification",
      fileName: "",
      version: "v1.0",
      uploadedBy: "Rahul Sharma",
      notes: "",
    });
    toast.success(`Document '${newDoc.fileName}' uploaded and verified successfully!`);
  };

  const handleDeleteAttachment = (id: number, name: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
    toast.info(`Document '${name}' deleted.`);
  };

  const handleDownloadAttachment = (fileName: string) => {
    try {
      const dummyContent = `MAGNERTIA ERP - PROCUREMENT ATTACHMENT DOCKET\nRequisition Ref: PR-2026-000145\nFile Name: ${fileName}\nGenerated: ${new Date().toISOString()}\nStatus: Verified Document\n\n[Content authenticated via Magnertia ECM Gateway]`;
      const blob = new Blob([dummyContent], { type: "text/plain;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName.endsWith(".pdf") || fileName.endsWith(".xlsx") ? fileName : `${fileName}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Downloaded '${fileName}'`);
    } catch {
      toast.info(`Downloading '${fileName}'...`);
    }
  };

  const handleReallocateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const additional = Number(reallocateForm.additionalAmount) || 0;
    setPrMaster((prev) => ({
      ...prev,
      budgetAvailable: prev.budgetAvailable + additional,
      budgetStatus: "Budget Reallocated (Approved)",
    }));
    setShowBudgetReallocateModal(false);
    toast.success(`₹${additional.toLocaleString("en-IN")} buffer reallocated to Cost Center ${prMaster.costCenter}!`);
  };

  return (
    <AppShell
      title="Purchase Requisition"
      breadcrumb="Management > Procurement Management"
      description="The Purchase Requisition (PR) Form is used to formally request the purchase of goods, services, assets, materials, or subcontracting requirements before creating an RFQ, Purchase Order, or other procurement transaction."
      tabs={<ProcurementManagementTabBar />}
    >
      <div className="space-y-6">
        {/* TOP PR MASTER BANNER & CONTROLS (Pixel-matched with design) */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          {/* Top Bar: Icon + ID + Status + Actions */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/25 shadow-xs">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground font-mono">
                    {prMaster.prNumber}
                  </h1>
                  <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-bold text-sky-700 dark:text-sky-300 border border-sky-500/25">
                    {prMaster.prStatus}
                  </span>
                  <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-extrabold text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase tracking-wide">
                    {prMaster.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Internal ID: <span className="font-mono text-foreground font-semibold">{prMaster.prId}</span> · Raised on{" "}
                  <strong className="text-foreground">{prMaster.prDate}</strong> · Required by{" "}
                  <strong className="text-foreground">{prMaster.requiredByDate}</strong>
                </p>
              </div>
            </div>

            {/* Header Action Buttons - Streamlined & Purpose-built */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowRfqModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Create RFQ
              </button>

              <button
                type="button"
                onClick={() => setShowNewPrModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                New PR
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
                title="Print PR Docket"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
            </div>
          </div>

          {/* Master Detail Grid (4 columns) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Requester</div>
              <div className="font-bold text-foreground mt-0.5">{prMaster.requester}</div>
              <div className="text-[10px] text-muted-foreground font-mono">{prMaster.employeeId}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Department</div>
              <div className="font-bold text-foreground mt-0.5">{prMaster.department}</div>
              <div className="text-[10px] text-muted-foreground">BU: {prMaster.businessUnit}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Cost Center</div>
              <div className="font-bold font-mono text-foreground mt-0.5">{prMaster.costCenter}</div>
              <div className="text-[10px] text-muted-foreground truncate">{prMaster.project}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Requirement Type</div>
              <div className="font-bold text-foreground mt-0.5">{prMaster.requirementType}</div>
              <div className="text-[10px] text-muted-foreground">{prMaster.procurementCategory}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Estimated Total Value</div>
              <div className="text-sm font-extrabold text-foreground mt-0.5">
                ₹{calculatedTotalValue.toLocaleString("en-IN")}.00
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">{prMaster.currency}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Budget Check</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{prMaster.budgetAvailable.toLocaleString("en-IN")}.00
                </span>
              </div>
              <span className="inline-block mt-0.5 rounded-full bg-emerald-500/10 px-2 py-0.2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                ✓ {prMaster.budgetStatus}
              </span>
            </div>
          </div>
        </div>


        {/* INTERACTIVE SUB-MODULE TABS NAVIGATION - Streamlined & Direct */}
        <div className="flex items-center gap-1.5 border-b border-border/80 overflow-x-auto no-scrollbar pb-px">
          {[
            { id: "lineItems", label: "Line Items", icon: ShoppingCart },
            { id: "specifications", label: "Specifications", icon: FileCode },
            { id: "budget", label: "Budget Check", icon: DollarSign },
            { id: "approvals", label: "Approvals", icon: ShieldCheck },
            { id: "rfqPoTracking", label: "RFQ & PO Tracking", icon: FileCheck },
            { id: "documents", label: "Documents", icon: Paperclip },
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

        {/* TAB CONTENT: 2. LINE ITEMS */}
        {activeTab === "lineItems" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    Purchase Requisition Line Items & Costing
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Item / Service breakdown, HSN/SAC classification, UOM quantities, estimated unit pricing and line taxes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLineModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Line Item
                  </button>
                </div>
              </div>

              {/* Line Items Table */}
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
                      <th className="py-2.5 px-3 text-right">Estimated Total</th>
                      <th className="py-2.5 px-3">Required Date</th>
                      <th className="py-2.5 px-3">Preferred Brand</th>
                      <th className="py-2.5 px-3">HSN/SAC</th>
                      <th className="py-2.5 px-3 text-right">Tax %</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {lineItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-foreground">{item.itemService}</div>
                          <div className="text-[11px] text-muted-foreground max-w-[200px] truncate">{item.description}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-xs text-primary font-semibold">{item.itemCode}</td>
                        <td className="py-3 px-3 text-muted-foreground">{item.category}</td>
                        <td className="py-3 px-3 font-medium">{item.uom}</td>
                        <td className="py-3 px-3 text-right font-bold">{item.quantity}</td>
                        <td className="py-3 px-3 text-right font-medium">₹{item.estimatedUnitPrice.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-3 text-right font-bold text-foreground">
                          ₹{(item.quantity * item.estimatedUnitPrice).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground font-medium">{item.requiredDate}</td>
                        <td className="py-3 px-3">{item.preferredBrand}</td>
                        <td className="py-3 px-3 font-mono text-[11px]">{item.hsnSac}</td>
                        <td className="py-3 px-3 text-right">{item.taxRate}%</td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => toast.info(`Editing line ${item.itemService}`)}
                              className="text-muted-foreground hover:text-primary cursor-pointer p-1"
                              title="Edit Item"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLineItem(item.id)}
                              className="text-muted-foreground hover:text-rose-500 cursor-pointer p-1"
                              title="Delete Item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/40 font-bold border-t border-border">
                    <tr>
                      <td colSpan={7} className="py-3 px-3 text-right text-xs">
                        Grand Subtotal (Excl. Tax):
                      </td>
                      <td className="py-3 px-3 text-right text-sm font-extrabold text-foreground">
                        ₹{calculatedTotalValue.toLocaleString("en-IN")}.00
                      </td>
                      <td colSpan={5}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Line Calculation Formula Banner */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="font-bold text-foreground">Requisition Line Value Formula</div>
                  <div className="text-muted-foreground">
                    <span className="font-mono font-bold text-foreground">Quantity</span> ×{" "}
                    <span className="font-mono font-bold text-foreground">Estimated Unit Price</span> ={" "}
                    <span className="font-mono font-bold text-primary">Estimated Line Value</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-muted-foreground">Total Lines</span>
                <div className="text-base font-bold text-foreground">{lineItems.length} Items</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 3. SPECIFICATIONS */}
        {activeTab === "specifications" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-primary" />
                    Item Specification Form & Technical Parameters
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Categorized specs (Technical, Functional, Quality, Performance, Material, Dimension, Electrical, Mechanical, Safety, Compliance, Commercial).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddSpecModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Specification Parameter
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Spec ID</th>
                      <th className="py-2.5 px-3">PR Line Item</th>
                      <th className="py-2.5 px-3">Spec Type</th>
                      <th className="py-2.5 px-3">Parameter</th>
                      <th className="py-2.5 px-3">Required Value</th>
                      <th className="py-2.5 px-3">Min / Max Range</th>
                      <th className="py-2.5 px-3">Preferred Value</th>
                      <th className="py-2.5 px-3 text-center">Mandatory</th>
                      <th className="py-2.5 px-3">Remarks</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {specifications.map((spec) => (
                      <tr key={spec.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-3 font-mono text-muted-foreground">SPEC-{spec.id}</td>
                        <td className="py-3 px-3 font-bold text-foreground">{spec.prLineName}</td>
                        <td className="py-3 px-3">
                          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                            {spec.specType}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold">{spec.parameter}</td>
                        <td className="py-3 px-3 font-medium text-foreground">{spec.requiredValue}</td>
                        <td className="py-3 px-3 text-muted-foreground text-[11px]">
                          {spec.minValue || spec.maxValue ? `${spec.minValue || "0"} ~ ${spec.maxValue || "∞"}` : "—"}
                        </td>
                        <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-medium">
                          {spec.preferredValue || "—"}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {spec.mandatory ? (
                            <span className="rounded-full bg-rose-500/10 px-2 py-0.2 text-[10px] font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              Mandatory
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">Optional</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground max-w-[180px] truncate">{spec.remarks}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => toast.info(`Editing spec ${spec.parameter}`)}
                            className="text-muted-foreground hover:text-primary cursor-pointer p-1"
                          >
                            <Edit className="h-3.5 w-3.5" />
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

        {/* TAB CONTENT: 4. BUDGET CHECK */}
        {activeTab === "budget" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Budget Ledger Details */}
              <div className="lg:col-span-2 rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      Cost Center Budget Validation Ledger
                    </h3>
                    <p className="text-xs text-muted-foreground">Real-time funds allocation and availability audit</p>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Status: ✓ Available
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                    <span className="text-muted-foreground text-[11px]">Cost Center</span>
                    <div className="text-sm font-bold text-foreground font-mono mt-0.5">{prMaster.costCenter}</div>
                    <div className="text-[10px] text-muted-foreground">Engineering R&D</div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                    <span className="text-muted-foreground text-[11px]">Budget Head</span>
                    <div className="text-sm font-bold text-foreground font-mono mt-0.5">CAPEX-EV-INFRA-2026</div>
                    <div className="text-[10px] text-muted-foreground">Capital Equipment Head</div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                    <span className="text-muted-foreground text-[11px]">Fiscal Year</span>
                    <div className="text-sm font-bold text-foreground mt-0.5">FY 2026 - 2027</div>
                    <div className="text-[10px] text-muted-foreground">Q1 Cycle</div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-xs p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground">Annual Approved Budget:</span>
                    <strong className="text-foreground">₹10,00,000.00</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground">Allocated Budget to Date:</span>
                    <strong className="text-foreground">₹8,00,000.00</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground">Consumed / Incurred to Date:</span>
                    <strong className="text-foreground">₹2,40,000.00</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20">
                    <span>Available Budget Before PR:</span>
                    <span>₹5,60,000.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 rounded bg-primary/10 text-primary font-bold border border-primary/20">
                    <span>Current PR Estimated Value:</span>
                    <span>- ₹{calculatedTotalValue.toLocaleString("en-IN")}.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 font-black border border-emerald-500/30">
                    <span>Remaining Budget After Approval:</span>
                    <span>₹{budgetRemaining.toLocaleString("en-IN")}.00</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
                  <span>Checked By: <strong>Vikas Jain (Financial Controller)</strong></span>
                  <span>Validated: <strong>26 Apr 2026 11:30 AM</strong></span>
                </div>
              </div>

              {/* Budget Logic Card */}
              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-primary" />
                    Budget Logic & Compliance Policy
                  </h4>
                  <div className="rounded-lg bg-muted/40 p-3 text-xs font-mono text-foreground space-y-1.5">
                    <div>Available Budget (₹5,60,000)</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;−</div>
                    <div>Purchase Requisition Value (₹4,85,000)</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;=</div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">Remaining Budget (₹75,000)</div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>PR value does not exceed available cost center limit.</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>No budget head override or exception approval required.</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => toast.success("Budget re-validation check passed.")}
                    className="w-full rounded-lg border border-emerald-500/40 bg-emerald-500/10 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Re-Run Budget Validation
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowBudgetReallocateModal(true)}
                    className="w-full rounded-lg border border-border bg-card py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <DollarSign className="h-3.5 w-3.5 text-primary" /> Request Budget Reallocation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 5. APPROVALS WORKFLOW */}
        {activeTab === "approvals" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Multi-Tier Purchase Requisition Approval Workflow
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Hierarchical approval flow: Requester → Reporting Manager → Dept Head → Budget Owner → Procurement → Finance → Management
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowApproveDialog(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-primary transition-all cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Perform Approval Action
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Level</th>
                      <th className="py-2.5 px-3">Approver Role</th>
                      <th className="py-2.5 px-3">Designated Approver</th>
                      <th className="py-2.5 px-3">Approval Type</th>
                      <th className="py-2.5 px-3">Decision</th>
                      <th className="py-2.5 px-3">Comments</th>
                      <th className="py-2.5 px-3 text-right">Approved Value</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {approvals.map((step) => (
                      <tr key={step.level} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-primary">Level {step.level}</td>
                        <td className="py-3 px-3 font-bold text-foreground">{step.role}</td>
                        <td className="py-3 px-3">{step.approver}</td>
                        <td className="py-3 px-3 text-muted-foreground">{step.approvalType}</td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                              step.decision === "Approved" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                              step.decision === "Pending" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
                              step.decision === "Rejected" && "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            )}
                          >
                            {step.decision}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground max-w-[240px] truncate">{step.comments}</td>
                        <td className="py-3 px-3 text-right font-bold">₹{step.approvedValue.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-3 text-muted-foreground font-mono text-[11px]">{step.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 5. RFQ & PO TRACKING */}
        {activeTab === "rfqPoTracking" && (
          <div className="space-y-6">
            {/* RFQ Conversion Section */}
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    PR to RFQ (Request for Quotation) Conversion
                  </h3>
                  <p className="text-xs text-muted-foreground">Package approved PR lines into competitive vendor RFQs</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRfqModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Generate Multi-Supplier RFQ
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-4 text-xs">
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-muted-foreground text-[11px]">Active RFQ ID</span>
                  <div className="font-bold text-foreground font-mono mt-0.5">RFQ-2026-00089</div>
                  <div className="text-[10px] text-muted-foreground">4 Suppliers Invited</div>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-muted-foreground text-[11px]">RFQ Date</span>
                  <div className="font-bold text-foreground mt-0.5">27 Apr 2026</div>
                  <div className="text-[10px] text-muted-foreground">Due: 02 May 2026</div>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-muted-foreground text-[11px]">Procurement Owner</span>
                  <div className="font-bold text-foreground mt-0.5">Sneha Iyer</div>
                  <div className="text-[10px] text-muted-foreground">Sourcing Lead</div>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-muted-foreground text-[11px]">Conversion Status</span>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Ready for Sourcing</div>
                  <div className="text-[10px] text-muted-foreground">Quotes awaiting receipt</div>
                </div>
              </div>
            </div>

            {/* PO Tracking Section */}
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    PR to Purchase Order Order Fulfillment Tracking
                  </h3>
                  <p className="text-xs text-muted-foreground">Line-by-line ordered vs pending quantity fulfillment</p>
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2 px-3">PR Line</th>
                      <th className="py-2 px-3">Item Description</th>
                      <th className="py-2 px-3 text-right">Requisition Qty</th>
                      <th className="py-2 px-3 text-right">Ordered Qty</th>
                      <th className="py-2 px-3 text-right">Pending Qty</th>
                      <th className="py-2 px-3">PO Number</th>
                      <th className="py-2 px-3">Supplier</th>
                      <th className="py-2 px-3 text-right">Ordered Value</th>
                      <th className="py-2 px-3">Order Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {lineItems.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">Line #{item.id}</td>
                        <td className="py-2.5 px-3 font-bold">{item.itemService}</td>
                        <td className="py-2.5 px-3 text-right font-semibold">{item.quantity} {item.uom}</td>
                        <td className="py-2.5 px-3 text-right text-muted-foreground">0</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-600">{item.quantity}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground">PO-Draft-Pending</td>
                        <td className="py-2.5 px-3 text-muted-foreground">TBD via RFQ</td>
                        <td className="py-2.5 px-3 text-right font-medium">₹0.00</td>
                        <td className="py-2.5 px-3">
                          <span className="rounded-full bg-slate-500/10 px-2 py-0.2 text-[10px] font-semibold text-muted-foreground">
                            Not Ordered
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 10. DOCUMENTS & ATTACHMENTS */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-primary" />
                    PR Supporting Documents & File Attachments
                  </h3>
                  <p className="text-xs text-muted-foreground">Technical Specification, BOM, Drawings, Datasheets, Budget Approval, Supplier Quotations</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowUploadDocModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload Document
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Document Type</th>
                      <th className="py-2.5 px-3">File Name</th>
                      <th className="py-2.5 px-3">Version</th>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Uploaded By</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {attachments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{doc.id}</td>
                        <td className="py-3 px-3 font-bold text-foreground">{doc.docType}</td>
                        <td className="py-3 px-3 font-mono text-primary flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          {doc.fileName}
                        </td>
                        <td className="py-3 px-3 font-mono">{doc.version}</td>
                        <td className="py-3 px-3 text-muted-foreground">{doc.size}</td>
                        <td className="py-3 px-3">{doc.uploadedBy}</td>
                        <td className="py-3 px-3 text-muted-foreground">{doc.uploadedDate}</td>
                        <td className="py-3 px-3">
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleDownloadAttachment(doc.fileName)}
                              className="text-primary hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" /> Download
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAttachment(doc.id, doc.fileName)}
                              className="text-muted-foreground hover:text-rose-600 p-1 cursor-pointer transition-colors"
                              title="Delete Document"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}



        {/* MODAL: NEW PURCHASE REQUISITION CREATION WIZARD */}
        {showNewPrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Create New Purchase Requisition</h3>
                    <p className="text-xs text-muted-foreground">Generate a new PR draft for procurement routing</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPrModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Requisition Title *</label>
                  <input
                    type="text"
                    defaultValue="Electrical components for Smart EV Charging Infrastructure"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Requester Employee *</label>
                  <input
                    type="text"
                    defaultValue="Rahul Sharma (EMP-000125)"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Department *</label>
                  <select className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    <option>Engineering</option>
                    <option>Production</option>
                    <option>Projects</option>
                    <option>IT & Systems</option>
                    <option>Admin & Facilities</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Cost Center *</label>
                  <input
                    type="text"
                    defaultValue="CC-ENG-01"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Priority Level *</label>
                  <select className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    <option>High</option>
                    <option>Critical</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Required Delivery Date *</label>
                  <input
                    type="date"
                    defaultValue="2026-05-15"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-muted-foreground font-medium block mb-1">Business Justification *</label>
                  <textarea
                    rows={2}
                    defaultValue="Pilot rollout committed to OEM partner. Urgent procurement required."
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNewPrModal(false)}
                  className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("New PR created and opened.");
                    setShowNewPrModal(false);
                  }}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Create PR & Add Items
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD LINE ITEM */}
        {showAddLineModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" /> Add Requisition Line Item
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddLineModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-muted-foreground font-medium block mb-1">Item / Service Name *</label>
                  <input
                    id="new-item-name"
                    type="text"
                    placeholder="e.g. Industrial Sensor Module"
                    defaultValue="High-Voltage DC Contactor"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Item Code</label>
                  <input
                    id="new-item-code"
                    type="text"
                    placeholder="ELEC-CON-002"
                    defaultValue="ELEC-CON-002"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">UOM *</label>
                  <select id="new-item-uom" className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    <option>Nos</option>
                    <option>Set</option>
                    <option>Lot</option>
                    <option>Kg</option>
                    <option>Mtr</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Quantity *</label>
                  <input
                    id="new-item-qty"
                    type="number"
                    defaultValue={20}
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-bold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Est. Unit Price (₹) *</label>
                  <input
                    id="new-item-price"
                    type="number"
                    defaultValue={4200}
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddLineModal(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nameEl = document.getElementById("new-item-name") as HTMLInputElement;
                    const codeEl = document.getElementById("new-item-code") as HTMLInputElement;
                    const uomEl = document.getElementById("new-item-uom") as HTMLSelectElement;
                    const qtyEl = document.getElementById("new-item-qty") as HTMLInputElement;
                    const priceEl = document.getElementById("new-item-price") as HTMLInputElement;

                    handleAddLineItem({
                      itemService: nameEl?.value || "Item",
                      itemCode: codeEl?.value || "ITEM-001",
                      description: "Added line item specification",
                      category: "Electrical",
                      uom: uomEl?.value || "Nos",
                      quantity: Number(qtyEl?.value || 1),
                      estimatedUnitPrice: Number(priceEl?.value || 100),
                      requiredDate: "15 May 2026",
                      preferredBrand: "Schneider / ABB",
                      specification: "Standard industrial rating",
                      hsnSac: "8536",
                      taxRate: 18,
                      project: prMaster.project,
                      costCenter: prMaster.costCenter,
                      status: "Active",
                    });
                  }}
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD SPECIFICATION */}
        {showAddSpecModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground">Add Specification Parameter</h3>
                <button
                  type="button"
                  onClick={() => setShowAddSpecModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Target Line Item</label>
                  <select id="spec-item" className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    {lineItems.map((i) => (
                      <option key={i.id} value={i.id}>{i.itemService}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Specification Type</label>
                  <select id="spec-type" className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    <option>Technical</option>
                    <option>Functional</option>
                    <option>Quality</option>
                    <option>Performance</option>
                    <option>Material</option>
                    <option>Dimension</option>
                    <option>Electrical</option>
                    <option>Mechanical</option>
                    <option>Safety</option>
                    <option>Compliance</option>
                    <option>Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Parameter Name *</label>
                  <input
                    id="spec-param"
                    type="text"
                    defaultValue="Insulation Resistance"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Required Value *</label>
                  <input
                    id="spec-val"
                    type="text"
                    defaultValue="> 100 MΩ at 500V DC"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddSpecModal(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const typeEl = document.getElementById("spec-type") as HTMLSelectElement;
                    const paramEl = document.getElementById("spec-param") as HTMLInputElement;
                    const valEl = document.getElementById("spec-val") as HTMLInputElement;

                    handleAddSpec({
                      prLineId: 1,
                      prLineName: "Power Contactor",
                      specType: (typeEl?.value as any) || "Technical",
                      parameter: paramEl?.value || "Param",
                      requiredValue: valEl?.value || "Required Val",
                      mandatory: true,
                      remarks: "Standard tolerance",
                    });
                  }}
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Save Spec
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: APPROVAL DIALOG */}
        {showApproveDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Department Head Approval Action
                </h3>
                <button
                  type="button"
                  onClick={() => setShowApproveDialog(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PR Number:</span>
                    <strong className="font-mono text-foreground">{prMaster.prNumber}</strong>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-muted-foreground">Total Approved Value:</span>
                    <strong className="text-primary font-bold">₹{calculatedTotalValue.toLocaleString("en-IN")}.00</strong>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-muted-foreground">Budget Head:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Available (₹{budgetRemaining.toLocaleString("en-IN")} buffer)</span>
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Approval Comments & Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Enter approval justification or instructions for procurement..."
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background p-2.5 text-foreground leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => handleApproveStep("Returned")}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 cursor-pointer"
                >
                  Return for Mod
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApproveStep("Rejected")}
                    className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                  >
                    Reject PR
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveStep("Approved")}
                    className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
                  >
                    Approve PR
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CREATE RFQ PACKAGE */}
        {showRfqModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-primary" /> Create RFQ Package from PR
                </h3>
                <button
                  type="button"
                  onClick={() => setShowRfqModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-muted-foreground">
                  Convert approved PR line items into an official Request for Quotation (RFQ) for multi-supplier bidding.
                </p>

                <div className="p-3 rounded-lg bg-muted/20 border border-border/70 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Generated RFQ Code:</span>
                    <strong className="font-mono text-primary">RFQ-2026-000145</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Line Items Count:</span>
                    <strong className="text-foreground">{lineItems.length} items</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target Vendors:</span>
                    <span className="text-foreground font-semibold">3 Tier-1 Empaneled Vendors</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowRfqModal(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("RFQ created successfully! Redirecting to Sourcing Hub...");
                    setShowRfqModal(false);
                    setActiveTab("rfqPoTracking");
                  }}
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Dispatch RFQ to Vendors
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PRINT SLIP VIEW */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl rounded-2xl border border-border bg-white text-slate-900 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <div className="text-xl font-extrabold text-slate-900 tracking-tight">MAGNERTIA SYSTEMS ERP</div>
                  <div className="text-xs font-semibold text-slate-500">OFFICIAL PURCHASE REQUISITION DOCKET</div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-base font-black text-slate-900">{prMaster.prNumber}</div>
                  <div className="text-slate-500">Date: {prMaster.prDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Requester Details</div>
                  <div className="mt-1 font-semibold">{prMaster.requester} ({prMaster.employeeId})</div>
                  <div className="text-slate-500">{prMaster.department} · {prMaster.costCenter}</div>
                  <div className="text-slate-500">Project: {prMaster.project}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Procurement & Budget</div>
                  <div className="mt-1 font-semibold">Priority: {prMaster.priority}</div>
                  <div className="text-slate-500">Required By: {prMaster.requiredByDate}</div>
                  <div className="text-emerald-700 font-bold">Budget Status: Verified ({prMaster.budgetStatus})</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Requisition Line Items</div>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Item</th>
                      <th className="p-2">Code</th>
                      <th className="p-2">UOM</th>
                      <th className="p-2 text-right">Qty</th>
                      <th className="p-2 text-right">Est. Unit Price</th>
                      <th className="p-2 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {lineItems.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="p-2 font-mono">{idx + 1}</td>
                        <td className="p-2 font-bold">{item.itemService}</td>
                        <td className="p-2 font-mono text-[11px]">{item.itemCode}</td>
                        <td className="p-2">{item.uom}</td>
                        <td className="p-2 text-right font-bold">{item.quantity}</td>
                        <td className="p-2 text-right">₹{item.estimatedUnitPrice.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-right font-bold">₹{item.estimatedTotal.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t border-slate-300">
                    <tr>
                      <td colSpan={6} className="p-2 text-right">Estimated Total:</td>
                      <td className="p-2 text-right font-extrabold text-sm">₹{calculatedTotalValue.toLocaleString("en-IN")}.00</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-300 text-center text-xs">
                <div>
                  <div className="h-12 border-b border-slate-400 mb-1"></div>
                  <span className="font-semibold text-slate-700">Requester Signature</span>
                </div>
                <div>
                  <div className="h-12 border-b border-slate-400 mb-1"></div>
                  <span className="font-semibold text-slate-700">Manager Approval</span>
                </div>
                <div>
                  <div className="h-12 border-b border-slate-400 mb-1"></div>
                  <span className="font-semibold text-slate-700">Procurement / Finance</span>
                </div>
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
                  onClick={() => {
                    window.print();
                  }}
                  className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                >
                  Confirm & Print PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PR CANCELLATION */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Cancel Purchase Requisition
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Cancellation Reason Code *</label>
                  <select className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    <option>Requirement No Longer Needed</option>
                    <option>Budget Not Approved</option>
                    <option>Duplicate Request</option>
                    <option>Project Cancelled</option>
                    <option>Alternative Available</option>
                    <option>Item Available in Stock</option>
                    <option>Requirement Changed</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Detailed Explanation</label>
                  <textarea
                    rows={3}
                    placeholder="State reason for cancelling requisition..."
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPrMaster((prev) => ({ ...prev, prStatus: "Closed" }));
                    setShowCancelModal(false);
                    toast.error("Purchase Requisition has been marked as Cancelled.");
                  }}
                  className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: UPLOAD DOCUMENT & ATTACHMENT */}
        {showUploadDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Upload Supporting Document</h3>
                    <p className="text-xs text-muted-foreground">Attach technical specs, BOM, CAD drawings or quotes to PR</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUploadDocModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleUploadDocument} className="space-y-3.5 text-xs">
                {/* File Dropzone Picker */}
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Select File *</label>
                  <div className="rounded-xl border-2 border-dashed border-border/80 bg-muted/20 p-5 text-center hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-primary mb-2 opacity-80" />
                    <div className="font-semibold text-foreground">
                      {docUploadForm.fileName ? (
                        <span className="text-primary font-mono">{docUploadForm.fileName}</span>
                      ) : (
                        "Click to browse or drop file here"
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Supports PDF, XLSX, DOCX, CAD Drawings (Max 25MB)
                    </p>
                    <input
                      type="file"
                      required={!docUploadForm.fileName}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDocUploadForm((prev) => ({
                            ...prev,
                            fileName: file.name,
                          }));
                        }
                      }}
                      className="mt-3 block w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Document Type *</label>
                    <select
                      value={docUploadForm.docType}
                      onChange={(e) => setDocUploadForm({ ...docUploadForm, docType: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Technical Specification</option>
                      <option>BOM (Bill of Materials)</option>
                      <option>Engineering Drawing (CAD)</option>
                      <option>Budget Approval Sanction</option>
                      <option>Supplier Quotation</option>
                      <option>Datasheet / Compliance Certificate</option>
                      <option>Other Attachment</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Document Version</label>
                    <input
                      type="text"
                      placeholder="e.g. v2.1 or Rev C"
                      value={docUploadForm.version}
                      onChange={(e) => setDocUploadForm({ ...docUploadForm, version: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Verification / Technical Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Optional notes or engineering remarks..."
                    value={docUploadForm.notes}
                    onChange={(e) => setDocUploadForm({ ...docUploadForm, notes: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowUploadDocModal(false)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload & Attach to PR
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: REQUEST BUDGET REALLOCATION */}
        {showBudgetReallocateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Request Budget Reallocation</h3>
                    <p className="text-xs text-muted-foreground">Transfer cost center buffer to fulfill requisition requirement</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBudgetReallocateModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleReallocateBudget} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Source Cost Center (Transfer From)</label>
                  <select
                    value={reallocateForm.sourceCostCenter}
                    onChange={(e) => setReallocateForm({ ...reallocateForm, sourceCostCenter: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                  >
                    <option>CC-CORP-01 (General Operational Buffer)</option>
                    <option>CC-ENG-CONT (Engineering Contingency Pool)</option>
                    <option>CC-CAPEX-RES (Capital Expenditure Reserve)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Target Cost Center</label>
                    <input
                      type="text"
                      disabled
                      value={prMaster.costCenter}
                      className="w-full rounded-lg border border-border bg-muted/50 p-2 text-foreground font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Additional Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      value={reallocateForm.additionalAmount}
                      onChange={(e) => setReallocateForm({ ...reallocateForm, additionalAmount: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-emerald-600 dark:text-emerald-400 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Business Justification *</label>
                  <textarea
                    rows={2}
                    required
                    value={reallocateForm.justification}
                    onChange={(e) => setReallocateForm({ ...reallocateForm, justification: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowBudgetReallocateModal(false)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                  >
                    Confirm & Reallocate Budget
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
