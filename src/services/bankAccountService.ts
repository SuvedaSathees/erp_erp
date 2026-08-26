import {
  getBankAccountsFn,
  getBankAccountFn,
  createBankAccountFn,
} from "@/lib/cashBankFns.server";
import type { BankAccount, BankAccountFilters, DashboardQuery, NewBankAccountInput } from "./types";

export async function fetchBankAccounts(
  query: DashboardQuery,
  filters: BankAccountFilters,
): Promise<BankAccount[]> {
  const res = await getBankAccountsFn({ data: filters });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function retrieveBankAccountDetails(accountNo: string): Promise<BankAccount | undefined> {
  const res = await getBankAccountFn({ data: accountNo });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data;
}

export async function saveBankAccount(input: NewBankAccountInput): Promise<BankAccount> {
  const res = await createBankAccountFn({ data: input });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data;
}
