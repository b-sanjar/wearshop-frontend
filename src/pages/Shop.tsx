import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowsClockwise,
  Funnel,
  GridFour,
  Rows,
  SlidersHorizontal,
  X,
} from "@phosphor-icons/react";
import { PRODUCTS, COLLECTIONS, effectivePrice } from "../data/products";
import type { Product } from "../data/types";
import { CATEGORY_LABEL, uzs } from "../lib/format";
import { ProductCard } from "../components/ui/ProductCard";
import { Breadcrumbs, Empty } from "../components/ui/Bits";
import { RevealText, Reveal } from "../components/ui/Reveal";
import { useMediaQuery, useScrollLock } from "../lib/hooks";

const SORTS = [
  { id: "featured", label: "Tavsiya etilgan" },
  { id: "new", label: "Yangi kelganlar" },
  { id: "price_asc", label: "Narx: arzondan" },
  { id: "price_desc", label: "Narx: qimmatdan" },
  { id: "rating", label: "Reyting bo'yicha" },
  { id: "popular", label: "Ommaboplik" },
];

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Yagona"];
const ALL_COLORS = [
  { name: "Qora", hex: "#1a1a1a" },
  { name: "Oq suyak", hex: "#ece7dd" },
  { name: "Qum", hex: "#cbb99a" },
  { name: "Terrakota", hex: "#b0552b" },
  { name: "Zaytun", hex: "#5f6b46" },
  { name: "Kofe", hex: "#5b4636" },
  { name: "Grafit", hex: "#3a3a3a" },
  { name: "Tungi ko'k", hex: "#2b3648" },
];
const QUICK_TAGS = [
  { id: "new", label: "Yangi" },
  { id: "sale", label: "Chegirma" },
  { id: "bestseller", label: "Bestseller" },
  { id: "premium", label: "Premium" },
];

const PRICE_MAX = Math.max(...PRODUCTS.map((p) => p.price));
const PER_PAGE = 12;

/** Each catalogue branch carries its own hue — see patterns.css */
const CATEGORY_SEC: Record<string, string> = {
  ayollar: "plum",
  erkaklar: "sapphire",
  unisex: "teal",
  aksessuar: "amber",
  yangi: "emerald",
};

const CATEGORY_HERO: Record<string, { title: string; text: string; img: string }> = {
  ayollar: {
    title: "Ayollar kolleksiyasi",
    text: "Ipak, kashmir va zig'ir asosidagi siluetlar — kundalik kiyimdan kechki marosimgacha.",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1800&auto=format&fit=crop",
  },
  erkaklar: {
    title: "Erkaklar kolleksiyasi",
    text: "Sartorial aniqlik va kundalik qulaylik. Jun palto, denim va tayanch trikotaj.",
    img: "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1800&auto=format&fit=crop",
  },
  unisex: {
    title: "Unisex kolleksiya",
    text: "Jinsdan qat'i nazar ishlaydigan formalar — oversize kesim va texnik matolar.",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1800&auto=format&fit=crop",
  },
  aksessuar: {
    title: "Aksessuarlar",
    text: "Charm sumkalar, jun sharflar va kichik detallar — obrazni yakunlovchi qism.",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1800&auto=format&fit=crop",
  },
  yangi: {
    title: "Yangi kelganlar",
    text: "So'nggi ikki hafta ichida ustaxonadan chiqqan modellar.",
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1800&auto=format&fit=crop",
  },
};

export default function Shop() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const q = params.get("q") || "";
  const sort = params.get("sort") || "featured";
  const coll = params.getAll("coll");
  const sizes = params.getAll("size");
  const colors = params.getAll("color");
  const tags = params.getAll("tag");
  const minPrice = Number(params.get("min") || 0);
  const maxPrice = Number(params.get("max") || PRICE_MAX);
  const inStock = params.get("stock") === "1";

  useScrollLock(isMobile && filtersOpen);
  useEffect(() => setPage(1), [category, params]);

  const hero = category ? CATEGORY_HERO[category] : undefined;

  const setParam = (kv: Record<string, string | string[] | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(kv)) {
      next.delete(k);
      if (Array.isArray(v)) v.forEach((x) => next.append(k, x));
      else if (v !== null && v !== "") next.set(k, v);
    }
    setParams(next, { replace: true });
  };

  const toggleIn = (key: string, value: string) => {
    const cur = params.getAll(key);
    setParam({ [key]: cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value] });
  };

  const activeCount =
    coll.length + sizes.length + colors.length + tags.length + (inStock ? 1 : 0) +
    (minPrice > 0 ? 1 : 0) + (maxPrice < PRICE_MAX ? 1 : 0);

  /** Everything in the active category — drives the facet counts. */
  const scoped = useMemo(() => {
    if (!category) return PRODUCTS;
    if (category === "yangi") return PRODUCTS.filter((p) => p.isNew);
    return PRODUCTS.filter((p) => p.category === category);
  }, [category]);

  const scopedCollections = useMemo(
    () => COLLECTIONS.filter((c) => scoped.some((p) => p.collection === c)),
    [scoped],
  );

  const filtered = useMemo(() => {
    let list: Product[] = scoped;

    if (q.trim()) {
      const term = q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.collection.toLowerCase().includes(term) ||
          p.fabric.toLowerCase().includes(term),
      );
    }
    if (coll.length) list = list.filter((p) => coll.includes(p.collection));
    if (sizes.length) list = list.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    if (colors.length) list = list.filter((p) => p.colors.some((c) => colors.includes(c.name)));
    if (tags.length) list = list.filter((p) => tags.some((t) => p.tags.includes(t)));
    if (inStock) list = list.filter((p) => p.stock > 0);
    list = list.filter((p) => {
      const price = effectivePrice(p);
      return price >= minPrice && price <= maxPrice;
    });

    const sorted = [...list];
    switch (sort) {
      case "price_asc": sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b)); break;
      case "price_desc": sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a)); break;
      case "rating": sorted.sort((a, b) => b.rating - a.rating); break;
      case "popular": sorted.sort((a, b) => b.popularity - a.popularity); break;
      case "new": sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
      default: sorted.sort((a, b) => b.popularity + (b.isNew ? 12 : 0) - (a.popularity + (a.isNew ? 12 : 0)));
    }
    return sorted;
  }, [scoped, q, coll, sizes, colors, tags, inStock, minPrice, maxPrice, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const shown = filtered.slice(0, page * PER_PAGE);

  const clearAll = () => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (sort !== "featured") next.set("sort", sort);
    setParams(next, { replace: true });
  };

  const filterPanel = (
    <>
      <FilterBlock title="Kolleksiya">
        <div className="fbox__list">
          {scopedCollections.map((c) => (
            <label className="check" key={c}>
              <input type="checkbox" checked={coll.includes(c)} onChange={() => toggleIn("coll", c)} />
              <span className="check__box" />
              <span className="check__label">{c}</span>
              <span className="check__n muted">{scoped.filter((p) => p.collection === c).length}</span>
            </label>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="O'lcham">
        <div className="fbox__chips">
          {ALL_SIZES.filter((s) => scoped.some((p) => p.sizes.includes(s))).map((s) => (
            <button key={s} className={`chip ${sizes.includes(s) ? "is-on" : ""}`} onClick={() => toggleIn("size", s)}>
              {s}
            </button>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Rang">
        <div className="fbox__colors">
          {ALL_COLORS.filter((c) => scoped.some((p) => p.colors.some((x) => x.name === c.name))).map((c) => (
            <button
              key={c.name}
              className={`fcolor ${colors.includes(c.name) ? "is-on" : ""}`}
              onClick={() => toggleIn("color", c.name)}
              title={c.name}
            >
              <span className="swatch swatch--btn" style={{ background: c.hex }} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Narx">
        <div className="fbox__price">
          <div className="fbox__pricerow">
            <label className="field">
              <span>Dan</span>
              <input
                type="number"
                value={minPrice || ""}
                placeholder="0"
                onChange={(e) => setParam({ min: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Gacha</span>
              <input
                type="number"
                value={maxPrice < PRICE_MAX ? maxPrice : ""}
                placeholder={String(PRICE_MAX)}
                onChange={(e) => setParam({ max: e.target.value })}
              />
            </label>
          </div>
          <input
            className="range"
            type="range"
            min={0}
            max={PRICE_MAX}
            step={50000}
            value={maxPrice}
            onChange={(e) => setParam({ max: e.target.value })}
          />
          <div className="fbox__pricelabels muted">
            <span>{uzs(minPrice)}</span>
            <span>{uzs(maxPrice)}</span>
          </div>
        </div>
      </FilterBlock>

      <FilterBlock title="Boshqa">
        <div className="fbox__list">
          {QUICK_TAGS.map((t) => (
            <label className="check" key={t.id}>
              <input type="checkbox" checked={tags.includes(t.id)} onChange={() => toggleIn("tag", t.id)} />
              <span className="check__box" />
              <span className="check__label">{t.label}</span>
            </label>
          ))}
          <label className="check">
            <input type="checkbox" checked={inStock} onChange={() => setParam({ stock: inStock ? null : "1" })} />
            <span className="check__box" />
            <span className="check__label">Faqat mavjudlari</span>
          </label>
        </div>
      </FilterBlock>
    </>
  );

  return (
    <div className="shop" data-sec={CATEGORY_SEC[category ?? ""] ?? "emerald"}>
      {hero ? (
        <header className="shop__hero">
          <div className="shop__heroimg img-frame">
            <img src={hero.img} alt="" />
          </div>
          <div className="container shop__heroinner">
            <Breadcrumbs trail={[{ label: "Katalog", to: "/katalog" }, { label: hero.title }]} />
            <RevealText as="h1" text={hero.title} className="display-lg" />
            <Reveal variant="up" delay={140}>
              <p className="shop__herotext">{hero.text}</p>
            </Reveal>
          </div>
        </header>
      ) : (
        <header className="shop__plainhero container">
          <Breadcrumbs trail={[{ label: "Katalog" }]} />
          <RevealText as="h1" text="Butun katalog" className="display-lg" />
          <Reveal variant="up" delay={120}>
            <p className="muted shop__herotext">
              {PRODUCTS.length} ta model, {COLLECTIONS.length} ta kolleksiya. Filtrlar yordamida
              o'zingizga mosini toping.
            </p>
          </Reveal>
        </header>
      )}

      <div className="container shop__layout">
        <aside className={`shop__side ${filtersOpen ? "is-open" : ""}`}>
          <div className="shop__sidehead">
            <h3>
              <SlidersHorizontal size={17} /> Filtrlar
            </h3>
            <button className="icon-btn shop__sideclose" onClick={() => setFiltersOpen(false)} aria-label="Yopish">
              <X size={16} weight="bold" />
            </button>
          </div>
          <div className="shop__sidebody">{filterPanel}</div>
          {activeCount > 0 && (
            <div className="shop__sidefoot">
              <button className="btn btn--sm btn--ghost" onClick={clearAll}>
                <ArrowsClockwise size={15} /> Tozalash ({activeCount})
              </button>
              <button className="btn btn--sm shop__apply" onClick={() => setFiltersOpen(false)}>
                Ko'rsatish ({filtered.length})
              </button>
            </div>
          )}
        </aside>
        {filtersOpen && <div className="scrim shop__scrim" onClick={() => setFiltersOpen(false)} />}

        <div className="shop__main">
          <div className="shop__bar">
            <button className="btn btn--sm btn--ghost shop__filterbtn" onClick={() => setFiltersOpen(true)}>
              <Funnel size={15} weight="bold" /> Filtrlar
              {activeCount > 0 && <span className="shop__barcount">{activeCount}</span>}
            </button>
            <span className="shop__count muted">
              <strong>{filtered.length}</strong> ta mahsulot
            </span>
            <div className="shop__barright">
              <select value={sort} onChange={(e) => setParam({ sort: e.target.value })} aria-label="Saralash">
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <div className="shop__view">
                <button className={view === "grid" ? "is-on" : ""} onClick={() => setView("grid")} aria-label="Katak">
                  <GridFour size={16} weight="bold" />
                </button>
                <button className={view === "list" ? "is-on" : ""} onClick={() => setView("list")} aria-label="Ro'yxat">
                  <Rows size={16} weight="bold" />
                </button>
              </div>
            </div>
          </div>

          {activeCount > 0 && (
            <div className="shop__pills">
              {[...coll, ...sizes, ...colors].map((v) => (
                <button
                  key={v}
                  className="shop__pill"
                  onClick={() => {
                    if (coll.includes(v)) toggleIn("coll", v);
                    else if (sizes.includes(v)) toggleIn("size", v);
                    else toggleIn("color", v);
                  }}
                >
                  {v} <X size={11} weight="bold" />
                </button>
              ))}
              {tags.map((t) => (
                <button key={t} className="shop__pill" onClick={() => toggleIn("tag", t)}>
                  {QUICK_TAGS.find((x) => x.id === t)?.label || t} <X size={11} weight="bold" />
                </button>
              ))}
              {inStock && (
                <button className="shop__pill" onClick={() => setParam({ stock: null })}>
                  Mavjud <X size={11} weight="bold" />
                </button>
              )}
              <button className="shop__clear" onClick={clearAll}>
                Hammasini tozalash
              </button>
            </div>
          )}

          {shown.length === 0 ? (
            <Empty
              icon={<Funnel size={28} />}
              title="Natija topilmadi"
              text="Filtrlarni yumshatib ko'ring yoki boshqa kalit so'z bilan qidiring."
              action={
                <button className="btn btn--sm" onClick={clearAll}>
                  Filtrlarni tozalash
                </button>
              }
            />
          ) : (
            <>
              <div className={view === "grid" ? "pgrid pgrid--3" : "pgrid pgrid--list"}>
                {shown.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} layout={view} />
                ))}
              </div>

              {page < pageCount && (
                <div className="shop__more">
                  <span className="muted">
                    {shown.length} / {filtered.length}
                  </span>
                  <div className="shop__morebar">
                    <span style={{ width: `${(shown.length / filtered.length) * 100}%` }} />
                  </div>
                  <button className="btn" onClick={() => setPage((p) => p + 1)}>
                    Ko'proq yuklash
                  </button>
                </div>
              )}
            </>
          )}

          {!category && (
            <div className="shop__seo">
              <h2 className="display-md">Kolleksiyalar</h2>
              <div className="shop__colls">
                {COLLECTIONS.map((c) => (
                  <Link key={c} to={`/katalog?coll=${encodeURIComponent(c)}`} className="shop__coll">
                    <strong>{c}</strong>
                    <span className="muted">{PRODUCTS.filter((p) => p.collection === c).length} model</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`fbox ${open ? "is-open" : ""}`}>
      <button className="fbox__head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{title}</span>
        <span className="fbox__sign" />
      </button>
      {open && <div className="fbox__body">{children}</div>}
    </div>
  );
}

export { CATEGORY_LABEL };
