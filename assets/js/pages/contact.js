(function initContact() {
  window.WEARSHOP_UI.mountLayout();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const sendBtn = document.getElementById("sendBtn");

  sendBtn.addEventListener("click", async () => {
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      window.WEARSHOP_UI.showToast("Barcha maydonlarni to'ldiring", true);
      return;
    }

    try {
      await window.WEARSHOP_API.request("/contact", {
        method: "POST",
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          message: message.value.trim(),
        }),
      });
      name.value = "";
      email.value = "";
      message.value = "";
      window.WEARSHOP_UI.showToast("Xabaringiz yuborildi");
    } catch (error) {
      window.WEARSHOP_UI.showToast(error.message, true);
    }
  });
})();
