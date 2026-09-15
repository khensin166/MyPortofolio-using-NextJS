import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ImageUpload from "@/common/components/elements/ImageUpload";
import { isFormDirty } from "@/common/utils/formatters";

export interface SkillFormData {
  title: string;
  category: string;
  imageSrc: string;
  isCoreSkill: boolean;
  color: string;
  tags: string[];
}

interface SkillFormProps {
  initialData?: any;
  onSubmit: (data: SkillFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DEFAULT_FORM_DATA: SkillFormData = {
  title: "",
  category: "Frontend",
  imageSrc: "",
  isCoreSkill: false,
  color: "#000000",
  tags: [],
};

const CATEGORIES = ["Frontend", "Backend", "Mobile", "Tools", "Design", "Database", "DevOps"];

export default function SkillForm({ initialData, onSubmit, onCancel, isSubmitting }: SkillFormProps) {
  const [formData, setFormData] = useState<SkillFormData>(DEFAULT_FORM_DATA);
  const [initialFormData, setInitialFormData] = useState<SkillFormData>(DEFAULT_FORM_DATA);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (initialData) {
      const initial = {
        title: initialData.title || "",
        category: initialData.category || "Frontend",
        imageSrc: initialData.imageSrc || "",
        isCoreSkill: !!initialData.isCoreSkill,
        color: initialData.color || "#000000",
        tags: initialData.tags || [],
      };
      setFormData(initial);
      setInitialFormData(initial);
    }
  }, [initialData]);

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

  const removeTag = (index: number) => {
    const newTags = [...formData.tags];
    newTags.splice(index, 1);
    setFormData({ ...formData, tags: newTags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title & Category */}
        <div className="space-y-1 md:col-span-1">
          <label className="text-sm font-medium">Skill Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. React, Node.js"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        
        <div className="space-y-1 md:col-span-1">
          <label className="text-sm font-medium">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Brand Color & Core Skill */}
        <div className="space-y-1 md:col-span-1">
          <label className="text-sm font-medium">Brand Color (HEX)</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="h-9 w-12 rounded cursor-pointer border border-border bg-background p-0.5"
            />
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="#FFFFFF"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary uppercase font-mono"
            />
          </div>
        </div>

        <div className="md:col-span-1 flex items-center pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isCoreSkill}
              onChange={(e) => setFormData({ ...formData, isCoreSkill: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <span className="text-sm font-medium">Core Skill (Highlight on Home)</span>
          </label>
        </div>

        {/* Image Source */}
        <div className="space-y-1 md:col-span-2">
          <ImageUpload
            value={formData.imageSrc}
            onChange={(url) => setFormData({ ...formData, imageSrc: url })}
            label="Icon URL / Image Source"
            placeholder="/icons/react.svg or https://..."
          />
        </div>

        {/* Tags */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">Tags (Press Enter)</label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="e.g. database, frontend, api"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium">
                {tag}
                <button type="button" onClick={() => removeTag(idx)} className="text-muted-foreground hover:text-destructive">&times;</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
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
          {initialData ? "Save Changes" : "Add Skill"}
        </button>
      </div>
    </form>
  );
}
