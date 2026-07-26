import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Package,
  Camera,
  Palette,
  Scissors,
  Sparkle,
  Storefront,
  Tag,
} from "@phosphor-icons/react";
import { PRODUCTS } from "../data/products";
import { JOURNAL, LOOKBOOKS, STORES, VALUES } from "../data/content";
import { dateUz } from "../lib/format";
import { Reveal, RevealText } from "../components/ui/Reveal";
import { Marquee } from "../components/ui/Marquee";
import { Magnetic } from "../components/ui/Magnetic";
import { ProductCard } from "../components/ui/ProductCard";
import { Rail } from "../components/ui/Rail";
import { Sparkles } from "../components/ui/Sparkles";
import { SectionHead } from "../components/ui/Bits";
import { useCountUp, useInView, useScrollProgress, useScrollY } from "../lib/hooks";

const HERO_SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop",
    label: "Soirée 2026",
  },
  {
    img: "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1600&auto=format&fit=crop",
    label: "Sartorial",
  },
  {
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop",
    label: "Riviera",
  },
];

const CATEGORIES = [
  {
    to: "/katalog/ayollar",
    label: "Ayollar",
    count: PRODUCTS.filter((p) => p.category === "ayollar").length,
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1100&auto=format&fit=crop",
  },
  {
    to: "/katalog/erkaklar",
    label: "Erkaklar",
    count: PRODUCTS.filter((p) => p.category === "erkaklar").length,
    img: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1100&auto=format&fit=crop",
  },
  {
    to: "/katalog/unisex",
    label: "Unisex",
    count: PRODUCTS.filter((p) => p.category === "unisex").length,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1100&auto=format&fit=crop",
  },
  {
    to: "/katalog/aksessuar",
    label: "Aksessuar",
    count: PRODUCTS.filter((p) => p.category === "aksessuar").length,
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1100&auto=format&fit=crop",
  },
];

const STATS = [
  { value: 6, suffix: "", label: "Filial" },
  { value: 40000, suffix: "+", label: "Mijoz" },
  { value: 68, suffix: "%", label: "Barqaror material" },
  { value: 14, suffix: " kun", label: "Qaytarish kafolati" },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const y = useScrollY();
  const newest = PRODUCTS.filter((p) => p.isNew).slice(0, 10);
  const best = [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, 8);
  const posts = JOURNAL.slice(0, 3);
  const [lead, ...rest] = LOOKBOOKS;

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5200);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero__bgwrap">
          {HERO_SLIDES.map((s, i) => (
            <div
              key={s.img}
              className={`hero__bg img-frame ${i === slide ? "is-on" : ""}`}
              style={{ transform: `translateY(${y * 0.18}px) scale(${1 + y * 0.00012})` }}
            >
              <img src={s.img} alt="" />
            </div>
          ))}
          <span className="hero__veil" />
          <span className="hero__aurora" aria-hidden="true" />
        </div>
        <Sparkles count={20} />

        <div className="container-wide hero__inner">
          <div className="hero__left">
            <Reveal variant="fade">
              <span className="hero__eyebrow">
                <Sparkle size={13} weight="fill" /> Bahor / Yoz 2026 kolleksiyasi
              </span>
            </Reveal>

            <h1 className="hero__title">
              <RevealText as="span" text="Kiyim emas —" className="hero__line" />
              <RevealText
                as="span"
                text="ikkinchi teri."
                className="hero__line hero__line--accent"
                mode="line"
                delay={200}
              />
            </h1>

            <Reveal variant="up" delay={420}>
              <p className="hero__text">
                Denovdagi ustaxonamizda kichik partiyalarda tikilgan premium kiyim. Har bir tikuv
                tekshirilgan, har bir mato tanlab olingan.
              </p>
            </Reveal>

            <Reveal variant="up" delay={540} className="hero__actions">
              <Magnetic>
                <Link className="btn btn--accent" to="/katalog">
                  Kolleksiyani ko'rish <ArrowRight size={16} weight="bold" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link className="btn btn--ghost hero__ghost" to="/lookbook">
                  Lookbook
                </Link>
              </Magnetic>
            </Reveal>

            <Reveal variant="fade" delay={700} className="hero__scroll">
              <ArrowDown size={15} />
              <span>Pastga suring</span>
            </Reveal>
          </div>

          <div className="hero__right">
            <div className="hero__slidelabels">
              {HERO_SLIDES.map((s, i) => (
                <button
                  key={s.label}
                  className={`hero__slidebtn ${i === slide ? "is-on" : ""}`}
                  onClick={() => setSlide(i)}
                >
                  <span className="hero__slidenum">{String(i + 1).padStart(2, "0")}</span>
                  <span className="hero__slidename">{s.label}</span>
                  <span className="hero__slidebar">
                    <span />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= TICKER ================= */}
      <div className="ticker">
        <Marquee
          speed={46}
          items={[
            "KICHIK PARTIYA",
            "O'ZBEKISTONDA TIKILGAN",
            "ORGANIK MATOLAR",
            "6 FILIAL",
            "14 KUN QAYTARISH",
            "BEPUL YETKAZISH 500K DAN",
          ].map((t) => (
            <span className="ticker__item font-display">{t}</span>
          ))}
        />
      </div>

      {/* ================= CATEGORIES ================= */}
      <section className="section cats" data-sec="rose">
        <div className="container">
          <SectionHead
            eyebrow="Katalog"
            title="Nimadan boshlaymiz?"
            text="To'rt yo'nalish, bitta standart. Har bir kategoriya bir xil ishlab chiqarish falsafasiga bo'ysunadi."
            align="split"
            action={
              <Link className="link-arrow" to="/katalog">
                Barcha mahsulotlar <ArrowUpRight size={15} weight="bold" />
              </Link>
            }
          />
          <div className="cats__grid">
            {CATEGORIES.map((c, i) => (
              <Reveal variant="up" delay={i * 90} key={c.to}>
                <Link to={c.to} className="cat">
                  <span className="cat__img img-frame">
                    <img src={c.img} alt="" loading="lazy" />
                  </span>
                  <span className="cat__body">
                    <span className="cat__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="cat__label font-display">{c.label}</span>
                    <span className="cat__count muted">{c.count} ta model</span>
                  </span>
                  <span className="cat__go">
                    <ArrowUpRight size={17} weight="bold" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEW ARRIVALS ================= */}
      <section className="section" data-sec="teal">
        <div className="container">
          <SectionHead
            eyebrow="Yangi kelganlar"
            title="Hozirgina ustaxonadan"
            align="split"
            action={
              <Link className="link-arrow" to="/katalog/yangi">
                Barchasi <ArrowUpRight size={15} weight="bold" />
              </Link>
            }
          />
        </div>
        <div className="container-wide">
          <Rail>
            {newest.map((p, i) => (
              <div className="rail__cell" key={p.id}>
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </Rail>
        </div>
      </section>

      {/* ================= EDITORIAL SPLIT ================= */}
      <EditorialSplit />

      {/* ================= VALUES ================= */}
      <section className="section vals" data-sec="amber">
        <div className="container">
          <SectionHead
            eyebrow="Falsafa"
            title="Nima uchun boshqacha"
            text="Bizning yondashuvimiz to'rtta oddiy tamoyilga asoslangan — va biz ulardan chekinmaymiz."
          />
          <div className="vals__grid">
            {VALUES.map((v, i) => (
              <Reveal variant="up" delay={i * 90} key={v.n}>
                <article className="val">
                  <span className="val__n">{v.n}</span>
                  <span className="val__icon">
                    {[<Package size={22} key="a" />, <Leaf size={22} key="b" />, <Scissors size={22} key="c" />, <Storefront size={22} key="d" />][i]}
                  </span>
                  <h3>{v.title}</h3>
                  <p className="muted">{v.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <StatsBand />

      {/* ================= BESTSELLERS ================= */}
      <section className="section" data-sec="gold">
        <div className="container">
          <SectionHead
            eyebrow="Bestsellerlar"
            title="Eng ko'p tanlanganlar"
            align="split"
            action={
              <Link className="link-arrow" to="/katalog?tag=bestseller">
                Barchasi <ArrowUpRight size={15} weight="bold" />
              </Link>
            }
          />
          <div className="pgrid pgrid--4">
            {best.map((p, i) => (
              <Reveal variant="up" delay={(i % 4) * 80} key={p.id}>
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ATELIER STORY ================= */}
      <AtelierStory />

      {/* ================= LOOKBOOK STRIP ================= */}
      <section className="section lbstrip" data-sec="violet">
        <div className="container">
          <SectionHead
            eyebrow="Lookbook"
            title="Mavsumiy hikoyalar"
            text="Har bir kolleksiya ortida joy, yorug'lik va kayfiyat turadi. To'rt mavsum — to'rt vizual hikoya."
            align="split"
            action={
              <Link className="link-arrow" to="/lookbook">
                Barcha hikoyalar <ArrowUpRight size={15} weight="bold" />
              </Link>
            }
          />
        </div>

        <div className="container-wide lbstrip__layout">
          {/* Lead story, told at full width */}
          <Reveal variant="up" className="lbfeat-wrap">
            <Link to={`/lookbook/${lead.slug}`} className="lbfeat">
              <span className="lbfeat__img img-frame">
                <img src={lead.cover} alt="" loading="lazy" />
              </span>
              <span className="lbfeat__body">
                <span className="lbfeat__tag">
                  <Sparkle size={12} weight="fill" /> Mavsum hikoyasi
                </span>
                <span className="eyebrow">{lead.season}</span>
                <strong className="lbfeat__title font-display">{lead.title}</strong>
                <span className="muted lbfeat__ex">{lead.excerpt}</span>

                <span className="lbfeat__meta">
                  <span className="lbfeat__stat">
                    <Camera size={14} />
                    {lead.images.length} kadr
                  </span>
                  <span className="lbfeat__stat">
                    <Tag size={14} />
                    {lead.productIds.length} buyum
                  </span>
                  <span className="lbfeat__stat">
                    <Palette size={14} />
                    {lead.body.length} bo'lim
                  </span>
                </span>

                <span className="lbfeat__thumbs">
                  {lead.images.slice(1, 5).map((src) => (
                    <span className="lbfeat__thumb img-frame" key={src}>
                      <img src={src} alt="" loading="lazy" />
                    </span>
                  ))}
                </span>

                <span className="lbfeat__cta">
                  Hikoyani ochish <ArrowRight size={15} weight="bold" />
                </span>
              </span>
            </Link>
          </Reveal>

          {/* The remaining seasons, as a compact index */}
          <div className="lbstrip__rest">
            {rest.map((lb, i) => (
              <Reveal variant="left" delay={i * 90} key={lb.id}>
                <Link to={`/lookbook/${lb.slug}`} className="lbmini">
                  <span className="lbmini__img img-frame">
                    <img src={lb.cover} alt="" loading="lazy" />
                  </span>
                  <span className="lbmini__body">
                    <span className="lbmini__season">{lb.season}</span>
                    <strong className="lbmini__title font-display">{lb.title}</strong>
                    <span className="muted lbmini__ex">{lb.excerpt}</span>
                    <span className="lbmini__meta">
                      <Camera size={12} /> {lb.images.length} kadr
                      <span className="lbmini__dot" />
                      <Tag size={12} /> {lb.productIds.length} buyum
                    </span>
                  </span>
                  <span className="lbmini__go">
                    <ArrowUpRight size={16} weight="bold" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= JOURNAL ================= */}
      <section className="section" data-sec="indigo">
        <div className="container">
          <SectionHead
            eyebrow="Jurnal"
            title="O'qish uchun"
            align="split"
            action={
              <Link className="link-arrow" to="/jurnal">
                Barcha maqolalar <ArrowUpRight size={15} weight="bold" />
              </Link>
            }
          />
          <div className="jgrid">
            {posts.map((p, i) => (
              <Reveal variant="up" delay={i * 90} key={p.id}>
                <Link to={`/jurnal/${p.slug}`} className="jcard">
                  <span className="jcard__img img-frame">
                    <img src={p.cover} alt="" loading="lazy" />
                  </span>
                  <span className="jcard__meta">
                    <span className="jcard__cat">{p.category}</span>
                    <span className="muted">
                      {dateUz(p.date)} · {p.readMinutes} daqiqa
                    </span>
                  </span>
                  <h3 className="jcard__title">{p.title}</h3>
                  <p className="muted jcard__ex">{p.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STORES ================= */}
      <section className="section stband" data-sec="teal">
        <div className="container stband__inner">
          <div className="stband__text">
            <Reveal variant="fade">
              <span className="eyebrow">Filiallar</span>
            </Reveal>
            <RevealText text="Bizni oflayn ham topasiz" className="display-md" />
            <Reveal variant="up" delay={120}>
              <p className="muted">
                Olti shahardagi do'konlarimizda kolleksiyani qo'lda his qiling, o'lchov oling va
                stilist maslahatidan foydalaning.
              </p>
            </Reveal>
            <Reveal variant="up" delay={200}>
              <Magnetic>
                <Link className="btn btn--teal" to="/filiallar">
                  Barcha filiallar <ArrowRight size={16} weight="bold" />
                </Link>
              </Magnetic>
            </Reveal>
          </div>
          <div className="stband__list">
            {STORES.slice(0, 4).map((s, i) => (
              <Reveal variant="left" delay={i * 80} key={s.id}>
                <Link to="/filiallar" className="stband__row">
                  <span className="stband__city">{s.city}</span>
                  <span className="stband__addr muted">{s.address}</span>
                  <ArrowUpRight size={15} weight="bold" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- Sub-sections ---------------- */

function EditorialSplit() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const lb = LOOKBOOKS[0];

  return (
    <section className="edit" ref={ref} data-sec="violet">
      <div className="container-wide edit__inner">
        <div className="edit__media">
          <div className="edit__imgwrap img-frame">
            <img
              src={lb.cover}
              alt=""
              loading="lazy"
              style={{ transform: `scale(1.14) translateY(${(progress - 0.5) * -60}px)` }}
            />
          </div>
          <div className="edit__imgsm img-frame" style={{ transform: `translateY(${(progress - 0.5) * 90}px)` }}>
            <img src={lb.images[2]} alt="" loading="lazy" />
          </div>
        </div>
        <div className="edit__text">
          <Reveal variant="fade">
            <span className="eyebrow">{lb.season}</span>
          </Reveal>
          <RevealText text={lb.title} className="display-lg edit__title" />
          <Reveal variant="up" delay={140}>
            <p className="edit__lead">{lb.excerpt}</p>
          </Reveal>
          <Reveal variant="up" delay={220}>
            <p className="muted edit__body">{lb.body[0]}</p>
          </Reveal>
          <Reveal variant="up" delay={300}>
            <Magnetic>
              <Link className="btn btn--violet" to={`/lookbook/${lb.slug}`}>
                Hikoyani ochish <ArrowRight size={16} weight="bold" />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function StatsBand() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  return (
    <section className="statband" ref={ref}>
      <div className="container statband__grid">
        {STATS.map((s) => (
          <Stat key={s.label} {...s} start={inView} />
        ))}
      </div>
    </section>
  );
}

function Stat({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const n = useCountUp(value, 1800, start);
  return (
    <div className="stat">
      <strong className="stat__n font-display">
        {n.toLocaleString("ru-RU")}
        {suffix}
      </strong>
      <span className="stat__l muted">{label}</span>
    </div>
  );
}

function AtelierStory() {
  const steps = [
    {
      n: "01",
      title: "Eskiz",
      text: "Har bir model qog'ozdagi chizmadan boshlanadi. Kesim, proporsiya va detallar oldindan hal qilinadi.",
      img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1100&auto=format&fit=crop",
    },
    {
      n: "02",
      title: "Mato",
      text: "Italiya, Turkiya va O'zbekistondan kelgan matolar orasidan har mavsum uchun 12 tasi tanlanadi.",
      img: "https://images.unsplash.com/photo-1528812969535-4bcefc071532?q=80&w=1100&auto=format&fit=crop",
    },
    {
      n: "03",
      title: "Tikuv",
      text: "To'rtta hamkor ustaxona, kichik partiyalar. Bir modeldan 80 dan 200 tagacha.",
      img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1100&auto=format&fit=crop",
    },
    {
      n: "04",
      title: "Nazorat",
      text: "Har bir buyum qo'lda tekshiriladi: tikuv, fermuar, yorliq va o'lcham muvofiqligi.",
      img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1100&auto=format&fit=crop",
    },
  ];
  const [active, setActive] = useState(0);

  return (
    <section className="section atel" data-sec="moss">
      <div className="container">
        <SectionHead eyebrow="Atelier" title="Bir buyum qanday tug'iladi" align="center" />
        <div className="atel__grid">
          <div className="atel__media img-frame">
            {steps.map((s, i) => (
              <img
                key={s.n}
                src={s.img}
                alt=""
                loading="lazy"
                className={i === active ? "is-on" : ""}
              />
            ))}
            <span className="atel__stepnum font-display">{steps[active].n}</span>
          </div>
          <ol className="atel__steps">
            {steps.map((s, i) => (
              <li key={s.n}>
                <button
                  className={`atel__step ${i === active ? "is-on" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <span className="atel__stepn">{s.n}</span>
                  <span className="atel__stepbody">
                    <strong>{s.title}</strong>
                    <span className="muted">{s.text}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
