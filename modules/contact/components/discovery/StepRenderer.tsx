"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { FormStep } from "@/common/types/discovery-form";
import QuestionRenderer from "./QuestionRenderer";

interface StepRendererProps {
  step: FormStep;
  answers: Record<string, string | number>;
  onAnswer: (questionId: string, value: string | number) => void;
  errors: Record<string, string>;
  direction: 1 | -1; // 1 = maju, -1 = mundur
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

const StepRenderer = ({ step, answers, onAnswer, errors, direction }: StepRendererProps) => {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={step.step}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        className="space-y-6"
      >
        {/* Step header */}
        <div className="space-y-1.5 text-center">
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-xl font-semibold text-foreground md:text-2xl"
          >
            {step.title}
          </motion.h3>
          {step.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              {step.subtitle}
            </motion.p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {step.questions.map((question, idx) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.08, duration: 0.3 }}
              className="space-y-2"
            >
              {/* Question label */}
              {question.type !== "radio-cards" && question.type !== "radio" && (
                <label
                  htmlFor={`question-${question.id}`}
                  className="block text-sm font-medium text-foreground"
                >
                  {question.label}
                  {question.required && (
                    <span className="ml-1 text-destructive" aria-hidden="true">
                      *
                    </span>
                  )}
                </label>
              )}

              {/* Question input */}
              <QuestionRenderer
                question={question}
                value={answers[question.id]}
                onChange={onAnswer}
                error={errors[question.id]}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StepRenderer;
