"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
  /** Title dari setiap step (opsional, untuk tooltip/label) */
  stepTitles?: string[];
}

const StepIndicator = ({ totalSteps, currentStep, stepTitles }: StepIndicatorProps) => {
  return (
    <div className="flex w-full items-center justify-center gap-0" aria-label="Form progress">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={stepNumber} className="flex items-center">
            {/* Step circle */}
            <div className="relative flex flex-col items-center">
              <motion.div
                aria-label={`Step ${stepNumber}${stepTitles?.[index] ? `: ${stepTitles[index]}` : ""}`}
                aria-current={isActive ? "step" : undefined}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-300"
                animate={{
                  borderColor: isCompleted
                    ? "hsl(var(--primary))"
                    : isActive
                      ? "hsl(var(--primary))"
                      : "hsl(var(--border))",
                  backgroundColor: isCompleted
                    ? "hsl(var(--primary))"
                    : isActive
                      ? "hsl(var(--primary) / 0.15)"
                      : "transparent",
                  color: isCompleted
                    ? "hsl(var(--primary-foreground))"
                    : isActive
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted-foreground))",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isCompleted ? (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </motion.span>
                ) : (
                  <span>{stepNumber}</span>
                )}

                {/* Active pulse ring */}
                {isActive && (
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-primary/40"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </motion.div>

              {/* Step label below (opsional) */}
              {stepTitles?.[index] && (
                <span
                  className={`mt-1.5 hidden max-w-[70px] text-center text-[10px] leading-tight md:block ${
                    isActive
                      ? "font-medium text-foreground"
                      : isCompleted
                        ? "text-primary/80"
                        : "text-muted-foreground"
                  }`}
                >
                  {stepTitles[index]}
                </span>
              )}
            </div>

            {/* Connector line between steps */}
            {index < totalSteps - 1 && (
              <div className="relative mx-1 h-0.5 w-8 overflow-hidden rounded-full bg-border md:w-12">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
