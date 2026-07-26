import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingBag, Tag, Trash } from "@phosphor-icons/react";
import { useCart, useCartTotals } from "../store/useCart";
import { productById, effectivePrice, PROMOS, FREE_SHIPPING_FROM, PRODUCTS } from "../data/products";
import { uzs } from "../lib/format";
import { useUI } from "../store/useUI";
import { Breadcrumbs, Empty } from "../components/ui/Bits";
import { RevealText } from "../components/ui/Reveal";
import { ProductCard } from "../components/ui/ProductCard";
import { Rail } from "../components/ui/Rail";

export default function Cart() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const promo = useCart((s) => s.promo);
  const applyPromo = useCart((s) => s.applyPromo);
  const clearPromo = useCart((s) => s.clearPromo);
  const toast = useUI((s) => s.toast);
  const t = useCartTotals();
  const [code, setCode] = useState("");

  const suggestions = PRODUCTS.filter((p) => !items.some((i) => i.productId === p.id))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8);

  const submitPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const r = applyPromo(code);
    toast(r.message, r.ok ? "ok" : "danger");
    if (r.ok) setCode("");
  };

  return (
    <div className="container cartpage" data-sec="emerald">
      <div className="cartpage__head">
        <Breadcrumbs trail={[{ label: "Savat" }]} />
        <RevealText as="h1" text="Savat" className="display-lg" />
        {items.length > 0 && <p className="muted">{t.count} ta buyum tanlandi</p>}
      </div>

      {items.length === 0 ? (
        <Empty
          icon={<ShoppingBag size={30} />}
          title="Savatingiz hozircha bo'sh"
          text="Kolleksiyalarni ko'rib chiqing — yoqqan buyumni savatga qo'shsangiz, u shu yerda paydo bo'ladi."
          action={
            <Link className="btn" to="/katalog">
              Katalogga o'tish <ArrowRight size={16} weight="bold" />
            </Link>
          }
        />
      ) : (
        <div className="cartpage__grid">
          <div className="cartpage__list">
            <div className="cartpage__thead">
              <span>Mahsulot</span>
              <span>Narx</span>
              <span>Soni</span>
              <span>Jami</span>
              <span />
            </div>
            {items.map((it) => {
              const p = productById(it.productId);
              if (!p) return null;
              const unit = effectivePrice(p);
              return (
                <div className="cartrow" key={`${it.productId}-${it.size}-${it.color}`}>
                  <div className="cartrow__product">
                    <Link to={`/mahsulot/${p.slug}`} className="cartrow__img img-frame">
                      <img src={p.images[0]} alt={p.name} loading="lazy" />
                    </Link>
                    <div className="cartrow__info">
                      <Link to={`/mahsulot/${p.slug}`} className="cartrow__name">
                        {p.name}
                      </Link>
                      <span className="muted">{p.collection}</span>
                      <span className="cartrow__variant muted">
                        O'lcham: <strong>{it.size}</strong> · Rang: <strong>{it.color}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="cartrow__price" data-label="Narx">
                    <strong>{uzs(unit)}</strong>
                    {p.discount > 0 && <s>{uzs(p.price)}</s>}
                  </div>
                  <div className="cartrow__qty" data-label="Soni">
                    <div className="qty">
                      <button onClick={() => setQty(it.productId, it.size, it.color, it.qty - 1)} aria-label="Kamaytirish">
                        <Minus size={12} weight="bold" />
                      </button>
                      <span>{it.qty}</span>
                      <button onClick={() => setQty(it.productId, it.size, it.color, it.qty + 1)} aria-label="Ko'paytirish">
                        <Plus size={12} weight="bold" />
                      </button>
                    </div>
                  </div>
                  <div className="cartrow__total" data-label="Jami">
                    <strong>{uzs(unit * it.qty)}</strong>
                  </div>
                  <button
                    className="cartrow__del"
                    onClick={() => remove(it.productId, it.size, it.color)}
                    aria-label="O'chirish"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              );
            })}

            <Link className="cartpage__continue" to="/katalog">
              ← Xaridni davom ettirish
            </Link>
          </div>

          <aside className="cartpage__side">
            <div className="panel cartpage__sum">
              <h3>Buyurtma xulosasi</h3>

              <form className="cartpage__promo" onSubmit={submitPromo}>
                <div className="cartpage__promorow">
                  <input
                    placeholder="Promo-kod"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    aria-label="Promo-kod"
                  />
                  <button className="btn btn--sm" type="submit">
                    Qo'llash
                  </button>
                </div>
                {promo ? (
                  <div className="cartpage__promoon">
                    <Tag size={14} weight="fill" /> {promo} faol
                    <button type="button" onClick={clearPromo}>
                      olib tashlash
                    </button>
                  </div>
                ) : (
                  <div className="cartpage__promohints">
                    {PROMOS.map((p) => (
                      <button type="button" key={p.code} onClick={() => setCode(p.code)} className="cartpage__promohint">
                        <strong>{p.code}</strong>
                        <span className="muted">{p.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </form>

              <ul className="cartpage__lines">
                <li>
                  <span className="muted">Oraliq summa</span>
                  <strong>{uzs(t.subtotal)}</strong>
                </li>
                {t.discount > 0 && (
                  <li>
                    <span className="muted">Chegirma</span>
                    <strong className="is-ok">−{uzs(t.discount)}</strong>
                  </li>
                )}
                <li>
                  <span className="muted">Yetkazib berish</span>
                  <strong>{t.shipping === 0 ? "Bepul" : uzs(t.shipping)}</strong>
                </li>
              </ul>

              {t.subtotal < FREE_SHIPPING_FROM && (
                <p className="cartpage__free muted">
                  Yana <strong>{uzs(FREE_SHIPPING_FROM - t.subtotal)}</strong> qo'shsangiz, yetkazish
                  bepul bo'ladi.
                </p>
              )}

              <div className="cartpage__total">
                <span>Jami</span>
                <strong>{uzs(t.total)}</strong>
              </div>

              <Link className="btn btn--accent cartpage__cta" to="/tolov">
                Rasmiylashtirishga o'tish <ArrowRight size={16} weight="bold" />
              </Link>
              <p className="cartpage__secure muted">To'lov ma'lumotlari shifrlangan kanal orqali uzatiladi</p>
            </div>
          </aside>
        </div>
      )}

      {suggestions.length > 0 && (
        <section className="section cartpage__sugg">
          <div className="sechead sechead--left">
            <div className="sechead__main">
              <span className="eyebrow">Buni ham qo'shing</span>
              <h2 className="display-md">Tavsiya etamiz</h2>
            </div>
          </div>
          <Rail>
            {suggestions.map((p, i) => (
              <div className="rail__cell" key={p.id}>
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </Rail>
        </section>
      )}
    </div>
  );
}
