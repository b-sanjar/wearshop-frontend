(function initWishlist() {
  window.WEARSHOP_UI.mountLayout();

  const grid = document.getElementById("wishlistGrid");
  const kpiCount = document.getElementById("kpiCount");
  const kpiValue = document.getElementById("kpiValue");
  const kpiDiscount = document.getElementById("kpiDiscount");
  const kpiTop = document.getElementById("kpiTop");
  const trendList = document.getElementById("trendList");
  const DEMO_WISHLIST_KEY = "wearshop-demo-wishlist-seeded";

  function effectivePrice(p) {
    return p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
  }

  function render() {
    const items = window.WEARSHOP_STATE.wishlist;

    const totalValue = items.reduce((sum, p) => sum + effectivePrice(p), 0);
    const avgDiscount = items.length
      ? Math.round(items.reduce((sum, p) => sum + (p.discount || 0), 0) / items.length)
      : 0;
    const categoryCounter = {};
    items.forEach((p) => {
      categoryCounter[p.category] = (categoryCounter[p.category] || 0) + 1;
    });
    const topCategory = Object.entries(categoryCounter).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    if (kpiCount) kpiCount.textContent = String(items.length);
    if (kpiValue) kpiValue.textContent = window.WEARSHOP_UI.formatUZS(totalValue);
    if (kpiDiscount) kpiDiscount.textContent = `${avgDiscount}%`;
    if (kpiTop) kpiTop.textContent = topCategory;

    if (trendList) {
      if (!items.length) {
        trendList.innerHTML = "<p class='muted'>Trend ma'lumotlari wishlist to'ldirilgandan so'ng chiqadi.</p>";
      } else {
        trendList.innerHTML = `
          <div class="trend-item"><span>High value items</span><strong>${items.filter((p) => effectivePrice(p) > 300000).length}</strong></div>
          <div class="trend-item"><span>Discount picks</span><strong>${items.filter((p) => (p.discount || 0) > 0).length}</strong></div>
          <div class="trend-item"><span>Top rated</span><strong>${items.filter((p) => p.rating >= 4.7).length}</strong></div>
        `;
      }
    }

    if (!items.length) {
      grid.innerHTML = `
        <article class="wish-empty">
          <i class="fa-solid fa-heart-crack"></i>
          <h3>Wishlist hali bo'sh</h3>
          <p class="muted">Yoqtirgan mahsulotlarni saqlang va bu yerda smart insights ko'ring.</p>
          <a class="btn btn-primary" href="../shop/index.html"><i class="fa-solid fa-store"></i> Shopga o'tish</a>
        </article>
      `;
      return;
    }

    grid.innerHTML = items
      .map(
        (p) => `
      <article class="wish-card">
        <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=900';" />
        <div class="wish-body">
          <strong>${p.name}</strong>
          <div class="wish-meta">
            <span class="muted">${window.WEARSHOP_UI.formatUZS(effectivePrice(p))}</span>
            <span class="pill">${p.category}</span>
          </div>
          <div class="wish-actions">
            <button class="btn btn-primary add-btn" data-id="${p.id}"><i class="fa-solid fa-cart-plus"></i> Savatga</button>
            <button class="btn btn-soft remove-btn" data-id="${p.id}"><i class="fa-solid fa-trash"></i> O'chirish</button>
            <a class="btn btn-soft" href="../product/index.html?id=${p.id}"><i class="fa-solid fa-eye"></i> Ko'rish</a>
          </div>
        </div>
      </article>
    `
      )
      .join("");
  }

  async function seedWishlistIfEmpty() {
    if (window.WEARSHOP_STATE.wishlist.length) return;
    if (localStorage.getItem(DEMO_WISHLIST_KEY) === "1") return;
    try {
      const data = await window.WEARSHOP_API.request("/products");
      const picks = (data.products || []).slice(0, 4);
      if (picks.length) {
        window.WEARSHOP_STATE.wishlist = picks;
        window.WEARSHOP_STATE.save();
      }
      localStorage.setItem(DEMO_WISHLIST_KEY, "1");
    } catch (_) {
      // ignore demo seed errors
    }
  }

  grid.addEventListener("click", (e) => {
    const add = e.target.closest(".add-btn");
    const remove = e.target.closest(".remove-btn");
    if (add) {
      const product = window.WEARSHOP_STATE.wishlist.find((i) => i.id === add.dataset.id);
      if (product) {
        const cart = window.WEARSHOP_STATE.cart.find((i) => i.id === product.id);
        if (cart) cart.qty += 1;
        else window.WEARSHOP_STATE.cart.push({ ...product, qty: 1 });
        window.WEARSHOP_STATE.save();
        window.WEARSHOP_UI.showToast("Savatga qo'shildi");
      }
    }
    if (remove) {
      window.WEARSHOP_STATE.wishlist = window.WEARSHOP_STATE.wishlist.filter((i) => i.id !== remove.dataset.id);
      window.WEARSHOP_STATE.save();
      render();
      window.WEARSHOP_UI.showToast("Wishlistdan o'chirildi");
    }
  });

  seedWishlistIfEmpty().finally(render);
})();
