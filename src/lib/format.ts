export function formatCurrency(n: number, compact = false) {
  const sign = n < 0 ? "-" : "";
  const v = Math.abs(n);
  if (compact) {
    if (v >= 1_00_00_000) {
      const crores = (v / 1_00_00_000).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${sign}₹${crores}Cr`;
    }
    if (v >= 1_00_000) {
      const lakhs = (v / 1_00_000).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${sign}₹${lakhs}L`;
    }
  }
  return `${sign}₹${v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatSignedCurrency(n: number, compact = false) {
  if (n < 0) {
    const inner = formatCurrency(Math.abs(n), compact).replace("-", "");
    return `(${inner})`;
  }
  return formatCurrency(n, compact);
}
