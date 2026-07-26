import { useRef, useState, useEffect, type ReactNode } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export function Rail({ children, title }: { children: ReactNode; title?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ start: true, end: false });

  const update = () => {
    const el = track.current;
    if (!el) return;
    setState({
      start: el.scrollLeft < 8,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  };

  useEffect(() => {
    update();
    const el = track.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <div className="rail">
      <div className="rail__nav">
        {title && <span className="rail__title">{title}</span>}
        <div className="rail__btns">
          <button className="icon-btn" onClick={() => nudge(-1)} disabled={state.start} aria-label="Orqaga">
            <CaretLeft size={16} weight="bold" />
          </button>
          <button className="icon-btn" onClick={() => nudge(1)} disabled={state.end} aria-label="Oldinga">
            <CaretRight size={16} weight="bold" />
          </button>
        </div>
      </div>
      <div className="rail__track" ref={track}>
        {children}
      </div>
    </div>
  );
}
