import { useState, useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";
import ImageUpload from "@/common/components/elements/ImageUpload";
import { isFormDirty } from "@/common/utils/formatters";

export interface ProjectFormData {
  title: string;
  overview: string;
  description: string;
  features: string[];
  imageSrc: string;
  tags: string[];
  demoUrl: string;
  sourceUrl: string;
  isFeatured: boolean;
  type: string[];
  category: string;
  sourceLang: 'en' | 'id';
}

interface ProjectFormProps {
  initialData?: any; // any from backend
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DEFAULT_FORM_DATA: ProjectFormData = {
  title: "",
  overview: "",
  description: "",
  features: [],
  imageSrc: "",
  tags: [],
  demoUrl: "",
  sourceUrl: "",
  isFeatured: false,
  type: [],
  category: "Personal Project",
  sourceLang: "en",
};

export default function ProjectForm({ initialData, onSubmit, onCancel, isSubmitting }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>(DEFAULT_FORM_DATA);
  const [initialFormData, setInitialFormData] = useState<ProjectFormData>(DEFAULT_FORM_DATA);
  const [tagInput, setTagInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    if (initialData) {
      // Safe parsing for stringified arrays
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

      // Safe string extraction for textarea
      const parseString = (val: any, lang: 'en' | 'id') => {
        if (typeof val === 'string') return val;
        if (typeof val === 'object' && val !== null) {
          return val[lang] || val.en || val.id || "";
        }
        return "";
      };

      const lang = initialData.sourceLang || 'en';

      const initial = {
        sourceLang: lang,
        title: initialData.title || "",
        overview: parseString(initialData.overview?.[lang] || initialData.overview, lang),
        description: parseString(initialData.description?.[lang] || initialData.description, lang),
        features: parseArray(initialData.features?.[lang] || initialData.features),
        imageSrc: initialData.imageSrc || "",
        tags: parseArray(initialData.tags),
        demoUrl: initialData.demoUrl || "",
        sourceUrl: initialData.sourceUrl || "",
        isFeatured: !!initialData.isFeatured,
        type: parseArray(initialData.type),
        category: initialData.category || "Personal Project",
      };

      setFormData(initial as ProjectFormData);
      setInitialFormData(initial as ProjectFormData);
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

      setFormData((prev) => ({
        ...prev,
        overview: parseString(initialData.overview?.[prev.sourceLang] || initialData.overview, prev.sourceLang),
        description: parseString(initialData.description?.[prev.sourceLang] || initialData.description, prev.sourceLang),
        features: parseArray(initialData.features?.[prev.sourceLang] || initialData.features)
      }));
    }
  }, [formData.sourceLang, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleAddType = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && typeInput.trim()) {
      e.preventDefault();
      setFormData({ ...formData, type: [...formData.type, typeInput.trim()] });
      setTypeInput("");
    }
  };

  const handleAddFeature = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && featureInput.trim()) {
      e.preventDefault();
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput("");
    }
  };

  const removeArrayItem = (field: 'tags' | 'type', index: number) => {
    const newArr = [...formData[field]];
    newArr.splice(index, 1);
    setFormData({ ...formData, [field]: newArr });
  };

  const removeFeature = (index: number) => {
    const updated = [...formData.features];
    updated.splice(index, 1);
    setFormData({ ...formData, features: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info */}
        <div className="space-y-4 md:col-span-2">
          {/* Source Language Selection */}
          <div className="space-y-1 bg-primary/5 p-4 rounded-xl border border-primary/20 mb-4">
            <label className="text-sm font-medium flex items-center gap-2 text-primary">
              <Sparkles className="w-4 h-4" />
              Source Language (Auto Translate)
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Write in your preferred language. The backend Google Translate API will automatically generate the other language version for Overview, Description, and Features when you save.
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

          <div className="space-y-1">
            <label className="text-sm font-medium">Project Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="Personal Project">Personal Project</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
                <option value="Hackerrank">Hackerrank</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer">
                Featured Project (Show on Homepage)
              </label>
            </div>
          </div>
        </div>

        {/* URLs */}
        <div className="space-y-1 md:col-span-1">
          <label className="text-sm font-medium">Demo URL</label>
          <input
            type="url"
            value={formData.demoUrl}
            onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="space-y-1 md:col-span-1">
          <label className="text-sm font-medium">Source URL (GitHub/GitLab)</label>
          <input
            type="url"
            value={formData.sourceUrl}
            onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        
        <div className="space-y-1 md:col-span-2">
          <ImageUpload
            value={formData.imageSrc}
            onChange={(url) => setFormData({ ...formData, imageSrc: url })}
            label="Image Source URL / Project Banner"
            placeholder="/images/projects/project1.png or https://..."
          />
        </div>

        {/* Arrays: Tags & Type */}
        <div className="space-y-1 md:col-span-1">
          <label className="text-sm font-medium">Technologies (Tags) (Press Enter)</label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium">
                {tag}
                <button type="button" onClick={() => removeArrayItem('tags', idx)} className="text-muted-foreground hover:text-destructive">&times;</button>
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-1 md:col-span-1">
          <label className="text-sm font-medium">Platform Type (Press Enter)</label>
          <input
            type="text"
            value={typeInput}
            onChange={(e) => setTypeInput(e.target.value)}
            onKeyDown={handleAddType}
            placeholder="Web, Mobile, etc."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.type.map((t, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium">
                {t}
                <button type="button" onClick={() => removeArrayItem('type', idx)} className="text-muted-foreground hover:text-destructive">&times;</button>
              </span>
            ))}
          </div>
        </div>

        {/* Translation Fields */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">Overview ({formData.sourceLang === 'en' ? 'English' : 'Indonesian'})</label>
          <textarea
            required
            value={formData.overview}
            onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary min-h-[80px]"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">Full Description ({formData.sourceLang === 'en' ? 'English' : 'Indonesian'})</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary min-h-[120px]"
          />
        </div>

        {/* Features list */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">Features ({formData.sourceLang === 'en' ? 'English' : 'Indonesian'}) (Press Enter)</label>
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={handleAddFeature}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <ul className="list-disc pl-5 text-xs text-muted-foreground mt-2 space-y-1">
            {(Array.isArray(formData.features) ? formData.features : []).map((feat, idx) => (
              <li key={idx} className="flex items-center justify-between group">
                <span>{typeof feat === 'object' ? (feat as any)?.[formData.sourceLang] || JSON.stringify(feat) : feat}</span>
                <button type="button" onClick={() => removeFeature(idx)} className="text-destructive opacity-0 group-hover:opacity-100">&times;</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || (initialData && !isFormDirty(formData, initialFormData))}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50 transition-colors"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialData ? "Save Changes" : "Create Project"}
        </button>
      </div>
    </form>
  );
}
