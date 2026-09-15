# 📜 Log Aktivitas Pengembangan Frontend (Development Log)

File ini mencatat seluruh riwayat aktivitas rekayasa dan pengembangan (*engineering*) yang telah dilakukan pada **kenan-portfolio-web**. Tujuannya adalah memberikan konteks historis arsitektur kepada AI atau *Developer* di masa depan.

---

## 🛠️ Batch 1: Inisialisasi & Desain Sistem Dasar
1. **App Router & Next.js 14:** Menggunakan arsitektur App Router terbaru dari Next.js untuk mendukung *Server Components*.
2. **Internationalization (i18n):** Setup bahasa multi-regional (`en` dan `id`) dengan deteksi locale di routing `app/[locale]`.
3. **Sistem Tema Hutan (Forest Theme):** Mengganti gaya standar dengan sistem warna CSS Variabel kustom (`DESIGN.md`). Tiga mode disediakan: *Light*, *Dark*, dan *Forest*.

## 🛠️ Batch 2: Integrasi & Refactoring Admin UI (Terkini)
1. **Otentikasi Zustand:** Memindahkan logika otentikasi UI Admin dari *Context* lama dan `next-auth` ke sistem state management lokal `useAdminAuthStore` (Zustand) yang mengambil token verifikasi dari backend Hono.
2. **Component Splitting Khusus Admin:** 
   - Memecah file raksasa `layout.tsx` di area admin menjadi komponen terisolasi (`AdminSidebar`, `AdminHeader`, `AdminLayoutClient`).
   - Menyimpan komponen eksklusif admin di *Private Folder* `app/[locale]/admin/_components` agar tidak berbaur dengan elemen UI publik di folder `common/`.
3. **Mobile-First Admin Dashboard:** Merombak *sidebar* dan *layout* admin yang sebelumnya kaku menjadi responsif di perangkat bergerak (layar kecil), lengkap dengan animasi transisi elegan (CSS & Framer Motion) dan *hamburger menu*.
4. **Penyempurnaan Responsivitas Admin (iPad & iOS):** Menggeser *breakpoint* desktop Sidebar dari `md:` ke `lg:` (1024px) agar perangkat *Tablet/iPad Portrait* mendapatkan tampilan Hamburger Menu. Mengubah *height* sidebar menjadi `100dvh` (*Dynamic Viewport Height*) untuk mengatasi *bug* bilah alamat Safari di iOS yang sering menutupi tombol bagian bawah.
5. **API Client Tersentralisasi:** Membuat `apiClient.ts` untuk memfasilitasi injeksi *Bearer token* secara otomatis saat Admin berkomunikasi dengan backend, menghindarkan *boilerplate code*.
6. **Centralized Cloudinary Upload:** Merancang komponen *reusable* `<ImageUpload />` (mendukung *Drag & Drop* dan status unggahan) yang tersambung langsung dengan *endpoint* backend `POST /api/upload`. Komponen ini disematkan di seluruh form portofolio (Projects, Skills, Experiences, Education) untuk menyingkirkan proses unggahan dan *copy-paste* URL secara manual.

---

*Catatan untuk AI: Selalu baca dokumen ini dan `ARCHITECTURE.md` sebelum mengusulkan refactoring pada struktur file UI frontend.*
