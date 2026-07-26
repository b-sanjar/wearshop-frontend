import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "@phosphor-icons/react";
import { JOURNAL } from "../data/content";
import { dateUz } from "../lib/format";
import { PageHero } from "../components/ui/Bits";
import { Reveal } from "../components/ui/Reveal";

const CATS = ["Barchasi", ...new Set(JOURNAL.map((p) => p.category))];

export default function Journal() {
  const [cat, setCat] = useState("Barchasi");
  const list = cat === "Barchasi" ? JOURNAL : JOURNAL.filter((p) => p.category === cat);
  const [lead, ...rest] = list;

  return (
    <div className="jr" data-sec="indigo">
      <PageHero
        eyebrow="Jurnal"
        title="Material, uslub va parvarish haqida"
        text="Kiyimni tanlash, saqlash va uzoq kiyish bo'yicha amaliy qo'llanmalar hamda brend hikoyalari."
        trail={[{ label: "Jurnal" }]}
      />

      <div className="container jr__filters">
        {CATS.map((c) => (
          <button key={c} className={`chip ${cat === c ? "is-on" : ""}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="container jr__body">
        {lead && (
          <Reveal variant="up">
            <Link to={`/jurnal/${lead.slug}`} className="jlead">
              <span className="img-frame jlead__img">
                <img src={lead.cover} alt="" loading="lazy" />
              </span>
              <span className="jlead__text">
                <span className="jcard__cat">{lead.category}</span>
                <h2 className="display-md">{lead.title}</h2>
                <p className="muted">{lead.excerpt}</p>
                <span className="jlead__meta muted">
                  {lead.author} · {dateUz(lead.date)} · <Clock size={13} /> {lead.readMinutes} daqiqa
                </span>
                <span className="link-arrow">
                  O'qish <ArrowUpRight size={15} weight="bold" />
                </span>
              </span>
            </Link>
          </Reveal>
        )}

        <div className="jgrid jr__grid">
          {rest.map((p, i) => (
            <Reveal variant="up" delay={(i % 3) * 90} key={p.id}>
              <Link to={`/jurnal/${p.slug}`} className="jcard">
                <span className="jcard__img img-frame">
                  <img src={p.cover} alt="" loading="lazy" />
                </span>
                <span className="jcard__meta">
                  <span className="jcard__cat">{p.category}</span>
                  <span className="muted">
                    {dateUz(p.date)} · {p.readMinutes} daq.
                  </span>
                </span>
                <h3 className="jcard__title">{p.title}</h3>
                <p className="muted jcard__ex">{p.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
