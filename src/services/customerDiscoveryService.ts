import {
  getCustomerDiscoveryFn,
  saveCustomerDiscoveryDraftFn,
  submitCustomerDiscoveryFn,
  reviewCustomerDiscoveryFn,
  generateCustomerDiscoveryReportFn,
} from "@/lib/customerDiscoveryFns.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<any> {
  return unwrap<any>(await getCustomerDiscoveryFn());
}

export async function saveDraft(input: any, id?: string): Promise<any> {
  return unwrap<any>(await saveCustomerDiscoveryDraftFn({ data: { id, input } }));
}

export async function submitForReview(id: string): Promise<any> {
  return unwrap<any>(await submitCustomerDiscoveryFn({ data: id }));
}

export async function reviewDecision(args: {
  id: string;
  decision: string;
  comments?: string;
}): Promise<any> {
  return unwrap<any>(await reviewCustomerDiscoveryFn({ data: args }));
}

export async function generateReport(id: string): Promise<any> {
  return unwrap<any>(await generateCustomerDiscoveryReportFn({ data: id }));
}

export const customerDiscoveryService = {
  fetchRecord,
  saveDraft,
  submitForReview,
  reviewDecision,
  generateReport,
};
