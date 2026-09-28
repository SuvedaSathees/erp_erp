// Magnertia ERP - Communication Management Service & Models
// Models, KPIs, Master Data, and Controlled Reports

export interface EmailRecord {
  id: string;
  emailId: string;
  emailNumber: string;
  threadId: string;
  messageId: string;
  emailType: string;
  emailCategory: string;
  subject: string;
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  replyTo: string;
  department: string;
  process: string;
  owner: string;
  status: "Draft" | "Review" | "Approved" | "Sent" | "Delivered" | "Failed";
  priority: "Low" | "Normal" | "High" | "Urgent" | "Critical";
  confidentiality: "Public" | "Internal" | "Confidential" | "Secret";
  createdDate: string;
  sentDate: string;
  content: string;
  module: string;
  submodule: string;
  transactionNumber: string;
  customer: string;
  project: string;
  relatedOpportunity: string;
  communicationDomain: string;
  businessFunction: string;
  tags: string[];
  scheduledDate?: string;
  scheduledTime?: string;
  followUpAction?: string;
  followUpAssignee?: string;
  followUpDueDate?: string;
  version: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderAvatar?: string;
  time: string;
  date: string;
  content: string;
  reactions?: { emoji: string; count: number }[];
  file?: {
    name: string;
    size: string;
    type: "pdf" | "xlsx" | "docx" | "zip";
  };
  isMe?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  type: "direct" | "group" | "channel";
  category: string;
  department: string;
  owner: string;
  project: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  confidentiality: "Internal" | "Confidential";
  status: "Active" | "Archived";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  membersCount: number;
  participants: { name: string; role: string; online: boolean }[];
  messages: ChatMessage[];
  sharedFiles: { name: string; size: string; date: string; type: string }[];
  details?: {
    chatId: string;
    title: string;
    chatType: string;
    category: string;
    owner: string;
    department: string;
    relatedProject: string;
    priority: string;
    confidentiality: string;
    createdOn: string;
    lastActivity: string;
  };
}

export interface VideoMeetingRecord {
  id: string;
  meetingId: string;
  meetingNumber: string;
  title: string;
  type: string;
  category: string;
  organizer: string;
  host: string;
  date: string;
  time: string;
  duration: string;
  timeZone: string;
  meetingLink: string;
  passcode: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  priority: "Low" | "Normal" | "High" | "Urgent";
  confidentiality: "Internal" | "Confidential";
  relatedProject: string;
  relatedRecord: string;
  description: string;
  tags: string[];
  participants: { name: string; role: string; micOn: boolean; isSpeaking?: boolean }[];
  agenda: { id: string; topic: string; presenter: string; duration: string; done: boolean }[];
  actionItems: { id: string; action: string; owner: string; dueDate: string; status: "Open" | "In Progress" | "Completed" }[];
  documents: { name: string; size: string; type: string }[];
  chatMessages: { sender: string; time: string; text: string; file?: { name: string; size: string } }[];
}

export interface NotificationRecord {
  id: string;
  notificationId: string;
  code?: string;
  title: string;
  type: string;
  module: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Active" | "Delivered" | "Queued" | "Failed";
  createdOn: string;
  category: string;
  owner: string;
  effectiveFrom: string;
  effectiveTo: string;
  subject: string;
  subjectTemplate?: string;
  preview: string;
  messagePreview?: string;
  channels: { inApp: boolean; email: boolean; sms: boolean; whatsapp: boolean };
  recipientsCount: number;
  recipients?: { name: string; role: string; avatar: string }[];
}

export interface AnnouncementRecord {
  id: string;
  announcementNumber: string;
  title: string;
  type: string;
  category: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  severity: "Information" | "Advisory" | "Warning" | "Critical";
  businessFunction: string;
  module: string;
  process: string;
  owner: string;
  publisher: string;
  effectiveDate: string;
  expiryDate: string;
  status: "Draft" | "Review" | "Approved" | "Published" | "Expired";
  confidentiality: "Internal" | "Confidential";
  headline: string;
  summary: string;
  body: string;
  keyMessage: string;
  instructions: string;
  callToAction: string;
  recipientsCount: number;
  acknowledgementRequired: boolean;
  publishedChannels: string[];
  attachments: { name: string; size: string; type: string; uploadedBy: string }[];
}

export interface ControlledCommunicationReport {
  id: string;
  code: string;
  title: string;
  category: string;
  purpose: string;
  frequency: string;
  lastGenerated: string;
  recordCount: number;
  format: "PDF" | "XLSX" | "CSV";
  status: "Active" | "Archived";
}

// -------------------------------------------------------------
// PRIMARY MOCK RECORDS
// -------------------------------------------------------------

export const PRIMARY_EMAIL_RECORD: EmailRecord = {
  id: "EML-001",
  emailId: "EML-2026-0145",
  emailNumber: "COMM-EML-2026-089",
  threadId: "TH-2026-0045",
  messageId: "<msg-8924@magnertia.internal>",
  emailType: "Customer Email",
  emailCategory: "Sales Communication",
  subject: "Quotation for Wireless EV Charging Station - Magnertia",
  from: "arun@magnertia.com",
  to: ["vijay@greenfleet.in"],
  cc: ["procurement@greenfleet.in", "sales@magnertia.com"],
  bcc: [],
  replyTo: "arun@magnertia.com",
  department: "Sales & Business Development",
  process: "Quotation",
  owner: "Arun Kumar",
  status: "Draft",
  priority: "High",
  confidentiality: "Internal",
  createdDate: "15-Sep-2026, 10:24 AM",
  sentDate: "15-Sep-2026",
  content: `Dear Mr. Vijay,\n\nThank you for your interest in Magnertia's Autonomous Wireless EV Charging Station.\n\nPlease find attached the detailed quotation for your reference. Our solution offers high efficiency, autonomous docking, and smart charging management, designed for commercial and fleet applications.\n\nKey Highlights:\n• Power Options: 7 kW / 11 kW / 30 kW DC Fast Charging\n• >90% System Efficiency\n• Autonomous Robotic Docking\n• Cloud-based Monitoring & OCPP Compliance\n• Customizable for Fleet & Public Charging\n\nWe look forward to your valuable feedback. Please let us know if you need any clarifications.\n\nBest regards,\nArun Kumar\nGeneral Manager - Business Development\nMagnertia Private Limited`,
  module: "Sales",
  submodule: "Quotation",
  transactionNumber: "QTN-2026-0145",
  customer: "GreenFleet Solutions Pvt Ltd",
  project: "Corporate Fleet Charging",
  relatedOpportunity: "OPP-2026-0332",
  communicationDomain: "Sales",
  businessFunction: "Business Development",
  tags: ["Quotation", "EV Charging", "Fleet", "Wireless", "QTN-2026-0145"],
  followUpAction: "Await customer response",
  followUpAssignee: "Arun Kumar",
  followUpDueDate: "22-Sep-2026",
  version: "v1.0",
};

export const EMAIL_KPIS = {
  totalEmails: "1,248",
  totalChange: 18,
  sentEmails: "1,020",
  sentChange: 12,
  receivedEmails: "186",
  receivedChange: 25,
  pendingResponses: "32",
  pendingChange: -20,
  openThreads: "98",
  threadsChange: 15,
  avgResponseTime: "4.2 hrs",
  responseChange: -30,
};

export const CHAT_CONVERSATIONS: ChatConversation[] = [
  {
    id: "CHAT-2026-0015",
    title: "EV Charging Project Team",
    type: "group",
    category: "Engineering",
    department: "R&D",
    owner: "Arun Kumar",
    project: "PRJ-2026-0032",
    priority: "High",
    confidentiality: "Internal",
    status: "Active",
    lastMessage: "Priya: Updated the test results....",
    lastMessageTime: "10:24 AM",
    unreadCount: 3,
    membersCount: 8,
    details: {
      chatId: "CHAT-2026-0015",
      title: "EV Charging Project Team",
      chatType: "Group Chat",
      category: "Engineering",
      owner: "Arun Kumar",
      department: "R&D",
      relatedProject: "PRJ-2026-0032",
      priority: "High",
      confidentiality: "Internal",
      createdOn: "12-Sep-2026",
      lastActivity: "10:24 AM",
    },
    participants: [
      { name: "Arun Kumar", role: "Owner", online: true },
      { name: "Priya Sharma", role: "Member", online: true },
      { name: "Ramesh S", role: "Member", online: true },
      { name: "Sankaranarayanan", role: "Member", online: true },
      { name: "Vijay K", role: "Member", online: false },
    ],
    sharedFiles: [
      { name: "WPT_Coil_Simulation_Report.pdf", size: "2.8 MB", date: "10:02 AM", type: "PDF" },
      { name: "Thermal_Analysis_Results.xlsx", size: "1.4 MB", date: "10:20 AM", type: "XLSX" },
      { name: "Design_Review_Notes.docx", size: "320 KB", date: "Yesterday", type: "DOCX" },
    ],
    messages: [
      {
        id: "M-1",
        sender: "Priya Sharma",
        senderAvatar: "PS",
        time: "10:02 AM",
        date: "Today",
        content: "The coil design simulation results are ready. Efficiency is at 92.4% for 150 mm air gap.",
        file: { name: "WPT_Coil_Simulation_Report.pdf", size: "2.8 MB", type: "pdf" },
        reactions: [
          { emoji: "👍", count: 4 },
          { emoji: "❤️", count: 2 },
          { emoji: "🎯", count: 1 },
        ],
      },
      {
        id: "M-2",
        sender: "Arun Kumar",
        senderAvatar: "AK",
        time: "10:15 AM",
        date: "Today",
        content: "Great work @Priya Sharma! Let's review this in today's meeting. Also, please share the thermal analysis results.",
        reactions: [
          { emoji: "👍", count: 1 },
        ],
        isMe: true,
      },
      {
        id: "M-3",
        sender: "Ramesh S",
        senderAvatar: "RS",
        time: "10:20 AM",
        date: "Today",
        content: "Attached the thermal simulation report.",
        file: { name: "Thermal_Analysis_Results.xlsx", size: "1.4 MB", type: "xlsx" },
        reactions: [
          { emoji: "👍", count: 3 },
          { emoji: "✅", count: 1 },
        ],
      },
      {
        id: "M-4",
        sender: "Sankaranarayanan",
        senderAvatar: "S",
        time: "10:24 AM",
        date: "Today",
        content: "We are on track for the prototype build. Please complete the component procurement by this week.",
        reactions: [
          { emoji: "👍", count: 5 },
          { emoji: "✅", count: 2 },
          { emoji: "🎯", count: 1 },
        ],
      },
    ],
  },
  {
    id: "CHAT-2026-0016",
    title: "Ramesh S",
    type: "direct",
    category: "Operations",
    department: "Manufacturing",
    owner: "Ramesh S",
    project: "PRJ-2026-0032",
    priority: "Normal",
    confidentiality: "Internal",
    status: "Active",
    lastMessage: "Let's review the BOM tomorrow.",
    lastMessageTime: "09:18 AM",
    unreadCount: 1,
    membersCount: 2,
    participants: [
      { name: "Arun Kumar", role: "Owner", online: true },
      { name: "Ramesh S", role: "Member", online: true },
    ],
    sharedFiles: [],
    messages: [
      {
        id: "M-21",
        sender: "Ramesh S",
        time: "09:18 AM",
        date: "Today",
        content: "Let's review the BOM tomorrow morning before the vendor call.",
      },
    ],
  },
  {
    id: "CHAT-2026-0017",
    title: "GreenFleet Solutions",
    type: "channel",
    category: "Customer",
    department: "Sales",
    owner: "Vijay K",
    project: "Corporate Fleet Charging",
    priority: "High",
    confidentiality: "Confidential",
    status: "Active",
    lastMessage: "We have approval for pilot installation.",
    lastMessageTime: "Yesterday",
    unreadCount: 2,
    membersCount: 5,
    participants: [
      { name: "Arun Kumar", role: "Owner", online: true },
      { name: "Vijay K", role: "Guest", online: false },
    ],
    sharedFiles: [],
    messages: [],
  },
];

export const VIDEO_MEETING_RECORD: VideoMeetingRecord = {
  id: "MTG-01",
  meetingId: "MTG-2026-0145",
  meetingNumber: "MTG-2026-0145",
  title: "Project Review - Autonomous Wireless EV Charging Station",
  type: "Project Meeting",
  category: "Engineering",
  organizer: "Arun Kumar",
  host: "Priya Sharma",
  date: "18-Sep-2026",
  time: "10:00 AM - 11:30 AM (IST)",
  duration: "1 hr 30 mins",
  timeZone: "(UTC+05:30) India Standard Time",
  meetingLink: "https://meet.magnertia.com/mtg-0145",
  passcode: "MAGNERTIA",
  status: "Scheduled",
  priority: "High",
  confidentiality: "Internal",
  relatedProject: "PRJ-2026-0032",
  relatedRecord: "Design Review",
  description: "Review design progress, test results, next steps and commercialization plan for Autonomous Wireless EV Charging Station.",
  tags: ["WPT", "Product Development", "R&D", "Review"],
  participants: [
    { name: "Arun Kumar", role: "Organizer, Host", micOn: true, isSpeaking: true },
    { name: "Priya Sharma", role: "Co-Host", micOn: true },
    { name: "Ramesh S", role: "Member", micOn: false },
    { name: "Vijay K", role: "Member", micOn: false },
    { name: "Sankaranarayanan", role: "Member", micOn: false },
    { name: "Divya M", role: "Member", micOn: false },
    { name: "James (GreenFleet)", role: "Guest", micOn: false },
    { name: "Sarah (TechConsult)", role: "Guest", micOn: false },
  ],
  agenda: [
    { id: "A1", topic: "Project Overview", presenter: "Arun Kumar", duration: "10 min", done: true },
    { id: "A2", topic: "Design Review", presenter: "Priya Sharma", duration: "30 min", done: false },
    { id: "A3", topic: "Test Results", presenter: "Ramesh S", duration: "20 min", done: false },
    { id: "A4", topic: "Manufacturing Plan", presenter: "Vijay K", duration: "15 min", done: false },
    { id: "A5", topic: "Next Steps & Actions", presenter: "All", duration: "15 min", done: false },
  ],
  actionItems: [
    { id: "ACT-1", action: "Update test report", owner: "Ramesh S", dueDate: "20-Sep", status: "Open" },
    { id: "ACT-2", action: "Finalize BOM", owner: "Vijay K", dueDate: "25-Sep", status: "In Progress" },
    { id: "ACT-3", action: "Prepare cost analysis", owner: "Priya Sharma", dueDate: "28-Sep", status: "Open" },
    { id: "ACT-4", action: "Schedule customer demo drive", owner: "Arun Kumar", dueDate: "30-Sep", status: "Open" },
  ],
  documents: [
    { name: "Design_Specification.pdf", size: "1.8 MB", type: "PDF" },
    { name: "Test_Report.pdf", size: "2.4 MB", type: "PDF" },
    { name: "BOM_Draft.xlsx", size: "1.2 MB", type: "XLSX" },
    { name: "Roadmap.pptx", size: "4.6 MB", type: "PPTX" },
    { name: "Meeting_Agenda.pdf", size: "320 KB", type: "PDF" },
  ],
  chatMessages: [
    { sender: "Priya Sharma", time: "10:12 AM", text: "Sharing the latest test results.", file: { name: "WPT_Test_Results.pdf", size: "2.4 MB" } },
    { sender: "Ramesh S", time: "10:15 AM", text: "The efficiency is above 92%. Let's discuss next steps." },
    { sender: "Sankaranarayanan", time: "10:18 AM", text: "I'll share the commercialization roadmap." },
  ],
};

export const VIDEO_MEETING_KPIS = {
  totalMeetings: "32",
  totalChange: 18,
  thisMonth: "12",
  monthChange: 33,
  completed: "28",
  completedChange: 27,
  inProgress: "3",
  upcoming: "1",
  attendanceRate: "92%",
  attendanceChange: 5,
};

export const NOTIFICATIONS_MASTER_LIST: NotificationRecord[] = [
  {
    id: "N1",
    notificationId: "NTF-2026-001",
    title: "Purchase Order Approval Required",
    type: "Approval",
    module: "Purchase",
    priority: "High",
    status: "Active",
    createdOn: "19-Sep-2026",
    category: "Finance",
    owner: "Arun Kumar",
    effectiveFrom: "01-Sep-2026",
    effectiveTo: "31-Dec-2026",
    subject: "PO Approval - PO-2026-0428",
    preview: "PO for EV Fast Charging Transformers awaiting Level 2 Financial sign-off.",
    channels: { inApp: true, email: true, sms: false, whatsapp: true },
    recipientsCount: 3,
    code: "NTF-2026-001",
    subjectTemplate: "PO Approval - PO-2026-0428",
    messagePreview: "PO for EV Fast Charging Transformers awaiting Level 2 Financial sign-off.",
    recipients: [
      { name: "Arun Kumar", role: "Manager", avatar: "AK" },
      { name: "Priya Sharma", role: "Lead Engineer", avatar: "PS" },
      { name: "Ramesh S", role: "Quality Head", avatar: "RS" },
    ],
  },
  {
    id: "N2",
    notificationId: "NTF-2026-002",
    title: "Invoice Due Date Reminder",
    type: "Reminder",
    module: "Finance",
    priority: "Medium",
    status: "Active",
    createdOn: "19-Sep-2026",
    category: "Finance",
    owner: "Arun Kumar",
    effectiveFrom: "01-Sep-2026",
    effectiveTo: "31-Dec-2026",
    subject: "Payment Reminder - Invoice {{InvoiceNumber}}",
    preview: "Dear {{CustomerName}}, this is a reminder that invoice for ₹{{Amount}} is due on {{DueDate}}.",
    channels: { inApp: true, email: true, sms: true, whatsapp: true },
    recipientsCount: 5,
    code: "NTF-2026-002",
    subjectTemplate: "Payment Reminder - Invoice {{InvoiceNumber}}",
    messagePreview: "Dear {{CustomerName}}, this is a reminder that invoice for ₹{{Amount}} is due on {{DueDate}}.",
    recipients: [
      { name: "Vijay K", role: "Accountant", avatar: "VK" },
      { name: "Ramesh S", role: "Finance Head", avatar: "RS" },
      { name: "Priya Sharma", role: "Billing Specialist", avatar: "PS" },
      { name: "Arun Kumar", role: "Manager", avatar: "AK" },
    ],
  },
  {
    id: "N3",
    notificationId: "NTF-2026-003",
    title: "Project Milestone Completed",
    type: "System",
    module: "Project",
    priority: "Low",
    status: "Active",
    createdOn: "18-Sep-2026",
    category: "Operations",
    owner: "Priya Sharma",
    effectiveFrom: "01-Sep-2026",
    effectiveTo: "31-Dec-2026",
    subject: "Milestone Achieved: Prototype Validation",
    preview: "Milestone 4.2 for Autonomous EV Station passed laboratory testing.",
    channels: { inApp: true, email: true, sms: false, whatsapp: false },
    recipientsCount: 14,
  },
  {
    id: "N4",
    notificationId: "NTF-2026-004",
    title: "New Lead Assigned",
    type: "Business",
    module: "CRM",
    priority: "High",
    status: "Active",
    createdOn: "18-Sep-2026",
    category: "Sales",
    owner: "Arun Kumar",
    effectiveFrom: "01-Sep-2026",
    effectiveTo: "31-Dec-2026",
    subject: "Lead Assignment: Bangalore Metro Rail Corp",
    preview: "New high-value inquiry assigned for depot wireless charging infrastructure.",
    channels: { inApp: true, email: true, sms: true, whatsapp: true },
    recipientsCount: 2,
  },
  {
    id: "N5",
    notificationId: "NTF-2026-005",
    title: "Training Session Reminder",
    type: "Reminder",
    module: "HR",
    priority: "Medium",
    status: "Active",
    createdOn: "17-Sep-2026",
    category: "HR",
    owner: "Deepa Rao",
    effectiveFrom: "01-Sep-2026",
    effectiveTo: "31-Dec-2026",
    subject: "Mandatory High Voltage Safety Training",
    preview: "Session starts tomorrow at 10:00 AM in Training Hall A.",
    channels: { inApp: true, email: true, sms: false, whatsapp: true },
    recipientsCount: 35,
  },
  {
    id: "N6",
    notificationId: "NTF-2026-006",
    title: "Quality Audit Scheduled",
    type: "Notification",
    module: "Quality",
    priority: "Medium",
    status: "Active",
    createdOn: "17-Sep-2026",
    category: "Compliance",
    owner: "Ramesh S",
    effectiveFrom: "01-Sep-2026",
    effectiveTo: "31-Dec-2026",
    subject: "Internal ISO 9001:2015 Surveillance Audit",
    preview: "Plant audit scheduled across Coil Assembly & Final Inspection bays.",
    channels: { inApp: true, email: true, sms: false, whatsapp: false },
    recipientsCount: 12,
  },
  {
    id: "N7",
    notificationId: "NTF-2026-007",
    title: "System Maintenance Alert",
    type: "Alert",
    module: "IT",
    priority: "High",
    status: "Active",
    createdOn: "16-Sep-2026",
    category: "IT",
    owner: "IT Admin",
    effectiveFrom: "01-Sep-2026",
    effectiveTo: "31-Dec-2026",
    subject: "Scheduled ERP Cloud Cluster Upgrade",
    preview: "Database maintenance scheduled on Saturday 11:00 PM to 01:00 AM.",
    channels: { inApp: true, email: true, sms: true, whatsapp: false },
    recipientsCount: 250,
  },
  {
    id: "N8",
    notificationId: "NTF-2026-008",
    title: "Customer Support Ticket Update",
    type: "Transactional",
    module: "Support",
    priority: "Low",
    status: "Active",
    createdOn: "16-Sep-2026",
    category: "Support",
    owner: "Support Team",
    effectiveFrom: "01-Sep-2026",
    effectiveTo: "31-Dec-2026",
    subject: "Ticket #SUP-2026-894 Resolved",
    preview: "Docking alignment issue at Whitefield Hub recalibrated and resolved.",
    channels: { inApp: true, email: true, sms: false, whatsapp: true },
    recipientsCount: 4,
  },
];

export const NOTIFICATIONS_KPIS = {
  totalNotifications: "248",
  totalChange: 18,
  delivered: "196",
  deliveredChange: 22,
  read: "142",
  readChange: 15,
  pendingAction: "32",
  pendingChange: -20,
  escalated: "8",
  escalatedChange: -11,
  scheduled: "12",
  scheduledChange: 33,
};

export const PRIMARY_ANNOUNCEMENT_RECORD: AnnouncementRecord = {
  id: "ANN-01",
  announcementNumber: "ANN-2026-0045",
  title: "New Quality Inspection Procedure",
  type: "Policy Announcement",
  category: "Quality",
  priority: "High",
  severity: "Critical",
  businessFunction: "Quality Management",
  module: "Quality",
  process: "Final Inspection",
  owner: "Arun Kumar",
  publisher: "Ramesh S",
  effectiveDate: "20-Sep-2026",
  expiryDate: "31-Dec-2026",
  status: "Draft",
  confidentiality: "Internal",
  headline: "New Quality Inspection Procedure",
  summary: "We are pleased to announce the implementation of a revised Quality Inspection Procedure effective 20th September 2026.",
  body: `We are pleased to announce the implementation of a revised Quality Inspection Procedure effective 20th September 2026.\n\nThe updated procedure enhances inspection accuracy, standardizes documentation, and aligns with our ISO 9001:2015 compliance requirements.\n\nKey Highlights:\n• Updated inspection checklist (Version 2.0)\n• Digital inspection records in ERP\n• Mandatory photo evidence for critical components\n• Applicable to all manufacturing sites\n• Training sessions scheduled next week\n\nFor details, please refer to the attached document or contact the Quality Assurance team.\n\nRegards,\nQuality Management Team\nMagnertia Private Limited`,
  keyMessage: "Digital inspection checklist Version 2.0 mandatory across all production lines.",
  instructions: "All floor supervisors must certify completion of training modules before 25-Sep-2026.",
  callToAction: "Download inspection checklist v2.0 and complete acknowledgement.",
  recipientsCount: 250,
  acknowledgementRequired: true,
  publishedChannels: ["In-App", "Email", "SMS", "WhatsApp"],
  attachments: [
    { name: "Quality_Inspection_Procedure_v2.0.pdf", size: "2.4 MB", type: "PDF", uploadedBy: "Arun Kumar" },
    { name: "Inspection_Checklist.xlsx", size: "1.1 MB", type: "XLSX", uploadedBy: "Priya Sharma" },
    { name: "Training_Schedule.pdf", size: "320 KB", type: "PDF", uploadedBy: "Ramesh S" },
  ],
};

export const ANNOUNCEMENT_KPIS = {
  totalAnnouncements: "248",
  published: "186",
  scheduled: "32",
  awaitingApproval: "18",
  expiringSoon: "12",
  acknowledgementRate: "94.6%",
};

export const CONTROLLED_COMMUNICATION_REPORTS: ControlledCommunicationReport[] = [
  {
    id: "CR-1",
    code: "COMM-REP-01",
    title: "Email Communication Master Register",
    category: "Email",
    purpose: "Complete organizational outbound and inbound business email register with recipient audit.",
    frequency: "Daily",
    lastGenerated: "27-Sep-2026",
    recordCount: 1248,
    format: "PDF",
    status: "Active",
  },
  {
    id: "CR-2",
    code: "COMM-REP-02",
    title: "Email Delivery & SLA Latency Report",
    category: "Email",
    purpose: "SMTP delivery metrics, bounce statistics, queue delays, and response time compliance.",
    frequency: "Weekly",
    lastGenerated: "25-Sep-2026",
    recordCount: 940,
    format: "XLSX",
    status: "Active",
  },
  {
    id: "CR-3",
    code: "COMM-REP-03",
    title: "Chat Collaboration & Activity Ledger",
    category: "Chat",
    purpose: "Channel engagement metrics, message counts, file exchanges, and task conversion audit.",
    frequency: "Weekly",
    lastGenerated: "26-Sep-2026",
    recordCount: 18420,
    format: "XLSX",
    status: "Active",
  },
  {
    id: "CR-4",
    code: "COMM-REP-04",
    title: "Video Meetings & Attendance Audit",
    category: "Video Meetings",
    purpose: "Meeting minutes, attendance percentages, recording access history, and action item logs.",
    frequency: "Monthly",
    lastGenerated: "27-Sep-2026",
    recordCount: 342,
    format: "PDF",
    status: "Active",
  },
  {
    id: "CR-5",
    code: "COMM-REP-05",
    title: "Notification Delivery & Acknowledgement Report",
    category: "Notifications",
    purpose: "Omnichannel notification tracking across In-App, Email, SMS, Push, and WhatsApp.",
    frequency: "Daily",
    lastGenerated: "27-Sep-2026",
    recordCount: 248,
    format: "PDF",
    status: "Active",
  },
  {
    id: "CR-6",
    code: "COMM-REP-06",
    title: "Company Announcements & Compliance Log",
    category: "Announcements",
    purpose: "Enterprise announcement distribution, acknowledgement verification, and statutory alerts.",
    frequency: "Monthly",
    lastGenerated: "24-Sep-2026",
    recordCount: 186,
    format: "PDF",
    status: "Active",
  },
  {
    id: "CR-7",
    code: "COMM-REP-07",
    title: "Customer & Supplier Communication Ledger",
    category: "External Communication",
    purpose: "Cross-enterprise external touchpoints linked to CRM opportunities and purchase orders.",
    frequency: "Quarterly",
    lastGenerated: "20-Sep-2026",
    recordCount: 4620,
    format: "XLSX",
    status: "Active",
  },
  {
    id: "CR-8",
    code: "COMM-REP-08",
    title: "Communication Security & Audit Trail",
    category: "Audit & Governance",
    purpose: "Immutable audit log of all email sending, chat deletions, meeting recordings, and data export.",
    frequency: "Quarterly",
    lastGenerated: "27-Sep-2026",
    recordCount: 8910,
    format: "PDF",
    status: "Active",
  },
];

// ==========================================
// 7. Internal Social Network Models & Data
// ==========================================
export interface SocialProfile {
  name: string;
  role: string;
  department: string;
  bio: string;
  postsCount: number;
  followersCount: string;
  followingCount: number;
  avatarText: string;
}

export interface SocialCommunity {
  id: string;
  name: string;
  members: string;
  isPinned?: boolean;
  isJoined?: boolean;
  category: string;
}

export interface SocialFeedPost {
  id: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  timeAgo: string;
  content: string;
  tags: string[];
  metrics?: {
    efficiency?: string;
    power?: string;
  };
  hasImages?: boolean;
  bannerType?: "charging_station" | "prototype";
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface SocialEventItem {
  id: string;
  month: string;
  day: string;
  title: string;
  location: string;
  time: string;
  isRegistered?: boolean;
}

export const MOCK_SOCIAL_PROFILE: SocialProfile = {
  name: "Arun Kumar",
  role: "General Manager",
  department: "Business Development",
  bio: "Building a sustainable future with people, technology and innovation.",
  postsCount: 248,
  followersCount: "1.2K",
  followingCount: 356,
  avatarText: "AK",
};

export const MOCK_MY_COMMUNITIES: SocialCommunity[] = [
  { id: "com-1", name: "EV Charging Innovation", members: "1.2K members", isPinned: true, isJoined: true, category: "Engineering" },
  { id: "com-2", name: "R&D and Engineering", members: "856 members", isJoined: true, category: "R&D" },
  { id: "com-3", name: "Quality & Compliance", members: "624 members", isJoined: true, category: "Quality" },
  { id: "com-4", name: "Magnertia HR Connect", members: "1.1K members", isJoined: true, category: "HR" },
  { id: "com-5", name: "Sustainability & Green Energy", members: "512 members", isJoined: true, category: "Initiatives" },
];

export const MOCK_SUGGESTED_COMMUNITIES: SocialCommunity[] = [
  { id: "sug-1", name: "Product Development", members: "430 members", isJoined: false, category: "Product" },
  { id: "sug-2", name: "Manufacturing Excellence", members: "390 members", isJoined: false, category: "Manufacturing" },
  { id: "sug-3", name: "Customer Success", members: "280 members", isJoined: false, category: "CRM" },
  { id: "sug-4", name: "Innovation Hub", members: "620 members", isJoined: false, category: "Innovation" },
];

export const MOCK_SOCIAL_POSTS: SocialFeedPost[] = [
  {
    id: "sp-1",
    author: "Priya Sharma",
    authorRole: "R&D Team",
    authorAvatar: "PS",
    timeAgo: "2 hours ago",
    content: "We successfully completed the prototype test of the 3.3 kW wireless charging module! Great teamwork by the R&D team. This is a big step towards our next milestone.",
    tags: ["#Innovation", "#EVCharging", "#R&D", "#TeamWork"],
    hasImages: true,
    bannerType: "prototype",
    metrics: {
      efficiency: "92.4%",
      power: "3.31 kW",
    },
    likes: 51,
    comments: 12,
    shares: 4,
    isLiked: true,
  },
  {
    id: "sp-2",
    author: "Sankaranarayanan",
    authorRole: "CEO",
    authorAvatar: "S",
    timeAgo: "5 hours ago",
    content: "Proud to announce that Magnertia Private Limited has been shortlisted for TANSEED 8.0! This recognition motivates us to innovate faster and scale our autonomous EV charging solutions. Thank you to the entire team for your dedication! 🙏",
    tags: ["#Milestone", "#Startup", "#TANSEED", "#Magnertia", "#Gratitude"],
    hasImages: true,
    bannerType: "charging_station",
    likes: 128,
    comments: 28,
    shares: 12,
    isLiked: true,
  },
];

export const MOCK_SOCIAL_EVENTS: SocialEventItem[] = [
  { id: "ev-1", month: "SEP", day: "25", title: "EV Technology Knowledge Session", location: "Online (Teams)", time: "10:00 AM - 11:30 AM", isRegistered: false },
  { id: "ev-2", month: "SEP", day: "28", title: "Monthly All Hands Meeting", location: "Auditorium, Namakkal", time: "03:00 PM - 05:00 PM", isRegistered: true },
  { id: "ev-3", month: "OCT", day: "03", title: "Sustainability Workshop", location: "Coimbatore R&D Centre", time: "10:00 AM - 01:00 PM", isRegistered: false },
];

export const MOCK_TRENDING_TOPICS = [
  { tag: "#EVCharging", posts: "128 posts", change: "+42%" },
  { tag: "#Innovation", posts: "96 posts", change: "+28%" },
  { tag: "#Sustainability", posts: "74 posts", change: "+25%" },
  { tag: "#TeamWork", posts: "63 posts", change: "+18%" },
  { tag: "#Quality", posts: "52 posts", change: "+12%" },
];

export const MOCK_PEOPLE_TO_FOLLOW = [
  { id: "p-1", name: "Ramesh S", role: "Head - Engineering", avatar: "RS", isFollowing: false },
  { id: "p-2", name: "Divya M", role: "Quality Manager", avatar: "DM", isFollowing: false },
  { id: "p-3", name: "Vijay K", role: "Project Manager", avatar: "VK", isFollowing: false },
];

// ==========================================
// 8. Collaboration Workspace Models & Data
// ==========================================
export interface WorkspaceDetails {
  code: string;
  name: string;
  type: string;
  owner: string;
  department: string;
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Completed" | "On Hold";
  startDate: string;
  targetDate: string;
  description: string;
  tags: string[];
  completionPercentage: number;
}

export const MOCK_WORKSPACE_DETAILS: WorkspaceDetails = {
  code: "PRJ-EVC-001",
  name: "EV Charging Project",
  type: "Project Workspace",
  owner: "Arun Kumar",
  department: "R&D",
  priority: "High",
  status: "Active",
  startDate: "01-Sep-2026",
  targetDate: "31-Mar-2027",
  description: "Design, develop and deploy autonomous wireless EV charging station platform.",
  tags: ["EV", "Innovation", "R&D"],
  completionPercentage: 42,
};

export const MOCK_WORKSPACE_TASKS = [
  { id: "tsk-1", title: "Finalize coil design v2.0", priority: "High", dueDate: "20-Sep-2026", assignee: "PS", completed: false },
  { id: "tsk-2", title: "Prepare test report", priority: "Medium", dueDate: "25-Sep-2026", assignee: "RS", completed: false },
  { id: "tsk-3", title: "Update BOM and costing", priority: "Medium", dueDate: "28-Sep-2026", assignee: "VK", completed: false },
  { id: "tsk-4", title: "Submit TANSEED documents", priority: "High", dueDate: "30-Sep-2026", assignee: "AK", completed: false },
  { id: "tsk-5", title: "Plan pilot installation", priority: "Low", dueDate: "05-Oct-2026", assignee: "DM", completed: false },
];

export const MOCK_WORKSPACE_DOCS = [
  { id: "doc-1", name: "Prototype_Test_Report_v1.0.pdf", size: "2.4 MB", time: "2 hours ago", author: "PS" },
  { id: "doc-2", name: "Coil_Design_Drawing_v2.0.xlsx", size: "1.1 MB", time: "4 hours ago", author: "RS" },
  { id: "doc-3", name: "TANSEED_Application.pptx", size: "4.6 MB", time: "1 day ago", author: "AK" },
  { id: "doc-4", name: "BOM_Costing_v1.2.xlsx", size: "1.2 MB", time: "1 day ago", author: "VK" },
  { id: "doc-5", name: "Compliance_Checklist.pdf", size: "320 KB", time: "2 days ago", author: "DM" },
];

export const MOCK_WORKSPACE_MEMBERS = [
  { id: "m-1", name: "Arun Kumar", role: "Owner", avatar: "AK", online: true },
  { id: "m-2", name: "Priya Sharma", role: "Admin", avatar: "PS", online: true },
  { id: "m-3", name: "Ramesh S", role: "Member", avatar: "RS", online: true },
  { id: "m-4", name: "Vijay K", role: "Member", avatar: "VK", online: false },
  { id: "m-5", name: "Divya M", role: "Member", avatar: "DM", online: true },
];

export const MOCK_WORKSPACE_MEETINGS = [
  { id: "wm-1", title: "Product Design Review", time: "Today, 11:00 AM - 12:00 PM", attendees: 8 },
  { id: "wm-2", title: "TANSEED Application Discussion", time: "Tomorrow, 10:00 AM - 11:00 AM", attendees: 5 },
  { id: "wm-3", title: "Manufacturing Readiness Review", time: "22 Sep 2026, 03:00 PM - 04:30 PM", attendees: 6 },
];

// -------------------------------------------------------------
// COMMUNICATION OVERVIEW & SHARED EXPORTS
// -------------------------------------------------------------

export const MOCK_COMMUNICATION_KPIS = {
  totalEmails: 12840,
  sentEmails: 7420,
  receivedEmails: 5420,
  totalMessages: 18420,
  activeChats: 142,
  totalMeetings: 486,
  attendanceRate: 96.4,
  completedMeetings: 458,
  totalNotifications: 248,
  deliveryRate: 99.2,
  publishedAnnouncements: 54,
  acknowledgementRate: 94.8,
  avgResponseTime: "1.4 hrs",
  pendingResponses: 14,
  overdueResponses: 2,
};

export const MOCK_COMMUNICATION_RECORDS = [
  {
    id: "rec-1",
    refId: "COMM-EML-2026-089",
    type: "Email",
    title: "Quotation for Wireless EV Charging Station - Magnertia",
    module: "Sales",
    contextRecord: "QTN-2026-0145",
    sender: "Arun Kumar",
    recipient: "vijay@greenfleet.in",
    priority: "High",
    status: "Delivered",
    timestamp: "Today, 10:24 AM",
  },
  {
    id: "rec-2",
    refId: "COMM-CHT-2026-041",
    type: "Chat",
    title: "Battery Pack Thermal Runaway Simulation Sync",
    module: "R&D",
    contextRecord: "SIM-2026-0042",
    sender: "Priya Sharma",
    recipient: "Engineering Squad (12)",
    priority: "Urgent",
    status: "Active",
    timestamp: "Today, 09:45 AM",
  },
  {
    id: "rec-3",
    refId: "COMM-MTG-2026-012",
    type: "Video Meeting",
    title: "Product Design Review & ISO 9001 Stage 2 Audit",
    module: "Quality",
    contextRecord: "AUD-2026-0018",
    sender: "Ramesh Sundaram",
    recipient: "Lead Auditors & Ops",
    priority: "High",
    status: "Completed",
    timestamp: "Yesterday, 03:00 PM",
  },
  {
    id: "rec-4",
    refId: "COMM-NOT-2026-095",
    type: "Notification",
    title: "Purchase Order PO-2026-0892 Approval SLA Alert",
    module: "Procurement",
    contextRecord: "PO-2026-0892",
    sender: "ERP System Workflow",
    recipient: "Finance Controller",
    priority: "Critical",
    status: "Delivered",
    timestamp: "Today, 08:15 AM",
  },
  {
    id: "rec-5",
    refId: "COMM-ANN-2026-008",
    type: "Announcement",
    title: "Q3 Factory Maintenance & Cleanroom Sanitization Window",
    module: "Manufacturing",
    contextRecord: "FAC-MAINT-2026-Q3",
    sender: "Chief Operating Officer",
    recipient: "All Plant Employees",
    priority: "Normal",
    status: "Published",
    timestamp: "22-Sep-2026",
  },
  {
    id: "rec-6",
    refId: "COMM-EML-2026-088",
    type: "Email",
    title: "TANSEED Grant Application Submission & Compliance Dossier",
    module: "Legal & Grants",
    contextRecord: "GRT-TN-2026-01",
    sender: "Arun Kumar",
    recipient: "grants@startuptn.in",
    priority: "High",
    status: "Delivered",
    timestamp: "21-Sep-2026",
  },
  {
    id: "rec-7",
    refId: "COMM-MTG-2026-015",
    type: "Video Meeting",
    title: "Weekly Supply Chain Escalation & Vendor Onboarding Review",
    module: "Supply Chain",
    contextRecord: "SCM-WK-38",
    sender: "Divya M",
    recipient: "Procurement & SCM Leads",
    priority: "Normal",
    status: "Scheduled",
    timestamp: "Tomorrow, 11:00 AM",
  },
  {
    id: "rec-8",
    refId: "COMM-NOT-2026-094",
    type: "Notification",
    title: "SOP-MFG-042 Revision Published & Ready for Signoff",
    module: "Knowledge",
    contextRecord: "SOP-MFG-042",
    sender: "Quality Assurance",
    recipient: "Manufacturing Operators",
    priority: "Normal",
    status: "Delivered",
    timestamp: "20-Sep-2026",
  },
];

// Reports definitions
export interface CommunicationReportDef {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  frequency: string;
  format: string;
  lastGenerated: string;
  status: string;
}

export const MOCK_COMMUNICATION_REPORTS: CommunicationReportDef[] = [
  {
    id: "rep-1",
    code: "REP-COMM-001",
    name: "Enterprise Communication Master Register",
    category: "Master Register",
    description: "Full audit trail of all emails, chats, video meetings, and announcements across enterprise units.",
    frequency: "Daily",
    format: "PDF, XLSX",
    lastGenerated: "Today, 06:00 AM",
    status: "Ready",
  },
  {
    id: "rep-2",
    code: "REP-COMM-002",
    name: "Customer Quotation SLA Adherence Report",
    category: "Performance",
    description: "Detailed compliance tracking against 4-hour sales email acknowledgement and delivery SLA.",
    frequency: "Weekly",
    format: "PDF, XLSX",
    lastGenerated: "Yesterday, 05:30 PM",
    status: "Ready",
  },
  {
    id: "rep-3",
    code: "REP-COMM-003",
    name: "Video Meeting Attendance & Action Item Log",
    category: "Governance",
    description: "Summary of enterprise video meetings, attendee participation rates, and open action item tracking.",
    frequency: "Weekly",
    format: "XLSX",
    lastGenerated: "20-Sep-2026",
    status: "Ready",
  },
  {
    id: "rep-4",
    code: "REP-COMM-004",
    name: "Multi-Channel Broadcast Delivery & Bounce Audit",
    category: "Technical",
    description: "Technical delivery audit across Email (SMTP), SMS gateway, In-App push, and WhatsApp Business API.",
    frequency: "Real-time",
    format: "CSV, XLSX",
    lastGenerated: "Today, 09:15 AM",
    status: "Ready",
  },
  {
    id: "rep-5",
    code: "REP-COMM-005",
    name: "Executive Mandatory Announcement Compliance Ledger",
    category: "Compliance",
    description: "Controlled signoff status and acknowledgement compliance by plant, business unit, and grade.",
    frequency: "Monthly",
    format: "PDF",
    lastGenerated: "18-Sep-2026",
    status: "Ready",
  },
];

// Aliases for Communication Submodules
export const INITIAL_EMAIL_RECORD = PRIMARY_EMAIL_RECORD;
export const MOCK_CHAT_CONVERSATIONS = CHAT_CONVERSATIONS;
export const MOCK_ACTIVE_CHAT = CHAT_CONVERSATIONS[0];
export const MOCK_MEETING_KPIS = VIDEO_MEETING_KPIS;
export const MOCK_ACTIVE_MEETING = VIDEO_MEETING_RECORD;
export const MOCK_NOTIFICATION_RECORDS = NOTIFICATIONS_MASTER_LIST;
export const MOCK_NOTIFICATION_KPIS = NOTIFICATIONS_KPIS;
export type NotificationMaster = NotificationRecord;
export const INITIAL_ANNOUNCEMENT_RECORD = PRIMARY_ANNOUNCEMENT_RECORD;
export const MOCK_AUDIENCE_RECIPIENTS = [
  { id: "1", type: "Department", name: "Quality Assurance & Control", count: 48 },
  { id: "2", type: "Process Team", name: "Cleanroom Final Assembly & Inspection", count: 32 },
  { id: "3", type: "Role / Grade", name: "Certified Quality Engineers (CQE)", count: 24 },
  { id: "4", type: "Plant / Site", name: "Coimbatore Main Facility (Plant-01)", count: 180 },
];


