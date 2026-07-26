import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useUI } from "../../store/useUI";
import { PRODUCTS, effectivePrice } from "../../data/products";
import { uzs, CATEGORY_LABEL } from "../../lib/format";
import { useScrollLock } from "../../lib/hooks";

const SUGGESTIONS = ["Palto", "Kashmir", "Denim", "Ipak ko'ylak", "Blazer", "Trikotaj"];

export function SearchOverlay() {
  const open = useUI((s) => s.searchOpen);
  const setOpen = useUI((s) => s.setSearchOpen);
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useScrollLock(open);

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 80);
    else setQ("");
  }, [open]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, setOpen]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.collection.toLowerCase().includes(term) ||
        p.fabric.toLowerCase().includes(term) ||
        CATEGORY_LABEL[p.category].toLowerCase().includes(term),
    ).slice(0, 6);
  }, [q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    navigate(`/qidiruv?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="search__panel"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container search__inner">
              <form className="search__bar" onSubmit={submit}>
                <MagnifyingGlass size={22} />
                <input
                  ref={input}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Mahsulot, kolleksiya yoki mato nomi…"
                  aria-label="Qidiruv"
                />
                <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Yopish">
                  <X size={17} weight="bold" />
                </button>
              </form>

              {q.trim().length < 2 ? (
                <div className="search__sugg">
                  <span className="muted">Ommabop qidiruvlar</span>
                  <div className="search__chips">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} className="chip" onClick={() => setQ(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <p className="search__none muted">"{q}" bo'yicha natija topilmadi.</p>
              ) : (
                <>
                  <ul className="search__results">
                    {results.map((p, i) => (
                      <motion.li
                        key={p.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link to={`/mahsulot/${p.slug}`} onClick={() => setOpen(false)}>
                          <span className="img-frame search__img">
                            <img src={p.images[0]} alt="" />
                          </span>
                          <span className="search__meta">
                            <strong>{p.name}</strong>
                            <span className="muted">
                              {CATEGORY_LABEL[p.category]} · {p.collection}
                            </span>
                          </span>
                          <span className="search__price">{uzs(effectivePrice(p))}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                  <button className="search__all" onClick={submit as never}>
                    Barcha natijalar <ArrowRight size={15} weight="bold" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
          <div className="search__scrim" onClick={() => setOpen(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
