function formatUZS(value) {
  return `${new Intl.NumberFormat("uz-UZ").format(value)} so'm`;
}

function setTheme(theme) {
  window.WEARSHOP_STATE.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  const icon = document.getElementById("themeIcon");
  if (icon) icon.className = theme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
  window.WEARSHOP_STATE.save();
}

function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.style.borderColor = isError ? "#dc336b" : "#5e72ff";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

function headerTemplate() {
  const current = window.location.pathname.replaceAll("\\", "/").toLowerCase();
  let active = "home";
  if (current.includes("/pages/shop/")) active = "shop";
  else if (current.includes("/pages/lookbook/")) active = "lookbook";
  else if (current.includes("/pages/wishlist/")) active = "wishlist";
  else if (current.includes("/pages/contact/")) active = "contact";
  else if (current.includes("/pages/checkout/")) active = "checkout";
  else if (current.includes("/pages/profile/")) active = "profile";
  else if (current.includes("/pages/product/")) active = "shop";
  const isActive = (key) => (active === key ? "class='active'" : "");
  const root = current.includes("/frontend/pages/") ? "../.." : ".";
  const isAuthed = Boolean(window.WEARSHOP_STATE.user && window.WEARSHOP_STATE.token);

  return `
    <div class="container nav">
      <a class="logo" href="${root}/index.html"><i class="fa-solid fa-gem"></i> WearShop</a>
      <nav class="nav-links">
        <a ${isActive("home")} href="${root}/index.html">Home</a>
        <a ${isActive("shop")} href="${root}/pages/shop/index.html">Shop</a>
        <a ${isActive("lookbook")} href="${root}/pages/lookbook/index.html">Lookbook</a>
        <a ${isActive("wishlist")} href="${root}/pages/wishlist/index.html">Wishlist</a>
        <a ${isActive("contact")} href="${root}/pages/contact/index.html">Contact</a>
      </nav>
      <div class="nav-actions">
        <button id="themeToggleBtn" class="icon-btn"><i id="themeIcon" class="fa-solid fa-moon"></i></button>
        <a class="btn btn-soft" href="${root}/pages/wishlist/index.html"><i class="fa-solid fa-heart"></i> <span id="wishCount">0</span></a>
        <a class="btn btn-primary" href="${root}/pages/checkout/index.html"><i class="fa-solid fa-cart-shopping"></i> <span id="cartCount">0</span></a>
        ${
          isAuthed
            ? `<a class="btn ${active === "profile" ? "btn-primary" : "btn-soft"}" href="${root}/pages/profile/index.html"><i class="fa-solid fa-user"></i> Profil</a>`
            : `<button id="openAuthModalBtn" class="btn btn-soft"><i class="fa-solid fa-right-to-bracket"></i> Kirish</button>`
        }
      </div>
    </div>
  `;
}

function footerTemplate() {
  return `
    <div class="container footer-grid">
      <p><strong>WearShop Premium</strong> © 2026</p>
      <p>premium@wearshop.uz • +998 90 123 45 67</p>
    </div>
  `;
}

function authModalTemplate() {
  return `
    <dialog id="authModal" class="dialog auth-dialog">
      <div class="dialog-content glass-strong auth-dialog-content">
        <div class="auth-modal-head">
          <h3><i class="fa-solid fa-user-lock"></i> Hisobga kirish</h3>
          <button id="closeAuthModalBtn" class="icon-btn" aria-label="Yopish"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="auth-tabs">
          <button id="authTabLogin" class="chip active">Kirish</button>
          <button id="authTabRegister" class="chip">Ro'yxatdan o'tish</button>
        </div>

        <div id="authLoginPane" class="auth-pane">
          <div class="auth-pane-grid">
            <input id="authLoginEmail" type="email" placeholder="Email" />
            <input id="authLoginPassword" type="password" placeholder="Parol" />
          </div>
          <div class="auth-pane-actions">
            <button id="authLoginSubmit" class="btn btn-primary"><i class="fa-solid fa-right-to-bracket"></i> Kirish</button>
          </div>
        </div>

        <div id="authRegisterPane" class="auth-pane" style="display:none">
          <div class="auth-pane-grid">
            <input id="authRegisterName" type="text" placeholder="Ism" />
            <input id="authRegisterEmail" type="email" placeholder="Email" />
            <input id="authRegisterPhone" type="text" placeholder="Telefon" />
            <input id="authRegisterCity" type="text" placeholder="Shahar" />
            <select id="authRegisterGender">
              <option value="">Jinsni tanlang</option>
              <option value="Erkak">Erkak</option>
              <option value="Ayol">Ayol</option>
            </select>
            <input id="authRegisterAddress" type="text" placeholder="Manzil (ixtiyoriy)" />
            <input id="authRegisterPassword" type="password" placeholder="Parol (kamida 6 belgi)" />
          </div>
          <div class="auth-pane-actions">
            <button id="authRegisterSubmit" class="btn btn-primary"><i class="fa-solid fa-user-plus"></i> Ro'yxatdan o'tish</button>
          </div>
        </div>
      </div>
    </dialog>
  `;
}

function mountAuthModal() {
  if (document.getElementById("authModal")) return;
  document.body.insertAdjacentHTML("beforeend", authModalTemplate());
}

function mountLayout() {
  const header = document.getElementById("siteHeader");
  if (header) header.innerHTML = headerTemplate();

  const footer = document.getElementById("siteFooter");
  if (footer) footer.innerHTML = footerTemplate();

  setTheme(window.WEARSHOP_STATE.theme);

  const cartCount = document.getElementById("cartCount");
  const wishCount = document.getElementById("wishCount");
  const cartQty = window.WEARSHOP_STATE.cart.reduce((s, i) => s + (i.qty || 1), 0);
  if (cartCount) cartCount.textContent = String(cartQty);
  if (wishCount) wishCount.textContent = String(window.WEARSHOP_STATE.wishlist.length);

  const toggle = document.getElementById("themeToggleBtn");
  if (toggle) {
    toggle.onclick = () => {
      const next = window.WEARSHOP_STATE.theme === "dark" ? "light" : "dark";
      setTheme(next);
    };
  }

  mountAuthModal();

  const authModal = document.getElementById("authModal");
  const openAuthModalBtn = document.getElementById("openAuthModalBtn");
  const closeAuthModalBtn = document.getElementById("closeAuthModalBtn");
  const authTabLogin = document.getElementById("authTabLogin");
  const authTabRegister = document.getElementById("authTabRegister");
  const authLoginPane = document.getElementById("authLoginPane");
  const authRegisterPane = document.getElementById("authRegisterPane");
  const authLoginSubmit = document.getElementById("authLoginSubmit");
  const authRegisterSubmit = document.getElementById("authRegisterSubmit");

  function activateTab(mode) {
    if (!authTabLogin || !authTabRegister || !authLoginPane || !authRegisterPane) return;
    const isLogin = mode === "login";
    authTabLogin.classList.toggle("active", isLogin);
    authTabRegister.classList.toggle("active", !isLogin);
    authLoginPane.style.display = isLogin ? "block" : "none";
    authRegisterPane.style.display = isLogin ? "none" : "block";
  }

  if (authTabLogin) authTabLogin.onclick = () => activateTab("login");
  if (authTabRegister) authTabRegister.onclick = () => activateTab("register");

  if (openAuthModalBtn && authModal) {
    openAuthModalBtn.onclick = () => {
      activateTab("login");
      authModal.showModal();
    };
  }

  if (closeAuthModalBtn && authModal) {
    closeAuthModalBtn.onclick = () => authModal.close();
  }

  if (authModal) {
    authModal.onclick = (event) => {
      if (event.target === authModal) authModal.close();
    };
  }

  if (authLoginSubmit) {
    authLoginSubmit.onclick = async () => {
      const email = document.getElementById("authLoginEmail");
      const password = document.getElementById("authLoginPassword");
      if (!email?.value.trim() || !password?.value.trim()) {
        showToast("Email va parolni kiriting", true);
        return;
      }
      try {
        const data = await window.WEARSHOP_API.request("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: email.value.trim(), password: password.value.trim() }),
        });
        window.WEARSHOP_STATE.token = data.token;
        window.WEARSHOP_STATE.user = data.user;
        window.WEARSHOP_STATE.save();
        if (authModal) authModal.close();
        showToast("Muvaffaqiyatli kirildi");
        mountLayout();
      } catch (error) {
        showToast(error.message, true);
      }
    };
  }

  if (authRegisterSubmit) {
    authRegisterSubmit.onclick = async () => {
      const name = document.getElementById("authRegisterName");
      const email = document.getElementById("authRegisterEmail");
      const phone = document.getElementById("authRegisterPhone");
      const city = document.getElementById("authRegisterCity");
      const gender = document.getElementById("authRegisterGender");
      const address = document.getElementById("authRegisterAddress");
      const password = document.getElementById("authRegisterPassword");
      if (!name?.value.trim() || !email?.value.trim() || !phone?.value.trim() || !city?.value.trim() || !gender?.value.trim() || !password?.value.trim()) {
        showToast("Barcha maydonlarni to'ldiring", true);
        return;
      }
      if (password.value.trim().length < 6) {
        showToast("Parol kamida 6 belgi bo'lishi kerak", true);
        return;
      }
      try {
        const data = await window.WEARSHOP_API.request("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: name.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            city: city.value.trim(),
            gender: gender.value.trim(),
            address: address?.value.trim() || "",
            password: password.value.trim(),
          }),
        });
        window.WEARSHOP_STATE.token = data.token;
        window.WEARSHOP_STATE.user = data.user;
        window.WEARSHOP_STATE.save();
        if (authModal) authModal.close();
        showToast("Hisob yaratildi");
        mountLayout();
      } catch (error) {
        showToast(error.message, true);
      }
    };
  }
}

window.WEARSHOP_UI = { formatUZS, setTheme, showToast, mountLayout };
