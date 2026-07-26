import { useEffect, useRef, useState } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Shared geometry fallback for reveals.
 *
 * Reveal variants hide their content completely until they flip, so a missed
 * IntersectionObserver callback leaves a section permanently blank — which is
 * exactly what happened to the lookbook strip. One throttled scroll listener
 * re-checks every pending element, so reveals still fire on scroll even if the
 * observer never reports.
 */
const pending = new Map<Element, () => void>();
let watching = false;
let watchRaf = 0;

function sweepPending() {
  cancelAnimationFrame(watchRaf);
  watchRaf = requestAnimationFrame(() => {
    const vh = window.innerHeight;
    for (const [el, reveal] of pending) {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.94 && r.bottom > 0) {
        reveal();
        pending.delete(el);
      }
    }
    if (pending.size === 0) stopWatching();
  });
}

function startWatching() {
  if (watching) return;
  watching = true;
  window.addEventListener("scroll", sweepPending, { passive: true });
  window.addEventListener("resize", sweepPending);
}

function stopWatching() {
  if (!watching) return;
  watching = false;
  window.removeEventListener("scroll", sweepPending);
  window.removeEventListener("resize", sweepPending);
}

/** Adds `is-in` to the element the first time it enters the viewport. */
export function useInView<T extends HTMLElement>(threshold = 0.15, once = true) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }

    // An element taller than the viewport can never reach a high ratio.
    const vh = window.innerHeight || 1;
    const effective = el.offsetHeight > vh * 0.8 ? 0 : threshold;

    // Already on screen when mounted? Reveal without waiting for a scroll.
    const r = el.getBoundingClientRect();
    if (r.top < vh && r.bottom > 0) {
      setInView(true);
      if (once) return;
    }

    const reveal = () => setInView(true);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          pending.delete(el);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold: effective, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);

    pending.set(el, reveal);
    startWatching();
    sweepPending();

    return () => {
      io.disconnect();
      pending.delete(el);
      if (pending.size === 0) stopWatching();
    };
  }, [threshold, once]);

  return { ref, inView };
}

/** Normalised scroll progress (0→1) of an element passing through the viewport. */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = (vh - r.top) / (vh + r.height);
        setProgress(Math.min(1, Math.max(0, p)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, progress };
}

export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
    };
  }, []);
  return y;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

/** Locks body scroll while `active` is true (drawers, modals). */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

export function useCountUp(target: number, duration = 1600, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}
