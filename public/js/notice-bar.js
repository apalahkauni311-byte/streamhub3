// public/js/notice-bar.js
// Bar notifikasi di atas header untuk semua halaman publik. Isinya (aktif/
// nonaktif, teks, link, versi pesan) diatur admin lewat tabel settings dan
// dibaca dari /api/settings/public. Tombol tutup menyimpan pilihan pengunjung
// di localStorage dengan kunci yang memuat versi pesan, jadi pesan baru
// (versi naik) muncul lagi.

(() => {
  const KEY_PREFIX = "sh_notice_closed_";

  function esc(value) {
    if (typeof Utils !== "undefined" && Utils.escapeHtml) return Utils.escapeHtml(value);
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Hanya http/https atau path relatif satu-situs ("/xxx", bukan "//host").
  function safeHref(raw) {
    const value = String(raw || "").trim();
    if (!value) return "";
    if (/^\/(?![\/\\])[^\s\\]*$/.test(value)) return value;
    try {
      const u = new URL(value);
      return u.protocol === "http:" || u.protocol === "https:" ? u.href : "";
    } catch {
      return "";
    }
  }

  function storageKey(version) {
    const v = String(version || "1").replace(/[^\w.-]/g, "").slice(0, 40) || "1";
    return KEY_PREFIX + v;
  }

  function isClosed(key) {
    try {
      return localStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  }

  function remember(key) {
    try {
      localStorage.setItem(key, "1");
    } catch {
      // Penyimpanan diblokir: bar tetap tertutup selama halaman ini terbuka
    }
  }

  // Buang catatan "tertutup" dari versi pesan lama supaya localStorage tidak menumpuk.
  function cleanupOldKeys(currentKey) {
    try {
      const stale = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(KEY_PREFIX) === 0 && k !== currentKey) stale.push(k);
      }
      stale.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Abaikan
    }
  }

  function render(settings) {
    if (settings.notice_enabled !== "1") return;
    const text = String(settings.notice_text || "").trim();
    if (!text) return;

    const key = storageKey(settings.notice_version);
    cleanupOldKeys(key);
    if (isClosed(key)) return;

    const href = safeHref(settings.notice_link);
    const label = String(settings.notice_link_label || "").trim() || "Selengkapnya";
    const external = /^https?:/i.test(href);

    const bar = document.createElement("div");
    bar.className = "notice";
    bar.id = "siteNotice";
    bar.setAttribute("role", "status");
    bar.innerHTML = `
      <div class="container notice-inner">
        <p>${esc(text)}${
          href
            ? ` <a href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(label)}</a>`
            : ""
        }</p>
        <button type="button" class="notice-close" aria-label="Tutup pemberitahuan">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
    `;
    bar.querySelector(".notice-close").addEventListener("click", () => {
      bar.remove();
      remember(key);
    });

    // Selalu di atas header; kalau tidak ada header (mis. halaman tanpa header), paling atas body.
    const header = document.querySelector(".site-header");
    if (header && header.parentNode) header.parentNode.insertBefore(bar, header);
    else document.body.insertBefore(bar, document.body.firstChild);
  }

  async function init() {
    try {
      const res = await fetch("/api/settings/public");
      const payload = await res.json();
      render((payload && payload.data) || {});
    } catch {
      // Diamkan saja bila gagal: tanpa bar, halaman tetap normal
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
