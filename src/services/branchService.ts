import { branches as orgBranches, companies as orgCompanies } from "@/lib/orgConfig";
import type { BranchRecord, NewBranchInput } from "./types";

export function fetchBranches(): Promise<BranchRecord[]> {
  return Promise.resolve([...orgBranches]);
}

export function createBranch(input: NewBranchInput): Promise<BranchRecord> {
  const company = orgCompanies.find((c) => c.id === input.companyId);
  const newBranch: BranchRecord = {
    id: `BR-0${orgBranches.length + 1}`,
    code: input.code,
    name: input.name,
    companyId: input.companyId,
    companyName: company?.name ?? "Unknown Company",
    city: input.city,
    status: "Active",
    departmentCount: 0,
  };
  return Promise.resolve(newBranch);
}
