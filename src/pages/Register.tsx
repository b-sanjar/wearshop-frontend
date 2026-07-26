import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { useAuth } from "../store/useAuth";
import { useUI } from "../store/useUI";
import { RevealText, Reveal } from "../components/ui/Reveal";

const strengthOf = (p: string) => {
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^\w\s]/.test(p)) s++;
  return Math.min(4, s);
};
const LABELS = ["Juda zaif", "Zaif", "O'rtacha", "Kuchli", "Juda kuchli"];

export default function Register() {
  const navigate = useNavigate();
  const register = useAuth((s) => s.register);
  const toast = useUI((s) => s.toast);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = strengthOf(form.password);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (form.name.trim().length < 3) err.name = "Ism kamida 3 ta harfdan iborat bo'lsin";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "To'g'ri e-mail kiriting";
    if (!/^\+?[\d\s()-]{9,}$/.test(form.phone)) err.phone = "Telefon raqami noto'g'ri";
    if (form.password.length < 6) err.password = "Parol kamida 6 ta belgidan iborat bo'lsin";
    if (form.password !== form.confirm) err.confirm = "Parollar mos kelmadi";
    if (!agree) err.agree = "Shartlarga rozilik bildiring";
    setErrors(err);
    if (Object.keys(err).length) return;

    const r = register(form);
    if (!r.ok) {
      setErrors({ email: r.message });
      return;
    }
    toast(r.message, "ok");
    navigate("/kabinet");
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [k]: e.target.value });
    setErrors({ ...errors, [k]: "" });
  };

  return (
    <div className="auth auth--reverse" data-sec="violet">
      <div className="auth__media img-frame">
        <img
          src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1400&auto=format&fit=crop"
          alt=""
        />
        <div className="auth__mediatext">
          <span className="eyebrow">A'zolik</span>
          <h2 className="display-md">Klubga qo'shiling</h2>
          <ul className="auth__perks">
            {[
              "Yangi kolleksiyalarga erta kirish",
              "Tug'ilgan kun uchun shaxsiy chegirma",
              "Buyurtmalarni bir joyda kuzatish",
              "Bepul o'lchov olish xizmati",
            ].map((t) => (
              <li key={t}>
                <Check size={14} weight="bold" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="auth__panel">
        <div className="auth__inner">
          <RevealText as="h1" text="Ro'yxatdan o'tish" className="display-md" />
          <Reveal variant="up" delay={100}>
            <p className="muted auth__sub">
              Hisobingiz bormi? <Link to="/kirish">Kirish</Link>
            </p>
          </Reveal>

          <form className="auth__form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="rg-name">To'liq ism</label>
              <input id="rg-name" value={form.name} onChange={set("name")} placeholder="Ism Familiya" />
              {errors.name && <span className="field__err">{errors.name}</span>}
            </div>

            <div className="auth__two">
              <div className="field">
                <label htmlFor="rg-mail">E-mail</label>
                <input id="rg-mail" type="email" value={form.email} onChange={set("email")} placeholder="sizning@email.uz" />
                {errors.email && <span className="field__err">{errors.email}</span>}
              </div>
              <div className="field">
                <label htmlFor="rg-phone">Telefon</label>
                <input id="rg-phone" value={form.phone} onChange={set("phone")} placeholder="+998 90 123 45 67" />
                {errors.phone && <span className="field__err">{errors.phone}</span>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="rg-pass">Parol</label>
              <input id="rg-pass" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
              {form.password && (
                <div className="auth__strength">
                  <div className="auth__strengthbars">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className={i < strength ? `is-on lvl-${strength}` : ""} />
                    ))}
                  </div>
                  <span className="muted">{LABELS[strength]}</span>
                </div>
              )}
              {errors.password && <span className="field__err">{errors.password}</span>}
            </div>

            <div className="field">
              <label htmlFor="rg-conf">Parolni tasdiqlang</label>
              <input id="rg-conf" type="password" value={form.confirm} onChange={set("confirm")} placeholder="••••••••" />
              {errors.confirm && <span className="field__err">{errors.confirm}</span>}
            </div>

            <label className="check auth__agree">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span className="check__box" />
              <span className="check__label">
                Foydalanish shartlari va maxfiylik siyosatiga roziman
              </span>
            </label>
            {errors.agree && <span className="field__err">{errors.agree}</span>}

            <button className="btn btn--accent auth__submit" type="submit">
              Hisob yaratish <ArrowRight size={16} weight="bold" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
