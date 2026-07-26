import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkle, Truck, Gift } from "@phosphor-icons/react";

const MESSAGES = [
  {
    icon: <Truck size={14} weight="fill" />,
    text: "500 000 so'mdan yuqori buyurtmalarga bepul yetkazish",
    cta: { label: "Katalog", to: "/katalog" },
  },
  {
    icon: <Sparkle size={14} weight="fill" />,
    text: "Bahor / Yoz 2026 kolleksiyasi sotuvda",
    cta: { label: "Ko'rish", to: "/katalog/yangi" },
  },
  {
    icon: <Gift size={14} weight="fill" />,
    text: "WELCOME10 kodi bilan birinchi xaridga 10% chegirma",
    cta: { label: "Chegirmalar", to: "/chegirma" },
  },
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % MESSAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const m = MESSAGES[i];

  return (
    <div className="annbar">
      <div className="annbar__glow" aria-hidden="true" />
      <div className="container-wide annbar__inner">
        <span className="pulse-dot annbar__dot" aria-hidden="true" />
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            className="annbar__msg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {m.icon}
            <span>{m.text}</span>
            <Link to={m.cta.to} className="annbar__cta">
              {m.cta.label} <ArrowRight size={12} weight="bold" />
            </Link>
          </motion.span>
        </AnimatePresence>
        <div className="annbar__dots" role="tablist" aria-label="E'lonlar">
          {MESSAGES.map((_, n) => (
            <button
              key={n}
              className={`annbar__pip ${n === i ? "is-on" : ""}`}
              onClick={() => setI(n)}
              aria-label={`E'lon ${n + 1}`}
              aria-selected={n === i}
              role="tab"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
