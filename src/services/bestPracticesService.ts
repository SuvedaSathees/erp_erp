// Magnertia ERP - Best Practices Service
// Management -> Knowledge Management -> Best Practices
// Best Practices Form — MAICW Classification Master & Data Service

export interface BestPracticeRecord {
  bestPracticeId: string;
  practiceCode: string;
  practiceTitle: string;
  practiceType: "Process" | "Technical" | "Quality" | "Manufacturing" | "Engineering" | "Management";
  knowledgeCategory: "Manufacturing" | "Engineering" | "Quality" | "Supply Chain" | "Safety" | "Project Management";
  sourceModule: string;
  sourceRecord: string;
  description: string;
  department: string;
  process: string;
  processOwner: string;
  practiceOwner: string;
  organization: string;
  branchSite: string;
  version: string;
  status: "Draft" | "Review" | "Approved" | "Published" | "Revision" | "Obsolete";
  confidentiality: "Public" | "Internal" | "Confidential" | "Restricted";
  effectiveDate: string;
  reviewDate: string;

  // Practice Statement
  practiceStatement: string;
  problemAddressed: string;
  recommendedMethod: string;
  expectedResult: string;
  applicability: string;
  limitations: string;

  // Learnings
  rootCause: string;
  whatWentWell: string[];
  whatFailed: string[];

  // Tags
  tags: string[];
}

export interface BestPracticesKPIs {
  totalBestPractices: number;
  totalChange: number;
  published: number;
  publishedChange: number;
  underReview: number;
  underReviewChange: number;
  dueForReview: number;
  dueForReviewChange: number;
  timesReused: number;
  timesReusedChange: number;
  implementationRate: number;
  implementationRateChange: number;
}

export interface PerformanceImpactItem {
  kpi: string;
  before: string;
  after: string;
  improvement: string;
  isPositive: boolean;
}

export interface PracticeActionItem {
  id: number;
  actionDescription: string;
  owner: string;
  dueDate: string;
  status: "Completed" | "In Progress" | "Not Started";
}

export const PRIMARY_BEST_PRACTICE_RECORD: BestPracticeRecord = {
  bestPracticeId: "BP-2026-0024",
  practiceCode: "BP-QA-017",
  practiceTitle: "Standardized Docking Alignment Procedure for EV Charging Station",
  practiceType: "Process",
  knowledgeCategory: "Manufacturing",
  sourceModule: "Project Management",
  sourceRecord: "PRJ-2026-004",
  description: "Proven method for multi-sensor based autonomous docking alignment to improve charging success rate and reduce alignment time in EV charging stations.",
  department: "R&D",
  process: "Assembly & Testing",
  processOwner: "Ramesh S",
  practiceOwner: "Priya Sharma",
  organization: "Magnertia Private Limited",
  branchSite: "Coimbatore - Dev Centre",
  version: "v2.1",
  status: "Published",
  confidentiality: "Internal",
  effectiveDate: "01-Aug-2026",
  reviewDate: "01-Aug-2027",

  practiceStatement: "Use multi-sensor fusion (LiDAR + Camera + Ultrasonic) for precise autonomous docking alignment of the wireless charging unit with the EV receiver.",
  problemAddressed: "Frequent misalignment, failed charging attempts and longer docking time.",
  recommendedMethod: "Implement sensor fusion algorithm with real-time position correction and visual guidance.",
  expectedResult: ">95% successful docking, <30 seconds alignment time.",
  applicability: "Public charging stations, Fleet depots, Commercial EV parking.",
  limitations: "Not applicable for vehicles without receiver alignment markers.",

  rootCause: "Inadequate alignment feedback and sensor calibration for uneven vehicle positioning.",
  whatWentWell: [
    "Sensor fusion improved accuracy",
    "Real-time feedback to user",
    "Quick recovery from misalignment",
  ],
  whatFailed: [
    "Initial camera calibration issues",
    "No alignment markers in early trials",
    "Delayed software adjustment",
  ],

  tags: ["EV Charging", "Docking", "Sensor Fusion", "Alignment", "Automation"],
};

export const BEST_PRACTICES_EXECUTIVE_KPIS: BestPracticesKPIs = {
  totalBestPractices: 86,
  totalChange: 22,
  published: 64,
  publishedChange: 18,
  underReview: 12,
  underReviewChange: -25,
  dueForReview: 8,
  dueForReviewChange: -33,
  timesReused: 420,
  timesReusedChange: 40,
  implementationRate: 96,
  implementationRateChange: 12,
};

export const BEST_PRACTICE_IMPACT_METRICS: PerformanceImpactItem[] = [
  { kpi: "Docking Time (sec)", before: "120", after: "28", improvement: "77%", isPositive: true },
  { kpi: "Charging Success Rate", before: "78%", after: "96%", improvement: "23%", isPositive: true },
  { kpi: "User Intervention", before: "35%", after: "5%", improvement: "86%", isPositive: true },
  { kpi: "Maintenance Calls", before: "12 / month", after: "3 / month", improvement: "75%", isPositive: true },
  { kpi: "Customer Satisfaction", before: "3.8", after: "4.7", improvement: "24%", isPositive: true },
];

export const BEST_PRACTICE_ACTIONS: PracticeActionItem[] = [
  { id: 1, actionDescription: "Improve camera calibration", owner: "Ramesh S", dueDate: "30-Aug-2026", status: "Completed" },
  { id: 2, actionDescription: "Add alignment markers", owner: "Priya Sharma", dueDate: "15-Sep-2026", status: "In Progress" },
  { id: 3, actionDescription: "Update user interface", owner: "Arun Kumar", dueDate: "30-Sep-2026", status: "Not Started" },
];

export const BEST_PRACTICE_AI_INSIGHTS: string[] = [
  "Practice shows 24% higher success rate than similar projects.",
  "Recommended for all new EV charging deployments.",
  "Consider creating a training module.",
  "Potential to develop into industry standard.",
  "2 similar practices found (Consolidation opportunity).",
];

export const BEST_PRACTICES_MASTER_REGISTER: BestPracticeRecord[] = [
  PRIMARY_BEST_PRACTICE_RECORD,
  {
    bestPracticeId: "BP-2026-0023",
    practiceCode: "BP-MFG-009",
    practiceTitle: "Lean Robotic Torquing with In-Line Angle-Torque Curve Validation",
    practiceType: "Technical",
    knowledgeCategory: "Manufacturing",
    sourceModule: "Manufacturing Excellence",
    sourceRecord: "PRJ-2026-002",
    description: "Closed-loop robotic nut-running with real-time torque-angle gradient analysis eliminating cold solder and loose ground terminal defects.",
    department: "Manufacturing",
    process: "Automated Mechanical Fastening",
    processOwner: "Karthik Raja",
    practiceOwner: "Devan M",
    organization: "Magnertia Private Limited",
    branchSite: "Plant 1",
    version: "v1.5",
    status: "Published",
    confidentiality: "Internal",
    effectiveDate: "15-Jun-2026",
    reviewDate: "15-Jun-2027",
    practiceStatement: "Employ continuous torque transducer sampling at 1kHz during electrical terminal fastening.",
    problemAddressed: "Undetected micro-loosening during transport vibration.",
    recommendedMethod: "Robotic screwdriver with dynamic yield detection stopping automatically within 0.05Nm of spec.",
    expectedResult: "Zero field loosening occurrences across 10,000 cabinets.",
    applicability: "All assembly lines with power interconnects >50A.",
    limitations: "Requires pneumatic tool calibration every 5,000 cycles.",
    rootCause: "Manual torque wrenches had operator dependency and parallax error.",
    whatWentWell: ["Complete torque history logged per serial number", "Poka-yoke prevents part release if torque out of window"],
    whatFailed: ["High initial robotic tooling capital expenditure"],
    tags: ["Robotics", "Fastening", "Quality Poka-Yoke", "Traceability"],
  },
];
