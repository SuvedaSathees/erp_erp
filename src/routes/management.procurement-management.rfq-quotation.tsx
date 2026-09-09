import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProcurementManagementTabBar } from "@/components/erp/ProcurementManagementTabBar";
import {
  FileCheck,
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
  ArrowDownRight,
  TrendingDown,
  Package,
  FileBadge,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Request for Quotation (RFQ) Module · Procurement Management
export const Route = createFileRoute("/management/procurement-management/rfq-quotation")({
  head: () => ({
    meta: [
      { title: "Request for Quotation (RFQ) · Procurement Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "RFQ Form — end-to-end supplier bidding, quotation receipt, technical & commercial evaluations, comparative statements, negotiations, supplier scorecards, and Purchase Order generation.",
      },
    ],
  }),
  component: RfqQuotationPage,
});

// --- DATA STRUCTURES ---

interface RFQLineItem {
  id: number;
  itemService: string;
  itemCode: string;
  description: string;
  category: string;
  uom: string;
  quantity: number;
  targetPrice: number;
  estimatedTotal: number;
  requiredDeliveryDate: string;
  hsnSac: string;
  taxRate: number;
  project: string;
  costCenter: string;
  status: "Active" | "Pending" | "Awarded" | "Cancelled";
}

interface RFQTechnicalSpec {
  id: number;
  rfqLineId: number;
  rfqLineName: string;
  category: "Technical" | "Functional" | "Electrical" | "Mechanical" | "Material" | "Quality" | "Performance" | "Safety" | "Environmental" | "Regulatory" | "Commercial";
  parameter: string;
  requirement: string;
  minValue?: string;
  maxValue?: string;
  preferredValue?: string;
  mandatory: boolean;
  evaluationWeight: number; // percentage
  complianceRequired: boolean;
  remarks: string;
}

interface InvitedSupplier {
  id: number;
  supplierName: string;
  supplierCode: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  isPreferred: boolean;
  rfqSentDate: string;
  responseDueDate: string;
  invitationStatus: "Selected" | "RFQ Sent" | "Acknowledged" | "Quotation Received" | "Evaluated";
  responseStatus: "Pending" | "Acknowledged" | "Interested" | "Declined" | "Quotation Submitted" | "Late Submission" | "Disqualified";
  reminderCount: number;
  eligibility: {
    activeVendor: boolean;
    approvedVendor: boolean;
    categoryEligible: boolean;
    qualityRating: number;
    deliveryRating: number;
    financialStatus: "Strong" | "Moderate" | "Review Required";
    complianceStatus: "Compliant" | "Pending Audit";
    blacklisted: boolean;
    conflictCheck: "Clear" | "Potential Flag";
    result: "Eligible" | "Conditionally Eligible" | "Under Review" | "Not Eligible" | "Disqualified";
  };
}

interface SupplierQuotation {
  id: number;
  supplierId: number;
  supplierName: string;
  quoteNumber: string;
  quoteDate: string;
  receivedDate: string;
  validUntil: string;
  currency: string;
  subtotal: number;
  discount: number;
  freight: number;
  insurance: number;
  tax: number;
  otherCharges: number;
  grandTotal: number;
  landedCost: number;
  paymentTerms: string;
  deliveryTerms: string;
  deliveryLeadTimeDays: number;
  status: "Received" | "Under Technical Review" | "Under Commercial Review" | "Qualified" | "Disqualified";
  lineItems: {
    rfqLineId: number;
    itemService: string;
    quotedBrand: string;
    quotedModel: string;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
    netUnitPrice: number;
    taxRate: number;
    totalValue: number;
    complianceStatus: "Fully Compliant" | "Partially Compliant" | "Deviation" | "Non-Compliant" | "Alternative Offered";
    deviationNotes?: string;
  }[];
}

interface TechnicalEvaluationItem {
  supplierId: number;
  supplierName: string;
  evaluator: string;
  date: string;
  specComplianceScore: number; // e.g. 95%
  qualityScore: number; // e.g. 90%
  performanceScore: number; // e.g. 92%
  documentationScore: number; // e.g. 90%
  technicalScore: number; // Overall technical weighted score
  recommendation: "Qualified" | "Conditionally Qualified" | "Clarification Required" | "Rejected";
  comments: string;
}

interface CommercialEvaluationItem {
  supplierId: number;
  supplierName: string;
  basicPrice: number;
  discount: number;
  freight: number;
  insurance: number;
  taxes: number;
  otherCharges: number;
  landedCost: number;
  deliveryTimeDays: number;
  paymentScore: number;
  deliveryScore: number;
  commercialScore: number;
  commercialRank: number;
  overallRank: number;
  recommendation: "Recommended" | "Under Review" | "Alternative" | "Rejected";
}

interface RFQClarification {
  id: number;
  supplierName: string;
  clarificationType: "Technical" | "Commercial" | "Delivery" | "Quality" | "Compliance";
  question: string;
  requestedBy: string;
  requestedDate: string;
  response: string;
  responseDate: string;
  impactOnEvaluation: "No Impact" | "Spec Updated" | "Price Impact" | "Pending";
  status: "Resolved" | "Open";
}

interface RFQNegotiation {
  id: number;
  roundNumber: number;
  supplierName: string;
  date: string;
  type: "Price" | "Delivery" | "Payment" | "Comprehensive";
  originalValue: number;
  negotiatedValue: number;
  savings: number;
  savingsPercent: number;
  deliveryImprovement: string;
  paymentImprovement: string;
  notes: string;
  negotiatedBy: string;
  status: "Completed" | "In Progress";
}

// --- INITIAL MASTER DATA ---

const INITIAL_RFQ_MASTER = {
  rfqId: "RFQ-ID-8041",
  rfqNumber: "RFQ-2026-000089",
  rfqDate: "28 Apr 2026",
  rfqTitle: "Electrical Components for EV Charging System",
  rfqType: "Material RFQ",
  sourceType: "PR",
  sourcePrNumber: "PR-2026-000145",
  sourcePrDate: "26 Apr 2026",
  procurementCategory: "Electrical Components",
  buyerOfficer: "Rahul Sharma",
  department: "Engineering",
  project: "Smart EV Charging System",
  priority: "High" as const,
  rfqIssueDate: "28 Apr 2026 15:00",
  quotationDueDate: "05 May 2026 17:00",
  expectedDeliveryDate: "20 May 2026",
  expectedPoDate: "07 May 2026",
  quoteValidityDays: 30,
  currency: "INR",
  estimatedValue: 485000,
  suppliersInvited: 5,
  evaluationMethod: "QCBS (Quality & Cost Based Selection)",
  sourcingStrategy: "Competitive RFQ",
  rfqStatus: "Issued" as const,
  requirementSummary: "Procurement of critical power contactors, digital energy meters, and modular control kits for pilot EV charging station assembly.",
  deliveryLocation: "Bengaluru Plant - Bay 4",
  deliveryTerms: "DAP - Delivered at Place, Electronic City Campus",
  paymentTerms: "Net 45 Days from GRN Acceptance",
  incoterms: "DAP Bengaluru",
  contactPerson: "Rahul Sharma (Procurement Officer)",
  contactEmail: "rahul.sharma@magnertia.com",
  contactNumber: "+91 98401 23456",
  specialInstructions: "Quotations must include OEM calibration test certificates, IP67 enclosure validation, and 24-month comprehensive replacement warranty.",
};

const INITIAL_LINE_ITEMS: RFQLineItem[] = [
  {
    id: 1,
    itemService: "Power Contactor",
    itemCode: "ELEC-CON-001",
    description: "3 Pole, 32A, 220V AC Heavy-Duty Contactor",
    category: "Electrical Components",
    uom: "Nos",
    quantity: 50,
    targetPrice: 3200,
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
    targetPrice: 4500,
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
    targetPrice: 2500,
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
    targetPrice: 87500,
    estimatedTotal: 87500,
    requiredDeliveryDate: "15 May 2026",
    hsnSac: "8538",
    taxRate: 18,
    project: "Smart EV Charging System",
    costCenter: "CC-ENG-01",
    status: "Active",
  },
];

const INITIAL_SPECS: RFQTechnicalSpec[] = [
  {
    id: 1,
    rfqLineId: 1,
    rfqLineName: "Power Contactor",
    category: "Electrical",
    parameter: "Rated Voltage & Continuous Current",
    requirement: "415V AC / 32A continuous duty (IEC 60947-4-1)",
    minValue: "380V AC",
    maxValue: "440V AC",
    preferredValue: "415V AC",
    mandatory: true,
    evaluationWeight: 25,
    complianceRequired: true,
    remarks: "Must withstand 100k electrical endurance cycles",
  },
  {
    id: 2,
    rfqLineId: 1,
    rfqLineName: "Power Contactor",
    category: "Safety",
    parameter: "Dielectric Strength & Flammability",
    requirement: "2.5 kV for 1 minute, UL94 V-0 flame retardant housing",
    minValue: "2.0 kV",
    maxValue: "3.0 kV",
    preferredValue: "2.5 kV",
    mandatory: true,
    evaluationWeight: 15,
    complianceRequired: true,
    remarks: "Certified test report mandatory",
  },
  {
    id: 3,
    rfqLineId: 2,
    rfqLineName: "Energy Meter",
    category: "Functional",
    parameter: "MODBUS RTU RS485 Protocol",
    requirement: "RS485 half-duplex isolated interface with register map",
    minValue: "9600 baud",
    maxValue: "115200 baud",
    preferredValue: "19200 baud",
    mandatory: true,
    evaluationWeight: 20,
    complianceRequired: true,
    remarks: "Support instant kW, kWh, PF, and THD telemetry",
  },
  {
    id: 4,
    rfqLineId: 2,
    rfqLineName: "Energy Meter",
    category: "Quality",
    parameter: "Measurement Accuracy Class",
    requirement: "Class 0.5S or Class 1.0 (IEC 62053-22)",
    preferredValue: "Class 0.5S",
    mandatory: true,
    evaluationWeight: 15,
    complianceRequired: true,
    remarks: "BIS / MID calibrated",
  },
  {
    id: 5,
    rfqLineId: 3,
    rfqLineName: "Control Components",
    category: "Technical",
    parameter: "Operating Voltage & Isolation",
    requirement: "24V DC Regulated ±5% with opto-isolation 3.75kV",
    minValue: "22V DC",
    maxValue: "26V DC",
    preferredValue: "24V DC",
    mandatory: true,
    evaluationWeight: 15,
    complianceRequired: true,
    remarks: "Reverse polarity protected",
  },
  {
    id: 6,
    rfqLineId: 4,
    rfqLineName: "Electrical Accessories",
    category: "Material",
    parameter: "Terminal Lug Copper Metallurgy",
    requirement: "99.9% Electrolytic Grade Tin-Plated Copper (RoHS compliant)",
    mandatory: false,
    evaluationWeight: 10,
    complianceRequired: true,
    remarks: "DIN 46235 crimping standard",
  },
];

const INITIAL_SUPPLIERS: InvitedSupplier[] = [
  {
    id: 1,
    supplierName: "ElectroMex Solutions Pvt. Ltd.",
    supplierCode: "SUP-00125",
    contactPerson: "Arvind Joshi",
    email: "arvind@electromex.in",
    phone: "+91 98230 44551",
    category: "Authorized Distributor",
    isPreferred: true,
    rfqSentDate: "28 Apr 2026 15:00",
    responseDueDate: "05 May 2026 17:00",
    invitationStatus: "Quotation Received",
    responseStatus: "Quotation Submitted",
    reminderCount: 0,
    eligibility: {
      activeVendor: true,
      approvedVendor: true,
      categoryEligible: true,
      qualityRating: 4.9,
      deliveryRating: 4.8,
      financialStatus: "Strong",
      complianceStatus: "Compliant",
      blacklisted: false,
      conflictCheck: "Clear",
      result: "Eligible",
    },
  },
  {
    id: 2,
    supplierName: "PowerGrid Components",
    supplierCode: "SUP-00128",
    contactPerson: "Meera Krishnan",
    email: "sales@powergridcomp.com",
    phone: "+91 97410 88231",
    category: "OEM Partner",
    isPreferred: false,
    rfqSentDate: "28 Apr 2026 15:00",
    responseDueDate: "05 May 2026 17:00",
    invitationStatus: "Quotation Received",
    responseStatus: "Quotation Submitted",
    reminderCount: 0,
    eligibility: {
      activeVendor: true,
      approvedVendor: true,
      categoryEligible: true,
      qualityRating: 4.7,
      deliveryRating: 4.6,
      financialStatus: "Strong",
      complianceStatus: "Compliant",
      blacklisted: false,
      conflictCheck: "Clear",
      result: "Eligible",
    },
  },
  {
    id: 3,
    supplierName: "VoltTech Engineers",
    supplierCode: "SUP-00131",
    contactPerson: "Sanjay Singhal",
    email: "bids@volttech.co.in",
    phone: "+91 99100 33412",
    category: "Manufacturer",
    isPreferred: false,
    rfqSentDate: "28 Apr 2026 15:00",
    responseDueDate: "05 May 2026 17:00",
    invitationStatus: "Quotation Received",
    responseStatus: "Quotation Submitted",
    reminderCount: 1,
    eligibility: {
      activeVendor: true,
      approvedVendor: true,
      categoryEligible: true,
      qualityRating: 4.8,
      deliveryRating: 4.5,
      financialStatus: "Strong",
      complianceStatus: "Compliant",
      blacklisted: false,
      conflictCheck: "Clear",
      result: "Eligible",
    },
  },
  {
    id: 4,
    supplierName: "Apex Power Systems",
    supplierCode: "SUP-00241",
    contactPerson: "Rajesh Bhatia",
    email: "rbhatia@apexpower.com",
    phone: "+91 98450 11223",
    category: "Tier-1 Integrator",
    isPreferred: true,
    rfqSentDate: "28 Apr 2026 15:00",
    responseDueDate: "05 May 2026 17:00",
    invitationStatus: "Acknowledged",
    responseStatus: "Interested",
    reminderCount: 2,
    eligibility: {
      activeVendor: true,
      approvedVendor: true,
      categoryEligible: true,
      qualityRating: 4.9,
      deliveryRating: 4.9,
      financialStatus: "Strong",
      complianceStatus: "Compliant",
      blacklisted: false,
      conflictCheck: "Clear",
      result: "Eligible",
    },
  },
  {
    id: 5,
    supplierName: "SwitchCraft India",
    supplierCode: "SUP-00302",
    contactPerson: "Deepak Patel",
    email: "tender@switchcraft.in",
    phone: "+91 98200 99881",
    category: "Component Stockist",
    isPreferred: false,
    rfqSentDate: "28 Apr 2026 15:00",
    responseDueDate: "05 May 2026 17:00",
    invitationStatus: "RFQ Sent",
    responseStatus: "Declined",
    reminderCount: 0,
    eligibility: {
      activeVendor: true,
      approvedVendor: false,
      categoryEligible: true,
      qualityRating: 4.2,
      deliveryRating: 4.0,
      financialStatus: "Moderate",
      complianceStatus: "Compliant",
      blacklisted: false,
      conflictCheck: "Clear",
      result: "Conditionally Eligible",
    },
  },
];

const INITIAL_QUOTATIONS: SupplierQuotation[] = [
  {
    id: 1,
    supplierId: 1,
    supplierName: "ElectroMex Solutions Pvt. Ltd.",
    quoteNumber: "Q-2026-125",
    quoteDate: "02 May 2026",
    receivedDate: "02 May 2026 11:20 AM",
    validUntil: "02 Jun 2026",
    currency: "INR",
    subtotal: 425000,
    discount: 16500, // net basic = 4,08,500
    freight: 15000,
    insurance: 2500,
    tax: 73530, // 18%
    otherCharges: 0,
    grandTotal: 408500,
    landedCost: 499530,
    paymentTerms: "Net 45 Days",
    deliveryTerms: "DAP Bengaluru Plant",
    deliveryLeadTimeDays: 21,
    status: "Qualified",
    lineItems: [
      {
        rfqLineId: 1,
        itemService: "Power Contactor",
        quotedBrand: "Schneider Electric",
        quotedModel: "TeSys D LC1D32M7",
        quantity: 50,
        unitPrice: 2850,
        discountPercent: 4,
        netUnitPrice: 2736,
        taxRate: 18,
        totalValue: 136800,
        complianceStatus: "Fully Compliant",
      },
      {
        rfqLineId: 2,
        itemService: "Energy Meter",
        quotedBrand: "Secure Meters",
        quotedModel: "Elite 440 Class 0.5S",
        quantity: 25,
        unitPrice: 4100,
        discountPercent: 3,
        netUnitPrice: 3977,
        taxRate: 18,
        totalValue: 99425,
        complianceStatus: "Fully Compliant",
      },
      {
        rfqLineId: 3,
        itemService: "Control Components",
        quotedBrand: "Phoenix Contact",
        quotedModel: "RIF-1-RSC-LDP-24DC",
        quantity: 50,
        unitPrice: 2200,
        discountPercent: 5,
        netUnitPrice: 2090,
        taxRate: 18,
        totalValue: 104500,
        complianceStatus: "Fully Compliant",
      },
      {
        rfqLineId: 4,
        itemService: "Electrical Accessories",
        quotedBrand: "Lapp Group",
        quotedModel: "EP-Terminal Lot Rev2",
        quantity: 1,
        unitPrice: 67775,
        discountPercent: 0,
        netUnitPrice: 67775,
        taxRate: 18,
        totalValue: 67775,
        complianceStatus: "Fully Compliant",
      },
    ],
  },
  {
    id: 2,
    supplierId: 2,
    supplierName: "PowerGrid Components",
    quoteNumber: "Q-2026-128",
    quoteDate: "02 May 2026",
    receivedDate: "02 May 2026 16:45 PM",
    validUntil: "01 Jun 2026",
    currency: "INR",
    subtotal: 438000,
    discount: 13700,
    freight: 22000,
    insurance: 3000,
    tax: 76374,
    otherCharges: 0,
    grandTotal: 424300,
    landedCost: 525674,
    paymentTerms: "Net 30 Days",
    deliveryTerms: "FOB Ex-Works Chennai",
    deliveryLeadTimeDays: 15,
    status: "Qualified",
    lineItems: [
      {
        rfqLineId: 1,
        itemService: "Power Contactor",
        quotedBrand: "ABB Ltd",
        quotedModel: "AF30-30-00-13",
        quantity: 50,
        unitPrice: 2950,
        discountPercent: 3,
        netUnitPrice: 2861.5,
        taxRate: 18,
        totalValue: 143075,
        complianceStatus: "Fully Compliant",
      },
      {
        rfqLineId: 2,
        itemService: "Energy Meter",
        quotedBrand: "L&T Electrical",
        quotedModel: "Quasar Class 1.0",
        quantity: 25,
        unitPrice: 4250,
        discountPercent: 4,
        netUnitPrice: 4080,
        taxRate: 18,
        totalValue: 102000,
        complianceStatus: "Fully Compliant",
      },
      {
        rfqLineId: 3,
        itemService: "Control Components",
        quotedBrand: "Omron",
        quotedModel: "G2R-1-SND-24DC",
        quantity: 50,
        unitPrice: 2150,
        discountPercent: 2,
        netUnitPrice: 2107,
        taxRate: 18,
        totalValue: 105350,
        complianceStatus: "Fully Compliant",
      },
      {
        rfqLineId: 4,
        itemService: "Electrical Accessories",
        quotedBrand: "Wago",
        quotedModel: "TOPJOB S Rail Kit",
        quantity: 1,
        unitPrice: 73875,
        discountPercent: 0,
        netUnitPrice: 73875,
        taxRate: 18,
        totalValue: 73875,
        complianceStatus: "Fully Compliant",
      },
    ],
  },
  {
    id: 3,
    supplierId: 3,
    supplierName: "VoltTech Engineers",
    quoteNumber: "Q-2026-131",
    quoteDate: "03 May 2026",
    receivedDate: "03 May 2026 10:10 AM",
    validUntil: "05 Jun 2026",
    currency: "INR",
    subtotal: 460000,
    discount: 7400,
    freight: 10000,
    insurance: 2000,
    tax: 81468,
    otherCharges: 0,
    grandTotal: 452600,
    landedCost: 546068,
    paymentTerms: "Net 60 Days",
    deliveryTerms: "DAP Bengaluru Plant",
    deliveryLeadTimeDays: 30,
    status: "Qualified",
    lineItems: [
      {
        rfqLineId: 1,
        itemService: "Power Contactor",
        quotedBrand: "Siemens",
        quotedModel: "SIRIUS 3RT2027-1AP00",
        quantity: 50,
        unitPrice: 3100,
        discountPercent: 2,
        netUnitPrice: 3038,
        taxRate: 18,
        totalValue: 151900,
        complianceStatus: "Fully Compliant",
      },
      {
        rfqLineId: 2,
        itemService: "Energy Meter",
        quotedBrand: "Schneider",
        quotedModel: "EM6400NG Class 0.5S",
        quantity: 25,
        unitPrice: 4450,
        discountPercent: 2,
        netUnitPrice: 4361,
        taxRate: 18,
        totalValue: 109025,
        complianceStatus: "Fully Compliant",
      },
      {
        rfqLineId: 3,
        itemService: "Control Components",
        quotedBrand: "Weidmuller",
        quotedModel: "DRM570024LT Relay Set",
        quantity: 50,
        unitPrice: 2350,
        discountPercent: 1,
        netUnitPrice: 2326.5,
        taxRate: 18,
        totalValue: 116325,
        complianceStatus: "Fully Compliant",
      },
      {
        rfqLineId: 4,
        itemService: "Electrical Accessories",
        quotedBrand: "Dowells / Raychem",
        quotedModel: "Heavy Terminal Pack",
        quantity: 1,
        unitPrice: 75350,
        discountPercent: 0,
        netUnitPrice: 75350,
        taxRate: 18,
        totalValue: 75350,
        complianceStatus: "Fully Compliant",
      },
    ],
  },
];

const INITIAL_TECHNICAL_EVAL: TechnicalEvaluationItem[] = [
  {
    supplierId: 1,
    supplierName: "ElectroMex Solutions Pvt. Ltd.",
    evaluator: "Sneha Iyer (Technical Lead)",
    date: "03 May 2026",
    specComplianceScore: 94,
    qualityScore: 92,
    performanceScore: 90,
    documentationScore: 92,
    technicalScore: 92.4,
    recommendation: "Qualified",
    comments: "Schneider contactors and Secure meters meet full EV spec parameters. Test certificates verified.",
  },
  {
    supplierId: 2,
    supplierName: "PowerGrid Components",
    evaluator: "Sneha Iyer (Technical Lead)",
    date: "03 May 2026",
    specComplianceScore: 90,
    qualityScore: 88,
    performanceScore: 89,
    documentationScore: 88,
    technicalScore: 89.0,
    recommendation: "Qualified",
    comments: "ABB AF contactors compliant. Class 1.0 energy meter meets baseline spec.",
  },
  {
    supplierId: 3,
    supplierName: "VoltTech Engineers",
    evaluator: "Sneha Iyer (Technical Lead)",
    date: "03 May 2026",
    specComplianceScore: 96,
    qualityScore: 95,
    performanceScore: 94,
    documentationScore: 95,
    technicalScore: 95.2,
    recommendation: "Qualified",
    comments: "Siemens Sirius & EM6400NG are top-tier industrial grade with superior MTBF.",
  },
];

const INITIAL_COMMERCIAL_EVAL: CommercialEvaluationItem[] = [
  {
    supplierId: 1,
    supplierName: "ElectroMex Solutions Pvt. Ltd.",
    basicPrice: 408500,
    discount: 16500,
    freight: 15000,
    insurance: 2500,
    taxes: 73530,
    otherCharges: 0,
    landedCost: 499530,
    deliveryTimeDays: 21,
    paymentScore: 95,
    deliveryScore: 90,
    commercialScore: 94.5,
    commercialRank: 1,
    overallRank: 1,
    recommendation: "Recommended",
  },
  {
    supplierId: 2,
    supplierName: "PowerGrid Components",
    basicPrice: 424300,
    discount: 13700,
    freight: 22000,
    insurance: 3000,
    taxes: 76374,
    otherCharges: 0,
    landedCost: 525674,
    deliveryTimeDays: 15,
    paymentScore: 85,
    deliveryScore: 95,
    commercialScore: 88.2,
    commercialRank: 2,
    overallRank: 2,
    recommendation: "Under Review",
  },
  {
    supplierId: 3,
    supplierName: "VoltTech Engineers",
    basicPrice: 452600,
    discount: 7400,
    freight: 10000,
    insurance: 2000,
    taxes: 81468,
    otherCharges: 0,
    landedCost: 546068,
    deliveryTimeDays: 30,
    paymentScore: 90,
    deliveryScore: 75,
    commercialScore: 82.0,
    commercialRank: 3,
    overallRank: 3,
    recommendation: "Alternative",
  },
];

const INITIAL_CLARIFICATIONS: RFQClarification[] = [
  {
    id: 1,
    supplierName: "ElectroMex Solutions Pvt. Ltd.",
    clarificationType: "Technical",
    question: "Please confirm whether Schneider contactor auxiliary contacts include 1NO+1NC as standard.",
    requestedBy: "Rahul Sharma",
    requestedDate: "29 Apr 2026 14:00",
    response: "Yes, TeSys D LC1D32M7 includes integral 1NO+1NC auxiliary contact block with front DIN clip.",
    responseDate: "30 Apr 2026 09:30",
    impactOnEvaluation: "Spec Updated",
    status: "Resolved",
  },
  {
    id: 2,
    supplierName: "VoltTech Engineers",
    clarificationType: "Delivery",
    question: "Can 30-day lead time be expedited to 20 days to meet project commissioning target?",
    requestedBy: "Rahul Sharma",
    requestedDate: "03 May 2026 11:15",
    response: "Expedited air-shipment feasible with partial delivery of 25 contactors in 14 days.",
    responseDate: "03 May 2026 15:40",
    impactOnEvaluation: "No Impact",
    status: "Resolved",
  },
];

const INITIAL_NEGOTIATIONS: RFQNegotiation[] = [
  {
    id: 1,
    roundNumber: 1,
    supplierName: "ElectroMex Solutions Pvt. Ltd.",
    date: "04 May 2026",
    type: "Comprehensive",
    originalValue: 408500,
    negotiatedValue: 386000,
    savings: 22500,
    savingsPercent: 5.51,
    deliveryImprovement: "Reduced lead time from 21 days to 14 days",
    paymentImprovement: "Extended credit from Net 45 to Net 60 days",
    notes: "Vendor agreed to special project tier volume discount for EV manufacturing program.",
    negotiatedBy: "Rahul Sharma (Buyer)",
    status: "Completed",
  },
];

export function RfqQuotationPage() {
  // Navigation & Sub-tabs
  const [activeTab, setActiveTab] = useState<string>("lineItems");

  // Master RFQ Data States
  const [rfqMaster, setRfqMaster] = useState(INITIAL_RFQ_MASTER);
  const [lineItems, setLineItems] = useState<RFQLineItem[]>(INITIAL_LINE_ITEMS);
  const [specs, setSpecs] = useState<RFQTechnicalSpec[]>(INITIAL_SPECS);
  const [suppliers, setSuppliers] = useState<InvitedSupplier[]>(INITIAL_SUPPLIERS);
  const [quotations, setQuotations] = useState<SupplierQuotation[]>(INITIAL_QUOTATIONS);
  const [techEval, setTechEval] = useState<TechnicalEvaluationItem[]>(INITIAL_TECHNICAL_EVAL);
  const [commEval, setCommEval] = useState<CommercialEvaluationItem[]>(INITIAL_COMMERCIAL_EVAL);
  const [clarifications, setClarifications] = useState<RFQClarification[]>(INITIAL_CLARIFICATIONS);
  const [negotiations, setNegotiations] = useState<RFQNegotiation[]>(INITIAL_NEGOTIATIONS);

  // Dialog & Modal States
  const [showNewRfqModal, setShowNewRfqModal] = useState<boolean>(false);
  const [showInviteSupplierModal, setShowInviteSupplierModal] = useState<boolean>(false);
  const [showAddQuoteModal, setShowAddQuoteModal] = useState<boolean>(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState<boolean>(false);
  const [showAwardModal, setShowAwardModal] = useState<boolean>(false);
  const [showPoModal, setShowPoModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showAskClarificationModal, setShowAskClarificationModal] = useState<boolean>(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState<boolean>(false);

  // Documents List State
  const [documentsList, setDocumentsList] = useState([
    { id: 1, name: "RFQ_Document_PR-145.pdf", type: "RFQ Document", size: "245 KB", user: "Rahul Sharma", date: "28 Apr 2026" },
    { id: 2, name: "Technical_Specification_Contactor.pdf", type: "Technical Spec", size: "520 KB", user: "Rahul Sharma", date: "28 Apr 2026" },
    { id: 3, name: "ElectroMex_Commercial_Bid_Q125.pdf", type: "Supplier Quotation", size: "1.2 MB", user: "ElectroMex (Portal)", date: "02 May 2026" },
    { id: 4, name: "Comparative_Statement_Evaluation.xlsx", type: "Comparative CS", size: "340 KB", user: "Sneha Iyer", date: "03 May 2026" },
  ]);

  const [docUploadForm, setDocUploadForm] = useState({
    name: "",
    type: "RFQ Document",
    user: "Rahul Sharma",
  });

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = docUploadForm.name.trim() || `RFQ_Doc_${Date.now()}.pdf`;
    const newDoc = {
      id: documentsList.length + 1,
      name: fileName,
      type: docUploadForm.type,
      size: `${(Math.random() * 2 + 0.4).toFixed(1)} MB`,
      user: docUploadForm.user || "Rahul Sharma",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setDocumentsList([newDoc, ...documentsList]);
    setShowUploadDocModal(false);
    setDocUploadForm({ name: "", type: "RFQ Document", user: "Rahul Sharma" });
    toast.success(`Document '${fileName}' uploaded to RFQ docket successfully!`);
  };

  const handleDownloadDocument = (fileName: string) => {
    try {
      const dummyContent = `MAGNERTIA ERP - RFQ ATTACHMENT DOSSIER\nRFQ Ref: RFQ-2026-000089\nFile Name: ${fileName}\nGenerated: ${new Date().toISOString()}\nStatus: Verified Document\n\n[Content authenticated via Magnertia ECM Gateway]`;
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

  // Record Quotation Form State
  const [newQuoteForm, setNewQuoteForm] = useState({
    supplierName: "Schneider Electric India Pvt Ltd",
    quoteNumber: "",
    subtotal: 410000,
    discount: 15000,
    freight: 4500,
    insurance: 1500,
    tax: 72000,
    deliveryLeadTimeDays: 14,
    deliveryTerms: "FOR Destination",
    paymentTerms: "Net 45 Days",
  });

  const handleRecordQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = Number(newQuoteForm.subtotal) || 0;
    const disc = Number(newQuoteForm.discount) || 0;
    const fr = Number(newQuoteForm.freight) || 0;
    const ins = Number(newQuoteForm.insurance) || 0;
    const tx = Number(newQuoteForm.tax) || 0;
    const gTotal = sub - disc + fr + ins + tx;
    const qNum = newQuoteForm.quoteNumber.trim() || `QT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newQuote: SupplierQuotation = {
      id: quotations.length + 1,
      supplierId: quotations.length + 1,
      supplierName: newQuoteForm.supplierName,
      quoteNumber: qNum,
      quoteDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      receivedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      validUntil: "30 May 2026",
      currency: "INR",
      subtotal: sub,
      discount: disc,
      freight: fr,
      insurance: ins,
      tax: tx,
      otherCharges: 0,
      grandTotal: gTotal,
      landedCost: gTotal,
      paymentTerms: newQuoteForm.paymentTerms,
      deliveryTerms: newQuoteForm.deliveryTerms,
      deliveryLeadTimeDays: Number(newQuoteForm.deliveryLeadTimeDays) || 14,
      status: "Received",
      lineItems: [
        {
          rfqLineId: 1,
          itemService: "Power Contactor 3-Pole 40A",
          quotedBrand: "OEM Approved",
          quotedModel: "Series-X",
          quantity: 50,
          unitPrice: Math.round(sub / 50),
          discountPercent: 5,
          netUnitPrice: Math.round((sub - disc) / 50),
          taxRate: 18,
          totalValue: gTotal,
          complianceStatus: "Fully Compliant",
        },
      ],
    };

    setQuotations([newQuote, ...quotations]);
    setShowAddQuoteModal(false);
    toast.success(`Quotation '${qNum}' from ${newQuote.supplierName} recorded successfully!`);
  };

  // Summary Metrics calculations
  const totalEstimatedValue = useMemo(() => {
    return lineItems.reduce((acc, item) => acc + (item.quantity * item.targetPrice), 0);
  }, [lineItems]);

  const bestQuotedValue = useMemo(() => {
    if (quotations.length === 0) return 0;
    return Math.min(...quotations.map((q) => q.grandTotal));
  }, [quotations]);

  const potentialSavings = useMemo(() => {
    return totalEstimatedValue - bestQuotedValue;
  }, [totalEstimatedValue, bestQuotedValue]);

  const potentialSavingsPercent = useMemo(() => {
    if (totalEstimatedValue === 0) return 0;
    return ((potentialSavings / totalEstimatedValue) * 100).toFixed(2);
  }, [totalEstimatedValue, potentialSavings]);

  const responseRate = useMemo(() => {
    const receivedCount = suppliers.filter((s) => s.invitationStatus === "Quotation Received").length;
    return Math.round((receivedCount / suppliers.length) * 100);
  }, [suppliers]);

  // Actions
  const handleSaveDraft = () => {
    toast.success("Request for Quotation saved as draft.");
  };

  const handleSubmitForApproval = () => {
    setRfqMaster((prev) => ({ ...prev, rfqStatus: "Commercial Evaluation" as any }));
    toast.success("RFQ submitted for Commercial Evaluation & Award Approval!");
  };

  const handleIssueRfq = () => {
    toast.success("RFQ released and email notifications dispatched to all 5 invited suppliers!");
  };

  const handleCreatePo = () => {
    toast.success("Purchase Order PO-2026-000412 created successfully from awarded quote!");
    setShowPoModal(false);
  };

  return (
    <AppShell
      title="RFQ / Quotation"
      breadcrumb="Management > Procurement Management"
      description="The RFQ Form manages the complete supplier quotation process—from converting an approved Purchase Requisition into an RFQ through supplier invitation, quotation receipt, technical evaluation, commercial comparison, negotiation, approval, and Purchase Order creation."
      tabs={<ProcurementManagementTabBar />}
    >
      <div className="space-y-6">
        {/* TOP RFQ MASTER BANNER & CONTROLS (Pixel-matched with reference design) */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          {/* Top Bar: Icon + ID + Status + Actions */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/25 shadow-xs">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground font-mono">
                    {rfqMaster.rfqNumber}
                  </h1>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                    {rfqMaster.rfqStatus}
                  </span>
                  <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-extrabold text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase tracking-wide">
                    {rfqMaster.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Internal ID: <span className="font-mono text-foreground font-semibold">{rfqMaster.rfqId}</span> · RFQ Date:{" "}
                  <strong className="text-foreground">{rfqMaster.rfqDate}</strong> · Due Date:{" "}
                  <strong className="text-rose-600 dark:text-rose-400">{rfqMaster.quotationDueDate}</strong>
                </p>
              </div>
            </div>

            {/* Header Action Buttons - Streamlined */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPoModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                <FileBadge className="h-3.5 w-3.5" />
                Convert to PO
              </button>

              <button
                type="button"
                onClick={() => setShowNewRfqModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                New RFQ
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
                title="Print RFQ Docket"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
            </div>
          </div>

          {/* Master Detail Grid (8 key attributes) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">RFQ Type</div>
              <div className="font-bold text-foreground mt-0.5">{rfqMaster.rfqType}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Source Type</div>
              <div className="font-bold text-foreground mt-0.5">{rfqMaster.sourceType}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Purchase Requisition</div>
              <div className="font-bold font-mono text-primary mt-0.5">
                <Link to="/management/procurement-management/purchase-requisition" className="hover:underline">
                  {rfqMaster.sourcePrNumber}
                </Link>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Procurement Category</div>
              <div className="font-bold text-foreground mt-0.5 truncate">{rfqMaster.procurementCategory}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Buyer / Officer</div>
              <div className="font-bold text-foreground mt-0.5">{rfqMaster.buyerOfficer}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Department</div>
              <div className="font-bold text-foreground mt-0.5">{rfqMaster.department}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Suppliers Invited</div>
              <div className="font-bold text-foreground mt-0.5 text-sm">{rfqMaster.suppliersInvited}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Estimated Value</div>
              <div className="text-sm font-extrabold text-foreground mt-0.5">
                ₹{rfqMaster.estimatedValue.toLocaleString("en-IN")}.00
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SUB-MODULE TABS NAVIGATION - Streamlined & Essential Only */}
        <div className="flex items-center gap-1.5 border-b border-border/80 overflow-x-auto no-scrollbar pb-px">
          {[
            { id: "lineItems", label: "Line Items", icon: ShoppingCart },
            { id: "specifications", label: "Specifications", icon: FileCode },
            { id: "suppliers", label: "Suppliers", icon: Users },
            { id: "quotations", label: "Quotations", icon: FileText },
            { id: "technicalEval", label: "Technical Evaluation", icon: ShieldCheck },
            { id: "commercialEval", label: "Commercial Comparison", icon: Scale },
            { id: "recommendation", label: "Recommendation & Award", icon: Sparkles },
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

        {/* TAB 2: LINE ITEMS */}
        {activeTab === "lineItems" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    RFQ Line Items & Target Price Estimation
                  </h3>
                  <p className="text-xs text-muted-foreground">Bill of quantities, UOM, target pricing and cost center tags</p>
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
                      <th className="py-2.5 px-3 text-right">Target Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Estimated Line Value</th>
                      <th className="py-2.5 px-3">Required Date</th>
                      <th className="py-2.5 px-3">HSN/SAC</th>
                      <th className="py-2.5 px-3">Cost Center</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {lineItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-foreground">{item.itemService}</div>
                          <div className="text-[11px] text-muted-foreground max-w-[200px] truncate">{item.description}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-primary font-semibold">{item.itemCode}</td>
                        <td className="py-3 px-3 text-muted-foreground">{item.category}</td>
                        <td className="py-3 px-3">{item.uom}</td>
                        <td className="py-3 px-3 text-right font-bold">{item.quantity}</td>
                        <td className="py-3 px-3 text-right">₹{item.targetPrice.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-3 text-right font-bold text-foreground">
                          ₹{item.estimatedTotal.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">{item.requiredDeliveryDate}</td>
                        <td className="py-3 px-3 font-mono text-[11px]">{item.hsnSac}</td>
                        <td className="py-3 px-3 font-mono text-muted-foreground">{item.costCenter}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/40 font-bold border-t border-border">
                    <tr>
                      <td colSpan={7} className="py-3 px-3 text-right text-xs">Total RFQ Budget:</td>
                      <td className="py-3 px-3 text-right text-sm font-extrabold text-foreground">
                        ₹{totalEstimatedValue.toLocaleString("en-IN")}.00
                      </td>
                      <td colSpan={3}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SPECIFICATIONS */}
        {activeTab === "specifications" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-primary" />
                    RFQ Technical Specifications & Compliance Sheet
                  </h3>
                  <p className="text-xs text-muted-foreground">Mandatory parameters, minimum/maximum tolerances and evaluation weightages</p>
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Line Item</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Parameter</th>
                      <th className="py-2.5 px-3">Specification Requirement</th>
                      <th className="py-2.5 px-3">Preferred Value</th>
                      <th className="py-2.5 px-3 text-center">Mandatory</th>
                      <th className="py-2.5 px-3 text-right">Weight %</th>
                      <th className="py-2.5 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {specs.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold">{s.rfqLineName}</td>
                        <td className="py-3 px-3">
                          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                            {s.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold">{s.parameter}</td>
                        <td className="py-3 px-3 font-medium text-foreground">{s.requirement}</td>
                        <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-bold">{s.preferredValue || "—"}</td>
                        <td className="py-3 px-3 text-center">
                          {s.mandatory ? (
                            <span className="rounded-full bg-rose-500/10 px-2 py-0.2 text-[10px] font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              Mandatory
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">Optional</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-bold">{s.evaluationWeight}%</td>
                        <td className="py-3 px-3 text-muted-foreground max-w-[200px] truncate">{s.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUPPLIERS & INVITATIONS */}
        {activeTab === "suppliers" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Invited Suppliers & Eligibility Verification
                  </h3>
                  <p className="text-xs text-muted-foreground">Vendor invitation status, response tracking, quality ratings, and conflict checks</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteSupplierModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Invite Supplier
                  </button>
                  <button
                    type="button"
                    onClick={handleIssueRfq}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 transition-all cursor-pointer"
                  >
                    <Mail className="h-3.5 w-3.5" /> Re-Send RFQ Email
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Supplier Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Contact Person</th>
                      <th className="py-2.5 px-3">Ratings</th>
                      <th className="py-2.5 px-3">Invitation Status</th>
                      <th className="py-2.5 px-3">Response Status</th>
                      <th className="py-2.5 px-3">Eligibility</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {suppliers.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3">
                          <div className="font-bold text-foreground flex items-center gap-1.5">
                            {s.supplierName}
                            {s.isPreferred && (
                              <span className="rounded bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                Preferred
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">{s.supplierCode}</div>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">{s.category}</td>
                        <td className="py-3 px-3">
                          <div>{s.contactPerson}</div>
                          <div className="text-[10px] text-muted-foreground">{s.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-[11px] font-semibold text-amber-600">★ {s.eligibility.qualityRating} Q / ★ {s.eligibility.deliveryRating} D</div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold",
                              s.invitationStatus === "Quotation Received"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                            )}
                          >
                            {s.invitationStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[10px] font-bold",
                              s.responseStatus === "Quotation Submitted" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                              s.responseStatus === "Interested" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                              s.responseStatus === "Declined" && "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            )}
                          >
                            {s.responseStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ {s.eligibility.result}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => toast.info(`Reminder email sent to ${s.supplierName}`)}
                            className="text-primary hover:underline text-xs font-semibold cursor-pointer"
                          >
                            Send Reminder
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

        {/* TAB 5: SUPPLIER QUOTATIONS */}
        {activeTab === "quotations" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Supplier Quotations Submissions
                  </h3>
                  <p className="text-xs text-muted-foreground">Itemized quotation pricing, taxes, landed cost breakdown, and delivery lead times</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddQuoteModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Record Quotation
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {quotations.map((q) => (
                  <div key={q.id} className="rounded-xl border border-border/80 bg-muted/10 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div>
                        <div className="font-bold text-foreground">{q.supplierName}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{q.quoteNumber}</div>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {q.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Basic Subtotal:</span>
                        <span>₹{q.subtotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Discount:</span>
                        <span>- ₹{q.discount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Freight & Insurance:</span>
                        <span>+ ₹{(q.freight + q.insurance).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxes (18% GST):</span>
                        <span>+ ₹{q.tax.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-1 font-bold text-sm">
                        <span className="text-foreground">Grand Total:</span>
                        <span className="text-primary">₹{q.grandTotal.toLocaleString("en-IN")}.00</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-emerald-700 dark:text-emerald-300">
                        <span>Landed Cost:</span>
                        <span>₹{q.landedCost.toLocaleString("en-IN")}.00</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                      <div className="text-muted-foreground space-y-0.5">
                        <div>Delivery: <strong>{q.deliveryLeadTimeDays} Days ({q.deliveryTerms})</strong></div>
                        <div>Payment: <strong>{q.paymentTerms}</strong></div>
                      </div>
                      <Link
                        to="/management/procurement-management/vendor-quotation"
                        className="font-semibold text-primary hover:underline"
                        title="View detailed inward quotation dossier"
                      >
                        Open Dossier →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: TECHNICAL EVALUATION */}
        {activeTab === "technicalEval" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Technical Evaluation & Compliance Scoring
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Formula: Technical Score = Specification Compliance (35%) + Quality (25%) + Performance (20%) + Documentation (20%)
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Supplier</th>
                      <th className="py-2.5 px-3">Evaluator</th>
                      <th className="py-2.5 px-3 text-right">Spec Compliance</th>
                      <th className="py-2.5 px-3 text-right">Quality Score</th>
                      <th className="py-2.5 px-3 text-right">Performance</th>
                      <th className="py-2.5 px-3 text-right">Documentation</th>
                      <th className="py-2.5 px-3 text-right">Technical Score</th>
                      <th className="py-2.5 px-3 text-center">Technical Decision</th>
                      <th className="py-2.5 px-3">Comments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {techEval.map((item) => (
                      <tr key={item.supplierId} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-bold">{item.supplierName}</td>
                        <td className="py-3 px-3 text-muted-foreground">{item.evaluator}</td>
                        <td className="py-3 px-3 text-right font-semibold">{item.specComplianceScore}%</td>
                        <td className="py-3 px-3 text-right font-semibold">{item.qualityScore}%</td>
                        <td className="py-3 px-3 text-right font-semibold">{item.performanceScore}%</td>
                        <td className="py-3 px-3 text-right font-semibold">{item.documentationScore}%</td>
                        <td className="py-3 px-3 text-right font-black text-sm text-primary">{item.technicalScore}%</td>
                        <td className="py-3 px-3 text-center">
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            ✓ {item.recommendation}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground max-w-[240px] truncate">{item.comments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: COMMERCIAL COMPARISON & AWARD RECOMMENDATION */}
        {activeTab === "commercialEval" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    Sourcing Decision & Commercial Comparison Summary
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Synced with central Vendor Comparison engine · Multi-criteria commercial ranking and landed cost evaluation
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/management/procurement-management/vendor-comparison"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
                  >
                    <Scale className="h-3.5 w-3.5" />
                    Open Multi-Criteria Decision Engine →
                  </Link>
                </div>
              </div>

              {/* Sourcing Award Banner */}
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                      Recommended Awardee (L1)
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      Evaluated for RFQ-2026-000089
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-foreground">ElectroMax Solutions Pvt. Ltd.</h4>
                  <p className="text-xs text-muted-foreground">
                    Lowest qualified landed cost at <strong>₹4,99,530.00</strong> with 92.4% technical score and Net 45 days payment terms.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[11px] text-muted-foreground">Cost Savings Realized</div>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">₹46,538.00</div>
                    <div className="text-[10px] text-muted-foreground">8.5% below internal PR cap</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPoModal(true)}
                    className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <FileBadge className="h-3.5 w-3.5" />
                    Release Purchase Order (PO)
                  </button>
                </div>
              </div>

              {/* 3 Competing Supplier Bids Summary */}
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                {/* L1 Card */}
                <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2">
                    <div>
                      <span className="rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-black">
                        RANK #1 (L1)
                      </span>
                      <div className="font-bold text-foreground text-sm mt-1">ElectroMax Solutions</div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      Preferred
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Basic Quote:</span>
                      <strong className="text-foreground">₹4,08,500.00</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Freight & Tax:</span>
                      <span>₹91,030.00</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-emerald-700 dark:text-emerald-300 border-t border-border pt-1">
                      <span>Landed Cost:</span>
                      <span>₹4,99,530.00</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Lead Time:</span>
                      <strong className="text-foreground">21 Days</strong>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Technical Score:</span>
                      <strong className="text-primary font-bold">92.4%</strong>
                    </div>
                  </div>
                </div>

                {/* L2 Card */}
                <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div>
                      <span className="rounded bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-bold">
                        RANK #2 (L2)
                      </span>
                      <div className="font-bold text-foreground text-sm mt-1">PowerGrid Components</div>
                    </div>
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                      Alternate
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Basic Quote:</span>
                      <strong className="text-foreground">₹4,24,300.00</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Freight & Tax:</span>
                      <span>₹1,01,374.00</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-foreground border-t border-border pt-1">
                      <span>Landed Cost:</span>
                      <span>₹5,25,674.00</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Lead Time:</span>
                      <strong className="text-foreground">15 Days</strong>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Technical Score:</span>
                      <strong className="text-foreground font-bold">89.0%</strong>
                    </div>
                  </div>
                </div>

                {/* L3 Card */}
                <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div>
                      <span className="rounded bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-bold">
                        RANK #3 (L3)
                      </span>
                      <div className="font-bold text-foreground text-sm mt-1">VoltTech Engineers</div>
                    </div>
                    <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      Reserve
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Basic Quote:</span>
                      <strong className="text-foreground">₹4,52,600.00</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Freight & Tax:</span>
                      <span>₹93,468.00</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-foreground border-t border-border pt-1">
                      <span>Landed Cost:</span>
                      <span>₹5,46,068.00</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Lead Time:</span>
                      <strong className="text-foreground">30 Days</strong>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Technical Score:</span>
                      <strong className="text-primary font-bold">95.2%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SUPPLIER SCORECARD */}
        {activeTab === "scorecard" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Weighted Multi-Criteria Supplier Scorecard
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Weights: Technical (35%) + Commercial (30%) + Quality (15%) + Delivery (10%) + Past Performance (10%) = 100%
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    supplier: "ElectroMex Solutions Pvt. Ltd.",
                    rank: 1,
                    overallScore: "92.4%",
                    tech: "92.4%",
                    comm: "94.5%",
                    qual: "96.0%",
                    deliv: "90.0%",
                    past: "95.0%",
                    decision: "Recommended Awardee",
                    badge: "bg-emerald-500 text-white",
                  },
                  {
                    supplier: "PowerGrid Components",
                    rank: 2,
                    overallScore: "88.6%",
                    tech: "89.0%",
                    comm: "88.2%",
                    qual: "90.0%",
                    deliv: "95.0%",
                    past: "88.0%",
                    decision: "Under Review / Backup",
                    badge: "bg-blue-500 text-white",
                  },
                  {
                    supplier: "VoltTech Engineers",
                    rank: 3,
                    overallScore: "87.2%",
                    tech: "95.2%",
                    comm: "82.0%",
                    qual: "95.0%",
                    deliv: "75.0%",
                    past: "90.0%",
                    decision: "Commercial Alternative",
                    badge: "bg-slate-500 text-white",
                  },
                ].map((sc) => (
                  <div key={sc.supplier} className="rounded-xl border border-border/80 bg-muted/10 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-black", sc.badge)}>
                        Rank #{sc.rank}
                      </span>
                      <span className="text-base font-black text-foreground">{sc.overallScore}</span>
                    </div>

                    <div>
                      <div className="font-bold text-foreground">{sc.supplier}</div>
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{sc.decision}</div>
                    </div>

                    <div className="space-y-1 text-xs border-t border-border pt-2">
                      <div className="flex justify-between"><span className="text-muted-foreground">Technical (35%):</span><strong>{sc.tech}</strong></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Commercial (30%):</span><strong>{sc.comm}</strong></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Quality (15%):</span><strong>{sc.qual}</strong></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Delivery (10%):</span><strong>{sc.deliv}</strong></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Past Track (10%):</span><strong>{sc.past}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: CLARIFICATIONS */}
        {activeTab === "clarifications" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Supplier Clarifications Management
                  </h3>
                  <p className="text-xs text-muted-foreground">Pre-bid technical questions, scope clarifications and official buyer addenda</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAskClarificationModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Post Clarification
                </button>
              </div>

              <div className="space-y-3">
                {clarifications.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-foreground flex items-center gap-2">
                        <span>{c.supplierName}</span>
                        <span className="rounded bg-primary/10 px-2 py-0.2 text-[10px] text-primary font-semibold">
                          {c.clarificationType}
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.2 text-[10px] font-bold">
                        {c.status}
                      </span>
                    </div>

                    <div>
                      <div className="font-semibold text-foreground">Q: {c.question}</div>
                      <div className="text-[10px] text-muted-foreground">Raised by {c.requestedBy} on {c.requestedDate}</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-background border border-border/60">
                      <div className="font-bold text-emerald-700 dark:text-emerald-300">A: {c.response}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">Answered on {c.responseDate} · Impact: {c.impactOnEvaluation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: NEGOTIATIONS */}
        {activeTab === "negotiations" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Handshake className="h-4 w-4 text-primary" />
                    Commercial Negotiation Log & Value Realization
                  </h3>
                  <p className="text-xs text-muted-foreground">Price counter-offers, volume rebates, warranty extensions, and payment term improvements</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNegotiationModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Log Negotiation Round
                </button>
              </div>

              <div className="space-y-3">
                {negotiations.map((n) => (
                  <div key={n.id} className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-foreground text-sm flex items-center gap-2">
                        <span>Round #{n.roundNumber}: {n.supplierName}</span>
                        <span className="rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 px-2 py-0.2 text-[10px] font-bold">
                          {n.type} Negotiation
                        </span>
                      </div>
                      <span className="font-mono text-muted-foreground">{n.date}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-background p-3 rounded-lg border border-border">
                      <div>
                        <div className="text-[10px] text-muted-foreground">Original Quoted:</div>
                        <div className="font-bold text-rose-600 line-through">₹{n.originalValue.toLocaleString("en-IN")}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground">Final Negotiated:</div>
                        <div className="font-extrabold text-emerald-600 text-sm">₹{n.negotiatedValue.toLocaleString("en-IN")}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground">Achieved Savings:</div>
                        <div className="font-black text-emerald-700 dark:text-emerald-300">
                          ₹{n.savings.toLocaleString("en-IN")} ({n.savingsPercent}%)
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground">Negotiated By:</div>
                        <div className="font-semibold text-foreground">{n.negotiatedBy}</div>
                      </div>
                    </div>

                    <div className="space-y-1 text-muted-foreground">
                      <div>• <strong>Delivery:</strong> {n.deliveryImprovement}</div>
                      <div>• <strong>Payment Terms:</strong> {n.paymentImprovement}</div>
                      <div>• <strong>Notes:</strong> {n.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: RECOMMENDATION & AWARD */}
        {activeTab === "recommendation" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    Procurement Committee Award Recommendation
                  </h3>
                  <p className="text-xs text-muted-foreground">Official justification for supplier selection, risk review and PO release</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAwardModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Sign-off Award
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPoModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Generate PO
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/5">
                  <div className="text-[11px] text-muted-foreground">Recommended Supplier</div>
                  <div className="text-sm font-bold text-foreground mt-0.5">ElectroMex Solutions Pvt. Ltd.</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Rank #1 (QCBS Score 92.4%)</div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <div className="text-[11px] text-muted-foreground">Recommended Award Value</div>
                  <div className="text-sm font-black text-emerald-600 mt-0.5">₹3,86,000.00</div>
                  <div className="text-[10px] text-muted-foreground">Negotiated Spot Price</div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <div className="text-[11px] text-muted-foreground">Total Program Savings</div>
                  <div className="text-sm font-black text-emerald-700 dark:text-emerald-300 mt-0.5">₹99,000.00 (20.4%)</div>
                  <div className="text-[10px] text-muted-foreground">vs PR Budget of ₹4.85L</div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <div className="text-[11px] text-muted-foreground">Backup Alternative</div>
                  <div className="text-sm font-bold text-foreground mt-0.5">PowerGrid Components</div>
                  <div className="text-[10px] text-muted-foreground">Rank #2 (Score 88.6%)</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-foreground">Recommendation Justification Note:</div>
                <p className="text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg border border-border">
                  ElectroMex Solutions Pvt. Ltd. emerged as the L1 lowest evaluated and technically qualified bidder with a consolidated QCBS score of 92.4%. Through Round 1 commercial negotiations, unit price was brought down from ₹4,08,500 to ₹3,86,000 yielding ₹99,000 (20.4%) total savings against original PR budget sanction. Delivery timeline is guaranteed at 14 calendar days with 24 months replacement warranty and Net 60 days credit term. Committee recommends immediate release of Purchase Order.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: DOCUMENTS & ATTACHMENTS */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-primary" />
                    RFQ Document Repository & Supplier Dossiers
                  </h3>
                  <p className="text-xs text-muted-foreground">Technical specifications, CAD drawings, supplier proposal PDFs, and comparative statements</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowUploadDocModal(true)}
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
                      <th className="py-2.5 px-3">Document Type</th>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Uploaded By</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {documentsList.map((doc) => (
                      <tr key={doc.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{doc.id}</td>
                        <td className="py-3 px-3 font-bold text-foreground flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-primary" /> {doc.name}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">{doc.type}</td>
                        <td className="py-3 px-3 font-mono text-[11px]">{doc.size}</td>
                        <td className="py-3 px-3">{doc.user}</td>
                        <td className="py-3 px-3 text-muted-foreground">{doc.date}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDownloadDocument(doc.name)}
                            className="text-primary hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" /> Download
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

        {/* MODAL: NEW RFQ WIZARD */}
        {showNewRfqModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Create New Request for Quotation (RFQ)</h3>
                    <p className="text-xs text-muted-foreground">Formulate a bidding docket from PR or manual requisition</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewRfqModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">RFQ Title *</label>
                  <input
                    type="text"
                    defaultValue="Electrical Components for Smart EV Charging"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Source Purchase Requisition</label>
                  <input
                    type="text"
                    defaultValue="PR-2026-000145"
                    className="w-full rounded-lg border border-border bg-background p-2 text-primary font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">RFQ Type *</label>
                  <select className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    <option>Material RFQ</option>
                    <option>Service RFQ</option>
                    <option>Project RFQ</option>
                    <option>Equipment RFQ</option>
                    <option>Annual Rate Contract RFQ</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Quotation Due Date *</label>
                  <input
                    type="datetime-local"
                    defaultValue="2026-05-05T17:00"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-muted-foreground font-medium block mb-1">Requirement Summary</label>
                  <textarea
                    rows={2}
                    defaultValue="Supply of 50 Nos Contactors, 25 Energy Meters, and control hardware."
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNewRfqModal(false)}
                  className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("New RFQ drafted successfully!");
                    setShowNewRfqModal(false);
                  }}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Save & Configure Suppliers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: INVITE SUPPLIER */}
        {showInviteSupplierModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground">Invite Vendor to RFQ</h3>
                <button
                  type="button"
                  onClick={() => setShowInviteSupplierModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Select Supplier from Master</label>
                  <select className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    <option>Schneider Electric India Pvt Ltd</option>
                    <option>ABB Power & Automation</option>
                    <option>L&T Electrical & Automation</option>
                    <option>Siemens India Ltd</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Contact Email *</label>
                  <input
                    type="email"
                    defaultValue="bids.india@schneider-electric.com"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowInviteSupplierModal(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Vendor invitation dispatched.");
                    setShowInviteSupplierModal(false);
                  }}
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CREATE PURCHASE ORDER */}
        {showPoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-emerald-500" />
                  Generate Official Purchase Order
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPoModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Generated PO Number:</span>
                    <strong className="font-mono text-foreground">PO-2026-000412</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Awarded Vendor:</span>
                    <strong className="text-foreground">ElectroMex Solutions Pvt. Ltd.</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total PO Value:</span>
                    <strong className="text-emerald-700 dark:text-emerald-300 font-extrabold">₹3,86,000.00</strong>
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">PO Delivery Target Date</label>
                  <input
                    type="date"
                    defaultValue="2026-05-20"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowPoModal(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreatePo}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Confirm & Release Purchase Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PRINT RFQ DOCKET */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl rounded-2xl border border-border bg-white text-slate-900 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <div className="text-xl font-extrabold text-slate-900 tracking-tight">MAGNERTIA SYSTEMS ERP</div>
                  <div className="text-xs font-semibold text-slate-500">REQUEST FOR QUOTATION (RFQ) SPECIFICATION DOCKET</div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-base font-black text-slate-900">{rfqMaster.rfqNumber}</div>
                  <div className="text-slate-500">Issued: {rfqMaster.rfqDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Project & Sourcing</div>
                  <div className="mt-1 font-semibold">{rfqMaster.rfqTitle}</div>
                  <div className="text-slate-500">PR Ref: {rfqMaster.sourcePrNumber} · Dept: {rfqMaster.department}</div>
                  <div className="text-slate-500">Buyer: {rfqMaster.contactPerson} ({rfqMaster.contactEmail})</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Bidding Milestones</div>
                  <div className="mt-1 font-semibold text-rose-700">Due Date: {rfqMaster.quotationDueDate}</div>
                  <div className="text-slate-500">Delivery Location: {rfqMaster.deliveryLocation}</div>
                  <div className="text-slate-500">Payment: {rfqMaster.paymentTerms}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Scope of Supply (Bill of Quantities)</div>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Item Description</th>
                      <th className="p-2">Code</th>
                      <th className="p-2">UOM</th>
                      <th className="p-2 text-right">Required Qty</th>
                      <th className="p-2">Target Date</th>
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
                        <td className="p-2">{item.requiredDeliveryDate}</td>
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
                  Print PDF Docket
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: UPLOAD RFQ DOCUMENT */}
        {showUploadDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Upload RFQ Document</h3>
                    <p className="text-xs text-muted-foreground">Attach drawings, spec sheets or supplier submissions</p>
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
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Select File *</label>
                  <div className="rounded-xl border-2 border-dashed border-border/80 bg-muted/20 p-5 text-center hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-primary mb-2 opacity-80" />
                    <div className="font-semibold text-foreground">
                      {docUploadForm.name ? (
                        <span className="text-primary font-mono">{docUploadForm.name}</span>
                      ) : (
                        "Click to browse or drop file here"
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Supports PDF, XLSX, DOCX, ZIP (Max 25MB)
                    </p>
                    <input
                      type="file"
                      required={!docUploadForm.name}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDocUploadForm((prev) => ({
                            ...prev,
                            name: file.name,
                          }));
                        }
                      }}
                      className="mt-3 block w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Document Type</label>
                    <select
                      value={docUploadForm.type}
                      onChange={(e) => setDocUploadForm({ ...docUploadForm, type: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>RFQ Document</option>
                      <option>Technical Spec</option>
                      <option>Supplier Quotation</option>
                      <option>Comparative CS</option>
                      <option>Compliance Report</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Uploaded By</label>
                    <input
                      type="text"
                      value={docUploadForm.user}
                      onChange={(e) => setDocUploadForm({ ...docUploadForm, user: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                    />
                  </div>
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
                    <Upload className="h-3.5 w-3.5" /> Upload & Attach
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: RECORD SUPPLIER QUOTATION */}
        {showAddQuoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Record Supplier Quotation</h3>
                    <p className="text-xs text-muted-foreground">Capture itemized bid pricing, taxes, lead times, and terms</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddQuoteModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleRecordQuotation} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Invited Supplier *</label>
                    <select
                      value={newQuoteForm.supplierName}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, supplierName: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Schneider Electric India Pvt Ltd</option>
                      <option>ABB Power & Automation</option>
                      <option>L&T Electrical & Automation</option>
                      <option>ElectroMex Solutions Pvt. Ltd.</option>
                      <option>PowerGrid Components</option>
                      <option>Siemens India Ltd</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Quotation Reference #</label>
                    <input
                      type="text"
                      placeholder="e.g. QT-2026-0045"
                      value={newQuoteForm.quoteNumber}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, quoteNumber: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-primary font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Basic Subtotal (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newQuoteForm.subtotal}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, subtotal: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Discount (₹)</label>
                    <input
                      type="number"
                      value={newQuoteForm.discount}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, discount: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-emerald-600 dark:text-emerald-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Freight & Insurance (₹)</label>
                    <input
                      type="number"
                      value={newQuoteForm.freight + newQuoteForm.insurance}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, freight: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">GST Tax Amount (₹)</label>
                    <input
                      type="number"
                      value={newQuoteForm.tax}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, tax: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Lead Time (Days) *</label>
                    <input
                      type="number"
                      required
                      value={newQuoteForm.deliveryLeadTimeDays}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, deliveryLeadTimeDays: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Delivery Terms</label>
                    <select
                      value={newQuoteForm.deliveryTerms}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, deliveryTerms: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>FOR Destination</option>
                      <option>Ex-Works Factory</option>
                      <option>FOB Port</option>
                      <option>CIF Project Site</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Payment Terms</label>
                  <select
                    value={newQuoteForm.paymentTerms}
                    onChange={(e) => setNewQuoteForm({ ...newQuoteForm, paymentTerms: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                  >
                    <option>Net 30 Days</option>
                    <option>Net 45 Days</option>
                    <option>Net 60 Days</option>
                    <option>100% Advance Against PI</option>
                    <option>30% Advance, 70% Against Dispatch</option>
                  </select>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-muted-foreground">Computed Landed Cost:</span>
                    <div className="text-base font-black text-primary mt-0.5">
                      ₹{(Number(newQuoteForm.subtotal) - Number(newQuoteForm.discount) + Number(newQuoteForm.freight) + Number(newQuoteForm.tax)).toLocaleString("en-IN")}.00
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Auto-Computed Total
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddQuoteModal(false)}
                    className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" /> Save & Record Quotation
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
