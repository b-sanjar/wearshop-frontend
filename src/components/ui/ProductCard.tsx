import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Eye, Heart, ShoppingBag } from "@phosphor-icons/react";
import type { Product } from "../../data/types";
import { effectivePrice } from "../../data/products";
import { uzs } from "../../lib/format";
import { useWishlist } from "../../store/useWishlist";
import { useCart } from "../../store/useCart";
import { useUI } from "../../store/useUI";
import { Stars } from "./Stars";
import { prefersReducedMotion } from "../../lib/hooks";

interface ProductCardProps {
  product: Product;
  index?: number;
  layout?: "grid" | "list";
  /** Renders a larger editorial variant used on the home page. */
  feature?: boolean;
}

export function ProductCard({ product: p, index = 0, layout = "grid", feature = false }: ProductCardProps) {
  const [hover, setHover] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const wished = useWishlist((s) => s.ids.includes(p.id));
  const toggleWish = useWishlist((s) => s.toggle);
  const add = useCart((s) => s.add);
  const toast = useUI((s) => s.toast);
  const setQuickView = useUI((s) => s.setQuickView);

  const price = effectivePrice(p);
  const badge = p.discount >= 20 ? "sale" : p.isNew ? "new" : p.popularity >= 92 ? "best" : null;
  const badgeLabel = badge === "sale" ? `−${p.discount}%` : badge === "new" ? "Yangi" : "Top";

  const tilt = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el || prefersReducedMotion() || layout === "list") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${-py * 5}deg`);
    el.style.setProperty("--ry", `${px * 5}deg`);
    // Feeds the glare highlight in motion.css
    el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
  };
  const resetTilt = () => {
    const el = cardRef.current;
    if (el) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }
  };

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({ productId: p.id, qty: 1, size: p.sizes[Math.min(1, p.sizes.length - 1)], color: p.colors[0].name });
    toast(`${p.name} savatga qo'shildi`, "ok", p.images[0]);
  };

  const wish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWish(p.id);
    toast(added ? "Sevimlilarga qo'shildi" : "Sevimlilardan olib tashlandi", added ? "ok" : "info");
  };

  const quick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickView(p.id);
  };

  return (
    <article
      ref={cardRef}
      className={`pcard ${layout === "list" ? "pcard--list" : ""} ${feature ? "pcard--feature" : ""}`}
      style={{ "--i": index, "--tint": p.colors[0].hex } as React.CSSProperties}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        resetTilt();
      }}
      onMouseMove={tilt}
    >
      <Link to={`/mahsulot/${p.slug}`} className="pcard__media img-frame shine" aria-label={p.name}>
        <img src={p.images[0]} alt={p.name} loading="lazy" className="pcard__img pcard__img--a" />
        <img
          src={p.images[1]}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pcard__img pcard__img--b"
          style={{ opacity: hover ? 1 : 0 }}
        />
        <span className="pcard__wash" aria-hidden="true" />
        {badge && <span className={`pcard__badge pcard__badge--${badge}`}>{badgeLabel}</span>}
        {p.stock <= 5 && <span className="pcard__badge pcard__badge--low">Oxirgi {p.stock} ta</span>}

        <div className="pcard__tools">
          <button className="pcard__tool" onClick={wish} aria-label="Sevimlilarga qo'shish" data-on={wished}>
            <Heart size={17} weight={wished ? "fill" : "regular"} />
          </button>
          <button className="pcard__tool" onClick={quick} aria-label="Tezkor ko'rish">
            <Eye size={17} />
          </button>
        </div>

        <button className="pcard__add" onClick={quickAdd}>
          <ShoppingBag size={16} weight="bold" />
          <span>Savatga</span>
        </button>
      </Link>

      <div className="pcard__body">
        <div className="pcard__meta">
          <span className="pcard__coll">{p.collection}</span>
          <Stars value={p.rating} size={11} />
        </div>
        <h3 className="pcard__name">
          <Link to={`/mahsulot/${p.slug}`}>{p.name}</Link>
        </h3>
        {layout === "list" && <p className="pcard__desc muted">{p.description}</p>}
        <div className="pcard__foot">
          <div className="pcard__price">
            <strong>{uzs(price)}</strong>
            {p.discount > 0 && <s>{uzs(p.price)}</s>}
          </div>
          <div className="pcard__swatches">
            {p.colors.slice(0, 4).map((c) => (
              <span key={c.name} className="swatch" style={{ background: c.hex }} title={c.name} />
            ))}
          </div>
        </div>
        {layout === "list" && (
          <div className="pcard__listactions">
            <button className="btn btn--sm" onClick={quickAdd}>
              <ShoppingBag size={15} weight="bold" /> Savatga
            </button>
            <Link className="btn btn--sm btn--ghost" to={`/mahsulot/${p.slug}`}>
              Batafsil <ArrowUpRight size={15} weight="bold" />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
