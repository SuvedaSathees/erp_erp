import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding dedicated manufacturing models (Jig, FactoryLayout, CapacityPlanning, WorkInstruction, SOP)...");

  // =============================================
  // 1. Jig Development
  // =============================================
  const jig = await prisma.jigDevelopment.upsert({
    where: { jigId: "JD-2024-0067" },
    update: {},
    create: {
      jigId: "JD-2024-0067",
      formCode: "JDF-2024-25",
      projectName: "EV Charger Drilling Jig",
      jigVersion: "v1.2.0",
      workflowStatus: "InProgress",
      stage: 6,
      engineerName: "Rahul Sharma",
      engineerEmail: "rahul.sharma@magnertia.com",
      engineerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      linkedProductId: "PRD-EV-7KW",
      linkedProductName: "Smart EV Charger AC 7kW",
      linkedProcessId: "proc-cnc-0012",
      linkedProcessName: "CNC Drilling - Top Cover",
      jigNumber: "JIG-DRL-ASSY-A-001",
      manufacturingPlant: "Magnertia Plant - 01",
      productionLine: "EV Charger Assembly Line - A",
      nextReviewDate: new Date("2024-06-25"),
      jigName: "EV Charger Top Cover Drilling Jig",
      jigCategory: "DrillingJig",
      productFamily: "EV Chargers",
      workstation: "WS-12: Drilling Station",
      jigPurpose: "To guide drill operations on top cover for precise hole positioning with repeatability and accuracy.",
      developmentStage: "Trial Validation",
      priority: "High",
      riskLevel: "Low",
      healthIndex: 94,
      cadModel: "ev_drl_jig_3d.step",
      assemblyDrawing: "ev_drl_jig_assembly.pdf",
      detailDrawings: "ev_drl_jig_details.pdf",
      bom: "ev_drl_jig_bom.xlsx",
      locatorDesign: "locator_design.pdf",
      clampDesign: "clamp_design.pdf",
      materialSpecification: "aisi_1045_spec.pdf",
      surfaceFinish: "Ground N5",
      designReviewScore: 88,
      manufacturingProcess: "CNC Milling & Drilling",
      cncProgram: "ev_drl_jig.nc",
      machineAllocation: "CNC VMC 1, CNC VMC 2",
      materialRequirements: "AISI 1045, EN24",
      heatTreatment: true,
      surfaceTreatment: "Black Oxide",
      manufacturingLeadTime: 15,
      manufacturingReadinessScore: 85,
      trialJig: true,
      dimensionalInspection: true,
      positioningAccuracy: 0.025,
      repeatabilityTest: 0.008,
      processCapabilityCp: 1.67,
      processCapabilityCpk: 1.52,
      safetyValidation: true,
      validationRemarks: "All parameters are within tolerance. Jig performance is acceptable.",
      validationScore: 87,
      installationCompleted: true,
      processIntegration: true,
      operatorTraining: true,
      maintenancePlan: "maintenance_plan.pdf",
      calibrationSchedule: "calibration_schedule.pdf",
      productionApproval: true,
      commissioningScore: 86,
      jigLifeCycles: 500000,
      productionCycles: 135000,
      toolWearPercentage: 12,
      downtimeHoursPerMonth: 2.20,
      mtbfHours: 720,
      mttrHours: 1.15,
      oeeContribution: 13.2,
      performanceScore: 84,
      aiEngineeringScore: 89,
      overallReadinessScore: 87,
      recommendation: "Approve for Production",
    },
  });

  await prisma.jigAiAssessment.upsert({
    where: { jigId: jig.id },
    update: {},
    create: {
      jigId: jig.id,
      feasibilityIndex: 88,
      manufacturabilityIndex: 85,
      toleranceStackRisk: "Low Risk",
      costOptimizationNotes: "Material cost optimized by 7%.",
      complianceCheckPassed: true,
      toolPathOptimization: "Drill path optimized for reduced cycle time by 6%.",
      wearPrediction: "Bush wear is normal. Replace after 330,000 cycles.",
      failurePrediction: "Low risk. Monitor clamp mechanism.",
      maintenanceRecommendation: "Next preventive maintenance in 28 days.",
      costOptimizationPercentage: 7,
      aiEngineeringScore: 89,
    },
  });

  const jigAttachments = [
    { fileName: "ev_drl_jig_3d.step", fileType: "cad", documentType: "3D CAD Model", uploadedBy: "Rahul Sharma", fileSize: "12.4 MB" },
    { fileName: "ev_drl_jig_assembly.pdf", fileType: "pdf", documentType: "Assembly Drawing", uploadedBy: "Rahul Sharma", fileSize: "2.6 MB" },
    { fileName: "inspection_report.pdf", fileType: "pdf", documentType: "Inspection Report", uploadedBy: "Amit Patel", fileSize: "1.7 MB" },
    { fileName: "validation_report.pdf", fileType: "pdf", documentType: "Trial Validation Report", uploadedBy: "Vikram Singh", fileSize: "3.1 MB" },
    { fileName: "cnc_program.nc", fileType: "cnc", documentType: "CNC Program", uploadedBy: "Naresh Verma", fileSize: "1.2 MB" },
    { fileName: "calibration_record.pdf", fileType: "pdf", documentType: "Calibration Record", uploadedBy: "Neha Reddy", fileSize: "1.5 MB" },
    { fileName: "maintenance_plan.pdf", fileType: "pdf", documentType: "Maintenance Schedule", uploadedBy: "Neha Reddy", fileSize: "2.3 MB" },
    { fileName: "ai_assessment_report.pdf", fileType: "pdf", documentType: "AI Feasibility Report", uploadedBy: "AI Assistant", fileSize: "2.4 MB" },
  ];
  for (const att of jigAttachments) {
    await prisma.jigAttachment.create({ data: { jigId: jig.id, ...att, version: "v1.2", status: "Active" } });
  }

  const jigApprovals = [
    { role: "Jig Design Engineer", person: "Rahul Sharma", decision: "Approved", status: "Approved", comments: "Design verified", date: new Date("2024-06-18") },
    { role: "Manufacturing Engineer", person: "Naresh Verma", decision: "Approved", status: "Approved", comments: "Manufacturing plan ok", date: new Date("2024-06-18") },
    { role: "Production Engineer", person: "Vikram Singh", decision: "Approved", status: "Approved", comments: "Line integration ok", date: new Date("2024-06-19") },
    { role: "Quality Engineer", person: "Amit Patel", decision: "Approved", status: "Approved", comments: "All inspections ok", date: new Date("2024-06-19") },
    { role: "Maintenance Engineer", person: "Neha Reddy", decision: "Approved", status: "Approved", comments: "Maintenance plan ready", date: new Date("2024-06-20") },
    { role: "Plant Head", person: "Arun Kumar", decision: "Pending", status: "Pending", comments: "Awaiting review" },
    { role: "COO", person: "Sankaran R.", decision: "Pending", status: "Pending", comments: "Final approval pending" },
    { role: "CEO", person: "Sankaran R.", decision: "Pending", status: "Pending", comments: "Final approval pending" },
  ];
  for (const a of jigApprovals) {
    await prisma.jigApprovalStep.create({ data: { jigId: jig.id, ...a } });
  }

  const jigActivities = [
    { user: "Rahul Sharma", action: "Created Jig Development Project", description: "Initial creation of EV Charger Drilling Jig (JD-2024-0067)." },
    { user: "Rahul Sharma", action: "Uploaded CAD Model", description: "Uploaded 3D CAD model ev_drl_jig_3d.step (v1.2)." },
    { user: "Vikram Singh", action: "Completed Trial Validation", description: "Validation score recorded as 87/100." },
    { user: "Rahul Sharma", action: "Submitted for Review", description: "Record submitted to Review & Approval workflow.", prevStatus: "In Progress", newStatus: "Under Review" },
  ];
  for (const act of jigActivities) {
    await prisma.jigActivityLog.create({ data: { jigId: jig.id, ...act } });
  }
  console.log("  ✓ JigDevelopment seeded");

  // =============================================
  // 2. Factory Layout
  // =============================================
  const factory = await prisma.factoryLayout.upsert({
    where: { layoutId: "FLD-2024-0012" },
    update: {},
    create: {
      layoutId: "FLD-2024-0012",
      formCode: "FLF-2024-25",
      projectName: "EV Charger Manufacturing Plant Layout",
      layoutVersion: "v1.2.0",
      workflowStatus: "In Progress",
      stage: 3,
      plantName: "Magnertia Plant - 01",
      facilityLocation: "Pune, Maharashtra, India",
      engineerName: "Rahul Sharma",
      totalLandArea: 120000,
      builtUpArea: 45000,
      productionCapacity: 250000,
      nextReviewDate: new Date("2024-06-25"),
      factoryName: "Magnertia EV Plant",
      plantType: "Greenfield Factory",
      industrySegment: "Electric Vehicles",
      factoryObjective: "Design a world-class EV charger manufacturing facility with lean flow, high automation, and future expansion capability.",
      developmentStage: "Detailed Layout",
      priority: "High",
      layoutPlanningScore: 88,
      masterLayoutDrawing: "master_layout_v1.2.dwg",
      shopFloorLayout: "shopfloor_layout_v1.2.dwg",
      productionLineLayout: "line_layout_v1.2.dwg",
      utilityLayout: "utility_layout_v1.2.dwg",
      materialFlowDiagram: "material_flow_v1.2.pdf",
      equipmentLayout: "equipment_layout_v1.2.dwg",
      warehouseLayout: "warehouse_layout_v1.2.dwg",
      officeLayout: "office_layout_v1.2.dwg",
      infrastructureScore: 86,
      productionAreas: "Machining,Assembly,Testing,Packing",
      assemblyAreas: "SMT,Panel Assembly,Final Assembly",
      warehouseCapacityM2: 8500,
      loadingUnloadingBays: 6,
      utilitySystems: "Electrical,Compressed Air,HVAC",
      maintenanceWorkshop: true,
      logisticsScore: 85,
      rawMaterialFlow: "raw_material_flow_v1.2.pdf",
      wipFlow: "wip_flow_v1.2.pdf",
      finishedGoodsFlow: "fg_flow_v1.2.pdf",
      forkliftRoutes: "forklift_routes_v1.2.pdf",
      agvAmrRoutes: "agv_routes_v1.2.pdf",
      materialHandlingEq: "Forklift,AGV,Conveyor,Overhead Crane",
      utilitySafetyScore: 88,
      electricalLayout: "electrical_layout_v1.2.dwg",
      compressedAirLayout: "cir_layout_v1.2.dwg",
      waterLayout: "water_layout_v1.2.dwg",
      fireSafetyLayout: "fire_safety_layout_v1.2.pdf",
      emergencyExitPlan: "emergency_exit_v1.2.pdf",
      ehsCompliance: true,
      factoryEfficiencyScore: 87,
      spaceUtilization: 78,
      materialTravelDistance: 1.62,
      throughputUnitsPerYear: 250000,
      warehouseEfficiency: 92,
      energyEfficiency: 86,
      equipmentAccessibility: 90,
      aiFactoryScore: 89,
      overallReadinessScore: 87,
      recommendation: "Approve Factory Layout",
    },
  });

  await prisma.factoryAiAssessment.upsert({
    where: { layoutId: factory.id },
    update: {},
    create: {
      layoutId: factory.id,
      layoutOptimization: "AI suggests relocating SMT line to reduce material travel by 12%.",
      bottleneckPrediction: "Panel assembly zone may become a bottleneck at 85% capacity.",
      materialFlowOptimization: "AI optimizes AGV routes and storage locations for better flow.",
      capacityExpansionRec: "Add 2 additional assembly cells in Phase 2 expansion.",
      safetyImprovementRec: "AI suggests additional fire exits in warehouse zone.",
      aiFactoryScore: 89,
    },
  });

  const factoryAttachments = [
    { fileName: "factory_master_plan_v1.2.pdf", fileType: "pdf", documentType: "Master Layout", uploadedBy: "Rahul Sharma", fileSize: "3.2 MB" },
    { fileName: "digital_twin_model_v1.2.zip", fileType: "zip", documentType: "Digital Twin Model", uploadedBy: "Rahul Sharma", fileSize: "65.6 MB" },
    { fileName: "utility_drawings_v1.2.zip", fileType: "zip", documentType: "Utility Layout", uploadedBy: "Naresh Verma", fileSize: "24.1 MB" },
    { fileName: "ehs_reports_v1.2.pdf", fileType: "pdf", documentType: "Safety Report", uploadedBy: "Neha Reddy", fileSize: "2.8 MB" },
    { fileName: "material_flow_simulation.mp4", fileType: "mp4", documentType: "Simulation Video", uploadedBy: "Vikram Singh", fileSize: "125.8 MB" },
  ];
  for (const att of factoryAttachments) {
    await prisma.factoryAttachment.create({ data: { layoutId: factory.id, ...att, version: "v1.2", status: "Active" } });
  }

  const factoryApprovals = [
    { role: "Factory Layout Engineer", person: "Rahul Sharma", decision: "Approved", status: "Approved", comments: "Layout completed", date: new Date("2024-06-18") },
    { role: "Manufacturing Engineer", person: "Naresh Verma", decision: "Approved", status: "Approved", comments: "Flow is optimized", date: new Date("2024-06-18") },
    { role: "Production Engineer", person: "Vikram Singh", decision: "Approved", status: "Approved", comments: "Line integration ok", date: new Date("2024-06-19") },
    { role: "Industrial Engineer", person: "Amit Patel", decision: "Approved", status: "Approved", comments: "Lean layout achieved", date: new Date("2024-06-19") },
    { role: "Facility Manager", person: "Neha Reddy", decision: "Pending", status: "Pending", comments: "Utility plan under review" },
    { role: "EHS Manager", person: "Arun Kumar", decision: "Pending", status: "Pending", comments: "Safety plan validation" },
    { role: "Plant Head", person: "Sankaran R.", decision: "Pending", status: "Pending", comments: "Executive review" },
    { role: "COO", person: "Sankaran R.", decision: "Pending", status: "Pending", comments: "Final approval pending" },
    { role: "CEO", person: "Sankaran R.", decision: "Pending", status: "Pending", comments: "Final approval pending" },
  ];
  for (const a of factoryApprovals) {
    await prisma.factoryApprovalStep.create({ data: { layoutId: factory.id, ...a } });
  }

  const factoryActivities = [
    { user: "Rahul Sharma", action: "Created Factory Layout Project", description: "Initial creation of EV Charger Manufacturing Plant Layout (FLD-2024-0012)." },
    { user: "Rahul Sharma", action: "Uploaded Master Drawing", description: "Uploaded master_layout_v1.2.dwg." },
    { user: "Vikram Singh", action: "Completed Digital Twin Simulation", description: "Material flow simulation run with 98% efficiency rating." },
    { user: "Rahul Sharma", action: "Submitted for Review", description: "Factory Layout submitted for review board approval.", prevStatus: "In Progress", newStatus: "Under Review" },
  ];
  for (const act of factoryActivities) {
    await prisma.factoryActivityLog.create({ data: { layoutId: factory.id, ...act } });
  }

  const factorySimulations = [
    { simulationType: "Material Flow Simulation", status: "Completed", resultSummary: "Material travel distance reduced by 23%. No AGV congestion detected.", passed: true },
    { simulationType: "Throughput Capacity Simulation", status: "Completed", resultSummary: "Target 250,000 units/year throughput achievable at 82% line loading.", passed: true },
    { simulationType: "Emergency Evacuation Simulation", status: "Completed", resultSummary: "Full shopfloor evacuation compliant within 2.5 minutes.", passed: true },
  ];
  for (const sim of factorySimulations) {
    await prisma.factorySimulation.create({ data: { layoutId: factory.id, ...sim } });
  }
  console.log("  ✓ FactoryLayout seeded");

  // =============================================
  // 3. Capacity Planning
  // =============================================
  const capacity = await prisma.capacityPlanning.upsert({
    where: { planningId: "CP-2024-00027" },
    update: {},
    create: {
      planningId: "CP-2024-00027",
      formCode: "CPF-2024-25",
      projectName: "EV Charger Production Capacity Plan",
      planningVersion: "v1.2.0",
      workflowStatus: "In Progress",
      stage: 2,
      plantName: "Magnertia Plant - 01",
      businessUnit: "EV Charger Division",
      engineerName: "Rahul Sharma",
      planningPeriod: "Jul 2024 - Jun 2025",
      developmentStage: "Capacity Assessment",
      nextReviewDate: new Date("2024-06-25"),
      demandForecastUnits: 120000,
      plannedProductionUnits: 118000,
      capacityUtilization: 78,
      oeePercentage: 82,
      bottleneckCount: 2,
      assessmentScore: 88,
      resourceScore: 86,
      bottleneckScore: 85,
      simulationScore: 86,
      performanceScore: 84,
      aiCapacityScore: 88,
      overallReadinessScore: 87,
      recommendation: "Approve Capacity Plan",
    },
  });

  await prisma.capacityAiAssessment.upsert({
    where: { planningId: capacity.id },
    update: {},
    create: {
      planningId: capacity.id,
      demandForecastInsight: "Q3 demand will increase by 18% based on market trend vectors.",
      capacityOptimization: "Increase Line 3 shifts for +12% capacity headroom.",
      bottleneckPrediction: "WS-40 may become critical in Aug 2024 under peak load.",
      expansionRecommendation: "Add 1 Testing Station to reduce testing bottleneck.",
      workforceOptimization: "Reallocate 15 operators to Line 3 during shift 2.",
      aiCapacityScore: 88,
    },
  });

  const capacityBottlenecks = [
    { workstation: "WS-40", equipment: "Coil Winding Machine", constraint: "Machine Capacity", impact: "High", rootCause: "High cycle time during winding phase", improvementActions: "Add 1 parallel automated winder", estimatedGain: "+15% line throughput" },
    { workstation: "WS-70", equipment: "Testing Station", constraint: "Labour Capacity", impact: "High", rootCause: "Manual high-voltage test sequence", improvementActions: "Automate test rig software", estimatedGain: "+12% testing capacity" },
    { workstation: "WS-20", equipment: "PCB Assembly", constraint: "Machine Capacity", impact: "Medium", rootCause: "SMT feeder reloading delay", improvementActions: "Implement dual-feeder trolley", estimatedGain: "+8% SMT speed" },
  ];
  for (const b of capacityBottlenecks) {
    await prisma.bottleneckAnalysis.create({ data: { planningId: capacity.id, ...b } });
  }

  const capacityAttachments = [
    { fileName: "capacity_calculation_sheet.xlsx", fileType: "xlsx", documentType: "Calculation Sheet", uploadedBy: "Rahul Sharma", fileSize: "120 KB" },
    { fileName: "production_forecast.xlsx", fileType: "xlsx", documentType: "Demand Forecast", uploadedBy: "Rahul Sharma", fileSize: "85 KB" },
    { fileName: "simulation_report.pdf", fileType: "pdf", documentType: "Simulation Report", uploadedBy: "Vikram Singh", fileSize: "2.4 MB" },
    { fileName: "bottleneck_analysis.pdf", fileType: "pdf", documentType: "Bottleneck Analysis", uploadedBy: "Amit Patel", fileSize: "1.8 MB" },
    { fileName: "resource_plan.xlsx", fileType: "xlsx", documentType: "Resource Plan", uploadedBy: "Rahul Sharma", fileSize: "110 KB" },
  ];
  for (const att of capacityAttachments) {
    await prisma.capacityAttachment.create({ data: { planningId: capacity.id, ...att, version: "v1.0", status: "Active" } });
  }

  const capacityApprovals = [
    { role: "Capacity Planning Engineer", person: "Rahul Sharma", decision: "Approved", status: "Approved", comments: "Plan prepared", date: new Date("2024-06-18") },
    { role: "Production Manager", person: "Naresh Verma", decision: "Approved", status: "Approved", comments: "Capacity feasible", date: new Date("2024-06-19") },
    { role: "Manufacturing Engineer", person: "Vikram Singh", decision: "Approved", status: "Approved", comments: "Machines available", date: new Date("2024-06-19") },
    { role: "Industrial Engineer", person: "Amit Patel", decision: "Approved", status: "Approved", comments: "Layout valid", date: new Date("2024-06-20") },
    { role: "Supply Chain Manager", person: "Priya Nair", decision: "Approved", status: "Approved", comments: "Material available", date: new Date("2024-06-20") },
    { role: "Plant Head", person: "Neha Reddy", decision: "Pending", status: "Pending", comments: "Under review" },
    { role: "COO", person: "Arun Kumar", decision: "Pending", status: "Pending", comments: "Awaiting review" },
    { role: "CEO", person: "Sankaran R.", decision: "Pending", status: "Pending", comments: "Awaiting approval" },
  ];
  for (const a of capacityApprovals) {
    await prisma.capacityApprovalStep.create({ data: { planningId: capacity.id, ...a } });
  }

  const capacityActivities = [
    { user: "Rahul Sharma", action: "Created Capacity Plan", description: "Initial creation of EV Charger Production Capacity Plan (CP-2024-00027)." },
    { user: "Rahul Sharma", action: "Updated Demand Forecast", description: "Updated demand forecast to 120,000 units for Jul 2024 - Jun 2025." },
    { user: "Vikram Singh", action: "Ran Digital Twin Capacity Simulation", description: "Peak Demand (Q3) scenario completed with score 86/100." },
    { user: "Rahul Sharma", action: "Submitted for Review", description: "Capacity plan submitted for executive review board.", prevStatus: "In Progress", newStatus: "Under Review" },
  ];
  for (const act of capacityActivities) {
    await prisma.capacityActivityLog.create({ data: { planningId: capacity.id, ...act } });
  }

  const capacitySimulations = [
    { scenarioName: "Peak Demand (Q3)", simulationScore: 86, expansionRequirement: "Recommended (+1 Testing Rig)", passed: true },
    { scenarioName: "Base Case (100% Demand)", simulationScore: 92, expansionRequirement: "None Required", passed: true },
  ];
  for (const sim of capacitySimulations) {
    await prisma.capacitySimulation.create({ data: { planningId: capacity.id, ...sim } });
  }
  console.log("  ✓ CapacityPlanning seeded");

  // =============================================
  // 4. Work Instruction
  // =============================================
  const wi = await prisma.workInstruction.upsert({
    where: { instructionId: "WI-2024-000256" },
    update: {},
    create: {
      instructionId: "WI-2024-000256",
      formCode: "WID-2024-25",
      title: "Assembly of AC Charging Control Unit",
      documentNumber: "WI-MAG-ACCU-001",
      revision: "2.0",
      workflowStatus: "In Review",
      stage: 2,
      effectiveDate: new Date("2024-06-20"),
      nextReviewDate: new Date("2025-06-20"),
      plantName: "Magnertia Plant - 01",
      department: "Manufacturing",
      processOwner: "Rahul Sharma",
      workstation: "WS-ACCU-01",
      productionLine: "Line-ACCU-01",
      productFamily: "AC Charger",
      productModel: "ACCU-7KW V1.0",
      processName: "Control Unit Assembly",
      operationNumber: "OP-20",
      operationDescription: "Assemble and test the AC Charging Control Unit including PCB installation, wiring, and enclosure assembly as per engineering specification.",
      instructionCategory: "Assembly",
      priority: "High",
      totalCycleTimeSec: 230,
      overallReadinessScore: 87,
      qualityScore: 85,
      safetyScore: 90,
      competencyScore: 84,
      aiDocumentationScore: 88,
      recommendation: "Approve Work Instruction",
    },
  });

  await prisma.workInstructionAiAssessment.upsert({
    where: { workInstructionId: wi.id },
    update: {},
    create: {
      workInstructionId: wi.id,
      instructionReview: "All assembly steps are clear, complete, and properly sequenced.",
      riskAssessment: "Low risk operation. Ensure ESD safety precautions during PCB placement.",
      processOptimization: "Use pre-assembled cable harness to reduce cycle time by 8%.",
      knowledgeGapAnalysis: "Add reference image for screw torque setting knob.",
      trainingRecommendation: "Refresher training recommended for 3 newly assigned operators.",
      aiDocumentationScore: 88,
    },
  });

  const wiSteps = [
    { stepNumber: 1, instruction: "Verify all components as per BOM.", visualReferenceUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80", keyPoints: "Check quantity and part number.", timeSeconds: 20, safetyNotes: "Wear ESD anti-static wristband", qualityChecks: "Match BOM revision v2.0", requiredTools: "Barcode Scanner", requiredMaterials: "ACCU Components Kit" },
    { stepNumber: 2, instruction: "Install PCB in bottom enclosure using M3 screws.", visualReferenceUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop&q=80", keyPoints: "Tighten screws with 0.8 Nm torque.", timeSeconds: 45, safetyNotes: "Avoid sharp enclosure edges", qualityChecks: "Check screw torque calibration", requiredTools: "Torque Screwdriver (0.5-2 Nm)", requiredMaterials: "PCB Assembly, M3 Screws" },
    { stepNumber: 3, instruction: "Connect input power wires to terminal block.", visualReferenceUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=300&auto=format&fit=crop&q=80", keyPoints: "Check wire color code.", timeSeconds: 30, safetyNotes: "Verify zero voltage de-energized state", qualityChecks: "Pull test wire connections (50N)", requiredTools: "Wire Cutter, Multimeter", requiredMaterials: "Power Cable Set" },
    { stepNumber: 4, instruction: "Connect signal cables to PCB connectors.", visualReferenceUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80", keyPoints: "Ensure locking mechanism is secure.", timeSeconds: 40, safetyNotes: "Prevent pin bending", qualityChecks: "Visual connector latch engage check", requiredTools: "Tweezers", requiredMaterials: "Signal Harness Assembly" },
    { stepNumber: 5, instruction: "Install top cover and tighten all screws.", visualReferenceUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&auto=format&fit=crop&q=80", keyPoints: "Uniform torque 0.8 Nm.", timeSeconds: 35, safetyNotes: "Ensure gasket alignment for IP54 rating", qualityChecks: "No wire pinching under cover", requiredTools: "Torque Screwdriver", requiredMaterials: "Top Enclosure Cover, Gasket" },
    { stepNumber: 6, instruction: "Perform functional test and verify LEDs.", visualReferenceUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&auto=format&fit=crop&q=80", keyPoints: "All LEDs should be ON.", timeSeconds: 60, safetyNotes: "Use high voltage insulated gloves during test", qualityChecks: "First-Off Inspection passed", requiredTools: "ATE Test Rig, Multimeter", requiredMaterials: "Test Certification Sticker" },
  ];
  for (const step of wiSteps) {
    await prisma.workInstructionStep.create({ data: { workInstructionId: wi.id, ...step } });
  }

  const wiAttachments = [
    { fileName: "SOP_Control_Unit_Assembly.pdf", fileType: "pdf", documentType: "SOP Document", uploadedBy: "Rahul Sharma", fileSize: "1.2 MB" },
    { fileName: "Assembly_Video.mp4", fileType: "mp4", documentType: "Instruction Video", uploadedBy: "Rahul Sharma", fileSize: "25.3 MB" },
    { fileName: "Process_Flow_Diagram.vsdx", fileType: "vsdx", documentType: "Process Diagram", uploadedBy: "Vikram Singh", fileSize: "850 KB" },
    { fileName: "Control_Plan_CP-ACCU-001.pdf", fileType: "pdf", documentType: "Control Plan", uploadedBy: "Neha Reddy", fileSize: "1.6 MB" },
    { fileName: "ACCU_Assembly_Drawings.pdf", fileType: "pdf", documentType: "CAD Drawings", uploadedBy: "Rahul Sharma", fileSize: "2.4 MB" },
    { fileName: "Training_Module.pdf", fileType: "pdf", documentType: "Training Guide", uploadedBy: "Priya Nair", fileSize: "3.2 MB" },
  ];
  for (const att of wiAttachments) {
    await prisma.workInstructionAttachment.create({ data: { workInstructionId: wi.id, ...att, version: "v2.0", status: "Active" } });
  }

  const wiApprovals = [
    { role: "Process Engineer", person: "Rahul Sharma", decision: "Approved", status: "Approved", comments: "Instructions created", date: new Date("2024-06-18") },
    { role: "Manufacturing Engineer", person: "Vikram Singh", decision: "Approved", status: "Approved", comments: "Process validated", date: new Date("2024-06-18") },
    { role: "Quality Manager", person: "Neha Reddy", decision: "Approved", status: "Approved", comments: "Quality criteria set", date: new Date("2024-06-19") },
    { role: "EHS Manager", person: "Arun Kumar", decision: "Approved", status: "Approved", comments: "Safety risks cleared", date: new Date("2024-06-19") },
    { role: "Training Manager", person: "Priya Nair", decision: "Approved", status: "Approved", comments: "Training content ready", date: new Date("2024-06-20") },
    { role: "Plant Head", person: "Sankaran R.", decision: "Pending", status: "Pending", comments: "Under review" },
    { role: "COO", person: "Sankaran R.", decision: "Pending", status: "Pending", comments: "Awaiting review" },
    { role: "CEO", person: "Sankaran R.", decision: "Pending", status: "Pending", comments: "Awaiting approval" },
  ];
  for (const a of wiApprovals) {
    await prisma.workInstructionApprovalStep.create({ data: { workInstructionId: wi.id, ...a } });
  }

  const wiActivities = [
    { user: "Rahul Sharma", action: "Created Work Instruction", description: "Initial authoring of Assembly of AC Charging Control Unit (WI-2024-000256)." },
    { user: "Rahul Sharma", action: "Added Assembly Steps", description: "Created 6 step-by-step instructions with visual reference images." },
    { user: "Neha Reddy", action: "Approved Quality Criteria", description: "Quality inspection points and acceptance criteria validated." },
    { user: "Rahul Sharma", action: "Submitted for Review", description: "Work instruction submitted for document control approval.", prevStatus: "Draft", newStatus: "Under Review" },
  ];
  for (const act of wiActivities) {
    await prisma.workInstructionActivityLog.create({ data: { workInstructionId: wi.id, ...act } });
  }
  console.log("  ✓ WorkInstruction seeded");

  // =============================================
  // 5. SOP Record
  // =============================================
  const sop = await prisma.sopRecord.upsert({
    where: { sopId: "SOP-2024-00123" },
    update: {},
    create: {
      sopId: "SOP-2024-00123",
      formCode: "SOPD-2024-25",
      title: "Manufacturing Process Control & Monitoring SOP",
      sopNumber: "SOP-MFG-001",
      revision: "2.0",
      workflowStatus: "In Review",
      stage: 2,
      effectiveDate: new Date("2024-07-01"),
      nextReviewDate: new Date("2025-06-30"),
      department: "Manufacturing",
      processOwner: "Rahul Sharma",
      sopCategory: "Manufacturing",
      businessFunction: "Manufacturing Operations",
      processName: "Production Process Control",
      processObjective: "Ensure standardized monitoring and control of manufacturing processes to achieve consistent quality, productivity and safety across production lines.",
      scope: "Applies to all production lines and related support functions within the manufacturing plant.",
      applicability: "All Operators, Technicians, Engineers and Supervisors involved in production operations.",
      triggerEvent: "Start of production shift / Process deviation / Equipment changeover / Quality alert.",
      expectedOutput: "Controlled and monitored production with quality output, safety compliance and data traceability.",
      priority: "High",
      totalDurationMins: 45,
      overallReadinessScore: 87,
      procedureReadinessScore: 85,
      complianceScore: 90,
      riskScore: 82,
      trainingScore: 88,
      aiDocumentationScore: 91,
      recommendation: "Publish & Release SOP",
    },
  });

  await prisma.sopAiAssessment.upsert({
    where: { sopRecordId: sop.id },
    update: {},
    create: {
      sopRecordId: sop.id,
      aiSopReview: "SOP is well-structured, comprehensive, and follows international manufacturing best practices.",
      aiComplianceAnalysis: "Fully meets ISO 9001:2015 and ISO 14001:2015 regulatory documentation standards.",
      aiProcessOptimization: "Suggest adding automated telemetry data capture step to improve shopfloor efficiency by 12%.",
      aiRiskPrediction: "Medium risk detected in manual data entry step. Recommend barcode verification.",
      aiRevisionRecommendation: "Recommended annual review schedule: Next review due in 12 months (30 Jun 2025).",
      aiDocumentationScore: 91,
    },
  });

  await prisma.sopComplianceRequirement.upsert({
    where: { sopRecordId: sop.id },
    update: {},
    create: {
      sopRecordId: sop.id,
      applicableStandards: "ISO 9001:2015, ISO 14001:2015, IATF 16949",
      regulatoryRequirements: "Factories Act, OSHA Compliance, BIS Standards",
      internalPolicies: "Quality Policy, EHS Policy, Cleanroom Protocol",
      auditRequirements: "Internal Audit, Customer Audit, Third-Party ISO Audit",
      complianceScore: 90,
    },
  });

  await prisma.sopRiskAssessment.upsert({
    where: { sopRecordId: sop.id },
    update: {},
    create: {
      sopRecordId: sop.id,
      riskLevel: "Medium",
      ehsRequirements: "PPE Required, Machine Guarding, Proper Ventilation, ESD Anti-Static Wristband",
      emergencyProcedure: "Machine Stop, First Aid, Building Evacuation Route 4",
      riskReadinessScore: 82,
    },
  });

  await prisma.sopTrainingRequirement.upsert({
    where: { sopRecordId: sop.id },
    update: {},
    create: {
      sopRecordId: sop.id,
      trainingRequired: true,
      targetAudience: "Operators, Technicians, Engineers & Supervisors",
      competencyRequirement: "Level 2 Certified Operator",
      trainingReadinessScore: 88,
    },
  });

  const sopSteps = [
    { stepNumber: 1, description: "Review production plan and work order.", responsibleRole: "Production Supervisor", durationMins: 5, requiredDocuments: "Work Order WO-2024-889", notes: "Verify target quantities and shift schedule", safetyCheck: "Standard ESD attire", qualityCheck: "Work order sign-off" },
    { stepNumber: 2, description: "Verify material availability and quality.", responsibleRole: "Store In-charge", durationMins: 5, requiredDocuments: "BOM List v2.0", notes: "Check lot numbers and shelf life stickers", safetyCheck: "Material handling gloves", qualityCheck: "Visual raw material inspection" },
    { stepNumber: 3, description: "Setup machine and parameters as per process sheet.", responsibleRole: "Maintenance Technician", durationMins: 10, requiredDocuments: "Setup Guide SG-ACCU-01", notes: "Calibrate sensor limits and pneumatic pressure (6.0 Bar)", safetyCheck: "Check emergency stop button response", qualityCheck: "Parametric calibration check" },
    { stepNumber: 4, description: "Start production and monitor key parameters.", responsibleRole: "Operator", durationMins: 10, requiredDocuments: "Process Monitoring Log", notes: "Observe temperature telemetry and cycle times", safetyCheck: "Wear safety glasses and anti-static wristband", qualityCheck: "First-piece sample verification" },
    { stepNumber: 5, description: "In-process inspection and quality check.", responsibleRole: "Quality Inspector", durationMins: 5, requiredDocuments: "Control Plan CP-ACCU-001", notes: "Perform dimensional check using digital calipers", safetyCheck: "Insulated glove inspection", qualityCheck: "First-off inspection passed" },
    { stepNumber: 6, description: "Record and update production data.", responsibleRole: "Operator", durationMins: 5, requiredDocuments: "MES Digital Terminal Entry", notes: "Log completed quantity, scrap count, and downtime causes", safetyCheck: "Clear workspace debris", qualityCheck: "Traceability QR code tagged" },
    { stepNumber: 7, description: "Perform end-of-shift line clearance and 5S audit.", responsibleRole: "Operator", durationMins: 5, requiredDocuments: "5S Inspection Checklist", notes: "Clean workstation surfaces and return tools to shadow board", safetyCheck: "Power off non-essential machinery", qualityCheck: "Shadow board 100% complete" },
  ];
  for (const step of sopSteps) {
    await prisma.sopProcedureStep.create({ data: { sopRecordId: sop.id, ...step } });
  }

  const sopResources = [
    { category: "Required Equipment", name: "SMT Pick & Place Machine", itemCount: 2, verified: true, status: "Verified" },
    { category: "Required Equipment", name: "Automatic Reflow Oven", itemCount: 1, verified: true, status: "Verified" },
    { category: "Required Tools", name: "Calibrated Torque Screwdrivers", itemCount: 8, verified: true, status: "Verified" },
    { category: "Required Tools", name: "Digital Multimeters", itemCount: 4, verified: true, status: "Verified" },
    { category: "Software Systems", name: "Magnertia MES & ERP System", itemCount: 1, verified: true, status: "Verified" },
    { category: "Forms & Templates", name: "First-Off Inspection Form", itemCount: 6, verified: true, status: "Verified" },
    { category: "Input Documents", name: "Engineering Design Drawings", itemCount: 4, verified: true, status: "Verified" },
    { category: "Output Documents", name: "Batch Production Record", itemCount: 5, verified: true, status: "Verified" },
  ];
  for (const res of sopResources) {
    await prisma.sopResourceRequirement.create({ data: { sopRecordId: sop.id, ...res } });
  }

  const sopAttachments = [
    { fileName: "SOP_Document_v2.0.pdf", fileType: "pdf", documentType: "SOP Document", uploadedBy: "Rahul Sharma", fileSize: "1.8 MB" },
    { fileName: "Process_Flow_Diagram.png", fileType: "png", documentType: "Flowchart Diagram", uploadedBy: "Rahul Sharma", fileSize: "550 KB" },
    { fileName: "Work_Instructions.zip", fileType: "zip", documentType: "Instruction Package", uploadedBy: "Vikram Singh", fileSize: "3.2 MB" },
    { fileName: "Forms_Templates.zip", fileType: "zip", documentType: "Checklist Templates", uploadedBy: "Neha Reddy", fileSize: "2.8 MB" },
    { fileName: "Risk_Assessment.pdf", fileType: "pdf", documentType: "Risk Report", uploadedBy: "Arun Kumar", fileSize: "1.3 MB" },
    { fileName: "Training_Presentation.pdf", fileType: "pdf", documentType: "Training Deck", uploadedBy: "Nisha Patel", fileSize: "4.5 MB" },
  ];
  for (const att of sopAttachments) {
    await prisma.sopAttachment.create({ data: { sopRecordId: sop.id, ...att, version: "v2.0", status: "Active" } });
  }

  const sopApprovals = [
    { role: "Process Owner", person: "Rahul Sharma", decision: "Approved", status: "Approved", comments: "SOP authored and validated", date: new Date("2024-06-18") },
    { role: "Dept. Head", person: "Vikram Singh", decision: "Approved", status: "Approved", comments: "Process flow approved", date: new Date("2024-06-19") },
    { role: "Quality Manager", person: "Neha Reddy", decision: "Approved", status: "Approved", comments: "ISO compliance verified", date: new Date("2024-06-19") },
    { role: "EHS Manager", person: "Arun Kumar", decision: "Approved", status: "Approved", comments: "Safety & risk assessment cleared", date: new Date("2024-06-20") },
    { role: "Compliance Officer", person: "Priya Nair", decision: "Approved", status: "Approved", comments: "Regulatory compliance confirmed", date: new Date("2024-06-20") },
    { role: "HR / Training Manager", person: "Nisha Patel", decision: "Pending", status: "Pending", comments: "Training materials under review" },
    { role: "COO", person: "Sankaran R.", decision: "Pending", status: "Pending", comments: "Executive board review pending" },
    { role: "CEO", person: "Sankaran R.", decision: "Pending", status: "Pending", comments: "Final release approval pending" },
  ];
  for (const a of sopApprovals) {
    await prisma.sopApprovalStep.create({ data: { sopRecordId: sop.id, ...a } });
  }

  const sopActivities = [
    { user: "Rahul Sharma", action: "Created SOP Draft", description: "Authoring initiated for Manufacturing Process Control & Monitoring SOP (SOP-2024-00123)." },
    { user: "Rahul Sharma", action: "Updated Procedure Steps", description: "Configured 12 step procedure sequence with responsible roles and duration." },
    { user: "Neha Reddy", action: "Validated ISO Compliance", description: "ISO 9001:2015 and ISO 14001:2015 standards verified." },
    { user: "Rahul Sharma", action: "Submitted for Review", description: "SOP submitted for executive review and document control sign-off.", prevStatus: "Draft", newStatus: "Under Review" },
  ];
  for (const act of sopActivities) {
    await prisma.sopActivityLog.create({ data: { sopRecordId: sop.id, ...act } });
  }
  console.log("  ✓ SopRecord seeded");

  console.log("\n✅ Dedicated manufacturing models seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
