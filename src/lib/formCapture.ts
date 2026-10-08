type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const FIELDS = "input:not([type=hidden]):not([type=file]):not([type=password]):not([type=search]), select, textarea";

/** Read the form that contains (or sits just above) the clicked button, e.g. a modal's Submit. */
export function readFieldsNear(el: EventTarget | null): Record<string, string> {
  let node = el instanceof Element ? el.parentElement : null;
  while (node && !node.querySelector("input, select, textarea")) node = node.parentElement;
  return readLabeledFields(node as HTMLElement | null);
}

/** The visible label of a field ("Access Type *" -> "Access Type"), or its placeholder. */
export function labelOf(el: Field, container: HTMLElement, index = 0): string {
  let label = "";
  if (el.id) label = container.querySelector(`label[for="${CSS.escape(el.id)}"]`)?.textContent ?? "";
  let node: Element | null = el;
  while (!label && node && node !== container) {
    const own: Element | null | undefined = node.parentElement?.querySelector(":scope > label");
    if (own && own !== node) label = own.textContent ?? "";
    node = node.parentElement;
  }
  return (
    label.replace(/\*/g, "").replace(/\s+/g, " ").trim() ||
    el.getAttribute("aria-label") ||
    el.getAttribute("placeholder") ||
    `Field ${index + 1}`
  );
}

const valueOf = (el: Field) =>
  el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")
    ? el.checked
      ? "Yes"
      : "No"
    : el.value.trim();

/**
 * Read the values typed into a form whose inputs aren't bound to React state, keyed by each
 * field's visible label (e.g. "Access Type *" -> "Access Type").
 */
export function readLabeledFields(container: HTMLElement | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!container) return out;
  container.querySelectorAll<Field>(FIELDS).forEach((el, i) => {
    const label = labelOf(el, container, i);
    const value = valueOf(el);
    if (label in out) {
      if (value) out[label] = out[label] ? `${out[label]}, ${value}` : value;
    } else out[label] = value;
  });
  return out;
}

export type SavedField = { k: string; v: string; c?: boolean };

const locked = (el: Field) => el.disabled || (!(el instanceof HTMLSelectElement) && el.readOnly);

/** Every field on the page with a stable key (label + occurrence), for saving a form's state. */
export function captureFields(container: HTMLElement): SavedField[] {
  const seen = new Map<string, number>();
  const out: SavedField[] = [];
  container.querySelectorAll<Field>(FIELDS).forEach((el, i) => {
    if (el.closest("[role=dialog], [role=menu], [data-no-save]") || locked(el)) return;
    const label = labelOf(el, container, i);
    const n = seen.get(label) ?? 0;
    seen.set(label, n + 1);
    const k = `${label}#${n}`;
    if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) out.push({ k, v: el.value, c: el.checked });
    else out.push({ k, v: el.value });
  });
  return out;
}

function setNativeValue(el: Field, value: string) {
  const proto =
    el instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : el instanceof HTMLSelectElement
        ? HTMLSelectElement.prototype
        : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value);
  el.dispatchEvent(new Event(el instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }));
}

/**
 * Put saved values back into the matching fields. Uses the native value setter plus an input
 * event, so React's onChange handlers update their state as if the user had typed. Returns the
 * keys that were applied, so each field is only restored once.
 */
export function applyFields(container: HTMLElement, saved: SavedField[], done: Set<string>): number {
  const byKey = new Map(saved.map((f) => [f.k, f]));
  const seen = new Map<string, number>();
  let applied = 0;
  container.querySelectorAll<Field>(FIELDS).forEach((el, i) => {
    if (el.closest("[role=dialog], [role=menu], [data-no-save]") || locked(el)) return;
    const label = labelOf(el, container, i);
    const n = seen.get(label) ?? 0;
    seen.set(label, n + 1);
    const k = `${label}#${n}`;
    const f = byKey.get(k);
    if (!f || done.has(k)) return;
    done.add(k);
    if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) {
      if (f.c != null && el.checked !== f.c) el.click();
    } else if (el.value !== f.v) {
      if (el instanceof HTMLSelectElement && ![...el.options].some((o) => o.value === f.v)) return;
      setNativeValue(el, f.v);
    } else return;
    applied++;
  });
  return applied;
}
