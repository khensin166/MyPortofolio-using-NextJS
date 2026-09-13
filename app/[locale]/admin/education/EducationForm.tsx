"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";

export interface EducationFormData {
  institutionName: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string | null;
  description: string[];
  imageLogo: string;
}

interface EducationFormProps {
  initialData?: EducationFormData | null;
  onSubmit: (data: EducationFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function EducationForm({ initialData, onSubmit, onCancel, isLoading }: EducationFormProps) {
  // Helper to safely extract array from the bilingual JSONB struct
  const extractArray = (val: any): string[] => {
    if (!val) return [""];
    if (Array.isArray(val)) return val.length ? val : [""];
    if (val.en && Array.isArray(val.en)) return val.en.length ? val.en : [""];
    return [""];
  };

  const [formData, setFormData] = useState<EducationFormData>({
    institutionName: initialData?.institutionName || "",
    degree: initialData?.degree || "",
    major: initialData?.major || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    description: initialData ? extractArray(initialData.description) : [""],
    imageLogo: initialData?.imageLogo || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newArray = [...prev.description];
      newArray[index] = value;
      return { ...prev, description: newArray };
    });
  };

  const addArrayItem = () => {
    setFormData((prev) => ({ ...prev, description: [...prev.description, ""] }));
  };

  const removeArrayItem = (index: number) => {
    setFormData((prev) => {
      const newArray = [...prev.description];
      if (newArray.length > 1) newArray.splice(index, 1);
      return { ...prev, description: newArray };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      description: formData.description.filter((i) => i.trim() !== ""),
    };
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <label className="text-sm font-medium">School / University (Institution Name)</label>
          <input required type="text" name="institutionName" value={formData.institutionName} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="e.g. Universitas Indonesia" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Degree</label>
          <input required type="text" name="degree" value={formData.degree} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="e.g. Bachelor's" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Field of Study (Major)</label>
          <input required type="text" name="major" value={formData.major} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="e.g. Computer Science" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Start Date</label>
          <input required type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">End Date</label>
          <input type="date" name="endDate" value={formData.endDate || ""} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
          <p className="text-xs text-muted-foreground mt-1">Leave empty if currently studying</p>
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-sm font-medium">Logo URL / Image Source</label>
          <input type="text" name="imageLogo" value={formData.imageLogo} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="https://..." />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Description / Highlights</label>
          <button type="button" onClick={addArrayItem} className="text-xs flex items-center gap-1 text-primary hover:underline">
            <Plus className="h-3 w-3" /> Add More
          </button>
        </div>
        {formData.description.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(idx, e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="e.g. Graduated with Honors..."
            />
            <button type="button" onClick={() => removeArrayItem(idx)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button type="button" onClick={onCancel} disabled={isLoading} className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition-colors disabled:opacity-70">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialData ? "Update Education" : "Save Education"}
        </button>
      </div>
    </form>
  );
}
