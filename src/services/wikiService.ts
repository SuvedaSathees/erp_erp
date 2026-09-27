// Magnertia ERP - Wiki Service
// Management -> Knowledge Management -> Wiki
// Collaborative Knowledge Articles, Markdown/Rich Content, Knowledge Tree & Discussion

export interface WikiArticleRecord {
  wikiArticleId: string;
  articleNumber: string;
  articleTitle: string;
  articleType: "Technical Note" | "How-To Guide" | "Knowledge Article" | "FAQ" | "Process Explanation" | "Glossary";
  knowledgeCategory: "Engineering" | "Manufacturing" | "Quality" | "Software" | "Compliance";
  module: string;
  department: string;
  process: string;
  articleOwner: string;
  subjectMatterExpert: string;
  organization: string;
  branchSite: string;
  version: string;
  status: "Draft" | "Review" | "Approved" | "Published" | "Archived";
  confidentiality: "Public" | "Internal" | "Confidential" | "Restricted";
  effectiveDate: string;
  reviewDate: string;

  // Article Content
  contentBody: string;
  editorMode: "editor" | "preview" | "markdown" | "ai";

  // Classification & Tags
  knowledgeDomain: string;
  technologyArea: string;
  engineeringDisciplines: string[];
  productFamily: string;
  applicationAreas: string[];
  keywords: string[];
}

export interface ArticleStructureItem {
  id: number;
  sectionName: string;
  mandatory: boolean;
  status: "Complete" | "In Progress" | "Optional" | "Not Started";
}

export interface WikiMediaItem {
  fileName: string;
  type: "PNG" | "XLSX" | "PDF" | "MP4";
  size: string;
  uploadedOn: string;
}

export interface WikiVersionHistoryItem {
  version: string;
  date: string;
  changedBy: string;
  changeDescription: string;
}

export const PRIMARY_WIKI_ARTICLE: WikiArticleRecord = {
  wikiArticleId: "WK-2026-0018",
  articleNumber: "WIKI-ENG-042",
  articleTitle: "Inductive Wireless Charging (WPT) Basics",
  articleType: "Technical Note",
  knowledgeCategory: "Engineering",
  module: "Product Development",
  department: "R&D",
  process: "Technology Development",
  articleOwner: "Ramesh S",
  subjectMatterExpert: "Priya Sharma",
  organization: "Magnertia Private Limited",
  branchSite: "Coimbatore - Dev Centre",
  version: "v1.0",
  status: "Draft",
  confidentiality: "Internal",
  effectiveDate: "15-Sep-2026",
  reviewDate: "15-Sep-2027",

  contentBody: `Wireless Power Transfer (WPT) uses magnetic fields to transfer electrical energy between a transmitter (Tx) coil and a receiver (Rx) coil without physical contact. This article explains the basic principles, components, types, advantages, limitations and applications of inductive WPT for Electric Vehicle (EV) charging.

### 1. How It Works
- AC power is converted to high-frequency AC (20-100 kHz).
- Current through the transmitter coil creates a varying magnetic field.
- The magnetic field induces a voltage in the receiver coil.
- The received power is converted back to DC and used to charge the battery.`,

  editorMode: "editor",

  knowledgeDomain: "Engineering",
  technologyArea: "Wireless Power Transfer (WPT)",
  engineeringDisciplines: ["Electrical", "Electronics", "Power Electronics"],
  productFamily: "EV Charging System",
  applicationAreas: ["Public Charging", "Fleet Charging", "Autonomous Charging"],
  keywords: ["WPT", "Inductive Charging", "EV", "Alignment", "Power Transfer"],
};

export const WIKI_KPIS = {
  totalArticles: 256,
  totalArticlesChange: 18,
  published: 198,
  publishedChange: 24,
  underReview: 32,
  underReviewChange: -20,
  draft: 14,
  draftChange: -30,
  totalViews: 1850,
  totalViewsChange: 42,
  userSatisfaction: 92,
  userSatisfactionChange: 8,
};

export const WIKI_ARTICLE_STRUCTURE: ArticleStructureItem[] = [
  { id: 1, sectionName: "Summary", mandatory: true, status: "Complete" },
  { id: 2, sectionName: "Purpose", mandatory: true, status: "Complete" },
  { id: 3, sectionName: "Scope", mandatory: false, status: "Complete" },
  { id: 4, sectionName: "Definitions", mandatory: false, status: "Complete" },
  { id: 5, sectionName: "Main Content", mandatory: true, status: "In Progress" },
  { id: 6, sectionName: "Examples", mandatory: false, status: "Optional" },
  { id: 7, sectionName: "Troubleshooting", mandatory: false, status: "Not Started" },
  { id: 8, sectionName: "References", mandatory: true, status: "Complete" },
];

export const WIKI_MEDIA_FILES: WikiMediaItem[] = [
  { fileName: "WPT_Block_Diagram.png", type: "PNG", size: "2.1 MB", uploadedOn: "15-Sep-2026" },
  { fileName: "Coil_Design_Calculation.xlsx", type: "XLSX", size: "1.4 MB", uploadedOn: "15-Sep-2026" },
  { fileName: "IEC_61980_Standard.pdf", type: "PDF", size: "3.8 MB", uploadedOn: "14-Sep-2026" },
  { fileName: "Thermal_Analysis_Report.pdf", type: "PDF", size: "2.6 MB", uploadedOn: "14-Sep-2026" },
  { fileName: "Demo_Video.mp4", type: "MP4", size: "12.4 MB", uploadedOn: "13-Sep-2026" },
];

export const WIKI_VERSION_HISTORY: WikiVersionHistoryItem[] = [
  { version: "v1.0", date: "15-Sep-2026", changedBy: "Ramesh S", changeDescription: "Initial version" },
  { version: "v0.9", date: "12-Sep-2026", changedBy: "Priya Sharma", changeDescription: "Added diagrams" },
  { version: "v0.8", date: "01-Sep-2026", changedBy: "Arun Kumar", changeDescription: "Updated content" },
];

export const WIKI_RELATED_KNOWLEDGE = [
  { title: "WPT Coil Design Guidelines", type: "Tech Note", category: "article" },
  { title: "EV Charging Safety Standards", type: "Standard", category: "doc" },
  { title: "Autonomous Docking System Overview", type: "Article", category: "article" },
  { title: "Thermal Management for WPT", type: "Article", category: "article" },
];

export const WIKI_AI_INSIGHTS: string[] = [
  'This article is frequently searched along with "EV Charging Standards".',
  'Consider adding a section on "Dynamic Charging".',
  "2 similar articles can be consolidated.",
  "Add a video demonstration to improve engagement.",
  "Potential training module can be created from this article.",
];
