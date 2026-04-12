const isLocalHost =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

window.WEARSHOP_CONFIG = {
  API_BASE_URL: window.WEARSHOP_API_URL || (isLocalHost ? "http://localhost:5000/api" : "https://wearshop-backend.onrender.com/api"),
};
