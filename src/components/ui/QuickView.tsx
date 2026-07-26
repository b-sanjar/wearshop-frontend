import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Heart, ShoppingBag, X } from "@phosphor-icons/react";
import { useUI } from "../../store/useUI";
import { useCart } from "../../store/useCart";
import { useWishlist } from "../../store/useWishlist";
import { productById, effectivePrice } from "../../data/products";
import { uzs } from "../../lib/format";
import { useScrollLock } from "../../lib/hooks";
import { Stars } from "./Stars";

export function QuickView() {
  const id = useUI((s) => s.quickViewId);
  const close = () => useUI.getState().setQuickView(null);
  const toast = useUI((s) => s.toast);
  const add = useCart((s) => s.add);
  const wished = useWishlist((s) => (id ? s.ids.includes(id) : false));
  const toggleWish = useWishlist((s) => s.toggle);

  const p = id ? productById(id) : undefined;
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [img, setImg] = useState(0);

  useScrollLock(!!id);

  useEffect(() => {
    if (p) {
      setSize(p.sizes[Math.min(1, p.sizes.length - 1)]);
      setColor(p.colors[0].name);
      setImg(0);
    }
  }, [p]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          className="qv"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="qv__panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="qv__close icon-btn" onClick={close} aria-label="Yopish">
              <X size={17} weight="bold" />
            </button>

            <div className="qv__media">
              <div className="img-frame qv__main">
                <img src={p.images[img]} alt={p.name} />
              </div>
              <div className="qv__thumbs">
                {p.images.map((src, i) => (
                  <button
                    key={src}
                    className={`qv__thumb img-frame ${i === img ? "is-on" : ""}`}
                    onClick={() => setImg(i)}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            </div>

            <div className="qv__info">
              <span className="eyebrow">{p.collection}</span>
              <h3 className="qv__name font-display">{p.name}</h3>
              <div className="qv__rating">
                <Stars value={p.rating} showValue />
                <span className="muted">({p.ratingCount} sharh)</span>
              </div>
              <div className="qv__price">
                <strong>{uzs(effectivePrice(p))}</strong>
                {p.discount > 0 && (
                  <>
                    <s>{uzs(p.price)}</s>
                    <span className="qv__save">−{p.discount}%</span>
                  </>
                )}
              </div>
              <p className="muted qv__desc">{p.description}</p>

              <div className="qv__row">
                <span className="qv__label">Rang: {color}</span>
                <div className="qv__colors">
                  {p.colors.map((c) => (
                    <button
                      key={c.name}
                      className={`swatch swatch--btn ${color === c.name ? "is-on" : ""}`}
                      style={{ background: c.hex }}
                      onClick={() => setColor(c.name)}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="qv__row">
                <span className="qv__label">O'lcham</span>
                <div className="qv__sizes">
                  {p.sizes.map((s) => (
                    <button
                      key={s}
                      className={`chip ${size === s ? "is-on" : ""}`}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="qv__actions">
                <button
                  className="btn btn--accent"
                  onClick={() => {
                    add({ productId: p.id, qty: 1, size, color });
                    toast(`${p.name} savatga qo'shildi`, "ok", p.images[0]);
                    close();
                  }}
                >
                  <ShoppingBag size={17} weight="bold" /> Savatga qo'shish
                </button>
                <button
                  className="icon-btn"
                  data-on={wished}
                  onClick={() => toggleWish(p.id)}
                  aria-label="Sevimlilar"
                >
                  <Heart size={18} weight={wished ? "fill" : "regular"} />
                </button>
              </div>

              <Link className="qv__full" to={`/mahsulot/${p.slug}`} onClick={close}>
                To'liq sahifani ochish <ArrowUpRight size={15} weight="bold" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
