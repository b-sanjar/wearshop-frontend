import { Link } from "react-router-dom";
import { ArrowRight, Heart, ShoppingBag, Trash } from "@phosphor-icons/react";
import { useWishlist } from "../store/useWishlist";
import { useCart } from "../store/useCart";
import { useUI } from "../store/useUI";
import { PRODUCTS, effectivePrice } from "../data/products";
import { uzs, CATEGORY_LABEL } from "../lib/format";
import { Breadcrumbs, Empty } from "../components/ui/Bits";
import { ProductCard } from "../components/ui/ProductCard";
import { RevealText, Reveal } from "../components/ui/Reveal";

export default function Wishlist() {
  const ids = useWishlist((s) => s.ids);
  const clear = useWishlist((s) => s.clear);
  const add = useCart((s) => s.add);
  const toast = useUI((s) => s.toast);

  const items = ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as typeof PRODUCTS;

  const totalValue = items.reduce((s, p) => s + effectivePrice(p), 0);
  const avgDiscount = items.length
    ? Math.round(items.reduce((s, p) => s + p.discount, 0) / items.length)
    : 0;
  const topCategory = (() => {
    const counts: Record<string, number> = {};
    items.forEach((p) => (counts[p.category] = (counts[p.category] || 0) + 1));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? CATEGORY_LABEL[top[0]] : "—";
  })();
  const onSale = items.filter((p) => p.discount > 0).length;

  const addAll = () => {
    items.forEach((p) =>
      add({ productId: p.id, qty: 1, size: p.sizes[Math.min(1, p.sizes.length - 1)], color: p.colors[0].name }),
    );
    toast(`${items.length} ta buyum savatga qo'shildi`, "ok");
  };

  return (
    <div className="container wish" data-sec="rose">
      <div className="wish__head">
        <Breadcrumbs trail={[{ label: "Sevimlilar" }]} />
        <RevealText as="h1" text="Sevimlilar" className="display-lg" />
        <Reveal variant="up" delay={120}>
          <p className="muted">
            Yoqqan buyumlaringiz shu yerda saqlanadi — istalgan vaqtda savatga o'tkazing.
          </p>
        </Reveal>
      </div>

      {items.length === 0 ? (
        <Empty
          icon={<Heart size={30} />}
          title="Sevimlilar ro'yxati bo'sh"
          text="Mahsulot kartasidagi yurakcha belgisini bosib, yoqqan buyumlarni bu yerga saqlang."
          action={
            <Link className="btn" to="/katalog">
              Katalogga o'tish <ArrowRight size={16} weight="bold" />
            </Link>
          }
        />
      ) : (
        <>
          <div className="wish__stats">
            {[
              { label: "Buyumlar", value: String(items.length) },
              { label: "Umumiy qiymat", value: uzs(totalValue) },
              { label: "O'rtacha chegirma", value: `${avgDiscount}%` },
              { label: "Asosiy kategoriya", value: topCategory },
              { label: "Chegirmadagilar", value: String(onSale) },
            ].map((s, i) => (
              <Reveal variant="up" delay={i * 70} key={s.label}>
                <div className="wish__stat">
                  <strong>{s.value}</strong>
                  <span className="muted">{s.label}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="wish__bar">
            <button className="btn btn--sm btn--accent" onClick={addAll}>
              <ShoppingBag size={15} weight="bold" /> Hammasini savatga
            </button>
            <button
              className="btn btn--sm btn--ghost"
              onClick={() => {
                clear();
                toast("Ro'yxat tozalandi", "info");
              }}
            >
              <Trash size={15} /> Tozalash
            </button>
          </div>

          <div className="pgrid pgrid--4">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
