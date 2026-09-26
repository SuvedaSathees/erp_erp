import {
  getCompetitiveAnalysisFn,
  saveCompetitiveAnalysisDraftFn,
  submitCompetitiveAnalysisFn,
  reviewCompetitiveAnalysisFn,
  generateCompetitiveAnalysisReportFn,
} from "@/lib/competitiveAnalysisFns.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<any> {
  return unwrap<any>(await getCompetitiveAnalysisFn());
}

export async function saveDraft(input: any, id?: string): Promise<any> {
  return unwrap<any>(await saveCompetitiveAnalysisDraftFn({ data: { id, input } }));
}

export async function submitForReview(id: string): Promise<any> {
  return unwrap<any>(await submitCompetitiveAnalysisFn({ data: id }));
}

export async function reviewDecision(args: {
  id: string;
  decision: string;
  comments?: string;
}): Promise<any> {
  return unwrap<any>(await reviewCompetitiveAnalysisFn({ data: args }));
}

export async function generateReport(id: string): Promise<any> {
  return unwrap<any>(await generateCompetitiveAnalysisReportFn({ data: id }));
}

export const competitiveAnalysisService = {
  fetchRecord,
  saveDraft,
  submitForReview,
  reviewDecision,
  generateReport,
};
