window.WEARSHOP_API = {
  async request(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (window.WEARSHOP_STATE.token) {
      headers.Authorization = `Bearer ${window.WEARSHOP_STATE.token}`;
    }

    const response = await fetch(`${window.WEARSHOP_CONFIG.API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Xatolik yuz berdi");
    }

    return data;
  },
};
