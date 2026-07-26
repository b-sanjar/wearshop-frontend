export const uzs = (n: number) => `${Math.round(n).toLocaleString("ru-RU").replace(/ /g, " ")} so'm`;

export const uzsShort = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".0", "")} mln`;
  if (n >= 1_000) return `${Math.round(n / 1000)}k`;
  return String(n);
};

export const dateUz = (iso: string) => {
  const months = [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
  ];
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const CATEGORY_LABEL: Record<string, string> = {
  erkaklar: "Erkaklar",
  ayollar: "Ayollar",
  unisex: "Unisex",
  aksessuar: "Aksessuarlar",
};

/** One distinct colour per order state so the timeline reads at a glance. */
export const ORDER_STATUS: Record<string, { label: string; tone: string }> = {
  pending: { label: "Kutilmoqda", tone: "warn" },
  paid: { label: "To'landi", tone: "info" },
  shipped: { label: "Jo'natildi", tone: "shipped" },
  delivered: { label: "Yetkazildi", tone: "ok" },
  cancelled: { label: "Bekor qilindi", tone: "danger" },
};
