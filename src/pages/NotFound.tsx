import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { PRODUCTS } from "../data/products";
import { ProductCard } from "../components/ui/ProductCard";
import { RevealText, Reveal } from "../components/ui/Reveal";
import { Magnetic } from "../components/ui/Magnetic";

export default function NotFound() {
  const picks = [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, 4);

  return (
    <div className="nf" data-sec="plum">
      <div className="container nf__inner">
        <span className="nf__code font-display">404</span>
        <RevealText as="h1" text="Bu sahifa topilmadi" className="display-lg" />
        <Reveal variant="up" delay={140}>
          <p className="muted nf__text">
            Manzil noto'g'ri yozilgan yoki sahifa ko'chirilgan bo'lishi mumkin. Quyidagi
            bo'limlardan davom eting.
          </p>
        </Reveal>
        <Reveal variant="up" delay={220} className="nf__actions">
          <Magnetic>
            <Link className="btn btn--accent" to="/">
              Bosh sahifa <ArrowRight size={16} weight="bold" />
            </Link>
          </Magnetic>
          <Magnetic>
            <Link className="btn btn--ghost" to="/katalog">
              Katalog
            </Link>
          </Magnetic>
        </Reveal>
      </div>

      <div className="container section">
        <div className="sechead sechead--center">
          <div className="sechead__main">
            <span className="eyebrow">Tavsiya</span>
            <h2 className="display-md">Eng ommabop modellar</h2>
          </div>
        </div>
        <div className="pgrid pgrid--4">
          {picks.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
