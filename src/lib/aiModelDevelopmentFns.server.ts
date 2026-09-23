import { createServerFn } from "@tanstack/react-start";
import type {
  AiModelApprovalDecision,
  AiModelFormInput,
  AiModelRecord,
  AiModelStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "ai-model-development";

export function calculateAiModelDevelopmentScores(input: Partial<AiModelFormInput>) {
  const datasetReadiness = 87;
  const modelReadiness = 90;
  const deploymentReadiness = 89;
  const governanceReadiness = 91;
  const performanceScore = 93;

  const overallAiModelScore = Math.round(
    datasetReadiness * 0.2 +
      modelReadiness * 0.25 +
      deploymentReadiness * 0.2 +
      governanceReadiness * 0.15 +
      performanceScore * 0.2
  );

  return {
    datasetReadinessScore: datasetReadiness,
    featureReadinessScore: 88,
    modelDesignScore: modelReadiness,
    trainingScore: 91,
    evaluationScore: 91,
    governanceScore: governanceReadiness,
    deploymentReadinessScore: deploymentReadiness,
    aiOverallScore: 92,
    overallAiModelScore: overallAiModelScore,
  };
}

const DEFAULT_RECORD: AiModelRecord = {
  id: "aimd-rec-0018",
  aiModelDevelopmentId: "AIMD-2024-0018",
  formCode: "AMDF-2024-25",
  aiProjectName: "EV Demand Forecasting Model",
  modelVersion: "v1.2.0",
  workflowStatus: "In Review",
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",
  linkedProductId: "Smart EV Platform",
  linkedCloudPlatformId: "CLD-2024-0001",
  linkedDataEngineeringId: "DE-2024-0005",
  linkedSoftwareDevId: "SWD-2024-0012",
  linkedApiDevId: "API-2024-0017",
  aiLeadEngineerName: "Rahul Sharma",
  aiLeadEngineerAvatar: "",
  businessUnit: "EV Mobility Division",
  businessObjective: "Predict short-term demand for EV charging stations using historical usage, weather, and calendar data.",
  aiUseCase: "Forecasting",
  targetUsers: ["Operations Team", "Data Analysts"],
  problemStatement: "Accurate demand prediction is needed to optimize station availability and reduce operational costs.",
  expectedBusinessOutcome: "15% reduction in idle stations and improved customer satisfaction.",
  developmentStatus: "In Progress",
  datasetReadinessScore: 87,
  featureReadinessScore: 88,
  modelDesignScore: 90,
  trainingScore: 91,
  evaluationScore: 91,
  governanceScore: 90,
  deploymentReadinessScore: 89,
  aiOverallScore: 92,
  overallAiModelScore: 90,
  datasetConfig: { datasetName: "EV_Usage_Historical", datasetSource: "Data Lake", datasetSize: "2.4 TB", dataFormat: "Parquet", trainDataset: "ev_train.parquet", valDataset: "ev_val.parquet", testDataset: "ev_test.parquet", dataQualityScore: 87, completeness: 92, consistency: 84, accuracy: 85, timeliness: 86, uniqueness: 89 },
  featureConfig: { selectionMethod: "Recursive Feature Elimination", extraction: "Time, Weather, Location, Usage Patterns", scaling: "Standard Scaler", preprocessing: "Outlier Removal, Encoding, Normalization", missingValueStrategy: "Median Imputation", featureReadinessScore: 88 },
  architectureConfig: { aiCategory: "Machine Learning", modelType: "XGBoost", framework: "Scikit-learn", language: "Python", hyperparameters: "Max Depth: 8, Learning Rate: 0.05, N Estimators: 500, Subsample: 0.8", modelDesignScore: 89 },
  trainingMetrics: { strategy: "Supervised Learning", optimizer: "Adam", lossFunction: "RMSE", batchSize: 256, epochs: 200, gpuUtilization: "NVIDIA A100 (80GB) - 90%", trainingStatus: "Completed", trainingScore: 91, learningCurve: [{ epoch: 1, trainLoss: 0.85, valLoss: 0.92 }, { epoch: 200, trainLoss: 0.12, valLoss: 0.19 }] },
  evaluationMetrics: { accuracy: 92.4, precision: 91.7, recall: 90.8, f1Score: 91.2, rocAuc: 0.94, confusionMatrix: [[812, 32, 6], [41, 489, 28], [7, 25, 525]], evaluationScore: 91 },
  governancePolicy: { explainabilityMethod: "SHAP", biasDetection: "No Significant Bias", fairnessAssessment: "Demographic parity satisfied for all groups.", privacyCompliance: "GDPR", ethicalReview: "Completed", riskClassification: "Medium", governanceScore: 90 },
  mlopsDeployment: { platform: "Kubernetes", containerization: "Docker", registry: "MLflow", cicdPipeline: "GitHub Actions", monitoringPlatform: "Prometheus + Grafana", inferenceEndpoint: "https://api.magnertia.com/v1/ev-demand/v1/predict", deploymentStatus: "Deployed", deploymentReadinessScore: 89 },
  aiAssessment: { aiPerformanceScore: 93, aiRobustnessReview: "Strong robustness across different conditions.", aiSecurityReview: "No critical vulnerabilities identified.", aiDriftPrediction: "Low drift expected for next 30 days.", aiOptimizationSuggestions: "Tune learning rate and add holiday features.", aiExplainabilityReview: "Model is well explained using SHAP values.", aiOverallScore: 92 },
  readinessSummary: { datasetReadiness: 87, modelReadiness: 90, deploymentReadiness: 89, governanceReadiness: 91, overallAiModelScore: 90, recommendation: "Proceed to Production Deployment" },
  attachments: [
    { id: "att1", name: "dataset_documentation.pdf", size: "2.4 MB", type: "PDF", uploadedBy: "Rahul Sharma", date: "20 Jun 2024", url: "#" },
    { id: "att2", name: "model_architecture.png", size: "3.1 MB", type: "PNG", uploadedBy: "Ananya Iyer", date: "20 Jun 2024", url: "#" },
  ],
  reviewers: [
    { role: "AI Lead Engineer", person: "Rahul Sharma", avatar: "", decision: "Approved", date: "20 Jun 2024", comments: "Looks Good" },
    { role: "CTO", person: "Dr. Anil Patel", avatar: "", decision: "Pending", date: "20 Jun 2024", comments: "Pending Review" },
  ],
  approvalDecision: "Approved with Conditions",
  approvalDate: "20 Jun 2024",
  reviewComments: "Overall model is good. Please improve explainability and add more test cases.",
  auditTrail: [
    { id: "aud1", timestamp: "20 Jun 2024 04:25 PM", user: "Rahul Sharma", avatar: "", action: "Submitted for Review", details: "Submitted EV Demand Forecasting Model v1.2.0 to AI review board.", ipAddress: "192.168.1.104" },
    { id: "aud4", timestamp: "18 Jun 2024 10:15 AM", user: "Rahul Sharma", avatar: "", action: "Created Project", details: "Initialized AI Model Development Record AIMD-2024-0018.", ipAddress: "192.168.1.104" },
  ],
} as any;

export { DEFAULT_RECORD };

export const getAiModelDevelopmentFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: AiModelRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_RECORD };
  }
);

export const saveAiModelDevelopmentDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<AiModelFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: AiModelRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_RECORD;
    const merged = { ...base, ...data.input };
    const scores = calculateAiModelDevelopmentScores(merged as any);
    const record = {
      ...merged,
      ...scores,
      projectName: (base as any).aiProjectName ?? "",
      ownerName: (base as any).aiLeadEngineerName ?? "Rahul Sharma",
      recordCode: (base as any).id ?? (base as any).aiModelDevelopmentId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitAiModelDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: AiModelRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_RECORD };
  });

export const reviewAiModelDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: AiModelApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: AiModelRecord }> => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "AI Review Board",
        reviewerName: "Review Board",
      },
    });
    return { success: true, data: result as any };
  });
