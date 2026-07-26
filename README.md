# WEARSHOP — Frontend

Premium kiyim brendi uchun ko'p sahifali e-commerce frontend. Vite + React 18 + TypeScript.

## Ishga tushirish

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

Dev server `http://localhost:5173` da ochiladi. `npm run build` `dist/` papkasiga static output beradi — Vercel, Netlify yoki istalgan static hostingga joylash mumkin (`vercel.json` da SPA rewrite qoidasi bor).

## Arxitektura

```
src/
  main.tsx, App.tsx        router va global layout
  components/layout/       Header + mega-menu, Footer, CartDrawer, MobileNav, SearchOverlay
  components/ui/           ProductCard, Reveal, Marquee, Magnetic, QuickView, Rail, Accordion, Toasts, Cursor
  pages/                   21 ta route komponenti
  store/                   Zustand: useCart, useWishlist, useAuth, useUI (localStorage'ga persist)
  data/                    mahsulot, lookbook, jurnal, filial va FAQ ma'lumotlari (TypeScript)
  lib/                     format helperlar, scroll/inView hooklar, document title
  styles/                  tokens.css, base.css, components.css, layout.css, pages/*.css
```

## Route'lar

| Yo'l | Sahifa |
| --- | --- |
| `/` | Bosh sahifa |
| `/katalog`, `/katalog/:category` | Katalog (facet filtrlar, sort, grid/list) |
| `/mahsulot/:slug` | Mahsulot sahifasi (galereya, variantlar, sharhlar) |
| `/savat`, `/tolov`, `/buyurtma/:id` | Savat → 3 bosqichli checkout → tasdiq |
| `/sevimlilar` | Sevimlilar + statistika |
| `/kirish`, `/royxatdan-otish`, `/kabinet` | Auth va shaxsiy kabinet |
| `/lookbook`, `/lookbook/:slug` | Lookbook va hikoya sahifasi |
| `/jurnal`, `/jurnal/:slug` | Jurnal va maqola |
| `/brend`, `/filiallar`, `/yordam`, `/olcham-jadvali`, `/chegirma`, `/qidiruv`, `/aloqa` | Kontent sahifalari |

## Ma'lumotlar qatlami

Backend hozircha qayta yozilmoqda, shuning uchun barcha ma'lumot `src/data/` dagi TypeScript fayllardan keladi va foydalanuvchi holati (savat, sevimlilar, hisob, buyurtmalar) `localStorage` da saqlanadi.

Backend tayyor bo'lganda almashtiriladigan joylar:

- `src/store/useAuth.ts` — `login` / `register` / `placeOrder` funksiyalari
- `src/data/products.ts` — mahsulot ro'yxati va `PROMOS`, `SHIPPING_FEE`, `FREE_SHIPPING_FROM` konstantalari
- `src/store/useCart.ts` — `totals()` hisob-kitobi server tomonga ko'chiriladi

## Tema

`data-theme="light" | "dark"` `<html>` da. Boshlang'ich qiymat `index.html` dagi inline skript orqali (FOUC bo'lmasligi uchun) `localStorage` va `prefers-color-scheme` dan olinadi.
