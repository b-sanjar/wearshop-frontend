import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  List,
  MagnifyingGlass,
  MoonStars,
  ShoppingBag,
  Sun,
  UserCircle,
} from "@phosphor-icons/react";
import { useUI } from "../../store/useUI";
import { useCart } from "../../store/useCart";
import { useWishlist } from "../../store/useWishlist";
import { useAuth } from "../../store/useAuth";
import { useScrollY } from "../../lib/hooks";
import { PRODUCTS, effectivePrice } from "../../data/products";
import { uzs } from "../../lib/format";

interface MegaColumn {
  title: string;
  links: { label: string; to: string }[];
}

interface NavItem {
  label: string;
  to: string;
  mega?: { columns: MegaColumn[]; feature: { image: string; eyebrow: string; title: string; to: string } };
}

const NAV: NavItem[] = [
  {
    label: "Ayollar",
    to: "/katalog/ayollar",
    mega: {
      columns: [
        {
          title: "Kategoriya",
          links: [
            { label: "Barcha ayollar", to: "/katalog/ayollar" },
            { label: "Ko'ylaklar", to: "/katalog/ayollar?q=ko%27ylak" },
            { label: "Ustki kiyim", to: "/katalog/ayollar?coll=Atelier" },
            { label: "Trikotaj", to: "/katalog/ayollar?coll=Knitwear" },
            { label: "Shim va yubka", to: "/katalog/ayollar?q=shim" },
          ],
        },
        {
          title: "Kolleksiya",
          links: [
            { label: "Soirée", to: "/katalog/ayollar?coll=Soir%C3%A9e" },
            { label: "Sartorial", to: "/katalog/ayollar?coll=Sartorial" },
            { label: "Riviera", to: "/katalog/ayollar?coll=Riviera" },
            { label: "Atelier", to: "/katalog/ayollar?coll=Atelier" },
          ],
        },
        {
          title: "Tanlov",
          links: [
            { label: "Yangi kelganlar", to: "/katalog/yangi" },
            { label: "Chegirmadagilar", to: "/chegirma" },
            { label: "Bestsellerlar", to: "/katalog?tag=bestseller" },
            { label: "O'lcham jadvali", to: "/olcham-jadvali" },
          ],
        },
      ],
      feature: {
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=900&auto=format&fit=crop",
        eyebrow: "Lookbook",
        title: "Kechki yorug'lik",
        to: "/lookbook/kechki-yorugllik",
      },
    },
  },
  {
    label: "Erkaklar",
    to: "/katalog/erkaklar",
    mega: {
      columns: [
        {
          title: "Kategoriya",
          links: [
            { label: "Barcha erkaklar", to: "/katalog/erkaklar" },
            { label: "Ko'ylaklar", to: "/katalog/erkaklar?q=ko%27ylak" },
            { label: "Ustki kiyim", to: "/katalog/erkaklar?coll=Sartorial" },
            { label: "Trikotaj", to: "/katalog/erkaklar?coll=Knitwear" },
            { label: "Shim", to: "/katalog/erkaklar?q=shim" },
          ],
        },
        {
          title: "Kolleksiya",
          links: [
            { label: "Sartorial", to: "/katalog/erkaklar?coll=Sartorial" },
            { label: "Atelier", to: "/katalog/erkaklar?coll=Atelier" },
            { label: "Denim Lab", to: "/katalog/erkaklar?coll=Denim%20Lab" },
            { label: "Motion", to: "/katalog/erkaklar?coll=Motion" },
          ],
        },
        {
          title: "Tanlov",
          links: [
            { label: "Yangi kelganlar", to: "/katalog/yangi" },
            { label: "Chegirmadagilar", to: "/chegirma" },
            { label: "Bestsellerlar", to: "/katalog?tag=bestseller" },
            { label: "O'lcham jadvali", to: "/olcham-jadvali" },
          ],
        },
      ],
      feature: {
        image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=900&auto=format&fit=crop",
        eyebrow: "Lookbook",
        title: "Shahar arxitekturasi",
        to: "/lookbook/shahar-arxitekturasi",
      },
    },
  },
  { label: "Unisex", to: "/katalog/unisex" },
  { label: "Aksessuar", to: "/katalog/aksessuar" },
  { label: "Lookbook", to: "/lookbook" },
  { label: "Jurnal", to: "/jurnal" },
  { label: "Filiallar", to: "/filiallar" },
];

export function Header() {
  const y = useScrollY();
  const location = useLocation();
  const [mega, setMega] = useState<string | null>(null);
  const closeTimer = useRef<number>();
  const theme = useUI((s) => s.theme);
  const toggleTheme = useUI((s) => s.toggleTheme);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const setNavOpen = useUI((s) => s.setNavOpen);
  const setSearchOpen = useUI((s) => s.setSearchOpen);
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const user = useAuth((s) => s.user);

  useEffect(() => setMega(null), [location.pathname]);

  const openMega = (label: string) => {
    window.clearTimeout(closeTimer.current);
    setMega(label);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setMega(null), 160);
  };

  const scrolled = y > 40;
  const item = NAV.find((n) => n.label === mega);

  return (
    <>
      <header className={`hdr ${scrolled ? "is-scrolled" : ""} ${mega ? "is-mega" : ""}`}>
        <div className="container-wide hdr__inner">
          <button className="hdr__burger icon-btn" onClick={() => setNavOpen(true)} aria-label="Menyu">
            <List size={19} weight="bold" />
          </button>

          <Link to="/" className="hdr__logo" aria-label="WEARSHOP bosh sahifa">
            <span className="hdr__mark">W</span>
            <span className="hdr__word">WEARSHOP</span>
          </Link>

          <nav className="hdr__nav" onMouseLeave={scheduleClose}>
            {NAV.map((n) => (
              <div
                key={n.label}
                className="hdr__navitem"
                onMouseEnter={() => (n.mega ? openMega(n.label) : setMega(null))}
              >
                <NavLink
                  to={n.to}
                  className={({ isActive }) =>
                    `hdr__link ${isActive || mega === n.label ? "is-active" : ""}`
                  }
                >
                  <span>{n.label}</span>
                </NavLink>
              </div>
            ))}
          </nav>

          <div className="hdr__actions">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Qidiruv">
              <MagnifyingGlass size={18} />
            </button>
            <button className="icon-btn hdr__hide-sm" onClick={toggleTheme} aria-label="Mavzuni almashtirish">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -80, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 80, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  style={{ display: "grid", placeItems: "center" }}
                >
                  {theme === "dark" ? <Sun size={18} /> : <MoonStars size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>
            <Link className="icon-btn hdr__hide-sm" to="/sevimlilar" aria-label="Sevimlilar">
              <Heart size={18} />
              {wishCount > 0 && <span className="badge-dot" key={wishCount}>{wishCount}</span>}
            </Link>
            <Link className="icon-btn hdr__hide-sm" to={user ? "/kabinet" : "/kirish"} aria-label="Kabinet">
              <UserCircle size={18} />
            </Link>
            <button className="icon-btn hdr__cart" onClick={() => setCartOpen(true)} aria-label="Savat">
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="badge-dot" key={cartCount}>{cartCount}</span>}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {item?.mega && (
            <motion.div
              className="mega"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => openMega(item.label)}
              onMouseLeave={scheduleClose}
            >
              <div className="container-wide mega__inner">
                {item.mega.columns.map((col) => (
                  <div className="mega__col" key={col.title}>
                    <h4 className="mega__title">{col.title}</h4>
                    <ul>
                      {col.links.map((l) => (
                        <li key={l.label}>
                          <Link to={l.to} className="mega__link">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="mega__cols-extra">
                  <h4 className="mega__title">Tanlangan</h4>
                  <div className="mega__picks">
                    {PRODUCTS.filter((p) => p.category === item.to.split("/")[2])
                      .slice(0, 2)
                      .map((p) => (
                        <Link to={`/mahsulot/${p.slug}`} className="mega__pick" key={p.id}>
                          <span className="img-frame mega__pickimg">
                            <img src={p.images[0]} alt="" loading="lazy" />
                          </span>
                          <span className="mega__pickinfo">
                            <strong>{p.name}</strong>
                            <span className="muted">{uzs(effectivePrice(p))}</span>
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>

                <Link to={item.mega.feature.to} className="mega__feature img-frame">
                  <img src={item.mega.feature.image} alt="" loading="lazy" />
                  <span className="mega__featuretext">
                    <span className="eyebrow">{item.mega.feature.eyebrow}</span>
                    <strong className="font-display">{item.mega.feature.title}</strong>
                  </span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <AnimatePresence>
        {mega && (
          <motion.div
            className="mega__scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseEnter={() => setMega(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export { NAV };
