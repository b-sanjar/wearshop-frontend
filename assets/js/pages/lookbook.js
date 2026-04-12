(async function initLookbook() {
  window.WEARSHOP_UI.mountLayout();
  const grid = document.getElementById("lookbookGrid");

  try {
    const data = await window.WEARSHOP_API.request("/lookbook");
    grid.innerHTML = data.items
      .map(
        (item) => `
      <article class="look-card">
        <img src="${item.image}" alt="${item.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200';" />
        <div class="look-body">
          <h3>${item.title}</h3>
          <p class="muted">${item.description}</p>
          <div class="look-meta">
            <span class="look-tag"><i class="fa-solid fa-star"></i> Premium Edit</span>
            <span class="look-tag"><i class="fa-solid fa-sparkles"></i> Trend Signal</span>
          </div>
        </div>
      </article>
    `
      )
      .join("");
  } catch (error) {
    grid.innerHTML = `<p class="muted">${error.message}</p>`;
  }
})();
