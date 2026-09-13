import type { FormConfig } from "@/common/types/discovery-form";

/**
 * Mock form config — digunakan saat API belum tersedia (Batch 1).
 * Setelah Batch 2 selesai, data ini akan digantikan oleh respons dari
 * GET /api/form-config yang membaca PortfolioFormConfig di database Kainest.
 */
export const MOCK_FORM_CONFIG: FormConfig = {
  id: "mock-form-001",
  name: "Kenan Discovery Form",
  isActive: true,
  schema: [
    {
      step: 1,
      title: "Apa yang bisa saya bantu?",
      subtitle: "Pilih layanan yang paling sesuai dengan kebutuhan Anda.",
      questions: [
        {
          id: "service",
          type: "radio-cards",
          label: "Jenis Layanan",
          required: true,
          options: [
            {
              value: "company-profile",
              label: "Company Profile",
              icon: "🏢",
              description: "Website profesional untuk memperkenalkan bisnis Anda",
            },
            {
              value: "ecommerce",
              label: "E-Commerce",
              icon: "🛒",
              description: "Toko online lengkap dengan sistem pembayaran",
            },
            {
              value: "custom-app",
              label: "Custom Web App",
              icon: "⚙️",
              description: "Aplikasi web khusus sesuai alur bisnis Anda",
            },
            {
              value: "landing-page",
              label: "Landing Page",
              icon: "🚀",
              description: "Halaman pemasaran yang dioptimalkan untuk konversi",
            },
          ],
        },
      ],
    },
    {
      step: 2,
      title: "Estimasi anggaran Anda?",
      subtitle: "Ini membantu saya memberikan solusi yang paling sesuai.",
      questions: [
        {
          id: "budget",
          type: "radio-cards",
          label: "Kisaran Budget",
          required: true,
          options: [
            {
              value: "< 5jt",
              label: "Di bawah Rp 5 Juta",
              icon: "💸",
              description: "Cocok untuk landing page atau profil sederhana",
            },
            {
              value: "5-15jt",
              label: "Rp 5 – 15 Juta",
              icon: "💰",
              description: "Website profesional dengan fitur standar",
            },
            {
              value: "15-30jt",
              label: "Rp 15 – 30 Juta",
              icon: "💎",
              description: "Sistem yang lebih kompleks & terintegrasi",
            },
            {
              value: "> 30jt",
              label: "Di atas Rp 30 Juta",
              icon: "🏆",
              description: "Enterprise-level atau aplikasi skala besar",
            },
          ],
        },
      ],
    },
    {
      step: 3,
      title: "Ceritakan lebih lanjut",
      subtitle: "Bagikan ide atau kebutuhan spesifik Anda.",
      questions: [
        {
          id: "description",
          type: "textarea",
          label: "Deskripsi Proyek",
          placeholder:
            "Contoh: Saya butuh website company profile dengan halaman About, Services, Portfolio, dan Contact. Ada fitur WhatsApp chat...",
          required: true,
        },
        {
          id: "timeline",
          type: "radio-cards",
          label: "Target Selesai",
          required: false,
          options: [
            { value: "asap", label: "Sesegera Mungkin", icon: "⚡" },
            { value: "1-month", label: "1 Bulan", icon: "📅" },
            { value: "2-3-months", label: "2–3 Bulan", icon: "🗓️" },
            { value: "flexible", label: "Fleksibel", icon: "🌊" },
          ],
        },
      ],
    },
    {
      step: 4,
      title: "Informasi kontak Anda",
      subtitle: "Saya akan segera menghubungi Anda setelah form diterima.",
      questions: [
        {
          id: "name",
          type: "text",
          label: "Nama Lengkap",
          placeholder: "Budi Santoso",
          required: true,
        },
        {
          id: "email",
          type: "email",
          label: "Alamat Email",
          placeholder: "budi@perusahaan.com",
          required: true,
        },
        {
          id: "phone",
          type: "tel",
          label: "Nomor WhatsApp",
          placeholder: "08xxxxxxxxxx",
          required: false,
        },
      ],
    },
  ],
};
