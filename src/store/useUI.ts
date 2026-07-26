import { create } from "zustand";

type Theme = "light" | "dark";
export interface Toast {
  id: number;
  message: string;
  tone: "ok" | "info" | "danger";
  image?: string;
}

interface UIState {
  theme: Theme;
  cartOpen: boolean;
  navOpen: boolean;
  searchOpen: boolean;
  quickViewId: string | null;
  toasts: Toast[];
  toggleTheme: () => void;
  setCartOpen: (v: boolean) => void;
  setNavOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setQuickView: (id: string | null) => void;
  toast: (message: string, tone?: Toast["tone"], image?: string) => void;
  dismiss: (id: number) => void;
}

const readTheme = (): Theme => {
  if (typeof document === "undefined") return "light";
  return (document.documentElement.dataset.theme as Theme) || "light";
};

let toastSeq = 0;

export const useUI = create<UIState>((set, get) => ({
  theme: readTheme(),
  cartOpen: false,
  navOpen: false,
  searchOpen: false,
  quickViewId: null,
  toasts: [],
  toggleTheme: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("ws2-theme", next);
    } catch {
      /* storage unavailable */
    }
    set({ theme: next });
  },
  setCartOpen: (v) => set({ cartOpen: v, navOpen: false, searchOpen: false }),
  setNavOpen: (v) => set({ navOpen: v, cartOpen: false }),
  setSearchOpen: (v) => set({ searchOpen: v, navOpen: false, cartOpen: false }),
  setQuickView: (id) => set({ quickViewId: id }),
  toast: (message, tone = "ok", image) => {
    const id = ++toastSeq;
    set({ toasts: [...get().toasts, { id, message, tone, image }] });
    setTimeout(() => get().dismiss(id), 3600);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
