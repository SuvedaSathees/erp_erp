// Magnertia ERP - Technical Library Service
// Management -> Knowledge Management -> Technical Library
// Technical Library Form — MAICW Classification, Specs, Engineering Parameters & CAD/Simulation References

export interface TechnicalLibraryRecord {
  technicalKnowledgeId: string;
  technicalRefNo: string;
  technicalTitle: string;
  technicalType: "Design Guide" | "Specification" | "Datasheet" | "Application Note" | "Calculation Note" | "Test Report";
  technicalCategory: "Wireless Charging" | "Power Electronics" | "Embedded Systems" | "Thermal Management" | "Mechanical";
  module: string;
  submodule: string;
  description: string;
  department: string;
  process: string;
  technicalOwner: string;
  subjectMatterExpert: string;
  organization: string;
  branchSite: string;
  version: string;
  status: "Draft" | "Review" | "Approved" | "Published" | "Revision" | "Obsolete";
  confidentiality: "Public" | "Internal" | "Confidential" | "Restricted";
  effectiveDate: string;
  reviewDate: string;

  // Classification & Metadata
  knowledgeDomain: string;
  technologyArea: string;
  engineeringDisciplines: string[];
  productFamily: string;
  applicationAreas: string[];
  technologyMaturity: string;
  criticality: "Low" | "Medium" | "High" | "Critical";
  keywords: string[];

  // Related Information
  relatedProduct: string;
  relatedProject: string;
  relatedComponent: string;
  relatedStandard: string;
  relatedBestPractice: string;
  relatedLessonLearned: string;

  // Applicability
  applicableProjectTypes: string[];
  applicableProducts: string[];
  applicableSites: string[];
  applicabilityCriteria: string;
}

export interface TechnicalParameterItem {
  parameter: string;
  value: string;
  unit: string;
  min: string;
  nominal: string;
  max: string;
  tolerance: string;
}

export interface TechnicalDocumentFileItem {
  fileName: string;
  type: "PDF" | "XLSX" | "STEP" | "DOCX";
  size: string;
  version: string;
  uploadedOn: string;
}

export const PRIMARY_TECHNICAL_RECORD: TechnicalLibraryRecord = {
  technicalKnowledgeId: "TL-2026-0018",
  technicalRefNo: "EV-WPT-DS-001",
  technicalTitle: "Wireless Power Transfer System Design Guide",
  technicalType: "Design Guide",
  technicalCategory: "Wireless Charging",
  module: "Product Development",
  submodule: "EV Charging System",
  description:
    "Comprehensive design guide for inductive wireless power transfer (WPT) system for electric vehicle charging, including coil design, power electronics, alignment, thermal management and safety considerations.",
  department: "R&D",
  process: "Technology Development",
  technicalOwner: "Ramesh S",
  subjectMatterExpert: "Priya Sharma",
  organization: "Magnertia Private Limited",
  branchSite: "Coimbatore - Dev Centre",
  version: "v2.1",
  status: "Published",
  confidentiality: "Internal",
  effectiveDate: "01-Aug-2026",
  reviewDate: "01-Aug-2027",

  knowledgeDomain: "Electrical & Electronics",
  technologyArea: "Wireless Power Transfer (WPT)",
  engineeringDisciplines: ["Electrical", "Electronics", "Power Electronics"],
  productFamily: "EV Charging System",
  applicationAreas: ["EV Charging", "Public Charging", "Autonomous Charging"],
  technologyMaturity: "Production Ready",
  criticality: "High",
  keywords: ["WPT", "Inductive Charging", "Coil Design", "Inverter", "Alignment"],

  relatedProduct: "Magnertia Autonomous EVSE",
  relatedProject: "PRJ-2026-004 - Autonomous EV Charging",
  relatedComponent: "WPT Transmitter Coil (CMP-0012)",
  relatedStandard: "IEC 61980-1, SAE J2954",
  relatedBestPractice: "BP-2026-0005 - Coil Alignment Method",
  relatedLessonLearned: "LL-2026-0009 - Thermal Management in WPT",

  applicableProjectTypes: ["R&D", "Product Development", "Manufacturing", "Public Charging"],
  applicableProducts: ["Magnertia EVSE", "DC Fast Charger", "Wall Mount AC"],
  applicableSites: ["All Sites"],
  applicabilityCriteria:
    "Applicable for static wireless charging systems (3.3 kW - 22 kW) with ground clearance 100-250 mm.",
};

export const TECHNICAL_LIBRARY_KPIS = {
  totalDocuments: 842,
  totalDocumentsChange: 18,
  published: 716,
  publishedChange: 22,
  underReview: 64,
  underReviewChange: -27,
  obsolete: 32,
  obsoleteChange: -12,
  standards: 18,
  standardsChange: 50,
  componentDatasheets: 156,
  componentDatasheetsChange: 35,
};

export const TECHNICAL_PARAMETERS_DATA: TechnicalParameterItem[] = [
  { parameter: "Input Voltage", value: "400", unit: "V", min: "320", nominal: "400", max: "480", tolerance: "±5%" },
  { parameter: "Output Power", value: "11", unit: "kW", min: "3.3", nominal: "11", max: "22", tolerance: "±5%" },
  { parameter: "Operating Frequency", value: "85", unit: "kHz", min: "81", nominal: "85", max: "90", tolerance: "±2%" },
  { parameter: "Coupling Gap", value: "150", unit: "mm", min: "100", nominal: "150", max: "250", tolerance: "±10%" },
  { parameter: "System Efficiency", value: "92", unit: "%", min: "90", nominal: "92", max: "94", tolerance: "-" },
  { parameter: "Coil Temperature (Max)", value: "85", unit: "°C", min: "-", nominal: "-", max: "85", tolerance: "-" },
];

export const TECHNICAL_DOCUMENTS_FILES: TechnicalDocumentFileItem[] = [
  { fileName: "WPT_Design_Guide_v2.1.pdf", type: "PDF", size: "4.2 MB", version: "v2.1", uploadedOn: "01-Aug-2026" },
  { fileName: "Coil_Design_Calculations.xlsx", type: "XLSX", size: "1.1 MB", version: "v2.1", uploadedOn: "28-Jul-2026" },
  { fileName: "Magnetic_Simulation_Report.pdf", type: "PDF", size: "3.8 MB", version: "v2.0", uploadedOn: "15-Jul-2026" },
  { fileName: "Mechanical_Drawing.step", type: "STEP", size: "12.4 MB", version: "v1.3", uploadedOn: "10-Jul-2026" },
  { fileName: "Test_Report_EMC.pdf", type: "PDF", size: "2.1 MB", version: "v1.0", uploadedOn: "05-Jul-2026" },
];

export const TECHNICAL_LIBRARY_AI_INSIGHTS: string[] = [
  "Similar documents: 8 found (coil design, alignment, thermal).",
  "Recommended to link with IEC 61980-3 standard.",
  "High reuse potential in upcoming DC fast charger project.",
  "Consider adding cost analysis section.",
  "Outdated reference found: v1.0 (recommended for archive).",
];

export const TECHNICAL_USAGE_METRICS = {
  totalViews: 142,
  totalViewsChange: 28,
  downloads: 56,
  downloadsChange: 35,
  timesReused: 12,
  timesReusedChange: 71,
  projectsUsed: 6,
  projectsUsedChange: 50,
};
