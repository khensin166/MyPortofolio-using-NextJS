"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, Plus, Edit, Trash2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "@/common/components/elements/Modal";
import ExperienceForm, { ExperienceFormData } from "./ExperienceForm";
import { apiClient } from "@/common/services/apiClient";

interface Experience {
  id: number;
  role: string;
  organisation: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  workSetting: string;
  employmentType: string;
  location: string;
  displayStartDate?: string;
  displayEndDate?: string;
  duration?: string;
}

export default function AdminExperiencesPage() {
  const { token, isLoading: authLoading } = useAdminAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchExperiences = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await apiClient("/experiences");
      if (fetchError) throw new Error(fetchError);
      setExperiences(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchExperiences();
  }, [token, authLoading]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      const { error: deleteError } = await apiClient(`/experiences/${id}`, { method: "DELETE" });
      if (deleteError) throw new Error(deleteError);
      fetchExperiences();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddClick = () => {
    setEditingExp(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (exp: Experience) => {
    setEditingExp(exp);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: ExperienceFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingExp ? `/experiences/${editingExp.id}` : `/experiences`;
      const method = editingExp ? "PUT" : "POST";

      const { error: submitError } = await apiClient(url, {
        method,
        body: JSON.stringify(data),
      });

      if (submitError) throw new Error(submitError);

      setIsModalOpen(false);
      fetchExperiences();
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
          <h1 className="text-2xl font-bold tracking-tight">Experiences</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your work history and roles</p>
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition-all">
          <Plus className="h-4 w-4" />
          Add Experience
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {experiences.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Briefcase className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No experiences found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Click 'Add Experience' to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Role & Organisation</th>
                  <th className="px-6 py-4 font-medium">Duration</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {experiences.map((exp, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={exp.id}
                    className="transition-colors hover:bg-secondary/30"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{exp.role}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{exp.organisation}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground">{exp.displayStartDate} - {exp.displayEndDate}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{exp.duration}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                        {exp.employmentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEditClick(exp)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(exp.id)}
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
        title={editingExp ? "Edit Experience" : "Add Experience"}
        maxWidth="max-w-2xl"
      >
        <ExperienceForm
          // @ts-ignore
          initialData={editingExp}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
