(function initCheckout() {
  window.WEARSHOP_UI.mountLayout();

  const el = {
    fullName: document.getElementById("fullName"),
    phone: document.getElementById("phone"),
    address: document.getElementById("address"),
    promoCode: document.getElementById("promoCode"),
    paymentMethod: document.getElementById("paymentMethod"),
    note: document.getElementById("note"),
    orderBtn: document.getElementById("orderBtn"),
    summaryList: document.getElementById("summaryList"),
    subtotal: document.getElementById("subtotal"),
    total: document.getElementById("total"),
  };

  function effectivePrice(p) {
    return p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
  }

  function cartSubtotal() {
    return window.WEARSHOP_STATE.cart.reduce((sum, i) => sum + effectivePrice(i) * (i.qty || 1), 0);
  }

  function renderSummary() {
    const items = window.WEARSHOP_STATE.cart;
    if (!items.length) {
      el.summaryList.innerHTML = "<p class='muted'>Savat bo'sh.</p>";
      el.subtotal.textContent = "0 so'm";
      el.total.textContent = "0 so'm";
      return;
    }

    el.summaryList.innerHTML = items
      .map(
        (item) => `
      <div class="summary-item">
        <span>${item.name} x ${item.qty || 1}</span>
        <strong>${window.WEARSHOP_UI.formatUZS(effectivePrice(item) * (item.qty || 1))}</strong>
      </div>
    `
      )
      .join("");

    const subtotal = cartSubtotal();
    const shipping = subtotal >= 300000 ? 0 : 30000;
    el.subtotal.textContent = window.WEARSHOP_UI.formatUZS(subtotal);
    el.total.textContent = window.WEARSHOP_UI.formatUZS(subtotal + shipping);
  }

  el.orderBtn.addEventListener("click", async () => {
    if (!window.WEARSHOP_STATE.user || !window.WEARSHOP_STATE.token) {
      window.WEARSHOP_UI.showToast("Buyurtma uchun avval login qiling", true);
      return;
    }

    if (!window.WEARSHOP_STATE.cart.length) {
      window.WEARSHOP_UI.showToast("Savat bo'sh", true);
      return;
    }

    if (!el.fullName.value.trim() || !el.phone.value.trim() || !el.address.value.trim()) {
      window.WEARSHOP_UI.showToast("Yetkazib berish ma'lumotlari to'liq emas", true);
      return;
    }

    try {
      const items = window.WEARSHOP_STATE.cart.map((i) => ({ productId: i.id, quantity: i.qty || 1 }));
      const data = await window.WEARSHOP_API.request("/orders", {
        method: "POST",
        body: JSON.stringify({
          items,
          shipping: {
            fullName: el.fullName.value.trim(),
            phone: el.phone.value.trim(),
            address: el.address.value.trim(),
            note: el.note.value.trim(),
          },
          paymentMethod: el.paymentMethod.value,
          promoCode: el.promoCode.value.trim(),
        }),
      });

      window.WEARSHOP_STATE.cart = [];
      window.WEARSHOP_STATE.save();
      renderSummary();
      window.WEARSHOP_UI.showToast(`Buyurtma qabul qilindi: ${data.order.id}`);
    } catch (error) {
      window.WEARSHOP_UI.showToast(error.message, true);
    }
  });

  renderSummary();
})();
