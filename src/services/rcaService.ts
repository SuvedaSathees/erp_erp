import { RcaRecord } from "./rcaTypes";

export const INITIAL_RCA_RECORD: RcaRecord = {
  rcaId: "rca-rec-2026-0012",
  rcaNumber: "RCA-2026-0012",
  title: "Wave Solder Flux Viscosity & Solder Bridging Root Cause Investigation",
  rcaDate: "05-Sep-2026",
  targetDate: "15-Sep-2026",
  rcaType: "Process Failure",
  rcaSource: "Non-Conformance Report (NCR)",
  sourceReference: "NCR-2026-0089",
  methodology: "5-Why + Fishbone (Ishikawa)",
  leadInvestigator: "Marcus Chen",
  teamMembers: ["Priya S", "Rajesh Kumar", "Suresh Menon", "Dr. Anita Desai"],
  status: "Root Cause Verified",
  workflowStatus: "Cause Verified",

  what: "Fine-pitch micro-solder bridging occurring between pins 14-16 on U2 IC microcontroller packages.",
  where: "SMT Wave Soldering Machine WS-02, Line 2 (Facility 1).",
  when: "Occurred during Batch Run #4820 across second shift operations (05-Sep-2026).",
  who: "Identified by AOI inspection operator; reported to Line Quality Supervisor.",
  why: "Solder bridges cause severe electrical short-circuits, resulting in immediate board test failures and scrap.",
  how: "Molten solder meniscus failed to peel cleanly from IC leads upon exiting turbulent solder wave.",
  howMuch: "Defect rate of 4.8% (14 out of 300 boards affected); baseline threshold is < 0.3%.",

  fiveWhyList: [
    {
      level: 1,
      whyQuestion: "Why did fine-pitch solder bridging occur between adjacent IC pins?",
      answer: "Molten solder failed to de-wet and drain cleanly between the pins as the PCB exited the solder wave.",
    },
    {
      level: 2,
      whyQuestion: "Why did the solder fail to drain and de-wet cleanly?",
      answer: "Flux activity on the bottom side of the circuit board was inadequate to reduce surface tension.",
    },
    {
      level: 3,
      whyQuestion: "Why was the flux activity and coverage inadequate?",
      answer: "The flux viscosity and specific gravity had increased significantly above the 0.825 target specification.",
    },
    {
      level: 4,
      whyQuestion: "Why did the flux viscosity increase above the operating window?",
      answer: "The automated solvent dosing mechanism failed to inject thinning alcohol solvent as flux solvent evaporated.",
    },
    {
      level: 5,
      whyQuestion: "Why did the automated dosing mechanism fail to inject thinning solvent?",
      answer: "Internal PTFE reciprocating piston seal in dosing pump WS-PUMP-04 suffered fatigue tear, causing lost dispensing pressure without triggering electrical fault alarm.",
      isRootCause: true,
    },
  ],

  fishbone: [
    {
      category: "Man",
      factors: [
        "Operators not trained on reading analog mechanical pump pressure gauge",
        "Shift handover did not mandate verification of solvent refill reservoir level",
      ],
    },
    {
      category: "Machine",
      factors: [
        "PTFE reciprocating piston seal fatigue wear on pump WS-PUMP-04",
        "Absence of electrical interlock sensor on mechanical pump pressure drop",
      ],
    },
    {
      category: "Material",
      factors: [
        "High volatility solvent in no-clean flux formulation accelerates evaporation",
        "Batch of flux within shelf-life but sensitive to ambient heat",
      ],
    },
    {
      category: "Method",
      factors: [
        "Manual hydrometer specific gravity test only scheduled once every 24 hours",
        "Lack of continuous real-time viscosity feedback loop in control plan",
      ],
    },
    {
      category: "Measurement",
      factors: [
        "Hydrometer resolution insufficient to detect initial viscosity creep (±0.01 error)",
        "No digital trend recording for specific gravity readings",
      ],
    },
    {
      category: "Environment",
      factors: [
        "Wave soldering cell ambient temperature spiked to 31.8°C during afternoon shift",
        "Exhaust hood airflow variation increasing solvent evaporation rate",
      ],
    },
  ],

  immediateCause:
    "Inadequate flux de-wetting on PCB leads caused by elevated flux viscosity during wave contact.",
  contributingCauses: [
    "High ambient room temperature (31.8°C) accelerating solvent evaporation rate.",
    "24-hour manual hydrometer testing interval allowed viscosity drift to go undetected for hours.",
    "No electrical interlock alarm to detect mechanical pressure failure on dosing pump.",
  ],
  rootCause:
    "Fatigue failure and mechanical tearing of the internal PTFE reciprocating seal in automated flux dosing pump WS-PUMP-04, preventing corrective solvent injection and driving flux specific gravity out of specification.",
  verificationEvidence:
    "Validation test run conducted after installing replacement PTFE seal kit and in-line optical density sensor. 1,200 consecutive boards produced with 0 solder bridges (defect rate 0.00%).",
  verificationStatus: "Verified",

  linkedNcrId: "NCR-2026-0089",
  linkedCapaId: "CAPA-2026-0012",

  aiInsights: [
    {
      id: "ai-rca-1",
      text: "5-Why path directly isolates mechanical pump seal fatigue as the physical failure mechanism.",
      type: "success",
    },
    {
      id: "ai-rca-2",
      text: "Fishbone analysis highlights need for continuous sensor feedback to eliminate 24-hour blind spot.",
      type: "warning",
    },
    {
      id: "ai-rca-3",
      text: "Verification trial with replaced seal confirmed 100% resolution across 1,200 boards.",
      type: "success",
    },
    {
      id: "ai-rca-4",
      text: "Systemic risk: Check other 3 wave soldering lines for PTFE pump seal preventive replacement.",
      type: "info",
    },
  ],
};
