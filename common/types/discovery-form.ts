// ============================================================
// Discovery Form – Type Definitions
// Digunakan oleh frontend form wizard dan backend API inquiry
// ============================================================

/** Opsi pilihan untuk tipe radio/select */
export interface FormOption {
  label: string;
  value: string;
  icon?: string; // emoji atau nama icon
  description?: string;
}

/** Definisi satu pertanyaan dalam sebuah step */
export interface FormQuestion {
  id: string;
  type: "radio-cards" | "radio" | "text" | "email" | "tel" | "textarea" | "slider" | "select";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: FormOption[];
  /** Khusus tipe slider */
  min?: number;
  max?: number;
  step?: number;
  /** Format tampilan nilai slider (misal: "Rp{value}") */
  valueFormat?: string;
}

/** Satu langkah / step dalam wizard */
export interface FormStep {
  step: number;
  title: string;
  subtitle?: string;
  questions: FormQuestion[];
}

/** Konfigurasi lengkap form dari API */
export interface FormConfig {
  id: string;
  name: string;
  isActive: boolean;
  schema: FormStep[];
}

/** Jawaban pengguna — key = question.id, value = jawaban */
export type FormAnswers = Record<string, string | number>;

/** Payload yang dikirim ke POST /api/inquiry */
export interface InquiryPayload {
  formId: string;
  answers: FormAnswers;
}

/** Status inquiry */
export type InquiryStatus = "NEW" | "CONTACTED" | "DEAL" | "REJECTED";

/** Data inquiry yang disimpan di database */
export interface Inquiry {
  id: string;
  formId: string;
  name: string;
  email: string;
  phone?: string;
  answers: FormAnswers;
  status: InquiryStatus;
  createdAt: string;
}
