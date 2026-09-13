"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { FormAnswers, FormQuestion } from "@/common/types/discovery-form";

interface QuestionRendererProps {
  question: FormQuestion;
  value: string | number | undefined;
  onChange: (questionId: string, value: string | number) => void;
  error?: string;
}

// ── Radio Cards (tipe pilihan utama, tampilan kotak-kotak) ─────────────────
const RadioCards = ({ question, value, onChange }: QuestionRendererProps) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {question.options?.map((option) => {
      const isSelected = value === option.value;
      return (
        <motion.button
          key={option.value}
          id={`question-${question.id}-option-${option.value}`}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange(question.id, option.value)}
          className={`relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors duration-200 ${
            isSelected
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border bg-card hover:border-primary/40 hover:bg-secondary"
          }`}
        >
          {/* Selection indicator */}
          <div
            className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
              isSelected ? "border-primary bg-primary" : "border-muted-foreground/50"
            }`}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-1.5 w-1.5 rounded-full bg-primary-foreground"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {option.icon && <span className="text-xl leading-none">{option.icon}</span>}
              <span className="font-semibold text-sm text-foreground">{option.label}</span>
            </div>
            {option.description && (
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {option.description}
              </p>
            )}
          </div>

          {/* Selected glow */}
          {isSelected && (
            <motion.div
              layoutId={`selected-glow-${question.id}`}
              className="absolute inset-0 rounded-xl ring-2 ring-primary/30"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      );
    })}
  </div>
);

// ── Text / Email / Tel Input ───────────────────────────────────────────────
const TextInput = ({ question, value, onChange, error }: QuestionRendererProps) => (
  <div className="space-y-1.5">
    <input
      id={`question-${question.id}`}
      type={question.type as "text" | "email" | "tel"}
      placeholder={question.placeholder}
      value={(value as string) ?? ""}
      onChange={(e) => onChange(question.id, e.target.value)}
      className={`w-full rounded-lg border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
        error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-border"
      }`}
    />
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-xs text-destructive"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// ── Textarea ───────────────────────────────────────────────────────────────
const TextareaInput = ({ question, value, onChange, error }: QuestionRendererProps) => (
  <div className="space-y-1.5">
    <textarea
      id={`question-${question.id}`}
      rows={4}
      placeholder={question.placeholder}
      value={(value as string) ?? ""}
      onChange={(e) => onChange(question.id, e.target.value)}
      className={`w-full resize-none rounded-lg border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
        error ? "border-destructive" : "border-border"
      }`}
    />
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-xs text-destructive"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// ── Slider ─────────────────────────────────────────────────────────────────
const SliderInput = ({ question, value, onChange }: QuestionRendererProps) => {
  const min = question.min ?? 0;
  const max = question.max ?? 100;
  const step = question.step ?? 1;
  const numVal = (value as number) ?? min;
  const percentage = ((numVal - min) / (max - min)) * 100;

  const formatValue = (v: number) =>
    question.valueFormat ? question.valueFormat.replace("{value}", v.toLocaleString("id-ID")) : v.toString();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{formatValue(min)}</span>
        <motion.span
          key={numVal}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary"
        >
          {formatValue(numVal)}
        </motion.span>
        <span className="text-sm text-muted-foreground">{formatValue(max)}</span>
      </div>
      <div className="relative h-2 rounded-full bg-border">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
        <input
          id={`question-${question.id}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={numVal}
          onChange={(e) => onChange(question.id, Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <motion.div
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-primary bg-background shadow-sm"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    </div>
  );
};

// ── Select Input ─────────────────────────────────────────────────────────────
const SelectInput = ({ question, value, onChange }: QuestionRendererProps) => {
  return (
    <div className="relative">
      <select
        id={`question-${question.id}`}
        value={(value as string) || ""}
        onChange={(e) => onChange(question.id, e.target.value)}
        className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3.5 text-base text-foreground shadow-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="" disabled>
          {question.placeholder || "Select an option..."}
        </option>
        {question.options?.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  );
};

// ── Main Renderer ──────────────────────────────────────────────────────────
const QuestionRenderer = (props: QuestionRendererProps) => {
  switch (props.question.type) {
    case "radio-cards":
    case "radio":
      return <RadioCards {...props} />;
    case "textarea":
      return <TextareaInput {...props} />;
    case "slider":
      return <SliderInput {...props} />;
    case "select":
      return <SelectInput {...props} />;
    case "text":
    case "email":
    case "tel":
    default:
      return <TextInput {...props} />;
  }
};

export default QuestionRenderer;
