import { companies as orgCompanies } from "@/lib/orgConfig";
import type { CompanyRecord, NewCompanyInput } from "./types";

export function fetchCompanies(): Promise<CompanyRecord[]> {
  return Promise.resolve([...orgCompanies]);
}

export function createCompany(input: NewCompanyInput): Promise<CompanyRecord> {
  const newCompany: CompanyRecord = {
    id: `CO-0${orgCompanies.length + 1}`,
    code: input.code,
    name: input.name,
    taxId: input.taxId,
    status: "Active",
    branchCount: 0,
    createdDate: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
  return Promise.resolve(newCompany);
}
