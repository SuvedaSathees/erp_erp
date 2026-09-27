// Magnertia ERP - Training Materials Service
// Management -> Knowledge Management -> Training Materials
// Learning Content, Course Modules, Assessments, Quizzes, Competency & Learner Analytics

export interface TrainingMaterialRecord {
  trainingMaterialId: string;
  trainingCode: string;
  trainingTitle: string;
  trainingType: "Technical Training" | "Product Training" | "Operator Training" | "Compliance Training" | "Safety Training";
  trainingCategory: "Product Training" | "Engineering" | "Manufacturing" | "Quality" | "Safety";
  module: string;
  submodule: string;
  description: string;
  department: string;
  process: string;
  trainingOwner: string;
  subjectMatterExpert: string;
  organization: string;
  branchSite: string;
  version: string;
  status: "Draft" | "Review" | "Approved" | "Published" | "Archived";
  confidentiality: "Public" | "Internal" | "Confidential" | "Restricted";
  effectiveDate: string;
  reviewDate: string;

  // Training Content
  contentHeading: string;
  contentBody: string;
  contentMode: "design" | "preview" | "markdown";

  // Classification & Tags
  knowledgeDomain: string;
  technologyArea: string;
  engineeringDisciplines: string[];
  productFamily: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  keywords: string[];

  // Assessment & Evaluation
  assessmentType: "Quiz" | "Written Test" | "Practical Test" | "Observation";
  passingScore: number;
  numberOfQuestions: number;
  durationMinutes: number;
  maximumAttempts: number;
  evaluationMethod: string;
}

export interface LearningObjectiveItem {
  id: number;
  learningObjective: string;
  type: "Knowledge" | "Skill" | "Competency";
  assessment: "Quiz" | "Practical" | "Test";
  status: "Active" | "Pending";
}

export interface TrainingFileItem {
  fileName: string;
  type: "PPTX" | "Image" | "PDF" | "Video";
  size: string;
  version: string;
  uploadedOn: string;
}

export interface TargetAudienceItem {
  audienceType: string;
  departmentRole: string;
  mandatory: boolean;
  status: "Active" | "Inactive";
}

export const PRIMARY_TRAINING_RECORD: TrainingMaterialRecord = {
  trainingMaterialId: "TM-2026-0015",
  trainingCode: "TRN-EV-007",
  trainingTitle: "Wireless EV Charging System - Fundamentals",
  trainingType: "Technical Training",
  trainingCategory: "Product Training",
  module: "Product Development",
  submodule: "EV Charging System",
  description:
    "Comprehensive training material on Wireless Power Transfer (WPT) for Electric Vehicles covering working principle, system architecture, components, safety, standards, and applications.",
  department: "R&D",
  process: "Technology Development",
  trainingOwner: "Ramesh S",
  subjectMatterExpert: "Priya Sharma",
  organization: "Magnertia Private Limited",
  branchSite: "Coimbatore - Dev Centre",
  version: "v1.0",
  status: "Draft",
  confidentiality: "Internal",
  effectiveDate: "15-Sep-2026",
  reviewDate: "15-Sep-2027",

  contentHeading: "Introduction to Wireless EV Charging (WPT)",
  contentBody:
    "This module introduces the fundamentals of wireless power transfer technology for electric vehicles, including system architecture, key components, operating principles, safety considerations and industry standards.",
  contentMode: "preview",

  knowledgeDomain: "Engineering",
  technologyArea: "Wireless Power Transfer (WPT)",
  engineeringDisciplines: ["Electrical", "Electronics", "Power Electronics"],
  productFamily: "EV Charging System",
  skillLevel: "Beginner",
  keywords: ["WPT", "Inductive Charging", "EV", "Alignment"],

  assessmentType: "Quiz",
  passingScore: 70,
  numberOfQuestions: 20,
  durationMinutes: 30,
  maximumAttempts: 3,
  evaluationMethod: "Auto + Manual Review",
};

export const TRAINING_KPIS = {
  totalMaterials: 128,
  totalMaterialsChange: 22,
  published: 84,
  publishedChange: 18,
  underReview: 20,
  underReviewChange: -17,
  draft: 12,
  draftChange: -40,
  totalLearners: 1420,
  totalLearnersChange: 35,
  completionRate: 92,
  completionRateChange: 12,
};

export const TRAINING_LEARNING_OBJECTIVES: LearningObjectiveItem[] = [
  { id: 1, learningObjective: "Understand WPT principle", type: "Knowledge", assessment: "Quiz", status: "Active" },
  { id: 2, learningObjective: "Identify key components", type: "Knowledge", assessment: "Quiz", status: "Active" },
  { id: 3, learningObjective: "Install and configure system", type: "Skill", assessment: "Practical", status: "Active" },
  { id: 4, learningObjective: "Follow safety standards", type: "Skill", assessment: "Test", status: "Active" },
  { id: 5, learningObjective: "Troubleshoot common issues", type: "Skill", assessment: "Practical", status: "Active" },
];

export const TRAINING_MATERIALS_FILES: TrainingFileItem[] = [
  { fileName: "WPT_Training_Presentation.pptx", type: "PPTX", size: "8.4 MB", version: "v1.0", uploadedOn: "10-Sep-2026" },
  { fileName: "System_Block_Diagram.png", type: "Image", size: "1.2 MB", version: "v1.0", uploadedOn: "10-Sep-2026" },
  { fileName: "Components_Datasheet.pdf", type: "PDF", size: "2.8 MB", version: "v1.0", uploadedOn: "11-Sep-2026" },
  { fileName: "Hands_on_Guide.pdf", type: "PDF", size: "3.1 MB", version: "v1.0", uploadedOn: "11-Sep-2026" },
  { fileName: "Training_Video.mp4", type: "Video", size: "45.6 MB", version: "v1.0", uploadedOn: "12-Sep-2026" },
];

export const TARGET_AUDIENCE_DATA: TargetAudienceItem[] = [
  { audienceType: "Engineers", departmentRole: "R&D / Design", mandatory: true, status: "Active" },
  { audienceType: "Technicians", departmentRole: "Production / O&M", mandatory: true, status: "Active" },
  { audienceType: "Project Team", departmentRole: "Project Management", mandatory: false, status: "Active" },
  { audienceType: "Sales Team", departmentRole: "Sales & BD", mandatory: false, status: "Active" },
];

export const TRAINING_ANALYTICS_METRICS = {
  enrollments: 420,
  enrollmentsChange: 52,
  completions: 386,
  completionsChange: 48,
  passRate: 78,
  passRateChange: 12,
  feedbackScore: 4.6,
  feedbackScoreChange: 8,
};
