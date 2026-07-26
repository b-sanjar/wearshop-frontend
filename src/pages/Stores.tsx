import { useState } from "react";
import { Clock, MapPin, Phone, Star } from "@phosphor-icons/react";
import { STORES } from "../data/content";
import { PageHero } from "../components/ui/Bits";
import { Reveal } from "../components/ui/Reveal";

const CITIES = ["Barchasi", ...new Set(STORES.map((s) => s.city))];

export default function Stores() {
  const [city, setCity] = useState("Barchasi");
  const [active, setActive] = useState(STORES[0].id);
  const list = city === "Barchasi" ? STORES : STORES.filter((s) => s.city === city);
  const current = STORES.find((s) => s.id === active) || STORES[0];

  return (
    <div className="st" data-sec="teal">
      <PageHero
        eyebrow="Filiallar"
        title="Bizni oflayn toping"
        text="Olti shahardagi do'konlarimizda kolleksiyani qo'lda his qiling, o'lchov oling va stilist maslahatidan foydalaning."
        trail={[{ label: "Filiallar" }]}
      />

      <div className="container st__filters">
        {CITIES.map((c) => (
          <button key={c} className={`chip ${city === c ? "is-on" : ""}`} onClick={() => setCity(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="container st__layout">
        <div className="st__list">
          {list.map((s, i) => (
            <Reveal variant="up" delay={i * 70} key={s.id}>
              <button
                className={`st__card ${active === s.id ? "is-on" : ""}`}
                onClick={() => setActive(s.id)}
              >
                <span className="st__cardhead">
                  <strong>{s.name}</strong>
                  {s.flagship && (
                    <span className="tag tag--info">
                      <Star size={11} weight="fill" /> Flagship
                    </span>
                  )}
                </span>
                <span className="st__line muted">
                  <MapPin size={14} /> {s.address}
                </span>
                <span className="st__line muted">
                  <Phone size={14} /> {s.phone}
                </span>
                <span className="st__line muted">
                  <Clock size={14} /> {s.hours}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <aside className="st__preview">
          <div className="st__previewimg img-frame">
            <img src={current.image} alt={current.name} />
          </div>
          <div className="st__previewbody">
            <span className="eyebrow">{current.city}</span>
            <h3>{current.name}</h3>
            <p className="muted">{current.address}</p>
            <div className="st__previewrows">
              <div>
                <span className="muted">Telefon</span>
                <strong>{current.phone}</strong>
              </div>
              <div>
                <span className="muted">Ish vaqti</span>
                <strong>{current.hours}</strong>
              </div>
            </div>
            <div className="st__services">
              {["O'lchov olish", "Stilist maslahati", "Onlayn buyurtmani olish", "Ta'mirlash qabuli"].map((x) => (
                <span className="tag tag--muted" key={x}>
                  {x}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
