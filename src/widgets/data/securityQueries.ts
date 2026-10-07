// Query & Data Definitions for Security Management Widgets

export type SecurityOverviewData = {
  kpis: {
    totalIdentities: { value: number; delta: string; neutral: string };
    activeUsers: { value: number; delta: string; neutral: string };
    protectedAssets: { value: number; delta: string; neutral: string };
    cctvOnline: { value: string; count: number; total: number; delta: string };
    openIncidents: { value: number; delta: string; neutral: string };
    criticalVulnerabilities: { value: number; delta: string; neutral: string };
    mfaAdoption: { value: string; delta: string; neutral: string };
    patchCompliance: { value: string; delta: string; neutral: string };
    sodConflicts: { value: number; delta: string; neutral: string };
    informationAssets: { value: number; delta: string; neutral: string };
  };
  threatTrends: Array<{
    month: string;
    assets: number;
    vulnerabilities: number;
    incidents: number;
    riskScore: number;
  }>;
  incidentBreakdown: Array<{
    category: string;
    count: number;
    color: string;
  }>;
  riskHeatmap: Array<{
    likelihood: string;
    veryLow: number;
    low: number;
    medium: number;
    high: number;
    veryHigh: number;
  }>;
  compliancePosture: Array<{
    framework: string;
    complianceScore: number;
    status: string;
    totalControls: number;
  }>;
  facilitiesStatus: Array<{
    facility: string;
    status: "Secure" | "Attention" | "Monitor";
    cameras: number;
    incidents: number;
  }>;
  aiFeed: Array<{
    id: string;
    title: string;
    desc: string;
    time: string;
    severity: "critical" | "high" | "medium" | "low";
  }>;
};

export const SECURITY_OVERVIEW_DATA: SecurityOverviewData = {
  kpis: {
    totalIdentities: { value: 542, delta: "+8% vs last month", neutral: "542 Identities" },
    activeUsers: { value: 486, delta: "+5% vs last month", neutral: "486 Active Users" },
    protectedAssets: { value: 1284, delta: "+6% vs last month", neutral: "1,284 Endpoints & Systems" },
    cctvOnline: { value: "97.9%", count: 94, total: 96, delta: "+7% uptime" },
    openIncidents: { value: 5, delta: "-44% vs last month", neutral: "5 Active Triaged" },
    criticalVulnerabilities: { value: 5, delta: "-50% vs last month", neutral: "5 SLA Active" },
    mfaAdoption: { value: "98.2%", delta: "+2.1% coverage", neutral: "Phishing Resistant" },
    patchCompliance: { value: "94.6%", delta: "+3% vs last sprint", neutral: "236 Patches Applied" },
    sodConflicts: { value: 4, delta: "-50% resolved", neutral: "4 Controlled & Mitigated" },
    informationAssets: { value: 2486, delta: "+6% cataloged", neutral: "2,486 Data Assets" },
  },
  threatTrends: [
    { month: "Jan", assets: 1020, vulnerabilities: 32, incidents: 8, riskScore: 68 },
    { month: "Feb", assets: 1060, vulnerabilities: 35, incidents: 7, riskScore: 66 },
    { month: "Mar", assets: 1100, vulnerabilities: 30, incidents: 9, riskScore: 64 },
    { month: "Apr", assets: 1140, vulnerabilities: 38, incidents: 6, riskScore: 62 },
    { month: "May", assets: 1180, vulnerabilities: 42, incidents: 8, riskScore: 60 },
    { month: "Jun", assets: 1205, vulnerabilities: 40, incidents: 5, riskScore: 58 },
    { month: "Jul", assets: 1220, vulnerabilities: 44, incidents: 7, riskScore: 57 },
    { month: "Aug", assets: 1250, vulnerabilities: 49, incidents: 8, riskScore: 56 },
    { month: "Sep", assets: 1284, vulnerabilities: 47, incidents: 5, riskScore: 54 },
  ],
  incidentBreakdown: [
    { category: "Unauthorized Access", count: 2, color: "#EF4444" },
    { category: "Malware Activity", count: 1, color: "#F97316" },
    { category: "Phishing Campaign", count: 1, color: "#FBBF24" },
    { category: "CCTV/Physical Alarm", count: 1, color: "#06B6D4" },
  ],
  riskHeatmap: [
    { likelihood: "Very High", veryLow: 0, low: 0, medium: 2, high: 3, veryHigh: 0 },
    { likelihood: "High", veryLow: 0, low: 2, medium: 4, high: 3, veryHigh: 2 },
    { likelihood: "Medium", veryLow: 2, low: 5, medium: 8, high: 6, veryHigh: 2 },
    { likelihood: "Low", veryLow: 12, low: 10, medium: 14, high: 8, veryHigh: 6 },
    { likelihood: "Very Low", veryLow: 24, low: 18, medium: 12, high: 4, veryHigh: 1 },
  ],
  compliancePosture: [
    { framework: "ISO 27001 ISMS", complianceScore: 97.4, status: "Certified", totalControls: 114 },
    { framework: "ISO/SAE 21434 (Cybersecurity Automotive)", complianceScore: 94.6, status: "Audited", totalControls: 84 },
    { framework: "IEC 62443 (Industrial Automation & OT)", complianceScore: 92.8, status: "Compliant", totalControls: 96 },
    { framework: "OCPP 2.0.1 Security Profile 3", complianceScore: 99.1, status: "Certified", totalControls: 42 },
    { framework: "DPDP & GDPR Data Privacy", complianceScore: 96.2, status: "Compliant", totalControls: 68 },
  ],
  facilitiesStatus: [
    { facility: "Corporate Office", status: "Secure", cameras: 16, incidents: 0 },
    { facility: "Development Centre", status: "Secure", cameras: 20, incidents: 0 },
    { facility: "Manufacturing Facility", status: "Attention", cameras: 28, incidents: 2 },
    { facility: "R&D Laboratory", status: "Secure", cameras: 12, incidents: 1 },
    { facility: "Warehouse", status: "Secure", cameras: 10, incidents: 1 },
    { facility: "Charging Station Site", status: "Secure", cameras: 4, incidents: 0 },
    { facility: "Data Centre", status: "Secure", cameras: 4, incidents: 0 },
    { facility: "Remote Sites", status: "Monitor", cameras: 2, incidents: 1 },
  ],
  aiFeed: [
    {
      id: "ai-sec-1",
      title: "Ransomware signature pattern blocked on EVSE-02",
      desc: "Zero-day encryption behavior suppressed at endpoint level. Machine quarantined.",
      time: "2h ago",
      severity: "critical",
    },
    {
      id: "ai-sec-2",
      title: "Anomalous off-hours admin login from novel subnet",
      desc: "Admin01 credential verified with step-up biometric challenge.",
      time: "5h ago",
      severity: "high",
    },
    {
      id: "ai-sec-3",
      title: "16 Dormant accounts detected with inactive tenure > 90d",
      desc: "Auto-deactivation workflows ready for security officer signoff.",
      time: "6h ago",
      severity: "medium",
    },
    {
      id: "ai-sec-4",
      title: "Patch released for OpenSSL CVE-2026-1254",
      desc: "Automated deployment scheduled for 23:00 maintenance window.",
      time: "1d ago",
      severity: "high",
    },
  ],
};

// Aliases for compatibility
(SECURITY_OVERVIEW_DATA as any).incidentDistribution = SECURITY_OVERVIEW_DATA.incidentBreakdown;
(SECURITY_OVERVIEW_DATA as any).riskMatrix = [
  { level: "Critical", values: [0, 0, 2, 3, 0] },
  { level: "High", values: [0, 2, 4, 3, 2] },
  { level: "Medium", values: [2, 5, 8, 6, 2] },
  { level: "Low", values: [12, 10, 14, 8, 6] },
  { level: "Very Low", values: [24, 18, 12, 4, 1] },
];
(SECURITY_OVERVIEW_DATA as any).complianceFrameworks = [
  { name: "ISO 27001 ISMS", score: 97.4 },
  { name: "ISO/SAE 21434 (Auto)", score: 94.6 },
  { name: "IEC 62443 (OT/IoT)", score: 92.8 },
  { name: "DPDP / GDPR Privacy", score: 96.2 },
];
(SECURITY_OVERVIEW_DATA as any).facilities = [
  { name: "Corporate Office", status: "Secure", cameras: 16, guards: 4 },
  { name: "Development Centre", status: "Secure", cameras: 20, guards: 4 },
  { name: "Manufacturing Facility", status: "Attention", cameras: 28, guards: 8 },
  { name: "R&D Laboratory", status: "Secure", cameras: 12, guards: 3 },
  { name: "Warehouse", status: "Secure", cameras: 10, guards: 3 },
  { name: "Charging Station Site", status: "Secure", cameras: 4, guards: 2 },
  { name: "Data Centre", status: "Secure", cameras: 4, guards: 2 },
  { name: "Remote Sites", status: "Monitor", cameras: 2, guards: 1 },
];
(SECURITY_OVERVIEW_DATA as any).aiIntelligence = [
  {
    id: "ai-sec-1",
    type: "critical",
    title: "Ransomware signature blocked on EVSE-02",
    description: "Zero-day encryption behavior suppressed at endpoint level. Machine quarantined.",
    timeAgo: "2h ago",
    severity: "high",
  },
  {
    id: "ai-sec-2",
    type: "warning",
    title: "Anomalous off-hours admin login from novel subnet",
    description: "Admin01 credential verified with step-up biometric challenge.",
    timeAgo: "5h ago",
    severity: "high",
  },
  {
    id: "ai-sec-3",
    type: "risk",
    title: "16 Dormant accounts detected with inactive tenure > 90d",
    description: "Auto-deactivation workflows ready for security officer signoff.",
    timeAgo: "6h ago",
    severity: "medium",
  },
  {
    id: "ai-sec-4",
    type: "info",
    title: "Patch released for OpenSSL CVE-2026-1254",
    description: "Automated deployment scheduled for 23:00 maintenance window.",
    timeAgo: "1d ago",
    severity: "medium",
  },
];
