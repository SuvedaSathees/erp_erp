import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Brain,
  Cpu,
  Database,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Activity,
  Gauge,
  ShieldCheck,
  Terminal,
  Cloud,
  Play,
  RefreshCw,
  FileText,
  Download,
  Upload,
  Eye,
  Save,
  Send,
  MoreHorizontal,
  ExternalLink,
  ChevronRight,
  Workflow,
  Copy,
  FileCode,
  FileSpreadsheet,
  Target,
  Zap,
  BarChart3,
  Share2,
  Printer,
  Grid3x3,
  LineChart,
  UserCheck,
  Paperclip,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  Layers,
  Tag,
  X,
  Globe,
  FileCheck,
  ChevronDown,
  Clock,
  ArrowRight,
  History as HistoryIcon,
} from "lucide-react";

import { aiModelDevelopmentService } from "@/services/aiModelDevelopmentService";
import type {
  AiModelRecord,
  AiModelFormInput,
  AiModelApprovalDecision,
  AiAttachment,
  AiReviewer,
  AiAuditEntry,
  AiModelStatus,
} from "@/services/types";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { AppShell } from "@/components/erp/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/research-innovation/ai-model-development/new",
)({
  head: () => ({
    meta: [{ title: "EV Demand Forecasting Model · Magnertia ERP" }],
  }),
  component: AiModelDevelopmentNewPage,
});

export function AiModelFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <AiModelDevelopmentNewPage {...props} />;
}

export function AiModelDevelopmentPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <AiModelDevelopmentNewPage {...props} />;
}

/* Helper for file downloads */
function triggerBrowserDownload(filename: string, content: string, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* Helper component for SVG Circular Gauge */
function CircularScoreGauge({
  score,
  size = 96,
  strokeWidth = 8,
  label,
  sublabel,
  color = "#2563eb",
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}) {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-800"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span className="text-2xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400 flex items-baseline justify-center">
            {normalizedScore}
            <span className="text-sm font-bold ml-0.5">%</span>
          </span>
        </div>
      </div>
      {label && <span className="mt-2 text-xs font-bold text-foreground">{label}</span>}
      {sublabel && <span className="text-[11px] text-muted-foreground">{sublabel}</span>}
    </div>
  );
}

export function AiModelDevelopmentNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Selected Attachment for Preview
  const [selectedAttachment, setSelectedAttachment] = useState<AiAttachment | null>(null);

  // Active Dialog Modals
  const [isRetrainModalOpen, setIsRetrainModalOpen] = useState(false);
  const [isInferenceModalOpen, setIsInferenceModalOpen] = useState(false);
  const [isBiasModalOpen, setIsBiasModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTargetType, setUploadTargetType] = useState<"attachment" | "dataset">("attachment");
  const [isAddReviewerOpen, setIsAddReviewerOpen] = useState(false);
  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false);
  const [isRocModalOpen, setIsRocModalOpen] = useState(false);
  const [isAddAuditOpen, setIsAddAuditOpen] = useState(false);
  const [newAuditAction, setNewAuditAction] = useState("");
  const [newAuditDetails, setNewAuditDetails] = useState("");
  const [inspectDataset, setInspectDataset] = useState<{ name: string; rows: any[] } | null>(null);

  // Reference Info Modals
  const [activeRefModal, setActiveRefModal] = useState<"product" | "cloud" | "engineer" | null>(null);

  // Retrain State Simulation
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainEpoch, setRetrainEpoch] = useState(0);
  const [retrainEpochsTarget, setRetrainEpochsTarget] = useState(200);
  const [retrainLearningRate, setRetrainLearningRate] = useState("0.05");
  const [retrainLogs, setRetrainLogs] = useState<string[]>([]);

  // Inference Simulator State
  const inferencePresets = [
    {
      label: "Peak Friday Evening",
      payload: {
        station_id: "EV-STATION-402",
        hour_of_day: 18,
        day_of_week: "Friday",
        temperature_celsius: 28.5,
        is_holiday: 0,
        historical_kwh_usage: 142.8,
        charger_type: "DC_FAST_150KW",
      },
      pred: 168.4,
      conf: 0.952,
      lat: 13.8,
      topFeat: "historical_kwh_usage (+34.2 kW)",
    },
    {
      label: "Weekend Heavy Rain",
      payload: {
        station_id: "EV-STATION-108",
        hour_of_day: 14,
        day_of_week: "Sunday",
        temperature_celsius: 19.2,
        is_holiday: 0,
        historical_kwh_usage: 98.4,
        charger_type: "DC_FAST_50KW",
      },
      pred: 114.2,
      conf: 0.918,
      lat: 11.4,
      topFeat: "temperature_celsius (-12.6 kW)",
    },
    {
      label: "Night Off-Peak",
      payload: {
        station_id: "EV-STATION-205",
        hour_of_day: 3,
        day_of_week: "Wednesday",
        temperature_celsius: 22.0,
        is_holiday: 0,
        historical_kwh_usage: 24.5,
        charger_type: "AC_TYPE2_22KW",
      },
      pred: 28.6,
      conf: 0.975,
      lat: 9.8,
      topFeat: "hour_of_day (-42.1 kW)",
    },
  ];

  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [inferencePayload, setInferencePayload] = useState<string>(
    JSON.stringify(inferencePresets[0].payload, null, 2),
  );
  const [inferenceResult, setInferenceResult] = useState<{
    status: string;
    predicted_demand_kwh: number;
    confidence_score: number;
    latency_ms: number;
    shap_top_feature: string;
  } | null>(null);
  const [isInferring, setIsInferring] = useState(false);

  // New Feature & Reviewer Form States
  const [newFeatureName, setNewFeatureName] = useState("");
  const [newFeatureScore, setNewFeatureScore] = useState(15);
  const [newFeatureType, setNewFeatureType] = useState<"Numeric" | "Categorical" | "Binary">("Numeric");

  const [newReviewerRole, setNewReviewerRole] = useState("AI Ethics Officer");
  const [newReviewerPerson, setNewReviewerPerson] = useState("");

  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("model_card");
  const [uploadFileSize, setUploadFileSize] = useState("2.1 MB");

  // Confusion matrix display mode
  const [confusionMode, setConfusionMode] = useState<"counts" | "percent">("counts");

  // Live Ping Latency State
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  // Drift Scan State
  const [isDriftScanning, setIsDriftScanning] = useState(false);
  const [driftStatusText, setDriftStatusText] = useState("Low drift expected for next 30 days (KS p-val: 0.42).");

  // Fetch initial record
  const { data: recordData, isLoading } = useQuery<AiModelRecord>({
    queryKey: ["aiModelDevelopmentRecord"],
    queryFn: () => aiModelDevelopmentService.fetchRecord(),
  });

  // Local interactive record state
  const [record, setRecord] = useState<AiModelRecord | null>(null);

  // Synchronize query data to local state once fetched
  React.useEffect(() => {
    if (recordData && !record) {
      setRecord(recordData);
      setFormData({
        aiProjectName: recordData.aiProjectName,
        modelVersion: recordData.modelVersion,
        businessObjective: recordData.businessObjective,
        problemStatement: recordData.problemStatement,
        expectedBusinessOutcome: recordData.expectedBusinessOutcome,
        aiUseCase: recordData.aiUseCase,
        approvalDecision: recordData.approvalDecision || "Approved with Conditions",
        reviewComments:
          recordData.reviewComments ||
          "Overall model is good. Please improve explainability and add more test cases.",
      });
      if (recordData.featureConfig?.featureReadinessScore) {
        setFeatureList([
          { name: "historical_kwh_usage", score: 0.38, type: "Numeric" },
          { name: "hour_of_day", score: 0.24, type: "Categorical" },
          { name: "temperature_celsius", score: 0.16, type: "Numeric" },
          { name: "is_holiday", score: 0.12, type: "Binary" },
          { name: "charger_type_kw", score: 0.10, type: "Categorical" },
        ]);
      }
      if (recordData.datasetConfig) {
        setPartitions([
          { type: "Training Dataset", file: recordData.datasetConfig.trainDataset || "ev_train.parquet", size: "1.68 TB", records: "48,500,000 rows", status: "Verified" },
          { type: "Validation Dataset", file: recordData.datasetConfig.valDataset || "ev_val.parquet", size: "360 GB", records: "10,200,000 rows", status: "Verified" },
          { type: "Test Dataset", file: recordData.datasetConfig.testDataset || "ev_test.parquet", size: "360 GB", records: "10,200,000 rows", status: "Holdout Protected" },
        ]);
      }
    }
  }, [recordData, record]);

  // Form State
  const [formData, setFormData] = useState<Partial<AiModelFormInput & { modelVersion?: string }>>({
    aiProjectName: "EV Demand Forecasting Model",
    modelVersion: "v1.2.0",
    businessObjective:
      "Predict short-term demand for EV charging stations using historical usage, weather, and calendar data.",
    problemStatement:
      "Accurate demand prediction is needed to optimize station availability and reduce operational costs.",
    expectedBusinessOutcome:
      "15% reduction in idle stations and improved customer satisfaction.",
    aiUseCase: "Forecasting",
    approvalDecision: "Approved with Conditions",
    reviewComments:
      "Overall model is good. Please improve explainability and add more test cases.",
  });

  // Stakeholders tags
  const [stakeholders, setStakeholders] = useState<string[]>([
    "Operations Team",
    "Data Analysts",
  ]);
  const [newStakeholder, setNewStakeholder] = useState("");

  // Features List State
  const [featureList, setFeatureList] = useState([
    { name: "historical_kwh_usage", score: 0.38, type: "Numeric" },
    { name: "hour_of_day", score: 0.24, type: "Categorical" },
    { name: "temperature_celsius", score: 0.16, type: "Numeric" },
    { name: "is_holiday", score: 0.12, type: "Binary" },
    { name: "charger_type_kw", score: 0.10, type: "Categorical" },
  ]);

  // Datasets Partitions State
  const [partitions, setPartitions] = useState([
    { type: "Training Dataset", file: "ev_train.parquet", size: "1.68 TB", records: "48,500,000 rows", status: "Verified" },
    { type: "Validation Dataset", file: "ev_val.parquet", size: "360 GB", records: "10,200,000 rows", status: "Verified" },
    { type: "Test Dataset", file: "ev_test.parquet", size: "360 GB", records: "10,200,000 rows", status: "Holdout Protected" },
  ]);

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<AiModelFormInput>) =>
      aiModelDevelopmentService.saveDraft(input),
    onSuccess: (updated) => {
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setRecord((prev) =>
        prev
          ? {
              ...prev,
              ...formData,
              targetUsers: stakeholders,
              lastUpdated: `Today at ${now}`,
            }
          : prev,
      );
      toast.success("Draft saved successfully!", {
        description: "Model configuration, objectives, and parameters persisted.",
      });
    },
  });

  const submitForReviewMutation = useMutation({
    mutationFn: () => aiModelDevelopmentService.submitForReview(),
    onSuccess: (updated) => {
      setRecord((prev) => (prev ? { ...prev, workflowStatus: "In Review" } : prev));
      toast.success("Submitted for AI Review!", {
        description: "Project moved to 'In Review' workflow stage.",
      });
    },
  });

  const reviewDecisionMutation = useMutation({
    mutationFn: (args: {
      id: string;
      decision: AiModelApprovalDecision;
      comments?: string;
    }) => aiModelDevelopmentService.reviewDecision(args),
    onSuccess: (updated) => {
      setRecord((prev) =>
        prev
          ? {
              ...prev,
              approvalDecision: formData.approvalDecision as AiModelApprovalDecision,
              reviewComments: formData.reviewComments,
              workflowStatus:
                formData.approvalDecision === "Approved"
                  ? "Approved"
                  : formData.approvalDecision === "Rejected"
                  ? "Archived"
                  : "In Review",
            }
          : prev,
      );
      toast.success(`Review status updated to '${formData.approvalDecision}'`, {
        description: "Audit trail log generated and sign-off recorded.",
      });
    },
  });

  // Retrain Simulation
  const handleStartRetrain = () => {
    setIsRetraining(true);
    setRetrainEpoch(0);
    setRetrainLogs([
      "Initializing XGBoost GPU environment (NVIDIA A100 80GB)...",
      `Hyperparameters: learning_rate=${retrainLearningRate}, n_estimators=${retrainEpochsTarget}`,
      "Loading EV_Usage_Historical dataset (2.4 TB Parquet)...",
    ]);

    let current = 0;
    const step = Math.max(10, Math.floor(retrainEpochsTarget / 10));
    const interval = setInterval(() => {
      current += step;
      if (current > retrainEpochsTarget) current = retrainEpochsTarget;
      setRetrainEpoch(current);
      setRetrainLogs((prev) => [
        ...prev,
        `Epoch ${current}/${retrainEpochsTarget} - train_rmse: ${(0.82 * (1 - current / (retrainEpochsTarget * 1.15))).toFixed(4)} - val_rmse: ${(0.89 * (1 - current / (retrainEpochsTarget * 1.12))).toFixed(4)}`,
      ]);

      if (current >= retrainEpochsTarget) {
        clearInterval(interval);
        setIsRetraining(false);
        setRetrainLogs((prev) => [
          ...prev,
          "Training finished successfully! Validation accuracy: 93.4%. Model checkpoint saved to MLflow Registry.",
        ]);
        setRecord((prev) =>
          prev
            ? {
                ...prev,
                modelVersion: "v1.2.1",
                overallAiModelScore: 92,
                evaluationScore: 93,
                trainingScore: 94,
              }
            : prev,
        );
        toast.success("Model retraining completed successfully!", {
          description: "Accuracy improved to 93.4%. Version bumped to v1.2.1.",
        });
      }
    }, 280);
  };

  // Inference simulation
  const handleExecuteInference = () => {
    setIsInferring(true);
    setTimeout(() => {
      setIsInferring(false);
      const active = inferencePresets[selectedPresetIndex] || inferencePresets[0];
      setInferenceResult({
        status: "200 OK",
        predicted_demand_kwh: active.pred,
        confidence_score: active.conf,
        latency_ms: active.lat,
        shap_top_feature: active.topFeat,
      });
      toast.success("Inference response received!", {
        description: `Predicted: ${active.pred} kWh | Latency: ${active.lat}ms`,
      });
    }, 450);
  };

  // Live ping endpoint
  const handlePingEndpoint = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      const lat = parseFloat((10 + Math.random() * 6).toFixed(1));
      setPingLatency(lat);
      toast.success("Production endpoint is healthy & responding!", {
        description: `Status: 200 OK | Cluster Latency: ${lat}ms`,
      });
    }, 500);
  };

  // Drift scan simulation
  const handleRunDriftScan = () => {
    setIsDriftScanning(true);
    setTimeout(() => {
      setIsDriftScanning(false);
      setDriftStatusText("Drift check passed: KS-Test p-value 0.46 (>0.05). Stable distributions.");
      toast.success("Drift diagnostic scan completed!", {
        description: "No data or concept drift detected in active inference stream.",
      });
    }, 600);
  };

  // Download Sample Dataset Partition
  const handleDownloadPartition = (filename: string) => {
    const csvSample = `timestamp,station_id,hour_of_day,temperature_celsius,is_holiday,historical_kwh,predicted_demand_kwh
2024-06-20 08:00:00,EV-STATION-402,8,24.5,0,88.4,94.2
2024-06-20 09:00:00,EV-STATION-402,9,26.1,0,112.0,118.6
2024-06-20 10:00:00,EV-STATION-402,10,27.8,0,135.2,141.0
2024-06-20 11:00:00,EV-STATION-402,11,29.0,0,150.1,154.8
2024-06-20 12:00:00,EV-STATION-402,12,30.2,0,162.4,166.1
2024-06-20 13:00:00,EV-STATION-402,13,31.0,0,148.9,152.3
2024-06-20 14:00:00,EV-STATION-402,14,30.5,0,139.7,143.5`;
    triggerBrowserDownload(filename.replace(".parquet", ".csv"), csvSample, "text/csv");
    toast.success(`Downloaded sample data for ${filename}`);
  };

  // Inspect Dataset rows
  const handleInspectDataset = (filename: string) => {
    setInspectDataset({
      name: filename,
      rows: [
        { id: "REC-1001", time: "2024-06-20 08:00", station: "EV-402", kwh: 94.2, temp: "24.5°C", holiday: "No" },
        { id: "REC-1002", time: "2024-06-20 09:00", station: "EV-402", kwh: 118.6, temp: "26.1°C", holiday: "No" },
        { id: "REC-1003", time: "2024-06-20 10:00", station: "EV-402", kwh: 141.0, temp: "27.8°C", holiday: "No" },
        { id: "REC-1004", time: "2024-06-20 11:00", station: "EV-402", kwh: 154.8, temp: "29.0°C", holiday: "No" },
        { id: "REC-1005", time: "2024-06-20 12:00", station: "EV-402", kwh: 166.1, temp: "30.2°C", holiday: "No" },
      ],
    });
  };

  // Export Confusion Matrix to CSV
  const handleExportConfusionMatrix = () => {
    const csv = `Actual \\ Predicted,Low Demand,Med Demand,High Demand\nLow Demand,812,32,6\nMed Demand,41,489,28\nHigh Demand,7,25,525\n`;
    triggerBrowserDownload("confusion_matrix_ev_demand.csv", csv, "text/csv");
    toast.success("Confusion matrix exported as CSV!");
  };

  // Export Model Card JSON
  const handleExportModelCard = () => {
    const modelCardData = {
      model_id: record?.aiModelDevelopmentId || "AIMD-2024-0018",
      model_name: formData.aiProjectName || "EV Demand Forecasting Model",
      version: formData.modelVersion || "v1.2.0",
      type: "XGBoost Supervised Regressor",
      framework: "Scikit-learn 1.4 / Python 3.11",
      objective: formData.businessObjective,
      evaluation_metrics: {
        accuracy: "92.4%",
        precision: "91.7%",
        recall: "90.8%",
        f1_score: "91.2%",
        roc_auc: 0.94,
      },
      governance: {
        fairness: "Demographic parity satisfied (0.982)",
        data_anonymization: "PII scrubbed",
        gdpr_compliant: true,
      },
      deployment: {
        platform: "Kubernetes (EKS)",
        endpoint: "https://api.magnertia.com/v1/ev-demand/v1/predict",
      },
      exported_at: new Date().toISOString(),
    };
    triggerBrowserDownload(
      `${record?.aiModelDevelopmentId || "AIMD"}_model_card.json`,
      JSON.stringify(modelCardData, null, 2),
      "application/json",
    );
    toast.success("Model Card exported successfully!");
  };

  // Add Feature
  const handleAddFeature = () => {
    if (!newFeatureName.trim()) {
      toast.error("Please enter a feature name.");
      return;
    }
    const scoreVal = parseFloat((newFeatureScore / 100).toFixed(2));
    setFeatureList((prev) => [
      ...prev,
      { name: newFeatureName.trim().toLowerCase().replace(/\s+/g, "_"), score: scoreVal, type: newFeatureType },
    ]);
    setIsAddFeatureOpen(false);
    setNewFeatureName("");
    toast.success(`Feature '${newFeatureName}' added to store.`);
  };

  // Remove Feature
  const handleRemoveFeature = (name: string) => {
    setFeatureList((prev) => prev.filter((f) => f.name !== name));
    toast.success(`Feature '${name}' removed.`);
  };

  // Add Reviewer
  const handleAddReviewer = () => {
    if (!newReviewerPerson.trim()) {
      toast.error("Please enter reviewer name.");
      return;
    }
    if (record) {
      const newRev: AiReviewer = {
        role: newReviewerRole,
        person: newReviewerPerson.trim(),
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        decision: "Pending",
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        comments: "Awaiting board evaluation",
      };
      setRecord((prev) => (prev ? { ...prev, reviewers: [...prev.reviewers, newRev] } : prev));
    }
    setIsAddReviewerOpen(false);
    setNewReviewerPerson("");
    toast.success("Reviewer added to approval board.");
  };

  // Toggle Reviewer Status
  const handleToggleReviewerDecision = (index: number) => {
    if (!record) return;
    const current = record.reviewers[index];
    const nextDecision: AiModelApprovalDecision =
      current.decision === "Pending"
        ? "Approved"
        : current.decision === "Approved"
        ? "Approved with Conditions"
        : current.decision === "Approved with Conditions"
        ? "Changes Requested"
        : "Pending";

    const updatedReviewers = [...record.reviewers];
    updatedReviewers[index] = {
      ...current,
      decision: nextDecision,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };

    setRecord({ ...record, reviewers: updatedReviewers });
    toast.success(`Updated ${current.person}'s decision to ${nextDecision}`);
  };

  // Upload Modal Handler (for files or datasets)
  const handleConfirmUpload = () => {
    const fname = uploadFileName.trim() || (uploadTargetType === "dataset" ? "ev_weather_sensor.parquet" : "model_spec_v2.pdf");
    if (uploadTargetType === "dataset") {
      setPartitions((prev) => [
        ...prev,
        {
          type: "Custom Feature Dataset",
          file: fname,
          size: uploadFileSize || "450 MB",
          records: "12,400,000 rows",
          status: "Verified",
        },
      ]);
      toast.success(`Dataset '${fname}' uploaded & verified!`);
    } else {
      if (record) {
        const newAtt: AiAttachment = {
          id: `att-${Date.now()}`,
          name: fname,
          size: uploadFileSize || "1.8 MB",
          type: fname.endsWith(".png") ? "Image" : "PDF",
          uploadedBy: "Rahul Sharma",
          date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          url: "#",
        };
        setRecord({ ...record, attachments: [newAtt, ...record.attachments] });
      }
      toast.success(`Attachment '${fname}' uploaded successfully!`);
    }
    setIsUploadOpen(false);
    setUploadFileName("");
  };

  // Delete Attachment
  const handleDeleteAttachment = (id: string, name: string) => {
    if (!record) return;
    setRecord({
      ...record,
      attachments: record.attachments.filter((a) => a.id !== id),
    });
    toast.success(`Attachment '${name}' removed.`);
  };

  // Add Stakeholder Tag
  const handleAddStakeholder = () => {
    if (!newStakeholder.trim()) return;
    if (stakeholders.includes(newStakeholder.trim())) {
      toast.error("Tag already exists.");
      return;
    }
    setStakeholders((prev) => [...prev, newStakeholder.trim()]);
    setNewStakeholder("");
  };

  // Remove Stakeholder Tag
  const handleRemoveStakeholder = (tag: string) => {
    setStakeholders((prev) => prev.filter((t) => t !== tag));
  };

  // Add Manual Audit Note
  const handleAddAuditNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuditAction.trim() || !newAuditDetails.trim()) {
      toast.error("Please provide action title and details.");
      return;
    }
    const newEntry: AiAuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      user: "Rahul Sharma (AI Lead)",
      action: newAuditAction.trim(),
      details: newAuditDetails.trim(),
    };
    setRecord((prev) => (prev ? { ...prev, auditTrail: [newEntry, ...prev.auditTrail] } : prev));
    setIsAddAuditOpen(false);
    setNewAuditAction("");
    setNewAuditDetails("");
    toast.success("Audit entry recorded to model history.");
  };

  if (isLoading || !record) {
    return (
      <AppShell
        title="AI Model Development"
        breadcrumb={breadcrumb ?? "Development > Research & Innovation > AI Model Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-muted-foreground">Loading AI Model Development Module...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="AI Model Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > AI Model Development"}
      description="Design predictive ML pipelines, deep learning architectures, feature engineering, and MLOps deployment."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased pb-20">
        <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 pt-3 space-y-4">

          {/* Top Header Card */}
          <div className="rounded-xl border border-border/80 bg-white dark:bg-slate-900 shadow-2xs px-4 sm:px-6 py-4 space-y-3 transition-all">
            {/* Row 1: Title, Version, Status Dropdown & Action Buttons (Single Line) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 border border-blue-200/50 dark:border-blue-800/50">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2.5 flex-nowrap min-w-0">
                  <h1 className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap truncate">
                    {formData.aiProjectName || record.aiProjectName}
                  </h1>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 font-mono text-xs font-semibold px-2.5 py-0.5 shrink-0"
                  >
                    {formData.modelVersion || record.modelVersion}
                  </Badge>

                  {/* Workflow Status Dropdown Button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 focus-visible:ring-2 focus-visible:ring-primary",
                          record.workflowStatus === "Approved" || record.workflowStatus === "Production Deployed"
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : record.workflowStatus === "In Review"
                            ? "bg-amber-500 text-white hover:bg-amber-600"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        )}
                      >
                        <Workflow className="h-3 w-3" />
                        <span>{record.workflowStatus}</span>
                        <ChevronDown className="h-3 w-3 opacity-80" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 text-xs">
                      <DropdownMenuItem
                        onClick={() => {
                          setRecord({ ...record, workflowStatus: "Draft" });
                          toast.success("Workflow status changed to 'Draft'");
                        }}
                      >
                        Set Status: Draft
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setRecord({ ...record, workflowStatus: "In Review" });
                          toast.success("Workflow status changed to 'In Review'");
                        }}
                      >
                        Set Status: In Review
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setRecord({ ...record, workflowStatus: "Approved" });
                          toast.success("Workflow status changed to 'Approved'");
                        }}
                      >
                        Set Status: Approved
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setRecord({ ...record, workflowStatus: "Production Deployed" });
                          toast.success("Workflow status changed to 'Production Deployed'");
                        }}
                      >
                        Set Status: Production Deployed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Action Buttons (Single Line, Never Wraps) */}
              <div className="flex items-center gap-2 shrink-0 flex-nowrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => saveDraftMutation.mutate(formData)}
                  disabled={saveDraftMutation.isPending}
                  className="gap-1.5 h-9 text-xs font-medium cursor-pointer border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                >
                  <Save className="h-3.5 w-3.5 text-slate-500" />
                  {saveDraftMutation.isPending ? "Saving..." : "Save Draft"}
                </Button>

                {record.workflowStatus === "In Review" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        className="h-9 px-3.5 text-xs font-semibold gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:border-amber-500/50 shadow-2xs transition-all cursor-pointer shrink-0"
                      >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                        </span>
                        <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Under Review</span>
                        <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 text-xs">
                      <DropdownMenuItem
                        onClick={() => document.getElementById("section-review")?.scrollIntoView({ behavior: "smooth" })}
                        className="cursor-pointer"
                      >
                        <UserCheck className="mr-2 h-4 w-4 text-emerald-600" /> Record Review Decision
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          toast.success("Expedited review reminder dispatched to AI Architecture Review Board.");
                        }}
                        className="cursor-pointer"
                      >
                        <Send className="mr-2 h-4 w-4 text-primary" /> Send Review Reminder
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setRecord((prev) => (prev ? { ...prev, workflowStatus: "Draft" } : prev));
                          toast.info("Status reverted to Draft. You can now edit model specifications.");
                        }}
                        className="cursor-pointer text-amber-600 dark:text-amber-400"
                      >
                        <ArrowRight className="mr-2 h-4 w-4" /> Revert Status to Draft
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : record.workflowStatus === "Approved" || record.workflowStatus === "Production Deployed" ? (
                  <Badge className="h-9 px-3 text-xs font-semibold gap-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    {record.workflowStatus}
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      setRecord({ ...record, workflowStatus: "In Review" });
                      submitForReviewMutation.mutate();
                    }}
                    disabled={submitForReviewMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-2xs h-9 text-xs font-medium cursor-pointer shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {submitForReviewMutation.isPending ? "Submitting..." : "Submit for Review"}
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={() => document.getElementById("section-review")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-9 px-3.5 text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer shrink-0"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  Review Decision
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9 border-slate-300 dark:border-slate-700 cursor-pointer shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 text-xs">
                    <DropdownMenuItem onClick={() => setIsRetrainModalOpen(true)}>
                      <RefreshCw className="h-3.5 w-3.5 mr-2 text-blue-500" />
                      Trigger Model Retraining
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsInferenceModalOpen(true)}>
                      <Terminal className="h-3.5 w-3.5 mr-2 text-purple-500" />
                      Test Inference Endpoint
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsBiasModalOpen(true)}>
                      <ShieldCheck className="h-3.5 w-3.5 mr-2 text-amber-500" />
                      Run Responsible AI Audit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleExportModelCard}>
                      <Download className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                      Export Model Card (JSON)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.print()}>
                      <Printer className="h-3.5 w-3.5 mr-2" />
                      Print Specification
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard!");
                      }}
                    >
                      <Share2 className="h-3.5 w-3.5 mr-2" />
                      Share Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Row 2: Secondary Metadata with Clean Vertical Dividers */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                <div
                  className="flex flex-col cursor-pointer group"
                  onClick={() => {
                    navigator.clipboard.writeText(record.aiModelDevelopmentId);
                    toast.success(`Copied Model ID: ${record.aiModelDevelopmentId}`);
                  }}
                >
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold group-hover:text-primary">
                    AI Model ID (Click to Copy)
                  </span>
                  <span className="font-bold font-mono text-foreground flex items-center gap-1">
                    {record.aiModelDevelopmentId}
                    <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>

                <div className="h-7 w-px bg-border hidden sm:block" />

                <div
                  className="flex flex-col cursor-pointer group"
                  onClick={() => {
                    navigator.clipboard.writeText(record.formCode);
                    toast.success(`Copied Form Code: ${record.formCode}`);
                  }}
                >
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold group-hover:text-primary">
                    Form Code (Click to Copy)
                  </span>
                  <span className="font-semibold font-mono text-foreground flex items-center gap-1">
                    {record.formCode}
                    <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>

                <div className="h-7 w-px bg-border hidden sm:block" />

                <div
                  className="flex flex-col cursor-pointer group"
                  onClick={() => setActiveRefModal("product")}
                >
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Linked Product
                  </span>
                  <span className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:underline">
                    {record.linkedProductId}
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>

                <div className="h-7 w-px bg-border hidden sm:block" />

                <div
                  className="flex flex-col cursor-pointer group"
                  onClick={() => setActiveRefModal("cloud")}
                >
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Linked Cloud
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1 group-hover:text-blue-600">
                    {record.linkedCloudPlatformId}
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>

                <div className="h-7 w-px bg-border hidden sm:block" />

                <div
                  className="flex flex-col cursor-pointer group"
                  onClick={() => setActiveRefModal("engineer")}
                >
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    AI Lead Engineer
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1 group-hover:text-blue-600">
                    {record.aiLeadEngineerName}
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>

              <div className="flex flex-col text-xs">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Created / Updated</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{record.lastUpdated || record.createdOn}</span>
              </div>
            </div>
          </div>

          {/* Section 1: EXECUTIVE OVERALL SCORE & READINESS STRIP */}
          <Card className="border-border bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 flex flex-col xl:flex-row items-center justify-between gap-6">
                {/* Overall Score Gauge */}
                <div className="flex items-center gap-5 shrink-0">
                  <CircularScoreGauge
                    score={record.overallAiModelScore}
                    size={96}
                    strokeWidth={8}
                    color="#2563eb"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">Overall AI Model Readiness</span>
                      <Badge className="bg-emerald-600 text-white text-[10px]">Verified & Authorized</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground max-w-md">
                      Comprehensive evaluation across dataset quality, architecture design, governance compliance, and live latency benchmarks.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <Badge variant="outline" className="text-xs font-medium text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/40 gap-1.5 py-1 px-2.5">
                        <Target className="h-3.5 w-3.5" />
                        Recommendation: {record.readinessSummary.recommendation}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => {
                          setRecord({ ...record, workflowStatus: "Production Deployed" });
                          toast.success("Model approved and promoted to production!");
                        }}
                        className="h-7 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs gap-1.5"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Deploy to Production Now
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 5 Component Metrics with Progress Bars */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full xl:w-auto xl:min-w-[620px]">
                  <div
                    onClick={() => document.getElementById("section-dataset")?.scrollIntoView({ behavior: "smooth" })}
                    className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <span className="text-[11px] text-muted-foreground block font-medium">Dataset Quality</span>
                    <span className="text-sm font-bold text-foreground font-mono">{record.datasetReadinessScore}%</span>
                    <Progress value={record.datasetReadinessScore} className="h-1.5" />
                  </div>

                  <div
                    onClick={() => document.getElementById("section-architecture")?.scrollIntoView({ behavior: "smooth" })}
                    className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <span className="text-[11px] text-muted-foreground block font-medium">Architecture</span>
                    <span className="text-sm font-bold text-foreground font-mono">{record.modelDesignScore}%</span>
                    <Progress value={record.modelDesignScore} className="h-1.5" />
                  </div>

                  <div
                    onClick={() => document.getElementById("section-deployment")?.scrollIntoView({ behavior: "smooth" })}
                    className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <span className="text-[11px] text-muted-foreground block font-medium">Deployment</span>
                    <span className="text-sm font-bold text-foreground font-mono">{record.deploymentReadinessScore}%</span>
                    <Progress value={record.deploymentReadinessScore} className="h-1.5" />
                  </div>

                  <div
                    onClick={() => document.getElementById("section-governance")?.scrollIntoView({ behavior: "smooth" })}
                    className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <span className="text-[11px] text-muted-foreground block font-medium">AI Governance</span>
                    <span className="text-sm font-bold text-foreground font-mono">{record.governanceScore}%</span>
                    <Progress value={record.governanceScore} className="h-1.5" />
                  </div>

                  <div
                    onClick={() => document.getElementById("section-evaluation")?.scrollIntoView({ behavior: "smooth" })}
                    className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 col-span-2 sm:col-span-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <span className="text-[11px] text-muted-foreground block font-medium">Performance</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{record.aiAssessment.aiPerformanceScore}%</span>
                    <Progress value={record.aiAssessment.aiPerformanceScore} className="h-1.5" />
                  </div>
                </div>
              </div>
            </Card>

          {/* Section 2: BALANCED 2-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

            {/* Card 1: AI Project Overview & Scope */}
            <Card id="section-overview" className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold">AI Project Overview & Target Scope</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs font-semibold">{record.businessUnit}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                        AI Project Name
                      </label>
                      <Input
                        value={formData.aiProjectName || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, aiProjectName: e.target.value }))}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                        AI Use Case
                      </label>
                      <select
                        value={formData.aiUseCase || record.aiUseCase}
                        onChange={(e) => setFormData((prev) => ({ ...prev, aiUseCase: e.target.value }))}
                        className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <option value="Forecasting">Forecasting</option>
                        <option value="Anomaly Detection">Anomaly Detection</option>
                        <option value="Classification">Classification</option>
                        <option value="Optimization">Optimization</option>
                        <option value="NLP / Generative">NLP / Generative</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                        Target Stakeholders & Users
                      </label>
                      <span className="text-[10px] text-muted-foreground">Click 'x' to remove</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap items-center">
                      {stakeholders.map((u, i) => (
                        <Badge key={i} variant="secondary" className="text-[11px] px-2 py-0.5 flex items-center gap-1">
                          {u}
                          <button
                            type="button"
                            onClick={() => handleRemoveStakeholder(u)}
                            className="hover:text-red-500 ml-0.5 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      <div className="flex items-center gap-1">
                        <Input
                          placeholder="Add stakeholder..."
                          value={newStakeholder}
                          onChange={(e) => setNewStakeholder(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddStakeholder()}
                          className="h-6 w-32 text-[11px] px-2"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleAddStakeholder}
                          className="h-6 px-1.5 text-xs text-blue-600"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                        Business Objective
                      </label>
                      <Textarea
                        rows={2}
                        value={formData.businessObjective || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, businessObjective: e.target.value }))}
                        className="text-xs resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                        Problem Statement
                      </label>
                      <Textarea
                        rows={2}
                        value={formData.problemStatement || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, problemStatement: e.target.value }))}
                        className="text-xs resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                        Expected Outcome
                      </label>
                      <Textarea
                        rows={2}
                        value={formData.expectedBusinessOutcome || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, expectedBusinessOutcome: e.target.value }))}
                        className="text-xs resize-none text-emerald-700 dark:text-emerald-400 font-medium"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* Card 2: Model Architecture & Training Optimization */}
            <Card id="section-architecture" className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold">Model Architecture & GPU Optimization</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-600 text-white text-xs font-semibold">
                        Status: {record.trainingMetrics.trainingStatus}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsRetrainModalOpen(true)}
                        className="h-7 text-xs gap-1 cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3 text-blue-600" />
                        Retrain Job
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">AI Category</span>
                      <span className="font-semibold text-foreground text-xs">{record.architectureConfig.aiCategory}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Model Type</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">{record.architectureConfig.modelType}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Framework</span>
                      <span className="font-semibold text-foreground text-xs">{record.architectureConfig.framework}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Language</span>
                      <span className="font-semibold text-foreground text-xs">{record.architectureConfig.language}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Hyperparameters & Model Configuration
                    </span>
                    <p className="font-mono text-xs text-foreground font-medium">{record.architectureConfig.hyperparameters}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Strategy</span>
                      <span className="font-semibold text-foreground text-xs truncate block">{record.trainingMetrics.strategy}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Optimizer</span>
                      <span className="font-mono font-semibold text-foreground text-xs">{record.trainingMetrics.optimizer}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Loss Function</span>
                      <span className="font-mono font-semibold text-foreground text-xs">{record.trainingMetrics.lossFunction}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Batch / Epochs</span>
                      <span className="font-mono font-semibold text-foreground text-xs">{record.trainingMetrics.batchSize} / {record.trainingMetrics.epochs}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-blue-200/80 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/30 flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-medium">Hardware & GPU Allocation:</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">{record.trainingMetrics.gpuUtilization}</span>
                  </div>
                </CardContent>
              </Card>

            {/* Card 3: Dataset Quality & Partitioning */}
            <Card id="section-dataset" className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold">Dataset Quality & Partitioning</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">{record.datasetConfig.datasetName}</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setUploadTargetType("dataset");
                          setIsUploadOpen(true);
                        }}
                        className="gap-1 text-xs h-7 cursor-pointer"
                      >
                        <Upload className="h-3 w-3" />
                        Upload Partition
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  {/* 5 Quality Metrics */}
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: "Quality", val: record.datasetConfig.dataQualityScore, color: "text-blue-600 dark:text-blue-400" },
                      { label: "Complete", val: record.datasetConfig.completeness, color: "text-foreground" },
                      { label: "Consistent", val: record.datasetConfig.consistency, color: "text-foreground" },
                      { label: "Accuracy", val: record.datasetConfig.accuracy, color: "text-foreground" },
                      { label: "Timely", val: record.datasetConfig.timeliness, color: "text-foreground" },
                    ].map((metric, idx) => (
                      <div key={idx} className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-1">
                        <span className="text-[10px] text-muted-foreground block font-medium truncate">{metric.label}</span>
                        <span className={`text-xs font-bold font-mono ${metric.color}`}>{metric.val}%</span>
                        <Progress value={metric.val} className="h-1" />
                      </div>
                    ))}
                  </div>

                  {/* Partitions List */}
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
                    {partitions.map((partition, i) => (
                      <div key={i} className="p-2.5 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileSpreadsheet className="h-4 w-4 text-blue-500 shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-foreground block truncate">{partition.type}</span>
                            <span className="font-mono text-muted-foreground text-[10px] truncate">{partition.file}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 text-slate-600 dark:text-slate-400 text-[11px]">
                          <span className="font-mono">{partition.size}</span>
                          <span className="font-mono hidden sm:inline">{partition.records}</span>
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0">{partition.status}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 cursor-pointer"
                            title="Inspect Dataset Sample"
                            onClick={() => handleInspectDataset(partition.file)}
                          >
                            <Eye className="h-3 w-3 text-slate-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 cursor-pointer"
                            title="Download Sample CSV"
                            onClick={() => handleDownloadPartition(partition.file)}
                          >
                            <Download className="h-3 w-3 text-slate-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            {/* Card 4: Feature Store & SHAP Attribution Rankings */}
            <Card id="section-features" className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold">Feature Store & SHAP Attribution Rankings</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-600 text-white text-xs font-bold">
                        Score: {record.featureConfig.featureReadinessScore}/100
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsAddFeatureOpen(true)}
                        className="h-7 text-xs gap-1 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        Add Feature
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Method</span>
                      <span className="font-semibold text-foreground text-xs truncate block">{record.featureConfig.selectionMethod}</span>
                    </div>
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Scaling</span>
                      <span className="font-semibold text-foreground text-xs truncate block">{record.featureConfig.scaling}</span>
                    </div>
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Imputation</span>
                      <span className="font-semibold text-foreground text-xs truncate block">{record.featureConfig.missingValueStrategy}</span>
                    </div>
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Pipeline</span>
                      <span className="font-semibold text-foreground text-xs truncate block">{record.featureConfig.preprocessing}</span>
                    </div>
                  </div>

                  {/* SHAP Ranked Features */}
                  <div className="space-y-1.5">
                    {featureList.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                        <span className="w-36 font-mono font-medium text-foreground text-xs truncate">{feat.name}</span>
                        <div className="flex-1">
                          <Progress value={feat.score * 100} className="h-1.5" />
                        </div>
                        <span className="w-10 text-right font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                          {(feat.score * 100).toFixed(0)}%
                        </span>
                        <Badge variant="outline" className="text-[9px] w-20 justify-center py-0">{feat.type}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFeature(feat.name)}
                          className="h-6 w-6 text-muted-foreground hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            {/* Card 5: Model Evaluation & Confusion Matrix */}
            <Card id="section-evaluation" className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold">Model Evaluation & Confusion Matrix</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-600 text-white font-mono text-xs font-semibold">
                        Score: {record.evaluationMetrics.evaluationScore}/100
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsRocModalOpen(true)}
                        className="h-7 text-xs gap-1 cursor-pointer"
                      >
                        <LineChart className="h-3 w-3" />
                        ROC Curve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleExportConfusionMatrix}
                        className="h-7 text-xs gap-1 cursor-pointer"
                      >
                        <Download className="h-3 w-3" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  {/* 5 Metrics Tiles */}
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-0.5">
                      <span className="text-muted-foreground block text-[10px]">Accuracy</span>
                      <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 font-mono">{record.evaluationMetrics.accuracy}%</span>
                    </div>
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-0.5">
                      <span className="text-muted-foreground block text-[10px]">Precision</span>
                      <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{record.evaluationMetrics.precision}%</span>
                    </div>
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-0.5">
                      <span className="text-muted-foreground block text-[10px]">Recall</span>
                      <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{record.evaluationMetrics.recall}%</span>
                    </div>
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-0.5">
                      <span className="text-muted-foreground block text-[10px]">F1 Score</span>
                      <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400 font-mono">{record.evaluationMetrics.f1Score}%</span>
                    </div>
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-0.5">
                      <span className="text-muted-foreground block text-[10px]">ROC AUC</span>
                      <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 font-mono">{record.evaluationMetrics.rocAuc}</span>
                    </div>
                  </div>

                  {/* Confusion Matrix */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-muted-foreground">Classification Matrix</span>
                      <div className="flex items-center gap-1 border border-border rounded p-0.5">
                        <button
                          type="button"
                          onClick={() => setConfusionMode("counts")}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${confusionMode === "counts" ? "bg-primary text-white" : "text-muted-foreground"}`}
                        >
                          Counts
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfusionMode("percent")}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${confusionMode === "percent" ? "bg-primary text-white" : "text-muted-foreground"}`}
                        >
                          Percent (%)
                        </button>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <table className="w-full text-center border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-950 font-bold text-slate-700 dark:text-slate-300 border-b border-border/80">
                            <th className="p-2 text-left font-semibold text-muted-foreground">Actual \ Predicted</th>
                            <th className="p-2 font-bold">Low Demand</th>
                            <th className="p-2 font-bold">Med Demand</th>
                            <th className="p-2 font-bold">High Demand</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {[
                            { label: "Low Demand", vals: record.evaluationMetrics.confusionMatrix[0], total: 850 },
                            { label: "Med Demand", vals: record.evaluationMetrics.confusionMatrix[1], total: 558 },
                            { label: "High Demand", vals: record.evaluationMetrics.confusionMatrix[2], total: 557 },
                          ].map((row, rIdx) => (
                            <tr key={rIdx}>
                              <td className="p-2 bg-slate-50/40 dark:bg-slate-950/40 font-bold text-left">{row.label}</td>
                              {row.vals.map((val, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`p-2 font-mono font-bold ${
                                    rIdx === cIdx
                                      ? "bg-blue-600/15 text-blue-700 dark:text-blue-300"
                                      : "bg-red-500/5 text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {confusionMode === "counts" ? val : `${((val / row.total) * 100).toFixed(1)}%`}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* Card 6: AI Governance, Responsible AI & Drift Diagnostics */}
            <Card id="section-governance" className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold">AI Governance, Responsible AI & Drift</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-600 text-white font-mono text-xs font-semibold">
                        Score: {record.governancePolicy.governanceScore}/100
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsBiasModalOpen(true)}
                        className="h-7 text-xs gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="h-3 w-3" />
                        Audit Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-0.5">
                      <span className="text-muted-foreground block text-[10px]">Explainability</span>
                      <span className="font-bold text-foreground text-xs">{record.governancePolicy.explainabilityMethod}</span>
                    </div>
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-0.5">
                      <span className="text-muted-foreground block text-[10px]">Bias Detection</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">{record.governancePolicy.biasDetection}</span>
                    </div>
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-0.5">
                      <span className="text-muted-foreground block text-[10px]">Compliance</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-xs">{record.governancePolicy.privacyCompliance}</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800">
                    {[
                      { title: "Fairness Assessment", detail: record.governancePolicy.fairnessAssessment, status: "Passed" },
                      { title: "Ethical Review Clearance", detail: "Cleared on 20 Jun 2024 by AI Ethics Committee.", status: "Passed" },
                      { title: "Risk Classification Level", detail: `Assigned: ${record.governancePolicy.riskClassification}`, status: "Medium Risk" },
                      { title: "Data Anonymization", detail: "All personal user identifiers scrubbed prior to training.", status: "Passed" },
                    ].map((item, i) => (
                      <div key={i} className="px-3 py-2 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-semibold text-foreground block">{item.title}</span>
                          <span className="text-muted-foreground text-[10px]">{item.detail}</span>
                        </div>
                        <Badge
                          variant="outline"
                          onClick={() => toast.info(`${item.title}: Audit certified and compliant.`)}
                          className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[9px] cursor-pointer hover:bg-emerald-100"
                        >
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground block">Drift Prediction</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isDriftScanning}
                          onClick={handleRunDriftScan}
                          className="h-5 px-1 text-[10px] text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          {isDriftScanning ? "Scanning..." : "Run Scan"}
                        </Button>
                      </div>
                      <span className="text-muted-foreground text-[10px] block leading-tight">{driftStatusText}</span>
                    </div>

                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground block">Security & Vulnerability</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 text-emerald-600">Zero CVEs</Badge>
                      </div>
                      <span className="text-muted-foreground text-[10px] block leading-tight">{record.aiAssessment.aiSecurityReview}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>

          {/* Section 3: DEPLOYMENT & MLOPS INFRASTRUCTURE */}
          <Card id="section-deployment" className="border-border bg-white dark:bg-slate-900 shadow-xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Deployment & MLOps Infrastructure</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-600 text-white text-xs font-semibold">
                      {record.mlopsDeployment.deploymentStatus}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePingEndpoint}
                      disabled={isPinging}
                      className="gap-1 text-xs h-7 cursor-pointer"
                    >
                      <Activity className="h-3 w-3 text-emerald-600" />
                      {isPinging ? "Pinging..." : pingLatency ? `${pingLatency}ms` : "Ping Health"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsInferenceModalOpen(true)}
                      className="gap-1 text-xs h-7 cursor-pointer"
                    >
                      <Terminal className="h-3 w-3" />
                      Test Endpoint
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[11px]">Platform</span>
                    <span className="font-bold text-foreground text-xs">{record.mlopsDeployment.platform}</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[11px]">Containerization</span>
                    <span className="font-bold text-foreground font-mono text-xs">{record.mlopsDeployment.containerization}</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[11px]">Model Registry</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-xs">{record.mlopsDeployment.registry}</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[11px]">CI/CD Pipeline</span>
                    <span className="font-bold text-foreground text-xs">{record.mlopsDeployment.cicdPipeline}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Production Inference Endpoint URL (REST API)
                    </span>
                    <span className="font-mono text-xs text-blue-600 dark:text-blue-400 block break-all font-semibold">
                      {record.mlopsDeployment.inferenceEndpoint}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(record.mlopsDeployment.inferenceEndpoint);
                        toast.success("Inference URL copied to clipboard!");
                      }}
                      className="gap-1 shrink-0 text-xs h-7 cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      Copy URL
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        toast.success("Redeployment triggered across Kubernetes cluster.");
                      }}
                      className="gap-1 shrink-0 text-xs h-7 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Sync Rollout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          {/* Section 4: PROJECT ATTACHMENTS & MODEL CARDS */}
          <Card id="section-attachments" className="border-border bg-white dark:bg-slate-900 shadow-xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Project Attachments & Model Cards</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{record.attachments.length} Files</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setUploadTargetType("attachment");
                        setIsUploadOpen(true);
                      }}
                      className="gap-1 text-xs h-7 cursor-pointer"
                    >
                      <Upload className="h-3 w-3" />
                      Upload File
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {record.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileCode className="h-4 w-4 text-blue-500 shrink-0" />
                        <div className="truncate">
                          <span className="font-semibold text-foreground block truncate" title={att.name}>{att.name}</span>
                          <span className="text-[10px] text-muted-foreground">{att.size} • {att.uploadedBy}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 cursor-pointer"
                          title="Preview Document"
                          onClick={() => setSelectedAttachment(att)}
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 cursor-pointer"
                          title="Download"
                          onClick={() => {
                            const sampleContent = `# ${att.name}\n\nDocument Type: ${att.type}\nAuthor: ${att.uploadedBy}\nDate: ${att.date}\n\nThis is the authentic document export for ${att.name} under AI Model Development AIMD-2024-0018.`;
                            triggerBrowserDownload(att.name.replace(".pdf", ".txt"), sampleContent);
                            toast.success(`Downloading ${att.name}`);
                          }}
                        >
                          <Download className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-red-500 cursor-pointer"
                          title="Delete"
                          onClick={() => handleDeleteAttachment(att.id, att.name)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          {/* Section 5: REVIEW & APPROVAL BOARD GOVERNANCE */}
          <Card id="section-review" className="border-border bg-white dark:bg-slate-900 shadow-xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Review & Approval Board Governance</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold border-amber-200">
                      AI Architecture Review Board
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddReviewerOpen(true)}
                      className="h-7 text-xs gap-1 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      Add Reviewer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-5 text-xs">
                {/* Executive Board Consensus Chips */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-muted-foreground uppercase tracking-wider">Board Evaluator Consensus (Click to Toggle)</span>
                    <span className="text-muted-foreground font-mono">
                      {record.reviewers.filter((r) => r.decision === "Approved" || r.decision === "Approved with Conditions").length} of {record.reviewers.length} Endorsed
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {record.reviewers.map((rev, i) => (
                      <div
                        key={i}
                        onClick={() => handleToggleReviewerDecision(i)}
                        className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer flex flex-col justify-between gap-1.5"
                        title="Click to cycle decision status"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-foreground text-xs truncate">{rev.person}</span>
                          <Badge
                            className={
                              rev.decision === "Approved"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 text-[9px] font-bold"
                                : rev.decision === "Approved with Conditions"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 text-[9px] font-bold"
                                : rev.decision === "Changes Requested"
                                ? "bg-red-100 text-red-800 dark:bg-red-950/60 text-[9px] font-bold"
                                : "bg-slate-200 text-slate-700 dark:bg-slate-800 text-[9px] font-medium"
                            }
                          >
                            {rev.decision}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="truncate">{rev.role}</span>
                          <span className="font-mono shrink-0">{rev.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sign-off Form */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                    Submit Executive Review Decision
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-[11px]">
                        Approval Decision <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.approvalDecision || record.approvalDecision || "Approved with Conditions"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            approvalDecision: e.target.value as AiModelApprovalDecision,
                          }))
                        }
                        className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <option value="Approved">Approved (Production Ready)</option>
                        <option value="Approved with Conditions">Approved with Conditions</option>
                        <option value="Changes Requested">Changes Requested</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-[11px]">
                        Review Comments
                      </label>
                      <Textarea
                        rows={2}
                        value={formData.reviewComments || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, reviewComments: e.target.value }))}
                        placeholder="Add approval remarks or instructions for MLOps..."
                        className="text-xs resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      size="sm"
                      onClick={() =>
                        reviewDecisionMutation.mutate({
                          id: record.id,
                          decision: (formData.approvalDecision as AiModelApprovalDecision) || record.approvalDecision || "Approved with Conditions",
                          comments: formData.reviewComments || record.reviewComments || "",
                        })
                      }
                      disabled={reviewDecisionMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 h-8 font-bold text-xs cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Save Decision
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          {/* Section 6: AUDIT TRAIL LOG */}
          <Card id="section-audit" className="border-border bg-white dark:bg-slate-900 shadow-xs scroll-mt-24">
            <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm font-bold">Audit Trail & Change History</CardTitle>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddAuditOpen(true)}
                className="h-7 text-xs gap-1 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Add Audit Note
              </Button>
            </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3 text-xs">
                  {record.auditTrail.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start justify-between p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{entry.action}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium">
                            {entry.user}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-[11px]">{entry.details}</p>
                      </div>
                      <div className="text-right text-[11px] text-slate-500 shrink-0">
                        <span>{entry.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

        </div>

        {/* Retrain Simulation Dialog */}
        <Dialog open={isRetrainModalOpen} onOpenChange={setIsRetrainModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                Live Model Retraining Console
              </DialogTitle>
              <DialogDescription className="text-xs">
                Configure training hyperparameters and trigger GPU execution
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Target Epochs</label>
                  <Input
                    type="number"
                    value={retrainEpochsTarget}
                    onChange={(e) => setRetrainEpochsTarget(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Learning Rate</label>
                  <Input
                    value={retrainLearningRate}
                    onChange={(e) => setRetrainLearningRate(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>Progress ({retrainEpoch} / {retrainEpochsTarget} Epochs)</span>
                  <span className="font-mono text-blue-600 font-bold">
                    {((retrainEpoch / retrainEpochsTarget) * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={(retrainEpoch / retrainEpochsTarget) * 100} className="h-2" />
              </div>

              <div className="h-44 rounded-lg bg-slate-950 p-3 font-mono text-[11px] text-emerald-400 overflow-y-auto space-y-1">
                {retrainLogs.length === 0 ? (
                  <span className="text-slate-500">Ready to start training job on NVIDIA A100 GPU cluster...</span>
                ) : (
                  retrainLogs.map((log, i) => <div key={i}>{log}</div>)
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={handleStartRetrain}
                disabled={isRetraining}
                className="bg-blue-600 text-white gap-1.5 h-8 font-bold text-xs cursor-pointer"
              >
                <Play className="h-3.5 w-3.5" />
                {isRetraining ? "Training in progress..." : "Start Retraining Job"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Inference Endpoint Tester Dialog */}
        <Dialog open={isInferenceModalOpen} onOpenChange={setIsInferenceModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Terminal className="h-5 w-5 text-purple-600" />
                Inference REST API Simulator
              </DialogTitle>
              <DialogDescription className="text-xs">
                Test live model response by simulating real-time vehicle charging requests
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-muted-foreground">Scenario Presets</label>
                  <div className="flex gap-1">
                    {inferencePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedPresetIndex(idx);
                          setInferencePayload(JSON.stringify(preset.payload, null, 2));
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                          selectedPresetIndex === idx ? "bg-purple-600 text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  value={inferencePayload}
                  onChange={(e) => setInferencePayload(e.target.value)}
                  className="font-mono h-32 text-xs bg-slate-950 text-slate-100 resize-none"
                />
              </div>

              {inferenceResult && (
                <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono space-y-1 text-xs">
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Status: {inferenceResult.status}</span>
                    <span>Latency: {inferenceResult.latency_ms} ms</span>
                  </div>
                  <div>Predicted Demand: {inferenceResult.predicted_demand_kwh} kWh</div>
                  <div>Confidence: {(inferenceResult.confidence_score * 100).toFixed(1)}%</div>
                  <div className="text-blue-400">
                    Top SHAP Feature: {inferenceResult.shap_top_feature}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={handleExecuteInference}
                disabled={isInferring}
                className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5 h-8 font-bold text-xs cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                {isInferring ? "Sending..." : "Execute Inference Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Responsible AI / Bias Inspector Dialog */}
        <Dialog open={isBiasModalOpen} onOpenChange={setIsBiasModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <ShieldCheck className="h-5 w-5 text-amber-500" />
                Responsible AI & Fairness Inspector
              </DialogTitle>
              <DialogDescription className="text-xs">
                Demographic parity and algorithmic fairness evaluation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold block text-slate-900 dark:text-white">
                  Demographic Parity Ratio
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-extrabold text-base">
                  0.982 (Satisfied &gt; 0.80 benchmark)
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold block text-slate-900 dark:text-white">
                  Disparate Impact Metric
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  No statistical disparity found across geographic charger regions.
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold block text-slate-900 dark:text-white">
                  Differential Privacy Guarantee
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  ε = 0.5 (Strict privacy budget verified against membership inference attacks).
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  triggerBrowserDownload(
                    "responsible_ai_certificate.json",
                    JSON.stringify({ model: "AIMD-2024-0018", status: "Certified", date: new Date().toISOString() }, null, 2),
                    "application/json",
                  );
                  toast.success("Governance certificate downloaded.");
                }}
                className="h-8 text-xs font-semibold gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                Export Certificate
              </Button>
              <Button size="sm" onClick={() => setIsBiasModalOpen(false)} className="h-8 text-xs font-bold">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Attachment Preview Modal */}
        <Dialog
          open={!!selectedAttachment}
          onOpenChange={(open) => !open && setSelectedAttachment(null)}
        >
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Eye className="h-5 w-5 text-blue-600" />
                {selectedAttachment?.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {selectedAttachment?.type} Document • {selectedAttachment?.size} • Uploaded by {selectedAttachment?.uploadedBy}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border text-xs space-y-3 max-h-80 overflow-y-auto font-mono">
              <div className="flex justify-between text-muted-foreground border-b pb-2">
                <span>File ID: {selectedAttachment?.id}</span>
                <span>SHA-256: 7f83b165...e921</span>
              </div>
              <div className="space-y-1.5 text-foreground">
                <p className="font-bold text-blue-600">[DOCUMENT CONTENT SUMMARY]</p>
                <p><strong>Title:</strong> {selectedAttachment?.name}</p>
                <p><strong>Scope:</strong> AI Model Development AIMD-2024-0018 (EV Demand Forecasting Model)</p>
                <p><strong>Status:</strong> Verified & Certified by {selectedAttachment?.uploadedBy}</p>
                <p className="text-slate-600 dark:text-slate-400 font-sans text-xs leading-relaxed pt-2">
                  This document contains authorized architecture blueprints, hyperparameter configurations, dataset schemas, validation logs, and ethical clearance forms for production rollout.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (selectedAttachment) {
                    const sampleContent = `# ${selectedAttachment.name}\n\nDocument Type: ${selectedAttachment.type}\nAuthor: ${selectedAttachment.uploadedBy}\nDate: ${selectedAttachment.date}\n\nThis is the authentic document export for ${selectedAttachment.name} under AI Model Development AIMD-2024-0018.`;
                    triggerBrowserDownload(selectedAttachment.name.replace(".pdf", ".txt"), sampleContent);
                    toast.success(`Downloading ${selectedAttachment.name}`);
                  }
                }}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Download Document
              </Button>
              <Button size="sm" onClick={() => setSelectedAttachment(null)} className="h-8 text-xs">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Universal Upload Modal */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                {uploadTargetType === "dataset" ? "Upload Dataset Partition" : "Upload Document / Model Card"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {uploadTargetType === "dataset"
                  ? "Add parquet or csv partition to dataset store"
                  : "Upload PDF report, architecture diagram, or model weights"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-semibold block mb-1">File Name</label>
                <Input
                  placeholder={uploadTargetType === "dataset" ? "ev_usage_july.parquet" : "model_evaluation_v2.pdf"}
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">File Size Estimate</label>
                <Input
                  placeholder="e.g. 2.4 MB or 180 GB"
                  value={uploadFileSize}
                  onChange={(e) => setUploadFileSize(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center space-y-1 bg-slate-50/50 dark:bg-slate-900/50">
                <Upload className="h-6 w-6 text-blue-600 mx-auto" />
                <span className="text-xs font-semibold block">Click or drag file to attach</span>
                <span className="text-[10px] text-muted-foreground block">
                  Supports .parquet, .csv, .pdf, .png up to 5 GB
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setIsUploadOpen(false)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleConfirmUpload} className="h-8 text-xs font-bold bg-blue-600 text-white">
                Upload & Verify
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Feature Dialog */}
        <Dialog open={isAddFeatureOpen} onOpenChange={setIsAddFeatureOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Add Feature to Store</DialogTitle>
              <DialogDescription className="text-xs">
                Register a new engineered feature with SHAP ranking attribution
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-semibold block mb-1">Feature Name</label>
                <Input
                  placeholder="e.g. ambient_humidity_pct"
                  value={newFeatureName}
                  onChange={(e) => setNewFeatureName(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">SHAP Importance (%)</label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={newFeatureScore}
                    onChange={(e) => setNewFeatureScore(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Data Type</label>
                  <select
                    value={newFeatureType}
                    onChange={(e) => setNewFeatureType(e.target.value as any)}
                    className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="Numeric">Numeric</option>
                    <option value="Categorical">Categorical</option>
                    <option value="Binary">Binary</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setIsAddFeatureOpen(false)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddFeature} className="h-8 text-xs font-bold bg-blue-600 text-white">
                Add Feature
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Reviewer Dialog */}
        <Dialog open={isAddReviewerOpen} onOpenChange={setIsAddReviewerOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Add Board Reviewer</DialogTitle>
              <DialogDescription className="text-xs">
                Assign an evaluator or stakeholder to the AI Architecture Review Board
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-semibold block mb-1">Reviewer Name</label>
                <Input
                  placeholder="e.g. Priya Sen"
                  value={newReviewerPerson}
                  onChange={(e) => setNewReviewerPerson(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Board Role</label>
                <select
                  value={newReviewerRole}
                  onChange={(e) => setNewReviewerRole(e.target.value)}
                  className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="AI Ethics Officer">AI Ethics Officer</option>
                  <option value="Security Auditor">Security Auditor</option>
                  <option value="ML Infrastructure Lead">ML Infrastructure Lead</option>
                  <option value="Domain Specialist">Domain Specialist</option>
                  <option value="VP of Engineering">VP of Engineering</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setIsAddReviewerOpen(false)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddReviewer} className="h-8 text-xs font-bold bg-blue-600 text-white">
                Assign Reviewer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ROC Curve Dialog */}
        <Dialog open={isRocModalOpen} onOpenChange={setIsRocModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <LineChart className="h-5 w-5 text-blue-600" />
                ROC Curve Benchmark
              </DialogTitle>
              <DialogDescription className="text-xs">
                Receiver Operating Characteristic (ROC AUC = 0.94)
              </DialogDescription>
            </DialogHeader>
            <div className="py-2 space-y-3">
              <div className="h-52 w-full rounded-lg bg-slate-950 p-4 flex items-end justify-center relative">
                <svg className="w-full h-full" viewBox="0 0 200 150">
                  {/* Grid lines */}
                  <line x1="20" y1="130" x2="190" y2="130" stroke="#334155" strokeWidth="1" />
                  <line x1="20" y1="20" x2="20" y2="130" stroke="#334155" strokeWidth="1" />
                  {/* Diagonal baseline */}
                  <line x1="20" y1="130" x2="190" y2="20" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                  {/* ROC Curve */}
                  <path
                    d="M 20 130 Q 35 30, 190 20"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />
                  <text x="70" y="70" fill="#60a5fa" fontSize="10" fontFamily="sans-serif">AUC = 0.94</text>
                  <text x="25" y="145" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">False Positive Rate</text>
                  <text x="10" y="25" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">TPR</text>
                </svg>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                High sensitivity achieved across all demand tiers with low false discovery.
              </p>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsRocModalOpen(false)} className="h-8 text-xs font-bold">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Inspect Dataset Dialog */}
        <Dialog open={!!inspectDataset} onOpenChange={(open) => !open && setInspectDataset(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                Inspect Dataset Sample: {inspectDataset?.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Showing top 5 verified schema records from parquet partition
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-lg border border-border overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <tr>
                    <th className="p-2">Record ID</th>
                    <th className="p-2">Timestamp</th>
                    <th className="p-2">Station</th>
                    <th className="p-2">Demand (kWh)</th>
                    <th className="p-2">Temperature</th>
                    <th className="p-2">Holiday</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {inspectDataset?.rows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 font-mono">
                      <td className="p-2 font-bold text-blue-600">{r.id}</td>
                      <td className="p-2 text-muted-foreground">{r.time}</td>
                      <td className="p-2">{r.station}</td>
                      <td className="p-2 font-bold">{r.kwh}</td>
                      <td className="p-2">{r.temp}</td>
                      <td className="p-2">{r.holiday}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (inspectDataset) handleDownloadPartition(inspectDataset.name);
                }}
                className="h-8 text-xs gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                Download Sample CSV
              </Button>
              <Button size="sm" onClick={() => setInspectDataset(null)} className="h-8 text-xs">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reference Modals */}
        <Dialog open={!!activeRefModal} onOpenChange={(open) => !open && setActiveRefModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                {activeRefModal === "product"
                  ? "Linked Product Information"
                  : activeRefModal === "cloud"
                  ? "Linked Cloud Platform Infrastructure"
                  : "AI Lead Engineer Profile"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Enterprise system reference details
              </DialogDescription>
            </DialogHeader>
            <div className="py-2 text-xs space-y-2">
              {activeRefModal === "product" && (
                <div className="space-y-3">
                  <div className="p-2.5 rounded bg-muted">
                    <span className="text-muted-foreground block text-[11px]">Product Line</span>
                    <span className="font-bold text-foreground text-sm">Smart EV Platform (v2.4.0)</span>
                  </div>
                  <p className="text-muted-foreground">
                    Connected commercial charging operating system managing 4,200 fast chargers across nationwide depots.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setActiveRefModal(null);
                      navigate({ to: "/development/research-innovation/prd/new" });
                    }}
                    className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white cursor-pointer gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Navigate to Product PRD
                  </Button>
                </div>
              )}
              {activeRefModal === "cloud" && (
                <div className="space-y-3">
                  <div className="p-2.5 rounded bg-muted">
                    <span className="text-muted-foreground block text-[11px]">Platform Cluster</span>
                    <span className="font-bold text-foreground text-sm">AWS us-east-1 (Kubernetes 1.28)</span>
                  </div>
                  <p className="text-muted-foreground">
                    Allocated with 4x NVIDIA A100 (80GB) nodes on EKS with auto-scaling inference endpoints.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setActiveRefModal(null);
                      navigate({ to: "/development/research-innovation/cloud-platform-development/new" });
                    }}
                    className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white cursor-pointer gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Navigate to Cloud Platform
                  </Button>
                </div>
              )}
              {activeRefModal === "engineer" && (
                <div className="space-y-3">
                  <div className="p-2.5 rounded bg-muted">
                    <span className="text-muted-foreground block text-[11px]">Lead AI Engineer</span>
                    <span className="font-bold text-foreground text-sm">Rahul Sharma (rahul.sharma@magnertia.com)</span>
                  </div>
                  <p className="text-muted-foreground">
                    Staff Machine Learning Engineer, EV Mobility Division. Specializes in spatio-temporal time-series forecasting.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText("rahul.sharma@magnertia.com");
                      toast.success("Lead AI Engineer email copied to clipboard!");
                    }}
                    className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white cursor-pointer gap-1.5"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy Email Address
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setActiveRefModal(null)} className="h-8 text-xs">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Audit Note Dialog */}
        <Dialog open={isAddAuditOpen} onOpenChange={setIsAddAuditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Add Manual Audit Log Entry</DialogTitle>
              <DialogDescription className="text-xs">
                Record an engineering milestone, model test result, or operational remark
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddAuditNote} className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-semibold block mb-1">Action Title *</label>
                <Input
                  placeholder="e.g. Completed Stress Test on A100 GPU"
                  value={newAuditAction}
                  onChange={(e) => setNewAuditAction(e.target.value)}
                  className="h-8 text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Log Details / Technical Notes *</label>
                <Textarea
                  placeholder="Describe the milestone or review observations..."
                  value={newAuditDetails}
                  onChange={(e) => setNewAuditDetails(e.target.value)}
                  className="text-xs resize-none"
                  rows={3}
                  required
                />
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" type="button" onClick={() => setIsAddAuditOpen(false)} className="h-8 text-xs cursor-pointer">
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="h-8 text-xs font-bold bg-blue-600 text-white cursor-pointer">
                  Record Log
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default AiModelDevelopmentNewPage;
