// public/js/site-menu.js
// Toggle dropdown menu (ikon titik-3) yang berisi link ke halaman lain
// seperti Kebijakan Privasi dan Syarat & Ketentuan.

(() => {
  const btn = document.getElementById("siteMenuBtn");
  const dropdown = document.getElementById("siteMenuDropdown");
  if (!btn || !dropdown) return;

  function close() {
    dropdown.classList.remove("show");
    btn.setAttribute("aria-expanded", "false");
  }

  function open() {
    // Posisikan tepat di bawah tombol (tinggi bar notifikasi di atas header bisa berubah)
    const rect = btn.getBoundingClientRect();
    dropdown.style.top = Math.round(rect.bottom + 6) + "px";
    dropdown.classList.add("show");
    btn.setAttribute("aria-expanded", "true");
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (dropdown.classList.contains("show")) close();
    else open();
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== btn) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dropdown.classList.contains("show")) {
      close();
      btn.focus();
    }
  });
  window.addEventListener("resize", close);
})();
