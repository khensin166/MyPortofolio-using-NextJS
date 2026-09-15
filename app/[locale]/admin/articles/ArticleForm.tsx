"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, LayoutTemplate } from "lucide-react";
import ImageUpload from "@/common/components/elements/ImageUpload";
import { isFormDirty } from "@/common/utils/formatters";

export interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  isPublished: boolean;
  content: { blocks: any[] };
  sourceLang: 'en' | 'id';
}

interface ArticleFormProps {
  initialData?: any;
  onSubmit: (data: ArticleFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const DEFAULT_FORM_DATA: ArticleFormData = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  isPublished: false,
  content: { blocks: [{ type: "markdown", data: { text: "" } }] },
  sourceLang: "en",
};

export default function ArticleForm({ initialData, onSubmit, onCancel, isLoading }: ArticleFormProps) {
  const [formData, setFormData] = useState<ArticleFormData>(DEFAULT_FORM_DATA);
  const [initialFormData, setInitialFormData] = useState<ArticleFormData>(DEFAULT_FORM_DATA);
  const [markdownText, setMarkdownText] = useState("");
  const [initialMarkdown, setInitialMarkdown] = useState("");

  useEffect(() => {
    if (initialData) {
      const lang = initialData.sourceLang || 'en';
      
      const parseString = (val: any, lang: 'en' | 'id') => {
        if (typeof val === 'string') return val;
        if (typeof val === 'object' && val !== null) {
          return val[lang] || val.en || val.id || "";
        }
        return "";
      };

      // Extract markdown from blocks
      let initialMarkdownValue = "";
      const contentData = initialData.content?.[lang] || initialData.content;
      if (contentData && Array.isArray(contentData.blocks)) {
        // If it's a markdown block we created
        if (contentData.blocks.length === 1 && contentData.blocks[0].type === "markdown") {
          initialMarkdownValue = contentData.blocks[0].data?.text || "";
        } else {
          // Fallback if they used actual EditorJS
          initialMarkdownValue = contentData.blocks.map((b: any) => b.data?.text || "").join("\n\n");
        }
      }

      const initial = {
        sourceLang: lang,
        title: parseString(initialData.title, lang),
        slug: initialData.slug || "",
        excerpt: parseString(initialData.excerpt, lang),
        coverImage: initialData.coverImage || "",
        isPublished: !!initialData.isPublished,
        content: initialData.content || { blocks: [{ type: "markdown", data: { text: initialMarkdownValue } }] },
      };

      setFormData(initial as ArticleFormData);
      setInitialFormData(initial as ArticleFormData);
      setMarkdownText(initialMarkdownValue);
      setInitialMarkdown(initialMarkdownValue);
    }
  }, [initialData]);

  // Effect to update fields when sourceLang changes while editing
  useEffect(() => {
    if (initialData) {
      const parseString = (val: any, lang: 'en' | 'id') => {
        if (typeof val === 'string') return val;
        if (typeof val === 'object' && val !== null) {
          return val[lang] || val.en || val.id || "";
        }
        return "";
      };

      const contentData = initialData.content?.[formData.sourceLang] || initialData.content;
      let initialMarkdownValue = "";
      if (contentData && Array.isArray(contentData.blocks)) {
        if (contentData.blocks.length === 1 && contentData.blocks[0].type === "markdown") {
          initialMarkdownValue = contentData.blocks[0].data?.text || "";
        } else {
          initialMarkdownValue = contentData.blocks.map((b: any) => b.data?.text || "").join("\n\n");
        }
      }

      setFormData((prev) => ({
        ...prev,
        title: parseString(initialData.title, prev.sourceLang),
        excerpt: parseString(initialData.excerpt, prev.sourceLang),
      }));
      
      setMarkdownText(initialMarkdownValue);
    }
  }, [formData.sourceLang, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Repackage markdown into blocks format for backend translator
    const packagedData = {
      ...formData,
      content: {
        blocks: [
          {
            type: "markdown",
            data: { text: markdownText }
          }
        ]
      }
    };
    
    // Generate slug if empty
    if (!packagedData.slug && packagedData.title) {
      packagedData.slug = packagedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
    
    onSubmit(packagedData);
  };

  const isDirty = initialData 
    ? (isFormDirty(formData, initialFormData) || markdownText !== initialMarkdown)
    : true;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Language Selection */}
        <div className="space-y-4 md:col-span-2">
          <div className="space-y-1 bg-primary/5 p-4 rounded-xl border border-primary/20 mb-2">
            <label className="text-sm font-medium flex items-center gap-2 text-primary">
              <Sparkles className="w-4 h-4" />
              Source Language (Auto Translate)
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Write in your preferred language. The backend will automatically generate the other language version for Title, Excerpt, and Markdown Content when you save.
            </p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sourceLang"
                  value="en"
                  checked={formData.sourceLang === 'en'}
                  onChange={() => setFormData({ ...formData, sourceLang: 'en' })}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">English</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sourceLang"
                  value="id"
                  checked={formData.sourceLang === 'id'}
                  onChange={() => setFormData({ ...formData, sourceLang: 'id' })}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">Indonesian</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-1 md:col-span-1">
          <label className="text-sm font-medium">Title ({formData.sourceLang === 'en' ? 'English' : 'Indonesian'})</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-1 md:col-span-1">
          <label className="text-sm font-medium">Slug / URL Path</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="leave empty to auto-generate"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">Excerpt ({formData.sourceLang === 'en' ? 'English' : 'Indonesian'})</label>
          <textarea
            name="excerpt"
            required
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary min-h-[80px]"
          />
        </div>
        
        <div className="md:col-span-2 flex items-center pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <span className="text-sm font-medium">Publish Article (Make public)</span>
          </label>
        </div>

        <div className="space-y-1 md:col-span-2">
          <ImageUpload
            value={formData.coverImage}
            onChange={(url) => setFormData({ ...formData, coverImage: url })}
            label="Cover Image"
          />
        </div>

        <div className="space-y-1 md:col-span-2 mt-4">
          <label className="text-sm font-medium flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4" />
            Markdown Content ({formData.sourceLang === 'en' ? 'English' : 'Indonesian'})
          </label>
          <textarea
            required
            value={markdownText}
            onChange={(e) => setMarkdownText(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary min-h-[350px] font-mono leading-relaxed"
            placeholder="## Section Title\n\nWrite your blog post here using Markdown..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !isDirty}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50 transition-colors"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialData ? "Save Changes" : "Create Article"}
        </button>
      </div>
    </form>
  );
}
