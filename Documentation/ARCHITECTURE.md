# 🏛️ Arsitektur Frontend Portofolio (Frontend Architecture)

Dokumen ini memetakan struktur logika dan hierarki direktori pada aplikasi *Frontend* (`kenan-portfolio-web`) agar tim *Developer* atau agen AI memiliki pijakan yang sama dalam mengembangkan fitur.

---

## 1. Konsep Pemisahan (*Separation of Concerns*)
Aplikasi ini dikembangkan menggunakan **Next.js 14 (App Router)** dengan pola *Modular / Feature-Sliced*. Alih-alih menumpuk semua komponen di satu folder `components`, kita membaginya berdasarkan domain fitur dan privasi.

### Hierarki Folder Utama:
- `app/` → Hanya bertugas untuk **Routing** dan pengaturan Layout Halaman (Pages). Tidak boleh ada logika komponen (*Component Logic*) berat di sini.
- `modules/` → Berisi logika bisnis dan komponen UI spesifik untuk Publik (seperti *SmartTalk*, *HeroSection*, *ProjectsGallery*).
- `common/` → Komponen generik, *utility*, tipe data, dan *Zustand stores* yang digunakan lintas modul di seluruh aplikasi.
- `Documentation/` → Tempat bagi berkas-berkas pengembang seperti *Design System*, arsitektur, dan log.

---

## 2. Pengelolaan Folder Admin (Private Components)
Mengingat aplikasi kita melayani dua wajah (Publik dan Admin Dasbor), **dilarang mencampur aduk komponen khusus Admin ke dalam folder `common/` atau `modules/` publik.**

Sistem menggunakan fitur **Private Folders Next.js** (folder dengan awalan `_`) untuk melokalisasi komponen UI Admin.
Contoh:
```
app/[locale]/admin/
 ├── _components/      <-- (Komponen eksklusif Admin)
 │    ├── layout/      <-- (Sidebar, Header, Main Wrapper)
 │    └── forms/       <-- (Input komponen khusus untuk pengeditan portofolio)
 ├── (rute halaman)    <-- (contoh: /projects/page.tsx)
 └── layout.tsx        <-- (Bungkus luar yang memanggil _components/layout)
```
**Aturan Emas:** Jika komponen tersebut hanya bisa diakses oleh Admin, taruhlah di dalam `app/[locale]/admin/_components`. Jika tombol/input tersebut dipakai bersama (di Form Publik dan di Form Admin), barulah letakkan di `common/components/`.

---

## 3. Sistem Tema dan Penataan UI
UI dibangun secara ketat mengikuti parameter *Design System* yang dicatat pada `DESIGN.md`.
- **Warna:** Hanya boleh menggunakan CSS Variables (contoh: `bg-background`, `text-primary`, `border-border`). Tidak diperkenankan me- *hardcode* warna literal (`white`, `#000000`, dll.) pada kelas Tailwind.
- **State Management:** *State* global untuk UI (seperti posisi *Sidebar*) dipegang oleh `useAdminUIStore` (Zustand), sedangkan Otentikasi oleh `useAdminAuthStore`. Ini mencegah *prop-drilling* yang berantakan.
