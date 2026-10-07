import { useEffect, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getModuleDatasetFn, seedModuleDatasetFn } from "@/lib/moduleDatasetFns.server";

export async function fetchModuleDataset(key: string): Promise<Record<string, unknown> | null> {
  const json = await getModuleDatasetFn({ data: key });
  return json ? (JSON.parse(json) as Record<string, unknown>) : null;
}

export async function seedModuleDataset(key: string, title: string, data: Record<string, unknown>) {
  const json = await seedModuleDatasetFn({ data: { key, title, json: JSON.stringify(data) } });
  return JSON.parse(json) as Record<string, unknown>;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;
}

// DB values win, but anything JSON can't hold (icons, React elements, functions) is kept from the
// bundled defaults — same-length arrays are merged item by item so per-row icons survive.
function mergeDataset(base: unknown, db: unknown): unknown {
  if (db === null || db === undefined) return base;
  if (Array.isArray(base) && Array.isArray(db)) {
    return db.length === base.length ? db.map((item, i) => mergeDataset(base[i], item)) : db;
  }
  if (isPlainObject(base) && isPlainObject(db)) {
    const out: Record<string, unknown> = { ...base };
    for (const [k, v] of Object.entries(db)) out[k] = mergeDataset(base[k], v);
    return out;
  }
  if (typeof base === "function") return base;
  return db;
}

/** JSON-safe copy of the defaults (drops icons, functions and React elements). */
function toJson(data: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(
    JSON.stringify(data, (_k, v) =>
      typeof v === "function" || (v && typeof v === "object" && "$$typeof" in v) ? undefined : v,
    ),
  );
}

/**
 * Page data for the dashboard modules, read from Postgres through React Query.
 * The bundled defaults render immediately; the first visit seeds the dataset into the DB.
 */
export function useModuleDataset<T extends Record<string, unknown>>(key: string, title: string, defaults: T): T {
  const queryClient = useQueryClient();
  const seeded = useRef(false);
  const { data, isSuccess } = useQuery({
    queryKey: ["module-dataset", key],
    queryFn: () => fetchModuleDataset(key),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (!isSuccess || data || seeded.current) return;
    seeded.current = true;
    seedModuleDataset(key, title, toJson(defaults))
      .then((stored) => queryClient.setQueryData(["module-dataset", key], stored))
      .catch(() => {});
    // defaults are static module data; only re-run when the query resolves
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data, key]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => (data ? (mergeDataset(defaults, data) as T) : defaults), [data]);
}
