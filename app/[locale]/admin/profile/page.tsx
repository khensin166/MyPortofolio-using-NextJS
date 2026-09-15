"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { apiClient } from "@/common/services/apiClient";
import ProfileForm, { ProfileFormData } from "./ProfileForm";
import { Loader2, AlertCircle, CheckCircle2, Edit2, MapPin, FileText, Globe } from "lucide-react";

export default function ProfileAdminPage() {
  const { token, isLoading: authLoading } = useAdminAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token || authLoading) return;

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await apiClient("/profile");
        
        if (fetchError) throw new Error(fetchError);
        setProfileData(data || {});
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, authLoading]);

  const handleSubmit = async (formData: ProfileFormData) => {
    try {
      setIsSaving(true);
      setError("");
      setSuccess(false);

      const { error: submitError } = await apiClient("/profile", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (submitError) throw new Error(submitError);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Update local state if needed
      setProfileData({ ...profileData, ...formData });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal details, hero description, and resume link.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 flex items-center gap-3 text-sm text-destructive">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
          Profile updated successfully!
        </div>
      )}

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {!isEditing ? (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">Current Profile Data</h2>
                <p className="text-sm text-muted-foreground mt-1">This information is displayed publicly on your website.</p>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4 md:col-span-2">
                <div className="rounded-lg bg-secondary/30 p-4 border border-border/50">
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                    <Globe className="h-3 w-3" /> Hero Description
                  </div>
                  <p className="text-sm">{profileData?.heroDescription?.en || profileData?.heroDescription || "Not set"}</p>
                </div>
              </div>
              
              <div className="space-y-4 md:col-span-2">
                <div className="rounded-lg bg-secondary/30 p-4 border border-border/50">
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                    <FileText className="h-3 w-3" /> About Me
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{profileData?.aboutMe?.en || profileData?.aboutMe || "Not set"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-secondary/30 p-4 border border-border/50">
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Location
                  </div>
                  <p className="text-sm">{profileData?.location?.en || profileData?.location || "Not set"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-secondary/30 p-4 border border-border/50">
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Resume Link
                  </div>
                  {profileData?.resumeUrl ? (
                    <a href={profileData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate block">
                      {profileData.resumeUrl}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not set</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
            <ProfileForm
              initialData={profileData}
              onSubmit={handleSubmit}
              isLoading={isSaving}
            />
          </div>
        )}
      </div>
    </div>
  );
}
