import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, Order } from "../data/types";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar?: string;
  joined: string;
}

interface AuthState {
  user: User | null;
  addresses: Address[];
  orders: Order[];
  recentlyViewed: string[];
  login: (email: string, password: string) => { ok: boolean; message: string };
  register: (data: { name: string; email: string; phone: string; password: string }) => {
    ok: boolean;
    message: string;
  };
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  addAddress: (a: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  placeOrder: (o: Omit<Order, "id" | "date" | "status">) => Order;
  pushViewed: (id: string) => void;
}

/**
 * Credentials live in localStorage because there is no backend yet — the API
 * layer in services/api.ts replaces this once the rebuilt backend lands.
 */
const CRED_KEY = "ws2-credentials";
type CredMap = Record<string, { password: string; user: User }>;

const readCreds = (): CredMap => {
  try {
    return JSON.parse(localStorage.getItem(CRED_KEY) || "{}");
  } catch {
    return {};
  }
};
const writeCreds = (c: CredMap) => {
  try {
    localStorage.setItem(CRED_KEY, JSON.stringify(c));
  } catch {
    /* storage unavailable */
  }
};

const orderId = () => `WS-${Date.now().toString(36).toUpperCase().slice(-6)}`;

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      addresses: [],
      orders: [],
      recentlyViewed: [],
      login: (email, password) => {
        const creds = readCreds();
        const rec = creds[email.trim().toLowerCase()];
        if (!rec) return { ok: false, message: "Bunday e-mail bilan hisob topilmadi" };
        if (rec.password !== password) return { ok: false, message: "Parol noto'g'ri" };
        set({ user: rec.user });
        return { ok: true, message: `Xush kelibsiz, ${rec.user.name}` };
      },
      register: ({ name, email, phone, password }) => {
        const creds = readCreds();
        const mail = email.trim().toLowerCase();
        if (creds[mail]) return { ok: false, message: "Bu e-mail allaqachon ro'yxatdan o'tgan" };
        const user: User = {
          id: `u-${Date.now().toString(36)}`,
          name: name.trim(),
          email: mail,
          phone,
          city: "Denov",
          joined: new Date().toISOString(),
        };
        creds[mail] = { password, user };
        writeCreds(creds);
        set({ user });
        return { ok: true, message: `Hisob yaratildi. Xush kelibsiz, ${user.name}` };
      },
      logout: () => set({ user: null }),
      updateProfile: (patch) => {
        const user = get().user;
        if (!user) return;
        const next = { ...user, ...patch };
        const creds = readCreds();
        if (creds[user.email]) {
          creds[user.email].user = next;
          writeCreds(creds);
        }
        set({ user: next });
      },
      addAddress: (a) =>
        set({ addresses: [...get().addresses, { ...a, id: `a-${Date.now().toString(36)}` }] }),
      removeAddress: (id) => set({ addresses: get().addresses.filter((a) => a.id !== id) }),
      placeOrder: (o) => {
        const order: Order = {
          ...o,
          id: orderId(),
          date: new Date().toISOString(),
          status: o.payment === "cash" ? "pending" : "paid",
        };
        set({ orders: [order, ...get().orders] });
        return order;
      },
      pushViewed: (id) =>
        set({ recentlyViewed: [id, ...get().recentlyViewed.filter((x) => x !== id)].slice(0, 8) }),
    }),
    { name: "ws2-auth" },
  ),
);
