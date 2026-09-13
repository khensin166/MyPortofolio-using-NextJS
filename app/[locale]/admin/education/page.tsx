"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, Plus, Edit, Trash2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "@/common/components/elements/Modal";
import EducationForm, { EducationFormData } from "./EducationForm";
import { apiClient } from "@/common/services/apiClient";

interface Education {
  id: number;
  institutionName: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string | null;
  description?: string[];
  displayStartDate?: string;
  displayEndDate?: string;
  duration?: string;
  imageLogo?: string;
}

export default function AdminEducationPage() {
  const { token, isLoading: authLoading } = useAdminAuth();
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEducation = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await apiClient("/education");
      if (fetchError) throw new Error(fetchError);
      setEducationList(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchEducation();
  }, [token, authLoading]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this education record?")) return;
    try {
      const { error: deleteError } = await apiClient(`/education/${id}`, { method: "DELETE" });
      if (deleteError) throw new Error(deleteError);
      fetchEducation();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddClick = () => {
    setEditingEdu(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (edu: Education) => {
    setEditingEdu(edu);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: EducationFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingEdu ? `/education/${editingEdu.id}` : `/education`;
      const method = editingEdu ? "PUT" : "POST";

      const { error: submitError } = await apiClient(url, {
        method,
        body: JSON.stringify(data),
      });

      if (submitError) throw new Error(submitError);

      setIsModalOpen(false);
      fetchEducation();
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
          <h1 className="text-2xl font-bold tracking-tight">Education</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your educational background</p>
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition-all">
          <Plus className="h-4 w-4" />
          Add Education
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {educationList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <GraduationCap className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No education records found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Click 'Add Education' to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">School & Degree</th>
                  <th className="px-6 py-4 font-medium">Field of Study</th>
                  <th className="px-6 py-4 font-medium">Duration</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {educationList.map((edu, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={edu.id}
                    className="transition-colors hover:bg-secondary/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          {edu.imageLogo ? (
                            <img src={edu.imageLogo} alt={edu.institutionName} className="h-full w-full rounded-lg object-cover" />
                          ) : (
                            <GraduationCap className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{edu.institutionName}</div>
                          <div className="text-sm text-muted-foreground">{edu.degree}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{edu.major}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground">{edu.displayStartDate} - {edu.displayEndDate}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{edu.duration}</div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEditClick(edu)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(edu.id)}
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
        title={editingEdu ? "Edit Education" : "Add Education"}
        maxWidth="max-w-2xl"
      >
        <EducationForm
          // @ts-ignore
          initialData={editingEdu}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
