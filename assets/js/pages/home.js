(async function initHome() {
  window.WEARSHOP_UI.mountLayout();

  const heroStats = document.getElementById("heroStats");
  const liveVisitors = document.getElementById("liveVisitors");
  const featuredGrid = document.getElementById("homeFeaturedGrid");

  async function loadStats() {
    try {
      const stats = await window.WEARSHOP_API.request("/stats/public");
      heroStats.innerHTML = `
        <article class="hero-stat"><strong>${stats.products}+</strong><span class="muted">Mahsulot</span></article>
        <article class="hero-stat"><strong>${stats.avgRating}</strong><span class="muted">O'rtacha reyting</span></article>
        <article class="hero-stat"><strong>${stats.totalStock}</strong><span class="muted">Jami stock</span></article>
        <article class="hero-stat"><strong>${stats.activePromotions}</strong><span class="muted">Active promo</span></article>
      `;
      liveVisitors.textContent = String(stats.liveVisitors);
    } catch (error) {
      heroStats.innerHTML = `<article class="hero-stat"><span class="muted">${error.message}</span></article>`;
    }
  }

  function effectivePrice(p) {
    return p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
  }

  async function loadFeatured() {
    if (!featuredGrid) return;
    try {
      const data = await window.WEARSHOP_API.request("/products");
      const featured = (data.products || [])
        .slice()
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 8);

      featuredGrid.innerHTML = featured
        .map(
          (p) => `
          <a class="home-featured-card" href="./pages/product/index.html?id=${p.id}">
            <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900';" />
            <div class="home-featured-body">
              <strong>${p.name}</strong>
              <p class="muted">${p.category} • ★ ${p.rating.toFixed(1)}</p>
              <div class="price">${window.WEARSHOP_UI.formatUZS(effectivePrice(p))}</div>
            </div>
          </a>
        `
        )
        .join("");
    } catch (error) {
      featuredGrid.innerHTML = `<p class="muted">${error.message}</p>`;
    }
  }

  await loadStats();
  await loadFeatured();
  setInterval(async () => {
    try {
      const stats = await window.WEARSHOP_API.request("/stats/public");
      liveVisitors.textContent = String(stats.liveVisitors);
    } catch (_) {
      // noop
    }
  }, 9000);
})();
