"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, Plus, Edit, Trash2, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "@/common/components/elements/Modal";
import SkillForm, { SkillFormData } from "./SkillForm";
import { apiClient } from "@/common/services/apiClient";
import { IconResolver } from "@/common/utils/iconResolver";

interface Skill {
  id: number;
  title: string;
  category: string;
  imageSrc: string;
  isCoreSkill: boolean;
  color: string;
  tags: string[];
}

export default function SkillsPage() {
  const { token, isLoading: authLoading } = useAdminAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await apiClient("/skills");
      if (fetchError) throw new Error(fetchError);
      setSkills(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token || authLoading) return;
    fetchSkills();
  }, [token, authLoading]);

  const handleOpenModal = (skill?: Skill) => {
    setEditingData(skill || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleSubmit = async (formData: SkillFormData) => {
    setIsSubmitting(true);
    try {
      if (editingData) {
        // Update
        const { error: updateError } = await apiClient(`/skills/${editingData.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        if (updateError) throw new Error(updateError);
      } else {
        // Create
        const { error: createError } = await apiClient("/skills", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        if (createError) throw new Error(createError);
      }
      
      await fetchSkills();
      handleCloseModal();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    
    try {
      const { error: deleteError } = await apiClient(`/skills/${id}`, {
        method: "DELETE",
      });
      if (deleteError) throw new Error(deleteError);
      
      setSkills(skills.filter(p => p.id !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
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
          <h1 className="text-2xl font-bold tracking-tight">Skills</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your tech stack and expertise</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Cpu className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No skills added yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Click the button above to add your first skill.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Skill</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {skills.map((skill, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={skill.id} 
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {skill.imageSrc ? (
                          <div className="relative h-10 w-10 overflow-hidden shrink-0 flex items-center justify-center" style={{ backgroundColor: skill.color ? `${skill.color}20` : 'transparent', borderRadius: '8px', color: skill.color || 'inherit' }}>
                            <IconResolver iconNameOrUrl={skill.imageSrc} size={24} className="object-contain" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary shrink-0 text-muted-foreground">
                            <Cpu className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-foreground">{skill.title}</div>
                          {skill.color && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: skill.color }} />
                              <span className="text-[10px] text-muted-foreground font-mono uppercase">{skill.color}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {skill.isCoreSkill ? (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary ring-1 ring-inset ring-primary/20">
                          Core Skill
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-1 text-[10px] font-medium text-gray-500 ring-1 ring-inset ring-gray-500/20">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(skill)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(skill.id)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
        onClose={handleCloseModal}
        title={editingData ? "Edit Skill" : "Add New Skill"}
        maxWidth="max-w-2xl"
      >
        <SkillForm
          initialData={editingData}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}
