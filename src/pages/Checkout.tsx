import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bank,
  Check,
  CreditCard,
  Money,
  Storefront,
  Tag,
  Truck,
} from "@phosphor-icons/react";
import { useCart, useCartTotals } from "../store/useCart";
import { useAuth } from "../store/useAuth";
import { useUI } from "../store/useUI";
import { productById, effectivePrice, SHIPPING_FEE } from "../data/products";
import { STORES } from "../data/content";
import { uzs } from "../lib/format";
import { Breadcrumbs, Empty } from "../components/ui/Bits";

const STEPS = ["Yetkazish", "To'lov", "Tasdiqlash"];

const PAYMENTS = [
  { id: "card", label: "Karta orqali onlayn", note: "UzCard, Humo, Visa, Mastercard", Icon: CreditCard },
  { id: "cash", label: "Yetkazishda naqd", note: "Kuryerga naqd yoki terminal orqali", Icon: Money },
  { id: "transfer", label: "Bank o'tkazmasi", note: "Yuridik shaxslar uchun hisob-faktura", Icon: Bank },
];

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const promo = useCart((s) => s.promo);
  const applyPromo = useCart((s) => s.applyPromo);
  const clear = useCart((s) => s.clear);
  const user = useAuth((s) => s.user);
  const placeOrder = useAuth((s) => s.placeOrder);
  const toast = useUI((s) => s.toast);
  const t = useCartTotals();

  const [step, setStep] = useState(0);
  const [delivery, setDelivery] = useState<"courier" | "pickup">("courier");
  const [pickupStore, setPickupStore] = useState(STORES[0].id);
  const [payment, setPayment] = useState("card");
  const [code, setCode] = useState("");
  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "Denov",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = delivery === "pickup" ? 0 : t.shipping;
  const total = Math.max(0, t.subtotal - t.discount + shipping);

  if (items.length === 0) {
    return (
      <div className="container section">
        <Empty
          icon={<Truck size={30} />}
          title="Savat bo'sh"
          text="Buyurtma rasmiylashtirish uchun avval savatga mahsulot qo'shing."
          action={
            <Link className="btn" to="/katalog">
              Katalogga o'tish
            </Link>
          }
        />
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 3) e.fullName = "To'liq ismni kiriting";
    if (!/^\+?[\d\s()-]{9,}$/.test(form.phone.trim())) e.phone = "Telefon raqami noto'g'ri";
    if (delivery === "courier") {
      if (!form.city.trim()) e.city = "Shaharni tanlang";
      if (form.address.trim().length < 6) e.address = "Manzilni to'liqroq yozing";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0 && !validate()) {
      toast("Yetkazish ma'lumotlarini to'ldiring", "danger");
      return;
    }
    setStep((s) => Math.min(2, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = () => {
    const store = STORES.find((s) => s.id === pickupStore)!;
    const order = placeOrder({
      items: items.map((it) => {
        const p = productById(it.productId)!;
        return {
          productId: p.id,
          name: p.name,
          qty: it.qty,
          size: it.size,
          color: it.color,
          price: effectivePrice(p),
          image: p.images[0],
        };
      }),
      subtotal: t.subtotal,
      discount: t.discount,
      shipping,
      total,
      payment,
      promo: promo || undefined,
      shippingInfo: {
        fullName: form.fullName,
        phone: form.phone,
        city: delivery === "pickup" ? store.city : form.city,
        address: delivery === "pickup" ? `${store.name}, ${store.address}` : form.address,
        note: form.note,
      },
    });
    clear();
    navigate(`/buyurtma/${order.id}`);
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="container ckt" data-sec="teal">
      <div className="ckt__head">
        <Breadcrumbs trail={[{ label: "Savat", to: "/savat" }, { label: "Rasmiylashtirish" }]} />
        <h1 className="display-md">Buyurtmani rasmiylashtirish</h1>
      </div>

      <ol className="ckt__steps">
        {STEPS.map((s, i) => (
          <li key={s} className={`ckt__step ${i === step ? "is-on" : ""} ${i < step ? "is-done" : ""}`}>
            <button onClick={() => i < step && setStep(i)} disabled={i > step}>
              <span className="ckt__stepn">{i < step ? <Check size={13} weight="bold" /> : i + 1}</span>
              <span>{s}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="ckt__grid">
        <div className="ckt__main">
          {step === 0 && (
            <section className="panel ckt__panel">
              <h3 className="ckt__ptitle">Yetkazib berish usuli</h3>
              <div className="ckt__delivery">
                <button
                  className={`ckt__delopt ${delivery === "courier" ? "is-on" : ""}`}
                  onClick={() => setDelivery("courier")}
                >
                  <Truck size={20} />
                  <span>
                    <strong>Kuryer orqali</strong>
                    <span className="muted">1—4 ish kuni · {t.subtotal >= 500000 ? "Bepul" : uzs(SHIPPING_FEE)}</span>
                  </span>
                </button>
                <button
                  className={`ckt__delopt ${delivery === "pickup" ? "is-on" : ""}`}
                  onClick={() => setDelivery("pickup")}
                >
                  <Storefront size={20} />
                  <span>
                    <strong>Do'kondan olish</strong>
                    <span className="muted">Bepul · Ertaga tayyor</span>
                  </span>
                </button>
              </div>

              {delivery === "pickup" && (
                <div className="ckt__stores">
                  {STORES.map((s) => (
                    <label className={`ckt__store ${pickupStore === s.id ? "is-on" : ""}`} key={s.id}>
                      <input
                        type="radio"
                        name="store"
                        checked={pickupStore === s.id}
                        onChange={() => setPickupStore(s.id)}
                      />
                      <span>
                        <strong>{s.name}</strong>
                        <span className="muted">{s.address}</span>
                        <span className="muted">{s.hours}</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <h3 className="ckt__ptitle">Aloqa ma'lumotlari</h3>
              <div className="ckt__fields">
                <div className="field">
                  <label htmlFor="ckt-name">To'liq ism</label>
                  <input id="ckt-name" value={form.fullName} onChange={set("fullName")} placeholder="Ism Familiya" />
                  {errors.fullName && <span className="field__err">{errors.fullName}</span>}
                </div>
                <div className="field">
                  <label htmlFor="ckt-phone">Telefon</label>
                  <input id="ckt-phone" value={form.phone} onChange={set("phone")} placeholder="+998 90 123 45 67" />
                  {errors.phone && <span className="field__err">{errors.phone}</span>}
                </div>
                {delivery === "courier" && (
                  <>
                    <div className="field">
                      <label htmlFor="ckt-city">Shahar</label>
                      <input id="ckt-city" value={form.city} onChange={set("city")} placeholder="Denov" />
                      {errors.city && <span className="field__err">{errors.city}</span>}
                    </div>
                    <div className="field ckt__wide">
                      <label htmlFor="ckt-addr">Manzil</label>
                      <input
                        id="ckt-addr"
                        value={form.address}
                        onChange={set("address")}
                        placeholder="Ko'cha, uy, kvartira, mo'ljal"
                      />
                      {errors.address && <span className="field__err">{errors.address}</span>}
                    </div>
                  </>
                )}
                <div className="field ckt__wide">
                  <label htmlFor="ckt-note">Izoh (ixtiyoriy)</label>
                  <textarea id="ckt-note" rows={3} value={form.note} onChange={set("note")} placeholder="Kuryer uchun qo'shimcha ma'lumot" />
                </div>
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="panel ckt__panel">
              <h3 className="ckt__ptitle">To'lov usuli</h3>
              <div className="ckt__pays">
                {PAYMENTS.map(({ id, label, note, Icon }) => (
                  <button
                    key={id}
                    className={`ckt__pay ${payment === id ? "is-on" : ""}`}
                    onClick={() => setPayment(id)}
                  >
                    <Icon size={20} />
                    <span>
                      <strong>{label}</strong>
                      <span className="muted">{note}</span>
                    </span>
                    <span className="ckt__radio" />
                  </button>
                ))}
              </div>

              <h3 className="ckt__ptitle">Promo-kod</h3>
              <form
                className="ckt__promo"
                onSubmit={(e) => {
                  e.preventDefault();
                  const r = applyPromo(code);
                  toast(r.message, r.ok ? "ok" : "danger");
                  if (r.ok) setCode("");
                }}
              >
                <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Kodni kiriting" />
                <button className="btn btn--sm" type="submit">
                  Qo'llash
                </button>
              </form>
              {promo && (
                <p className="ckt__promoon">
                  <Tag size={14} weight="fill" /> {promo} qo'llandi
                </p>
              )}

              <div className="note ckt__note">
                <CreditCard size={17} />
                <span>
                  Bu demo versiya — haqiqiy to'lov amalga oshirilmaydi va karta ma'lumotlari
                  so'ralmaydi. Buyurtma faqat brauzeringizda saqlanadi.
                </span>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="panel ckt__panel">
              <h3 className="ckt__ptitle">Buyurtmani tekshiring</h3>
              <div className="ckt__review">
                <div className="ckt__revblock">
                  <span className="muted">Qabul qiluvchi</span>
                  <strong>{form.fullName}</strong>
                  <span>{form.phone}</span>
                </div>
                <div className="ckt__revblock">
                  <span className="muted">Yetkazish</span>
                  {delivery === "pickup" ? (
                    <>
                      <strong>Do'kondan olish</strong>
                      <span>{STORES.find((s) => s.id === pickupStore)?.name}</span>
                    </>
                  ) : (
                    <>
                      <strong>Kuryer orqali</strong>
                      <span>
                        {form.city}, {form.address}
                      </span>
                    </>
                  )}
                </div>
                <div className="ckt__revblock">
                  <span className="muted">To'lov</span>
                  <strong>{PAYMENTS.find((p) => p.id === payment)?.label}</strong>
                </div>
              </div>

              <ul className="ckt__items">
                {items.map((it) => {
                  const p = productById(it.productId);
                  if (!p) return null;
                  return (
                    <li key={`${it.productId}-${it.size}-${it.color}`}>
                      <span className="img-frame ckt__itemimg">
                        <img src={p.images[0]} alt="" />
                      </span>
                      <span className="ckt__iteminfo">
                        <strong>{p.name}</strong>
                        <span className="muted">
                          {it.size} · {it.color} · {it.qty} dona
                        </span>
                      </span>
                      <strong>{uzs(effectivePrice(p) * it.qty)}</strong>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <div className="ckt__nav">
            {step > 0 ? (
              <button className="btn btn--ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={15} weight="bold" /> Orqaga
              </button>
            ) : (
              <Link className="btn btn--ghost" to="/savat">
                <ArrowLeft size={15} weight="bold" /> Savatga
              </Link>
            )}
            {step < 2 ? (
              <button className="btn btn--accent" onClick={next}>
                Davom etish <ArrowRight size={16} weight="bold" />
              </button>
            ) : (
              <button className="btn btn--accent" onClick={submit}>
                Buyurtmani tasdiqlash <Check size={16} weight="bold" />
              </button>
            )}
          </div>
        </div>

        <aside className="ckt__side">
          <div className="panel ckt__sum">
            <h3>Xulosa</h3>
            <ul className="ckt__sumitems">
              {items.map((it) => {
                const p = productById(it.productId);
                if (!p) return null;
                return (
                  <li key={`${it.productId}-${it.size}-${it.color}`}>
                    <span className="img-frame ckt__sumimg">
                      <img src={p.images[0]} alt="" />
                      <span className="ckt__sumqty">{it.qty}</span>
                    </span>
                    <span className="ckt__suminfo">
                      <strong>{p.name}</strong>
                      <span className="muted">
                        {it.size} · {it.color}
                      </span>
                    </span>
                    <span className="ckt__sumprice">{uzs(effectivePrice(p) * it.qty)}</span>
                  </li>
                );
              })}
            </ul>
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
                <span className="muted">Yetkazish</span>
                <strong>{shipping === 0 ? "Bepul" : uzs(shipping)}</strong>
              </li>
            </ul>
            <div className="cartpage__total">
              <span>Jami</span>
              <strong>{uzs(total)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
