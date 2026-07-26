import { Star } from "@phosphor-icons/react";

export function Stars({ value, size = 13, showValue = false }: { value: number; size?: number; showValue?: boolean }) {
  return (
    <span className="stars" title={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          weight={value >= i - 0.25 ? "fill" : "regular"}
          className={value >= i - 0.25 ? "is-on" : "is-off"}
        />
      ))}
      {showValue && <span className="stars__value">{value.toFixed(1)}</span>}
    </span>
  );
}
