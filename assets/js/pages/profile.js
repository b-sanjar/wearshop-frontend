(async function initProfile() {
  window.WEARSHOP_UI.mountLayout();

  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");
  const userPhone = document.getElementById("userPhone");
  const userCity = document.getElementById("userCity");
  const userGender = document.getElementById("userGender");
  const userAddress = document.getElementById("userAddress");
  const userCreatedAt = document.getElementById("userCreatedAt");
  const userMeta = document.getElementById("userMeta");

  const editName = document.getElementById("editName");
  const editPhone = document.getElementById("editPhone");
  const editCity = document.getElementById("editCity");
  const editGender = document.getElementById("editGender");
  const editAddress = document.getElementById("editAddress");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!window.WEARSHOP_STATE.token || !window.WEARSHOP_STATE.user) {
    window.WEARSHOP_UI.showToast("Avval login qiling", true);
    setTimeout(() => (window.location.href = "../../index.html"), 420);
    return;
  }

  function setView(user) {
    userName.textContent = user.name || "-";
    userEmail.textContent = user.email || "-";
    userPhone.textContent = user.phone || "-";
    userCity.textContent = user.city || "-";
    userGender.textContent = user.gender || "-";
    userAddress.textContent = user.address || "Ko'rsatilmagan";
    userCreatedAt.textContent = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("uz-UZ")
      : "-";
    userMeta.textContent = `ID: ${user.id} • Holat: Faol foydalanuvchi`;

    editName.value = user.name || "";
    editPhone.value = user.phone || "";
    editCity.value = user.city || "";
    editGender.value = user.gender || "";
    editAddress.value = user.address || "";
  }

  logoutBtn.onclick = () => {
    window.WEARSHOP_STATE.token = "";
    window.WEARSHOP_STATE.user = null;
    window.WEARSHOP_STATE.save();
    window.WEARSHOP_UI.showToast("Hisobdan chiqildi");
    setTimeout(() => (window.location.href = "../../index.html"), 420);
  };

  try {
    const me = await window.WEARSHOP_API.request("/auth/me");
    window.WEARSHOP_STATE.user = me.user;
    window.WEARSHOP_STATE.save();
    setView(me.user);
  } catch (error) {
    window.WEARSHOP_UI.showToast(error.message, true);
  }

  saveProfileBtn.onclick = async () => {
    if (!editName.value.trim() || !editPhone.value.trim() || !editCity.value.trim() || !editGender.value.trim()) {
      window.WEARSHOP_UI.showToast("Majburiy maydonlarni to'ldiring", true);
      return;
    }
    try {
      const data = await window.WEARSHOP_API.request("/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: editName.value.trim(),
          phone: editPhone.value.trim(),
          city: editCity.value.trim(),
          gender: editGender.value.trim(),
          address: editAddress.value.trim(),
        }),
      });
      window.WEARSHOP_STATE.user = data.user;
      window.WEARSHOP_STATE.save();
      setView(data.user);
      window.WEARSHOP_UI.showToast("Profil muvaffaqiyatli yangilandi");
    } catch (error) {
      window.WEARSHOP_UI.showToast(error.message, true);
    }
  };
})();
