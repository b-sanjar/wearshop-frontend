import { Link } from "react-router-dom";
import { CaretRight } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Reveal, RevealText } from "./Reveal";

export function Breadcrumbs({ trail }: { trail: { label: string; to?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Navigatsiya">
      <Link to="/">Bosh sahifa</Link>
      {trail.map((t) => (
        <span key={t.label} className="crumbs__item">
          <CaretRight size={11} weight="bold" />
          {t.to ? <Link to={t.to}>{t.label}</Link> : <span className="muted">{t.label}</span>}
        </span>
      ))}
    </nav>
  );
}

interface SectionHeadProps {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center" | "split";
  action?: ReactNode;
}

export function SectionHead({ eyebrow, title, text, align = "left", action }: SectionHeadProps) {
  return (
    <div className={`sechead sechead--${align}`}>
      <div className="sechead__main">
        {eyebrow && (
          <Reveal variant="fade">
            <span className="eyebrow">{eyebrow}</span>
          </Reveal>
        )}
        <RevealText text={title} className="sechead__title display-md" />
        {text && (
          <Reveal variant="up" delay={120}>
            <p className="sechead__text muted">{text}</p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal variant="up" delay={160} className="sechead__action">
          {action}
        </Reveal>
      )}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  image,
  trail,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  image?: string;
  trail?: { label: string; to?: string }[];
}) {
  return (
    <header className={`phero ${image ? "phero--image" : ""}`}>
      {image && (
        <div className="phero__bg img-frame">
          <img src={image} alt="" />
        </div>
      )}
      <div className="container phero__inner">
        {trail && <Breadcrumbs trail={trail} />}
        {eyebrow && (
          <Reveal variant="fade">
            <span className="eyebrow">{eyebrow}</span>
          </Reveal>
        )}
        <RevealText text={title} as="h1" className="phero__title display-lg" />
        {text && (
          <Reveal variant="up" delay={140}>
            <p className="phero__text muted">{text}</p>
          </Reveal>
        )}
      </div>
    </header>
  );
}

export function Empty({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <span className="empty__icon">{icon}</span>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
      {action}
    </div>
  );
}
