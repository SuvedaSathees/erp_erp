import { queryOptions } from "@tanstack/react-query";

export type QualityOverviewData = {
  firstPassYield: number;
  targetFpy: number;
  defectPpm: number;
  ppmImprovement: number;
  iqcClearance: number;
  lotsTested: number;
  openNcrs: number;
  ncrsClosedThisWeek: number;
  capaResolutionRate: number;
  capasClosedOnTime: number;
  auditComplianceIndex: number;
  majorNcCount: number;
  monthlyQualityTrend: Array<{
    month: string;
    targetFpy: number;
    actualFpy: number;
    defectPpm: number;
  }>;
  lifecycleStages: Array<{
    step: string;
    title: string;
    path: string;
    badge: string;
    desc: string;
  }>;
  stageBreakdown: Array<{
    stage: string;
    targetYield: number;
    actualYield: number;
    status: "Normal" | "Attention" | "Optimal";
  }>;
  recentIncidents: Array<{
    id: string;
    title: string;
    severity: "Critical" | "Major" | "Minor";
    stage: string;
    containment: string;
    owner: string;
    status: "Open" | "Under Investigation" | "MRB Review" | "Containment Active";
  }>;
  aiInsights: string[];
};

export const MOCK_QUALITY_OVERVIEW: QualityOverviewData = {
  firstPassYield: 94.6,
  targetFpy: 92.0,
  defectPpm: 24,
  ppmImprovement: 14,
  iqcClearance: 97.4,
  lotsTested: 184,
  openNcrs: 7,
  ncrsClosedThisWeek: 3,
  capaResolutionRate: 92.8,
  capasClosedOnTime: 14,
  auditComplianceIndex: 98.2,
  majorNcCount: 0,
  monthlyQualityTrend: [
    { month: "Nov '25", targetFpy: 92.0, actualFpy: 91.8, defectPpm: 38 },
    { month: "Dec '25", targetFpy: 92.0, actualFpy: 92.4, defectPpm: 32 },
    { month: "Jan '26", targetFpy: 92.0, actualFpy: 93.1, defectPpm: 28 },
    { month: "Feb '26", targetFpy: 92.0, actualFpy: 92.8, defectPpm: 29 },
    { month: "Mar '26", targetFpy: 92.0, actualFpy: 94.2, defectPpm: 25 },
    { month: "Apr '26", targetFpy: 92.0, actualFpy: 94.6, defectPpm: 24 },
  ],
  lifecycleStages: [
    { step: "01", title: "APQP Planning", path: "/management/quality-management/quality-planning", badge: "12 Projects", desc: "Gate 1 to 5 control" },
    { step: "02", title: "Incoming IQC", path: "/management/quality-management/incoming-inspection", badge: "184 Lots Cleared", desc: "AQL sampling & CoA" },
    { step: "03", title: "In-Process IPQC", path: "/management/quality-management/in-process-inspection", badge: "6 Active Lines", desc: "Cp/Cpk & SPC charts" },
    { step: "04", title: "Final FQC", path: "/management/quality-management/final-inspection", badge: "340 Units Shipped", desc: "100% Hi-Pot & CoC" },
    { step: "05", title: "NCR Control", path: "/management/quality-management/ncr-management", badge: "7 Open Items", desc: "MRB disposition log" },
    { step: "06", title: "8D CAPA", path: "/management/quality-management/capa", badge: "92.8% On-Time", desc: "Root cause elimination" },
    { step: "07", title: "RCA Diagnostics", path: "/management/quality-management/root-cause-analysis", badge: "Ishikawa & 5-Why", desc: "Failure mode deep dive" },
    { step: "08", title: "Audit Mgmt", path: "/management/quality-management/audit-management", badge: "IATF 16949 Ready", desc: "Surveillance audits" },
    { step: "09", title: "Calibration", path: "/management/quality-management/calibration", badge: "98.8% In-Tolerance", desc: "NABL master standards" },
  ],
  stageBreakdown: [
    { stage: "Incoming Receipt (IQC)", targetYield: 98.0, actualYield: 98.4, status: "Optimal" },
    { stage: "SMT Line Process (IPQC)", targetYield: 95.0, actualYield: 96.2, status: "Normal" },
    { stage: "Battery & Wire Harness", targetYield: 94.0, actualYield: 94.8, status: "Normal" },
    { stage: "Final Assembly (FQC)", targetYield: 96.5, actualYield: 97.1, status: "Optimal" },
    { stage: "Pre-Dispatch Audit", targetYield: 99.0, actualYield: 99.2, status: "Optimal" },
  ],
  recentIncidents: [
    {
      id: "NCR-2026-0042",
      title: "IGBT Gate Driver Solder Bridging in Inverter Sub-assembly",
      severity: "Critical",
      stage: "In-Process IPQC",
      containment: "Line 2 quarantined; 120 PCBAs routed to optical rework station",
      owner: "Devi Prasad (Line Lead)",
      status: "Containment Active",
    },
    {
      id: "NCR-2026-0039",
      title: "Supplier Terminal Lug Plating Flaking (Batch LOT-0914)",
      severity: "Major",
      stage: "Incoming IQC",
      containment: "Return to Vendor (RTV); supplier quality debit note raised",
      owner: "Ananya Rao (IQC Lead)",
      status: "MRB Review",
    },
    {
      id: "NCR-2026-0036",
      title: "DC Fast Charger IP67 Seal Compression Variance",
      severity: "Major",
      stage: "Final FQC",
      containment: "Gasket fixture re-calibrated; torque sequence verified",
      owner: "Vikram Mehta (QMS Mgr)",
      status: "Under Investigation",
    },
    {
      id: "NCR-2026-0031",
      title: "CAN Transceiver Thermal Pad Misalignment",
      severity: "Minor",
      stage: "SMT Line IPQC",
      containment: "SMT nozzle repositioned; vision inspection tolerance tightened",
      owner: "Karthik Nair (SMT Lead)",
      status: "Open",
    },
  ],
  aiInsights: [
    "Predictive Defect Prevention: SMT Reflow Zone 4 temperature drift correlates with 82% of solder bridge anomalies. Adjust profile by -2.4°C to prevent bridge risks.",
    "Supplier Risk Alert: Copper Busbar Batch B-4091 exhibits 3.2% conductivity variation. Recommend 100% incoming eddy-current testing before production release.",
    "Calibration Proactive Maintenance: Fluke 8846A Precision Multi-Meter is due for NABL recalibration in 4 days. Schedule equipment handover to prevent line audit flags.",
  ],
};

export const qualityOverviewOptions = queryOptions({
  queryKey: ["quality-overview"],
  queryFn: async (): Promise<QualityOverviewData> => {
    return MOCK_QUALITY_OVERVIEW;
  },
  staleTime: 60_000,
});
