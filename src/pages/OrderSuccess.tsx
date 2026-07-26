import { Link, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle, Copy, Package } from "@phosphor-icons/react";
import { useAuth } from "../store/useAuth";
import { useUI } from "../store/useUI";
import { uzs, dateUz, ORDER_STATUS } from "../lib/format";

const TRACK = ["Qabul qilindi", "Yig'ilmoqda", "Jo'natildi", "Yetkazildi"];

export default function OrderSuccess() {
  const { id } = useParams();
  const order = useAuth((s) => s.orders.find((o) => o.id === id));
  const toast = useUI((s) => s.toast);

  if (!order) {
    return (
      <div className="container osx" data-sec="emerald">
        <span className="osx__icon">
          <Package size={36} weight="light" />
        </span>
        <h1 className="display-md">Buyurtma topilmadi</h1>
        <p className="muted osx__text">
          Bu buyurtma raqami mavjud emas yoki brauzer xotirasi tozalangan bo'lishi mumkin.
        </p>
        <div className="osx__actions">
          <Link className="btn" to="/katalog">
            Katalogga o'tish
          </Link>
        </div>
      </div>
    );
  }

  const status = ORDER_STATUS[order.status];
  const activeStep = order.status === "delivered" ? 3 : order.status === "shipped" ? 2 : order.status === "paid" ? 1 : 0;

  return (
    <div className="container osx">
      <span className="osx__icon">
        <CheckCircle size={40} weight="fill" />
      </span>
      <h1 className="display-md">Buyurtmangiz qabul qilindi</h1>
      <div className="osx__id">
        Raqam: <strong>{order.id}</strong>
        <button
          className="icon-btn"
          style={{ width: 30, height: 30 }}
          onClick={() => {
            navigator.clipboard?.writeText(order.id);
            toast("Buyurtma raqami nusxalandi", "info");
          }}
          aria-label="Nusxalash"
        >
          <Copy size={13} />
        </button>
      </div>
      <p className="muted osx__text">
        Menejerimiz {order.shippingInfo.phone} raqamiga qo'ng'iroq qilib, buyurtmani tasdiqlaydi.
        Holatni istalgan vaqtda shaxsiy kabinetdan kuzatishingiz mumkin.
      </p>

      <div className="panel osx__panel">
        <div className="osx__rows">
          <div className="osx__row">
            <span>Sana</span>
            <strong>{dateUz(order.date)}</strong>
          </div>
          <div className="osx__row">
            <span>Holat</span>
            <strong>
              <span className={`tag tag--${status.tone}`}>{status.label}</span>
            </strong>
          </div>
          <div className="osx__row">
            <span>Qabul qiluvchi</span>
            <strong>{order.shippingInfo.fullName}</strong>
          </div>
          <div className="osx__row">
            <span>Manzil</span>
            <strong>
              {order.shippingInfo.city}, {order.shippingInfo.address}
            </strong>
          </div>
        </div>

        <ul className="osx__items">
          {order.items.map((it) => (
            <li key={`${it.productId}-${it.size}-${it.color}`}>
              <span className="img-frame osx__itemimg">
                <img src={it.image} alt="" />
              </span>
              <span className="osx__iteminfo">
                <strong>{it.name}</strong>
                <span className="muted">
                  {it.size} · {it.color} · {it.qty} dona
                </span>
              </span>
              <strong>{uzs(it.price * it.qty)}</strong>
            </li>
          ))}
        </ul>

        <ul className="cartpage__lines">
          <li>
            <span className="muted">Oraliq summa</span>
            <strong>{uzs(order.subtotal)}</strong>
          </li>
          {order.discount > 0 && (
            <li>
              <span className="muted">Chegirma {order.promo ? `(${order.promo})` : ""}</span>
              <strong className="is-ok">−{uzs(order.discount)}</strong>
            </li>
          )}
          <li>
            <span className="muted">Yetkazish</span>
            <strong>{order.shipping === 0 ? "Bepul" : uzs(order.shipping)}</strong>
          </li>
        </ul>
        <div className="cartpage__total">
          <span>Jami</span>
          <strong>{uzs(order.total)}</strong>
        </div>

        <div className="osx__track">
          {TRACK.map((s, i) => (
            <div className={`osx__trackstep ${i <= activeStep ? "is-on" : ""}`} key={s}>
              <span className="osx__trackdot" />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="osx__actions">
        <Link className="btn btn--accent" to="/kabinet">
          Kabinetga o'tish <ArrowRight size={16} weight="bold" />
        </Link>
        <Link className="btn btn--ghost" to="/katalog">
          Xaridni davom ettirish
        </Link>
      </div>
    </div>
  );
}
