"use client";

import { useState } from "react";
import { Loader2, Calendar, Mail, Phone, User, CheckCircle2 } from "lucide-react";
import type { Inquiry, InquiryStatus } from "@/common/types/discovery-form";
import { apiClient } from "@/common/services/apiClient";

interface InquiryModalProps {
  inquiry: Inquiry;
  onClose: () => void;
  onStatusUpdated: (id: string, newStatus: InquiryStatus) => void;
}

const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: "NEW", label: "New (Unread)" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "DEAL", label: "Deal / Won" },
  { value: "REJECTED", label: "Rejected / Lost" },
];

export default function InquiryModal({ inquiry, onClose, onStatusUpdated }: InquiryModalProps) {
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleStatusChange = async (newStatus: InquiryStatus) => {
    setIsUpdating(true);
    setError("");
    
    try {
      const { error: patchError } = await apiClient(`/inquiry/${inquiry.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      if (patchError) throw new Error(patchError);

      setStatus(newStatus);
      onStatusUpdated(inquiry.id, newStatus);
    } catch (err: any) {
      setError(err.message || "Failed to update status");
      // Revert status
      setStatus(inquiry.status);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Contact Details */}
        <div className="flex-1 space-y-6 rounded-xl border border-border bg-secondary/30 p-5">
          <h3 className="font-semibold text-lg border-b border-border pb-3">Contact Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium text-foreground">{inquiry.name}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium text-foreground">{inquiry.email}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="font-medium text-foreground">{inquiry.phone || "Not provided"}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Date Submitted</div>
                <div className="font-medium text-foreground">
                  {new Date(inquiry.createdAt).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Actions */}
        <div className="flex-1 space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-lg border-b border-border pb-3 mb-4">Manage Inquiry</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex items-center gap-3">
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
                  disabled={isUpdating}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />}
                {!isUpdating && status === inquiry.status && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />}
              </div>
              {error && <p className="text-xs text-destructive mt-1">{error}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-lg border-b border-border pb-3 mb-4">Form Answers</h3>
        
        {Object.keys(inquiry.answers).length === 0 ? (
          <p className="text-sm text-muted-foreground">No answers provided.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(inquiry.answers).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="text-sm text-muted-foreground font-medium">{key}</div>
                <div className="text-sm text-foreground bg-secondary/20 p-3 rounded-lg border border-border/50">
                  {typeof value === 'object' ? JSON.stringify(value) : value?.toString() || "-"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2 border-t border-border">
        <button
          onClick={onClose}
          className="rounded-lg bg-secondary px-6 py-2 text-sm font-medium text-foreground hover:brightness-110 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
