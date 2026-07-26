import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Clock, ShareNetwork } from "@phosphor-icons/react";
import { JOURNAL } from "../data/content";
import { dateUz } from "../lib/format";
import { Breadcrumbs } from "../components/ui/Bits";
import { Reveal, RevealText } from "../components/ui/Reveal";
import { useUI } from "../store/useUI";

export default function JournalPost() {
  const { slug } = useParams();
  const idx = JOURNAL.findIndex((p) => p.slug === slug);
  const post = JOURNAL[idx];
  const toast = useUI((s) => s.toast);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".jp__body");
    if (!el) return;
    const on = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [slug]);

  if (!post) {
    return (
      <div className="container section" style={{ textAlign: "center" }}>
        <h1 className="display-md">Maqola topilmadi</h1>
        <Link className="btn" to="/jurnal" style={{ marginTop: "1.5rem" }}>
          Jurnalga qaytish
        </Link>
      </div>
    );
  }

  const related = JOURNAL.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2);
  const more = related.length ? related : JOURNAL.filter((p) => p.id !== post.id).slice(0, 2);

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: post.title, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast("Havola nusxalandi", "info");
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <article className="jp" data-sec="indigo">
      <div className="jp__progress" style={{ transform: `scaleX(${progress})` }} />

      <header className="container jp__head">
        <Breadcrumbs trail={[{ label: "Jurnal", to: "/jurnal" }, { label: post.category }]} />
        <span className="jcard__cat">{post.category}</span>
        <RevealText as="h1" text={post.title} className="display-lg jp__title" />
        <div className="jp__meta">
          <span className="jp__author">
            <span className="jp__avatar">{post.author.charAt(0)}</span>
            <span>
              <strong>{post.author}</strong>
              <span className="muted">{dateUz(post.date)}</span>
            </span>
          </span>
          <span className="muted jp__read">
            <Clock size={14} /> {post.readMinutes} daqiqa o'qish
          </span>
          <button className="icon-btn" onClick={share} aria-label="Ulashish">
            <ShareNetwork size={17} />
          </button>
        </div>
      </header>

      <div className="container jp__cover img-frame">
        <img src={post.cover} alt="" />
      </div>

      <div className="jp__body">
        <div className="jp__content">
          {post.body.map((b, i) => {
            if (b.type === "h")
              return (
                <Reveal variant="up" key={i}>
                  <h2 className="jp__h">{b.content}</h2>
                </Reveal>
              );
            if (b.type === "quote")
              return (
                <Reveal variant="up" key={i}>
                  <blockquote className="jp__quote">
                    <span className="serif-italic">{b.content}</span>
                  </blockquote>
                </Reveal>
              );
            if (b.type === "img")
              return (
                <Reveal variant="clip" key={i}>
                  <span className="img-frame jp__img">
                    <img src={b.content} alt="" loading="lazy" />
                  </span>
                </Reveal>
              );
            return (
              <Reveal variant="up" key={i}>
                <p className="jp__p">{b.content}</p>
              </Reveal>
            );
          })}
        </div>
      </div>

      <section className="container jp__more">
        <div className="sechead sechead--left">
          <div className="sechead__main">
            <span className="eyebrow">Davomi</span>
            <h2 className="display-md">Yana o'qing</h2>
          </div>
        </div>
        <div className="jp__morelist">
          {more.map((p) => (
            <Link key={p.id} to={`/jurnal/${p.slug}`} className="jcard">
              <span className="jcard__img img-frame">
                <img src={p.cover} alt="" loading="lazy" />
              </span>
              <span className="jcard__meta">
                <span className="jcard__cat">{p.category}</span>
                <span className="muted">{dateUz(p.date)}</span>
              </span>
              <h3 className="jcard__title">{p.title}</h3>
            </Link>
          ))}
        </div>
        <Link className="btn btn--ghost jp__back" to="/jurnal">
          Barcha maqolalar <ArrowRight size={15} weight="bold" />
        </Link>
      </section>
    </article>
  );
}
