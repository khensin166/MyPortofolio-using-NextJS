"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, ArrowLeft, Mail, Phone, Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Inquiry } from "@/common/types/discovery-form";
import { motion } from "framer-motion";

export default function InquiryDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const { token, isLoading: authLoading } = useAdminAuth();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!token || authLoading || !id) return;

    const fetchInquiry = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
        const res = await fetch(`${apiUrl}/inquiry/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch inquiry details");
        }

        const data = await res.json();
        setInquiry(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiry();
  }, [token, authLoading, id]);

  const updateStatus = async (newStatus: string) => {
    if (!token) return;
    setIsUpdating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      const res = await fetch(`${apiUrl}/inquiry/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      const data = await res.json();
      setInquiry(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="space-y-4">
        <Link href="/en/admin/inquiries" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Link>
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error || "Inquiry not found"}
        </div>
      </div>
    );
  }

  // Formatting answers for display
  const answers = inquiry.answers as Record<string, string | number>;
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-500 ring-1 ring-inset ring-blue-500/20">Baru</span>;
      case "CONTACTED":
        return <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-500 ring-1 ring-inset ring-amber-500/20">Sedang Komunikasi</span>;
      case "DEAL":
        return <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-500 ring-1 ring-inset ring-green-500/20">Deal / Sukses</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-500/10 px-3 py-1.5 text-sm font-medium text-gray-500 ring-1 ring-inset ring-gray-500/20">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link 
          href="/en/admin/inquiries"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Pesan</h1>
          <p className="text-sm text-muted-foreground mt-1">Pesan dari {inquiry.name}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Client Info & Status */}
        <div className="md:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="font-semibold mb-4 text-foreground">Informasi Klien</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {inquiry.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{inquiry.name}</p>
                  <p className="text-xs text-muted-foreground">Klien</p>
                </div>
              </div>
              
              <div className="h-px w-full bg-border" />
              
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline truncate">
                  {inquiry.email}
                </a>
              </div>
              
              {inquiry.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    {inquiry.phone}
                  </a>
                </div>
              )}
              
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {new Date(inquiry.createdAt).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="font-semibold mb-4 text-foreground">Status</h3>
            <div className="mb-6">
              {getStatusBadge(inquiry.status)}
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Update Status</label>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => updateStatus("NEW")}
                  disabled={isUpdating || inquiry.status === "NEW"}
                  className="text-left px-3 py-2 text-sm rounded-lg border border-border bg-background hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  Tandai sebagai Baru
                </button>
                <button 
                  onClick={() => updateStatus("CONTACTED")}
                  disabled={isUpdating || inquiry.status === "CONTACTED"}
                  className="text-left px-3 py-2 text-sm rounded-lg border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 transition-colors disabled:opacity-50"
                >
                  Tandai Sedang Komunikasi
                </button>
                <button 
                  onClick={() => updateStatus("DEAL")}
                  disabled={isUpdating || inquiry.status === "DEAL"}
                  className="flex items-center justify-between text-left px-3 py-2 text-sm rounded-lg border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 text-green-600 transition-colors disabled:opacity-50"
                >
                  Tandai Deal / Sukses
                  {inquiry.status === "DEAL" && <CheckCircle className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Answers */}
        <div className="md:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className="border-b border-border bg-secondary/30 px-6 py-4">
              <h3 className="font-semibold text-foreground">Detail Kebutuhan Klien</h3>
              <p className="text-sm text-muted-foreground mt-1">Jawaban dari Discovery Form</p>
            </div>
            <div className="p-6 space-y-6">
              {Object.entries(answers).map(([key, value], idx) => {
                // Ignore standard contact fields that are already displayed on the left
                if (['name', 'email', 'phone'].includes(key)) return null;

                // Format the key to be more readable
                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

                return (
                  <div key={key} className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">{formattedKey}</h4>
                    <div className="rounded-lg bg-background p-4 border border-border text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {value || <span className="text-muted-foreground italic">Tidak diisi</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
