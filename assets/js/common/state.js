window.WEARSHOP_STATE = {
  token: localStorage.getItem("wearshop-token") || "",
  user: JSON.parse(localStorage.getItem("wearshop-user") || "null"),
  cart: JSON.parse(localStorage.getItem("wearshop-cart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("wearshop-wishlist") || "[]"),
  theme: localStorage.getItem("wearshop-theme") || "dark",
  viewMode: localStorage.getItem("wearshop-view-mode") || "grid",
};

window.WEARSHOP_STATE.save = function saveState() {
  localStorage.setItem("wearshop-token", window.WEARSHOP_STATE.token || "");
  localStorage.setItem("wearshop-user", JSON.stringify(window.WEARSHOP_STATE.user));
  localStorage.setItem("wearshop-cart", JSON.stringify(window.WEARSHOP_STATE.cart));
  localStorage.setItem("wearshop-wishlist", JSON.stringify(window.WEARSHOP_STATE.wishlist));
  localStorage.setItem("wearshop-theme", window.WEARSHOP_STATE.theme);
  localStorage.setItem("wearshop-view-mode", window.WEARSHOP_STATE.viewMode);
};
