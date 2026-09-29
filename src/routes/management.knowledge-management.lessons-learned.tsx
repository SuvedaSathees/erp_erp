// Magnertia ERP - Lessons Learned Module
// Management -> Knowledge Management -> Lessons Learned
// Lessons Learned Form — MAICW Classification, RCA, Corrective/Preventive Actions, and Knowledge Reuse

import React, { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getLessonsLearnedRecordFn } from "@/lib/lessonsLearnedFns.server";
import {
  FileText,
  FileCheck,
  Plus,
  Upload,
  Download,
  Printer,
  Search,
  Filter,
  Eye,
  ExternalLink,
  ChevronRight,
  Shield,
  ShieldCheck,
  Save,
  Check,
  X,
  Building,
  UserCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Sliders,
  History,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  Share2,
  FileSpreadsheet,
  Link as LinkIcon,
  ChevronDown,
  Layers,
  Award,
  Box,
  Lock,
  Lightbulb,
  CheckCircle2,
  XCircle,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { KnowledgeTabBar } from "@/components/erp/KnowledgeManagementTabBar";
import { KnowledgeSubmoduleHeader } from "@/components/erp/KnowledgeSubmoduleHeader";
import {
  PRIMARY_LESSON_RECORD,
  LESSONS_EXECUTIVE_KPIS,
  LESSON_ACTIONS_LIST,
  LESSONS_BY_CATEGORY,
  LESSON_AI_INSIGHTS,
  LESSONS_MASTER_REGISTER,
  type LessonRecord,
  type ActionItem,
} from "@/services/lessonsLearnedService";

export const Route = createFileRoute("/management/knowledge-management/lessons-learned")({
  head: () => ({
    meta: [
      { title: "Lessons Learned · Knowledge · Magnertia ERP" },
      {
        name: "description",
        content:
          "Organizational Lessons Learned repository, root cause analysis, preventive action feedback loop, and knowledge reuse tracking.",
      },
    ],
  }),
  component: LessonsLearnedPage,
});

function LessonsLearnedPage() {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "register"
    | "create-edit"
    | "rca"
    | "actions"
    | "approval"
    | "reuse"
    | "analytics"
    | "settings"
  >("overview");

  // Controlled form state
  const { data: dbRecord } = useQuery({
    queryKey: ["lessons-learned", "record"],
    queryFn: () => getLessonsLearnedRecordFn({ data: {} }),
  });

  const [formData, setFormData] = useState<LessonRecord>(PRIMARY_LESSON_RECORD);
  useEffect(() => { if (dbRecord?.data) setFormData(dbRecord.data); }, [dbRecord]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lessonRegister, setLessonRegister] = useState<LessonRecord[]>(LESSONS_MASTER_REGISTER);
  const [actionTab, setActionTab] = useState<"corrective" | "preventive" | "recommendations">("corrective");
  const [actionsList, setActionsList] = useState<ActionItem[]>(LESSON_ACTIONS_LIST);
  const [newLessonModal, setNewLessonModal] = useState(false);

  // Register filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  const filteredRegister = useMemo(() => {
    return lessonRegister.filter((lesson) => {
      const matchType = filterType === "All" || lesson.lessonType === filterType;
      const matchSearch =
        lesson.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.lessonId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [lessonRegister, searchQuery, filterType]);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <AppShell
      title="Lessons Learned"
      breadcrumb="Management > Knowledge > Lessons Learned"
      description="Continuous improvement repository, post-mortem project learnings, root cause prevention, and engineering insights."
      tabs={<KnowledgeTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Save Banner */}
        {saveSuccess && (
          <div className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold shadow-md animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Lesson learned captured and linked to Organizational Knowledge Base!</span>
            </div>
            <button onClick={() => setSaveSuccess(false)} className="text-white/80 hover:text-white cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* TOP EXECUTIVE COMMAND HEADER */}
        <KnowledgeSubmoduleHeader
          icon={Lightbulb}
          title="Lessons Learned"
          code="LL-2026-001"
          version="v1.0"
          status="Active"
          subtitle="Operational Insights. Root Cause Prevention. Continuous Improvement."
          onSave={handleSave}
          onSubmit={() => {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
          }}
          onGenerateReport={() => setActiveTab("analytics")}
          moreActions={[
            {
              label: activeTab === "register" ? "View Controlled Form" : "View Lesson Register",
              icon: FileText,
              onClick: () => setActiveTab(activeTab === "register" ? "overview" : "register"),
            },
          ]}
        />

        {/* 6 Top KPI Cards matching Screenshot 4 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Total Lessons */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{LESSONS_EXECUTIVE_KPIS.totalLessons}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Total Lessons</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {LESSONS_EXECUTIVE_KPIS.totalChange}%</span>
            </div>
          </div>

          {/* 2. Approved Lessons */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-emerald-500 text-white">
                <Check className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{LESSONS_EXECUTIVE_KPIS.approvedLessons}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Approved Lessons</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {LESSONS_EXECUTIVE_KPIS.approvedChange}%</span>
            </div>
          </div>

          {/* 3. Under Review */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-amber-500 text-white">
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{LESSONS_EXECUTIVE_KPIS.underReview}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Under Review</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span>↓ {Math.abs(LESSONS_EXECUTIVE_KPIS.underReviewChange)}%</span>
            </div>
          </div>

          {/* 4. Open Actions */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-red-500 text-white">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{LESSONS_EXECUTIVE_KPIS.openActions}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Open Actions</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span>↓ {Math.abs(LESSONS_EXECUTIVE_KPIS.openActionsChange)}%</span>
            </div>
          </div>

          {/* 5. Times Reused */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-600 text-white">
                <Share2 className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{LESSONS_EXECUTIVE_KPIS.timesReused}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Times Reused</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {LESSONS_EXECUTIVE_KPIS.timesReusedChange}%</span>
            </div>
          </div>

          {/* 6. Implementation Rate */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-teal-600 text-white">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{LESSONS_EXECUTIVE_KPIS.implementationRate}%</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Implementation Rate</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {LESSONS_EXECUTIVE_KPIS.implementationRateChange}%</span>
            </div>
          </div>
        </div>

        {/* Tab: Lesson Register */}
        {activeTab === "register" ? (
          <div className="bg-card rounded-xl border border-border p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div>
                <h2 className="text-sm font-bold text-foreground">Lessons Learned Register</h2>
                <p className="text-xs text-muted-foreground">Historical failure analysis and prevention catalog</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search lessons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background font-semibold"
                >
                  <option value="All">All Types</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Quality">Quality</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Project">Project</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold bg-muted/20">
                    <th className="py-2.5 px-3">Lesson ID</th>
                    <th className="py-2.5 px-3">Lesson Title</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Project</th>
                    <th className="py-2.5 px-3">Owner</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRegister.map((lesson) => (
                    <tr
                      key={lesson.lessonId}
                      onClick={() => {
                        setFormData(lesson);
                        setActiveTab("overview");
                      }}
                      className="hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{lesson.lessonId}</td>
                      <td className="py-2.5 px-3 font-medium text-foreground max-w-xs truncate">{lesson.lessonTitle}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{lesson.knowledgeCategory}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{lesson.project}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{lesson.lessonOwner}</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {lesson.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(lesson);
                            setActiveTab("overview");
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 rounded"
                        >
                          View Form
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Main Dashboard: Sections 1 through 12 matching Screenshot 4 */
          <div className="space-y-4">
            {/* Top Grid: Section 1, 2, 3, 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Section 1: Lesson Header (Col span 5) */}
              <div className="lg:col-span-5 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">1. Lesson Header</h2>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ● {formData.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Lesson ID</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.lessonId}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 font-mono text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Lesson Title *</label>
                    <input
                      type="text"
                      value={formData.lessonTitle}
                      onChange={(e) => setFormData({ ...formData, lessonTitle: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background font-semibold text-foreground text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Lesson Type *</label>
                    <select
                      value={formData.lessonType}
                      onChange={(e) => setFormData({ ...formData, lessonType: e.target.value as any })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Project">Project</option>
                      <option value="Quality">Quality</option>
                      <option value="Manufacturing">Manufacturing</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Knowledge Category *</label>
                    <select
                      value={formData.knowledgeCategory}
                      onChange={(e) => setFormData({ ...formData, knowledgeCategory: e.target.value as any })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    >
                      <option value="Product Development">Product Development</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Quality">Quality</option>
                      <option value="Project Management">Project Management</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Source Module</label>
                    <input
                      type="text"
                      value={formData.sourceModule}
                      readOnly
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 text-muted-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Source Record</label>
                    <input
                      type="text"
                      value={formData.sourceRecord}
                      onChange={(e) => setFormData({ ...formData, sourceRecord: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Process</label>
                    <input
                      type="text"
                      value={formData.process}
                      onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Project</label>
                    <input
                      type="text"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Lesson Owner *</label>
                    <div className="flex items-center gap-1.5 mt-1 px-2 py-1 rounded-lg border border-border bg-muted/20">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                        RS
                      </span>
                      <span className="font-semibold text-foreground text-xs">{formData.lessonOwner}</span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-semibold text-muted-foreground">Organization</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Branch / Site</label>
                    <input
                      type="text"
                      value={formData.branchSite}
                      onChange={(e) => setFormData({ ...formData, branchSite: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Date Captured</label>
                    <input
                      type="text"
                      value={formData.dateCaptured}
                      onChange={(e) => setFormData({ ...formData, dateCaptured: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Issue / Event (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">2. Issue / Event</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                      ● High Severity
                    </span>
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      ● High Priority
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground">Issue ID: </span>
                    <span className="font-mono font-semibold text-blue-600">{formData.issueId}</span>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Problem Statement</label>
                    <div className="mt-0.5 p-2 rounded-lg bg-muted/20 border border-border text-foreground text-[11px]">
                      {formData.problemStatement}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">What Happened? *</label>
                    <div className="mt-0.5 p-2 rounded-lg bg-muted/20 border border-border text-foreground text-[11px]">
                      {formData.whatHappened}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div>
                      <div className="text-[10px] text-muted-foreground">Expected Condition</div>
                      <div className="text-foreground">{formData.expectedCondition}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">Actual Condition</div>
                      <div className="font-semibold text-rose-600">{formData.actualCondition}</div>
                    </div>
                  </div>

                  <div className="pt-1 text-[11px]">
                    <span className="text-[10px] text-muted-foreground">Detection: </span>
                    <span className="text-foreground">{formData.detectionMethod} ({formData.detectionDate})</span>
                  </div>

                  <div className="pt-1 text-[11px]">
                    <span className="text-[10px] text-muted-foreground">Impact: </span>
                    <span className="text-foreground">{formData.impact}</span>
                  </div>
                </div>
              </div>

              {/* Column 3: Section 3 & 4 (Col span 3) */}
              <div className="lg:col-span-3 space-y-4">
                {/* Section 3: Root Cause Analysis */}
                <div className="bg-card rounded-xl border border-border p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">3. Root Cause Analysis</h2>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <div className="text-[10px] text-muted-foreground">RCA Method</div>
                      <div className="font-bold text-foreground text-[11px]">{formData.rcaMethod}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">Root Cause</div>
                      <div className="font-semibold text-rose-600 text-[11px] leading-tight">
                        {formData.rootCause}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">Contributing Factors</div>
                      <div className="text-muted-foreground text-[11px] leading-tight">
                        {formData.contributingFactors}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("rca")}
                    className="w-full mt-1 text-center text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer pt-1 border-t border-border"
                  >
                    View Full RCA Details
                  </button>
                </div>

                {/* Section 4: Actions & Recommendations */}
                <div className="bg-card rounded-xl border border-border p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">4. Actions & Recommendations</h2>
                  </div>

                  <div className="flex items-center gap-1 border-b border-border pb-1 text-[10px]">
                    <button
                      onClick={() => setActionTab("corrective")}
                      className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                        actionTab === "corrective" ? "bg-blue-600 text-white" : "text-muted-foreground"
                      }`}
                    >
                      Corrective
                    </button>
                    <button
                      onClick={() => setActionTab("preventive")}
                      className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                        actionTab === "preventive" ? "bg-blue-600 text-white" : "text-muted-foreground"
                      }`}
                    >
                      Preventive
                    </button>
                    <button
                      onClick={() => setActionTab("recommendations")}
                      className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                        actionTab === "recommendations" ? "bg-blue-600 text-white" : "text-muted-foreground"
                      }`}
                    >
                      Recs
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {actionsList.map((item) => (
                      <div key={item.id} className="p-1.5 rounded-lg border border-border/60 bg-muted/20 text-[11px] space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground truncate max-w-[120px]">{item.description}</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              item.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700"
                                : item.status === "In Progress"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground flex justify-between">
                          <span>{item.owner}</span>
                          <span>Due: {item.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Grid: Section 5, 6, 7 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Section 5: What Went Well? (Col span 4) */}
              <div className="lg:col-span-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-4 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <h2 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">5. What Went Well?</h2>
                </div>
                <div className="space-y-2 text-xs">
                  {formData.whatWentWell.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span className="text-emerald-900 dark:text-emerald-200 text-[11px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 6: What Failed? (Col span 4) */}
              <div className="lg:col-span-4 bg-rose-50/40 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800 p-4 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-rose-200 dark:border-rose-800">
                  <XCircle className="h-4 w-4 text-rose-600" />
                  <h2 className="text-sm font-bold text-rose-900 dark:text-rose-100">6. What Failed?</h2>
                </div>
                <div className="space-y-2 text-xs">
                  {formData.whatFailed.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span className="text-rose-900 dark:text-rose-200 text-[11px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 7: Applicability & Tags (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">7. Applicability & Tags</h2>
                </div>

                <div>
                  <div className="text-[10px] text-muted-foreground font-semibold">Applicable Project Types</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.applicableProjectTypes.map((type) => (
                      <span key={type} className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted border border-border">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <div className="text-[10px] text-muted-foreground font-semibold">Tags</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Section 8, 9, 10, 11, 12 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Section 8: Related Documents (Col span 3) */}
              <div className="lg:col-span-3 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-1 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">8. Related Documents</h2>
                    <button onClick={handleSave} className="text-[10px] text-blue-600 font-semibold cursor-pointer">
                      + Add Document
                    </button>
                  </div>

                  <div className="space-y-1.5 text-[11px] mt-2">
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="font-medium text-foreground">Field_Test_Report.pdf</span>
                      <span className="text-muted-foreground">13-Aug</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="font-medium text-foreground">Sensor_Log_Data.xlsx</span>
                      <span className="text-muted-foreground">12-Aug</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-foreground">RCA_Worksheet.pdf</span>
                      <span className="text-muted-foreground">14-Aug</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 9: Knowledge Reuse (Col span 3) */}
              <div className="lg:col-span-3 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-1 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">9. Knowledge Reuse</h2>
                    <button onClick={handleSave} className="text-[10px] text-blue-600 font-semibold cursor-pointer">
                      View All
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center pt-1">
                    <div className="p-1.5 rounded-lg bg-emerald-50/50 border border-emerald-200">
                      <div className="text-sm font-bold text-emerald-700">12 Times</div>
                      <div className="text-[9px] text-muted-foreground">Reused ↑ 71%</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-blue-50/50 border border-blue-200">
                      <div className="text-sm font-bold text-blue-700">6 Projects</div>
                      <div className="text-[9px] text-muted-foreground">Applied ↑ 50%</div>
                    </div>
                  </div>

                  <div className="space-y-1 text-[10px] text-muted-foreground pt-1.5">
                    <div>PRJ-2026-008: Next Gen Docking v1</div>
                    <div>PRJ-2026-012: Highway Charger Pilot</div>
                  </div>
                </div>
              </div>

              {/* Section 10 & 11: Stepper & Category Bar Chart (Col span 3) */}
              <div className="lg:col-span-3 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">11. Lessons by Category</h2>
                  <span className="text-[10px] text-muted-foreground">This Year</span>
                </div>

                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={LESSONS_BY_CATEGORY} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="name" tick={{ fontSize: 8 }} />
                      <YAxis tick={{ fontSize: 8 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Section 12: AI Insights (Col span 3) */}
              <div className="lg:col-span-3 bg-linear-to-br from-purple-500/5 to-transparent rounded-xl border border-purple-500/20 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 pb-1 border-b border-border">
                    <div className="p-1 rounded bg-purple-600 text-white">
                      <Sparkles className="h-3 w-3" />
                    </div>
                    <h2 className="text-sm font-bold text-foreground">12. AI Insights</h2>
                  </div>

                  <div className="space-y-1.5 mt-1 text-xs">
                    {LESSON_AI_INSIGHTS.slice(0, 3).map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1 shrink-0" />
                        <span className="text-muted-foreground text-[10px] leading-tight">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-1 border-t border-border text-[10px] text-blue-600 font-semibold cursor-pointer text-right">
                  View Full AI Analysis →
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: New Lesson */}
        {newLessonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-card rounded-2xl border border-border p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground">Capture Lesson Learned</h3>
                <button onClick={() => setNewLessonModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-muted-foreground">Lesson Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Inrush Current Overheating in Inverter Stage"
                    className="w-full mt-1 p-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground">Problem Statement</label>
                  <textarea
                    rows={2}
                    placeholder="Describe what occurred during testing or operations..."
                    className="w-full mt-1 p-2 rounded-lg border border-border bg-background resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setNewLessonModal(false)}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setNewLessonModal(false);
                    handleSave();
                  }}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                >
                  Log Lesson
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
