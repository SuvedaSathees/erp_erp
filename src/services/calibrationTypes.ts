export type CalibrationType = "Internal" | "External" | "Verification";
export type CalibrationStatus =
  | "Draft"
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Failed"
  | "Approved";
export type PriorityLevel = "Low" | "Medium" | "High" | "Critical";

export interface CalibrationMeasurementPoint {
  id: string;
  seq: number;
  parameter: string;
  nominalValue: number;
  standardReading: number;
  equipmentReading: number;
  error: number;
  tolerance: string;
  result: "Pass" | "Fail";
  remarks: string;
}

export interface CalibrationVerificationItem {
  id: string;
  check: string;
  result: "Pass" | "Fail";
}

export interface CalibrationHistoryItem {
  date: string;
  certificateNo: string;
  result: "Pass" | "Adjusted" | "Fail";
  nextDue: string;
}

export interface CalibrationRecord {
  // Header
  calibrationId: string;
  calibrationNumber: string;
  calibrationDate: string;
  calibrationType: CalibrationType;
  calibrationStatus: CalibrationStatus;
  equipmentName: string;
  equipmentId: string;
  equipmentType: string;
  department: string;
  location: string;
  calibrationAgency: string;
  calibrationProcedure: string;
  calibrationFrequency: string;
  previousCalibrationDate: string;
  nextCalibrationDate: string;
  priority: PriorityLevel;
  calibrationOwner: string;

  // Equipment Information
  equipmentInfo: {
    name: string;
    status: "Active" | "Inactive" | "Quarantined";
    manufacturer: string;
    model: string;
    serialNumber: string;
    assetNumber: string;
    range: string;
    accuracy: string;
    location: string;
    imageUrl?: string;
  };

  // Pre-Calibration Verification
  preVerification: CalibrationVerificationItem[];

  // Standards & Traceability
  standards: {
    referenceStandard: string;
    standardSerialNo: string;
    certificateNo: string;
    validUntil: string;
    traceabilityStatement: string;
  };

  // Environmental Conditions
  environment: {
    temperature: number; // °C
    humidity: number;    // %RH
    pressure: number;    // hPa
  };

  // Measurement Points
  measurements: CalibrationMeasurementPoint[];

  // Result & Certificate
  overallResult: "PASS" | "FAIL";
  overallResultDescription: string;
  adjustmentPerformed: "Yes" | "No";
  complianceToProcedure: "Yes" | "No";
  measurementUncertainty: string;
  certificateNumber: string;
  certificateIssueDate: string;
  certificateValidUntil: string;

  // Schedule & Milestones
  schedule: {
    scheduledDate: string;
    inProgressDate: string;
    completedDate?: string;
    certificateIssuedDate?: string;
    nextDueDate: string;
  };

  // AI Insights
  aiInsights: {
    id: string;
    text: string;
    type: "info" | "alert" | "success" | "recommendation";
  }[];

  // Recent Calibrations
  recentCalibrations: CalibrationHistoryItem[];
}
