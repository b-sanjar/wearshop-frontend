(async function initProduct() {
  window.WEARSHOP_UI.mountLayout();

  const imageEl = document.getElementById("productImage");
  const infoEl = document.getElementById("productInfo");
  const relatedGrid = document.getElementById("relatedGrid");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    infoEl.innerHTML = "<p class='muted'>Mahsulot topilmadi</p>";
    return;
  }

  function effectivePrice(p) {
    return p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
  }

  function addToCart(product) {
    const item = window.WEARSHOP_STATE.cart.find((i) => i.id === product.id);
    if (item) item.qty += 1;
    else window.WEARSHOP_STATE.cart.push({ ...product, qty: 1 });
    window.WEARSHOP_STATE.save();
    window.WEARSHOP_UI.showToast("Savatga qo'shildi");
  }

  try {
    const data = await window.WEARSHOP_API.request(`/products/${id}`);
    const { product, related } = data;
    const price = effectivePrice(product);

    imageEl.src = product.image;
    imageEl.alt = product.name;
    imageEl.onerror = () => {
      imageEl.onerror = null;
      imageEl.src = "https://images.unsplash.com/photo-1464863979621-258859e62245?w=900";
    };

    infoEl.innerHTML = `
      <p class="pill">${product.category}</p>
      <h1>${product.name}</h1>
      <p class="muted">${product.description}</p>
      <div class="price-wrap">
        <span class="price">${window.WEARSHOP_UI.formatUZS(price)}</span>
        ${product.discount ? `<span class="muted"><s>${window.WEARSHOP_UI.formatUZS(product.price)}</s></span>` : ""}
      </div>
      <p class="muted">Rating: ★ ${product.rating.toFixed(1)} • Stock: ${product.stock}</p>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap">
        <button id="addBtn" class="btn btn-primary"><i class="fa-solid fa-cart-plus"></i> Savatga</button>
        <button id="wishBtn" class="btn btn-soft"><i class="fa-solid fa-heart"></i> Wishlist</button>
      </div>
    `;

    document.getElementById("addBtn").addEventListener("click", () => addToCart(product));
    document.getElementById("wishBtn").addEventListener("click", () => {
      const exists = window.WEARSHOP_STATE.wishlist.some((i) => i.id === product.id);
      if (exists) {
        window.WEARSHOP_STATE.wishlist = window.WEARSHOP_STATE.wishlist.filter((i) => i.id !== product.id);
      } else {
        window.WEARSHOP_STATE.wishlist.push(product);
      }
      window.WEARSHOP_STATE.save();
      window.WEARSHOP_UI.showToast("Wishlist yangilandi");
    });

    relatedGrid.innerHTML = related
      .map(
        (r) => `
      <a class="mini-card" href="../product/index.html?id=${r.id}">
        <img src="${r.image}" alt="${r.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900';" />
        <div>
          <strong>${r.name}</strong>
          <p class="muted">${window.WEARSHOP_UI.formatUZS(effectivePrice(r))}</p>
        </div>
      </a>
    `
      )
      .join("");
  } catch (error) {
    infoEl.innerHTML = `<p class='muted'>${error.message}</p>`;
  }
})();
