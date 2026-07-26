import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Heart, MoonStars, Sun, UserCircle, X } from "@phosphor-icons/react";
import { useUI } from "../../store/useUI";
import { useAuth } from "../../store/useAuth";
import { useScrollLock } from "../../lib/hooks";

const LINKS = [
  { label: "Ayollar", to: "/katalog/ayollar" },
  { label: "Erkaklar", to: "/katalog/erkaklar" },
  { label: "Unisex", to: "/katalog/unisex" },
  { label: "Aksessuar", to: "/katalog/aksessuar" },
  { label: "Chegirma", to: "/chegirma" },
  { label: "Lookbook", to: "/lookbook" },
  { label: "Jurnal", to: "/jurnal" },
  { label: "Brend", to: "/brend" },
  { label: "Filiallar", to: "/filiallar" },
  { label: "Yordam", to: "/yordam" },
];

export function MobileNav() {
  const open = useUI((s) => s.navOpen);
  const setOpen = useUI((s) => s.setNavOpen);
  const theme = useUI((s) => s.theme);
  const toggleTheme = useUI((s) => s.toggleTheme);
  const user = useAuth((s) => s.user);

  useScrollLock(open);

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
            className="drawer drawer--nav"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            role="dialog"
            aria-label="Menyu"
          >
            <header className="drawer__head">
              <Link to="/" className="mnav__logo font-display" onClick={() => setOpen(false)}>
                WEARSHOP
              </Link>
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Yopish">
                <X size={17} weight="bold" />
              </button>
            </header>

            <nav className="mnav__list">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -22 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.035, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link className="mnav__link" to={l.to} onClick={() => setOpen(false)}>
                    <span className="mnav__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mnav__label">{l.label}</span>
                    <ArrowUpRight size={17} />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <footer className="mnav__foot">
              <Link className="btn btn--sm btn--ghost" to={user ? "/kabinet" : "/kirish"} onClick={() => setOpen(false)}>
                <UserCircle size={16} /> {user ? user.name.split(" ")[0] : "Kirish"}
              </Link>
              <Link className="btn btn--sm btn--ghost" to="/sevimlilar" onClick={() => setOpen(false)}>
                <Heart size={16} /> Sevimlilar
              </Link>
              <button className="btn btn--sm btn--ghost" onClick={toggleTheme}>
                {theme === "dark" ? <Sun size={16} /> : <MoonStars size={16} />}
                {theme === "dark" ? "Yorug'" : "Tungi"}
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
