import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  FacebookLogo,
  InstagramLogo,
  PaperPlaneTilt,
  TelegramLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { useUI } from "../../store/useUI";
import { Marquee } from "../ui/Marquee";
import { Reveal } from "../ui/Reveal";

const COLS = [
  {
    title: "Xarid",
    links: [
      { label: "Ayollar", to: "/katalog/ayollar" },
      { label: "Erkaklar", to: "/katalog/erkaklar" },
      { label: "Unisex", to: "/katalog/unisex" },
      { label: "Aksessuarlar", to: "/katalog/aksessuar" },
      { label: "Chegirmalar", to: "/chegirma" },
    ],
  },
  {
    title: "Brend",
    links: [
      { label: "Biz haqimizda", to: "/brend" },
      { label: "Lookbook", to: "/lookbook" },
      { label: "Jurnal", to: "/jurnal" },
      { label: "Filiallar", to: "/filiallar" },
      { label: "Aloqa", to: "/aloqa" },
    ],
  },
  {
    title: "Yordam",
    links: [
      { label: "Savol-javob", to: "/yordam" },
      { label: "O'lcham jadvali", to: "/olcham-jadvali" },
      { label: "Yetkazib berish", to: "/yordam#yetkazib-berish" },
      { label: "Qaytarish", to: "/yordam#qaytarish" },
      { label: "Kabinet", to: "/kabinet" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const toast = useUI((s) => s.toast);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast("To'g'ri e-mail manzilini kiriting", "danger");
      return;
    }
    toast("Obuna tasdiqlandi. Rahmat!", "ok");
    setEmail("");
  };

  return (
    <footer className="ftr">
      <Marquee
        className="ftr__marquee"
        items={[
          "BEPUL YETKAZISH 500 000 SO'MDAN",
          "14 KUN QAYTARISH",
          "6 FILIAL",
          "KICHIK PARTIYA ISHLAB CHIQARISH",
          "ORIGINAL MATERIALLAR",
        ].map((t) => (
          <span className="ftr__mq">{t}</span>
        ))}
        speed={42}
      />

      <div className="container ftr__top">
        <Reveal variant="up" className="ftr__brand">
          <Link to="/" className="ftr__logo font-display">
            WEARSHOP
          </Link>
          <p className="muted ftr__tag">
            2018-yildan beri O'zbekistonda ishlab chiqarilgan premium kiyim. Kichik partiya, shaffof
            zanjir, uzoq umr.
          </p>
          <form className="ftr__news" onSubmit={submit}>
            <label htmlFor="ftr-mail" className="ftr__newslabel">
              Yangi kolleksiyalar haqida birinchi bo'lib biling
            </label>
            <div className="ftr__newsrow">
              <input
                id="ftr-mail"
                type="email"
                placeholder="sizning@email.uz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="ftr__newsbtn" type="submit" aria-label="Obuna bo'lish">
                <PaperPlaneTilt size={18} weight="fill" />
              </button>
            </div>
          </form>
        </Reveal>

        <div className="ftr__cols">
          {COLS.map((c, i) => (
            <Reveal variant="up" delay={80 + i * 70} className="ftr__col" key={c.title}>
              <h4 className="ftr__coltitle">{c.title}</h4>
              <ul>
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="ftr__link">
                      <span>{l.label}</span>
                      <ArrowRight size={13} weight="bold" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="container ftr__bottom">
        <p className="muted">© {new Date().getFullYear()} WEARSHOP. Barcha huquqlar himoyalangan.</p>
        <div className="ftr__social">
          {[
            { Icon: InstagramLogo, label: "Instagram" },
            { Icon: TelegramLogo, label: "Telegram" },
            { Icon: FacebookLogo, label: "Facebook" },
            { Icon: YoutubeLogo, label: "YouTube" },
          ].map(({ Icon, label }) => (
            <a key={label} className="ftr__soc" href="#" aria-label={label} onClick={(e) => e.preventDefault()}>
              <Icon size={17} weight="fill" />
            </a>
          ))}
        </div>
        <div className="ftr__pay">
          {["UZCARD", "HUMO", "VISA", "PAYME", "CLICK"].map((p) => (
            <span key={p} className="ftr__paychip">
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
