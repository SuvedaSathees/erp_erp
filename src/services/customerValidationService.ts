import {
  getCustomerValidationFn,
  saveCustomerValidationDraftFn,
  submitCustomerValidationFn,
  reviewCustomerValidationFn,
  generateCustomerValidationReportFn,
} from "@/lib/customerValidationFns.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<any> {
  return unwrap<any>(await getCustomerValidationFn());
}

export async function saveDraft(input: any, id?: string): Promise<any> {
  return unwrap<any>(await saveCustomerValidationDraftFn({ data: { id, input } }));
}

export async function submitForReview(id: string): Promise<any> {
  return unwrap<any>(await submitCustomerValidationFn({ data: id }));
}

export async function reviewDecision(args: {
  id: string;
  decision: string;
  comments?: string;
}): Promise<any> {
  return unwrap<any>(await reviewCustomerValidationFn({ data: args }));
}

export async function generateReport(id: string): Promise<any> {
  return unwrap<any>(await generateCustomerValidationReportFn({ data: id }));
}

export const customerValidationService = {
  fetchRecord,
  saveDraft,
  submitForReview,
  reviewDecision,
  generateReport,
};
