import { useMemo, type CSSProperties } from "react";

/** Drifting light motes. Purely decorative — hidden from assistive tech. */
export function Sparkles({ count = 18 }: { count?: number }) {
  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 11) % 100}%`,
        top: `${(i * 53 + 23) % 100}%`,
        size: 2 + ((i * 7) % 4),
        dur: `${5.5 + ((i * 3) % 6)}s`,
        delay: `${((i * 13) % 60) / 10}s`,
        drift: `${((i % 5) - 2) * 16}px`,
      })),
    [count],
  );

  return (
    <div className="sparkles" aria-hidden="true">
      {motes.map((m) => (
        <span
          key={m.id}
          className="sparkle"
          style={
            {
              left: m.left,
              top: m.top,
              width: m.size,
              height: m.size,
              "--sp-dur": m.dur,
              "--sp-delay": m.delay,
              "--sp-x": m.drift,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
