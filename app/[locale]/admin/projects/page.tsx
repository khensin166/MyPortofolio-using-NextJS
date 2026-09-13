"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, Plus, Edit, Trash2, LayoutTemplate } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "@/common/components/elements/Modal";
import ProjectForm, { ProjectFormData } from "./ProjectForm";
import { apiClient } from "@/common/services/apiClient";

interface Project {
  id: number;
  title: string;
  overview: any;
  description: any;
  features: any;
  imageSrc: string;
  tags: string[];
  demoUrl: string;
  sourceUrl: string;
  isFeatured: boolean;
  type: string[];
  category: string;
}

const parseArray = (val: any) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return val ? [val] : [];
    }
  }
  return val ? [val] : [];
};

export default function ProjectsPage() {
  const { token, isLoading: authLoading } = useAdminAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await apiClient("/projects");
      if (fetchError) throw new Error(fetchError);
      setProjects(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token || authLoading) return;
    fetchProjects();
  }, [token, authLoading]);

  const handleOpenModal = (project?: Project) => {
    setEditingData(project || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleSubmit = async (formData: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      if (editingData) {
        // Update
        const { error: updateError } = await apiClient(`/projects/${editingData.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        if (updateError) throw new Error(updateError);
      } else {
        // Create
        const { error: createError } = await apiClient("/projects", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        if (createError) throw new Error(createError);
      }
      
      await fetchProjects();
      handleCloseModal();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const { error: deleteError } = await apiClient(`/projects/${id}`, {
        method: "DELETE",
      });
      if (deleteError) throw new Error(deleteError);
      
      setProjects(projects.filter(p => p.id !== id));
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
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <LayoutTemplate className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No projects added yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Click the button above to add your first project.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Project</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Tags</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={project.id} 
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {project.imageSrc ? (
                          <div className="relative h-10 w-16 overflow-hidden rounded-md border border-border bg-muted shrink-0">
                            <img src={project.imageSrc} alt={project.title} className="object-cover h-full w-full" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-16 items-center justify-center rounded-md border border-border bg-secondary shrink-0 text-muted-foreground">
                            <LayoutTemplate className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-foreground">
                            {typeof project.title === 'object' ? (project.title as any)?.en || JSON.stringify(project.title) : project.title}
                          </div>
                          <div className="text-xs text-muted-foreground capitalize mt-0.5">
                            {parseArray(project.type).map((t: any) => typeof t === 'object' ? JSON.stringify(t) : t).join(", ")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {parseArray(project.tags).slice(0, 3).map((tag: any, i: number) => (
                          <span key={i} className="inline-flex items-center rounded text-[10px] font-medium bg-secondary/80 px-1.5 py-0.5 text-muted-foreground">
                            {typeof tag === 'object' ? (tag as any)?.en || JSON.stringify(tag) : tag}
                          </span>
                        ))}
                        {parseArray(project.tags).length > 3 && (
                          <span className="inline-flex items-center rounded text-[10px] font-medium bg-secondary/80 px-1.5 py-0.5 text-muted-foreground">
                            +{parseArray(project.tags).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {project.isFeatured ? (
                        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-500 ring-1 ring-inset ring-amber-500/20">
                          Featured
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
                          onClick={() => handleOpenModal(project)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id)}
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
        title={editingData ? "Edit Project" : "Add New Project"}
        maxWidth="max-w-4xl"
      >
        <ProjectForm
          initialData={editingData}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}
