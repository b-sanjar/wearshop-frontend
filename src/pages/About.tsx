import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { TIMELINE, VALUES } from "../data/content";
import { Reveal, RevealText } from "../components/ui/Reveal";
import { Marquee } from "../components/ui/Marquee";
import { Magnetic } from "../components/ui/Magnetic";
import { Breadcrumbs } from "../components/ui/Bits";
import { useCountUp, useInView, useScrollY } from "../lib/hooks";

const NUMBERS = [
  { value: 2018, label: "Tashkil topgan yil", plain: true },
  { value: 6, label: "Filiallar" },
  { value: 60, label: "Jamoa a'zolari", suffix: "+" },
  { value: 4, label: "Hamkor ustaxona" },
];

export default function About() {
  const y = useScrollY();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <div className="ab" data-sec="moss">
      <header className="ab__hero">
        <div className="ab__heroimg img-frame">
          <img
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1800&auto=format&fit=crop"
            alt=""
            style={{ transform: `translateY(${y * 0.2}px) scale(1.1)` }}
          />
        </div>
        <div className="container ab__heroinner">
          <Breadcrumbs trail={[{ label: "Brend" }]} />
          <span className="eyebrow">Biz haqimizda</span>
          <RevealText as="h1" text="Uch kishilik ustaxonadan" className="display-xl" />
          <RevealText as="h1" text="olti filialgacha" className="display-xl ab__heroline2" delay={180} />
        </div>
      </header>

      <section className="container section ab__intro">
        <Reveal variant="up">
          <p className="ab__lead">
            WEARSHOP 2018-yilda Surxondaryo viloyatining Denov shahrida, bitta tikuv mashinasi va oddiy g'oya bilan boshlangan:
            uzoq xizmat qiladigan, halol narxdagi va mahalliy ishlab chiqarilgan kiyim yaratish.
          </p>
        </Reveal>
        <Reveal variant="up" delay={140}>
          <p className="muted ab__para">
            Bugun bizda olti filial, to'rtta hamkor ustaxona va oltmish kishilik jamoa bor. Lekin
            asosiy tamoyil o'zgargani yo'q — biz hech qachon ortiqcha ishlab chiqarmaymiz va har bir
            buyum qo'lda tekshiriladi. Bu bizning ishlab chiqarishimizni sekinroq, lekin ancha
            ishonchli qiladi.
          </p>
        </Reveal>
      </section>

      <div className="ticker">
        <Marquee
          speed={50}
          items={["QO'LDA TEKSHIRILGAN", "KICHIK PARTIYA", "MAHALLIY ISHLAB CHIQARISH", "SHAFFOF ZANJIR"].map((t) => (
            <span className="ticker__item font-display">{t}</span>
          ))}
        />
      </div>

      <section className="section ab__numbers" ref={ref}>
        <div className="container ab__numgrid">
          {NUMBERS.map((n) => (
            <AbNumber key={n.label} {...n} start={inView} />
          ))}
        </div>
      </section>

      <section className="container section ab__values">
        <div className="sechead sechead--left">
          <div className="sechead__main">
            <span className="eyebrow">Tamoyillar</span>
            <h2 className="display-md">Biz nimaga ishonamiz</h2>
          </div>
        </div>
        <div className="ab__vlist">
          {VALUES.map((v, i) => (
            <Reveal variant="left" delay={i * 90} key={v.n}>
              <div className="ab__vrow">
                <span className="ab__vn font-display">{v.n}</span>
                <h3>{v.title}</h3>
                <p className="muted">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section ab__timeline">
        <div className="sechead sechead--center">
          <div className="sechead__main">
            <span className="eyebrow">Tarix</span>
            <h2 className="display-md">Yo'limiz</h2>
          </div>
        </div>
        <ol className="ab__tl">
          {TIMELINE.map((t, i) => (
            <Reveal variant="up" delay={i * 80} key={t.year} as="li" className="ab__tlitem">
              <span className="ab__tlyear font-display">{t.year}</span>
              <span className="ab__tldot" />
              <span className="ab__tlbody">
                <strong>{t.title}</strong>
                <span className="muted">{t.text}</span>
              </span>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="ab__cta">
        <div className="container ab__ctainner">
          <RevealText text="Kolleksiyani ko'rishga tayyormisiz?" className="display-lg" />
          <Reveal variant="up" delay={140}>
            <p className="muted">
              Onlayn katalogimizni ko'ring yoki olti filialimizdan biriga tashrif buyuring.
            </p>
          </Reveal>
          <Reveal variant="up" delay={220} className="ab__ctabtns">
            <Magnetic>
              <Link className="btn btn--accent" to="/katalog">
                Katalog <ArrowRight size={16} weight="bold" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link className="btn btn--ghost" to="/filiallar">
                Filiallar
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function AbNumber({
  value,
  label,
  suffix = "",
  plain = false,
  start,
}: {
  value: number;
  label: string;
  suffix?: string;
  plain?: boolean;
  start: boolean;
}) {
  const n = useCountUp(value, 1700, start);
  return (
    <div className="ab__num">
      <strong className="font-display">
        {plain ? value : n}
        {suffix}
      </strong>
      <span className="muted">{label}</span>
    </div>
  );
}
