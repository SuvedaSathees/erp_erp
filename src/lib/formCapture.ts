/** Read the form that contains (or sits just above) the clicked button, e.g. a modal's Submit. */
export function readFieldsNear(el: EventTarget | null): Record<string, string> {
  let node = el instanceof Element ? el.parentElement : null;
  while (node && !node.querySelector("input, select, textarea")) node = node.parentElement;
  return readLabeledFields(node as HTMLElement | null);
}

/**
 * Read the values typed into a form whose inputs aren't bound to React state, keyed by each
 * field's visible label (e.g. "Access Type *" -> "Access Type").
 */
export function readLabeledFields(container: HTMLElement | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!container) return out;
  const fields = container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    "input:not([type=hidden]):not([type=file]), select, textarea",
  );
  fields.forEach((el, i) => {
    let label = "";
    if (el.id) label = container.querySelector(`label[for="${el.id}"]`)?.textContent ?? "";
    let node: Element | null = el;
    while (!label && node && node !== container) {
      const own: Element | null | undefined = node.parentElement?.querySelector(":scope > label");
      if (own && own !== node) label = own.textContent ?? "";
      node = node.parentElement;
    }
    label = label.replace(/\*/g, "").replace(/\s+/g, " ").trim() || el.getAttribute("placeholder") || `Field ${i + 1}`;
    const value =
      el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")
        ? el.checked
          ? "Yes"
          : "No"
        : el.value.trim();
    if (label in out) {
      if (value) out[label] = out[label] ? `${out[label]}, ${value}` : value;
    } else out[label] = value;
  });
  return out;
}
