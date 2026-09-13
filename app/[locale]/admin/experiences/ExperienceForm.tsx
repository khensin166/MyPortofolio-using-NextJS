"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";

export interface ExperienceFormData {
  role: string;
  organisation: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  workSetting: string;
  employmentType: string;
  location: string;
  responsibilities: string[];
  whatILearned: string[];
  impact: string[];
  tags: string[];
  imageSrc: string;
}

interface ExperienceFormProps {
  initialData?: ExperienceFormData | null;
  onSubmit: (data: ExperienceFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ExperienceForm({ initialData, onSubmit, onCancel, isLoading }: ExperienceFormProps) {
  // Helper to safely extract array from the bilingual JSONB struct: { en: [...], id: [...] }
  const extractArray = (val: any): string[] => {
    if (!val) return [""];
    if (Array.isArray(val)) return val.length ? val : [""];
    if (val.en && Array.isArray(val.en)) return val.en.length ? val.en : [""];
    return [""];
  };

  const [formData, setFormData] = useState<ExperienceFormData>({
    role: initialData?.role || "",
    organisation: initialData?.organisation || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    isCurrent: initialData?.isCurrent || false,
    workSetting: initialData?.workSetting || "Onsite",
    employmentType: initialData?.employmentType || "Full-time",
    location: initialData?.location || "",
    responsibilities: initialData ? extractArray(initialData.responsibilities) : [""],
    whatILearned: initialData ? extractArray(initialData.whatILearned) : [""],
    impact: initialData ? extractArray(initialData.impact) : [""],
    tags: initialData?.tags && Array.isArray(initialData.tags) && initialData.tags.length ? initialData.tags : [""],
    imageSrc: initialData?.imageSrc || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ 
        ...prev, 
        [name]: checked,
        ...(name === "isCurrent" && checked ? { endDate: "" } : {})
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (field: keyof ExperienceFormData, index: number, value: string) => {
    setFormData((prev) => {
      const newArray = [...(prev[field] as string[])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: keyof ExperienceFormData) => {
    setFormData((prev) => ({ ...prev, [field]: [...(prev[field] as string[]), ""] }));
  };

  const removeArrayItem = (field: keyof ExperienceFormData, index: number) => {
    setFormData((prev) => {
      const newArray = [...(prev[field] as string[])];
      if (newArray.length > 1) newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean up empty array items before submitting
    const cleanedData = {
      ...formData,
      responsibilities: formData.responsibilities.filter((i) => i.trim() !== ""),
      whatILearned: formData.whatILearned.filter((i) => i.trim() !== ""),
      impact: formData.impact.filter((i) => i.trim() !== ""),
      tags: formData.tags.filter((i) => i.trim() !== ""),
    };
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Role / Position</label>
          <input required type="text" name="role" value={formData.role} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="e.g. Software Engineer" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Organisation</label>
          <input required type="text" name="organisation" value={formData.organisation} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="e.g. Google" />
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium">Start Date</label>
          <input required type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">End Date</label>
          <input type="date" name="endDate" value={formData.endDate || ""} onChange={handleChange} disabled={formData.isCurrent} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50" />
          <div className="mt-1 flex items-center gap-2">
            <input type="checkbox" id="isCurrent" name="isCurrent" checked={formData.isCurrent} onChange={handleChange} className="rounded text-primary" />
            <label htmlFor="isCurrent" className="text-xs text-muted-foreground">I currently work here</label>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Employment Type</label>
          <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Work Setting</label>
          <select name="workSetting" value={formData.workSetting} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
            <option value="Onsite">Onsite</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="text-sm font-medium">Location</label>
          <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="e.g. Jakarta, Indonesia" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-sm font-medium">Company Logo URL / Image Source</label>
          <input type="text" name="imageSrc" value={formData.imageSrc} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="https://..." />
        </div>
      </div>

      <ArrayInputSection title="Responsibilities" field="responsibilities" data={formData.responsibilities} onUpdate={handleArrayChange} onAdd={() => addArrayItem("responsibilities")} onRemove={(idx) => removeArrayItem("responsibilities", idx)} />
      <ArrayInputSection title="What I Learned" field="whatILearned" data={formData.whatILearned} onUpdate={handleArrayChange} onAdd={() => addArrayItem("whatILearned")} onRemove={(idx) => removeArrayItem("whatILearned", idx)} />
      <ArrayInputSection title="Impact / Achievements" field="impact" data={formData.impact} onUpdate={handleArrayChange} onAdd={() => addArrayItem("impact")} onRemove={(idx) => removeArrayItem("impact", idx)} />
      <ArrayInputSection title="Tags / Technologies" field="tags" data={formData.tags} onUpdate={handleArrayChange} onAdd={() => addArrayItem("tags")} onRemove={(idx) => removeArrayItem("tags", idx)} />

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button type="button" onClick={onCancel} disabled={isLoading} className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition-colors disabled:opacity-70">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialData ? "Update Experience" : "Save Experience"}
        </button>
      </div>
    </form>
  );
}

// Helper component for dynamic array inputs
function ArrayInputSection({ title, field, data, onUpdate, onAdd, onRemove }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{title}</label>
        <button type="button" onClick={onAdd} className="text-xs flex items-center gap-1 text-primary hover:underline">
          <Plus className="h-3 w-3" /> Add More
        </button>
      </div>
      {data.map((item: string, idx: number) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onUpdate(field, idx, e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder={`Enter ${title.toLowerCase()}...`}
          />
          <button type="button" onClick={() => onRemove(idx)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
