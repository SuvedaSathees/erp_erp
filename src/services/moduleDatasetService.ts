import { useCallback, useEffect, useMemo, useRef, useState, type SetStateAction } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getModuleDatasetFn, saveModuleDatasetFieldFn, seedModuleDatasetFn } from "@/lib/moduleDatasetFns.server";

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

/** JSON-safe copy (drops icons, functions and React elements). */
function toJson<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_k, v) =>
      typeof v === "function" || (v && typeof v === "object" && "$$typeof" in v) ? undefined : v,
    ) ?? "null",
  );
}

const datasetQuery = (key: string) => ({
  queryKey: ["module-dataset", key],
  queryFn: () => fetchModuleDataset(key),
  staleTime: Infinity,
  gcTime: Infinity,
});

/**
 * useState that is saved to the module's dataset in Postgres: loads the stored value on mount
 * and writes every change back (debounced). Used for lists users add to and workflow statuses.
 */
export function usePersistentState<T>(key: string, title: string, field: string, initial: T) {
  const queryClient = useQueryClient();
  const { data } = useQuery(datasetQuery(key));
  const [state, setState] = useState<T>(() => {
    const cached = queryClient.getQueryData<Record<string, unknown> | null>(["module-dataset", key]);
    return cached && field in cached ? (mergeDataset(initial, cached[field]) as T) : initial;
  });
  const hydrated = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (hydrated.current || !data) return;
    hydrated.current = true;
    if (field in data) setState(mergeDataset(initial, data[field]) as T);
    // initial is static page data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, field]);

  const set = useCallback(
    (action: SetStateAction<T>) => {
      hydrated.current = true;
      setState((prev) => {
        const next = typeof action === "function" ? (action as (p: T) => T)(prev) : action;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          saveModuleDatasetFieldFn({ data: { key, title, field, json: JSON.stringify(toJson(next)) } })
            .then((json) => queryClient.setQueryData(["module-dataset", key], JSON.parse(json)))
            .catch(() => toast.error("Couldn't save your change. Please try again."));
        }, 300);
        return next;
      });
    },
    [key, title, field, queryClient],
  );

  return [state, set] as const;
}

/**
 * Page data for the dashboard modules, read from Postgres through React Query.
 * The bundled defaults render immediately; the first visit seeds the dataset into the DB.
 */
export function useModuleDataset<T extends Record<string, unknown>>(key: string, title: string, defaults: T): T {
  const queryClient = useQueryClient();
  const seeded = useRef(false);
  const { data, isSuccess } = useQuery(datasetQuery(key));

  useEffect(() => {
    if (!isSuccess || seeded.current) return;
    const json = toJson(defaults);
    const missingKeys = !data || Object.keys(json).some((k) => !(k in data));
    if (!missingKeys) return;
    seeded.current = true;
    seedModuleDataset(key, title, json)
      .then((stored) => queryClient.setQueryData(["module-dataset", key], stored))
      .catch(() => {});
    // defaults are static module data; only re-run when the query resolves
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data, key]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => (data ? (mergeDataset(defaults, data) as T) : defaults), [data]);
}
