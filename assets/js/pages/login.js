(function initLogin() {
  window.WEARSHOP_UI.mountLayout();

  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");

  loginBtn.addEventListener("click", async () => {
    if (!email.value.trim() || !password.value.trim()) {
      window.WEARSHOP_UI.showToast("Email va parolni kiriting", true);
      return;
    }

    try {
      const data = await window.WEARSHOP_API.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.value.trim(),
          password: password.value.trim(),
        }),
      });

      window.WEARSHOP_STATE.token = data.token;
      window.WEARSHOP_STATE.user = data.user;
      window.WEARSHOP_STATE.save();
      window.WEARSHOP_UI.showToast("Muvaffaqiyatli kirildi");
      setTimeout(() => (window.location.href = "../profile/index.html"), 420);
    } catch (error) {
      window.WEARSHOP_UI.showToast(error.message, true);
    }
  });
})();
