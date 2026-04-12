const API_BASE_URL = window.WEARSHOP_API_URL || "http://localhost:5000/api";

const state = {
  products: [],
  filtered: [],
  categories: [],
  page: 1,
  limit: 8,
  cart: JSON.parse(localStorage.getItem("wearshop-cart") || "[]"),
  token: localStorage.getItem("wearshop-token") || "",
  user: JSON.parse(localStorage.getItem("wearshop-user") || "null"),
};

const el = {
  productsGrid: document.getElementById("productsGrid"),
  searchInput: document.getElementById("searchInput"),
  categorySelect: document.getElementById("categorySelect"),
  sortSelect: document.getElementById("sortSelect"),
  minPriceInput: document.getElementById("minPriceInput"),
  maxPriceInput: document.getElementById("maxPriceInput"),
  filterBtn: document.getElementById("filterBtn"),
  statusBar: document.getElementById("statusBar"),
  pageInfo: document.getElementById("pageInfo"),
  prevPageBtn: document.getElementById("prevPageBtn"),
  nextPageBtn: document.getElementById("nextPageBtn"),
  cartBtn: document.getElementById("cartBtn"),
  closeCartBtn: document.getElementById("closeCartBtn"),
  cartDrawer: document.getElementById("cartDrawer"),
  cartItems: document.getElementById("cartItems"),
  cartTotal: document.getElementById("cartTotal"),
  cartCount: document.getElementById("cartCount"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  checkoutDialog: document.getElementById("checkoutDialog"),
  closeCheckoutBtn: document.getElementById("closeCheckoutBtn"),
  confirmOrderBtn: document.getElementById("confirmOrderBtn"),
  customerName: document.getElementById("customerName"),
  customerPhone: document.getElementById("customerPhone"),
  customerAddress: document.getElementById("customerAddress"),
  customerNote: document.getElementById("customerNote"),
  loginBtn: document.getElementById("loginBtn"),
  authDialog: document.getElementById("authDialog"),
  closeAuthBtn: document.getElementById("closeAuthBtn"),
  registerBtn: document.getElementById("registerBtn"),
  loginSubmitBtn: document.getElementById("loginSubmitBtn"),
  authName: document.getElementById("authName"),
  authEmail: document.getElementById("authEmail"),
  authPassword: document.getElementById("authPassword"),
  toast: document.getElementById("toast"),
  scrollDealsBtn: document.getElementById("scrollDealsBtn"),
};

const formatUZS = (num) => new Intl.NumberFormat("uz-UZ").format(num) + " so'm";

function toast(message, isError = false) {
  el.toast.textContent = message;
  el.toast.style.borderColor = isError ? "#663149" : "#2b4d77";
  el.toast.classList.add("show");
  setTimeout(() => el.toast.classList.remove("show"), 2400);
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || "Xatolik yuz berdi";
    throw new Error(message);
  }

  return data;
}

function updateAuthUi() {
  if (state.user) {
    el.loginBtn.textContent = state.user.name ? `${state.user.name}` : "Profil";
  } else {
    el.loginBtn.textContent = "Kirish";
  }
}

function saveCart() {
  localStorage.setItem("wearshop-cart", JSON.stringify(state.cart));
}

function saveAuth() {
  localStorage.setItem("wearshop-token", state.token || "");
  localStorage.setItem("wearshop-user", JSON.stringify(state.user));
}

function buildCategories() {
  const all = ["all", ...state.categories];
  el.categorySelect.innerHTML = all
    .map((c) => `<option value="${c}">${c === "all" ? "Barcha kategoriyalar" : c}</option>`)
    .join("");
}

function applyFilters() {
  const q = el.searchInput.value.trim().toLowerCase();
  const category = el.categorySelect.value;
  const minPrice = Number(el.minPriceInput.value || 0);
  const maxPrice = Number(el.maxPriceInput.value || Number.MAX_SAFE_INTEGER);
  const sort = el.sortSelect.value;

  const filtered = state.products.filter((p) => {
    const inSearch = p.name.toLowerCase().includes(q);
    const inCategory = category === "all" ? true : p.category === category;
    const inPrice = p.price >= minPrice && p.price <= maxPrice;
    return inSearch && inCategory && inPrice;
  });

  if (sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") filtered.sort((a, b) => b.price - a.price);
  if (sort === "rating_desc") filtered.sort((a, b) => b.rating - a.rating);

  state.filtered = filtered;
  state.page = 1;
  renderProducts();
}

function getPagedData() {
  const start = (state.page - 1) * state.limit;
  const end = start + state.limit;
  return state.filtered.slice(start, end);
}

function productCard(product) {
  return `
    <article class="product-card">
      <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
      <div class="product-body">
        <div class="product-top">
          <strong>${product.name}</strong>
          <span class="badge">${product.category}</span>
        </div>
        <div class="rating">★ ${product.rating.toFixed(1)}</div>
        <p class="muted">${product.description}</p>
        <div class="product-top">
          <span class="price">${formatUZS(product.price)}</span>
          <button class="btn btn-primary" data-add="${product.id}">Savatga</button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.limit));
  if (state.page > totalPages) state.page = totalPages;

  const paged = getPagedData();
  el.productsGrid.innerHTML = paged.map(productCard).join("");

  el.statusBar.textContent = `${state.filtered.length} ta mahsulot topildi`;
  el.pageInfo.textContent = `${state.page} / ${totalPages}`;
  el.prevPageBtn.disabled = state.page <= 1;
  el.nextPageBtn.disabled = state.page >= totalPages;
}

function cartItemTemplate(item) {
  return `
    <div class="cart-item">
      <div>
        <p><strong>${item.name}</strong></p>
        <p class="muted">${formatUZS(item.price)} x ${item.qty}</p>
      </div>
      <div class="item-actions">
        <button class="small-btn" data-dec="${item.id}">-</button>
        <button class="small-btn" data-inc="${item.id}">+</button>
        <button class="small-btn remove-btn" data-remove="${item.id}">✕</button>
      </div>
    </div>
  `;
}

function renderCart() {
  const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);

  el.cartItems.innerHTML = state.cart.length
    ? state.cart.map(cartItemTemplate).join("")
    : "<p class='muted'>Savat bo'sh.</p>";

  el.cartTotal.textContent = formatUZS(total);
  el.cartCount.textContent = String(count);

  saveCart();
}

function addToCart(productId) {
  const product = state.products.find((p) => p.id === productId);
  if (!product) return;

  const existing = state.cart.find((i) => i.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    });
  }

  renderCart();
  toast(`${product.name} savatga qo'shildi`);
}

function cartMutate(productId, type) {
  const item = state.cart.find((i) => i.id === productId);
  if (!item) return;

  if (type === "inc") item.qty += 1;
  if (type === "dec") item.qty -= 1;
  if (type === "remove" || item.qty <= 0) {
    state.cart = state.cart.filter((i) => i.id !== productId);
  }

  renderCart();
}

async function loadProducts() {
  const data = await request("/products");
  state.products = data.products;
  state.filtered = [...data.products];
  state.categories = [...new Set(data.products.map((p) => p.category))];
  buildCategories();
  renderProducts();
}

async function register() {
  const name = el.authName.value.trim();
  const email = el.authEmail.value.trim();
  const password = el.authPassword.value;

  if (!name) {
    toast("Ro'yxatdan o'tish uchun ism kiriting", true);
    return;
  }

  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  state.token = data.token;
  state.user = data.user;
  saveAuth();
  updateAuthUi();
  el.authDialog.close();
  toast("Muvaffaqiyatli ro'yxatdan o'tdingiz");
}

async function login() {
  const email = el.authEmail.value.trim();
  const password = el.authPassword.value;

  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  state.token = data.token;
  state.user = data.user;
  saveAuth();
  updateAuthUi();
  el.authDialog.close();
  toast("Xush kelibsiz!");
}

function normalizeCartForOrder() {
  return state.cart.map((item) => ({ productId: item.id, quantity: item.qty }));
}

async function placeOrder() {
  if (!state.user || !state.token) {
    toast("Buyurtma uchun avval tizimga kiring", true);
    el.checkoutDialog.close();
    el.authDialog.showModal();
    return;
  }

  if (!state.cart.length) {
    toast("Savat bo'sh", true);
    return;
  }

  const shipping = {
    fullName: el.customerName.value.trim(),
    phone: el.customerPhone.value.trim(),
    address: el.customerAddress.value.trim(),
    note: el.customerNote.value.trim(),
  };

  if (!shipping.fullName || !shipping.phone || !shipping.address) {
    toast("Yetkazib berish ma'lumotlarini to'liq kiriting", true);
    return;
  }

  const data = await request("/orders", {
    method: "POST",
    body: JSON.stringify({
      items: normalizeCartForOrder(),
      shipping,
    }),
  });

  state.cart = [];
  renderCart();
  el.checkoutDialog.close();
  el.cartDrawer.classList.remove("open");
  toast(`Buyurtma qabul qilindi. ID: ${data.order.id}`);
}

function bindEvents() {
  el.filterBtn.addEventListener("click", applyFilters);
  el.searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyFilters();
  });

  el.prevPageBtn.addEventListener("click", () => {
    state.page = Math.max(1, state.page - 1);
    renderProducts();
  });

  el.nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.limit));
    state.page = Math.min(totalPages, state.page + 1);
    renderProducts();
  });

  el.productsGrid.addEventListener("click", (e) => {
    const button = e.target.closest("[data-add]");
    if (!button) return;
    addToCart(button.dataset.add);
  });

  el.cartBtn.addEventListener("click", () => el.cartDrawer.classList.add("open"));
  el.closeCartBtn.addEventListener("click", () => el.cartDrawer.classList.remove("open"));
  el.cartDrawer.addEventListener("click", (e) => {
    if (e.target === el.cartDrawer) el.cartDrawer.classList.remove("open");
  });

  el.cartItems.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    const remove = e.target.closest("[data-remove]");

    if (inc) cartMutate(inc.dataset.inc, "inc");
    if (dec) cartMutate(dec.dataset.dec, "dec");
    if (remove) cartMutate(remove.dataset.remove, "remove");
  });

  el.checkoutBtn.addEventListener("click", () => {
    if (!state.cart.length) {
      toast("Savat bo'sh", true);
      return;
    }
    el.checkoutDialog.showModal();
  });

  el.closeCheckoutBtn.addEventListener("click", () => el.checkoutDialog.close());
  el.confirmOrderBtn.addEventListener("click", async () => {
    try {
      await placeOrder();
    } catch (error) {
      toast(error.message, true);
    }
  });

  el.loginBtn.addEventListener("click", () => {
    if (state.user) {
      state.user = null;
      state.token = "";
      saveAuth();
      updateAuthUi();
      toast("Tizimdan chiqdingiz");
      return;
    }
    el.authDialog.showModal();
  });

  el.closeAuthBtn.addEventListener("click", () => el.authDialog.close());

  el.registerBtn.addEventListener("click", async () => {
    try {
      await register();
    } catch (error) {
      toast(error.message, true);
    }
  });

  el.loginSubmitBtn.addEventListener("click", async () => {
    try {
      await login();
    } catch (error) {
      toast(error.message, true);
    }
  });

  el.scrollDealsBtn.addEventListener("click", () => {
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    el.sortSelect.value = "price_desc";
    applyFilters();
  });
}

async function init() {
  bindEvents();
  renderCart();
  updateAuthUi();
  try {
    await loadProducts();
  } catch (error) {
    el.statusBar.textContent = error.message;
    toast("Backendga ulanib bo'lmadi. Backend serverni ishga tushiring.", true);
  }
}

init();
