export interface WbsActivity {
  id: string;
  name: string;
  start: string;
  finish: string;
  duration: string;
  percent: number;
  status: "Planned" | "In Progress" | "Completed";
  owner?: string;
}

export interface WbsDeliverable {
  id: string;
  name: string;
  status: "Complete" | "In Progress" | "Pending";
  acceptanceCriteria?: string;
}

export interface WbsElement {
  id: string;
  code: string;
  name: string;
  type: "Phase" | "Deliverable" | "Work Package" | "Activity" | "Task" | "Milestone";
  level: number;
  parentCode: string | null;
  parentName?: string;
  version: string;
  status: "Planned" | "In Progress" | "Completed" | "On Hold";
  percent: number;
  owner: string;
  ownerRole?: string;
  ownerAvatarText?: string;
  department: string;
  businessUnit: string;
  plannedStart: string;
  plannedFinish: string;
  duration: string;
  calendar: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  critical: boolean;
  budget: string;
  budgetValue: number;
  committed: string;
  actual: string;
  remaining: string;
  description: string;
  deliverables: WbsDeliverable[];
  activities: WbsActivity[];
  weightage: number;
}

export interface ProjectPlanningRecord {
  projectPlanId: string;
  projectCode: string;
  projectName: string;
  customer: string;
  businessUnit: string;
  projectSponsor: string;
  projectType: "Customer Project" | "Internal R&D" | "EPC Project" | "Product Development";
  projectPriority: "Critical" | "High" | "Medium" | "Low";
  projectManager: string;
  department: string;
  plannedStartDate: string;
  plannedEndDate: string;
  projectDuration: string;
  projectPhase: "Initiation" | "Planning" | "Execution" | "Monitoring" | "Closure";
  planningStatus: "Draft" | "Under Review" | "Baseline Approved" | "Active";
  contractValue: string;
  budgetPlanned: string;
  lastUpdated: string;
  totalProjectsCount: number;
  onScheduleCount: number;
  atRiskCount: number;
  delayedCount: number;
  budgetUtilizationPct: number;
  budgetSpentFormatted: string;
  resourcesAllocatedCount: number;
  overallCompletionPct: number;
  wbsElementsCount: number;
  wbsCompletedCount: number;
  wbsInProgressCount: number;
  scope: {
    objective: string;
    businessCase: string;
    inScope: string[];
    outOfScope: string[];
    deliverables: string[];
    acceptanceCriteria: string[];
    constraints: string[];
    assumptions: string[];
  };
  wbsList: WbsElement[];
}

export const INITIAL_WBS_ELEMENTS: WbsElement[] = [
  {
    id: "wbs-1",
    code: "1.0",
    name: "Project Management",
    type: "Phase",
    level: 1,
    parentCode: null,
    version: "V1.0 (Baseline)",
    status: "Completed",
    percent: 100,
    owner: "Arun Kumar",
    ownerRole: "Project Manager",
    ownerAvatarText: "AK",
    department: "Project Management Office",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "01 Sep 2026",
    plannedFinish: "10 Nov 2026",
    duration: "71 Days",
    calendar: "Standard Calendar",
    priority: "Critical",
    critical: false,
    budget: "₹ 12.00 L",
    budgetValue: 12,
    committed: "₹ 8.00 L",
    actual: "₹ 3.00 L",
    remaining: "₹ 9.00 L",
    description: "Overall project governance, cadence reviews, risk management, and stakeholder steering.",
    weightage: 8,
    deliverables: [
      { id: "del-1", name: "Project Charter", status: "Complete" },
      { id: "del-2", name: "Project Execution Baseline", status: "Complete" },
    ],
    activities: [
      { id: "act-1", name: "Project Kickoff", start: "01 Sep 2026", finish: "03 Sep 2026", duration: "3d", percent: 100, status: "Completed" },
      { id: "act-2", name: "Governance Setup", start: "03 Sep 2026", finish: "05 Sep 2026", duration: "2d", percent: 100, status: "Completed" },
    ],
  },
  {
    id: "wbs-2",
    code: "2.0",
    name: "Engineering",
    type: "Phase",
    level: 1,
    parentCode: null,
    version: "V1.0 (Baseline)",
    status: "In Progress",
    percent: 82,
    owner: "Vikram Malhotra",
    ownerRole: "Chief Engineer",
    ownerAvatarText: "VM",
    department: "Engineering",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "02 Sep 2026",
    plannedFinish: "20 Sep 2026",
    duration: "19 Days",
    calendar: "Standard Calendar",
    priority: "High",
    critical: true,
    budget: "₹ 18.00 L",
    budgetValue: 18,
    committed: "₹ 10.00 L",
    actual: "₹ 5.00 L",
    remaining: "₹ 13.00 L",
    description: "System engineering, electrical schematics, firmware and mechanical enclosure development.",
    weightage: 18,
    deliverables: [
      { id: "del-3", name: "System Architecture Spec", status: "Complete" },
      { id: "del-4", name: "Validated CAD Baseline", status: "In Progress" },
    ],
    activities: [],
  },
  {
    id: "wbs-2-1",
    code: "2.1",
    name: "Requirements",
    type: "Deliverable",
    level: 2,
    parentCode: "2.0",
    parentName: "2.0 Engineering",
    version: "V1.0 (Baseline)",
    status: "Completed",
    percent: 100,
    owner: "Ananya Sen",
    ownerRole: "Lead Systems Engineer",
    ownerAvatarText: "AS",
    department: "Engineering",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "02 Sep 2026",
    plannedFinish: "07 Sep 2026",
    duration: "6 Days",
    calendar: "Standard Calendar",
    priority: "High",
    critical: true,
    budget: "₹ 4.00 L",
    budgetValue: 4,
    committed: "₹ 4.00 L",
    actual: "₹ 3.80 L",
    remaining: "₹ 0.20 L",
    description: "Stakeholder requirements definition, customer functional baseline, and power safety specs.",
    weightage: 5,
    deliverables: [
      { id: "del-5", name: "Requirements Traceability Matrix", status: "Complete" },
    ],
    activities: [
      { id: "act-3", name: "Customer Discovery Review", start: "02 Sep 2026", finish: "04 Sep 2026", duration: "3d", percent: 100, status: "Completed" },
      { id: "act-4", name: "Requirements Freeze", start: "05 Sep 2026", finish: "07 Sep 2026", duration: "3d", percent: 100, status: "Completed" },
    ],
  },
  {
    id: "wbs-2-2",
    code: "2.2",
    name: "Design",
    type: "Deliverable",
    level: 2,
    parentCode: "2.0",
    parentName: "2.0 Engineering",
    version: "V1.0 (Baseline)",
    status: "In Progress",
    percent: 82,
    owner: "Vikram Malhotra",
    ownerRole: "Chief Engineer",
    ownerAvatarText: "VM",
    department: "Engineering",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "08 Sep 2026",
    plannedFinish: "20 Sep 2026",
    duration: "13 Days",
    calendar: "Standard Calendar",
    priority: "High",
    critical: true,
    budget: "₹ 10.00 L",
    budgetValue: 10,
    committed: "₹ 6.00 L",
    actual: "₹ 3.20 L",
    remaining: "₹ 6.80 L",
    description: "Detailed electrical, electronic, mechanical, and embedded firmware design.",
    weightage: 9,
    deliverables: [
      { id: "del-6", name: "Hardware Schematics", status: "Complete" },
      { id: "del-7", name: "3D Enclosure Assembly", status: "In Progress" },
    ],
    activities: [],
  },
  {
    id: "wbs-2-2-1",
    code: "2.2.1",
    name: "Electrical Design",
    type: "Work Package",
    level: 3,
    parentCode: "2.2",
    parentName: "2.2 Design",
    version: "V1.0 (Baseline)",
    status: "In Progress",
    percent: 90,
    owner: "Rohan Patel",
    ownerRole: "Lead Electrical Engineer",
    ownerAvatarText: "RP",
    department: "Engineering",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "08 Sep 2026",
    plannedFinish: "14 Sep 2026",
    duration: "7 Days",
    calendar: "Standard Calendar",
    priority: "Critical",
    critical: true,
    budget: "₹ 2.80 L",
    budgetValue: 2.8,
    committed: "₹ 2.20 L",
    actual: "₹ 1.80 L",
    remaining: "₹ 1.00 L",
    description: "AC 22kW charging circuit topology, isolation monitoring, contactor relays, and surge safety.",
    weightage: 3,
    deliverables: [{ id: "del-8", name: "High Voltage Wiring Harness", status: "Complete" }],
    activities: [],
  },
  {
    id: "wbs-2-2-2",
    code: "2.2.2",
    name: "Electronics Design",
    type: "Work Package",
    level: 3,
    parentCode: "2.2",
    parentName: "2.2 Design",
    version: "V1.0 (Baseline)",
    status: "In Progress",
    percent: 85,
    owner: "Pooja Hegde",
    ownerRole: "Lead PCB Engineer",
    ownerAvatarText: "PH",
    department: "Engineering",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "08 Sep 2026",
    plannedFinish: "15 Sep 2026",
    duration: "8 Days",
    calendar: "Standard Calendar",
    priority: "High",
    critical: true,
    budget: "₹ 2.40 L",
    budgetValue: 2.4,
    committed: "₹ 1.80 L",
    actual: "₹ 1.40 L",
    remaining: "₹ 1.00 L",
    description: "Main controller MCU motherboard, NFC card reader interface, and LTE telemetry modem PCB.",
    weightage: 2,
    deliverables: [{ id: "del-9", name: "Controller PCB Gerbers", status: "Complete" }],
    activities: [],
  },
  {
    id: "wbs-2-2-3",
    code: "2.2.3",
    name: "Mechanical Design",
    type: "Work Package",
    level: 3,
    parentCode: "2.2",
    parentName: "2.2 Design",
    version: "V1.0 (Baseline)",
    status: "In Progress",
    percent: 62,
    owner: "Suresh Kumar",
    ownerRole: "Mechanical Engineering",
    ownerAvatarText: "SK",
    department: "Engineering",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "08 Sep 2026",
    plannedFinish: "15 Sep 2026",
    duration: "8 Days",
    calendar: "Standard Calendar",
    priority: "High",
    critical: true,
    budget: "₹ 4.80 L",
    budgetValue: 4.8,
    committed: "₹ 3.10 L",
    actual: "₹ 1.82 L",
    remaining: "₹ 2.98 L",
    description:
      "Complete mechanical design of charging infrastructure enclosure, mounting structure, base frame, cooling system and associated mechanical components as per specifications and standards.",
    weightage: 2,
    deliverables: [
      { id: "del-10", name: "3D CAD Model", status: "Complete" },
      { id: "del-11", name: "Mechanical Drawings", status: "In Progress" },
      { id: "del-12", name: "Structural Calculations", status: "In Progress" },
      { id: "del-13", name: "Material Specification", status: "Complete" },
      { id: "del-14", name: "Design Review Report", status: "In Progress" },
      { id: "del-15", name: "Design Approval", status: "Pending" },
    ],
    activities: [
      { id: "ACT-021", name: "3D CAD Design", start: "08 Sep 2026", finish: "09 Sep 2026", duration: "2d", percent: 80, status: "In Progress" },
      { id: "ACT-022", name: "Structural Analysis", start: "10 Sep 2026", finish: "12 Sep 2026", duration: "3d", percent: 55, status: "In Progress" },
      { id: "ACT-023", name: "Drawing Preparation", start: "13 Sep 2026", finish: "14 Sep 2026", duration: "2d", percent: 40, status: "In Progress" },
      { id: "ACT-024", name: "Design Review", start: "15 Sep 2026", finish: "15 Sep 2026", duration: "1d", percent: 20, status: "In Progress" },
    ],
  },
  {
    id: "wbs-2-2-4",
    code: "2.2.4",
    name: "Software Design",
    type: "Work Package",
    level: 3,
    parentCode: "2.2",
    parentName: "2.2 Design",
    version: "V1.0 (Baseline)",
    status: "In Progress",
    percent: 72,
    owner: "Kavita Nair",
    ownerRole: "Embedded Firmware Lead",
    ownerAvatarText: "KN",
    department: "Engineering",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "08 Sep 2026",
    plannedFinish: "18 Sep 2026",
    duration: "11 Days",
    calendar: "Standard Calendar",
    priority: "High",
    critical: false,
    budget: "₹ 3.00 L",
    budgetValue: 3.0,
    committed: "₹ 2.00 L",
    actual: "₹ 1.20 L",
    remaining: "₹ 1.80 L",
    description: "OCPP 2.0.1 protocol stack, smart charge load balancing algorithms, and local HMI UI.",
    weightage: 2,
    deliverables: [{ id: "del-16", name: "Firmware v1.0 Flash Image", status: "In Progress" }],
    activities: [],
  },
  {
    id: "wbs-2-3",
    code: "2.3",
    name: "Engineering Validation",
    type: "Deliverable",
    level: 2,
    parentCode: "2.0",
    parentName: "2.0 Engineering",
    version: "V1.0 (Baseline)",
    status: "In Progress",
    percent: 50,
    owner: "Harish Rao",
    ownerRole: "Validation Specialist",
    ownerAvatarText: "HR",
    department: "Engineering",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "16 Sep 2026",
    plannedFinish: "20 Sep 2026",
    duration: "5 Days",
    calendar: "Standard Calendar",
    priority: "High",
    critical: true,
    budget: "₹ 2.50 L",
    budgetValue: 2.5,
    committed: "₹ 1.50 L",
    actual: "₹ 0.80 L",
    remaining: "₹ 1.70 L",
    description: "Thermal chamber stress testing, IP65 ingress validation, and drop testing.",
    weightage: 2,
    deliverables: [{ id: "del-17", name: "Environmental Test Report", status: "In Progress" }],
    activities: [],
  },
  {
    id: "wbs-2-4",
    code: "2.4",
    name: "Documentation",
    type: "Deliverable",
    level: 2,
    parentCode: "2.0",
    parentName: "2.0 Engineering",
    version: "V1.0 (Baseline)",
    status: "In Progress",
    percent: 35,
    owner: "Meera Krishnan",
    ownerRole: "Technical Writer",
    ownerAvatarText: "MK",
    department: "Engineering",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "15 Sep 2026",
    plannedFinish: "22 Sep 2026",
    duration: "8 Days",
    calendar: "Standard Calendar",
    priority: "Medium",
    critical: false,
    budget: "₹ 1.50 L",
    budgetValue: 1.5,
    committed: "₹ 0.50 L",
    actual: "₹ 0.20 L",
    remaining: "₹ 1.30 L",
    description: "Installation manual, user operating handbook, and schematics documentation.",
    weightage: 2,
    deliverables: [{ id: "del-18", name: "OEM User Manual", status: "In Progress" }],
    activities: [],
  },
  {
    id: "wbs-3",
    code: "3.0",
    name: "Procurement",
    type: "Phase",
    level: 1,
    parentCode: null,
    version: "V1.0 (Baseline)",
    status: "In Progress",
    percent: 68,
    owner: "Ravi Teja",
    ownerRole: "Procurement Head",
    ownerAvatarText: "RT",
    department: "Supply Chain",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "10 Sep 2026",
    plannedFinish: "25 Sep 2026",
    duration: "16 Days",
    calendar: "Standard Calendar",
    priority: "Critical",
    critical: true,
    budget: "₹ 85.00 L",
    budgetValue: 85,
    committed: "₹ 62.00 L",
    actual: "₹ 28.00 L",
    remaining: "₹ 57.00 L",
    description: "Vendor selection, PO release, critical controller chipsets, transformers, and sheet metal fabrication sourcing.",
    weightage: 20,
    deliverables: [
      { id: "del-19", name: "Procured Controller Units (500 units)", status: "In Progress" },
      { id: "del-20", name: "High-grade Steel Enclosures (10,000 kg)", status: "In Progress" },
    ],
    activities: [],
  },
  {
    id: "wbs-4",
    code: "4.0",
    name: "Production",
    type: "Phase",
    level: 1,
    parentCode: null,
    version: "V1.0 (Baseline)",
    status: "In Progress",
    percent: 54,
    owner: "Devendra Sahu",
    ownerRole: "Plant Operations Manager",
    ownerAvatarText: "DS",
    department: "Manufacturing",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "26 Sep 2026",
    plannedFinish: "15 Oct 2026",
    duration: "20 Days",
    calendar: "Standard Calendar",
    priority: "Critical",
    critical: true,
    budget: "₹ 32.00 L",
    budgetValue: 32,
    committed: "₹ 18.00 L",
    actual: "₹ 8.00 L",
    remaining: "₹ 24.00 L",
    description: "SMT line PCB assembly, CNC laser cutting, powder coating, sub-assembly, and final testing.",
    weightage: 28,
    deliverables: [
      { id: "del-21", name: "Assembled Smart EV Chargers (100 units)", status: "In Progress" },
    ],
    activities: [],
  },
  {
    id: "wbs-5",
    code: "5.0",
    name: "Installation",
    type: "Phase",
    level: 1,
    parentCode: null,
    version: "V1.0 (Baseline)",
    status: "Planned",
    percent: 32,
    owner: "Karthik Subramanian",
    ownerRole: "Site Project Lead",
    ownerAvatarText: "KS",
    department: "Field Engineering",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "16 Oct 2026",
    plannedFinish: "30 Oct 2026",
    duration: "15 Days",
    calendar: "Standard Calendar",
    priority: "High",
    critical: false,
    budget: "₹ 18.00 L",
    budgetValue: 18,
    committed: "₹ 6.00 L",
    actual: "₹ 2.00 L",
    remaining: "₹ 16.00 L",
    description: "Civil foundation, grid interconnection, feeder pillar cabling, and charger mounting at 12 hubs.",
    weightage: 12,
    deliverables: [
      { id: "del-22", name: "Site Readiness Certification", status: "Pending" },
    ],
    activities: [],
  },
  {
    id: "wbs-6",
    code: "6.0",
    name: "Testing & Commissioning",
    type: "Phase",
    level: 1,
    parentCode: null,
    version: "V1.0 (Baseline)",
    status: "Planned",
    percent: 18,
    owner: "Sunil Verma",
    ownerRole: "QA & Commissioning Lead",
    ownerAvatarText: "SV",
    department: "Quality Assurance",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "31 Oct 2026",
    plannedFinish: "05 Nov 2026",
    duration: "6 Days",
    calendar: "Standard Calendar",
    priority: "High",
    critical: true,
    budget: "₹ 8.00 L",
    budgetValue: 8,
    committed: "₹ 2.00 L",
    actual: "₹ 1.00 L",
    remaining: "₹ 7.00 L",
    description: "Factory acceptance test (FAT), site acceptance test (SAT), load bank full kW test, and OCPP connectivity.",
    weightage: 10,
    deliverables: [
      { id: "del-23", name: "FAT / SAT Protocol Sign-off", status: "Pending" },
    ],
    activities: [],
  },
  {
    id: "wbs-7",
    code: "7.0",
    name: "Project Closure",
    type: "Phase",
    level: 1,
    parentCode: null,
    version: "V1.0 (Baseline)",
    status: "Planned",
    percent: 0,
    owner: "Arun Kumar",
    ownerRole: "Project Manager",
    ownerAvatarText: "AK",
    department: "Project Management Office",
    businessUnit: "Renewable Energy Solutions",
    plannedStart: "06 Nov 2026",
    plannedFinish: "10 Nov 2026",
    duration: "5 Days",
    calendar: "Standard Calendar",
    priority: "Medium",
    critical: false,
    budget: "₹ 2.00 L",
    budgetValue: 2,
    committed: "₹ 0.00 L",
    actual: "₹ 0.00 L",
    remaining: "₹ 2.00 L",
    description: "Customer final handover, warranty documentation, financial ledger settlement, and lessons learned.",
    weightage: 4,
    deliverables: [
      { id: "del-24", name: "Customer Final Acceptance Certificate", status: "Pending" },
    ],
    activities: [],
  },
];

export const INITIAL_PLANNING_RECORD: ProjectPlanningRecord = {
  projectPlanId: "PLN-2026-0195",
  projectCode: "PRJ-2026-0195",
  projectName: "Smart EV Charging Infrastructure",
  customer: "ABC Energy Pvt Ltd",
  businessUnit: "Renewable Energy Solutions",
  projectSponsor: "Ramesh Babu",
  projectType: "Customer Project",
  projectPriority: "High",
  projectManager: "Arun Kumar",
  department: "Project Management Office",
  plannedStartDate: "2026-09-01",
  plannedEndDate: "2026-11-10",
  projectDuration: "71 Days",
  projectPhase: "Planning",
  planningStatus: "Under Review",
  contractValue: "₹ 1.67 Cr",
  budgetPlanned: "₹ 1.67 Cr",
  lastUpdated: "01 Sep 2026 10:24 AM",
  totalProjectsCount: 48,
  onScheduleCount: 36,
  atRiskCount: 8,
  delayedCount: 4,
  budgetUtilizationPct: 42.6,
  budgetSpentFormatted: "₹ 71.11 L",
  resourcesAllocatedCount: 24,
  overallCompletionPct: 54.8,
  wbsElementsCount: 42,
  wbsCompletedCount: 12,
  wbsInProgressCount: 18,
  scope: {
    objective: "Deploy a fleet of 48 commercial dual-gun high-speed AC chargers across major metropolitan distribution hubs with OCPP 2.0.1 remote telemetry.",
    businessCase: "Achieve 99.4% fleet uptime, reduce charging queue latency by 45%, and generate carbon credit revenue.",
    inScope: [
      "Hardware mechanical enclosure, cooling and IP65 sealing",
      "Power electronics, dual-gun 22kW charging circuits and RFID reader",
      "Embedded OCPP 2.0.1 firmware and fleet telemetry integration",
      "Civil installation, grid interconnections, and field commissioning",
    ],
    outOfScope: [
      "Substation high-voltage step-down transformer installation",
      "Civil land acquisition and municipal road permits",
      "Customer vehicle battery repairs",
    ],
    deliverables: [
      "48 Certified Smart EV Charger Units",
      "Fleet Telemetry Real-time Dashboard",
      "Certified Installation & FAT Compliance Dossier",
      "Technician Service Handbooks & Spare Parts Kit",
    ],
    acceptanceCriteria: [
      "Zero ground fault trips under 22kW continuous 4-hour soak test",
      "OCPP 2.0.1 latency < 250ms to Magnertia Cloud Gateway",
      "Customer sign-off on 12 site installations",
    ],
    constraints: [
      "Must adhere to ISO 15118 and IEC 61851-1 safety regulations",
      "Delivery window strictly limited to 71 calendar days",
    ],
    assumptions: [
      "Grid connection availability at designated sites prior to October 15",
      "Supplier controller chipsets delivered on schedule by September 22",
    ],
  },
  wbsList: INITIAL_WBS_ELEMENTS,
};

class ProjectPlanningService {
  private record: ProjectPlanningRecord = INITIAL_PLANNING_RECORD;

  async getRecord(): Promise<ProjectPlanningRecord> {
    return { ...this.record };
  }

  async updateRecord(updated: Partial<ProjectPlanningRecord>): Promise<ProjectPlanningRecord> {
    this.record = {
      ...this.record,
      ...updated,
      lastUpdated: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) + " " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
    return { ...this.record };
  }

  async getWbsElement(code: string): Promise<WbsElement | undefined> {
    return this.record.wbsList.find((w) => w.code === code);
  }

  async updateWbsElement(code: string, updates: Partial<WbsElement>): Promise<WbsElement> {
    const idx = this.record.wbsList.findIndex((w) => w.code === code);
    if (idx >= 0) {
      this.record.wbsList[idx] = {
        ...this.record.wbsList[idx],
        ...updates,
      };
      return { ...this.record.wbsList[idx] };
    }
    throw new Error(`WBS code ${code} not found`);
  }

  async addWbsElement(element: WbsElement): Promise<WbsElement> {
    this.record.wbsList.push(element);
    this.record.wbsElementsCount = this.record.wbsList.length;
    return element;
  }
}

export const projectPlanningService = new ProjectPlanningService();
