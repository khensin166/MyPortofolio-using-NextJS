"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, Plus, Edit, Trash2, FileText, Eye, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "@/common/components/elements/Modal";
import ArticleForm, { ArticleFormData } from "./ArticleForm";
import { apiClient } from "@/common/services/apiClient";
import { getDirectImageUrl } from "@/common/utils/formatters";

interface ArticleSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  isPublished: boolean;
  viewCount: number;
  publishedDate: string;
}

export default function AdminArticlesPage() {
  const { token, isLoading: authLoading } = useAdminAuth();
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null); // Full article
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingFull, setIsFetchingFull] = useState(false);

  const fetchArticles = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await apiClient("/articles");
      if (fetchError) throw new Error(fetchError);
      setArticles(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchArticles();
  }, [token, authLoading]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const { error: deleteError } = await apiClient(`/articles/${id}`, { method: "DELETE" });
      if (deleteError) throw new Error(deleteError);
      fetchArticles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddClick = () => {
    setEditingArticle(null);
    setIsModalOpen(true);
  };

  const handleEditClick = async (article: ArticleSummary) => {
    try {
      setIsFetchingFull(true);
      // Fetch full content including blocks
      const { data, error: fetchError } = await apiClient(`/articles/${article.slug}`);
      if (fetchError) throw new Error(fetchError);
      setEditingArticle(data);
      setIsModalOpen(true);
    } catch (err: any) {
      alert("Failed to load full article: " + err.message);
    } finally {
      setIsFetchingFull(false);
    }
  };

  const handleFormSubmit = async (data: ArticleFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingArticle ? `/articles/${editingArticle.id}` : `/articles`;
      const method = editingArticle ? "PUT" : "POST";

      const { error: submitError } = await apiClient(url, {
        method,
        body: JSON.stringify(data),
      });

      if (submitError) throw new Error(submitError);

      setIsModalOpen(false);
      fetchArticles();
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
          <h1 className="text-2xl font-bold tracking-tight">Articles & Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">Write and manage your blog posts</p>
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition-all">
          <Plus className="h-4 w-4" />
          Write Article
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {isFetchingFull && (
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm text-primary flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading full article content...
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No articles found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Click 'Write Article' to create your first blog post.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Article</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Stats</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {articles.map((article, idx) => {
                  const title = typeof article.title === 'string' ? article.title : (article.title as any)?.en || "Untitled";
                  const excerpt = typeof article.excerpt === 'string' ? article.excerpt : (article.excerpt as any)?.en || "No excerpt";
                  
                  return (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={article.id}
                      className="transition-colors hover:bg-secondary/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary overflow-hidden">
                            {article.coverImage ? (
                              <img src={getDirectImageUrl(article.coverImage)} alt={title} className="h-full w-full object-cover" />
                            ) : (
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="max-w-[300px]">
                            <div className="font-medium text-foreground truncate">{title}</div>
                            <div className="text-xs text-muted-foreground truncate mt-0.5">{excerpt}</div>
                            <div className="text-[10px] text-muted-foreground/50 mt-1">/{article.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {article.isPublished ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                            <XCircle className="h-3 w-3" /> Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span className="text-xs font-medium">{article.viewCount || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => handleEditClick(article)}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          disabled={isFetchingFull}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(article.id)}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title={editingArticle ? "Edit Article" : "Write Article"}
        maxWidth="max-w-4xl" // Wider modal for the markdown editor
      >
        <ArticleForm
          initialData={editingArticle}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
