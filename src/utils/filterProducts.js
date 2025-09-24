export function filterProducts(
  cards,
  { search = "", source = "all", minPrice = "", maxPrice = "" } = {}
) {
  const qLower = String(search || "").trim().toLowerCase();
  return (cards || []).filter((c) => {
    const title = String(c?.alt || c?.title || "").toLowerCase();
    const qOk = !qLower || title.includes(qLower);
    const isLocal = String(c?.id || "").startsWith("local-");
    const sourceOk = source === "all" ? true : source === "local" ? isLocal : !isLocal;
    const price = Number(c?.price || 0);
    const minOk = minPrice === "" ? true : price >= Number(minPrice);
    const maxOk = maxPrice === "" ? true : price <= Number(maxPrice);
    return qOk && sourceOk && minOk && maxOk;
  });
}
