import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { LOOKBOOKS } from "../data/content";
import { PRODUCTS } from "../data/products";
import { Breadcrumbs } from "../components/ui/Bits";
import { Reveal, RevealText } from "../components/ui/Reveal";
import { ProductCard } from "../components/ui/ProductCard";
import { useScrollY } from "../lib/hooks";

export default function LookbookStory() {
  const { slug } = useParams();
  const idx = LOOKBOOKS.findIndex((l) => l.slug === slug);
  const lb = LOOKBOOKS[idx];
  const y = useScrollY();

  if (!lb) {
    return (
      <div className="container section" style={{ textAlign: "center" }}>
        <h1 className="display-md">Hikoya topilmadi</h1>
        <Link className="btn" to="/lookbook" style={{ marginTop: "1.5rem" }}>
          Lookbookga qaytish
        </Link>
      </div>
    );
  }

  const next = LOOKBOOKS[(idx + 1) % LOOKBOOKS.length];
  const products = lb.productIds.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as typeof PRODUCTS;

  return (
    <article className="lbs" data-sec="violet">
      <header className="lbs__hero">
        <div className="lbs__heroimg img-frame">
          <img src={lb.cover} alt="" style={{ transform: `translateY(${y * 0.22}px) scale(1.12)` }} />
        </div>
        <div className="container lbs__heroinner">
          <Breadcrumbs trail={[{ label: "Lookbook", to: "/lookbook" }, { label: lb.title }]} />
          <span className="eyebrow">{lb.season}</span>
          <RevealText as="h1" text={lb.title} className="display-xl" />
        </div>
      </header>

      <div className="container lbs__intro">
        {lb.body.map((p, i) => (
          <Reveal variant="up" delay={i * 90} key={i}>
            <p className={i === 0 ? "lbs__lead" : "muted lbs__para"}>{p}</p>
          </Reveal>
        ))}
      </div>

      <div className="container-wide lbs__gallery">
        {lb.images.map((src, i) => (
          <Reveal variant="clip" delay={(i % 3) * 90} key={src} className={`lbs__shot lbs__shot--${(i % 5) + 1}`}>
            <span className="img-frame">
              <img src={src} alt="" loading="lazy" />
            </span>
          </Reveal>
        ))}
      </div>

      {products.length > 0 && (
        <section className="section container">
          <div className="sechead sechead--split">
            <div className="sechead__main">
              <span className="eyebrow">Hikoyadan</span>
              <h2 className="display-md">Ushbu ko'rinishdagi buyumlar</h2>
            </div>
            <Link className="link-arrow" to="/katalog">
              Butun katalog
            </Link>
          </div>
          <div className="pgrid pgrid--4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <nav className="container lbs__nav">
        <Link className="lbs__navlink" to="/lookbook">
          <ArrowLeft size={15} weight="bold" /> Barcha hikoyalar
        </Link>
        <Link className="lbs__navnext" to={`/lookbook/${next.slug}`}>
          <span>
            <span className="muted">Keyingi hikoya</span>
            <strong className="font-display">{next.title}</strong>
          </span>
          <ArrowRight size={17} weight="bold" />
        </Link>
      </nav>
    </article>
  );
}
