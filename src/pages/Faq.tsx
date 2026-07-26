import { useState } from "react";
import { Link } from "react-router-dom";
import { ChatCircleDots, MagnifyingGlass } from "@phosphor-icons/react";
import { FAQ_GROUPS } from "../data/content";
import { PageHero } from "../components/ui/Bits";
import { Accordion } from "../components/ui/Accordion";
import { Reveal } from "../components/ui/Reveal";

export default function Faq() {
  const [q, setQ] = useState("");

  const groups = FAQ_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter(
      (it) =>
        !q.trim() ||
        it.q.toLowerCase().includes(q.toLowerCase()) ||
        it.a.toLowerCase().includes(q.toLowerCase()),
    ),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="faq" data-sec="sapphire">
      <PageHero
        eyebrow="Yordam markazi"
        title="Savol-javob"
        text="Buyurtma, yetkazib berish, qaytarish va parvarish bo'yicha eng ko'p so'raladigan savollar."
        trail={[{ label: "Yordam" }]}
      />

      <div className="container faq__search">
        <MagnifyingGlass size={18} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Savolingizni yozing…"
          aria-label="Savol qidirish"
        />
      </div>

      <div className="container faq__layout">
        <div className="faq__groups">
          {groups.length === 0 ? (
            <p className="muted">"{q}" bo'yicha javob topilmadi. Boshqa so'z bilan qidirib ko'ring.</p>
          ) : (
            groups.map((g, i) => (
              <Reveal variant="up" delay={i * 70} key={g.group} className="faq__group">
                <h2 className="faq__gtitle">{g.group}</h2>
                <Accordion items={g.items.map((it) => ({ q: it.q, a: it.a }))} defaultOpen={i === 0 ? 0 : -1} />
              </Reveal>
            ))
          )}
        </div>

        <aside className="faq__side">
          <div className="panel faq__contact">
            <span className="faq__cicon">
              <ChatCircleDots size={22} />
            </span>
            <h3>Javob topilmadimi?</h3>
            <p className="muted">
              Qo'llab-quvvatlash jamoamiz har kuni 09:00 dan 21:00 gacha ishlaydi.
            </p>
            <Link className="btn btn--sm btn--accent" to="/aloqa">
              Bog'lanish
            </Link>
            <div className="faq__clinks">
              <Link to="/olcham-jadvali">O'lcham jadvali</Link>
              <Link to="/filiallar">Filiallar</Link>
              <Link to="/kabinet">Buyurtmam qayerda?</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
