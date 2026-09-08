import { CapaRecord } from "./capaTypes";

export const INITIAL_CAPA_RECORD: CapaRecord = {
  capaId: "capa-rec-2026-0012",
  capaNumber: "CAPA-2026-0012",
  title: "SMT Wave-Soldering Bridging & Solder Ball Defect Prevention",
  capaDate: "05-Sep-2026",
  targetClosureDate: "25-Sep-2026",
  capaType: "Corrective + Preventive",
  source: "Non-Conformance Report (NCR)",
  sourceReference: "NCR-2026-0089",
  severity: "Major",
  owner: "Marcus Chen",
  department: "Quality Assurance & Manufacturing",
  status: "Action Implementation",
  workflowStatus: "Active Execution",

  productName: "Power Inverter PCB Assembly 400W",
  partNumber: "PCB-PWR-400W",
  productionLine: "SMT Assembly Line 2",
  defectDescription:
    "Repeated micro-bridging and loose solder balls detected between fine-pitch IC pins post wave soldering. Defect rate spiked to 4.8% during high-volume production runs.",
  defectRate: "4.8% (Target < 0.5%)",

  severityScore: 6,
  occurrenceScore: 6,
  detectionScore: 5,
  initialRpn: 180,
  residualRpn: 36,
  rpnReductionPercent: 80,

  rootCauseSummary:
    "Flux viscosity degradation caused by automated dosing pump seal wear, causing uneven flux deposition prior to wave contact. Verified via Root Cause Analysis RCA-2026-0012.",
  linkedRcaId: "RCA-2026-0012",

  actions: [
    {
      id: "act-1",
      actionType: "Containment",
      description: "Purge flux reservoir, flush supply lines, and conduct 100% optical inspection on all 300 quarantined units.",
      assignedTo: "Kavita Rao",
      department: "Production Operations",
      targetDate: "06-Sep-2026",
      completionDate: "06-Sep-2026",
      status: "Verified",
      evidenceNote: "Quarantine traveler signed off; 14 reworked units re-inspected and cleared.",
    },
    {
      id: "act-2",
      actionType: "Corrective Action",
      description: "Replace worn PTFE dosing pump seal assembly and calibrate micro-flow dispensing rates.",
      assignedTo: "Rajesh Kumar",
      department: "Maintenance Engineering",
      targetDate: "10-Sep-2026",
      completionDate: "08-Sep-2026",
      status: "Completed",
      evidenceNote: "Maintenance work order MWO-2026-0812 completed; pump delivery tolerance ±1.5%.",
    },
    {
      id: "act-3",
      actionType: "Preventive Action",
      description: "Install continuous in-line optical flux density sensor with automated ERP alarms on threshold drift.",
      assignedTo: "Marcus Chen",
      department: "Quality Engineering",
      targetDate: "18-Sep-2026",
      status: "In Progress",
      evidenceNote: "Sensor procurement PO PO-2026-9901 issued; installation scheduled for shift downtime.",
    },
    {
      id: "act-4",
      actionType: "Preventive Action",
      description: "Update SMT Control Plan (CP-SMT-004) and Standard Operating Procedure (SOP-WAV-012) for shift titration.",
      assignedTo: "Dr. Anita Desai",
      department: "Quality Assurance",
      targetDate: "20-Sep-2026",
      status: "In Progress",
      evidenceNote: "Draft SOP circulating for engineering change order (ECO) approval.",
    },
    {
      id: "act-5",
      actionType: "Effectiveness Verification",
      description: "Monitor 5,000 consecutive PCB assemblies across 30 operational days; verify zero repetitive solder bridging.",
      assignedTo: "Marcus Chen",
      department: "Quality Assurance",
      targetDate: "25-Sep-2026",
      status: "Open",
      evidenceNote: "Run 1 (1,200 units): 0 solder bridging defects recorded at AOI station.",
    },
  ],

  effectivenessCriteria:
    "Defect rate below 0.3% over 30 days or 5,000 units with zero customer returns or repeat NCRs.",
  verificationMethod:
    "Automated Optical Inspection (AOI) defect logging and weekly SPC X-bar chart reviews.",
  verificationResults:
    "Initial 1,200 units inspected show 0.08% defect rate, comfortably below 0.3% acceptance ceiling.",
  isEffective: true,

  aiInsights: [
    {
      id: "ai-capa-1",
      text: "Calculated RPN dropped from 180 to 36 post pump seal replacement (80% risk reduction).",
      type: "success",
    },
    {
      id: "ai-capa-2",
      text: "Action #3 (In-line density sensor) is critical to prevent recurrence across parallel Line 3.",
      type: "warning",
    },
    {
      id: "ai-capa-3",
      text: "Linked RCA-2026-0012 5-Why analysis fully validates mechanical seal degradation as core culprit.",
      type: "info",
    },
    {
      id: "ai-capa-4",
      text: "Recommendation: Apply same preventive maintenance schedule to all wave soldering machines.",
      type: "success",
    },
  ],
};
