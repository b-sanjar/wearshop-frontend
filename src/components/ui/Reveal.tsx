import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "../../lib/hooks";

type RevealVariant = "up" | "fade" | "left" | "right" | "scale" | "clip" | "blur";

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  threshold?: number;
}

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
  threshold = 0.15,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(threshold);
  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${inView ? "is-in" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

interface RevealTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Split by "word" gives a staggered mask per word; "line" masks the whole block. */
  mode?: "word" | "line";
}

export function RevealText({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  mode = "word",
}: RevealTextProps) {
  const { ref, inView } = useInView<HTMLHeadingElement>(0.2);
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={`reveal-text ${inView ? "is-in" : ""} ${className}`}>
      {mode === "word"
        ? words.map((w, i) => (
            <span key={`${w}-${i}`}>
              <span className="reveal-text__mask">
                <span
                  className="reveal-text__word"
                  style={{ transitionDelay: `${delay + i * 55}ms` }}
                >
                  {w}
                </span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))
        : (
          <span className="reveal-text__mask">
            <span className="reveal-text__word" style={{ transitionDelay: `${delay}ms` }}>
              {text}
            </span>
          </span>
        )}
    </Tag>
  );
}
