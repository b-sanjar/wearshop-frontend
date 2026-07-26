import { useEffect } from "react";
import { prefersReducedMotion } from "../../lib/hooks";

/**
 * Fixed decorative field behind every page: four drifting colour orbs, a fine
 * hairline grid and a spotlight that tracks the pointer.
 */
export function Aurora() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const root = document.documentElement;
        root.style.setProperty("--mx", `${(e.clientX / window.innerWidth) * 100}%`);
        root.style.setProperty("--my", `${(e.clientY / window.innerHeight) * 100}%`);
      });
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <div className="aurora" aria-hidden="true">
      <span className="aurora__orb aurora__orb--1" />
      <span className="aurora__orb aurora__orb--2" />
      <span className="aurora__orb aurora__orb--3" />
      <span className="aurora__orb aurora__orb--4" />
      <span className="aurora__grid" />
      <span className="aurora__spot" />
    </div>
  );
}
