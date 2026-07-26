import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeSlash } from "@phosphor-icons/react";
import { useAuth } from "../store/useAuth";
import { useUI } from "../store/useUI";
import { RevealText, Reveal } from "../components/ui/Reveal";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const toast = useUI((s) => s.toast);
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setErr("To'g'ri e-mail manzilini kiriting");
      return;
    }
    const r = login(form.email, form.password);
    if (!r.ok) {
      setErr(r.message);
      return;
    }
    toast(r.message, "ok");
    navigate("/kabinet");
  };

  return (
    <div className="auth" data-sec="sapphire">
      <div className="auth__media img-frame">
        <img
          src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=1400&auto=format&fit=crop"
          alt=""
        />
        <div className="auth__mediatext">
          <span className="eyebrow">WEARSHOP</span>
          <h2 className="display-md">Xush kelibsiz</h2>
          <p>Buyurtmalar tarixi, saqlangan manzillar va sevimlilar — barchasi bitta joyda.</p>
        </div>
      </div>

      <div className="auth__panel">
        <div className="auth__inner">
          <RevealText as="h1" text="Hisobga kirish" className="display-md" />
          <Reveal variant="up" delay={100}>
            <p className="muted auth__sub">
              Hisobingiz yo'qmi? <Link to="/royxatdan-otish">Ro'yxatdan o'ting</Link>
            </p>
          </Reveal>

          <form className="auth__form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="lg-mail">E-mail</label>
              <input
                id="lg-mail"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setErr("");
                }}
                placeholder="sizning@email.uz"
              />
            </div>

            <div className="field">
              <label htmlFor="lg-pass">Parol</label>
              <div className="auth__passwrap">
                <input
                  id="lg-pass"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setErr("");
                  }}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShow(!show)} aria-label="Parolni ko'rsatish">
                  {show ? <EyeSlash size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {err && <p className="auth__err">{err}</p>}

            <div className="auth__row">
              <label className="check">
                <input type="checkbox" defaultChecked />
                <span className="check__box" />
                <span className="check__label">Meni eslab qol</span>
              </label>
              <button
                type="button"
                className="auth__forgot"
                onClick={() => toast("Parolni tiklash havolasi e-mailingizga yuborildi", "info")}
              >
                Parolni unutdingizmi?
              </button>
            </div>

            <button className="btn btn--accent auth__submit" type="submit">
              Kirish <ArrowRight size={16} weight="bold" />
            </button>
          </form>

          <p className="auth__hint muted">
            Bu demo versiya: hisob ma'lumotlari faqat brauzeringizda saqlanadi. Avval ro'yxatdan
            o'ting, so'ng shu ma'lumotlar bilan kiring.
          </p>
        </div>
      </div>
    </div>
  );
}
