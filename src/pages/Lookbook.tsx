import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import { LOOKBOOKS } from "../data/content";
import { PageHero } from "../components/ui/Bits";
import { Reveal } from "../components/ui/Reveal";
import { Marquee } from "../components/ui/Marquee";

export default function Lookbook() {
  return (
    <div className="lb" data-sec="violet">
      <PageHero
        eyebrow="Lookbook"
        title="Mavsumiy hikoyalar"
        text="Har bir kolleksiya ortida joy, yorug'lik va kayfiyat turadi. Quyida — ularning vizual hikoyasi."
        trail={[{ label: "Lookbook" }]}
      />

      <div className="ticker ticker--thin">
        <Marquee
          speed={54}
          reverse
          items={LOOKBOOKS.map((l) => (
            <span className="ticker__item font-display">{l.title.toUpperCase()}</span>
          ))}
        />
      </div>

      <div className="container section lb__list">
        {LOOKBOOKS.map((lb, i) => (
          <Reveal variant="up" delay={60} key={lb.id}>
            <Link to={`/lookbook/${lb.slug}`} className={`lbrow ${i % 2 ? "lbrow--flip" : ""}`}>
              <div className="lbrow__media">
                <span className="img-frame lbrow__main">
                  <img src={lb.cover} alt="" loading="lazy" />
                </span>
                <span className="img-frame lbrow__sub">
                  <img src={lb.images[1]} alt="" loading="lazy" />
                </span>
              </div>
              <div className="lbrow__text">
                <span className="lbrow__num font-display">{String(i + 1).padStart(2, "0")}</span>
                <span className="eyebrow">{lb.season}</span>
                <h2 className="display-md">{lb.title}</h2>
                <p className="muted">{lb.excerpt}</p>
                <span className="link-arrow">
                  Hikoyani ko'rish <ArrowUpRight size={15} weight="bold" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
