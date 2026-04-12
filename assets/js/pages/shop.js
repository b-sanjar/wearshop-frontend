(async function initShop() {
  window.WEARSHOP_UI.mountLayout();

  const state = {
    products: [],
    filtered: [],
    page: 1,
    limit: 8,
    categories: [],
    quick: "none",
  };

  const el = {
    productsGrid: document.getElementById("productsGrid"),
    searchInput: document.getElementById("searchInput"),
    categorySelect: document.getElementById("categorySelect"),
    sortSelect: document.getElementById("sortSelect"),
    minPriceInput: document.getElementById("minPriceInput"),
    maxPriceInput: document.getElementById("maxPriceInput"),
    applyFilterBtn: document.getElementById("applyFilterBtn"),
    statusBar: document.getElementById("statusBar"),
    prevBtn: document.getElementById("prevBtn"),
    nextBtn: document.getElementById("nextBtn"),
    pageInfo: document.getElementById("pageInfo"),
    viewModeBtn: document.getElementById("viewModeBtn"),
    quickPreset: document.getElementById("quickPreset"),
    viewPreset: document.getElementById("viewPreset"),
    quickFilters: document.querySelectorAll(".quick-filter"),
    shopStatAll: document.getElementById("shopStatAll"),
    shopStatCategories: document.getElementById("shopStatCategories"),
    shopStatDiscount: document.getElementById("shopStatDiscount"),
    shopStatNew: document.getElementById("shopStatNew"),
    toast: document.getElementById("toast"),
  };

  function getEffectivePrice(p) {
    return p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
  }

  function buildCategories() {
    const all = ["all", ...state.categories];
    el.categorySelect.innerHTML = all
      .map((c) => `<option value="${c}">${c === "all" ? "Barcha kategoriyalar" : c}</option>`)
      .join("");
  }

  function applyQuick(items) {
    if (state.quick === "best") return items.filter((p) => p.tags?.includes("best-seller"));
    if (state.quick === "new") return items.filter((p) => p.tags?.includes("new"));
    if (state.quick === "discount") return items.filter((p) => (p.discount || 0) > 0);
    if (state.quick === "rating") return items.filter((p) => p.rating >= 4.7);
    if (state.quick === "premium") return items.filter((p) => p.tags?.includes("premium"));
    return items;
  }

  function applyFilters() {
    const q = el.searchInput.value.trim().toLowerCase();
    const cat = el.categorySelect.value;
    const sort = el.sortSelect.value;
    const min = Number(el.minPriceInput.value || 0);
    const max = Number(el.maxPriceInput.value || Number.MAX_SAFE_INTEGER);

    let data = state.products.filter((p) => {
      const inSearch = p.name.toLowerCase().includes(q);
      const inCat = cat === "all" ? true : p.category === cat;
      const inPrice = getEffectivePrice(p) >= min && getEffectivePrice(p) <= max;
      return inSearch && inCat && inPrice;
    });

    data = applyQuick(data);

    if (sort === "price_asc") data.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    if (sort === "price_desc") data.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    if (sort === "rating_desc") data.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") data.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    if (sort === "popular") data.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    state.filtered = data;
    state.page = 1;
    renderProducts();
  }

  function getPageData() {
    const start = (state.page - 1) * state.limit;
    return state.filtered.slice(start, start + state.limit);
  }

  function addToCart(productId) {
    const product = state.products.find((p) => p.id === productId);
    if (!product) return;
    const item = window.WEARSHOP_STATE.cart.find((i) => i.id === productId);
    if (item) item.qty += 1;
    else window.WEARSHOP_STATE.cart.push({ ...product, qty: 1 });
    window.WEARSHOP_STATE.save();
    window.WEARSHOP_UI.showToast("Savatga qo'shildi");
  }

  function toggleWish(productId) {
    const product = state.products.find((p) => p.id === productId);
    if (!product) return;
    const exists = window.WEARSHOP_STATE.wishlist.some((i) => i.id === productId);
    if (exists) {
      window.WEARSHOP_STATE.wishlist = window.WEARSHOP_STATE.wishlist.filter((i) => i.id !== productId);
    } else {
      window.WEARSHOP_STATE.wishlist.push(product);
    }
    window.WEARSHOP_STATE.save();
    renderProducts();
  }

  function isWish(id) {
    return window.WEARSHOP_STATE.wishlist.some((i) => i.id === id);
  }

  function productCard(p) {
    const price = getEffectivePrice(p);
    return `
      <article class="product-card">
        <div class="product-image-wrap">
          <img class="product-image" src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1445205170230-053b83016050?w=900';" />
          <div class="product-overlay">
            <span class="badge">${p.category}</span>
            ${p.discount ? `<span class="discount">-${p.discount}%</span>` : ""}
          </div>
        </div>
        <div class="product-body">
          <h3 class="product-title">${p.name}</h3>
          <div class="row"><span class="rating">★ ${p.rating.toFixed(1)}</span><span class="muted">${p.stock} stock</span></div>
          <p class="muted">${p.description}</p>
          <div class="row">
            <div>
              <div class="price">${window.WEARSHOP_UI.formatUZS(price)}</div>
              ${p.discount ? `<small class="muted"><s>${window.WEARSHOP_UI.formatUZS(p.price)}</s></small>` : ""}
            </div>
            <div class="actions">
              <button class="small-btn" data-wish="${p.id}">${isWish(p.id) ? "♥" : "♡"}</button>
              <button class="small-btn primary" data-add="${p.id}"><i class="fa-solid fa-cart-plus"></i></button>
              <a class="small-btn" href="../product/index.html?id=${p.id}"><i class="fa-solid fa-eye"></i></a>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.limit));
    if (state.page > totalPages) state.page = totalPages;
    const pageItems = getPageData();
    el.productsGrid.innerHTML = pageItems.map(productCard).join("");
    el.statusBar.textContent = `${state.filtered.length} ta mahsulot topildi`;
    el.pageInfo.textContent = `${state.page} / ${totalPages}`;
    el.prevBtn.disabled = state.page <= 1;
    el.nextBtn.disabled = state.page >= totalPages;
  }

  function renderShopStats() {
    if (el.shopStatAll) el.shopStatAll.textContent = String(state.products.length);
    if (el.shopStatCategories) el.shopStatCategories.textContent = String(state.categories.length);
    if (el.shopStatDiscount) el.shopStatDiscount.textContent = String(state.products.filter((p) => (p.discount || 0) > 0).length);
    if (el.shopStatNew) el.shopStatNew.textContent = String(state.products.filter((p) => p.isNew).length);
  }

  el.applyFilterBtn.addEventListener("click", applyFilters);
  el.searchInput.addEventListener("keydown", (e) => e.key === "Enter" && applyFilters());
  el.prevBtn.addEventListener("click", () => {
    state.page = Math.max(1, state.page - 1);
    renderProducts();
  });
  el.nextBtn.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.limit));
    state.page = Math.min(totalPages, state.page + 1);
    renderProducts();
  });

  el.productsGrid.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    const wish = e.target.closest("[data-wish]");
    if (add) addToCart(add.dataset.add);
    if (wish) toggleWish(wish.dataset.wish);
  });

  el.quickFilters.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.quick = state.quick === btn.dataset.quick ? "none" : btn.dataset.quick;
      el.quickFilters.forEach((b) => b.classList.remove("active"));
      if (state.quick !== "none") btn.classList.add("active");
      applyFilters();
    });
  });

  if (el.quickPreset) {
    el.quickPreset.addEventListener("change", () => {
      state.quick = el.quickPreset.value;
      el.quickFilters.forEach((b) => {
        b.classList.toggle("active", b.dataset.quick === state.quick && state.quick !== "none");
      });
      applyFilters();
    });
  }

  if (el.viewPreset) {
    el.viewPreset.addEventListener("change", () => {
      if (el.viewPreset.value === "compact") {
        el.productsGrid.classList.add("compact");
      } else {
        el.productsGrid.classList.remove("compact");
      }
    });
  }

  el.viewModeBtn.addEventListener("click", () => {
    if (window.WEARSHOP_STATE.viewMode === "grid") {
      window.WEARSHOP_STATE.viewMode = "list";
      el.productsGrid.classList.add("list");
      el.viewModeBtn.innerHTML = `<i class="fa-solid fa-table-cells-large"></i> Grid mode`;
    } else {
      window.WEARSHOP_STATE.viewMode = "grid";
      el.productsGrid.classList.remove("list");
      el.viewModeBtn.innerHTML = `<i class="fa-solid fa-list"></i> List mode`;
    }
    window.WEARSHOP_STATE.save();
  });

  try {
    const data = await window.WEARSHOP_API.request("/products");
    state.products = data.products || [];
    state.filtered = [...state.products];
    state.categories = [...new Set(state.products.map((p) => p.category))];
    buildCategories();
    renderShopStats();
    if (el.quickPreset) el.quickPreset.value = "none";
    if (el.viewPreset) el.viewPreset.value = "modern";
    if (window.WEARSHOP_STATE.viewMode === "list") {
      el.productsGrid.classList.add("list");
      el.viewModeBtn.innerHTML = `<i class="fa-solid fa-table-cells-large"></i> Grid mode`;
    }
    renderProducts();
  } catch (error) {
    window.WEARSHOP_UI.showToast(error.message, true);
  }
})();
