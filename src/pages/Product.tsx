import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Minus,
  Package,
  Plus,
  Ruler,
  ShareNetwork,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "@phosphor-icons/react";
import { productBySlug, effectivePrice, relatedProducts, seedReviews, PRODUCTS } from "../data/products";
import { CATEGORY_LABEL, uzs, dateUz } from "../lib/format";
import { useCart } from "../store/useCart";
import { useWishlist } from "../store/useWishlist";
import { useUI } from "../store/useUI";
import { useAuth } from "../store/useAuth";
import { Breadcrumbs } from "../components/ui/Bits";
import { Stars } from "../components/ui/Stars";
import { ProductCard } from "../components/ui/ProductCard";
import { Reveal } from "../components/ui/Reveal";
import { Accordion } from "../components/ui/Accordion";
import { Rail } from "../components/ui/Rail";

export default function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const p = slug ? productBySlug(slug) : undefined;

  const add = useCart((s) => s.add);
  const toast = useUI((s) => s.toast);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const wished = useWishlist((s) => (p ? s.ids.includes(p.id) : false));
  const toggleWish = useWishlist((s) => s.toggle);
  const pushViewed = useAuth((s) => s.pushViewed);
  const viewed = useAuth((s) => s.recentlyViewed);
  const user = useAuth((s) => s.user);

  const [img, setImg] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const [tab, setTab] = useState<"desc" | "fabric" | "ship">("desc");
  const [reviews, setReviews] = useState(() => (p ? seedReviews(p.id) : []));
  const [rForm, setRForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    if (!p) return;
    setImg(0);
    setSize(p.sizes[Math.min(1, p.sizes.length - 1)]);
    setColor(p.colors[0].name);
    setQty(1);
    setReviews(seedReviews(p.id));
    pushViewed(p.id);
  }, [p, pushViewed]);

  const related = useMemo(() => (p ? relatedProducts(p, 4) : []), [p]);
  const alsoViewed = useMemo(
    () => viewed.filter((id) => id !== p?.id).map((id) => PRODUCTS.find((x) => x.id === id)!).filter(Boolean),
    [viewed, p],
  );

  if (!p) {
    return (
      <div className="container section" style={{ textAlign: "center" }}>
        <h1 className="display-md">Mahsulot topilmadi</h1>
        <p className="muted" style={{ marginBlock: "1rem 1.5rem" }}>
          Ushbu manzil bo'yicha mahsulot mavjud emas.
        </p>
        <Link className="btn" to="/katalog">
          Katalogga qaytish
        </Link>
      </div>
    );
  }

  const price = effectivePrice(p);
  const avgRating =
    reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : p.rating;

  const doAdd = (buyNow = false) => {
    add({ productId: p.id, qty, size, color });
    if (buyNow) navigate("/tolov");
    else {
      toast(`${p.name} savatga qo'shildi`, "ok", p.images[0]);
      setCartOpen(true);
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: p.name, url });
      else {
        await navigator.clipboard.writeText(url);
        toast("Havola nusxalandi", "info");
      }
    } catch {
      /* user cancelled */
    }
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast("Sharh qoldirish uchun avval tizimga kiring", "danger");
      navigate("/kirish");
      return;
    }
    if (rForm.comment.trim().length < 5) {
      toast("Sharh kamida 5 ta belgidan iborat bo'lsin", "danger");
      return;
    }
    setReviews([
      {
        id: `local-${Date.now()}`,
        productId: p.id,
        author: user.name,
        rating: rForm.rating,
        comment: rForm.comment.trim(),
        date: new Date().toISOString().slice(0, 10),
      },
      ...reviews,
    ]);
    setRForm({ rating: 5, comment: "" });
    toast("Sharhingiz uchun rahmat!", "ok");
  };

  return (
    <div className="pdp" data-sec="emerald">
      <div className="container pdp__top">
        <Breadcrumbs
          trail={[
            { label: "Katalog", to: "/katalog" },
            { label: CATEGORY_LABEL[p.category], to: `/katalog/${p.category}` },
            { label: p.name },
          ]}
        />
        <button className="pdp__back" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} weight="bold" /> Orqaga
        </button>
      </div>

      <div className="container pdp__grid">
        {/* -------- Gallery -------- */}
        <div className="pdp__gallery">
          <div className="pdp__thumbs">
            {p.images.map((src, i) => (
              <button
                key={src}
                className={`pdp__thumb img-frame ${i === img ? "is-on" : ""}`}
                onClick={() => setImg(i)}
                aria-label={`Rasm ${i + 1}`}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
          <div
            className="pdp__main img-frame"
            onMouseEnter={() => setZoom((z) => ({ ...z, on: true }))}
            onMouseLeave={() => setZoom({ on: false, x: 50, y: 50 })}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({
                on: true,
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
              });
            }}
          >
            <img
              src={p.images[img]}
              alt={p.name}
              style={{
                transform: zoom.on ? "scale(1.75)" : "scale(1)",
                transformOrigin: `${zoom.x}% ${zoom.y}%`,
              }}
            />
            {p.discount > 0 && <span className="pdp__badge">−{p.discount}%</span>}
          </div>
        </div>

        {/* -------- Info -------- */}
        <div className="pdp__info">
          <div className="pdp__head">
            <span className="eyebrow">{p.collection}</span>
            <h1 className="pdp__name display-md">{p.name}</h1>
            <div className="pdp__rating">
              <Stars value={avgRating} size={15} showValue />
              <a href="#reviews" className="pdp__revlink">
                {reviews.length} ta sharh
              </a>
              <span className="pdp__sep" />
              <span className="muted">{CATEGORY_LABEL[p.category]}</span>
            </div>
          </div>

          <div className="pdp__price">
            <strong>{uzs(price)}</strong>
            {p.discount > 0 && (
              <>
                <s>{uzs(p.price)}</s>
                <span className="tag tag--info">{uzs(p.price - price)} tejaysiz</span>
              </>
            )}
          </div>

          <p className="pdp__desc muted">{p.description}</p>

          <div className="pdp__opt">
            <div className="pdp__optlabel">
              <span>Rang</span>
              <strong>{color}</strong>
            </div>
            <div className="pdp__colors">
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

          <div className="pdp__opt">
            <div className="pdp__optlabel">
              <span>O'lcham</span>
              <Link to="/olcham-jadvali" className="pdp__sizelink">
                <Ruler size={14} /> O'lcham jadvali
              </Link>
            </div>
            <div className="pdp__sizes">
              {p.sizes.map((s) => (
                <button key={s} className={`chip ${size === s ? "is-on" : ""}`} onClick={() => setSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pdp__stock">
            {p.stock > 8 ? (
              <span className="tag tag--ok">Mavjud</span>
            ) : p.stock > 0 ? (
              <span className="tag tag--warn">Oxirgi {p.stock} ta qoldi</span>
            ) : (
              <span className="tag tag--danger">Tugagan</span>
            )}
          </div>

          <div className="pdp__buy">
            <div className="qty qty--lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Kamaytirish">
                <Minus size={13} weight="bold" />
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(p.stock || 1, qty + 1))} aria-label="Ko'paytirish">
                <Plus size={13} weight="bold" />
              </button>
            </div>
            <button className="btn btn--accent pdp__addbtn" onClick={() => doAdd()} disabled={p.stock === 0}>
              <ShoppingBag size={17} weight="bold" /> Savatga qo'shish
            </button>
            <button
              className="icon-btn pdp__wish"
              data-on={wished}
              onClick={() => {
                const added = toggleWish(p.id);
                toast(added ? "Sevimlilarga qo'shildi" : "Sevimlilardan olib tashlandi", added ? "ok" : "info");
              }}
              aria-label="Sevimlilar"
            >
              <Heart size={18} weight={wished ? "fill" : "regular"} />
            </button>
            <button className="icon-btn" onClick={share} aria-label="Ulashish">
              <ShareNetwork size={18} />
            </button>
          </div>

          <button className="btn pdp__buynow" onClick={() => doAdd(true)} disabled={p.stock === 0}>
            Hoziroq sotib olish <ArrowRight size={16} weight="bold" />
          </button>

          <ul className="pdp__perks">
            <li>
              <Truck size={17} /> 500 000 so'mdan yuqori buyurtmalarga bepul yetkazish
            </li>
            <li>
              <Package size={17} /> 14 kun ichida bepul qaytarish
            </li>
            <li>
              <ShieldCheck size={17} /> Tikuv nuqsonlariga 6 oy kafolat
            </li>
          </ul>

          <div className="pdp__tabs">
            <div className="pdp__tabhead">
              {[
                { id: "desc", label: "Tavsif" },
                { id: "fabric", label: "Mato va parvarish" },
                { id: "ship", label: "Yetkazish" },
              ].map((t) => (
                <button
                  key={t.id}
                  className={tab === t.id ? "is-on" : ""}
                  onClick={() => setTab(t.id as typeof tab)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="pdp__tabbody muted">
              {tab === "desc" && (
                <>
                  <p>{p.description}</p>
                  <ul className="pdp__speclist">
                    <li>
                      <span>Kolleksiya</span>
                      <strong>{p.collection}</strong>
                    </li>
                    <li>
                      <span>Kategoriya</span>
                      <strong>{CATEGORY_LABEL[p.category]}</strong>
                    </li>
                    <li>
                      <span>Mavjud o'lchamlar</span>
                      <strong>{p.sizes.join(", ")}</strong>
                    </li>
                    <li>
                      <span>Ranglar</span>
                      <strong>{p.colors.map((c) => c.name).join(", ")}</strong>
                    </li>
                  </ul>
                </>
              )}
              {tab === "fabric" && (
                <>
                  <p>
                    <strong>Tarkib:</strong> {p.fabric}
                  </p>
                  <ul className="pdp__carelist">
                    {p.care.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </>
              )}
              {tab === "ship" && (
                <Accordion
                  items={[
                    {
                      q: "Yetkazib berish muddati",
                      a: "Surxondaryo bo'ylab 1—2 ish kuni, boshqa viloyatlarga 2—4 ish kuni. Buyurtma holatini kabinetdan kuzatasiz.",
                    },
                    {
                      q: "Qaytarish shartlari",
                      a: "14 kun ichida, kiyilmagan va yorliqlari joyida bo'lgan holda bepul qaytarish. Pul 3—5 bank kunida qaytariladi.",
                    },
                    {
                      q: "Do'kondan olib ketish",
                      a: "Olti filialimizning istalganidan bepul olib ketishingiz mumkin. To'lov bosqichida tanlang.",
                    },
                  ]}
                  defaultOpen={0}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* -------- Reviews -------- */}
      <section className="section pdp__reviews" id="reviews">
        <div className="container">
          <div className="pdp__revgrid">
            <div className="pdp__revsum">
              <span className="eyebrow">Sharhlar</span>
              <strong className="pdp__revbig font-display">{avgRating.toFixed(1)}</strong>
              <Stars value={avgRating} size={17} />
              <span className="muted">{reviews.length} ta baho asosida</span>

              <div className="pdp__revbars">
                {[5, 4, 3, 2, 1].map((star) => {
                  const n = reviews.filter((r) => r.rating === star).length;
                  const pct = reviews.length ? (n / reviews.length) * 100 : 0;
                  return (
                    <div className="pdp__revbar" key={star}>
                      <span>{star}</span>
                      <span className="pdp__revtrack">
                        <span style={{ width: `${pct}%` }} />
                      </span>
                      <span className="muted">{n}</span>
                    </div>
                  );
                })}
              </div>

              <form className="pdp__revform" onSubmit={submitReview}>
                <span className="pdp__revformlabel">Sharh qoldiring</span>
                <div className="pdp__revstars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      type="button"
                      key={i}
                      className={rForm.rating >= i ? "is-on" : ""}
                      onClick={() => setRForm({ ...rForm, rating: i })}
                      aria-label={`${i} yulduz`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  placeholder="Mahsulot haqidagi fikringiz…"
                  value={rForm.comment}
                  onChange={(e) => setRForm({ ...rForm, comment: e.target.value })}
                />
                <button className="btn btn--sm" type="submit">
                  Yuborish
                </button>
              </form>
            </div>

            <ul className="pdp__revlist">
              {reviews.map((r) => (
                <li key={r.id} className="pdp__rev">
                  <div className="pdp__revhead">
                    <span className="pdp__revavatar">{r.author.charAt(0)}</span>
                    <div>
                      <strong>{r.author}</strong>
                      <span className="muted">{dateUz(r.date)}</span>
                    </div>
                    <Stars value={r.rating} size={13} />
                  </div>
                  <p className="muted">{r.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* -------- Related -------- */}
      <section className="section">
        <div className="container">
          <div className="sechead sechead--split">
            <div className="sechead__main">
              <span className="eyebrow">Shunga o'xshash</span>
              <h2 className="display-md">Buni ham ko'ring</h2>
            </div>
            <Link className="link-arrow" to={`/katalog/${p.category}`}>
              Butun kategoriya
            </Link>
          </div>
          <div className="pgrid pgrid--4">
            {related.map((r, i) => (
              <Reveal variant="up" delay={i * 80} key={r.id}>
                <ProductCard product={r} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {alsoViewed.length > 0 && (
        <section className="section pdp__viewed">
          <div className="container">
            <div className="sechead sechead--left">
              <div className="sechead__main">
                <span className="eyebrow">Yaqinda ko'rilgan</span>
              </div>
            </div>
            <Rail>
              {alsoViewed.map((v, i) => (
                <div className="rail__cell" key={v.id}>
                  <ProductCard product={v} index={i} />
                </div>
              ))}
            </Rail>
          </div>
        </section>
      )}

      {/* -------- Sticky mobile bar -------- */}
      <div className="pdp__sticky">
        <div className="pdp__stickyinfo">
          <strong>{uzs(price)}</strong>
          <span className="muted">
            {size} · {color}
          </span>
        </div>
        <button className="btn btn--accent btn--sm" onClick={() => doAdd()} disabled={p.stock === 0}>
          <ShoppingBag size={15} weight="bold" /> Savatga
        </button>
      </div>
    </div>
  );
}
