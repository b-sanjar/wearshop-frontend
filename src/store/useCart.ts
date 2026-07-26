import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../data/types";
import { PRODUCTS, effectivePrice, PROMOS, SHIPPING_FEE, FREE_SHIPPING_FROM } from "../data/products";

interface CartState {
  items: CartItem[];
  promo: string | null;
  add: (item: CartItem) => void;
  remove: (productId: string, size: string, color: string) => void;
  setQty: (productId: string, size: string, color: string, qty: number) => void;
  clear: () => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  clearPromo: () => void;
}

const key = (i: { productId: string; size: string; color: string }) =>
  `${i.productId}|${i.size}|${i.color}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promo: null,
      add: (item) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => key(i) === key(item));
        if (idx >= 0) items[idx] = { ...items[idx], qty: Math.min(items[idx].qty + item.qty, 20) };
        else items.push(item);
        set({ items });
      },
      remove: (productId, size, color) =>
        set({ items: get().items.filter((i) => key(i) !== key({ productId, size, color })) }),
      setQty: (productId, size, color, qty) =>
        set({
          items: get()
            .items.map((i) =>
              key(i) === key({ productId, size, color }) ? { ...i, qty: Math.max(0, Math.min(qty, 20)) } : i,
            )
            .filter((i) => i.qty > 0),
        }),
      clear: () => set({ items: [], promo: null }),
      applyPromo: (code) => {
        const found = PROMOS.find((p) => p.code === code.trim().toUpperCase());
        if (!found) return { ok: false, message: "Bunday promo-kod topilmadi" };
        const { subtotal } = totals(get().items, null);
        if (subtotal < found.minOrder)
          return {
            ok: false,
            message: `Bu kod ${found.minOrder.toLocaleString("ru-RU")} so'mdan yuqori buyurtmalarga amal qiladi`,
          };
        set({ promo: found.code });
        return { ok: true, message: `${found.code} qo'llandi — ${found.label}` };
      },
      clearPromo: () => set({ promo: null }),
    }),
    { name: "ws2-cart" },
  ),
);

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  count: number;
}

export function totals(items: CartItem[], promo: string | null): Totals {
  let subtotal = 0;
  let count = 0;
  for (const it of items) {
    const p = PRODUCTS.find((x) => x.id === it.productId);
    if (!p) continue;
    subtotal += effectivePrice(p) * it.qty;
    count += it.qty;
  }
  let discount = 0;
  let shipping = subtotal > 0 && subtotal < FREE_SHIPPING_FROM ? SHIPPING_FEE : 0;
  const code = PROMOS.find((p) => p.code === promo);
  if (code && subtotal >= code.minOrder) {
    if (code.type === "percent") discount = Math.round((subtotal * code.value) / 100);
    else shipping = 0;
  }
  return { subtotal, discount, shipping, total: Math.max(0, subtotal - discount + shipping), count };
}

export const useCartTotals = () => {
  const items = useCart((s) => s.items);
  const promo = useCart((s) => s.promo);
  return totals(items, promo);
};
