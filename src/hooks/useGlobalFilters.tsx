import { createContext, useContext, useState, type ReactNode } from "react";

export type FiscalYear = "FY 2024-25" | "FY 2023-24" | "FY 2022-23";
export type CompanyFilter = "all" | "magnertia" | "magnertia-ev" | "magnertia-energy";

const FISCAL_YEARS: { label: string; value: FiscalYear }[] = [
  { label: "FY 2024-25", value: "FY 2024-25" },
  { label: "FY 2023-24", value: "FY 2023-24" },
  { label: "FY 2022-23", value: "FY 2022-23" },
];

const COMPANIES: { label: string; value: CompanyFilter }[] = [
  { label: "All Companies", value: "all" },
  { label: "Magnertia", value: "magnertia" },
  { label: "Magnertia EV", value: "magnertia-ev" },
  { label: "Magnertia Energy", value: "magnertia-energy" },
];

type GlobalFiltersContextValue = {
  fiscalYear: FiscalYear;
  setFiscalYear: (fy: FiscalYear) => void;
  companyFilter: CompanyFilter;
  setCompanyFilter: (c: CompanyFilter) => void;
  fiscalYears: typeof FISCAL_YEARS;
  companies: typeof COMPANIES;
};

const GlobalFiltersContext = createContext<GlobalFiltersContextValue | null>(null);

export function GlobalFiltersProvider({ children }: { children: ReactNode }) {
  const [fiscalYear, setFiscalYear] = useState<FiscalYear>("FY 2024-25");
  const [companyFilter, setCompanyFilter] = useState<CompanyFilter>("all");

  return (
    <GlobalFiltersContext.Provider
      value={{
        fiscalYear,
        setFiscalYear,
        companyFilter,
        setCompanyFilter,
        fiscalYears: FISCAL_YEARS,
        companies: COMPANIES,
      }}
    >
      {children}
    </GlobalFiltersContext.Provider>
  );
}

export function useGlobalFilters() {
  const ctx = useContext(GlobalFiltersContext);
  if (!ctx) throw new Error("useGlobalFilters must be used within GlobalFiltersProvider");
  return ctx;
}
