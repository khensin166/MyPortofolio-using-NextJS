"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, Save, FileJson, AlertCircle, CheckCircle, LayoutTemplate } from "lucide-react";
import { motion } from "framer-motion";
import { apiClient } from "@/common/services/apiClient";
import type { FormStep } from "@/common/types/discovery-form";
import VisualBuilder from "./VisualBuilder";

export default function FormBuilderPage() {
  const { token, isLoading: authLoading } = useAdminAuth();
  const [configId, setConfigId] = useState<string>("");
  const [configName, setConfigName] = useState<string>("");
  const [schema, setSchema] = useState<FormStep[]>([]);
  const [schemaJson, setSchemaJson] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"visual" | "json">("visual");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!token || authLoading) return;

    const fetchConfig = async () => {
      try {
        const { data, error } = await apiClient("/form-config");
        
        if (error) throw new Error(error);

        if (data) {
          setConfigId(data.id);
          setConfigName(data.name);
          setSchema(data.schema);
          setSchemaJson(JSON.stringify(data.schema, null, 2));
        }
      } catch (err: any) {
        setMessage({ type: "error", text: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [token, authLoading]);

  const handleSave = async () => {
    setMessage({ type: "", text: "" });
    setIsSaving(true);
    
    try {
      // Validate schema based on active tab
      let payloadSchema = schema;
      if (activeTab === "json") {
        try {
          payloadSchema = JSON.parse(schemaJson);
        } catch (e) {
          throw new Error("Format JSON tidak valid. Harap periksa kembali sintaksnya.");
        }
      }

      const { error } = await apiClient(`/form-config/${configId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: configName,
          isActive: true,
          schema: payloadSchema
        })
      });

      if (error) throw new Error(error);
      
      // Update both states to stay in sync
      if (activeTab === "json") setSchema(payloadSchema);
      else setSchemaJson(JSON.stringify(payloadSchema, null, 2));

      setMessage({ type: "success", text: "Konfigurasi form berhasil disimpan!" });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
      
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
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
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Form Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola pertanyaan dan langkah Discovery Form</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50 transition-all"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan Perubahan
        </button>
      </div>

      {message.text && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 rounded-lg p-4 text-sm ${
            message.type === 'error' 
              ? 'border border-destructive/30 bg-destructive/10 text-destructive' 
              : 'border border-green-500/30 bg-green-500/10 text-green-600'
          }`}
        >
          {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          {message.text}
        </motion.div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2">
              <FileJson className="h-4 w-4 text-primary" /> Detail Konfigurasi
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">ID Form</label>
                <input 
                  type="text" 
                  value={configId}
                  disabled
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Nama Form</label>
                <input 
                  type="text" 
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            </div>
            
            <div className="mt-6 rounded-lg bg-secondary/50 p-4 border border-border">
              <h4 className="text-xs font-medium text-foreground mb-2">Panduan JSON Form:</h4>
              <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
                <li>Harus berupa Array of Objects.</li>
                <li>Setiap object mewakili satu <strong>Step</strong>.</li>
                <li>Atribut: <code className="text-[10px] bg-background px-1 rounded">step</code>, <code className="text-[10px] bg-background px-1 rounded">title</code>, <code className="text-[10px] bg-background px-1 rounded">subtitle</code>, <code className="text-[10px] bg-background px-1 rounded">questions</code>.</li>
                <li>Question type yang didukung: <code className="text-[10px] bg-background px-1 rounded">radio-cards</code>, <code className="text-[10px] bg-background px-1 rounded">text</code>, <code className="text-[10px] bg-background px-1 rounded">email</code>, <code className="text-[10px] bg-background px-1 rounded">tel</code>, <code className="text-[10px] bg-background px-1 rounded">textarea</code>.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col min-h-[600px]">
            <div className="border-b border-border bg-secondary/30 px-6 py-3 flex items-center justify-between">
              <div className="flex bg-background border border-border rounded-lg p-1">
                <button
                  onClick={() => {
                    setActiveTab("visual");
                    try { setSchema(JSON.parse(schemaJson)); } catch(e) {}
                  }}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'visual' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <LayoutTemplate className="h-4 w-4" /> Visual Editor
                </button>
                <button
                  onClick={() => {
                    setActiveTab("json");
                    setSchemaJson(JSON.stringify(schema, null, 2));
                  }}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'json' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <FileJson className="h-4 w-4" /> Code (JSON)
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              {activeTab === "json" ? (
                <textarea
                  value={schemaJson}
                  onChange={(e) => setSchemaJson(e.target.value)}
                  className="h-full min-h-[600px] w-full resize-none bg-background p-6 text-sm font-mono text-foreground outline-none focus:ring-0"
                  spellCheck={false}
                />
              ) : (
                <div className="p-6 bg-background">
                  <VisualBuilder 
                    schema={schema} 
                    onChange={setSchema}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
