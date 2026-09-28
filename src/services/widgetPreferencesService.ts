import {
  getWidgetPreferencesFn,
  updateWidgetPreferencesFn,
  WIDGETS_CURRENT_USER,
} from "@/lib/widgetPreferencesFns.server";
import type { WidgetPreferencesDoc, WidgetPreferencesPatch } from "@/widgets/types";

/* ===========================================================================
   Widget preferences — client service
   Unwraps the { success, data } | { success, error } envelope the server fns
   return, providing fallbacks with a strict timeout to ensure instant rendering
   on cloud deployments without skeleton lockups.
   =========================================================================== */

export const CURRENT_USER_ID = WIDGETS_CURRENT_USER;

const STORAGE_KEY = `magnertia_widget_prefs_${CURRENT_USER_ID}`;
let inMemoryPrefs: WidgetPreferencesDoc | null = null;

export const FALLBACK_PREFS: WidgetPreferencesDoc = {
  _id: `widget_preferences::${CURRENT_USER_ID}`,
  userId: CURRENT_USER_ID,
  role: "CEO",
  pages: {},
  favorites: [],
  recentlyUsed: [],
  templates: [],
  updatedAt: new Date().toISOString(),
};

/** Synchronously retrieve cached preferences from memory or localStorage. */
export function getCachedPreferencesSync(): WidgetPreferencesDoc {
  if (inMemoryPrefs) return inMemoryPrefs;
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          inMemoryPrefs = parsed;
          return parsed;
        }
      }
    } catch {
      // ignore JSON errors
    }
  }
  return FALLBACK_PREFS;
}

function persistLocalPrefs(doc: WidgetPreferencesDoc) {
  inMemoryPrefs = doc;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
    } catch {
      // ignore localStorage quota errors
    }
  }
}

export async function fetchPreferences(): Promise<WidgetPreferencesDoc> {
  const cached = getCachedPreferencesSync();
  const hasLocal = cached !== FALLBACK_PREFS && Object.keys(cached.pages || {}).length > 0;

  const fetchPromise = (async () => {
    try {
      const res = await getWidgetPreferencesFn();
      if (res && typeof res === "object" && "success" in res && res.success && "data" in res && res.data) {
        const doc = res.data as WidgetPreferencesDoc;
        persistLocalPrefs(doc);
        return doc;
      }
    } catch (err) {
      console.warn("fetchPreferences network sync notice:", err);
    }
    return cached;
  })();

  if (hasLocal) {
    // If local preferences exist, return immediately without blocking UI
    fetchPromise.catch(() => {});
    return cached;
  }

  // Fast safety race so initial cold start never blocks user interaction
  const timeoutPromise = new Promise<WidgetPreferencesDoc>((resolve) =>
    setTimeout(() => resolve(cached), 150)
  );

  return await Promise.race([fetchPromise, timeoutPromise]);
}

export async function savePreferences(
  patch: WidgetPreferencesPatch,
): Promise<WidgetPreferencesDoc> {
  const current = getCachedPreferencesSync();
  const next: WidgetPreferencesDoc = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  persistLocalPrefs(next);

  // Background persist to server function without stalling client response
  updateWidgetPreferencesFn({ data: patch }).catch((err) => {
    console.warn("Background updateWidgetPreferencesFn notice:", err);
  });

  return next;
}
