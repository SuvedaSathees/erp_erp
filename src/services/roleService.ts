import type { RoleRecord, NewRoleInput } from "./types";

export async function fetchRoles(): Promise<RoleRecord[]> {
  try {
    const { getRolesFn } = await import("@/lib/adminFns.server");
    const res = await getRolesFn();
    if (res.success && res.data && res.data.length > 0) return res.data;
  } catch (err) {
    console.error("Failed to fetch roles from DB:", err);
  }
  return [];
}

export async function createRole(input: NewRoleInput): Promise<RoleRecord> {
  const { createRoleFn } = await import("@/lib/adminFns.server");
  const res = await createRoleFn({ data: input });
  if (res.success && res.data) return res.data;
  throw new Error(res.error || "Failed to create role");
}
