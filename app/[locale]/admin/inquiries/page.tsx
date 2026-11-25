"use client";

import { useState } from "react";
import useSWR from "swr";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, Search, Eye, MessageSquare, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Inquiry } from "@/common/types/discovery-form";
import { apiClient } from "@/common/services/apiClient";
import Modal from "@/common/components/elements/Modal";
import InquiryModal from "./InquiryModal";

interface InquiriesResponse {
  inquiries: Inquiry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function InquiriesPage() {
  const { token, isLoading: authLoading } = useAdminAuth();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(statusFilter ? { status: statusFilter } : {}),
  }).toString();

  const swrKey = !authLoading && token ? `/inquiry?${queryParams}` : null;

  const {
    data,
    error: swrError,
    isLoading,
    mutate,
  } = useSWR<InquiriesResponse>(
    swrKey,
    async (endpoint: string) => {
      const { data: resData, error: fetchError } = await apiClient<InquiriesResponse>(endpoint);
      if (fetchError) throw new Error(fetchError);
      return resData || { inquiries: [], total: 0, page: 1, limit, totalPages: 1 };
    },
    { revalidateOnFocus: false, dedupingInterval: 10000 },
  );

  const inquiries = data?.inquiries || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;
  const error = swrError ? swrError.message : "";

  const filteredInquiries = inquiries.filter(inq => 
    inq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inq.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500 ring-1 ring-inset ring-blue-500/20">Baru</span>;
      case "CONTACTED":
        return <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-500 ring-1 ring-inset ring-amber-500/20">Dihubungi</span>;
      case "DEAL":
        return <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">Deal</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-500 ring-1 ring-inset ring-gray-500/20">{status}</span>;
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sanitizeCsvCell = (raw: unknown): string => {
    const str = String(raw ?? "");
    const neutralized = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
    return `"${neutralized.replace(/"/g, '""')}"`;
  };

  const exportToCSV = () => {
    if (inquiries.length === 0) return;

    // Define headers
    const headers = ["ID", "Name", "Email", "Phone", "Company", "Budget", "Timeline", "Status", "Created At"];
    
    // Create CSV rows (dengan proteksi CSV Formula Injection)
    const rows = filteredInquiries.map(inq => {
      const company = inq.answers["company"] || inq.answers["company_name"] || "";
      const budget = inq.answers["budget"] || "";
      const timeline = inq.answers["timeline"] || "";

      return [
        sanitizeCsvCell(inq.id),
        sanitizeCsvCell(inq.name),
        sanitizeCsvCell(inq.email),
        sanitizeCsvCell(inq.phone || ""),
        sanitizeCsvCell(company),
        sanitizeCsvCell(budget),
        sanitizeCsvCell(timeline),
        sanitizeCsvCell(inq.status),
        sanitizeCsvCell(new Date(inq.createdAt).toISOString())
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inquiries_export_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pesan & Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola pesan masuk dari Discovery Form</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportToCSV}
            disabled={filteredInquiries.length === 0}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-4 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-500/20 disabled:opacity-50 dark:text-emerald-400"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download CSV</span>
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full sm:w-64 rounded-lg border border-border bg-background pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            aria-label="Filter status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
          >
            <option value="">Semua Status</option>
            <option value="NEW">Baru</option>
            <option value="CONTACTED">Dihubungi</option>
            <option value="DEAL">Deal</option>
            <option value="REJECTED">Ditolak</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {filteredInquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">Belum ada pesan masuk</h3>
            <p className="text-sm text-muted-foreground mt-1">Pesan dari Discovery Form akan muncul di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Pengirim</th>
                  <th className="px-6 py-4 font-medium">Kontak</th>
                  <th className="px-6 py-4 font-medium">Tanggal</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInquiries.map((inquiry, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={inquiry.id} 
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{inquiry.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-muted-foreground">{inquiry.email}</div>
                      {inquiry.phone && <div className="text-xs text-muted-foreground mt-0.5">{inquiry.phone}</div>}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(inquiry.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Halaman {page} dari {totalPages} ({total} total)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-background px-3 hover:bg-secondary disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-background px-3 hover:bg-secondary disabled:opacity-50"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Modal 
        isOpen={!!selectedInquiry} 
        onClose={() => setSelectedInquiry(null)}
        title="Inquiry Details"
        maxWidth="max-w-4xl"
      >
        {selectedInquiry && (
          <InquiryModal 
            inquiry={selectedInquiry} 
            onClose={() => setSelectedInquiry(null)}
            onStatusUpdated={(id, newStatus) => {
              mutate(
                (current) =>
                  current
                    ? {
                        ...current,
                        inquiries: current.inquiries.map((inq) =>
                          inq.id === id ? { ...inq, status: newStatus } : inq,
                        ),
                      }
                    : current,
                false,
              );
              setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
            }}
          />
        )}
      </Modal>
    </div>
  );
}
