import type { UserRecord, NewUserInput, LoginHistoryEntry } from "./types";

export async function fetchUsers(): Promise<UserRecord[]> {
  try {
    const { getAdminUsersFn } = await import("@/lib/adminFns.server");
    const res = await getAdminUsersFn();
    if (res.success && res.data && res.data.length > 0) return res.data;
  } catch (err) {
    console.error("Failed to fetch users from DB:", err);
  }
  return [];
}

export async function createUser(input: NewUserInput): Promise<UserRecord> {
  const { createAdminUserFn } = await import("@/lib/adminFns.server");
  const res = await createAdminUserFn({ data: input });
  if (res.success && res.data) return res.data;
  throw new Error(res.error || "Failed to create user");
}

export async function fetchLoginHistory(): Promise<LoginHistoryEntry[]> {
  try {
    const { getLoginHistoryFn } = await import("@/lib/adminFns.server");
    const res = await getLoginHistoryFn();
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to fetch login history from DB:", err);
  }
  return [];
}

export async function fetchUserActivityTrend(): Promise<{ date: string; logins: number }[]> {
  try {
    const { getUserAnalyticsFn } = await import("@/lib/adminFns.server");
    const res = await getUserAnalyticsFn();
    if (res.success && res.data) return res.data.activityTrend;
  } catch (err) {
    console.error("Failed to fetch user activity trend from DB:", err);
  }
  return [];
}

export async function fetchUsersByDepartment(): Promise<
  { name: string; value: number; color: string }[]
> {
  try {
    const { getUserAnalyticsFn } = await import("@/lib/adminFns.server");
    const res = await getUserAnalyticsFn();
    if (res.success && res.data) return res.data.byDepartment;
  } catch (err) {
    console.error("Failed to fetch users by department from DB:", err);
  }
  return [];
}

export async function fetchUserStatusSummary(): Promise<{
  activeCount: number;
  inactiveCount: number;
}> {
  try {
    const { getUserAnalyticsFn } = await import("@/lib/adminFns.server");
    const res = await getUserAnalyticsFn();
    if (res.success && res.data) return res.data.statusSummary;
  } catch (err) {
    console.error("Failed to fetch user status summary from DB:", err);
  }
  return { activeCount: 0, inactiveCount: 0 };
}
