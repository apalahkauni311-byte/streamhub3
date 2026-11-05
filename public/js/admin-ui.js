/* public/js/admin-ui.js - tema terang/gelap dashboard admin (hanya tampilan) */
(function () {
  var KEY = "sh-admin-theme", root = document.documentElement;
  try { var t = localStorage.getItem(KEY); if (t === "light" || t === "dark") root.dataset.theme = t; } catch (e) {}
  var SUN = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>';
  var MOON = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  function paint(btn) {
    var dark = root.dataset.theme !== "light";
    btn.innerHTML = dark ? SUN : MOON;
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", dark ? "#0b0c10" : "#f4f5f8");
  }
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("themeBtn");
    if (!btn) return;
    paint(btn);
    btn.addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
      try { localStorage.setItem(KEY, root.dataset.theme); } catch (e) {}
      paint(btn);
    });
  });
})();
