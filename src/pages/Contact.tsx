import { useState } from "react";
import { EnvelopeSimple, MapPin, PaperPlaneTilt, Phone, TelegramLogo } from "@phosphor-icons/react";
import { STORES } from "../data/content";
import { useUI } from "../store/useUI";
import { PageHero } from "../components/ui/Bits";
import { Reveal } from "../components/ui/Reveal";

const TOPICS = ["Buyurtma holati", "Qaytarish / almashtirish", "Hamkorlik", "Boshqa savol"];

export default function Contact() {
  const toast = useUI((s) => s.toast);
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (form.name.trim().length < 3) err.name = "Ismingizni kiriting";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "To'g'ri e-mail kiriting";
    if (form.message.trim().length < 10) err.message = "Xabar kamida 10 ta belgidan iborat bo'lsin";
    setErrors(err);
    if (Object.keys(err).length) return;

    setSent(true);
    toast("Xabaringiz yuborildi. Tez orada javob beramiz!", "ok");
    setForm({ name: "", email: "", topic: TOPICS[0], message: "" });
  };

  const flagship = STORES.find((s) => s.flagship)!;

  return (
    <div className="ct" data-sec="sapphire">
      <PageHero
        eyebrow="Aloqa"
        title="Biz bilan bog'laning"
        text="Savolingiz bormi yoki hamkorlik taklif qilmoqchimisiz? Quyidagi formani to'ldiring — jamoamiz bir ish kuni ichida javob beradi."
        trail={[{ label: "Aloqa" }]}
      />

      <div className="container ct__layout">
        <div className="ct__formwrap panel">
          {sent ? (
            <div className="ct__sent">
              <span className="ct__senticon">
                <PaperPlaneTilt size={30} weight="fill" />
              </span>
              <h3>Xabaringiz yuborildi</h3>
              <p className="muted">
                Rahmat! Murojaatingiz qabul qilindi. Jamoamiz bir ish kuni ichida javob beradi.
              </p>
              <button className="btn btn--sm btn--ghost" onClick={() => setSent(false)}>
                Yana xabar yuborish
              </button>
            </div>
          ) : (
            <form className="ct__form" onSubmit={submit}>
              <h3 className="ct__ftitle">Xabar yuborish</h3>
              <div className="ct__two">
                <div className="field">
                  <label htmlFor="ct-name">Ismingiz</label>
                  <input
                    id="ct-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ism Familiya"
                  />
                  {errors.name && <span className="field__err">{errors.name}</span>}
                </div>
                <div className="field">
                  <label htmlFor="ct-mail">E-mail</label>
                  <input
                    id="ct-mail"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="sizning@email.uz"
                  />
                  {errors.email && <span className="field__err">{errors.email}</span>}
                </div>
              </div>

              <div className="field">
                <label htmlFor="ct-topic">Mavzu</label>
                <select
                  id="ct-topic"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                >
                  {TOPICS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="ct-msg">Xabar</label>
                <textarea
                  id="ct-msg"
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Savolingizni batafsil yozing…"
                />
                {errors.message && <span className="field__err">{errors.message}</span>}
              </div>

              <button className="btn btn--accent" type="submit">
                <PaperPlaneTilt size={16} weight="fill" /> Yuborish
              </button>
            </form>
          )}
        </div>

        <aside className="ct__side">
          <Reveal variant="up" className="ct__block">
            <span className="ct__icon">
              <Phone size={18} />
            </span>
            <div>
              <strong>Telefon</strong>
              <a href="tel:+998764121010">+998 76 412 10 10</a>
              <span className="muted">Har kuni 09:00 — 21:00</span>
            </div>
          </Reveal>

          <Reveal variant="up" delay={80} className="ct__block">
            <span className="ct__icon">
              <EnvelopeSimple size={18} />
            </span>
            <div>
              <strong>E-mail</strong>
              <a href="mailto:salom@wearshop.uz">salom@wearshop.uz</a>
              <span className="muted">Bir ish kuni ichida javob</span>
            </div>
          </Reveal>

          <Reveal variant="up" delay={160} className="ct__block">
            <span className="ct__icon">
              <TelegramLogo size={18} />
            </span>
            <div>
              <strong>Telegram</strong>
              <a href="#" onClick={(e) => e.preventDefault()}>
                @wearshop_uz
              </a>
              <span className="muted">Eng tez javob kanali</span>
            </div>
          </Reveal>

          <Reveal variant="up" delay={240} className="ct__block">
            <span className="ct__icon">
              <MapPin size={18} />
            </span>
            <div>
              <strong>Bosh ofis</strong>
              <span>{flagship.address}</span>
              <span className="muted">{flagship.hours}</span>
            </div>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}
