(function initRegister() {
  window.WEARSHOP_UI.mountLayout();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const city = document.getElementById("city");
  const gender = document.getElementById("gender");
  const address = document.getElementById("address");
  const password = document.getElementById("password");
  const registerBtn = document.getElementById("registerBtn");

  registerBtn.addEventListener("click", async () => {
    if (!name.value.trim() || !email.value.trim() || !phone.value.trim() || !city.value.trim() || !gender.value.trim() || !password.value.trim()) {
      window.WEARSHOP_UI.showToast("Barcha maydonlarni to'ldiring", true);
      return;
    }
    if (password.value.trim().length < 6) {
      window.WEARSHOP_UI.showToast("Parol kamida 6 belgidan iborat bo'lishi kerak", true);
      return;
    }

    try {
      const data = await window.WEARSHOP_API.request("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim(),
          city: city.value.trim(),
          gender: gender.value.trim(),
          address: address.value.trim(),
          password: password.value.trim(),
        }),
      });

      window.WEARSHOP_STATE.token = data.token;
      window.WEARSHOP_STATE.user = data.user;
      window.WEARSHOP_STATE.save();
      window.WEARSHOP_UI.showToast("Hisob yaratildi");
      setTimeout(() => (window.location.href = "../profile/index.html"), 420);
    } catch (error) {
      window.WEARSHOP_UI.showToast(error.message, true);
    }
  });
})();
