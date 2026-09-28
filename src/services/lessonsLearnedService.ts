// Magnertia ERP - Lessons Learned Service
// Management -> Knowledge Management -> Lessons Learned
// Lessons Learned Form — MAICW Classification Master & Data Service

export interface LessonRecord {
  lessonId: string;
  lessonTitle: string;
  lessonType: "Engineering" | "Project" | "Quality" | "Manufacturing" | "Customer" | "Supplier" | "Process";
  knowledgeCategory: "Product Development" | "Manufacturing" | "Quality" | "Project Management" | "Safety" | "IT" | "Compliance";
  sourceModule: string;
  sourceRecord: string;
  department: string;
  process: string;
  project: string;
  lessonOwner: string;
  organization: string;
  branchSite: string;
  dateCaptured: string;
  reviewDate: string;
  confidentiality: "Public" | "Internal" | "Confidential" | "Restricted";
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Draft" | "Review" | "Approved" | "Published" | "Archived";

  // Issue / Event
  issueId: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  problemStatement: string;
  whatHappened: string;
  expectedCondition: string;
  actualCondition: string;
  detectionMethod: string;
  detectionDate: string;
  impact: string;

  // Root Cause
  rcaMethod: string;
  rootCause: string;
  contributingFactors: string;

  // Learnings
  whatWentWell: string[];
  whatFailed: string[];

  // Applicability & Tags
  applicableProjectTypes: string[];
  tags: string[];
}

export interface LessonsKPIs {
  totalLessons: number;
  totalChange: number;
  approvedLessons: number;
  approvedChange: number;
  underReview: number;
  underReviewChange: number;
  openActions: number;
  openActionsChange: number;
  timesReused: number;
  timesReusedChange: number;
  implementationRate: number;
  implementationRateChange: number;
}

export interface ActionItem {
  id: number;
  description: string;
  owner: string;
  dueDate: string;
  status: "Completed" | "In Progress" | "Pending";
}

export interface CategoryDistributionItem {
  name: string;
  count: number;
}

export const PRIMARY_LESSON_RECORD: LessonRecord = {
  lessonId: "LL-2026-0018",
  lessonTitle: "Misalignment in EV Charging Docking - Field Trial",
  lessonType: "Engineering",
  knowledgeCategory: "Product Development",
  sourceModule: "Project Management",
  sourceRecord: "PRJ-2026-004 (Field Trial)",
  department: "R&D",
  process: "Prototype Testing",
  project: "Autonomous EVSE Pilot",
  lessonOwner: "Ramesh S",
  organization: "Magnertia Private Limited",
  branchSite: "Coimbatore - Dev Centre",
  dateCaptured: "15-Aug-2026",
  reviewDate: "15-Feb-2027",
  confidentiality: "Internal",
  priority: "High",
  status: "Approved",

  issueId: "ISS-2026-0076",
  severity: "High",
  problemStatement: "During field trial, the autonomous docking system failed to align with the vehicle receiver coil in 3 out of 10 attempts.",
  whatHappened: "Sensor data latency and uneven ground surface caused incorrect positioning of the robotic arm.",
  expectedCondition: "Accurate alignment within ±10 mm in all attempts.",
  actualCondition: "Alignment error up to 40 mm in some attempts.",
  detectionMethod: "Field Observation",
  detectionDate: "12-Aug-2026",
  impact: "Delay in charging, user dissatisfaction, rework required.",

  rcaMethod: "5 Why Analysis",
  rootCause: "Inadequate sensor fusion algorithm tuning for uneven surfaces.",
  contributingFactors: "Uneven ground surface, insufficient sensor calibration, lack of real-time compensation.",

  whatWentWell: [
    "Quick identification of misalignment issue",
    "Field team provided detailed logs",
    "Safety systems worked as expected",
  ],
  whatFailed: [
    "Sensor fusion tuning inadequate",
    "No real-time compensation for surface variations",
    "Limited field test scenarios",
  ],

  applicableProjectTypes: ["Field Trials", "Product Development", "Manufacturing", "O&M"],
  tags: ["EV Charging", "Docking System", "Sensor Fusion", "Alignment", "Field Trial"],
};

export const LESSONS_EXECUTIVE_KPIS: LessonsKPIs = {
  totalLessons: 124,
  totalChange: 18,
  approvedLessons: 98,
  approvedChange: 25,
  underReview: 16,
  underReviewChange: -11,
  openActions: 10,
  openActionsChange: -38,
  timesReused: 342,
  timesReusedChange: 46,
  implementationRate: 92,
  implementationRateChange: 12,
};

export const LESSON_ACTIONS_LIST: ActionItem[] = [
  { id: 1, description: "Recalibrate sensors", owner: "Ramesh S", dueDate: "25-Aug-2026", status: "Completed" },
  { id: 2, description: "Update alignment algorithm", owner: "Priya Sharma", dueDate: "10-Sep-2026", status: "In Progress" },
  { id: 3, description: "Conduct extended field test", owner: "Arun Kumar", dueDate: "30-Sep-2026", status: "Pending" },
];

export const LESSONS_BY_CATEGORY: CategoryDistributionItem[] = [
  { name: "Engineering", count: 32 },
  { name: "Manufacturing", count: 24 },
  { name: "Quality", count: 18 },
  { name: "Project", count: 16 },
  { name: "Customer", count: 12 },
  { name: "Safety", count: 8 },
  { name: "Others", count: 6 },
];

export const LESSON_AI_INSIGHTS: string[] = [
  "Similar lessons found from 3 past projects.",
  "Recommend applying this lesson to 5 upcoming projects.",
  "Sensor calibration issues are a recurring pattern (12% of total).",
  "Consider creating a standard test checklist.",
  "Potential training module can be generated.",
];

export const LESSONS_MASTER_REGISTER: LessonRecord[] = [
  PRIMARY_LESSON_RECORD,
  {
    lessonId: "LL-2026-0017",
    lessonTitle: "High Inrush Current in High-Power Fast Charger Inverters",
    lessonType: "Engineering",
    knowledgeCategory: "Manufacturing",
    sourceModule: "Quality Management",
    sourceRecord: "NCR-2026-041",
    department: "Power Electronics",
    process: "Inverter Commissioning",
    project: "FastCharger 350kW Rollout",
    lessonOwner: "Dr. Arvind R",
    organization: "Magnertia Private Limited",
    branchSite: "Development Centre",
    dateCaptured: "20-Jul-2026",
    reviewDate: "20-Jan-2027",
    confidentiality: "Internal",
    priority: "Critical",
    status: "Approved",
    issueId: "ISS-2026-0062",
    severity: "Critical",
    problemStatement: "DC link pre-charge resistor overheated during sudden grid reconnection cycles.",
    whatHappened: "Pre-charge relay timing did not account for residual bus voltage fluctuation.",
    expectedCondition: "Smooth pre-charge current under 15A peak.",
    actualCondition: "Current spikes up to 48A tripping main contactors.",
    detectionMethod: "Bench Testing",
    detectionDate: "18-Jul-2026",
    impact: "Pre-charge circuit board burn-in failure.",
    rcaMethod: "Fishbone Diagram",
    rootCause: "Fixed timer used instead of active threshold voltage sensing.",
    contributingFactors: "Grid voltage dips during evening peak load.",
    whatWentWell: ["Thermal cutoff fuse acted promptly", "No secondary damage to SiC MOSFETs"],
    whatFailed: ["Firmware pre-charge algorithm lacked closed-loop threshold validation"],
    applicableProjectTypes: ["High Power DC EVSE", "Inverter Subsystems"],
    tags: ["Inrush Current", "Pre-Charge", "Power Electronics", "Relay Timing"],
  },
];
