import { useState } from "react";
import { Link } from "react-router-dom";
import { Info, Ruler } from "@phosphor-icons/react";
import { SIZE_TABLES } from "../data/content";
import { PageHero } from "../components/ui/Bits";
import { Reveal } from "../components/ui/Reveal";

const HOWTO = [
  { title: "Ko'krak", text: "Lentani ko'krakning eng keng qismidan, qo'ltiq ostidan gorizontal o'tkazing." },
  { title: "Bel", text: "Belning eng ingichka joyidan, nafas chiqargan holatda o'lchang." },
  { title: "Son", text: "Sonning eng keng qismidan, oyoqlarni juftlab turgan holda o'lchang." },
  { title: "Yelka", text: "Bir yelka suyagidan ikkinchisigacha, orqa tomondan o'lchang." },
];

export default function SizeGuide() {
  const [tab, setTab] = useState<"erkaklar" | "ayollar">("ayollar");
  const table = SIZE_TABLES[tab];

  return (
    <div className="sg" data-sec="olive">
      <PageHero
        eyebrow="Qo'llanma"
        title="O'lcham jadvali"
        text="Yorliqdagi harfga emas, santimetrga ishoning. Quyidagi jadval barcha kolleksiyalarimizga tegishli."
        trail={[{ label: "O'lcham jadvali" }]}
      />

      <div className="container sg__body">
        <div className="sg__tabs">
          <button className={`chip ${tab === "ayollar" ? "is-on" : ""}`} onClick={() => setTab("ayollar")}>
            Ayollar
          </button>
          <button className={`chip ${tab === "erkaklar" ? "is-on" : ""}`} onClick={() => setTab("erkaklar")}>
            Erkaklar
          </button>
        </div>

        <Reveal variant="up" className="sg__tablewrap">
          <table className="sg__table">
            <thead>
              <tr>
                {table.cols.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((r) => (
                <tr key={r[0]}>
                  {r.map((cell, i) => (
                    <td key={i} className={i === 0 ? "sg__size" : ""}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <div className="note sg__note">
          <Info size={17} />
          <span>
            Ikki o'lcham orasida qolsangiz, oversize modellar uchun kichikroq, klassik kesim uchun
            kattaroq o'lchamni tanlang. Har bir mahsulot sahifasida buyumning aniq o'lchamlari ham
            ko'rsatilgan.
          </span>
        </div>

        <section className="sg__how">
          <div className="sechead sechead--left">
            <div className="sechead__main">
              <span className="eyebrow">
                <Ruler size={13} /> Qanday o'lchash kerak
              </span>
              <h2 className="display-md">To'rt asosiy o'lchov</h2>
            </div>
          </div>
          <div className="sg__howgrid">
            {HOWTO.map((h, i) => (
              <Reveal variant="up" delay={i * 80} key={h.title}>
                <div className="sg__howcard">
                  <span className="sg__hown">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{h.title}</h3>
                  <p className="muted">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="sg__cta panel">
          <div>
            <h3>Baribir ikkilanyapsizmi?</h3>
            <p className="muted">
              Filiallarimizda bepul o'lchov olish xizmati mavjud — mutaxassis sizga to'g'ri o'lchamni
              tanlashda yordam beradi.
            </p>
          </div>
          <Link className="btn btn--sm btn--accent" to="/filiallar">
            Filiallar
          </Link>
        </div>
      </div>
    </div>
  );
}
