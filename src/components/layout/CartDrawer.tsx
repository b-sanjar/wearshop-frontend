import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash, X } from "@phosphor-icons/react";
import { useUI } from "../../store/useUI";
import { useCart, useCartTotals } from "../../store/useCart";
import { productById, effectivePrice, FREE_SHIPPING_FROM } from "../../data/products";
import { uzs } from "../../lib/format";
import { useScrollLock } from "../../lib/hooks";
import { Empty } from "../ui/Bits";

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const setOpen = useUI((s) => s.setCartOpen);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const t = useCartTotals();

  useScrollLock(open);

  const toFree = Math.max(0, FREE_SHIPPING_FROM - t.subtotal);
  const progress = Math.min(100, (t.subtotal / FREE_SHIPPING_FROM) * 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="drawer drawer--cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            role="dialog"
            aria-label="Savat"
          >
            <header className="drawer__head">
              <div>
                <h3>Savat</h3>
                <span className="muted">{t.count} ta buyum</span>
              </div>
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Yopish">
                <X size={17} weight="bold" />
              </button>
            </header>

            {items.length > 0 && (
              <div className="cartd__ship">
                <div className="cartd__shipbar">
                  <span style={{ width: `${progress}%` }} />
                </div>
                <p className="muted">
                  {toFree > 0 ? (
                    <>
                      Bepul yetkazishgacha <strong>{uzs(toFree)}</strong> qoldi
                    </>
                  ) : (
                    <strong>Yetkazib berish bepul</strong>
                  )}
                </p>
              </div>
            )}

            <div className="drawer__body">
              {items.length === 0 ? (
                <Empty
                  icon={<ShoppingBag size={30} />}
                  title="Savat bo'sh"
                  text="Kolleksiyalarimizni ko'rib chiqing va yoqqan buyumlarni savatga qo'shing."
                  action={
                    <Link className="btn btn--sm" to="/katalog" onClick={() => setOpen(false)}>
                      Katalogga o'tish
                    </Link>
                  }
                />
              ) : (
                <ul className="cartd__list">
                  <AnimatePresence initial={false}>
                    {items.map((it) => {
                      const p = productById(it.productId);
                      if (!p) return null;
                      return (
                        <motion.li
                          key={`${it.productId}-${it.size}-${it.color}`}
                          className="cartd__item"
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Link
                            to={`/mahsulot/${p.slug}`}
                            className="cartd__img img-frame"
                            onClick={() => setOpen(false)}
                          >
                            <img src={p.images[0]} alt={p.name} />
                          </Link>
                          <div className="cartd__info">
                            <Link
                              to={`/mahsulot/${p.slug}`}
                              className="cartd__name"
                              onClick={() => setOpen(false)}
                            >
                              {p.name}
                            </Link>
                            <span className="muted cartd__variant">
                              {it.size} · {it.color}
                            </span>
                            <div className="cartd__row">
                              <div className="qty">
                                <button
                                  onClick={() => setQty(it.productId, it.size, it.color, it.qty - 1)}
                                  aria-label="Kamaytirish"
                                >
                                  <Minus size={12} weight="bold" />
                                </button>
                                <span>{it.qty}</span>
                                <button
                                  onClick={() => setQty(it.productId, it.size, it.color, it.qty + 1)}
                                  aria-label="Ko'paytirish"
                                >
                                  <Plus size={12} weight="bold" />
                                </button>
                              </div>
                              <strong>{uzs(effectivePrice(p) * it.qty)}</strong>
                            </div>
                          </div>
                          <button
                            className="cartd__del"
                            onClick={() => remove(it.productId, it.size, it.color)}
                            aria-label="O'chirish"
                          >
                            <Trash size={15} />
                          </button>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="drawer__foot">
                <div className="cartd__sums">
                  <div className="cartd__sum">
                    <span className="muted">Oraliq summa</span>
                    <strong>{uzs(t.subtotal)}</strong>
                  </div>
                  {t.discount > 0 && (
                    <div className="cartd__sum">
                      <span className="muted">Chegirma</span>
                      <strong className="is-ok">−{uzs(t.discount)}</strong>
                    </div>
                  )}
                  <div className="cartd__sum">
                    <span className="muted">Yetkazish</span>
                    <strong>{t.shipping === 0 ? "Bepul" : uzs(t.shipping)}</strong>
                  </div>
                  <div className="cartd__sum cartd__sum--total">
                    <span>Jami</span>
                    <strong>{uzs(t.total)}</strong>
                  </div>
                </div>
                <Link className="btn btn--accent cartd__cta" to="/tolov" onClick={() => setOpen(false)}>
                  Rasmiylashtirish <ArrowRight size={16} weight="bold" />
                </Link>
                <Link className="cartd__more" to="/savat" onClick={() => setOpen(false)}>
                  Savatni to'liq ko'rish
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
