/**
 * Sustainability Management Service
 * Magnertia ERP - Management → Sustainability Management
 *
 * Implements data structures and state for the 9 submodules:
 * 1. Overview (Unified Executive Command Center)
 * 2. ESG (Environmental, Social, Governance Program)
 * 3. Carbon Footprint (Corporate GHG Inventory, Scopes 1-3)
 * 4. Energy Monitoring (Real-Time EMS, Meters, Hierarchy)
 * 5. Water Management (Intake, Consumption, ZLD, Quality)
 * 6. Waste Management (Generation, Segregation, Manifests, Landfill)
 * 7. Recycling Management (Materials, Sorting, Reprocessing, Value Recovery)
 * 8. Environmental Compliance (Permits, Consent Conditions, Stack/Effluent Testing, NCRs)
 * 9. Sustainability Reporting (7-Step Publication Workflow, Materiality, Frameworks)
 */

// 1. ESG Master
export interface ESGProgramMaster {
  esgId: string;
  referenceNo: string;
  programName: string;
  frameworks: string[];
  pillars: ("Environmental" | "Social" | "Governance")[];
  category: string;
  organization: string;
  businessFunction: string;
  sitePlant: string;
  owner: { name: string; avatar: string; role: string };
  coordinator: { name: string; avatar: string; role: string };
  reportingPeriod: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  materiality: "Low" | "Moderate" | "High" | "Critical";
  status: "Draft" | "Active" | "Under Review" | "Approved" | "Archived";
  confidentiality: "Public" | "Internal" | "Confidential" | "Restricted";
  description: string;
  scorecard: {
    environmental: number;
    social: number;
    governance: number;
    overall: number;
  };
}

// 2. Carbon Footprint Master
export interface CarbonFootprintMaster {
  footprintId: string;
  referenceNo: string;
  programName: string;
  assessmentType: string;
  reportingFramework: string;
  reportingPeriod: string;
  organization: string;
  sitePlant: string;
  businessFunction: string;
  boundaryType: "Operational Control" | "Financial Control" | "Equity Share";
  carbonOwner: { name: string; avatar: string; role: string };
  carbonCoordinator: { name: string; avatar: string; role: string };
  baseYear: number;
  currency: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  materiality: "Low" | "Moderate" | "High" | "Critical";
  confidentiality: "Public" | "Internal" | "Confidential";
  status: "Draft" | "Active" | "In Review" | "Verified";
  description: string;
  metrics: {
    totalEmissions: number; // tCO2e
    scope1: number;
    scope2: number;
    scope3: number;
    removals: number;
    netEmissions: number;
    intensity: number; // kgCO2e/unit
    reductionPct: number;
    baseline2023: number;
    target2030: number;
  };
}

// 3. Energy Monitoring Master
export interface EnergyMonitoringMaster {
  energyId: string;
  referenceNo: string;
  programName: string;
  monitoringType: string;
  organization: string;
  sitePlant: string;
  department: string;
  reportingPeriod: string;
  baseYear: number;
  energyOwner: { name: string; avatar: string; role: string };
  coordinator: { name: string; avatar: string; role: string };
  status: "Active" | "Maintenance" | "Under Review";
  confidentiality: "Internal" | "Confidential";
  description: string;
  metrics: {
    totalConsumptionGWh: number;
    renewableEnergyPct: number;
    energyCostLakhs: number;
    energyIntensityKWhPerUnit: number;
    peakDemandKW: number;
    carbonEmissionsTCO2e: number;
  };
}

// 4. Water Management Master
export interface WaterManagementMaster {
  waterId: string;
  referenceNo: string;
  programName: string;
  monitoringType: string;
  waterFramework: string;
  organization: string;
  sitePlant: string;
  buildingArea: string;
  department: string;
  waterOwner: { name: string; avatar: string; role: string };
  waterCoordinator: { name: string; avatar: string; role: string };
  reportingPeriod: string;
  baseYear: number;
  waterStressClassification: "Low" | "Medium" | "High" | "Critical";
  status: "Active" | "Under Review" | "Closed";
  confidentiality: "Internal" | "Public";
  description: string;
  metrics: {
    totalIntakeML: number;
    consumptionML: number;
    recycledWaterPct: number;
    freshwaterML: number;
    dischargeML: number;
    waterIntensityLPerUnit: number;
    waterCostLakhs: number;
    compliancePct: number;
  };
}

// 5. Waste Management Master
export interface WasteManagementMaster {
  wasteId: string;
  referenceNo: string;
  programName: string;
  monitoringType: string;
  organization: string;
  sitePlant: string;
  department: string;
  reportingPeriod: string;
  baseYear: number;
  wasteOwner: { name: string; avatar: string; role: string };
  coordinator: { name: string; avatar: string; role: string };
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Active" | "Under Review" | "Archived";
  confidentiality: "Internal" | "Public";
  description: string;
  metrics: {
    totalGeneratedTonnes: number;
    recyclingRatePct: number;
    recoveryRatePct: number;
    toLandfillPct: number;
    wasteIntensityKgPerUnit: number;
    wasteCostLakhs: number;
    hazardousTonnes: number;
    recyclableTonnes: number;
    landfillDiversionPct: number;
    compliancePct: number;
  };
}

// 6. Recycling Management Master
export interface RecyclingManagementMaster {
  recyclingId: string;
  referenceNo: string;
  programName: string;
  recyclingType: string;
  organization: string;
  sitePlant: string;
  department: string;
  reportingPeriod: string;
  baseYear: number;
  recyclingOwner: { name: string; avatar: string; role: string };
  coordinator: { name: string; avatar: string; role: string };
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Active" | "Under Review" | "Closed";
  confidentiality: "Internal" | "Public";
  description: string;
  metrics: {
    totalRecyclableTonnes: number;
    recyclingRatePct: number;
    recoveryRatePct: number;
    recycledOutputTonnes: number;
    materialValueRecoveredLakhs: number;
    landfillDiversionPct: number;
    virginMaterialAvoidedTonnes: number;
    emissionsAvoidedTCO2e: number;
  };
}

// 7. Environmental Compliance Master
export interface EnvironmentalComplianceMaster {
  complianceId: string;
  referenceNo: string;
  programName: string;
  complianceType: string;
  organization: string;
  sitePlant: string;
  department: string;
  reportingPeriod: string;
  baseYear: number;
  complianceOwner: { name: string; avatar: string; role: string };
  coordinator: { name: string; avatar: string; role: string };
  priority: "Low" | "Medium" | "High" | "Critical";
  overallStatus: "Compliant" | "Action Required" | "Non-Compliant";
  confidentiality: "Internal" | "Public";
  description: string;
  metrics: {
    totalRequirements: number;
    complianceRatePct: number;
    activePermits: number;
    expiringPermits: number;
    monitoringRecords: number;
    openNCRs: number;
    openCAPAs: number;
    environmentalIncidents: number;
  };
}

// 8. Sustainability Reporting Master
export interface SustainabilityReportingMaster {
  reportId: string;
  referenceNo: string;
  reportTitle: string;
  complianceType: string;
  reportingFrameworks: string[];
  reportingPeriod: string;
  reportingYear: number;
  organization: string;
  sitePlant: string;
  reportOwner: { name: string; avatar: string; role: string };
  coordinator: { name: string; avatar: string; role: string };
  consolidationMethod: string;
  assuranceLevel: "None" | "Limited" | "Reasonable";
  overallStatus: "Draft" | "In Progress" | "Under Review" | "Approved" | "Published";
  confidentiality: "Internal" | "Public" | "Confidential";
  description: string;
  metrics: {
    activeReports: number;
    kpiDataPoints: number;
    dataCompletenessPct: number;
    targetsOnTrack: string;
    initiativesCount: number;
    assuranceCoveragePct: number;
  };
}

export interface SustainabilityReport {
  id: string;
  reportCode: string;
  title: string;
  submodule: string;
  framework: string;
  frequency: "Monthly" | "Quarterly" | "Annual" | "On-Demand";
  period: string;
  lastGenerated: string;
  generatedBy: string;
  status: "Published" | "In Progress" | "Draft" | "Verified";
  assuranceStatus: "Third-Party Assured" | "Internally Verified" | "Pending Assurance" | "Self-Declared";
  fileSize: string;
  description: string;
  keyKPIs: { label: string; value: string; variance?: string }[];
}

// ---------------- MOCK DATA COLLECTIONS ---------------- //

export const mockESGProgram: ESGProgramMaster = {
  esgId: "ESG-2026-001",
  referenceNo: "ESG-2026-001",
  programName: "Sustainable Growth 2030",
  frameworks: ["GRI", "BRSR", "UN SDGs", "ISO 14001"],
  pillars: ["Environmental", "Social", "Governance"],
  category: "Sustainability Program",
  organization: "Magnertia Private Limited",
  businessFunction: "Sustainability & Operations",
  sitePlant: "Coimbatore Development Centre",
  owner: { name: "Arun Kumar", avatar: "AK", role: "General Manager" },
  coordinator: { name: "Ramesh S", avatar: "RS", role: "ESG Coordinator" },
  reportingPeriod: "FY 2026",
  priority: "High",
  materiality: "Critical",
  status: "Active",
  confidentiality: "Internal",
  description:
    "Drive sustainable growth through innovative clean energy solutions while creating positive environmental, social and governance impact across value chain.",
  scorecard: {
    environmental: 87,
    social: 94,
    governance: 98,
    overall: 93,
  },
};

export const mockCarbonFootprint: CarbonFootprintMaster = {
  footprintId: "CF-2026-001",
  referenceNo: "CF-2026-001",
  programName: "Magnertia Corporate Carbon Footprint",
  assessmentType: "Organizational Carbon Footprint",
  reportingFramework: "GHG Protocol",
  reportingPeriod: "FY 2026",
  organization: "Magnertia Private Limited",
  sitePlant: "All Sites",
  businessFunction: "Corporate",
  boundaryType: "Operational Control",
  carbonOwner: { name: "Arun Kumar", avatar: "AK", role: "General Manager" },
  carbonCoordinator: { name: "Ramesh S", avatar: "RS", role: "Carbon Coordinator" },
  baseYear: 2023,
  currency: "INR",
  priority: "High",
  materiality: "High",
  confidentiality: "Internal",
  status: "Active",
  description:
    "Corporate carbon footprint for all operations including manufacturing, offices, logistics and business travel aligned with GHG Protocol and our Net Zero 2030 commitment.",
  metrics: {
    totalEmissions: 1248,
    scope1: 286,
    scope2: 412,
    scope3: 550,
    removals: 0,
    netEmissions: 1248,
    intensity: 10.4,
    reductionPct: 18,
    baseline2023: 1520,
    target2030: 912,
  },
};

export const mockEnergyMonitoring: EnergyMonitoringMaster = {
  energyId: "ENM-2026-001",
  referenceNo: "ENM-2026-001",
  programName: "Plant Energy Monitoring",
  monitoringType: "Facility Energy Monitoring",
  organization: "Magnertia Private Limited",
  sitePlant: "Coimbatore Development Centre",
  department: "Operations",
  reportingPeriod: "Sep 2026",
  baseYear: 2023,
  energyOwner: { name: "Arun Kumar", avatar: "AK", role: "General Manager" },
  coordinator: { name: "Ramesh S", avatar: "RS", role: "Energy Coordinator" },
  status: "Active",
  confidentiality: "Internal",
  description:
    "Monitor and optimize energy consumption across the Coimbatore plant to improve energy efficiency and reduce carbon emissions.",
  metrics: {
    totalConsumptionGWh: 1.82,
    renewableEnergyPct: 42,
    energyCostLakhs: 18.6,
    energyIntensityKWhPerUnit: 14.2,
    peakDemandKW: 186,
    carbonEmissionsTCO2e: 412,
  },
};

export const mockWaterManagement: WaterManagementMaster = {
  waterId: "WM-2026-001",
  referenceNo: "WM-2026-001",
  programName: "Plant Water Management",
  monitoringType: "Facility Water Monitoring",
  waterFramework: "ISO 14046",
  organization: "Magnertia Private Limited",
  sitePlant: "Coimbatore Development Centre",
  buildingArea: "Main Plant",
  department: "Operations",
  waterOwner: { name: "Arun Kumar", avatar: "AK", role: "General Manager" },
  waterCoordinator: { name: "Ramesh S", avatar: "RS", role: "Water Coordinator" },
  reportingPeriod: "FY 2026",
  baseYear: 2023,
  waterStressClassification: "Medium",
  status: "Active",
  confidentiality: "Internal",
  description:
    "Monitor, manage and reduce water consumption across plant operations with a focus on recycling, reuse and sustainable water management.",
  metrics: {
    totalIntakeML: 2.48,
    consumptionML: 2.16,
    recycledWaterPct: 38,
    freshwaterML: 1.54,
    dischargeML: 0.62,
    waterIntensityLPerUnit: 16.8,
    waterCostLakhs: 12.4,
    compliancePct: 100,
  },
};

export const mockWasteManagement: WasteManagementMaster = {
  wasteId: "WM-2026-001",
  referenceNo: "WM-2026-001",
  programName: "Plant Waste Management",
  monitoringType: "Facility Waste Monitoring",
  organization: "Magnertia Private Limited",
  sitePlant: "Coimbatore Development Centre",
  department: "Operations",
  reportingPeriod: "FY 2026",
  baseYear: 2023,
  wasteOwner: { name: "Arun Kumar", avatar: "AK", role: "General Manager" },
  coordinator: { name: "Ramesh S", avatar: "RS", role: "Coordinator" },
  priority: "High",
  status: "Active",
  confidentiality: "Internal",
  description:
    "Manage waste generation, segregation, recycling and disposal across plant operations with a focus on zero landfill.",
  metrics: {
    totalGeneratedTonnes: 184.6,
    recyclingRatePct: 68.3,
    recoveryRatePct: 14.8,
    toLandfillPct: 16.9,
    wasteIntensityKgPerUnit: 4.2,
    wasteCostLakhs: 12.4,
    hazardousTonnes: 18.4,
    recyclableTonnes: 126.2,
    landfillDiversionPct: 83.1,
    compliancePct: 97,
  },
};

export const mockRecyclingManagement: RecyclingManagementMaster = {
  recyclingId: "RM-2026-001",
  referenceNo: "RM-2026-001",
  programName: "Plant Recycling Management",
  recyclingType: "Facility Recycling",
  organization: "Magnertia Private Limited",
  sitePlant: "Coimbatore Development Centre",
  department: "Operations",
  recyclingOwner: { name: "Arun Kumar", avatar: "AK", role: "General Manager" },
  coordinator: { name: "Ramesh S", avatar: "RS", role: "Recycling Coordinator" },
  reportingPeriod: "FY 2026",
  baseYear: 2023,
  priority: "High",
  status: "Active",
  confidentiality: "Internal",
  description:
    "Manage recyclable materials across all operations with a focus on circular economy, resource recovery, and zero landfill commitment.",
  metrics: {
    totalRecyclableTonnes: 126.2,
    recyclingRatePct: 68.3,
    recoveryRatePct: 14.8,
    recycledOutputTonnes: 79.4,
    materialValueRecoveredLakhs: 14.2,
    landfillDiversionPct: 83.1,
    virginMaterialAvoidedTonnes: 64.8,
    emissionsAvoidedTCO2e: 212,
  },
};

export const mockEnvironmentalCompliance: EnvironmentalComplianceMaster = {
  complianceId: "EC-2026-001",
  referenceNo: "EC-2026-001",
  programName: "Environmental Compliance Program",
  complianceType: "Regulatory Compliance",
  organization: "Magnertia Private Limited",
  sitePlant: "Coimbatore Development Centre",
  department: "Operations",
  complianceOwner: { name: "Arun Kumar", avatar: "AK", role: "General Manager" },
  coordinator: { name: "Ramesh S", avatar: "RS", role: "Compliance Coordinator" },
  reportingPeriod: "FY 2026",
  baseYear: 2023,
  priority: "High",
  overallStatus: "Compliant",
  confidentiality: "Internal",
  description:
    "Ensure compliance with applicable environmental laws, permits, consent conditions and sustainability commitments across all operations.",
  metrics: {
    totalRequirements: 186,
    complianceRatePct: 95.8,
    activePermits: 18,
    expiringPermits: 3,
    monitoringRecords: 142,
    openNCRs: 7,
    openCAPAs: 6,
    environmentalIncidents: 2,
  },
};

export const mockSustainabilityReporting: SustainabilityReportingMaster = {
  reportId: "SR-2026-001",
  referenceNo: "SR-2026",
  reportTitle: "Annual Sustainability Report",
  complianceType: "Regulatory & Voluntary Report",
  reportingFrameworks: ["GRI", "BRSR", "TCFD"],
  reportingPeriod: "01 Jan 2026 - 31 Dec 2026",
  reportingYear: 2026,
  organization: "Magnertia Private Limited",
  sitePlant: "All Sites (12)",
  reportOwner: { name: "Arun Kumar", avatar: "AK", role: "General Manager" },
  coordinator: { name: "Ramesh S", avatar: "RS", role: "Sustainability Coordinator" },
  consolidationMethod: "Consolidated",
  assuranceLevel: "Limited",
  overallStatus: "In Progress",
  confidentiality: "Internal",
  description:
    "Comprehensive sustainability performance report covering Environmental, Social and Governance (ESG) disclosures, aligned with GRI, SASB and TCFD frameworks.",
  metrics: {
    activeReports: 8,
    kpiDataPoints: 486,
    dataCompletenessPct: 95.8,
    targetsOnTrack: "27 / 34",
    initiativesCount: 12,
    assuranceCoveragePct: 92,
  },
};

export const mockSustainabilityReports: SustainabilityReport[] = [
  {
    id: "REP-SR-001",
    reportCode: "SR-2026-001",
    title: "Annual Integrated Sustainability Report 2026",
    submodule: "Sustainability Reporting",
    framework: "GRI Standards 2021 & BRSR",
    frequency: "Annual",
    period: "FY 2026",
    lastGenerated: "28 Sep 2026, 09:30 AM",
    generatedBy: "Arun Kumar",
    status: "In Progress",
    assuranceStatus: "Third-Party Assured",
    fileSize: "4.2 MB",
    description: "Executive annual ESG report covering Environmental, Social, and Governance pillars, materiality analysis, and statutory disclosures.",
    keyKPIs: [
      { label: "Data Completeness", value: "95.8%", variance: "+3.2%" },
      { label: "Assurance Coverage", value: "92%", variance: "+10%" },
      { label: "Targets on Track", value: "27 / 34", variance: "79%" },
    ],
  },
  {
    id: "REP-EC-002",
    reportCode: "EC-2026-001",
    title: "Environmental Compliance & Statutory Consent Audit",
    submodule: "Environmental Compliance",
    framework: "State Pollution Control Board / CPCB",
    frequency: "Monthly",
    period: "Sep 2026",
    lastGenerated: "28 Sep 2026, 11:15 AM",
    generatedBy: "Ramesh S",
    status: "Published",
    assuranceStatus: "Internally Verified",
    fileSize: "2.4 MB",
    description: "Verification of Consent to Operate (CTO), stack emission monitoring (PM, NOx, SOx), effluent discharge parameters, and open CAPAs.",
    keyKPIs: [
      { label: "Compliance Rate", value: "95.8%", variance: "+2.3%" },
      { label: "Active Permits", value: "18", variance: "0 Expired" },
      { label: "Open NCRs", value: "7", variance: "-40%" },
    ],
  },
  {
    id: "REP-RM-003",
    reportCode: "RM-2026-001",
    title: "Plant Circular Economy & Recycling Material Ledger",
    submodule: "Recycling Management",
    framework: "Circular Economy / ISO 14001",
    frequency: "Monthly",
    period: "Sep 2026",
    lastGenerated: "28 Sep 2026, 10:45 AM",
    generatedBy: "Arun Kumar",
    status: "Published",
    assuranceStatus: "Internally Verified",
    fileSize: "3.1 MB",
    description: "Material sorting throughput, secondary raw material output, recycling vendor certificates, and virgin material avoidance accounting.",
    keyKPIs: [
      { label: "Recycling Rate", value: "68.3%", variance: "+8%" },
      { label: "Recycled Output", value: "79.4 t", variance: "+10%" },
      { label: "Material Value", value: "₹14.2 L", variance: "+18%" },
    ],
  },
  {
    id: "REP-CF-004",
    reportCode: "CF-2026-001",
    title: "Corporate GHG Inventory & Net Zero Pathway",
    submodule: "Carbon Footprint",
    framework: "GHG Protocol / ISO 14064",
    frequency: "Quarterly",
    period: "Q2 FY 2026",
    lastGenerated: "27 Sep 2026, 04:15 PM",
    generatedBy: "Arun Kumar",
    status: "Published",
    assuranceStatus: "Third-Party Assured",
    fileSize: "3.2 MB",
    description: "Detailed greenhouse gas accounting across direct combustion (Scope 1), purchased electricity (Scope 2), and value chain (Scope 3).",
    keyKPIs: [
      { label: "Total Emissions", value: "1,248 tCO2e", variance: "-12%" },
      { label: "Scope 1", value: "286 tCO2e", variance: "-8%" },
      { label: "Scope 2", value: "412 tCO2e", variance: "-18%" },
      { label: "Scope 3", value: "550 tCO2e", variance: "-10%" },
    ],
  },
  {
    id: "REP-ENM-005",
    reportCode: "ENM-2026-001",
    title: "Plant Energy Monitoring & EnPI Performance Audit",
    submodule: "Energy Monitoring",
    framework: "ISO 50001:2018",
    frequency: "Monthly",
    period: "Sep 2026",
    lastGenerated: "28 Sep 2026, 08:30 AM",
    generatedBy: "Ramesh S",
    status: "Published",
    assuranceStatus: "Internally Verified",
    fileSize: "2.4 MB",
    description: "Real-time energy meter logs, solar generation yield, power factor analysis, and department energy intensity KPIs.",
    keyKPIs: [
      { label: "Consumption", value: "1.82 GWh", variance: "-12%" },
      { label: "Renewable Share", value: "42%", variance: "+8%" },
      { label: "Energy Intensity", value: "14.2 kWh/u", variance: "-14%" },
    ],
  },
  {
    id: "REP-WM-006",
    reportCode: "WM-2026-001",
    title: "Water Intake, Consumption & Zero Discharge Balance",
    submodule: "Water Management",
    framework: "ISO 14046 / CPCB",
    frequency: "Monthly",
    period: "Sep 2026",
    lastGenerated: "26 Sep 2026, 02:45 PM",
    generatedBy: "Arun Kumar",
    status: "Published",
    assuranceStatus: "Internally Verified",
    fileSize: "2.4 MB",
    description: "Freshwater intake, borewell extraction, recycled water recirculation, and ETP effluent test results.",
    keyKPIs: [
      { label: "Total Intake", value: "2.48 ML", variance: "-8%" },
      { label: "Recycled Water %", value: "38%", variance: "+12%" },
      { label: "Compliance Rate", value: "100%", variance: "0 issues" },
    ],
  },
  {
    id: "REP-WST-007",
    reportCode: "WM-WST-007",
    title: "Plant Waste Generation & Landfill Diversion",
    submodule: "Waste Management",
    framework: "Hazardous & Other Wastes Rules 2016",
    frequency: "Monthly",
    period: "Sep 2026",
    lastGenerated: "28 Sep 2026, 11:20 AM",
    generatedBy: "Ramesh S",
    status: "Published",
    assuranceStatus: "Internally Verified",
    fileSize: "2.8 MB",
    description: "Waste segregation by category, licensed transporter manifests, hazardous disposal certificates, and landfill reduction.",
    keyKPIs: [
      { label: "Total Waste", value: "184.6 t", variance: "-12%" },
      { label: "Recycling Rate", value: "68.3%", variance: "+8%" },
      { label: "Landfill Diversion", value: "83.1%", variance: "+6%" },
    ],
  },
  {
    id: "REP-BRSR-008",
    reportCode: "SR-BRSR-2026",
    title: "SEBI Business Responsibility & Sustainability Reporting (BRSR)",
    submodule: "Sustainability Reporting",
    framework: "SEBI BRSR Core Guidelines",
    frequency: "Annual",
    period: "FY 2026",
    lastGenerated: "24 Sep 2026, 05:00 PM",
    generatedBy: "Compliance Team",
    status: "Published",
    assuranceStatus: "Third-Party Assured",
    fileSize: "5.6 MB",
    description: "Mandated 9 Principles disclosure reporting governance structure, ethics, employee wellbeing, human rights, environmental footprint, and stakeholder engagement.",
    keyKPIs: [
      { label: "BRSR Core Coverage", value: "100%", variance: "Complete" },
      { label: "Audited Principles", value: "9 / 9", variance: "All verified" },
      { label: "Statutory Gap", value: "0", variance: "Fully compliant" },
    ],
  },
];
