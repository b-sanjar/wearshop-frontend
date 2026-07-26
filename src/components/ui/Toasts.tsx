import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Info, WarningCircle, X } from "@phosphor-icons/react";
import { useUI } from "../../store/useUI";

/** Each tone gets its own icon and colour — see .toast--* in components.css */
const ICON = {
  ok: <CheckCircle size={19} weight="fill" />,
  info: <Info size={19} weight="fill" />,
  danger: <WarningCircle size={19} weight="fill" />,
};

export function Toasts() {
  const toasts = useUI((s) => s.toasts);
  const dismiss = useUI((s) => s.dismiss);

  return (
    <div className="toasts" role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className={`toast toast--${t.tone}`}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          >
            {t.image ? (
              <img className="toast__img" src={t.image} alt="" />
            ) : (
              <span className="toast__icon">{ICON[t.tone]}</span>
            )}
            <span className="toast__msg">{t.message}</span>
            <button className="toast__x" onClick={() => dismiss(t.id)} aria-label="Yopish">
              <X size={14} weight="bold" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
