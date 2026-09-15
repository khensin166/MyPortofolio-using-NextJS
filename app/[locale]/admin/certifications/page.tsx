"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, Plus, Edit, Trash2, Award } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "@/common/components/elements/Modal";
import CertificationForm, { CertificationFormData } from "./CertificationForm";
import { apiClient } from "@/common/services/apiClient";
import { getDirectImageUrl } from "@/common/utils/formatters";

interface Certification {
  id: number;
  title: string;
  issuer: string;
  credentialId: string;
  credentialUrl: string;
  issueDate: string;
  expirationDate: string | null;
  displayIssueDate?: string;
  displayExpirationDate?: string;
  imageLogo?: string;
  tags?: string[];
  categories?: string[];
}

export default function AdminCertificationsPage() {
  const { token, isLoading: authLoading } = useAdminAuth();
  const [certificationsList, setCertificationsList] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCertifications = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await apiClient("/certifications");
      if (fetchError) throw new Error(fetchError);
      setCertificationsList(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchCertifications();
  }, [token, authLoading]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    try {
      const { error: deleteError } = await apiClient(`/certifications/${id}`, { method: "DELETE" });
      if (deleteError) throw new Error(deleteError);
      fetchCertifications();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddClick = () => {
    setEditingCert(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (cert: Certification) => {
    setEditingCert(cert);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: CertificationFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingCert ? `/certifications/${editingCert.id}` : `/certifications`;
      const method = editingCert ? "PUT" : "POST";

      const { error: submitError } = await apiClient(url, {
        method,
        body: JSON.stringify(data),
      });

      if (submitError) throw new Error(submitError);

      setIsModalOpen(false);
      fetchCertifications();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your credentials and certifications</p>
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition-all">
          <Plus className="h-4 w-4" />
          Add Certification
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {certificationsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Award className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No certifications found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Click 'Add Certification' to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Certification</th>
                  <th className="px-6 py-4 font-medium">Issuer</th>
                  <th className="px-6 py-4 font-medium">Dates</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {certificationsList.map((cert, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={cert.id}
                    className="transition-colors hover:bg-secondary/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          {cert.imageLogo ? (
                            <img src={getDirectImageUrl(cert.imageLogo)} alt={cert.title} className="h-full w-full rounded-lg object-contain p-1 bg-white" />
                          ) : (
                            <Award className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{cert.title}</div>
                          {cert.credentialId && (
                            <div className="text-xs text-muted-foreground mt-0.5">ID: {cert.credentialId}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{cert.issuer}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground">{cert.displayIssueDate} - {cert.displayExpirationDate}</div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEditClick(cert)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(cert.id)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title={editingCert ? "Edit Certification" : "Add Certification"}
        maxWidth="max-w-2xl"
      >
        <CertificationForm
          initialData={editingCert}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
