import {
  DEFAULT_RECORD,
  getCertificationReadinessFn,
  reviewCertificationReadinessFn,
  saveCertificationReadinessDraftFn,
  submitCertificationReadinessFn,
} from "@/lib/certificationReadinessFns.server";
import type {
  CertificationApprovalDecision,
  CertificationFormInput,
  CertificationReadinessRecord,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<CertificationReadinessRecord> {
  try {
    const res = await getCertificationReadinessFn();
    return unwrap<CertificationReadinessRecord>(res);
  } catch (err) {
    console.warn("certificationReadinessService fetchRecord fallback:", err);
    return DEFAULT_RECORD;
  }
}

export async function saveDraft(
  input: Partial<CertificationFormInput>,
  id?: string
): Promise<CertificationReadinessRecord> {
  try {
    const res = await saveCertificationReadinessDraftFn({ data: { id, input } });
    return unwrap<CertificationReadinessRecord>(res);
  } catch (err) {
    console.warn("certificationReadinessService saveDraft fallback:", err);
    const existing = await fetchRecord();
    const updated: CertificationReadinessRecord = {
      ...existing,
      certificationProjectName: input.certificationProjectName ?? existing.certificationProjectName,
      certificationObjective: input.certificationObjective ?? existing.certificationObjective,
      priority: input.priority ?? existing.priority,
      targetMarkets: input.targetMarket
        ? [input.targetMarket, ...(existing.targetMarkets || [])].filter((v, i, a) => a.indexOf(v) === i)
        : existing.targetMarkets,
      regulatoryAuthorities: input.regulatoryAuthority
        ? [input.regulatoryAuthority, ...(existing.regulatoryAuthorities || [])].filter((v, i, a) => a.indexOf(v) === i)
        : existing.regulatoryAuthorities,
      lastUpdated: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    return updated;
  }
}

export async function submitForReview(id?: string): Promise<CertificationReadinessRecord> {
  try {
    const res = await submitCertificationReadinessFn({ data: id });
    return unwrap<CertificationReadinessRecord>(res);
  } catch (err) {
    console.warn("certificationReadinessService submitForReview fallback:", err);
    const existing = await fetchRecord();
    const updated: CertificationReadinessRecord = {
      ...existing,
      workflowStatus: "In Review",
      lastUpdated: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    return updated;
  }
}

export async function reviewDecision(args: {
  id: string;
  decision: CertificationApprovalDecision;
  comments?: string;
}): Promise<CertificationReadinessRecord> {
  try {
    const res = await reviewCertificationReadinessFn({ data: args });
    return unwrap<CertificationReadinessRecord>(res);
  } catch (err) {
    console.warn("certificationReadinessService reviewDecision fallback:", err);
    const existing = await fetchRecord();
    const updated: CertificationReadinessRecord = {
      ...existing,
      workflowStatus: args.decision === "Approved" ? "Approved" : args.decision === "Approved with Conditions" ? "Approved" : "In Review",
      lastUpdated: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    return updated;
  }
}

export const certificationReadinessService = {
  fetchRecord,
  saveDraft,
  submitForReview,
  reviewDecision,
};
