"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, X } from "lucide-react";
import ImageUpload from "@/common/components/elements/ImageUpload";
import { isFormDirty } from "@/common/utils/formatters";

export interface CertificationFormData {
  title: string;
  issuer: string;
  credentialId: string;
  credentialUrl: string;
  issueDate: string;
  expirationDate: string | null;
  imageLogo: string;
  tags: string[];
  categories: string[];
}

interface CertificationFormProps {
  initialData?: any;
  onSubmit: (data: CertificationFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function CertificationForm({ initialData, onSubmit, onCancel, isLoading }: CertificationFormProps) {
  const extractArray = (val: any): string[] => {
    if (!val) return [""];
    if (Array.isArray(val)) return val.length ? val : [""];
    return [""];
  };

  const formatMonthYear = (dateStr?: string | null) => {
    if (!dateStr) return "";
    // If it's already YYYY-MM
    if (dateStr.length === 7) return dateStr;
    // If it's YYYY-MM-DD
    if (dateStr.length >= 10) return dateStr.substring(0, 7);
    return dateStr;
  };

  const [formData, setFormData] = useState<CertificationFormData>({
    title: initialData?.title || "",
    issuer: initialData?.issuer || "",
    credentialId: initialData?.credentialId || "",
    credentialUrl: initialData?.credentialUrl || "",
    issueDate: formatMonthYear(initialData?.issueDate),
    expirationDate: formatMonthYear(initialData?.expirationDate) || "",
    imageLogo: initialData?.imageLogo || "",
    tags: initialData ? extractArray(initialData.tags) : ["Professional"],
    categories: initialData ? extractArray(initialData.categories) : ["General"],
  });

  const [initialFormData, setInitialFormData] = useState<CertificationFormData | null>(null);

  useEffect(() => {
    const initial = {
      title: initialData?.title || "",
      issuer: initialData?.issuer || "",
      credentialId: initialData?.credentialId || "",
      credentialUrl: initialData?.credentialUrl || "",
      issueDate: formatMonthYear(initialData?.issueDate),
      expirationDate: formatMonthYear(initialData?.expirationDate) || "",
      imageLogo: initialData?.imageLogo || "",
      tags: initialData ? extractArray(initialData.tags) : ["Professional"],
      categories: initialData ? extractArray(initialData.categories) : ["General"],
    };
    setFormData(initial);
    setInitialFormData(initial);
  }, [initialData]);

  const [noExpiration, setNoExpiration] = useState(!initialData?.expirationDate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setNoExpiration(checked);
    if (checked) {
      setFormData((prev) => ({ ...prev, expirationDate: "" }));
    }
  };

  const handleArrayChange = (field: "tags" | "categories", index: number, value: string) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: "tags" | "categories") => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (field: "tags" | "categories", index: number) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      if (newArray.length > 1) newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      tags: formData.tags.filter((i) => i.trim() !== ""),
      categories: formData.categories.filter((i) => i.trim() !== ""),
      expirationDate: noExpiration ? null : (formData.expirationDate ? `${formData.expirationDate}-01` : null),
      issueDate: formData.issueDate ? `${formData.issueDate}-01` : "",
    };
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <label className="text-sm font-medium">Certification Name</label>
          <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="e.g. AWS Certified Solutions Architect" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Issuing Organization</label>
          <input required type="text" name="issuer" value={formData.issuer} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="e.g. Amazon Web Services" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Credential ID</label>
          <input type="text" name="credentialId" value={formData.credentialId} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="e.g. AWS-123456" />
        </div>
        
        <div className="space-y-1 sm:col-span-2">
          <label className="text-sm font-medium">Credential URL</label>
          <input type="url" name="credentialUrl" value={formData.credentialUrl} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="https://..." />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Issue Date</label>
          <input required type="month" name="issueDate" value={formData.issueDate} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Expiration Date</label>
          <input type="month" name="expirationDate" value={formData.expirationDate || ""} onChange={handleChange} disabled={noExpiration} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50" />
          <div className="mt-1 flex items-center gap-2">
            <input type="checkbox" id="noExpiration" checked={noExpiration} onChange={handleCheckboxChange} className="rounded text-primary" />
            <label htmlFor="noExpiration" className="text-xs text-muted-foreground">This credential does not expire</label>
          </div>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <ImageUpload
            value={formData.imageLogo}
            onChange={(url) => setFormData({ ...formData, imageLogo: url })}
            label="Organization Logo / Image Source"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ArrayInputSection title="Tags (e.g. Cloud, Security)" field="tags" data={formData.tags} onUpdate={handleArrayChange} onAdd={() => addArrayItem("tags")} onRemove={(idx: number) => removeArrayItem("tags", idx)} />
        <ArrayInputSection title="Categories (e.g. Professional)" field="categories" data={formData.categories} onUpdate={handleArrayChange} onAdd={() => addArrayItem("categories")} onRemove={(idx: number) => removeArrayItem("categories", idx)} />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button type="button" onClick={onCancel} disabled={isLoading} className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isLoading || (initialFormData ? !isFormDirty(formData, initialFormData) : false)} 
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition-colors disabled:opacity-70"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialData ? "Update Certification" : "Save Certification"}
        </button>
      </div>
    </form>
  );
}

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
