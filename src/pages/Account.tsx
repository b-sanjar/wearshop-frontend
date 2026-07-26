import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bag,
  Gear,
  Heart,
  Icon,
  MapPin,
  Package,
  Plus,
  SignOut,
  SquaresFour,
  Trash,
} from "@phosphor-icons/react";
import { useAuth } from "../store/useAuth";
import { useWishlist } from "../store/useWishlist";
import { useUI } from "../store/useUI";
import { uzs, dateUz, ORDER_STATUS } from "../lib/format";
import { PRODUCTS } from "../data/products";
import { Empty } from "../components/ui/Bits";
import { ProductCard } from "../components/ui/ProductCard";

type Tab = "overview" | "orders" | "addresses" | "wishlist" | "settings";

const TABS: { id: Tab; label: string; Icon: Icon }[] = [
  { id: "overview", label: "Umumiy", Icon: SquaresFour },
  { id: "orders", label: "Buyurtmalar", Icon: Bag },
  { id: "addresses", label: "Manzillar", Icon: MapPin },
  { id: "wishlist", label: "Sevimlilar", Icon: Heart },
  { id: "settings", label: "Sozlamalar", Icon: Gear },
];

export default function Account() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const orders = useAuth((s) => s.orders);
  const addresses = useAuth((s) => s.addresses);
  const addAddress = useAuth((s) => s.addAddress);
  const removeAddress = useAuth((s) => s.removeAddress);
  const updateProfile = useAuth((s) => s.updateProfile);
  const logout = useAuth((s) => s.logout);
  const wishIds = useWishlist((s) => s.ids);
  const toast = useUI((s) => s.toast);

  const [tab, setTab] = useState<Tab>("overview");
  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
  });
  const [addr, setAddr] = useState({ label: "Uy", fullName: "", phone: "", city: "Denov", address: "" });
  const [addrOpen, setAddrOpen] = useState(false);

  if (!user) {
    return (
      <div className="container section">
        <Empty
          icon={<Package size={30} />}
          title="Tizimga kirmagansiz"
          text="Kabinetni ko'rish uchun hisobingizga kiring yoki yangi hisob yarating."
          action={
            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", justifyContent: "center" }}>
              <Link className="btn btn--accent" to="/kirish">
                Kirish
              </Link>
              <Link className="btn btn--ghost" to="/royxatdan-otish">
                Ro'yxatdan o'tish
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const wishItems = wishIds.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as typeof PRODUCTS;

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profile);
    toast("Profil yangilandi", "ok");
  };

  const saveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (addr.fullName.trim().length < 3 || addr.address.trim().length < 5) {
      toast("Manzil ma'lumotlarini to'liq kiriting", "danger");
      return;
    }
    addAddress(addr);
    setAddr({ label: "Uy", fullName: "", phone: "", city: "Denov", address: "" });
    setAddrOpen(false);
    toast("Manzil qo'shildi", "ok");
  };

  return (
    <div className="container acc" data-sec="indigo">
      <header className="acc__head">
        <div className="acc__avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div className="acc__ident">
          <h1 className="display-md">{user.name}</h1>
          <span className="muted">
            {user.email} · {dateUz(user.joined)} dan beri a'zo
          </span>
        </div>
        <button
          className="btn btn--sm btn--ghost"
          onClick={() => {
            logout();
            toast("Tizimdan chiqdingiz", "info");
            navigate("/");
          }}
        >
          <SignOut size={15} /> Chiqish
        </button>
      </header>

      <div className="acc__grid">
        <nav className="acc__nav">
          {TABS.map(({ id, label, Icon: I }) => (
            <button key={id} className={`acc__navbtn ${tab === id ? "is-on" : ""}`} onClick={() => setTab(id)}>
              <I size={17} />
              <span>{label}</span>
              {id === "orders" && orders.length > 0 && <span className="acc__navn">{orders.length}</span>}
              {id === "wishlist" && wishIds.length > 0 && <span className="acc__navn">{wishIds.length}</span>}
            </button>
          ))}
        </nav>

        <div className="acc__body">
          {tab === "overview" && (
            <>
              <div className="acc__stats">
                {[
                  { label: "Buyurtmalar", value: String(orders.length) },
                  { label: "Umumiy xarid", value: uzs(totalSpent) },
                  { label: "Sevimlilar", value: String(wishIds.length) },
                  { label: "Manzillar", value: String(addresses.length) },
                ].map((s) => (
                  <div className="acc__stat" key={s.label}>
                    <strong>{s.value}</strong>
                    <span className="muted">{s.label}</span>
                  </div>
                ))}
              </div>

              <section className="panel">
                <div className="acc__panelhead">
                  <h3>So'nggi buyurtmalar</h3>
                  {orders.length > 3 && (
                    <button className="link-arrow" onClick={() => setTab("orders")}>
                      Barchasi
                    </button>
                  )}
                </div>
                {orders.length === 0 ? (
                  <p className="muted acc__none">
                    Hali buyurtma yo'q. <Link to="/katalog">Katalogni ko'ring →</Link>
                  </p>
                ) : (
                  <ul className="acc__orders">
                    {orders.slice(0, 3).map((o) => (
                      <OrderRow key={o.id} order={o} />
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}

          {tab === "orders" && (
            <section className="panel">
              <h3 className="acc__panelh">Buyurtmalar tarixi</h3>
              {orders.length === 0 ? (
                <Empty
                  icon={<Bag size={26} />}
                  title="Buyurtmalar yo'q"
                  text="Birinchi buyurtmangizni rasmiylashtiring — u shu yerda ko'rinadi."
                  action={
                    <Link className="btn btn--sm" to="/katalog">
                      Katalogga o'tish
                    </Link>
                  }
                />
              ) : (
                <ul className="acc__orders">
                  {orders.map((o) => (
                    <OrderRow key={o.id} order={o} expandable />
                  ))}
                </ul>
              )}
            </section>
          )}

          {tab === "addresses" && (
            <section className="panel">
              <div className="acc__panelhead">
                <h3>Saqlangan manzillar</h3>
                <button className="btn btn--sm" onClick={() => setAddrOpen(!addrOpen)}>
                  <Plus size={14} weight="bold" /> Qo'shish
                </button>
              </div>

              {addrOpen && (
                <form className="acc__addrform" onSubmit={saveAddress}>
                  <div className="acc__addrgrid">
                    <div className="field">
                      <label htmlFor="ac-alabel">Nomi</label>
                      <input id="ac-alabel" value={addr.label} onChange={(e) => setAddr({ ...addr, label: e.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="ac-aname">Qabul qiluvchi</label>
                      <input id="ac-aname" value={addr.fullName} onChange={(e) => setAddr({ ...addr, fullName: e.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="ac-aphone">Telefon</label>
                      <input id="ac-aphone" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="ac-acity">Shahar</label>
                      <input id="ac-acity" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
                    </div>
                    <div className="field acc__addrwide">
                      <label htmlFor="ac-aaddr">Manzil</label>
                      <input id="ac-aaddr" value={addr.address} onChange={(e) => setAddr({ ...addr, address: e.target.value })} />
                    </div>
                  </div>
                  <button className="btn btn--sm btn--accent" type="submit">
                    Saqlash
                  </button>
                </form>
              )}

              {addresses.length === 0 ? (
                <p className="muted acc__none">Hali manzil qo'shilmagan.</p>
              ) : (
                <div className="acc__addrs">
                  {addresses.map((a) => (
                    <div className="acc__addr" key={a.id}>
                      <span className="tag tag--info">{a.label}</span>
                      <strong>{a.fullName}</strong>
                      <span className="muted">{a.phone}</span>
                      <span className="muted">
                        {a.city}, {a.address}
                      </span>
                      <button
                        className="acc__addrdel"
                        onClick={() => {
                          removeAddress(a.id);
                          toast("Manzil o'chirildi", "info");
                        }}
                        aria-label="O'chirish"
                      >
                        <Trash size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === "wishlist" && (
            <section>
              {wishItems.length === 0 ? (
                <div className="panel">
                  <Empty
                    icon={<Heart size={26} />}
                    title="Sevimlilar bo'sh"
                    text="Yoqqan mahsulotlarni yurakcha tugmasi orqali saqlang."
                    action={
                      <Link className="btn btn--sm" to="/katalog">
                        Katalogga o'tish
                      </Link>
                    }
                  />
                </div>
              ) : (
                <div className="pgrid pgrid--3">
                  {wishItems.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === "settings" && (
            <section className="panel">
              <h3 className="acc__panelh">Profil ma'lumotlari</h3>
              <form className="acc__form" onSubmit={saveProfile}>
                <div className="acc__addrgrid">
                  <div className="field">
                    <label htmlFor="ac-pname">To'liq ism</label>
                    <input id="ac-pname" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="ac-pphone">Telefon</label>
                    <input id="ac-pphone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="ac-pcity">Shahar</label>
                    <input id="ac-pcity" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="ac-pmail">E-mail</label>
                    <input id="ac-pmail" value={user.email} disabled />
                  </div>
                </div>
                <button className="btn btn--sm btn--accent" type="submit">
                  O'zgarishlarni saqlash
                </button>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderRow({ order, expandable = false }: { order: ReturnType<typeof useAuth.getState>["orders"][number]; expandable?: boolean }) {
  const [open, setOpen] = useState(false);
  const status = ORDER_STATUS[order.status];
  return (
    <li className="acc__order">
      <button
        className="acc__orderhead"
        onClick={() => expandable && setOpen(!open)}
        style={{ cursor: expandable ? "pointer" : "default" }}
      >
        <span className="acc__orderid">{order.id}</span>
        <span className="muted">{dateUz(order.date)}</span>
        <span className={`tag tag--${status.tone}`}>{status.label}</span>
        <span className="acc__ordertotal">{uzs(order.total)}</span>
      </button>
      {(open || !expandable) && (
        <ul className="acc__orderitems">
          {order.items.map((it) => (
            <li key={`${it.productId}-${it.size}-${it.color}`}>
              <span className="img-frame acc__orderimg">
                <img src={it.image} alt="" />
              </span>
              <span className="acc__orderinfo">
                <strong>{it.name}</strong>
                <span className="muted">
                  {it.size} · {it.color} · {it.qty} dona
                </span>
              </span>
              <span>{uzs(it.price * it.qty)}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
