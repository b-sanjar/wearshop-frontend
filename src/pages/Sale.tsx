import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Fire, Timer } from "@phosphor-icons/react";
import { PRODUCTS, effectivePrice } from "../data/products";
import { uzs } from "../lib/format";
import { ProductCard } from "../components/ui/ProductCard";
import { Reveal, RevealText } from "../components/ui/Reveal";
import { Marquee } from "../components/ui/Marquee";
import { Breadcrumbs, Empty } from "../components/ui/Bits";
import { useCountdown } from "../lib/useCountdown";

const LEVELS = [
  { id: "all", label: "Barchasi", min: 1 },
  { id: "10", label: "10% dan", min: 10 },
  { id: "20", label: "20% dan", min: 20 },
  { id: "30", label: "30% dan", min: 30 },
];

export default function Sale() {
  const [level, setLevel] = useState("all");
  const time = useCountdown();

  const sale = useMemo(() => {
    const min = LEVELS.find((l) => l.id === level)?.min ?? 1;
    return PRODUCTS.filter((p) => p.discount >= min).sort((a, b) => b.discount - a.discount);
  }, [level]);

  const totalSaving = sale.reduce((s, p) => s + (p.price - effectivePrice(p)), 0);

  return (
    <div className="sale" data-sec="crimson">
      <header className="sale__hero">
        <div className="container sale__heroinner">
          <Breadcrumbs trail={[{ label: "Chegirmalar" }]} />
          <span className="eyebrow">
            <Fire size={13} weight="fill" /> Mavsum yakuni
          </span>
          <RevealText as="h1" text="Chegirmalar" className="display-xl" />
          <Reveal variant="up" delay={140}>
            <p className="sale__text">
              Mavsum yakunlanmoqda — tanlangan modellar 30% gacha chegirmada. Miqdor cheklangan.
            </p>
          </Reveal>

          <Reveal variant="up" delay={220} className="sale__timer">
            <span className="sale__timerlabel">
              <Timer size={15} /> Aksiya tugashiga
            </span>
            <div className="sale__clock">
              {[
                { v: time.days, l: "kun" },
                { v: time.hours, l: "soat" },
                { v: time.minutes, l: "daq" },
                { v: time.seconds, l: "son" },
              ].map((t) => (
                <span className="sale__unit" key={t.l}>
                  <strong>{String(t.v).padStart(2, "0")}</strong>
                  <span>{t.l}</span>
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </header>

      <div className="ticker ticker--accent">
        <Marquee
          speed={34}
          items={["−30% GACHA", "MIQDOR CHEKLANGAN", "MAVSUM YAKUNI", "BEPUL QAYTARISH"].map((t) => (
            <span className="ticker__item font-display">{t}</span>
          ))}
        />
      </div>

      <div className="container section">
        <div className="sale__bar">
          <div className="sale__levels">
            {LEVELS.map((l) => (
              <button key={l.id} className={`chip ${level === l.id ? "is-on" : ""}`} onClick={() => setLevel(l.id)}>
                {l.label}
              </button>
            ))}
          </div>
          <span className="muted sale__saving">
            {sale.length} ta model · jami <strong>{uzs(totalSaving)}</strong> tejash imkoniyati
          </span>
        </div>

        {sale.length === 0 ? (
          <Empty
            icon={<Fire size={28} />}
            title="Bu darajada chegirma yo'q"
            text="Boshqa chegirma darajasini tanlang yoki butun katalogni ko'ring."
            action={
              <Link className="btn btn--sm" to="/katalog">
                Katalog
              </Link>
            }
          />
        ) : (
          <div className="pgrid pgrid--4">
            {sale.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
