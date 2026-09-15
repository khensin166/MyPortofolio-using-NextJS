import { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { apiClient } from "@/common/services/apiClient";
import { getDirectImageUrl } from "@/common/utils/formatters";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUpload({ value, onChange, label, placeholder }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    // Validasi ukuran (contoh max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB.");
      return;
    }
    // Validasi tipe
    if (!file.type.startsWith("image/")) {
      setError("Hanya file gambar yang diperbolehkan.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // apiClient akan otomatis menambahkan auth Bearer Token
      const response = await apiClient("/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.error && response.data?.url) {
        onChange(response.data.url);
      } else {
        setError(response.error || "Gagal mengunggah gambar.");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Terjadi kesalahan saat mengunggah.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-sm font-medium">{label}</label>}
      
      {/* Tampilan jika sudah ada gambar (bisa preview) */}
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-border bg-card/50">
          <div className="relative aspect-video w-full max-h-48 flex items-center justify-center bg-secondary/50 p-2">
            {/* Menggunakan img biasa karena Next.js Image kadang error jika URL tidak di whitelist */}
            <img 
              src={getDirectImageUrl(value)} 
              alt="Uploaded preview" 
              className="max-h-full object-contain rounded"
              onError={(e) => {
                // Fallback jika bukan gambar valid
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
              }}
            />
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 bg-destructive text-destructive-foreground rounded-full hover:brightness-110 transition-all transform hover:scale-110 shadow-lg"
              title="Remove Image"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="text-xs text-white/90">Klik tombol di atas untuk menghapus</p>
          </div>
          
          {/* Fallback input text URL */}
          <div className="border-t border-border p-2 bg-background flex">
            <input 
              type="text" 
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-transparent text-xs text-muted-foreground outline-none px-2"
              placeholder="Atau ubah URL secara manual..."
            />
          </div>
        </div>
      ) : (
        /* Area Drag & Drop */
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all
            ${isUploading ? "bg-secondary/50 border-primary/50" : "bg-card hover:bg-secondary/30 border-border hover:border-primary/50"}
            ${error ? "border-destructive hover:border-destructive" : ""}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
              <p className="text-sm font-medium text-foreground">Mengunggah...</p>
              <p className="text-xs text-muted-foreground animate-pulse">Mohon tunggu sebentar</p>
            </>
          ) : (
            <>
              <div className="p-3 bg-secondary/50 rounded-full mb-1">
                <UploadCloud className={`w-6 h-6 ${error ? "text-destructive" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Klik untuk upload file</p>
                <p className="text-xs text-muted-foreground mt-1">atau seret (drag & drop) gambar ke sini</p>
              </div>
            </>
          )}

          {error && (
            <p className="text-xs text-destructive mt-2">{error}</p>
          )}
        </div>
      )}

      {/* Manual URL Input fallback if user doesn't want to upload but wants to paste URL */}
      {!value && !isUploading && (
        <div className="flex items-center gap-2 mt-2">
          <div className="text-xs text-muted-foreground whitespace-nowrap px-1">Atau URL:</div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 rounded border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
            placeholder={placeholder || "https://..."}
          />
        </div>
      )}
    </div>
  );
}
