import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { PRODUCTS } from "../data/products";
import { JOURNAL, LOOKBOOKS } from "../data/content";
import { CATEGORY_LABEL, dateUz } from "../lib/format";
import { ProductCard } from "../components/ui/ProductCard";
import { Breadcrumbs, Empty } from "../components/ui/Bits";
import { RevealText } from "../components/ui/Reveal";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") || "";
  const [q, setQ] = useState(initial);

  useEffect(() => setQ(params.get("q") || ""), [params]);

  const term = initial.trim().toLowerCase();

  const products = useMemo(
    () =>
      term
        ? PRODUCTS.filter(
            (p) =>
              p.name.toLowerCase().includes(term) ||
              p.collection.toLowerCase().includes(term) ||
              p.fabric.toLowerCase().includes(term) ||
              CATEGORY_LABEL[p.category].toLowerCase().includes(term),
          )
        : [],
    [term],
  );

  const posts = useMemo(
    () =>
      term
        ? JOURNAL.filter(
            (p) => p.title.toLowerCase().includes(term) || p.excerpt.toLowerCase().includes(term),
          )
        : [],
    [term],
  );

  const stories = useMemo(
    () =>
      term
        ? LOOKBOOKS.filter(
            (l) => l.title.toLowerCase().includes(term) || l.excerpt.toLowerCase().includes(term),
          )
        : [],
    [term],
  );

  const total = products.length + posts.length + stories.length;

  return (
    <div className="container srch" data-sec="gold">
      <Breadcrumbs trail={[{ label: "Qidiruv" }]} />
      <RevealText as="h1" text="Qidiruv natijalari" className="display-lg" />

      <form
        className="srch__bar"
        onSubmit={(e) => {
          e.preventDefault();
          setParams(q.trim() ? { q: q.trim() } : {});
        }}
      >
        <MagnifyingGlass size={19} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nimani qidiryapsiz?" />
        <button className="btn btn--sm btn--accent" type="submit">
          Qidirish
        </button>
      </form>

      {initial && (
        <p className="muted srch__count">
          <strong>{initial}</strong> so'rovi bo'yicha {total} ta natija
        </p>
      )}

      {!initial ? (
        <Empty
          icon={<MagnifyingGlass size={28} />}
          title="Qidiruvni boshlang"
          text="Mahsulot nomi, kolleksiya, mato yoki maqola sarlavhasini kiriting."
        />
      ) : total === 0 ? (
        <Empty
          icon={<MagnifyingGlass size={28} />}
          title="Hech narsa topilmadi"
          text={`"${initial}" bo'yicha natija yo'q. Boshqa kalit so'z bilan urinib ko'ring.`}
          action={
            <Link className="btn btn--sm" to="/katalog">
              Katalogni ko'rish
            </Link>
          }
        />
      ) : (
        <div className="srch__results">
          {products.length > 0 && (
            <section>
              <h2 className="srch__stitle">Mahsulotlar ({products.length})</h2>
              <div className="pgrid pgrid--4">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </section>
          )}

          {stories.length > 0 && (
            <section>
              <h2 className="srch__stitle">Lookbook ({stories.length})</h2>
              <div className="jgrid">
                {stories.map((l) => (
                  <Link key={l.id} to={`/lookbook/${l.slug}`} className="jcard">
                    <span className="jcard__img img-frame">
                      <img src={l.cover} alt="" loading="lazy" />
                    </span>
                    <span className="jcard__meta">
                      <span className="jcard__cat">{l.season}</span>
                    </span>
                    <h3 className="jcard__title">{l.title}</h3>
                    <p className="muted jcard__ex">{l.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {posts.length > 0 && (
            <section>
              <h2 className="srch__stitle">Jurnal ({posts.length})</h2>
              <div className="jgrid">
                {posts.map((p) => (
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
            </section>
          )}
        </div>
      )}
    </div>
  );
}
