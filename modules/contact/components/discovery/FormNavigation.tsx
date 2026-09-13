"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  isLastStep: boolean;
}

const FormNavigation = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  isSubmitting,
  isLastStep,
}: FormNavigationProps) => {
  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      {/* Back button */}
      <motion.button
        id="discovery-form-prev-btn"
        type="button"
        onClick={onPrev}
        disabled={currentStep === 1}
        whileHover={currentStep > 1 ? { scale: 1.02 } : {}}
        whileTap={currentStep > 1 ? { scale: 0.97 } : {}}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Kembali ke langkah sebelumnya"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Kembali</span>
      </motion.button>

      {/* Step counter (mobile friendly) */}
      <span className="text-xs text-muted-foreground">
        {currentStep} / {totalSteps}
      </span>

      {/* Next / Submit button */}
      <motion.button
        id={isLastStep ? "discovery-form-submit-btn" : "discovery-form-next-btn"}
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        whileHover={!isSubmitting ? { scale: 1.03 } : {}}
        whileTap={!isSubmitting ? { scale: 0.96 } : {}}
        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={isLastStep ? "Kirim formulir" : "Lanjut ke langkah berikutnya"}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Mengirim...</span>
          </>
        ) : isLastStep ? (
          <>
            <Send className="h-4 w-4" />
            <span>Kirim Sekarang</span>
          </>
        ) : (
          <>
            <span>Selanjutnya</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </motion.button>
    </div>
  );
};

export default FormNavigation;
