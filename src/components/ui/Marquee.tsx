import type { ReactNode } from "react";

interface MarqueeProps {
  items: ReactNode[];
  speed?: number;
  reverse?: boolean;
  className?: string;
  separator?: ReactNode;
}

export function Marquee({
  items,
  speed = 38,
  reverse = false,
  className = "",
  separator = <span className="marquee__dot" aria-hidden="true" />,
}: MarqueeProps) {
  const track = (
    <div className="marquee__track" aria-hidden="false">
      {items.map((item, i) => (
        <span className="marquee__item" key={i}>
          {item}
          {separator}
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee ${className}`}>
      <div
        className={`marquee__inner ${reverse ? "is-reverse" : ""}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {track}
        <div className="marquee__track" aria-hidden="true">
          {items.map((item, i) => (
            <span className="marquee__item" key={`dup-${i}`}>
              {item}
              {separator}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
