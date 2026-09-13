"use client";

import { useCallback, useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

import type { FormAnswers, FormConfig, FormStep } from "@/common/types/discovery-form";
import { useFormConfig } from "@/hooks/useFormConfig";

import StepIndicator from "./StepIndicator";
import StepRenderer from "./StepRenderer";
import FormNavigation from "./FormNavigation";
import SuccessScreen from "./SuccessScreen";

// ── Env ─────────────────────────────────────────────────────────────────────
const INQUIRY_API = `${process.env.NEXT_PUBLIC_API_URL}/inquiry`;

// ── Validation ───────────────────────────────────────────────────────────────
/**
 * Menghasilkan zod schema secara dinamis berdasarkan pertanyaan yang required
 * pada step yang sedang aktif.
 */
function buildStepSchema(step: FormStep) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const q of step.questions) {
    if (!q.required) continue;

    let validator: z.ZodTypeAny = z.string().min(1, `${q.label} wajib diisi`);

    if (q.type === "email") {
      validator = z
        .string()
        .min(1, "Email wajib diisi")
        .email("Format email tidak valid");
    }
    shape[q.id] = validator;
  }
  return z.object(shape);
}

// ── Component ────────────────────────────────────────────────────────────────
interface DiscoveryFormProps {
  /**
   * Konfigurasi form dari API (Batch 2).
   * Jika tidak di-pass, fallback ke useFormConfig hook → MOCK_FORM_CONFIG.
   */
  config?: FormConfig;
}

const DiscoveryForm = ({ config: configProp }: DiscoveryFormProps) => {
  const { config: fetchedConfig, isLoading } = useFormConfig();
  const formConfig = configProp ?? fetchedConfig;

  // Loading skeleton
  if (isLoading || !formConfig) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
        <div className="p-6 md:p-8 space-y-6 animate-pulse">
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-9 rounded-full bg-muted" />
            ))}
          </div>
          <div className="border-t border-border" />
          <div className="space-y-4">
            <div className="mx-auto h-6 w-48 rounded-lg bg-muted" />
            <div className="mx-auto h-4 w-64 rounded-lg bg-muted" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-xl bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <DiscoveryFormContent formConfig={formConfig} />;
};

// ── Inner component — receives resolved config ────────────────────────────
// Separasi ini penting: hooks (useState, useCallback) harus dipanggil
// di komponen ini, bukan di DiscoveryForm, untuk menghindari kondisi
// hooks setelah conditional return.
const DiscoveryFormContent = ({ formConfig }: { formConfig: NonNullable<ReturnType<typeof useFormConfig>['config']> }) => {
  const steps = formConfig.schema;
  const totalSteps = steps.length;

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const activeStep = steps[currentStep - 1];
  const isLastStep = currentStep === totalSteps;
  const stepTitles = steps.map((s) => s.title);


  // ── Answer handler ─────────────────────────────────────────────────────────
  const handleAnswer = useCallback((questionId: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Clear error on change
    setErrors((prev) => {
      if (!prev[questionId]) return prev;
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }, []);

  // ── Validate current step ──────────────────────────────────────────────────
  const validateCurrentStep = (): boolean => {
    const schema = buildStepSchema(activeStep);
    const result = schema.safeParse(answers);
    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as string;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  };

  // ── Navigation ─────────────────────────────────────────────────────────────
  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (isLastStep) {
      await handleSubmit();
    } else {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep === 1) return;
    setErrors({});
    setDirection(-1);
    setCurrentStep((s) => s - 1);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(INQUIRY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: formConfig.id,
          answers,
        }),
      });

      if (!response.ok) throw new Error("Submission failed");
      setIsSuccess(true);
    } catch (err) {
      console.error("[DiscoveryForm] submit error:", err);
      setErrors({ _global: "Terjadi kesalahan saat mengirim. Silakan coba lagi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setAnswers({});
    setErrors({});
    setCurrentStep(1);
    setDirection(1);
    setIsSuccess(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div id="discovery-form" className="w-full">
      {/* Card container */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Header gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SuccessScreen
                  name={answers["name"] as string | undefined}
                  onReset={handleReset}
                />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Step indicator */}
                <StepIndicator
                  totalSteps={totalSteps}
                  currentStep={currentStep}
                  stepTitles={stepTitles}
                />

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Step content */}
                <StepRenderer
                  step={activeStep}
                  answers={answers}
                  onAnswer={handleAnswer}
                  errors={errors}
                  direction={direction}
                />

                {/* Global error */}
                <AnimatePresence>
                  {errors._global && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
                    >
                      {errors._global}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <FormNavigation
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  isSubmitting={isSubmitting}
                  isLastStep={isLastStep}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Privacy note */}
      <p className="mt-3 text-center text-xs text-muted-foreground">
        🔒 Informasi Anda aman dan tidak akan dibagikan kepada pihak ketiga.
      </p>
    </div>
  );
};

export default DiscoveryForm;
