"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { isFormDirty } from "@/common/utils/formatters";

export interface ProfileFormData {
  heroDescription: string;
  aboutMe: string;
  location: string;
  resumeUrl: string;
  sourceLang: 'en' | 'id';
}

interface ProfileFormProps {
  initialData?: any;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading: boolean;
}

const DEFAULT_FORM_DATA: ProfileFormData = {
  heroDescription: "",
  aboutMe: "",
  location: "",
  resumeUrl: "",
  sourceLang: "en",
};

export default function ProfileForm({ initialData, onSubmit, isLoading }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>(DEFAULT_FORM_DATA);
  const [initialFormData, setInitialFormData] = useState<ProfileFormData>(DEFAULT_FORM_DATA);

  useEffect(() => {
    if (initialData) {
      const parseString = (val: any, lang: 'en' | 'id') => {
        if (typeof val === 'string') return val;
        if (typeof val === 'object' && val !== null) {
          return val[lang] || val.en || val.id || "";
        }
        return "";
      };

      const lang = initialData.sourceLang || 'en';
      
      const mapped = {
        sourceLang: lang,
        heroDescription: parseString(initialData.heroDescription, lang),
        aboutMe: parseString(initialData.aboutMe, lang),
        location: parseString(initialData.location, lang),
        resumeUrl: initialData.resumeUrl || "",
      };

      setFormData(mapped as ProfileFormData);
      setInitialFormData(mapped as ProfileFormData);
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      const parseString = (val: any, lang: 'en' | 'id') => {
        if (typeof val === 'string') return val;
        if (typeof val === 'object' && val !== null) {
          return val[lang] || val.en || val.id || "";
        }
        return "";
      };

      setFormData((prev) => ({
        ...prev,
        heroDescription: parseString(initialData.heroDescription, prev.sourceLang),
        aboutMe: parseString(initialData.aboutMe, prev.sourceLang),
        location: parseString(initialData.location, prev.sourceLang),
      }));
    }
  }, [formData.sourceLang, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-4 md:col-span-2">
          {/* Source Language Selection */}
          <div className="space-y-1 bg-primary/5 p-4 rounded-xl border border-primary/20 mb-4">
            <label className="text-sm font-medium flex items-center gap-2 text-primary">
              <Sparkles className="w-4 h-4" />
              Source Language (Auto Translate)
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Write your profile details in your preferred language. The backend will automatically generate the translation for Hero Description, About Me, and Location.
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

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">Hero Description ({formData.sourceLang === 'en' ? 'English' : 'Indonesian'})</label>
          <textarea
            required
            name="heroDescription"
            value={formData.heroDescription}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary min-h-[100px]"
            placeholder="e.g. I am a passionate software engineer..."
          />
          <p className="text-xs text-muted-foreground">Appears at the very top of your homepage.</p>
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">About Me ({formData.sourceLang === 'en' ? 'English' : 'Indonesian'})</label>
          <textarea
            name="aboutMe"
            value={formData.aboutMe}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary min-h-[150px]"
            placeholder="e.g. Born in Jakarta, I have always loved technology..."
          />
        </div>

        <div className="space-y-1 md:col-span-1">
          <label className="text-sm font-medium">Location ({formData.sourceLang === 'en' ? 'English' : 'Indonesian'})</label>
          <input
            type="text"
            required
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="e.g. Jakarta, Indonesia"
          />
        </div>

        <div className="space-y-1 md:col-span-1">
          <label className="text-sm font-medium">Resume / CV URL</label>
          <input
            type="url"
            name="resumeUrl"
            value={formData.resumeUrl}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="https://drive.google.com/..."
          />
        </div>

      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <button
          type="submit"
          disabled={isLoading || !isFormDirty(formData, initialFormData)}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50 transition-colors"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Profile
        </button>
      </div>
    </form>
  );
}
