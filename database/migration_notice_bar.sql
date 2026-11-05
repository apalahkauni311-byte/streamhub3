-- ============================================================
-- Migrasi: Bar Notifikasi Atas (tampil di atas header semua halaman publik)
-- AMAN dijalankan di database yang sudah berisi data dan AMAN dijalankan
-- berulang kali. Hanya memakai tabel generik "settings" (tidak mengubah
-- skema tabel lain) dan hanya mengisi nilai awal bila kunci belum ada,
-- sehingga pengaturan yang sudah Anda simpan dari dashboard tidak tertimpa.
--
-- Kunci pengaturan:
--   notice_enabled     "1" = tampil, "0" = sembunyi (default "0")
--   notice_text        teks pesan (maks. 300 karakter)
--   notice_link        link opsional (http/https atau path relatif, mis. /category/)
--   notice_link_label  teks tautan (kosong = "Selengkapnya")
--   notice_version     nomor versi pesan; naik = pengunjung yang pernah menutup
--                      bar akan melihat pesan baru lagi
--
-- Jalankan dengan:
--   npx wrangler d1 execute streaming_db --remote --file=./database/migration_notice_bar.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL DEFAULT '',
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO settings (key, value) VALUES ('notice_enabled', '0');
INSERT OR IGNORE INTO settings (key, value) VALUES ('notice_text', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('notice_link', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('notice_link_label', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('notice_version', '1');
